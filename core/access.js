/**
 * FEI TeamArt · Access Control
 * Decides whether a user can open a given Smart Class lesson.
 *
 * Two paths into the platform:
 *   1. Legacy: access-code students (LILY-01, TRYNEW, etc.) — treated as `paid`
 *   2. New: Supabase-registered students — start as `free`, may upgrade to `paid`
 *
 * Free access rules (per Final Registration Decision):
 *   Skills branch:   `preparation` + `cube` are free. 3rd Skills lesson triggers paywall.
 *   Creation branch: any 2 lessons free. 3rd unique Creation lesson triggers paywall.
 *
 * Public API (window.FEIAccess):
 *   FEIAccess.init()                      → Promise<void>
 *   FEIAccess.getStatus()                 → Promise<{membership, openedCreationLessons, openedSkillLessons, isLegacy}>
 *   FEIAccess.canOpenLesson(branch, id)   → Promise<{allowed, reason}>
 *                                           branch = 'skills' | 'creation'
 *   FEIAccess.recordLessonOpened(branch, id) → Promise<void>
 *   FEIAccess.markPaid()                  → Promise<void>   (after Stripe success)
 *
 * Companion Supabase table (created via /core/access-schema.sql):
 *   smartclass_access (user_id PK, membership, opened_creation_lessons jsonb,
 *                      opened_skill_lessons jsonb, paid_at, updated_at, created_at)
 *
 * Skills free set: preparation, cube
 * (preparation does not count toward badges; both are free.)
 * ─────────────────────────────────────────────────────────────────
 */
(function (global) {
  'use strict';

  const FREE_SKILLS = ['preparation', 'cube'];
  const FREE_CREATION_LIMIT = 2;

  // Cache the access row so we don't hit Supabase on every nav.
  let _cache = null;
  let _cacheUserId = null;

  function _supabase() {
    if (!global.FEIAuth) throw new Error('FEIAccess requires FEIAuth to be loaded');
    return global.FEIAuth.getClient();
  }

  function _isLegacyAccessCode() {
    // Returns true if there's a legacy access-code profile in localStorage AND no Supabase session.
    try {
      const raw = global.localStorage.getItem('fei_user_profile');
      if (!raw) return false;
      const p = JSON.parse(raw);
      return !!(p && p.studentCode && p.tier);
    } catch (e) { return false; }
  }

  async function _fetchOrCreateRow(userId) {
    if (_cacheUserId === userId && _cache) return _cache;
    const sb = _supabase();
    const { data, error } = await sb
      .from('smartclass_access')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('[FEIAccess] fetch error', error);
    }

    if (data) {
      _cache = data;
      _cacheUserId = userId;
      return data;
    }

    // Create initial row
    const initial = {
      user_id: userId,
      membership: 'free',
      opened_creation_lessons: [],
      opened_skill_lessons: [],
      paid_at: null
    };
    const { data: inserted, error: insErr } = await sb
      .from('smartclass_access')
      .insert(initial)
      .select()
      .single();

    if (insErr) {
      console.warn('[FEIAccess] insert error', insErr);
      // Fall back to in-memory only
      _cache = initial;
      _cacheUserId = userId;
      return initial;
    }
    _cache = inserted;
    _cacheUserId = userId;
    return inserted;
  }

  async function init() {
    // Just ensure FEIAuth is loaded; lazy-fetch the row when needed.
    if (global.FEIAuth) await global.FEIAuth.init();
  }

  async function getStatus() {
    // Legacy access-code students bypass everything
    if (_isLegacyAccessCode()) {
      return {
        membership: 'paid',
        openedCreationLessons: [],
        openedSkillLessons: [],
        isLegacy: true,
        user: null
      };
    }

    const user = global.FEIAuth ? await global.FEIAuth.getUser() : null;
    if (!user) {
      return {
        membership: null,
        openedCreationLessons: [],
        openedSkillLessons: [],
        isLegacy: false,
        user: null
      };
    }

    const row = await _fetchOrCreateRow(user.id);
    return {
      membership: row.membership || 'free',
      openedCreationLessons: Array.isArray(row.opened_creation_lessons) ? row.opened_creation_lessons : [],
      openedSkillLessons: Array.isArray(row.opened_skill_lessons) ? row.opened_skill_lessons : [],
      isLegacy: false,
      user: user
    };
  }

  async function canOpenLesson(branch, lessonId) {
    const status = await getStatus();

    // No user at all → must register/log in first
    if (!status.user && !status.isLegacy) {
      return { allowed: false, reason: 'not_signed_in' };
    }

    // Legacy code OR paid → everything open
    if (status.isLegacy || status.membership === 'paid') {
      return { allowed: true, reason: 'full_access' };
    }

    // Free user — apply branch rules
    if (branch === 'skills') {
      if (FREE_SKILLS.includes(lessonId)) {
        return { allowed: true, reason: 'free_skills' };
      }
      return { allowed: false, reason: 'paywall_skills' };
    }

    if (branch === 'creation') {
      const opened = status.openedCreationLessons;
      if (opened.includes(lessonId)) {
        // Already started — review allowed
        return { allowed: true, reason: 'creation_review' };
      }
      if (opened.length < FREE_CREATION_LIMIT) {
        return { allowed: true, reason: 'free_creation' };
      }
      return { allowed: false, reason: 'paywall_creation' };
    }

    return { allowed: false, reason: 'unknown_branch' };
  }

  async function recordLessonOpened(branch, lessonId) {
    // Legacy or no user → no-op
    if (_isLegacyAccessCode()) return;
    const user = global.FEIAuth ? await global.FEIAuth.getUser() : null;
    if (!user) return;

    const row = await _fetchOrCreateRow(user.id);
    const col = branch === 'creation' ? 'opened_creation_lessons' : 'opened_skill_lessons';
    const list = Array.isArray(row[col]) ? row[col].slice() : [];
    if (list.includes(lessonId)) return;
    list.push(lessonId);

    const sb = _supabase();
    const patch = {};
    patch[col] = list;
    const { data, error } = await sb
      .from('smartclass_access')
      .update(patch)
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) {
      console.warn('[FEIAccess] recordLessonOpened error', error);
      return;
    }
    _cache = data;
  }

  async function markPaid() {
    if (_isLegacyAccessCode()) return;
    const user = global.FEIAuth ? await global.FEIAuth.getUser() : null;
    if (!user) return;
    const sb = _supabase();
    const { data, error } = await sb
      .from('smartclass_access')
      .update({ membership: 'paid', paid_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) {
      console.warn('[FEIAccess] markPaid error', error);
      return;
    }
    _cache = data;
  }

  function clearCache() { _cache = null; _cacheUserId = null; }

  // ─────────────────────────────────────────────────────────────────
  // gateLessonPage(branch, lessonId)
  //
  // Called by individual lesson pages at startup to enforce the paywall
  // BEFORE rendering anything. If the user is allowed, returns true (the
  // lesson proceeds normally). If not allowed, redirects to home with a
  // paywall query param and returns false (lesson should abort init).
  //
  // Also records the lesson as "opened" for Creation lessons (counts
  // toward the 2-free limit).
  //
  // Use at the very top of each lesson file's init() / DOMContentLoaded:
  //
  //   const ok = await window.FEIAccess.gateLessonPage('skills', 'sphere');
  //   if (!ok) return;   // we're redirecting — stop rendering
  //
  // ─────────────────────────────────────────────────────────────────
  async function gateLessonPage(branch, lessonId) {
    try {
      const check = await canOpenLesson(branch, lessonId);
      if (check.allowed) {
        // Record opening (no-op for legacy / non-Creation)
        if (branch === 'creation') {
          recordLessonOpened(branch, lessonId).catch(() => {});
        }
        return true;
      }
      if (check.reason === 'not_signed_in') {
        // Send to home for sign-in
        global.location.href = _homeUrl() + '?signin=required&from=' + encodeURIComponent(branch + ':' + lessonId);
        return false;
      }
      // Blocked by paywall — send to home with paywall flag
      global.location.href = _homeUrl() + '?paywall=' + branch + '&lesson=' + encodeURIComponent(lessonId);
      return false;
    } catch (err) {
      // If access check fails (network, etc.), fail OPEN — don't lock students
      // out due to a bug. Better to let one extra lesson through than to break
      // a paid student's flow.
      console.warn('[FEIAccess.gateLessonPage] check failed, allowing through', err);
      return true;
    }
  }

  // Compute the path to the home page from a lesson page.
  // Lesson pages live at: /feiteamart-smartclass/lessons/<lesson-id>/index.html
  // Home lives at:       /feiteamart-smartclass/index.html
  // So from any lesson, '../../' gets us to home.
  function _homeUrl() {
    // If running on file:// with a deep path, '../../' still works.
    // If running on a custom domain root, '../../' still works.
    return '../../';
  }

  global.FEIAccess = {
    init: init,
    getStatus: getStatus,
    canOpenLesson: canOpenLesson,
    recordLessonOpened: recordLessonOpened,
    markPaid: markPaid,
    clearCache: clearCache,
    gateLessonPage: gateLessonPage,
    FREE_SKILLS: FREE_SKILLS,
    FREE_CREATION_LIMIT: FREE_CREATION_LIMIT
  };
})(window);
