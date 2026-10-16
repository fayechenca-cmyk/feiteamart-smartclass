// Deterministic player-boundary tests; real MP3/images are loaded from the local server.
const {chromium}=require('/Users/fayechen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const flow=JSON.parse(fs.readFileSync('lessons/lesson-3-cube/guided/flow.json'));
const url=process.env.PREVIEW_URL||'http://127.0.0.1:18816/lessons/lesson-3-cube/guided/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://embed.cloudflarestream.com/**',r=>r.fulfill({contentType:'text/javascript',body:`window.Stream=()=>{const events={};const p={currentTime:0,paused:true,muted:false,play(){this.paused=false;events.play?.();return Promise.resolve()},pause(){this.paused=true},addEventListener(n,f){events[n]=f}};window.fakePlayer=p;window.firePlayer=(n)=>events[n]?.();setTimeout(()=>events.loadedmetadata?.(),50);return p;};`}));
 await page.route('https://customer-*/**',r=>r.fulfill({contentType:'text/html',body:'<body style="background:#333;color:white">Teacher video (test player)</body>'}));
 await page.goto(url);await page.locator('#start:not([disabled])').waitFor();await page.click('#start');
 await page.waitForFunction(()=>window.fakePlayer&&!window.fakePlayer.paused);
 assert.equal(await page.locator('#next').isDisabled(),true);
 await page.evaluate(()=>firePlayer('ended'));
 await page.waitForFunction(()=>document.getElementById('title').textContent==='Meet the cube');
 assert.equal(await page.locator('#next').isDisabled(),true);
 await page.locator('[data-face=top]').click();await page.locator('[data-face=left]').click();await page.locator('[data-face=right]').click();
 assert.equal(await page.locator('#next').isEnabled(),true);await page.click('#next');
 await page.locator('#sunSlider').fill('80');await page.locator('#sunSlider').dispatchEvent('input');await page.click('#next');
 // No gate is tied to a fixed countdown: narration end enables non-practice scenes.
 for(let i=3;i<6;i++){await page.evaluate(()=>document.getElementById('voice').dispatchEvent(new Event('ended')));await page.click('#next');}
 await page.waitForFunction(()=>window.fakePlayer&&!window.fakePlayer.paused);
 for(let i=6;i<flow.length;i++){
  const step=flow[i];await page.waitForFunction(t=>document.getElementById('title').textContent===t,step.title);
  if(step.kind==='draw'){
   await page.waitForFunction(()=>window.fakePlayer&&!window.fakePlayer.paused);
   assert.equal(await page.locator('#next').isDisabled(),true,'Cannot continue before video boundary');
   await page.evaluate(end=>{if(end===null)firePlayer('ended');else{fakePlayer.currentTime=end;firePlayer('timeupdate');}},step.end);
   assert.equal(await page.locator('#next').isEnabled(),true);
   assert(await page.evaluate(()=>fakePlayer.paused));
   const src=await page.locator('#voice').getAttribute('src');assert.equal(src,step.audio);
   await page.waitForFunction(()=>document.querySelector('#visual img')?.naturalWidth>0);
   if(i===8){
    for(const [w,h,label] of [[1440,900,'desktop'],[1024,768,'ipad'],[390,844,'phone'],[844,390,'landscape']]){
     await page.setViewportSize({width:w,height:h});await page.screenshot({path:`/tmp/cube-guided-${label}.png`});
     assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
     const a=await page.locator('#stage').boundingBox(),b=await page.locator('#reference').boundingBox();
     if(w>700){assert(a.width>b.width*2.8);assert(Math.abs(a.y-b.y)<2);}
     const nextBox=await page.locator('#next').boundingBox();assert(nextBox.y>=0&&nextBox.y+nextBox.height<=h);
    }
    await page.setViewportSize({width:1440,height:900});
    await page.click('#sound');assert(await page.evaluate(()=>document.getElementById('voice').muted&&fakePlayer.muted));await page.click('#sound');
    await page.click('#mapButton');assert(await page.locator('#map button.map-step').last().isDisabled());await page.click('#closeMap');
    await page.click('#replay');assert.equal(await page.locator('#next').isDisabled(),true);await page.evaluate(end=>{fakePlayer.currentTime=end;firePlayer('timeupdate');},step.end);
   }
  }else{await page.evaluate(()=>document.getElementById('voice').dispatchEvent(new Event('ended')));}
  await page.click('#next');
 }
 assert.equal(await page.locator('#next').textContent(),'Preview complete ✓');
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('fei.cube.guided-preview.v1')));assert.equal(state.completed.length,flow.length);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,stages:flow.length,viewports:4,errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
