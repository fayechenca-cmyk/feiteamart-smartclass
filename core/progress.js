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
 *
 * PLATFORM-WIDE FIX (see supabase/student_progress_user_id_migration.sql):
 * this module used to ONLY key rows by student_code — meaning it never
 * engaged for real Supabase-Auth accounts (email/Google sign-in), whose
 * profile always has studentCode: null. That was the confirmed root
 * cause of in-lesson step position not surviving a closed browser for
 * real accounts (fei_user_profile is sessionStorage-only, deliberately,
 * per the Safari-iframe fix — this table is the durable layer meant to
 * back it up, but only actually did so for legacy codes). Every
 * function below now accepts EITHER identifier — student_code (string,
 * existing behavior, unchanged) or a Supabase Auth user id (new) — via
 * the *ByUserId methods and the generalized saveFromProfile/
 * loadForProfile dispatchers, without changing any existing call's
 * signature or behavior.
 * ============================================================ */

const FEIProgress = {

  // ── Config ────────────────────────────────────────────────
  SUPABASE_URL: 'https://rudztwseatwayhztbarj.supabase.co',
  SUPABASE_KEY: 'sb_publishable_NvPeY8sJYN8v4CoP1_X0BQ_RdluuoYT',

  TABLE: 'student_progress',

  // ── Public API ────────────────────────────────────────────

  /**
   * Shared column-generic implementation behind load()/loadByUserId() —
   * `column` is 'student_code' or 'user_id', both real columns on
   * student_progress (see supabase/student_progress_user_id_migration.sql).
   */
  async _loadByColumn(column, value) {
    if (!value) return null;
    try {
      const res = await fetch(
        `${this.SUPABASE_URL}/rest/v1/${this.TABLE}?${column}=eq.${encodeURIComponent(value)}&limit=1`,
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
   * Load progress for a legacy access-code student from Supabase.
   * Called on login / re-entry. Returns the progress object or null if
   * no record exists yet. Unchanged behavior/signature.
   */
  async load(studentCode) {
    return this._loadByColumn('student_code', studentCode);
  },

  /**
   * Load progress for a real Supabase-Auth account (email/Google
   * sign-in) from Supabase, keyed by their auth.users id instead of a
   * student code. New — see the platform-wide fix note in the file
   * header for why this didn't exist before.
   */
  async loadByUserId(userId) {
    return this._loadByColumn('user_id', userId);
  },

  /**
   * Shared column-generic implementation behind save()/saveByUserId().
   * identity is { student_code: '...' } or { user_id: '...' } — exactly
   * one, matching whichever column this row is keyed by.
   */
  async _upsert(identity, progress) {
    if (!progress) return;
    const idValue = identity.student_code || identity.user_id;
    if (!idValue) return;
    try {
      const payload = Object.assign({}, identity, {
        current_lesson: progress.current_lesson || progress.currentLesson || null,
        current_step_idx: progress.current_step_idx ?? progress.currentStepIdx ?? 0,
        completed_lessons: progress.completed_lessons || progress.completedLessons || [],
        completed_steps: progress.completed_steps || progress.completedSteps || {},
        total_xp: progress.total_xp || progress.totalXP || 0,
        age_group: progress.age_group || progress.ageGroup || null
      });

      // on_conflict tells Postgres which unique constraint to upsert
      // against — student_code for legacy rows (existing behavior,
      // unchanged), user_id for real accounts (the new partial unique
      // index from the migration). Without this, merge-duplicates falls
      // back to the table's primary key, which would just insert a new
      // row every time instead of updating the student's one row.
      const conflictColumn = identity.student_code ? 'student_code' : 'user_id';
      const res = await fetch(
        `${this.SUPABASE_URL}/rest/v1/${this.TABLE}?on_conflict=${conflictColumn}`,
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
        console.log('[FEIProgress] saved for:', idValue);
      }
    } catch (e) {
      console.warn('[FEIProgress] save error:', e);
      // Non-fatal: localStorage still has the data as fallback
    }
  },

  /**
   * Save/update progress for a legacy access-code student to Supabase.
   * Called after each step completion. Fire-and-forget (async,
   * non-blocking). Unchanged behavior/signature.
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
    if (!studentCode) return;
    await this._upsert({ student_code: studentCode }, progress);
  },

  /**
   * Save/update progress for a real Supabase-Auth account, keyed by
   * their auth.users id. New — same shape/semantics as save().
   */
  async saveByUserId(userId, progress) {
    if (!userId) return;
    await this._upsert({ user_id: userId }, progress);
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
   *
   * Generalized (platform-wide fix): now saves for EITHER identity a
   * profile might carry — profile.studentCode (legacy access-code
   * students, existing behavior, unchanged) or profile.supabaseUserId
   * (real Supabase-Auth accounts, new). Existing call sites
   * (`FEIProgress.saveFromProfile(UserProfile.current())`, unchanged in
   * every lesson file) now correctly persist real accounts' progress
   * too, with no per-lesson code change needed for the save half of
   * this fix.
   */
  async saveFromProfile(profile) {
    if (!profile) return;
    const progress = {
      current_lesson: profile.currentLesson,
      current_step_idx: profile.currentStepIdx,
      completed_lessons: profile.completedLessons,
      completed_steps: profile.completedSteps || {},
      total_xp: profile.totalXP,
      age_group: profile.ageGroup
    };
    if (profile.studentCode) {
      await this.save(profile.studentCode, progress);
    } else if (profile.supabaseUserId) {
      await this.saveByUserId(profile.supabaseUserId, progress);
    }
  },

  /**
   * Quick helper: load + mergeWithLocal in one call, for either identity
   * a profile might carry. Returns the merged profile-shaped object (see
   * mergeWithLocal), or `localProfile` unchanged if neither identity is
   * present or nothing was found in Supabase. New — mirrors the
   * load()+mergeWithLocal() pattern every lesson file's continueJourney()
   * already hand-writes for student_code, generalized to also work for
   * real accounts via supabaseUserId.
   */
  async loadForProfile(profile) {
    if (!profile) return profile;
    const supabaseRow = profile.studentCode
      ? await this.load(profile.studentCode)
      : profile.supabaseUserId
        ? await this.loadByUserId(profile.supabaseUserId)
        : null;
    return this.mergeWithLocal(supabaseRow, profile);
  }
};

// Make available globally (loaded via <script> tag, not ES module import)
window.FEIProgress = FEIProgress;
