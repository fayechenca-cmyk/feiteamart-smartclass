/* Guided lesson with account progress, optional practice and in-lesson submission. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const root = '../../../';
const KEY='fei.apple.guided.v1';
const APPLE_REFERENCE='reference-apple.jpg';
let sceneReady=true;
let flow=[], index=0, unlocked=0, completed=new Set(), skipped=new Set(), player=null, uid=null, phase='idle', muted=false, epoch=0, photoURL=null;
let timedCaptions=[];
let playerReady=false,playerFailed=false;
let voiceDone=null, captions=[], lastCaption='', watchdog=null, watchNarrated=false, watchVoiceActive=false;
const voice=$('voice');
let soundContext=null;
const music=$('introMusic');
let musicGain=null;
function introMusic(){
 try{
  soundContext ||= new (window.AudioContext||window.webkitAudioContext)();
  if(!musicGain){musicGain=soundContext.createGain();soundContext.createMediaElementSource(music).connect(musicGain).connect(soundContext.destination);}
  musicGain.gain.setValueAtTime(7,soundContext.currentTime);soundContext.resume();
 }catch{music.volume=1;}
 music.muted=muted;music.currentTime=0;music.play().catch(()=>{});
}
function stopIntroMusic(){if(music.paused)return;if(musicGain&&soundContext){musicGain.gain.setTargetAtTime(0,soundContext.currentTime,.16);setTimeout(()=>music.pause(),600);}else music.pause();}
function chime(){try{soundContext ||= new (window.AudioContext||window.webkitAudioContext)();soundContext.resume();[523.25,659.25,783.99].forEach((hz,i)=>{const o=soundContext.createOscillator(),g=soundContext.createGain(),t=soundContext.currentTime+i*.07;o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g).connect(soundContext.destination);o.start(t);o.stop(t+.28);});}catch{}}
function save(){GuidedPlatform.save({index,unlocked,completed:[...completed],skipped:[...skipped]},KEY);}
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

function stopVoice(){voice.pause();voice.onended=null;voice.onerror=null;voiceDone=null;$('caption').textContent='';captions=[];timedCaptions=[];}
function speak(step,done){
 stopVoice(); voiceDone=done||null;timedCaptions=step.captions||[];
 window.GuidedUX?.narrate(step);if(!step.audio){done?.();return;}
 captions=(step.say.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[step.say]).map(t=>t.trim());
 $('caption').textContent=captions[0]||'';lastCaption='';voice.src=step.audio+(step.audio.includes('?')?'&':'?')+'v=ux-2';voice.muted=muted;
 const token=epoch;
 voice.onended=()=>{if(token!==epoch)return;$('caption').textContent='';const tip=document.querySelector('.teaching-tip strong');if(tip)tip.textContent=step.hint||step.title;const cb=voiceDone;voiceDone=null;cb?.();};
 voice.onerror=()=>{if(token!==epoch)return;$('notice').hidden=false;$('notice').textContent='Voice could not load. The guidance is available below; you can continue.';$('caption').textContent=step.say;if(phase==='watching'){watchVoiceActive=false;if(player)player.muted=true;}else{$('next').disabled=false;phase='waiting';}};
 voice.play().catch(()=>{if(token!==epoch)return;$('resume').hidden=false;$('resume').textContent='Tap to hear your guide';});
}
voice.addEventListener('timeupdate',()=>{
 if(timedCaptions.length){const c=[...timedCaptions].reverse().find(x=>voice.currentTime>=x.time);if(c)$('caption').textContent=c.text;window.GuidedUX?.tick(voice.currentTime);return;}
 if(!captions.length||!isFinite(voice.duration))return;
 const total=captions.reduce((n,t)=>n+t.length,0), pos=voice.currentTime/voice.duration*total;
 let running=0;const c=captions.find(t=>(running+=t.length)>pos)||captions.at(-1);
 if(c!==lastCaption){$('caption').textContent=c;lastCaption=c;}window.GuidedUX?.tick(voice.currentTime);
});
function setMode(text){$('mode').textContent=text;}
function waiting(){phase='waiting';setMode('YOUR TURN · TAKE YOUR TIME');$('next').disabled=false;$('next').textContent=index===flow.length-1?'Celebrate →':'Continue →';}
function appleReady(){sceneReady=true;if(phase==='waiting'){$('next').disabled=false;}else if(phase==='guidance'&&(voice.ended||!voice.src))waiting();}
function buildScene(s){
 $('media').hidden=true;$('visual').innerHTML='';
 if(s.kind==='photo'||s.kind==='chapter'){
 $('visual').innerHTML=`<div class="prep-photos"><img src="${s.image}" alt="${s.title}">${s.second?`<img src="${s.second}" alt="Alternative comfortable pencil grip">`:''}</div>`;
 }else if(s.kind==='milestone'){
 $('visual').innerHTML=`<div class="scene encouragement"><img src="../../../core/dashboard-artchi.svg" alt="Artchi"><div class="milestone-star">✦</div><h2>${s.hint}</h2><p>One step at a time.</p></div>`;
 if(!muted&&!completed.has(index))chime();
 }else if(s.kind==='submit'){
 window.GuidedSubmit.mount($('visual'),{lessonId:'apple',title:'The Apple',onPhoto:url=>{photoURL=url}});
 }else if(s.kind==='reflect'){
 $('visual').innerHTML=`<div class="scene"><img class="upload-preview" src="${photoURL||s.image}" alt="An apple drawing to reflect on"><p>What do you notice now?</p><textarea aria-label="Optional reflection" placeholder="A thought to keep… (optional)"></textarea></div>`;
 }else if(s.kind==='appleRotate'||s.kind==='appleNotice'){
   sceneReady=false;window.AppleIntro.mount($('visual'),s.kind,appleReady);
 }

}
function showPattern(s){
 $('patternReference').hidden=true;$('referenceImage').hidden=false;
 $('reference').hidden=s.kind!=='draw';$('alternateAnalysis').hidden=!s.analysisB;
 if(s.kind==='draw'){$('referenceImage').src=APPLE_REFERENCE;$('referenceImage').alt='Teacher’s finished apple drawing';}
}
function beginWatchVoice(){
 const s=flow[index];if(!s.watchAudio||watchNarrated||phase!=='watching'||player.paused)return;
 watchNarrated=true;watchVoiceActive=true;player.muted=true;
 speak({audio:s.watchAudio,say:s.watchSay},()=>{watchVoiceActive=false;if(player)player.muted=true;});
}
function playbackState(paused){
 $('videoTap').setAttribute('aria-label',paused?'Play teacher video':'Pause teacher video');
 $('playPause').textContent=paused?'▶':'Ⅱ';$('playPause').setAttribute('aria-label',paused?'Play demonstration':'Pause demonstration');
 $('resume').hidden=true;
}
function resumeTogether(){
 if(!playerReady||playerFailed){uid=null;createPlayer(flow[index]);return;}
 playbackState(false);
 if(watchVoiceActive&&!voice.ended)voice.play().catch(()=>{});
 Promise.resolve(player?.play()).catch(()=>showNativePlayHint());
}
function showNativePlayHint(){if(phase!=='watching')return;$('resume').hidden=true;$('notice').hidden=false;$('notice').textContent='Tap the play button in the video to watch your teacher.';}
function finishClip(){
 if(phase!=='watching')return;
 player?.pause();clearTimeout(watchdog);stopVoice();watchVoiceActive=false;
 const s=flow[index];
 if(s.kind==='intro'){mark();index++;enter();return;}
 waiting();$('videoTap').hidden=true;$('resume').hidden=true;$('clipControls').hidden=true;$('media').hidden=true;$('visual').innerHTML=`<img src="${s.frame}" alt="${s.title}: teacher’s drawing at this checkpoint">`;
 $('referenceImage').src=APPLE_REFERENCE; $('referenceImage').alt='Teacher’s finished apple drawing'; $('analysis').hidden=false;$('alternateAnalysis').hidden=!s.analysisB;$('replay').hidden=false;
 window.GuidedUX?.pause(s);speak(s);
}

function createPlayer(s){
 const identity=s.uid||s.src;
 if(uid===identity&&player&&playerReady&&!playerFailed){startClip(s);return;}
 uid=identity;playerReady=false;playerFailed=false;$('videoTap').hidden=true;$('media').innerHTML='';$('notice').textContent='Loading teacher video…';$('notice').hidden=false;
 const media=document.createElement(s.src?'video':'iframe');
 media.title='Teacher’s apple demonstration';media.tabIndex=-1;
 if(s.src){media.src=s.src;media.playsInline=true;media.preload='auto';media.controls=true;media.muted=true;const track=document.createElement('track');track.kind='captions';track.label='English';track.srclang='en';track.src='../intro/captions.vtt';track.default=true;track.addEventListener('load',()=>{track.track.mode='hidden';track.track.oncuechange=()=>{if(player===media&&phase==='watching')$('caption').textContent=Array.from(track.track.activeCues||[]).map(c=>c.text).join(' ');};});media.append(track);}
 else {media.allow='autoplay; fullscreen; picture-in-picture';media.src=`https://customer-a78os4oj56dr67ab.cloudflarestream.com/${s.uid}/iframe?autoplay=false&muted=true&controls=true&preload=auto`;}
 $('media').append(media);
 if(!s.src&&typeof Stream!=='function'){$('notice').hidden=false;$('notice').textContent='The video player could not load. Check your connection and reload to try again.';$('resume').textContent='Reload video';$('resume').hidden=false;playerFailed=true;return;}
 player=s.src?media:Stream(media);const thisPlayer=player;
 player.muted=true;
 player.addEventListener('volumechange',()=>{if(player===thisPlayer&&!player.muted)player.muted=true;});
 player.addEventListener('loadedmetadata',()=>{if(player===thisPlayer&&!playerReady&&(flow[index].uid||flow[index].src)===identity){playerReady=true;clearTimeout(watchdog);$('notice').hidden=true;startClip(flow[index]);}});
 player.addEventListener('timeupdate',()=>{if(player===thisPlayer)checkClip();});
 player.addEventListener('pause',()=>{if(player===thisPlayer&&phase==='watching'){if(watchVoiceActive)voice.pause();playbackState(true);}});
 player.addEventListener('waiting',()=>{if(player===thisPlayer&&watchVoiceActive)voice.pause();});
 player.addEventListener('playing',()=>{if(player===thisPlayer&&phase==='watching'){$('notice').hidden=true;playbackState(false);}if(player===thisPlayer&&watchVoiceActive&&voice.paused)voice.play().catch(()=>{});});
 player.addEventListener('ended',()=>{if(player===thisPlayer)checkClip(true);});
 player.addEventListener('play',()=>{if(player===thisPlayer){clearTimeout(watchdog);$('resume').hidden=true;$('playPause').textContent='Ⅱ';$('playPause').setAttribute('aria-label','Pause demonstration');}});
 player.addEventListener('error',()=>{if(player!==thisPlayer)return;playerFailed=true;playerReady=false;$('resume').textContent='Reload video';$('resume').hidden=false;$('notice').hidden=false;$('notice').textContent='The teacher video could not load. Use Replay to try again.';$('replay').hidden=false;});
 clearTimeout(watchdog);watchdog=setTimeout(()=>{if(player===thisPlayer&&!playerReady&&phase==='watching'){playerFailed=true;$('notice').textContent='Video is taking longer to load. Tap Reload video to retry.';$('resume').textContent='Reload video';$('resume').hidden=false;}},15000);
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
$('videoTap').onclick=()=>{$('playPause').onclick();};
$('clipSeek').oninput=()=>{if(!player||phase!=='watching')return;const s=flow[index];player.currentTime=Math.max(s.start||0,Math.min(s.clipEnd-.15,Number($('clipSeek').value)));};
function startClip(s){
 phase='watching';$('videoTap').hidden=true;$('media').hidden=false;$('visual').innerHTML='';$('resume').hidden=true;
 $('clipControls').hidden=false;$('clipSeek').min=s.start||0;$('clipSeek').max=s.clipEnd-.15;$('clipSeek').value=s.start||0;$('clipTime').textContent=`0 / ${Math.ceil(s.clipEnd-(s.start||0))}s`;
 watchNarrated=false;watchVoiceActive=false;player.muted=true;player.currentTime=s.start||0;
 const token=epoch;
 Promise.resolve(player.play()).catch(()=>{if(token===epoch)showNativePlayHint();});
 clearTimeout(watchdog);watchdog=setTimeout(()=>{if(token===epoch&&phase==='watching'&&player.paused)showNativePlayHint();},5000);
}
function enter(){
 epoch++;$('videoTap').hidden=true;$('stepPreview').textContent='';sceneReady=true;clearTimeout(watchdog);stopVoice();player?.pause();
 const s=flow[index];window.GuidedUX?.reset(s);$('back').disabled=index===0;$('skipStep').hidden=index===flow.length-1;$('skipStep').textContent='Skip this step →';$('finishCore').hidden=true;$('skip').hidden=true;$('clipControls').hidden=true;save();$('title').textContent=s.title;$('hint').textContent=s.hint||'';
 if(index>2)stopIntroMusic();
 $('notice').hidden=true;$('resume').hidden=true;$('next').disabled=true;$('next').textContent='Continue →';$('replay').hidden=false;
 $('reference').hidden=true;$('analysis').hidden=s.kind!=='draw';showPattern(s);
 setMode(`${s.chapter.toUpperCase()} · ${index+1} / ${flow.length}`);progress();window.GuidedUX?.stepCounter(flow,index);
 if(s.kind==='intro'||s.kind==='draw'){
  phase='watching';setMode('WATCH WITH YOUR TEACHER');$('media').hidden=false;$('visual').innerHTML='';
  if(s.kind==='draw'){$('referenceImage').src=APPLE_REFERENCE;$('referenceImage').alt='Teacher’s finished apple drawing';}
  createPlayer(s);
 }else{
  phase='guidance';buildScene(s);window.GuidedUX?.scene(s);
  // Observation and light stay hands-on. Other scenes wait for the learner after guidance.
  speak(s,()=>{if(sceneReady)waiting();else setMode(s.kind==='appleRotate'?'YOUR TURN · TURN THE APPLE':'YOUR TURN · FIND THE THREE CLUES');});
  if(s.kind==='badge'){$('next').textContent='Celebrate →';}
 }
}
function next(){
 if($('next').disabled)return;
 mark();
 if(flow[index].coreComplete)GuidedPlatform.complete('apple');
 if(index===flow.length-1){stopVoice();GuidedPlatform.complete('apple');window.GuidedReward.complete({lessonId:'apple',title:'The Apple',nextLabel:'Return to the course map →',muted,onMutedChange:setMuted}).then(async go=>{await GuidedPlatform.flush();if(go)location.href='../../../#dashboard/courses/foundation-map';});return;}
 index++;enter();
}
$('next').onclick=next;
$('back').onclick=()=>{if(index>0){index--;enter();}};
$('skipStep').onclick=()=>{if(index>=flow.length-1)return;skipped.add(index);unlocked=Math.max(unlocked,index+1);index++;enter();};
$('finishCore').onclick=()=>{let target=index+1;while(target<flow.length&&flow[target].optional){skipped.add(target);target++;}if(flow[index].optional)skipped.add(index);if(target>=flow.length)return;unlocked=Math.max(unlocked,target);index=target;enter();};
$('referenceImage').onclick=()=>{$('analysis').onclick();};
$('referenceImage').tabIndex=0;$('referenceImage').setAttribute('role','button');$('referenceImage').setAttribute('aria-label','Enlarge reference image');$('referenceImage').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('analysis').onclick();}};

$('skip').textContent='Skip optional finishing';$('skip').onclick=()=>{if(!flow[index].optional)return;index=flow.findIndex(s=>s.kind==='reflect');unlocked=Math.max(unlocked,index);enter();};
$('replay').onclick=()=>{if(playerFailed){uid=null;playerReady=false;}enter();};
$('artchi').onclick=()=>{const s=flow[index];if(s.kind==='draw'&&phase==='watching')return;speak(s,()=>{if(phase==='guidance'&&sceneReady)waiting();});};
function setMuted(value){muted=value;voice.muted=muted;music.muted=muted;if(player)player.muted=true;$('sound').textContent=muted?'Sound off':'Sound on';$('sound').setAttribute('aria-pressed',String(muted));$('sound').setAttribute('aria-label',muted?'Enable sound':'Mute sound');}
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
  b.onclick=()=>{$('map').close();jumpToStep(i);};$('mapItems').append(b);
 });$('map').showModal();
}
$('mapButton').onclick=openMap;$('closeMap').onclick=()=>$('map').close();
$('map').addEventListener('close',()=>{if(phase!=='watching'&&!voice.ended&&voice.currentTime>0)voice.play().catch(()=>{$('resume').hidden=false;});if(phase==='watching'){$('resume').hidden=false;$('resume').textContent='Resume playback';}});
$('alternateAnalysis').onclick=()=>{const s=flow[index];$('referenceImage').src=$('referenceImage').getAttribute('src')===s.analysisB?s.analysis:s.analysisB;const mainAnalysis=document.querySelector('.analysis-stage img');if(mainAnalysis)mainAnalysis.src=$('referenceImage').src;};
$('analysis').onclick=()=>{player?.pause();voice.pause();$('diagram').querySelector('img').src=$('referenceImage').src;$('diagram').showModal();};$('closeDiagram').onclick=()=>$('diagram').close();
$('diagram').addEventListener('close',()=>{if(phase==='watching'){$('resume').textContent='Resume playback';$('resume').hidden=false;}if(phase!=='watching'&&!voice.ended&&voice.currentTime>0)voice.play().catch(()=>{$('resume').textContent='Resume guidance';$('resume').hidden=false;});});
document.addEventListener('visibilitychange',()=>{if(document.hidden){player?.pause();voice.pause();}else if(phase==='watching'||(voice.src&&!voice.ended)){$('resume').textContent='Resume playback';$('resume').hidden=false;}});
window.addEventListener('pagehide',()=>{player?.pause();stopVoice();music.pause();if(photoURL)URL.revokeObjectURL(photoURL);});
$('start').onclick=()=>{$('welcome').close();if(index<=2)introMusic();enter();};
$('welcome').addEventListener('cancel',e=>e.preventDefault());
(async()=>{if(!await GuidedPlatform.allow('apple'))return; $('welcome').showModal();
fetch('flow.json?v=apple-1').then(r=>{if(!r.ok)throw Error('Flow unavailable');return r.json();}).then(async data=>{
 flow=data;
 try{ const p=await GuidedPlatform.restore('apple',KEY,flow.length,{classicStepMap:['welcome','notice','rotate','tools','tools','video-1-1','video-2-end','video-3-1','video-4-1','video-5-1','submit','reflect','complete'].map(id=>flow.findIndex(s=>s.id===id)),classicCompletedAt:12});unlocked=Math.max(0,Math.min(flow.length-1,Number(p.unlocked)||0));index=Math.max(0,Math.min(unlocked,Number(p.index)||0));skipped=new Set(p.skipped||[]);completed=new Set((Array.isArray(p.completed)?p.completed:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<flow.length));}catch{}
 $('start').disabled=false;$('start').textContent=index?'Continue your apple →':'Let’s draw an apple →';
}).catch(()=>{$('start').textContent='Could not load · Reload to retry';});
})();
})();
