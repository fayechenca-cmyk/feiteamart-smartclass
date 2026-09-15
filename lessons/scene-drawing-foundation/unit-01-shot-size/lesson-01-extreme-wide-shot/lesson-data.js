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
 * reference_resources / practice_intro / story_choices /
 * drawing_steps / audio / community_gallery / completion_check) so a
 * future lesson can supply the same shape without index.html
 * changing.
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
 *   - community_gallery — new placeholder field for Step 7's
 *     community/discussion-style section (real submissions later).
 *   - next_lesson — new field so Step 8 can chain into Lesson 02
 *     without index.html hardcoding a path; each future lesson
 *     supplies its own.
 *
 * PRACTICE-SECTION RESTRUCTURE (live, post-promotion round — real
 * UX/content change to already-shipped content, not a new lesson):
 *   - Removed the "pick ONE of three stories" mechanic entirely
 *     (old choose_story step + STATE.storyChoiceId). The student now
 *     goes through ALL THREE story_choices in sequence — each with
 *     its own storyline reveal (typed out, "Story A/B/C" labeled) +
 *     its own two-panel guided-drawing round (teacher's guide on the
 *     left, the student's own canvas — formerly a separate "Try It
 *     Yourself" step — on the right). See index.html's
 *     STORY_PRACTICE_STEPS/renderStoryPractice for the mechanism.
 *   - Removed demoVideoStreamId/demoDisclaimer/audioSrc from each
 *     story_choices item — these existed only to feed the old
 *     per-story teacher-DEMO-VIDEO step (Step 6b), which this
 *     restructure also removes (see index.html's own note on why:
 *     it depended entirely on the now-deleted single-story-choice
 *     mechanic, and its actual teaching content — watching the
 *     teacher draw this specific story — is now shown inline, live,
 *     in every story's own two-panel round, making a separate video
 *     step doubly redundant even before considering it was 100%
 *     unconfigured placeholder with zero real video content to lose).
 *   - Removed student_examples entirely — the old Teacher/Student
 *     Reference compare-cards it fed are gone too (redundant with the
 *     teacher's guide now being shown three times, once per story,
 *     during practice itself). See index.html's renderCompare —
 *     retitled "Student Artwork Community," now gallery + a submit
 *     prompt only, no reference cards.
 *   - practice_intro — new field for the two-card intro shown once,
 *     before Story A ("Let's have a practice" + a short explainer).
 *   - story_choices[].title doubles as each story's typed-out
 *     storyline text during its reveal — no new field needed, this
 *     was already the exact line each story tells.
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

    // Step 3 (folded in as a text/link resource callout — see
    // index.html's renderResourceCallout; this used to be its own
    // Step 4 "Look Closer" step with embedded images) — real, verified
    // references. Every URL below was checked live, not invented.
    // Rights were checked per item — see rightsStatus on each for the
    // reasoning:
    //   - Cleveland Museum of Art explicitly labels 1953.126 Open
    //     Access/CC0 ("copy, modify, and distribute... without asking
    //     permission").
    //   - Ghibli, Star Wars and the Prado all hold conventional
    //     copyright (the Prado additionally asserts separate
    //     photographic copyright over its own museum photos even
    //     though Bosch's 500-year-old painting itself is public
    //     domain — confirmed via the Prado's own Image
    //     Bank/Terms/License pages).
    // FOLLOW-UP ROUND: previewType/previewImage below are no longer
    // consumed by index.html at all — the callout is text/link only
    // for all four now, not even the FEI-inspired preview
    // illustrations the old image-led step used for the three
    // copyrighted ones (a derivative illustration is still a
    // derivative). Left in the data as an audit trail of the rights
    // research already done per item, not because anything still
    // reads them. sourceUrl still points at the real, specific
    // official page for every item either way.
    reference_resources: {
      items: [
        {
          id: 'ghibli', category: 'ANIMATION', title: 'Spirited Away',
          creator: 'Studio Ghibli', year: '2001',
          previewType: 'fei-inspired-preview', previewImage: null,
          sourceName: 'Studio Ghibli — official site',
          sourceUrl: 'https://www.ghibli.jp/works/chihiro/',
          rightsStatus: 'Film stills are copyrighted by Studio Ghibli — not reused here. This preview is an original FEI TeamArt illustration inspired only by the spatial idea (a tiny traveler beside a huge, quiet, reflective world), not a reproduction of Chihiro, No-Face, the train, or any Ghibli character/frame.',
          observation: 'A tiny character inside a very large, quiet world.'
        },
        {
          id: 'starwars', category: 'FILM', title: 'Star Wars',
          creator: 'Lucasfilm / Disney', year: null,
          previewType: 'fei-inspired-preview', previewImage: null,
          sourceName: 'StarWars.com — official Databank: Tatooine',
          sourceUrl: 'https://www.starwars.com/databank/tatooine',
          rightsStatus: 'Film stills are copyrighted by Lucasfilm/Disney — not reused here. This preview is an original FEI TeamArt illustration inspired only by the spatial idea (a tiny craft against an enormous twin-sun desert horizon), not a reproduction of any Star Wars vehicle, character, logo, or exact scene.',
          observation: 'A small subject can make a huge world feel even larger.'
        },
        {
          id: 'cma-streams', category: 'INK PAINTING', title: 'Streams and Mountains without End',
          creator: 'Unknown artist, China (late Northern Song–Jin dynasty)', year: 'c. 1100–1150',
          previewType: 'open-access-original', previewImage: 'card3-streams-mountains-cma.jpg',
          sourceName: 'Cleveland Museum of Art (Open Access)',
          sourceUrl: 'https://www.clevelandart.org/art/1953.126',
          rightsStatus: 'Cleveland Museum of Art Open Access program: object 1953.126 is explicitly marked CC0 ("copy, modify, and distribute this work, all without asking permission"). Image shown is a wide detail crop from the museum’s own released file (the work is a ~11m handscroll, so the full scroll is not shrunk into one unreadable strip); VIEW ORIGINAL opens the complete artwork page. Not a claim that Song-dynasty painters used a cinematic "Extreme Wide Shot" — shown as a similar visual idea: a very large view where the landscape dominates the image.',
          observation: 'Tiny people and buildings sit inside a much larger landscape.'
        },
        {
          id: 'bosch-garden', category: 'PAINTING', title: 'The Garden of Earthly Delights',
          creator: 'Hieronymus Bosch', year: 'c. 1490–1500',
          previewType: 'fei-inspired-preview', previewImage: null,
          sourceName: 'Museo Nacional del Prado — official artwork page',
          sourceUrl: 'https://www.museodelprado.es/en/the-collection/art-work/the-garden-of-earthly-delights-triptych/02388242-6d6a-4e9e-a992-e1311eab3609',
          rightsStatus: 'The painting itself is public domain by age, but the Prado’s own photograph of it is separately copyrighted by the museum and requires a paid license (confirmed via the Prado’s Image Bank/Terms and Conditions/License Agreement pages) — reuse is not freely available, so this preview is an original FEI TeamArt illustration inspired only by the spatial idea (a huge imagined world holding many tiny scattered scenes), not a reproduction of Bosch’s figures, creatures, architecture, or triptych composition.',
          observation: 'A huge imagined world can hold many tiny scenes at once.'
        }
      ]
    },

    // Step 4 (new) — the two-card practice intro, shown once before
    // Story A. Copy is Claude Code's own wording — "Let's have a
    // practice" is the brief's exact title, but the explainer line
    // below it was not given verbatim, flagged per the brief's own
    // "flag if you land on different copy" instruction.
    practice_intro: {
      title: "Let's have a practice",
      line: "You'll train this skill with three different story situations, one at a time."
    },

    // Steps 5-7 (restructured) — `direction` is internal art-direction
    // guidance (for whoever illustrates story_choices later), not
    // student-facing copy — index.html never prints it to the
    // student. `title` doubles as the story's own typed-out storyline
    // text during its reveal sequence (index.html's
    // renderStoryPractice) — the exact same three lines the old
    // Choose Your Story step showed, unchanged.
    // `demoVideoStreamId` (real quick-sketch video for the LEFT panel
    // of a story's two-panel guided-drawing round — see index.html's
    // renderTwoPanelMarkup/attachStoryTeacherVideo/playQuickSketchDemo).
    // All three stories have one now, real and produced by Faye. Kept
    // as a per-story field (not hoisted out) rather than deleted now
    // that every story has one — a future lesson reusing this same
    // shape may still ship without video for some/all of its stories,
    // and the platform-led drawingSvg() demo (playQuickSketchDemo)
    // stays the null-case fallback for that, rendered the same "quick
    // sketch, no step controls" way either way as of the round-3
    // redesign.
    story_choices: [
      {
        id: 'spring',
        title: 'Winter has passed. Is spring getting closer?',
        direction: 'Large quiet winter/spring transitional landscape. Poetic, spacious, calm.',
        demoVideoStreamId: 'ecc1b06c9eb16a7b2255ca6e4e0ea358'
      },
      {
        id: 'forest',
        title: 'Late at night, I became lost in the forest.',
        direction: 'Side-view forest composition. Trees overlap other trees. Large foreground trunks. Small figure. No obvious one-point-perspective road.',
        demoVideoStreamId: '46de23f044685b5ef2b4c06b8e3ed868'
      },
      {
        id: 'newworld',
        title: 'After travelling for a long time, I suddenly discovered an incredible new world.',
        direction: 'Wonder / discovery. Large unknown world. Small traveler. Distinct from A and B.',
        demoVideoStreamId: '2da068f264530cc59193add39876ddda'
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
    // Round 3 (quick-sketch redesign): index.html no longer displays
    // either field — the per-stage caption/teaching-note text went
    // away with the manual step-by-step tutorial UI it belonged to
    // (see index.html's playQuickSketchDemo comment). Left in place
    // rather than deleted in case a future per-stage caption format
    // comes back in some other form.
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

    // Step 7 — "Student Artwork Community" (renamed from "Same Idea.
    // Different Scenes."). The old Teacher/Student reference compare-
    // cards this field used to feed are gone — the teacher's guide is
    // now shown three times, inline, during practice itself (once per
    // story), so showing it a fourth time here was redundant. This
    // step is now gallery + a submit prompt only.
    // Round 5: "shared community" framing kept — the whole point of
    // this section is "my work + my classmates' work, together," not
    // a private result screen.
    // `items` — 5 real photos of student work, supplied by Faye.
    // `placeholderCount` stays as the fallback for `items` being empty
    // (a future lesson reusing this same field shape before it has real
    // photos yet) — see index.html's renderCompare for the branch.
    community_gallery: {
      title: 'From Other Students',
      subtitle: 'Real work from students who took this lesson.',
      items: [
        { src: 'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/f592c68c-cafd-4970-ac71-7e5e708a5700/public', alt: 'Student artwork from the Extreme Wide Shot lesson, 1 of 5' },
        { src: 'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/f0f56d3e-ba4a-47b2-95a0-5bcd26f1c500/public', alt: 'Student artwork from the Extreme Wide Shot lesson, 2 of 5' },
        { src: 'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/e27d650d-825e-47e3-2be2-9ca992628400/public', alt: 'Student artwork from the Extreme Wide Shot lesson, 3 of 5' },
        { src: 'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/9611b795-b2de-42ad-2f31-5107cecee500/public', alt: 'Student artwork from the Extreme Wide Shot lesson, 4 of 5' },
        { src: 'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/12cf92b6-f11d-421d-74fc-4919885a1f00/public', alt: 'Student artwork from the Extreme Wide Shot lesson, 5 of 5' }
      ],
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
