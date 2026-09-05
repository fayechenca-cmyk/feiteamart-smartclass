/* ============================================================
 * Scene Drawing Foundation — shared component: CameraZoomSlider
 *
 * A horizontal drag slider mapping a 0-1 position to a visual state
 * from close-up (0, character fills frame) to extreme wide shot (1,
 * character shrinks, world fills frame). Built for Lesson 01's Stage 7
 * (auto-animates mid -> full-right on entry, then free-drag) and
 * Stage 8 (term labels trigger via onSettle), but every number/asset
 * is config — Lessons 02-05 of this unit should be able to reuse it
 * by only changing defaultPosition/autoAnimate/keyframes.
 *
 * USAGE
 *   const slider = CameraZoomSlider.mount('containerId', {
 *     defaultPosition: 0.5,           // used when autoAnimate is absent
 *     autoAnimate: { from: 0.5, to: 1, durationMs: 1200 },  // optional
 *     keyframes: [                    // optional — see VISUALS below
 *       { pos: 0,   image: 'closeup.jpg' },
 *       { pos: 0.5, image: 'mid.jpg' },
 *       { pos: 1,   image: 'wide.jpg' }
 *     ]
 *   }, {
 *     onChange(pos) { ... },   // fires continuously while dragging/animating
 *     onSettle(pos)  { ... }   // fires once the intro animation finishes,
 *                              // and again after every drag release
 *   });
 *   slider.setPosition(0.2);   // programmatic jump (fires onSettle)
 *   slider.getPosition();
 *   slider.destroy();
 *
 * VISUALS
 *   If `keyframes` (2+ entries, any pos spacing) are given, the two
 *   keyframes bracketing the current position cross-fade by opacity —
 *   a lightweight "image sequence" without needing one frame per
 *   percent. If no keyframes are given (no real assets yet at build
 *   time), a generic CSS-transform placeholder renders instead: a
 *   "world" layer that scales up and a "character" layer that scales
 *   down as position increases — fully functional today, and any
 *   lesson can swap in real keyframe images later with zero JS change.
 *
 * Drag uses Pointer Events (mouse+touch+pen in one path, touch-action:
 * none on the handle/track only) — same approach already proven for
 * on-canvas drawing elsewhere in this codebase.
 * ============================================================ */
(function (global) {
  'use strict';

  const STYLE_ID = 'camera-zoom-slider-styles';
  function injectStylesOnce() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .czs-stage{
        position:relative;width:100%;aspect-ratio:4/3;border-radius:16px;
        overflow:hidden;background:#dbe4ee;border:2.5px solid #1c1a22;
      }
      .czs-world, .czs-character, .czs-keyframe-layer{
        position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
      }
      .czs-world{background:radial-gradient(circle at 50% 40%,#eef3f8 0%,#c4d3e4 100%);}
      .czs-world-inner{width:100%;height:100%;transform-origin:center;}
      .czs-character-shape{
        width:38%;height:62%;background:#2d5fa8;border-radius:40% 40% 46% 46% / 50% 50% 40% 40%;
        transform-origin:center;box-shadow:0 6px 18px rgba(28,26,34,.18);
      }
      .czs-keyframe-layer img{
        position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
      }
      .czs-track{position:relative;height:40px;margin-top:16px;padding:0 18px;}
      .czs-track-line{
        position:absolute;left:18px;right:18px;top:50%;height:6px;transform:translateY(-50%);
        background:rgba(28,26,34,.14);border-radius:999px;
      }
      .czs-track-hit{position:absolute;inset:0;touch-action:none;cursor:pointer;}
      .czs-handle{
        position:absolute;top:50%;width:32px;height:32px;border-radius:50%;
        background:#2d5fa8;border:3px solid #fff;box-shadow:0 4px 12px rgba(28,26,34,.28);
        transform:translate(-50%,-50%);touch-action:none;cursor:grab;
      }
      .czs-handle:active{cursor:grabbing;}
      .czs-labels{display:flex;justify-content:space-between;margin-top:6px;font-size:11px;font-weight:700;color:rgba(28,26,34,.5);letter-spacing:.3px;text-transform:uppercase;}
    `;
    document.head.appendChild(style);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function clamp01(n) { return Math.max(0, Math.min(1, n)); }

  function mount(containerId, config, callbacks) {
    injectStylesOnce();
    config = config || {};
    callbacks = callbacks || {};
    const container = document.getElementById(containerId);
    if (!container) { console.warn('[CameraZoomSlider] container not found:', containerId); return null; }

    const useKeyframes = Array.isArray(config.keyframes) && config.keyframes.length >= 2;
    const sortedKeyframes = useKeyframes ? config.keyframes.slice().sort((a, b) => a.pos - b.pos) : null;

    container.innerHTML = `
      <div class="czs-stage">
        ${useKeyframes
          ? `<div class="czs-keyframe-layer" id="${containerId}-kf-a"><img alt=""></div>
             <div class="czs-keyframe-layer" id="${containerId}-kf-b"><img alt=""></div>`
          : `<div class="czs-world"><div class="czs-world-inner" id="${containerId}-world"></div></div>
             <div class="czs-character"><div class="czs-character-shape" id="${containerId}-character"></div></div>`
        }
      </div>
      <div class="czs-track" id="${containerId}-track">
        <div class="czs-track-line"></div>
        <div class="czs-track-hit" id="${containerId}-hit"></div>
        <div class="czs-handle" id="${containerId}-handle"></div>
      </div>
      <div class="czs-labels"><span>Close-Up</span><span>Extreme Wide Shot</span></div>
    `;

    const handleEl = document.getElementById(containerId + '-handle');
    const hitEl = document.getElementById(containerId + '-hit');
    const worldEl = document.getElementById(containerId + '-world');
    const characterEl = document.getElementById(containerId + '-character');
    const kfAEl = useKeyframes ? document.getElementById(containerId + '-kf-a') : null;
    const kfBEl = useKeyframes ? document.getElementById(containerId + '-kf-b') : null;

    let position = typeof config.defaultPosition === 'number' ? config.defaultPosition : 0.5;
    let dragging = false;
    let dragEnabled = true;
    let rafId = null;

    function applyKeyframeVisual(pos) {
      let lower = sortedKeyframes[0], upper = sortedKeyframes[sortedKeyframes.length - 1];
      for (let i = 0; i < sortedKeyframes.length - 1; i++) {
        if (pos >= sortedKeyframes[i].pos && pos <= sortedKeyframes[i + 1].pos) {
          lower = sortedKeyframes[i]; upper = sortedKeyframes[i + 1]; break;
        }
      }
      const span = upper.pos - lower.pos;
      const localT = span > 0 ? (pos - lower.pos) / span : 0;
      kfAEl.querySelector('img').src = lower.image;
      kfBEl.querySelector('img').src = upper.image;
      kfAEl.style.opacity = 1 - localT;
      kfBEl.style.opacity = localT;
    }
    function applyPlaceholderVisual(pos) {
      const worldScale = 0.4 + pos * 0.6;
      const charScale = 1 - pos * 0.72;
      worldEl.style.transform = `scale(${worldScale.toFixed(3)})`;
      characterEl.style.transform = `scale(${charScale.toFixed(3)})`;
    }
    function applyVisual(pos) {
      handleEl.style.left = (pos * 100) + '%';
      if (useKeyframes) applyKeyframeVisual(pos); else applyPlaceholderVisual(pos);
    }

    function setPosition(pos, opts) {
      position = clamp01(pos);
      applyVisual(position);
      if (typeof callbacks.onChange === 'function') callbacks.onChange(position);
      if (opts && opts.settle && typeof callbacks.onSettle === 'function') callbacks.onSettle(position);
    }

    function positionFromEvent(e) {
      const rect = hitEl.getBoundingClientRect();
      const usable = { left: rect.left + 18, right: rect.right - 18 };
      const x = Math.max(usable.left, Math.min(usable.right, e.clientX));
      return (x - usable.left) / (usable.right - usable.left);
    }

    function onPointerDown(e) {
      if (!dragEnabled) return;
      dragging = true;
      // Capture on hitEl itself — it's the element the pointermove/up
      // listeners below are attached to. (Capturing on handleEl while
      // listening on hitEl would silently redirect all subsequent
      // move/up events to handleEl instead, which has no listeners —
      // caught via a live drag test, not by inspection.)
      hitEl.setPointerCapture && hitEl.setPointerCapture(e.pointerId);
      setPosition(positionFromEvent(e));
    }
    function onPointerMove(e) {
      if (!dragging) return;
      setPosition(positionFromEvent(e));
    }
    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      setPosition(position, { settle: true });
    }

    hitEl.addEventListener('pointerdown', onPointerDown);
    hitEl.addEventListener('pointermove', onPointerMove);
    hitEl.addEventListener('pointerup', onPointerUp);
    hitEl.addEventListener('pointercancel', onPointerUp);

    function animateTo(from, to, durationMs, done) {
      dragEnabled = false;
      const start = performance.now();
      setPosition(from);
      function step(now) {
        const t = clamp01((now - start) / durationMs);
        setPosition(from + (to - from) * easeInOutCubic(t));
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          dragEnabled = true;
          if (done) done();
        }
      }
      rafId = requestAnimationFrame(step);
    }

    if (config.autoAnimate) {
      const from = typeof config.autoAnimate.from === 'number' ? config.autoAnimate.from : position;
      const to = typeof config.autoAnimate.to === 'number' ? config.autoAnimate.to : position;
      const durationMs = config.autoAnimate.durationMs || 1200;
      animateTo(from, to, durationMs, () => setPosition(position, { settle: true }));
    } else {
      setPosition(position);
    }

    return {
      setPosition(pos) { setPosition(pos, { settle: true }); },
      getPosition() { return position; },
      destroy() {
        if (rafId) cancelAnimationFrame(rafId);
        hitEl.removeEventListener('pointerdown', onPointerDown);
        hitEl.removeEventListener('pointermove', onPointerMove);
        hitEl.removeEventListener('pointerup', onPointerUp);
        hitEl.removeEventListener('pointercancel', onPointerUp);
      }
    };
  }

  global.CameraZoomSlider = { mount: mount };
})(window);
