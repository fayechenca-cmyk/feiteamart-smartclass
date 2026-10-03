/* Real course screenshots, synchronized to one audio clock. No lesson state is changed. */
(() => {
  const dialog = document.getElementById('creation-tour');
  if (!dialog) return;
  const $ = id => document.getElementById(id);
  const audio = $('tour-audio'), play = $('tour-play'), picture = $('tour-image');
  const storageKey = 'fei.creation-tour.v1';
  const scenes = [
    [0,'map','Your Creation playground!','Every idea belongs here.','Your ideas belong here!',null,'WELCOME'],
    [9.9,'map','Pick a creative corner','Tap a spot in the studio.','Try Material!', [71,64], '1 · EXPLORE'],
    [17.05,'material','Choose a project','Tap a colorful course to begin.','Dream Art Studio', [73,35], '2 · CHOOSE'],
    [20.64,'handcraft','Make it with your hands!','Cut, build, and make it yours.','A tiny room. Your big ideas.',null,'PAPER + IMAGINATION'],
    [24.86,'map','Play with color','Visit the Color easel.','Tap Color', [20,55], 'TRY SOMETHING NEW'],
    [28.3,'mix','Mix. Discover. Wow!','Drag one color onto another.','What will you discover?', [34,39], 'PLAY WITH COLORS'],
    [32.13,'color','Start with step one','Then follow the little steps.','Start here!', [37,32], '3 · MAKE IT YOUR WAY'],
    [40.36,'material','More adventures are growing','Coming soon means: not ready yet.','Coming soon', [35,69], 'A LITTLE CLUE'],
    [45.24,'map','Ready, set… create!','Pick a corner. Follow your curiosity.','Let’s explore!',null,'YOUR TURN']
  ];
  let current = -1, captions = [], frame, previousFocus;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelector('.tour-dots').innerHTML = scenes.map(()=>'<i></i>').join('');
  const dots = [...document.querySelectorAll('.tour-dots i')];
  scenes.forEach(s => { const img = new Image(); img.src = '../assets/creation-intro/'+s[1]+'.jpg'; });
  fetch('../assets/creation-intro/captions.json').then(r=>r.json()).then(data=>{captions=data;update()}).catch(()=>{});
  function update() {
    const time = audio.currentTime;
    const index = scenes.reduce((n,s,i)=>time>=s[0]?i:n,0), s = scenes[index];
    if (index !== current) {
      current=index; picture.src='../assets/creation-intro/'+s[1]+'.jpg'; picture.alt=s[2]+'. '+s[3];
      $('tour-title').textContent=s[2];$('tour-hint').textContent=s[3];$('tour-label').textContent=s[4];$('tour-kicker').textContent=s[6];
      dots.forEach((dot,i)=>dot.classList.toggle('active',i===index));
      picture.parentElement.classList.remove('changed');void picture.offsetWidth;picture.parentElement.classList.add('changed');
    }
    // Position over the contained image, including letterboxing on narrow phones.
    const pointer=$('tour-pointer'), box=picture.getBoundingClientRect();
    const ratio=picture.naturalWidth/picture.naturalHeight || 1.6;
    const width=Math.min(box.width,box.height*ratio), height=width/ratio;
    pointer.hidden=!s[5];
    if(s[5]) {
      let x=s[5][0], y=s[5][1];
      if(index===5&&!reduced)x+=Math.min(1,Math.max(0,(time-s[0]) / 2))*30;
      pointer.style.left=((box.width-width)/2+width*x/100)+'px';
      pointer.style.top=((box.height-height)/2+height*y/100)+'px';
    }
    if(index===5){const next='../assets/creation-intro/'+(time>30.3?'mixed':'mix')+'.jpg';if(!picture.src.endsWith(next.slice(3)))picture.src=next;}
    $('tour-caption').textContent=(captions.find(c=>time>=c.start&&time<c.end)||{}).text || '';
  }
  function tick(){update();if(!audio.paused)frame=requestAnimationFrame(tick)}
  function pause(){audio.pause();cancelAnimationFrame(frame);play.textContent=audio.ended?'↻ Replay tour':'▶ Play tour';dialog.classList.add('paused')}
  function close(){pause();dialog.close();previousFocus?.focus()}
  function open(){previousFocus=document.activeElement;audio.currentTime=0;current=-1;dialog.showModal();dialog.classList.add('paused');update();play.textContent='▶ Watch the tour';play.focus()}
  window.openCreationTour=open;
  $('tour-replay').addEventListener('click',open);
  $('tour-close').addEventListener('click',close);
  $('tour-explore').addEventListener('click',()=>{try{sessionStorage.setItem(storageKey+'.dismissed','1')}catch{}close()});
  dialog.addEventListener('cancel',pause);dialog.addEventListener('close',pause);
  play.addEventListener('click',async()=>{if(!audio.paused)return pause();if(audio.ended)audio.currentTime=0;try{await audio.play();play.textContent='Ⅱ Pause';dialog.classList.remove('paused');tick()}catch{$('tour-hint').textContent='Sound could not load. You can still explore the studio.'}});
  audio.addEventListener('ended',()=>{pause();try{localStorage.setItem(storageKey,'watched')}catch{}$('tour-explore').focus()});
  audio.addEventListener('timeupdate',update);picture.addEventListener('load',update);window.addEventListener('resize',update);
  $('tour-cc').addEventListener('click',()=>{const on=dialog.classList.toggle('captions');$('tour-cc').setAttribute('aria-pressed',String(on))});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});window.addEventListener('pagehide',pause);
  let show=true;try{show=localStorage.getItem(storageKey)!=='watched'&&!sessionStorage.getItem(storageKey+'.dismissed')}catch{}
  if(show)open();
})();
