-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
--
-- WHY THIS MIGRATION EXISTS
-- student_progress (see core/progress.js, window.FEIProgress) already
-- persists in-lesson step position (current_step_idx) durably, keyed by
-- student_code — but ONLY for legacy access-code students (LILY-01,
-- TRYNEW, etc). Real Supabase-Auth accounts (email/Google sign-in) always
-- have studentCode = null (see index.html's onAuthSuccess()), so their
-- step position has never been written here at all — it lived only in
-- fei_user_profile, which is sessionStorage (deliberately, per the
-- Safari-iframe fix — see core/ink-animal-access.js's comment on it) and
-- is wiped whenever the browser is fully closed. That's the confirmed
-- root cause of "lesson restarts from step 1 after closing the browser."
--
-- This migration ADDS a user_id column so the SAME table + the SAME
-- current_step_idx/current_lesson/total_xp/completed_lessons columns can
-- also carry progress for real accounts, keyed by auth.users(id) instead
-- of student_code. Nothing existing is renamed or removed — additive
-- only, per Faye's explicit instruction. See core/progress.js for the
-- new loadByUserId/saveFromProfile logic that uses this column.
--
-- One row per (identity), same as before — a student_code row and a
-- user_id row are two different rows; a student never has both at once
-- in practice (onAuthSuccess always sets studentCode: null for real
-- accounts, and the legacy welcome flow never creates a Supabase Auth
-- user), so there's no dual-write ambiguity to resolve here.

alter table student_progress
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Partial unique index (not a plain unique constraint) because most
-- existing rows have user_id = null (legacy student_code rows) — a
-- normal unique constraint would only allow ONE null-user_id row total.
-- This is also what FEIProgress's upsert (Prefer: resolution=merge-
-- duplicates) needs to target via on_conflict=user_id for real accounts.
create unique index if not exists student_progress_user_id_idx
  on student_progress (user_id)
  where user_id is not null;

-- No new RLS policies needed: student_progress already has permissive
-- anon read/insert/update policies (the existing student_code flow
-- already upserts and reads through the anon key today — verified live,
-- see core/progress.js header). Those policies are not column-specific,
-- so they already cover the new user_id column too, consistent with
-- this codebase's existing, demonstrated security model (client-side
-- gates are not the real security boundary here — see core/access.js
-- and course_purchases_migration.sql for the same reasoning).
