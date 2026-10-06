// File-backed AI voice guidance; first playback is an explicit learner action.
const StepVoice = (() => {
  const audio = document.getElementById('step-audio');
  const listen = document.getElementById('voice-listen');
  const toggle = document.getElementById('voice-toggle');
  const status = document.getElementById('voice-status');
  const transcript = document.getElementById('voice-transcript');
  let enabled = false, current = null, revision = 0;
  function controls() {
    toggle.textContent = enabled ? 'Voice on' : 'Voice off';
    toggle.setAttribute('aria-pressed', String(enabled));
    listen.textContent = audio.paused ? '▶ Listen' : 'Ⅱ Pause';
  }
  function stop() { revision++; audio.pause(); audio.currentTime = 0; VoiceMotion.reset(); controls(); }
  async function play() {
    if (!current || document.hidden) return;
    const token = revision;
    document.getElementById('reference-video').pause();
    audio.currentTime = 0;
    try {
      await audio.play();
      if (token !== revision) return;
      status.textContent = 'Listening…'; controls();
    } catch (error) {
      if (token !== revision) return;
      status.textContent = error.name === 'NotAllowedError' ? 'Tap Listen to hear this step.' : 'Audio unavailable. Open the voice text below.';
      controls();
    }
  }
  function setStep(index) {
    stop(); current = STEP_NARRATION[index];
    transcript.textContent = current?.text || '';
    document.getElementById('voice-text').open = false;
    status.textContent = '';
    if (!current) { listen.disabled = true; return; }
    listen.disabled = false; VoiceMotion.setSource(current.src); audio.src = current.src;
    if (enabled) play();
  }
  listen.addEventListener('click', () => {
    if (!audio.paused) { audio.pause(); status.textContent = 'Paused'; controls(); return; }
    enabled = true; controls(); play();
  });
  toggle.addEventListener('click', () => {
    enabled = !enabled;
    if (enabled) play(); else { stop(); status.textContent = ''; }
    controls();
  });
  audio.addEventListener('ended', () => { status.textContent = ''; controls(); });
  audio.addEventListener('pause', controls);
  document.getElementById('reference-video').addEventListener('play', () => { stop(); status.textContent = ''; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { stop(); status.textContent = ''; } });
  window.addEventListener('pagehide', stop);
  controls(); return { setStep, stop };
})();
