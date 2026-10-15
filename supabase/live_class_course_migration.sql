-- Run on production 2026-10-15, together with course_purchases_migration.sql
-- (course_purchases had never been run before this -- its table did not
-- exist in the database yet, so Faye ran both in the same session).

alter table live_class_sessions
  add column if not exists course_id text not null default 'sketch-a';
create index if not exists live_class_sessions_course_idx
  on live_class_sessions (course_id, class_number);
create unique index if not exists course_purchases_code_course_uniq
  on course_purchases (student_code, course_id)
  where student_code is not null;
