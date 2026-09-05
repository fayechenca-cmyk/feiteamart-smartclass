/* ============================================================
 * Scene Drawing Foundation — shared component: ABChoiceCard
 *
 * A reusable two-option choice card (image + label per option). Used
 * by Lesson 01's Stage 5 (story_a) and Stage 6 (story_b) with
 * different content — every piece of copy/imagery/feedback is passed
 * in via config, nothing here is lesson-specific.
 *
 * USAGE
 *   ABChoiceCard.render('containerId', {
 *     optionA: { image: 'a.jpg', label: 'Option A', feedback: 'Nice pick!' },
 *     optionB: { image: 'b.jpg', label: 'Option B', feedback: 'Good eye!' },
 *     feedbackDelayMs: 800   // optional, defaults to 800
 *   }, function onComplete(pickedKey) {
 *     // pickedKey is 'A' or 'B' — advance the lesson here
 *   });
 *
 * BEHAVIOR
 *   - Tap a card: it scales to 1.05 and gets a highlighted border; the
 *     other card drops to opacity .5. Further taps are ignored until
 *     this instance is reset.
 *   - A short feedback line (the picked option's own `feedback` text)
 *     fades in below the cards.
 *   - After feedbackDelayMs, onComplete(pickedKey) fires — the caller
 *     decides what "advance" means (this component doesn't touch
 *     stage navigation itself).
 *
 * Call ABChoiceCard.render() again on the same container to reset it
 * (e.g. if a student navigates back to this stage).
 * ============================================================ */
(function (global) {
  'use strict';

  const STYLE_ID = 'ab-choice-card-styles';
  function injectStylesOnce() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .abc-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
      .abc-card{
        flex:1 1 0;min-width:130px;max-width:220px;background:#fff;
        border:2.5px solid rgba(28,26,34,.14);border-radius:16px;
        padding:12px;cursor:pointer;text-align:center;overflow:hidden;
        transition:transform .25s ease,border-color .25s ease,opacity .25s ease,box-shadow .25s ease;
        -webkit-tap-highlight-color:transparent;
      }
      .abc-card:active{transform:scale(.97);}
      .abc-card img{display:block;width:100%;height:auto;border-radius:10px;margin-bottom:8px;}
      .abc-card .abc-label{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13.5px;color:#1c1a22;}
      .abc-card.abc-selected{
        transform:scale(1.05);border-color:#2d5fa8;
        box-shadow:0 10px 24px rgba(45,95,168,.22);
      }
      .abc-card.abc-dimmed{opacity:.5;pointer-events:none;}
      .abc-card.abc-disabled{pointer-events:none;}
      .abc-feedback{
        text-align:center;font-family:'Space Grotesk',sans-serif;font-weight:600;
        font-size:14px;color:#2d5fa8;margin-top:16px;min-height:20px;
        opacity:0;transform:translateY(6px);transition:opacity .3s ease,transform .3s ease;
      }
      .abc-feedback.abc-show{opacity:1;transform:translateY(0);}
    `;
    document.head.appendChild(style);
  }

  function render(containerId, config, onComplete) {
    injectStylesOnce();
    const container = document.getElementById(containerId);
    if (!container) { console.warn('[ABChoiceCard] container not found:', containerId); return; }

    const delay = typeof config.feedbackDelayMs === 'number' ? config.feedbackDelayMs : 800;
    let settled = false;

    container.innerHTML = `
      <div class="abc-row">
        <div class="abc-card" data-key="A">
          <img src="${config.optionA.image}" alt="${config.optionA.label}">
          <div class="abc-label">${config.optionA.label}</div>
        </div>
        <div class="abc-card" data-key="B">
          <img src="${config.optionB.image}" alt="${config.optionB.label}">
          <div class="abc-label">${config.optionB.label}</div>
        </div>
      </div>
      <div class="abc-feedback" id="${containerId}-feedback"></div>
    `;

    const cardA = container.querySelector('.abc-card[data-key="A"]');
    const cardB = container.querySelector('.abc-card[data-key="B"]');
    const feedbackEl = document.getElementById(containerId + '-feedback');

    function pick(key) {
      if (settled) return;
      settled = true;
      const picked = key === 'A' ? cardA : cardB;
      const other = key === 'A' ? cardB : cardA;
      picked.classList.add('abc-selected');
      other.classList.add('abc-dimmed');
      cardA.classList.add('abc-disabled');
      cardB.classList.add('abc-disabled');

      const feedbackText = (key === 'A' ? config.optionA.feedback : config.optionB.feedback) || '';
      feedbackEl.textContent = feedbackText;
      requestAnimationFrame(() => feedbackEl.classList.add('abc-show'));

      setTimeout(() => {
        if (typeof onComplete === 'function') onComplete(key);
      }, delay);
    }

    cardA.addEventListener('click', () => pick('A'));
    cardB.addEventListener('click', () => pick('B'));
  }

  global.ABChoiceCard = { render: render };
})(window);
