/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 05 — Extreme Close-Up
 * Lesson content data — all 13 stages, per the real "Scene Drawing
 * Foundation · Unit 01 · Lesson 05 / Extreme Close-Up: Show the
 * Detail — Spec v1.0" pasted in full in the build prompt itself (no
 * missing-content gap). Last lesson in Unit 01.
 *
 * ASSET NOTE: every image is still an inline placeholder SVG (via
 * svgPlaceholder()), not real art — same as Lessons 01-04.
 *
 * connect_you is copied VERBATIM from Lesson 01's lesson-data.js per
 * the spec's explicit "reuse as-is, don't rewrite" instruction.
 * demo_video's disclaimer (added next commit) is the same reuse.
 * ============================================================ */
(function (global) {
  'use strict';

  // Same inline SVG placeholder helper as Lessons 01-04's lesson-data.js.
  function svgPlaceholder(bg, emoji, w, h) {
    w = w || 300; h = h || 220;
    const fontSize = Math.round(Math.min(w, h) * 0.36);
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">'
      + '<rect width="' + w + '" height="' + h + '" rx="18" fill="' + bg + '"/>'
      + '<text x="50%" y="54%" font-size="' + fontSize + '" text-anchor="middle" dominant-baseline="middle">' + emoji + '</text>'
      + '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  const LESSON_DATA = {
    id: 'extreme-close-up',
    unit: 'unit-01-shot-size',
    courseId: 'extreme-close-up',

    welcome: {
      title: 'Extreme Close-Up',
      subtitle: 'Show the Detail',
      heroImage: svgPlaceholder('#dbe4ee', '💧', 500, 300),
      startLabel: 'Start →'
    },

    video_intro: {
      title: 'What is an Extreme Close-Up?',
      keySentence: 'An extreme close-up gets so close that one small detail fills the whole frame — it makes that detail feel important.',
      videoStreamId: null,
      videoTitle: 'What is an Extreme Close-Up? — concept intro'
    },

    // Reused VERBATIM from Lesson 01's lesson-data.js, per the spec's
    // explicit "same 3 options, don't rewrite" instruction.
    connect_you: {
      title: "It's About You!",
      options: [
        { key: 'people', icon: '🧑', label: 'I usually draw people', response: "Great! Today we'll practice showing the world around your characters too." },
        { key: 'places', icon: '🏞️', label: 'I usually draw places', response: "Nice! You already think about scenes — let's give them names and rules." },
        { key: 'both', icon: '✨', label: 'I draw both', response: "Perfect mix! You'll love learning how far the camera can pull back." }
      ]
    },

    transition_question: {
      title: 'What Should We Show?',
      options: [
        { key: 'whole_face', label: 'The Whole Face?' },
        { key: 'tiny_detail', label: 'One Tiny Detail?' }
      ],
      transitionLine: "Let's get so close only one thing fits in the frame..."
    },

    // Stage 5 — first ABChoiceCard instance. Close-Up framing (A)
    // shows the detective's face, noticing something but not what;
    // Extreme Close-Up (B) fills the frame with the clue itself.
    // Continues the "prior lesson vs. this lesson" progression
    // (Close-Up vs. Extreme Close-Up) per the spec's own note.
    story_a: {
      kicker: 'Story',
      prompt: 'The detective noticed a strange symbol on the ring.',
      question: 'Which one shows us the clue itself?',
      optionA: {
        image: svgPlaceholder('#7b5ea8', '🕵️'),
        label: 'The Detective',
        description: 'Shows her noticing something, but not what it is.',
        feedback: 'A shows her face, but we can’t see what she’s looking at. Let’s get closer.'
      },
      optionB: {
        image: svgPlaceholder('#2d5fa8', '💍'),
        label: 'The Clue',
        description: 'Shows exactly what she found.',
        feedback: 'B fills the frame with the clue — we can’t miss it!'
      }
    },
    // Stage 6 — second ABChoiceCard instance, different story.
    story_b: {
      kicker: 'Story',
      prompt: 'The soldier’s hands trembled as they opened the letter from home.',
      question: 'Which one shows the detail that says the most?',
      optionA: {
        image: svgPlaceholder('#3fa8a0', '🪖'),
        label: 'His Face',
        description: 'Shows his face, but not his hands.',
        feedback: 'A shows his face, but the trembling hands are the real story. Let’s get closer.'
      },
      optionB: {
        image: svgPlaceholder('#e8862e', '✋💌'),
        label: 'The Trembling Hands',
        description: 'Shows the tiny detail that tells the story.',
        feedback: 'B zooms in on the one detail that says it all!'
      }
    },

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
    },

    // Stage 9 — same 3 category names as Lessons 01-04 (don't rename).
    // New placeholder art per the spec: a single small object/detail
    // filling the frame in each category.
    real_examples: {
      title: 'Real Examples',
      examples: [
        { key: 'nature', label: 'Nature', image: svgPlaceholder('#3fa8a0', '💧', 400, 300) },
        { key: 'city', label: 'City', image: svgPlaceholder('#7b5ea8', '🚪', 400, 300) },
        { key: 'fantasy', label: 'Fantasy World', image: svgPlaceholder('#e85c6e', '🔮', 400, 300) }
      ]
    }

    // TODO: remaining stages (demo_video, draw_task, see_ideas,
    // reflect) fill in next commit.
  };

  global.LESSON_DATA = LESSON_DATA;
})(window);
