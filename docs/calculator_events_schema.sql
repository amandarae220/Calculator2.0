-- ─────────────────────────────────────────────────────────────────────────────
-- Calculator2.0 — analytics event schema
--
-- Run this in the Supabase SQL editor for the same project used by
-- amanda-repository. The anon key is reused; RLS policies below ensure that:
--   • anonymous clients can INSERT events only (no read, no update, no delete)
--   • authenticated users (admin login) can SELECT all events
--
-- Apply once, then visit /admin to log in.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists calculator_events (
  id               uuid        primary key default gen_random_uuid(),
  visitor_id       text        not null,
  event_type       text        not null,
  page             text,
  label            text,
  payload          jsonb,
  referrer         text,
  device           text,
  browser          text,
  duration_seconds integer,
  created_at       timestamptz not null default now()
);

create index if not exists calculator_events_created_at_idx
  on calculator_events (created_at desc);

create index if not exists calculator_events_event_type_idx
  on calculator_events (event_type);

alter table calculator_events enable row level security;

-- Anonymous tracking: any client can insert, but only an insert
create policy "anon can insert events"
  on calculator_events for insert
  to anon
  with check (true);

-- Admin reading: only authenticated users can select
create policy "authenticated can read events"
  on calculator_events for select
  to authenticated
  using (true);

-- (No update or delete policies = those operations are denied to all clients.)
