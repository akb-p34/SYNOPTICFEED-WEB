-- Add phone column to intro_call_requests.
-- Nullable so existing rows stay valid. No backfill (historical leads don't have phones captured).
alter table public.intro_call_requests
    add column if not exists phone text;
