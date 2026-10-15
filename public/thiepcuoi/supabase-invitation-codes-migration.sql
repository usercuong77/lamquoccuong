-- Run after supabase-guestbook-setup.sql and supabase-rsvp-upsert-migration.sql.
-- Invitation codes are issued and checked only by the Next.js server API.
create table if not exists public.wedding_invitations (
    id uuid primary key default gen_random_uuid(),
    invite_key text not null unique check (char_length(trim(invite_key)) between 1 and 120),
    code_hash text not null unique check (code_hash ~ '^[a-f0-9]{64}$'),
    display_name text not null check (char_length(trim(display_name)) between 1 and 120),
    side text not null check (side in ('Nhà Trai', 'Nhà Gái')),
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

alter table public.wedding_invitations add column if not exists code_ciphertext text;
alter table public.wedding_invitations add column if not exists base_url text;
alter table public.wedding_invitations add column if not exists link_format text;
alter table public.wedding_invitations add column if not exists to_value text;

alter table public.wedding_invitations enable row level security;
revoke all on table public.wedding_invitations from public, anon, authenticated;
grant all on table public.wedding_invitations to service_role;

grant select, delete on table public.wedding_album_unlocks to service_role;

-- Do not allow browser clients to bypass code validation by calling PostgREST directly.
revoke select on table public.wedding_guestbook from public, anon, authenticated;
revoke select (id, name, side, status, wish, is_visible, created_at, telegram_notified_at, invite_key, invite_name)
    on table public.wedding_guestbook from public, anon, authenticated;
grant select (id, name, side, wish, created_at, is_visible) on table public.wedding_guestbook to anon, authenticated;
grant select on table public.wedding_guestbook to service_role;
drop policy if exists "Anyone can read visible wedding wishes" on public.wedding_guestbook;
create policy "Anyone can read visible wedding wishes"
    on public.wedding_guestbook
    for select
    to anon, authenticated
    using (is_visible = true and wish is not null);

revoke insert on table public.wedding_guestbook from public, anon, authenticated;
revoke insert (name, side, status, wish, invite_key, invite_name)
    on table public.wedding_guestbook from public, anon, authenticated;
grant select, insert, update, delete on table public.wedding_guestbook to service_role;
drop policy if exists "Guests can submit wedding wishes" on public.wedding_guestbook;

-- Only published wishes tied to an official invitation may unlock that invitation's album.
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

-- Revoke every old overload so no legacy public RPC remains as a write bypass.
do $$
declare
    routine record;
begin
    for routine in
        select p.oid::regprocedure as signature
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public'
          and p.proname = 'save_wedding_rsvp'
    loop
        execute format('revoke all on function %s from public, anon, authenticated', routine.signature);
    end loop;
end $$;

grant execute on function public.save_wedding_rsvp(text, text, text, text, text) to service_role;

notify pgrst, 'reload schema';
