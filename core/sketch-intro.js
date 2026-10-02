/* Picture and approved narration share one video timeline, including fullscreen. */
(function () {
  'use strict';
  function init() {
    const host = document.getElementById('sketch-intro');
    if (!host) return;
    const video = host.querySelector('video');
    const button = host.querySelector('[data-intro-play]');
    const cc = host.querySelector('[data-intro-captions]');
    const label = host.querySelector('[data-intro-scene-label]');
    const status = host.querySelector('[data-intro-status]');
    const scenes = [
      {at:0,label:'A steady hand'}, {at:6.667,label:'Form & structure'},
      {at:12.967,label:'Texture · Light & shadow'},
      {at:19.367,label:'Landscapes · Course-library study'},
      {at:22.4,label:'Portraits · Course-library study'},
      {at:25.8,label:'A pencil. A little curiosity.'}, {at:31.8,label:'Let’s draw. Have fun.'}
    ];
    function sync() {
      const time = video.currentTime;
      label.textContent = [...scenes].reverse().find(s => time >= s.at)?.label || scenes[0].label;
      host.querySelector('[data-analysis="form"]').classList.toggle('active',time >= 8 && time < 12.4);
      host.querySelector('[data-analysis="value"]').classList.toggle('active',time >= 15.2 && time < 19.1);
      const playing = !video.paused && !video.ended;
      host.classList.toggle('is-playing', playing);
      button.textContent = playing ? 'Ⅱ Pause intro' : video.ended ? '↻ Replay intro' : time > 0 ? '▶ Continue intro' : '▶ Play course intro';
      button.setAttribute('aria-label', playing ? 'Pause course introduction' : video.ended ? 'Replay course introduction' : 'Play course introduction');
    }
    button.addEventListener('click', async () => {
      if (!video.paused) { video.pause(); return; }
      if (video.ended) video.currentTime = 0;
      status.textContent = '';
      try { await video.play(); }
      catch (_) { status.textContent = 'Tap the video’s play button to begin, or read the introduction below.'; }
    });
    function syncCaptions() {
      const showing = [...video.textTracks].some(track => track.mode === 'showing');
      cc.setAttribute('aria-pressed',String(showing));
      cc.setAttribute('aria-label',showing ? 'Hide English captions' : 'Show English captions');
    }
    cc.addEventListener('click', () => {
      const show = cc.getAttribute('aria-pressed') !== 'true';
      for (const track of video.textTracks) track.mode = show ? 'showing' : 'disabled';
      syncCaptions();
    });
    video.textTracks.addEventListener('change',syncCaptions);
    ['play','pause','ended','timeupdate','seeked'].forEach(name => video.addEventListener(name,sync));
    video.addEventListener('error', () => { status.textContent = 'The film could not load. Try reloading, or read the introduction below.'; sync(); });
    const screen = document.getElementById('foundation-map-screen');
    new MutationObserver(() => { if (screen.style.display === 'none' || screen.hidden) video.pause(); }).observe(screen,{attributes:true,attributeFilter:['style','hidden']});
    document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
    window.addEventListener('pagehide', () => video.pause());
    sync(); syncCaptions();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
