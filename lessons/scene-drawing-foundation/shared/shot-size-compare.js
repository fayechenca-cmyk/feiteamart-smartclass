/* ============================================================
 * Scene Drawing Foundation — shared component: ShotSizeCompare
 *
 * The "which is bigger — the world or the person?" comparison device
 * (proposal prototype: /prototypes/shot-size-compare/index.html).
 *
 * LIVES IN shared/, NOT _shared/ — on purpose: GitHub Pages (Jekyll) does not
 * publish underscore-prefixed directories, so anything under _shared/ 404s on
 * the live site. (This file originally sat in _shared/ and Lesson 03 Step 1
 * rendered blank in production; local servers do serve _ dirs, which is why
 * it looked fine in dev.)
 *
 * IDEA: ONE scene is drawn once and never re-drawn. The "camera" is
 * just a frame (an SVG viewBox) moving over it, so the SCENE stays the
 * star and the person is one small figure inside it. As the frame
 * tightens through the stops (Extreme Wide -> Wide -> Medium ...),
 * three things update together: the crop itself, a WORLD-vs-PERSON
 * see-saw whose circle AREAS are the balance (so "who's bigger than
 * what" is literal, not a caption), and a one-line caption.
 *
 * STATUS: first cut, built for Lesson 03's Step 1 while Faye's design
 * reaction to the prototype (see-saw vs. plain bars; one generic scene
 * vs. a scene matched to each lesson; placement) is still pending —
 * everything a change could touch is config (scene / stops / options),
 * not structure.
 *
 * USAGE
 *   const cmp = ShotSizeCompare.mount('mountId', {
 *     stops: ShotSizeCompare.DEFAULT_STOPS,   // or your own list
 *     autoplay: { startDelayMs: 2600, holdMs: 2600, moveMs: 1500 }, // optional
 *     scene: myScene,                          // optional, see DEFAULT_SCENE
 *     showSlider: true                         // default true
 *   }, {
 *     onStop(stopId) { },   // fires each time the frame comes to rest on a stop
 *     onDone() { }          // fires once when autoplay reaches the last stop
 *   });
 *   cmp.setPosition(0.5);  cmp.replay();  cmp.destroy();
 *
 * A stop is { id, short, label, cx, cy, w, person, caption } in scene
 * units: (cx,cy) is the frame centre, w its width (height = w*9/16),
 * `person` is the person's share of the picture (0-100) for the
 * see-saw. Zoom is interpolated in log space so it feels like a real
 * zoom. Later lessons append Close-up / Extreme Close-up stops.
 * ============================================================ */
(function (global) {
  'use strict';

  const W = 2400, H = 1350;
  const FIG = { x: 1100, feetY: 1000, h: 72 };

  // Scene = { width, height, figure:{x,feetY,h}, markup(id) } where
  // markup returns <defs><g id="id">...world...</g></defs>.
  function defaultWorldMarkup(id) {
    const fx = FIG.x, fy = FIG.feetY;
    return `
<defs>
  <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec5ec"/><stop offset="1" stop-color="#e6f1f5"/></linearGradient>
  <g id="${id}">
    <rect width="${W}" height="800" fill="url(#${id}-sky)"/>
    <path d="M0,780 L280,640 L560,730 L900,600 L1300,740 L1700,620 L2100,720 L2400,650 L2400,800 L0,800Z" fill="#b8d3b0"/>
    <rect y="760" width="${W}" height="${H - 760}" fill="#a7d18a"/>
    <rect x="1550" y="470" width="640" height="300" fill="#e2c59a"/>
    <rect x="1520" y="440" width="700" height="46" fill="#a4553f"/>
    <rect x="1830" y="600" width="70" height="170" fill="#7a4e33"/>
    <rect x="1600" y="540" width="70" height="70" fill="#9ec7e3"/><rect x="1980" y="540" width="70" height="70" fill="#9ec7e3"/>
    <rect x="1600" y="650" width="70" height="70" fill="#9ec7e3"/><rect x="1980" y="650" width="70" height="70" fill="#9ec7e3"/>
    <rect x="300" y="560" width="46" height="230" fill="#7a5233"/><circle cx="323" cy="520" r="150" fill="#5fae5b"/>
    <rect x="620" y="620" width="34" height="170" fill="#7a5233"/><circle cx="637" cy="590" r="105" fill="#6bbd66"/>
    <polygon points="900,${H} 1500,${H} 1170,760 1130,760" fill="#e4e0d8"/>
    <rect x="1215" y="790" width="6" height="40" fill="#8a6a4a"/><rect x="1265" y="815" width="8" height="55" fill="#8a6a4a"/>
    <rect x="1178" y="895" width="6" height="110" fill="#555"/><circle cx="1181" cy="890" r="9" fill="#f5e29a"/>
    <rect x="1006" y="985" width="50" height="5" fill="#8a6a4a"/><rect x="1010" y="990" width="4" height="12" fill="#8a6a4a"/><rect x="1048" y="990" width="4" height="12" fill="#8a6a4a"/>
    <circle cx="1040" cy="1004" r="14" fill="#5fae5b"/><circle cx="1054" cy="1000" r="10" fill="#6bbd66"/>
    <g>
      <ellipse cx="${fx}" cy="${fy + 1}" rx="14" ry="3" fill="#000" opacity=".15"/>
      <rect x="${fx - 6}" y="${fy - 30}" width="5" height="30" fill="#3d5a80"/><rect x="${fx + 1}" y="${fy - 30}" width="5" height="30" fill="#3d5a80"/>
      <rect x="${fx - 9}" y="${fy - 56}" width="18" height="28" rx="4" fill="#e85c6e"/>
      <rect x="${fx - 13}" y="${fy - 54}" width="5" height="24" rx="2.5" fill="#e85c6e"/><rect x="${fx + 8}" y="${fy - 54}" width="5" height="24" rx="2.5" fill="#e85c6e"/>
      <circle cx="${fx}" cy="${fy - 64}" r="8.5" fill="#f0c49a"/>
      <path d="M${fx - 9},${fy - 66} q9,-11 18,0 q-3,-4 -9,-4 q-6,0 -9,4z" fill="#3a2a20"/>
      <circle cx="${fx - 3}" cy="${fy - 63}" r="1" fill="#1c1a22"/><circle cx="${fx + 3}" cy="${fy - 63}" r="1" fill="#1c1a22"/>
      <path d="M${fx - 2.5},${fy - 59.5} q2.5,2 5,0" stroke="#1c1a22" stroke-width=".8" fill="none" stroke-linecap="round"/>
    </g>
  </g>
</defs>`;
  }
  const DEFAULT_SCENE = { width: W, height: H, figure: FIG, markup: defaultWorldMarkup };

  const DEFAULT_STOPS = [
    { id: 'ews', short: 'Extreme Wide', label: 'Extreme Wide Shot', cx: W / 2, cy: H / 2, w: W, person: 4,
      caption: 'Extreme Wide: the world fills the frame.' },
    { id: 'ws', short: 'Wide', label: 'Wide Shot', cx: 1100, cy: 958, w: 213, person: 50,
      caption: 'Wide: the whole person — and the place around them.' },
    { id: 'ms', short: 'Medium', label: 'Medium Shot', cx: 1100, cy: 946, w: 89, person: 80,
      caption: 'Medium: the person leads. The background supports them.' }
  ];

  const STYLE_ID = 'ssc-styles';
  function injectStylesOnce() {
    if (document.getElementById(STYLE_ID)) return;
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = `
.ssc-wrap{width:100%;display:flex;flex-direction:column;align-items:center;}
.ssc-stage{position:relative;width:100%;aspect-ratio:16/9;background:#000;overflow:hidden;}
.ssc-view{position:absolute;inset:0;width:100%;height:100%;display:block;}
.ssc-badge{position:absolute;left:14px;top:14px;background:#1c1a22;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;padding:6px 13px;border-radius:999px;}
.ssc-balance{position:absolute;right:14px;top:14px;width:clamp(130px,17vw,210px);background:rgba(250,248,245,.94);border:1.5px solid rgba(28,26,34,.2);border-radius:12px;padding:6px 8px 2px;}
.ssc-balance svg{width:100%;height:auto;display:block;}
.ssc-caption{position:absolute;left:50%;bottom:5%;transform:translateX(-50%);max-width:88%;text-align:center;background:rgba(250,248,245,.95);border-radius:14px;padding:11px 20px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(13px,2.3vw,19px);color:#1f4076;line-height:1.35;box-shadow:0 8px 22px rgba(28,26,34,.22);transition:opacity .35s ease;}
.ssc-caption.moving{opacity:0;}
.ssc-controls{width:100%;max-width:640px;margin:14px auto 16px;padding:0 16px;}
.ssc-controls input[type=range]{width:100%;accent-color:#2d5fa8;}
.ssc-chips{display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap;}
.ssc-chip{border:2px solid #1c1a22;background:#fff;border-radius:999px;padding:7px 14px;font-family:inherit;font-weight:700;font-size:12.5px;cursor:pointer;color:#1c1a22;}
.ssc-chip.on{background:#2d5fa8;border-color:#1f4076;color:#fff;}
.ssc-chip:active{transform:scale(.96);}
`;
    document.head.appendChild(st);
  }

  let mountCounter = 0;
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = u => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

  function mount(target, config, callbacks) {
    injectStylesOnce();
    config = config || {};
    callbacks = callbacks || {};
    const el = typeof target === 'string' ? document.getElementById(target) : target;
    if (!el) return null;
    const scene = config.scene || DEFAULT_SCENE;
    const stops = config.stops || DEFAULT_STOPS;
    const id = 'ssc' + (++mountCounter);
    const fig = scene.figure;
    const showSlider = config.showSlider !== false;
    const n = stops.length - 1;
    const state = { alive: true, t: 0, raf: null, timers: [] };

    el.innerHTML = `
      <div class="ssc-wrap">
        <div class="ssc-stage">
          <svg class="ssc-view" id="${id}-view" preserveAspectRatio="xMidYMid slice" aria-hidden="true"></svg>
          <div class="ssc-badge" id="${id}-badge"></div>
          <div class="ssc-balance" id="${id}-bal"><svg viewBox="0 0 240 142" id="${id}-balsvg"></svg></div>
          <div class="ssc-caption" id="${id}-cap"></div>
        </div>
        ${showSlider ? `<div class="ssc-controls">
          <input type="range" id="${id}-slider" min="0" max="1000" value="0" step="1" aria-label="Camera frame: drag to compare shot sizes">
          <div class="ssc-chips" id="${id}-chips"></div>
        </div>` : ''}
      </div>`;
    const $ = s => document.getElementById(id + '-' + s);
    $('view').innerHTML = scene.markup(id + '-world') + `<use href="#${id}-world"/><g id="${id}-halo"></g>`;

    function frameAt(t) {
      const f = Math.min(n - 1e-9, t * n), i = Math.max(0, Math.floor(f)), u = f - i;
      const a = stops[i], b = stops[i + 1] || stops[i];
      const w = Math.exp(lerp(Math.log(a.w), Math.log(b.w), u));
      return { cx: lerp(a.cx, b.cx, u), cy: lerp(a.cy, b.cy, u), w: w, h: w * 9 / 16,
        person: lerp(a.person, b.person, u), stop: stops[Math.round(t * n)] };
    }
    function halo(fr) {
      // "Find the person" ring — only really visible while the person is tiny.
      const r = Math.max(fig.h * 0.9, fr.w * 0.012);
      const op = Math.max(0, 1 - (fig.h / fr.h) * 2.2);
      return `<circle cx="${fig.x}" cy="${fig.feetY - fig.h / 2}" r="${r}" fill="none" stroke="#e8862e" stroke-width="${Math.max(1.2, fr.w * 0.0035)}" opacity="${op}"/>`;
    }
    function drawBalance(person) {
      const world = 100 - person, tilt = (person - world) / 100 * 10;
      const rW = 5 + Math.sqrt(world) * 2.9, rP = 5 + Math.sqrt(person) * 2.9; // circle AREA tracks share
      $('balsvg').innerHTML = `
        <polygon points="120,92 110,108 130,108" fill="#1c1a22"/>
        <g transform="rotate(${tilt} 120 90)">
          <rect x="20" y="88" width="200" height="4" rx="2" fill="#1c1a22"/>
          <circle cx="46" cy="${88 - rW}" r="${rW}" fill="#7fb069" stroke="#1c1a22" stroke-width="1.5"/>
          <circle cx="194" cy="${88 - rP}" r="${rP}" fill="#e85c6e" stroke="#1c1a22" stroke-width="1.5"/>
        </g>
        <text x="46" y="134" font-size="10" font-weight="800" text-anchor="middle" fill="#1c1a22" letter-spacing="1">WORLD</text>
        <text x="194" y="134" font-size="10" font-weight="800" text-anchor="middle" fill="#1c1a22" letter-spacing="1">PERSON</text>`;
    }
    let lastStopId = null;
    function render(t, moving) {
      state.t = t;
      const fr = frameAt(t);
      $('view').setAttribute('viewBox', `${fr.cx - fr.w / 2} ${fr.cy - fr.h / 2} ${fr.w} ${fr.h}`);
      $('halo').innerHTML = halo(fr);
      $('badge').textContent = fr.stop.label;
      drawBalance(fr.person);
      const cap = $('cap');
      cap.textContent = fr.stop.caption;
      cap.classList.toggle('moving', !!moving);
      if (showSlider) {
        $('slider').value = Math.round(t * 1000);
        document.querySelectorAll('#' + id + '-chips .ssc-chip').forEach((c, i) => c.classList.toggle('on', stops[i] === fr.stop));
      }
      const atRest = Math.abs(t * n - Math.round(t * n)) < 0.02;
      if (atRest && fr.stop.id !== lastStopId) { lastStopId = fr.stop.id; if (callbacks.onStop) callbacks.onStop(fr.stop.id); }
      if (!atRest) lastStopId = null;
    }
    function animateTo(target, ms, done) {
      cancelAnimationFrame(state.raf);
      const from = state.t, t0 = performance.now();
      (function step(now) {
        if (!state.alive) return;
        const u = Math.min(1, (now - t0) / ms);
        render(lerp(from, target, ease(u)), u < 1);
        if (u < 1) state.raf = requestAnimationFrame(step); else if (done) done();
      })(t0);
    }
    function later(fn, ms) { const id2 = setTimeout(() => { if (state.alive) fn(); }, ms); state.timers.push(id2); }
    function clearTimers() { state.timers.forEach(clearTimeout); state.timers = []; cancelAnimationFrame(state.raf); }

    if (showSlider) {
      stops.forEach((s, i) => {
        const c = document.createElement('button');
        c.className = 'ssc-chip'; c.type = 'button'; c.textContent = s.short;
        c.onclick = () => { clearTimers(); animateTo(i / n, 1000); };
        $('chips').appendChild(c);
      });
      $('slider').addEventListener('input', e => { clearTimers(); render(+e.target.value / 1000, true); });
      $('slider').addEventListener('change', e => { animateTo(Math.round(+e.target.value / 1000 * n) / n, 350); });
    }

    function play() {
      clearTimers();
      render(0, false);
      const a = config.autoplay || {};
      const hold = a.holdMs || 2600, move = a.moveMs || 1500;
      let i = 0;
      function next() {
        if (i >= n) { if (callbacks.onDone) callbacks.onDone(); return; }
        i++;
        animateTo(i / n, move, () => later(next, hold));
      }
      later(next, a.startDelayMs || hold); // rest on the first stop before moving
    }

    render(0, false);
    if (config.autoplay) play();

    return {
      setPosition(t) { clearTimers(); render(Math.max(0, Math.min(1, t)), false); },
      replay() { play(); },
      destroy() { state.alive = false; clearTimers(); el.innerHTML = ''; }
    };
  }

  global.ShotSizeCompare = { mount: mount, DEFAULT_STOPS: DEFAULT_STOPS, DEFAULT_SCENE: DEFAULT_SCENE };
})(window);
