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
  const FREE_CREATION_LIMIT = 3;

  // Oct 2026 — Faye: two specific student codes (Coraline-12,
  // Alicia-11) need narrower rules than the normal "legacy code = full
  // access" bypass below gives every other code. This is a targeted
  // per-user exception, NOT a general custom-permission framework —
  // kept to this one short list, not a new account-tier concept.
  // studentCode is stored uppercase (index.html's login flow does
  // .trim().toUpperCase() before saving the profile), so this must be
  // uppercase to match at runtime.
  const RESTRICTED_LEGACY_CODES = ['CORALINE-12', 'ALICIA-11'];
  // Their one widened exception: Foundation of Sketch Step 1's first 5
  // lessons instead of the default first 2 (FREE_SKILLS) — Step 2-4
  // still require the normal upgrade, same as everyone else.
  // Oct 2026 reorder: Step 1's first 5 ids under the new Level 1 order
  // are preparation, cube, sphere, cylinder, cone (core/foundation-a-
  // path.js). Faye's explicit instruction: keep cup open too, on top
  // of the new first 5, so neither Coraline-12 nor Alicia-11 loses a
  // lesson she may already be partway into under the old first-5
  // (preparation, cube, sphere, cylinder, cup). 6 entries, not 5.
  // core/access.js has no access to FOUNDATION_A_PATH itself — index.
  // html (via core/foundation-a-path.js) owns it — so this is a plain
  // copy, not a derived reference.
  const EXTENDED_PREVIEW_SKILLS = [...FREE_SKILLS, 'sphere', 'cylinder', 'cone', 'cup'];

  // Oct 2026 — Faye: the 4 legacy live-class codes are enrolled in
  // the live Foundation of Sketch A Zoom course, not automatically
  // entitled to the self-paced Smart Class Foundation of Sketch
  // program. They get Step 1 only (through Paper Crane) — Step 2
  // onward (every still-life-* id) requires a separate real purchase,
  // same as any other paying user. Until/unless one of them pays,
  // removing a code from this list is how that upgrade is applied for
  // now — same manual-list pattern as RESTRICTED_LEGACY_CODES above,
  // no Stripe flow requested or built here. Scoped to the 'skills'
  // branch only: their Creation access is already correctly capped by
  // the Oct 2026 3-lesson policy (creationCapExempt below only exempts
  // true admin and genuinely paid non-legacy accounts), and their
  // Zodiac access is already correctly scoped off by hasFullAccess's
  // existing isLiveClass check — neither needed any change here.
  const STEP1_ONLY_LEGACY_CODES = ['JOJO-10', 'A7Q9-FOX', 'SELENA-23', 'XIDA-25'];
  // FOUNDATION_A_PATH's full 11 ids (core/foundation-a-path.js is the
  // real source; core/access.js has no access to it, so this is a
  // plain copy, same convention as EXTENDED_PREVIEW_SKILLS above).
  // Order here does not affect behavior (plain .includes() check) but
  // is kept matching the real order for readability. Oct 2026 reorder.
  const FOUNDATION_A_STEP1_SKILLS = [
    'preparation', 'cube', 'sphere', 'cylinder', 'cone', 'intersecting',
    'box', 'cup', 'apple', 'papercrane', 'icecream'
  ];

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
      if (!raw) return { isLiveClass: false, isAdmin: false, studentCode: null };
      const p = JSON.parse(raw);
      return {
        isLiveClass: !!(p && p.isLiveClass),
        isAdmin: !!(p && p.isAdmin),
        studentCode: (p && p.studentCode) || null
      };
    } catch (e) { return { isLiveClass: false, isAdmin: false, studentCode: null }; }
  }

  // Oct 2026 — generalized to a (column, value) lookup so the same
  // fetch-or-create logic serves both identities this table now keys
  // on: user_id (Supabase accounts) and student_code (legacy /
  // access-code logins — see
  // supabase/smartclass_access_student_code_migration.sql). Only one
  // of the two is ever set on a given row. _fetchOrCreateRow(userId)
  // below is unchanged in behavior/signature for every existing
  // caller; _fetchOrCreateRowByCode is the new legacy-student path.
  async function _fetchOrCreateRowByKey(column, value) {
    if (_cacheUserId === value && _cache) return _cache;
    const sb = _supabase();
    const { data, error } = await sb
      .from('smartclass_access')
      .select('*')
      .eq(column, value)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('[FEIAccess] fetch error', error);
    }

    if (data) {
      _cache = data;
      _cacheUserId = value;
      return data;
    }

    // Create initial row. A legacy/student_code row is already a paid
    // identity by this platform's original design (access code =
    // paid) — unlike a fresh Supabase signup, which starts free.
    const initial = {
      user_id: column === 'user_id' ? value : null,
      student_code: column === 'student_code' ? value : null,
      membership: column === 'student_code' ? 'paid' : 'free',
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
      _cacheUserId = value;
      return initial;
    }
    _cache = inserted;
    _cacheUserId = value;
    return inserted;
  }

  function _fetchOrCreateRow(userId) {
    return _fetchOrCreateRowByKey('user_id', userId);
  }

  function _fetchOrCreateRowByCode(studentCode) {
    return _fetchOrCreateRowByKey('student_code', studentCode);
  }

  async function init() {
    // Just ensure FEIAuth is loaded; lazy-fetch the row when needed.
    if (global.FEIAuth) await global.FEIAuth.init();
  }

  async function getStatus() {
    // Legacy access-code students bypass everything
    if (_isLegacyAccessCode()) {
      const flags = _legacyProfileFlags();
      const isRestricted = RESTRICTED_LEGACY_CODES.includes(flags.studentCode);

      // Oct 2026: admin-tier codes (FAYE-00, DAWN-16) bypass the
      // Creation cap unconditionally regardless of count (see
      // canOpenLesson), so they never need a real smartclass_access
      // row — skip the Supabase round trip for them. Every other
      // legacy code (the 4 existing ones, plus Coraline-12/Alicia-11)
      // is now subject to the cap, so this reads their real row,
      // keyed by student_code (see
      // supabase/smartclass_access_student_code_migration.sql)
      // instead of the hardcoded empty arrays this used to return for
      // every legacy login.
      let openedCreationLessons = [];
      let openedSkillLessons = [];
      if (!flags.isAdmin && flags.studentCode) {
        try {
          const row = await _fetchOrCreateRowByCode(flags.studentCode);
          openedCreationLessons = Array.isArray(row.opened_creation_lessons) ? row.opened_creation_lessons : [];
          openedSkillLessons = Array.isArray(row.opened_skill_lessons) ? row.opened_skill_lessons : [];
        } catch (e) {
          // Fail open on the count itself (matches this file's general
          // philosophy — see gateLessonPage's own fail-open comment):
          // a lookup failure should not block a student from a lesson
          // they could otherwise open, just under-count for now.
          console.warn('[FEIAccess] legacy row fetch failed, defaulting to empty', e);
        }
      }

      return {
        membership: 'paid',
        membershipType: null,
        isLiveClass: flags.isLiveClass,
        isAdmin: flags.isAdmin,
        studentCode: flags.studentCode,
        // True blanket "open every course, including new paid ones" —
        // admin always; a plain legacy code (no isLiveClass) always,
        // matching this platform's original "access code = paid" design;
        // an isLiveClass-but-not-admin code is scoped to their enrolled
        // live course instead (see canOpenLesson/attachSkillsLessonGuard's
        // separate isLiveClassStudent() override for that course) — NOT
        // a blanket pass on every other course a course file may check
        // this field for (e.g. Zodiac). Oct 2026: RESTRICTED_LEGACY_CODES
        // (Coraline-12, Alicia-11) are the one exception to the "plain
        // legacy code always" half of that rule — without this they'd
        // get full Zodiac access as an accidental side effect of having
        // no isLiveClass flag, contradicting the explicit requirement
        // that they see Zodiac's normal default paywall like any other
        // student.
        hasFullAccess: flags.isAdmin || (!flags.isLiveClass && !isRestricted),
        openedCreationLessons: openedCreationLessons,
        openedSkillLessons: openedSkillLessons,
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

    // Oct 2026: RESTRICTED_LEGACY_CODES (Coraline-12, Alicia-11) must
    // NOT hit the blanket "legacy code = everything open" bypass below
    // — that is correct for every other legacy code (including
    // DAWN-16/FAYE-00) on Skills, but these two need the narrower
    // Foundation Step 1 preview rule further down instead.
    const isRestrictedLegacy = status.isLegacy && RESTRICTED_LEGACY_CODES.includes(status.studentCode);

    // Oct 2026: the 4 legacy live-class codes must ALSO not hit the
    // blanket bypass below — same reasoning as isRestrictedLegacy
    // above, different narrower rule further down (Step 1 only,
    // through Paper Crane, instead of a 5-lesson preview).
    const isStep1OnlyLegacy = status.isLegacy && STEP1_ONLY_LEGACY_CODES.includes(status.studentCode);

    // Oct 2026 — Creation 3-lesson cap, permanent platform policy,
    // replaces the old "Creation fully open" rule below. Deliberately
    // checked BEFORE the general bypass and with its own exemption
    // test, NOT isRestrictedLegacy — that list only matters for Skills.
    // This cap is meant to apply to every legacy code, old and new
    // alike (the 4 existing codes included, not just Coraline-12/
    // Alicia-11) — closing the bigger loophole where ANY access code
    // got unlimited free Creation forever via the bypass. Exempt: true
    // admin-tier accounts, and genuinely paid Supabase members.
    // status.membership is hardcoded to 'paid' for every legacy login
    // regardless of real tier, so !status.isLegacy is required in the
    // exemption test too — otherwise every legacy code would read as
    // "paid" and dodge the cap, exactly the loophole being closed.
    if (branch === 'creation') {
      const creationCapExempt = status.isAdmin || (!status.isLegacy && status.membership === 'paid');
      if (!creationCapExempt) {
        const opened = status.openedCreationLessons || [];
        if (opened.includes(lessonId) || opened.length < FREE_CREATION_LIMIT) {
          return { allowed: true, reason: 'creation_within_limit' };
        }
        return { allowed: false, reason: 'paywall_creation' };
      }
      // Exempt — falls through to the general bypass below, which
      // grants full_access to admin and genuinely paid users the same
      // way it already does for Skills.
    }

    // Legacy code OR paid → everything open. !isRestrictedLegacy and
    // !isStep1OnlyLegacy gate the WHOLE condition, not just the
    // isLegacy half — status.membership is unconditionally 'paid' for
    // every legacy profile regardless of which code it is, so without
    // this a restricted/capped code would still slip through via that
    // second half of the OR.
    if (!isRestrictedLegacy && !isStep1OnlyLegacy && (status.isLegacy || status.membership === 'paid')) {
      return { allowed: true, reason: 'full_access' };
    }

    // Free user (or a restricted/capped legacy code, above) — apply branch rules
    if (branch === 'skills') {
      if (FREE_SKILLS.includes(lessonId)) {
        return { allowed: true, reason: 'free_skills' };
      }
      if (isRestrictedLegacy && EXTENDED_PREVIEW_SKILLS.includes(lessonId)) {
        return { allowed: true, reason: 'extended_preview' };
      }
      if (isStep1OnlyLegacy && FOUNDATION_A_STEP1_SKILLS.includes(lessonId)) {
        return { allowed: true, reason: 'step1_only_legacy' };
      }
      // Oct 2026 — a live-course purchase (core/live-courses.js) unlocks
      // the full self-paced Foundation of Sketch program (Step 1 +
      // Step 2, and future Steps per this file's own "nothing to add
      // when Steps 3-4 ship" note above), WITHOUT setting
      // membership='paid' — that would also lift the Creation cap and
      // every other paid scope, which a live-course purchase must not
      // do. Scoped to an EXPLICIT Foundation-of-Sketch lesson-id check
      // (_isFoundationOfSketchLesson), not this whole branch, so any
      // other current or future 'skills'-branch id this function
      // doesn't already special-case above stays on its normal rule.
      //
      // isStep1OnlyLegacy codes are deliberately excluded from the
      // generic "any enrollment qualifies" rule: being one of the 4
      // codes always derives a sketch-a enrollment (their enrolled live
      // course), and that alone must not lift their Step-1-only cap —
      // only a REAL course_purchases row for sketch-b/c/d does. This
      // only ever matters for Step 2 (still-life-*) ids here, since
      // Step 1 ids were already allowed for them two lines up.
      if (_isFoundationOfSketchLesson(lessonId)) {
        const enrollments = await getLiveEnrollments();
        const qualifies = isStep1OnlyLegacy
          ? enrollments.some(function (e) { return !e.derived; })
          : enrollments.length > 0;
        if (qualifies) {
          return { allowed: true, reason: 'live_class_foundation' };
        }
      }
      return { allowed: false, reason: 'paywall_skills' };
    }

    return { allowed: false, reason: 'unknown_branch' };
  }

  // Foundation of Sketch's own lesson-id lists, read live off the globals
  // their owning files set (core/foundation-a-path.js, core/still-life-
  // lesson.js) — same "no direct reference, this file has no access to
  // them at its own load time" convention already used by
  // FOUNDATION_A_STEP1_SKILLS/EXTENDED_PREVIEW_SKILLS above, just derived
  // instead of hand-copied. Scene Drawing Foundation, Color Practice and
  // Zodiac never reach canOpenLesson('skills', ...) at all (confirmed —
  // none of them call gateLessonPage or canOpenLesson anywhere), so this
  // can never accidentally unlock them regardless of their own lesson ids.
  //
  // IMPORTANT: when Step 3 and Step 4 of Foundation of Sketch are built,
  // their lesson-id source (whatever global it turns out to be, likely
  // its own file following the Step 2 pattern) MUST be added to this
  // function too. Forgetting to do so will not break anything visibly —
  // it will just silently leave live-class students unable to open
  // Step 3/4 even after a live-course purchase, since this function is
  // the only place that decides what counts as "Foundation of Sketch."
  function _isFoundationOfSketchLesson(lessonId) {
    const step1 = Array.isArray(global.FOUNDATION_A_PATH) ? global.FOUNDATION_A_PATH : [];
    const step2 = Array.isArray(global.FOUNDATION_STILL_LIFE_PATH) ? global.FOUNDATION_STILL_LIFE_PATH : [];
    return step1.some(function (l) { return l.id === lessonId; })
      || step2.some(function (l) { return l.id === lessonId; });
  }

  // Cache per identity (same shape as _cache/_cacheUserId above), so
  // canOpenLesson('skills', id) called repeatedly in a loop (e.g.
  // attachSkillsLessonGuard iterating every lesson link on the map)
  // doesn't re-query course_purchases once per lesson.
  let _liveEnrollmentsCache = null;
  let _liveEnrollmentsCacheKey = null;

  // Returns [{courseId, derived}] — courseId is the BARE id matching
  // core/live-courses.js (e.g. 'sketch-b'), not the 'live-' prefixed
  // course_purchases.course_id. derived:true means inferred from
  // isLiveClass / membership_type === 'live_class' (the platform's
  // original single-live-course design — sketch-a only), NOT a real
  // course_purchases row. canOpenLesson's isStep1OnlyLegacy branch above
  // relies on this distinction directly.
  async function getLiveEnrollments() {
    if (_isLegacyAccessCode()) {
      const flags = _legacyProfileFlags();
      const key = 'code:' + (flags.studentCode || '');
      if (_liveEnrollmentsCacheKey === key && _liveEnrollmentsCache) return _liveEnrollmentsCache;
      const result = [];
      if (flags.isLiveClass) result.push({ courseId: 'sketch-a', derived: true });
      if (flags.studentCode) {
        try {
          const sb = _supabase();
          const { data, error } = await sb
            .from('course_purchases')
            .select('course_id')
            .eq('student_code', flags.studentCode);
          if (!error && Array.isArray(data)) {
            data.forEach(function (row) {
              if (row.course_id && row.course_id.indexOf('live-') === 0) {
                result.push({ courseId: row.course_id.slice(5), derived: false });
              }
            });
          }
        } catch (e) {
          console.warn('[FEIAccess] getLiveEnrollments legacy lookup failed', e);
        }
      }
      _liveEnrollmentsCache = result;
      _liveEnrollmentsCacheKey = key;
      return result;
    }

    const user = global.FEIAuth ? await global.FEIAuth.getUser() : null;
    if (!user) return [];
    const key = 'user:' + user.id;
    if (_liveEnrollmentsCacheKey === key && _liveEnrollmentsCache) return _liveEnrollmentsCache;

    const result = [];
    try {
      const row = await _fetchOrCreateRow(user.id);
      // Old-style live_class purchases (markPaid('live_class')) already
      // set membership='paid', so this never changes their canOpenLesson
      // outcome in practice — kept for getLiveEnrollments() callers that
      // need the full enrollment list regardless (e.g. the dashboard
      // catalog), so their sketch-a card renders as enrolled too.
      if (row.membership_type === 'live_class') result.push({ courseId: 'sketch-a', derived: true });
    } catch (e) {
      console.warn('[FEIAccess] getLiveEnrollments membership_type lookup failed', e);
    }
    try {
      const sb = _supabase();
      const { data, error } = await sb
        .from('course_purchases')
        .select('course_id')
        .eq('user_id', user.id);
      if (!error && Array.isArray(data)) {
        data.forEach(function (row) {
          if (row.course_id && row.course_id.indexOf('live-') === 0) {
            result.push({ courseId: row.course_id.slice(5), derived: false });
          }
        });
      }
    } catch (e) {
      console.warn('[FEIAccess] getLiveEnrollments user lookup failed', e);
    }
    _liveEnrollmentsCache = result;
    _liveEnrollmentsCacheKey = key;
    return result;
  }

  // courseId: bare id (e.g. 'sketch-b'), matching core/live-courses.js.
  // Stored as 'live-' + courseId in course_purchases.course_id — the
  // same prefix convention core/live-courses.js documents, so
  // core/ink-animal-access.js's 'ink-animal-studio' course_id (no
  // prefix) can never collide with a live-course enrollment row.
  //
  // Unlike markPaid(), this MUST work for legacy/access-code students —
  // Part 0 confirmed markPaid() returns early for them, which is exactly
  // why a code-login student paying for a live course today gets nothing
  // recorded. Checks-before-insert on the student_code path (Faye's
  // explicit instruction) — the DB also enforces this now via
  // course_purchases_code_course_uniq, but checking first avoids a
  // wasted round trip and a conflict response in the normal case. The
  // user_id path relies on the table's original unique(user_id,
  // course_id) constraint instead — already real, already sufficient,
  // no need to duplicate the pre-check there.
  async function recordLiveEnrollment(courseId) {
    if (!courseId) return;
    const fullCourseId = 'live-' + courseId;
    _liveEnrollmentsCache = null; // stale after a successful insert below
    _liveEnrollmentsCacheKey = null;

    if (_isLegacyAccessCode()) {
      const flags = _legacyProfileFlags();
      if (!flags.studentCode) return;
      const sb = _supabase();
      try {
        const { data: existing, error: lookupErr } = await sb
          .from('course_purchases')
          .select('id')
          .eq('student_code', flags.studentCode)
          .eq('course_id', fullCourseId)
          .maybeSingle();
        if (lookupErr) console.warn('[FEIAccess] recordLiveEnrollment lookup error', lookupErr);
        if (existing) return;
      } catch (e) {
        console.warn('[FEIAccess] recordLiveEnrollment lookup failed', e);
      }
      const { error } = await sb.from('course_purchases').insert({
        student_code: flags.studentCode,
        course_id: fullCourseId
      });
      if (error) console.warn('[FEIAccess] recordLiveEnrollment insert error', error);
      return;
    }

    const user = global.FEIAuth ? await global.FEIAuth.getUser() : null;
    if (!user) return;
    const sb = _supabase();
    const { error } = await sb.from('course_purchases').insert({
      user_id: user.id,
      course_id: fullCourseId
    });
    if (error) console.warn('[FEIAccess] recordLiveEnrollment insert error', error);
  }

  async function recordLessonOpened(branch, lessonId) {
    try {
      const profile=JSON.parse(sessionStorage.getItem('fei_user_profile')||'null');
      const identity=profile?.supabaseUserId||profile?.studentCode||profile?.learnerId||profile?.id;
      if(identity && typeof lessonId==='string' && ['skills','creation'].includes(branch)) {
        const key='feiDashboard.opened.v1:'+encodeURIComponent(identity);
        const saved=JSON.parse(localStorage.getItem(key)||'[]');
        const list=Array.isArray(saved)?saved:[];
        localStorage.setItem(key,JSON.stringify([{id:lessonId,branch,at:Date.now()},...list.filter(x=>x.id!==lessonId||x.branch!==branch)].slice(0,100)));
      }
    } catch {} // A storage restriction must never block lesson access.

    let row, matchColumn, matchValue;

    if (_isLegacyAccessCode()) {
      // Oct 2026: admin-tier codes never hit the Creation cap, so
      // there is nothing to record for them — skip the write (and
      // avoid creating a spurious smartclass_access row for FAYE-00/
      // DAWN-16, which would be a confusing thing to find in a table
      // meant for cap usage). Every other legacy code now gets a real
      // row, keyed by student_code, same as the Supabase-user path
      // below keys by user_id.
      const flags = _legacyProfileFlags();
      if (flags.isAdmin || !flags.studentCode) return;
      row = await _fetchOrCreateRowByCode(flags.studentCode);
      matchColumn = 'student_code';
      matchValue = flags.studentCode;
    } else {
      const user = global.FEIAuth ? await global.FEIAuth.getUser() : null;
      if (!user) return;
      row = await _fetchOrCreateRow(user.id);
      matchColumn = 'user_id';
      matchValue = user.id;
    }

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
      .eq(matchColumn, matchValue)
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
    getLiveEnrollments: getLiveEnrollments,
    recordLiveEnrollment: recordLiveEnrollment,
    FREE_SKILLS: FREE_SKILLS,
    FREE_CREATION_LIMIT: FREE_CREATION_LIMIT
  };
})(window);
