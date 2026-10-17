const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const dir='lessons/still-life-1a-star-balloon-structure/guided/';
const source=fs.readFileSync(dir+'studio.js','utf8');
const fn=source.slice(source.indexOf('function checkClip('),source.indexOf("$('playPause').onclick="));
const elements={clipSeek:{},clipTime:{}};
let completed=0,watchStarted=0;
const c={phase:'watching',watchNarrated:false,flow:[{start:150,clipEnd:178,watchAudio:'audio/v1-04-watch.mp3',watchSay:'x'}],index:0,player:{currentTime:150,muted:false,paused:false,play(){return Promise.resolve()}},$:id=>elements[id],finishClip(){completed++},beginWatchVoice(){if(c.watchNarrated)return;watchStarted++;c.watchNarrated=true;}};
vm.createContext(c);vm.runInContext(fn,c);

// Out-of-range seek/ended can never unlock or complete a checkpoint.
c.player.currentTime=336;vm.runInContext('checkClip(true)',c);assert.equal(completed,0);assert.equal(c.player.currentTime,177.75);
c.player.currentTime=0;vm.runInContext('checkClip()',c);assert.equal(completed,0);assert.equal(c.player.currentTime,150);

// Crossing start+0.1 begins the ducked watch-narration exactly once.
c.player.currentTime=155;vm.runInContext('checkClip()',c);assert.equal(watchStarted,1);
c.player.currentTime=160;vm.runInContext('checkClip()',c);assert.equal(watchStarted,1,'watch narration only starts once per clip');

// Reaching clipEnd completes the checkpoint; a later call in 'waiting' phase is a no-op.
c.player.currentTime=177.95;vm.runInContext('checkClip()',c);assert.equal(completed,1);
c.phase='waiting';c.player.currentTime=178;vm.runInContext('checkClip()',c);assert.equal(completed,1);

// flow.json media integrity: in-order, no skipped time, every mp3 present and non-trivial.
const flow=JSON.parse(fs.readFileSync(dir+'flow.json'));
assert.equal(flow.length,12);
let lastEnd=0, draws=0;
for(const s of flow){
 if(s.uid){
  draws++;
  assert.equal(s.start||0,lastEnd,'video time must be contiguous, no skipped ranges: '+s.title);
  assert(s.clipEnd>(s.start||0),'clipEnd must be after start: '+s.title);
  lastEnd=s.clipEnd;
  assert(fs.existsSync(dir+s.frame),'checkpoint frame missing: '+s.frame);
  assert(fs.statSync(dir+s.watchAudio).size>1000,'watch audio missing/too small: '+s.watchAudio);
 }
 if(s.audio) assert(fs.statSync(dir+s.audio).size>1000,'audio missing/too small: '+s.audio);
}
assert.equal(draws,7,'Video 1 should have 7 draw micro-steps (6 moments + end checkpoint)');
assert.equal(Math.round(lastEnd*100),38646,'last draw step must reach the full 386.46s video duration');

// Same no-native-controls convention as Cube.
assert(source.includes('controls=false'));assert(!source.includes('controls=true'));

// Access gate present and using the lesson's own id, not Cube's/Prep's.
assert(source.includes("canOpenLesson('skills',LESSON_ID)"),'must gate with the real entitlement check');
assert(source.includes("LESSON_ID = 'still-life-1a-star-balloon-structure'"));

console.log('PASS: out-of-step seek/ended cannot bypass a checkpoint; watch-narration starts once; 12-stage flow (7 Video-1 draws, contiguous 0-386.46s) and access gate verified.');
