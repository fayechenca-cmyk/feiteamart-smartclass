/* ═══════════════════════════════════════════════════════════════════════════
 *  InteractivePerspectiveBlock
 *  Reusable component for Scene Drawing lessons. Renders a small SVG
 *  "perspective simulator" the student can drag, click, or replay — instead
 *  of a static image/video placeholder.
 *
 *  WHY THIS EXISTS (per Faye, June 2026)
 *  Lesson 1 felt too text-heavy and flat. Students should learn perspective
 *  by dragging, watching, lighting up, and comparing — not reading.
 *
 *  HOW TO USE
 *  Give a step this shape instead of (or alongside) the old static fields:
 *
 *    {
 *      stepNumber: 3,
 *      title: 'Move the Horizon Line',
 *      shortInstruction: 'Move the horizon line. The camera angle changes.',
 *      studentTask: 'Drag',          // short verb shown on the task chip
 *      teacherTip: 'Eye level decides what kind of view you get.',
 *      checkPoint: 'Try all three camera heights.',
 *      interactive: {
 *        type: 'horizon-line-drag',  // | 'vp-drag' | 'camera-angle-demo'
 *                                    // | 'guide-line-animation' | 'construction-toggle'
 *        title: 'Camera Angle + Horizon Line',
 *        labels: { high: 'Higher camera angle', mid: 'Normal eye level', low: 'Lower camera angle' },
 *        showReplay: true,
 *        showConstructionToggle: false,
 *        relatedStepId: 4
 *      }
 *    }
 *
 *  Then in the step-card renderer, call:
 *      renderInteractiveBlock(step.interactive, uniqueDomId)
 *  instead of the old renderPlaceholderFrame() calls, and after inserting
 *  the returned HTML into the DOM, call:
 *      mountInteractiveBlock(step.interactive, uniqueDomId)
 *  to wire up the actual drag/click/animate behavior (SVG needs to exist in
 *  the DOM before listeners can attach).
 *
 *  ADDING A NEW INTERACTIVE TYPE LATER (e.g. Lesson 2's "two VP drag" or
 *  "room frame construction")
 *  1. Add a new render*() function below that returns the SVG/HTML markup
 *  2. Add a new mount*() function that wires up its specific drag/click logic
 *  3. Add both to the `type` switch in renderInteractiveBlock / mountInteractiveBlock
 *  No other files need to change — lesson data files just set interactive.type.
 * ═══════════════════════════════════════════════════════════════════════════ */

// Shared SVG scene geometry — every interactive type draws the same simple
// street so the visual language stays consistent across steps.
const PERSPECTIVE_SVG_W = 320;
const PERSPECTIVE_SVG_H = 200;

function perspectiveBuildStreetPaths(horizonY, vpX) {
  // horizonY / vpX in SVG coordinate space (0-200 / 0-320)
  const w = PERSPECTIVE_SVG_W, h = PERSPECTIVE_SVG_H;
  const roadHalfWidthNear = 70;
  const sidewalkExtra = 24;

  // Road: two lines from bottom corners of the road, converging at VP
  const roadLeft = `M ${vpX - 3} ${horizonY} L ${w/2 - roadHalfWidthNear} ${h}`;
  const roadRight = `M ${vpX + 3} ${horizonY} L ${w/2 + roadHalfWidthNear} ${h}`;

  // Sidewalks: just outside the road, same VP
  const sidewalkLeft = `M ${vpX - 8} ${horizonY} L ${w/2 - roadHalfWidthNear - sidewalkExtra} ${h}`;
  const sidewalkRight = `M ${vpX + 8} ${horizonY} L ${w/2 + roadHalfWidthNear + sidewalkExtra} ${h}`;

  // Building guide lines: a few diagonals on each side fanning to the VP
  const buildingGuides = [];
  [0.3, 0.55, 0.8].forEach(f => {
    const leftX = (w/2 - roadHalfWidthNear - sidewalkExtra) * (1 - f) + 0 * f;
    const rightX = (w/2 + roadHalfWidthNear + sidewalkExtra) * (1 - f) + w * f;
    buildingGuides.push(`M ${vpX} ${horizonY} L ${leftX} ${h * 0.3 + (h*0.7)*(1-f)}`);
    buildingGuides.push(`M ${vpX} ${horizonY} L ${rightX} ${h * 0.3 + (h*0.7)*(1-f)}`);
  });

  return { roadLeft, roadRight, sidewalkLeft, sidewalkRight, buildingGuides };
}

function perspectiveBuildingsSvg(horizonY) {
  // Simple static building silhouettes — they don't move with horizon/VP,
  // they're just there so dragging the horizon visibly changes "how much
  // sky vs ground" the student sees, like a real camera tilt.
  const h = PERSPECTIVE_SVG_H;
  return `
    <rect x="14" y="${horizonY - 64}" width="40" height="64" fill="#cbd5e1" opacity="0.55" rx="2"/>
    <rect x="60" y="${horizonY - 42}" width="28" height="42" fill="#cbd5e1" opacity="0.4" rx="2"/>
    <rect x="266" y="${horizonY - 56}" width="40" height="56" fill="#cbd5e1" opacity="0.55" rx="2"/>
    <rect x="232" y="${horizonY - 34}" width="28" height="34" fill="#cbd5e1" opacity="0.4" rx="2"/>
  `;
}

// ─────────────────────────────────────────────────────────────────────────
// SECTION 1 · horizon-line-drag
// ─────────────────────────────────────────────────────────────────────────
function renderHorizonLineDrag(cfg, domId) {
  const w = PERSPECTIVE_SVG_W, h = PERSPECTIVE_SVG_H;
  const startY = h / 2;
  const vpX = w / 2;
  return `
    <div class="ipb-wrap" id="${domId}" data-type="horizon-line-drag" data-vpx="${vpX}">
      <div class="ipb-stage">
        <svg viewBox="0 0 ${w} ${h}" class="ipb-svg" id="${domId}-svg">
          <rect width="${w}" height="${h}" fill="#dbeafe"/>
          <g id="${domId}-buildings">${perspectiveBuildingsSvg(startY)}</g>
          <g id="${domId}-street"></g>
          <line id="${domId}-horizon" x1="0" y1="${startY}" x2="${w}" y2="${startY}" stroke="#1a1d2b" stroke-width="2"/>
          <g id="${domId}-handle" class="ipb-handle-group" style="cursor: grab;">
            <rect x="0" y="${startY - 13}" width="${w}" height="26" fill="transparent"/>
            <circle cx="${w - 22}" cy="${startY}" r="11" fill="#67e8f9" stroke="#1a1d2b" stroke-width="2"/>
            <text x="${w - 22}" y="${startY + 4}" font-size="11" text-anchor="middle" font-weight="800" fill="#1a1d2b">↕</text>
          </g>
        </svg>
        <div class="ipb-camera-icon" id="${domId}-camera">📷</div>
      </div>
      <div class="ipb-readout" id="${domId}-readout">Normal eye level</div>
      <div class="ipb-hint">${cfg.shortInstruction || 'Drag the horizon line up or down.'}</div>
    </div>
  `;
}

function mountHorizonLineDrag(cfg, domId) {
  const wrap = document.getElementById(domId);
  if (!wrap) return;
  const svg = document.getElementById(`${domId}-svg`);
  const horizonLine = document.getElementById(`${domId}-horizon`);
  const handleGroup = document.getElementById(`${domId}-handle`);
  const streetGroup = document.getElementById(`${domId}-street`);
  const buildingsGroup = document.getElementById(`${domId}-buildings`);
  const cameraIcon = document.getElementById(`${domId}-camera`);
  const readout = document.getElementById(`${domId}-readout`);
  const vpX = parseFloat(wrap.dataset.vpx);
  const h = PERSPECTIVE_SVG_H;
  const minY = 40, maxY = h - 40;
  const labels = cfg.labels || {};

  function draw(y) {
    horizonLine.setAttribute('y1', y);
    horizonLine.setAttribute('y2', y);
    handleGroup.querySelector('circle').setAttribute('cy', y);
    handleGroup.querySelector('text').setAttribute('y', y + 4);
    handleGroup.querySelector('rect').setAttribute('y', y - 13);
    buildingsGroup.innerHTML = perspectiveBuildingsSvg(y);
    const paths = perspectiveBuildStreetPaths(y, vpX);
    streetGroup.innerHTML = `
      <path d="${paths.sidewalkLeft}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
      <path d="${paths.sidewalkRight}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
      <path d="${paths.roadLeft}" stroke="#1a1d2b" stroke-width="2" fill="none"/>
      <path d="${paths.roadRight}" stroke="#1a1d2b" stroke-width="2" fill="none"/>
    `;

    const mid = h / 2;
    const band = (maxY - minY) * 0.16;
    let label, camTop;
    if (y < mid - band) { label = labels.high || 'Higher camera angle'; camTop = '8%'; }
    else if (y > mid + band) { label = labels.low || 'Lower camera angle'; camTop = '78%'; }
    else { label = labels.mid || 'Normal eye level'; camTop = '42%'; }
    readout.textContent = label;
    cameraIcon.style.top = camTop;
  }

  draw(h / 2);

  let dragging = false;
  function clientYToSvgY(clientY) {
    const rect = svg.getBoundingClientRect();
    const relY = (clientY - rect.top) / rect.height * h;
    return Math.max(minY, Math.min(maxY, relY));
  }
  function onDown(e) {
    dragging = true;
    handleGroup.style.cursor = 'grabbing';
    e.preventDefault();
  }
  function onMove(e) {
    if (!dragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    draw(clientYToSvgY(clientY));
  }
  function onUp() { dragging = false; handleGroup.style.cursor = 'grab'; }

  handleGroup.addEventListener('mousedown', onDown);
  handleGroup.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);
}

// ─────────────────────────────────────────────────────────────────────────
// SECTION 2 · vp-drag
// ─────────────────────────────────────────────────────────────────────────
function renderVpDrag(cfg, domId) {
  const w = PERSPECTIVE_SVG_W, h = PERSPECTIVE_SVG_H;
  const horizonY = h / 2;
  const startVpX = w / 2;
  return `
    <div class="ipb-wrap" id="${domId}" data-type="vp-drag" data-horizony="${horizonY}">
      <div class="ipb-stage">
        <svg viewBox="0 0 ${w} ${h}" class="ipb-svg" id="${domId}-svg">
          <rect width="${w}" height="${h}" fill="#dbeafe"/>
          <g id="${domId}-buildings">${perspectiveBuildingsSvg(horizonY)}</g>
          <g id="${domId}-street"></g>
          <line x1="0" y1="${horizonY}" x2="${w}" y2="${horizonY}" stroke="#1a1d2b" stroke-width="2"/>
          <g id="${domId}-vp" class="ipb-handle-group" style="cursor: grab;">
            <circle cx="${startVpX}" cy="${horizonY}" r="9" fill="#c8a96e" stroke="#1a1d2b" stroke-width="2"/>
            <text x="${startVpX}" y="${horizonY - 16}" font-size="10" text-anchor="middle" font-weight="800" fill="#c8a96e">VP</text>
          </g>
        </svg>
      </div>
      <div class="ipb-readout" id="${domId}-readout">All depth lines move toward the VP.</div>
      <div class="ipb-hint">${cfg.shortInstruction || 'Drag the VP and watch the street turn.'}</div>
    </div>
  `;
}

function mountVpDrag(cfg, domId) {
  const wrap = document.getElementById(domId);
  if (!wrap) return;
  const svg = document.getElementById(`${domId}-svg`);
  const vpGroup = document.getElementById(`${domId}-vp`);
  const streetGroup = document.getElementById(`${domId}-street`);
  const horizonY = parseFloat(wrap.dataset.horizony);
  const w = PERSPECTIVE_SVG_W;
  const minX = 30, maxX = w - 30;

  function draw(vpX) {
    vpGroup.querySelector('circle').setAttribute('cx', vpX);
    vpGroup.querySelector('text').setAttribute('x', vpX);
    const paths = perspectiveBuildStreetPaths(horizonY, vpX);
    streetGroup.innerHTML = `
      ${paths.buildingGuides.map(d => `<path d="${d}" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity="0.55"/>`).join('')}
      <path d="${paths.sidewalkLeft}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
      <path d="${paths.sidewalkRight}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
      <path d="${paths.roadLeft}" stroke="#1a1d2b" stroke-width="2.5" fill="none"/>
      <path d="${paths.roadRight}" stroke="#1a1d2b" stroke-width="2.5" fill="none"/>
    `;
  }
  draw(w / 2);

  let dragging = false;
  function clientXToSvgX(clientX) {
    const rect = svg.getBoundingClientRect();
    const relX = (clientX - rect.left) / rect.width * w;
    return Math.max(minX, Math.min(maxX, relX));
  }
  function onDown(e) { dragging = true; vpGroup.style.cursor = 'grabbing'; e.preventDefault(); }
  function onMove(e) {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    draw(clientXToSvgX(clientX));
  }
  function onUp() { dragging = false; vpGroup.style.cursor = 'grab'; }

  vpGroup.addEventListener('mousedown', onDown);
  vpGroup.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);
}

// ─────────────────────────────────────────────────────────────────────────
// SECTION 3 · camera-angle-demo (click 3 fixed positions, no free drag)
// ─────────────────────────────────────────────────────────────────────────
function renderCameraAngleDemo(cfg, domId) {
  const w = PERSPECTIVE_SVG_W, h = PERSPECTIVE_SVG_H;
  const positions = { high: h * 0.28, mid: h * 0.5, low: h * 0.72 };
  return `
    <div class="ipb-wrap" id="${domId}" data-type="camera-angle-demo">
      <div class="ipb-camera-row">
        <button class="ipb-cam-btn" data-pos="high" onclick="ipbSetCameraDemo('${domId}', 'high')">📷<span>High Camera</span></button>
        <button class="ipb-cam-btn active" data-pos="mid" onclick="ipbSetCameraDemo('${domId}', 'mid')">📷<span>Eye Level</span></button>
        <button class="ipb-cam-btn" data-pos="low" onclick="ipbSetCameraDemo('${domId}', 'low')">📷<span>Low Camera</span></button>
      </div>
      <div class="ipb-stage">
        <svg viewBox="0 0 ${w} ${h}" class="ipb-svg" id="${domId}-svg" data-high="${positions.high}" data-mid="${positions.mid}" data-low="${positions.low}">
          <rect width="${w}" height="${h}" fill="#dbeafe"/>
          <g id="${domId}-buildings">${perspectiveBuildingsSvg(positions.mid)}</g>
          <g id="${domId}-street"></g>
          <line id="${domId}-horizon" x1="0" y1="${positions.mid}" x2="${w}" y2="${positions.mid}" stroke="#1a1d2b" stroke-width="2"/>
        </svg>
      </div>
      <div class="ipb-hint">${cfg.shortInstruction || 'Tap a camera position.'}</div>
    </div>
  `;
}

function ipbSetCameraDemo(domId, pos) {
  const svg = document.getElementById(`${domId}-svg`);
  const y = parseFloat(svg.dataset[pos]);
  document.getElementById(`${domId}-horizon`).setAttribute('y1', y);
  document.getElementById(`${domId}-horizon`).setAttribute('y2', y);
  document.getElementById(`${domId}-buildings`).innerHTML = perspectiveBuildingsSvg(y);
  const vpX = PERSPECTIVE_SVG_W / 2;
  const paths = perspectiveBuildStreetPaths(y, vpX);
  document.getElementById(`${domId}-street`).innerHTML = `
    <path d="${paths.sidewalkLeft}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
    <path d="${paths.sidewalkRight}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
    <path d="${paths.roadLeft}" stroke="#1a1d2b" stroke-width="2" fill="none"/>
    <path d="${paths.roadRight}" stroke="#1a1d2b" stroke-width="2" fill="none"/>
  `;
  const wrap = document.getElementById(domId);
  wrap.querySelectorAll('.ipb-cam-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pos === pos);
  });
}

function mountCameraAngleDemo(cfg, domId) {
  ipbSetCameraDemo(domId, 'mid');
}

// ─────────────────────────────────────────────────────────────────────────
// SECTION 4 · guide-line-animation (sequential reveal + replay + show/hide)
// ─────────────────────────────────────────────────────────────────────────
function renderGuideLineAnimation(cfg, domId) {
  const w = PERSPECTIVE_SVG_W, h = PERSPECTIVE_SVG_H;
  const horizonY = h / 2, vpX = w / 2;
  return `
    <div class="ipb-wrap" id="${domId}" data-type="guide-line-animation" data-stage="0">
      <div class="ipb-stage">
        <svg viewBox="0 0 ${w} ${h}" class="ipb-svg" id="${domId}-svg">
          <rect width="${w}" height="${h}" fill="#dbeafe"/>
          <g id="${domId}-buildings">${perspectiveBuildingsSvg(horizonY)}</g>
          <g id="${domId}-vp-dot" style="opacity:0; transition: opacity .4s;">
            <circle cx="${vpX}" cy="${horizonY}" r="5" fill="#c8a96e"/>
            <text x="${vpX}" y="${horizonY - 12}" font-size="9" text-anchor="middle" font-weight="800" fill="#c8a96e">VP</text>
          </g>
          <line id="${domId}-horizon" x1="0" y1="${horizonY}" x2="${w}" y2="${horizonY}" stroke="#1a1d2b" stroke-width="2" style="opacity:0; transition: opacity .4s;"/>
          <g id="${domId}-road" style="opacity:0; transition: opacity .4s;"></g>
          <g id="${domId}-guides" style="opacity:0; transition: opacity .4s;"></g>
        </svg>
        <div class="ipb-label-chip" id="${domId}-chip">Tap Next to begin</div>
      </div>
      <div class="ipb-btn-row">
        <button class="ipb-mini-btn" onclick="ipbGuideNext('${domId}')">Next Line →</button>
        <button class="ipb-mini-btn ipb-mini-ghost" onclick="ipbGuideReplay('${domId}')">↺ Replay</button>
      </div>
      <div class="ipb-btn-row">
        <button class="ipb-mini-btn ipb-mini-ghost" onclick="ipbGuideToggleView('${domId}', 'construction')">Construction View</button>
        <button class="ipb-mini-btn ipb-mini-ghost" onclick="ipbGuideToggleView('${domId}', 'clean')">Clean View</button>
      </div>
      <div class="ipb-hint">${cfg.shortInstruction || 'Guide lines help you place the road and buildings.'}</div>
    </div>
  `;
}

const IPB_GUIDE_STAGES = ['VP', 'Horizon Line', 'Road', 'Sidewalk + Guide Lines'];

function ipbGuideNext(domId) {
  const wrap = document.getElementById(domId);
  let stage = parseInt(wrap.dataset.stage || '0', 10);
  stage = Math.min(stage + 1, IPB_GUIDE_STAGES.length);
  wrap.dataset.stage = stage;
  ipbGuideRender(domId, stage);
}
function ipbGuideReplay(domId) {
  const wrap = document.getElementById(domId);
  wrap.dataset.stage = '0';
  ipbGuideRender(domId, 0);
}
function ipbGuideRender(domId, stage) {
  const vpDot = document.getElementById(`${domId}-vp-dot`);
  const horizon = document.getElementById(`${domId}-horizon`);
  const roadGroup = document.getElementById(`${domId}-road`);
  const guidesGroup = document.getElementById(`${domId}-guides`);
  const chip = document.getElementById(`${domId}-chip`);
  const h = PERSPECTIVE_SVG_H, w = PERSPECTIVE_SVG_W, vpX = w/2, horizonY = h/2;
  const paths = perspectiveBuildStreetPaths(horizonY, vpX);

  vpDot.style.opacity = stage >= 1 ? '1' : '0';
  horizon.style.opacity = stage >= 2 ? '1' : '0';
  if (stage >= 3) {
    roadGroup.innerHTML = `<path d="${paths.roadLeft}" stroke="#1a1d2b" stroke-width="2.5" fill="none"/><path d="${paths.roadRight}" stroke="#1a1d2b" stroke-width="2.5" fill="none"/>`;
    roadGroup.style.opacity = '1';
  } else {
    roadGroup.style.opacity = '0';
  }
  if (stage >= 4) {
    guidesGroup.innerHTML = `
      <path d="${paths.sidewalkLeft}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
      <path d="${paths.sidewalkRight}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
      ${paths.buildingGuides.map(d => `<path d="${d}" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity="0.55"/>`).join('')}
    `;
    guidesGroup.style.opacity = '1';
  } else {
    guidesGroup.style.opacity = '0';
  }
  chip.textContent = stage === 0 ? 'Tap Next to begin' : `Showing: ${IPB_GUIDE_STAGES[stage - 1]}`;
}
function ipbGuideToggleView(domId, mode) {
  const wrap = document.getElementById(domId);
  const stage = mode === 'construction' ? IPB_GUIDE_STAGES.length : 3;
  wrap.dataset.stage = stage;
  ipbGuideRender(domId, stage);
}
function mountGuideLineAnimation(cfg, domId) {
  ipbGuideRender(domId, 0);
}

// ─────────────────────────────────────────────────────────────────────────
// SECTION 5 · construction-toggle (Clean View / Construction View slider)
// Used for building blocks, shop details, grey marker before/after, etc.
// ─────────────────────────────────────────────────────────────────────────
function renderConstructionToggle(cfg, domId) {
  const beforeSrc = (cfg.before && cfg.before.src) || '';
  const afterSrc = (cfg.after && cfg.after.src) || '';
  const beforeLabel = (cfg.before && cfg.before.label) || 'Before';
  const afterLabel = (cfg.after && cfg.after.label) || 'After';
  return `
    <div class="ipb-wrap" id="${domId}" data-type="construction-toggle" data-mode="before">
      <div class="ipb-compare-stage">
        <div class="ipb-compare-pane" id="${domId}-before">
          ${beforeSrc ? `<img src="${beforeSrc}" alt="${beforeLabel}">` : `<div class="ipb-compare-placeholder">🖼️<span>${beforeLabel}</span></div>`}
        </div>
        <div class="ipb-compare-pane" id="${domId}-after" style="display:none;">
          ${afterSrc ? `<img src="${afterSrc}" alt="${afterLabel}">` : `<div class="ipb-compare-placeholder">🖼️<span>${afterLabel}</span></div>`}
        </div>
      </div>
      <div class="ipb-toggle-row">
        <button class="ipb-toggle-btn active" id="${domId}-btn-before" onclick="ipbSetCompare('${domId}', 'before')">${beforeLabel}</button>
        <button class="ipb-toggle-btn" id="${domId}-btn-after" onclick="ipbSetCompare('${domId}', 'after')">${afterLabel}</button>
      </div>
      <div class="ipb-hint">${cfg.shortInstruction || ''}</div>
    </div>
  `;
}
function ipbSetCompare(domId, mode) {
  document.getElementById(`${domId}-before`).style.display = mode === 'before' ? 'flex' : 'none';
  document.getElementById(`${domId}-after`).style.display = mode === 'after' ? 'flex' : 'none';
  document.getElementById(`${domId}-btn-before`).classList.toggle('active', mode === 'before');
  document.getElementById(`${domId}-btn-after`).classList.toggle('active', mode === 'after');
}
function mountConstructionToggle(cfg, domId) {
  ipbSetCompare(domId, 'before');
}

// ─────────────────────────────────────────────────────────────────────────
// SECTION 5b · INDOOR ROOM SCENE GEOMETRY (shared by all Lesson 2 types)
// A two-point room is drawn as: horizon line, VP-Left + VP-Right (near the
// left/right edges so the room doesn't distort), a vertical corner line,
// and floor/ceiling lines fanning from each VP toward that corner. The
// standard 2-point convention: lines defining the LEFT wall converge to
// VP-RIGHT, and lines defining the RIGHT wall converge to VP-LEFT.
// ─────────────────────────────────────────────────────────────────────────
function perspectiveBuildRoomPaths(horizonY, vpLeftX, vpRightX, cornerX, cornerTopY, cornerBottomY) {
  const h = PERSPECTIVE_SVG_H, w = PERSPECTIVE_SVG_W;
  // Corner line (the "first vertical line" / room corner)
  const cornerLine = `M ${cornerX} ${cornerTopY} L ${cornerX} ${cornerBottomY}`;

  // Compute where a line from a VP through the corner point hits a screen edge.
  function extendToEdge(vpX, vpY, px, py, edgeX) {
    const t = (edgeX - vpX) / (px - vpX);
    const y = vpY + t * (py - vpY);
    return { x: edgeX, y };
  }
  const floorLeftEnd = extendToEdge(vpRightX, horizonY, cornerX, cornerBottomY, 0);
  const floorRightEnd = extendToEdge(vpLeftX, horizonY, cornerX, cornerBottomY, w);
  const ceilLeftEnd = extendToEdge(vpRightX, horizonY, cornerX, cornerTopY, 0);
  const ceilRightEnd = extendToEdge(vpLeftX, horizonY, cornerX, cornerTopY, w);

  const floorL = `M ${cornerX} ${cornerBottomY} L ${floorLeftEnd.x} ${clamp(floorLeftEnd.y, 0, h)}`;
  const floorR = `M ${cornerX} ${cornerBottomY} L ${floorRightEnd.x} ${clamp(floorRightEnd.y, 0, h)}`;
  const ceilL = `M ${cornerX} ${cornerTopY} L ${ceilLeftEnd.x} ${clamp(ceilLeftEnd.y, 0, h)}`;
  const ceilR = `M ${cornerX} ${cornerTopY} L ${ceilRightEnd.x} ${clamp(ceilRightEnd.y, 0, h)}`;

  // Side walls: vertical-ish lines at each screen edge, between floor & ceiling end points
  const wallL = `M ${floorLeftEnd.x} ${clamp(floorLeftEnd.y, 0, h)} L ${ceilLeftEnd.x} ${clamp(ceilLeftEnd.y, 0, h)}`;
  const wallR = `M ${floorRightEnd.x} ${clamp(floorRightEnd.y, 0, h)} L ${ceilRightEnd.x} ${clamp(ceilRightEnd.y, 0, h)}`;

  // Dashed VP guide lines (VP to corner top/bottom) so students see the
  // construction lines themselves, not just the resulting room edges.
  const vpGuideLeftTop = `M ${vpLeftX} ${horizonY} L ${cornerX} ${cornerTopY}`;
  const vpGuideLeftBottom = `M ${vpLeftX} ${horizonY} L ${cornerX} ${cornerBottomY}`;
  const vpGuideRightTop = `M ${vpRightX} ${horizonY} L ${cornerX} ${cornerTopY}`;
  const vpGuideRightBottom = `M ${vpRightX} ${horizonY} L ${cornerX} ${cornerBottomY}`;

  return { cornerLine, floorL, floorR, ceilL, ceilR, wallL, wallR, vpGuideLeftTop, vpGuideLeftBottom, vpGuideRightTop, vpGuideRightBottom };
}
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// ─────────────────────────────────────────────────────────────────────────
// SECTION 5b-ii · ROOM SHELL (back wall / window / baseboard) + FURNITURE
// THAT ACTUALLY RESPONDS TO VP POSITION (per Faye, June 2026)
//
// Furniture boxes are built the same way the room itself is: a box has a
// near edge and a far edge, and the lines connecting them converge to a
// VP. An object against the LEFT wall has its depth lines converge to
// VP-RIGHT (same rule as the left wall itself); an object against the
// RIGHT wall converges to VP-LEFT. This is what makes "drag the VP and
// the furniture stretches with it" actually true, not just decorative.
// ─────────────────────────────────────────────────────────────────────────

// Build one furniture box: a near face (the face closest to the viewer,
// drawn as a plain rectangle) plus depth lines from its 4 corners going
// back toward `vpX` (the vanishing point this object's wall uses).
function perspectiveFurnitureBox({ nearX, nearY, nearW, nearH, vpX, vpY, depthRatio }) {
  // depthRatio: how far along the way to the VP the "far face" sits (0–1,
  // small = shallow object like a rug, larger = deep object like a bed)
  const corners = [
    { x: nearX, y: nearY }, { x: nearX + nearW, y: nearY },
    { x: nearX + nearW, y: nearY + nearH }, { x: nearX, y: nearY + nearH }
  ];
  const farCorners = corners.map(c => ({
    x: c.x + (vpX - c.x) * depthRatio,
    y: c.y + (vpY - c.y) * depthRatio
  }));
  const nearFace = `M ${corners[0].x} ${corners[0].y} L ${corners[1].x} ${corners[1].y} L ${corners[2].x} ${corners[2].y} L ${corners[3].x} ${corners[3].y} Z`;
  const farFace = `M ${farCorners[0].x} ${farCorners[0].y} L ${farCorners[1].x} ${farCorners[1].y} L ${farCorners[2].x} ${farCorners[2].y} L ${farCorners[3].x} ${farCorners[3].y} Z`;
  const depthLines = corners.map((c, i) => `M ${c.x} ${c.y} L ${vpX} ${vpY}`);
  const depthLinesToFar = corners.map((c, i) => `M ${c.x} ${c.y} L ${farCorners[i].x} ${farCorners[i].y}`);
  return { nearFace, farFace, depthLines, depthLinesToFar, farCorners };
}

// Human figure (eye-level reference): a simple silhouette whose head sits
// right at the horizon line, so students can directly read "this is the
// height of a standing person's eyes."
function perspectiveHumanFigureSvg(x, horizonY, groundY) {
  // Eyes sit AT the horizon line — that's the whole teaching point. Head
  // center is drawn slightly above the horizon so the EYES (mid-head) land
  // exactly on it.
  const headR = 6;
  const headCY = horizonY - headR * 0.5;
  const neckY = headCY + headR;
  const shoulderW = 11, hipW = 8;
  const shoulderY = neckY + 3;
  const hipY = groundY - 14;
  const bodyBottom = groundY;
  return `
    <g class="ipb-human-figure">
      <!-- dashed eye-level tick so the connection to the horizon is explicit -->
      <line x1="${x - 16}" y1="${horizonY}" x2="${x - headR - 2}" y2="${horizonY}" stroke="#c2410c" stroke-width="1" stroke-dasharray="2 2" opacity="0.7"/>
      <circle cx="${x}" cy="${headCY}" r="${headR}" fill="#c2410c"/>
      <path d="M ${x - shoulderW/2} ${shoulderY}
               C ${x - shoulderW/2 - 2} ${hipY}, ${x - hipW/2} ${hipY}, ${x - hipW/2} ${hipY}
               L ${x - hipW/2 + 1} ${bodyBottom}
               L ${x + hipW/2 - 1} ${bodyBottom}
               L ${x + hipW/2} ${hipY}
               C ${x + hipW/2 + 2} ${hipY}, ${x + shoulderW/2 + 2} ${shoulderY}, ${x + shoulderW/2} ${shoulderY}
               Z" fill="#c2410c"/>
    </g>
  `;
}

// Back wall elements: window + a wall picture frame, sitting on the back
// wall (the room corner's vertical line splits two side walls, but the
// "back wall" here is represented simply, just behind the corner) — kept
// intentionally simple since these don't need VP convergence math.
function perspectiveBackWallSvg(cornerX, horizonY, topY, bottomY) {
  const winW = 28, winH = 22;
  const winX = cornerX - winW / 2;
  const winY = topY + (horizonY - topY) * 0.18; // sits in the upper portion of the back wall, well above eye level
  return `
    <rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="#ecfeff" stroke="#1a1d2b" stroke-width="1.4"/>
    <line x1="${winX + winW/2}" y1="${winY}" x2="${winX + winW/2}" y2="${winY + winH}" stroke="#1a1d2b" stroke-width="1"/>
    <line x1="${winX}" y1="${winY + winH/2}" x2="${winX + winW}" y2="${winY + winH/2}" stroke="#1a1d2b" stroke-width="1"/>
  `;
}

function perspectiveRoomFurnitureSvg(cornerX, horizonY, h, vpLeftX, vpRightX, mode) {
  // mode: 'construction' (show dashed depth-guide lines) | 'clean' (room + furniture only)
  const showGuides = mode !== 'clean';
  const groundY = h - 6;

  // ── BED — primary demo object, against the LEFT wall, so its depth
  // lines converge to VP-RIGHT. ──
  const bedNearX = 8, bedNearY = groundY - 22, bedNearW = Math.max(20, cornerX - 28 - bedNearX), bedNearH = 22;
  const bed = perspectiveFurnitureBox({ nearX: bedNearX, nearY: bedNearY, nearW: bedNearW, nearH: bedNearH, vpX: vpRightX, vpY: horizonY, depthRatio: 0.16 });

  // ── BOOKSHELF — against the RIGHT wall, converges to VP-LEFT. Tall,
  // shallow box. ──
  const shelfNearW = 16, shelfNearH = 30;
  const shelfNearX = PERSPECTIVE_SVG_W - 10 - shelfNearW, shelfNearY = groundY - shelfNearH;
  const shelf = perspectiveFurnitureBox({ nearX: shelfNearX, nearY: shelfNearY, nearW: shelfNearW, nearH: shelfNearH, vpX: vpLeftX, vpY: horizonY, depthRatio: 0.22 });

  // ── TABLE — smaller, also against the right wall area, in front of the
  // bookshelf, converges to VP-LEFT. ──
  const tNearW = 16, tNearH = 10;
  const tNearX = shelfNearX - 14 - tNearW, tNearY = groundY - tNearH;
  const table = perspectiveFurnitureBox({ nearX: tNearX, nearY: tNearY, nearW: tNearW, nearH: tNearH, vpX: vpLeftX, vpY: horizonY, depthRatio: 0.14 });

  function drawBox(box, fill) {
    return `
      <path d="${box.farFace}" fill="${fill}" opacity="0.5"/>
      ${box.depthLinesToFar.map(d => `<path d="${d}" stroke="#1a1d2b" stroke-width="1.2" fill="none"/>`).join('')}
      <path d="${box.nearFace}" fill="${fill}" stroke="#1a1d2b" stroke-width="1.4"/>
    `;
  }
  function guideLines(box) {
    if (!showGuides) return '';
    return box.depthLines.map(d => `<path d="${d}" stroke="#67e8f9" stroke-width="1" stroke-dasharray="2 3" fill="none" opacity="0.55"/>`).join('');
  }

  // Small readability accents so the bed reads as "a bed" and not just a
  // flat-colored box: a thin headboard strip at its far (wall-side) edge,
  // and a lighter pillow patch near it. Purely decorative — no VP math.
  const headboardX = bedNearX, headboardY = bedNearY - 8, headboardW = bedNearW * 0.18 + 6, headboardH = 8;
  const pillowX = bedNearX + 3, pillowY = bedNearY + 2, pillowW = Math.min(14, bedNearW * 0.3), pillowH = bedNearH * 0.45;
  const bedAccents = `
    <rect x="${headboardX}" y="${headboardY}" width="${headboardW}" height="${headboardH}" rx="1.5" fill="#92400e" opacity="0.75"/>
    <rect x="${pillowX}" y="${pillowY}" width="${pillowW}" height="${pillowH}" rx="2" fill="#ffffff" opacity="0.8"/>
  `;

  return `
    ${guideLines(bed)}${guideLines(table)}${guideLines(shelf)}
    ${drawBox(bed, '#fda4af')}
    ${bedAccents}
    ${drawBox(table, '#fcd34d')}
    ${drawBox(shelf, '#a78bfa')}
  `;
}

// ─────────────────────────────────────────────────────────────────────────
// SECTION 5c · two-vp-room-drag
// Shared full-room draw routine used by BOTH this type and
// indoor-camera-angle-demo below, so the room looks identical whether the
// student is dragging a VP or tapping a camera-height button.
// ─────────────────────────────────────────────────────────────────────────
function perspectiveDrawFullRoom({ horizonY, vpLeftX, vpRightX, cornerX, cornerTopY, cornerBottomY, mode }) {
  const h = PERSPECTIVE_SVG_H, w = PERSPECTIVE_SVG_W;
  const p = perspectiveBuildRoomPaths(horizonY, vpLeftX, vpRightX, cornerX, cornerTopY, cornerBottomY);
  const showGuides = mode !== 'clean';
  const groundY = h - 6;
  const humanX = cornerX + (vpRightX - cornerX) * 0.32; // stands a bit right of the corner, in open floor space

  return `
    <!-- ceiling vs floor fill so the two read as clearly different planes -->
    <rect x="0" y="0" width="${w}" height="${cornerTopY}" fill="#eef2ff" opacity="0.4"/>
    <rect x="0" y="${groundY}" width="${w}" height="${h - groundY}" fill="#d6c4a8" opacity="0.5"/>

    ${perspectiveBackWallSvg(cornerX, horizonY, cornerTopY, cornerBottomY)}

    ${showGuides ? `
      <path d="${p.vpGuideLeftTop}" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity="0.5"/>
      <path d="${p.vpGuideLeftBottom}" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity="0.5"/>
      <path d="${p.vpGuideRightTop}" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity="0.5"/>
      <path d="${p.vpGuideRightBottom}" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity="0.5"/>
    ` : ''}

    <path d="${p.floorL}" stroke="#1a1d2b" stroke-width="2" fill="none"/>
    <path d="${p.floorR}" stroke="#1a1d2b" stroke-width="2" fill="none"/>
    <path d="${p.ceilL}" stroke="#1a1d2b" stroke-width="2" fill="none"/>
    <path d="${p.ceilR}" stroke="#1a1d2b" stroke-width="2" fill="none"/>
    <path d="${p.wallL}" stroke="#1a1d2b" stroke-width="2" fill="none"/>
    <path d="${p.wallR}" stroke="#1a1d2b" stroke-width="2" fill="none"/>
    <path d="${p.cornerLine}" stroke="#1a1d2b" stroke-width="2.5" fill="none"/>

    <!-- baseboard: a thin offset line just above the floor lines -->
    <path d="${p.floorL}" stroke="#94a3b8" stroke-width="1" fill="none" transform="translate(0,-3)" opacity="0.6"/>
    <path d="${p.floorR}" stroke="#94a3b8" stroke-width="1" fill="none" transform="translate(0,-3)" opacity="0.6"/>

    ${perspectiveRoomFurnitureSvg(cornerX, horizonY, h, vpLeftX, vpRightX, mode)}
    ${perspectiveHumanFigureSvg(humanX, horizonY, groundY)}
  `;
}

function renderTwoVpRoomDrag(cfg, domId) {
  const w = PERSPECTIVE_SVG_W, h = PERSPECTIVE_SVG_H;
  const horizonY = h * 0.42;
  const vpLeftX = 26, vpRightX = w - 26;
  const cornerX = w / 2, cornerTopY = horizonY - 50, cornerBottomY = horizonY + 60;
  return `
    <div class="ipb-wrap" id="${domId}" data-type="two-vp-room-drag" data-horizony="${horizonY}" data-cornerx="${cornerX}" data-top="${cornerTopY}" data-bottom="${cornerBottomY}" data-mode="construction">
      <div class="ipb-stage">
        <svg viewBox="0 0 ${w} ${h}" class="ipb-svg" id="${domId}-svg">
          <rect width="${w}" height="${h}" fill="#f5f3ff"/>
          <g id="${domId}-room"></g>
          <line x1="0" y1="${horizonY}" x2="${w}" y2="${horizonY}" stroke="#1a1d2b" stroke-width="2"/>
          <g id="${domId}-vpL" class="ipb-handle-group" style="cursor: grab;">
            <circle cx="${vpLeftX}" cy="${horizonY}" r="9" fill="#c8a96e" stroke="#1a1d2b" stroke-width="2"/>
            <text x="${vpLeftX}" y="${horizonY - 16}" font-size="9" text-anchor="middle" font-weight="800" fill="#c8a96e">VP·L</text>
          </g>
          <g id="${domId}-vpR" class="ipb-handle-group" style="cursor: grab;">
            <circle cx="${vpRightX}" cy="${horizonY}" r="9" fill="#c8a96e" stroke="#1a1d2b" stroke-width="2"/>
            <text x="${vpRightX}" y="${horizonY - 16}" font-size="9" text-anchor="middle" font-weight="800" fill="#c8a96e">VP·R</text>
          </g>
        </svg>
        <div class="ipb-label-chip" style="left:auto; right:8px;">Eye Level Reference</div>
      </div>
      <div class="ipb-toggle-row">
        <button class="ipb-toggle-btn active" id="${domId}-btn-construction" onclick="ipbSetRoomDragMode('${domId}', 'construction')">Construction</button>
        <button class="ipb-toggle-btn" id="${domId}-btn-clean" onclick="ipbSetRoomDragMode('${domId}', 'clean')">Clean View</button>
      </div>
      <div class="ipb-hint">${cfg.shortInstruction || 'Drag the VP points. Watch the room and furniture change.'}</div>
    </div>
  `;
}
function ipbSetRoomDragMode(domId, mode) {
  const wrap = document.getElementById(domId);
  wrap.dataset.mode = mode;
  wrap.querySelector(`#${domId}-btn-construction`).classList.toggle('active', mode === 'construction');
  wrap.querySelector(`#${domId}-btn-clean`).classList.toggle('active', mode === 'clean');
  if (wrap._ipbRedraw) wrap._ipbRedraw();
}
function mountTwoVpRoomDrag(cfg, domId) {
  const wrap = document.getElementById(domId);
  if (!wrap) return;
  const svg = document.getElementById(`${domId}-svg`);
  const roomGroup = document.getElementById(`${domId}-room`);
  const vpLGroup = document.getElementById(`${domId}-vpL`);
  const vpRGroup = document.getElementById(`${domId}-vpR`);
  const w = PERSPECTIVE_SVG_W;
  const horizonY = parseFloat(wrap.dataset.horizony);
  const cornerX = parseFloat(wrap.dataset.cornerx);
  const cornerTopY = parseFloat(wrap.dataset.top);
  const cornerBottomY = parseFloat(wrap.dataset.bottom);
  let vpLeftX = 26, vpRightX = w - 26;

  function draw() {
    vpLGroup.querySelector('circle').setAttribute('cx', vpLeftX);
    vpLGroup.querySelector('text').setAttribute('x', vpLeftX);
    vpRGroup.querySelector('circle').setAttribute('cx', vpRightX);
    vpRGroup.querySelector('text').setAttribute('x', vpRightX);
    roomGroup.innerHTML = perspectiveDrawFullRoom({ horizonY, vpLeftX, vpRightX, cornerX, cornerTopY, cornerBottomY, mode: wrap.dataset.mode });
  }
  wrap._ipbRedraw = draw;
  draw();

  let dragging = null; // 'L' | 'R' | null
  function clientXToSvgX(clientX) {
    const rect = svg.getBoundingClientRect();
    return (clientX - rect.left) / rect.width * w;
  }
  function onDown(which) {
    return (e) => { dragging = which; e.preventDefault(); };
  }
  function onMove(e) {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientXToSvgX(clientX);
    if (dragging === 'L') vpLeftX = clamp(x, 6, cornerX - 60);
    if (dragging === 'R') vpRightX = clamp(x, cornerX + 60, w - 6);
    draw();
  }
  function onUp() { dragging = null; }

  vpLGroup.addEventListener('mousedown', onDown('L'));
  vpLGroup.addEventListener('touchstart', onDown('L'), { passive: false });
  vpRGroup.addEventListener('mousedown', onDown('R'));
  vpRGroup.addEventListener('touchstart', onDown('R'), { passive: false });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);
}

// ─────────────────────────────────────────────────────────────────────────
// SECTION 5d · indoor-camera-angle-demo (click 3 fixed horizon heights)
// Reuses perspectiveDrawFullRoom so all 3 states show a real furnished
// room, not an abstract wireframe.
// ─────────────────────────────────────────────────────────────────────────
function renderIndoorCameraAngleDemo(cfg, domId) {
  const w = PERSPECTIVE_SVG_W, h = PERSPECTIVE_SVG_H;
  const positions = { high: h * 0.33, mid: h * 0.42, low: h * 0.51 }; // subtle shifts — "slightly" high/low per spec
  const vpLeftX = 26, vpRightX = w - 26, cornerX = w / 2;
  return `
    <div class="ipb-wrap" id="${domId}" data-type="indoor-camera-angle-demo" data-mode="clean">
      <div class="ipb-camera-row">
        <button class="ipb-cam-btn" data-pos="high" onclick="ipbSetIndoorCameraDemo('${domId}', 'high')">📷<span>Slightly High</span></button>
        <button class="ipb-cam-btn active" data-pos="mid" onclick="ipbSetIndoorCameraDemo('${domId}', 'mid')">📷<span>Eye Level</span></button>
        <button class="ipb-cam-btn" data-pos="low" onclick="ipbSetIndoorCameraDemo('${domId}', 'low')">📷<span>Slightly Low</span></button>
      </div>
      <div class="ipb-stage">
        <svg viewBox="0 0 ${w} ${h}" class="ipb-svg" id="${domId}-svg" data-high="${positions.high}" data-mid="${positions.mid}" data-low="${positions.low}" data-vpl="${vpLeftX}" data-vpr="${vpRightX}" data-cornerx="${cornerX}">
          <rect width="${w}" height="${h}" fill="#f5f3ff"/>
          <g id="${domId}-room"></g>
          <line id="${domId}-horizon" x1="0" y1="${positions.mid}" x2="${w}" y2="${positions.mid}" stroke="#1a1d2b" stroke-width="2"/>
        </svg>
      </div>
      <div class="ipb-hint">${cfg.shortInstruction || 'Camera height changes how we see the room.'}</div>
    </div>
  `;
}
function ipbSetIndoorCameraDemo(domId, pos) {
  const svg = document.getElementById(`${domId}-svg`);
  const horizonY = parseFloat(svg.dataset[pos]);
  const vpLeftX = parseFloat(svg.dataset.vpl), vpRightX = parseFloat(svg.dataset.vpr), cornerX = parseFloat(svg.dataset.cornerx);
  const cornerTopY = horizonY - 50, cornerBottomY = horizonY + 60;
  document.getElementById(`${domId}-horizon`).setAttribute('y1', horizonY);
  document.getElementById(`${domId}-horizon`).setAttribute('y2', horizonY);
  document.getElementById(`${domId}-room`).innerHTML = perspectiveDrawFullRoom({ horizonY, vpLeftX, vpRightX, cornerX, cornerTopY, cornerBottomY, mode: 'clean' });
  document.getElementById(domId).querySelectorAll('.ipb-cam-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pos === pos);
  });
}
function mountIndoorCameraAngleDemo(cfg, domId) {
  ipbSetIndoorCameraDemo(domId, 'mid');
}

// ─────────────────────────────────────────────────────────────────────────
// SECTION 5e · first-vertical-line-room (draggable corner line: position + length)
// ─────────────────────────────────────────────────────────────────────────
function renderFirstVerticalLineRoom(cfg, domId) {
  const w = PERSPECTIVE_SVG_W, h = PERSPECTIVE_SVG_H;
  const horizonY = h * 0.42;
  const vpLeftX = 26, vpRightX = w - 26;
  const startCornerX = w / 2, startTopY = horizonY - 40, startBottomY = horizonY + 48;
  return `
    <div class="ipb-wrap" id="${domId}" data-type="first-vertical-line-room" data-horizony="${horizonY}" data-vpl="${vpLeftX}" data-vpr="${vpRightX}">
      <div class="ipb-stage">
        <svg viewBox="0 0 ${w} ${h}" class="ipb-svg" id="${domId}-svg">
          <rect width="${w}" height="${h}" fill="#f5f3ff"/>
          <g id="${domId}-guides"></g>
          <line x1="0" y1="${horizonY}" x2="${w}" y2="${horizonY}" stroke="#1a1d2b" stroke-width="2"/>
          <circle cx="${vpLeftX}" cy="${horizonY}" r="7" fill="#c8a96e"/>
          <text x="${vpLeftX}" y="${horizonY - 13}" font-size="8.5" text-anchor="middle" font-weight="800" fill="#c8a96e">VP·L</text>
          <circle cx="${vpRightX}" cy="${horizonY}" r="7" fill="#c8a96e"/>
          <text x="${vpRightX}" y="${horizonY - 13}" font-size="8.5" text-anchor="middle" font-weight="800" fill="#c8a96e">VP·R</text>
          <g id="${domId}-corner" class="ipb-handle-group" style="cursor: grab;">
            <line x1="${startCornerX}" y1="${startTopY}" x2="${startCornerX}" y2="${startBottomY}" stroke="#1a1d2b" stroke-width="3"/>
            <circle cx="${startCornerX}" cy="${startTopY}" r="7" fill="#67e8f9" stroke="#1a1d2b" stroke-width="1.5" data-handle="top"/>
            <circle cx="${startCornerX}" cy="${startBottomY}" r="7" fill="#67e8f9" stroke="#1a1d2b" stroke-width="1.5" data-handle="bottom"/>
            <rect x="${startCornerX - 14}" y="${startTopY}" width="28" height="${startBottomY - startTopY}" fill="transparent" data-handle="move"/>
          </g>
        </svg>
      </div>
      <div class="ipb-readout">Room Corner</div>
      <div class="ipb-hint">${cfg.shortInstruction || 'Move the line. It becomes the room corner.'}</div>
    </div>
  `;
}
function mountFirstVerticalLineRoom(cfg, domId) {
  const wrap = document.getElementById(domId);
  if (!wrap) return;
  const svg = document.getElementById(`${domId}-svg`);
  const cornerGroup = document.getElementById(`${domId}-corner`);
  const guidesGroup = document.getElementById(`${domId}-guides`);
  const w = PERSPECTIVE_SVG_W, h = PERSPECTIVE_SVG_H;
  const horizonY = parseFloat(wrap.dataset.horizony);
  const vpLeftX = parseFloat(wrap.dataset.vpl), vpRightX = parseFloat(wrap.dataset.vpr);

  let cornerX = w / 2, topY = horizonY - 40, bottomY = horizonY + 48;

  function draw() {
    const line = cornerGroup.querySelector('line');
    const topHandle = cornerGroup.querySelector('[data-handle="top"]');
    const bottomHandle = cornerGroup.querySelector('[data-handle="bottom"]');
    const moveRect = cornerGroup.querySelector('[data-handle="move"]');
    line.setAttribute('x1', cornerX); line.setAttribute('x2', cornerX);
    line.setAttribute('y1', topY); line.setAttribute('y2', bottomY);
    topHandle.setAttribute('cx', cornerX); topHandle.setAttribute('cy', topY);
    bottomHandle.setAttribute('cx', cornerX); bottomHandle.setAttribute('cy', bottomY);
    moveRect.setAttribute('x', cornerX - 14); moveRect.setAttribute('y', topY);
    moveRect.setAttribute('height', bottomY - topY);

    const p = perspectiveBuildRoomPaths(horizonY, vpLeftX, vpRightX, cornerX, topY, bottomY);
    guidesGroup.innerHTML = `
      <path d="${p.vpGuideLeftTop}" stroke="#a78bfa" stroke-width="1.2" stroke-dasharray="3 3" fill="none" opacity="0.6"/>
      <path d="${p.vpGuideLeftBottom}" stroke="#a78bfa" stroke-width="1.2" stroke-dasharray="3 3" fill="none" opacity="0.6"/>
      <path d="${p.vpGuideRightTop}" stroke="#a78bfa" stroke-width="1.2" stroke-dasharray="3 3" fill="none" opacity="0.6"/>
      <path d="${p.vpGuideRightBottom}" stroke="#a78bfa" stroke-width="1.2" stroke-dasharray="3 3" fill="none" opacity="0.6"/>
    `;
  }
  draw();

  let dragMode = null; // 'top' | 'bottom' | 'move' | null
  let moveStartX = 0, moveStartCornerX = 0;

  function svgPoint(e) {
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) / rect.width * w, y: (clientY - rect.top) / rect.height * h };
  }
  function onDown(e) {
    const handle = e.target.dataset.handle;
    dragMode = handle || 'move';
    if (dragMode === 'move') { moveStartX = svgPoint(e).x; moveStartCornerX = cornerX; }
    e.preventDefault();
  }
  function onMove(e) {
    if (!dragMode) return;
    const pt = svgPoint(e);
    if (dragMode === 'top') topY = clamp(pt.y, 4, bottomY - 30);
    else if (dragMode === 'bottom') bottomY = clamp(pt.y, topY + 30, h - 4);
    else if (dragMode === 'move') cornerX = clamp(moveStartCornerX + (pt.x - moveStartX), vpLeftX + 50, vpRightX - 50);
    draw();
  }
  function onUp() { dragMode = null; }

  cornerGroup.addEventListener('mousedown', onDown);
  cornerGroup.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);
}

// ─────────────────────────────────────────────────────────────────────────
// SECTION 5f · room-frame-reveal (sequential reveal from the corner line)
// ─────────────────────────────────────────────────────────────────────────
function renderRoomFrameReveal(cfg, domId) {
  const w = PERSPECTIVE_SVG_W, h = PERSPECTIVE_SVG_H;
  const horizonY = h * 0.42;
  const vpLeftX = 26, vpRightX = w - 26;
  const cornerX = w / 2, topY = horizonY - 40, bottomY = horizonY + 48;
  return `
    <div class="ipb-wrap" id="${domId}" data-type="room-frame-reveal" data-stage="0">
      <div class="ipb-stage">
        <svg viewBox="0 0 ${w} ${h}" class="ipb-svg" id="${domId}-svg">
          <rect width="${w}" height="${h}" fill="#f5f3ff"/>
          <line x1="0" y1="${horizonY}" x2="${w}" y2="${horizonY}" stroke="#1a1d2b" stroke-width="2" opacity="0.5"/>
          <circle cx="${vpLeftX}" cy="${horizonY}" r="6" fill="#c8a96e" opacity="0.7"/>
          <circle cx="${vpRightX}" cy="${horizonY}" r="6" fill="#c8a96e" opacity="0.7"/>
          <g id="${domId}-corner" style="opacity:0; transition: opacity .4s;">
            <line x1="${cornerX}" y1="${topY}" x2="${cornerX}" y2="${bottomY}" stroke="#1a1d2b" stroke-width="3"/>
          </g>
          <g id="${domId}-floor" style="opacity:0; transition: opacity .4s;"></g>
          <g id="${domId}-ceil" style="opacity:0; transition: opacity .4s;"></g>
          <g id="${domId}-wallL" style="opacity:0; transition: opacity .4s;"></g>
          <g id="${domId}-wallR" style="opacity:0; transition: opacity .4s;"></g>
          <g id="${domId}-guides" style="opacity:0; transition: opacity .4s;"></g>
        </svg>
        <div class="ipb-label-chip" id="${domId}-chip">Tap Show Room Frame to begin</div>
      </div>
      <div class="ipb-btn-row">
        <button class="ipb-mini-btn" onclick="ipbRoomFrameNext('${domId}')">Show Room Frame →</button>
        <button class="ipb-mini-btn ipb-mini-ghost" onclick="ipbRoomFrameReplay('${domId}')">↺ Replay</button>
      </div>
      <div class="ipb-btn-row">
        <button class="ipb-mini-btn ipb-mini-ghost" onclick="ipbRoomFrameToggleView('${domId}', 'construction')">Construction View</button>
        <button class="ipb-mini-btn ipb-mini-ghost" onclick="ipbRoomFrameToggleView('${domId}', 'clean')">Clean View</button>
      </div>
      <div class="ipb-hint">${cfg.shortInstruction || 'Show Room Frame builds the box from the corner line.'}</div>
    </div>
  `;
}
const IPB_ROOM_FRAME_STAGES = ['First Vertical Line', 'Floor', 'Ceiling', 'Left Wall', 'Right Wall', 'Room Box'];
function ipbRoomFrameNext(domId) {
  const wrap = document.getElementById(domId);
  let stage = parseInt(wrap.dataset.stage || '0', 10);
  stage = Math.min(stage + 1, IPB_ROOM_FRAME_STAGES.length);
  wrap.dataset.stage = stage;
  ipbRoomFrameRender(domId, stage);
}
function ipbRoomFrameReplay(domId) {
  const wrap = document.getElementById(domId);
  wrap.dataset.stage = '0';
  ipbRoomFrameRender(domId, 0);
}
function ipbRoomFrameToggleView(domId, mode) {
  const wrap = document.getElementById(domId);
  const stage = mode === 'construction' ? IPB_ROOM_FRAME_STAGES.length : 5; // 'clean' = room box without extra VP guide dashes
  wrap.dataset.stage = stage;
  ipbRoomFrameRender(domId, stage, mode);
}
function ipbRoomFrameRender(domId, stage, mode) {
  const h = PERSPECTIVE_SVG_H, w = PERSPECTIVE_SVG_W;
  const horizonY = h * 0.42, vpLeftX = 26, vpRightX = w - 26;
  const cornerX = w / 2, topY = horizonY - 40, bottomY = horizonY + 48;
  const p = perspectiveBuildRoomPaths(horizonY, vpLeftX, vpRightX, cornerX, topY, bottomY);

  const corner = document.getElementById(`${domId}-corner`);
  const floor = document.getElementById(`${domId}-floor`);
  const ceil = document.getElementById(`${domId}-ceil`);
  const wallL = document.getElementById(`${domId}-wallL`);
  const wallR = document.getElementById(`${domId}-wallR`);
  const guides = document.getElementById(`${domId}-guides`);
  const chip = document.getElementById(`${domId}-chip`);

  corner.style.opacity = stage >= 1 ? '1' : '0';
  if (stage >= 2) { floor.innerHTML = `<path d="${p.floorL}" stroke="#1a1d2b" stroke-width="2" fill="none"/><path d="${p.floorR}" stroke="#1a1d2b" stroke-width="2" fill="none"/>`; floor.style.opacity = '1'; } else floor.style.opacity = '0';
  if (stage >= 3) { ceil.innerHTML = `<path d="${p.ceilL}" stroke="#1a1d2b" stroke-width="2" fill="none"/><path d="${p.ceilR}" stroke="#1a1d2b" stroke-width="2" fill="none"/>`; ceil.style.opacity = '1'; } else ceil.style.opacity = '0';
  if (stage >= 4) { wallL.innerHTML = `<path d="${p.wallL}" stroke="#1a1d2b" stroke-width="2" fill="none"/>`; wallL.style.opacity = '1'; } else wallL.style.opacity = '0';
  if (stage >= 5) { wallR.innerHTML = `<path d="${p.wallR}" stroke="#1a1d2b" stroke-width="2" fill="none"/>`; wallR.style.opacity = '1'; } else wallR.style.opacity = '0';
  if (stage >= 6 && mode !== 'clean') {
    guides.innerHTML = `
      <path d="${p.vpGuideLeftTop}" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity="0.5"/>
      <path d="${p.vpGuideLeftBottom}" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity="0.5"/>
      <path d="${p.vpGuideRightTop}" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity="0.5"/>
      <path d="${p.vpGuideRightBottom}" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity="0.5"/>
    `;
    guides.style.opacity = '1';
  } else {
    guides.style.opacity = '0';
  }
  chip.textContent = stage === 0 ? 'Tap Show Room Frame to begin' : (mode === 'clean' ? 'Clean View — Room Box' : `Showing: ${IPB_ROOM_FRAME_STAGES[stage - 1]}`);
}
function mountRoomFrameReveal(cfg, domId) {
  ipbRoomFrameRender(domId, 0);
}

// ─────────────────────────────────────────────────────────────────────────
// SECTION 6 · DISPATCH — render + mount by type
// ─────────────────────────────────────────────────────────────────────────
function renderInteractiveBlock(interactiveCfg, domId) {
  if (!interactiveCfg) return '';
  switch (interactiveCfg.type) {
    case 'horizon-line-drag': return renderHorizonLineDrag(interactiveCfg, domId);
    case 'vp-drag': return renderVpDrag(interactiveCfg, domId);
    case 'camera-angle-demo': return renderCameraAngleDemo(interactiveCfg, domId);
    case 'guide-line-animation': return renderGuideLineAnimation(interactiveCfg, domId);
    case 'construction-toggle': return renderConstructionToggle(interactiveCfg, domId);
    case 'two-vp-room-drag': return renderTwoVpRoomDrag(interactiveCfg, domId);
    case 'indoor-camera-angle-demo': return renderIndoorCameraAngleDemo(interactiveCfg, domId);
    case 'first-vertical-line-room': return renderFirstVerticalLineRoom(interactiveCfg, domId);
    case 'room-frame-reveal': return renderRoomFrameReveal(interactiveCfg, domId);
    default: return '';
  }
}
function mountInteractiveBlock(interactiveCfg, domId) {
  if (!interactiveCfg) return;
  switch (interactiveCfg.type) {
    case 'horizon-line-drag': mountHorizonLineDrag(interactiveCfg, domId); break;
    case 'vp-drag': mountVpDrag(interactiveCfg, domId); break;
    case 'camera-angle-demo': mountCameraAngleDemo(interactiveCfg, domId); break;
    case 'guide-line-animation': mountGuideLineAnimation(interactiveCfg, domId); break;
    case 'construction-toggle': mountConstructionToggle(interactiveCfg, domId); break;
    case 'two-vp-room-drag': mountTwoVpRoomDrag(interactiveCfg, domId); break;
    case 'indoor-camera-angle-demo': mountIndoorCameraAngleDemo(interactiveCfg, domId); break;
    case 'first-vertical-line-room': mountFirstVerticalLineRoom(interactiveCfg, domId); break;
    case 'room-frame-reveal': mountRoomFrameReveal(interactiveCfg, domId); break;
  }
}
