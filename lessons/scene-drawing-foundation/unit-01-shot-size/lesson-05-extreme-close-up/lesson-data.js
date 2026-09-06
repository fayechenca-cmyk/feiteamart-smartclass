/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 05 — Extreme Close-Up
 * Lesson content data.
 *
 * SCAFFOLD ONLY (2026-09-05) — deliberately empty. This build's spec
 * ("Scene Drawing Foundation · Unit 01 · Lesson 05 / Extreme Close-Up:
 * Show the Detail — Spec v1.0") was pasted in full in the build prompt
 * itself — no missing-content gap. Real per-stage copy gets filled in
 * over the next two commits (look/think, then make/reflect).
 * ============================================================ */
(function (global) {
  'use strict';

  const LESSON_DATA = {
    id: 'extreme-close-up',
    unit: 'unit-01-shot-size',
    courseId: 'extreme-close-up',

    // Stages 7+8 — Extreme Close-Up = 0 (the slider's leftmost end) on
    // the shared Unit 01 slider position table. Auto-animates from the
    // shared neutral midpoint (0.5), same mechanism as Lessons 01/02/04.
    big_idea: {
      title: 'An extreme close-up gets so close, one small detail fills the whole frame — and that makes it feel important.',
      autoAnimateFrom: 0.5,
      autoAnimateTo: 0,
      autoAnimateDurationMs: 1800
    },
    meet_term: {
      term: 'EXTREME CLOSE-UP',
      subtitle: 'Show the Detail',
      labels: ['DETAIL', 'FOCUS', 'MEANING']
    }

    // TODO: remaining stages fill in over the next two commits.
  };

  global.LESSON_DATA = LESSON_DATA;
})(window);
