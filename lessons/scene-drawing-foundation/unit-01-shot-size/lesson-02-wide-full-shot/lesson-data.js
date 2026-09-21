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
 *   - story_choices (Step 4) — six items instead of three, same
 *     shape otherwise.
 *   - teacher_references — NEW shape vs. Lesson 01's student_examples:
 *     one item PER SCENE (6 slots, keyed by sceneId). Round 2: now
 *     shown as a small expandable overlay DURING each of the six
 *     scenes in Step 3 (not just once, for whichever scene the
 *     student eventually picks) — see index.html's renderTeacherOverlay.
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

    // Step 1 — 3D classroom reveal, no video (per the brief). See
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

    // Step 2 — concept explainer, contrasting directly against
    // Extreme Wide Shot (Lesson 01), copy close to verbatim from the
    // brief. `references` are curated by Faye herself later (her own
    // illustrations, same process as Lesson 01's Step 4 "See It in
    // Art") — every item below is placeholder:true and clearly
    // flagged in index.html's rendering, same established convention
    // as every other placeholder asset in this project (e.g. the old
    // lesson-02's svgPlaceholder cards). Swapping in real images later
    // needs no index.html change — only this array.
    concept_contrast: {
      extremeWideLine: 'Extreme Wide Shot: the environment dominates over the character.',
      wideLine: "Wide Shot: the character's full body is basically visible — you can tell WHERE the character is and WHAT is happening.",
      references: [
        { title: 'Reference coming soon', category: 'PAINTING', placeholder: true },
        { title: 'Reference coming soon', category: 'ILLUSTRATION', placeholder: true },
        { title: 'Reference coming soon', category: 'ANIMATION', placeholder: true },
        { title: 'Reference coming soon', category: 'FILM', placeholder: true }
      ]
    },

    // Round 2 — two-card intro shown once, before Situation 1's reveal
    // sequence. Copy is Claude Code's own wording (the brief invited a
    // reword "if something reads more natural in context" and asked
    // to flag it, not match a given line verbatim) — flagged here per
    // that instruction, not silently written as if it were given.
    scenes_intro: {
      titleCard: 'Scene Drawing Practice',
      explainerCard: "You'll walk through six short story situations, one at a time. Just watch and think for now — you'll pick one to draw after."
    },

    // Step 3 — six demonstration scenes (own 3D build + a short
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
        title: 'The Sleepover',
        situationLine: 'Two best friends build a blanket fort at a sleepover.',
        question: 'What are they building together?',
        altQuestion: null
      }
    ],

    // Step 4 — Choose Your Scene. Same card mechanism as Lesson 01's
    // Choose Your Story (index.html's story-grid/story-card CSS,
    // reused as scene-grid/scene-card), six choices instead of three.
    // `thumbSceneKey` reuses the SAME SCENE3D_BUILDERS key as Step 3 —
    // no separate thumbnail art needed, a still frame's worth of the
    // same scene the student already watched is rendered small as an
    // SVG-free static preview (see index.html's sceneThumbSvg()).
    story_choices: [
      { id: 'late_for_class', title: 'Late for Class', thumbSceneKey: 'lateForClass' },
      { id: 'art_project', title: 'The Art Project', thumbSceneKey: 'artProject' },
      { id: 'after_school', title: 'See You After School', thumbSceneKey: 'afterSchool' },
      { id: 'lost_ball', title: 'The Lost Ball', thumbSceneKey: 'lostBall' },
      { id: 'rainy_day', title: 'Rainy Day Surprise', thumbSceneKey: 'rainyDay' },
      { id: 'sleepover', title: 'The Sleepover', thumbSceneKey: 'sleepover' }
    ],

    // Step 5 — guided drawing. SCOPE FLAG, same simplification Lesson
    // 01 made and flagged in its own file: ONE shared progressive
    // drawing sequence, not six bespoke ones per scene (no real
    // per-scene drawing-stage art exists yet) — the chosen scene only
    // changes the context line shown alongside the same 5 stages.
    // Content here teaches WIDE SHOT construction specifically
    // (character placed full-body + environment built around them),
    // not Lesson 01's Extreme-Wide "tiny character in a huge world"
    // sequence — genuinely different teaching content, not a reskin.
    drawing_steps: [
      {
        instruction: 'Decide where your character stands.',
        teachingNote: "Leave room above their head and below their feet — a Wide Shot needs the character's full body inside the frame, not touching the edges."
      },
      {
        instruction: 'Block in the character, full body.',
        teachingNote: "Head to toe should already read clearly at this stage, even as a simple shape — that's what makes it a Wide Shot instead of a close-up."
      },
      {
        instruction: 'Build the space around them.',
        teachingNote: 'Add the floor, walls, or ground line the character is standing on — this is what tells us WHERE they are.'
      },
      {
        instruction: 'Add one or two props that explain the action.',
        teachingNote: "A desk, a ball, an umbrella — one clear object nearby is what tells us WHAT is happening, without needing any words."
      },
      {
        instruction: 'Finish the character’s pose and expression.',
        teachingNote: 'Because the whole body is visible, the pose itself can tell the story — a lean, a reach, a turned head all read clearly at this size.'
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

    // Step 7 — chains into Lesson 03 (Medium Shot). Title/subtitle
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
