/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 02 — Wide / Full Shot
 * Lesson content data.
 *
 * SCAFFOLD ONLY (2026-09-08) — deliberately empty. The real per-stage
 * copy, image assets, story beats, and term definition come from
 * Lesson02-WideFullShot-Spec-v1.0.md, which was referenced in the
 * build prompt as "attached alongside this prompt" but — same as
 * Lesson 01's build — was not actually present anywhere in the repo
 * or the conversation at build time. The build prompt itself DOES
 * give concrete detail for the CameraZoomSlider values, term card
 * text, and the three story/task theme pairs (see the CameraZoomSlider
 * wiring and content-wiring commits for those), but several stages
 * (video_intro's key sentence, connect_you's bubbles,
 * transition_question wording, story_a/story_b's exact prompts, real
 * examples, see_ideas) still need the real spec rather than a guess —
 * flagged here and in index.html's own top-of-file comment, same
 * pattern as the Lesson 01 build.
 * ============================================================ */
(function (global) {
  'use strict';

  const LESSON_DATA = {
    id: 'wide-full-shot',
    unit: 'unit-01-shot-size',
    courseId: 'wide-full-shot',

    // Stages 7+8 — values given directly in the build prompt (not
    // guessed): settle at 0.75 on the shared Unit 01 0-1 scale (per
    // the spec's own position table, 0=Extreme Close-Up..1=Extreme
    // Wide), auto-animating from the slider's neutral midpoint.
    // typewriter title is Claude Code's own line (not spec'd
    // verbatim) — flagged, not passed off as the real original.
    big_idea: {
      title: "Now let's find the balance between the character and their world.",
      autoAnimateFrom: 0.5,
      autoAnimateTo: 0.75,
      autoAnimateDurationMs: 1800
    },
    meet_term: {
      term: 'WIDE / FULL SHOT',
      subtitle: 'Character + World',
      labels: ['CHARACTER', 'WORLD', 'BALANCE']
    }

    // TODO: remaining stages fill in from Lesson02-WideFullShot-Spec-v1.0.md.
  };

  global.LESSON_DATA = LESSON_DATA;
})(window);
