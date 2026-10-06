// Match authored text exactly; audio and reveal share the recorded word clock.
window.SituationVoice = (() => {
 const base=new URL('.',document.currentScript.src);
 let active=null,muted=false;
 const normal=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
 function stop(){if(active){active.cancel();active=null}}
 function reveal(el,text,speed,timers,done){
  const key=normal(text),clip=(window.SITUATION_AUDIO||[]).find(c=>key.endsWith(normal(c.text)));
  if(!clip)return false;
  stop();
  const audio=new Audio(new URL(clip.file,base));audio.muted=muted;
  const controls=document.createElement('span');controls.className='situation-voice-controls';
  const replay=document.createElement('button'),mute=document.createElement('button');
  replay.textContent='↻ Listen again';mute.textContent=muted?'Voice off':'Voice on';mute.setAttribute('aria-pressed',String(!muted));
  controls.append(replay,mute);el.after(controls);
  let cancelled=false,finished=false,frame=0,fallbackStarted=false;
  // Preserve punctuation and the original Situation prefix in the displayed line.
  let pos=text.indexOf(clip.text);if(pos<0)pos=0;
  const words=clip.cues.map(c=>{let at=text.toLowerCase().indexOf(c.text.toLowerCase(),pos);if(at<0)at=pos;pos=at+c.text.length;return {...c,from:at,to:pos}});
  function finish(){el.textContent=text;if(!finished){finished=true;done?.()}}
  function tick(){
   if(cancelled)return;
   if(!el.isConnected){stop();return}
   let end=0;
   for(const w of words){if(audio.currentTime>=w.end)end=w.to;else if(audio.currentTime>=w.start){end=w.from+Math.max(1,Math.ceil((w.to-w.from)*(audio.currentTime-w.start)/(w.end-w.start)));break}else break}
   el.textContent=text.slice(0,end);
   frame=requestAnimationFrame(tick);
  }
  function fallback(){if(cancelled||fallbackStarted)return;fallbackStarted=true;cancelAnimationFrame(frame);let i=0;function step(){if(cancelled||!el.isConnected)return;el.textContent=text.slice(0,++i);if(i<text.length)timers.push(setTimeout(step,speed));else finish()}step()}
  function play(){cancelAnimationFrame(frame);audio.currentTime=0;el.textContent='';audio.play().then(()=>{if(!cancelled)tick()}).catch(fallback)}
  audio.addEventListener('ended',()=>{cancelAnimationFrame(frame);finish()});
  audio.addEventListener('error',fallback,{once:true});
  replay.onclick=play;mute.onclick=()=>{muted=!muted;audio.muted=muted;mute.textContent=muted?'Voice off':'Voice on';mute.setAttribute('aria-pressed',String(!muted))};
  active={cancel(){cancelled=true;if(el.isConnected)el.textContent=text;audio.pause();cancelAnimationFrame(frame);controls.remove()}};
  play();return true;
 }
 
 window.addEventListener('pagehide',stop);
 return {reveal,stop};
})();
