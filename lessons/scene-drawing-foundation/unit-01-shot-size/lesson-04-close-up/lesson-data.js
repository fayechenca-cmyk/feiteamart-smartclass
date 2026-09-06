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
    },

    // Stage 10 — disclaimer reused VERBATIM from prior lessons'
    // confirmed version, per the spec's explicit instruction.
    demo_video: {
      title: "Let's Draw Together",
      // Claude Code's own line — not spec'd verbatim, same flag as the
      // equivalent subtitle lines in Lessons 01-03.
      subtitle: 'How I capture the emotion',
      disclaimer: "This is one way to think through the scene — not the only right answer. Follow along, or explore your own ideas.",
      videoStreamId: null,
      videoTitle: "Let's Draw Together — thinking sketch"
    },

    // Stage 11 — 3 new tasks. `label` is the full on-screen prompt
    // sentence; `reflectLabel` is the separate short form the spec
    // gives for Stage 13's reflect chips.
    draw_task: {
      title: 'Your Turn: Draw 3 Scenes',
      tasks: [
        { key: 'kid_fireworks', label: 'The kid saw the fireworks for the first time.', reflectLabel: 'First Fireworks' },
        { key: 'found_puppy', label: 'The dog owner found their lost puppy.', reflectLabel: 'Found Puppy' },
        { key: 'finish_line', label: 'The runner crossed the finish line.', reflectLabel: 'Finish Line' }
      ],
      xpPerScene: 20
    },

    // Stage 12 — same tab names as Lessons 01-03 (don't rename), new
    // placeholder images for this lesson's 3 tasks.
    see_ideas: {
      title: 'See Other Ideas',
      tabs: [
        { key: 'teacher', label: "Teacher's Idea", image: svgPlaceholder('#2d5fa8', '🎆😲', 400, 300) },
        { key: 'jojo', label: "Jojo's Idea", image: svgPlaceholder('#e8862e', '🐶🥹', 400, 300) }
      ]
    },

    // Stage 13 — ReflectionJournal config, reusing both of Lesson 02's
    // upstream options as-is: the corrected sentenceTemplate and a
    // freeText "something else" reasonOptions entry. No component
    // changes needed.
    reflect: {
      title: 'My Choice',
      sentenceTemplate: 'I chose my {a} drawing because I wanted to show {b}.',
      viewOptions: ['First Fireworks', 'Found Puppy', 'Finish Line'],
      reasonOptions: [
        'how my character felt',
        'the expression on their face',
        'the emotion of the moment',
        { label: 'something else', freeText: true }
      ]
    }
  };

  global.LESSON_DATA = LESSON_DATA;
})(window);
