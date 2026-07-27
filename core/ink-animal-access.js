/**
 * FEI TeamArt · Ink Animal Studio — course-specific purchase check
 *
 * Deliberately separate from core/access.js / smartclass_access. That
 * table is single-row-per-user (one site-wide membership flag) and has
 * no concept of "paid for course X" — see supabase/course_purchases_migration.sql
 * for why this needed its own table instead of extending it.
 *
 * Two-layer access model for this course:
 *   1. FEIAccess.gateLessonPage('creation', 'ink-animal-studio') — the
 *      SAME generic gate every Creation course uses (counts toward the
 *      free-2-lessons limit). Decides if a student can enter the course
 *      at all. Unchanged, reused as-is.
 *   2. InkAnimalAccess.hasPurchased() — decides if a student can go past
 *      Rabbit (animal 01, always free) into animals 02-10. Independent
 *      of #1: a student can be inside the course (passed the generic
 *      gate) but still locked out of animal 2+ without this purchase.
 *
 * Public API (window.InkAnimalAccess):
 *   InkAnimalAccess.hasPurchased()          → Promise<boolean>
 *   InkAnimalAccess.getPurchaseUrl()        → string (Stripe Payment Link)
 *   InkAnimalAccess.recordPurchase(session) → Promise<void>  (call after Stripe success redirect)
 *
 * Companion Supabase table: course_purchases
 *   (see /supabase/course_purchases_migration.sql)
 * ─────────────────────────────────────────────────────────────────
 */
(function (global) {
  'use strict';

  const COURSE_ID = 'ink-animal-studio';

  // ⚠️ Not configured yet. Faye: paste the real Stripe Payment Link for
  // this course here once it exists — do NOT reuse one of the 3
  // site-wide membership links (smart_feedback / smart_plus_teacher /
  // online_teacher_group) from upgrade/index.html, those unlock the
  // whole platform, not just this course.
  const PURCHASE_URL = '';

  function _supabase() {
    if (!global.FEIAuth) throw new Error('InkAnimalAccess requires FEIAuth to be loaded');
    return global.FEIAuth.getClient();
  }

  // Legacy access-code students: identified via the sessionStorage
  // profile (NOT localStorage — per the July 2026 Safari-iframe fix,
  // fei_user_profile lives in sessionStorage now). Note this is the
  // correct convention; core/access.js's own _isLegacyAccessCode() still
  // reads localStorage and was missed in that migration.
  function _legacyStudentCode() {
    try {
      const raw = global.sessionStorage.getItem('fei_user_profile');
      if (!raw) return null;
      const p = JSON.parse(raw);
      return (p && p.studentCode && p.tier) ? p.studentCode : null;
    } catch (e) {
      return null;
    }
  }

  async function hasPurchased() {
    try {
      const sb = _supabase();
      const studentCode = _legacyStudentCode();

      if (studentCode) {
        const { data, error } = await sb
          .from('course_purchases')
          .select('id')
          .eq('student_code', studentCode)
          .eq('course_id', COURSE_ID)
          .maybeSingle();
        if (error) { console.warn('[InkAnimalAccess] lookup error', error); return false; }
        return !!data;
      }

      const user = global.FEIAuth ? await global.FEIAuth.getUser() : null;
      if (!user) return false;

      const { data, error } = await sb
        .from('course_purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', COURSE_ID)
        .maybeSingle();
      if (error) { console.warn('[InkAnimalAccess] lookup error', error); return false; }
      return !!data;
    } catch (err) {
      // Fail closed here (unlike FEIAccess.gateLessonPage, which fails
      // open) — a lookup failure should show "locked" + the paywall,
      // not silently grant 9 paid animals for free.
      console.warn('[InkAnimalAccess] hasPurchased failed', err);
      return false;
    }
  }

  function getPurchaseUrl() {
    return PURCHASE_URL;
  }

  // Call after a Stripe success redirect, mirroring how
  // FEIAccess.markPaid() is called elsewhere in this app — same trust
  // model (redirect implies payment succeeded), not webhook-verified.
  async function recordPurchase(stripeSessionId) {
    const sb = _supabase();
    const studentCode = _legacyStudentCode();
    const row = {
      course_id: COURSE_ID,
      stripe_session_id: stripeSessionId || null
    };

    if (studentCode) {
      row.student_code = studentCode;
    } else {
      const user = global.FEIAuth ? await global.FEIAuth.getUser() : null;
      if (!user) { console.warn('[InkAnimalAccess] recordPurchase: no identity'); return; }
      row.user_id = user.id;
    }

    const { error } = await sb.from('course_purchases').insert(row);
    if (error) console.warn('[InkAnimalAccess] recordPurchase error', error);
  }

  global.InkAnimalAccess = {
    hasPurchased: hasPurchased,
    getPurchaseUrl: getPurchaseUrl,
    recordPurchase: recordPurchase,
    COURSE_ID: COURSE_ID
  };
})(window);
