/**
 * TutorialHand — a reusable "guiding hand" drag demo for young kids who
 * don't yet know an element is draggable. Shows a hand icon grabbing a
 * clone of the real draggable element and sliding it to its target,
 * once automatically (persisted per-key in localStorage), plus a small
 * icon-only replay button so a kid can re-trigger it any time. No text.
 *
 * Usage:
 *   TutorialHand.init({
 *     key: 'unique-demo-id',            // localStorage "seen" key
 *     demo: {
 *       fromEl: someDraggableElement,   // cloned for the moving token + start position
 *       toEl: someDropTargetElement,    // end position
 *       hand: '👆'                      // optional, defaults to '👆'
 *     },
 *     replayParentEl: someContainer,    // optional, defaults to document.body
 *     autoDelay: 500                    // optional ms before first auto-play
 *   });
 *
 * Call TutorialHand.init() again (after removing any stale .th-replay-btn
 * elements) whenever a single-page app swaps in new draggable elements
 * for a different step, since the auto-play-once state is tracked by key,
 * not by DOM presence.
 */
window.TutorialHand = (function () {
  var STYLE_ID = 'th-default-style';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.th-replay-btn{position:fixed;left:14px;bottom:16px;width:44px;height:44px;' +
      'border-radius:50%;border:none;background:#fff;box-shadow:0 3px 10px rgba(0,0,0,.25);' +
      'font-size:1.25rem;cursor:pointer;z-index:400;-webkit-tap-highlight-color:transparent;}' +
      '.th-replay-btn:active{transform:scale(0.9);}';
    document.head.appendChild(style);
  }

  function storageKey(key) { return 'fei.tutorial_hand.' + key; }
  function hasSeen(key) {
    try { return localStorage.getItem(storageKey(key)) === '1'; } catch (e) { return false; }
  }
  function markSeen(key) {
    try { localStorage.setItem(storageKey(key), '1'); } catch (e) {}
  }

  function cloneToken(el) {
    var r = el.getBoundingClientRect();
    var clone = el.cloneNode(true);
    clone.removeAttribute('id');
    clone.style.position = 'absolute';
    clone.style.left = '0';
    clone.style.top = '0';
    clone.style.margin = '0';
    clone.style.width = r.width + 'px';
    clone.style.height = r.height + 'px';
    clone.style.pointerEvents = 'none';
    return { clone: clone, w: r.width, h: r.height, rect: r };
  }

  // Plays once: pause on the source token, grab-pulse, slide to the
  // target, drop-bounce, fade out. The moving token is a live clone of
  // fromEl so it reads as "here's the real thing being dragged," not a
  // generic cursor.
  function runDemo(demo) {
    var fromEl = demo.fromEl, toEl = demo.toEl;
    if (!fromEl || !toEl) return;
    var fromR = fromEl.getBoundingClientRect();
    var toR = toEl.getBoundingClientRect();
    var picked = cloneToken(fromEl);
    var w = picked.w, h = picked.h;

    var layer = document.createElement('div');
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9990;';

    var tokenWrap = document.createElement('div');
    tokenWrap.style.cssText = 'position:absolute;left:' + fromR.left + 'px;top:' + fromR.top + 'px;' +
      'width:' + w + 'px;height:' + h + 'px;' +
      'transition:left .9s cubic-bezier(.4,0,.2,1), top .9s cubic-bezier(.4,0,.2,1), transform .22s ease;';
    tokenWrap.appendChild(picked.clone);
    layer.appendChild(tokenWrap);

    var hand = document.createElement('div');
    hand.textContent = demo.hand || '👆';
    var handX0 = fromR.left + w * 0.55, handY0 = fromR.top + h * 0.55;
    hand.style.cssText = 'position:absolute;font-size:' + (demo.handSize || 2.1) + 'rem;' +
      'left:' + handX0 + 'px;top:' + handY0 + 'px;' +
      'filter:drop-shadow(0 3px 5px rgba(0,0,0,.35));' +
      'transition:left .9s cubic-bezier(.4,0,.2,1), top .9s cubic-bezier(.4,0,.2,1), transform .22s ease;';
    layer.appendChild(hand);

    document.body.appendChild(layer);

    var toX = toR.left + toR.width / 2 - w / 2;
    var toY = toR.top + toR.height / 2 - h / 2;
    var handX1 = toR.left + toR.width / 2 - w * 0.05;
    var handY1 = toR.top + toR.height / 2 - h * 0.05;

    setTimeout(function () {
      tokenWrap.style.transform = 'scale(0.8)';
      hand.style.transform = 'scale(0.88)';
    }, 250);
    setTimeout(function () {
      tokenWrap.style.left = toX + 'px';
      tokenWrap.style.top = toY + 'px';
      hand.style.left = handX1 + 'px';
      hand.style.top = handY1 + 'px';
    }, 500);
    setTimeout(function () {
      tokenWrap.style.transform = 'scale(1.14)';
      hand.style.transform = 'scale(1.05)';
    }, 1400);
    setTimeout(function () {
      tokenWrap.style.transform = 'scale(1)';
      hand.style.transform = 'scale(1)';
    }, 1620);
    setTimeout(function () {
      layer.style.transition = 'opacity .4s ease';
      layer.style.opacity = '0';
    }, 1900);
    setTimeout(function () {
      layer.remove();
      if (demo.onDone) demo.onDone();
    }, 2350);
  }

  function init(opts) {
    injectStyle();
    var btn = document.createElement('button');
    btn.className = 'th-replay-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Show me how');
    btn.textContent = (opts.demo && opts.demo.hand) || '👆';
    btn.onclick = function () { runDemo(opts.demo); };
    (opts.replayParentEl || document.body).appendChild(btn);

    if (!hasSeen(opts.key)) {
      setTimeout(function () {
        runDemo(opts.demo);
        markSeen(opts.key);
      }, opts.autoDelay != null ? opts.autoDelay : 500);
    }
    return btn;
  }

  return { init: init, runDemo: runDemo, hasSeen: hasSeen, markSeen: markSeen };
})();
