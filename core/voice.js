/* ============================================================
 * FEI TeamArt · Shared voice-over helper
 *
 * Generalized from lessons/color-magic/shared/color-voice.js so any
 * course can get the same narration behavior without copy-pasting the
 * module. Each course creates its own scoped instance:
 *
 *   const Voice = FEIVoice.create({
 *     namespace: 'dancing_ballerina',        // used for the mute localStorage key
 *     audioPath: (stepId) => 'audio/stage-' + stepId + '.mp3'  // optional
 *   });
 *   Voice.init(1, "Let's draw a ballerina and make her move!");
 *
 * Behavior per instance:
 *   1. If audioPath(stepId) returns a URL, tries that pre-recorded file
 *      first. Drop a real recording there later and it's auto-preferred
 *      over TTS — no code change needed on the course's side.
 *   2. Falls back to the browser's SpeechSynthesis API (free, no files
 *      needed) at a gentle rate if no file is found.
 *   3. If autoplay is blocked (common on iPad/Safari until a user
 *      gesture happens), arms a one-time listener on the first
 *      tap/click anywhere on the page and retries then.
 *
 * Mute preference persists in localStorage, scoped per-namespace so a
 * student muting one course doesn't mute a different one.
 * ============================================================ */
(function (global) {
  'use strict';

  function create(config) {
    config = config || {};
    const namespace = config.namespace || 'default';
    const audioPathFn = typeof config.audioPath === 'function' ? config.audioPath : function () { return null; };
    const MUTE_KEY = 'fei.' + namespace + '.voice_muted';
    const CTRL_ID = 'fv-' + namespace + '-controls';
    const BTN_ID = 'fv-' + namespace + '-btn';
    const MUTE_BTN_ID = 'fv-' + namespace + '-mute';

    let audioEl = null;
    let lastStepId = null;
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
    function tryAudioFile(stepId) {
      return new Promise((resolve) => {
        const src = audioPathFn(stepId);
        if (!src) { resolve(null); return; }
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

    async function say(stepId, text) {
      stopAll();
      lastStepId = stepId;
      lastText = text;
      if (isMuted()) return;

      const file = await tryAudioFile(stepId);
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
        if (lastStepId != null) say(lastStepId, lastText);
      };
      document.addEventListener('pointerdown', retry, { once: true });
    }

    function replay() {
      if (lastStepId != null) say(lastStepId, lastText);
    }

    function updateMuteBtn() {
      const btn = document.getElementById(MUTE_BTN_ID);
      if (btn) btn.textContent = isMuted() ? '🔇' : '🔈';
    }

    function buildUI() {
      if (document.getElementById(CTRL_ID)) return;
      const wrap = document.createElement('div');
      wrap.id = CTRL_ID;
      wrap.className = 'fv-controls';
      wrap.innerHTML =
        '<button id="' + BTN_ID + '" type="button" class="fv-btn" aria-label="Hear the instructions again">🔊</button>' +
        '<button id="' + MUTE_BTN_ID + '" type="button" class="fv-btn fv-mute" aria-label="Mute voice">🔈</button>';
      document.body.appendChild(wrap);
      document.getElementById(BTN_ID).addEventListener('click', replay);
      document.getElementById(MUTE_BTN_ID).addEventListener('click', () => setMuted(!isMuted()));
      updateMuteBtn();
    }

    function init(stepId, text) {
      buildUI();
      say(stepId, text);
    }

    return { init: init, say: say, replay: replay, isMuted: isMuted, setMuted: setMuted };
  }

  global.FEIVoice = { create: create };
})(window);
