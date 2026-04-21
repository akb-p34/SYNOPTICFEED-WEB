-- Run this in Supabase SQL Editor before deploying the /call funnel.
-- The API handler is fail-soft: if this table doesn't exist, the submit still
-- redirects to Calendly and emails Akbar — we just lose the structured record.

create table if not exists public.intro_call_requests (
    id             uuid primary key default gen_random_uuid(),
    email          text not null unique,
    name           text not null,
    company        text not null,
    title          text not null,
    isos           text[] not null default '{}',
    trade_types    text[] not null default '{}',
    weather_stack  text[] not null default '{}',
    linkedin       text,
    eoi            boolean not null default false,
    visitor_id     text,
    utm_source     text,
    utm_medium     text,
    utm_campaign   text,
    user_agent     text,
    source         text default 'call-page',
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);

create index if not exists intro_call_requests_created_at_idx
    on public.intro_call_requests (created_at desc);

create index if not exists intro_call_requests_visitor_id_idx
    on public.intro_call_requests (visitor_id);

-- Keep updated_at fresh on upsert (email conflict = update existing row).
create or replace function public.touch_intro_call_requests_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists intro_call_requests_touch_updated_at on public.intro_call_requests;
create trigger intro_call_requests_touch_updated_at
    before update on public.intro_call_requests
    for each row execute function public.touch_intro_call_requests_updated_at();
