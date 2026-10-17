const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const dir='lessons/preparation/guided/';const flow=JSON.parse(fs.readFileSync(dir+'flow.json'));
const elements={};function el(){return {hidden:false,disabled:false,style:{},classList:{add(){}},listeners:{},addEventListener(n,f){this.listeners[n]=f},setAttribute(){},append(){},querySelector(){return el()},querySelectorAll(){return []},showModal(){},close(){},pause(){this.paused=true},play(){this.paused=false;return Promise.resolve()}}}const $=id=>elements[id]??=el();
let player;const context={document:{getElementById:$,querySelectorAll:()=>[],createElement:el,addEventListener(){}},window:{addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},location:{},URL,console,setTimeout:()=>1,clearTimeout(){},fetch:async()=>({ok:true,json:async()=>flow}),Stream(){player=el();return player}};
(async()=>{vm.runInNewContext(fs.readFileSync(dir+'studio.js','utf8'),context);await new Promise(setImmediate);$('start').onclick();for(let i=0;i<flow.length;i++){
const s=flow[i];assert.equal($('title').textContent,s.title);assert(fs.statSync(dir+s.audio).size>1000,s.audio);
if(s.uid){assert(s.clipEnd>0);player.listeners.loadedmetadata();player.currentTime=s.clipEnd;player.listeners.timeupdate();}else{$('voice').onended();}
assert.equal($('next').disabled,false,s.title);$('next').onclick();}
assert.equal(context.location.href,'../../lesson-3-cube/guided/');assert.equal(flow.filter(s=>s.kind==='milestone').length,4);assert.equal(flow.filter(s=>s.uid).length,4);console.log('PASS: all 23 stages, four videos, four milestones, narration assets and Cube continuation.');})().catch(e=>{console.error(e);process.exit(1)});
