/* Shared final-work reference and recorded key-moment narration. */
(() => {
 'use strict';
 const root=new URL('../assets/sketch-support/',document.currentScript.src);
 const lesson=location.pathname.split('/').filter(Boolean).at(-1)==='index.html'?location.pathname.split('/').filter(Boolean).at(-2):location.pathname.split('/').filter(Boolean).at(-1);
 const desktop=matchMedia('(min-width: 1000px)');
 const placements=new Map();
 desktop.addEventListener('change',scan);
 const references={
 'lesson-1-sphere':['sphere','The Sphere'],'lesson-2-sphere-realworld':['apple','The Apple'],'lesson-3-cube':['cube','The Cube'],'lesson-4-giftbox':['box','Gift Box'],'lesson-5-cylinder':['cylinder','The Cylinder'],'lesson-6-cup':['cup','The Cup'],'lesson-7-cone':['cone','The Cone'],'lesson-8-icecream':['icecream','Ice Cream'],'lesson-9-intersecting':['intersecting','Intersecting Geometry'],'lesson-10-papercrane':['papercrane','Paper Crane'],'still-life-1a-star-balloon-structure':['balloon','Foil Star Balloon'],'still-life-2a-glass-structure':['glass','Glass Cup and Bottle'],'still-life-2b-glass-texture':['glass','Glass Cup and Bottle'],'still-life-4a-dog-structure':['dog','Dog']};
 const prep={'9b335ebd533cbfdab6a608255a1c202c':['prep-setup','Workspace setup'],'5fee79867ca52d1ec9b26654bb3bc0e5':['prep-tape','Taped paper'],'8bd402e0d2480692b41a65817038baf3':['prep-lines','Pencil marks and shading'],'cf7834125b757d86d0965702c6550202':['prep-warmup','Hand warm-up']};
 document.addEventListener('load',e=>{if(e.target.tagName==='IMG'&&/^(vp|sp|cyl)-image-/.test(e.target.id))e.target.style.opacity='1'},true);
 const manifest=fetch(new URL('narration.json?v=cone-key-20261008',root)).then(r=>r.ok?r.json():{}).catch(()=>({}));
 let audio=null,panel=null,request=0;
 function stop(){request++;if(audio){audio.pause();audio=null;}if(panel){const b=panel.querySelector('[data-pause-voice]');if(b)b.textContent='▶ Listen again';}panel=null;}
 async function narrate(p,target){
  stop();if(!target)return;const token=request;panel=target;
  const entries=await manifest;if(token!==request||!target.isConnected)return;
  const item=entries[lesson+'|'+p.title+'|'+p.time];if(!item)return;
  let block=target.querySelector('.sketch-narration');if(!block){block=document.createElement('div');block.className='sketch-narration';target.append(block)}
  block.replaceChildren();const button=document.createElement('button');button.type='button';button.dataset.pauseVoice='';button.textContent='▶ Listen to the guide';
  const note=document.createElement('span');note.textContent='Take your time. Continue when you’re ready.';
  const details=document.createElement('details'),summary=document.createElement('summary'),text=document.createElement('p');summary.textContent='Read the spoken guide';text.textContent=item.text;details.append(summary,text);block.append(button,note,details);
  audio=new Audio(new URL(item.file,root));audio.preload='auto';const current=audio;
  const play=async()=>{try{await current.play();if(audio===current)button.textContent='Ⅱ Pause voice';}catch{button.textContent='▶ Tap to hear the guide';}};
  current.onended=()=>{button.textContent='↻ Replay guide';};current.onpause=()=>{button.textContent='▶ Listen again';};current.onerror=()=>{note.textContent='Audio unavailable. Read the guide below.';details.open=true;};
  button.onclick=()=>{if(current.paused){if(current.ended)current.currentTime=0;play()}else current.pause()};
  if(!document.hidden)play();
 }
 window.FEISketchSupport={narrate,stop};
 const zoom=document.createElement('dialog');zoom.className='sketch-reference-zoom';zoom.innerHTML='<button type="button" aria-label="Close reference">✕ Close</button><img alt="Teacher’s finished drawing">';document.body.append(zoom);zoom.querySelector('button').onclick=()=>zoom.close();zoom.onclick=e=>{if(e.target===zoom)zoom.close()};
 function alignReference(){
  const side=document.querySelector('.side-panel');
  if(!side)return;
  const pair=[...placements].find(([layout,card])=>layout.isConnected&&card.parentElement===side);
  const enabled=desktop.matches&&!!pair;
  side.classList.toggle('sketch-aligned-side',enabled);
  if(!enabled){side.style.removeProperty('--sketch-side-offset');return;}
  const frame=pair[0].querySelector('.sketch-demo-frame');
  const rect=frame.getBoundingClientRect();
  const old=parseFloat(side.style.getPropertyValue('--sketch-side-offset'))||0;
  const offset=Math.max(0,rect.top-side.getBoundingClientRect().top+old);
  const value=Math.round(offset)+'px';
  if(side.style.getPropertyValue('--sketch-side-offset')!==value)side.style.setProperty('--sketch-side-offset',value);
  const height=Math.round(rect.height)+'px';
  if(side.style.getPropertyValue('--sketch-video-height')!==height)side.style.setProperty('--sketch-video-height',height);
 }
 window.addEventListener('resize',()=>requestAnimationFrame(alignReference));
 document.fonts?.ready.then(alignReference);
 const sizeObserver=new ResizeObserver(()=>requestAnimationFrame(alignReference));
 const content=document.querySelector('.content');if(content)sizeObserver.observe(content);
 function scan(){
  for(const [layout,card] of placements){
   if(!layout.isConnected){card.remove();placements.delete(layout);continue;}
   // Every lesson with a .side-panel now gets the reference image moved
   // there on desktop, beside the video (was Cube-only). Lessons with no
   // .side-panel (preparation) fall back to staying in layout, where the
   // shared CSS still lays video+card out as two columns for them.
   const sidePanel=document.querySelector('.side-panel');
   const destination=(desktop.matches&&sidePanel)?sidePanel:layout;
   if(destination&&card.parentElement!==destination)destination.prepend(card);
  }
  if(panel&&(!panel.isConnected||getComputedStyle(panel).display==='none'))stop();
  document.querySelectorAll('iframe[src*="cloudflarestream.com"]').forEach(frame=>{
   if(frame.closest('.sketch-watch-layout'))return;
   if(frame.closest('.opening-lfc'))return;
   const uid=frame.src.match(/cloudflarestream\.com\/([^/]+)\//)?.[1];const ref=lesson==='preparation'?prep[uid]:references[lesson];if(!ref)return;
   const video=frame.closest('.video-frame,.video-embed,.demo-video-frame,.video-container')||frame.parentElement;
   if(!video||video===document.body)return;
   const layout=document.createElement('div');layout.className='sketch-watch-layout';video.before(layout);layout.append(video);video.classList.add('sketch-demo-frame');
   const card=document.createElement('aside');card.className='sketch-final-reference';
   // Image only (Oct 2026) — kicker/heading/hint/caption removed; the
   // image itself still opens the zoom dialog on tap.
   const button=document.createElement('button');button.type='button';button.className='sketch-reference-image';button.setAttribute('aria-label','Enlarge '+ref[1]+' teacher reference');
   const image=document.createElement('img');image.src=new URL('finals/'+ref[0]+'.jpg',root);image.alt='Teacher demonstration: '+ref[1];image.loading='lazy';button.append(image);
   button.onclick=()=>{zoom.querySelector('img').src=image.src;zoom.showModal()};
   card.append(button);layout.append(card);
   placements.set(layout,card);
   const sidePanel=document.querySelector('.side-panel');
   if(desktop.matches&&sidePanel)sidePanel.prepend(card);
   sizeObserver.observe(video);
  });
  alignReference();
 }
 let scheduled=false;new MutationObserver(()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;scan()})}}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});window.addEventListener('pagehide',stop);scan();
})();
