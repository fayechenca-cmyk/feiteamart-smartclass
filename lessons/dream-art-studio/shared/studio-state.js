/* ============================================================
 * FEI TeamArt · Dream Art Studio — shared state
 *
 * Loaded by the map (index.html) and every step-N/index.html page.
 * Modeled directly on lessons/first-illustration-book/shared/book-state.js
 * — same state machine, same localStorage-blob shape — scoped to its
 * own key so the two courses never collide.
 *
 * State machine per step: not_started → visited → in_progress → completed
 *   - markVisited()    called when a step page loads
 *   - markInProgress() called after the first answered prompt
 *   - markCompleted()  called once a step's core action is done
 *
 * Supabase sync is a later batch — localStorage only for now.
 * ============================================================ */
(function (global) {
  'use strict';

  // 12 -> 10 -> 9 steps. 2026-09-03: "Cut Collection" and "Glue
  // Everything" were folded into the new Assemble Your Studio video and
  // dropped as their own stops. 2026-09-06: "Draw Together" (Step 5)
  // was dropped too — redundant now that Step 4's Design Each Object
  // already has its own drawing canvas per object. Everything after a
  // removed step renumbers down to fill the gap each time.
  const STEPS = [
    { n: 1, icon: '🖼️', title: 'Welcome', desc: "Meet Matisse's two studios and start your own journey." },
    { n: 2, icon: '🔎', title: 'Explore the Studio', desc: "Find the objects hiding in the studio." },
    { n: 3, icon: '💭', title: 'Imagine Your Dream Studio', desc: "Pick what YOU want inside your studio." },
    { n: 4, icon: '🌳', title: 'Design Each Object', desc: "Design each object your own way, then draw it." },
    { n: 5, icon: '🎨', title: 'Build Your Background', desc: "Watercolour base, then marker details." },
    { n: 6, icon: '✂️', title: 'Assemble Your Studio', desc: "Cut, build the box, and glue it all together." },
    { n: 7, icon: '🧑‍🎨', title: 'Add Yourself', desc: "Put yourself inside the studio." },
    { n: 8, icon: '💎', title: 'Final Details', desc: "The small touches that finish it." },
    { n: 9, icon: '🖼️', title: 'Gallery', desc: "See your finished Dream Art Studio." },
  ];
  const TOTAL_STEPS = STEPS.length;
  const STATUS_ORDER = ['not_started', 'visited', 'in_progress', 'completed'];

  const DreamState = {
    // v2 -> v3 (2026-09-06): step numbers 5-10 now mean different
    // content again (Draw Together removed, everything after shifted
    // down one). Same reasoning as the v1->v2 bump above — a v2 blob's
    // steps[5]/[6]/etc. would otherwise silently mark the WRONG new
    // step as already complete for a returning student.
    KEY: 'fei.creation.dream_art_studio.v3',

    _default() {
      const steps = {};
      STEPS.forEach(s => { steps[s.n] = { status: 'not_started', data: {} }; });
      return { studioId: 'studio_001', steps: steps };
    },

    current() {
      let state;
      try {
        const raw = global.localStorage.getItem(this.KEY);
        state = raw ? JSON.parse(raw) : null;
      } catch (e) {
        state = null;
      }
      if (!state || !state.steps) state = this._default();
      // Defensive: fill in any step missing from an older/partial blob.
      STEPS.forEach(s => {
        if (!state.steps[s.n]) state.steps[s.n] = { status: 'not_started', data: {} };
      });
      if (!state.studioId) state.studioId = 'studio_001';
      return state;
    },

    _save(state) {
      try { global.localStorage.setItem(this.KEY, JSON.stringify(state)); } catch (e) {}
    },

    getStatus(n) {
      return this.current().steps[n].status;
    },

    getStepData(n) {
      return this.current().steps[n].data || {};
    },

    setStepData(n, partial) {
      const state = this.current();
      state.steps[n].data = Object.assign({}, state.steps[n].data, partial);
      this._save(state);
      return state.steps[n].data;
    },

    markVisited(n) {
      const state = this.current();
      if (state.steps[n].status === 'not_started') state.steps[n].status = 'visited';
      this._save(state);
      return state;
    },

    markInProgress(n) {
      const state = this.current();
      const cur = state.steps[n].status;
      if (STATUS_ORDER.indexOf(cur) < STATUS_ORDER.indexOf('in_progress')) {
        state.steps[n].status = 'in_progress';
        this._save(state);
      }
      return state;
    },

    markCompleted(n) {
      const state = this.current();
      state.steps[n].status = 'completed';
      this._save(state);
      return state;
    },

    recommendedNext() {
      const state = this.current();
      for (const s of STEPS) {
        if (state.steps[s.n].status !== 'completed') return s.n;
      }
      return 'finished';
    },

    visitedCount() {
      const state = this.current();
      return STEPS.filter(s => state.steps[s.n].status !== 'not_started').length;
    },

    completedCount() {
      const state = this.current();
      return STEPS.filter(s => state.steps[s.n].status === 'completed').length;
    }
  };

  global.STEPS = STEPS;
  global.TOTAL_STEPS = TOTAL_STEPS;
  global.DreamState = DreamState;
})(window);
