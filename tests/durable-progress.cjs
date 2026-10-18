const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const rows=new Map(),requests=[];let offline=false,now=1000;
const store=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k),clear:()=>m.clear()}};
function environment(){const localStorage=store(),sessionStorage=store(),events=[];
 const c={localStorage,sessionStorage,console,Map,Set,AbortController,setTimeout,clearTimeout,Date:{now:()=>++now},CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts.detail}},window:{FEIAuth:{getSession:async()=>({access_token:'test-session'})},addEventListener(){},dispatchEvent:e=>events.push(e.detail.state)},fetch:async(url,o)=>{
 requests.push({url,o});if(offline)throw Error('offline');const u=new URL(url);const column=u.searchParams.has('user_id')?'user_id':'student_code';
 if(column==='user_id')return {ok:false,status:400,json:async()=>({code:'42703',message:'column does not exist'})};
 if(o.method==='POST'){const p=JSON.parse(o.body);rows.set(p.student_code,structuredClone(p));return {ok:true,status:201};}
 return {ok:true,status:200,json:async()=>{const row=rows.get(u.searchParams.get('student_code').slice(3));return row?[structuredClone(row)]:[]}};
 }};vm.createContext(c);vm.runInContext(fs.readFileSync('core/progress.js','utf8'),c);return {c,api:c.window.FEIProgress,events};}
(async()=>{
 const first=environment(),p={supabaseUserId:'user-a',completedLessons:['preparation'],currentLesson:'cube',currentStepIdx:0,completedSteps:{'guided:fei.cube.guided-preview.v2':{index:7,unlocked:7,completed:[0,1,2,3,4,5,6]}},totalXP:0};
 assert.equal(await first.api.saveFromProfile(p),true);assert(rows.has('auth:user-a'));assert.equal(first.events.at(-1),'saved');
 // New device / no local or session storage, arbitrarily far in the future.
 now+=1000*60*60*24*400;const second=environment();let restored=await second.api.loadForProfile({supabaseUserId:'user-a',completedLessons:[],completedSteps:{},totalXP:99});
 assert(restored.completedLessons.includes('preparation'));assert.equal(restored.completedSteps['guided:fei.cube.guided-preview.v2'].index,7);
 // Lower XP must not erase completed lessons, even across tabs with stale profiles.
 const stale={supabaseUserId:'user-a',completedLessons:['sphere'],completedSteps:{},currentLesson:'sphere',totalXP:1};await second.api.saveFromProfile(stale);
 restored=await first.api.loadForProfile(p);assert(restored.completedLessons.includes('preparation'));assert(restored.completedLessons.includes('sphere'));assert.equal(restored.completedSteps['guided:fei.cube.guided-preview.v2'].index,7);
 // Run the actual guided bridge against the restored cloud record.
 const bridgeEnv=environment();bridgeEnv.c.document={getElementById:()=>({})};bridgeEnv.c.location={replace(){}};bridgeEnv.c.window.FEIAccess={canOpenLesson:async()=>({allowed:true})};bridgeEnv.c.sessionStorage.setItem('fei_user_profile',JSON.stringify({supabaseUserId:'user-a',completedLessons:[]}));
 vm.runInContext(fs.readFileSync('core/guided-platform.js','utf8'),bridgeEnv.c);
 const bridge=bridgeEnv.c.window.GuidedPlatform;await bridge.allow('cube');const checkpoint=await bridge.restore('cube','fei.cube.guided-preview.v2',34);assert.equal(checkpoint.index,7);assert(bridge.profile.completedLessons.includes('preparation'));
 const other=await second.api.loadForProfile({supabaseUserId:'user-b',completedLessons:[]});assert.equal(other.completedLessons.length,0);
 // Offline save is explicitly unsynced; retry does not drop the new step.
 offline=true;restored.completedSteps['guided:fei.cube.guided-preview.v2']={index:8,unlocked:8,completed:[0,1,2,3,4,5,6,7]};assert.equal(await second.api.saveFromProfile(restored),false);assert.equal(second.events.at(-1),'offline');offline=false;await second.api.loadForProfile(restored);
 assert.equal(rows.get('auth:user-a').completed_steps['guided:fei.cube.guided-preview.v2'].index,8);
 // Legacy accounts use the same durable behavior, with no account crossover.
 const legacy={studentCode:'TEST-LEGACY',completedLessons:['cube'],completedSteps:{cube:[0,1]},currentLesson:'sphere',currentStepIdx:3};await first.api.saveFromProfile(legacy);const third=environment();const l=await third.api.loadForProfile({studentCode:'TEST-LEGACY',completedLessons:[]});assert(l.completedLessons.includes('cube'));assert.equal(l.currentStepIdx,3);
 // Back-to-back checkpoints converge on the furthest unlocked step.
 const a={...p,completedSteps:{'guided:fei.cube.guided-preview.v2':{index:10,unlocked:10,completed:[8,9]}}},b={...p,completedSteps:{'guided:fei.cube.guided-preview.v2':{index:11,unlocked:11,completed:[10]}}};await Promise.all([first.api.saveFromProfile(a),first.api.saveFromProfile(b)]);assert.equal(rows.get('auth:user-a').completed_steps['guided:fei.cube.guided-preview.v2'].index,11);
 console.log('PASS: fresh-device restore after 400 days, legacy/auth identities, missing-column compatibility, monotonic completion, offline retry, queued steps and account isolation.');
})().catch(e=>{console.error(e);process.exit(1)});
