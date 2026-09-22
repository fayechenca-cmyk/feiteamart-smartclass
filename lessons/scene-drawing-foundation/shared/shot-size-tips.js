/* ============================================================
 * Scene Drawing Foundation — shared component: ShotSizeTips
 *
 * The written "Tips" block under each lesson's Quick Sketch panel. The
 * Quick Sketch reference videos are silent, so the "character size vs.
 * scene size" idea behind each shot size is explained here in writing.
 * ONE text, used by every shot-size lesson (Faye: same across lessons);
 * the lesson passes which shot it is so its own line is emphasised.
 * Later lessons (Close-Up, Extreme Close-Up) append their line to TIPS.
 *
 * USAGE
 *   <script src="../../shared/shot-size-tips.js"></script>   (NOT _shared/ —
 *     GitHub Pages does not publish underscore-prefixed directories)
 *   ShotSizeTips.html({ current: 'ws', after: '<div>…optional extra…</div>' })
 *   -> an HTML string; styles are injected once, colours come from the
 *      lesson's own --sb-* storyboard palette (with fallbacks).
 * ============================================================ */
(function (global) {
  'use strict';

  const TIPS = [
    { id: 'ews', label: 'Extreme Wide Shot', text: 'the scene fills the frame and the character is small — the environment tells the story.' },
    { id: 'ws', label: 'Wide Shot', text: 'character and scene share the frame together, and you can see the character’s full body.' },
    { id: 'ms', label: 'Medium Shot', text: 'the camera moves closer — the character becomes waist-up and the main focus, while the scene now supports and frames them rather than sharing equal weight.' },
    { id: 'cu', label: 'Close-Up', text: 'the camera moves in close — a face, a hand, or an object fills the frame, and a single detail carries the meaning.' }
  ];

  const BULB = '<svg class="sst-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2v.5h5v-.5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/></svg>';

  function injectStylesOnce() {
    if (document.getElementById('sst-styles')) return;
    const st = document.createElement('style');
    st.id = 'sst-styles';
    st.textContent = `
.sst{margin-top:16px;padding-top:14px;border-top:1.5px dashed var(--sb-line,rgba(58,53,44,.3));text-align:left;}
.sst-heading{display:flex;align-items:center;justify-content:center;gap:6px;font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:10.5px;letter-spacing:1.8px;text-transform:uppercase;color:var(--sb-accent,#8a6a4a);margin-bottom:9px;}
.sst-icon{flex:none;}
.sst-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:7px;}
.sst-item{font-size:12.5px;line-height:1.5;color:var(--sb-ink-soft,rgba(58,53,44,.62));padding:2px 0 2px 10px;border-left:2.5px solid transparent;}
.sst-item b{color:var(--sb-ink,#3a352c);font-weight:700;}
.sst-item.is-current{border-left-color:var(--sb-accent,#8a6a4a);color:var(--sb-ink,#3a352c);}
.sst-after{margin-top:12px;}
`;
    document.head.appendChild(st);
  }

  function html(opts) {
    opts = opts || {};
    injectStylesOnce();
    const items = TIPS.map(t =>
      `<li class="sst-item${t.id === opts.current ? ' is-current' : ''}"><b>${t.label}:</b> ${t.text}</li>`).join('');
    return `<div class="sst">
      <div class="sst-heading">${BULB}<span>Tips</span></div>
      <ul class="sst-list">${items}</ul>
      ${opts.after ? `<div class="sst-after">${opts.after}</div>` : ''}
    </div>`;
  }

  global.ShotSizeTips = { html: html, TIPS: TIPS };
})(window);
