import {mountStream} from './stream-player.js';
import {gothicProject as P} from './gothic-data.js?v=arch-stream-2';
export function createGothicProject({main,state,save,esc,link,materialBoard}){
 const path=(id='',step='')=>'#project/gothic'+(id?'/'+id:'')+(step?'/'+step:'');
 const done=()=>Array.isArray(state.responses['gothic:done'])?state.responses['gothic:done']:[];
 const completed=e=>e.steps.length>0&&(e.mode==='choices'?e.steps.some(s=>done().includes(e.id+':'+s.screenId)):e.steps.every(s=>done().includes(e.id+':'+s.screenId)));
 let cropId=0,activePlayer=null,motionRequest=0;
 function stopMotion(){motionRequest++;activePlayer?.destroy();activePlayer=null;}
 window.addEventListener('hashchange',stopMotion);
 const picture=(src,width,height,rect,label,cls='')=>{const id='gothic-crop-'+(++cropId);return `<svg class="guide-crop ${cls}" viewBox="${rect.join(' ')}" role="img" aria-label="${esc(label)}"><defs><clipPath id="${id}"><rect x="${rect[0]}" y="${rect[1]}" width="${rect[2]}" height="${rect[3]}" /></clipPath></defs><image href="${src}" width="${width}" height="${height}" clip-path="url(#${id})" /></svg>`;};
 const mapPic=(e)=>picture(P.map.src,P.map.width,P.map.height,e.mapRect,e.title);
 const skipped=e=>e.mode==='choices'&&state.responses['gothic:skip-decoration']===true;
 const resume=e=>e.mode==='choices'?path(e.id):path(e.id,(e.steps.find(s=>!done().includes(e.id+':'+s.screenId))||e.steps[0]).screenId);
 const nextElement=()=>P.elements.find(e=>!completed(e)&&!skipped(e));
 // Bridges this course's own local progress (state.responses['gothic:done'],
 // via the injected save() above) into the platform-wide badge system,
 // which only ever reads fei_user_profile.completedLessons (see
 // core/course-badge-registry.js's hand_crafter entry) and never touches
 // this course's own state. Same sessionStorage + completedLessons.push
 // convention as every other course (color-theory/index.html's
 // markCourseComplete(), lessons/zodiac-skill/index.html's
 // markAnimalComplete()) -- never localStorage, per the platform's
 // Safari-iframe fix. Safe to call more than once: dedups via includes().
 function markCourseComplete(){
  try{
   const raw=sessionStorage.getItem('fei_user_profile');
   if(!raw)return;
   const profile=JSON.parse(raw);
   profile.completedLessons=Array.isArray(profile.completedLessons)?profile.completedLessons:[];
   if(!profile.completedLessons.includes('material-art-cardboard')){
    profile.completedLessons.push('material-art-cardboard');
    sessionStorage.setItem('fei_user_profile',JSON.stringify(profile));
   }
  }catch{/* best-effort -- local gothic:done progress above is unaffected either way */}
 }
 function render(parts){
  stopMotion();
  document.title='Gothic cardboard project · FEI TeamArt';
  const id=parts[2],e=P.elements.find(x=>x.id===id);
  if(id==='intro'){main.innerHTML=`<div class="project-top">${link(path(),'← Learning path',true)}<span>RE:MAKE · CARDBOARD</span></div><div class="project-intro"><div><div class="eyebrow">Your next creation</div><h1>One box.<br>A whole new building.</h1><p>Make five Gothic elements. Plan your design. Bring it all together.</p>${link(path('materials'),'Get ready →')}</div>${picture(P.map.src,P.map.width,P.map.height,[868,880,274,288],'A Gothic-inspired cardboard building')}</div>`;return;}
  if(id==='materials'){const tools=parts[3]==='tools';main.innerHTML=`<div class="project-top">${link(path(),'← Learning path',true)}<span>Get ready · ${tools?'2':'1'} / 2</span></div><div class="focused-preparation">${materialBoard(tools?'tools':'cardboard')}</div><div class="flow-actions">${link(tools?path('materials'):path('intro'),'← Back',true)}${tools?'<button class="btn" data-gothic-ready>I’m ready · start building →</button>':link(path('materials','tools'),'Next · tools →')}</div>`;return;}
  if(!e){map();return;}
  if(!e.steps.length){main.innerHTML=`${link(path(),'← Learning path',true)}<div class="project-intro"><div><div class="eyebrow">Coming next</div><h1>${e.title}</h1><p>Your teacher will add the step pictures and demo here.</p>${link(path(),'Back to today’s three elements')}</div>${mapPic(e)}</div>`;return;}
  if(parts[3]==='finished'){finish(e);return;}
  if(e.mode==='choices'&&!e.steps.some(s=>s.screenId===parts[3])){choices(e);return;}
  const index=Math.max(0,e.steps.findIndex(s=>s.screenId===parts[3])),s=e.steps[index];
  state.responses['gothic:position:'+e.id]=s.screenId;save();
  if(s.video.motion){studio(e,s,index);return;}
  main.innerHTML=`<div class="project-top">${link(path(),'← Learning path',true)}<span>${e.title} · ${e.mode==='choices'?'Option ':''}${index+1} / ${e.steps.length}</span></div>
  <progress class="making-progress" value="${index+1}" max="${e.steps.length}" aria-label="${e.mode==='choices'?'Detail':'Step'} ${index+1} of ${e.steps.length}"></progress>
  <div class="making-stage"><div class="making-visual">${picture(e.sheet,e.width,e.height,s.rect,s.title+' — '+s.instruction)}<button class="text-button" data-gothic-zoom>Enlarge picture ↗</button>${s.video.src?`<figure class="step-video"><figcaption>Optional · silent demonstration</figcaption><video class="step-demo" controls playsinline preload="metadata" poster="${esc(s.video.poster)}" src="${esc(s.video.src)}" aria-label="${esc(s.title)} teacher demonstration">${s.video.captions?`<track kind="captions" src="${esc(s.video.captions)}" srclang="en" label="English" default>`:''}</video></figure>`:''}</div><div class="making-action"><div class="eyebrow">${s.part||e.title} / ${e.mode==='choices'?'Option':'Step'} ${index+1}</div><h1>${s.title}</h1><p class="one-action">${s.instruction}</p>${s.cutting?'<p class="safety">Ask an adult for inner cuts or craft-knife work.</p>':''}</div></div><div class="flow-actions">${e.mode==='choices'?link(path(e.id),'← Details',true):index?link(path(e.id,e.steps[index-1].screenId),'← Back',true):link(path(),'← Learning path',true)}<button class="btn" data-gothic-done="${e.id}:${s.screenId}">${e.mode==='choices'?'I made this detail ✓':index===e.steps.length-1?(e.id==='build'?'Finish the build ✓':'Finish this section ✓'):'Done · next step →'}</button></div>

  <dialog class="picture-dialog" aria-label="Enlarged step picture"><button class="btn secondary" data-gothic-close>Close ×</button>${picture(e.sheet,e.width,e.height,s.rect,s.title+' — '+s.instruction)}</dialog>`;
 }
 function studio(e,s,index){
  const illustration=()=>s.image?`<img class="guide-crop corrected-arch" src="${esc(s.image)}" alt="${esc(s.goalLabel+' — '+s.instruction)}">`:picture(e.sheet,e.width,e.height,s.rect,s.title+' — '+s.instruction);
  const measurements=s.sideWidth?`<div class="arch-measures" aria-label="Frame measurements in centimetres"><span>↔ Side <b>${s.sideWidth} cm</b></span>${s.topGap?`<span>↕ Top gap <b>${s.topGap} cm</b></span>`:''}</div>`:'';
  main.innerHTML=`<div class="project-top">${link(path(),'← Learning path',true)}<span>${e.title} · ${index+1} / ${e.steps.length}</span></div>
   <progress class="making-progress" value="${index+1}" max="${e.steps.length}" aria-label="Step ${index+1} of ${e.steps.length}"></progress>
   <section class="action-studio" data-mode="result" aria-labelledby="studio-title">
    <header class="studio-heading"><div><div class="eyebrow">Make this · Step ${index+1}</div><h1 id="studio-title">${s.title}</h1></div><p>${s.instruction}</p></header>
    <div class="studio-canvas">
     <div class="studio-target"><span class="studio-label">${s.goalLabel||'Your goal'}</span>${illustration()}${measurements}<button class="text-button" data-gothic-zoom aria-label="Enlarge the goal picture">Look closer ↗</button></div>
     <div class="studio-motion" hidden><div class="stream-host" data-title="${esc(s.title)}" data-short="${esc(s.video.motion)}" data-full="${esc(s.video.src)}"></div><span class="motion-status" role="status" aria-live="polite">Watch the movement</span></div>
    </div>
    <div class="studio-tools"><button class="btn secondary" data-motion-go>See how it moves →</button><button class="text-button" data-motion-pause hidden>Pause</button><button class="text-button" data-motion-result hidden>Back to goal</button><details class="motion-more" hidden><summary>Need more help?</summary><button class="text-button" data-motion-full>See the full demonstration</button></details></div>
    ${s.cutting?'<p class="studio-safety">Adult help for inner cuts or craft-knife work.</p>':''}
   </section>
   <div class="flow-actions">${index?link(path(e.id,e.steps[index-1].screenId),'← Back',true):link(path(),'← Learning path',true)}<button class="btn" data-gothic-done="${e.id}:${s.screenId}">${index===e.steps.length-1?'Finish this section ✓':'I’ve made it · next →'}</button></div>
   <dialog class="picture-dialog" aria-label="Enlarged goal picture"><button class="btn secondary" data-gothic-close>Close ×</button>${illustration()}</dialog>`;
 }
 async function showMotion(full=false){
  stopMotion();
  const request=motionRequest,studio=main.querySelector('.action-studio'),host=studio.querySelector('.stream-host');
  studio.dataset.mode='motion';studio.querySelector('.studio-motion').hidden=false;
  studio.querySelector('.studio-motion').dataset.full=String(full);
  for(const selector of ['[data-motion-result]','.motion-more'])studio.querySelector(selector).hidden=false;
  const pause=studio.querySelector('[data-motion-pause]'),status=studio.querySelector('.motion-status');
  pause.hidden=true;
  studio.querySelector('[data-motion-go]').textContent='Replay movement ↻';
  status.textContent='Loading movement…';
  const current=()=>request===motionRequest&&studio.isConnected;
  try{
   const player=await mountStream(host,full?host.dataset.full:host.dataset.short,{
    full,title:host.dataset.title,isCurrent:current,
    onPlay:()=>{status.textContent=full?'Follow at your own pace':'Watch the movement';pause.hidden=false;pause.textContent='Pause';},
    onPause:()=>{pause.textContent='Resume';},
    onEnded:()=>{status.textContent='Your turn · make yours';pause.hidden=true;},
    onError:()=>{status.textContent='Movement could not load. Try replaying; the goal picture is ready.';pause.hidden=true;}
   });
   if(!current()){player?.destroy();return;}
   activePlayer=player;
   pause.hidden=false;pause.textContent='Resume';
   await player.play();
  }catch{if(current()){status.textContent=activePlayer?'Press Resume to start':'Movement could not load. Try replaying; the goal picture is ready.';pause.hidden=!activePlayer;pause.textContent='Resume';}}
 }
 function map(){const next=nextElement(),started=done().length>0,ready=state.responses['gothic:ready']||started;main.innerHTML=`<div class="project-top">${link('#overview','← Cardboard',true)}<span>SMART CLASS</span></div><header class="path-heading"><div class="eyebrow">Your learning path</div><h1>Build a Gothic-inspired Cathedral</h1><p>Make the parts. Plan. Build your own.</p><div class="path-progress">${P.elements.filter(completed).length} / 7 sections complete</div></header><ol class="learning-path">${P.elements.map((e,i)=>`<li><a href="${resume(e)}"><span class="route-number">${completed(e)?'✓':i+1}</span>${mapPic(e)}<span><strong>${e.title}</strong><small>${completed(e)?'Complete · revisit':skipped(e)?'Skipped · optional':e.mode==='choices'?'Choose one detail · optional':e.steps.length+' picture steps'}</small></span><span aria-hidden="true">→</span></a></li>`).join('')}</ol><div class="path-start">${link(next?(ready?resume(next):path('intro')):path('build','finished'),next?(started?'Continue learning →':'Start learning →'):'View your finished build →')}</div><details class="quiet-details path-resources"><summary>Materials & reference sheets</summary><p>${link(path('materials'),'Prepare materials',true)}</p><a href="${P.map.src}" target="_blank" rel="noopener">Whole project map ↗</a>${P.elements.filter((e,i,all)=>all.findIndex(x=>x.sheet===e.sheet)===i).map(e=>`<p><a href="${e.sheet}" target="_blank" rel="noopener">${e.title} guide ↗</a></p>`).join('')}</details>`;}
 function choices(e){main.innerHTML=`${link(path(),'← Learning path',true)}<header class="prepare-heading"><div class="eyebrow">Element 05 · Choose one or more</div><h1>Small details. Your choice.</h1><p>Pick a detail to make. You don’t need all five.</p></header><div class="element-grid">${e.steps.map(s=>`<a class="element-card" href="${path(e.id,s.screenId)}">${picture(e.sheet,e.width,e.height,s.rect,s.title)}<h3>${s.title}</h3><span class="muted">${done().includes(e.id+':'+s.screenId)?'Made ✓':'Choose this detail →'}</span></a>`).join('')}</div><div class="actions"><button class="btn secondary" data-gothic-skip>Skip decoration · continue →</button></div><details class="photo-reference"><summary>See all detail ideas</summary><img class="full-guide" src="${e.sheet}" alt="Five decorative options and examples on a building"></details>`;}
 function finish(e){const next=P.elements[P.elements.indexOf(e)+1],isBuild=e.id==='build';main.innerHTML=`${link(path(),'← Learning path',true)}<div class="project-intro"><div><div class="eyebrow">${completed(e)?(isBuild?'Build complete':'Section complete'):'Section preview'}</div><h1>${isBuild?'Your Gothic building':e.title}</h1><p>${isBuild?'One material. Your own design.':'Keep your pieces together for assembly.'}</p>${completed(e)?'':'<p class="muted">Some steps are still unchecked. Revisit them when you’re ready.</p>'}<div class="actions">${next?.steps.length?link(resume(next),'Next: '+next.title+' →'):link('#lesson/6/document','Photograph + present →')}${link(resume(e),e.mode==='choices'?'Choose another detail':'Revisit steps',true)}</div></div>${e.resultImage?`<img class="guide-crop corrected-arch" src="${e.resultImage}" alt="Three single frames stacked with aligned outer edges">`:picture(e.sheet,e.width,e.height,e.resultRect,e.title+' finished example')}</div>`;}
 function handleClick(event){const b=event.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-motion-go')){showMotion();return;}
  if(b.hasAttribute('data-motion-full')){b.closest('details').open=false;showMotion(true);return;}
  if(b.hasAttribute('data-motion-pause')){const v=activePlayer;if(!v)return;if(v.paused){Promise.resolve(v.play()).then(()=>{if(b.isConnected)b.textContent='Pause';}).catch(()=>{if(b.isConnected)b.textContent='Resume';});}else{v.pause();b.textContent='Resume';}return;}
  if(b.hasAttribute('data-motion-result')){const studio=main.querySelector('.action-studio');stopMotion();studio.querySelector('.stream-host').replaceChildren();studio.dataset.mode='result';studio.querySelector('.studio-motion').hidden=true;for(const sel of ['[data-motion-pause]','[data-motion-result]','.motion-more'])studio.querySelector(sel).hidden=true;studio.querySelector('[data-motion-go]').textContent='See how it moves →';return;}
  if(b.hasAttribute('data-gothic-ready')){state.responses['gothic:ready']=true;save();location.hash=resume(nextElement()||P.elements[0]);}
  if(b.hasAttribute('data-gothic-skip')){state.responses['gothic:skip-decoration']=true;save();location.hash=resume(P.elements[5]);}
  if(b.hasAttribute('data-gothic-zoom'))main.querySelector('dialog').showModal();
  if(b.hasAttribute('data-gothic-close'))main.querySelector('dialog').close();
  if(b.dataset.gothicDone){const [id,stepId]=b.dataset.gothicDone.split(':'),e=P.elements.find(x=>x.id===id);if(!e)return;const i=e.steps.findIndex(x=>x.screenId===stepId);if(i<0)return;state.responses['gothic:done']=[...new Set([...done(),b.dataset.gothicDone])];save();
   // Whole-project finished: nextElement() is the same "is there
   // anything left to do" check the map screen and path-start link
   // already use (completed OR explicitly skipped, for every one of
   // the 7 elements) -- reuse it rather than a separate id==='build'
   // check, so this correctly fires whichever element happens to be
   // the last one finished, decoration-skipped or not.
   if(!nextElement())markCourseComplete();
   location.hash=path(id,e.mode==='choices'?'finished':e.steps[i+1]?.screenId||'finished');}
 }
 return {render,handleClick};
}
