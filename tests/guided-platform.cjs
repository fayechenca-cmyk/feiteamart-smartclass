const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
 let profile={completedLessons:['preparation'],studentCode:'TEST'},saved,redirect;
 const context={window:{FEIAccess:{canOpenLesson:async()=>({allowed:true})}},sessionStorage:{getItem:()=>JSON.stringify(profile),setItem:(key,value)=>{assert.equal(key,'fei_user_profile');profile=JSON.parse(value)}},FEIProgress:{saveFromProfile:p=>saved=p},location:{replace:u=>redirect=u},console,document:{getElementById:()=>({})}};
 vm.runInNewContext(fs.readFileSync('core/guided-platform.js','utf8'),context);
 const bridge=context.window.GuidedPlatform;
 assert.equal(await bridge.allow('sphere'),true);
 bridge.complete('cube');bridge.complete('cube');
 assert.deepEqual(profile.completedLessons,['preparation','cube']);assert.equal(JSON.stringify(saved),JSON.stringify(profile));assert.equal(profile.totalXP,undefined);
 context.window.FEIAccess.canOpenLesson=async()=>({allowed:false,reason:'not_signed_in'});
 assert.equal(await bridge.allow('sphere'),false);assert(redirect.includes('signin=required'));assert(redirect.startsWith('../../../'));
 for(const folder of ['preparation','lesson-3-cube','lesson-1-sphere','still-life-1a-star-balloon-structure']){
 const html=fs.readFileSync(`lessons/${folder}/index.html`,'utf8');assert(html.includes("has('classic')"));assert(html.includes("location.replace('guided/'"));
 }
 // Video 5 is built now -- Balloon ends for real (GuidedPlatform.complete +
 // GuidedReward + a redirect to the Still Life course map), never handing off
 // to the classic lesson any more (that was only ever a placeholder for the
 // gap before Video 5 existed).
 const balloon=fs.readFileSync('lessons/still-life-1a-star-balloon-structure/guided/studio.js','utf8');assert(!balloon.includes('classic=1&from=guided-outline'));assert(balloon.includes("GuidedPlatform.complete(LESSON_ID)"));
 console.log('PASS: access gate, idempotent profile completion, original-link routing, and Balloon\'s real completion (no more classic handoff).');
})().catch(e=>{console.error(e);process.exit(1)});
