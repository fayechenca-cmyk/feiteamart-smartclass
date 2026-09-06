/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 03 — Medium Shot
 * Lesson content data.
 *
 * SCAFFOLD ONLY (2026-09-05) — deliberately empty. This build's spec
 * ("Scene Drawing Foundation · Unit 01 · Lesson 03 / Medium Shot: Show
 * the Action — Spec v1.0") was pasted in full in the build prompt
 * itself, unlike Lessons 01/02 where it arrived in a separate message
 * — so there is no missing-content gap this time. Real per-stage copy
 * gets filled in over the next two commits (look/think, then
 * make/reflect).
 * ============================================================ */
(function (global) {
  'use strict';

  const LESSON_DATA = {
    id: 'medium-shot',
    unit: 'unit-01-shot-size',
    courseId: 'medium-shot',

    // Stages 7+8 — Medium Shot = 0.5 on the shared Unit 01 slider
    // position table, which is exactly the slider's own neutral
    // default — nothing to auto-animate from/to, unlike Lessons 01/02.
    // Spec's own touch instead: a brief scale pulse on the handle when
    // this stage is entered (page-level CSS/JS in index.html — no
    // shared-component change, see afterRenderBigIdea), paired with a
    // caption line inviting the student to drag and feel the midpoint.
    big_idea: {
      title: "A medium shot gets close enough to see the action — without losing where it's happening.",
      settlePosition: 0.5,
      pulseCaption: 'This is the middle ground — close enough to see, wide enough to place.'
    },
    meet_term: {
      term: 'MEDIUM SHOT',
      subtitle: 'Show the Action',
      labels: ['ACTION', 'GESTURE', 'MOMENT']
    }

    // TODO: remaining stages fill in over the next two commits.
  };

  global.LESSON_DATA = LESSON_DATA;
})(window);
