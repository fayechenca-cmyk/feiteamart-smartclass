/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 01 (REDESIGN v2)
 * Extreme Wide Shot — Show the World
 *
 * Data-only. Presentation lives entirely in index.html's generic
 * step renderer, per the redesign brief's explicit "don't hardcode
 * Lesson 01 content inside presentation components — we need to
 * reuse the system for Lessons 02–26" requirement. Every field name
 * below matches the brief's own Section 10 list
 * (intro_video / interactive_scene / story_prompts /
 * reference_resources / story_choices / drawing_steps / audio /
 * student_examples / completion_check) so a future lesson can supply
 * the same shape without index.html changing.
 *
 * id/courseId are UNCHANGED from the live Lesson 01
 * (lesson-01-extreme-wide-shot/lesson-data.js) on purpose — this is
 * a parallel redesign of the SAME lesson, not a new one, so it stays
 * compatible with the already-wired completedLessons entry and the
 * scene_drawing_unit_01 badge (core/course-badge-registry.js), and
 * so promoting this later doesn't orphan anyone's saved progress.
 * ============================================================ */
(function (global) {
  'use strict';

  const LESSON_DATA = {
    id: 'extreme-wide-shot',
    unit: 'unit-01-shot-size',
    courseId: 'extreme-wide-shot',
    title: 'Extreme Wide Shot',
    subtitle: 'Show the World',

    // Step 1 — real, live Cloudflare Stream video (not a placeholder).
    // Same customer code already used across all 5 live Unit 01
    // lessons' CF_STREAM_CUSTOMER constant.
    intro_video: {
      title: 'What Is a Scene?',
      videoStreamId: '5f78b788563e4c17dc8b9e587998b609'
    },

    // Step 2 — camera-distance interaction only (no angle, no grid,
    // no VP — see index.html's own note on why). settlePosition
    // reuses the exact locked Unit 01 dolly table value for Extreme
    // Wide Shot (1.0) from _shared/camera-zoom-slider.js.
    interactive_scene: {
      kind: 'camera_distance',
      startPosition: 0.1,
      settlePosition: 1.0,
      termLabel: 'EXTREME WIDE SHOT',
      hint: 'Pull the camera back.'
    },

    // Step 3
    story_prompts: {
      question: 'When might we step back and show more of the world?',
      bigIdea: 'Sometimes, the story is bigger than the character.',
      // `reveal` is a short single-word clue chip shown after a tap —
      // never a taught "formula" (the brief explicitly warns against
      // "Extreme Wide = sadness" style equations).
      items: [
        { text: 'A storm is moving across the valley.', reveal: 'ATMOSPHERE' },
        { text: 'Winter is ending. Is spring getting closer?', reveal: 'TIME' },
        { text: 'After walking all night, I finally saw the city.', reveal: 'DISTANCE' },
        { text: 'I was completely lost in the forest.', reveal: 'PLACE' },
        { text: 'I arrived in a world I had never seen before.', reveal: 'SCALE' },
        { text: 'The sun was rising over a place I had never visited.', reveal: 'TIME' }
      ]
    },

    // Step 4 — placeholders per the brief's own explicit instruction
    // ("use placeholders now if final links/assets are not yet
    // selected"). Every item is clearly flagged placeholder:true so a
    // future pass swapping in real, license-safe resources doesn't
    // have to guess which ones are real. No copyrighted thumbnails
    // are embedded — see index.html's renderLookCloser for why every
    // preview is an original abstract card, never a hotlinked image.
    reference_resources: {
      items: [
        { category: 'FILM', title: 'Add a real film example here', source: 'TBD', prompt: 'Notice how small the figure feels inside the landscape.', url: '#', placeholder: true },
        { category: 'FILM', title: 'Add a real film example here', source: 'TBD', prompt: 'What do you notice first: the person or the world?', url: '#', placeholder: true },
        { category: 'ILLUSTRATION', title: 'Add a real illustration example here', source: 'TBD', prompt: 'How does the artist show distance without using color?', url: '#', placeholder: true },
        { category: 'ILLUSTRATION', title: 'Add a real illustration example here', source: 'TBD', prompt: 'Where does your eye go first, and where does it go next?', url: '#', placeholder: true },
        { category: 'FINE ART', title: 'Add a real museum/open-access example here', source: 'TBD', prompt: 'Is the world calm, or does it feel like something is about to happen?', url: '#', placeholder: true },
        { category: 'FINE ART', title: 'Add a real museum/open-access example here', source: 'TBD', prompt: 'How much of this picture is empty space? Why might that matter?', url: '#', placeholder: true }
      ]
    },

    // Step 5 — `direction` is internal art-direction guidance (for
    // whoever illustrates story_choices later), not student-facing
    // copy — index.html never prints it to the student.
    story_choices: [
      {
        id: 'spring',
        title: 'Winter has passed. Is spring getting closer?',
        direction: 'Large quiet winter/spring transitional landscape. Poetic, spacious, calm.'
      },
      {
        id: 'forest',
        title: 'Late at night, I became lost in the forest.',
        direction: 'Side-view forest composition. Trees overlap other trees. Large foreground trunks. Small figure. No obvious one-point-perspective road.'
      },
      {
        id: 'newworld',
        title: 'After travelling for a long time, I suddenly discovered an incredible new world.',
        direction: 'Wonder / discovery. Large unknown world. Small traveler. Distinct from A and B.'
      }
    ],

    // Step 6 — one shared progressive drawing sequence, deliberately
    // NOT three fully bespoke final illustrations per story choice
    // (no real hand-drawn asset layers exist yet for any of them) —
    // scope simplification for this prototype pass, flagged here
    // rather than silently done. The chosen story only changes the
    // short context line shown alongside the same 5 stages.
    drawing_steps: [
      { instruction: 'Start with the big world.', asset: null },
      { instruction: 'Build the largest shapes.', asset: null },
      { instruction: 'Place the character small.', asset: null },
      { instruction: 'Create depth.', asset: null },
      { instruction: 'Add only the details the story needs.', asset: null }
    ],

    audio: {
      // Per-step opt-in narration flags — none wired to real audio
      // files yet (none exist); index.html only shows a "Listen"
      // control where a step sets narrationAvailable:true, per the
      // brief's "small speaker/listen control, never autoplay" rule.
      narrationAvailable: false
    },

    // Step 7 — placeholders, per the brief's explicit "teacher
    // example / Jojo example / other student work" list, shown only
    // AFTER the student's own drawing (index.html enforces the
    // ordering, not this data).
    student_examples: [
      { label: "Teacher's Idea", placeholder: true },
      { label: "Jojo's Idea", placeholder: true }
    ],

    // Step 8 — multi-select, no single "correct" combination; every
    // option is a legitimate answer, matching the brief's explicit
    // "World / Place / Scale / Atmosphere" concept list and its
    // instruction not to teach a rigid equation.
    completion_check: {
      question: 'What does an Extreme Wide Shot help us show?',
      options: ['The World', 'Place', 'Scale', 'Atmosphere']
    }
  };

  global.LESSON_DATA = LESSON_DATA;
})(window);
