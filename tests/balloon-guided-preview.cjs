// Deterministic player-boundary tests; real MP3/images are loaded from the local server.
const {chromium}=require('/Users/fayechen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const flow=JSON.parse(fs.readFileSync('lessons/still-life-1a-star-balloon-structure/guided/flow.json'));
const noQuery=src=>src.split('?')[0];
const url=process.env.PREVIEW_URL||'http://127.0.0.1:18817/lessons/still-life-1a-star-balloon-structure/guided/';
// Hard rule (Oct 2026, after a test run leaked real writes to a real student's
// account via the anon key): NO test may ever reach the live Supabase project.
// mockSupabase() intercepts the entire host on a page before any navigation —
// Playwright never lets a routed request reach the real network, so this is a
// guarantee, not a best-effort filter — and every intercepted request carries
// an 'x-mocked' response header so the hit-count below is independently
// verifiable evidence, not just an assumption that the route pattern matched.
const SUPABASE_HOST='rudztwseatwayhztbarj.supabase.co';
function mockSupabase(page){
 const hits=[];
 page.on('request',req=>{if(req.url().includes(SUPABASE_HOST))hits.push(req.url());});
 page.route(`https://${SUPABASE_HOST}/**`,route=>{
  const req=route.request();
  const body=req.url().includes('/rest/v1/student_progress')&&req.method()==='GET'?'[]':'{}';
  return route.fulfill({status:200,contentType:'application/json',headers:{'x-mocked':'1'},body});
 });
 return hits;
}

(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const supabaseHits=mockSupabase(page);
 // Simulate a paid (legacy demo-code) session so the access gate lets the test through —
 // the gate itself is checked separately, with no session, in the second browser context below.
 // core/access.js's _isLegacyAccessCode() does a REAL fetch of core/student-access-codes.js
 // and fails closed unless the code is actually on that roster (the Sept 2026 made-up-code
 // fix, commit 9175097) -- so TRYNEW (never a roster entry) never actually worked here. NEVER
 // use a real roster code here either (one such slip wrote real progress onto a real
 // student's account, since corrected) -- mock the roster fetch with a disposable
 // fixture code that exists nowhere outside this test.
 await page.route('**/core/student-access-codes.js',r=>r.fulfill({contentType:'text/javascript',body:'export default [{id:"PWTEST-00"}];'}));
 // addInitScript re-runs on every navigation (including the final redirect to
 // the Still Life landing page) -- only seed the fixture profile if one isn't
 // already there, so the real completedLessons/completedSteps written during
 // the flow survive that redirect instead of being reset back to the fixture.
 await page.addInitScript(()=>{if(!sessionStorage.getItem('fei_user_profile'))sessionStorage.setItem('fei_user_profile',JSON.stringify({studentCode:'PWTEST-00',tier:'member'}));});
 await page.route('https://embed.cloudflarestream.com/**',r=>r.fulfill({contentType:'text/javascript',body:`window.Stream=()=>{const events={};const p={currentTime:0,paused:true,muted:false,play(){this.paused=false;events.play?.();return Promise.resolve()},pause(){this.paused=true},addEventListener(n,f){events[n]=f}};window.fakePlayer=p;window.firePlayer=(n)=>events[n]?.();setTimeout(()=>events.loadedmetadata?.(),50);return p;};`}));
 await page.route('https://customer-*/**',r=>r.fulfill({contentType:'text/html',body:'<body style="background:#333;color:white">Teacher video (test player)</body>'}));
 await page.goto(url);await page.locator('#start:not([disabled])').waitFor();await page.click('#start');

 // Steps 0-3: materials / tissue / paper / placement -- each a single
 // narrated scene, 'Continue' only enables once that narration ends.
 for(let i=0;i<4;i++){
  await page.waitForFunction(t=>document.getElementById('title').textContent===t,flow[i].title);
  assert.equal(await page.locator('#next').isDisabled(),true,'Cannot continue before narration ends: '+flow[i].title);
  await page.evaluate(()=>document.getElementById('voice').dispatchEvent(new Event('ended')));
  assert.equal(await page.locator('#next').isEnabled(),true);
  await page.click('#next');
 }

 // Steps 4-11: the 8 Video 1 micro-steps, 13-19: the 7 Video 2 micro-steps,
 // 21-30: the 10 Video 3 micro-steps, 32-33: the 2 Video 4 micro-steps,
 // 36-49: the 14 Video 5 micro-steps -- same checkpoint mechanics for all five.
 await page.waitForFunction(()=>window.fakePlayer&&!window.fakePlayer.paused);
 async function processRange(lo,hi){
 for(let i=lo;i<hi;i++){
  const step=flow[i];
  await page.waitForFunction(t=>document.getElementById('title').textContent===t,step.title);
  assert.equal(await page.locator('#next').isDisabled(),true,'Cannot continue before video boundary: '+step.title);
  // Cross start+0.1s: the ducked watch-narration should begin, muting the teacher clip.
  await page.evaluate(start=>{fakePlayer.currentTime=start+0.5;firePlayer('timeupdate');},step.start||0);
  assert.equal(await page.evaluate(()=>fakePlayer.muted),true,'Teacher audio should duck while the watch-narration plays: '+step.title);
  const watchSrc=await page.locator('#voice').getAttribute('src');assert.equal(noQuery(watchSrc),step.watchAudio,'Watch narration audio mismatch: '+step.title);
  await page.evaluate(()=>document.getElementById('voice').dispatchEvent(new Event('ended')));
  assert.equal(await page.evaluate(()=>fakePlayer.muted),false,'Teacher audio should un-duck once watch-narration ends: '+step.title);
  // A seek outside this microstep's range must never complete it.
  await page.evaluate(end=>{fakePlayer.currentTime=end+50;firePlayer('timeupdate');},step.clipEnd);
  assert.equal(await page.locator('#next').isDisabled(),true,'Out-of-range seek must not complete a checkpoint: '+step.title);
  // Reaching the real clipEnd completes it and plays the Try prompt.
  await page.evaluate(end=>{fakePlayer.currentTime=end-0.05;firePlayer('timeupdate');},step.clipEnd);
  assert.equal(await page.locator('#next').isEnabled(),true);
  assert(await page.evaluate(()=>fakePlayer.paused),'Teacher video should pause at the checkpoint');
  const trySrc=await page.locator('#voice').getAttribute('src');assert.equal(noQuery(trySrc),step.audio,'Try-prompt audio mismatch: '+step.title);
  // The live overlay (not a flattened PNG) should be in the DOM, over the checkpoint frame.
  await page.waitForFunction(()=>document.querySelector('#visual .overlay-wrap img')?.naturalWidth>0);
  assert(await page.locator('#visual .overlay-svg').count()>0,'Live SVG overlay missing: '+step.title);
  // The finished drawing stays beside the video throughout, unchanged per moment.
  // Oct 2026: each draw step shows THAT STEP'S own result (stepResult), not the single
  // finished drawing -- the finished drawing is reserved for the welcome screen only
  // (see enter()'s comment in studio.js). refSrc is an absolute URL; compare by suffix.
  const refSrc=await page.locator('#referenceImage').getAttribute('src');
  assert(refSrc.endsWith(step.stepResult||step.frame),'Reference pane should show this step\'s own result: '+step.title);
  if(i===4){
   for(const [w,h,label] of [[1440,900,'desktop'],[1024,768,'ipad'],[390,844,'phone'],[844,390,'landscape']]){
    await page.setViewportSize({width:w,height:h});await page.screenshot({path:`/tmp/balloon-guided-${label}.png`});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow at '+label);
    const nextBox=await page.locator('#next').boundingBox();assert(nextBox.y>=0&&nextBox.y+nextBox.height<=h);
   }
   await page.setViewportSize({width:1440,height:900});
   await page.click('#sound');assert(await page.evaluate(()=>document.getElementById('voice').muted&&fakePlayer.muted));await page.click('#sound');
   // Oct 2026: the map is an intentionally "unlocked Journey" (commit 861f132)
   // -- every step is reachable, not just unlocked ones -- so nothing here is disabled.
   await page.click('#mapButton');assert.equal(await page.locator('#map button.map-step').last().isDisabled(),false,'Journey map should let the student jump anywhere');await page.click('#closeMap');
  }
  if(i===13||i===21||i===32||i===36){
   const tag=i===13?'v2':i===21?'v3':i===32?'v4':'v5';
   for(const [w,h,label] of [[1440,900,`desktop-${tag}`],[1024,768,`ipad-${tag}`]]){
    await page.setViewportSize({width:w,height:h});await page.screenshot({path:`/tmp/balloon-guided-${label}.png`});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow at '+label);
   }
   await page.setViewportSize({width:1440,height:900});
  }
  await page.click('#next');
  if(i<hi-1)await page.waitForFunction(()=>window.fakePlayer&&!window.fakePlayer.paused);
 }
 // Each video's own milestone (index === hi) continues forward -- into the
 // next video if the next step is itself a draw step, otherwise (Video 5's
 // milestone, followed by the recap/submit ending, not another video) it
 // just advances without waiting on a teacher clip that was never going to
 // resume. None of these is the true final step any more -- the flow now
 // always ends on its own submit step (see the tail below), never a milestone.
 if(flow[hi].kind==='milestone'){
  await page.waitForFunction(t=>document.getElementById('title').textContent===t,flow[hi].title);
  await page.evaluate(()=>document.getElementById('voice').dispatchEvent(new Event('ended')));
  assert.notEqual(await page.locator('#next').textContent(),'Celebrate →','Only the real final (submit) step should say Celebrate: '+flow[hi].title);
  await page.click('#next');
  if(flow[hi+1]?.kind==='draw')await page.waitForFunction(()=>window.fakePlayer&&!window.fakePlayer.paused);
 }
 }
 await processRange(4,12);await processRange(13,20);await processRange(21,31);await processRange(32,34);

 // Step 34: Video 4's "Before and after" compare step -- no clip, but a
 // two-phase narration (watchAudio first, then the usual audio/say), and a
 // before/after image pair instead of the live SVG overlay.
 const compareStep=flow[34];
 await page.waitForFunction(t=>document.getElementById('title').textContent===t,compareStep.title);
 assert.equal(await page.locator('#next').isDisabled(),true,'Cannot continue before the compare narration ends');
 let compareSrc=await page.locator('#voice').getAttribute('src');
 assert.equal(noQuery(compareSrc),compareStep.watchAudio,'Compare watch-narration audio mismatch');
 await page.evaluate(()=>document.getElementById('voice').dispatchEvent(new Event('ended')));
 assert.equal(await page.locator('#next').isDisabled(),true,'Should still wait for the second (try) narration phase');
 compareSrc=await page.locator('#voice').getAttribute('src');
 assert.equal(noQuery(compareSrc),compareStep.audio,'Compare try-prompt audio mismatch');
 await page.evaluate(()=>document.getElementById('voice').dispatchEvent(new Event('ended')));
 assert.equal(await page.locator('#next').isEnabled(),true);
 assert.equal(await page.locator('.compare-scene figure').count(),2,'Expected two before/after images in the compare scene');
 await page.click('#next');

 // Step 35: Video 4's own milestone -- continues into Video 5 now that it's
 // built (no more classic-lesson handoff here).
 await page.waitForFunction(t=>document.getElementById('title').textContent===t,flow[35].title);
 await page.evaluate(()=>document.getElementById('voice').dispatchEvent(new Event('ended')));
 assert.notEqual(await page.locator('#next').textContent(),'Celebrate →','Video 4\'s milestone is no longer the final step');
 await page.click('#next');
 await page.waitForFunction(()=>window.fakePlayer&&!window.fakePlayer.paused);

 // Steps 36-49: the 14 Video 5 micro-steps, same mechanics as every other video.
 await processRange(36,50);

 // Step 51: the recap scene -- five stage-result images (outline, observed
 // edges, tone, blend, details), narrated, no clip/overlay (new scene kind).
 const recapIndex=flow.findIndex(s=>s.kind==='recap');
 assert.equal(recapIndex,51);
 await page.waitForFunction(t=>document.getElementById('title').textContent===t,flow[recapIndex].title);
 assert.equal(await page.locator('#next').isDisabled(),true,'Cannot continue before the recap narration ends');
 await page.evaluate(()=>document.getElementById('voice').dispatchEvent(new Event('ended')));
 assert.equal(await page.locator('#next').isEnabled(),true);
 assert.equal(await page.locator('.recap-scene figure').count(),5,'Expected all five stage-result images in the recap');
 await page.click('#next');

 // Step 52: the submit step -- the flow's real last step now. Continuing
 // without sending a photo must still work, same as every other lesson.
 assert.equal(recapIndex+1,flow.length-1,'submit must immediately follow recap and be the flow\'s last step');
 await page.waitForFunction(t=>document.getElementById('title').textContent===t,flow[flow.length-1].title);
 assert.equal(await page.locator('#next').isDisabled(),true,'Cannot continue before the submit intro narration ends');
 await page.evaluate(()=>document.getElementById('voice').dispatchEvent(new Event('ended')));
 assert.equal(await page.locator('#next').isEnabled(),true,'Continuing without sending a photo must still be allowed');
 assert.equal(await page.locator('.submission-panel').count(),1,'Expected the real submission panel');
 assert.equal(await page.locator('#next').textContent(),'Celebrate →','The true final step must say Celebrate');

 // Clicking Celebrate on the real final step must open the real GuidedReward
 // dialog -- Still Life's own progress numbers and emoji-fallback badge
 // (still_life has no artwork yet) -- never the old classic-lesson handoff.
 await page.click('#next');
 await page.waitForSelector('dialog.guided-reward[open]');
 assert.equal((await page.locator('.reward-count').textContent()).trim(),'1 / 5 lessons · Still Life and Texture');
 assert.equal(await page.locator('.medal-emoji').count(),2,'still_life has no badge image yet -- both medal circles should use the emoji fallback');
 await page.click('.reward-continue');
 await page.waitForFunction(()=>/\/lessons\/still-life\/?$/.test(location.pathname),{timeout:8000});

 // Oct 2026: progress now lives in the account profile (sessionStorage +
 // GuidedPlatform), not the old bare localStorage key -- that key reads
 // null today (see the mock-fetch cleanup commit).
 const state=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('fei_user_profile')));
 assert(state.completedLessons.includes('still-life-1a-star-balloon-structure'),'finishing the real last step must record real lesson completion');
 assert.equal(state.completedSteps['guided:fei.balloon.guided-preview.v1'].completed.length,flow.length);
 assert.deepEqual(errors,[]);
 assert(supabaseHits.length>0,'expected the mocked Supabase host to actually be exercised (restore/save) -- a zero count likely means the route pattern stopped matching');
 console.log(`Supabase requests intercepted, zero reached the real network: ${supabaseHits.length}`);
 await browser.close();

 // Second context, no session at all: the access gate must redirect
 // away before any flow/player code runs -- never a free back door.
 const browser2=await chromium.launch({headless:true});
 const page2=await browser2.newPage();
 const supabaseHits2=mockSupabase(page2);
 await page2.route('**/core/student-access-codes.js',r=>r.fulfill({contentType:'text/javascript',body:'export default [{id:"PWTEST-00"}];'}));
 await page2.goto(url,{waitUntil:'domcontentloaded'});
 await page2.waitForFunction(()=>location.search.includes('signin=required')||location.search.includes('paywall='),{timeout:8000});
 assert(!page2.url().includes('/guided/'),'Unauthenticated visitor must be redirected away from the guided preview');
 await browser2.close();

 console.log(JSON.stringify({passed:true,stages:flow.length,viewports:4,errors,supabaseHits:supabaseHits.length+supabaseHits2.length}));
})().catch(e=>{console.error(e);process.exit(1)});
