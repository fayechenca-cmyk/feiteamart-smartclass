/* Cone teacher-video key moments. No countdown: the learner resumes explicitly. */
(() => {
 'use strict';
 const root=new URL('../assets/sketch-support/cone/',document.currentScript.src);
 const data=fetch(new URL('pauses.json',root)).then(r=>{if(!r.ok)throw Error('Pause data unavailable');return r.json()});
 let current=null,sdk;
 function loadSDK(){
  if(window.Stream)return Promise.resolve(window.Stream);
  return sdk||(sdk=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://embed.cloudflarestream.com/embed/sdk.latest.js';s.onload=()=>window.Stream?resolve(window.Stream):reject(Error('Player unavailable'));s.onerror=()=>reject(Error('Player unavailable'));document.head.append(s)}));
 }
 function cleanup(){
  if(!current)return;
  current.cancelled=true;
  if(current.player){current.player.removeEventListener('timeupdate',current.tick);current.player.removeEventListener('seeking',current.seek);}
  current.overlay.remove();current.panel.remove();current.menu.remove();current.dialog.remove();window.FEISketchSupport?.stop();current=null;
 }
 function show(ctx,p,seek=false){
  if(ctx!==current||ctx.cancelled)return;
  ctx.triggered.add(p.time);ctx.active=p;
  if(ctx.player){ctx.player.pause();if(seek)ctx.player.currentTime=p.time;}
  if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});
  ctx.image.src=new URL(p.image,location.href).href;ctx.image.alt=p.title+' — annotated teacher demonstration';
  ctx.heading.textContent=p.title;ctx.prompt.textContent=p.shortPrompt;ctx.overlay.hidden=false;ctx.panel.hidden=false;
  window.FEISketchSupport?.narrate(p,ctx.panel);
 }
 async function attach(frame){
  cleanup();const box=frame.closest('.sketch-demo-frame,.video-frame');if(!box)return;
  const ctx={frame,box,cancelled:false,triggered:new Set(),last:0};current=ctx;
  ctx.overlay=document.createElement('button');ctx.overlay.type='button';ctx.overlay.className='cone-key-image';ctx.overlay.hidden=true;ctx.overlay.setAttribute('aria-label','Enlarge the analysis image');ctx.image=document.createElement('img');ctx.overlay.append(ctx.image);box.append(ctx.overlay);
  ctx.dialog=document.createElement('dialog');ctx.dialog.className='sketch-reference-zoom';ctx.dialog.innerHTML='<button type="button">✕ Close</button><img alt="Annotated teacher demonstration">';document.body.append(ctx.dialog);ctx.dialog.querySelector('button').onclick=()=>ctx.dialog.close();ctx.overlay.onclick=()=>{ctx.dialog.querySelector('img').src=ctx.image.src;ctx.dialog.showModal()};
  ctx.panel=document.createElement('section');ctx.panel.className='cone-key-panel';ctx.panel.hidden=true;ctx.panel.setAttribute('aria-live','polite');ctx.panel.innerHTML='<small>PAUSE & OBSERVE</small><h3></h3><p></p><button type="button" class="cone-key-continue">Continue the video →</button>';ctx.heading=ctx.panel.querySelector('h3');ctx.prompt=ctx.panel.querySelector('p');box.after(ctx.panel);
  ctx.panel.querySelector('button').onclick=()=>{window.FEISketchSupport?.stop();ctx.overlay.hidden=true;ctx.panel.hidden=true;ctx.active=null;if(ctx.player){ctx.last=ctx.player.currentTime;Promise.resolve(ctx.player.play()).catch(()=>{});}};
  ctx.menu=document.createElement('details');ctx.menu.className='cone-key-menu';ctx.menu.innerHTML='<summary>Loading key moments…</summary><div></div>';ctx.panel.after(ctx.menu);
  try{
   const all=await data;if(ctx.cancelled)return;const uid=frame.src.match(/cloudflarestream\.com\/([^/]+)/)?.[1];ctx.points=all.filter(p=>p.uid===uid);if(!ctx.points.length){cleanup();return;}
   ctx.menu.querySelector('summary').textContent=`${ctx.points.length} key moments · review any time`;
   const list=ctx.menu.querySelector('div');ctx.points.forEach(p=>{const b=document.createElement('button');b.type='button';b.textContent=`${Math.floor(p.time/60)}:${String(p.time%60).padStart(2,'0')} · ${p.title}`;b.onclick=()=>show(ctx,p,true);list.append(b)});
   const Stream=await loadSDK();if(ctx.cancelled)return;ctx.player=Stream(frame);
   ctx.seek=()=>{ctx.last=ctx.player.currentTime};
   ctx.tick=()=>{
    if(ctx!==current||ctx.cancelled||ctx.player.paused||ctx.active)return;
    const t=ctx.player.currentTime;
    if(t<ctx.last||t-ctx.last>3){ctx.last=t;return;}
    const p=ctx.points.find(p=>!ctx.triggered.has(p.time)&&ctx.last<p.time&&t>=p.time);ctx.last=t;if(p)show(ctx,p);
   };
   ctx.player.addEventListener('timeupdate',ctx.tick);ctx.player.addEventListener('seeking',ctx.seek);
  }catch(e){if(!ctx.cancelled)ctx.menu.querySelector('summary').textContent='Key moment images · tap to review';}
 }
 let pending=false;
 function scan(){const frame=document.querySelector('#step-content .demo-video-frame iframe');if(current&&current.frame===frame&&frame.isConnected)return;if(frame)attach(frame);else cleanup();}
 new MutationObserver(()=>{if(!pending){pending=true;requestAnimationFrame(()=>{pending=false;scan()})}}).observe(document.querySelector('#step-content')||document.body,{childList:true,subtree:true});
 window.addEventListener('pagehide',cleanup);scan();
})();
