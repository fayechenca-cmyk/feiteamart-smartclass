window.mountColorIntro = function(root) {
  const audio=root.querySelector('[data-color-audio]'),story=root.querySelector('#story');
  const slides=[...story.querySelectorAll('.story-slide')],play=root.querySelector('[data-color-play]'),caption=root.querySelector('.color-intro-caption'),status=root.querySelector('[data-color-status]');
  const starts=[0,6.797,14.476,21.047,28.309,34.928,43.583,51.511];
  let cues=[],active=-1,frame;
  story.classList.add('narrated','paused');
  fetch('../assets/color-intro/captions.json').then(r=>r.json()).then(data=>{cues=data;update()}).catch(()=>{});
  function update(){
    const index=starts.reduce((n,t,i)=>audio.currentTime>=t?i:n,0);
    if(index!==active){active=index;slides.forEach((s,i)=>{s.classList.toggle('story-active',i===index);s.setAttribute('aria-hidden',String(i!==index));s.inert=i!==index;});}
    story.style.setProperty('--played',`${Number.isFinite(audio.duration)?100*audio.currentTime/audio.duration:0}%`);
    caption.textContent=(cues.find(c=>audio.currentTime>=c.start&&audio.currentTime<c.end)||{}).text||'';
  }
  function tick(){update();if(!audio.paused)frame=requestAnimationFrame(tick)}
  function pause(){audio.pause();cancelAnimationFrame(frame);story.classList.add('paused');play.textContent=audio.ended?'↻ Replay introduction':'▶ Play with sound';}
  async function toggle(){if(!audio.paused)return pause();if(audio.ended)audio.currentTime=0;try{await audio.play();story.classList.remove('paused');play.textContent='Ⅱ Pause';status.textContent='';tick()}catch{status.textContent='Audio could not load. You can still prepare your studio.'}}
  play.onclick=toggle;story.querySelector('[data-story-play]').onclick=toggle;
  root.querySelector('[data-color-cc]').onclick=e=>{caption.hidden=!caption.hidden;e.currentTarget.setAttribute('aria-pressed',String(!caption.hidden))};
  story.querySelector('[data-story-skip]').onclick=()=>{pause();audio.currentTime=starts.at(-1);update();root.querySelector('[data-next]').focus()};
  audio.addEventListener('timeupdate',update);audio.addEventListener('ended',()=>{pause();status.textContent='Ready to build your palette.'});
  const hidden=()=>{if(document.hidden)pause()};document.addEventListener('visibilitychange',hidden);window.addEventListener('pagehide',pause);
  const observer=new MutationObserver(()=>{if(!audio.isConnected){pause();observer.disconnect();document.removeEventListener('visibilitychange',hidden);window.removeEventListener('pagehide',pause)}});observer.observe(root,{childList:true});
  update();
};
