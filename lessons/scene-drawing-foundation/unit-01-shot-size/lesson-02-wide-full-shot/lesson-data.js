/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 02 — LIVE
 * Wide Shot — Character + World, Together
 *
 * This is the "Learning Canvas" redesign, PROMOTED to the real live
 * path on 2026-09-14 (built and reviewed across 2 local rounds at a
 * parallel lesson-02-wide-full-shot-v2/ path first, which no longer
 * exists). The original 13-stage build is archived, not deleted, at
 * ../_archive/lesson-02-wide-full-shot-original/.
 *
 * Same shell/pattern as the now-live Lesson 01
 * (lesson-01-extreme-wide-shot/lesson-data.js) — this file follows
 * that one's field-naming conventions directly rather than inventing
 * new ones, per the brief's "should feel like a direct sibling of
 * Lesson 01" instruction. Differences from Lesson 01's shape, each
 * flagged inline below where they occur:
 *   - no intro_video field — this lesson opens straight into a 3D
 *     scene (interactive_scene), per the brief's explicit "no video"
 *     instruction.
 *   - concept_contrast (Step 2) is new — Lesson 01 had no equivalent
 *     step contrasting itself against an already-known shot size.
 *   - story_scenes (Step 3) is new — six full demonstration scenes
 *     (own 3D build + comprehension question each), where Lesson 01's
 *     equivalent step (story_prompts) was six small illustrated
 *     tap-reveal cards, not full 3D scenes. Rendered as SIX separate
 *     top-level STEPS entries in index.html (not nested sub-stages)
 *     specifically to avoid reproducing Lesson 01 round 5's
 *     Previous-navigation bug (see index.html's own note).
 *   - (retired) story_choices / drawing_steps — the pick-one-of-six
 *     step and the shared step-by-step guided drawing were removed
 *     when every scene got its own drawing round (two-panel: that
 *     scene's teacher_references video + the student's canvas, Lesson
 *     01's practice format applied course-wide, per Faye).
 *   - teacher_references — NEW shape vs. Lesson 01's student_examples:
 *     one item PER SCENE (6 slots, keyed by sceneId). Round 2: now
 *     shown as a small expandable overlay DURING each of the six
 *     scenes in Step 3, AND enlarged as the left panel of each
 *     scene's own drawing round — see index.html's
 *     renderTeacherOverlay / renderStoryDraw.
 *     The final community step (old Step 6) no longer shows a teacher
 *     reference at all, per Faye's round-2 instruction — it now shows
 *     only the student's own saved work + the community gallery.
 *   - story_scenes[].situationLine — round 2 addition, the one-line
 *     story sentence typed out during each scene's new pre-reveal
 *     sequence ("Situation N: ..."), per Faye's explicit example
 *     wording. Distinct from `question` (the comprehension prompt
 *     shown once the scene has settled).
 *   - scenes_intro — round 2 addition, the two-card intro shown once
 *     before Situation 1 (title card + a short explainer card).
 *
 * id/courseId are UNCHANGED from the archived original on purpose —
 * this is a redesign of the SAME lesson, not a new one, so it stays
 * compatible with the already-wired completedLessons entry and the
 * scene_drawing_unit_01 badge (core/course-badge-registry.js). No
 * real student progress existed under this id to orphan at promotion
 * time (no real users yet), but the id stays stable regardless, per
 * Faye's standing rule against renaming identifiers this system
 * already keys data on.
 * ============================================================ */
(function (global) {
  'use strict';

  const LESSON_DATA = {
    id: 'wide-full-shot',
    unit: 'unit-01-shot-size',
    courseId: 'wide-full-shot',
    title: 'Wide Shot',
    subtitle: 'Character + World, Together',

    // Step 1 (round 6, new) — the push-in opening moment Medium Shot
    // and Close-Up both already open with, extended to this lesson per
    // Faye: "Wide Shot currently has no equivalent, and it should."
    // Same shared ShotSizeCompare component (../../shared/shot-size-
    // compare.js), sliced to its first TWO stops (ews/ws) so it ends on
    // Wide Shot — see index.html's renderWideConcept/afterRenderWideConcept,
    // which mirror Lesson 03's renderMediumConcept pattern exactly
    // (same component, same mount, just a shorter stop list).
    // stopCaptions override DEFAULT_STOPS' own wording so the copy
    // lives with this lesson, same convention as Lessons 03/04.
    concept_moment: {
      stopCaptions: {
        ews: 'Extreme Wide: the world fills the frame.',
        ws: 'Wide: the whole person — and the place around them.'
      },
      closingLine: 'Drag the slider to compare.'
    },

    // Step 2 — 3D classroom reveal, no video (per the brief). See
    // index.html's renderClassroomReveal — built from the same
    // primitive-based Three.js toolkit as Lesson 01's Step 2, with an
    // articulated (head/torso/2-segment limbs) character builder
    // instead of Lesson 01's simple cloak silhouette, since this
    // lesson's brief explicitly asks for a step up in character
    // detail/posing.
    interactive_scene: {
      kind: 'classroom_reveal_3d',
      termLabel: 'WIDE SHOT'
    },

    // Step 3 — concept explainer, contrasting directly against
    // Extreme Wide Shot (Lesson 01), copy close to verbatim from the
    // brief. These four references are curated by Faye and delivered
    // through Cloudflare Images. Keep the order intentional: learners
    // read them as four visual examples of the same shot-size idea.
    concept_contrast: {
      extremeWideLine: 'Extreme Wide Shot: the environment dominates over the character.',
      wideLine: "Wide Shot: the character's full body is basically visible — you can tell WHERE the character is and WHAT is happening.",
      references: [
        { title: 'The whole character and the setting share the frame', category: 'WIDE SHOT · REFERENCE 01', image: 'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/56430090-498c-483a-c54c-58ccdaf68700/public', alt: 'Wide shot reference showing a full character within a surrounding scene' },
        { title: 'Body language remains easy to read', category: 'WIDE SHOT · REFERENCE 02', image: 'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/305be1b3-31e9-4361-090c-7b66104c9500/public', alt: 'Wide shot reference showing readable character action and environment' },
        { title: 'The environment explains where the action happens', category: 'WIDE SHOT · REFERENCE 03', image: 'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/2207d4ef-6062-491d-3962-907d917ff700/public', alt: 'Wide shot reference balancing the character with the place around them' },
        { title: 'Character and story action appear together', category: 'WIDE SHOT · REFERENCE 04', image: 'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/2c429b72-5f40-4b64-f77f-612ef24b4100/public', alt: 'Wide shot reference showing a full figure and visible story action' }
      ]
    },

    // Round 2 — two-card intro shown once, before Situation 1's reveal
    // sequence. Copy is Claude Code's own wording (the brief invited a
    // reword "if something reads more natural in context" and asked
    // to flag it, not match a given line verbatim) — flagged here per
    // that instruction, not silently written as if it were given.
    scenes_intro: {
      titleCard: 'Scene Drawing Practice',
      explainerCard: "You'll walk through six short story situations, one at a time — the last one is optional. Just watch and think for now — you'll pick one to draw after."
    },

    // Step 4 — six demonstration scenes (own 3D build + a short
    // comprehension question each), exploration only, no drawing yet.
    // Each maps to its own top-level STEPS entry in index.html
    // (STORY_SCENE_STEPS) — see that file's own note on why this is
    // flat, not nested. `sceneKey` selects which of index.html's
    // SCENE3D_BUILDERS to mount; `question`/`altQuestion` are the
    // brief's own wording verbatim (altQuestion shown as a smaller
    // second line where the brief gave one). `situationLine` (round 2)
    // is the one-line story sentence typed out during the new
    // pre-reveal sequence, matching the brief's own given example
    // format ("A girl runs into the classroom, late for class.") —
    // Scene 1's line is that exact example; the other five are Claude
    // Code's own summaries of each scene's brief description, flagged
    // here since none were given verbatim.
    story_scenes: [
      {
        id: 'late_for_class', sceneKey: 'lateForClass', setting: 'indoor',
        title: 'Late for Class',
        situationLine: 'A girl runs into the classroom, late for class.',
        question: 'Who arrived late? What is her friend doing?',
        altQuestion: 'Why do we need a Wide Shot for this scene?'
      },
      {
        id: 'art_project', sceneKey: 'artProject', setting: 'indoor',
        title: 'The Art Project',
        situationLine: 'Two friends work together on an art project at a table.',
        question: 'Are they working together, or arguing?',
        altQuestion: null
      },
      {
        id: 'after_school', sceneKey: 'afterSchool', setting: 'outdoor',
        title: 'See You After School',
        situationLine: 'Two friends walk out through the school gate together.',
        question: 'What are they going to do next?',
        altQuestion: null
      },
      {
        id: 'lost_ball', sceneKey: 'lostBall', setting: 'outdoor',
        title: 'The Lost Ball',
        situationLine: 'Two kids search the park for a ball they lost.',
        question: 'Where is the ball? Who finds it first?',
        altQuestion: null
      },
      {
        id: 'rainy_day', sceneKey: 'rainyDay', setting: 'outdoor',
        title: 'Rainy Day Surprise',
        situationLine: 'Two friends share an umbrella — and one steps in a puddle.',
        question: 'What happened one second ago?',
        altQuestion: null
      },
      {
        id: 'sleepover', sceneKey: 'sleepover', setting: 'indoor',
        // optional: true — Faye's retroactive fix (found in testing: by
        // the 5th of six drawing rounds many students are tired). The
        // pattern going forward is 5 required + 1 optional. index.html
        // shows a "try it / skip" gate before this scene's reveal.
        optional: true,
        title: 'The Sleepover',
        situationLine: 'Two best friends build a blanket fort at a sleepover.',
        question: 'What are they building together?',
        altQuestion: null
      }
    ],

    audio: {
      narrationAvailable: false
    },

    // Round 3 (Faye's correction, matching Lesson 01's own): renamed
    // "Teacher Reference" -> "Quick Sketch Reference" throughout — the
    // old name implied one authoritative correct answer, same fix
    // already applied to Lesson 01's practice videos. Real videos for
    // Scenes 1-5 (Faye-produced, Cloudflare Stream) via demoVideoStreamId
    // — same field name/meaning as Lesson 01's story_choices, and the
    // same data-driven fallback: null/absent means the placeholder
    // "coming soon" lightbox state, not an error. Scene 6
    // stays placeholder:true until Faye supplies its video.
    // posterTimeSecs (optional): which second of the video to use as the
    // corner-preview/poster frame — the default first frame of these
    // timelapse sketches is a blank white page, so the overlay showed
    // nothing recognizable. Set ~85-90% through each video (durations
    // 27-71s) so the preview shows a near-finished sketch.
    teacher_references: [
      { sceneId: 'late_for_class', label: 'Quick Sketch Reference — Late for Class', demoVideoStreamId: '5aef7587f314a6b478802d14639408b3', posterTimeSecs: 24 },
      { sceneId: 'art_project', label: 'Quick Sketch Reference — The Art Project', demoVideoStreamId: '2ddecd6ee5218854539cbeeae06ea139', posterTimeSecs: 51 },
      { sceneId: 'after_school', label: 'Quick Sketch Reference — See You After School', demoVideoStreamId: '21083caaff84263e5c4de320a53516fc', posterTimeSecs: 64 },
      { sceneId: 'lost_ball', label: 'Quick Sketch Reference — The Lost Ball', demoVideoStreamId: 'caf012455c1a95a9bbe668912b48e3cf', posterTimeSecs: 42 },
      { sceneId: 'rainy_day', label: 'Quick Sketch Reference — Rainy Day Surprise', demoVideoStreamId: '6ab180787a491ed62b1e6a8410513b55', posterTimeSecs: 30 },
      { sceneId: 'sleepover', label: 'Quick Sketch Reference — The Sleepover', placeholder: true }
    ],

    // Round 2: the final community step now shows ONLY the student's
    // own work + this gallery — the teacher-reference card that used
    // to sit alongside it moved to a per-scene overlay in Step 3 (see
    // teacher_references above). Faye has real photos of other
    // students' drawings for this gallery but hasn't sent them yet —
    // placeholderCount stays a placeholder grid until she does, same
    // pattern as Step 3's reference images.
    community_gallery: {
      title: 'From Other Students',
      subtitle: 'Real work from students who took this lesson.',
      // Same shape as Lesson 01's community_gallery.items (src + alt),
      // plus `credit` — shown as a visible caption under each drawing
      // (index.html's renderTeacherCommunity). Faye confirmed: full name
      // "Amy Huang" (not a first-name/initial form), both drawings hers.
      // Faye also confirmed the second drawing's visible "Selena" in its
      // speech bubble stays as-is, uncropped.
      items: [
        { src: 'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/f1ce61b6-9a71-4c09-de55-705314f4c000/public', credit: 'Amy Huang', alt: 'Student artwork from the Wide Shot lesson: four wide-shot scenes (school gate, rainy day, lost ball, sleepover), by Amy Huang' },
        { src: 'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/f4cf5e1f-1cc1-4e83-b4b0-143f8b2e7d00/public', credit: 'Amy Huang', alt: 'Student artwork from the Wide Shot lesson: a two-panel wide-shot sketch of a school hallway and art classroom, by Amy Huang' }
      ],
      // Only used when items is empty (same data-driven fallback as
      // Lesson 01).
      placeholderCount: 4
    },

    // Bonus appendix (round 6, new) — "See This Idea in Real Art & Film"
    // moved OUT of Lesson 01 per Faye (it used to live inside that
    // lesson's "When Might We Step Back" step — see that lesson-data.js's
    // own note). Replaced here with new, different, simpler content:
    // not the 4-item real-art/film gallery (that stays removed, not
    // ported), just a short explainer specifically about Extreme Wide
    // Shot itself — what/when/how it looks — matching the course's
    // minimal-text convention. Lives on the completion screen as a
    // closed-by-default collapsible card (confirmed with Faye: never
    // gates or reorders anything — completion/XP/badge already fired
    // before a student ever opens it), same collapsible mechanism as
    // the resource callout that used to live in Lesson 01
    // (renderResourceCallout/toggleResourceCallout — ported here as
    // renderBonusCallout/toggleBonusCallout since that original pair
    // no longer exists in Lesson 01). Copy is Claude Code's own
    // wording (flagged, nothing given verbatim), reusing Lesson 01's
    // existing small scene illustrations (card1/card5) rather than
    // commissioning new art for what's explicitly a lightweight bonus.
    bonus_extreme_wide: {
      title: 'Also Get to Know: Extreme Wide Shot',
      intro: "Before Wide Shot, there's Extreme Wide Shot — the whole world, with the character tiny inside it.",
      points: [
        { label: 'WHAT IT IS', text: 'The place fills almost the whole frame — the character is just a small part of it.' },
        { label: 'WHEN IT IS USED', text: 'Opening a story, showing a big journey, or making a character feel small, alone, or far from home.' },
        { label: 'WHAT IT LOOKS LIKE', text: 'Mountains, cities, oceans, forests — with one tiny figure somewhere inside.' }
      ],
      images: [
        { src: '../lesson-01-extreme-wide-shot/card1-storm-valley-illustration-only.png', alt: 'A storm moving across a wide valley, with a tiny figure below' },
        { src: '../lesson-01-extreme-wide-shot/card5-new-world-illustration-only.png', alt: 'A tiny figure arriving in a huge, unfamiliar world' }
      ],
      sketchPrompt: 'Want to try it? Sketch a huge place with one tiny character somewhere inside it — digitally or on paper, just for fun.'
    },

    // Step 8 — chains into Lesson 03 (Medium Shot). Title/subtitle
    // copied from lesson-03-medium-shot/lesson-data.js's own
    // welcome.title/subtitle so this card matches what that lesson
    // actually calls itself.
    next_lesson: {
      href: '../lesson-03-medium-shot/',
      title: 'Medium Shot',
      subtitle: 'Show the Action'
    },

    completion_check: {
      question: 'What does a Wide Shot help us show?',
      options: ['The Character', 'The Place', 'The Action', 'Both Together']
    }
  };

  global.LESSON_DATA = LESSON_DATA;
})(window);
