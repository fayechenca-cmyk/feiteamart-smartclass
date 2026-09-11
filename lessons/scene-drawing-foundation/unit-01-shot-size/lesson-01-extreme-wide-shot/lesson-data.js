/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 01 — LIVE
 * Extreme Wide Shot — Show the World
 *
 * This is the "Learning Canvas" redesign, PROMOTED to the real live
 * path on 2026-09-17 (built and reviewed across 4 local rounds at a
 * parallel lesson-01-extreme-wide-shot-v2/ path first, which no
 * longer exists). The pre-redesign original is archived, not
 * deleted, at ../_archive/lesson-01-extreme-wide-shot-original/.
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
 * id/courseId are UNCHANGED from the archived original on purpose —
 * this is a redesign of the SAME lesson, not a new one, so it stays
 * compatible with the already-wired completedLessons entry and the
 * scene_drawing_unit_01 badge (core/course-badge-registry.js). No
 * real student progress existed under this id to orphan at promotion
 * time (no real users yet), but the id stays stable regardless, per
 * Faye's standing rule against renaming identifiers this system
 * already keys data on.
 *
 * ROUND 2 (Faye's local-preview feedback) additions:
 *   - story_prompts.items[].sceneKey — index.html looks this up in a
 *     small built-in illustration table to render an actual image per
 *     card (round 1 was text-only; Faye asked for imagery-first).
 *   - story_prompts.audioSrc — left null. Faye may supply a real
 *     recorded (ElevenLabs) narration file later; index.html only
 *     shows a "Listen" control when this is populated. No TTS here.
 *   - drawing_steps[].teachingNote — a short secondary line under each
 *     stage's caption, explaining WHY that stage looks the way it
 *     does (round 1's stages read as decoration with no teaching
 *     content, per Faye's "didn't actually learn anything" note).
 *   - student_examples — relabeled away from a named mascot ("Jojo's
 *     Idea") to generic Teacher/Student reference roles, per Faye's
 *     explicit correction that a self-study platform needs two clear
 *     reference points, not one branded character's take.
 *   - community_gallery — new placeholder field for Step 7's
 *     community/discussion-style section (real submissions later).
 *   - next_lesson — new field so Step 8 can chain into Lesson 02
 *     without index.html hardcoding a path; each future lesson
 *     supplies its own.
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
      videoStreamId: '5f78b788563e4c17dc8b9e587998b609',
      // Round 4 — a designed cover with the title baked in, not the
      // Cloudflare-generated raw-frame thumbnail (which read as a
      // generic video-player thumbnail, per Faye's correction).
      posterUrl: 'poster-what-is-a-scene.svg'
    },

    // Step 2 — real 3D scene (Three.js), ported from
    // prototypes/3d-camera-explorer-v2/index.html's own Step 2, per
    // Faye's explicit round-2 correction away from the round-1 2.5D
    // CSS-transform stand-in. Fully automatic (camera pulls back on
    // its own — no drag), no narration for this lesson.
    interactive_scene: {
      kind: 'camera_distance_3d',
      termLabel: 'EXTREME WIDE SHOT'
    },

    // Step 3
    story_prompts: {
      question: 'When might we step back and show more of the world?',
      bigIdea: 'Sometimes, the story is bigger than the character.',
      // Real recorded narration (ElevenLabs mp3, per Faye) goes here
      // later — index.html shows a small "Listen" control only when
      // this is populated. No speechSynthesis/TTS pass for this step.
      audioSrc: null,
      // `sceneKey` picks one of index.html's built-in original
      // illustrations (SCENE_ART table) — small, non-photographic,
      // same restrained palette as the rest of the lesson. `reveal` is
      // a short single-word clue chip shown after a tap — never a
      // taught "formula" (the brief explicitly warns against
      // "Extreme Wide = sadness" style equations).
      items: [
        { text: 'A storm is moving across the valley.', reveal: 'ATMOSPHERE', sceneKey: 'storm' },
        { text: 'Winter is ending. Is spring getting closer?', reveal: 'TIME', sceneKey: 'thaw' },
        { text: 'After walking all night, I finally saw the city.', reveal: 'DISTANCE', sceneKey: 'city' },
        { text: 'I was completely lost in the forest.', reveal: 'PLACE', sceneKey: 'forest' },
        { text: 'I arrived in a world I had never seen before.', reveal: 'SCALE', sceneKey: 'newworld' },
        { text: 'The sun was rising over a place I had never visited.', reveal: 'TIME', sceneKey: 'sunrise' }
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
    // `demoVideoStreamId` (round 4) — one placeholder teacher-
    // demonstration video slot PER story, per Faye's explicit
    // "showing the teacher's own process of drawing the SPECIFIC
    // scene the student picked... one video per story option" — not
    // a single generic demo. All three null for now (coming-soon
    // fallback, same pattern as intro_video before its real ID
    // arrived); `demoDisclaimer` is reused verbatim from the live
    // Lessons 01-05 "Let's Draw Together" convention, not new copy.
    story_choices: [
      {
        id: 'spring',
        title: 'Winter has passed. Is spring getting closer?',
        direction: 'Large quiet winter/spring transitional landscape. Poetic, spacious, calm.',
        demoVideoStreamId: null,
        demoDisclaimer: "This is one way to think through the scene — not the only right answer. Follow along, or explore your own ideas."
      },
      {
        id: 'forest',
        title: 'Late at night, I became lost in the forest.',
        direction: 'Side-view forest composition. Trees overlap other trees. Large foreground trunks. Small figure. No obvious one-point-perspective road.',
        demoVideoStreamId: null,
        demoDisclaimer: "This is one way to think through the scene — not the only right answer. Follow along, or explore your own ideas."
      },
      {
        id: 'newworld',
        title: 'After travelling for a long time, I suddenly discovered an incredible new world.',
        direction: 'Wonder / discovery. Large unknown world. Small traveler. Distinct from A and B.',
        demoVideoStreamId: null,
        demoDisclaimer: "This is one way to think through the scene — not the only right answer. Follow along, or explore your own ideas."
      }
    ],

    // Step 6 — one shared progressive drawing sequence, deliberately
    // NOT three fully bespoke final illustrations per story choice
    // (no real hand-drawn asset layers exist yet for any of them) —
    // scope simplification for this prototype pass, flagged here
    // rather than silently done. The chosen story only changes the
    // short context line shown alongside the same 5 stages.
    // `instruction` is the exact caption text from the original brief
    // (kept verbatim); `teachingNote` is new in round 2 — a short
    // second line naming the actual technique that stage
    // demonstrates, so the sequence teaches something concrete rather
    // than just showing shapes appear (Faye: "didn't actually learn
    // anything" from round 1's version).
    drawing_steps: [
      {
        instruction: 'Start with the big world.',
        teachingNote: 'Place the horizon low — it leaves more sky and world to fill with story.'
      },
      {
        instruction: 'Build the largest shapes.',
        teachingNote: 'Far shapes stay lighter and simpler than near ones — that value drop-off is what reads as distance.'
      },
      {
        instruction: 'Place the character small.',
        teachingNote: 'Compare the character to the nearest foreground shape — small next to something large is what makes the world feel big.'
      },
      {
        instruction: 'Create depth.',
        teachingNote: 'Overlap near and far shapes so each layer blocks the one behind it — overlap alone tells the eye what is closer.'
      },
      {
        instruction: 'Add only the details the story needs.',
        teachingNote: 'A few chosen details carry the moment better than many — this is restraint, not lack of effort.'
      }
    ],

    audio: {
      // Per-step opt-in narration flags — none wired to real audio
      // files yet (none exist); index.html only shows a "Listen"
      // control where a step sets narrationAvailable:true, per the
      // brief's "small speaker/listen control, never autoplay" rule.
      narrationAvailable: false
    },

    // Step 7 — round 2: relabeled away from a named mascot ("Jojo's
    // Idea") to generic Teacher/Student reference roles, per Faye's
    // explicit correction — a self-study platform needs two clear
    // reference points on first viewing, not one branded character's
    // take. Still placeholders (no real images yet).
    student_examples: [
      { label: 'Teacher Reference', role: 'teacher', placeholder: true },
      { label: 'Student Reference', role: 'student', placeholder: true }
    ],

    // Step 7 — round 2 addition. Real submissions come later; this is
    // just the placeholder structure/layout Faye asked to have built
    // now, framed as a lightweight community/discussion space.
    community_gallery: {
      title: 'From Other Students',
      subtitle: "Real student work will appear here once it's shared.",
      placeholderCount: 4
    },

    // Step 8 — round 2 addition, so the completion step can chain into
    // the next lesson without index.html hardcoding a path. Lessons
    // 02-26 each supply their own next_lesson (or omit it on the last
    // lesson of a unit/course).
    next_lesson: {
      href: '../lesson-02-wide-full-shot/',
      title: 'Wide / Full Shot',
      subtitle: 'Character + World'
    },

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
