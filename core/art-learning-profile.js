/* ============================================================
 * Art Learning Profile — dimension config + score calculation.
 *
 * Small, isolated, config-driven on purpose (per the build spec): the
 * DIMENSIONS array is what index.html's renderArtLearningProfile()
 * reads to draw the shape, and getArtLearningProfileScores() is the
 * only place that touches completedLessons. Neither hardcodes "4" —
 * a 5th+ dimension is just one more entry in DIMENSIONS plus one more
 * key in DIMENSION_SIGNAL_MAP, no rendering-code changes required.
 *
 * V1 SCORING IS ACTIVITY/COMPLETION-BASED ONLY, NEVER A QUALITY OR
 * TALENT SCORE — each dimension's score is just
 * (completed lessons mapped to it) / (total lessons mapped to it).
 *
 * FLAGGED FOR FAYE (this is a real judgment call, not a settled fact):
 * lesson-data.js and FOUNDATION_A_PATH etc. do not currently carry a
 * per-lesson `learningDimension` tag anywhere in the repo — the only
 * clean signal available today is COURSE-LEVEL grouping, via the
 * requiredIds lists already in core/course-badge-registry.js. So this
 * file maps whole COURSES to dimensions, not individual lessons. Per
 * the build spec's own instruction ("don't mass-edit lesson-data.js to
 * force it — propose a lightweight tagging convention and report what
 * you find"), that per-lesson tagging was NOT applied here. The
 * DIMENSION_SIGNAL_MAP below is that proposal's stand-in: a lightweight
 * `learningDimension` field could be added to individual lesson-data.js
 * entries later (Skill/Creation/etc. already loosely implies a
 * dimension) without changing this file's shape at all — just swap the
 * course-level entries below for a per-lesson lookup.
 *
 * CONFIRMED BY FAYE (was flagged, now settled): the platform's course-
 * branding sense of "LFC" (Creation -> Learn from Masters — "meet a
 * master artist, discover one big idea, turn it into art that's all
 * your own") is NOT the same thing as the visual_thinking dimension.
 * visual_thinking is specifically the looking/critical-thinking axis —
 * LFC Sky Artspace browsing, comparison/reflection prompts, art-theory-
 * adjacent observation work — not the Creation courses. Creation
 * courses (collage_creator, fridge_curator) open with a looking phase
 * but are primarily about MAKING, so they're mapped to creative_practice
 * below. visual_thinking has no course-level signal mapped yet (reads
 * at the MIN_SCORE floor for every student, same as costume_design)
 * until LFC Sky Artspace / comparison-reflection activities get real
 * completion tracking — that's a gap to fill later, not a bug here.
 * ============================================================ */
(function (global) {
  'use strict';

  // Position drives where each node sits on the shape (top/right/bottom/
  // left, going clockwise from index 0) — renderArtLearningProfile()
  // places node i at angle (i * 360/N - 90), so this array's ORDER is
  // what actually controls layout; a 5th entry would just take the next
  // slot around the circle.
  var DIMENSIONS = [
    {
      key: 'technical_practice',
      label: 'Technical Practice',
      descriptor: 'BUILD SKILLS',
      hoverLine: 'Built through practice-based lessons and skill exercises.'
    },
    {
      key: 'creative_practice',
      label: 'Creative Practice',
      descriptor: 'MAKE MEANING',
      hoverLine: 'Built through creation lessons, design tasks, and original work.'
    },
    {
      key: 'art_understanding',
      label: 'Art Understanding',
      descriptor: 'GO FURTHER',
      hoverLine: 'Built through art history, theory, and artist study.'
    },
    {
      key: 'visual_thinking',
      label: 'Visual Thinking (LFC)',
      descriptor: 'SEE DEEPLY',
      hoverLine: 'Built through looking, comparing, and reflecting on real artworks.'
    }
  ];

  // Course-level signal map — see the file header for why this is
  // course-level (not per-lesson) and for the confirmed LFC/creative
  // split. Values are functions so basic_sketch's lazy FOUNDATION_A_PATH
  // lookup (same pattern as course-badge-registry.js) stays safe
  // regardless of script load order.
  var DIMENSION_SIGNAL_MAP = {
    technical_practice: function () {
      return []
        .concat((global.FOUNDATION_A_PATH || []).map(function (l) { return l.id; }))
        .concat(['still-life-2a-glass-structure', 'still-life-2b-glass-texture'])
        .concat(['color-theory'])
        .concat(['zodiac-rat'])
        .concat(['material-art-cardboard'])
        .concat(['one-point-street', 'two-point-bedroom']);
    },
    creative_practice: function () {
      return []
        .concat(['extreme-wide-shot', 'wide-full-shot', 'medium-shot', 'close-up', 'extreme-close-up'])
        // Creation -> Learn from Masters courses (collage_creator,
        // fridge_curator) — confirmed per Faye: primarily MAKING
        // courses, even though each opens with a looking phase. Moved
        // here from visual_thinking.
        .concat(['carle-colorful-chameleon', 'thiebaud-my-sweet-fridge']);
      // costume_design (fashion-design) has no real completion tracking
      // yet — see course-badge-registry.js's own note on that — so it
      // isn't included here until that write-up exists.
    },
    art_understanding: function () {
      var ids = [];
      for (var i = 1; i <= 36; i++) ids.push('art-history-western-' + i);
      return ids;
    },
    // No course-level signal yet — LFC Sky Artspace / comparison-
    // reflection activities (the actual visual_thinking axis) don't
    // have completion tracking in the repo yet. Stays empty (reads at
    // the MIN_SCORE floor) until that exists — see file header.
    visual_thinking: function () {
      return [];
    }
  };

  // MIN_SCORE keeps a brand-new account's shape from collapsing to a
  // degenerate point on any side (same "always show something, even for
  // new students" convention as the Continue Learning card) — it's a
  // rendering floor, not a claim that the student has done anything.
  var MIN_SCORE = 0.12;

  function getArtLearningProfileScores(profile) {
    var completed = (profile && profile.completedLessons) || [];
    var scores = {};
    DIMENSIONS.forEach(function (dim) {
      var ids = (DIMENSION_SIGNAL_MAP[dim.key] || function () { return []; })();
      var done = ids.filter(function (id) { return completed.indexOf(id) !== -1; }).length;
      var raw = ids.length > 0 ? done / ids.length : 0;
      scores[dim.key] = { done: done, total: ids.length, score: Math.max(MIN_SCORE, raw) };
    });
    return scores;
  }

  global.ART_LEARNING_DIMENSIONS = DIMENSIONS;
  global.getArtLearningProfileScores = getArtLearningProfileScores;
})(window);
