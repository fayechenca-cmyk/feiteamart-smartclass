/* ═══════════════════════════════════════════════════════════════════════════
 *  Scene Drawing ↔ Platform bridge
 *
 *  Connects Scene Drawing to the SAME systems every other lesson already
 *  uses, so progress genuinely shows up in the real My Journey modal and
 *  the real student profile — not a separate, disconnected copy.
 *
 *  JournalStorage  → localStorage key 'fei_thinking_journal' (identical
 *                     object to the one defined in every Foundation A /
 *                     LFC lesson file — see lessons/lesson-6-cup/index.html
 *                     around line 4939). Copied verbatim, not reinvented,
 *                     so entries Scene Drawing saves appear in the same
 *                     "My Journey" timeline as every other lesson's.
 *  UserProfile     → localStorage key 'fei_user_profile' (same shape:
 *                     completedLessons, totalXP, etc.) Scene Drawing reads
 *                     this to know if a profile already exists (don't
 *                     create a second, conflicting one) and writes lesson
 *                     completion into the SAME completedLessons array
 *                     Foundation A uses.
 *
 *  COURSE ID CONVENTION (matches the rest of the platform, with one
 *  necessary difference)
 *  Every Foundation A lesson sets its own per-lesson courseId, e.g.
 *  'foundation-a-cube', 'foundation-a-sphere' — "course" in this codebase
 *  means "this individual lesson," not the whole 10-lesson path. Scene
 *  Drawing's lesson `id` fields are already short ('one-point-street',
 *  'two-point-bedroom' — see scene-drawing/lesson-*.js) and used
 *  throughout the URL, localStorage progress, and JournalStorage entries,
 *  so those exact ids are what core/course-badge-registry.js's
 *  scene_designer.requiredIds mirrors, rather than introducing a second
 *  naming scheme.
 *
 *  BADGE PHILOSOPHY (per Faye, confirmed June 2026)
 *  Per Faye's standing rule (same one already in the codebase, Apr 2026):
 *  lessons give progress, not badges. Badges are course-level only. Scene
 *  Drawing Foundation is one growing course (2 lessons now, 8-10 planned).
 *  The 'scene_designer' badge (redefined per Faye's explicit instruction —
 *  it previously belonged to 3 students for unrelated work; Faye will
 *  handle those records herself) unlocks only when ALL lessons listed in
 *  core/course-badge-registry.js are in completedLessons — not after
 *  Lesson 1 or 2 alone. (As of July 2026, the required-id list moved out
 *  of this file into that shared registry — see sceneDrawingCourseBadgeProgress
 *  below.)
 * ═══════════════════════════════════════════════════════════════════════════ */

// ── JournalStorage — copied verbatim from the platform's existing lessons ──
const JournalStorage = {
  config: {
    storageKey: 'fei_thinking_journal',
    supabase: { enabled: false, url: '', anonKey: '', tableName: 'thinking_journal' }
  },
  save(entry) {
    const fullEntry = {
      id: 'entry_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now(),
      createdAt: Date.now(),
      ...entry
    };
    this._saveToLocal(fullEntry);
    return fullEntry;
  },
  getForMoment(courseId, lessonId, momentKey) {
    const all = this._loadFromLocal();
    return all.filter(e => e.courseId === courseId && e.lessonId === lessonId && e.momentKey === momentKey)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  getAllForCourse(courseId) {
    const all = this._loadFromLocal();
    return all.filter(e => e.courseId === courseId).sort((a, b) => b.createdAt - a.createdAt);
  },
  getAll() {
    return this._loadFromLocal().sort((a, b) => b.createdAt - a.createdAt);
  },
  remove(entryId) {
    const all = this._loadFromLocal();
    const filtered = all.filter(e => e.id !== entryId);
    localStorage.setItem(this.config.storageKey, JSON.stringify(filtered));
  },
  count(courseId = null) {
    const all = this._loadFromLocal();
    if (!courseId) return all.length;
    return all.filter(e => e.courseId === courseId).length;
  },
  _loadFromLocal() {
    try {
      const raw = localStorage.getItem(this.config.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('[JournalStorage] Local load failed:', e);
      return [];
    }
  },
  _saveToLocal(entry) {
    try {
      const all = this._loadFromLocal();
      all.push(entry);
      localStorage.setItem(this.config.storageKey, JSON.stringify(all));
    } catch (e) {
      console.warn('[JournalStorage] Local save failed:', e);
    }
  }
};

// ── UserProfile — same shape as the platform's existing 'fei_user_profile'.
//    Scene Drawing only READS the profile and APPENDS to completedLessons;
//    it never creates a profile from scratch (that's the welcome page's
//    job elsewhere on the platform). If no profile exists yet, Scene
//    Drawing's own localStorage-only progress (sceneDrawingGetLessonProgress
//    in scene-drawing-app.js) still works standalone. ──
const SceneDrawingProfileBridge = {
  storageKey: 'fei_user_profile',
  current() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  // Marks a Scene Drawing lesson complete in the SAME completedLessons
  // array Foundation A uses. Uses the lesson's courseId as the id (see
  // convention note above) so it can't collide with Foundation A's plain
  // 'cube' / 'sphere' ids.
  completeLesson(courseId) {
    const profile = this.current();
    if (!profile) return null; // no platform profile yet — Scene Drawing's own progress still tracks locally
    if (!profile.completedLessons) profile.completedLessons = [];
    if (!profile.completedLessons.includes(courseId)) {
      profile.completedLessons.push(courseId);
    }
    profile.lastSeenAt = Date.now();
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(profile));
    } catch (e) {
      console.warn('[SceneDrawingProfileBridge] save failed:', e);
    }
    return profile;
  },
  hasCompletedLesson(courseId) {
    const profile = this.current();
    return !!(profile && profile.completedLessons && profile.completedLessons.includes(courseId));
  }
};

// ── Course-level badge progress (NOT per-lesson — see philosophy note above) ──
// The required lesson id list now lives in ONE place:
// core/course-badge-registry.js (window.COURSE_BADGE_REGISTRY.scene_designer).
// This file no longer keeps its own copy, so the two can't drift apart.
function sceneDrawingCourseBadgeProgress() {
  const progress = (window.getCourseBadgeProgress ? window.getCourseBadgeProgress() : {}).scene_designer;
  return progress || { doneCount: 0, totalCount: 0, isComplete: false, pct: 0 };
}

// Called once per lesson, at the lesson-complete screen. Writes to the
// shared profile and returns whether THIS action just completed the badge
// (so the UI can show the "badge earned" animation only once, at the
// moment it actually unlocks).
function sceneDrawingMarkLessonComplete(courseId) {
  const before = sceneDrawingCourseBadgeProgress();
  SceneDrawingProfileBridge.completeLesson(courseId);
  const after = sceneDrawingCourseBadgeProgress();
  return { ...after, justUnlocked: !before.isComplete && after.isComplete };
}
