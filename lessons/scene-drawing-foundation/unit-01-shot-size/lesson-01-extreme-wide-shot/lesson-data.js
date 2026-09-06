/* ============================================================
 * Scene Drawing Foundation · Unit 01 · Lesson 01 — Extreme Wide Shot
 * Lesson content data — all 13 stages.
 *
 * ASSET NOTE: the spec (Lesson01-ExtremeWideShot-Spec-v1.0.md)
 * repeatedly says to keep various existing illustrations (Stage 1's
 * mountain scene, Stage 9's Nature/City/Fantasy references, Stage 5/6
 * story art) — these come from an earlier prototype/mockup this build
 * did not have access to. Every image below is an inline placeholder
 * SVG (via svgPlaceholder()), not the real art. Swapping in real
 * image URLs later needs no other code change — every image is
 * referenced by URL/data-URI in this one file.
 *
 * COPY NOTE: video_intro's "key sentence" is spec'd as "keep the
 * existing one," but the actual original text lives in the same
 * inaccessible prototype doc — the line below is Claude Code's own
 * reconstruction, not a verbatim original. Flagged, not silently
 * invented as if it were real.
 * ============================================================ */
(function (global) {
  'use strict';

  // Inline SVG placeholder art — a colored rounded card with a
  // centered emoji. Used everywhere the spec references an existing
  // illustration this build doesn't have the real file for.
  function svgPlaceholder(bg, emoji, w, h) {
    w = w || 300; h = h || 220;
    const fontSize = Math.round(Math.min(w, h) * 0.42);
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">'
      + '<rect width="' + w + '" height="' + h + '" rx="18" fill="' + bg + '"/>'
      + '<text x="50%" y="54%" font-size="' + fontSize + '" text-anchor="middle" dominant-baseline="middle">' + emoji + '</text>'
      + '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  const LESSON_DATA = {
    id: 'extreme-wide-shot',
    unit: 'unit-01-shot-size',
    // Scene Drawing convention (per core/scene-drawing-platform-bridge.js):
    // courseId === lessonId, both the lesson's own short id.
    courseId: 'extreme-wide-shot',

    welcome: {
      title: 'Extreme Wide Shot',
      subtitle: 'Show the World',
      heroImage: svgPlaceholder('#dbe4ee', '🏔️', 500, 300),
      startLabel: 'Start →'
    },

    video_intro: {
      title: 'What is a Scene?',
      // See file-level ASSET/COPY NOTE above — reconstructed, not verbatim.
      keySentence: 'A scene is a visual moment in a story — a specific place, at a specific time, that tells us something is happening.',
      videoStreamId: null,
      videoTitle: 'What is a Scene? — concept intro'
    },

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
        { key: 'whole_story', label: 'The Whole Story?' }
      ]
    },

    // Stage 5 — first ABChoiceCard instance.
    story_a: {
      kicker: 'Story',
      prompt: 'A knight is about to fight a dragon.',
      optionA: { image: svgPlaceholder('#f0b93e', '🤺'), label: 'Close-Up', feedback: 'A shows exactly how the knight feels!' },
      optionB: { image: svgPlaceholder('#2d5fa8', '🐉'), label: 'Wide Shot', feedback: 'B shows just how big this moment really is!' }
    },
    // Stage 6 — second ABChoiceCard instance, different story.
    story_b: {
      kicker: 'Story',
      prompt: 'A girl discovers a hidden treehouse.',
      optionA: { image: svgPlaceholder('#e8862e', '😲'), label: 'Close-Up', feedback: 'A shows her surprise up close!' },
      optionB: { image: svgPlaceholder('#3fa8a0', '🌳'), label: 'Wide Shot', feedback: 'B shows the whole magical forest around her!' }
    },

    // Stages 7+8 share one CameraZoomSlider mount — big_idea drives the
    // intro auto-animate, meet_term shows the settled end-state.
    big_idea: {
      title: 'Sometimes, the story is bigger than the character.',
      autoAnimateFrom: 0.5,
      autoAnimateTo: 1,
      autoAnimateDurationMs: 1800
    },
    meet_term: {
      term: 'EXTREME WIDE SHOT',
      labels: ['PLACE', 'SCALE', 'ATMOSPHERE']
    },

    real_examples: {
      title: 'Real Examples',
      examples: [
        { key: 'nature', label: 'Nature', image: svgPlaceholder('#3fa8a0', '🏞️', 400, 300) },
        { key: 'city', label: 'City', image: svgPlaceholder('#7b5ea8', '🏙️', 400, 300) },
        { key: 'fantasy', label: 'Fantasy World', image: svgPlaceholder('#e85c6e', '🏰', 400, 300) }
      ]
    },

    // Stage 10 — renamed to the platform's "Let's Draw Together"
    // convention per the spec. Disclaimer reworded in this lesson's
    // own voice (spec: "style matches the platform convention, not a
    // verbatim copy") — this course has no named teacher persona the
    // way the Creation track's "Mrs. Dawn Wang" does (checked: no
    // teacher name anywhere in the existing scene-drawing/ or
    // core/scene-drawing-*.js files), so it stays unnamed rather than
    // importing a name from an unrelated course.
    demo_video: {
      title: "Let's Draw Together",
      subtitle: 'How I start thinking about this scene',
      disclaimer: "This is one way to think through the scene — not the only right answer. Follow along, or explore your own ideas.",
      videoStreamId: null,
      videoTitle: "Let's Draw Together — thinking sketch"
    },

    // Stage 11 — task copy kept verbatim from the spec.
    draw_task: {
      title: 'Your Turn: Draw 3 Scenes',
      tasks: [
        { key: 'another_planet', label: 'Another Planet' },
        { key: 'lost_in_forest', label: 'Lost in the Forest' },
        { key: 'finally_saw_city', label: 'Finally Saw the City' }
      ],
      xpPerScene: 20
    },

    // Stage 12 — "Jojo" is a real recurring name on this platform (a
    // legacy-access-code student, core/student-access-codes.js), used
    // elsewhere as a peer-example name — kept as-is rather than
    // inventing a different character. No real comparison art exists
    // yet, placeholder per the file-level note.
    see_ideas: {
      title: 'See Other Ideas',
      tabs: [
        { key: 'teacher', label: "Teacher's Idea", image: svgPlaceholder('#2d5fa8', '🖼️', 400, 300) },
        { key: 'jojo', label: "Jojo's Idea", image: svgPlaceholder('#e8862e', '🖼️', 400, 300) }
      ]
    },

    // Stage 13 — ReflectionJournal config. "View" options are this
    // lesson's 3 task names (there's no shot-size menu taught yet to
    // choose between, unlike Unit 01's later lessons) so the sentence
    // reads naturally against whichever of their 3 drawings they pick.
    reflect: {
      title: 'My Choice',
      viewOptions: ['Another Planet', 'Lost in the Forest', 'Finally Saw the City'],
      reasonOptions: ['it shows the whole world', 'it has the most detail', 'it feels the most dramatic', "I'm proudest of it"]
    }
  };

  global.LESSON_DATA = LESSON_DATA;
  global.svgPlaceholder = svgPlaceholder;
})(window);
