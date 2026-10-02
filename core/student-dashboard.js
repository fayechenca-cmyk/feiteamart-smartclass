/* FEI student workspace: presentation and local preferences only.
   Auth, lesson gates, progress, live classes and teacher records stay with the existing platform. */
(function (global) {
  'use strict';
  const $ = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const avatars = { rabbit:'🐰', fox:'🦊', panda:'🐼', cat:'🐱' };
  const base = '#dashboard/';
  const screens = ['home','skills','drawing-courses','drawing','foundation-map','material-arts-courses','painting-courses','ink-painting-courses','zodiac-beast-courses'];
  const routes = { skills:'showSkills', 'drawing-courses':'showDrawingCourses', 'foundation-a':'showDrawing', 'foundation-map':'showFoundationMap', 'material-art':'showMaterialArtsCourses', painting:'showPaintingCourses', 'ink-painting':'showInkPaintingCourses', zodiac:'showZodiacBeastCourses' };
  const titles = {journey:['My Journey','Your art, your discoveries, your becoming.'],courses:['Self-paced Classes','Pick up your practice. Explore at your own pace.'],live:['Live Classes','Your sessions, materials and shared practice.'],lfc:['LFC','Learn from Collections · Look closely. Think freely.'],events:['Events','Workshops, exhibitions and moments to come together.'],profile:['My Profile','Make this space yours. Choose what comes next.']};
  const tabs = {overview:'Overview',studio:'My Studio',feedback:'Progress & Feedback',badges:'Badges',story:'Student Art Journey'};
  let bridge, shell, currentPage = 'courses', preferences = {}, activeDimension = 'technical_practice';
  // Only verified course routes are linked. A badge with no course stays display-only.
  const badgeLinks = {
    basic_sketch:base+'courses/foundation-a', still_life:'lessons/still-life/', realism_expert:'lessons/still-life/', landscape:'lessons/sketch-branches/?branch=light', portrait_master:'lessons/sketch-branches/?branch=portrait', costume_design:'fashion-design/',
    scene_designer:'scene-drawing/', hand_crafter:'material-art/cardboard/', art_history:'art-theory/',
    color_theory:'color-theory/', scene_drawing_unit_01:'lessons/scene-drawing-foundation/',
    zodiac_rat:'lessons/zodiac-skill/', ink_painting:base+'courses/ink-painting'
  };
  // Counts describe recorded activity, not ability. No invented LFC signal: it is explicitly unconnected.
  // Rules and normalization are isolated here so new dimensions/signals can be added independently.
  const dimensions = [
    {id:'technical_practice',label:'Technical Practice',color:'#ae94e0',match:(id,foundation)=>foundation.has(id)||id.startsWith('still-life-')||id.startsWith('zodiac-')||['color-theory','one-point-street','two-point-bedroom','extreme-wide-shot','wide-full-shot','medium-shot','close-up','extreme-close-up'].includes(id),weight:1},
    {id:'creative_practice',label:'Creative Practice',color:'#d6b674',match:id=>['lfc054','lfc017','lfc018','lfc019','carle-colorful-chameleon','thiebaud-my-sweet-fridge','material-art-cardboard'].includes(id),weight:1},
    {id:'art_understanding',label:'Art Understanding',color:'#8dc6ae',match:id=>id.startsWith('art-history-'),weight:1},
    {id:'visual_thinking',label:'Visual Thinking',color:'#83c7df',match:()=>false,weight:1,unconnected:true}
  ];
  function learningActivity(profile, foundationIds) {
    const completed = [...new Set((profile?.completedLessons || []).filter(id=>typeof id==='string'))];
    const foundation = new Set(foundationIds || []);
    if (global.getArtLearningProfileScores) {
      const scores = global.getArtLearningProfileScores({completedLessons:completed});
      return dimensions.map(d => { const signal=scores[d.id]; const count=signal?.done||0; return {...d,count,value:d.unconnected?null:1-Math.exp(-count*d.weight/6)}; });
    }
    return dimensions.map(d=>{const count=completed.filter(id=>d.match(id,foundation)).length;return {...d,count,value:d.unconnected?null:1-Math.exp(-count*d.weight/6)};});
  }
  function icon(name) {
    const paths = {journey:'<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c5 4 5 12 0 16-5-4-5-12 0-16Z"/>',courses:'<path d="M12 5v15M3 4c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2Z"/>',live:'<rect x="3" y="6" width="12" height="12" rx="2"/><path d="m15 10 6-3v10l-6-3"/>',lfc:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',events:'<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v5m8-5v5M4 11h16"/>'};
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>';
  }
  function prefKey() {
    const p=bridge.getProfile();
    const identity=p?.supabaseUserId || p?.studentCode || p?.learnerId || p?.id;
    return identity ? 'feiDashboard.preferences.v1:'+encodeURIComponent(identity) : null;
  }
  function readPreferences() {
    try { const value=JSON.parse(localStorage.getItem(prefKey()) || '{}');return value&&typeof value==='object'?value:{}; } catch { return {}; }
  }
  function selectNav(page) {
    currentPage=page;
    shell.querySelectorAll('.dashboard-nav a').forEach(a=>{
      if(a.dataset.page===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
  }
  function setRoute(route, replace=false) {
    const hash=base+route;
    if(location.hash!==hash) history[replace?'replaceState':'pushState'](null,'',location.pathname+location.search+hash);
  }
  function hide() { if(shell)shell.hidden=true; }
  function showCourse(route) {
    if(!shell)return;
    shell.hidden=false;selectNav('courses');setRoute('courses/'+route);
  }
  function navigateFromHash() {
    if(!bridge.getProfile() || !location.hash.startsWith(base))return;
    const parts=location.hash.slice(base.length).split('/');
    if(parts[0]==='courses'&&routes[parts[1]]) global[routes[parts[1]]]();
    else global.showHome(false);
  }
  function showHome() {
    shell.hidden=false;
    let parts=location.hash.startsWith(base)?location.hash.slice(base.length).split('/'):['courses'];
    if(parts[0]==='courses'&&routes[parts[1]]){global[routes[parts[1]]]();return;}
    const page=titles[parts[0]]?parts[0]:'courses';
    const tab=tabs[parts[1]]?parts[1]:'overview';
    selectNav(page);
    $('dashboard-heading').hidden=page==='courses';
    $('dashboard-title').textContent=titles[page][0];
    $('dashboard-subtitle').textContent=titles[page][1];
    $('home-screen').querySelectorAll('[data-dashboard-page]').forEach(el=>el.hidden=el.dataset.dashboardPage!==page);
    shell.querySelectorAll('[data-journey-panel]').forEach(el=>el.hidden=el.dataset.journeyPanel!==tab);
    shell.querySelectorAll('.dashboard-tabs a').forEach(a=>{
      if(a.dataset.tab===tab)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
    if(page==='profile')fillProfile();
    setRoute(page==='journey'&&tab!=='overview'?page+'/'+tab:page,true);
  }
  function mount(adapter) {
    bridge=adapter;
    const home=$('home-screen');
    // The earlier single-page profile card is superseded by the Journey view.
    // Keep its shared signal calculator as the source of course-to-dimension mappings.
    $('alp-card')?.remove();
    // Move the original nodes, preserving IDs, event handlers and async render targets.
    const hero=home.querySelector('.hero');
    const resume=$('resume-card'), resumeHeading=resume.previousElementSibling;
    const map=$('student-learning-map'), live=$('live-class-section');
    const tracks=home.querySelector('.tracks'), tracksHeading=tracks.previousElementSibling;
    const studioGrid=home.querySelector('.studio-grid'), studioHeading=studioGrid.previousElementSibling;
    const cards=[...studioGrid.children];
    const feedback=$('feedback-notif-card'), celebration=$('badge-unlock-banner');
    shell=document.createElement('div');shell.id='student-shell';shell.hidden=true;
    home.before(shell);
    shell.innerHTML=`<aside class="dashboard-sidebar"><div class="dashboard-sidebar-inner"><div class="dashboard-wordmark">FEI TeamArt</div><div class="dashboard-person"><span class="dashboard-avatar" id="dashboard-avatar" aria-hidden="true">🐰</span><div><div class="dashboard-person-name" id="dashboard-name"></div><p class="dashboard-small">Your art, your becoming.</p></div><a class="dashboard-link" href="${base}profile">Edit profile ↗</a></div><div class="dashboard-sidebar-label">MY SPACE</div><nav class="dashboard-nav" aria-label="Student workspace">${['courses','live','journey'].map(id=>`<a href="${base+id}" data-page="${id}">${icon(id)}<span>${titles[id][0]}</span></a>`).join('')}</nav><div class="dashboard-special"><nav class="dashboard-nav" aria-label="Special entrance"><a href="${base}lfc" data-page="lfc">${icon('lfc')}<span>LFC<small>Learn from Collections ↗</small></span></a></nav></div><div class="dashboard-sidebar-label">DISCOVER</div><nav class="dashboard-nav" aria-label="Discover"><a href="${base}events" data-page="events">${icon('events')}<span>Events</span></a></nav></div></aside><main class="dashboard-content" id="dashboard-content"></main>`;
    screens.forEach(id=>$('dashboard-content').append($(id+'-screen')));
    const header=document.createElement('header');header.className='dashboard-heading';header.id='dashboard-heading';
    header.innerHTML='<h1 id="dashboard-title">My Journey</h1><p id="dashboard-subtitle"></p>';
    home.prepend(header);
    function page(id,html='') {const el=document.createElement('section');el.dataset.dashboardPage=id;el.id='dashboard-page-'+id;el.hidden=true;el.innerHTML=html;home.append(el);return el;}
    const journey=page('journey',`<nav class="dashboard-tabs" aria-label="My Journey sections">${Object.entries(tabs).map(([id,label])=>`<a href="${base}journey${id==='overview'?'':'/'+id}" data-tab="${id}">${label}</a>`).join('')}</nav>`);
    Object.keys(tabs).forEach(id=>{const el=document.createElement('div');el.id='dashboard-journey-'+id;el.dataset.journeyPanel=id;journey.append(el);});
    $('dashboard-journey-overview').innerHTML=`<div class="dashboard-overview"><section class="dashboard-panel dashboard-shape-panel"><div class="dashboard-kicker">Your art learning profile</div><h2>A More Complete You</h2><div class="dashboard-shape" id="dashboard-shape"></div><p class="dashboard-small dashboard-shape-description" id="dashboard-dimension-description" aria-live="polite"></p><p class="dashboard-small">A reflection of recorded practice, never a talent score.</p></section><section class="dashboard-panel dashboard-goal-panel"><div class="dashboard-kicker">My next chapter</div><p class="dashboard-goal" id="dashboard-goal"></p><a class="dashboard-link" href="${base}profile">Edit my intention ↗</a><hr class="dashboard-rule"><div class="dashboard-studio-nudge"><h3>A space to grow</h3><p class="dashboard-small">Your artworks, discoveries and reflections belong here.</p><a class="dashboard-button" style="margin-top:18px" href="${base}journey/studio">Open My Studio →</a></div></section></div><div class="dashboard-section-heading"><h2>My learning badges</h2><a class="dashboard-link" href="${base}journey/badges">View all badges →</a></div><div class="dashboard-badge-preview" id="dashboard-featured-badges"></div><div class="dashboard-section-heading"><span class="dashboard-small" id="dashboard-feedback-summary">Make room for your process.</span><a class="dashboard-link" href="${base}journey/feedback">Progress & Feedback →</a></div>`;
    $('dashboard-journey-overview').prepend(celebration);
    const studio=$('dashboard-journey-studio');studio.append(cards[4]);
    cards[4].querySelector('.studio-card-title').textContent='My Studio';
    cards[4].querySelector('.studio-card-body').textContent='Your artwork, featured pieces and growing portfolio.';
    const feedbackPanel=$('dashboard-journey-feedback');feedbackPanel.append(feedback);
    const progressGrid=document.createElement('div');progressGrid.className='studio-grid';progressGrid.append(cards[1],cards[2]);feedbackPanel.append(progressGrid);
    $('dashboard-journey-badges').append(cards[3]);
    $('dashboard-journey-story').innerHTML='<section class="dashboard-panel"><div class="dashboard-kicker">Student Art Journey</div><h2>Your story through art</h2><p class="dashboard-small">Milestones from your completed lessons and earned badges. Completion dates are not yet recorded here.</p><ul class="dashboard-timeline" id="dashboard-timeline"></ul></section>';
    const courses=page('courses');courses.append(hero,resumeHeading,resume,map,tracksHeading,tracks,cards[0]);
    hero.querySelector('.hero-subtitle').textContent='What would you like to practise today?';
    const livePage=page('live','<div class="dashboard-panel dashboard-empty" id="dashboard-live-empty"><div class="dashboard-kicker">Learning together</div><h2>Your next live connection</h2><p class="dashboard-small" id="dashboard-live-message">You’re not enrolled in a live class yet. Your sessions and class materials will appear here when you join.</p><a class="dashboard-button" href="https://www.feiteamart.com/contact" target="_blank" rel="noopener">Ask about live classes ↗</a></div>');livePage.append(live);
    page('lfc',`<div class="dashboard-lfs"><section class="dashboard-panel"><div class="dashboard-kicker">Learn from Collections</div><h2>A closer look.<br>A new perspective.</h2><p class="dashboard-small">Explore artworks, follow your curiosity and discover new ways of seeing.</p><a class="dashboard-button primary" href="https://learnfromcollections.com/learn" target="_blank" rel="noopener">Explore LFC ↗</a><p class="dashboard-small">Opens Learn from Collections in a new tab.</p></section><section class="dashboard-panel"><h3>Looking becomes thinking</h3><p class="dashboard-small">Take time to observe, compare and reflect. LFC exploration records are not yet connected to this dashboard.</p><a class="dashboard-link" href="creation/">Create with the Masters →</a></section></div>`);
    page('events','<section class="dashboard-panel dashboard-empty"><div class="dashboard-kicker">Beyond the classroom</div><h2>Room for something new</h2><p class="dashboard-small">Workshops and exhibitions will appear here when they are announced.</p><a class="dashboard-button" href="https://www.feiteamart.com/contact" target="_blank" rel="noopener">Ask about upcoming events ↗</a></section>');
    page('profile',`<form class="dashboard-panel dashboard-profile-form" id="dashboard-profile-form"><h2>Make this space yours</h2><p class="dashboard-small">Your avatar, display name and intention are saved for your account in this browser. They do not sync to other devices.</p><fieldset><legend>Choose your companion</legend><div class="dashboard-avatar-options">${Object.entries(avatars).map(([id,emoji])=>`<label><input type="radio" name="avatar" value="${id}" aria-label="${id}"><span aria-hidden="true">${emoji}</span></label>`).join('')}</div></fieldset><label for="dashboard-profile-name">Display name</label><input type="text" id="dashboard-profile-name" maxlength="60" required autocomplete="nickname"><label for="dashboard-profile-goal">What would you like to explore?</label><textarea id="dashboard-profile-goal" maxlength="240" placeholder="I would love to bring my own characters to life…"></textarea><div class="dashboard-form-actions"><button class="dashboard-button primary" type="submit">Save my profile</button><a class="dashboard-link" href="${base}journey">Back to My Journey</a></div><p class="dashboard-small" id="dashboard-profile-status" role="status"></p></form>`);
    studioGrid.remove();studioHeading.remove();
    $('dashboard-profile-form').addEventListener('submit',savePreferences);
    shell.addEventListener('click',event=>{
      const dim=event.target.closest('[data-dimension]');if(dim){activeDimension=dim.dataset.dimension;renderShape();$('dashboard-shape').querySelector('[data-dimension="'+activeDimension+'"]').focus({preventScroll:true});}
      const a=event.target.closest('a[href^="#dashboard/"]');
      if(a&&a.hash===location.hash){event.preventDefault();navigateFromHash();}
    });
    global.addEventListener('hashchange',navigateFromHash);
  }
  function fillProfile() {
    $('dashboard-profile-name').value=preferences.name||bridge.getProfile()?.name||'';
    $('dashboard-profile-goal').value=preferences.goal||'';
    const avatar=Object.hasOwn(avatars,preferences.avatar)?preferences.avatar:'rabbit';
    $('dashboard-profile-form').querySelector(`input[value="${avatar}"]`).checked=true;
    $('dashboard-profile-status').textContent='';
  }
  function savePreferences(event) {
    event.preventDefault();
    const name=$('dashboard-profile-name').value.trim();
    if(!name){$('dashboard-profile-status').textContent='Please enter a display name.';return;}
    const next={name:name.slice(0,60),goal:$('dashboard-profile-goal').value.trim().slice(0,240),avatar:new FormData(event.target).get('avatar')||'rabbit'};
    try {
      const key=prefKey();if(!key)throw new Error('No student identity');
      localStorage.setItem(key,JSON.stringify(next));preferences=next;renderIdentity();
      $('dashboard-profile-status').textContent='Saved for your account in this browser.';
    } catch { $('dashboard-profile-status').textContent='Your browser could not save these changes. Please allow local storage and try again.'; }
  }
  function renderIdentity() {
    const name=preferences.name||bridge.getProfile()?.name||'Friend';
    $('dashboard-name').textContent=name;$('hero-name').textContent=name;
    $('dashboard-avatar').textContent=avatars[preferences.avatar]||avatars.rabbit;
    $('dashboard-goal').textContent=preferences.goal?'“'+preferences.goal+'”':'What would you love to explore next?';
  }
  function renderShape() {
    const data=learningActivity(bridge.getProfile(),(global.FOUNDATION_A_PATH||[]).map(l=>l.id));
    const n=data.length, center=[200,125];
    const point=(index,radius)=>[center[0]+Math.cos(index*2*Math.PI/n-Math.PI/2)*radius,center[1]+Math.sin(index*2*Math.PI/n-Math.PI/2)*radius];
    const points=data.map((d,i)=>point(i,22+(d.value||0)*76));
    const polygon=points.map(p=>p.join(',')).join(' ');
    const reference=data.map((d,i)=>point(i,103).join(',')).join(' ');
    const any=data.some(d=>d.count>0);
    $('dashboard-shape').innerHTML=`<svg viewBox="0 0 400 250" role="img" aria-label="Learning activity shape. ${escape(data.map(d=>d.label+': '+(d.unconnected?'not connected':d.count+' completed activities')).join('. '))}"><defs><linearGradient id="dashboard-shape-gradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b99ee8"/><stop offset=".48" stop-color="#a5dcef"/><stop offset="1" stop-color="#a8d7ba"/></linearGradient><filter id="dashboard-shape-glow"><feGaussianBlur stdDeviation="9"/></filter></defs><polygon points="${reference}" fill="none" stroke="#e2dbea" stroke-width="1"/><path d="M200 22 Q239 85 303 125 Q239 165 200 228 Q161 165 97 125 Q161 85 200 22Z" fill="url(#dashboard-shape-gradient)" fill-opacity=".12" stroke="url(#dashboard-shape-gradient)" stroke-opacity=".5"/><polygon points="${reference}" fill="url(#dashboard-shape-gradient)" opacity=".12" filter="url(#dashboard-shape-glow)"/>${any?`<polygon points="${polygon}" fill="url(#dashboard-shape-gradient)" opacity=".6" filter="url(#dashboard-shape-glow)"/><polygon points="${polygon}" fill="url(#dashboard-shape-gradient)" fill-opacity=".2" stroke="url(#dashboard-shape-gradient)" stroke-width="2" stroke-linejoin="round"/>`:""}${data.map((d,i)=>{const p=point(i,103);return `<circle class="${activeDimension===d.id?'is-active':''}" cx="${p[0]}" cy="${p[1]}" r="4" fill="white" stroke="${d.color}" stroke-width="2"/>`;}).join('')}</svg>${data.map(d=>`<button type="button" class="dashboard-dimension" data-dimension="${d.id}" aria-pressed="${activeDimension===d.id}">${d.label}</button>`).join('')}<span class="dashboard-shape-center">${any?'':'Your journey<br>begins here'}</span>`;
    const d=data.find(d=>d.id===activeDimension)||data[0];
    $('dashboard-dimension-description').textContent=d.unconnected?'Visual Thinking · LFC activity is not connected yet.':`${d.label} · ${d.count===0?'No completed activities recorded yet.':d.count+' completed '+(d.count===1?'activity':'activities')+' recorded.'}`;
  }
  function render() {
    if(!shell||!bridge.getProfile())return;
    preferences=readPreferences();renderIdentity();renderShape();
    const badgeProgress=global.getCourseBadgeProgress?.()||{};
    const catalog=global.BADGE_CATALOG||[];
    const record=bridge.getRecord();
    const manual=new Set((record?.achievements||[]).map(a=>String(a.badge_id).toLowerCase()));
    $('dashboard-featured-badges').innerHTML=['basic_sketch','still_life','costume_design'].map(id=>{
      const badge=catalog.find(b=>b.id===id),p=badgeProgress[id];
      const status=manual.has(id)||p?.isComplete?'Earned · Revisit course':p?.totalCount?`${p.doneCount}/${p.totalCount} complete · Explore course`:'Demo practice · Explore course';
      return `<a href="${badgeLinks[id]}"><span class="dashboard-badge-symbol" aria-hidden="true">${badge?.emoji||'✧'}</span><strong>${escape(badge?.title||id)}</strong><small>${escape(status)} →</small></a>`;
    }).join('');
    // Existing badge state/progress remains authoritative; add a semantic course link only where mapped.
    [...$('studio-badge-grid').children].forEach((node,i)=>{
      const badge=catalog[i],href=badgeLinks[badge?.id];
      if(!href)return;
      const link=document.createElement('a');link.className=node.className;link.style.cssText=node.style.cssText;link.href=href;
      link.setAttribute('aria-label',badge.title+' — explore related course');
      while(node.firstChild)link.append(node.firstChild);
      const label=document.createElement('div');label.className='badge-progress';label.textContent='Explore course →';link.append(label);node.replaceWith(link);
    });
    const completed=[...new Set(bridge.getProfile().completedLessons||[])];
    const earned=catalog.filter(b=>manual.has(b.id)||badgeProgress[b.id]?.isComplete);
    const lessonTitles=new Map((global.FOUNDATION_A_PATH||[]).map(l=>[l.id,l.title]));
    const milestones=[...completed.map(id=>({title:lessonTitles.get(id)||String(id).replace(/[-_]/g,' '),detail:'Lesson completed'})),...earned.map(b=>({title:b.title,detail:'Badge earned'}))];
    $('dashboard-timeline').innerHTML=milestones.length?milestones.map(m=>`<li><strong>${escape(m.title)}</strong><span class="dashboard-small">${m.detail}</span></li>`).join(''):'<li class="dashboard-small">Your first completed lesson will start your story. Every small step belongs here.</li>';
    $('dashboard-feedback-summary').textContent=record?.teacher_note?'A note from your teacher is waiting in Feedback.':'Make room for your process.';
    updateLiveState();
  }
  function updateLiveState(state) {
    if(!shell)return;
    const enrolled=global.isLiveClassStudent?.();
    $('dashboard-live-empty').hidden=enrolled&&$('live-class-section').style.display!=='none';
    $('dashboard-live-message').textContent=!enrolled?'You’re not enrolled in a live class yet. Your sessions and class materials will appear here when you join.':state==='error'?'Your class schedule could not be loaded. Please refresh to try again.':'Your class schedule is being prepared. Your sessions will appear here when available.';
  }
  global.FEIStudentDashboard={mount,hide,showHome,showCourse,render,updateLiveState,learningActivity,badgeLinks};
})(window);
