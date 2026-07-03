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
  }

};

window.getCourseBadgeProgress = function () {
  const result = {};
  try {
    const raw = localStorage.getItem('fei_user_profile');
    const profile = raw ? JSON.parse(raw) : null;
    const completed = (profile && profile.completedLessons) || [];

    Object.keys(window.COURSE_BADGE_REGISTRY).forEach((badgeId) => {
      const required = window.COURSE_BADGE_REGISTRY[badgeId].requiredIds;
      const doneCount = required.filter((id) => completed.includes(id)).length;
      result[badgeId] = {
        doneCount,
        totalCount: required.length,
        isComplete: doneCount === required.length,
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
