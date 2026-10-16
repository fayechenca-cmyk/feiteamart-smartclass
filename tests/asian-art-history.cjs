const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const c = vm.createContext({window:{}});
const run = f => vm.runInContext(fs.readFileSync(path.join(root,'art-theory',f),'utf8'),c);
run('curriculum.js'); run('western-media.js');
const before = JSON.parse(JSON.stringify(c.window.FEI_ART_HISTORY_TRACKS));
run('asian-curriculum.js');
const after = JSON.parse(JSON.stringify(c.window.FEI_ART_HISTORY_TRACKS));
assert.deepEqual(after.western,before.western,'Western course must remain intact');
assert.deepEqual(JSON.parse(JSON.stringify(c.window.FEI_ART_HISTORY_ARCHIVE.china)),before.china);
assert.equal(after.china.hidden,true);
const lessons=after.asia.lessons;
assert.equal(lessons.length,34);
assert.equal(new Set(lessons.map(l=>l.slug)).size,34);
assert.deepEqual(lessons.filter(l=>l.sourceChineseId).map(l=>l.sourceChineseId).sort((a,b)=>a-b),Array.from({length:20},(_,i)=>i+1));
const audit=JSON.parse(fs.readFileSync(path.join(root,'docs/asian-art-history-media-audit.json')));
const regions = new Set(); let photos=0,diagrams=0;
lessons.forEach((l,i)=>{
 assert.equal(l.id,i+1);
 if(i) assert.ok(l.startYear>=lessons[i-1].startYear,'Timeline must be chronological');
 l.regions.forEach(r=>regions.add(r));
 const id=l.videoUrl.match(/^https:\/\/www.youtube.com\/embed\/([\w-]{11})$/)?.[1];
 assert.ok(id,`${l.title}: concrete embed required`);
 assert.ok(audit.youtubeOEmbed[id]?.html.includes('/embed/'+id));
 assert.equal(l.videoSource.channel,audit.youtubeOEmbed[id].author_name);
 assert.equal(l.quiz.length,5);
 l.quiz.forEach(q=>assert.ok(Number.isInteger(q.ans)&&q.ans>=0&&q.ans<q.opts.length));
 assert.ok(l.lecture&&l.mission&&l.criticalThinking&&l.resources.length>=2);
 if(l.sourceChineseId){
  for(const f of ['lecture','mission','criticalThinking','quiz'])assert.deepEqual(l[f],before.china.lessons[l.sourceChineseId-1][f],`${l.slug}: original ${f} preserved`);
 }
 assert.ok(l.images.length);
 l.images.forEach(image=>{
  const bytes=fs.readFileSync(path.join(root,'art-theory',image.src));
  assert.ok(image.title&&image.credit&&image.sourceUrl);
  if(image.illustration){diagrams++;assert.match(bytes.toString(),/^<svg/);assert.equal(image.license,undefined);}
  else {photos++;assert.equal(bytes[0],255);assert.equal(bytes[1],216);assert.match(image.license,/^(Public domain|CC0|CC BY)/);assert.ok(image.licenseUrl);}
 });
});
for(const r of ['China','Japan','Korea','India','Indonesia','Cambodia','Iran'])assert.ok(regions.has(r));
const app=fs.readFileSync(path.join(root,'art-theory/app.js'),'utf8');
assert.ok(!app.includes('card.disabled = k === "china"'));
assert.ok(app.includes('currentLevelId > state.progress[state.activeTrack].unlocked'),'Preview cannot skip sequential Challenge progression');
assert.ok(app.includes('if (state.activeTrack === "western" && typeof artHistoryMarkLessonComplete'),'Asian completion must not unlock Western global badge');
console.log(`34 chronological lessons; all 20 original Chinese lessons preserved; ${photos} licensed photographs and ${diagrams} original diagrams; videos, attribution, quizzes and region coverage validated.`);

assert.ok(lessons.find(l=>l.slug==='byobu'));
assert.ok(lessons.find(l=>l.slug==='shodo'));
assert.match(lessons.find(l=>l.slug==='hokusai').title,/Ukiyo-e/);
assert.equal(lessons.find(l=>l.sourceChineseId===5).comparison.pairs.length,3);

// Regression: preserved Chinese completions sit between newly inserted lessons.
// Completing the inserted lesson must advance past already-completed Chinese topics.
const progressFunctions=app.slice(app.indexOf('  function safeNum('),app.indexOf('  function getLessons('));
const pc=vm.createContext({});vm.runInContext(progressFunctions,pc);
assert.equal(pc.normalizeProgress({unlocked:3,completed:[1,2,3]},34).unlocked,4);
assert.equal(pc.normalizeProgress({unlocked:2,completed:[1,3,5]},34).unlocked,2);
assert.equal(pc.normalizeProgress({unlocked:34,completed:Array.from({length:34},(_,i)=>i+1)},34).unlocked,34);
