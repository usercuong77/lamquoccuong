-- Run in Supabase Dashboard > SQL Editor. Safe to re-run after this table exists.
create table if not exists public.wedding_guestbook (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(trim(name)) between 1 and 80),
    side text not null check (side in ('Nhà Trai', 'Nhà Gái', 'Cả Hai')),
    status text check (status in ('Sẽ tham dự', 'Bận việc tiếc quá')),
    wish text,
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

alter table public.wedding_guestbook enable row level security;

revoke all on table public.wedding_guestbook from anon, authenticated;
grant select on table public.wedding_guestbook to anon, authenticated;
grant insert (name, side, status, wish) on table public.wedding_guestbook to anon, authenticated;

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
