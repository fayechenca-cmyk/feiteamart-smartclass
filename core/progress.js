/* Account progress: Supabase is durable storage; per-identity local cache is an
 * offline retry buffer, never the only copy. No expiry or seven-day timer.
 * The deployed table currently has student_code but no user_id. Auth accounts
 * use a reserved auth:<uuid> key in that same table until the additive user_id
 * migration is installed. Existing user_id rows are read too when available.
 */
const FEIProgress = {
 SUPABASE_URL: 'https://rudztwseatwayhztbarj.supabase.co', SUPABASE_KEY: 'sb_publishable_NvPeY8sJYN8v4CoP1_X0BQ_RdluuoYT', TABLE: 'student_progress',
 _queues: new Map(), _userColumn: undefined,
 identity(p) { return p?.supabaseUserId ? 'auth:' + p.supabaseUserId : p?.studentCode ? 'code:' + p.studentCode : null; },
 _cacheKey(p) { const id=this.identity(p); return id ? 'feiProgress.v2.'+id : null; },
 _data(p) { return {currentLesson:p.currentLesson||null,currentStepIdx:p.currentStepIdx||0,completedLessons:p.completedLessons||[],completedSteps:p.completedSteps||{},totalXP:p.totalXP||0,ageGroup:p.ageGroup||null}; },
 cached(p) { try { return JSON.parse(localStorage.getItem(this._cacheKey(p))||'null'); } catch { return null; } },
 cache(p,pending=false) { const key=this._cacheKey(p);if(!key)return;try {localStorage.setItem(key,JSON.stringify({data:this._data(p),pending}));}catch{} },
 _emit(state) { this.syncState=state; if(typeof CustomEvent!=='undefined') window.dispatchEvent(new CustomEvent('fei:progress-sync',{detail:{state}})); },
 _steps(a={},b={}) {
  const out={...a};
  for(const [key,value] of Object.entries(b||{})) {
   const prior=out[key];
   if(Array.isArray(value)) out[key]=[...new Set([...(Array.isArray(prior)?prior:[]),...value])];
   else if(value && typeof value==='object' && key.startsWith('guided:')) {
    const x=prior && typeof prior==='object'&&!Array.isArray(prior)?prior:{};
    out[key]={...x,...value,index:Math.max(x.index||0,value.index||0),unlocked:Math.max(x.unlocked||0,value.unlocked||0),completed:[...new Set([...(x.completed||[]),...(value.completed||[])])],skipped:[...new Set([...(x.skipped||[]),...(value.skipped||[])])],updatedAt:Math.max(x.updatedAt||0,value.updatedAt||0)};
   } else if(key==='__cursor') out[key]=!prior || (value.updatedAt||0)>=(prior.updatedAt||0)?value:prior;
   else out[key]=value;
  }
  return out;
 },
 mergeWithLocal(row,local={}) {
  if(!row)return local;
  const remote={currentLesson:row.current_lesson??row.currentLesson,currentStepIdx:row.current_step_idx??row.currentStepIdx,completedLessons:row.completed_lessons??row.completedLessons??[],completedSteps:row.completed_steps??row.completedSteps??{},totalXP:row.total_xp??row.totalXP??0,ageGroup:row.age_group??row.ageGroup};
  const steps=this._steps(remote.completedSteps,local.completedSteps),cursor=steps.__cursor;
  const same=remote.currentLesson===local.currentLesson;
  return {...local,currentLesson:cursor?.lessonId||remote.currentLesson||local.currentLesson,currentStepIdx:cursor?.stepIndex??(same?Math.max(remote.currentStepIdx||0,local.currentStepIdx||0):(remote.currentStepIdx??local.currentStepIdx??0)),completedLessons:[...new Set([...remote.completedLessons,...(local.completedLessons||[])])],completedSteps:steps,totalXP:Math.max(remote.totalXP,local.totalXP||0),ageGroup:local.ageGroup||remote.ageGroup};
 },
 async _headers() {
  // Keep the deployed student_progress API role used by existing lessons.
  // Account identity selects the row; this release does not alter RLS policies.
  return {apikey:this.SUPABASE_KEY,Authorization:'Bearer '+this.SUPABASE_KEY,'Content-Type':'application/json'};
 },
 async _request(path,options={}) {
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  try {
   const res=await fetch(this.SUPABASE_URL+'/rest/v1/'+this.TABLE+path,{...options,headers:{...await this._headers(),...options.headers},signal:controller.signal,keepalive:options.method==='POST'});
   if(!res.ok){let body={};try{body=await res.json();}catch{};const error=new Error(body.message||'Progress request failed');error.code=body.code;error.status=res.status;throw error;}
   return res;
  } finally {clearTimeout(timer);}
 },
 async _loadByColumn(column,value) {
  if(!value)return null;
  const res=await this._request('?'+column+'=eq.'+encodeURIComponent(value)+'&limit=1');const rows=await res.json();return rows[0]||null;
 },
 async load(code) { return this._loadByColumn('student_code',code); },
 async loadByUserId(id) {
  let old=null;
  if(this._userColumn!==false)try {old=await this._loadByColumn('user_id',id);this._userColumn=true;}catch(e){if(e.code==='42703'||e.code==='PGRST204')this._userColumn=false;else throw e;}
  const compatible=await this.load('auth:'+id);
  return old?this.mergeWithLocal(old,compatible?this.mergeWithLocal(compatible,{}):{}):compatible;
 },
 async _upsert(identity,progress) {
  const payload={...identity,current_lesson:progress.current_lesson??progress.currentLesson??null,current_step_idx:progress.current_step_idx??progress.currentStepIdx??0,completed_lessons:progress.completed_lessons??progress.completedLessons??[],completed_steps:progress.completed_steps??progress.completedSteps??{},total_xp:progress.total_xp??progress.totalXP??0,age_group:progress.age_group??progress.ageGroup??null};
  await this._request('?on_conflict=student_code',{method:'POST',headers:{Prefer:'resolution=merge-duplicates'},body:JSON.stringify(payload)});
  return true;
 },
 async save(code,p) {if(!code)return false;return this._upsert({student_code:code},p);},
 async saveByUserId(id,p) {if(!id)return false;return this.save('auth:'+id,p);},
 async _cloud(p) {return p.supabaseUserId?this.loadByUserId(p.supabaseUserId):this.load(p.studentCode);},
 async saveFromProfile(profile) {
  const id=this.identity(profile);if(!id)return false;
  let snapshot=this.mergeWithLocal(this.cached(profile)?.data,profile);
  snapshot.completedSteps={...snapshot.completedSteps,__cursor:{lessonId:profile.currentLesson,stepIndex:profile.currentStepIdx||0,updatedAt:Date.now()}};
  this.cache(snapshot,true);this._emit('saving');
  const run=async()=>{
   try {
    if(this.cached(snapshot)?.pending===false)return true;
    // Merge before writing so an older tab cannot erase earned ticks.
    const cloud=await this._cloud(snapshot);
    const latest=this.mergeWithLocal(this.cached(snapshot)?.data,snapshot);
    const merged=this.mergeWithLocal(cloud,latest);
    await (merged.supabaseUserId?this.saveByUserId(merged.supabaseUserId,merged):this.save(merged.studentCode,merged));
    const newer=this.cached(snapshot)?.data;
    const combined=this.mergeWithLocal(merged,newer?{...snapshot,...newer}:snapshot);
    const pending=JSON.stringify(this._data(combined))!==JSON.stringify(this._data(merged));
    this.cache(combined,pending);this._emit(pending?'saving':'saved');return true;
   }catch(e){console.warn('[FEIProgress] cloud save unavailable:',e.code||e.message);this._emit('offline');return false;}
  };
  const task=(this._queues.get(id)||Promise.resolve()).then(run,run);this._queues.set(id,task);
  return task;
 },
 async loadForProfile(profile) {
  if(!profile||!this.identity(profile))return profile;
  const cache=this.cached(profile);let merged=this.mergeWithLocal(cache?.data,profile);
  try {merged=this.mergeWithLocal(await this._cloud(profile),merged);this.cache(merged,!!cache?.pending);this._emit('saved');}
  catch(e){console.warn('[FEIProgress] cloud restore unavailable:',e.code||e.message);this._emit('offline');return merged;}
  if(cache?.pending)await this.saveFromProfile(merged);
  return merged;
 },
 async flush() {await Promise.all([...this._queues.values()]);}
};
window.FEIProgress=FEIProgress;
window.addEventListener('online',()=>{try{const p=JSON.parse(sessionStorage.getItem('fei_user_profile')||'null');if(p&&FEIProgress.cached(p)?.pending)FEIProgress.saveFromProfile(p);}catch{}});
