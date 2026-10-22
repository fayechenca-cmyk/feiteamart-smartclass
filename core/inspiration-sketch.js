/* A chosen set of photographs, one timed round per image. No uploads. */
(() => {
  const store=window.FEIInspirationPractice,refs=window.FEIInspirationContent.references;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.FEISketchSession=function(area,emit) {
    const owner=store.identity();let clock=null,photo=null,sketch=null,generation=0,photoReady=false,autoNext=false,disposed=false;
    const fresh=()=>({version:2,phase:'ready',category:'animals',reference:refs[0].id,queue:[],quantity:5,index:0,completed:0,duration:60,remaining:60000,attemptId:crypto.randomUUID(),reflection:''});
    let state=store.load('quick-sketch')||fresh();
    if(!state.queue)state={...state,version:2,queue:[state.reference],quantity:1,index:0,completed:state.phase==='complete'?1:0};
    function event(name,props={},suffix){emit(name,{category:state.category,...props},suffix?state.attemptId+':'+suffix:undefined);}
    function save(){if(owner!==store.identity())return false;return store.save('quick-sketch',{...state,phase:state.phase==='running'?'paused':state.phase,remaining:clock?clock.remaining:state.remaining});}
    function note(text){const node=area.querySelector('#insp-practice-status');if(node)node.textContent=text;}
    function pause(){autoNext=false;if(clock?.running){clock.pause();state.remaining=clock.remaining;state.phase='paused';save();}}
    function stopClock(){clock?.stop();clock=null;}
    function validFile(file){return file&&['image/jpeg','image/png','image/webp'].includes(file.type)&&file.size<=12*1024*1024;}
    function render(){
      if(disposed)return;
      const gridScroll=area.querySelector('.insp-photo-grid')?.scrollTop||0;
      const ready=state.phase==='ready',done=state.phase==='complete',running=state.phase==='running';
      const reference=refs.find(r=>r.id===state.reference),url=state.reference==='custom'?photo:reference?.url;
      photoReady=false;const gen=++generation;
      area.innerHTML=`<p>Choose your pictures, then sketch them one after another. The next picture starts automatically when its photograph is ready.</p>
        ${ready?`<section class="insp-set-builder"><div class="insp-set-settings"><label>Pictures in this set<select id="insp-quantity">${[1,2,5,10,15,20].map(n=>`<option value="${n}">${n} ${n===1?'picture':'pictures'}</option>`).join('')}</select></label><label>Time per picture<select id="insp-duration">${[30,60,120].map(n=>`<option value="${n}">${n} seconds</option>`).join('')}</select></label><label>Browse subjects<select id="insp-category"><option value="animals">Animals</option><option value="flowers">Flowers</option><option value="objects">Everyday objects</option></select></label></div>
        <p id="insp-set-summary" aria-live="polite">${state.queue.length} of ${state.quantity} selected · ${state.quantity} × ${state.duration} seconds = ${state.quantity*state.duration/60} minutes of drawing</p>
        <div class="insp-actions insp-set-start"><button type="button" id="insp-start-set" disabled>Start ${state.quantity}-picture set →</button><button type="button" id="insp-pick-set">Choose a set for me</button><button type="button" id="insp-clear-set">Clear selection</button></div>
        <div class="insp-photo-grid" aria-label="Choose reference photographs">${refs.filter(r=>r.category===state.category).map(r=>`<button type="button" data-pick-photo="${r.id}" aria-pressed="${state.queue.includes(r.id)}" aria-label="${esc(r.title)}"><img src="${esc(r.url)}" alt="" loading="lazy"><span>${esc(r.title)}</span><b>${state.queue.includes(r.id)?state.queue.indexOf(r.id)+1:'+'}</b></button>`).join('')}</div>
        <div class="insp-selected"><strong>Your drawing order</strong>${state.queue.length?state.queue.map((id,i)=>{const r=refs.find(r=>r.id===id);return `<button type="button" data-remove-photo="${id}" aria-label="Remove ${esc(r?.title||'your photo')} from set">${i+1}. ${esc(r?.title||'Your photo')} ×</button>`;}).join(''):'<p>Tap the pictures you want. You can mix animals, flowers and objects.</p>'}</div>
        <details><summary>Add my own reference photo (optional)</summary><label>JPG, PNG or WebP, up to 12 MB<input id="insp-photo-input" type="file" accept="image/jpeg,image/png,image/webp"></label><p>Stays on this device. Select it again if you reload.</p></details></section>`:''}
        <div class="insp-practice-grid"><figure class="insp-reference">${url&&state.queue.length?`<img id="insp-reference-image" src="${esc(url)}" alt="${esc(reference?.alt||'Your reference photograph')}">`:'<p>Select pictures above, or reselect your own reference photo to continue.</p>'}<figcaption>${esc(reference?.title||'Your photo')}</figcaption></figure><section class="insp-practice-controls">
        <h3 id="insp-round-status">${done?`Set ${state.completed===state.quantity?'complete':'stopped'} · ${state.completed} of ${state.quantity} drawings`:`Picture ${state.index+1} of ${state.quantity}`}</h3>
        <progress aria-label="Completed drawings" value="${state.completed}" max="${state.quantity}"></progress><p>${state.quantity} pictures · ${state.duration} seconds each</p>
        <div class="insp-clock" role="timer" aria-label="Time remaining" aria-live="off"><span id="insp-seconds">${Math.ceil(state.remaining/1000)}</span><small>seconds${state.phase==='paused'?' · paused':''}</small></div>
        ${!ready&&!done&&state.reference==='custom'&&!photo?'<label>Reselect your reference photo<input id="insp-photo-input" type="file" accept="image/jpeg,image/png,image/webp"></label>':''}
        <div class="insp-practice-actions">${!done?`<button type="button" id="insp-run" disabled>${running?'Pause':ready?'Start drawing set':'Resume set'}</button>`:''}${!ready?`<button type="button" id="insp-restart">Try This Set Again</button><button type="button" id="insp-new-set">Choose a New Set</button>`:''}${!ready&&!done?'<button type="button" id="insp-finish">End set early</button>':''}</div>
        <p id="insp-practice-status" role="status">${!owner?'Sign in to keep your place between visits.':'Your place is saved on this browser.'}</p></section></div>
        ${done?`<section class="insp-reflection"><label>What did you notice across your drawings? (optional)<textarea id="insp-reflection" maxlength="500" rows="3">${esc(state.reflection)}</textarea></label><button type="button" id="insp-save-note">Save practice note</button><a href="#inspire/station/observation">Back to Look Closer →</a><details><summary>Save My Sketch (optional)</summary><label>Choose a photograph of your paper sketches<input id="insp-sketch-input" type="file" accept="image/jpeg,image/png,image/webp"></label><div id="insp-sketch-preview"></div></details></section>`:''}`;
      if(ready){
        area.querySelector('.insp-photo-grid').scrollTop=gridScroll;
        area.querySelector('#insp-quantity').value=state.quantity;area.querySelector('#insp-duration').value=state.duration;area.querySelector('#insp-category').value=state.category;
        area.querySelector('#insp-quantity').onchange=e=>{state.quantity=Number(e.target.value);state.queue=state.queue.slice(0,state.quantity);selectionChanged();};
        area.querySelector('#insp-duration').onchange=e=>{state.duration=Number(e.target.value);state.remaining=state.duration*1000;save();render();};
        area.querySelector('#insp-category').onchange=e=>{state.category=e.target.value;save();render();};
        area.querySelectorAll('[data-pick-photo]').forEach(b=>b.onclick=()=>{
          const id=b.dataset.pickPhoto;if(state.queue.includes(id))state.queue=state.queue.filter(x=>x!==id);else if(state.queue.length<state.quantity)state.queue.push(id);else {note('Your set is full. Remove a picture or increase the set size.');return;}
          selectionChanged();area.querySelector(`[data-pick-photo="${id}"]`)?.focus({preventScroll:true});
        });
        area.querySelectorAll('[data-remove-photo]').forEach(b=>b.onclick=()=>{state.queue=state.queue.filter(id=>id!==b.dataset.removePhoto);selectionChanged();});
        area.querySelector('#insp-clear-set').onclick=()=>{state.queue=[];selectionChanged();};
        area.querySelector('#insp-pick-set').onclick=()=>{const available=refs.filter(r=>r.category===state.category&&!state.queue.includes(r.id));for(const r of available){if(state.queue.length===state.quantity)break;state.queue.push(r.id);}selectionChanged();};
      }
      const image=area.querySelector('#insp-reference-image');
      const loaded=()=>{if(gen!==generation||disposed)return;photoReady=true;area.querySelectorAll('#insp-run,#insp-start-set').forEach(run=>run.disabled=ready&&state.queue.length!==state.quantity);
        if(autoNext&&!document.hidden){autoNext=false;queueMicrotask(()=>{if(gen===generation&&!disposed&&!document.hidden)startRound(false);});} };
      if(image){image.onload=loaded;image.onerror=()=>{if(gen!==generation)return;pause();autoNext=false;note('This photograph could not load. Your timer is paused. Retry or choose a new set.');};if(image.complete&&image.naturalWidth)loaded();}
      const upload=area.querySelector('#insp-photo-input');if(upload)upload.onchange=()=>{const file=upload.files[0];if(!validFile(file)){note('Choose a JPG, PNG or WebP photo under 12 MB.');return;}if(ready&&!state.queue.includes('custom')&&state.queue.length===state.quantity){note('Remove a picture first to make room for your own photo.');return;}if(photo)URL.revokeObjectURL(photo);photo=URL.createObjectURL(file);if(ready){if(!state.queue.includes('custom'))state.queue.push('custom');selectionChanged();}else render();};
      area.querySelector('#insp-run')?.addEventListener('click',()=>{if(clock?.running){pause();render();}else startRound(true);});
      area.querySelector('#insp-start-set')?.addEventListener('click',()=>startRound(true));
      area.querySelector('#insp-finish')?.addEventListener('click',()=>finish(false));
      area.querySelector('#insp-restart')?.addEventListener('click',()=>{pause();stopClock();event('inspiration_activity_retried');state={...state,phase:'ready',index:0,completed:0,reference:state.queue[0],remaining:state.duration*1000,attemptId:crypto.randomUUID(),reflection:''};save();render();});
      area.querySelector('#insp-new-set')?.addEventListener('click',()=>{pause();stopClock();state=fresh();save();render();});
      area.querySelector('#insp-reflection')?.addEventListener('input',e=>state.reflection=e.target.value);
      area.querySelector('#insp-save-note')?.addEventListener('click',()=>{const ok=save();if(ok)event('inspiration_result_saved',{},'save');note(ok?'Practice note saved on this browser.':'Your note could not be saved. Sign in and allow browser storage.');});
      const sketchInput=area.querySelector('#insp-sketch-input');if(sketchInput)sketchInput.onchange=()=>{const file=sketchInput.files[0];if(!validFile(file)){note('Choose a JPG, PNG or WebP photo under 12 MB.');return;}if(sketch)URL.revokeObjectURL(sketch);sketch=URL.createObjectURL(file);area.querySelector('#insp-sketch-preview').innerHTML=`<img src="${sketch}" alt="Your sketches"><a href="${sketch}" download="my-sketches.${file.type.split('/')[1]}">Download my sketches →</a>`;area.querySelector('#insp-sketch-preview a').onclick=()=>event('inspiration_result_saved',{source:'download'},'download');};
    }
    function selectionChanged(){state.reference=state.queue[0]||refs[0].id;save();render();}
    function startRound(userAction){
      if(disposed||owner!==store.identity()||!photoReady||state.queue.length!==state.quantity)return;
      if(state.phase==='complete'||clock?.running)return;
      const wasPaused=state.phase==='paused';
      if(!clock){clock=new store.PracticeClock(state.duration,ms=>{const node=area.querySelector('#insp-seconds');if(node)node.textContent=Math.ceil(ms/1000);},()=>{
        state.remaining=0;state.completed=state.index+1;stopClock();
        if(state.completed===state.quantity){finish(true);return;}
        state.index++;state.reference=state.queue[state.index];state.remaining=state.duration*1000;state.phase='paused';autoNext=!document.hidden;save();render();
      });clock.remaining=state.remaining;}
      if(userAction)event(wasPaused?'inspiration_activity_resumed':'inspiration_activity_started',{},wasPaused?undefined:'start');
      state.phase='running';clock.start();save();render();
      if(userAction)area.closest('dialog').scrollTop=0;
    }
    function finish(all){pause();stopClock();state.phase='complete';if(all){state.remaining=0;event('inspiration_activity_completed',{completionStatus:'timer_finished'},'complete');}else event('inspiration_activity_exited',{completionStatus:'ended_early'},'early');save();render();area.querySelector('#insp-reflection')?.focus();}
    function hidden(){if(document.hidden){pause();save();render();}}
    function leaving(){pause();save();}
    document.addEventListener('visibilitychange',hidden);window.addEventListener('pagehide',leaving);window.addEventListener('beforeunload',leaving);
    render();
    return {dispose(){pause();save();stopClock();disposed=true;generation++;if(photo)URL.revokeObjectURL(photo);if(sketch)URL.revokeObjectURL(sketch);document.removeEventListener('visibilitychange',hidden);window.removeEventListener('pagehide',leaving);window.removeEventListener('beforeunload',leaving);event('inspiration_activity_exited',{completionStatus:state.completed===state.quantity?'complete':state.phase==='complete'?'ended_early':'exited'},'exit');}};
  };
})();
