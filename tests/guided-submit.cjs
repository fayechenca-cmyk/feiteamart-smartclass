const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
 let calls=[],failRecord=true;
 const context={window:{GuidedPlatform:{profile:{studentCode:'TEST',name:'Fixture'}},FEIAuth:{getSession:async()=>null}},FEIProgress:{SUPABASE_URL:'https://fixture.invalid',SUPABASE_KEY:'public'},AbortController,setTimeout,clearTimeout,crypto:require('node:crypto').webcrypto,fetch:async(url,options)=>{calls.push({url,options});return {ok:!url.includes('/rest/')||!failRecord,status:failRecord&&url.includes('/rest/')?503:200,json:async()=>url.includes('/rest/')?[{id:'saved'}]:{}}}};
 vm.runInNewContext(fs.readFileSync('core/guided-submit.js','utf8'),context);
 const draft={file:{type:'image/jpeg'}},options={lessonId:'cube',title:'Cube'};
 await assert.rejects(context.window.GuidedSubmit.send(draft,options,()=>{}),/503/);
 assert(draft.imageUrl);assert(!draft.record);const id=draft.id;
 failRecord=false;await context.window.GuidedSubmit.send(draft,options,()=>{});
 assert(draft.record);assert.equal(draft.id,id);assert.equal(calls.filter(c=>c.url.includes('/storage/')).length,1);
 assert.equal(JSON.parse(calls.at(-1).options.body).student_code,'TEST');
 console.log('PASS: partial failure is not success; retry reuses photo and stable submission id.');
})().catch(e=>{console.error(e);process.exit(1)});
