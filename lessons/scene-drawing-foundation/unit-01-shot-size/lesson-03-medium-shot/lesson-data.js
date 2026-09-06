/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 03 — Medium Shot
 * Lesson content data — all 13 stages, per the real "Scene Drawing
 * Foundation · Unit 01 · Lesson 03 / Medium Shot: Show the Action —
 * Spec v1.0" pasted in full in the build prompt itself (no missing-
 * content gap this time, unlike Lessons 01/02).
 *
 * ASSET NOTE: every image is still an inline placeholder SVG (via
 * svgPlaceholder()), not real art — same as Lessons 01/02.
 *
 * connect_you is copied VERBATIM from Lesson 01's lesson-data.js per
 * the spec's explicit "reuse as-is, don't rewrite" instruction.
 * demo_video's disclaimer (added next commit) is the same reuse.
 * ============================================================ */
(function (global) {
  'use strict';

  // Same inline SVG placeholder helper as Lessons 01/02's lesson-data.js.
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
    id: 'medium-shot',
    unit: 'unit-01-shot-size',
    courseId: 'medium-shot',

    welcome: {
      title: 'Medium Shot',
      subtitle: 'Show the Action',
      heroImage: svgPlaceholder('#dbe4ee', '🧍‍♂️✋', 500, 300),
      startLabel: 'Start →'
    },

    video_intro: {
      title: 'What is a Medium Shot?',
      keySentence: "A medium shot shows enough of the character to see what they're doing — their action, gesture, and a bit of what's around them.",
      videoStreamId: null,
      videoTitle: 'What is a Medium Shot? — concept intro'
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
        { key: 'whole_scene', label: 'The Whole Scene?' },
        { key: 'just_action', label: 'Just the Action?' }
      ],
      transitionLine: "Let's zoom in close enough to see clearly..."
    },

    // Stage 5 — first ABChoiceCard instance. Wide/Full framing (A)
    // shows the whole kitchen with the flip hard to make out; Medium
    // framing (B) shows the flip itself clearly.
    story_a: {
      kicker: 'Story',
      prompt: 'The chef flipped the pancake just in time.',
      question: 'Which one lets you see exactly what’s happening?',
      optionA: {
        image: svgPlaceholder('#7b5ea8', '🏠🍳'),
        label: 'The Whole Kitchen',
        description: 'Shows the whole kitchen, but the flip is hard to see.',
        feedback: 'A shows the whole kitchen, but we can barely see what the chef is doing. Let’s get closer.'
      },
      optionB: {
        image: svgPlaceholder('#2d5fa8', '🍳✋'),
        label: 'The Flip',
        description: 'Shows the action clearly.',
        feedback: 'B gets us close enough to see the flip in action!'
      }
    },
    // Stage 6 — second ABChoiceCard instance, different story.
    story_b: {
      kicker: 'Story',
      prompt: 'The goalkeeper dove to block the ball.',
      question: 'Which one makes the action feel exciting?',
      optionA: {
        image: svgPlaceholder('#3fa8a0', '🏟️⚽'),
        label: 'The Whole Field',
        description: 'Shows the whole field.',
        feedback: 'A shows a lot of the field, but the save itself gets lost. Let’s zoom in.'
      },
      optionB: {
        image: svgPlaceholder('#e8862e', '🧤⚽'),
        label: 'The Save',
        description: 'Shows the dive and the ball together.',
        feedback: 'B puts us right in the moment of the save!'
      }
    },

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
    },

    // Stage 9 — same 3 category names as Lessons 01/02 (don't rename).
    // New placeholder art depicting an action mid-moment, per the spec.
    real_examples: {
      title: 'Real Examples',
      examples: [
        { key: 'nature', label: 'Nature', image: svgPlaceholder('#3fa8a0', '🥾🪨', 400, 300) },
        { key: 'city', label: 'City', image: svgPlaceholder('#7b5ea8', '🧑‍🍳🔥', 400, 300) },
        { key: 'fantasy', label: 'Fantasy World', image: svgPlaceholder('#e85c6e', '🧙‍♂️✨', 400, 300) }
      ]
    },

    // Stage 10 — disclaimer reused VERBATIM from Lessons 01/02's
    // confirmed version, per the spec's explicit instruction.
    demo_video: {
      title: "Let's Draw Together",
      // Claude Code's own line — not spec'd verbatim, same flag as the
      // equivalent subtitle lines in Lessons 01/02.
      subtitle: 'How I capture the action',
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
        { key: 'baker_bread', label: 'The baker pulled a fresh loaf out of the oven.', reflectLabel: 'Fresh Bread' },
        { key: 'scientist_mix', label: 'The scientist mixed two glowing liquids together.', reflectLabel: 'Glowing Mix' },
        { key: 'drummer_beat', label: 'The drummer hit the final beat of the song.', reflectLabel: 'Final Beat' }
      ],
      xpPerScene: 20
    },

    // Stage 12 — same tab names as Lessons 01/02 (don't rename), new
    // placeholder images for this lesson's 3 tasks.
    see_ideas: {
      title: 'See Other Ideas',
      tabs: [
        { key: 'teacher', label: "Teacher's Idea", image: svgPlaceholder('#2d5fa8', '🍞🔥', 400, 300) },
        { key: 'jojo', label: "Jojo's Idea", image: svgPlaceholder('#e8862e', '🧪✨', 400, 300) }
      ]
    },

    // Stage 13 — ReflectionJournal config, reusing both of Lesson 02's
    // upstream options as-is: the corrected sentenceTemplate and a
    // freeText "something else" reasonOptions entry. No component
    // changes needed.
    reflect: {
      title: 'My Choice',
      sentenceTemplate: 'I chose my {a} drawing because I wanted to show {b}.',
      viewOptions: ['Fresh Bread', 'Glowing Mix', 'Final Beat'],
      reasonOptions: [
        'the action clearly',
        "my character's gesture",
        'the exact moment it happened',
        { label: 'something else', freeText: true }
      ]
    }
  };

  global.LESSON_DATA = LESSON_DATA;
})(window);
