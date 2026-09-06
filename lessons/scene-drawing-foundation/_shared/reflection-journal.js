/* ============================================================
 * Scene Drawing Foundation — shared component: ReflectionJournal
 *
 * Stage 13's closing reflection: pick one of the student's own
 * submitted drawings, complete a sentence via preset phrase choices
 * (no free-text typing by default, per the build prompt — except the
 * optional "something else" chip described below), save it, play a
 * short celebratory animation.
 *
 * SCHEMA — does not invent one. This writes through the REAL
 * `JournalStorage` global defined in
 * core/scene-drawing-platform-bridge.js (load that script before this
 * one), using the exact entry shape verified against real call sites:
 *   - core/scene-drawing-app.js:555 (completeSceneDrawingLesson) —
 *     the existing Scene Drawing course's own reflection-save, same
 *     course family as this lesson.
 *   - lessons/lfc019-learn-from-masters-rousseau/index.html:2911+
 *     and 6+ other Foundation A / LFC lesson files — same shape.
 * All of them write { courseId, lessonId, momentKey, ageGroup,
 * promptText, studentText, inputType } to 'fei_thinking_journal' via
 * localStorage (NOT sessionStorage — that migration only ever touched
 * fei_user_profile; fei_thinking_journal is localStorage in every
 * real usage found, including the most recently touched one, so that
 * existing shape wins over this build prompt's own blanket
 * sessionStorage rule for this one specific key. Flagged in the
 * commit message, not silently picked either way.)
 *
 * This component itself never touches localStorage directly — it
 * only calls JournalStorage.save(), so if that shape ever
 * changes there's exactly one place to update.
 *
 * UPSTREAM EXTENSION (Lesson 02 build) — two additions, both
 * backward-compatible with every existing caller (Lesson 01 passes
 * neither, so it behaves exactly as before):
 *
 *   1. `sentenceTemplate` — Lesson 01 hardcoded the sentence as
 *      "I chose the {view} view because {reason}.". Lesson 02's real
 *      spec explicitly corrects this: that phrasing stops making
 *      sense once "view" means "which of my 3 drawings", since all 3
 *      practice drawings in a lesson are the SAME shot type — you're
 *      not choosing between views, you're choosing between drawings.
 *      The fix is a configurable template string containing the
 *      literal placeholders "{a}" and "{b}" (first blank / second
 *      blank), defaulting to the original Lesson 01 wording so no
 *      existing caller needs to change:
 *        sentenceTemplate: 'I chose my {a} drawing because I wanted to show {b}.'
 *
 *   2. `reasonOptions` entries may now be either a plain string
 *      (existing behavior, unchanged) or an object
 *      `{ label, freeText: true }`. Picking a freeText chip reveals a
 *      short inline text input instead of locking in the chip's own
 *      label — for a "something else" fallback option. `viewOptions`
 *      is unchanged (plain strings only; no lesson has asked for
 *      free-text there).
 *
 * USAGE
 *   ReflectionJournal.mount('containerId', {
 *     courseId: 'extreme-wide-shot',   // Scene Drawing convention:
 *     lessonId: 'extreme-wide-shot',   // courseId === lessonId
 *     momentKey: 'reflection',         // optional, defaults shown
 *     ageGroup: 'unspecified',         // optional, defaults shown
 *     artworks: [{ id, url, label }],  // the student's own submitted
 *                                      // drawings — caller resolves
 *                                      // these from its own IndexedDB
 *                                      // (this component is storage-
 *                                      // agnostic about where they
 *                                      // came from)
 *     sentenceTemplate: 'I chose the {a} view because {b}.',  // optional
 *     viewOptions: ['Extreme Wide Shot', 'Close-Up'],
 *     reasonOptions: [
 *       'it shows the whole world',
 *       'it feels dramatic',
 *       { label: 'something else', freeText: true }
 *     ]
 *   }, {
 *     onSaved(entry) { ... }   // fires after the journal entry saves
 *   });
 * ============================================================ */
(function (global) {
  'use strict';

  const STYLE_ID = 'reflection-journal-styles';
  function injectStylesOnce() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .rj-section-label{font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:rgba(28,26,34,.55);margin:18px 0 8px;text-align:center;}
      .rj-section-label:first-child{margin-top:0;}
      .rj-artwork-grid{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;}
      .rj-artwork-thumb{
        width:78px;height:78px;border-radius:12px;overflow:hidden;cursor:pointer;
        border:3px solid transparent;transition:border-color .2s ease,transform .2s ease;
        -webkit-tap-highlight-color:transparent;
      }
      .rj-artwork-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
      .rj-artwork-thumb.rj-picked{border-color:#2d5fa8;transform:scale(1.05);}
      .rj-empty-note{text-align:center;font-size:12.5px;color:rgba(28,26,34,.45);}
      .rj-sentence{
        text-align:center;font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:600;
        color:#1c1a22;background:#fff;border:1.5px solid rgba(28,26,34,.12);border-radius:14px;
        padding:14px 16px;margin-bottom:6px;line-height:1.6;
      }
      .rj-sentence .rj-blank{color:rgba(28,26,34,.3);}
      .rj-sentence .rj-filled{color:#2d5fa8;font-weight:700;}
      .rj-chip-row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:4px;}
      .rj-chip{
        background:#fff;border:2px solid rgba(28,26,34,.14);border-radius:999px;
        padding:8px 14px;font-size:12.5px;font-weight:700;color:rgba(28,26,34,.7);
        cursor:pointer;-webkit-tap-highlight-color:transparent;transition:border-color .15s ease,background .15s ease,color .15s ease;
      }
      .rj-chip.rj-picked{background:#2d5fa8;border-color:#2d5fa8;color:#fff;}
      .rj-freetext-wrap{display:none;justify-content:center;margin:2px 0 4px;}
      .rj-freetext-wrap.rj-show{display:flex;}
      .rj-freetext-input{
        width:100%;max-width:280px;padding:8px 12px;border-radius:999px;
        border:2px solid #2d5fa8;font-family:'Space Grotesk',sans-serif;font-size:12.5px;
        font-weight:600;color:#1c1a22;outline:none;
      }
      .rj-save-btn{
        display:block;width:100%;margin-top:20px;padding:13px;border:none;border-radius:999px;
        background:#2d5fa8;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;
        cursor:pointer;transition:opacity .15s ease,transform .15s ease;
      }
      .rj-save-btn:disabled{opacity:.35;pointer-events:none;}
      .rj-save-btn:active{transform:scale(.98);}
      .rj-celebrate{
        text-align:center;margin-top:16px;font-family:'Space Grotesk',sans-serif;font-weight:700;
        font-size:16px;color:#2d5fa8;opacity:0;transform:scale(.8);
        transition:opacity .3s ease,transform .3s cubic-bezier(.3,1.6,.4,1);
      }
      .rj-celebrate.rj-show{opacity:1;transform:scale(1);}
    `;
    document.head.appendChild(style);
  }

  // Splits a template string on its first "{a}" and next "{b}" into
  // the three literal spans around them. Assumes both placeholders
  // are present exactly once, in that order — true of every template
  // any lesson has needed so far.
  function splitTemplate(tpl) {
    const iA = tpl.indexOf('{a}');
    const iB = tpl.indexOf('{b}', iA + 3);
    return {
      before: tpl.slice(0, iA),
      between: tpl.slice(iA + 3, iB),
      after: tpl.slice(iB + 3)
    };
  }

  function mount(containerId, config, callbacks) {
    injectStylesOnce();
    config = config || {};
    callbacks = callbacks || {};
    const container = document.getElementById(containerId);
    if (!container) { console.warn('[ReflectionJournal] container not found:', containerId); return; }

    const artworks = Array.isArray(config.artworks) ? config.artworks : [];
    const viewOptions = Array.isArray(config.viewOptions) ? config.viewOptions : [];
    const reasonOptions = (Array.isArray(config.reasonOptions) ? config.reasonOptions : []).map(opt =>
      typeof opt === 'string' ? { label: opt, freeText: false } : { label: opt.label, freeText: !!opt.freeText }
    );
    const template = splitTemplate(config.sentenceTemplate || 'I chose the {a} view because {b}.');
    const momentKey = config.momentKey || 'reflection';
    const ageGroup = config.ageGroup || 'unspecified';

    let pickedArtworkId = null;
    let pickedView = null;
    let pickedReason = null;
    let pickedReasonIsFreeText = false;
    let saved = false;

    const artworkGrid = artworks.length
      ? artworks.map(a => `
          <div class="rj-artwork-thumb" data-id="${a.id}"><img src="${a.url}" alt="${a.label || 'your drawing'}"></div>
        `).join('')
      : '';

    container.innerHTML = `
      <div class="rj-section-label">Pick one of your drawings</div>
      ${artworks.length
        ? `<div class="rj-artwork-grid">${artworkGrid}</div>`
        : `<div class="rj-empty-note">No submitted drawings found yet.</div>`}

      <div class="rj-section-label">Complete the sentence</div>
      <div class="rj-sentence" id="${containerId}-sentence">
        ${template.before}<span class="rj-blank" id="${containerId}-view-slot">___</span>${template.between}<span class="rj-blank" id="${containerId}-reason-slot">___</span>${template.after}
      </div>
      <div class="rj-chip-row" id="${containerId}-view-chips"></div>
      <div class="rj-chip-row" id="${containerId}-reason-chips"></div>
      <div class="rj-freetext-wrap" id="${containerId}-freetext-wrap">
        <input type="text" class="rj-freetext-input" id="${containerId}-freetext-input" maxlength="60" placeholder="Type your own short answer...">
      </div>

      <button class="rj-save-btn" id="${containerId}-save-btn" disabled>💾 Save to My Journey</button>
      <div class="rj-celebrate" id="${containerId}-celebrate">✨ Saved! Nice reflection.</div>
    `;

    const viewSlot = document.getElementById(containerId + '-view-slot');
    const reasonSlot = document.getElementById(containerId + '-reason-slot');
    const saveBtn = document.getElementById(containerId + '-save-btn');
    const celebrateEl = document.getElementById(containerId + '-celebrate');
    const freetextWrap = document.getElementById(containerId + '-freetext-wrap');
    const freetextInput = document.getElementById(containerId + '-freetext-input');

    function renderChips(rowId, options, onPick, currentValue) {
      const row = document.getElementById(rowId);
      row.innerHTML = options.map(opt => `
        <span class="rj-chip${opt === currentValue ? ' rj-picked' : ''}" data-value="${opt}">${opt}</span>
      `).join('');
      row.querySelectorAll('.rj-chip').forEach(chip => {
        chip.addEventListener('click', () => onPick(chip.dataset.value));
      });
    }

    function renderReasonChips() {
      const row = document.getElementById(containerId + '-reason-chips');
      row.innerHTML = reasonOptions.map((opt, i) => `
        <span class="rj-chip${i === pickedReasonIndex ? ' rj-picked' : ''}" data-index="${i}">${opt.label}</span>
      `).join('');
      row.querySelectorAll('.rj-chip').forEach(chip => {
        chip.addEventListener('click', () => pickReason(Number(chip.dataset.index)));
      });
    }

    function updateSaveEnabled() {
      saveBtn.disabled = !(pickedArtworkId && pickedView && pickedReason) || saved;
    }

    function pickArtwork(id) {
      pickedArtworkId = id;
      container.querySelectorAll('.rj-artwork-thumb').forEach(el => {
        el.classList.toggle('rj-picked', el.dataset.id === id);
      });
      updateSaveEnabled();
    }
    function pickView(value) {
      pickedView = value;
      viewSlot.textContent = value;
      viewSlot.className = 'rj-filled';
      renderChips(containerId + '-view-chips', viewOptions, pickView, pickedView);
      updateSaveEnabled();
    }

    let pickedReasonIndex = -1;
    function pickReason(index) {
      pickedReasonIndex = index;
      const opt = reasonOptions[index];
      renderReasonChips();
      if (opt.freeText) {
        pickedReasonIsFreeText = true;
        freetextWrap.classList.add('rj-show');
        // Free text starts empty — nothing to fill the sentence with
        // yet, and Save stays disabled until the student types
        // something (see the input handler below).
        pickedReason = freetextInput.value.trim() || null;
        reasonSlot.textContent = pickedReason || '___';
        reasonSlot.className = pickedReason ? 'rj-filled' : 'rj-blank';
        freetextInput.focus();
      } else {
        pickedReasonIsFreeText = false;
        freetextWrap.classList.remove('rj-show');
        pickedReason = opt.label;
        reasonSlot.textContent = pickedReason;
        reasonSlot.className = 'rj-filled';
      }
      updateSaveEnabled();
    }

    freetextInput.addEventListener('input', () => {
      if (!pickedReasonIsFreeText) return;
      const text = freetextInput.value.trim();
      pickedReason = text || null;
      reasonSlot.textContent = text || '___';
      reasonSlot.className = text ? 'rj-filled' : 'rj-blank';
      updateSaveEnabled();
    });

    container.querySelectorAll('.rj-artwork-thumb').forEach(el => {
      el.addEventListener('click', () => pickArtwork(el.dataset.id));
    });
    renderChips(containerId + '-view-chips', viewOptions, pickView, pickedView);
    renderReasonChips();
    updateSaveEnabled();

    saveBtn.addEventListener('click', () => {
      if (saveBtn.disabled) return;
      // Bare identifier, not window.JournalStorage — the bridge file
      // declares it as a top-level `const`, which (as a classic
      // <script>, not a module) never becomes a window property, only
      // a shared-scope binding. Caught via a live test where
      // window.JournalStorage read back undefined despite the bridge
      // script being loaded; core/scene-drawing-app.js already
      // references it the same bare way, confirming this is the
      // established pattern, not a one-off workaround.
      if (typeof JournalStorage === 'undefined') {
        console.warn('[ReflectionJournal] JournalStorage is not loaded — did the lesson page include core/scene-drawing-platform-bridge.js before this file? Entry not saved.');
        return;
      }
      const studentText = template.before + pickedView + template.between + pickedReason + template.after;
      const promptText = template.before + '___' + template.between + '___' + template.after;
      const entry = JournalStorage.save({
        courseId: config.courseId,
        lessonId: config.lessonId,
        momentKey: momentKey,
        ageGroup: ageGroup,
        promptText: promptText,
        studentText: studentText,
        inputType: 'selection'
      });
      saved = true;
      updateSaveEnabled();
      saveBtn.textContent = '✓ Saved';
      requestAnimationFrame(() => celebrateEl.classList.add('rj-show'));
      if (typeof callbacks.onSaved === 'function') callbacks.onSaved(entry);
    });
  }

  global.ReflectionJournal = { mount: mount };
})(window);
