-- Run in Supabase Dashboard > SQL Editor. Safe to re-run after this table exists.
create table if not exists public.wedding_guestbook (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(trim(name)) between 1 and 80),
    side text not null check (side in ('Nhà Trai', 'Nhà Gái', 'Cả Hai')),
    status text check (status in ('Sẽ tham dự', 'Bận việc tiếc quá')),
    wish text,
    invite_key text check (invite_key is null or char_length(trim(invite_key)) between 1 and 120),
    invite_name text check (invite_name is null or char_length(trim(invite_name)) between 1 and 120),
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
alter table public.wedding_guestbook add column if not exists invite_name text;

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

revoke all on table public.wedding_guestbook from public, anon, authenticated;
revoke select (id, name, side, status, wish, is_visible, created_at, telegram_notified_at, invite_key, invite_name)
    on table public.wedding_guestbook from public, anon, authenticated;
revoke insert (name, side, status, wish, invite_key, invite_name)
    on table public.wedding_guestbook from public, anon, authenticated;
grant select (id, name, side, wish, created_at, is_visible) on table public.wedding_guestbook to anon, authenticated;
grant select, insert, update, delete on table public.wedding_guestbook to service_role;

drop policy if exists "Anyone can read visible wedding wishes" on public.wedding_guestbook;
create policy "Anyone can read visible wedding wishes"
    on public.wedding_guestbook
    for select
    to anon, authenticated
    using (is_visible = true and wish is not null);

drop policy if exists "Guests can submit wedding wishes" on public.wedding_guestbook;

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
grant select, delete on table public.wedding_album_unlocks to service_role;

create table if not exists public.wedding_invitations (
    id uuid primary key default gen_random_uuid(),
    invite_key text not null unique check (char_length(trim(invite_key)) between 1 and 120),
    code_hash text not null unique check (code_hash ~ '^[a-f0-9]{64}$'),
    display_name text not null check (char_length(trim(display_name)) between 1 and 120),
    side text not null check (side in ('Nhà Trai', 'Nhà Gái')),
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);
alter table public.wedding_invitations enable row level security;
revoke all on table public.wedding_invitations from public, anon, authenticated;
grant all on table public.wedding_invitations to service_role;

create or replace function public.mark_wedding_album_unlocked()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if new.invite_key is not null
       and char_length(trim(new.invite_key)) between 1 and 120
       and new.is_visible = true
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

create or replace function public.save_wedding_rsvp(
    p_invite_key text,
    p_name text,
    p_invite_name text,
    p_side text,
    p_status text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
    saved_row public.wedding_guestbook%rowtype;
begin
    if p_invite_key is null or char_length(trim(p_invite_key)) not between 1 and 120 then
        raise exception 'Invalid invitation key';
    end if;
    if p_name is null or char_length(trim(p_name)) not between 1 and 80 then
        raise exception 'Invalid guest name';
    end if;
    if p_invite_name is not null and char_length(trim(p_invite_name)) not between 1 and 120 then
        raise exception 'Invalid invitation name';
    end if;
    if p_side is null or p_side not in ('Nhà Trai', 'Nhà Gái', 'Cả Hai') then
        raise exception 'Invalid guest side';
    end if;
    if p_status is null or p_status not in ('Sẽ tham dự', 'Bận việc tiếc quá') then
        raise exception 'Invalid RSVP status';
    end if;

    perform pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(trim(p_invite_key), 0)
    );

    update public.wedding_guestbook as entry
    set name = trim(p_name),
        invite_name = coalesce(nullif(trim(p_invite_name), ''), entry.invite_name),
        side = p_side,
        status = p_status,
        created_at = pg_catalog.now(),
        is_visible = true
    where entry.id = (
        select previous.id
        from public.wedding_guestbook as previous
        where previous.invite_key = trim(p_invite_key)
          and previous.status is not null
          and previous.wish is null
        order by previous.created_at desc
        limit 1
    )
    returning entry.* into saved_row;

    if not found then
        insert into public.wedding_guestbook (name, invite_name, side, status, wish, invite_key)
        values (trim(p_name), nullif(trim(p_invite_name), ''), p_side, p_status, null, trim(p_invite_key))
        returning * into saved_row;
    end if;

    return pg_catalog.to_jsonb(saved_row);
end;
$$;

revoke all on function public.save_wedding_rsvp(text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.save_wedding_rsvp(text, text, text, text, text) to service_role;

notify pgrst, 'reload schema';
