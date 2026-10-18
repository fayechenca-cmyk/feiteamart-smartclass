/* Guided lessons use the same account progress record as the dashboard. */
window.GuidedPlatform = {
 profile:null, lesson:null, isolated:false,
 async allow(lessonId) {
  try {
   const result=await window.FEIAccess.canOpenLesson('skills',lessonId);
   if(result.allowed){
    this.lesson=lessonId;this.profile=JSON.parse(sessionStorage.getItem('fei_user_profile')||'null');
    if(!this.profile){const session=await window.FEIAuth?.getSession();if(session?.user?.id){this.profile={id:session.user.id,supabaseUserId:session.user.id,email:session.user.email,name:session.user.user_metadata?.full_name||session.user.user_metadata?.name||null,studentCode:null,completedLessons:[],completedSteps:{},currentLesson:lessonId,currentStepIdx:0};sessionStorage.setItem('fei_user_profile',JSON.stringify(this.profile));}}
    if(this.profile)return true;
    location.replace('../../../?signin=required');return false;
   }
   const returnTo=(location.pathname||'').split('/').filter(Boolean).slice(-3).join('/')+'/';
   const query=result.reason==='not_signed_in'?'?signin=required&from='+encodeURIComponent('skills:'+lessonId)+'&returnTo='+encodeURIComponent(returnTo):'?paywall=skills&lesson='+encodeURIComponent(lessonId);
   location.replace('../../../'+query);
  }catch(error){console.warn('Could not check course access',error);document.getElementById('title').textContent='Please reload to check your course access';}
  return false;
 },
 _status() {
  if(document.getElementById('cloudProgress'))return;
  const status=document.createElement('button');status.id='cloudProgress';status.type='button';status.setAttribute('aria-live','polite');status.style.cssText='position:fixed;right:12px;top:64px;z-index:30;border:0;border-radius:20px;padding:5px 10px;background:#f3effb;color:#625485;font:11px system-ui;cursor:pointer';
  const show=state=>{status.textContent=state==='saved'?'✓ Progress saved':state==='saving'?'Saving progress…':'Cloud not synced · Tap to retry';};
  status.onclick=()=>{if(this.profile)FEIProgress.saveFromProfile(this.profile);};
  window.addEventListener('fei:progress-sync',e=>show(e.detail.state));show(FEIProgress.syncState||'saving');document.body.append(status);
 },
 async restore(lessonId,key,count,{isolated=false}={}) {
  this.lesson=lessonId;this.isolated=isolated;this._status();
  const profile=JSON.parse(sessionStorage.getItem('fei_user_profile')||'null');
  if(!profile)return {};
  this.profile=await FEIProgress.loadForProfile(profile);
  sessionStorage.setItem('fei_user_profile',JSON.stringify(this.profile));
  const slot='guided:'+key;
  const saved=this.profile.completedSteps?.[slot];
  if(saved)return saved;
  // Previous unscoped previews cannot silently be assigned to another child.
  // Offer a one-time recovery of actual existing work, never invent completion.
  let old=null;try{old=JSON.parse(localStorage.getItem(key)||'null');}catch{}
  if(old && Array.isArray(old.completed) && old.completed.length && await this._claimLegacy()) {
   this.save(old,key);if(!isolated && lessonId!=='still-life-1a-star-balloon-structure' && old.completed.includes(count-1))await this.complete(lessonId);
   return old;
  }
  // Already completed on the old course: keep all ticks and allow revisiting.
  if(!isolated && this.profile.completedLessons?.includes(lessonId))return {index:count-1,unlocked:count-1,completed:Array.from({length:count},(_,i)=>i)};
  return {};
 },
 async recoverLegacy(profile) {
  this.profile=profile;this._status();
  const introIdentity=profile.supabaseUserId||profile.studentCode||profile.learnerId;
  let watched=!!profile.foundationIntroComplete;
  try{watched ||= !!introIdentity && localStorage.getItem('fei.sketch.intro:'+introIdentity)==='complete';}catch{}
  if(watched)profile.completedSteps=FEIProgress._steps(profile.completedSteps,{'foundation:intro':[0]});
  if(profile.completedSteps?.__legacyGuidedImported)return profile;
  const definitions=[['preparation','fei.preparation.guided-preview.v2',31],['cube','fei.cube.guided-preview.v2',33],['sphere','fei.sphere.guided-preview.v1',45],['still-life-1a-star-balloon-structure','fei.balloon.guided-preview.v1',11]];
  const found=[];
  // Convert earlier preview layouts before asking who owns this browser's work.
  const earlier=[['fei.preparation.guided-preview.v1','fei.preparation.guided-preview.v2',i=>i<12?i:i<18?12:i+9,i=>i<12||i>=18],['fei.cube.guided-preview.v1','fei.cube.guided-preview.v2',i=>i>=5?i+2:i,()=>true]];
  for(const [oldKey,newKey,shift,keep] of earlier){try{if(!localStorage.getItem(newKey)){const old=JSON.parse(localStorage.getItem(oldKey)||'null');if(old)localStorage.setItem(newKey,JSON.stringify({index:shift(old.index||0),unlocked:shift(old.unlocked||0),completed:(old.completed||[]).filter(keep).map(shift)}));}}catch{}}
  for(const [lesson,key,last] of definitions){try{const state=JSON.parse(localStorage.getItem(key)||'null');if(state?.completed?.length)found.push({lesson,key,last,state});}catch{}}
  if(!found.length || !await this._claimLegacy())return profile;
  for(const {lesson,key,last,state} of found){
   profile.completedSteps=FEIProgress._steps(profile.completedSteps,{['guided:'+key]:state});
   if(lesson!=='still-life-1a-star-balloon-structure' && state.completed.includes(last))profile.completedLessons=[...new Set([...(profile.completedLessons||[]),lesson])];
  }
  profile.completedSteps.__legacyGuidedImported=true;
  await FEIProgress.saveFromProfile(profile);
  return profile;
 },
 async _claimLegacy() {
  const id=FEIProgress.identity(this.profile),key='feiProgress.legacy-owner.v1';
  let owner;try{owner=localStorage.getItem(key);}catch{}
  if(owner)return owner===id;
  return new Promise(resolve=>{
   const dialog=document.createElement('dialog');dialog.style.cssText='max-width:380px;border:0;border-radius:24px;padding:28px;background:#fbf8ff;color:#272334;font:16px system-ui';
   dialog.innerHTML='<h2>Found your earlier practice?</h2><p>This browser has saved lesson steps from the earlier studio. Restore them only if this is your work.</p><button data-restore>Yes, restore my practice</button> <button data-skip>Not mine</button>';
   const finish=yes=>{try{localStorage.setItem(key,yes?id:'unclaimed');}catch{}dialog.close();dialog.remove();resolve(yes);};
   dialog.querySelector('[data-restore]').onclick=()=>finish(true);dialog.querySelector('[data-skip]').onclick=()=>finish(false);dialog.addEventListener('cancel',e=>{e.preventDefault();finish(false);});document.body.append(dialog);dialog.showModal();
  });
 },
 save(state,key) {
  if(!this.profile)return;
  const p=JSON.parse(sessionStorage.getItem('fei_user_profile')||'null');if(FEIProgress.identity(p)!==FEIProgress.identity(this.profile))return;
  this.profile=FEIProgress.mergeWithLocal(this.profile,p);
  const slot='guided:'+key,snapshot={...state,updatedAt:Date.now()};
  this.profile.completedSteps=FEIProgress._steps(this.profile.completedSteps,{[slot]:snapshot});
  this.profile.currentLesson=this.lesson;
  // Guided indices must not be interpreted as indices in the old lesson.
  this.profile.currentStepIdx=0;
  this._store();
 },
 _store() {
  sessionStorage.setItem('fei_user_profile',JSON.stringify(this.profile));
  return FEIProgress.saveFromProfile(this.profile);
 },
 async complete(lessonId) {
  if(!this.profile){this.profile=JSON.parse(sessionStorage.getItem('fei_user_profile')||'null');}
  if(!this.profile||this.isolated)return false;
  if(!this.profile.completedLessons?.includes(lessonId))this.justCompleted=lessonId;
  this.profile.completedLessons=[...new Set([...(this.profile.completedLessons||[]),lessonId])];
  this.profile.lastSeenAt=Date.now();
  return this._store();
 },
 async flush(){await FEIProgress.flush();}
};
