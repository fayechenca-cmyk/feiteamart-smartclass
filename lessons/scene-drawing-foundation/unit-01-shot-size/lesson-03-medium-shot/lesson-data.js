/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 03 — LIVE
 * Medium Shot — Show the Action
 *
 * The "Learning Canvas" build, built DIRECTLY on this real path (no
 * -v2 staging — the standing simplification for this course from
 * Lesson 02 onward). Replaces the original 13-stage/CameraZoomSlider
 * build, which is archived (not deleted) at
 * ../_archive/lesson-03-medium-shot-original/.
 *
 * Follows Lesson 02's shape and field names directly (see
 * ../lesson-02-wide-full-shot/lesson-data.js), per the brief's "follows
 * that pattern very closely". Differences, each flagged inline:
 *   - concept_moment (Step 1) replaces Lesson 02's 3D classroom reveal
 *     + concept card: a full-screen, video-like explanation moment
 *     driven by the shared ShotSizeCompare component
 *     (../_shared/shot-size-compare.js).
 *   - story_scenes carry `tip` + `framing` (shown BEFORE each scene) and
 *     the last one is `optional: true` — 5 required + 1 optional is the
 *     pattern going forward (Faye, from testing: by the 5th of six
 *     rounds many students are tired).
 *   - every story gets its own two-panel drawing round after its 3D
 *     scene (the reference video enlarged + the student's canvas, with
 *     a paper opt-out — Lesson 01's practice format); skipping the
 *     optional story skips both. No choose_scene / step-by-step
 *     guided-drawing steps: the old shared progressive illustration
 *     teaches WIDE shot construction, which would be wrong content
 *     here (a story with no reference video shows a placeholder).
 *     The lesson closes with the community + complete steps so
 *     completion/badge still work.
 *
 * id/courseId are UNCHANGED from the archived original on purpose —
 * core/course-badge-registry.js's scene_drawing_unit_01 badge already
 * keys off 'medium-shot'.
 * ============================================================ */
(function (global) {
  'use strict';

  const LESSON_DATA = {
    id: 'medium-shot',
    unit: 'unit-01-shot-size',
    courseId: 'medium-shot',
    title: 'Medium Shot',
    subtitle: 'Show the Action',

    // Step 1 — full-screen, video-like explanation moment (NOT a
    // video). Very little text, per the platform's "let visuals carry
    // it" convention. Key point: with a person in frame they're no
    // longer shown full-body (Wide Shot) — the background now supports
    // the person instead of sharing equal weight. The captions below
    // override ShotSizeCompare.DEFAULT_STOPS's own wording so the copy
    // lives with the lesson.
    concept_moment: {
      stopCaptions: {
        ews: 'Extreme Wide: the world fills the frame.',
        ws: 'Wide: the whole person — and the place around them.',
        ms: 'Medium: the person leads. The background supports them.'
      },
      closingLine: 'Drag the slider to compare.'
    },

    // Two-card intro before Situation 1. Copy is Claude Code's own
    // wording (flagged — none was supplied verbatim).
    scenes_intro: {
      titleCard: 'Medium Shot Practice',
      explainerCard: "Six short stories — five to draw, and a sixth that's optional. Each one starts with a tip, then you'll see the scene and sketch it yourself."
    },

    // Step 2 — six Medium Shot stories, in the order of Faye's WRITTEN
    // story list. Her storyboard sheet
    // (reference-images/lesson03-medium-shot-storyboard-reference.jpg)
    // draws them in a different panel order — reading order is Theater,
    // Lunch, Playground, Shop Window, Hike, Art Project — so each 3D
    // scene follows the panel that DEPICTS it, not the panel at the same
    // reading position. Reorder this list if she wants the sheet's order.
    //   tip      — Faye's own tip text, shown before the scene appears.
    //   framing  — one short line telling the student how the shot is
    //              framed (Medium Shot jumps straight into a partial
    //              view, unlike Extreme Wide/Wide's full figure).
    //              Derived from Faye's per-story framing descriptions;
    //              the wording is Claude Code's.
    //   situationLine — the typed "Situation N: ..." sentence; Claude
    //              Code's own one-line summary of each written story.
    story_scenes: [
      {
        id: 'theater', sceneKey: 'theater', setting: 'indoor',
        title: 'At the Theater',
        situationLine: 'A kid sits in a theater seat, watching the show.',
        framing: 'Frame her waist-up.',
        tip: "Use eye direction and head angle to tell us where the stage is — you don't need to actually draw the stage."
      },
      {
        id: 'playground', sceneKey: 'playground', setting: 'outdoor',
        title: 'Talking at the Playground',
        situationLine: 'Two friends stand at the edge of the playground, talking.',
        framing: 'Frame both friends to the waist.',
        tip: 'This one is about interaction. Practice the eye-line — the look passing between the two characters.'
      },
      {
        id: 'hike', sceneKey: 'hike', setting: 'outdoor',
        title: 'Taking a Break on a Hike',
        situationLine: 'A girl on a hike stops to drink some water.',
        framing: 'Frame her from the head to about the waist.',
        tip: "She's the clear main subject, right up front. Let the framing alone tell us where she is."
      },
      {
        id: 'lunch', sceneKey: 'lunch', setting: 'indoor',
        title: 'Lunch with a Friend',
        situationLine: 'Two friends sit face to face at a restaurant table, having lunch.',
        framing: 'Show only their upper bodies, the table, and the food.',
        tip: 'Practice hand props and how the two characters interact.'
      },
      {
        id: 'shop_window', sceneKey: 'shopWindow', setting: 'outdoor',
        title: 'The Shop Window',
        situationLine: 'A girl stops in front of a shop window, looking at something she loves.',
        framing: 'Show her upper body from the side, with the window.',
        tip: 'Practice drawing the character together with the glass and the objects behind it.'
      },
      {
        id: 'art_project', sceneKey: 'artProject', setting: 'indoor',
        // optional: true — the pattern going forward is 5 required + 1
        // optional. index.html shows a "try it / skip" gate before this
        // scene's reveal.
        optional: true,
        title: 'Working on an Art Project',
        situationLine: 'A girl draws at a table while her teacher stands beside her, helping.',
        framing: 'Show both from the waist up, plus part of the table.',
        tip: "Practice overlap. Don't line the two characters up side by side like a photo — let one overlap the other."
      }
    ],

    audio: {
      narrationAvailable: false
    },

    // "Quick Sketch Reference" overlay (same corrected format as
    // Lesson 02 — NOT the old "Teacher's Guide"). No videos supplied
    // yet, so every scene is placeholder:true — the lightbox shows the
    // "coming soon" state until a demoVideoStreamId (and optionally
    // posterTimeSecs) is added per scene, which needs no index.html
    // change.
    teacher_references: [
      { sceneId: 'theater', label: 'Quick Sketch Reference — At the Theater', placeholder: true },
      { sceneId: 'playground', label: 'Quick Sketch Reference — Talking at the Playground', placeholder: true },
      { sceneId: 'hike', label: 'Quick Sketch Reference — Taking a Break on a Hike', placeholder: true },
      { sceneId: 'lunch', label: 'Quick Sketch Reference — Lunch with a Friend', placeholder: true },
      { sceneId: 'shop_window', label: 'Quick Sketch Reference — The Shop Window', placeholder: true },
      { sceneId: 'art_project', label: 'Quick Sketch Reference — Working on an Art Project', placeholder: true }
    ],

    // No real student photos for this lesson yet — dashed placeholders
    // until Faye shares some (same data-driven branch as Lessons 01/02).
    community_gallery: {
      title: 'From Other Students',
      subtitle: 'Real student photos will appear here once Faye shares them.',
      placeholderCount: 4
    },

    // Chains into Lesson 04 (Close-Up). Title/subtitle copied from that
    // lesson's own welcome.title/subtitle so the card matches what it
    // calls itself (same convention Lesson 02 used for this lesson).
    next_lesson: {
      href: '../lesson-04-close-up/',
      title: 'Close-Up',
      subtitle: 'Show Emotion'
    },

    // Claude Code's own wording (flagged) — same multi-select chip
    // mechanic as Lesson 02's check, no right/wrong answer.
    completion_check: {
      question: 'What does a Medium Shot help us show?',
      options: ['The Person', 'The Action', 'How They Interact', 'A Bit of Where They Are']
    }
  };

  global.LESSON_DATA = LESSON_DATA;
})(window);
