/* Studio landing and a non-modal, account-scoped Artchi tour. */
(function () {
  'use strict';
  let root, bridge, tour, step=0, target, previous, identity, autoTimer;
  const invited=new Set();
  const steps=[
    ['.fei-picks','A spark to start with','These course glimpses are starting points. Choose a picture that catches your eye and see what you can make.'],
    ['#track-skills','Skill · one quiet step at a time','New to drawing? Settle in with a pencil. Follow guided practice, learn to look closely, and build confidence at your own pace.'],
    ['#track-creation','Creation · make something yours','An art adventure at home. Explore an artist’s idea, gather your materials, and make your own version. Younger makers can invite a grown-up.'],
    ['#continue-skills','Your own unfinished adventures','Skill and Creation each keep the courses you have opened. Pick up a project here; your learning map and progress live in My Journey.'],
    ['.dashboard-nav a[data-page="journey"]','Your art has a home','Visit My Journey for your artwork, recorded progress, feedback and badges. Ready? Choose your first spark.']
  ];
  const key=()=>identity?'feiDashboard.tour.v1:'+encodeURIComponent(identity):null;
  function rememberTour() {
    if(!identity)return;
    invited.add(identity);
    try { localStorage.setItem(key(),'seen'); } catch {}
    clearTimeout(autoTimer);
    const replay=root?.querySelector('#explore-tour-start');
    if(replay)replay.textContent='Meet Artchi · Replay tour ↗';
  }
  function stop(save=false) {
    if(!tour)return;
    tour.hidden=true;target?.classList.remove('explore-highlight');target=null;
    if(save)rememberTour();
    if(previous?.isConnected&&previous.getClientRects().length)previous.focus({preventScroll:true});
  }
  function position() {
    if(tour.hidden||!target)return;
    const rect=target.getBoundingClientRect(), width=tour.offsetWidth, height=tour.offsetHeight;
    tour.style.left=Math.max(12,Math.min(innerWidth-width-12,rect.right-width))+'px';
    const below=rect.bottom+12;
    tour.style.top=Math.max(12,Math.min(innerHeight-height-12,below+height<innerHeight?below:rect.top-height-12))+'px';
  }
  function show() {
    target?.classList.remove('explore-highlight');
    target=document.querySelector(steps[step][0]);
    if(!target||!target.getClientRects().length){stop();return;}
    target.classList.add('explore-highlight');
    target.scrollIntoView({block:'center',behavior:'instant'});
    tour.hidden=false;
    // Remember the first display, even if the learner leaves before finishing.
    rememberTour();
    tour.querySelector('small').textContent='ARTCHI’S STUDIO TOUR · '+(step+1)+' / '+steps.length;
    tour.querySelector('h3').textContent=steps[step][1];tour.querySelector('p').textContent=steps[step][2];
    tour.querySelector('[data-back]').disabled=step===0;
    tour.querySelector('[data-next]').textContent=step===steps.length-1?'Let’s explore ✓':'Next →';position();
  }
  function mount(courses,adapter) {
    root=courses;bridge=adapter;
    const hero=root.querySelector('.hero');hero.classList.add('explore-hero');
    hero.insertAdjacentHTML('afterbegin','<div class="explore-eyebrow">YOUR OPEN STUDIO / A LITTLE PRACTICE, A NEW POSSIBILITY</div>');
    hero.insertAdjacentHTML('beforeend','<div class="explore-invitation"><img src="core/dashboard-artchi.svg" alt="Artchi, your studio companion"><div><strong>A little curious? You’re in the right place.</strong><p>Choose a spark below, or let me show you around.</p><button type="button" class="dashboard-button" id="explore-tour-start">Show me around ↗</button></div></div>');
    root.querySelector('.hero-subtitle').textContent='Find your spark. Make a little time for art.';
    const tracks=root.querySelector('.tracks');tracks.classList.add('explore-portals');
    tracks.previousElementSibling.querySelector('.section-title').textContent='Two ways into your studio';
    const skill=root.querySelector('#track-skills'),creation=root.querySelector('#track-creation');
    skill.querySelector('.track-emoji').innerHTML='<span class="portal-photo"><img src="assets/sketch-map/icecream.jpg" alt="Ice cream drawing"></span><span class="portal-photo"><img src="lessons/scene-drawing-foundation/unit-01-shot-size/lesson-01-extreme-wide-shot/card3-night-city-illustration-only.png" alt="Night city scene drawing"></span><span class="portal-photo portal-cardboard" role="img" aria-label="Cardboard Gothic cathedral"></span><span class="portal-photo"><img src="assets/dashboard/dog.jpg" alt="Dog pencil portrait"></span>';
    skill.querySelector('.track-quote').textContent='Slow down. Learn to draw, step by step.';
    skill.querySelector('.track-description').textContent='A pencil, a quiet moment, and a guide beside you. Start with simple shapes and build confidence through practice.';
    creation.querySelector('.track-emoji').innerHTML='<span class="portal-photo"><img src="assets/creation-intro/handcraft.jpg" alt="Teacher’s handmade pink house"></span><span class="portal-photo"><img src="assets/dashboard/rousseau.jpg" alt="Henri Rousseau inspired paper jungle"></span><span class="portal-photo"><img src="assets/dashboard/yokai.jpg" alt="Two imagined cats in the Great Wave"></span>';
    creation.querySelector('.track-name').innerHTML='Creation <span class="track-age-pill">Young makers · Ages 4–8</span>';
    creation.querySelector('.track-quote').textContent='No one can teach you creativity. It comes from you.';
    creation.querySelector('.track-description').textContent='We don’t teach you how to create. We bring artworks, materials and different ways to express yourself. Come play with us — and see what comes from you.';
    skill.insertAdjacentHTML('beforeend','<span class="explore-portal-link">Find my first drawing practice ↗</span>');
    creation.insertAdjacentHTML('beforeend','<span class="explore-portal-link">Find something to make ↗</span>');
    [skill,creation].forEach((link,i)=>{
      const panel=document.createElement('article');panel.className='studio-direction '+(i?'creation-direction':'skill-direction');
      link.before(panel);panel.append(link);
      const continuation=document.createElement('section');continuation.className='studio-continue';continuation.id=i?'continue-creation':'continue-skills';
      continuation.setAttribute('aria-label',i?'Continue Learning for Creation':'Continue Learning for Skill');panel.append(continuation);
    });
    mountSkillGallery();
    document.getElementById('student-shell').addEventListener('click',event=>{
      const link=event.target.closest('a[href]');if(!link)return;
      const item=window.FEIStudioCatalog.find(c=>['fashion-design','color-lab-01','material-art-cardboard'].includes(c.id)&&new URL(c.href,location.href).href===link.href);
      const p=bridge.getProfile(),who=p?.supabaseUserId||p?.studentCode||p?.learnerId||p?.id;
      if(item&&who)try{
        const key='feiDashboard.opened.v1:'+encodeURIComponent(who),stored=JSON.parse(localStorage.getItem(key)||'[]');
        const list=Array.isArray(stored)?stored:[];
        localStorage.setItem(key,JSON.stringify([{id:item.id,branch:item.branch,at:Date.now()},...list.filter(x=>x.id!==item.id)].slice(0,100)));
      }catch{}
    });
    tour=document.createElement('aside');tour.id='explore-tour';tour.hidden=true;tour.setAttribute('aria-label','Artchi studio tour');
    tour.innerHTML='<img src="core/dashboard-artchi.svg" alt=""><div aria-live="polite"><small></small><h3></h3><p></p></div><div class="explore-tour-actions"><button data-skip>Skip tour</button><button data-back>Back</button><button data-next>Next →</button></div>';
    document.body.append(tour);
    root.querySelector('#explore-tour-start').onclick=()=>{previous=document.activeElement;step=0;show();tour.querySelector('[data-next]').focus({preventScroll:true});};
    tour.querySelector('[data-skip]').onclick=()=>stop(true);
    tour.querySelector('[data-back]').onclick=()=>{if(step>0){step--;show();}};
    tour.querySelector('[data-next]').onclick=()=>{if(step===steps.length-1)stop(true);else{step++;show();}};
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!tour.hidden)stop(true);});
    window.addEventListener('resize',position);window.addEventListener('scroll',position,{passive:true});
    window.addEventListener('hashchange',()=>stop());
    new MutationObserver(()=>{if(!root.getClientRects().length)stop();}).observe(document.getElementById('student-shell'),{attributes:true,subtree:true,attributeFilter:['hidden']});
  }
  function render() {
    if(!root)return;
    const profile=bridge.getProfile();renderContinuations(profile);const next=profile?.supabaseUserId||profile?.studentCode||profile?.learnerId||profile?.id;
    if(identity!==next){stop();identity=next;}
    if(!document.getElementById('fei-personal-picks')){
      const section=document.createElement('section');section.id='explore-default-picks';section.className='fei-picks';
      root.querySelector('#explore-default-picks')?.remove();
      const selected=window.FEIOnboarding.recommend(profile?.artPreferences||{interests:['Drawing','Making','Storytelling'],pictures:[]});
      section.innerHTML='<div class="start-recommend-heading"><div><h2>Find your first spark</h2><p>Three places to begin. Follow your curiosity.</p></div></div><ol class="start-course-list">'+selected.map(c=>`<li><a href="${c.href}"><img src="${c.image}" alt="${c.title}" loading="lazy"><span class="pick-copy"><small class="pick-label">A PLACE TO BEGIN</small><strong>${c.title}</strong><small>${c.hint}</small><b>Explore this course ↗</b></span></a></li>`).join('')+'</ol>';
      root.querySelector('.hero').after(section);
    } else root.querySelector('#explore-default-picks')?.remove();
    // Invite on first visit without interrupting the existing account questionnaire.
    let seen=false;try{seen=!!localStorage.getItem(key());}catch{}
    clearTimeout(autoTimer);
    if(identity&&!seen&&!invited.has(identity)) autoTimer=setTimeout(()=>{
      if(!root.getClientRects().length||document.querySelector('dialog[open]'))return;
      if(!profile.studentCode&&!profile.artPreferences)return;
      invited.add(identity);previous=document.activeElement;step=0;show();
    },900);
    root.querySelector('#explore-tour-start').textContent=seen?'Meet Artchi · Replay tour ↗':'Start here · Meet Artchi ↗';
  }
  let resumeGeneration=0;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function catalog() {
    return [...(window.FOUNDATION_A_PATH||[]).map(c=>({...c,branch:'skills'})),...(window.FOUNDATION_STILL_LIFE_PATH||[]).filter(c=>c.ready).map(c=>({...c,branch:'skills'})),...window.FEIStudioCatalog];
  }
  function mountSkillGallery() {
    const screen=document.getElementById('skills-screen');
    const gallery=document.createElement('div');gallery.className='skill-gallery';
    const images=['assets/dashboard/dog.jpg','assets/dashboard/fashion-preview.png','color-lab/assets/materials-reference.png','assets/dashboard/ink-painting.jpg','art-theory/assets/western/32131500.jpg','material-art/cardboard/assets/gothic/project-map.png'];
    const descriptions=['From simple forms to expressive, lifelike drawings.','Build a figure, explore clothing, develop your design.','Mix real colors and build a palette of your own.','Explore ink, brushwork and traditional painting.','Look closely at artworks and the ideas behind them.','Build with cardboard, structure and imagination.'];
    [...screen.querySelectorAll(':scope > .subtrack')].forEach((link,i)=>{
      link.querySelector('.subtrack-emoji').innerHTML=`<img src="${images[i]}" alt="${esc(link.querySelector('.subtrack-name').textContent)} course preview" loading="lazy">`;
      const caption=document.createElement('p');caption.className='skill-gallery-description';caption.textContent=descriptions[i];link.querySelector('.subtrack-info').append(caption);gallery.append(link);
    });
    screen.querySelector('.section-heading').after(gallery);
    const intro=screen.querySelector('.section-heading');intro.classList.add('skill-gallery-heading');
    intro.querySelector('.section-title').textContent='Make time for a little practice.';
    intro.querySelector('.section-sub').textContent='Find a picture that draws you in. We’ll take it one step at a time.';
  }
  function renderContinuations(profile) {
    const generation=++resumeGeneration;
    const who=profile?.supabaseUserId||profile?.studentCode||profile?.learnerId||profile?.id;
    let history=[];
    try{const value=JSON.parse(localStorage.getItem('feiDashboard.opened.v1:'+encodeURIComponent(who))||'[]');if(Array.isArray(value))history=value.filter(x=>x&&typeof x.id==='string'&&['skills','creation'].includes(x.branch));}catch{}
    try { if(JSON.parse(localStorage.getItem('fei_fashion_v2:'+who+':standing-demo')||'null')) history.push({id:'fashion-design',branch:'skills'}); } catch {}
    const items=catalog(), completed=new Set(profile?.completedLessons||[]);
    // A default currentLesson is not evidence of practice: only use it with a saved step.
    const active=new Set(Object.entries(profile?.completedSteps||{}).filter(([,v])=>Array.isArray(v)?v.length>0:!!v).map(([id])=>id));
    if(profile?.currentStepIdx>0&&profile.currentLesson)active.add(profile.currentLesson);
    function draw(status={}) {
      if(generation!==resumeGeneration)return;
      ['skills','creation'].forEach(branch=>{
        const opened=new Set([...(status[branch==='skills'?'openedSkillLessons':'openedCreationLessons']||[]),...history.filter(x=>x.branch===branch).map(x=>x.id),...active]);
        const list=items.filter(c=>c.branch===branch&&opened.has(c.id)&&!completed.has(c.id));
        list.sort((a,b)=>(history.find(x=>x.id===b.id)?.at||0)-(history.find(x=>x.id===a.id)?.at||0));
        const host=document.getElementById('continue-'+branch);
        host.innerHTML='<h3>Continue Learning <span>· '+(branch==='skills'?'Skill':'Creation')+'</span></h3>'+(list.length?'<ul>'+list.slice(0,3).map(row).join('')+'</ul>'+(list.length>3?'<details><summary>'+ (list.length-3)+' more projects</summary><ul>'+list.slice(3).map(row).join('')+'</ul></details>':''):'<p>Your opened '+(branch==='skills'?'practices':'creative projects')+' will appear here. Start with anything that catches your eye.</p>');
        host.querySelectorAll('a[data-resume-id]').forEach(link=>{link.onclick=async event=>{
          event.preventDefault();
          if(link.dataset.busy)return;link.dataset.busy='1';
          try{
            const access=await window.FEIAccess.canOpenLesson(branch,link.dataset.resumeId);
            if(!access.allowed){window.openPaywall({branch});return;}
            await window.FEIAccess.recordLessonOpened(branch,link.dataset.resumeId);
            location.href=link.href;
          }catch{let message=host.querySelector('[role="status"]');if(!message){message=document.createElement('p');message.setAttribute('role','status');host.append(message);}message.textContent='Couldn’t open this course. Please try again.';}finally{delete link.dataset.busy;}
        };});
      });
    }
    function row(c){return `<li><a href="${esc(c.href)}" data-resume-id="${esc(c.id)}"><span>${esc(c.title)}</span><b aria-hidden="true">Continue ↗</b></a></li>`;}
    draw();
    // Access history is the existing account record; reading it does not create lesson progress.
    window.FEIAccess?.getStatus().then(draw).catch(()=>{});
  }

  window.FEIDashboardExplore={mount,render,renderContinuations};
})();
