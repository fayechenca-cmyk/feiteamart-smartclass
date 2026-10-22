const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.DASHBOARD_TEST_URL||'http://127.0.0.1:8041/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const context=await browser.newContext({viewport:{width:1280,height:1000}});
  await context.route('**/*',route=>{
   const url=new URL(route.request().url());if(url.origin!==new URL(base).origin)return route.abort();
   if(url.pathname==='/core/auth.js')return route.fulfill({body:'window.FEIAuth={_isConfigured:()=>false};',contentType:'application/javascript'});
   if(url.pathname==='/core/access.js')return route.fulfill({body:'window.FEIAccess={getStatus:async()=>({})};',contentType:'application/javascript'});
   return route.continue();
  });
  await context.addInitScript(()=>{if(top!==window)return;sessionStorage.setItem('fei_user_profile',JSON.stringify({studentCode:'SET-TEST'}));window.FEICreationAnalyticsConsent=true;window.events=[];window.gtag=(...args)=>events.push(args);});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.setDefaultTimeout(15000);
  await page.goto(base+'creation/#inspire/activity/quick-sketch');await page.locator('#insp-quantity').waitFor();await page.clock.install();
  assert.equal(await page.locator('#insp-quantity').inputValue(),'5');assert(await page.locator('#insp-run').isDisabled());
  for(const [quantity,duration] of [[2,30],[5,60],[10,120]]){
   if(await page.locator('#insp-new-set').count())await page.locator('#insp-new-set').click();
   await page.locator('#insp-quantity').selectOption(String(quantity));await page.locator('#insp-duration').selectOption(String(duration));
   // Manually select from two subject libraries; order is the order of clicks.
   await page.locator('[data-pick-photo]').nth(2).click();
   await page.locator('#insp-category').selectOption('flowers');await page.locator('[data-pick-photo]').nth(1).click();
   if(quantity>2)await page.locator('#insp-pick-set').click();
   assert.equal(await page.locator('[data-remove-photo]').count(),quantity);
   const selected=await page.locator('[data-remove-photo]').evaluateAll(nodes=>nodes.map(n=>n.dataset.removePhoto));assert.equal(new Set(selected).size,quantity);
   assert.match(await page.locator('#insp-set-summary').textContent(),new RegExp(`${quantity} × ${duration}`));
   await page.locator('#insp-run:not([disabled])').click();
   for(let index=0;index<quantity;index++){
    await page.waitForFunction(()=>document.querySelector('#insp-run')?.textContent==='Pause',null,{timeout:15000});
    assert.equal(await page.locator('#insp-round-status').textContent(),`Picture ${index+1} of ${quantity}`);
    assert.match(await page.locator('#insp-reference-image').getAttribute('src'),new RegExp(selected[index]));
    if(quantity===2&&index===1){
     await page.clock.runFor(1300);await page.locator('#insp-run').click();const remaining=await page.locator('#insp-seconds').textContent();
     await page.clock.runFor(9000);assert.equal(await page.locator('#insp-seconds').textContent(),remaining);
     await page.reload();await page.locator('#insp-run:not([disabled])').waitFor();assert.equal(await page.locator('#insp-round-status').textContent(),'Picture 2 of 2');assert.equal(await page.locator('#insp-seconds').textContent(),remaining);
     await page.clock.install();await page.locator('#insp-run').click();
    }
    // Deadline clock must also finish correctly when interval callbacks are delayed.
    await page.clock.fastForward(duration*1000+150);
   }
   await page.locator('#insp-reflection').waitFor();assert.equal(await page.locator('#insp-round-status').textContent(),`Set complete · ${quantity} of ${quantity} drawings`);
   const complete=await page.evaluate(()=>events.filter(e=>e[1]==='inspiration_activity_completed'));assert.equal(complete.length,quantity===2?1:quantity===5?2:3);
  }
  // Finishing early does not report an entire set as completed.
  await page.locator('#insp-new-set').click();await page.locator('#insp-pick-set').click();await page.locator('#insp-run:not([disabled])').click();await page.clock.runFor(1000);await page.locator('#insp-finish').click();
  assert.match(await page.locator('#insp-round-status').textContent(),/Set stopped · 0 of 5/);
  assert.equal(await page.evaluate(()=>events.filter(e=>e[1]==='inspiration_activity_completed').length),3);
  await page.locator('#insp-new-set').click();await page.locator('#insp-pick-set').click();
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});assert(await page.locator('#insp-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  }
  await page.setViewportSize({width:1280,height:1000});await page.locator('#insp-dialog').evaluate(e=>e.scrollTop=0);await page.screenshot({path:'/tmp/sketch-set-desktop.png'});
  await page.setViewportSize({width:390,height:844});await page.locator('#insp-dialog').evaluate(e=>e.scrollTop=0);await page.screenshot({path:'/tmp/sketch-set-mobile.png'});
  assert.deepEqual(errors,[]);console.log('PASS: 2/5/10 selected-photo sets, 30/60/120-second rounds, mixed subjects, automatic advance, second-image pause/reload/resume, accurate completion, early exit and responsive setup.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
