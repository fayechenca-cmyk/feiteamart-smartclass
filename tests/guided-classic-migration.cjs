const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
 let p={studentCode:'TEST',currentLesson:'cylinder',currentStepIdx:7,completedLessons:[],completedSteps:{}};
 const context={window:{},sessionStorage:{getItem:()=>JSON.stringify(p),setItem:(k,v)=>p=JSON.parse(v)},localStorage:{getItem:()=>null},FEIProgress:{loadForProfile:async p=>p,identity:p=>p.studentCode,mergeWithLocal:(a,b)=>({...a,...b}),_steps:(a,b)=>({...a,...b}),saveFromProfile:async()=>{}},console};
 vm.runInNewContext(fs.readFileSync('core/guided-platform.js','utf8'),context);const gp=context.window.GuidedPlatform;gp._status=()=>{};
 const mapping=[0,1,1,1,2,3,14,18,37,39,40,43,44];const result=await gp.restore('cylinder','cylinder-test',46,{classicStepMap:mapping,classicCompletedAt:9});assert.equal(result.index,18);assert.equal(result.completed.length,18);assert.equal(p.currentStepIdx,0);assert.equal(p.completedLessons.length,0);
 assert.equal((await gp.restore('cylinder','cylinder-test',46,{classicStepMap:mapping})).index,18);
 p={studentCode:'TEST',currentLesson:'cylinder',currentStepIdx:9,completedLessons:[],completedSteps:{}};
 await gp.restore('cylinder','cylinder-test',46,{classicStepMap:mapping,classicCompletedAt:9});assert(p.completedLessons.includes('cylinder'));
 p={studentCode:'TEST',currentLesson:'cube',currentStepIdx:9,completedLessons:[],completedSteps:{}};assert.deepEqual(JSON.stringify(await gp.restore('cylinder','cylinder-test',46,{classicStepMap:mapping})), '{}');
 console.log('PASS: old Cylinder cursor migrates once; completed core remains complete; another lesson never migrates into Cylinder.');
})().catch(e=>{console.error(e);process.exit(1)});
