/* Renovation adapter: moves the original room DOM intact, adds independent
   workstation controls, and hosts small activities without rewriting lessons. */
(() => {
  const content=window.FEIInspirationContent, store=window.FEIInspirationPractice;
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const originalStage=document.getElementById('stage');
  const originalAnchor=document.createComment('Original Studio position');originalStage.before(originalAnchor);
  const roomSvg=document.querySelector('#room > svg');
  let host=null,dialog=null,currentRoute=null,clock=null,practice=null,activity=null,owner=null;
  let observer=null,customPhoto=null,resultPhoto=null,photoReady=false,photoGeneration=0,practiceStorageAvailable=true;
  let activeAttempt=null,lineState={angle:0,width:4,count:5},lastFocus=null;
  let sketchSession=null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function emit(name,record={},eventId) {
    return FEICreationEvents.track(name,{creationSpace:'inspire',stationId:record.stationId,activityId:record.id,activityType:record.mode,category:practice?.category,...record},eventId);
  }
  function status(message) {const node=document.getElementById('insp-status');if(node)node.textContent=message;}
  function navigate(path='') {location.hash='inspire'+(path?'/'+path:'');}
  function owned(){return owner===store.identity();}
  function savePractice() {
    if(!practice||!activity||!owned())return false;
    const snapshot={...practice,phase:practice.phase==='running'?'paused':practice.phase,remaining:clock?clock.remaining:practice.remaining};
    practiceStorageAvailable=store.save(activity.id,snapshot);
    return practiceStorageAvailable;
  }
  function pausePractice(announce=false) {
    if(clock?.running){clock.pause();practice.remaining=clock.remaining;practice.phase='paused';savePractice();if(announce)status('Paused while you were away. Resume when you are ready.');}
  }
  function stopActivity() {
    sketchSession?.dispose();sketchSession=null;
    if(activity&&activity.kind!=='sketch'){
      pausePractice();
      emit('inspiration_activity_exited',{...activity,completionStatus:practice?.phase==='complete'?'complete':'exited'},activeAttempt?activeAttempt+':exit':undefined);
      if(practice)savePractice();
    }
    clock?.stop();clock=null;practice=null;activity=null;activeAttempt=null;photoGeneration++;
    if(customPhoto)URL.revokeObjectURL(customPhoto);customPhoto=null;
    if(resultPhoto)URL.revokeObjectURL(resultPhoto);resultPhoto=null;
  }
  function addFurniture() {
    if(document.getElementById('art-observation'))return;
    // New observation desk in an unused part of the original room. Existing
    // furniture groups stay intact; the additions use its wood and ink palette.
    const template=document.createElement('template');
    template.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg"><g id="art-observation" class="station-art">
      <ellipse cx="510" cy="660" rx="135" ry="18" fill="#40392f" opacity=".15"/>
      <path d="M390 535L635 550L650 600L405 585Z" fill="#bf9b76" stroke="#504738" stroke-width="3"/>
      <path d="M412 586L420 694M626 601L630 700" stroke="#796044" stroke-width="13"/>
      <path d="M420 525L500 528L497 580L416 576Z" fill="#fffdf5" stroke="#6f6659" stroke-width="2"/>
      <path d="M501 528L575 531L577 580L497 580Z" fill="#fcf0cc" stroke="#6f6659" stroke-width="2"/>
      <path d="M445 545Q463 532 478 551M443 558L480 561" stroke="#7b91a5" stroke-width="3" fill="none"/>
      <circle cx="593" cy="543" r="19" fill="#f8f0c5" stroke="#504738" stroke-width="4"/><path d="M593 530V543L604 549M585 520H601" fill="none" stroke="#504738" stroke-width="3"/>
      <path d="M433 598L520 603" stroke="#d4a858" stroke-width="7"/>
      <circle cx="531" cy="553" r="16" fill="#d1e5ed" fill-opacity=".7" stroke="#67583f" stroke-width="4"/><path d="M541 566L558 588" stroke="#67583f" stroke-width="7"/>
      <ellipse cx="495" cy="722" rx="37" ry="12" fill="#928578"/><path d="M470 718V754M520 718V754" stroke="#756754" stroke-width="6"/>
    </g><g id="insp-lamp"><path d="M1500 655L1490 575L1450 550" stroke="#514b46" stroke-width="8" fill="none"/><path d="M1408 555L1450 522L1482 565Z" fill="#c8dce8" stroke="#514b46" stroke-width="3"/><ellipse cx="1500" cy="657" rx="36" ry="10" fill="#514b46"/><path d="M1430 561L1370 685L1510 685L1460 566Z" fill="#fff3bf" opacity=".4"/></g></svg>`;
    [...template.content.firstElementChild.children].forEach(g=>roomSvg.insertBefore(g,document.getElementById('room-artchi')));
    stationRestPoints.observation={x:585,y:470};
  }
  const viewboxes={material:'1190 705 400 330',visual:'40 550 300 370',observation:'370 490 310 290',shape:'650 690 360 330',light:'1160 300 430 410',thinking:'700 250 290 250'};
  function stationPreview(s) {
    const art=document.getElementById('art-'+s.art).cloneNode(true);art.removeAttribute('id');
    const lamp=s.id==='light'?document.getElementById('insp-lamp').cloneNode(true):null;lamp?.removeAttribute('id');
    return `<svg class="insp-mini" viewBox="${viewboxes[s.id]}" aria-hidden="true">${art.outerHTML}${lamp?.outerHTML||''}</svg>`;
  }
  function unfinished() {return content.activities.filter(a=>['sketch','memory'].includes(a.kind)&&['paused','recall'].includes(store.load(a.id)?.phase));}
  function mount(main,routeParts=[]) {
    const key=routeParts.join('/');
    if(host===main&&currentRoute===key&&owned())return;
    if(!host||host!==main||!owned()) {
      dispose();host=main;owner=store.identity();
      addFurniture();
      const resumes=unfinished();
      main.innerHTML=`<section class="inspiration"><header class="insp-heading"><div><small>CREATION / INSPIRATION STUDIO</small><h1>Welcome to Get Inspired</h1><p>Find your seat. Try something new.</p></div><div class="insp-actions"><a href="#welcome">← Back to Creation</a><a class="insp-quick" href="#inspire/activity/quick-sketch">Start a Quick Challenge ↗</a></div></header>
        <div id="insp-guidance"></div><div id="insp-resume">${resumes.length?`<p>Continue Learning · ${resumes.map(a=>`<a href="#inspire/activity/${a.id}">${a.title} →</a>`).join(' · ')}</p>`:''}</div>
        <div class="insp-room" aria-label="Creative Studio with six workstations"><div id="insp-room-mount"></div><div class="insp-room-caption">FIND YOUR SEAT · EXPLORE YOUR IDEAS</div><nav class="insp-workstations" aria-label="Six creative workstations">${content.stations.map((s,i)=>`<a class="insp-seat" data-seat="${s.id}" href="#inspire/station/${s.id}" style="--x:${s.x}%;--y:${s.y}%;--seat-color:${s.color}">${stationPreview(s)}<span class="insp-seat-label"><small>0${i+1}</small><strong>${s.title}</strong><span>${s.subtitle}</span><b>${content.activities.filter(a=>a.stationId===s.id&&a.published).length?'Explore →':'Preview this space →'}</b></span></a>`).join('')}</nav></div>
        <footer class="insp-footer"><p>Explore materials, play with ideas, and discover new ways to see.</p><button type="button" id="insp-guide-again">Ask Artchi</button><button type="button" id="insp-tour">Original Studio tour</button><details class="insp-legacy"><summary>Original Studio projects & tools</summary><p>Your familiar work areas are still here, including their original coming-soon activities.</p><div class="c3-stations">${Object.entries(stations).map(([id,s])=>`<button type="button" data-station="${id}">${escape(s.title)}</button>`).join('')}</div></details></footer>
        <p id="insp-status" role="status" aria-live="polite"></p><dialog id="insp-dialog" aria-labelledby="insp-panel-title"></dialog></section>`;
      document.getElementById('insp-room-mount').append(originalStage);
      originalStage.querySelector('.header').inert=true;
      dialog=document.getElementById('insp-dialog');
      dialog.addEventListener('cancel',e=>{e.preventDefault();navigate(activity?'station/'+activity.stationId:'');});
      main.querySelectorAll('[data-seat]').forEach(el=>{
        const s=content.stations.find(s=>s.id===el.dataset.seat);
        const focus=()=>{document.getElementById('art-'+s.art).classList.add('insp-highlight');if(!reduced.matches)summonArtchiToStation(s.art);};
        const blur=()=>{document.getElementById('art-'+s.art).classList.remove('insp-highlight');if(!reduced.matches)releaseArtchi();};
        el.addEventListener('mouseenter',focus);el.addEventListener('focus',focus);el.addEventListener('mouseleave',blur);el.addEventListener('blur',blur);
      });
      document.getElementById('insp-guide-again').onclick=()=>guidance(true);
      document.getElementById('insp-tour').onclick=()=>window.openCreationTour?.();
      observer=new ResizeObserver(()=>{
        const room=main.querySelector('.insp-room');room.style.setProperty('--insp-scale',room.clientWidth/1800);
      });observer.observe(main.querySelector('.insp-room'));
      guidance(false);emit('inspiration_studio_entered',{source:'creation'});
      if(reduced.matches)clearTimeout(wanderTimeoutId);
    }
    if(currentRoute!==key){stopActivity();currentRoute=key;}
    const [kind,id]=routeParts;
    if(kind==='station'&&content.stations.some(s=>s.id===id))openStationPanel(id);
    else if(kind==='activity'&&content.activities.some(a=>a.id===id&&a.published))openActivity(id);
    else {if(dialog.open)dialog.close();if(kind)status('This activity is not available yet. Choose a workstation to explore.');lastFocus?.focus();}
    const resumes=unfinished();
    document.getElementById('insp-resume').innerHTML=resumes.length?`<p>Continue Learning · ${resumes.map(a=>`<a href="#inspire/activity/${a.id}">${a.title} →</a>`).join(' · ')}</p>`:'';
  }
  function guidance(replay) {
    const who=store.identity(),key='feiInspiration.artchi.v1:'+encodeURIComponent(who||'guest');
    let seen=false;try{seen=localStorage.getItem(key)==='seen';}catch{}
    if(seen&&!replay)return;
    try{localStorage.setItem(key,'seen');}catch{}
    const area=document.getElementById('insp-guidance');
    area.innerHTML=`<aside class="insp-artchi-note"><img src="../core/dashboard-artchi.svg" alt="Artchi"><div><strong>Welcome! Pick a seat and try a creative challenge.</strong><p>You don't need to make a perfect artwork here!</p><a href="#inspire/activity/quick-sketch" id="insp-suggestion">Try a 60-second sketch →</a></div><button type="button" aria-label="Dismiss Artchi introduction">×</button></aside>`;
    area.querySelector('button').onclick=()=>area.replaceChildren();
    area.querySelector('a').onclick=()=>{emit('artchi_suggestion_selected',{stationId:'observation',activityId:'quick-sketch',source:'artchi'});area.replaceChildren();};
  }
  function showPanel(html) {
    lastFocus=document.activeElement?.closest('[data-seat]')||lastFocus;
    dialog.innerHTML=html;
    if(!dialog.open)dialog.showModal();
    dialog.querySelector('h2')?.focus();
  }
  function panelHeader(title,back) {return `<header class="insp-panel-header"><h2 id="insp-panel-title" tabindex="-1">${escape(title)}</h2><button type="button" data-close-panel aria-label="${back?'Back to workstation':'Back to Studio'}">${back?'← Workstation':'× Close'}</button></header>`;}
  function wireClose(back) {dialog.querySelector('[data-close-panel]').onclick=()=>navigate(back?'station/'+back:'');}
  function openStationPanel(id) {
    const station=content.stations.find(s=>s.id===id);
    emit('studio_station_opened',{stationId:id});
    showPanel(`${panelHeader(station.title)}<p class="insp-purpose">${station.subtitle}</p><div class="insp-station-intro">${stationPreview(station)}<p>${station.objects}.<br><span>Artchi: ${station.guidance}</span></p></div><div class="insp-activity-list">${content.activities.filter(a=>a.stationId===id).map(a=>`<article class="insp-activity ${a.published?'':'insp-draft'}">${a.thumbnail?`<img src="${a.thumbnail}" alt="${escape(a.title)} activity preview" loading="lazy">`:stationPreview(station)}<div><h3>${a.title}</h3><p>${a.description}</p>${a.materials?`<p class="insp-materials">${a.materials}</p>`:''}${a.published?`<a href="#inspire/activity/${a.id}">${['paused','recall'].includes(store.load(a.id)?.phase)?'Continue':'Explore activity'} →</a>`:'<span class="insp-coming">In preparation · no activity yet</span>'}</div></article>`).join('')}</div>`);
    wireClose();
  }
  function openActivity(id) {
    activity=content.activities.find(a=>a.id===id);activeAttempt=crypto.randomUUID();
    emit('inspiration_activity_opened',activity);
    if(['sketch','memory'].includes(activity.kind))return openPractice();
    showPanel(`${panelHeader(activity.title,true)}<p>${activity.description}</p><div id="insp-activity-body"></div>`);wireClose(activity.stationId);
    const area=document.getElementById('insp-activity-body');
    if(activity.kind==='existing'){
      area.innerHTML=`${activity.thumbnail?`<img class="insp-existing-photo" src="${activity.thumbnail}" alt="Original ${activity.title} activity">`:''}<p>This opens the existing lesson with its original tools and saved progress. Use your browser’s Back button to return to this workstation.</p><button type="button" id="insp-start-existing">Start ${activity.title} →</button><p id="insp-local-status" role="status"></p>`;
      area.querySelector('button').onclick=async e=>{
        const record=activity,attempt=activeAttempt;e.target.disabled=true;
        try{
          await FEIAccess.init();const allowed=await FEIAccess.canOpenLesson('creation',record.lessonId);
          if(activity!==record)return;
          if(!allowed.allowed){document.getElementById('insp-local-status').innerHTML=allowed.reason==='not_signed_in'?'<a href="../">Sign in from the Student Dashboard to continue →</a>':'<a href="../upgrade/?reason=paywall_creation&branch=creation">View access options →</a>';return;}
          await FEIAccess.recordLessonOpened('creation',record.lessonId);
          if(activity!==record)return;
          emit('inspiration_activity_started',record,attempt+':start');location.href=record.existingRoute;
        }catch{const node=document.getElementById('insp-local-status');if(node)node.textContent='We could not check access. Please try again.';}finally{e.target.disabled=false;}
      };
    }else if(activity.kind==='video'){
      area.innerHTML=`<div class="insp-video-placeholder"><p>FEI TeamArt · Teacher demonstration</p><button type="button" id="insp-load-video">Load teacher video</button><p>Loads YouTube when you choose to play.</p></div><p><a href="https://www.youtube.com/watch?v=${activity.videoId}" target="_blank" rel="noopener">Watch on YouTube ↗</a></p><section class="insp-prompt"><h3>Now try an idea</h3><p>${activity.challenge}</p>${activity.stationId==='observation'?'<a href="#inspire/activity/memory-practice">Try Look, Hide, Remember →</a>':'<p>You need paper and a pencil. Keep your first idea, then try another.</p>'}<button type="button" id="insp-practice-done">I tried the challenge</button><p id="insp-video-status" role="status"></p></section>`;
      area.querySelector('#insp-load-video').onclick=()=>{
        emit('inspiration_activity_started',activity,activeAttempt+':start');
        area.querySelector('.insp-video-placeholder').innerHTML=`<iframe class="insp-video" src="https://www.youtube-nocookie.com/embed/${activity.videoId}?rel=0" title="${escape(activity.title)} — FEI TeamArt" allow="encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
      };
      area.querySelector('#insp-practice-done').onclick=e=>{emit('inspiration_activity_started',activity,activeAttempt+':start');emit('inspiration_activity_completed',{...activity,completionStatus:'self_reported'},activeAttempt+':complete');e.target.disabled=true;document.getElementById('insp-video-status').textContent='What surprised you? Keep that discovery for your next idea.';};
    }else if(activity.kind==='lines')openLines(area);
  }
  function openLines(area) {
    lineState={angle:0,width:4,count:5};
    area.innerHTML=`<div class="insp-line-board"><svg viewBox="0 0 500 300" role="img" aria-label="A composition of lines that changes with your choices"><g id="insp-line-marks"></g></svg></div><div class="insp-line-controls">${[['angle','Direction',-70,70,0],['width','Thickness',1,16,4],['count','Repetition',1,10,5]].map(([key,title,min,max,value])=>`<label>${title}<input type="range" data-line="${key}" min="${min}" max="${max}" value="${value}"></label>`).join('')}</div><p>Which arrangement feels calm to you? Which has more movement? There is no single correct answer.</p><button type="button" id="insp-lines-done">Keep this discovery</button><p id="insp-line-status" role="status"></p>`;
    function draw(){document.getElementById('insp-line-marks').innerHTML=Array.from({length:lineState.count},(_,i)=>`<path d="M130 ${70+i*160/Math.max(1,lineState.count-1)}H370" stroke="${i%2?'#7c6a9b':'#3d5669'}" stroke-width="${lineState.width}" stroke-linecap="round" transform="rotate(${lineState.angle} 250 150)"/>`).join('');}
    area.querySelectorAll('[data-line]').forEach(input=>{input.oninput=()=>{lineState[input.dataset.line]=Number(input.value);draw();};input.onchange=()=>emit('inspiration_activity_started',activity,activeAttempt+':start');});draw();
    area.querySelector('#insp-lines-done').onclick=e=>{
      emit('inspiration_activity_started',activity,activeAttempt+':start');emit('inspiration_activity_completed',{...activity,completionStatus:'self_reported'},activeAttempt+':complete');
      const ok=store.save('line-discovery',{...lineState,at:new Date().toISOString()});
      if(ok)emit('inspiration_result_saved',activity,activeAttempt+':save');
      document.getElementById('insp-line-status').textContent=ok?'Saved on this browser. Try a different rhythm next time.':'Discovery complete. Sign in and allow browser storage to keep it here.';e.target.disabled=true;
    };
  }
  function newPractice(category='animals',reference=content.references.find(r=>r.category===category)?.id||'custom',duration=60){return {phase:'ready',category,reference,duration,remaining:activity.kind==='memory'?10000:duration*1000,attemptId:crypto.randomUUID(),reflection:''};}
  function openPractice() {
    if(activity.kind==='sketch'){
      const record=activity;
      showPanel(`${panelHeader(activity.title,true)}<div id="insp-practice"></div>`);wireClose(activity.stationId);
      sketchSession=new FEISketchSession(document.getElementById('insp-practice'),(name,props,eventId)=>emit(name,{...record,...props},eventId));return;
    }
    practice=store.load(activity.id)||newPractice();activeAttempt=practice.attemptId;
    showPanel(`${panelHeader(activity.title,true)}<div id="insp-practice"></div>`);wireClose(activity.stationId);renderPractice();
  }
  function renderPractice() {
    const area=document.getElementById('insp-practice');if(!area||!practice)return;
    const memory=activity.kind==='memory',completed=practice.phase==='complete';
    const ready=practice.phase==='ready',recall=practice.phase==='recall';
    const ref=content.references.find(r=>r.id===practice.reference);
    const url=practice.reference==='custom'?customPhoto:ref?.url;
    photoReady=false;const gen=++photoGeneration;
    area.innerHTML=`<p>${memory?'Look closely for 10 seconds. Hide the photograph, then sketch what you remember.':'Look for the big shapes and draw what you notice. Strange shapes are welcome. Perfect drawings are not the goal!'}</p>
      <div class="insp-practice-grid"><figure class="insp-reference">${url?`<img id="insp-reference-image" src="${escape(url)}" alt="${escape(practice.reference==='custom'?'Your chosen reference photograph':ref.alt)}" ${recall?'hidden':''}>`:''}<div id="insp-photo-note" ${url&&!recall?'hidden':''}>${recall?'Photograph hidden. What shapes do you remember?':practice.category==='objects'?'Choose a photograph below.':'Choose your photo again to continue, or select Try Again to use a Studio photograph.'}</div><figcaption>${practice.reference==='custom'?'Your photo · stays on this device':escape(ref?.title||'Your reference')}</figcaption></figure>
      <section class="insp-practice-controls"><label>Subject<select id="insp-category" ${!ready?'disabled':''}><option value="animals">Animals</option><option value="flowers">Flowers</option><option value="objects">Everyday objects</option></select></label>
      ${ready?`<label>Reference<select id="insp-reference"><option value="custom">Choose my own photo</option>${content.references.filter(r=>r.category===practice.category).map(r=>`<option value="${r.id}">${r.title}</option>`).join('')}</select></label>`:''}
      ${(ready||practice.reference==='custom'&&!customPhoto)?'<label class="insp-photo-picker">Choose a reference photo<input id="insp-photo-input" type="file" accept="image/jpeg,image/png,image/webp"></label><p class="insp-small">Used only here. No photo is uploaded.</p>':''}
      ${!memory?`<label>Drawing time<select id="insp-duration" ${!ready?'disabled':''}><option value="30">30 seconds</option><option value="60">60 seconds</option><option value="120">120 seconds</option></select></label>`:''}
      <div class="insp-clock" role="timer" aria-label="Time remaining" aria-live="off"><span id="insp-seconds">${Math.ceil(practice.remaining/1000)}</span><small>seconds${practice.phase==='paused'?' · paused':''}</small></div>
      <p>Use real paper and a pencil. You can leave and return at any time.</p>
      <div class="insp-practice-actions">${completed?'<strong>Practice complete. What did you notice?</strong>':recall?'<button type="button" id="insp-reveal">Reveal & compare</button>':`<button type="button" id="insp-run" disabled>${practice.phase==='running'?'Pause':practice.phase==='paused'?'Resume':memory?'Observe for 10 seconds':'Start timer'}</button>`}${!ready?'<button type="button" id="insp-restart">Try Again</button>':''}${!ready&&!completed&&!recall?'<button type="button" id="insp-finish">Finish this practice now</button>':''}</div>
      <p id="insp-practice-status" role="status">${!store.identity()?'Sign in to keep a paused practice between visits.':!practiceStorageAvailable?'Browser storage is unavailable; keep this page open to continue later.':''}</p></section></div>
      ${completed?`<section class="insp-reflection"><label>What did you notice? <span>(optional)</span><textarea id="insp-reflection" maxlength="500" rows="3" placeholder="A shape, a detail, something unexpected…">${escape(practice.reflection)}</textarea></label><div class="insp-actions"><button type="button" id="insp-save-note">Save practice note</button><button type="button" id="insp-next">Next Picture</button><a href="#inspire/station/observation">Back to Look Closer →</a></div><details><summary>Save My Sketch (optional)</summary><p>Choose a photo of your paper sketch to preview and download a copy. It stays on your device.</p><input id="insp-sketch-input" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Choose a photograph of your sketch"><div id="insp-sketch-preview"></div></details></section>`:''}`;
    document.getElementById('insp-category').value=practice.category;
    if(ready){document.getElementById('insp-reference').value=practice.reference;document.getElementById('insp-reference').onchange=e=>{practice.reference=e.target.value;renderPractice();};}
    document.getElementById('insp-category').onchange=e=>{practice.category=e.target.value;practice.reference=content.references.find(r=>r.category===practice.category)?.id||'custom';renderPractice();};
    const duration=document.getElementById('insp-duration');if(duration){duration.value=practice.duration;duration.onchange=e=>{practice.duration=Number(e.target.value);practice.remaining=practice.duration*1000;renderPractice();};}
    const img=document.getElementById('insp-reference-image');
    const loaded=()=>{if(gen!==photoGeneration)return;photoReady=true;const run=document.getElementById('insp-run');if(run)run.disabled=false;};
    if(img){img.onload=loaded;img.onerror=()=>{if(gen!==photoGeneration)return;pausePractice();img.hidden=true;const note=document.getElementById('insp-photo-note');note.hidden=false;note.textContent='This photograph could not load. Choose your own photo or try again.';const run=document.getElementById('insp-run');if(run)run.disabled=true;};if(img.complete&&img.naturalWidth)loaded();}
    const input=document.getElementById('insp-photo-input');if(input)input.onchange=()=>readPhoto(input,file=>{if(customPhoto)URL.revokeObjectURL(customPhoto);customPhoto=URL.createObjectURL(file);practice.reference='custom';renderPractice();});
    document.getElementById('insp-run')?.addEventListener('click',toggleTimer);
    document.getElementById('insp-finish')?.addEventListener('click',()=>completePractice('self_reported'));
    document.getElementById('insp-reveal')?.addEventListener('click',()=>completePractice('self_reported'));
    document.getElementById('insp-restart')?.addEventListener('click',()=>retry(false));
    document.getElementById('insp-next')?.addEventListener('click',()=>retry(true));
    document.getElementById('insp-reflection')?.addEventListener('input',e=>{practice.reflection=e.target.value;});
    document.getElementById('insp-save-note')?.addEventListener('click',()=>{const ok=savePractice();if(ok)emit('inspiration_result_saved',activity,activeAttempt+':save');document.getElementById('insp-practice-status').textContent=ok?'Practice note saved on this browser.':'Your note could not be saved. Sign in and allow browser storage to keep it.';});
    const sketch=document.getElementById('insp-sketch-input');if(sketch)sketch.onchange=()=>readPhoto(sketch,file=>{
      if(resultPhoto)URL.revokeObjectURL(resultPhoto);resultPhoto=URL.createObjectURL(file);
      document.getElementById('insp-sketch-preview').innerHTML=`<img src="${resultPhoto}" alt="Your paper sketch"><a href="${resultPhoto}" download="my-quick-sketch.${file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg'}">Download my sketch →</a>`;
      document.querySelector('#insp-sketch-preview a').onclick=()=>emit('inspiration_result_saved',{...activity,source:'download'},activeAttempt+':download');
    });
  }
  function readPhoto(input,callback) {
    const file=input.files[0];if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12*1024*1024){document.getElementById('insp-practice-status').textContent='Choose a JPG, PNG or WebP photograph under 12 MB.';input.value='';return;}
    callback(file);
  }
  function toggleTimer() {
    if(!owned()){navigate();return;}
    if(clock?.running){pausePractice();renderPractice();return;}
    if(!photoReady)return;
    const wasPaused=practice.phase==='paused';
    if(!clock){clock=new store.PracticeClock(practice.duration,ms=>{const node=document.getElementById('insp-seconds');if(node)node.textContent=Math.ceil(ms/1000);},()=>{
      practice.remaining=0;
      if(activity.kind==='memory'){practice.phase='recall';savePractice();renderPractice();document.getElementById('insp-reveal').focus();}
      else completePractice('timer_finished');
    });clock.remaining=practice.remaining;}
    practice.phase='running';
    emit(wasPaused?'inspiration_activity_resumed':'inspiration_activity_started',activity,wasPaused?undefined:activeAttempt+':start');
    clock.start();savePractice();renderPractice();
    document.getElementById('insp-run')?.focus();
  }
  function completePractice(reason) {
    clock?.pause();practice.remaining=clock?clock.remaining:practice.remaining;practice.phase='complete';
    emit('inspiration_activity_completed',{...activity,completionStatus:reason},activeAttempt+':complete');savePractice();renderPractice();document.getElementById('insp-reflection')?.focus();
  }
  function retry(next) {
    clock?.stop();clock=null;
    emit('inspiration_activity_retried',activity);
    const refs=content.references.filter(r=>r.category===practice.category);
    const reference=next&&refs.length?refs[(refs.findIndex(r=>r.id===practice.reference)+1)%refs.length].id:practice.reference;
    practice=newPractice(practice.category,reference,practice.duration);activeAttempt=practice.attemptId;savePractice();renderPractice();
  }
  function dispose() {
    stopActivity();observer?.disconnect();observer=null;
    if(dialog?.open)dialog.close();dialog=null;
    if(originalStage.parentNode!==originalAnchor.parentNode)originalAnchor.after(originalStage);
    originalStage.querySelector('.header').inert=false;
    host=null;currentRoute=null;owner=null;
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden){pausePractice(true);if(practice)renderPractice();}});
  window.addEventListener('pagehide',()=>{pausePractice();savePractice();});
  window.addEventListener('beforeunload',()=>{pausePractice();savePractice();});
  reduced.addEventListener('change',()=>{if(reduced.matches)clearTimeout(wanderTimeoutId);else if(host)releaseArtchi();});
  window.FEIInspirationStudio={mount,dispose};
})();
