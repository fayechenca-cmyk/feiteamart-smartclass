/* ============================================================
 * FEI TeamArt · core/progress.js
 * Supabase-backed student progress persistence.
 *
 * Replaces localStorage-only storage which Safari wipes after
 * ~7 days of inactivity (ITP — Intelligent Tracking Prevention).
 *
 * ARCHITECTURE:
 *   - localStorage = fast cache (immediate reads/writes)
 *   - Supabase = source of truth (persists forever)
 *
 * On login:  read Supabase → merge with localStorage → use newest
 * On step complete: write localStorage immediately + write Supabase async
 * On re-entry: read Supabase in background → update if newer than local
 *
 * NOTE: access-code students (LILY-01, TRYNEW, etc.) have no Supabase
 * Auth session, so this talks to the REST API directly with the anon
 * key rather than going through the supabase-js SDK client used by
 * core/auth.js / core/submissions.js. The `student_progress` table's
 * RLS policy must allow anon read/write filtered by student_code.
 * ============================================================ */

const FEIProgress = {

  // ── Config ────────────────────────────────────────────────
  SUPABASE_URL: 'https://rudztwseatwayhztbarj.supabase.co',
  SUPABASE_KEY: 'sb_publishable_NvPeY8sJYN8v4CoP1_X0BQ_RdluuoYT',

  TABLE: 'student_progress',

  // ── Public API ────────────────────────────────────────────

  /**
   * Load progress for a student from Supabase.
   * Called on login / re-entry.
   * Returns the progress object or null if no record exists yet.
   */
  async load(studentCode) {
    if (!studentCode) return null;
    try {
      const res = await fetch(
        `${this.SUPABASE_URL}/rest/v1/${this.TABLE}?student_code=eq.${encodeURIComponent(studentCode)}&limit=1`,
        {
          headers: {
            'apikey': this.SUPABASE_KEY,
            'Authorization': `Bearer ${this.SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (!res.ok) {
        console.warn('[FEIProgress] load failed:', res.status);
        return null;
      }
      const rows = await res.json();
      return rows.length > 0 ? rows[0] : null;
    } catch (e) {
      console.warn('[FEIProgress] load error:', e);
      return null;
    }
  },

  /**
   * Save/update progress for a student to Supabase.
   * Called after each step completion. Fire-and-forget (async, non-blocking).
   *
   * @param {string} studentCode
   * @param {object} progress - shape:
   *   {
   *     current_lesson: 'cube',
   *     current_step_idx: 3,
   *     completed_lessons: ['cube'],
   *     completed_steps: { cube: [0,1,2,3] },
   *     total_xp: 45,
   *     age_group: 'teen'
   *   }
   */
  async save(studentCode, progress) {
    if (!studentCode || !progress) return;
    try {
      const payload = {
        student_code: studentCode,
        current_lesson: progress.current_lesson || progress.currentLesson || null,
        current_step_idx: progress.current_step_idx ?? progress.currentStepIdx ?? 0,
        completed_lessons: progress.completed_lessons || progress.completedLessons || [],
        completed_steps: progress.completed_steps || progress.completedSteps || {},
        total_xp: progress.total_xp || progress.totalXP || 0,
        age_group: progress.age_group || progress.ageGroup || null
      };

      const res = await fetch(
        `${this.SUPABASE_URL}/rest/v1/${this.TABLE}`,
        {
          method: 'POST',
          headers: {
            'apikey': this.SUPABASE_KEY,
            'Authorization': `Bearer ${this.SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.warn('[FEIProgress] save failed:', res.status, err);
      } else {
        console.log('[FEIProgress] saved for:', studentCode);
      }
    } catch (e) {
      console.warn('[FEIProgress] save error:', e);
      // Non-fatal: localStorage still has the data as fallback
    }
  },

  /**
   * Merge Supabase progress with localStorage profile.
   * Supabase wins if it has equal or more totalXP, otherwise keep local.
   * Returns the merged profile object ready to pass to UserProfile.update().
   */
  mergeWithLocal(supabaseRow, localProfile) {
    if (!supabaseRow) return localProfile;
    if (!localProfile) {
      // No local profile — use Supabase data to rebuild
      return {
        studentCode: supabaseRow.student_code,
        currentLesson: supabaseRow.current_lesson,
        currentStepIdx: supabaseRow.current_step_idx,
        completedLessons: supabaseRow.completed_lessons || [],
        completedSteps: supabaseRow.completed_steps || {},
        totalXP: supabaseRow.total_xp || 0,
        ageGroup: supabaseRow.age_group
      };
    }

    // Both exist — use whichever has more progress (higher totalXP wins)
    const supabaseXP = supabaseRow.total_xp || 0;
    const localXP = localProfile.totalXP || 0;

    if (supabaseXP >= localXP) {
      // Supabase has same or more progress — use it
      return {
        ...localProfile,
        currentLesson: supabaseRow.current_lesson || localProfile.currentLesson,
        currentStepIdx: supabaseRow.current_step_idx ?? localProfile.currentStepIdx,
        completedLessons: supabaseRow.completed_lessons || localProfile.completedLessons || [],
        completedSteps: supabaseRow.completed_steps || localProfile.completedSteps || {},
        totalXP: supabaseXP,
        ageGroup: supabaseRow.age_group || localProfile.ageGroup
      };
    }

    // Local is ahead — keep local but Supabase will catch up on next save
    return localProfile;
  },

  /**
   * Quick helper: save progress from a UserProfile object.
   * Call this wherever UserProfile.update() is called.
   */
  async saveFromProfile(profile) {
    if (!profile || !profile.studentCode) return;
    await this.save(profile.studentCode, {
      current_lesson: profile.currentLesson,
      current_step_idx: profile.currentStepIdx,
      completed_lessons: profile.completedLessons,
      completed_steps: profile.completedSteps || {},
      total_xp: profile.totalXP,
      age_group: profile.ageGroup
    });
  }
};

// Make available globally (loaded via <script> tag, not ES module import)
window.FEIProgress = FEIProgress;
