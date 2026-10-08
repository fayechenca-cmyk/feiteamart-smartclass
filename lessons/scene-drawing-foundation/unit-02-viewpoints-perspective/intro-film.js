// A short narrated motion film. Every frame follows audio.currentTime.
window.IntroFilm=(()=>{
 const stage=document.getElementById('intro-stage');
 stage.innerHTML=`<div class="intro-film">
 <div class="film-heading"><span id="film-chapter">PREVIOUSLY · SHOT SIZES</span><strong id="film-title">From the world to one detail</strong></div>
 <svg id="film-art" viewBox="0 0 800 400" role="img" aria-label="Animated comparison of shot sizes and camera viewpoints">
 <defs><clipPath id="film-clip"><rect x="10" y="10" width="780" height="380" rx="16"/></clipPath><filter id="film-glow"><feGaussianBlur stdDeviation="4"/></filter></defs>
 <g clip-path="url(#film-clip)">
 <rect x="10" y="10" width="780" height="380" fill="#fafaf8"/>
 <g id="film-world" stroke="#695e78" stroke-width="2.3" fill="none">
 <path d="M0 225L120 130 220 222 360 100 480 220 680 110 800 218M0 240H800" stroke="#d4c9e6"/>
 <path d="M45 285V186H172V285M30 186L109 139 184 186M70 214H94V245H70ZM125 214H148V245H125ZM600 285V177H749V285M582 177L673 127 766 177M624 205H653V237H624ZM690 205H720V237H690Z" fill="#eee8ff"/>
 <path d="M352 240L205 420M448 240L595 420M310 293H490M266 349H534" stroke="#cbbce3"/>
 <g id="film-person" stroke="#252337" stroke-width="3"><path d="M376 201Q400 191 424 201L436 287H364Z" fill="#ded5f3"/><path d="M375 287L369 353H393L400 299 407 353H430L424 287" fill="#f1edf7"/><path d="M376 210L348 265M424 210L452 265"/><ellipse cx="400" cy="172" rx="29" ry="33" fill="#fffaf2"/><path d="M373 164Q370 132 400 137Q433 135 429 167L417 152Q397 168 375 154" fill="#695e78"/><ellipse cx="390" cy="172" rx="3" ry="5" fill="#252337"/><ellipse cx="411" cy="172" rx="3" ry="5" fill="#252337"/><path d="M390 186Q400 192 411 186"/></g>
 </g>
 <g id="film-angle" opacity="0">
 <text x="130" y="35" class="film-label">CAMERA POSITION</text><text x="605" y="35" class="film-label">YOUR DRAWING</text>
 <path d="M34 345H355" stroke="#cbbce3" stroke-width="2"/>
 <g stroke="#252337" stroke-width="3" fill="none"><circle cx="295" cy="140" r="26" fill="#fffaf2"/><path d="M295 166V266M295 190L263 233M295 190L323 231M295 266L271 344M295 266L318 344"/></g>
 <path id="film-beam" fill="#67e8f944"/><path id="film-sight" stroke="#a78bfa" stroke-width="2" stroke-dasharray="6 6"/>
 <g id="film-camera" stroke="#252337" stroke-width="3" fill="#eee8ff"><rect x="-40" y="-20" width="66" height="40" rx="5"/><path d="M26 -11L49 -23V23L26 11Z"/><circle cx="-22" cy="-31" r="12"/><circle cx="7" cy="-34" r="15"/></g>
 <rect x="440" y="55" width="326" height="310" rx="14" fill="white" stroke="#e3dbed"/>
 <path id="film-ground" stroke="#cbbce3" fill="none" stroke-width="2"/>
 <g id="film-result" stroke="#252337" stroke-width="3" fill="none"></g>
 <circle id="film-vp" cx="603" cy="170" r="6" fill="#a78bfa"/>
 </g>
 </g></svg>
 <p id="film-caption">You’ve explored shot sizes, from wide shots to extreme close-ups.</p>
 <div class="film-controls"><button id="film-play" class="primary">▶ Play intro</button><button id="film-restart" aria-label="Restart intro">↻</button><input id="film-seek" type="range" min="0" max="100" value="0" step=".1" aria-label="Intro playback position"><span id="film-time">0:00</span><button id="film-music" aria-pressed="true">Music on</button><button id="film-mute" aria-pressed="false">Sound on</button></div>
 <p id="film-status" role="status"></p><audio id="film-audio" preload="metadata" src="audio/viewpoints-intro.mp3"></audio></div>`;
 const $=id=>document.getElementById(id),audio=$('film-audio'),words=INTRO_SPEECH.cues;
 const sentences=INTRO_SPEECH.text.match(/[^.!?]+[.!?]+/g).map(s=>s.trim());
 const norm=s=>s.replace(/[^a-z0-9]/gi,'').toLowerCase();
 let chars=0;const positions=words.map(w=>{const p=chars;chars+=norm(w.text).length;return p});
 let offset=0;
 const beats=sentences.map(text=>{let i=positions.findIndex(p=>p>=offset);const start=words[Math.max(0,i)]?.start||0;offset+=norm(text).length;return {text,start}});
 let raf=0;
 // A local blob supports scrubbing even on simple preview servers without Range responses.
 let blobUrl=null;
 const ready=fetch('audio/viewpoints-intro.mp3').then(r=>{if(!r.ok)throw Error('Audio unavailable');return r.blob()}).then(blob=>{blobUrl=URL.createObjectURL(blob);audio.src=blobUrl;audio.load()}).catch(()=>{});
 const music=new Audio('audio/intro-music.wav');music.preload='auto';music.volume=.5;
 let musicEnabled=true;
 fetch('audio/intro-music.wav').then(r=>{if(!r.ok)throw Error('Music unavailable');return r.blob()}).then(blob=>{music.src=URL.createObjectURL(blob);music.load()}).catch(()=>{});
 function syncMusic(){music.muted=audio.muted||!musicEnabled;if(Number.isFinite(music.duration))music.currentTime=Math.min(audio.currentTime,music.duration);if(!audio.paused&&musicEnabled)music.play().catch(()=>{});else music.pause();}
 $('film-music').onclick=()=>{musicEnabled=!musicEnabled;$('film-music').textContent=musicEnabled?'Music on':'Music off';$('film-music').setAttribute('aria-pressed',String(musicEnabled));syncMusic()};
 audio.addEventListener('play',syncMusic);audio.addEventListener('pause',()=>music.pause());audio.addEventListener('seeking',syncMusic);audio.addEventListener('volumechange',syncMusic);audio.addEventListener('ended',()=>music.pause());
 music.addEventListener('loadedmetadata',syncMusic);
 const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
 const set=(id,k,v)=>$(id).setAttribute(k,v);
 function frame(){
  const t=audio.currentTime;let b=0;beats.forEach((s,i)=>{if(t>=s.start)b=i});
  $('film-caption').textContent=beats[b].text;
  $('film-seek').value=audio.duration?t/audio.duration*100:0;
  $('film-time').textContent='0:'+String(Math.floor(t)).padStart(2,'0');
  $('film-play').textContent=audio.paused?(audio.ended?'↻ Replay intro':'▶ Play intro'):'Ⅱ Pause';
  const a=b>=2;
  set('film-world','opacity',a?0:1);set('film-angle','opacity',a?1:0);
  if(!a){
   const p=smooth((t-1)/Math.max(1,(beats[2]?.start||13)-3)),z=1+p*6;
   set('film-world','transform',`translate(400 195) scale(${z}) translate(-400 -172)`);
   $('film-chapter').textContent='PREVIOUSLY · SHOT SIZES';
   $('film-title').textContent=p<.25?'Wide Shot':p<.55?'Medium Shot':p<.84?'Close-Up':'Extreme Close-Up';
  }else{
   let cy=140;
   if(b===2){const p=clamp((t-beats[2].start)/Math.max(1,beats[3].start-beats[2].start));cy=140-50*Math.sin(p*Math.PI*2)}
   if(b===4)cy=140-50*smooth((t-beats[4].start)/1.2);
   if(b===5)cy=90+200*smooth((t-beats[5].start)/1.6);
   if(b>=6)cy=290-150*smooth((t-beats[6].start)/1.2);
   const rot=Math.atan2(150-cy,185)*180/Math.PI;
   set('film-camera','transform',`translate(105 ${cy}) rotate(${rot})`);
   set('film-beam','d',`M150 ${cy}L295 115L295 270Z`);
   set('film-sight','d',`M151 ${cy}L295 150`);
   const high=cy<110,low=cy>210,hy=high?100:low?290:170;
   set('film-ground','d',`M442 ${hy}H764M603 ${hy}L442 362M603 ${hy}L764 362M603 ${hy}L520 362M603 ${hy}L690 362M443 320H764`);
   set('film-vp','cy',hy);set('film-vp','opacity',b>=6?1:0);
   const headY=high?162:low?135:157,rx=high?34:low?20:25,ry=high?29:low?23:28;
   $('film-result').innerHTML=`<ellipse cx="603" cy="${headY}" rx="${rx}" ry="${ry}" fill="#fffaf2"/><path d="M${603-rx} ${headY-5}Q603 ${headY-ry-15} ${603+rx} ${headY-5}" fill="#695e78"/><circle cx="595" cy="${headY+3}" r="2" fill="#252337"/><circle cx="612" cy="${headY+3}" r="2" fill="#252337"/><path d="M596 ${headY+14}Q603 ${headY+19} 611 ${headY+14}"/><path d="M589 ${headY+ry}L${low?568:585} 264H${low?638:622}L617 ${headY+ry}Z" fill="#ded5f3"/><path d="M591 264L${low?558:580} ${high?310:340}M616 264L${low?650:626} ${high?310:340}M587 204L561 244M620 204L646 235"/>`;
   $('film-chapter').textContent=b>=6?'NEXT · VIEWPOINTS & PERSPECTIVE':'CHANGE THE CAMERA ANGLE';
   $('film-title').textContent=b===2?'Now move up and down':b===3?'Normal Shot · eye to eye':b===4?'High Angle · look down':b===5?'Low Angle · look up':b===6?'Follow the horizon & vanishing points':b===7?'Same story. Different viewpoint.':'Let’s sketch together';
  }
  if(!audio.paused)raf=requestAnimationFrame(frame);
 }
 $('film-play').onclick=async()=>{if(!audio.paused){audio.pause();return}StepVoice.stop();try{await ready;await audio.play();$('film-status').textContent=''}catch{$('film-status').textContent='Tap Play to start the intro.'}};
 $('film-restart').onclick=()=>{audio.currentTime=0;frame()};
 $('film-seek').oninput=e=>{if(audio.duration){audio.currentTime=e.target.value/100*audio.duration;frame()}};
 $('film-mute').onclick=()=>{audio.muted=!audio.muted;$('film-mute').textContent=audio.muted?'Sound off':'Sound on';$('film-mute').setAttribute('aria-pressed',String(audio.muted))};
 audio.onplay=()=>{cancelAnimationFrame(raf);frame()};audio.onpause=()=>{cancelAnimationFrame(raf);frame()};audio.onended=frame;
 audio.onerror=()=>{$('film-status').textContent='Audio could not load. Reload to try again.'};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.pause()});
 window.addEventListener('pagehide',()=>audio.pause());
 frame();
 return {setActive(on){if(!on)audio.pause();document.querySelector('.voice-guide').hidden=on;document.getElementById('voice-caption').hidden=on;}};
})();
