/* Connect the guided studio to the existing course access and completion model. */
window.GuidedPlatform = {
  async allow(lessonId) {
    try {
      const result = await window.FEIAccess.canOpenLesson('skills', lessonId);
      if (result.allowed) return true;
      let query;
      if (result.reason === 'not_signed_in') {
        // returnTo: a path relative to index.html (no leading slash), so
        // sign-in can send the student straight back here instead of to
        // the dashboard -- same fix as the balloon guided preview's own
        // gateAccess(). Derived generically from the last 3 path segments
        // (lessons/<folder>/guided/) rather than rebuilt from lessonId,
        // since lessonId ('sphere','cube','preparation') doesn't match
        // its own lesson folder name ('lesson-1-sphere','lesson-3-cube').
        // Works under any deploy base the same way: the GitHub Pages
        // repo-name prefix, if any, falls off naturally since only the
        // last 3 segments are kept.
        const returnTo = location.pathname.split('/').filter(Boolean).slice(-3).join('/') + '/';
        query = '?signin=required&from=' + encodeURIComponent('skills:' + lessonId) + '&returnTo=' + encodeURIComponent(returnTo);
      } else {
        query = '?paywall=skills&lesson=' + encodeURIComponent(lessonId);
      }
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
