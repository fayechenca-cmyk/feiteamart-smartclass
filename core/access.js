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
 *   Creation branch: fully open for now, no paywall (per Faye, Sept 2026 —
 *                     see canOpenLesson's 'creation' branch; the old any-2-
 *                     lessons-free limit is left in place, unused, for a
 *                     later subscription-model pass, not this one again).
 *
 * Foundation of Sketch v1.1 §3a (Sept 2026) — Step 2 ("Still Life and
 * Texture") is part of this SAME 'skills' branch/entitlement, not a
 * separate paid scope. Its 10 lesson ids (still-life-1a-... through
 * still-life-5b-..., see core/still-life-lesson.js) are intentionally
 * NOT added to FREE_SKILLS below, which is the only "registration" this
 * branch needs: canOpenLesson('skills', id) is already default-deny —
 * any id not in FREE_SKILLS falls through to `paywall_skills` — so a
 * Step 2 id is automatically gated the exact same way Step 1's sphere-
 * onward lessons already are, with zero code change here. The legacy/
 * admin/paid bypass a few lines down in canOpenLesson() is also
 * unconditional on lessonId, so Faye's own code and the 4 live-class
 * codes already reach every Step 2 id too, for the same reason. Future
 * Steps 3-4 lesson ids work the same way — nothing to add here when
 * they ship either.
 *
 * Public API (window.FEIAccess):
 *   FEIAccess.init()                      → Promise<void>
 *   FEIAccess.getStatus()                 → Promise<{membership, openedCreationLessons, openedSkillLessons, isLegacy, isLiveClass, isAdmin, hasFullAccess}>
 *   FEIAccess.canOpenLesson(branch, id)   → Promise<{allowed, reason}>
 *                                           branch = 'skills' | 'creation'
 *   FEIAccess.recordLessonOpened(branch, id) → Promise<void>
 *   FEIAccess.markPaid()                  → Promise<void>   (after Stripe success)
 *
 * hasFullAccess (Sept 2026 addition) — the field a NEW paid course (e.g.
 * Zodiac) should check for "is this genuinely a full-access identity,"
 * NOT isLegacy. isLegacy is true for every access-code student including
 * the 4 isLiveClass-flagged ones (JOJO-10, A7Q9-FOX, SELENA-23, XIDA-25),
 * who per Faye's explicit instruction should NOT get a blanket bypass on
 * courses outside their enrolled live course. hasFullAccess is false for
 * exactly that one case; true for admin (FAYE-00), true for every other
 * legacy code (unchanged original "access code = paid" behavior), and
 * mirrors `membership === 'paid'` for real Supabase accounts.
 *
 * Companion Supabase table (created via /core/access-schema.sql):
 *   smartclass_access (user_id PK, membership, membership_type,
 *                      opened_creation_lessons jsonb,
 *                      opened_skill_lessons jsonb, paid_at, updated_at, created_at)
 *
 * membership_type (added for Stripe 3-tier auto-unlock):
 *   'ai_feedback' | 'ai_teacher' | 'live_class' | null
 *   All three paid tiers set membership = 'paid' (full lesson access,
 *   no change to canOpenLesson() below). membership_type only adds
 *   extra info — currently just whether the live-class submit button
 *   should show (isLiveClass = membership_type === 'live_class').
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
    // Returns true if there's a legacy access-code profile in sessionStorage AND no Supabase session.
    // fei_user_profile lives in sessionStorage (see index.html saveProfile()) — this used to read
    // localStorage, a leftover from before that migration, which meant it always returned false.
    try {
      const raw = global.sessionStorage.getItem('fei_user_profile');
      if (!raw) return false;
      const p = JSON.parse(raw);
      return !!(p && p.studentCode && p.tier);
    } catch (e) { return false; }
  }

  // Sept 2026 — per Faye's platform-wide access clarification: not every
  // legacy access-code student should count as "full access to literally
  // everything." isLiveClass-flagged codes (core/student-access-codes.js —
  // JOJO-10, A7Q9-FOX, SELENA-23, XIDA-25) are enrolled in ONE live course
  // (currently Foundation of Sketch A) and should see normal free/paid
  // rules everywhere else, e.g. Zodiac's Step 3 paywall — same as any
  // other student. FAYE-00 (isAdmin:true) is the one deliberate blanket
  // exception. Reads the raw profile once so getStatus() can report real
  // isLiveClass/isAdmin instead of the old hardcoded isLiveClass:false.
  // Deliberately NOT used by canOpenLesson() below — that function's
  // existing isLegacy-based bypass stays untouched (Creation/Sketch's
  // working access paths, including the home page's separate
  // isLiveClassStudent() override for Sketch, don't go through this) —
  // this is additive, read directly by course files (e.g. Zodiac) that
  // need the finer distinction.
  function _legacyProfileFlags() {
    try {
      const raw = global.sessionStorage.getItem('fei_user_profile');
      if (!raw) return { isLiveClass: false, isAdmin: false };
      const p = JSON.parse(raw);
      return { isLiveClass: !!(p && p.isLiveClass), isAdmin: !!(p && p.isAdmin) };
    } catch (e) { return { isLiveClass: false, isAdmin: false }; }
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
      const flags = _legacyProfileFlags();
      return {
        membership: 'paid',
        membershipType: null,
        isLiveClass: flags.isLiveClass,
        isAdmin: flags.isAdmin,
        // True blanket "open every course, including new paid ones" —
        // admin always; a plain legacy code (no isLiveClass) always,
        // matching this platform's original "access code = paid" design;
        // an isLiveClass-but-not-admin code is scoped to their enrolled
        // live course instead (see canOpenLesson/attachSkillsLessonGuard's
        // separate isLiveClassStudent() override for that course) — NOT
        // a blanket pass on every other course a course file may check
        // this field for (e.g. Zodiac).
        hasFullAccess: flags.isAdmin || !flags.isLiveClass,
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
        membershipType: null,
        isLiveClass: false,
        isAdmin: false,
        hasFullAccess: false,
        openedCreationLessons: [],
        openedSkillLessons: [],
        isLegacy: false,
        user: null
      };
    }

    const row = await _fetchOrCreateRow(user.id);
    return {
      membership: row.membership || 'free',
      membershipType: row.membership_type || null,
      isLiveClass: row.membership_type === 'live_class',
      isAdmin: false,
      hasFullAccess: row.membership === 'paid',
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
      // Sept 2026 — per Faye's platform-wide access clarification: Creation
      // is fully open to everyone for now ("functioning like a playground
      // while the library is small"), no paywall. FREE_CREATION_LIMIT and
      // the opened-lessons tracking above are left in place, unused by
      // this branch, deliberately — she's planning a subscription model
      // once the library grows, not this per-course free-limit again, but
      // wants the option to flip this single early-return back off in the
      // meantime without rebuilding the tracking machinery.
      return { allowed: true, reason: 'creation_open_for_now' };
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

  // plan (optional): 'ai_feedback' | 'ai_teacher' | 'live_class' — from the
  // Stripe success redirect (?plan=X). All three unlock full access the same
  // way; plan is stored as membership_type so isLiveClass can be derived.
  async function markPaid(plan) {
    if (_isLegacyAccessCode()) return;
    const user = global.FEIAuth ? await global.FEIAuth.getUser() : null;
    if (!user) return;
    const sb = _supabase();
    const patch = { membership: 'paid', paid_at: new Date().toISOString() };
    if (plan) patch.membership_type = plan;
    const { data, error } = await sb
      .from('smartclass_access')
      .update(patch)
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
