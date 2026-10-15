-- Run once in Supabase Dashboard > SQL Editor to enable per-invitation album access.
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

revoke all on table public.wedding_guestbook from anon, authenticated;
grant select on table public.wedding_guestbook to anon, authenticated;
grant insert (name, side, status, wish, invite_key)
    on table public.wedding_guestbook to anon, authenticated;

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
