/* Isolated design experiment: no platform progress, submissions, or badge writes. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const root = '../../../';
const KEY = 'fei.cube.guided-preview.v1';
let flow=[], index=0, unlocked=0, completed=new Set(), player=null, uid=null, phase='idle', muted=false, epoch=0, photoURL=null;
let voiceDone=null, captions=[], lastCaption='', watchdog=null;
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
 voice.onerror=()=>{if(token!==epoch)return;$('notice').hidden=false;$('notice').textContent='Voice could not load. The guidance is available below; you can continue.';$('caption').textContent=step.say;$('next').disabled=false;phase='waiting';};
 voice.play().catch(()=>{if(token!==epoch)return;$('resume').hidden=false;$('resume').textContent='Tap to hear your guide';});
}
voice.addEventListener('timeupdate',()=>{
 if(!captions.length||!isFinite(voice.duration))return;
 const total=captions.reduce((n,t)=>n+t.length,0), pos=voice.currentTime/voice.duration*total;
 let running=0;const c=captions.find(t=>(running+=t.length)>pos)||captions.at(-1);
 if(c!==lastCaption){$('caption').textContent=c;lastCaption=c;}
});
function setMode(text){$('mode').textContent=text;}
function waiting(){phase='waiting';setMode('YOUR TURN · TAKE YOUR TIME');$('next').disabled=false;$('next').textContent=flow[index]?.kind==='badge'?'Finish preview ✓':'Continue →';}
function cube(light=false){return `<div class="scene"><svg viewBox="0 0 700 430" role="img" aria-label="Three faces of a cube, with a cast shadow"><ellipse id="shadow" cx="430" cy="353" rx="160" ry="30" fill="#080d17" opacity=".55"/><g><path class="face" data-face="top" role="button" tabindex="0" aria-label="Top face" fill="#edf0dc" d="M160 135 L340 65 L520 145 L340 230 Z"/><path class="face" data-face="left" role="button" tabindex="0" aria-label="Left face" fill="#9aaea9" d="M160 135 L340 230 L340 370 L160 270 Z"/><path class="face" data-face="right" role="button" tabindex="0" aria-label="Right face" fill="#445762" d="M340 230 L520 145 L520 285 L340 370 Z"/></g>${light?'<g id="sun"><circle cx="150" cy="50" r="23" fill="#f1ca86"/><circle cx="150" cy="50" r="33" fill="none" stroke="#f1ca8655" stroke-width="8"/></g>':''}</svg>${light?'<label for="sunSlider">☀ Move the light</label><input id="sunSlider" type="range" min="0" max="100" value="15" aria-label="Move the sun from left to right">':''}</div>`;}
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
 }else if(s.kind==='ready'){
  $('visual').innerHTML=`<div class="scene"><div class="big-symbol">✎</div><p>Paper ready. Shoulders relaxed.</p></div>`;
 }else if(s.kind==='submit'){
  $('visual').innerHTML='<div class="scene"><img class="upload-preview" hidden alt="Your drawing preview"><label class="upload-label" for="drawing">＋ Add your drawing</label><input id="drawing" type="file" accept="image/jpeg,image/png,image/webp" hidden><p class="local-note">Preview only · Your photo stays on this page</p><a href="../" target="_blank" rel="noopener" style="color:#b8edd9">Open regular lesson to submit →</a></div>';
  $('drawing').onchange=()=>{
   const file=$('drawing').files[0];if(!file)return;
   if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>20*1024*1024){$('notice').textContent='Choose a JPG, PNG, or WebP image under 20 MB.';$('notice').hidden=false;return;}
   if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(file);
   const img=document.querySelector('.upload-preview');img.src=photoURL;img.hidden=false;
  };
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
 waiting();$('media').hidden=true;$('visual').innerHTML=`<img src="${s.frame}" alt="${s.title}: teacher’s drawing at this checkpoint">`;
 $('referenceImage').src=s.analysis||s.frame; $('referenceImage').alt=s.analysis?'Teaching diagram for '+s.title:s.title+' — stage reference'; $('analysis').hidden=false;$('replay').hidden=false;
 speak(s);
}
function createPlayer(s){
 if(uid===s.uid&&player){startClip(s);return;}
 uid=s.uid;$('media').innerHTML='';
 const iframe=document.createElement('iframe');iframe.title='Mrs. Dawn’s cube demonstration';iframe.allow='autoplay; fullscreen; picture-in-picture';iframe.allowFullscreen=true;
 iframe.src=`https://customer-a78os4oj56dr67ab.cloudflarestream.com/${s.uid}/iframe?autoplay=false&muted=${muted}&controls=true&preload=auto`;
 $('media').append(iframe);
 if(typeof Stream!=='function'){
  $('notice').hidden=false;$('notice').textContent='The video player could not load. Check your connection and reload to try again.';return;
 }
 player=Stream(iframe);const thisPlayer=player;
 player.addEventListener('loadedmetadata',()=>{if(player===thisPlayer&&flow[index].uid===s.uid)startClip(flow[index]);});
 player.addEventListener('timeupdate',()=>{if(player!==thisPlayer||phase!=='watching')return;const current=flow[index];if(current.end!==null&&current.end!==undefined&&thisPlayer.currentTime>=current.end-.1)finishClip();});
 player.addEventListener('ended',()=>{if(player===thisPlayer)finishClip();});
 player.addEventListener('play',()=>{if(player===thisPlayer){clearTimeout(watchdog);$('resume').hidden=true;}});
 player.addEventListener('error',()=>{if(player!==thisPlayer)return;$('notice').hidden=false;$('notice').textContent='The teacher video could not load. Use Replay to try again.';$('replay').hidden=false;});
}
function startClip(s){
 phase='watching';$('media').hidden=false;$('visual').innerHTML='';$('resume').hidden=true;
 player.muted=muted;player.currentTime=s.start||0;
 const token=epoch;
 Promise.resolve(player.play()).catch(()=>{if(token===epoch){$('resume').textContent='Tap to play';$('resume').hidden=false;}});
 clearTimeout(watchdog);watchdog=setTimeout(()=>{if(token===epoch&&phase==='watching'&&player.paused){$('resume').textContent='Tap to play';$('resume').hidden=false;}},5000);
}
function enter(){
 epoch++;clearTimeout(watchdog);stopVoice();player?.pause();
 const s=flow[index];save();$('title').textContent=s.title;$('hint').textContent=s.hint||'';
 $('notice').hidden=true;$('resume').hidden=true;$('next').disabled=true;$('next').textContent='Continue →';$('replay').hidden=false;
 $('reference').hidden=s.kind!=='draw';$('analysis').hidden=true;
 setMode(`${s.chapter.toUpperCase()} · ${index+1} / ${flow.length}`);progress();
 if(s.kind==='intro'||s.kind==='draw'){
  phase='watching';setMode('WATCH WITH MRS. DAWN');$('media').hidden=false;$('visual').innerHTML='';
  if(s.kind==='draw'){$('referenceImage').src=s.frame;$('referenceImage').alt=s.title+' — stage reference';}
  createPlayer(s);
 }else{
  phase='guidance';buildScene(s);
  // Observation and light stay hands-on. Other scenes wait for the learner after guidance.
  speak(s,()=>{if(!['anatomy','light'].includes(s.kind))waiting();});
  if(s.kind==='badge'){$('next').textContent='Finish preview ✓';}
 }
}
function next(){
 if($('next').disabled)return;
 mark();
 if(index===flow.length-1){stopVoice();$('next').textContent='Preview complete ✓';$('next').disabled=true;setMode('WELL DONE');return;}
 index++;enter();
}
$('next').onclick=next;
$('replay').onclick=()=>enter();
$('artchi').onclick=()=>{const s=flow[index];if(s.kind==='draw'&&phase==='watching')return;speak(s);};
$('sound').onclick=()=>{muted=!muted;voice.muted=muted;if(player)player.muted=muted;$('sound').textContent=muted?'Sound off':'Sound on';$('sound').setAttribute('aria-pressed',String(muted));$('sound').setAttribute('aria-label',muted?'Enable sound':'Mute sound');};
$('resume').onclick=()=>{$('resume').hidden=true;if(phase==='watching'){Promise.resolve(player?.play()).catch(()=>{$('resume').hidden=false;});}else voice.play().catch(()=>{$('resume').hidden=false;});};
function openMap(){
 player?.pause();voice.pause();$('mapItems').innerHTML='';let chapter='';
 flow.forEach((s,i)=>{
  if(s.chapter!==chapter){chapter=s.chapter;const h=document.createElement('h3');h.textContent=chapter+(s.optional?' · Optional':'');$('mapItems').append(h);}
  const b=document.createElement('button');b.className='map-step'+(i===index?' current':'');b.disabled=i>unlocked;
  // Optional refinements can be bypassed only after the core drawing is finished.
  if(s.kind==='submit'&&completed.has(flow.findIndex(x=>x.title==='Your cube has volume')))b.disabled=false;
  if(s.frame){const img=document.createElement('img');img.src=s.frame;img.alt='';img.loading='lazy';b.append(img);}
  const label=document.createElement('span');label.textContent=s.title;b.append(label);const check=document.createElement('b');check.textContent=completed.has(i)?'✓':b.disabled?'·':String(i+1);b.append(check);
  b.onclick=()=>{$('map').close();index=i;unlocked=Math.max(unlocked,i);enter();};$('mapItems').append(b);
 });$('map').showModal();
}
$('mapButton').onclick=openMap;$('closeMap').onclick=()=>$('map').close();
$('map').addEventListener('close',()=>{if(phase==='watching'){$('resume').hidden=false;$('resume').textContent='Resume playback';}});
$('analysis').onclick=()=>{voice.pause();$('diagram').querySelector('img').src=flow[index].analysis||flow[index].frame;$('diagram').showModal();};$('closeDiagram').onclick=()=>$('diagram').close();
document.addEventListener('visibilitychange',()=>{if(document.hidden){player?.pause();voice.pause();}else if(phase==='watching'||(voice.src&&!voice.ended)){$('resume').textContent='Resume playback';$('resume').hidden=false;}});
window.addEventListener('pagehide',()=>{player?.pause();stopVoice();if(photoURL)URL.revokeObjectURL(photoURL);});
$('start').onclick=()=>{$('welcome').close();enter();};
$('welcome').addEventListener('cancel',e=>e.preventDefault());$('welcome').showModal();
fetch('flow.json').then(r=>{if(!r.ok)throw Error('Flow unavailable');return r.json();}).then(data=>{
 flow=data;
 try{const p=JSON.parse(localStorage.getItem(KEY)||'{}');unlocked=Math.max(0,Math.min(flow.length-1,Number(p.unlocked)||0));index=Math.max(0,Math.min(unlocked,Number(p.index)||0));completed=new Set((Array.isArray(p.completed)?p.completed:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<flow.length));}catch{}
 $('start').disabled=false;$('start').textContent=index?'Continue your journey →':'Start drawing →';
}).catch(()=>{$('start').textContent='Could not load · Reload to retry';});
})();
