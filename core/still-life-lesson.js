/* ============================================================
 * FEI TeamArt · Shared Step 2 ("Still Life and Texture") micro-lesson
 * engine — Foundation of Sketch v1.1 §4-5, component C.
 *
 * WHY A SHARED MODULE HERE (unlike Step 1, where each of the 11 lesson
 * files duplicates its own UserProfile/Analytics/etc. copy — the
 * established convention on this platform): Step 2 is 10 nearly-
 * identical micro-lessons, not 11 thematically distinct ones. That much
 * real repetition is exactly the case the spec calls out ("shared...
 * template... so Creation and other courses can adopt it later"), so
 * this consolidates it once instead of copy-pasting a 4-screen engine
 * into 10 files.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO: reimplement access control,
 * uploads, or completion tracking. It calls the REAL, already-existing
 * platform pieces:
 *   - FEIAccess.gateLessonPage('skills', lessonId) (core/access.js) —
 *     already built, already correct, simply unused by Step 1 today
 *     (superseded there by a click-time-only guard). Step 2 uses it at
 *     each lesson's own startup, which ALSO closes the deep-link gap
 *     Step 1 currently has (a bookmarked/typed URL to a gated Step 1
 *     lesson isn't re-checked) — free, low-risk, and doesn't touch
 *     Step 1. No change to core/access.js's gating LOGIC was needed:
 *     canOpenLesson('skills', id) is already default-deny (paywalled)
 *     for any id not in FREE_SKILLS, and none of Step 2's ids are in
 *     that list — see this same commit's access.js diff (comment-only)
 *     for the full reasoning.
 *   - core/teacher-submission.js's renderTeacherUploadModal() /
 *     onTeacherUploadFileSelected() / sendTeacherUpload() for the Draw
 *     step — the SAME upload-to-Supabase flow Step 1 uses, rendered
 *     inline instead of inside a modal (see initDraw() below), not a
 *     new upload mechanism.
 *   - core/celebrate.js's FEICelebrate for the Done screen.
 *
 * A minimal UserProfile shim is defined below — NOT the full ~110-line
 * version Step 1 duplicates per file (createGuest/upgradeToMember/etc.
 * aren't needed here; a student already has a profile by the time they
 * reach Step 2). Same storageKey, same field names
 * (completedLessons/totalXP), same sessionStorage — genuinely the same
 * data, just a smaller API surface. Never renames totalXP/
 * completedLessons/fei_user_profile, per the platform's hard rule.
 * ============================================================ */
(function (global) {
  'use strict';

  // ---- Step 2 · Still Life and Texture — the 10-lesson list ----------
  // Moved here from index.html's own inline script (where the Map first
  // defined it) so the Map, this engine, and the Step 2 landing page all
  // read the exact same array — one list, not three. index.html now
  // includes this file and uses these same global names unchanged.
  const FOUNDATION_STILL_LIFE_PATH = [
    { id: 'still-life-1a-star-balloon-structure', title: 'Foil Star Balloon · Structure & Composition', href: 'lessons/still-life-1a-star-balloon-structure/', ready: false },
    { id: 'still-life-1b-star-balloon-texture', title: 'Foil Star Balloon · Texture & Finish', href: 'lessons/still-life-1b-star-balloon-texture/', ready: false },
    { id: 'still-life-2a-glass-structure', title: 'Glass Cup and Bottle · Structure & Composition', href: 'lessons/still-life-2a-glass-structure/', ready: false },
    { id: 'still-life-2b-glass-texture', title: 'Glass Cup and Bottle · Texture & Finish', href: 'lessons/still-life-2b-glass-texture/', ready: false },
    { id: 'still-life-3a-pillow-structure', title: 'Pillow · Structure & Composition', href: 'lessons/still-life-3a-pillow-structure/', ready: false },
    { id: 'still-life-3b-pillow-texture', title: 'Pillow · Texture & Finish', href: 'lessons/still-life-3b-pillow-texture/', ready: false },
    { id: 'still-life-4a-plush-structure', title: 'Plush Toy · Structure & Composition', href: 'lessons/still-life-4a-plush-structure/', ready: false },
    { id: 'still-life-4b-plush-texture', title: 'Plush Toy · Texture & Finish', href: 'lessons/still-life-4b-plush-texture/', ready: false },
    { id: 'still-life-5a-tree-structure', title: 'Tree · Structure & Composition', href: 'lessons/still-life-5a-tree-structure/', ready: false },
    { id: 'still-life-5b-tree-texture', title: 'Tree · Texture & Finish', href: 'lessons/still-life-5b-tree-texture/', ready: false }
  ];
  // The 5 paintings, each pairing its A/B lesson ids — used for the
  // "painting complete" celebration tier and the landing page's grouping.
  const FOUNDATION_STILL_LIFE_PAINTINGS = [
    { id: 'star-balloon', title: 'Foil Star Balloon', materialFocus: 'Glossy, reflective', lessonIds: ['still-life-1a-star-balloon-structure', 'still-life-1b-star-balloon-texture'] },
    { id: 'glass', title: 'Glass Cup and Bottle', materialFocus: 'Transparency, glass', lessonIds: ['still-life-2a-glass-structure', 'still-life-2b-glass-texture'] },
    { id: 'pillow', title: 'Pillow', materialFocus: 'Fabric, soft folds', lessonIds: ['still-life-3a-pillow-structure', 'still-life-3b-pillow-texture'] },
    { id: 'plush', title: 'Plush Toy', materialFocus: 'Fur, soft fuzz', lessonIds: ['still-life-4a-plush-structure', 'still-life-4b-plush-texture'] },
    { id: 'tree', title: 'Tree', materialFocus: 'Bark, organic form', lessonIds: ['still-life-5a-tree-structure', 'still-life-5b-tree-texture'] }
  ];
  const FOUNDATION_STILL_LIFE_LANDING_HREF = 'lessons/still-life/';

  // ---- Minimal UserProfile shim — see file header for why this isn't
  // the full per-lesson-file version. ----
  const UserProfile = {
    current() {
      try {
        const raw = global.sessionStorage.getItem('fei_user_profile');
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    },
    completeLesson(lessonId) {
      const profile = this.current();
      if (!profile) return null;
      profile.completedLessons = Array.isArray(profile.completedLessons) ? profile.completedLessons : [];
      if (!profile.completedLessons.includes(lessonId)) profile.completedLessons.push(lessonId);
      profile.lastSeenAt = Date.now();
      try { global.sessionStorage.setItem('fei_user_profile', JSON.stringify(profile)); } catch (e) { /* best-effort */ }
      return profile;
    }
  };

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }

  // Honest, minimal analytics — logs so a call is never silently
  // dropped, but doesn't stand up a real pipeline here.
  const Analytics = { track(name, props) { try { console.log('[Analytics]', name, props || {}); } catch (e) {} } };

  function showBubble(text) {
    let el = document.getElementById('sll-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'sll-toast';
      el.className = 'sll-toast';
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3200);
  }

  const CF_STREAM_CUSTOMER = 'customer-a78os4oj56dr67ab.cloudflarestream.com';
  function cfStreamSrc(videoId) {
    const poster = encodeURIComponent(`https://${CF_STREAM_CUSTOMER}/${videoId}/thumbnails/thumbnail.jpg?time=&height=600`);
    return `https://${CF_STREAM_CUSTOMER}/${videoId}/iframe?poster=${poster}`;
  }
  // Same "coming soon" fallback shape used elsewhere on this platform
  // (e.g. lessons/miro-draw-without-knowing's renderVideoEmbed) — a
  // lesson with no videoStreamId yet still loads and is completable.
  function renderVideoEmbed(videoId, title) {
    if (videoId) {
      return `<div class="sll-video-stage">
        <iframe src="${cfStreamSrc(videoId)}" loading="lazy" title="${escapeHtml(title)}"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowfullscreen></iframe>
      </div>`;
    }
    return `<div class="sll-video-stage sll-video-placeholder">
      <div class="sll-video-placeholder-icon">🎥</div>
      <div class="sll-video-placeholder-text">Video coming soon!</div>
    </div>`;
  }

  const STYLE_ID = 'sll-styles';
  function injectStylesOnce() {
    if (document.getElementById(STYLE_ID)) return;
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = `
.sll-shell{max-width:480px;margin:0 auto;padding:18px 18px 100px;min-height:100vh;box-sizing:border-box;font-family:'Open Sans',sans-serif;}
.sll-back{background:none;border:none;cursor:pointer;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--ink-soft,rgba(26,29,43,.65));padding:6px 0;margin-bottom:10px;}
.sll-dots{display:flex;gap:6px;justify-content:center;margin-bottom:18px;}
.sll-dot{width:7px;height:7px;border-radius:50%;background:var(--ink-veryfaint,rgba(26,29,43,.15));}
.sll-dot.on{background:var(--gold,#c8a96e);}
.sll-kicker{font-family:'Montserrat',sans-serif;font-size:10px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase;color:var(--purple,#a78bfa);text-align:center;margin-bottom:6px;}
.sll-title{font-family:'Montserrat',sans-serif;font-size:20px;font-weight:900;text-align:center;margin-bottom:14px;}
.sll-line{font-size:14px;color:var(--ink-soft,rgba(26,29,43,.65));text-align:center;line-height:1.55;margin-bottom:18px;}
.sll-look-box{aspect-ratio:4/3;background:var(--paper-soft,#f5f5f7);border:1.5px dashed var(--ink-veryfaint,rgba(26,29,43,.15));border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;margin-bottom:16px;}
.sll-look-box-icon{font-size:2.2rem;opacity:.5;}
.sll-look-box-label{font-size:12px;color:var(--ink-faint,rgba(26,29,43,.45));text-align:center;padding:0 20px;}
.sll-video-stage{position:relative;width:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden;background:#000;margin-bottom:14px;}
.sll-video-stage iframe{position:absolute;inset:0;width:100%;height:100%;border:0;}
.sll-video-placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:linear-gradient(135deg,var(--purple,#a78bfa),var(--cyan,#67e8f9));color:#fff;}
.sll-video-placeholder-icon{font-size:2rem;}
.sll-video-placeholder-text{font-size:13px;}
.sll-disclaimer{font-size:11.5px;color:var(--ink-faint,rgba(26,29,43,.45));text-align:center;font-style:italic;margin-bottom:16px;}
.sll-btn{display:block;width:100%;padding:15px;border-radius:999px;border:none;background:var(--gold,#c8a96e);color:#fff;font-family:'Montserrat',sans-serif;font-weight:800;font-size:14px;cursor:pointer;text-align:center;text-decoration:none;box-sizing:border-box;}
.sll-btn:active{transform:scale(.98);}
.sll-btn-ghost{background:none;border:1.5px solid var(--ink-veryfaint,rgba(26,29,43,.15));color:var(--ink-soft,rgba(26,29,43,.65));margin-top:10px;}
.sll-done-icon{font-size:2.6rem;text-align:center;margin-bottom:10px;}
.sll-draw-hint{font-size:12.5px;color:var(--ink-soft,rgba(26,29,43,.65));text-align:center;margin-bottom:14px;}
.sll-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);background:#1a1d2b;color:#fff;padding:10px 18px;border-radius:999px;font-size:12.5px;opacity:0;transition:opacity .25s ease,transform .25s ease;pointer-events:none;z-index:500;max-width:86vw;text-align:center;}
.sll-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
${_teacherUploadCssFallback()}
`;
    document.head.appendChild(st);
  }
  // core/teacher-submission.js's markup uses .upload-file-* / .modal-*
  // classes that Step 1 lesson pages already style inline. This page
  // doesn't load Step 1's stylesheet, so a small compatible set is
  // provided here — same class names, so if a future page already
  // defines them, these are simply redundant, not conflicting.
  function _teacherUploadCssFallback() {
    return `
.modal-title{font-family:'Montserrat',sans-serif;font-weight:800;font-size:15px;margin-bottom:4px;text-align:center;}
.modal-sub{font-size:12.5px;color:var(--ink-soft,rgba(26,29,43,.65));text-align:center;}
.upload-file-block{margin-bottom:6px;}
.upload-file-label{display:flex;align-items:center;gap:12px;border:1.5px dashed var(--ink-veryfaint,rgba(26,29,43,.15));border-radius:14px;padding:16px;cursor:pointer;}
.upload-file-icon{font-size:1.6rem;}
.upload-file-text-main{font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;}
.upload-file-text-sub{font-size:11px;color:var(--ink-faint,rgba(26,29,43,.45));}
.upload-file-preview{border-radius:14px;overflow:hidden;border:1.5px solid var(--ink-veryfaint,rgba(26,29,43,.15));}
.upload-file-preview-img{width:100%;display:block;max-height:220px;object-fit:cover;}
.upload-file-preview-meta{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;font-size:11.5px;}
.upload-file-replace{color:var(--purple,#a78bfa);cursor:pointer;font-weight:700;}
.btn-gold{background:var(--gold,#c8a96e);color:#fff;border:none;border-radius:999px;font-family:'Montserrat',sans-serif;font-weight:800;cursor:pointer;}
.btn-ghost{background:none;border:1.5px solid var(--ink-veryfaint,rgba(26,29,43,.15));border-radius:999px;color:var(--ink-soft,rgba(26,29,43,.65));cursor:pointer;padding:12px;width:100%;font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;}
.btn-stack{width:100%;}
`;
  }

  const SCREENS = ['look', 'watch', 'draw', 'done'];

  async function init(config) {
    // Self-gate at startup, same real check the landing page uses to
    // decide what's clickable — closes the "direct/bookmarked URL to a
    // gated lesson" gap (Step 1 pages don't do this; see file header).
    // gateLessonPage handles its own redirect internally when blocked.
    if (global.FEIAccess && typeof global.FEIAccess.gateLessonPage === 'function') {
      try {
        const ok = await global.FEIAccess.gateLessonPage('skills', config.lessonId);
        if (!ok) return; // redirecting away — don't render anything
      } catch (e) {
        console.warn('[still-life-lesson] gate check failed, allowing through', e);
      }
    }
    injectStylesOnce();
    const root = document.getElementById(config.mountId || 'app');
    let screenIndex = 0;

    function dots() {
      return `<div class="sll-dots">${SCREENS.map((s, i) => `<span class="sll-dot${i <= screenIndex ? ' on' : ''}"></span>`).join('')}</div>`;
    }

    function renderShell(inner) {
      root.innerHTML = `
        <div class="sll-shell">
          <button class="sll-back" onclick="location.href='${config.landingHref || '../still-life/'}'">← Back to Step 2</button>
          ${dots()}
          ${inner}
        </div>
      `;
    }

    function renderLook() {
      renderShell(`
        <div class="sll-kicker">${escapeHtml(config.partLabel)}</div>
        <div class="sll-title">${escapeHtml(config.paintingTitle)}</div>
        <div class="sll-look-box">
          <div class="sll-look-box-icon">🖼️</div>
          <div class="sll-look-box-label">${escapeHtml(config.materialFocus)}<br>Reference photo coming soon</div>
        </div>
        <div class="sll-line">${escapeHtml(config.lookLine)}</div>
        <button class="sll-btn" id="sll-next-1">Next →</button>
      `);
      document.getElementById('sll-next-1').onclick = () => go(1);
    }

    function renderWatch() {
      renderShell(`
        <div class="sll-kicker">${escapeHtml(config.partLabel)}</div>
        <div class="sll-title">Let's Draw Together</div>
        ${renderVideoEmbed(config.videoStreamId, config.paintingTitle)}
        <div class="sll-disclaimer">This is the teacher's own way of drawing it — not the only way.</div>
        <button class="sll-btn" id="sll-next-2">Next →</button>
      `);
      document.getElementById('sll-next-2').onclick = () => go(2);
    }

    function renderDraw() {
      renderShell(`
        <div class="sll-kicker">${escapeHtml(config.partLabel)}</div>
        <div class="sll-title">Your Turn</div>
        <div class="sll-draw-hint">Draw it on paper — or upload a photo when you're done.</div>
        <div id="sll-upload-host"></div>
      `);
      // Reused verbatim from core/teacher-submission.js — see file header.
      document.getElementById('sll-upload-host').innerHTML =
        global.renderTeacherUploadModal().replace(
          /Cancel\s*<\/button>/,
          'Skip for now →</button>'
        );
      const cancelBtn = document.querySelector('#sll-upload-host .btn-ghost');
      if (cancelBtn) cancelBtn.onclick = () => go(3);
    }

    // core/teacher-submission.js calls this 2s after a successful send —
    // repurposed (instead of closing a modal, since this isn't one) to
    // advance straight to the Done screen.
    global.closeUploadModal = () => go(3);

    function firstTime(id) {
      const completed = (UserProfile.current() && UserProfile.current().completedLessons) || [];
      return !completed.includes(id);
    }

    function renderDone() {
      const wasFirstLesson = firstTime(config.lessonId);
      UserProfile.completeLesson(config.lessonId);
      const completedNow = (UserProfile.current() && UserProfile.current().completedLessons) || [];

      const painting = (global.FOUNDATION_STILL_LIFE_PAINTINGS || []).find(p => p.lessonIds.includes(config.lessonId));
      const paintingNowDone = painting ? painting.lessonIds.every(id => completedNow.includes(id)) : false;
      const stepList = global.FOUNDATION_STILL_LIFE_PATH || [];
      const stepNowDone = stepList.length > 0 && stepList.every(l => completedNow.includes(l.id));

      renderShell(`
        <div class="sll-done-icon">✨</div>
        <div class="sll-title">Lesson Complete</div>
        <div class="sll-line">${escapeHtml(config.paintingTitle)} — ${escapeHtml(config.partLabel)}</div>
        <a class="sll-btn" id="sll-next-lesson" href="${config.nextHref}">Next lesson →</a>
      `);

      if (typeof global.FEICelebrate === 'undefined') return; // visual is non-essential; never block Done
      try {
        const glow = global.FEICelebrate.create({ namespace: 'foundation' });
        const anchor = document.getElementById('sll-next-lesson');
        if (wasFirstLesson) {
          if (stepNowDone) {
            glow.celebrate('step', anchor);
          } else if (paintingNowDone) {
            glow.celebrate('painting', anchor);
          } else {
            glow.celebrate('lesson', anchor);
          }
        }
      } catch (e) { console.warn('[still-life-lesson] celebration failed', e); }
    }

    const RENDERERS = [renderLook, renderWatch, renderDraw, renderDone];
    function go(i) {
      screenIndex = i;
      RENDERERS[i]();
      window.scrollTo(0, 0);
    }

    go(0);
  }

  global.FOUNDATION_STILL_LIFE_PATH = FOUNDATION_STILL_LIFE_PATH;
  global.FOUNDATION_STILL_LIFE_PAINTINGS = FOUNDATION_STILL_LIFE_PAINTINGS;
  global.FOUNDATION_STILL_LIFE_LANDING_HREF = FOUNDATION_STILL_LIFE_LANDING_HREF;
  global.StillLifeLesson = {
    init: init,
    UserProfile: UserProfile,
    escapeHtml: escapeHtml,
    Analytics: Analytics,
    showBubble: showBubble
  };
  // Also exposed as bare globals — core/teacher-submission.js expects
  // UserProfile/Analytics/showBubble/escapeHtml as top-level globals
  // (see that file's own header), not namespaced.
  global.UserProfile = UserProfile;
  global.Analytics = Analytics;
  global.showBubble = showBubble;
  global.escapeHtml = escapeHtml;
})(window);
