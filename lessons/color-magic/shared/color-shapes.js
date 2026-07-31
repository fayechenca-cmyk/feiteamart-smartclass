/* ============================================================
 * FEI TeamArt · Color Magic — watercolor blob shapes
 *
 * Replaces flat CSS circles with irregular, organic paint-blob SVGs so
 * color elements read as PAINT, not UI buttons. Every instance gets a
 * unique wobble (seeded, so it's reproducible per element but no two
 * blobs on screen look identical) plus a shared feTurbulence grain
 * filter for texture.
 *
 * ColorShapes.injectDefs()               — call once per page (idempotent)
 * ColorShapes.blobPathD(seed, size)       — an irregular closed path string
 * ColorShapes.paintBlobSVG({...})         — a full inline <svg> string
 * ColorShapes.bucketSVG({...})            — an illustrated paint-bucket <svg> string
 * ColorShapes.lerpColor(hexA, hexB, t)    — proportional RGB mix, t = 0..1
 * ============================================================ */
(function (global) {
  'use strict';

  function mulberry32(seed) {
    let a = seed | 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // A closed, organic wobble path — 8 points around a circle with
  // randomized radius, joined with quadratic curves through midpoints
  // (a cheap, reliable way to get a soft blob outline, not a polygon).
  function blobPathD(seed, size) {
    const rnd = mulberry32(seed);
    const cx = size / 2, cy = size / 2;
    const baseR = (size / 2) * 0.82;
    const n = 8;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      const r = baseR * (0.76 + rnd() * 0.4);
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    let d = 'M ' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1) + ' ';
    for (let i = 0; i < n; i++) {
      const p0 = pts[i];
      const p1 = pts[(i + 1) % n];
      const mx = (p0.x + p1.x) / 2, my = (p0.y + p1.y) / 2;
      d += 'Q ' + p0.x.toFixed(1) + ' ' + p0.y.toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ';
    }
    return d + 'Z';
  }

  // Shared feTurbulence + feDisplacementMap filter (same technique as
  // lessons/my-magical-city's #rough filter, tuned lighter for these
  // smaller elements) — injected once, referenced by every blob.
  function injectDefs() {
    if (document.getElementById('color-shapes-defs')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'color-shapes-defs';
    svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;');
    svg.innerHTML =
      '<defs><filter id="colorGrain" x="-20%" y="-20%" width="140%" height="140%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="noise" scale="3"/>' +
      '</filter></defs>';
    document.body.appendChild(svg);
  }

  function paintBlobSVG(opts) {
    const seed = opts.seed || 1;
    const color = opts.color || '#999';
    const size = opts.size || 70;
    const label = opts.label || '';
    const d = blobPathD(seed, size);
    const fontSize = Math.max(8, Math.round(size * 0.14));
    const labelSvg = label
      ? '<text x="' + (size / 2) + '" y="' + (size / 2 + fontSize * 0.35) + '" text-anchor="middle" ' +
        'font-family="Patrick Hand" font-weight="700" font-size="' + fontSize + '" fill="rgba(255,255,255,0.95)">' + label + '</text>'
      : '';
    return (
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" style="overflow:visible;display:block;">' +
      '<path d="' + d + '" fill="' + color + '" opacity="0.93" filter="url(#colorGrain)"/>' +
      '<path d="' + d + '" fill="none" stroke="rgba(0,0,0,0.14)" stroke-width="1.5" filter="url(#colorGrain)"/>' +
      labelSvg +
      '</svg>'
    );
  }

  // An illustrated paint bucket: trapezoid body, rim ellipse, handle
  // arc, a drip of paint at the rim in the target color — used in
  // Step 4 in place of dashed-border drop-zone rectangles.
  function bucketSVG(opts) {
    const fill = opts.fill || '#c8a878';
    const stroke = opts.stroke || '#7a5838';
    const drip = opts.drip || fill;
    const label = opts.label || '';
    const emoji = opts.emoji || '';
    const w = opts.width || 150;
    const h = opts.height || 118;
    return (
      '<svg width="' + w + '" height="' + h + '" viewBox="0 0 150 118" style="overflow:visible;display:block;">' +
      '<path d="M22 22 L128 22 L114 100 Q75 111 36 100 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="3"/>' +
      '<ellipse cx="75" cy="22" rx="53" ry="11" fill="' + fill + '" stroke="' + stroke + '" stroke-width="3"/>' +
      '<path d="M20 32 Q0 44 8 64 Q15 82 32 84" fill="none" stroke="' + stroke + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M58 8 Q75 -8 92 8 L86 19 Q75 9 64 19 Z" fill="' + drip + '" stroke="' + stroke + '" stroke-width="2"/>' +
      (emoji ? '<text x="75" y="66" text-anchor="middle" font-size="28">' + emoji + '</text>' : '') +
      (label ? '<text x="75" y="112" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="12" fill="' + stroke + '">' + label + '</text>' : '') +
      '</svg>'
    );
  }

  function hexToRgb(hex) {
    const n = parseInt(hex.replace('#', ''), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function rgbToHex(rgb) {
    const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
    return '#' + c(rgb.r) + c(rgb.g) + c(rgb.b);
  }
  // Proportional color mix — t=0 is pure A, t=1 is pure B, continuous
  // in between. This is the actual math behind "how much of each blob
  // overlaps" driving the blended hue in Step 3/5, not a fixed lookup.
  function lerpColor(hexA, hexB, t) {
    const a = hexToRgb(hexA), b = hexToRgb(hexB);
    t = Math.max(0, Math.min(1, t));
    return rgbToHex({
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t
    });
  }

  global.ColorShapes = {
    injectDefs: injectDefs,
    blobPathD: blobPathD,
    paintBlobSVG: paintBlobSVG,
    bucketSVG: bucketSVG,
    lerpColor: lerpColor
  };
})(window);
