-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
--
-- WHY THIS MIGRATION EXISTS
-- Lesson 01's "Submit to Student Artwork Community" button (Scene
-- Drawing Foundation, lessons/scene-drawing-foundation/unit-01-shot-
-- size/lesson-01-extreme-wide-shot) was non-functional UI chrome — it
-- disabled itself and showed a static "thank you," with no upload, no
-- database record, nothing a teacher or another student could ever
-- see. This reuses the platform's EXISTING student_submissions table +
-- student-artwork Storage bucket (see core/teacher-submission.js,
-- core/submissions.js — the two already-established upload patterns)
-- rather than inventing a new mechanism, with small additive changes:
--
-- 1. story_id (new column) — which story (A/B/C) a Scene Drawing
--    Foundation submission is for. Null/unused on every existing row
--    — Foundation A's "submit to your teacher" flow has no concept of
--    "story", this is purely additive.
--
-- 2. community_status (new column) — the actual public-gallery
--    moderation gate: 'pending' the moment a student submits to the
--    Community gallery, 'approved' once Faye/a teacher approves it in
--    teacher-admin. NULL on every existing row and on every future
--    "submit to your teacher" row — that flow was never intended for
--    public display, and this column being null (not 'pending') is
--    exactly what keeps those private submissions out of the public
--    gallery query (see lesson-01's loadApprovedCommunitySubmissions).
--
-- FLAGGED (per Faye's "flag rather than deciding silently" ask):
-- student_submissions already has working anon SELECT and INSERT
-- (confirmed live — the existing "submit to your teacher" flow already
-- writes through them) but NO anon UPDATE policy — verified live: a
-- PATCH against an existing row silently succeeded at the HTTP level
-- (200) but changed nothing. teacher-admin's "Send Feedback" feature
-- works around this today by INSERTing into a separate teacher_feedback
-- table rather than updating the submission row — but Faye's own spec
-- for this feature is literally "an approved/pending status" ON the
-- submission, so this migration adds the missing UPDATE policy rather
-- than working around it with another side table. Kept exactly as
-- permissive as this table's own existing SELECT/INSERT policies (anon
-- key already trusted broadly across this app — see course_purchases_
-- migration.sql's identical reasoning) rather than introducing a
-- stricter policy inconsistent with the rest of this table.

alter table student_submissions
  add column if not exists story_id text,
  add column if not exists community_status text;

create policy "student_submissions anon update" on student_submissions
  for update using (true) with check (true);
