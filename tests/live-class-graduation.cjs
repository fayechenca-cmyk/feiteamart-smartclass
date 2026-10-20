// Live Classes graduation card: a course with every session in the past
// (not merely unscheduled) shows the Step 1 "You finished Form and
// Structure!" card instead of "ALL CAUGHT UP"; a course with a future
// session is completely unchanged. Hard rule, same as every other test
// here: the real Supabase project is never reached -- every request to
// it is intercepted and the test asserts the mock was actually
// exercised. No real student/access code is ever used.
const {chromium}=require('/Users/fayechen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const url=process.env.PREVIEW_URL||'http://127.0.0.1:18817/index.html';
const SUPABASE_HOST='rudztwseatwayhztbarj.supabase.co';

function session(classNumber,when){return {id:'s'+classNumber,class_number:classNumber,title:'Class '+classNumber,topic:'',date:when,time:'10:00',zoom_url:null,materials_url:null};}

async function mockCommon(page,sessionsJson){
 const hits=[];
 page.on('request',req=>{if(req.url().includes(SUPABASE_HOST))hits.push(req.url());});
 await page.route(`https://${SUPABASE_HOST}/**`,route=>{
  const reqUrl=route.request().url();
  if(reqUrl.includes('/rest/v1/live_class_sessions')){
   return route.fulfill({status:200,contentType:'application/json',headers:{'x-mocked':'1'},body:sessionsJson});
  }
  if(reqUrl.includes('/rest/v1/course_purchases')){
   return route.fulfill({status:200,contentType:'application/json',headers:{'x-mocked':'1'},body:'[]'});
  }
  return route.fulfill({status:200,contentType:'application/json',headers:{'x-mocked':'1'},body:'{}'});
 });
 await page.route('**/core/student-access-codes.js',r=>r.fulfill({contentType:'text/javascript',body:'export default [{id:"PWTEST-GRAD",isLiveClass:true}];'}));
 await page.addInitScript(()=>{sessionStorage.setItem('fei_user_profile',JSON.stringify({studentCode:'PWTEST-GRAD',tier:'member',name:'Preview Tester',completedLessons:[]}));});
 return hits;
}

(async()=>{
 const browser=await chromium.launch({headless:true});
 let totalHits=0;

 // Scenario 1: every one of sketch-a's 10 sessions is in the past -> graduation card.
 {
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const sessions=JSON.stringify(Array.from({length:10},(_,i)=>session(i+1,'2020-01-0'+((i%9)+1))));
  const hits=await mockCommon(page,sessions);
  await page.goto(url+'#dashboard/live',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.live-class-graduation',{timeout:15000});
  assert.equal(await page.locator('.live-class-next-label').count(),0,'ALL CAUGHT UP must not render when the course is actually finished');
  assert.equal((await page.locator('.live-class-graduation-kicker').textContent()).trim(),'🎓 STEP 1 COMPLETE');
  assert.equal((await page.locator('.live-class-graduation-title').textContent()).trim(),'You finished Form and Structure!');
  const href=await page.locator('.live-class-graduation-cta').getAttribute('href');
  assert(href.includes('still-life'),'graduation CTA must link to the Still Life course map: '+href);
  assert.equal(await page.locator('.live-class-graduation-new').count(),1,'first visit should get the one-time glow class');
  assert(hits.length>0,'expected the mocked Supabase host to actually be exercised');
  totalHits+=hits.length;
  await page.close();
 }

 // Revisit (same browser, same localStorage): graduation card still shows,
 // but the one-time glow class must not reappear.
 {
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const sessions=JSON.stringify(Array.from({length:10},(_,i)=>session(i+1,'2020-01-0'+((i%9)+1))));
  const hits=await mockCommon(page,sessions);
  await page.addInitScript(()=>{try{localStorage.setItem('fei.liveclass.graduated.sketch-a','1');}catch(e){}});
  await page.goto(url+'#dashboard/live',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.live-class-graduation',{timeout:15000});
  assert.equal(await page.locator('.live-class-graduation-new').count(),0,'the glow/chime is a one-time moment, not every visit');
  totalHits+=hits.length;
  await page.close();
 }

 // Scenario 2: a real future session exists -> completely unchanged (no
 // graduation card, normal "NEXT CLASS" card renders as before).
 {
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const sessions=JSON.stringify([session(1,'2020-01-01'),session(2,'2099-06-15')]);
  const hits=await mockCommon(page,sessions);
  await page.goto(url+'#dashboard/live',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.live-class-next-label',{timeout:15000});
  assert.equal(await page.locator('.live-class-graduation').count(),0,'a course with a future session must never show the graduation card');
  assert.equal((await page.locator('.live-class-next-label').textContent()).trim(),'NEXT CLASS');
  totalHits+=hits.length;
  await page.close();
 }

 // Scenario 3: only 3 of sketch-a's 10 sessions have been scheduled yet,
 // all 3 already past (the rest simply not set up in teacher-admin) ->
 // "ALL CAUGHT UP" unchanged, not graduation. This is the real
 // distinction the feature is for: past-count must equal the course's
 // own total, not just "nothing upcoming in whatever rows exist".
 {
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const sessions=JSON.stringify([session(1,'2020-01-01'),session(2,'2020-02-01'),session(3,'2020-03-01')]);
  const hits=await mockCommon(page,sessions);
  await page.goto(url+'#dashboard/live',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.live-class-next-label',{timeout:15000});
  assert.equal(await page.locator('.live-class-graduation').count(),0,'3 of 10 scheduled (even if all past) must not show graduation');
  assert.equal((await page.locator('.live-class-next-label').textContent()).trim(),'ALL CAUGHT UP');
  totalHits+=hits.length;
  await page.close();
 }

 console.log(`Supabase requests intercepted, zero reached the real network: ${totalHits}`);
 console.log('PASS: Live Classes graduation card shows only when every session of the course is past, is a one-time glow, links to the Still Life course map, and never affects a course with any upcoming/unscheduled session.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
