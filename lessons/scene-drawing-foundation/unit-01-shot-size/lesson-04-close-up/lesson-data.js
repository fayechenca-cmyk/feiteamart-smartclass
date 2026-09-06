/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 04 — Close-Up
 * Lesson content data.
 *
 * SCAFFOLD ONLY (2026-09-05) — deliberately empty. This build's spec
 * ("Scene Drawing Foundation · Unit 01 · Lesson 04 / Close-Up: Show
 * Emotion — Spec v1.0") was pasted in full in the build prompt itself
 * — no missing-content gap. Real per-stage copy gets filled in over
 * the next two commits (look/think, then make/reflect).
 * ============================================================ */
(function (global) {
  'use strict';

  const LESSON_DATA = {
    id: 'close-up',
    unit: 'unit-01-shot-size',
    courseId: 'close-up',

    // Stages 7+8 — Close-Up = 0.25 on the shared Unit 01 slider
    // position table. Auto-animates from the shared neutral midpoint
    // (0.5), same mechanism as Lessons 01/02 — not Lesson 03's special
    // "target equals the midpoint" pulse case.
    big_idea: {
      title: "A close-up gets so close we can read the character's feelings on their face.",
      autoAnimateFrom: 0.5,
      autoAnimateTo: 0.25,
      autoAnimateDurationMs: 1800
    },
    meet_term: {
      term: 'CLOSE-UP',
      subtitle: 'Show Emotion',
      labels: ['EMOTION', 'EXPRESSION', 'FACE']
    }

    // TODO: remaining stages fill in over the next two commits.
  };

  global.LESSON_DATA = LESSON_DATA;
})(window);
