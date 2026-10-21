/* Guided lesson with account progress, optional practice and in-lesson submission. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const root = '../../../';
const KEY='fei.box.guided.v1';
let sceneReady=true;
let flow=[], index=0, unlocked=0, completed=new Set(), skipped=new Set(), player=null, uid=null, phase='idle', muted=false, epoch=0, photoURL=null;
let timedCaptions=[];
let playerReady=false,playerFailed=false;
let voiceDone=null, captions=[], lastCaption='', watchdog=null, watchNarrated=false, watchVoiceActive=false;
let activeMoment=null, seenMoments=new Set();
const voice=$('voice');
const music=$('introMusic');
let musicGain=null;
function introMusic(){try{soundContext ||= new (window.AudioContext||window.webkitAudioContext)();if(!musicGain){musicGain=soundContext.createGain();soundContext.createMediaElementSource(music).connect(musicGain).connect(soundContext.destination);}musicGain.gain.setValueAtTime(2,soundContext.currentTime);soundContext.resume();}catch{music.volume=1;}music.muted=muted;music.currentTime=0;music.play().catch(()=>{});}
function stopIntroMusic(){if(music.paused)return;if(musicGain&&soundContext){musicGain.gain.setTargetAtTime(0,soundContext.currentTime,.16);setTimeout(()=>music.pause(),600);}else music.pause();}
let soundContext=null;
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
 if(timedCaptions.length){const c=[...timedCaptions].reverse().find(x=>voice.currentTime>=x.time);if(c)$('caption').textContent=c.text;window.GuidedUX?.tick(voice.currentTime);const tool=document.getElementById('boxTool');if(tool)tool.hidden=voice.currentTime<(flow[index].toolTime||0);return;}
 if(!captions.length||!isFinite(voice.duration))return;
 const total=captions.reduce((n,t)=>n+t.length,0), pos=voice.currentTime/voice.duration*total;
 let running=0;const c=captions.find(t=>(running+=t.length)>pos)||captions.at(-1);
 if(c!==lastCaption){$('caption').textContent=c;lastCaption=c;}window.GuidedUX?.tick(voice.currentTime);
});
function setMode(text){$('mode').textContent=text;}
function waiting(){phase='waiting';setMode('YOUR TURN · TAKE YOUR TIME');$('next').disabled=false;$('next').textContent=index===flow.length-1?'Celebrate →':flow[index].kind==='submit'?'Try optional background →':'Continue →';}
function buildScene(s){
 $('media').hidden=true;$('visual').innerHTML='';
 if(s.kind==='giftIntro'){
 $('visual').innerHTML=`<div class="gift-intro"><figure><img src="reference-giftbox.png" alt="Real lilac gift box with ribbon and bow"><figcaption>THE REAL GIFT</figcaption></figure><div class="intro-question">A box or a bag?<span>Look beneath the bow ✦</span></div></div>`;
 }else if(s.kind==='compare'){
 $('visual').innerHTML=`<div class="gift-compare"><figure><img src="${s.image}" alt="${s.id==='cube-connection'?'Your earlier cube drawing':'Real gift box reference'}"><figcaption>${s.id==='cube-connection'?'REMEMBER THE CUBE':'REAL GIFT BOX'}</figcaption></figure><span class="compare-arrow" aria-hidden="true">➜</span><figure><img src="${s.second}" alt="${s.id==='cube-connection'?'Gift box with stretched cube proportions':'Teacher’s gift box drawing'}"><figcaption>${s.id==='cube-connection'?'STRETCH THE FORM':'TEACHER’S DRAWING'}</figcaption></figure></div>`;
 }else if(s.kind==='photo'){
 $('visual').innerHTML=`<div class="prep-photos"><img src="${s.image}" alt="${s.title}">${s.second?`<img src="${s.second}" alt="Alternative comfortable pencil grip">`:''}</div>`;
 }else if(s.kind==='milestone'){
 $('visual').innerHTML=`<div class="scene encouragement"><img src="../../../core/dashboard-artchi.svg" alt="Artchi"><div class="milestone-star">✦</div><h2>${s.hint}</h2><p>One step at a time.</p></div>`;
 if(!muted&&!completed.has(index))chime();
 }else if(s.kind==='submit'){
 window.GuidedSubmit.mount($('visual'),{lessonId:'box',title:'Gift Box',onPhoto:url=>{photoURL=url}});
 }else if(s.kind==='reflect'){
 $('visual').innerHTML=`<div class="scene"><img class="upload-preview" src="${photoURL||s.image}" alt="A gift box drawing to reflect on"><p>What do you notice now?</p><textarea aria-label="Optional reflection" placeholder="A thought to keep… (optional)"></textarea></div>`;
 }

}
function showPattern(s){
 $('patternReference').hidden=true;$('referenceImage').hidden=false;
 $('reference').hidden=s.kind!=='draw';$('alternateAnalysis').hidden=!s.analysisB;
 if(s.kind==='draw'){$('referenceImage').src='reference-giftbox.png';$('referenceImage').alt='Real gift box reference for drawing';}
}
function beginWatchVoice(){
 const s=flow[index];if(!s.watchAudio||watchNarrated||phase!=='watching'||player.paused)return;
 watchNarrated=true;watchVoiceActive=true;player.muted=true;
 speak({audio:s.watchAudio,say:s.watchSay},()=>{watchVoiceActive=false;if(player)player.muted=true;});
}
function playbackState(paused){
 $('videoTap').setAttribute('aria-label',paused?'Play teacher video':'Pause teacher video');
 $('playPause').textContent=paused?'▶':'Ⅱ';$('playPause').setAttribute('aria-label',paused?'Play demonstration':'Pause demonstration');
 $('resume').textContent='Tap to play';$('resume').hidden=!paused;
}
const momentArt={
 'outer-marks':'<circle cx="151" cy="111" r="10"/><circle cx="318" cy="111" r="10"/><circle cx="237" cy="46" r="10"/><circle cx="237" cy="189" r="10"/>',
 'lid-marks':'<circle cx="268" cy="46" r="10"/><circle cx="317" cy="82" r="10"/><path d="M268 46 L317 82"/>',
 'base-v':'<path d="M149 77 L183 189 L315 170"/><circle cx="183" cy="189" r="9"/>',
 'top-angle':'<path d="M149 77 L315 46"/><circle cx="149" cy="77" r="7"/><circle cx="315" cy="46" r="7"/>',
 'uprights':'<path d="M149 76 L150 150 M183 147 L183 190 M316 129 L315 180"/>',
 'measure-again':'<path d="M149 77 L315 46 M183 190 L315 170"/><circle cx="149" cy="77" r="7"/><circle cx="315" cy="170" r="7"/>',
 'lid-thickness':'<path d="M182 145 L309 130 L309 146 L182 161 Z"/><path d="M150 69 L182 145"/>',
 'ribbon-perspective':'<path d="M199 65 L233 137 M217 63 L251 135 M157 99 L281 82 M162 113 L286 97"/>',
 'ribbon-wrap':'<path d="M232 145 L251 143 L251 179 L232 181 Z"/>',
 'star-over-guides':'<circle cx="223" cy="139" r="24"/><path d="M201 139 H245 M223 116 V162"/>',
 'pentagon-star':'<path d="M223 115 L245 132 L237 157 L209 157 L201 132 Z"/><path d="M223 115 L228 132 L245 132 L231 142 L237 157 L223 148 L209 157 L215 142 L201 132 L218 132 Z"/>',
 'soft-star':'<path d="M223 115 Q227 115 230 130 Q234 131 245 132 Q247 135 232 144 Q236 154 237 157 Q233 161 223 150 Q213 161 209 157 Q210 152 214 144 Q199 134 201 132 Q207 130 216 131 Q220 116 223 115 Z"/>'
};
function showMoment(moment){
 if(activeMoment||phase!=='watching')return;
 activeMoment=moment;seenMoments.add(moment.id);player?.pause();$('resume').hidden=true;$('clipControls').hidden=true;
 const overlay=document.createElement('div');overlay.id='momentOverlay';overlay.className='moment-overlay';
 overlay.innerHTML=`<svg class="moment-focus" viewBox="0 0 480 270" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${momentArt[moment.focus]||''}</svg><aside class="moment-card"><small>LOOK AT THIS MOMENT</small><h2>${moment.title}</h2><p>${moment.tip||moment.hint}</p><div><button type="button" class="moment-replay">↺ Hear again</button><button type="button" class="moment-continue">Continue watching →</button></div></aside>`;
 $('stage').append(overlay);
 overlay.querySelector('.moment-replay').onclick=()=>speak(moment);
 overlay.querySelector('.moment-continue').onclick=closeMoment;
 speak(moment);
}
function closeMoment(){
 if(!activeMoment)return;
 activeMoment=null;stopVoice();$('momentOverlay')?.remove();$('clipControls').hidden=false;
 if(phase==='watching')resumeTogether();
}
function resumeTogether(){
 if(!playerReady||playerFailed){uid=null;createPlayer(flow[index]);return;}
 playbackState(false);
 if(watchVoiceActive&&!voice.ended)voice.play().catch(()=>{$('resume').hidden=false;});
 Promise.resolve(player?.play()).catch(()=>{$('resume').hidden=false;});
}
function finishClip(){
 if(phase!=='watching')return;
 activeMoment=null;$('momentOverlay')?.remove();
 player?.pause();clearTimeout(watchdog);stopVoice();watchVoiceActive=false;
 const s=flow[index];
 if(s.kind==='intro'){mark();index++;enter();return;}
 waiting();$('videoTap').hidden=true;$('resume').hidden=true;$('clipControls').hidden=true;$('media').hidden=true;$('visual').innerHTML=`<img src="${s.frame}" alt="${s.title}: teacher’s drawing at this checkpoint">`;
 $('referenceImage').src=s.analysis||'reference-giftbox.png'; $('referenceImage').alt=s.analysis?'Teaching diagram for '+s.title:s.title+' — stage reference'; $('analysis').hidden=false;$('alternateAnalysis').hidden=!s.analysisB;$('replay').hidden=false;
 window.GuidedUX?.pause(s);if(s.analysis)showAnalysisPulse(s);if(s.toolLabel){const tool=document.createElement('strong');tool.id='boxTool';tool.className='box-tool';tool.textContent=s.toolLabel;tool.hidden=true;$('visual').append(tool);}speak(s);
}
function showAnalysisPulse(s){
 // Isolate the blue/purple and mint ink already present in the authored diagram.
 // Only those exact annotations pulse; the teacher's graphite stays untouched.
 const layer=document.querySelector('.analysis-stage');if(!layer)return;
 const glow=document.createElement('div');glow.className='analysis-mark-glow';glow.setAttribute('aria-hidden','true');
 glow.innerHTML=`<svg width="100%" height="100%"><defs><filter id="box-annotation-ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 .46 0 0 0 0 .34 0 0 0 0 .67 0 -4 4 0 -.22"/><feGaussianBlur stdDeviation="1.6"/></filter><filter id="box-annotation-mint" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 .38 0 0 0 0 .68 0 0 0 0 .56 -5 5 0 0 -.22"/><feGaussianBlur stdDeviation="1.6"/></filter></defs><image href="${s.analysis}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" filter="url(#box-annotation-ink)"/><image href="${s.analysis}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" filter="url(#box-annotation-mint)"/></svg>`;
 layer.append(glow);
}

function createPlayer(s){
 const identity=s.uid||s.src;
 if(uid===identity&&player&&playerReady&&!playerFailed){startClip(s);return;}
 uid=identity;playerReady=false;playerFailed=false;$('videoTap').hidden=true;$('videoTap').disabled=true;$('media').innerHTML='';$('notice').textContent='Loading teacher video…';$('notice').hidden=false;
 const media=document.createElement(s.src?'video':'iframe');
 media.title='Teacher’s gift box demonstration';media.tabIndex=-1;
 if(s.src){media.src=s.src;media.playsInline=true;media.preload='auto';media.controls=false;const track=document.createElement('track');track.kind='captions';track.label='English';track.srclang='en';track.src='../intro/captions.vtt';track.default=true;track.addEventListener('load',()=>{track.track.mode='hidden';track.track.oncuechange=()=>{if(player===media&&phase==='watching')$('caption').textContent=Array.from(track.track.activeCues||[]).map(c=>c.text).join(' ');};});media.append(track);}
 else {media.allow='autoplay; fullscreen; picture-in-picture';media.src=`https://customer-a78os4oj56dr67ab.cloudflarestream.com/${s.uid}/iframe?autoplay=false&muted=true&controls=true&preload=auto`;}
 $('media').append(media);
 if(!s.src&&typeof Stream!=='function'){$('notice').hidden=false;$('notice').textContent='The video player could not load. Check your connection and reload to try again.';$('resume').textContent='Reload video';$('resume').hidden=false;playerFailed=true;return;}
 player=s.src?media:Stream(media);const thisPlayer=player;player.muted=true;player.addEventListener('volumechange',()=>{if(player===thisPlayer&&!player.muted)player.muted=true;});
 player.addEventListener('loadedmetadata',()=>{if(player===thisPlayer&&!playerReady&&(flow[index].uid||flow[index].src)===identity){playerReady=true;clearTimeout(watchdog);$('notice').hidden=true;$('videoTap').disabled=false;startClip(flow[index]);}});
 player.addEventListener('timeupdate',()=>{if(player===thisPlayer)checkClip();});
 player.addEventListener('pause',()=>{if(player===thisPlayer&&phase==='watching'&&!activeMoment){if(watchVoiceActive)voice.pause();playbackState(true);}});
 player.addEventListener('waiting',()=>{if(player===thisPlayer&&watchVoiceActive)voice.pause();});
 player.addEventListener('playing',()=>{if(player===thisPlayer&&phase==='watching'){$('notice').hidden=true;playbackState(false);}if(player===thisPlayer&&watchVoiceActive&&voice.paused)voice.play().catch(()=>{$('resume').hidden=false;});});
 player.addEventListener('ended',()=>{if(player===thisPlayer)checkClip(true);});
 player.addEventListener('play',()=>{if(player===thisPlayer){clearTimeout(watchdog);$('resume').hidden=true;$('playPause').textContent='Ⅱ';$('playPause').setAttribute('aria-label','Pause demonstration');}});
 player.addEventListener('error',()=>{if(player!==thisPlayer)return;playerFailed=true;playerReady=false;$('resume').textContent='Reload video';$('resume').hidden=false;$('notice').hidden=false;$('notice').textContent='The teacher video could not load. Use Replay to try again.';$('replay').hidden=false;});
 clearTimeout(watchdog);watchdog=setTimeout(()=>{if(player===thisPlayer&&!playerReady&&phase==='watching'){playerFailed=true;$('notice').textContent='Video is taking longer to load. Tap Reload video to retry.';$('resume').textContent='Reload video';$('resume').hidden=false;}},15000);
}
function checkClip(ended=false){
 if(phase!=='watching'||!player||activeMoment)return;
 const s=flow[index], start=s.start||0, end=s.clipEnd, t=Number(player.currentTime);
 // A seek outside this microstep never unlocks or completes another checkpoint.
 if(t<start-.3||t>end+.7){player.currentTime=Math.max(start,Math.min(end-.25,t));if(ended)Promise.resolve(player.play()).catch(()=>{$('resume').hidden=false;});return;}
 if(t>=start+.1)beginWatchVoice();
 $('clipSeek').value=Math.min(end-.15,Math.max(start,t));
 $('clipTime').textContent=`${Math.floor(Math.max(0,t-start))} / ${Math.ceil(end-start)}s`;
 const moment=(s.moments||[]).find(m=>!seenMoments.has(m.id)&&t>=start+m.time&&t<start+m.time+3);
 if(moment){showMoment(moment);return;}
 if(t>=end-.12||(ended&&t>=end-.7))finishClip();
}
$('playPause').onclick=()=>{if(!player||phase!=='watching'||activeMoment)return;if(player.paused){resumeTogether();}else{player.pause();if(watchVoiceActive)voice.pause();$('playPause').textContent='▶';$('playPause').setAttribute('aria-label','Play demonstration');}};
$('videoTap').onclick=()=>{$('playPause').onclick();};
$('clipSeek').oninput=()=>{if(!player||phase!=='watching'||activeMoment)return;const s=flow[index];player.currentTime=Math.max(s.start||0,Math.min(s.clipEnd-.15,Number($('clipSeek').value)));};
function startClip(s){
 phase='watching';activeMoment=null;seenMoments=new Set();$('momentOverlay')?.remove();$('videoTap').hidden=true;$('videoTap').disabled=false;$('media').hidden=false;$('visual').innerHTML='';$('resume').hidden=true;
 $('clipControls').hidden=false;$('clipSeek').min=s.start||0;$('clipSeek').max=s.clipEnd-.15;$('clipSeek').value=s.start||0;$('clipTime').textContent=`0 / ${Math.ceil(s.clipEnd-(s.start||0))}s`;
 watchNarrated=false;watchVoiceActive=false;player.muted=true;player.currentTime=s.start||0;
 const token=epoch;
 Promise.resolve(player.play()).catch(()=>{if(token===epoch){$('resume').textContent='Tap to play';$('resume').hidden=false;}});
 clearTimeout(watchdog);watchdog=setTimeout(()=>{if(token===epoch&&phase==='watching'&&player.paused){$('resume').textContent='Tap to play';$('resume').hidden=false;}},5000);
}
function enter(){
 epoch++;activeMoment=null;$('momentOverlay')?.remove();$('videoTap').hidden=true;$('stepPreview').textContent='';sceneReady=true;clearTimeout(watchdog);stopVoice();player?.pause();
 const s=flow[index];window.GuidedUX?.reset(s);if(index<3&&music.paused)introMusic();if(index>4)stopIntroMusic();$('back').disabled=index===0;$('skipStep').hidden=index===flow.length-1;$('skipStep').textContent=s.optional?'Skip optional step →':'Skip this step →';$('finishCore').hidden=!s.optional&&s.kind!=='submit';$('finishCore').textContent='Continue without background →';$('skip').hidden=true;$('clipControls').hidden=true;save();$('title').textContent=s.title+(s.optional&&!/optional/i.test(s.title)?' · Optional':'');$('hint').textContent=s.hint||'';
 $('notice').hidden=true;$('resume').hidden=true;$('next').disabled=true;$('next').textContent='Continue →';$('replay').hidden=false;
 $('reference').hidden=true;$('analysis').hidden=s.kind!=='draw';showPattern(s);
 setMode(`${s.chapter.toUpperCase()} · ${index+1} / ${flow.length}`);progress();window.GuidedUX?.stepCounter(flow,index);
 if(s.kind==='intro'||s.kind==='draw'){
  phase='watching';setMode('WATCH WITH YOUR TEACHER');$('media').hidden=false;$('visual').innerHTML='';
  if(s.kind==='draw'){$('referenceImage').src='reference-giftbox.png';$('referenceImage').alt='Real gift box reference';}
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
 if(flow[index].coreComplete)GuidedPlatform.complete('box');
 if(index===flow.length-1){stopVoice();GuidedPlatform.complete('box');window.GuidedReward.complete({lessonId:'box',title:'Gift Box',nextLabel:'Return to the course map →',muted,onMutedChange:setMuted}).then(async go=>{await GuidedPlatform.flush();if(go)location.href='../../../#dashboard/courses/foundation-map';});return;}
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
$('artchi').onclick=()=>{const s=flow[index];if(activeMoment){speak(activeMoment);return;}if(s.kind==='draw'&&phase==='watching')return;speak(s,()=>{if(phase==='guidance'&&sceneReady)waiting();});};
function setMuted(value){muted=value;voice.muted=muted;music.muted=muted;if(player)player.muted=true;$('sound').textContent=muted?'Sound off':'Sound on';$('sound').setAttribute('aria-pressed',String(muted));$('sound').setAttribute('aria-label',muted?'Enable sound':'Mute sound');}
$('sound').onclick=()=>setMuted(!muted);
$('resume').onclick=()=>{$('resume').hidden=true;if(activeMoment){speak(activeMoment);return;}if(phase==='watching'){resumeTogether();}else voice.play().catch(()=>{$('resume').hidden=false;});};
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
$('start').onclick=()=>{$('welcome').close();enter();};
$('welcome').addEventListener('cancel',e=>e.preventDefault());
(async()=>{if(!await GuidedPlatform.allow('box'))return; $('welcome').showModal();
fetch('flow.json?v=box-2').then(r=>{if(!r.ok)throw Error('Flow unavailable');return r.json();}).then(async data=>{
 flow=data;
 try{ const p=await GuidedPlatform.restore('box',KEY,flow.length,{classicStepMap:['welcome','cube-connection','reference-details','tools','observe','box-1-1','box-2-1','box-3-1','box-4-1','submit','optional','celebrate'].map(id=>flow.findIndex(s=>s.id===id)),classicCompletedAt:11});unlocked=Math.max(0,Math.min(flow.length-1,Number(p.unlocked)||0));index=Math.max(0,Math.min(unlocked,Number(p.index)||0));skipped=new Set(p.skipped||[]);completed=new Set((Array.isArray(p.completed)?p.completed:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<flow.length));}catch{}
 $('start').disabled=false;$('start').textContent=index?'Continue your gift box →':'Let’s draw a gift box →';
}).catch(()=>{$('start').textContent='Could not load · Reload to retry';});
})();
})();
