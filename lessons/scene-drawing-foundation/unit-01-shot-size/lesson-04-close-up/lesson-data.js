/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 04 — Close-Up
 * Lesson content data — all 13 stages, per the real "Scene Drawing
 * Foundation · Unit 01 · Lesson 04 / Close-Up: Show Emotion — Spec
 * v1.0" pasted in full in the build prompt itself (no missing-content
 * gap).
 *
 * ASSET NOTE: every image is still an inline placeholder SVG (via
 * svgPlaceholder()), not real art — same as Lessons 01-03.
 *
 * connect_you is copied VERBATIM from Lesson 01's lesson-data.js per
 * the spec's explicit "reuse as-is, don't rewrite" instruction.
 * demo_video's disclaimer (added next commit) is the same reuse.
 * ============================================================ */
(function (global) {
  'use strict';

  // Same inline SVG placeholder helper as Lessons 01-03's lesson-data.js.
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
    id: 'close-up',
    unit: 'unit-01-shot-size',
    courseId: 'close-up',

    welcome: {
      title: 'Close-Up',
      subtitle: 'Show Emotion',
      heroImage: svgPlaceholder('#dbe4ee', '😲', 500, 300),
      startLabel: 'Start →'
    },

    video_intro: {
      title: 'What is a Close-Up?',
      keySentence: "A close-up shows the character's face up close, so we can see exactly how they feel.",
      videoStreamId: null,
      videoTitle: 'What is a Close-Up? — concept intro'
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
        { key: 'action', label: 'The Action?' },
        { key: 'feeling', label: 'The Feeling?' }
      ],
      transitionLine: "Let's get close enough to see it on their face..."
    },

    // Stage 5 — first ABChoiceCard instance. Medium framing (A) shows
    // her holding the letter but her face is small; Close-Up (B) shows
    // her expression clearly. Continues the "prior lesson vs. this
    // lesson" progression (Medium vs. Close-Up) per the spec's own note.
    story_a: {
      kicker: 'Story',
      prompt: 'The girl opened her acceptance letter.',
      question: 'Which one lets you feel what she’s feeling?',
      optionA: {
        image: svgPlaceholder('#7b5ea8', '✉️🧍'),
        label: 'The Letter',
        description: 'Shows her holding the letter, but her face is small.',
        feedback: 'A shows the letter, but her expression gets lost. Let’s get closer.'
      },
      optionB: {
        image: svgPlaceholder('#2d5fa8', '🥹'),
        label: 'Her Reaction',
        description: 'Shows exactly how she feels.',
        feedback: 'B brings us right up to her expression!'
      }
    },
    // Stage 6 — second ABChoiceCard instance, different story.
    story_b: {
      kicker: 'Story',
      prompt: 'The boy realized he forgot his lines on stage.',
      question: 'Which one makes us feel his nervousness?',
      optionA: {
        image: svgPlaceholder('#3fa8a0', '🎤🧍'),
        label: 'On Stage',
        description: 'Shows him standing there, but not his panic.',
        feedback: 'A shows him on stage, but we can’t read his face. Let’s zoom in.'
      },
      optionB: {
        image: svgPlaceholder('#e8862e', '😰'),
        label: 'The Panic',
        description: 'Shows the worry on his face.',
        feedback: 'B shows us the panic in his eyes!'
      }
    },

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
    },

    // Stage 9 — same 3 category names as Lessons 01-03 (don't rename).
    // New placeholder art, each a facial-expression close-up per the
    // spec — face-focused rather than character+environment, since
    // that's the whole point of a close-up example here.
    real_examples: {
      title: 'Real Examples',
      examples: [
        { key: 'nature', label: 'Nature', image: svgPlaceholder('#3fa8a0', '😲', 400, 300) },
        { key: 'city', label: 'City', image: svgPlaceholder('#7b5ea8', '😂', 400, 300) },
        { key: 'fantasy', label: 'Fantasy World', image: svgPlaceholder('#e85c6e', '😤', 400, 300) }
      ]
    }

    // TODO: remaining stages (demo_video, draw_task, see_ideas,
    // reflect) fill in next commit.
  };

  global.LESSON_DATA = LESSON_DATA;
})(window);
