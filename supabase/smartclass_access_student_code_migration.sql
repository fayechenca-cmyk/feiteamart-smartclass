-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New
-- query), in the ORDER laid out below — do not skip straight to
-- STEP 2 without reading its warning first.
--
-- WHY THIS MIGRATION EXISTS
-- smartclass_access (see core/access.js) has always been keyed by
-- user_id (Supabase-registered students only). Legacy / access-code
-- students (studentCode-based login, no auth.users row) have never
-- had a row here at all — core/access.js's recordLessonOpened() is an
-- explicit no-op for them, and getStatus() hardcodes
-- openedCreationLessons: [] for every legacy login, regardless of how
-- many Creation lessons they have actually opened.
--
-- This matters now because the new Creation 3-lesson cap (Oct 2026)
-- is meant to apply to access-code students too (the 4 existing
-- legacy codes, plus Coraline-12 / Alicia-11) — "new and old users
-- treated the same." Without this column there is nowhere to persist
-- their opened-lesson count.
--
-- Same dual-key shape already proven in course_purchases
-- (see supabase/course_purchases_migration.sql): a row can be keyed
-- by EITHER user_id (Supabase account) OR student_code (legacy /
-- access-code login), never both.


-- ═════════════════════════════════════════════════════════════════
-- STEP 0 — run this FIRST, just to look, changes nothing.
-- Tells us whether user_id is actually declared PRIMARY KEY (in which
-- case STEP 2 below needs a different, more careful approach than a
-- plain DROP NOT NULL) or just a NOT NULL + unique column.
-- ═════════════════════════════════════════════════════════════════
select
  tc.constraint_type,
  kcu.column_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
where tc.table_name = 'smartclass_access'
  and kcu.column_name = 'user_id';

-- If this returns a row with constraint_type = 'PRIMARY KEY': STOP
-- here and send Terminal the result before running STEP 2 — that
-- needs a real primary-key replacement (e.g. adding a surrogate id
-- column), not a simple DROP NOT NULL, and should be its own
-- carefully-reviewed step rather than guessed at.
--
-- If it returns nothing, or a row with a different constraint_type
-- (e.g. 'UNIQUE'): STEP 2 as written below is safe to run.


-- ═════════════════════════════════════════════════════════════════
-- STEP 1 — safe regardless of what STEP 0 showed. Pure addition:
-- new nullable column + two indexes. Every existing row is
-- untouched; student_code simply stays NULL for all of them (correct
-- — they are Supabase users, not legacy students). No application
-- code reads this column yet, so this alone has zero runtime effect.
-- ═════════════════════════════════════════════════════════════════
alter table smartclass_access
  add column if not exists student_code text;

create index if not exists smartclass_access_student_code_idx
  on smartclass_access (student_code);

-- One row per legacy student. Partial index (WHERE student_code IS
-- NOT NULL) so it does not conflict with existing rows that have it
-- NULL — mirrors course_purchases' UNIQUE (user_id, course_id),
-- adapted since this table is one row per user total, not per course.
create unique index if not exists smartclass_access_student_code_unique
  on smartclass_access (student_code)
  where student_code is not null;


-- ═════════════════════════════════════════════════════════════════
-- STEP 2 — ONLY run this if STEP 0 did NOT show user_id as PRIMARY
-- KEY. A legacy-student row needs user_id to be NULL (it has no
-- auth.users row), so the NOT NULL constraint has to go.
-- ═════════════════════════════════════════════════════════════════
alter table smartclass_access
  alter column user_id drop not null;


-- ─────────────────────────────────────────────────────────────────
-- VERIFICATION — run after STEP 1 (and STEP 2, if applicable)
-- ─────────────────────────────────────────────────────────────────
-- Confirm the column exists, is nullable, and no existing row was
-- touched (row count should match what you had before, every
-- existing row should show student_code as null):
--
--   select column_name, is_nullable, data_type
--   from information_schema.columns
--   where table_name = 'smartclass_access' and column_name = 'student_code';
--
--   select count(*) as total_rows,
--          count(*) filter (where student_code is not null) as rows_with_code
--   from smartclass_access;
--   -- expect rows_with_code = 0 right after this migration
