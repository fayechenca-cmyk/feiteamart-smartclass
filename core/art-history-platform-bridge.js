const ArtHistoryProfileBridge = {
  storageKey: 'fei_user_profile',
  current() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  completeLesson(courseId) {
    const profile = this.current();
    if (!profile) return null;
    if (!profile.completedLessons) profile.completedLessons = [];
    if (!profile.completedLessons.includes(courseId)) {
      profile.completedLessons.push(courseId);
    }
    profile.lastSeenAt = Date.now();
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(profile));
    } catch (e) {
      console.warn('[ArtHistoryProfileBridge] save failed:', e);
    }
    return profile;
  },
  hasCompletedLesson(courseId) {
    const profile = this.current();
    return !!(profile && profile.completedLessons && profile.completedLessons.includes(courseId));
  }
};

function artHistoryMarkLessonComplete(courseId) {
  const before = (window.getCourseBadgeProgress ? window.getCourseBadgeProgress() : {}).art_history
    || { isComplete: false };
  ArtHistoryProfileBridge.completeLesson(courseId);
  const after = (window.getCourseBadgeProgress ? window.getCourseBadgeProgress() : {}).art_history
    || { isComplete: false };
  return { ...after, justUnlocked: !before.isComplete && after.isComplete };
}
