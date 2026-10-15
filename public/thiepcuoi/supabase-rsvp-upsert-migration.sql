-- Run once in Supabase SQL Editor to store one editable RSVP per invitation link.
alter table public.wedding_guestbook add column if not exists invite_name text;

do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'wedding_guestbook_invite_name_check'
          and conrelid = 'public.wedding_guestbook'::regclass
    ) then
        alter table public.wedding_guestbook
            add constraint wedding_guestbook_invite_name_check
            check (invite_name is null or char_length(trim(invite_name)) between 1 and 120);
    end if;
end $$;

grant select, insert, update on table public.wedding_guestbook to service_role;

update public.wedding_guestbook
set invite_name = initcap(replace(substring(invite_key from position(':' in invite_key) + 1), '-', ' '))
where invite_name is null
  and invite_key is not null
  and position(':' in invite_key) > 0;

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
