/* Guided lesson with account progress, optional practice and in-lesson submission. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const root = '../../../';
const KEY = 'fei.cube.guided-preview.v2';
let flow=[], index=0, unlocked=0, completed=new Set(), skipped=new Set(), player=null, uid=null, phase='idle', muted=false, epoch=0, photoURL=null;
let voiceDone=null, captions=[], lastCaption='', watchdog=null;
const voice=$('voice');
let soundContext=null;
function chime(){try{soundContext ||= new (window.AudioContext||window.webkitAudioContext)();soundContext.resume();[523.25,659.25,783.99].forEach((hz,i)=>{const o=soundContext.createOscillator(),g=soundContext.createGain(),t=soundContext.currentTime+i*.07;o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g).connect(soundContext.destination);o.start(t);o.stop(t+.28);});}catch{}}
function save(){GuidedPlatform.save({index,unlocked,completed:[...completed],skipped:[...skipped]},KEY);}
function mark(){if(!completed.has(index)&&!muted)chime();completed.add(index);unlocked=Math.max(unlocked,Math.min(flow.length-1,index+1));save();progress();}
function jumpToStep(target){
 if(!Number.isInteger(target)||target<0||target>=flow.length)return;
 index=target;unlocked=Math.max(unlocked,target);enter();
}
function progress(){
 // Stages (Oct 2026): scoped to the current stage's own steps only --
 // see core/guided-ux.js's own header comment for the grouping rule.
 window.GuidedUX?.stageProgress(flow,index,completed,skipped,jumpToStep);
}
function stopVoice(){voice.pause();voice.onended=null;voice.onerror=null;voiceDone=null;$('caption').textContent='';captions=[];}
function speak(step,done){
 stopVoice(); voiceDone=done||null;
 window.GuidedUX?.narrate(step);if(!step.audio){done?.();return;}
 captions=(step.say.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[step.say]).map(t=>t.trim());
 $('caption').textContent=captions[0]||'';lastCaption='';voice.src=step.audio+(step.audio.includes('?')?'&':'?')+'v=ux-2';voice.muted=muted;
 const token=epoch;
 voice.onended=()=>{if(token!==epoch)return;const cb=voiceDone;voiceDone=null;cb?.();};
 voice.onerror=()=>{if(token!==epoch)return;$('notice').hidden=false;$('notice').textContent='Voice could not load. The guidance is available below; you can continue.';$('caption').textContent=step.say;$('next').disabled=false;phase='waiting';};
 voice.play().catch(()=>{if(token!==epoch)return;$('resume').hidden=false;$('resume').textContent='Tap to hear your guide';});
}
voice.addEventListener('timeupdate',()=>{
 if(!captions.length||!isFinite(voice.duration))return;
 const total=captions.reduce((n,t)=>n+t.length,0), pos=voice.currentTime/voice.duration*total;
 let running=0;const c=captions.find(t=>(running+=t.length)>pos)||captions.at(-1);
 if(c!==lastCaption){$('caption').textContent=c;lastCaption=c;}window.GuidedUX?.tick(voice.currentTime);
});
function setMode(text){$('mode').textContent=text;}
function waiting(){phase='waiting';setMode('YOUR TURN · TAKE YOUR TIME');$('next').disabled=false;$('next').textContent=flow[index]?.kind==='badge'?'Celebrate →':'Continue →';}
function cube(light=false){return `<div class="scene"><svg viewBox="0 0 700 480" role="img" aria-label="Three faces of a cube, with a cast shadow"><ellipse id="shadow" cx="430" cy="430" rx="160" ry="30" fill="#080d17" opacity=".55"/><g><path class="face" data-face="top" role="button" tabindex="0" aria-label="Top face" fill="#edf0dc" d="M170 135 L340 37 L510 135 L340 233 Z"/><path class="face" data-face="left" role="button" tabindex="0" aria-label="Left face" fill="#9aaea9" d="M170 135 L340 233 L340 429 L170 331 Z"/><path class="face" data-face="right" role="button" tabindex="0" aria-label="Right face" fill="#445762" d="M340 233 L510 135 L510 331 L340 429 Z"/></g>${light?'<g id="sun"><circle cx="150" cy="50" r="23" fill="#f1ca86"/><circle cx="150" cy="50" r="33" fill="none" stroke="#f1ca8655" stroke-width="8"/></g>':''}</svg>${light?'<label for="sunSlider">☀ Move the light</label><input id="sunSlider" type="range" min="0" max="100" value="15" aria-label="Move the sun from left to right">':''}</div>`;}
function buildScene(s){
 $('media').hidden=true;$('visual').innerHTML='';
 if(s.kind==='anatomy'||s.kind==='light'){
  $('visual').innerHTML=cube(s.kind==='light');
  const seen=new Set();
  document.querySelectorAll('.face').forEach(el=>{
   const tap=()=>{seen.add(el.dataset.face);el.classList.add('seen');$('hint').textContent=el.getAttribute('aria-label');if(seen.size===3)waiting();};
   el.onclick=tap;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tap();}};
  });
  if(s.kind==='light')$('sunSlider').oninput=e=>{
   const t=Number(e.target.value)/100;
   $('sun').setAttribute('transform',`translate(${t*380-55} 0)`);
   document.querySelector('[data-face=left]').style.fill=`hsl(170 12% ${77-t*48}%)`;
   document.querySelector('[data-face=right]').style.fill=`hsl(200 15% ${28+t*48}%)`;
   $('shadow').setAttribute('cx',String(460-t*230));waiting();
  };
 }else if(s.kind==='materials'){
  const rect=s.focus==='pencils'?'x="75" y="24" width="750" height="940"':'x="855" y="25" width="640" height="785"';
  $('visual').innerHTML=`<div class="scene material"><svg viewBox="0 0 1536 1024" role="img" aria-label="Six labelled pencils, two paper blending stumps, and sketch paper"><image href="${root}assets/sketch-support/toolkit/drawing-tools.png" width="1536" height="1024"/><rect ${rect} rx="24" fill="none" stroke="#dcaa49" stroke-width="7" class="tool-glow"/></svg></div>`;
 }else if(s.kind==='paper'){
  $('visual').innerHTML=`<div class="scene real-paper-scene"><div class="paper-photo-grid"><figure class="paper-context"><img src="paper/sketch-pad.webp" alt="An open sketch-paper pad with pencils on its real paper sheets"><figcaption>Sketch paper</figcaption></figure><button class="paper-photo" data-paper="textured" aria-label="Enlarge textured sketch paper photograph"><img src="paper/textured.webp" alt="Close-up photograph of the tooth on cotton sketch paper"><strong>More texture</strong><span>Notice the tiny bumps</span></button><button class="paper-photo" data-paper="smooth" aria-label="Enlarge smoother drawing paper photograph"><img src="paper/smooth.webp" alt="Close-up photograph of a pencil resting on fine-grained, smoother drawing paper"><strong>Smoother surface</strong><span>A finer grain</span></button></div><div class="paper-photo-credit">Two paper samples · Feel both sides of your own sheet.<br><a href="https://www.hahnemuehle.shop/the-collection-sketch/10625161" target="_blank" rel="noopener">Photos: Hahnemühle — Sketch</a> · <a href="https://www.hahnemuehle.shop/en/dessin/10628192" target="_blank" rel="noopener">Dessin</a></div></div>`;
  document.querySelectorAll('[data-paper]').forEach(button=>button.onclick=()=>{voice.pause();const img=$('diagram').querySelector('img');img.src='paper/'+button.dataset.paper+'.webp';img.alt=button.querySelector('img').alt;$('diagram').showModal();});
 }else if(s.kind==='paperSize'){
  $('visual').innerHTML=`<div class="scene paper-scene"><svg viewBox="0 0 700 470" role="img" aria-label="A4 sketch paper: 210 millimetres wide and 297 millimetres tall"><rect x="215" y="25" width="245" height="346.5" rx="6" fill="#fffdf5" stroke="#A9CEA7" stroke-width="4"/><text x="337" y="175" text-anchor="middle" fill="#7560a7" font-size="54" font-family="system-ui">A4</text><text x="337" y="215" text-anchor="middle" fill="#706b81" font-size="17">Sketch paper</text><path d="M215 395h245M190 25v346" stroke="#7560a7" stroke-width="2"/><text x="337" y="427" text-anchor="middle" fill="#17182D" font-size="21">210 mm</text><text x="166" y="208" text-anchor="middle" transform="rotate(-90 166 208)" fill="#17182D" font-size="21">297 mm</text></svg><small>Another size? That works too.</small></div>`;
 }else if(s.kind==='ready'){
  $('visual').innerHTML=`<div class="scene"><div class="big-symbol">✎</div><p>Paper ready. Shoulders relaxed.</p></div>`;
 }else if(s.kind==='submit'){
 window.GuidedSubmit.mount($('visual'),{lessonId:'cube',title:'The Cube',onPhoto:url=>{photoURL=url}});
 }else if(s.kind==='reflect'){
  $('visual').innerHTML=`<div class="scene"><img class="upload-preview" src="${photoURL||root+'assets/sketch-support/finals/cube.jpg'}" alt="A cube drawing to reflect on"><p>What makes your drawing feel alive?</p><textarea aria-label="Optional reflection" placeholder="A thought to keep… (optional)"></textarea></div>`;
 }else if(s.kind==='badge'){
  $('visual').innerHTML='<div class="scene"><div class="big-symbol">✦</div><p>Cube explorer</p><small>DESIGN PREVIEW MILESTONE</small></div>';
 }
}
function finishClip(){
 if(phase!=='watching')return;
 player?.pause();clearTimeout(watchdog);
 const s=flow[index];
 if(s.kind==='intro'){mark();index++;enter();return;}
 waiting();$('clipControls').hidden=true;$('media').hidden=true;$('visual').innerHTML=`<img src="${s.frame}" alt="${s.title}: teacher’s drawing at this checkpoint">`;
 $('referenceImage').src=s.analysis||s.frame; $('referenceImage').alt=s.analysis?'Teaching diagram for '+s.title:s.title+' — stage reference'; $('analysis').hidden=false;$('replay').hidden=false;
 window.GuidedUX?.pause(s);speak(s);
}
function createPlayer(s){
 if(uid===s.uid&&player){startClip(s);return;}
 uid=s.uid;$('media').innerHTML='';
 const iframe=document.createElement('iframe');iframe.title='Teacher’s cube demonstration';iframe.allow='autoplay; fullscreen; picture-in-picture';iframe.tabIndex=-1;
 iframe.src=`https://customer-a78os4oj56dr67ab.cloudflarestream.com/${s.uid}/iframe?autoplay=false&muted=${muted}&controls=false&preload=auto`;
 $('media').append(iframe);
 if(typeof Stream!=='function'){
  $('notice').hidden=false;$('notice').textContent='The video player could not load. Check your connection and reload to try again.';return;
 }
 player=Stream(iframe);const thisPlayer=player;
 player.addEventListener('loadedmetadata',()=>{if(player===thisPlayer&&flow[index].uid===s.uid)startClip(flow[index]);});
 player.addEventListener('timeupdate',()=>{if(player===thisPlayer)checkClip();});
 player.addEventListener('ended',()=>{if(player===thisPlayer)checkClip(true);});
 player.addEventListener('play',()=>{if(player===thisPlayer){clearTimeout(watchdog);$('resume').hidden=true;$('playPause').textContent='Ⅱ';$('playPause').setAttribute('aria-label','Pause demonstration');}});
 player.addEventListener('error',()=>{if(player!==thisPlayer)return;$('notice').hidden=false;$('notice').textContent='The teacher video could not load. Use Replay to try again.';$('replay').hidden=false;});
}
function checkClip(ended=false){
 if(phase!=='watching'||!player)return;
 const s=flow[index], start=s.start||0, end=s.clipEnd, t=Number(player.currentTime);
 // A seek outside this microstep never unlocks or completes another checkpoint.
 if(t<start-.3||t>end+.7){player.currentTime=Math.max(start,Math.min(end-.25,t));if(ended)Promise.resolve(player.play()).catch(()=>{$('resume').hidden=false;});return;}
 $('clipSeek').value=Math.min(end-.15,Math.max(start,t));
 $('clipTime').textContent=`${Math.floor(Math.max(0,t-start))} / ${Math.ceil(end-start)}s`;
 if(t>=end-.12||(ended&&t>=end-.7))finishClip();
}
$('playPause').onclick=()=>{if(!player||phase!=='watching')return;if(player.paused){Promise.resolve(player.play()).catch(()=>{$('resume').hidden=false;});}else{player.pause();$('playPause').textContent='▶';$('playPause').setAttribute('aria-label','Play demonstration');}};
$('clipSeek').oninput=()=>{if(!player||phase!=='watching')return;const s=flow[index];player.currentTime=Math.max(s.start||0,Math.min(s.clipEnd-.15,Number($('clipSeek').value)));};
function startClip(s){
 phase='watching';$('media').hidden=false;$('visual').innerHTML='';$('resume').hidden=true;
 $('clipControls').hidden=false;$('clipSeek').min=s.start||0;$('clipSeek').max=s.clipEnd-.15;$('clipSeek').value=s.start||0;$('clipTime').textContent=`0 / ${Math.ceil(s.clipEnd-(s.start||0))}s`;
 player.muted=muted;player.currentTime=s.start||0;
 const token=epoch;
 Promise.resolve(player.play()).catch(()=>{if(token===epoch){$('resume').textContent='Tap to play';$('resume').hidden=false;}});
 clearTimeout(watchdog);watchdog=setTimeout(()=>{if(token===epoch&&phase==='watching'&&player.paused){$('resume').textContent='Tap to play';$('resume').hidden=false;}},5000);
}
function enter(){
 epoch++;clearTimeout(watchdog);stopVoice();player?.pause();
 const s=flow[index];window.GuidedUX?.reset(s);$('back').disabled=index===0;$('skipStep').hidden=index===flow.length-1;$('skipStep').textContent=s.optional?'Skip optional step →':'Skip this step →';$('finishCore').hidden=!s.optional||!flow.some(x=>x.kind==='submit');$('clipControls').hidden=true;save();$('title').textContent=s.title+(s.optional&&!/optional/i.test(s.title)?' · Optional':'');$('hint').textContent=s.hint||'';
 $('notice').hidden=true;$('resume').hidden=true;$('next').disabled=true;$('next').textContent='Continue →';$('replay').hidden=false;
 $('reference').hidden=s.kind!=='draw';$('analysis').hidden=s.kind!=='draw';
 setMode(s.chapter.toUpperCase());progress();window.GuidedUX?.stepCounter(flow,index);window.GuidedUX?.stageDots(flow,index,completed);
 if(s.kind==='intro'||s.kind==='draw'){
  phase='watching';setMode('WATCH WITH YOUR TEACHER');$('media').hidden=false;$('visual').innerHTML='';
  if(s.kind==='draw'){$('referenceImage').src=s.frame;$('referenceImage').alt=s.title+' — stage reference';}
  createPlayer(s);
 }else{
  phase='guidance';buildScene(s);window.GuidedUX?.scene(s);
  // Observation and light stay hands-on. Other scenes wait for the learner after guidance.
  speak(s,()=>{if(!['anatomy','light'].includes(s.kind))waiting();});
  if(s.kind==='badge'){$('next').textContent='Celebrate →';}
 }
}
function setRewardMuted(value){muted=value;voice.muted=muted;if(player)player.muted=muted;$('sound').textContent=muted?'Sound off':'Sound on';$('sound').setAttribute('aria-pressed',String(muted));$('sound').setAttribute('aria-label',muted?'Enable sound':'Mute sound');}
function next(){
 if($('next').disabled)return;
 mark();
 if(flow[index].coreComplete)GuidedPlatform.complete('cube');
 if(index===flow.length-1){stopVoice();GuidedPlatform.complete('cube');window.GuidedReward.complete({lessonId:'cube',title:'The Cube',nextLabel:'Continue to The Sphere →',muted,onMutedChange:setRewardMuted}).then(async go=>{await GuidedPlatform.flush();if(go)location.href='../../lesson-1-sphere/guided/';});return;}
 index++;enter();
}
$('next').onclick=next;
$('back').onclick=()=>{if(index>0){index--;enter();}};
$('skipStep').onclick=()=>{if(index>=flow.length-1)return;skipped.add(index);unlocked=Math.max(unlocked,index+1);index++;enter();};
$('finishCore').onclick=()=>{let target=flow.findIndex((x,i)=>i>index&&x.kind==='submit');if(target<0)target=flow.findIndex((x,i)=>i>index&&x.kind==='reflect');if(target<0)return;for(let i=index;i<target;i++)if(flow[i].optional)skipped.add(i);unlocked=Math.max(unlocked,target);index=target;enter();};
$('referenceImage').onclick=()=>{$('analysis').onclick();};
$('referenceImage').tabIndex=0;$('referenceImage').setAttribute('role','button');$('referenceImage').setAttribute('aria-label','Enlarge reference image');$('referenceImage').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('analysis').onclick();}};

$('replay').onclick=()=>enter();
$('artchi').onclick=()=>{const s=flow[index];if(s.kind==='draw'&&phase==='watching')return;speak(s);};
$('sound').onclick=()=>{muted=!muted;voice.muted=muted;if(player)player.muted=muted;$('sound').textContent=muted?'Sound off':'Sound on';$('sound').setAttribute('aria-pressed',String(muted));$('sound').setAttribute('aria-label',muted?'Enable sound':'Mute sound');};
$('resume').onclick=()=>{$('resume').hidden=true;if(phase==='watching'){Promise.resolve(player?.play()).catch(()=>{$('resume').hidden=false;});}else voice.play().catch(()=>{$('resume').hidden=false;});};
function openMap(){
 player?.pause();voice.pause();$('mapItems').innerHTML='';
 const stageGroups=window.GuidedUX?.mapStageGroups(flow)||[];let gi=0;
 flow.forEach((s,i)=>{
  if(gi<stageGroups.length&&i===stageGroups[gi].start){const name=stageGroups[gi].name;const h=document.createElement('h3');h.textContent=name+(s.optional&&!/optional/i.test(name)?' · Optional':'');$('mapItems').append(h);gi++;}
  const b=document.createElement('button');b.className='map-step'+(i===index?' current':'');b.disabled=false;
  // Optional refinements can be bypassed only after the core drawing is finished.
  if(s.kind==='submit'&&completed.has(flow.findIndex(x=>x.title==='Your cube has volume')))b.disabled=false;
  if(s.frame){const img=document.createElement('img');img.src=s.frame;img.alt='';img.loading='lazy';b.append(img);}
  const label=document.createElement('span');label.textContent=s.title+(s.optional&&!/optional/i.test(s.title)?' · Optional':'')+(skipped.has(i)?' · Skipped':'');b.append(label);const check=document.createElement('b');check.textContent=completed.has(i)?'✓':skipped.has(i)?'↷':String(i+1);b.append(check);
  b.onclick=()=>{$('map').close();index=i;unlocked=Math.max(unlocked,i);enter();};$('mapItems').append(b);
 });$('map').showModal();
}
$('mapButton').onclick=openMap;$('closeMap').onclick=()=>$('map').close();
$('map').addEventListener('close',()=>{if(phase==='watching'){$('resume').hidden=false;$('resume').textContent='Resume playback';}});
$('analysis').onclick=()=>{voice.pause();$('diagram').querySelector('img').src=flow[index].analysis||flow[index].frame;$('diagram').showModal();};$('closeDiagram').onclick=()=>$('diagram').close();
$('diagram').addEventListener('close',()=>{if(!voice.ended&&voice.currentTime>0)voice.play().catch(()=>{$('resume').textContent='Resume guidance';$('resume').hidden=false;});});
document.addEventListener('visibilitychange',()=>{if(document.hidden){player?.pause();voice.pause();}else if(phase==='watching'||(voice.src&&!voice.ended)){$('resume').textContent='Resume playback';$('resume').hidden=false;}});
window.addEventListener('pagehide',()=>{player?.pause();stopVoice();if(photoURL)URL.revokeObjectURL(photoURL);});
$('start').onclick=()=>{$('welcome').close();enter();};
$('welcome').addEventListener('cancel',e=>e.preventDefault());
(async()=>{if(!await GuidedPlatform.allow('cube'))return; $('welcome').showModal();
fetch('flow.json?v=ux-2').then(r=>{if(!r.ok)throw Error('Flow unavailable');return r.json();}).then(async data=>{
 flow=data;
 try{if(!localStorage.getItem(KEY)){const old=JSON.parse(localStorage.getItem('fei.cube.guided-preview.v1')||'null');if(old){const shift=i=>i>=5?i+2:i;localStorage.setItem(KEY,JSON.stringify({index:shift(old.index||0),unlocked:shift(old.unlocked||0),completed:(old.completed||[]).map(shift)}));}}const p=await GuidedPlatform.restore('cube',KEY,flow.length);unlocked=Math.max(0,Math.min(flow.length-1,Number(p.unlocked)||0));index=Math.max(0,Math.min(unlocked,Number(p.index)||0));skipped=new Set(p.skipped||[]);completed=new Set((Array.isArray(p.completed)?p.completed:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<flow.length));}catch{}
 $('start').disabled=false;$('start').textContent=index?'Continue your journey →':'Start drawing →';
}).catch(()=>{$('start').textContent='Could not load · Reload to retry';});
})();
})();
