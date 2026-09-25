window.COURSE_BADGE_REGISTRY = {

  scene_designer: {
    requiredIds: ['one-point-street', 'two-point-bedroom']
  },

  // Art Theory badge unlocks on the Western track alone (36 lessons).
  // Other nation tracks (Chinese, etc.) are optional bonus content per
  // Faye — students can explore them, but they don't gate this badge.
  art_history: {
    requiredIds: Array.from(
      { length: 36 },
      (_, i) => `art-history-western-${i + 1}`
    )
  },

  // "The Colorful Chameleon" (Eric Carle) — Creation's first course
  // wired into this registry. Single-lesson badge: finishing the course
  // is the whole requirement.
  collage_creator: {
    requiredIds: ['carle-colorful-chameleon']
  },

  // "My Sweet Fridge" (Wayne Thiebaud) — same single-lesson pattern as
  // collage_creator above.
  fridge_curator: {
    requiredIds: ['thiebaud-my-sweet-fridge']
  },

  // Color Theory (Skill) — round 2 revision, reverses round 1's "no
  // badge yet" call now that the course itself is settled. Single-
  // lesson-course pattern, same as collage_creator/fridge_curator
  // above: color-theory/index.html's markCourseComplete() writes
  // 'color-theory' into completedLessons on Finish, same as every
  // other course here.
  color_theory: {
    requiredIds: ['color-theory']
  },

  // Scene Drawing Foundation, Unit 01 · Shot Size — the 5
  // lessons/scene-drawing-foundation/unit-01-shot-size/ lesson pages,
  // each writing its own LESSON_DATA.courseId into completedLessons the
  // same way every other lesson here does. Scoped to Unit 01 only, not
  // the eventual full course, per Faye's explicit "badge per Unit, not
  // per whole course" instruction — Unit 02+ get their own badge entries
  // here later, this one doesn't get restructured when they're added.
  scene_drawing_unit_01: {
    requiredIds: ['extreme-wide-shot', 'wide-full-shot', 'medium-shot', 'close-up', 'extreme-close-up']
  },

  // Zodiac Brush Technique (Skill, internal review build) — badged per
  // animal, not per eventual whole 12-animal course, same reasoning as
  // scene_drawing_unit_01 above ("badge per Unit, doesn't get
  // restructured when more are added"). lessons/zodiac-skill/
  // index.html's markAnimalComplete() writes 'zodiac-rat' into
  // completedLessons once every recorded step of Rat is finished. A
  // future Ox entry gets its own 'zodiac_ox' badge id here.
  zodiac_rat: {
    requiredIds: ['zodiac-rat']
  },

  // Foundation of Sketch, Step 1 — "Form and Structure" badge
  // (basic_sketch, renamed from "Basic Sketch" — see core/badge-catalog.js).
  // Had its own separate hardcoded unlock system (FOUNDATION_A_PATH /
  // checkAndUnlockBadge() in index.html) but was never added here, so it
  // never showed progress in the badge grid itself. requiredIds is a
  // function (not a plain array) that derives the 11 ids from
  // window.FOUNDATION_A_PATH at read time, instead of a second
  // hand-typed copy that could drift out of sync with index.html's real
  // list — see getCourseBadgeProgress() below for how function-valued
  // requiredIds gets resolved. window.FOUNDATION_A_PATH is only assigned
  // partway through index.html's own inline script (a plain `const`
  // doesn't attach to window on its own), which loads AFTER this file,
  // so this can't be a plain array evaluated at this script's load time
  // — it has to stay lazy.
  basic_sketch: {
    requiredIds: () => (window.FOUNDATION_A_PATH || []).map((l) => l.id)
  },

  // Foundation of Sketch, Step 2 — "Still Life and Texture" badge
  // (still_life, renamed from "Still Life"). Only the lessons currently
  // marked ready:true in core/still-life-lesson.js's
  // FOUNDATION_STILL_LIFE_PATH count for now (as of this writing, only
  // the two glass lessons are live — the other 8 are ready:false, not
  // yet built). Unlike basic_sketch above, this stays a plain static
  // list on purpose (per Faye) — append ids here by hand as more Step 2
  // lessons go live, same incremental pattern as scene_drawing_unit_01;
  // don't restructure this entry when that happens.
  still_life: {
    requiredIds: ['still-life-2a-glass-structure', 'still-life-2b-glass-texture']
  },

  // Fashion Design (costume_design badge, retitled — see
  // core/badge-catalog.js). fashion-design/app.js has no completion-
  // tracking write yet and its one built lesson explicitly says in its
  // own UI copy that it does not count toward formal course
  // certification, so this starts empty/locked on purpose. Expand
  // requiredIds once real (non-demo) completion tracking exists.
  costume_design: {
    requiredIds: []
  },

  // Ink Painting (new ink_painting badge) — whole "Painting -> Ink
  // Painting" category badge, distinct from the per-animal zodiac_rat
  // badge just above. lessons/zodiac-skill/index.html's
  // markAnimalComplete() already writes 'zodiac-rat' into
  // completedLessons, so no new tracking code is needed for this one —
  // just this registry entry. Expand as more zodiac animals go live.
  ink_painting: {
    requiredIds: ['zodiac-rat']
  }

};

window.getCourseBadgeProgress = function () {
  const result = {};
  try {
    // fei_user_profile lives in sessionStorage (core/access.js,
    // core/ink-animal-access.js, index.html's login flow all agree on
    // this) — this used to read localStorage, a leftover from before
    // that migration, which meant this function silently found nothing
    // and every badge here (not just this one) never auto-unlocked.
    const raw = sessionStorage.getItem('fei_user_profile');
    const profile = raw ? JSON.parse(raw) : null;
    const completed = (profile && profile.completedLessons) || [];

    Object.keys(window.COURSE_BADGE_REGISTRY).forEach((badgeId) => {
      // requiredIds is usually a plain array, but can be a function that
      // derives the list at read time instead (see basic_sketch above) —
      // resolve it here so every other badge is unaffected.
      const rawRequired = window.COURSE_BADGE_REGISTRY[badgeId].requiredIds;
      const required = typeof rawRequired === 'function' ? rawRequired() : rawRequired;
      const doneCount = required.filter((id) => completed.includes(id)).length;
      result[badgeId] = {
        doneCount,
        totalCount: required.length,
        // required.length > 0 guard: an empty requiredIds (e.g.
        // costume_design below, deliberately [] until real completion
        // tracking exists) must never read as "complete" — 0 === 0
        // would otherwise vacuously auto-unlock it for every student.
        isComplete: required.length > 0 && doneCount === required.length,
        pct: required.length > 0 ? Math.round((doneCount / required.length) * 100) : 0
      };
    });
  } catch (e) {
    // fail quietly — badge grid falls back to manual students.json data only
  }
  return result;
};

window.getAutoEarnedCourseBadgeIds = function () {
  const progress = window.getCourseBadgeProgress();
  return Object.keys(progress).filter((id) => progress[id].isComplete);
};
