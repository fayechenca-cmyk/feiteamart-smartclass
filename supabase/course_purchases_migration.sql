-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
--
-- WHY THIS TABLE EXISTS
-- smartclass_access (see core/access.js) is single-row-per-user: one
-- `membership` flag that unlocks the ENTIRE platform. It has no concept
-- of "paid for course X specifically." Ink Animal Studio needs animal 01
-- free / animals 02-10 behind a course-specific purchase, independent of
-- the site-wide membership tier — so this is a NEW, minimal table rather
-- than a change to smartclass_access, which stays untouched.
--
-- One row = one (user, course) purchase. A student can appear multiple
-- times, once per course they've bought this way.

create table if not exists course_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  student_code text,               -- for legacy access-code students (no auth.users row)
  course_id text not null,         -- e.g. 'ink-animal-studio'
  stripe_session_id text,
  purchased_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create index if not exists course_purchases_user_idx on course_purchases (user_id);
create index if not exists course_purchases_code_idx on course_purchases (student_code);
create index if not exists course_purchases_course_idx on course_purchases (course_id);

alter table course_purchases enable row level security;

-- Matches this codebase's existing, demonstrated security model: the
-- anon/publishable key is already trusted broadly (student_submissions,
-- teacher_feedback, live_class_sessions all read/write with it and no
-- per-row auth.uid() checks), because client-side gates here are not the
-- real security boundary — see core/access.js header comment. Kept
-- consistent with that rather than introducing a stricter auth.uid()-only
-- policy that nothing else in this app actually uses.
create policy "course_purchases anon read" on course_purchases
  for select using (true);

create policy "course_purchases anon insert" on course_purchases
  for insert with check (true);
