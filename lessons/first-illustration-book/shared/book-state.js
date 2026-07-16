/* ============================================================
 * FEI TeamArt · Make My First Illustration Book — shared state
 *
 * Loaded by the map (index.html) and every step-N/index.html page.
 * One localStorage key holds one JSON blob: per-step status +
 * per-step data + a small "journal" for saved references.
 *
 * State machine per step: not_started → visited → in_progress → completed
 *   - markVisited()    called when a step page loads
 *   - markInProgress() called after the first answered prompt
 *   - markCompleted()  called once all required prompts are answered
 *
 * Supabase sync is a later batch — localStorage only for now.
 * ============================================================ */
(function (global) {
  'use strict';

  const STEPS = [
    { n: 1, icon: '📖', title: 'What Are We Making?', desc: "Get inspired by a book you love, then imagine the one only you could make." },
    { n: 2, icon: '📷', title: 'Learn Composition', desc: "The visual language illustrators use — full shot, close-up, and everything between." },
    { n: 3, icon: '✍️', title: 'Find Your Story', desc: "Turn your idea into a 25-sentence storyline, with a gentle assist that never writes it for you." },
    { n: 4, icon: '🎞️', title: 'Storyboard Your Book', desc: "Sketch tiny thumbnails for every page before you commit to painting." },
    { n: 5, icon: '✅', title: 'Storyboard Self-Check', desc: "A quick, warm gut-check before you invest in painting each page." },
    { n: 6, icon: '🖌️', title: 'Paint Each Page', desc: "Bring every page to life, one at a time — at your own pace." },
    { n: 7, icon: '🎨', title: 'Color Your Pages', desc: "Add color with software or real supplies — whatever you have is enough." },
    { n: 8, icon: '📐', title: 'Layout in Canva', desc: "Assemble your loose pages into a real book layout, title page and all." },
    { n: 9, icon: '🧵', title: 'Bind Your Book', desc: "The moment your digital pages become a real, physical book." },
    { n: 10, icon: '🖼️', title: 'Design Your Cover', desc: "The finishing touch — the face of your book." },
  ];
  const TOTAL_STEPS = STEPS.length;
  const STATUS_ORDER = ['not_started', 'visited', 'in_progress', 'completed'];

  const BookState = {
    KEY: 'fei.books_and_stories.first_illustration_book.book_001.v1',

    _default() {
      const steps = {};
      STEPS.forEach(s => { steps[s.n] = { status: 'not_started', data: {} }; });
      return { bookId: 'book_001', steps: steps, journal: [] };
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
      if (!state.journal) state.journal = [];
      if (!state.bookId) state.bookId = 'book_001';
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

    saveToJournal(item) {
      const state = this.current();
      state.journal.push(Object.assign({ savedAt: Date.now() }, item));
      this._save(state);
      return state.journal;
    },

    getJournal() {
      return this.current().journal;
    }
  };

  global.STEPS = STEPS;
  global.TOTAL_STEPS = TOTAL_STEPS;
  global.BookState = BookState;
})(window);
