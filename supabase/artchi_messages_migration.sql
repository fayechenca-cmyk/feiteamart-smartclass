-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Creates the table Artchi's Edge Function uses to rate-limit chat messages.

create table if not exists artchi_messages (
  id uuid primary key default gen_random_uuid(),
  student_email text not null,
  lesson_context text,
  created_at timestamptz not null default now()
);

create index if not exists artchi_messages_email_time_idx
  on artchi_messages (student_email, created_at);

-- Lock this table down from direct client access. Only the Edge Function
-- (using the service role key, which bypasses RLS) can read or write it —
-- students' browsers never touch this table directly.
alter table artchi_messages enable row level security;
