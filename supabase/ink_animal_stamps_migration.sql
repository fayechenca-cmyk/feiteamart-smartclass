-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
--
-- Ink Animal Studio's per-lesson completion + stamp record. Kept as its
-- own table rather than extending student_submissions, since that table
-- is shared by every Skills lesson and has no room for course-specific
-- fields (chineseCharacter, stampNumber, artworkTitle, completedDate)
-- without polluting a schema every other course also writes to — same
-- precedent as teacher_feedback and live_class_sessions each getting
-- their own table instead of overloading a shared one.
--
-- The uploaded artwork FILE itself reuses the existing student-artwork
-- storage bucket (path prefix ink-animal/<code-or-uid>/<timestamp>.jpg),
-- not a new bucket — this table just stores the resulting URLs + metadata.

create table if not exists ink_animal_stamps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  student_code text,               -- for legacy access-code students
  lesson_id text not null,         -- e.g. 'rabbit-01'
  artwork_image text,              -- URL into student-artwork bucket (unaltered upload)
  stamp_image text,                -- URL of the framed/stamped version, if generated server-side
  artwork_title text,
  completed boolean not null default false,
  completed_date timestamptz,
  stamp_number int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ink_animal_stamps_user_idx on ink_animal_stamps (user_id);
create index if not exists ink_animal_stamps_code_idx on ink_animal_stamps (student_code);
create index if not exists ink_animal_stamps_lesson_idx on ink_animal_stamps (lesson_id);

alter table ink_animal_stamps enable row level security;

-- Same rationale as course_purchases_migration.sql: matches this app's
-- existing anon-key-trusted model rather than a stricter policy nothing
-- else here uses.
create policy "ink_animal_stamps anon read" on ink_animal_stamps
  for select using (true);

create policy "ink_animal_stamps anon insert" on ink_animal_stamps
  for insert with check (true);

create policy "ink_animal_stamps anon update" on ink_animal_stamps
  for update using (true);
