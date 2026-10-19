/* Connect the guided studio to the existing course access and completion model. */
window.GuidedPlatform = {
  async allow(lessonId) {
    try {
      const result = await window.FEIAccess.canOpenLesson('skills', lessonId);
      if (result.allowed) return true;
      const query = result.reason === 'not_signed_in'
        ? '?signin=required&from=' + encodeURIComponent('skills:' + lessonId)
        : '?paywall=skills&lesson=' + encodeURIComponent(lessonId);
      location.replace('../../../' + query);
    } catch (error) {
      console.warn('Course access could not be checked', error);
      document.getElementById('title').textContent = 'Please reload to check your course access';
    }
    return false;
  },
  complete(lessonId) {
    // Follow the site's session profile model; do not grant XP or teacher badges.
    try {
      const profile = JSON.parse(sessionStorage.getItem('fei_user_profile') || 'null');
      if (!profile) return;
      profile.completedLessons = [...new Set([...(profile.completedLessons || []), lessonId])];
      profile.lastSeenAt = Date.now();
      sessionStorage.setItem('fei_user_profile', JSON.stringify(profile));
      if (typeof FEIProgress !== 'undefined') FEIProgress.saveFromProfile(profile);
    } catch (error) { console.warn('Could not save course completion', error); }
  }
};
