/* Guided lesson with account progress, optional practice and in-lesson submission. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const root = '../../../';
const LESSON_ID = 'still-life-4a-dog-structure';
const KEY = 'fei.dog.guided-preview.v1';
let flow=[], index=0, unlocked=0, completed=new Set(), skipped=new Set(), player=null, uid=null, phase='idle', muted=false, epoch=0, photoURL=null;
let voiceDone=null, captions=[], lastCaption='', watchdog=null, watchNarrated=false, watchVoiceActive=false;
let introShifted=true; // flips false only while migrating a pre-intro save; see init() below.
const voice=$('voice');
let soundContext=null;
function chime(){try{soundContext ||= new (window.AudioContext||window.webkitAudioContext)();soundContext.resume();[523.25,659.25,783.99].forEach((hz,i)=>{const o=soundContext.createOscillator(),g=soundContext.createGain(),t=soundContext.currentTime+i*.07;o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g).connect(soundContext.destination);o.start(t);o.stop(t+.28);});}catch{}}
function save(){GuidedPlatform.save({index,unlocked,completed:[...completed],skipped:[...skipped],introShifted},KEY);}
function mark(){if(!completed.has(index)&&!muted)chime();completed.add(index);unlocked=Math.max(unlocked,Math.min(flow.length-1,index+1));save();progress();}
function jumpToStep(target){
 if(!Number.isInteger(target)||target<0||target>=flow.length)return;
 index=target;unlocked=Math.max(unlocked,target);enter();
}
function progress(){
 const bar=$('progress');bar.innerHTML='';
 flow.forEach((step,i)=>{
  const b=document.createElement('button');b.type='button';b.className='step-jump '+(i===index?'current':completed.has(i)?'done':skipped.has(i)?'skipped':'');
  const label=`${i+1}. ${step.title}${step.optional?' · Optional':''}`;
  b.textContent=String(i+1);b.title=label;b.setAttribute('aria-label','Jump to '+label);if(i===index)b.setAttribute('aria-current','step');
  b.onclick=()=>jumpToStep(i);b.onmouseenter=b.onfocus=()=>{$('stepPreview').textContent=label;};b.onmouseleave=b.onblur=()=>{$('stepPreview').textContent='';};bar.append(b);
 });
}
function stopVoice(){voice.pause();voice.onended=null;voice.onerror=null;voiceDone=null;$('caption').textContent='';captions=[];}
function speak(step,done){
 stopVoice(); voiceDone=done||null;
 window.GuidedUX?.narrate(step);if(!step.audio){done?.();return;}
 captions=(step.say.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[step.say]).map(t=>t.trim());
 $('caption').textContent=captions[0]||'';lastCaption='';voice.src=step.audio+(step.audio.includes('?')?'&':'?')+'v=ux-1';voice.muted=muted;
 const token=epoch;
 voice.onended=()=>{if(token!==epoch)return;const cb=voiceDone;voiceDone=null;cb?.();};
 voice.onerror=()=>{if(token!==epoch)return;$('notice').hidden=false;$('notice').textContent='Voice could not load. The guidance is available below; you can continue.';$('caption').textContent=step.say;if(phase==='watching'){watchVoiceActive=false;if(player)player.muted=muted;}else{$('next').disabled=false;phase='waiting';}};
 voice.play().catch(()=>{if(token!==epoch)return;$('resume').hidden=false;$('resume').textContent='Tap to hear your guide';});
}
voice.addEventListener('timeupdate',()=>{
 if(!captions.length||!isFinite(voice.duration))return;
 const total=captions.reduce((n,t)=>n+t.length,0), pos=voice.currentTime/voice.duration*total;
 let running=0;const c=captions.find(t=>(running+=t.length)>pos)||captions.at(-1);
 if(c!==lastCaption){$('caption').textContent=c;lastCaption=c;}window.GuidedUX?.tick(voice.currentTime);
});
function setMode(text){$('mode').textContent=text;}
function waiting(){phase='waiting';setMode('YOUR TURN · TAKE YOUR TIME');$('next').disabled=false;$('next').textContent=index===flow.length-1?'Celebrate →':'Continue →';}

// ── Live teaching overlay (same mechanism as balloon/glass's own guided
// studios -- see glass's studio.js for the full rationale on `tone`).
// Dog uses the same deeper-palette overlay system as glass since this is
// grey pencil throughout too.
const TONES={peri:'#172BBF',leaf:'#57942E',blush:'#D9210D'};
function overlaySvg(spec, frameSrc){
 const guides=(spec?.guides||[]).map((g,i)=>{
  const tone=g.tone?TONES[g.tone]:null;
  if(g.ellipse) return `<ellipse class="og-ellipse og-fade" style="animation-delay:${.2+i*.15}s${tone?`;stroke:${tone};fill:${tone}22`:''}" cx="${g.cx}" cy="${g.cy}" rx="${g.rx}" ry="${g.ry}"/>`;
  return `<path class="og-guide${g.dash?' dash':''}${g.old?' old':''} og-draw" style="--og-len:900;animation-delay:${.15+i*.15}s${tone?`;stroke:${tone}`:''}" d="${g.d}"/>`;
 }).join('');
 const arrowTone=spec?.arrow?.tone||'peri';
 const arrow=spec?.arrow?`<path class="og-arrow og-fade" style="animation-delay:${.6+(spec.guides?.length||0)*.15}s;stroke:${TONES[arrowTone]}" marker-end="url(#og-tip-${arrowTone})" d="${spec.arrow.d}"/>`:'';
 // Numbered badges -- used once (Video 6's front-to-back depth moment) to
 // mark reading order (1 nose, 2 mouth, 3 eyes, 4 ears) directly on the
 // frame, since that idea is about sequence, not a single traced line.
 const labels=(spec?.labels||[]).map((l,i)=>{
  const tone=TONES[l.tone]||TONES.peri;
  return `<g class="og-fade" style="animation-delay:${.3+i*.15}s"><circle cx="${l.cx}" cy="${l.cy}" r="22" fill="${tone}" stroke="#fffdf5" stroke-width="3"/><text x="${l.cx}" y="${l.cy}" class="og-label-n" text-anchor="middle" dominant-baseline="central">${l.n}</text></g>`;
 }).join('');
 const card=spec?.card?`<g class="og-fade" style="animation-delay:.9s"><rect class="og-card-bg" x="25" y="22" width="420" height="116" rx="16"/><rect class="og-card-accent" x="25" y="22" width="7" height="116" rx="3"/><text class="og-kicker" x="48" y="56">${spec.card.kicker}</text><text class="og-title" x="48" y="88">${spec.card.title}</text><text class="og-sub" x="48" y="117">${spec.card.sub}</text></g>`:'';
 const markers=Object.entries(TONES).map(([name,hex])=>`<marker id="og-tip-${name}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M1 1 L8 5 L1 9" fill="none" stroke="${hex}" stroke-width="2"/></marker>`).join('');
 // Zoomed inset filmstrip -- used once in this lesson (Video 2, the eye
 // highlight/pupil/greys moment) to show the real build-up order beside
 // the full frame, since that sequence is too small to read in the main view.
 const inset=spec?.inset?`<div class="og-inset">${spec.inset.map((f,i)=>`<figure style="animation-delay:${1.1+i*.25}s"><img src="${f.src}" alt="${f.alt}"><figcaption>${f.label}</figcaption></figure>`).join('')}</div>`:'';
 return `<div class="overlay-wrap"><img src="${frameSrc}" alt=""><svg class="overlay-svg" viewBox="0 0 1280 720" role="img" aria-label="${spec?.card?spec.card.title:'Teaching guide'}"><defs>${markers}</defs>${guides}${arrow}${labels}${card}</svg>${inset}</div>`;
}

function tissueScene(){
 return `<div class="scene tissue-scene"><svg viewBox="0 0 200 160" role="img" aria-label="A small folded tissue"><path d="M30 40 Q20 90 55 130 Q100 155 150 120 Q175 95 160 55 Q140 20 100 25 Q60 20 30 40 Z" fill="#fffdf8" stroke="#d9d0e3" stroke-width="3"/><path d="M55 60 Q85 75 60 110 M100 50 Q120 80 95 120 M125 55 Q145 85 128 115" fill="none" stroke="#e7e2ed" stroke-width="2.5"/></svg><p>A small folded tissue, or a cotton swab, helps blend small areas.</p></div>`;
}

function buildScene(s){
 $('media').hidden=true;$('visual').innerHTML='';
 if(s.kind==='film'){
  $('visual').innerHTML=`<div class="scene film-scene"><video id="introFilm" src="${s.src}" playsinline></video></div>`;
 }else if(s.kind==='tissue'){
  $('visual').innerHTML=tissueScene();
 }else if(s.kind==='milestone'){
  $('visual').innerHTML=`<div class="scene encouragement"><img src="../../../core/dashboard-artchi.svg" alt="Artchi"><div class="milestone-star">✦</div><h2>${s.hint}</h2><p>One step at a time.</p></div>`;
  if(!muted&&!completed.has(index))chime();
 }else if(s.kind==='materials'){
  const rect=s.focus==='pencils'?'x="75" y="24" width="750" height="940"':'x="855" y="25" width="640" height="785"';
  // The shared toolkit photo (assets/sketch-support/toolkit/drawing-tools.png)
  // has no eraser or blending stick visible as its own labelled item --
  // same gap as balloon/glass, same fix: small hand-drawn icons instead
  // of a (non-existent) spotlighted photo region.
  const eraser=s.showEraser?`<div class="eraser-callout"><svg viewBox="0 0 90 60" role="img" aria-label="A white block eraser, partly unwrapped"><rect x="8" y="10" width="74" height="40" rx="6" fill="#fdfdfb" stroke="#8d8577" stroke-width="2.5"/><path d="M8 32h74" stroke="#c23b3b" stroke-width="2.5"/><path d="M8 20h30M8 44h22" stroke="#c23b3b" stroke-width="1.6" opacity=".6"/></svg><span>White eraser (or an eraser pencil)</span></div>`:'';
  const stump=s.showStump?`<div class="stump-callout${s.showEraser?' stump-callout-second':''}"><svg viewBox="0 0 90 60" role="img" aria-label="A pointed paper blending stump"><path d="M10 48 L58 14 Q66 9 70 15 L72 18 Q76 24 69 29 L21 54 Z" fill="#d9b98a" stroke="#8d7250" stroke-width="2.5"/></svg><span>Blending stick (stump)</span></div>`:'';
  $('visual').innerHTML=`<div class="scene material"><svg viewBox="0 0 1536 1024" role="img" aria-label="Pencils, a blending stump, and sketch paper"><image href="${root}assets/sketch-support/toolkit/drawing-tools.png" width="1536" height="1024"/><rect ${rect} rx="24" fill="none" stroke="#dcaa49" stroke-width="7" class="tool-glow"/></svg>${eraser}${stump}</div>`;
 }else if(s.kind==='compare'){
  $('visual').innerHTML=`<div class="compare-scene"><figure><img src="${s.compare.before}" alt="The drawing before"><figcaption>BEFORE</figcaption></figure><figure><img src="${s.compare.after}" alt="The drawing after"><figcaption>AFTER</figcaption></figure></div>`;
 }else if(s.kind==='recap'){
  $('visual').innerHTML=`<div class="recap-scene">${s.recap.map(r=>`<figure><img src="${r.src}" alt="Your drawing's ${r.label.toLowerCase()} stage"><figcaption>${r.label}</figcaption></figure>`).join('')}</div>`;
 }else if(s.kind==='submit'){
  window.GuidedSubmit.mount($('visual'),{lessonId:LESSON_ID,title:'Dog',courseId:'still-life',onPhoto:url=>{photoURL=url;}});
 }else if(s.kind==='paper'){
  $('visual').innerHTML=`<div class="scene real-paper-scene"><div class="paper-photo-grid"><figure class="paper-context"><img src="paper/sketch-pad.webp" alt="An open sketch-paper pad with pencils on its real paper sheets"><figcaption>Sketch paper</figcaption></figure><button class="paper-photo" data-paper="textured" aria-label="Enlarge textured sketch paper photograph"><img src="paper/textured.webp" alt="Close-up photograph of the tooth on cotton sketch paper"><strong>More texture</strong><span>Notice the tiny bumps</span></button><button class="paper-photo" data-paper="smooth" aria-label="Enlarge smoother drawing paper photograph"><img src="paper/smooth.webp" alt="Close-up photograph of a pencil resting on fine-grained, smoother drawing paper"><strong>Smoother surface</strong><span>A finer grain</span></button></div><div class="paper-photo-credit">Two paper samples · Feel both sides of your own sheet.<br><a href="https://www.hahnemuehle.shop/the-collection-sketch/10625161" target="_blank" rel="noopener">Photos: Hahnemühle — Sketch</a> · <a href="https://www.hahnemuehle.shop/en/dessin/10628192" target="_blank" rel="noopener">Dessin</a></div></div>`;
  document.querySelectorAll('[data-paper]').forEach(button=>button.onclick=()=>{voice.pause();const img=$('diagram').querySelector('img');img.src='paper/'+button.dataset.paper+'.webp';img.alt=button.querySelector('img').alt;$('diagram').showModal();});
 }
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
 waiting();$('clipControls').hidden=true;$('media').hidden=true;
 $('visual').innerHTML=overlaySvg(s.overlay,s.frame);
 $('replay').hidden=false;
 window.GuidedUX?.pause(s);speak(s);
}
function createPlayer(s){
 if(uid===s.uid&&player){startClip(s);return;}
 uid=s.uid;$('media').innerHTML='';
 const iframe=document.createElement('iframe');iframe.title='Teacher’s dog drawing demonstration';iframe.allow='autoplay; fullscreen; picture-in-picture';iframe.tabIndex=-1;
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
 player.addEventListener('error',()=>{if(player!==thisPlayer)return;$('notice').hidden=false;$('notice').textContent='The video could not load. Use Replay to try again.';$('replay').hidden=false;});
}
function checkClip(ended=false){
 if(phase!=='watching'||!player)return;
 const s=flow[index], start=s.start||0, end=s.clipEnd, t=Number(player.currentTime);
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
 const s=flow[index];window.GuidedUX?.reset(s);$('back').disabled=index===0;$('skipStep').hidden=index===flow.length-1;$('skipStep').textContent=s.optional?'Skip optional step →':'Skip this step →';$('finishCore').hidden=!s.optional||!flow.some(x=>x.kind==='submit');$('clipControls').hidden=true;save();$('title').textContent=s.title+(s.optional&&!/optional/i.test(s.title)?' · Optional':'');$('hint').textContent=s.hint||'';
 $('notice').hidden=true;$('resume').hidden=true;$('next').disabled=true;$('next').textContent='Continue →';$('replay').hidden=false;
 $('reference').hidden=s.kind!=='draw';$('analysis').hidden=s.kind!=='draw';
 if(s.kind==='draw'){$('referenceImage').src=s.stepResult||s.frame;$('referenceImage').alt='Your drawing after this step';}
 setMode(`${s.chapter.toUpperCase()} · ${index+1} / ${flow.length}`);progress();window.GuidedUX?.stepCounter(flow,index);
 if(s.kind==='draw'){
  phase='watching';setMode('WATCH CLOSELY');$('media').hidden=false;$('visual').innerHTML='';
  createPlayer(s);
 }else if(s.kind==='film'){
  // The intro film carries its own narration and music track -- play it
  // directly and only enable Continue once it has actually finished,
  // rather than routing through the separate voice/TTS narration system.
  phase='film';buildScene(s);window.GuidedUX?.scene(s);
  const v=document.getElementById('introFilm');v.muted=muted;
  v.onended=()=>waiting();
  v.play().catch(()=>{$('resume').hidden=false;$('resume').textContent='Tap to play';});
 }else{
  phase='guidance';buildScene(s);window.GuidedUX?.scene(s);
  if(s.watchAudio)speak({audio:s.watchAudio,say:s.watchSay},()=>{speak(s,()=>{waiting();});});
  else speak(s,()=>{waiting();});
 }
}
function setRewardMuted(value){muted=value;voice.muted=muted;if(player)player.muted=muted;const film=document.getElementById('introFilm');if(film)film.muted=muted;$('sound').textContent=muted?'Sound off':'Sound on';$('sound').setAttribute('aria-pressed',String(muted));$('sound').setAttribute('aria-label',muted?'Enable sound':'Mute sound');}
const STILL_LIFE_PROGRESS_GROUPS=[
 ['still-life-1a-star-balloon-structure'],
 ['still-life-2a-glass-structure'],
 ['still-life-3a-pillow-structure','still-life-3b-pillow-texture'],
 ['still-life-4a-dog-structure'],
 ['still-life-5a-frame-structure'],
];
function next(){
 if($('next').disabled)return;
 mark();
 if(index===flow.length-1){
  // Only the intro + materials + Videos 1-6 are built so far -- hand off
  // to the classic lesson at the next unbuilt video, same staged approach
  // balloon and glass both used while mid-build. Swap this block for the
  // real GuidedReward.complete() ending once all 12 videos are built.
  stopVoice();
  GuidedPlatform.flush().then(()=>{location.href='../?classic=1&from=guided-outline';});
  return;
 }
 index++;enter();
}
$('next').onclick=next;
$('back').onclick=()=>{if(index>0){index--;enter();}};
$('skipStep').onclick=()=>{if(index>=flow.length-1)return;skipped.add(index);unlocked=Math.max(unlocked,index+1);index++;enter();};
$('finishCore').onclick=()=>{let target=flow.findIndex((x,i)=>i>index&&x.kind==='submit');if(target<0)target=flow.findIndex((x,i)=>i>index&&x.kind==='reflect');if(target<0)return;for(let i=index;i<target;i++)if(flow[i].optional)skipped.add(i);unlocked=Math.max(unlocked,target);index=target;enter();};
$('referenceImage').onclick=()=>{$('analysis').onclick();};
$('referenceImage').tabIndex=0;$('referenceImage').setAttribute('role','button');$('referenceImage').setAttribute('aria-label','Enlarge reference image');$('referenceImage').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('analysis').onclick();}};

$('replay').onclick=()=>enter();
$('artchi').onclick=()=>{const s=flow[index];if(s.kind==='draw'&&phase==='watching')return;if(s.kind==='film'){const v=document.getElementById('introFilm');if(v){v.currentTime=0;v.play().catch(()=>{});}return;}speak(s,()=>{if(phase==='guidance')waiting();});};
$('sound').onclick=()=>{muted=!muted;voice.muted=muted;if(player)player.muted=muted||watchVoiceActive;const film=document.getElementById('introFilm');if(film)film.muted=muted;$('sound').textContent=muted?'Sound off':'Sound on';$('sound').setAttribute('aria-pressed',String(muted));$('sound').setAttribute('aria-label',muted?'Enable sound':'Mute sound');};
$('resume').onclick=()=>{$('resume').hidden=true;if(phase==='watching'){resumeTogether();}else if(phase==='film'){document.getElementById('introFilm')?.play().catch(()=>{$('resume').hidden=false;});}else voice.play().catch(()=>{$('resume').hidden=false;});};
function openMap(){
 player?.pause();voice.pause();if(phase==='film')document.getElementById('introFilm')?.pause();$('mapItems').innerHTML='';let chapter='';
 flow.forEach((s,i)=>{
  if(s.chapter!==chapter){chapter=s.chapter;const h=document.createElement('h3');h.textContent=chapter;$('mapItems').append(h);}
  const b=document.createElement('button');b.className='map-step'+(i===index?' current':'');b.disabled=false;
  if(s.frame){const img=document.createElement('img');img.src=s.frame;img.alt='';img.loading='lazy';b.append(img);}
  const label=document.createElement('span');label.textContent=s.title+(s.optional&&!/optional/i.test(s.title)?' · Optional':'')+(skipped.has(i)?' · Skipped':'');b.append(label);const check=document.createElement('b');check.textContent=completed.has(i)?'✓':skipped.has(i)?'↷':String(i+1);b.append(check);
  b.onclick=()=>{$('map').close();index=i;unlocked=Math.max(unlocked,i);enter();};$('mapItems').append(b);
 });$('map').showModal();
}
$('mapButton').onclick=openMap;$('closeMap').onclick=()=>$('map').close();
$('map').addEventListener('close',()=>{if(phase==='film'){$('resume').hidden=false;$('resume').textContent='Resume playback';return;}if(phase!=='watching'&&!voice.ended&&voice.currentTime>0)voice.play().catch(()=>{$('resume').hidden=false;});if(phase==='watching'){$('resume').hidden=false;$('resume').textContent='Resume playback';}});
$('analysis').onclick=()=>{voice.pause();$('diagram').querySelector('img').src=flow[index].frame;$('diagram').showModal();};$('closeDiagram').onclick=()=>$('diagram').close();
$('diagram').addEventListener('close',()=>{if(phase!=='watching'&&!voice.ended&&voice.currentTime>0)voice.play().catch(()=>{$('resume').textContent='Resume guidance';$('resume').hidden=false;});});
document.addEventListener('visibilitychange',()=>{if(document.hidden){player?.pause();voice.pause();if(phase==='film')document.getElementById('introFilm')?.pause();}else if(phase==='film'){$('resume').textContent='Resume playback';$('resume').hidden=false;}else if(phase==='watching'||(voice.src&&!voice.ended)){$('resume').textContent='Resume playback';$('resume').hidden=false;}});
window.addEventListener('pagehide',()=>{player?.pause();stopVoice();document.getElementById('introFilm')?.pause();if(photoURL)URL.revokeObjectURL(photoURL);});

// ── Access gate (Foundation of Sketch, Step 2 — paid) ──
async function gateAccess(){
 try{
  if(window.FEIAccess&&typeof window.FEIAccess.canOpenLesson==='function'){
   const check=await window.FEIAccess.canOpenLesson('skills',LESSON_ID);
   if(check.allowed)return true;
   const home=root;
   if(check.reason==='not_signed_in'){
    const returnTo=encodeURIComponent('lessons/'+LESSON_ID+'/guided/');
    location.href=home+'?signin=required&from='+encodeURIComponent('skills:'+LESSON_ID)+'&returnTo='+returnTo;
   }
   else{location.href=home+'?paywall=skills&lesson='+encodeURIComponent(LESSON_ID);}
   return false;
  }
 }catch(e){console.warn('[dog guided] access check failed, allowing through',e);}
 return true;
}

$('start').onclick=()=>{$('welcome').close();enter();};
$('welcome').addEventListener('cancel',e=>e.preventDefault());

(async function init(){
 const allowed=await GuidedPlatform.allow(LESSON_ID);
 if(!allowed)return;
 $('welcome').showModal();
 fetch('flow.json?v=ux-1').then(r=>{if(!r.ok)throw Error('Flow unavailable');return r.json();}).then(async data=>{
  flow=data;
  try{
   const p=await GuidedPlatform.restore(LESSON_ID,KEY,flow.length);
   // One-time migration: the Meet-your-dog intro was inserted as a new
   // step 0 after some progress may already be saved. A real (non-empty)
   // saved state that predates this still has every index pointing one
   // step too early -- shift it forward once so resuming lands on the
   // same material as before, rather than losing progress or landing on
   // the wrong step. A brand-new (empty) save needs no shift: it already
   // starts correctly at the new step 0.
   if(p&&Object.keys(p).length&&!p.introShifted){
    p.index=(Number(p.index)||0)+1;p.unlocked=(Number(p.unlocked)||0)+1;
    p.completed=(Array.isArray(p.completed)?p.completed:[]).map(i=>i+1);
    p.skipped=(Array.isArray(p.skipped)?p.skipped:[]).map(i=>i+1);
   }
   unlocked=Math.max(0,Math.min(flow.length-1,Number(p.unlocked)||0));index=Math.max(0,Math.min(unlocked,Number(p.index)||0));skipped=new Set(p.skipped||[]);completed=new Set((Array.isArray(p.completed)?p.completed:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<flow.length));
  }catch{}
  $('start').disabled=false;$('start').textContent=index?'Continue your journey →':'Start drawing →';
 }).catch(()=>{$('start').textContent='Could not load · Reload to retry';});
})();
})();
