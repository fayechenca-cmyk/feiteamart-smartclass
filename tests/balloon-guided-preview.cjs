// Deterministic player-boundary tests; real MP3/images are loaded from the local server.
const {chromium}=require('/Users/fayechen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const flow=JSON.parse(fs.readFileSync('lessons/still-life-1a-star-balloon-structure/guided/flow.json'));
const url=process.env.PREVIEW_URL||'http://127.0.0.1:18817/lessons/still-life-1a-star-balloon-structure/guided/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Simulate a paid (legacy demo-code) session so the access gate lets the test through —
 // the gate itself is checked separately, with no session, in the second browser context below.
 await page.addInitScript(()=>{sessionStorage.setItem('fei_user_profile',JSON.stringify({studentCode:'TRYNEW',tier:'member'}));});
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

 // Steps 4-10: the 7 Video 1 micro-steps.
 await page.waitForFunction(()=>window.fakePlayer&&!window.fakePlayer.paused);
 for(let i=4;i<11;i++){
  const step=flow[i];
  await page.waitForFunction(t=>document.getElementById('title').textContent===t,step.title);
  assert.equal(await page.locator('#next').isDisabled(),true,'Cannot continue before video boundary: '+step.title);
  // Cross start+0.1s: the ducked watch-narration should begin, muting the teacher clip.
  await page.evaluate(start=>{fakePlayer.currentTime=start+0.5;firePlayer('timeupdate');},step.start||0);
  assert.equal(await page.evaluate(()=>fakePlayer.muted),true,'Teacher audio should duck while the watch-narration plays: '+step.title);
  const watchSrc=await page.locator('#voice').getAttribute('src');assert.equal(watchSrc,step.watchAudio,'Watch narration audio mismatch: '+step.title);
  await page.evaluate(()=>document.getElementById('voice').dispatchEvent(new Event('ended')));
  assert.equal(await page.evaluate(()=>fakePlayer.muted),false,'Teacher audio should un-duck once watch-narration ends: '+step.title);
  // A seek outside this microstep's range must never complete it.
  await page.evaluate(end=>{fakePlayer.currentTime=end+50;firePlayer('timeupdate');},step.clipEnd);
  assert.equal(await page.locator('#next').isDisabled(),true,'Out-of-range seek must not complete a checkpoint: '+step.title);
  // Reaching the real clipEnd completes it and plays the Try prompt.
  await page.evaluate(end=>{fakePlayer.currentTime=end-0.05;firePlayer('timeupdate');},step.clipEnd);
  assert.equal(await page.locator('#next').isEnabled(),true);
  assert(await page.evaluate(()=>fakePlayer.paused),'Teacher video should pause at the checkpoint');
  const trySrc=await page.locator('#voice').getAttribute('src');assert.equal(trySrc,step.audio,'Try-prompt audio mismatch: '+step.title);
  // The live overlay (not a flattened PNG) should be in the DOM, over the checkpoint frame.
  await page.waitForFunction(()=>document.querySelector('#visual .overlay-wrap img')?.naturalWidth>0);
  assert(await page.locator('#visual .overlay-svg').count()>0,'Live SVG overlay missing: '+step.title);
  // The finished drawing stays beside the video throughout, unchanged per moment.
  const refSrc=await page.locator('#referenceImage').getAttribute('src');
  assert(refSrc.includes('finals/balloon.jpg'),'Reference pane should show the finished drawing, not a per-moment diagram');
  if(i===4){
   for(const [w,h,label] of [[1440,900,'desktop'],[1024,768,'ipad'],[390,844,'phone'],[844,390,'landscape']]){
    await page.setViewportSize({width:w,height:h});await page.screenshot({path:`/tmp/balloon-guided-${label}.png`});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow at '+label);
    const nextBox=await page.locator('#next').boundingBox();assert(nextBox.y>=0&&nextBox.y+nextBox.height<=h);
   }
   await page.setViewportSize({width:1440,height:900});
   await page.click('#sound');assert(await page.evaluate(()=>document.getElementById('voice').muted&&fakePlayer.muted));await page.click('#sound');
   await page.click('#mapButton');assert(await page.locator('#map button.map-step').last().isDisabled(),'Future steps stay locked in the map');await page.click('#closeMap');
  }
  await page.click('#next');
  if(i<10)await page.waitForFunction(()=>window.fakePlayer&&!window.fakePlayer.paused);
 }

 // Step 11: milestone -- praises effort, becomes the final "preview complete" step.
 await page.waitForFunction(t=>document.getElementById('title').textContent===t,flow[11].title);
 await page.evaluate(()=>document.getElementById('voice').dispatchEvent(new Event('ended')));
 await page.click('#next');
 assert.equal(await page.locator('#next').textContent(),'Preview complete ✓');
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('fei.balloon.guided-preview.v1')));
 assert.equal(state.completed.length,flow.length);
 assert.deepEqual(errors,[]);
 await browser.close();

 // Second context, no session at all: the access gate must redirect
 // away before any flow/player code runs -- never a free back door.
 const browser2=await chromium.launch({headless:true});
 const page2=await browser2.newPage();
 await page2.goto(url,{waitUntil:'domcontentloaded'});
 await page2.waitForFunction(()=>location.search.includes('signin=required')||location.search.includes('paywall='),{timeout:8000});
 assert(!page2.url().includes('/guided/'),'Unauthenticated visitor must be redirected away from the guided preview');
 await browser2.close();

 console.log(JSON.stringify({passed:true,stages:flow.length,viewports:4,errors}));
})().catch(e=>{console.error(e);process.exit(1)});
