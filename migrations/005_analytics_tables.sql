-- Analytics foundation: web_vitals for speed insights, errors for /api/* catch logging.
-- Plus four aggregation functions used by /api/admin-stats.

create table if not exists public.web_vitals (
    id            uuid primary key default gen_random_uuid(),
    created_at    timestamptz not null default now(),
    visitor_id    text,
    page_path     text not null,
    metric_name   text not null,
    metric_value  numeric not null,
    metric_id     text,
    rating        text,
    device        text,
    connection    text,
    user_agent    text
);
create index if not exists idx_web_vitals_page_metric on public.web_vitals (page_path, metric_name, created_at desc);
create index if not exists idx_web_vitals_created on public.web_vitals (created_at desc);

create table if not exists public.errors (
    id            uuid primary key default gen_random_uuid(),
    created_at    timestamptz not null default now(),
    endpoint      text not null,
    status_code   integer,
    message       text,
    stack         text,
    user_agent    text,
    ip            text
);
create index if not exists idx_errors_created on public.errors (created_at desc);
create index if not exists idx_errors_endpoint on public.errors (endpoint, created_at desc);

create or replace function public.admin_visitors_daily(days int default 30)
returns table (day date, unique_visitors bigint) language sql stable as $$
    select date_trunc('day', viewed_at)::date as day,
           count(distinct visitor_id) as unique_visitors
    from public.page_views
    where viewed_at >= now() - (days || ' days')::interval
    group by 1 order by 1 desc;
$$;

create or replace function public.admin_top_pages(days int default 30)
returns table (page_path text, views bigint) language sql stable as $$
    select page_path, count(*) as views
    from public.page_views
    where viewed_at >= now() - (days || ' days')::interval
    group by 1 order by 2 desc limit 20;
$$;

create or replace function public.admin_top_ctas(days int default 30)
returns table (cta_context text, clicks bigint) language sql stable as $$
    select cta_context, count(*) as clicks
    from public.cta_clicks
    where clicked_at >= now() - (days || ' days')::interval
    group by 1 order by 2 desc limit 30;
$$;

create or replace function public.admin_vitals_p75(days int default 30)
returns table (page_path text, metric_name text, p75 numeric) language sql stable as $$
    select page_path, metric_name,
           percentile_cont(0.75) within group (order by metric_value)::numeric as p75
    from public.web_vitals
    where created_at >= now() - (days || ' days')::interval
    group by 1, 2 order by 1, 2;
$$;
