/* ============================================================
 * FEI TeamArt · Color Magic — voice-over helper
 *
 * ColorVoice.init(stepN, text) — call once per step page, after the
 * FEIAccess gate. Builds a floating 🔊 replay / mute control (fixed,
 * bottom-right, present on every screen), then plays the instruction:
 *
 *   1. Tries a pre-recorded file first, at ../shared/audio/step-N.mp3
 *      (relative to a step-N/index.html page). Drop a real recording
 *      there later and it's auto-preferred over TTS — no code change.
 *   2. Falls back to the browser's SpeechSynthesis API (free, no
 *      files needed) at a gentle rate if no file is found.
 *   3. If autoplay is blocked (common on iPad/Safari until a user
 *      gesture happens), arms a one-time listener on the first
 *      tap/click anywhere on the page and retries then.
 *
 * Mute preference persists in localStorage so a room full of iPads
 * doesn't have to all talk over each other.
 * ============================================================ */
(function (global) {
  'use strict';

  const MUTE_KEY = 'fei.color_magic.voice_muted';

  let audioEl = null;
  let lastStepN = null;
  let lastText = null;
  let gestureArmed = false;

  function isMuted() {
    try { return global.localStorage.getItem(MUTE_KEY) === '1'; } catch (e) { return false; }
  }

  function setMuted(v) {
    try { global.localStorage.setItem(MUTE_KEY, v ? '1' : '0'); } catch (e) {}
    if (v) stopAll();
    updateMuteBtn();
  }

  function stopAll() {
    if (audioEl) { try { audioEl.pause(); } catch (e) {} }
    if (global.speechSynthesis) { try { global.speechSynthesis.cancel(); } catch (e) {} }
  }

  function speakWithTTS(text) {
    if (!('speechSynthesis' in global)) return false;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      u.pitch = 1.05;
      const voices = global.speechSynthesis.getVoices() || [];
      const preferred = voices.find(v => /en/i.test(v.lang) && /Samantha|Female|Google US English/i.test(v.name));
      if (preferred) u.voice = preferred;
      global.speechSynthesis.speak(u);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Probe for a pre-recorded file without ever throwing a console error
  // for the (expected, common) case that it doesn't exist yet.
  function tryAudioFile(stepN) {
    return new Promise((resolve) => {
      const src = '../shared/audio/step-' + stepN + '.mp3';
      const audio = new Audio();
      let settled = false;
      const done = (ok) => { if (settled) return; settled = true; resolve(ok ? audio : null); };
      audio.addEventListener('canplaythrough', () => done(true), { once: true });
      audio.addEventListener('error', () => done(false), { once: true });
      audio.preload = 'auto';
      audio.src = src;
      setTimeout(() => done(false), 1200); // don't block instruction forever on a slow 404
    });
  }

  async function say(stepN, text) {
    stopAll();
    lastStepN = stepN;
    lastText = text;
    if (isMuted()) return;

    const file = await tryAudioFile(stepN);
    let played = false;
    if (file) {
      audioEl = file;
      try { await file.play(); played = true; } catch (e) { played = false; }
    }
    if (!played) played = speakWithTTS(text);

    if (!played) {
      armGesture();
    } else {
      // Some browsers report "played" without actually producing sound
      // until a gesture happens — a light safety net, not load-bearing.
      setTimeout(() => {
        const stillQuiet = (!audioEl || audioEl.paused) && !(global.speechSynthesis && global.speechSynthesis.speaking);
        if (stillQuiet) armGesture();
      }, 400);
    }
  }

  function armGesture() {
    if (gestureArmed) return;
    gestureArmed = true;
    const retry = () => {
      document.removeEventListener('pointerdown', retry);
      gestureArmed = false;
      if (lastStepN != null) say(lastStepN, lastText);
    };
    document.addEventListener('pointerdown', retry, { once: true });
  }

  function replay() {
    if (lastStepN != null) say(lastStepN, lastText);
  }

  function updateMuteBtn() {
    const btn = document.getElementById('color-voice-mute');
    if (btn) btn.textContent = isMuted() ? '🔇' : '🔈';
  }

  function buildUI() {
    if (document.getElementById('color-voice-controls')) return;
    const wrap = document.createElement('div');
    wrap.id = 'color-voice-controls';
    wrap.innerHTML =
      '<button id="color-voice-btn" type="button" aria-label="Hear the instructions again">🔊</button>' +
      '<button id="color-voice-mute" type="button" aria-label="Mute voice">🔈</button>';
    document.body.appendChild(wrap);
    document.getElementById('color-voice-btn').addEventListener('click', replay);
    document.getElementById('color-voice-mute').addEventListener('click', () => setMuted(!isMuted()));
    updateMuteBtn();
  }

  function init(stepN, text) {
    buildUI();
    say(stepN, text);
  }

  global.ColorVoice = { init: init, say: say, replay: replay, isMuted: isMuted, setMuted: setMuted };
})(window);
