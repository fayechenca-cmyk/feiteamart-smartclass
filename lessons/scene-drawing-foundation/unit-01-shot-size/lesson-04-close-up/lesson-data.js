/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 04 — LIVE
 * Close-Up — Look Closer
 *
 * The "Learning Canvas" build, built DIRECTLY on this real path (same
 * standing simplification Lessons 02-03 use — no -v2 staging). Replaces
 * the original 13-stage/CameraZoomSlider build, which is archived (not
 * deleted) at ../_archive/lesson-04-close-up-original/.
 *
 * Follows Lesson 03's shape directly (see
 * ../lesson-03-medium-shot/lesson-data.js) — same concept_moment /
 * scenes_intro / story_scenes / teacher_references / community_gallery /
 * next_lesson / completion_check fields, same per-story pattern (tip ->
 * "Situation N" reveal -> 3D scene -> Quick Sketch Reference -> two-panel
 * drawing round). Differences, each flagged inline:
 *   - concept_moment (Step 1) pushes ShotSizeCompare one stop further
 *     than Lesson 03's (Extreme Wide -> Wide -> Medium -> Close-Up,
 *     using the shared component's new 'cu' stop — see
 *     ../../shared/shot-size-compare.js), then reveals a short written
 *     block once the slider rests on Close-Up: the two framing lines
 *     Faye gave close to verbatim, the four categories (Emotion/Action/
 *     Detail/Clue), the "not just faces" line, and the "background gets
 *     quiet, not gone" principle. All Claude Code's own copy EXCEPT the
 *     three lines flagged inline in concept_moment below, which are
 *     Faye's own wording (near-verbatim per her instruction).
 *   - story_scenes carry `category` (one of Emotion/Action/Detail/Clue,
 *     or the bonus "Relationship" on the optional 6th story) alongside
 *     `tip` + `framing`, shown on both the pre-scene tip card and the
 *     post-scene question card. Faye's storyboard sheet
 *     (reference-images/lesson04-close-up-storyboard-reference.png)
 *     already labels all 6 panels with their exact story title/category
 *     in written order — no mapping ambiguity, unlike Lesson 03's sheet.
 *   - every 3D scene keeps a faint trace of its environment behind the
 *     close-up subject (fog + a few simple background props), never a
 *     blank backdrop — Faye's explicit "quieter, not gone" rule. See
 *     each scene builder's own comment in index.html for what that
 *     trace is.
 *
 * id/courseId are UNCHANGED from the archived original on purpose —
 * core/course-badge-registry.js's scene_drawing_unit_01 badge already
 * keys off 'close-up'.
 * ============================================================ */
(function (global) {
  'use strict';

  const LESSON_DATA = {
    id: 'close-up',
    unit: 'unit-01-shot-size',
    courseId: 'close-up',
    title: 'Close-Up',
    // Short "Show X" form, matching Lessons 02/03's subtitle convention
    // (and Lesson 05's own 'Show the Detail') — picked to echo the
    // "close-up = look closer at what matters" line below, since "Show
    // Emotion" (the pre-rebuild subtitle) undersold a lesson that's
    // explicitly about 4 categories, not just faces.
    subtitle: 'Look Closer',

    // Step 1 — full-screen, video-like explanation moment (NOT a video),
    // same ShotSizeCompare device as Lesson 03's Step 1, pushed one stop
    // further to the shared component's new 'cu' (Close-Up) stop. The
    // slider autoplays through all 4 stops; once it rests on Close-Up,
    // a short written block reveals below it (see index.html's
    // renderCloseupConcept/afterRenderCloseupConcept).
    concept_moment: {
      stopCaptions: {
        ews: 'Extreme Wide: the world fills the frame.',
        ws: 'Wide: the whole person — and the place around them.',
        ms: 'Medium: the person leads. The background supports them.',
        // The storyboard sheet's own tagline, used verbatim per Faye's
        // instruction, doubling as this stop's caption.
        cu: 'The world gets smaller. The important details get bigger.'
      },
      // Faye's own wording, near-verbatim (her instruction: "use this
      // close to verbatim").
      lines: [
        'Close-up = look closer at what matters.',
        'Close-up is not simply drawing something bigger. We move closer because something has become important.'
      ],
      // The four categories the six practice stories are built around.
      // Wording (labels + one-line glosses) is Claude Code's own —
      // flagged, kept short per the brief's "not a wall of text".
      categories: [
        { label: 'Emotion', desc: 'a face, tense or surprised' },
        { label: 'Action', desc: 'a hand doing something' },
        { label: 'Detail', desc: 'one object that matters' },
        { label: 'Clue', desc: 'a hint about the story' }
      ],
      notJustFaces: 'A close-up can be a face — or hands, an object, or a single action.',
      backgroundNote: "The background doesn't disappear — it just gets quiet: a blurred wall, a table edge, a hallway line."
    },

    // Two-card intro before Situation 1. Copy is Claude Code's own
    // wording (flagged — none was supplied verbatim), same pattern as
    // Lesson 03's scenes_intro.
    scenes_intro: {
      titleCard: 'Close-Up Practice',
      explainerCard: "Six short stories — five to draw, and a sixth that's optional. Each one starts with a tip, then you'll see the scene and sketch it yourself."
    },

    // Step 2 — six Close-Up stories, in Faye's written order (which
    // matches her storyboard sheet's own labeled panel order this
    // time — no mapping ambiguity, unlike Lesson 03).
    //   category — one of Emotion / Action / Detail / Clue (the four
    //              taught in Step 1), or the bonus "Relationship" on
    //              the optional 6th story. Shown as a kicker on both
    //              the pre-scene tip card and the post-scene question
    //              card.
    //   tip      — Faye's own tip text, shown before the scene appears.
    //   framing  — one short line telling the student how the shot is
    //              framed. Claude Code's own wording, derived from
    //              Faye's per-story framing descriptions.
    //   situationLine — the typed "Situation N: ..." sentence; Claude
    //              Code's own one-line summary of each written story.
    story_scenes: [
      {
        id: 'unlocking_door', sceneKey: 'unlockingDoor', setting: 'indoor',
        category: 'Action',
        title: 'Unlocking the Door',
        situationLine: 'At midnight, a hand turns a key — the door opens just a crack.',
        framing: 'Frame in tight on the hand, the key, and the lock.',
        tip: "What exactly is happening? It's not about what the room looks like — focus on the key, fingers, lock, and that tiny opening."
      },
      {
        id: 'frightened_face', sceneKey: 'frightenedFace', setting: 'indoor',
        category: 'Emotion',
        title: 'A Frightened Face',
        situationLine: 'A girl freezes — she just heard or saw something scary.',
        framing: 'Frame just her head — and maybe a little shoulder.',
        // Faye's own instruction folded into the tip text: let the
        // student invent their own backstory, don't give a specific
        // answer.
        tip: "What did they just see? There's no right answer — decide it yourself."
      },
      {
        id: 'glass_of_water', sceneKey: 'glassOfWater', setting: 'indoor',
        category: 'Detail / Action',
        title: 'The Glass of Water',
        situationLine: "A hand reaches for a glass of water, fingers about to close around it.",
        framing: 'Fill most of the frame with the glass — show only part of the table.',
        tip: "What's the story behind this glass of water? Pick a couple of small details nearby — not everything."
      },
      {
        id: 'walking_feet', sceneKey: 'walkingFeet', setting: 'outdoor',
        category: 'Movement',
        title: 'Walking Feet',
        situationLine: 'One pair of feet walks forward down a school hallway.',
        framing: 'Get down low, close to the ground — feet only.',
        tip: "You don't need to draw a whole person to let the viewer know someone is walking."
      },
      {
        id: 'crumpled_paper', sceneKey: 'crumpledPaper', setting: 'indoor',
        category: 'Clue',
        title: 'The Crumpled Paper',
        situationLine: 'A hand grips a crumpled paper tightly — a grade peeks through.',
        framing: 'Frame in tight on the hand gripping the paper — no face needed.',
        tip: 'How can my hand show a feeling?'
      },
      {
        id: 'secret_note', sceneKey: 'secretNote', setting: 'indoor',
        // optional: true — same 5 required + 1 optional pattern as
        // Lessons 02-03. index.html shows a "try it / skip" gate before
        // this scene's reveal.
        optional: true,
        category: 'Relationship',
        title: 'Passing a Secret Note',
        situationLine: 'Under a table, one hand passes a secret note to another.',
        framing: 'Frame in tight under the table — just the two hands and the note.',
        tip: "What's written on the note? You decide the story."
      }
    ],

    audio: {
      narrationAvailable: false
    },

    // "Quick Sketch Reference" — no videos supplied yet for this lesson,
    // so every scene is placeholder:true, same workflow as Lessons 02/03
    // (the lightbox/drawing-round reference panel shows the "coming
    // soon" state until a demoVideoStreamId is added, no index.html
    // change needed).
    teacher_references: [
      { sceneId: 'unlocking_door', label: 'Quick Sketch Reference — Unlocking the Door', placeholder: true },
      { sceneId: 'frightened_face', label: 'Quick Sketch Reference — A Frightened Face', placeholder: true },
      { sceneId: 'glass_of_water', label: 'Quick Sketch Reference — The Glass of Water', placeholder: true },
      { sceneId: 'walking_feet', label: 'Quick Sketch Reference — Walking Feet', placeholder: true },
      { sceneId: 'crumpled_paper', label: 'Quick Sketch Reference — The Crumpled Paper', placeholder: true },
      { sceneId: 'secret_note', label: 'Quick Sketch Reference — Passing a Secret Note', placeholder: true }
    ],

    // No real student photos for this lesson yet — dashed placeholders
    // until Faye shares some (same data-driven branch as Lessons 01-03).
    community_gallery: {
      title: 'From Other Students',
      subtitle: 'Real student photos will appear here once Faye shares them.',
      placeholderCount: 4
    },

    // Chains into Lesson 05 (Extreme Close-Up). Title/subtitle copied
    // verbatim from that lesson's own welcome.title/subtitle, same
    // convention Lessons 02/03 used.
    next_lesson: {
      href: '../lesson-05-extreme-close-up/',
      title: 'Extreme Close-Up',
      subtitle: 'Show the Detail'
    },

    // Claude Code's own wording (flagged) — same multi-select chip
    // mechanic as Lessons 02/03's check, no right/wrong answer. Options
    // mirror the four Step 1 categories directly.
    completion_check: {
      question: 'What can a Close-Up help us show?',
      options: ['Emotion', 'Action', 'A Detail', 'A Clue']
    }
  };

  global.LESSON_DATA = LESSON_DATA;
})(window);
