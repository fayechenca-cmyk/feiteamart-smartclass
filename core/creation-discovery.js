/* Additive navigation over the original Studio. No lesson state is rewritten. */
(() => {
  const root=document.getElementById('creation-app');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const assets=window.FEICreationAssets;
  const projects=Object.entries(stations).flatMap(([station,s])=>s.courses.filter(c=>c.available&&COURSE_ROUTES[c.title]).map(c=>{
    const originalId=COURSE_LESSON_IDS[c.title],details=assets.details?.[originalId]||{},id=details.id||originalId;
    return {...c,id,sourceTitle:c.title,route:COURSE_ROUTES[c.title],station,...details,
      categories:details.categories||['painting'],category:details.categories?.[0]||'painting',
      cover:assets.finalArtworkCovers[id],materials:assets.materials[COURSE_ROUTES[c.title].split('/').filter(Boolean).at(-1)]||[]};
  }));
  window.FEICreationProjects=projects;
  const labels={all:'All Artworks',handcrafts:'Handcrafts','learn-from-masters':'Learn from Masters',painting:'Painting & Drawing',illustration:'Illustration & Stories'};
  const track=window.FEICreationEvents.track;
  function profile(){try{return JSON.parse(sessionStorage.getItem('fei_user_profile'))||{}}catch{return {}}}
  function identity(){const p=profile();return p.supabaseUserId||p.studentCode||p.learnerId||p.id||null}
  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
  function saveKey(){return 'feiCreation.saved.v1:'+encodeURIComponent(identity())}
  function saved(){const list=identity()?read(saveKey(),[]):[];return Array.isArray(list)?list.filter(id=>projects.some(p=>p.id===id)):[]}
  let category='all',query='',artist='all',onlySaved=false,lastSpace='',busy=false,lastPreview='';
  const opened=new Set();
  function resumable(){
    const p=profile(),who=identity(); if(!who)return [];
    const history=read('feiDashboard.opened.v1:'+encodeURIComponent(who),[]);
    const ids=new Set([...(Array.isArray(history)?history.filter(x=>x.branch==='creation').map(x=>x.id):[]),...opened,...Object.entries(p.completedSteps||{}).filter(([,v])=>Array.isArray(v)?v.length:!!v).map(([id])=>id)]);
    if(p.currentStepIdx>0)ids.add(p.currentLesson);
    return projects.filter(x=>ids.has(x.id)&&!(p.completedLessons||[]).includes(x.id));
  }
  function image(p){const c=p.cover,crop=c?.crop;return `<div class="c3-art${crop?' c3-art-crop':''}" ${crop?`style="aspect-ratio:${c.width*crop[2]}/${c.height*crop[3]}"`:''}>${c?`<img src="${esc(c.url)}" alt="${esc(c.alt)}" ${c.width?`width="${c.width}" height="${c.height}"`:''} ${crop?`style="width:${100/crop[2]}%;left:${-100*crop[0]/crop[2]}%;top:${-100*crop[1]/crop[3]}%;height:auto"`:''} loading="lazy">`:''}<span class="c3-missing" ${c?'hidden':''}>Artwork preview unavailable</span></div>`}
  function button(p){return `<button class="c3-save" data-save="${p.id}" aria-pressed="${saved().includes(p.id)}" aria-label="Save ${esc(p.title)} for later">${saved().includes(p.id)?'Saved ✓':'Save ♡'}</button>`}
  function continuations(){const list=resumable();return list.length?`<section class="c3-continue"><h2>Continue Learning</h2>${list.map(p=>`<button data-start="${p.id}" data-resume>${esc(p.title)} →</button>`).join('')}</section>`:''}
  root.innerHTML=`<div class="c3-shell"><aside class="c3-sidebar"><a class="c3-brand" href="../">FEI · Art GPS</a><a href="../#dashboard/courses">← Student Dashboard</a><nav aria-label="Creation"><a href="#welcome">Creation</a><a href="#make">Make Something</a><a href="#inspire">Get Inspired</a></nav><p>Make room for<br>your imagination.</p></aside><main id="c3-main" tabindex="-1"></main></div><p id="c3-status" role="status"></p>`;
  const main=document.getElementById('c3-main');
  function render(){
    const [route='welcome',id]=location.hash.slice(1).split('/');
    if(route!=='project')lastPreview='';
    const space=route==='inspire'?'inspire':route==='make'||route==='project'?'make':'';
    if(space!=='inspire')window.FEIInspirationStudio?.dispose();
    document.body.classList.toggle('c3-inspire',space==='inspire');
    document.body.classList.toggle('creation-discovery',space!=='inspire');
    document.documentElement.classList.toggle('creation-discovery',space!=='inspire');
    closeStation();
    if(space&&space!==lastSpace){track('creation_space_entered',{creationSpace:space});if(lastSpace)track('creation_space_switched',{creationSpace:space});}
    lastSpace=space;
    root.querySelectorAll('nav a').forEach(a=>a.setAttribute('aria-current',a.hash==='#'+(space||'welcome')?'page':'false'));
    if(route==='project'&&projects.some(p=>p.id===id)){
      const p=projects.find(p=>p.id===id);
      main.innerHTML=`<a href="#make">← Back to Gallery</a><article class="c3-preview"><div>${p.examples?p.examples.map(ex=>`<figure>${image({...p,cover:ex.cover})}<figcaption>${esc(ex.label)}</figcaption></figure>`).join(''):image(p)}</div><div><small>MAKE SOMETHING · ${p.categories.map(k=>labels[k]).join(' · ')}</small><h1>${esc(p.title)}</h1>${p.status?`<p class="c3-project-status"><strong>${p.status}</strong> · ${p.statusNote}</p>`:''}${p.crossListing?`<p>${p.crossListing} · same course and progress</p>`:''}<p>${esc(p.desc)}</p><h2>Materials</h2><p>${p.materials.length?p.materials.map(esc).join(' · '):'See the teacher’s material guide inside this project.'}</p><p>Explore the idea, then make it your own. Your choices belong here.</p><button class="c3-primary" data-start="${p.id}">${p.status?'Explore Available Steps':resumable().some(x=>x.id===p.id)?'Continue Making':'Start Making'} →</button>${button(p)}</div></article>`;
      if(lastPreview!==p.id)track('project_opened',{creationSpace:'make',projectId:p.id,category:p.category});
      lastPreview=p.id;
    }else if(space==='make'){
      main.innerHTML=`<small>CREATION / MAKE SOMETHING</small><h1>What would you love to make?</h1><p>Browse the finished works. Find an idea that speaks to you.</p><div class="c3-tools"><label>Find a project<input type="search" id="c3-search" placeholder="Search artworks, artists or materials" value="${esc(query)}"></label><label class="c3-artist-filter">Artist inspiration<select id="c3-artist"><option value="all">All artists</option>${[...new Set(projects.map(p=>p.artist).filter(Boolean))].sort().map(a=>`<option ${artist===a?'selected':''} value="${esc(a)}">${esc(a)}</option>`).join('')}</select></label><button id="c3-saved" aria-pressed="${onlySaved}">Saved for later ♡</button></div><div class="c3-filters" aria-label="Project categories">${Object.entries(labels).map(([k,v])=>`<button data-filter="${k}" aria-pressed="${category===k}">${v}</button>`).join('')}</div><p id="c3-count" aria-live="polite"></p><div id="c3-gallery" class="c3-gallery"></div>${continuations()}`;
      drawGallery();
      document.getElementById('c3-search').oninput=e=>{query=e.target.value;drawGallery()};
      document.getElementById('c3-search').onchange=()=>track('creation_search_used',{creationSpace:'make'});
      document.getElementById('c3-artist').onchange=e=>{artist=e.target.value;drawGallery();};
      document.getElementById('c3-saved').onclick=()=>{onlySaved=!onlySaved;render()};
    }else if(space==='inspire'){
      window.FEIInspirationStudio.mount(main,location.hash.slice(1).split('/').slice(1));
    }else{
      main.innerHTML=`<small>YOUR CREATIVE SPACE</small><h1>What are you in the mood for today?</h1><p>Choose one, or explore freely.</p><div class="c3-choices"><a href="#make" data-entry="make"><div class="c3-choice-photo"><img src="../assets/creation-intro/handcraft.jpg" alt="Teacher’s handmade miniature art studio"><img src="../assets/dashboard/chameleon.jpg" alt="Teacher’s colorful chameleon collage"></div><h2>Make Something <span>↗</span></h2><p>Pick a project and create it.</p></a><a href="#inspire" data-entry="inspire"><div class="c3-choice-photo"><img src="../lessons/carle-colorful-chameleon/assets/texture-bubble-blue-white.jpg" alt="Painted paper with bubbles and blue marks"><img src="../lessons/carle-colorful-chameleon/assets/texture-press-coral.jpg" alt="Layered green and golden paint textures"></div><h2>Get Inspired <span>↗</span></h2><p>Play, explore and discover.</p></a></div><a class="c3-browse" href="#make">Just Browse →</a>${continuations()}`;
    }
    imageFallbacks();
  }
  function imageFallbacks(){root.querySelectorAll('.c3-art img').forEach(img=>img.onerror=()=>{img.hidden=true;img.nextElementSibling.hidden=false})}
  function drawGallery(){
    const list=projects.filter(p=>(category==='all'||p.categories.includes(category))&&(artist==='all'||p.artist===artist)&&(!onlySaved||saved().includes(p.id))&&[p.title,p.desc,p.artist,...p.categories.map(k=>labels[k]),...(p.examples||[]).map(ex=>ex.label),...p.materials,...(p.tags||[])].join(' ').toLowerCase().includes(query.toLowerCase().trim()));
    const pins=list.flatMap(p=>p.examples?p.examples.map(ex=>({...p,cover:ex.cover,exampleLabel:ex.label})):[p]);
    document.getElementById('c3-count').textContent=pins.length+' artworks · '+list.length+' projects'+(!list.length?' · Try another search or category.':'');
    document.getElementById('c3-gallery').innerHTML=pins.map(p=>`<article class="c3-card"><a href="#project/${p.id}">${image(p)}<div class="c3-card-copy">${p.exampleLabel?`<small>${esc(p.exampleLabel)}</small>`:''}<h2>${esc(p.title)}</h2><p>${p.categories.map(k=>labels[k]).join(' · ')}</p>${p.status?`<span class="c3-project-status">${p.status}</span>`:''}${p.crossListing?`<span>${p.crossListing}</span>`:''}<span>Explore Project →</span></div></a>${button(p)}</article>`).join('');imageFallbacks();
  }
  function status(text){document.getElementById('c3-status').textContent=text}
  async function start(p,resume=false){
    if(busy)return;busy=true;
    try{
      if(p.gateInLesson){track('project_started',{creationSpace:'make',projectId:p.id});location.href=p.route;return;}
      if(!window.FEIAccess)throw new Error('Access service unavailable');
      await FEIAccess.init();const access=await FEIAccess.canOpenLesson('creation',p.id);
      if(!access.allowed){location.href=access.reason==='not_signed_in'?'../?next='+encodeURIComponent('creation/#project/'+p.id):'../upgrade/?reason=paywall_creation&branch=creation';return}
      await FEIAccess.recordLessonOpened('creation',p.id);
      track(resume?'project_resumed':'project_started',{creationSpace:lastSpace||'make',projectId:p.id});
      location.href=p.route;
    }catch{status('We could not check access. Please try again.')}finally{busy=false}
  }
  // Existing Studio course interactions retain their renderer and use the same guarded start.
  window.enterCourse=title=>{const p=projects.find(x=>x.sourceTitle===title);if(p)return start(p,resumable().some(x=>x.id===p.id))};
  root.addEventListener('click',e=>{
    const save=e.target.closest('[data-save]');if(save){
      if(!identity()){status('Sign in from the Student Dashboard to save projects.');return}
      const ids=saved(),id=save.dataset.save,exists=ids.includes(id);
      try{localStorage.setItem(saveKey(),JSON.stringify(exists?ids.filter(x=>x!==id):[...ids,id]));track(exists?'project_unsaved':'project_saved',{creationSpace:'make',projectId:id});render();status(exists?'Removed from saved projects.':'Saved for later on this browser.');root.querySelector(`[data-save="${id}"]`)?.focus()}catch{status('Your browser could not save this project. Please try again.')}return;
    }
    const filter=e.target.closest('[data-filter]');if(filter){category=filter.dataset.filter;track('creation_filter_selected',{creationSpace:'make',category});render();root.querySelector(`[data-filter="${category}"]`).focus()}
    const begin=e.target.closest('[data-start]');if(begin){const resume=begin.hasAttribute('data-resume')||resumable().some(p=>p.id===begin.dataset.start);if(begin.hasAttribute('data-resume'))track('creation_continue_clicked',{creationSpace:'make',projectId:begin.dataset.start});start(projects.find(p=>p.id===begin.dataset.start),resume)}
    const entry=e.target.closest('[data-entry]');if(entry)track('creation_entry_selected',{creationSpace:entry.dataset.entry});
    const station=e.target.closest('[data-station]');if(station){openStation(station.dataset.station);track('experiment_opened',{creationSpace:'inspire',experimentId:station.dataset.station});document.querySelector('.zoom-close').focus()}
    const experiment=e.target.closest('[data-experiment]');if(experiment)track('experiment_started',{creationSpace:'inspire',experimentId:experiment.dataset.experiment});
  });
  window.addEventListener('hashchange',()=>{render();if(!document.getElementById('insp-dialog')?.open)main.focus();window.scrollTo(0,0)});
  function accessibleStudio(){
    document.querySelectorAll('.hotspot, .course-item').forEach(el=>{
      if(el.dataset.c3Keyboard)return;
      el.dataset.c3Keyboard='true';el.setAttribute('role','button');el.tabIndex=el.classList.contains('disabled')?-1:0;
      el.setAttribute('aria-label',el.textContent.trim()||'Explore Studio activity');
      el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}});
    });
  }
  new MutationObserver(accessibleStudio).observe(document.getElementById('zoomContent'),{childList:true,subtree:true});
  accessibleStudio();
  render();
  if(identity()&&window.FEIAccess)FEIAccess.getStatus().then(s=>{(s.openedCreationLessons||[]).forEach(id=>opened.add(id));render()}).catch(()=>{});
})();
