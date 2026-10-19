const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const dir='lessons/lesson-9-intersecting/guided/',flow=JSON.parse(fs.readFileSync(dir+'flow.json')),durations=JSON.parse(fs.readFileSync(dir+'video-durations.json'));
const source=fs.readFileSync(dir+'studio.js','utf8');
function harness(){
 const elements={};let player,reward,saved,completed=[];
 function el(){return {hidden:false,disabled:false,ended:true,style:{},classList:{add(){}},listeners:{},addEventListener(n,f){this.listeners[n]=f},setAttribute(){},getAttribute(){return this.src},append(){},querySelector(){return el()},querySelectorAll(){return []},showModal(){},close(){},pause(){this.paused=true},play(){this.paused=false;return Promise.resolve()}}}
 const $=id=>elements[id]??=el();
 const context={GuidedPlatform:{allow:async()=>true,restore:async()=>({}),save(s){saved=s},complete(id){completed.push(id)},flush:async()=>{}},document:{getElementById:$,querySelector:()=>null,querySelectorAll:()=>[],createElement(type){const node=el();if(type==='video')player=node;return node;},addEventListener(){}},window:{GuidedSubmit:{mount(){}},addEventListener(){},GuidedReward:{complete(o){reward=o;return Promise.resolve(true)}}},localStorage:{getItem(){return null},setItem(){}},location:{search:''},URL,URLSearchParams,console,setTimeout:()=>1,clearTimeout(){},fetch:async()=>({ok:true,json:async()=>flow}),Stream(){player=el();return player}};
 vm.runInNewContext(source,context);
 return {context,$,get player(){return player},get reward(){return reward},get saved(){return saved},completed};
}
function finish(h,s){if(s.uid||s.src){h.player.listeners.loadedmetadata();h.player.currentTime=s.clipEnd;h.player.listeners.timeupdate();}else h.$('voice').onended();}
(async()=>{
 const h=harness();await new Promise(setImmediate);h.$('start').onclick();
 h.$('skipStep').onclick();assert.equal(h.$('title').textContent,flow[1].title);assert(h.saved.skipped.includes(0));assert(!h.saved.completed.includes(0));h.$('back').onclick();assert.equal(h.$('title').textContent,flow[0].title);
 for(let i=0;i<flow.length;i++){
  const s=flow[i];assert.equal(h.$('title').textContent,s.title+(s.optional&&!/optional/i.test(s.title)?' · Optional':''));
  if(s.audio){assert(fs.statSync(path.resolve(dir,s.audio)).size>1000,s.audio);assert(s.captions.length>0,s.id+' missing timed captions');}
  finish(h,s);if(s.kind==='intro')continue;
  assert.equal(h.$('next').disabled,false,s.title);h.$('next').onclick();
 }
 await new Promise(setImmediate);assert.equal(h.reward.lessonId,'intersecting');assert.equal(h.context.location.href,'../../lesson-4-giftbox/');assert(h.completed.includes('intersecting'));
 const skip=harness();await new Promise(setImmediate);skip.$('start').onclick();
 for(const s of flow){if(s.kind==='submit')break;finish(skip,s);if(s.kind!=='intro')skip.$('next').onclick();}
 assert.equal(skip.$('finishCore').hidden,false);skip.$('finishCore').onclick();assert.equal(skip.$('title').textContent,'Look for forms that meet');assert.equal(skip.saved.skipped.length,8);
 assert.equal(flow.length,37);assert.equal(new Set(flow.map(s=>s.id)).size,37);assert.equal(flow.filter(s=>s.analysis).length,11);
 for(const [uid,duration] of Object.entries(durations)){const steps=flow.filter(s=>s.uid===uid);assert.equal(steps[0].start,0);steps.forEach((s,i)=>{assert(s.clipEnd>s.start);if(i)assert.equal(s.start,steps[i-1].clipEnd)});assert(Math.abs(steps.at(-1).clipEnd-duration)<.01);}
 assert(source.includes("GuidedPlatform.allow('intersecting')"));
 const construction=flow.filter(s=>s.uid===Object.keys(durations)[0]);for(const t of [60,180,300,420,480,540])assert(construction.some(s=>s.clipEnd===t),'missing teacher-requested checkpoint '+t);for(const s of flow.filter(s=>s.analysis))assert(fs.existsSync(path.resolve(dir,s.analysis)),s.analysis);
 console.log('PASS: Intersecting Geometry 37 stages, narrated opening, 11 grounded analysis diagrams, all six videos uncut, timed captions, Back/Skip, optional background bypass preserves reflection, and Gift Box continuation.');
})().catch(e=>{console.error(e);process.exit(1)});
