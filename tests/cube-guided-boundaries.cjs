const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const dir='lessons/lesson-3-cube/guided/';
const source=fs.readFileSync(dir+'studio.js','utf8');
const fn=source.slice(source.indexOf('function checkClip('),source.indexOf("$('playPause').onclick="));
const elements={clipSeek:{},clipTime:{},resume:{}};
let completed=0;
const c={phase:'watching',flow:[{start:22,clipEnd:97}],index:0,player:{currentTime:22,play(){return Promise.resolve()}},$:id=>elements[id],finishClip(){completed++}};
vm.createContext(c);vm.runInContext(fn,c);
c.player.currentTime=336;vm.runInContext('checkClip(true)',c);assert.equal(completed,0);assert.equal(c.player.currentTime,96.75);
c.player.currentTime=0;vm.runInContext('checkClip()',c);assert.equal(completed,0);assert.equal(c.player.currentTime,22);
c.player.currentTime=96.95;vm.runInContext('checkClip()',c);assert.equal(completed,1);
c.phase='waiting';c.player.currentTime=97;vm.runInContext('checkClip()',c);assert.equal(completed,1);
const flow=JSON.parse(fs.readFileSync(dir+'flow.json'));assert.equal(flow.length,34);
for(const s of flow){if(s.uid)assert(s.clipEnd>(s.start||0));if(s.audio)assert(fs.statSync(dir+s.audio).size>1000);}
assert(source.includes('controls=false'));assert(!source.includes('controls=true'));console.log('PASS: out-of-step seek and ended cannot bypass a checkpoint; 34-stage media verified.');
