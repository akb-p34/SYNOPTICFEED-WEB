-- Add lifecycle stage to intro_call_requests.
-- 'partial' = user completed Step 1 only, 'complete' = full submission.
alter table public.intro_call_requests
    add column if not exists stage text not null default 'partial';

-- Backfill existing rows as 'complete' (they all came from full submits).
update public.intro_call_requests set stage = 'complete' where stage = 'partial';

-- Index for filtering partials in the dashboard.
create index if not exists idx_intro_call_requests_stage on public.intro_call_requests (stage);
