/* Isolated design experiment: no platform progress, submissions, or badge writes. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const root = '../../../';
const practiceOnly = new URLSearchParams(location.search).get('practice')==='hatching';
const KEY = 'fei.preparation.guided-preview.v2'+(practiceOnly?'.hatching':'');
let flow=[], index=0, unlocked=0, completed=new Set(), player=null, uid=null, phase='idle', muted=false, epoch=0, photoURL=null;
let voiceDone=null, captions=[], lastCaption='', watchdog=null, watchNarrated=false, watchVoiceActive=false;
const voice=$('voice');
let soundContext=null;
function chime(){try{soundContext ||= new (window.AudioContext||window.webkitAudioContext)();soundContext.resume();[523.25,659.25,783.99].forEach((hz,i)=>{const o=soundContext.createOscillator(),g=soundContext.createGain(),t=soundContext.currentTime+i*.07;o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g).connect(soundContext.destination);o.start(t);o.stop(t+.28);});}catch{}}
function save(){try{localStorage.setItem(KEY,JSON.stringify({index,unlocked,completed:[...completed]}));}catch{}}
function mark(){if(!completed.has(index)&&!muted)chime();completed.add(index);unlocked=Math.max(unlocked,Math.min(flow.length-1,index+1));save();progress();}
function progress(){ $('progress').innerHTML=flow.map((s,i)=>`<span class="${completed.has(i)?'done':i===index?'current':''}" title="${s.title}"></span>`).join(''); }
function stopVoice(){voice.pause();voice.onended=null;voice.onerror=null;voiceDone=null;$('caption').textContent='';captions=[];}
function speak(step,done){
 stopVoice(); voiceDone=done||null;
 if(!step.audio){done?.();return;}
 captions=(step.say.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[step.say]).map(t=>t.trim());
 $('caption').textContent=captions[0]||'';lastCaption='';voice.src=step.audio;voice.muted=muted;
 const token=epoch;
 voice.onended=()=>{if(token!==epoch)return;const cb=voiceDone;voiceDone=null;cb?.();};
 voice.onerror=()=>{if(token!==epoch)return;$('notice').hidden=false;$('notice').textContent='Voice could not load. The guidance is available below; you can continue.';$('caption').textContent=step.say;if(phase==='watching'){watchVoiceActive=false;if(player)player.muted=muted;}else{$('next').disabled=false;phase='waiting';}};
 voice.play().catch(()=>{if(token!==epoch)return;$('resume').hidden=false;$('resume').textContent='Tap to hear your guide';});
}
voice.addEventListener('timeupdate',()=>{
 if(!captions.length||!isFinite(voice.duration))return;
 const total=captions.reduce((n,t)=>n+t.length,0), pos=voice.currentTime/voice.duration*total;
 let running=0;const c=captions.find(t=>(running+=t.length)>pos)||captions.at(-1);
 if(c!==lastCaption){$('caption').textContent=c;lastCaption=c;}
});
function setMode(text){$('mode').textContent=text;}
function waiting(){phase='waiting';setMode('YOUR TURN · TAKE YOUR TIME');$('next').disabled=false;$('next').textContent=flow[index]?.kind==='badge'?'Finish preview ✓':index===flow.length-1?'Start The Cube →':'Continue →';}
function buildScene(s){
 $('media').hidden=true;$('visual').innerHTML='';
 if(s.kind==='photo'){
 $('visual').innerHTML=`<div class="prep-photos"><img src="${s.image}" alt="${s.title}">${s.second?`<img src="${s.second}" alt="Alternative comfortable pencil grip">`:''}</div>`;
 }else if(s.kind==='milestone'){
 $('visual').innerHTML=`<div class="scene encouragement"><img src="../../../core/dashboard-artchi.svg" alt="Artchi"><div class="milestone-star">✦</div><h2>${s.hint}</h2><p>One step at a time.</p></div>`;
 if(!muted&&!completed.has(index))chime();
 }else if(s.kind==='materials'){
  const rect=s.focus==='pencils'?'x="75" y="24" width="750" height="940"':'x="855" y="25" width="640" height="785"';
  $('visual').innerHTML=`<div class="scene material"><svg viewBox="0 0 1536 1024" role="img" aria-label="Six labelled pencils, two paper blending stumps, and sketch paper"><image href="${root}assets/sketch-support/toolkit/drawing-tools.png" width="1536" height="1024"/><rect ${rect} rx="24" fill="none" stroke="#dcaa49" stroke-width="7" class="tool-glow"/></svg></div>`;
 }else if(s.kind==='paper'){
  $('visual').innerHTML=`<div class="scene real-paper-scene"><div class="paper-photo-grid"><figure class="paper-context"><img src="paper/sketch-pad.webp" alt="An open sketch-paper pad with pencils on its real paper sheets"><figcaption>Sketch paper</figcaption></figure><button class="paper-photo" data-paper="textured" aria-label="Enlarge textured sketch paper photograph"><img src="paper/textured.webp" alt="Close-up photograph of the tooth on cotton sketch paper"><strong>More texture</strong><span>Notice the tiny bumps</span></button><button class="paper-photo" data-paper="smooth" aria-label="Enlarge smoother drawing paper photograph"><img src="paper/smooth.webp" alt="Close-up photograph of a pencil resting on fine-grained, smoother drawing paper"><strong>Smoother surface</strong><span>A finer grain</span></button></div><div class="paper-photo-credit">Two paper samples · Feel both sides of your own sheet.<br><a href="https://www.hahnemuehle.shop/the-collection-sketch/10625161" target="_blank" rel="noopener">Photos: Hahnemühle — Sketch</a> · <a href="https://www.hahnemuehle.shop/en/dessin/10628192" target="_blank" rel="noopener">Dessin</a></div></div>`;
  document.querySelectorAll('[data-paper]').forEach(button=>button.onclick=()=>{voice.pause();const img=$('diagram').querySelector('img');img.src='paper/'+button.dataset.paper+'.webp';img.alt=button.querySelector('img').alt;$('diagram').showModal();});
 }else if(s.kind==='paperSize'){
  $('visual').innerHTML=`<div class="scene paper-scene"><svg viewBox="0 0 700 470" role="img" aria-label="A4 sketch paper: 210 millimetres wide and 297 millimetres tall"><rect x="215" y="25" width="245" height="346.5" rx="6" fill="#fffdf5" stroke="#A9CEA7" stroke-width="4"/><text x="337" y="175" text-anchor="middle" fill="#7560a7" font-size="54" font-family="system-ui">A4</text><text x="337" y="215" text-anchor="middle" fill="#706b81" font-size="17">Sketch paper</text><path d="M215 395h245M190 25v346" stroke="#7560a7" stroke-width="2"/><text x="337" y="427" text-anchor="middle" fill="#17182D" font-size="21">210 mm</text><text x="166" y="208" text-anchor="middle" transform="rotate(-90 166 208)" fill="#17182D" font-size="21">297 mm</text></svg><small>Another size? That works too.</small></div>`;
 }
}
function showPattern(s){
 $('patternReference').hidden=!s.reference;
 $('referenceImage').hidden=!!s.reference;
 if(!s.reference)return;
 $('reference').hidden=false;
 $('patternReference').innerHTML=`<svg viewBox="${s.crop.join(' ')}" role="img" aria-label="${s.title} — matching example from your hatching reference"><image href="${s.reference}" width="1086" height="1448"/></svg><strong>${s.title}</strong><small>YOUR PRACTICE EXAMPLE</small>`;
}
function beginWatchVoice(){
 const s=flow[index];if(!s.watchAudio||watchNarrated||phase!=='watching'||player.paused)return;
 watchNarrated=true;watchVoiceActive=true;player.muted=true;
 speak({audio:s.watchAudio,say:s.watchSay},()=>{watchVoiceActive=false;if(player)player.muted=muted;});
}
function resumeTogether(){
 if(watchVoiceActive&&!voice.ended)voice.play().catch(()=>{$('resume').hidden=false;});
 Promise.resolve(player?.play()).catch(()=>{$('resume').hidden=false;});
}
function finishClip(){
 if(phase!=='watching')return;
 player?.pause();clearTimeout(watchdog);stopVoice();watchVoiceActive=false;
 const s=flow[index];
 if(s.kind==='intro'){mark();index++;enter();return;}
 waiting();$('clipControls').hidden=true;$('media').hidden=true;$('visual').innerHTML=`<img src="${s.frame}" alt="${s.title}: teacher’s drawing at this checkpoint">`;
 $('referenceImage').src=s.analysis||s.frame; $('referenceImage').alt=s.analysis?'Teaching diagram for '+s.title:s.title+' — stage reference'; $('analysis').hidden=!!s.reference;$('replay').hidden=false;
 speak(s);
}
function createPlayer(s){
 if(uid===s.uid&&player){startClip(s);return;}
 uid=s.uid;$('media').innerHTML='';
 const iframe=document.createElement('iframe');iframe.title='Teacher’s preparation demonstration';iframe.allow='autoplay; fullscreen; picture-in-picture';iframe.tabIndex=-1;
 iframe.src=`https://customer-a78os4oj56dr67ab.cloudflarestream.com/${s.uid}/iframe?autoplay=false&muted=${muted}&controls=false&preload=auto`;
 $('media').append(iframe);
 if(typeof Stream!=='function'){
  $('notice').hidden=false;$('notice').textContent='The video player could not load. Check your connection and reload to try again.';return;
 }
 player=Stream(iframe);const thisPlayer=player;
 player.addEventListener('loadedmetadata',()=>{if(player===thisPlayer&&flow[index].uid===s.uid)startClip(flow[index]);});
 player.addEventListener('timeupdate',()=>{if(player===thisPlayer)checkClip();});
 player.addEventListener('pause',()=>{if(player===thisPlayer&&phase==='watching'&&watchVoiceActive)voice.pause();});
 player.addEventListener('waiting',()=>{if(player===thisPlayer&&watchVoiceActive)voice.pause();});
 player.addEventListener('playing',()=>{if(player===thisPlayer&&watchVoiceActive&&voice.paused)voice.play().catch(()=>{$('resume').hidden=false;});});
 player.addEventListener('ended',()=>{if(player===thisPlayer)checkClip(true);});
 player.addEventListener('play',()=>{if(player===thisPlayer){clearTimeout(watchdog);$('resume').hidden=true;$('playPause').textContent='Ⅱ';$('playPause').setAttribute('aria-label','Pause demonstration');}});
 player.addEventListener('error',()=>{if(player!==thisPlayer)return;$('notice').hidden=false;$('notice').textContent='The teacher video could not load. Use Replay to try again.';$('replay').hidden=false;});
}
function checkClip(ended=false){
 if(phase!=='watching'||!player)return;
 const s=flow[index], start=s.start||0, end=s.clipEnd, t=Number(player.currentTime);
 // A seek outside this microstep never unlocks or completes another checkpoint.
 if(t<start-.3||t>end+.7){player.currentTime=Math.max(start,Math.min(end-.25,t));if(ended)Promise.resolve(player.play()).catch(()=>{$('resume').hidden=false;});return;}
 if(t>=start+.1)beginWatchVoice();
 $('clipSeek').value=Math.min(end-.15,Math.max(start,t));
 $('clipTime').textContent=`${Math.floor(Math.max(0,t-start))} / ${Math.ceil(end-start)}s`;
 if(t>=end-.12||(ended&&t>=end-.7))finishClip();
}
$('playPause').onclick=()=>{if(!player||phase!=='watching')return;if(player.paused){resumeTogether();}else{player.pause();if(watchVoiceActive)voice.pause();$('playPause').textContent='▶';$('playPause').setAttribute('aria-label','Play demonstration');}};
$('clipSeek').oninput=()=>{if(!player||phase!=='watching')return;const s=flow[index];player.currentTime=Math.max(s.start||0,Math.min(s.clipEnd-.15,Number($('clipSeek').value)));};
function startClip(s){
 phase='watching';$('media').hidden=false;$('visual').innerHTML='';$('resume').hidden=true;
 $('clipControls').hidden=false;$('clipSeek').min=s.start||0;$('clipSeek').max=s.clipEnd-.15;$('clipSeek').value=s.start||0;$('clipTime').textContent=`0 / ${Math.ceil(s.clipEnd-(s.start||0))}s`;
 watchNarrated=false;watchVoiceActive=false;player.muted=muted||!!s.watchAudio;player.currentTime=s.start||0;
 const token=epoch;
 Promise.resolve(player.play()).catch(()=>{if(token===epoch){$('resume').textContent='Tap to play';$('resume').hidden=false;}});
 clearTimeout(watchdog);watchdog=setTimeout(()=>{if(token===epoch&&phase==='watching'&&player.paused){$('resume').textContent='Tap to play';$('resume').hidden=false;}},5000);
}
function enter(){
 epoch++;clearTimeout(watchdog);stopVoice();player?.pause();
 const s=flow[index];$('skip').hidden=!s.optional;$('clipControls').hidden=true;save();$('title').textContent=s.title;$('hint').textContent=s.hint||'';
 $('notice').hidden=true;$('resume').hidden=true;$('next').disabled=true;$('next').textContent='Continue →';$('replay').hidden=false;
 $('reference').hidden=true;$('analysis').hidden=true;showPattern(s);
 setMode(`${s.chapter.toUpperCase()} · ${index+1} / ${flow.length}`);progress();
 if(s.kind==='intro'||s.kind==='draw'){
  phase='watching';setMode('WATCH WITH YOUR TEACHER');$('media').hidden=false;$('visual').innerHTML='';
  if(s.kind==='draw'){$('referenceImage').src=s.frame;$('referenceImage').alt=s.title+' — stage reference';}
  createPlayer(s);
 }else{
  phase='guidance';buildScene(s);
  // Observation and light stay hands-on. Other scenes wait for the learner after guidance.
  speak(s,()=>{if(!['anatomy','light'].includes(s.kind))waiting();});
  if(s.kind==='badge'){$('next').textContent='Finish preview ✓';}
 }
}
function setRewardMuted(value){muted=value;voice.muted=muted;if(player)player.muted=muted;$('sound').textContent=muted?'Sound off':'Sound on';$('sound').setAttribute('aria-pressed',String(muted));$('sound').setAttribute('aria-label',muted?'Enable sound':'Mute sound');}
function next(){
 if($('next').disabled)return;
 mark();
 if(index===flow.length-1){stopVoice();if(practiceOnly){location.href='../../lesson-3-cube/guided/';return;}window.GuidedReward.complete({lessonId:'preparation',title:'Preparation',nextLabel:'Continue to The Cube →',muted,onMutedChange:setRewardMuted}).then(go=>{if(go)location.href='../../lesson-3-cube/guided/';});return;}
 index++;enter();
}
$('next').onclick=next;
$('skip').onclick=()=>{if(!flow[index].optional)return;unlocked=Math.max(unlocked,index+1);index++;enter();};
$('replay').onclick=()=>enter();
$('artchi').onclick=()=>{const s=flow[index];if(s.kind==='draw'&&phase==='watching')return;speak(s,()=>{if(phase==='guidance')waiting();});};
$('sound').onclick=()=>{muted=!muted;voice.muted=muted;if(player)player.muted=muted||watchVoiceActive;$('sound').textContent=muted?'Sound off':'Sound on';$('sound').setAttribute('aria-pressed',String(muted));$('sound').setAttribute('aria-label',muted?'Enable sound':'Mute sound');};
$('resume').onclick=()=>{$('resume').hidden=true;if(phase==='watching'){resumeTogether();}else voice.play().catch(()=>{$('resume').hidden=false;});};
function openMap(){
 player?.pause();voice.pause();$('mapItems').innerHTML='';let chapter='';
 flow.forEach((s,i)=>{
  if(s.chapter!==chapter){chapter=s.chapter;const h=document.createElement('h3');h.textContent=chapter+(s.optional?' · Optional':'');$('mapItems').append(h);}
  const b=document.createElement('button');b.className='map-step'+(i===index?' current':'');b.disabled=i>unlocked;
  // Optional refinements can be bypassed only after the core drawing is finished.

  if(s.frame){const img=document.createElement('img');img.src=s.frame;img.alt='';img.loading='lazy';b.append(img);}
  const label=document.createElement('span');label.textContent=s.title;b.append(label);const check=document.createElement('b');check.textContent=completed.has(i)?'✓':b.disabled?'·':String(i+1);b.append(check);
  b.onclick=()=>{$('map').close();index=i;unlocked=Math.max(unlocked,i);enter();};$('mapItems').append(b);
 });$('map').showModal();
}
$('mapButton').onclick=openMap;$('closeMap').onclick=()=>$('map').close();
$('map').addEventListener('close',()=>{if(phase!=='watching'&&!voice.ended&&voice.currentTime>0)voice.play().catch(()=>{$('resume').hidden=false;});if(phase==='watching'){$('resume').hidden=false;$('resume').textContent='Resume playback';}});
$('analysis').onclick=()=>{voice.pause();$('diagram').querySelector('img').src=flow[index].analysis||flow[index].frame;$('diagram').showModal();};$('closeDiagram').onclick=()=>$('diagram').close();
$('diagram').addEventListener('close',()=>{if(phase!=='watching'&&!voice.ended&&voice.currentTime>0)voice.play().catch(()=>{$('resume').textContent='Resume guidance';$('resume').hidden=false;});});
document.addEventListener('visibilitychange',()=>{if(document.hidden){player?.pause();voice.pause();}else if(phase==='watching'||(voice.src&&!voice.ended)){$('resume').textContent='Resume playback';$('resume').hidden=false;}});
window.addEventListener('pagehide',()=>{player?.pause();stopVoice();if(photoURL)URL.revokeObjectURL(photoURL);});
$('start').onclick=()=>{$('welcome').close();enter();};
$('welcome').addEventListener('cancel',e=>e.preventDefault());$('welcome').showModal();
fetch('flow.json?v=hatching-15').then(r=>{if(!r.ok)throw Error('Flow unavailable');return r.json();}).then(data=>{
 flow=data;
 try{
 if(!localStorage.getItem(KEY)&&!practiceOnly){
  const old=JSON.parse(localStorage.getItem('fei.preparation.guided-preview.v1')||'null');
  if(old){const shift=i=>i<12?i:i<18?12:i+9;localStorage.setItem(KEY,JSON.stringify({index:shift(old.index||0),unlocked:shift(old.unlocked||0),completed:(old.completed||[]).filter(i=>i<12||i>=18).map(shift)}));}
 }
 const p=JSON.parse(localStorage.getItem(KEY)||'{}');unlocked=Math.max(0,Math.min(flow.length-1,Number(p.unlocked)||0));index=Math.max(0,Math.min(unlocked,Number(p.index)||0));completed=new Set((Array.isArray(p.completed)?p.completed:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<flow.length));}catch{}
 if(practiceOnly){index=Math.max(12,index);unlocked=Math.max(12,unlocked);$('welcome').querySelector('h2').textContent='One pattern at a time.';$('welcome').querySelector('p').textContent='Watch the teacher. Compare the example. Try it at your pace.';$('welcome').querySelector('img').src=flow[12].frame;}
 $('start').disabled=false;$('start').textContent=practiceOnly?'Start hatching →':index?'Continue your journey →':'Let’s get ready →';
}).catch(()=>{$('start').textContent='Could not load · Reload to retry';});
})();
