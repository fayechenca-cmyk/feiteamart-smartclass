/* ============================================================
 * FEI TeamArt · Shared completion-celebration helper
 *
 * "Foundation of Sketch" v1.1 spec, component 1 (celebration module,
 * not yet wired into any lesson — that's the next commit).
 *
 * Modeled directly on core/voice.js's shared-module shape (a single
 * <script src> file, a `create(config)` factory keyed by `namespace`,
 * the same gesture-armed AudioContext trick for iPad Safari) so this
 * reads as a sibling of that file, not a new pattern:
 *
 *   const Celebrate = FEICelebrate.create({ namespace: 'foundation' });
 *   Celebrate.celebrate('lesson', anchorEl);            // or 'painting' | 'step'
 *   Celebrate.celebrate('lesson', anchorEl, () => { ... }); // optional onDone
 *
 * NAMING, per the spec's explicit instruction ("name the new function so
 * it cannot collide with the existing celebrate() in the lesson files"):
 * every Step 1 lesson file already declares a top-level `function
 * celebrate(){}` (confetti-emoji burst). This module is namespaced under
 * `FEICelebrate.create(...).celebrate(...)` — a property access on the
 * returned instance, never a bare top-level `celebrate` identifier — so
 * it cannot collide with that existing declaration. The one thing a
 * caller must still avoid is naming ITS OWN local variable `celebrate`
 * (e.g. `const celebrate = FEICelebrate.create(...)` would redeclare the
 * existing global and throw); the wiring commits that consume this file
 * name their instance something else (e.g. `FoundationGlow`).
 *
 * SCOPE (Step 1 pilot, v1.1 §5): Step 1's existing confetti `celebrate()`
 * is kept exactly as-is. This module is layered ADDITIVELY at the same
 * completion moment, piloted on one lesson first. Step 2's new lessons
 * use this module only (no confetti).
 *
 * DIFFERENCE FROM voice.js: voice.js expects the HOST PAGE to supply its
 * own `.fv-*` CSS (only one page uses it today). This module will have
 * many consumers (all of Step 1 + all of Step 2), so — like this
 * project's other shared components, e.g.
 * lessons/scene-drawing-foundation/shared/shot-size-compare.js — it
 * self-injects its own <style> once (guarded by id, so multiple
 * create() calls on one page never double-inject) rather than asking
 * every consumer to hand-copy the same keyframes.
 *
 * MUTE PREFERENCE: a SEPARATE preference from each lesson file's own
 * in-memory `state.sound` (used by the existing playTone/celebrate —
 * that flag is never persisted, it resets to "on" every reload). This
 * module's mute follows voice.js's actual persisted convention instead:
 * localStorage key `fei.<namespace>.celebrate_muted`, so a student's
 * choice survives reloads, scoped per namespace the same way voice.js
 * scopes narration mute per course.
 *
 * VISUAL: a soft gold/cream glow ring + a few small sparkle dots — no
 * emoji, no confetti, per the spec's explicit "glow, not confetti."
 * Anchored to `anchorEl` when given (expands from its center, and
 * receives a persistent `.fc-lit` class + inline default styling for
 * the "stays softly lit" rule); falls back to viewport-center otherwise.
 * `prefers-reduced-motion` swaps the ring/sparkle keyframes for an
 * immediate static glow — sound is unaffected (still mutable). The
 * overlay is `pointer-events:none` (never blocks the real UI under it)
 * and also self-removes on the very next tap anywhere, satisfying "tap
 * to dismiss" without needing its own hit target.
 *
 * AUDIO: Web Audio API only, synthesized — no audio files. Never
 * throws: every AudioContext / oscillator call is wrapped, and a failed
 * or blocked AudioContext still lets the visual play (checked in
 * afterRenderMediumConcept-style try/catch, same defensive shape used
 * elsewhere on this platform for exactly this "component may fail to
 * load/init, page must still work" reason).
 * ============================================================ */
(function (global) {
  'use strict';

  const STYLE_ID = 'fc-styles';
  function injectStylesOnce() {
    if (document.getElementById(STYLE_ID)) return;
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = `
.fc-overlay{position:fixed;inset:0;z-index:6000;pointer-events:none;overflow:hidden;}
.fc-ring{position:absolute;border-radius:50%;border:3px solid #d4a95c;box-shadow:0 0 18px 2px rgba(212,169,92,.55);opacity:0;transform:translate(-50%,-50%) scale(.4);}
.fc-ring.fc-anim{animation:fcRingExpand var(--fc-dur,900ms) cubic-bezier(.22,.72,.26,1) forwards;}
.fc-ring.fc-static{opacity:.85;transform:translate(-50%,-50%) scale(1);}
.fc-glow-core{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(255,241,200,.9) 0%,rgba(230,190,120,.45) 45%,rgba(230,190,120,0) 72%);opacity:0;transform:translate(-50%,-50%) scale(.5);}
.fc-glow-core.fc-anim{animation:fcCoreFade var(--fc-dur,900ms) ease-out forwards;}
.fc-glow-core.fc-static{opacity:.7;transform:translate(-50%,-50%) scale(1);}
.fc-spark{position:absolute;width:8px;height:8px;border-radius:50%;background:#f7dfa0;box-shadow:0 0 8px 2px rgba(245,215,142,.95);opacity:0;transform:translate(-50%,-50%);}
.fc-spark.fc-anim{animation:fcSparkPop var(--fc-dur,900ms) ease-out forwards;}
.fc-spark.fc-static{opacity:.85;transform:translate(calc(-50% + var(--fc-dx,0px)*.6),calc(-50% + var(--fc-dy,0px)*.6));}
.fc-wash{position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,rgba(255,238,196,.55) 0%,rgba(255,238,196,.18) 45%,rgba(255,238,196,0) 75%);opacity:0;}
.fc-wash.fc-anim{animation:fcWashFade var(--fc-dur,1600ms) ease-out forwards;}
.fc-wash.fc-static{opacity:.5;}
@keyframes fcRingExpand{0%{opacity:0;transform:translate(-50%,-50%) scale(.35);}18%{opacity:1;}70%{opacity:.55;}100%{opacity:0;transform:translate(-50%,-50%) scale(1.9);}}
@keyframes fcCoreFade{0%{opacity:0;transform:translate(-50%,-50%) scale(.4);}25%{opacity:1;}100%{opacity:0;transform:translate(-50%,-50%) scale(1.35);}}
@keyframes fcSparkPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.3);}22%{opacity:1;transform:translate(calc(-50% + var(--fc-dx,0px)*.35),calc(-50% + var(--fc-dy,0px)*.35)) scale(1.15);}65%{opacity:1;}100%{opacity:0;transform:translate(calc(-50% + var(--fc-dx,0px)),calc(-50% + var(--fc-dy,0px))) scale(.6);}}
@keyframes fcWashFade{0%{opacity:0;}20%{opacity:1;}75%{opacity:.7;}100%{opacity:0;}}
/* Persistent "lit" state for a completed node — CSS only, cheap on iPad.
   Consumers can override; this is just a sensible default so the module
   works with zero host-page CSS, same as it self-injects the effect CSS. */
.fc-lit{box-shadow:0 0 0 2px rgba(212,169,92,.55),0 0 14px 3px rgba(230,190,120,.5);transition:box-shadow .4s ease;}
@media(prefers-reduced-motion: reduce){
  .fc-ring.fc-anim,.fc-glow-core.fc-anim,.fc-spark.fc-anim,.fc-wash.fc-anim{animation:none;}
}
.fc-mute-btn{border:1.5px solid rgba(58,53,44,.3);background:#fff;color:#6b5a3a;border-radius:999px;width:34px;height:34px;font-size:15px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;}
.fc-mute-btn.fc-off{opacity:.55;}
`;
    document.head.appendChild(st);
  }

  // Tier presets: ring/core/spark sizing scale, chime notes (Hz, startOffset s,
  // duration s), total effect duration (ms) — kept inside the spec's ≤1.5s
  // (lesson/painting) / ≤2s (step, fanfare) budget with margin.
  const TIERS = {
    lesson: { ringPx: 130, sparkCount: 5, sparkSpread: 46, durMs: 900,
      notes: [[659.25, 0, 0.22], [880, 0.16, 0.32]] },
    painting: { ringPx: 190, sparkCount: 8, sparkSpread: 66, durMs: 1200, wash: 0.35,
      notes: [[587.33, 0, 0.2], [739.99, 0.15, 0.22], [987.77, 0.3, 0.4]] },
    step: { ringPx: 260, sparkCount: 12, sparkSpread: 96, durMs: 1600, wash: 1,
      notes: [[523.25, 0, 0.22], [659.25, 0.16, 0.22], [783.99, 0.32, 0.24], [1046.5, 0.5, 0.6]] }
  };

  function create(config) {
    config = config || {};
    const namespace = config.namespace || 'default';
    const MUTE_KEY = 'fei.' + namespace + '.celebrate_muted';

    let audioCtx = null;
    let gestureArmed = false;
    // In-memory fallback for the mute preference — iPad Safari (private
    // mode, blocked cookies/site data) can throw on localStorage access
    // entirely, not just on first use (this platform has hit that exact
    // failure before, in access.js). If storage throws, mute still works
    // for the rest of THIS session; it just won't survive a reload.
    let memMuted = false;

    function isMuted() {
      try {
        const v = global.localStorage.getItem(MUTE_KEY);
        if (v !== null) return v === '1';
      } catch (e) { /* fall through to in-memory */ }
      return memMuted;
    }
    function setMuted(v) {
      memMuted = !!v;
      try { global.localStorage.setItem(MUTE_KEY, v ? '1' : '0'); } catch (e) { /* memory-only for this session */ }
      refreshMuteButtons();
    }
    function refreshMuteButtons() {
      document.querySelectorAll('[data-fc-mute-btn="' + namespace + '"]').forEach(btn => {
        const muted = isMuted();
        btn.textContent = muted ? '🔕' : '🔔';
        btn.classList.toggle('fc-off', muted);
        btn.setAttribute('aria-label', muted ? 'Unmute celebration sounds' : 'Mute celebration sounds');
      });
    }
    function mountMuteToggle(container) {
      if (!container) return;
      injectStylesOnce();
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fc-mute-btn';
      btn.setAttribute('data-fc-mute-btn', namespace);
      btn.onclick = () => setMuted(!isMuted());
      container.appendChild(btn);
      refreshMuteButtons();
      return btn;
    }

    function prefersReducedMotion() {
      try { return !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches); }
      catch (e) { return false; }
    }

    // Same trick as voice.js's armGesture: iPad Safari won't start an
    // AudioContext (or will leave it 'suspended') until a real user
    // gesture. Arm once per instance; any pointerdown/keydown anywhere
    // resumes a suspended context. Harmless if audio never gets used.
    function armGesture() {
      if (gestureArmed) return;
      gestureArmed = true;
      const resume = () => {
        if (audioCtx && audioCtx.state === 'suspended') { audioCtx.resume().catch(() => {}); }
      };
      global.addEventListener('pointerdown', resume, { passive: true });
      global.addEventListener('keydown', resume);
    }
    armGesture();

    function ensureAudioCtx() {
      if (audioCtx) return audioCtx;
      try { audioCtx = new (global.AudioContext || global.webkitAudioContext)(); }
      catch (e) { return null; }
      return audioCtx;
    }

    function playChime(tier) {
      if (isMuted()) return;
      try {
        const ctx = ensureAudioCtx();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        const peak = 0.085; // modest — classroom/kids volume
        (TIERS[tier].notes || []).forEach(n => {
          const freq = n[0], startOffset = n[1], dur = n[2];
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.value = freq;
          const t0 = ctx.currentTime + startOffset;
          gain.gain.setValueAtTime(0.0001, t0);
          gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
          osc.start(t0);
          osc.stop(t0 + dur + 0.05);
        });
      } catch (e) { /* audio never blocks the visual — see module header */ }
    }

    function centerOf(el) {
      if (!el || !el.getBoundingClientRect) return { x: global.innerWidth / 2, y: global.innerHeight / 2 };
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    function fireVisual(tier, anchorEl) {
      injectStylesOnce();
      const preset = TIERS[tier];
      const reduced = prefersReducedMotion();
      const animClass = reduced ? 'fc-static' : 'fc-anim';
      const { x, y } = centerOf(anchorEl);

      const overlay = document.createElement('div');
      overlay.className = 'fc-overlay';
      overlay.style.setProperty('--fc-dur', preset.durMs + 'ms');

      if (preset.wash) {
        const wash = document.createElement('div');
        wash.className = 'fc-wash ' + animClass;
        wash.style.opacity = reduced ? String(0.4 * preset.wash) : '';
        overlay.appendChild(wash);
      }

      const core = document.createElement('div');
      core.className = 'fc-glow-core ' + animClass;
      core.style.left = x + 'px'; core.style.top = y + 'px';
      core.style.width = core.style.height = (preset.ringPx * 1.1) + 'px';
      overlay.appendChild(core);

      const ring = document.createElement('div');
      ring.className = 'fc-ring ' + animClass;
      ring.style.left = x + 'px'; ring.style.top = y + 'px';
      ring.style.width = ring.style.height = preset.ringPx + 'px';
      overlay.appendChild(ring);

      for (let i = 0; i < preset.sparkCount; i++) {
        const a = (i / preset.sparkCount) * Math.PI * 2 + Math.random() * 0.4;
        const dist = preset.sparkSpread * (0.6 + Math.random() * 0.5);
        const spark = document.createElement('div');
        spark.className = 'fc-spark ' + animClass;
        spark.style.left = x + 'px'; spark.style.top = y + 'px';
        spark.style.setProperty('--fc-dx', Math.cos(a) * dist + 'px');
        spark.style.setProperty('--fc-dy', Math.sin(a) * dist + 'px');
        if (!reduced) spark.style.animationDelay = (Math.random() * 0.15) + 's';
        overlay.appendChild(spark);
      }

      document.body.appendChild(overlay);
      if (anchorEl) anchorEl.classList.add('fc-lit');

      let done = false;
      function remove() {
        if (done) return;
        done = true;
        overlay.remove();
        document.removeEventListener('pointerdown', dismissOnTap);
      }
      function dismissOnTap() { remove(); }
      // "Tap anywhere to dismiss," without the overlay itself intercepting
      // taps — it's pointer-events:none (see CSS), so the real UI beneath
      // it stays fully clickable the whole time; this just clears early.
      document.addEventListener('pointerdown', dismissOnTap, { passive: true });

      const lifespan = reduced ? Math.min(preset.durMs, 600) : preset.durMs + 150;
      setTimeout(remove, lifespan);
      return lifespan;
    }

    /**
     * celebrate(tier, anchorEl?, onDone?)
     *   tier      — 'lesson' | 'painting' | 'step' (defaults to 'lesson'
     *               for anything else, so a typo never throws).
     *   anchorEl  — element the glow expands from; omit for viewport-center
     *               (e.g. a whole-map "step complete" wash). Also the
     *               element that receives the persistent `.fc-lit` class.
     *   onDone    — optional callback once the effect finishes, for a
     *               caller that wants to chain page-specific follow-up
     *               (e.g. lighting up the next trail segment on the Map)
     *               without this module needing to know that page's DOM.
     */
    function celebrate(tier, anchorEl, onDone) {
      const t = TIERS[tier] ? tier : 'lesson';
      let lifespan = 900;
      try { lifespan = fireVisual(t, anchorEl); } catch (e) { console.warn('[FEICelebrate] visual failed', e); }
      playChime(t);
      if (typeof onDone === 'function') setTimeout(onDone, lifespan);
    }

    return { celebrate: celebrate, isMuted: isMuted, setMuted: setMuted, mountMuteToggle: mountMuteToggle };
  }

  global.FEICelebrate = { create: create };
})(window);
