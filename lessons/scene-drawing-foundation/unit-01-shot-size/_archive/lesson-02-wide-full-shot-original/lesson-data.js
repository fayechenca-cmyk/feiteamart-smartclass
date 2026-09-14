/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 02 — Wide / Full Shot
 * Lesson content data — all 13 stages, per the real
 * "Scene Drawing Foundation · Unit 01 · Lesson 02 / Wide / Full Shot:
 * Character + World — Spec v1.0" pasted by Faye.
 *
 * ASSET NOTE: same situation as Lesson 01 — every image below is an
 * inline placeholder SVG (via svgPlaceholder()), not real art. The
 * spec's visual notes (character shown FULL BODY, with enough
 * environment to read where they are — never shrunk to a dot the way
 * Lesson 01's extreme-wide art was) are honored in spirit via the
 * emoji choice, but the real illustrations still need to come later;
 * swapping in real image URLs needs no other code change.
 *
 * connect_you is copied VERBATIM from Lesson 01's lesson-data.js per
 * the spec's explicit "reuse as-is, don't rewrite" instruction — same
 * title, options, icons, and bubble-response copy.
 *
 * COPY FLAGGED AS CLAUDE CODE'S OWN (not verbatim spec text, same as
 * the equivalent flags in Lesson 01's file):
 *   - video_intro.keySentence
 *   - demo_video.subtitle
 * Everything else below (big_idea/meet_term text, story_a/story_b,
 * transition_question, draw_task prompts + short labels, reflect
 * sentence template + reason options) is the spec's own wording.
 * ============================================================ */
(function (global) {
  'use strict';

  // Same inline SVG placeholder helper as Lesson 01's lesson-data.js —
  // a colored rounded card with a centered emoji (or short emoji
  // sequence, when a stage needs both "character" and "world" read at
  // a glance in one placeholder).
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
    id: 'wide-full-shot',
    unit: 'unit-01-shot-size',
    courseId: 'wide-full-shot',

    welcome: {
      title: 'Wide / Full Shot',
      subtitle: 'Character + World',
      heroImage: svgPlaceholder('#dbe4ee', '🧍🏔️', 500, 300),
      startLabel: 'Start →'
    },

    video_intro: {
      title: 'What is a Wide Shot?',
      // Claude Code's own line — not spec'd verbatim, flagged per the
      // file-level note above (same treatment as Lesson 01's Stage 2).
      keySentence: "A wide shot shows all of the character — head to toe — plus enough of the world around them to know where they are.",
      videoStreamId: null,
      videoTitle: 'What is a Wide Shot? — concept intro'
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
        { key: 'character', label: 'The Character?' },
        { key: 'world', label: 'The World?' }
      ],
      // Shown after either bubble is picked, then the stage
      // auto-advances — unlike Lesson 01's immediate-advance version,
      // per this lesson's spec.
      transitionLine: "Let's see what happens when we show both..."
    },

    // Stage 5 — first ABChoiceCard instance. Extreme Wide (A) keeps the
    // knight a tiny dot against the ruin; Wide/Full (B) shows the
    // knight's whole body AND enough of the ruin to read the scene.
    story_a: {
      kicker: 'Story',
      prompt: 'A knight stood at the edge of the ruined castle, unsure whether to enter.',
      question: 'Which one lets you see how the knight feels?',
      optionA: {
        image: svgPlaceholder('#7b5ea8', '🏰'),
        label: 'The Whole Ruin',
        description: 'Shows the huge, crumbling castle.',
        feedback: 'A shows the scale of the ruin, but we can barely see the knight. Let’s try showing both next.'
      },
      optionB: {
        image: svgPlaceholder('#2d5fa8', '🤺🏰'),
        label: "The Knight's Choice",
        description: "Shows the knight's posture AND the castle.",
        feedback: 'B shows the knight’s whole body — we can read their hesitation!'
      }
    },
    // Stage 6 — second ABChoiceCard instance, different story.
    story_b: {
      kicker: 'Story',
      prompt: 'A young explorer stepped off the boat onto a new island.',
      question: 'Which one shows us WHO this explorer is, not just where they are?',
      optionA: {
        image: svgPlaceholder('#3fa8a0', '🏝️'),
        label: 'The New Island',
        description: 'Shows the whole unexplored coastline.',
        feedback: 'A shows a lot of the island, but the explorer is tiny. Let’s try showing both.'
      },
      optionB: {
        image: svgPlaceholder('#e8862e', '🧭🏝️'),
        label: "The Explorer's Arrival",
        description: "Shows the explorer's curious pose AND the coastline.",
        feedback: 'B shows the explorer’s whole body — we can see their curiosity!'
      }
    },

    // Stages 7+8 — locked Unit 01 slider position table: 0.75 = Wide /
    // Full Shot. Auto-animates from the shared neutral midpoint (0.5),
    // same as every lesson in this unit, per the build prompt's own
    // "no cross-lesson state carryover, always start from neutral"
    // note.
    big_idea: {
      title: 'We see the whole character — and enough of the world to know where they are.',
      autoAnimateFrom: 0.5,
      autoAnimateTo: 0.75,
      autoAnimateDurationMs: 1800
    },
    meet_term: {
      term: 'WIDE / FULL SHOT',
      subtitle: 'Character + World',
      labels: ['CHARACTER', 'WORLD', 'BALANCE']
    },

    // Stage 9 — same 3 category names as Lesson 01 (don't rename), new
    // placeholder art per-lesson (character full body + environment,
    // not shrunk to a dot).
    real_examples: {
      title: 'Real Examples',
      examples: [
        { key: 'nature', label: 'Nature', image: svgPlaceholder('#3fa8a0', '🧍🏞️', 400, 300) },
        { key: 'city', label: 'City', image: svgPlaceholder('#7b5ea8', '🧍🏙️', 400, 300) },
        { key: 'fantasy', label: 'Fantasy World', image: svgPlaceholder('#e85c6e', '🧍🏰', 400, 300) }
      ]
    },

    // Stage 10 — disclaimer reused VERBATIM from Lesson 01's confirmed
    // version, per the spec's explicit instruction.
    demo_video: {
      title: "Let's Draw Together",
      // Claude Code's own line — not spec'd verbatim, flagged per the
      // file-level note above.
      subtitle: 'How I balance the character and the world',
      disclaimer: "This is one way to think through the scene — not the only right answer. Follow along, or explore your own ideas.",
      videoStreamId: null,
      videoTitle: "Let's Draw Together — thinking sketch"
    },

    // Stage 11 — 3 new tasks. `label` is the full evocative prompt
    // shown on-screen (the spec gives full sentences here, longer than
    // Lesson 01's short task names); `reflectLabel` is the separate
    // short form the spec gives for Stage 13's reflect chips.
    draw_task: {
      title: 'Your Turn: Draw 3 Scenes',
      tasks: [
        { key: 'astronaut_flag', label: 'The astronaut planted a flag on the new planet.', reflectLabel: 'Astronaut on a New Planet' },
        { key: 'new_kid_school', label: 'The new kid stood at the school gate on the first day.', reflectLabel: 'First Day at School' },
        { key: 'musician_stage', label: 'A young musician performed on a big stage for the first time.', reflectLabel: 'Big Stage Performance' }
      ],
      xpPerScene: 20
    },

    // Stage 12 — same tab names as Lesson 01 (don't rename), new
    // placeholder images.
    see_ideas: {
      title: 'See Other Ideas',
      tabs: [
        { key: 'teacher', label: "Teacher's Idea", image: svgPlaceholder('#2d5fa8', '🧍🖼️', 400, 300) },
        { key: 'jojo', label: "Jojo's Idea", image: svgPlaceholder('#e8862e', '🧍🖼️', 400, 300) }
      ]
    },

    // Stage 13 — ReflectionJournal config, using the two new upstream
    // options (_shared/reflection-journal.js): a corrected
    // sentenceTemplate (the original Lesson 01 "I chose the ___ view
    // because ___" doesn't hold up once "view" means "which of my 3
    // same-shot-type drawings" — the spec's fix reframes it around the
    // drawing itself and what the student meant to show) and a
    // freeText "something else" reasonOptions entry.
    reflect: {
      title: 'My Choice',
      sentenceTemplate: 'I chose my {a} drawing because I wanted to show {b}.',
      viewOptions: ['Astronaut on a New Planet', 'First Day at School', 'Big Stage Performance'],
      reasonOptions: [
        "the character's whole body",
        'the place around them',
        'both together',
        { label: 'something else', freeText: true }
      ]
    }
  };

  global.LESSON_DATA = LESSON_DATA;
  global.svgPlaceholder = svgPlaceholder;
})(window);
