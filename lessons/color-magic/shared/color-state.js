/* ============================================================
 * FEI TeamArt · Color Magic (inspired by Henri Matisse) — shared state
 *
 * Loaded by the map (index.html) and every step-N/index.html page.
 * Modeled directly on lessons/dream-art-studio/shared/studio-state.js
 * — same state machine, same localStorage-blob shape — scoped to its
 * own key so this course never collides with any other Creation course.
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

  const STEPS = [
    { n: 1,  icon: '🎨', title: 'Welcome',              desc: 'Meet Color Magic and jump in.' },
    { n: 2,  icon: '🕵️', title: 'Color Detective',       desc: 'Which colors look happy together?' },
    { n: 3,  icon: '💧', title: 'Play With Colors',      desc: 'Drag colors together and watch them mix.' },
    { n: 4,  icon: '🌈', title: 'Color Families',        desc: 'Sort colors into families — warm and cool.' },
    { n: 5,  icon: '✨', title: 'Color Magic',           desc: 'Find the opposite colors that make each other glow.' },
    { n: 6,  icon: '🍃', title: 'Meet Henri Matisse',    desc: "Borrow his colorful, leafy ideas." },
    { n: 7,  icon: '🧰', title: 'Get Ready',             desc: 'Gather your art supplies.' },
    { n: 8,  icon: '🖌️', title: "Let's Paint",           desc: 'Paint, mask, layer, and reveal your leaf.' },
    { n: 9,  icon: '🌟', title: 'Final Details',         desc: 'Add tiny magical finishing touches.' },
    { n: 10, icon: '🖼️', title: 'Gallery',               desc: 'Upload your art and share what you discovered.' },
  ];
  const TOTAL_STEPS = STEPS.length;
  const STATUS_ORDER = ['not_started', 'visited', 'in_progress', 'completed'];

  const ColorState = {
    KEY: 'fei.creation.color_magic.v1',

    _default() {
      const steps = {};
      STEPS.forEach(s => { steps[s.n] = { status: 'not_started', data: {} }; });
      return { pieceId: 'piece_001', steps: steps };
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
      STEPS.forEach(s => {
        if (!state.steps[s.n]) state.steps[s.n] = { status: 'not_started', data: {} };
      });
      if (!state.pieceId) state.pieceId = 'piece_001';
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
  global.ColorState = ColorState;
})(window);
