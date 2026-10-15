-- Run in Supabase Dashboard > SQL Editor. Safe to re-run after this table exists.
create table if not exists public.wedding_guestbook (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(trim(name)) between 1 and 80),
    side text not null check (side in ('Nhà Trai', 'Nhà Gái', 'Cả Hai')),
    status text check (status in ('Sẽ tham dự', 'Bận việc tiếc quá')),
    wish text,
    invite_key text check (invite_key is null or char_length(trim(invite_key)) between 1 and 120),
    is_visible boolean not null default true,
    created_at timestamptz not null default now(),
    telegram_notified_at timestamptz,
    constraint wedding_guestbook_wish_check check (
        wish is null or char_length(trim(wish)) between 1 and 1000
    )
);

-- Migrate projects where the earlier setup made a wish mandatory.
alter table public.wedding_guestbook alter column wish drop not null;
-- A guestbook wish is not an RSVP, so its status must be allowed to stay empty.
alter table public.wedding_guestbook alter column status drop not null;
alter table public.wedding_guestbook drop constraint if exists wedding_guestbook_wish_check;
alter table public.wedding_guestbook add constraint wedding_guestbook_wish_check check (
    wish is null or char_length(trim(wish)) between 1 and 1000
);
alter table public.wedding_guestbook add column if not exists telegram_notified_at timestamptz;
alter table public.wedding_guestbook add column if not exists invite_key text;

do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'wedding_guestbook_invite_key_check'
          and conrelid = 'public.wedding_guestbook'::regclass
    ) then
        alter table public.wedding_guestbook
            add constraint wedding_guestbook_invite_key_check
            check (invite_key is null or char_length(trim(invite_key)) between 1 and 120);
    end if;
end $$;

alter table public.wedding_guestbook enable row level security;

revoke all on table public.wedding_guestbook from anon, authenticated;
grant select on table public.wedding_guestbook to anon, authenticated;
grant insert (name, side, status, wish, invite_key) on table public.wedding_guestbook to anon, authenticated;

drop policy if exists "Anyone can read visible wedding wishes" on public.wedding_guestbook;
create policy "Anyone can read visible wedding wishes"
    on public.wedding_guestbook
    for select
    to anon, authenticated
    using (is_visible = true);

drop policy if exists "Guests can submit wedding wishes" on public.wedding_guestbook;
create policy "Guests can submit wedding wishes"
    on public.wedding_guestbook
    for insert
    to anon, authenticated
    with check (is_visible = true);

create index if not exists wedding_guestbook_visible_created_at_idx
    on public.wedding_guestbook (created_at desc)
    where is_visible = true;

-- Store album access separately so hiding/deleting a wish does not relock an invitation.
create table if not exists public.wedding_album_unlocks (
    invite_key text primary key check (char_length(trim(invite_key)) between 1 and 120),
    unlocked_at timestamptz not null default now()
);

alter table public.wedding_album_unlocks enable row level security;
revoke all on table public.wedding_album_unlocks from public, anon, authenticated;

create or replace function public.mark_wedding_album_unlocked()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if new.invite_key is not null
       and char_length(trim(new.invite_key)) between 1 and 120
       and new.wish is not null
       and char_length(trim(new.wish)) > 0 then
        insert into public.wedding_album_unlocks (invite_key)
        values (new.invite_key)
        on conflict (invite_key) do nothing;
    end if;
    return new;
end;
$$;

revoke all on function public.mark_wedding_album_unlocked() from public, anon, authenticated;

drop trigger if exists wedding_guestbook_unlock_album on public.wedding_guestbook;
create trigger wedding_guestbook_unlock_album
    after insert on public.wedding_guestbook
    for each row execute function public.mark_wedding_album_unlocked();

create or replace function public.is_wedding_album_unlocked(p_invite_key text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1 from public.wedding_album_unlocks
        where invite_key = p_invite_key
    );
$$;

revoke all on function public.is_wedding_album_unlocked(text) from public, anon, authenticated;
grant execute on function public.is_wedding_album_unlocked(text) to anon, authenticated;

notify pgrst, 'reload schema';
