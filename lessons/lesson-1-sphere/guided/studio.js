/* Guided lesson with account progress, optional practice and in-lesson submission. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const root = '../../../';
const KEY='fei.sphere.guided-preview.v1';
let sceneReady=true;
let flow=[], index=0, unlocked=0, completed=new Set(), skipped=new Set(), player=null, uid=null, phase='idle', muted=false, epoch=0, photoURL=null;
let voiceDone=null, captions=[], lastCaption='', watchdog=null, watchNarrated=false, watchVoiceActive=false;
const voice=$('voice');
let soundContext=null;
function chime(){try{soundContext ||= new (window.AudioContext||window.webkitAudioContext)();soundContext.resume();[523.25,659.25,783.99].forEach((hz,i)=>{const o=soundContext.createOscillator(),g=soundContext.createGain(),t=soundContext.currentTime+i*.07;o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g).connect(soundContext.destination);o.start(t);o.stop(t+.28);});}catch{}}
function save(){GuidedPlatform.save({index,unlocked,completed:[...completed],skipped:[...skipped]},KEY);}
function mark(){if(!completed.has(index)&&!muted)chime();completed.add(index);unlocked=Math.max(unlocked,Math.min(flow.length-1,index+1));save();progress();}
function progress(){ $('progress').innerHTML=flow.map((s,i)=>`<span class="${i===index?'current':completed.has(i)?'done':skipped.has(i)?'skipped':''}" title="${s.title}"></span>`).join(''); }
function stopVoice(){voice.pause();voice.onended=null;voice.onerror=null;voiceDone=null;$('caption').textContent='';captions=[];}
function speak(step,done){
 stopVoice(); voiceDone=done||null;
 window.GuidedUX?.narrate(step);if(!step.audio){done?.();return;}
 captions=(step.say.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[step.say]).map(t=>t.trim());
 $('caption').textContent=captions[0]||'';lastCaption='';voice.src=step.audio+(step.audio.includes('?')?'&':'?')+'v=ux-2';voice.muted=muted;
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
function buildScene(s){
 $('media').hidden=true;$('visual').innerHTML='';
 if(s.kind==='photo'){
 $('visual').innerHTML=`<div class="prep-photos"><img src="${s.image}" alt="${s.title}">${s.second?`<img src="${s.second}" alt="Alternative comfortable pencil grip">`:''}</div>`;
 }else if(s.kind==='milestone'){
 $('visual').innerHTML=`<div class="scene encouragement"><img src="../../../core/dashboard-artchi.svg" alt="Artchi"><div class="milestone-star">✦</div><h2>${s.hint}</h2><p>One step at a time.</p></div>`;
 if(!muted&&!completed.has(index))chime();
 }else if(s.kind==='zones'||s.kind==='sphereLight'){
 const interactive=s.kind==='sphereLight';
 $('visual').innerHTML=`<div class="scene sphere-scene"><svg viewBox="0 0 800 450" role="img" aria-label="Light wrapping a sphere, with reflected light and a cast shadow"><defs><radialGradient id="sphereTone" cx="30%" cy="25%" r="72%"><stop offset="0" stop-color="#fffef9"/><stop offset=".27" stop-color="#e4e2dc"/><stop offset=".62" stop-color="#91918f"/><stop offset=".85" stop-color="#36343c"/><stop offset="1" stop-color="#77747f"/></radialGradient></defs><ellipse id="sphereShadow" cx="460" cy="361" rx="150" ry="25" fill="#34303e" opacity=".35"/><circle cx="390" cy="215" r="140" fill="url(#sphereTone)"/><ellipse cx="405" cy="356" rx="59" ry="8" fill="#28242e" opacity=".65"/><circle id="zoneRing" cx="345" cy="155" r="25" fill="none" stroke="#b39bda" stroke-width="5"/><g id="sphereSun" ${interactive?'':'visibility="hidden"'}><circle cx="125" cy="65" r="22" fill="#efc76f"/><path d="M155 80l60 35" stroke="#efc76f" stroke-width="4"/></g></svg>${interactive?'<label for="sphereSlider">Move the sun</label><input id="sphereSlider" type="range" min="0" max="100" value="15" aria-label="Move the light across the sphere">':'<div class="zone-buttons">'+['Highlight','Halftone','Terminator','Core shadow','Reflected light','Cast shadow'].map((x,i)=>`<button data-zone="${i}" aria-pressed="${i===0}">${x}</button>`).join('')+'</div>'}</div>`;
 if(interactive){sceneReady=false;$('zoneRing').setAttribute('visibility','hidden');$('sphereSlider').oninput=e=>{const t=Number(e.target.value)/100;$('sphereTone').setAttribute('cx',`${20+t*60}%`);$('sphereSun').setAttribute('transform',`translate(${t*530} 0)`);$('sphereShadow').setAttribute('cx',String(485-t*180));sceneReady=true;if(voice.ended||muted)waiting();};}
 else{const spots=[[345,155],[390,120],[475,220],[490,265],[505,290],[495,365]];document.querySelectorAll('[data-zone]').forEach(button=>button.onclick=()=>{const i=Number(button.dataset.zone);$('zoneRing').setAttribute('cx',spots[i][0]);$('zoneRing').setAttribute('cy',spots[i][1]);document.querySelectorAll('[data-zone]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('hint').textContent=button.textContent;});}
 }else if(s.kind==='submit'){
 window.GuidedSubmit.mount($('visual'),{lessonId:'sphere',title:'The Sphere',onPhoto:url=>{photoURL=url}});
 }else if(s.kind==='reflect'){
 $('visual').innerHTML=`<div class="scene"><img class="upload-preview" src="${photoURL||s.image}" alt="A sphere drawing to reflect on"><p>What do you notice now?</p><textarea aria-label="Optional reflection" placeholder="A thought to keep… (optional)"></textarea></div>`;
 }

}
function showPattern(s){
 $('patternReference').hidden=true;$('referenceImage').hidden=false;
 $('reference').hidden=s.kind!=='draw';$('alternateAnalysis').hidden=!s.analysisB;
 if(s.kind==='draw'){$('referenceImage').src=s.frame;$('referenceImage').alt=s.title+' — teacher reference';}
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
 $('referenceImage').src=s.analysis||s.frame; $('referenceImage').alt=s.analysis?'Teaching diagram for '+s.title:s.title+' — stage reference'; $('analysis').hidden=false;$('alternateAnalysis').hidden=!s.analysisB;$('replay').hidden=false;
 window.GuidedUX?.pause(s);speak(s);
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
 epoch++;sceneReady=true;clearTimeout(watchdog);stopVoice();player?.pause();
 const s=flow[index];window.GuidedUX?.reset(s);$('back').disabled=index===0;$('skipStep').hidden=index===flow.length-1;$('skipStep').textContent=s.optional?'Skip optional step →':'Skip this step →';$('finishCore').hidden=!s.optional||!flow.some(x=>x.kind==='submit');$('skip').hidden=true;$('clipControls').hidden=true;save();$('title').textContent=s.title+(s.optional&&!/optional/i.test(s.title)?' · Optional':'');$('hint').textContent=s.hint||'';
 $('notice').hidden=true;$('resume').hidden=true;$('next').disabled=true;$('next').textContent='Continue →';$('replay').hidden=false;
 $('reference').hidden=true;$('analysis').hidden=s.kind!=='draw';showPattern(s);
 setMode(`${s.chapter.toUpperCase()} · ${index+1} / ${flow.length}`);progress();
 if(s.kind==='intro'||s.kind==='draw'){
  phase='watching';setMode('WATCH WITH YOUR TEACHER');$('media').hidden=false;$('visual').innerHTML='';
  if(s.kind==='draw'){$('referenceImage').src=s.frame;$('referenceImage').alt=s.title+' — stage reference';}
  createPlayer(s);
 }else{
  phase='guidance';buildScene(s);window.GuidedUX?.scene(s);
  // Observation and light stay hands-on. Other scenes wait for the learner after guidance.
  speak(s,()=>{if(sceneReady)waiting();else setMode('YOUR TURN · MOVE THE SUN');});
  if(s.kind==='badge'){$('next').textContent='Celebrate →';}
 }
}
function next(){
 if($('next').disabled)return;
 mark();
 if(flow[index].coreComplete)GuidedPlatform.complete('sphere');
 if(index===flow.length-1){stopVoice();GuidedPlatform.complete('sphere');window.GuidedReward.complete({lessonId:'sphere',title:'The Sphere',nextLabel:'Continue to The Cylinder →',muted,onMutedChange:setMuted}).then(async go=>{await GuidedPlatform.flush();if(go)location.href='../../lesson-5-cylinder/';});return;}
 index++;enter();
}
$('next').onclick=next;
$('back').onclick=()=>{if(index>0){index--;enter();}};
$('skipStep').onclick=()=>{if(index>=flow.length-1)return;skipped.add(index);unlocked=Math.max(unlocked,index+1);index++;enter();};
$('finishCore').onclick=()=>{let target=flow.findIndex((x,i)=>i>index&&x.kind==='submit');if(target<0)target=flow.findIndex((x,i)=>i>index&&x.kind==='reflect');if(target<0)return;for(let i=index;i<target;i++)if(flow[i].optional)skipped.add(i);unlocked=Math.max(unlocked,target);index=target;enter();};
$('referenceImage').onclick=()=>{$('analysis').onclick();};
$('referenceImage').tabIndex=0;$('referenceImage').setAttribute('role','button');$('referenceImage').setAttribute('aria-label','Enlarge reference image');$('referenceImage').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('analysis').onclick();}};

$('skip').textContent='Skip optional finishing';$('skip').onclick=()=>{if(!flow[index].optional)return;index=flow.findIndex(s=>s.kind==='reflect');unlocked=Math.max(unlocked,index);enter();};
$('replay').onclick=()=>enter();
$('artchi').onclick=()=>{const s=flow[index];if(s.kind==='draw'&&phase==='watching')return;speak(s,()=>{if(phase==='guidance'&&sceneReady)waiting();});};
function setMuted(value){muted=value;voice.muted=muted;if(player)player.muted=muted||watchVoiceActive;$('sound').textContent=muted?'Sound off':'Sound on';$('sound').setAttribute('aria-pressed',String(muted));$('sound').setAttribute('aria-label',muted?'Enable sound':'Mute sound');}
$('sound').onclick=()=>setMuted(!muted);
$('resume').onclick=()=>{$('resume').hidden=true;if(phase==='watching'){resumeTogether();}else voice.play().catch(()=>{$('resume').hidden=false;});};
function openMap(){
 player?.pause();voice.pause();$('mapItems').innerHTML='';let chapter='';
 flow.forEach((s,i)=>{
  if(s.chapter!==chapter){chapter=s.chapter;const h=document.createElement('h3');h.textContent=chapter+(s.optional&&!/optional/i.test(chapter)?' · Optional':'');$('mapItems').append(h);}
  const b=document.createElement('button');b.className='map-step'+(i===index?' current':'');b.disabled=false;
  // Optional refinements can be bypassed only after the core drawing is finished.

  if(s.frame){const img=document.createElement('img');img.src=s.frame;img.alt='';img.loading='lazy';b.append(img);}
  const label=document.createElement('span');label.textContent=s.title+(s.optional&&!/optional/i.test(s.title)?' · Optional':'')+(skipped.has(i)?' · Skipped':'');b.append(label);const check=document.createElement('b');check.textContent=completed.has(i)?'✓':skipped.has(i)?'↷':String(i+1);b.append(check);
  b.onclick=()=>{$('map').close();index=i;unlocked=Math.max(unlocked,i);enter();};$('mapItems').append(b);
 });$('map').showModal();
}
$('mapButton').onclick=openMap;$('closeMap').onclick=()=>$('map').close();
$('map').addEventListener('close',()=>{if(phase!=='watching'&&!voice.ended&&voice.currentTime>0)voice.play().catch(()=>{$('resume').hidden=false;});if(phase==='watching'){$('resume').hidden=false;$('resume').textContent='Resume playback';}});
$('alternateAnalysis').onclick=()=>{const s=flow[index];$('referenceImage').src=$('referenceImage').getAttribute('src')===s.analysisB?s.analysis:s.analysisB;const mainAnalysis=document.querySelector('.analysis-stage img');if(mainAnalysis)mainAnalysis.src=$('referenceImage').src;};
$('analysis').onclick=()=>{voice.pause();$('diagram').querySelector('img').src=$('referenceImage').src;$('diagram').showModal();};$('closeDiagram').onclick=()=>$('diagram').close();
$('diagram').addEventListener('close',()=>{if(phase!=='watching'&&!voice.ended&&voice.currentTime>0)voice.play().catch(()=>{$('resume').textContent='Resume guidance';$('resume').hidden=false;});});
document.addEventListener('visibilitychange',()=>{if(document.hidden){player?.pause();voice.pause();}else if(phase==='watching'||(voice.src&&!voice.ended)){$('resume').textContent='Resume playback';$('resume').hidden=false;}});
window.addEventListener('pagehide',()=>{player?.pause();stopVoice();if(photoURL)URL.revokeObjectURL(photoURL);});
$('start').onclick=()=>{$('welcome').close();enter();};
$('welcome').addEventListener('cancel',e=>e.preventDefault());
(async()=>{if(!await GuidedPlatform.allow('sphere'))return; $('welcome').showModal();
fetch('flow.json?v=ux-2').then(r=>{if(!r.ok)throw Error('Flow unavailable');return r.json();}).then(async data=>{
 flow=data;
 try{ const p=await GuidedPlatform.restore('sphere',KEY,flow.length);unlocked=Math.max(0,Math.min(flow.length-1,Number(p.unlocked)||0));index=Math.max(0,Math.min(unlocked,Number(p.index)||0));skipped=new Set(p.skipped||[]);completed=new Set((Array.isArray(p.completed)?p.completed:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<flow.length));}catch{}
 $('start').disabled=false;$('start').textContent=index?'Continue your sphere →':'Let’s draw a sphere →';
}).catch(()=>{$('start').textContent='Could not load · Reload to retry';});
})();
})();
