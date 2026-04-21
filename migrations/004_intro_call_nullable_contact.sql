-- Per-field autosave writes partial rows with any subset of fields filled.
-- A first save might only carry {email, name}, or {email, company}, etc.
-- Relax name/company/title to nullable so the upsert inserts don't fail.
-- Complete-stage rows are still required to have all three via API validation.
alter table public.intro_call_requests alter column name drop not null;
alter table public.intro_call_requests alter column company drop not null;
alter table public.intro_call_requests alter column title drop not null;
