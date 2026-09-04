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

  // 12 -> 10 steps (2026-09-03 restructure): "Cut Collection" and
  // "Glue Everything" were folded into the new Assemble Your Studio
  // video and dropped as their own stops. Everything after them
  // renumbered down to fill the gap.
  const STEPS = [
    { n: 1, icon: '🖼️', title: 'Welcome', desc: "Meet Matisse's two studios and start your own journey." },
    { n: 2, icon: '🔎', title: 'Explore the Studio', desc: "Find the objects hiding in the studio." },
    { n: 3, icon: '💭', title: 'Imagine Your Dream Studio', desc: "Pick what YOU want inside your studio." },
    { n: 4, icon: '🌳', title: 'Design Each Object', desc: "Design each object your own way." },
    { n: 5, icon: '✏️', title: 'Draw Together', desc: "Draw alongside Artchi, one shape at a time." },
    { n: 6, icon: '🎨', title: 'Build Your Background', desc: "Watercolour base, then marker details." },
    { n: 7, icon: '✂️', title: 'Assemble Your Studio', desc: "Cut, build the box, and glue it all together." },
    { n: 8, icon: '🧑‍🎨', title: 'Add Yourself', desc: "Put yourself inside the studio." },
    { n: 9, icon: '💎', title: 'Final Details', desc: "The small touches that finish it." },
    { n: 10, icon: '🖼️', title: 'Gallery', desc: "See your finished Dream Art Studio." },
  ];
  const TOTAL_STEPS = STEPS.length;
  const STATUS_ORDER = ['not_started', 'visited', 'in_progress', 'completed'];

  const DreamState = {
    // v1 -> v2 (2026-09-03): step numbers 6-12 now mean different
    // content post-restructure (Cut Collection/Glue Everything removed,
    // everything after shifted down). A v1 blob's steps[6]/[7]/[8]/etc.
    // would otherwise silently mark the WRONG new step as already
    // complete for a returning student, so this bumps to a clean slate
    // instead of attempting a remap.
    KEY: 'fei.creation.dream_art_studio.v2',

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
