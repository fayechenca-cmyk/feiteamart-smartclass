// Mocked services; no live student data or network video playback.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.DASHBOARD_TEST_URL||'http://127.0.0.1:8037/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const context=await browser.newContext({viewport:{width:1440,height:1050}});
  await context.route('**/*',route=>{
   const url=new URL(route.request().url());
   if(url.origin!==new URL(base).origin)return route.abort();
   if(url.pathname==='/core/auth.js')return route.fulfill({contentType:'application/javascript',body:'window.FEIAuth={_isConfigured:()=>false};'});
   if(url.pathname==='/core/access.js')return route.fulfill({contentType:'application/javascript',body:'window.FEIAccess={init:async()=>{},getStatus:async()=>({}),canOpenLesson:async()=>({allowed:false,reason:"not_signed_in"}),recordLessonOpened:async()=>{}};'});
   return route.continue();
  });
  await context.addInitScript(()=>{
   if(window.top!==window)return;
   if(!sessionStorage.getItem('fei_user_profile'))sessionStorage.setItem('fei_user_profile',JSON.stringify({studentCode:'INSPIRATION-TEST',currentLesson:'sphere',currentStepIdx:3,completedLessons:['cube']}));
   window.FEICreationAnalyticsConsent=true;window.captured=[];window.gtag=(name,event,payload)=>captured.push({event,payload});
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'creation/#inspire');await page.locator('.insp-room').waitFor();
  const profile=await page.evaluate(()=>sessionStorage.getItem('fei_user_profile'));
  assert.equal(await page.locator('[data-seat]').count(),6);
  assert.equal(await page.locator('#room-artchi').count(),1);
  for(const id of ['material','color','character','shape','project','observation'])assert.equal(await page.locator('#art-'+id).count(),1);
  assert.equal(await page.locator('.insp-artchi-note').count(),1);await page.reload();await page.locator('.insp-room').waitFor();assert.equal(await page.locator('.insp-artchi-note').count(),0);
  // Every station has an accessible independent control and draft entries have no Start link.
  for(const id of ['material','visual','observation','shape','light','thinking']){
   await page.locator(`[data-seat="${id}"]`).focus();await page.keyboard.press('Enter');await page.locator('#insp-dialog[open]').waitFor();
   assert.equal(await page.locator('.insp-draft a').count(),0);await page.keyboard.press('Escape');await page.locator('#insp-dialog[open]').waitFor({state:'hidden'});
  }
  await page.locator('.insp-quick').click();await page.locator('#insp-run:not([disabled])').waitFor();
  await page.clock.install();
  await page.locator('#insp-duration').selectOption('30');await page.locator('#insp-run:not([disabled])').click();
  await page.clock.runFor(5300);assert.equal(await page.locator('#insp-seconds').textContent(),'25');
  await page.locator('#insp-run').click();const paused=await page.locator('#insp-seconds').textContent();await page.clock.runFor(10000);assert.equal(await page.locator('#insp-seconds').textContent(),paused);
  await page.keyboard.press('Escape');await page.locator('#insp-panel-title').filter({hasText:'Look Closer'}).waitFor();
  await page.locator('#insp-dialog [href="#inspire/activity/quick-sketch"]').click();await page.locator('#insp-run:not([disabled])').waitFor();assert.equal(await page.locator('#insp-seconds').textContent(),paused);
  await page.reload();await page.locator('#insp-run:not([disabled])').waitFor();assert.equal(await page.locator('#insp-seconds').textContent(),paused);
  await page.clock.install();await page.locator('#insp-run').click();await page.clock.runFor(26000);
  await page.locator('#insp-reflection').waitFor();assert.match(await page.locator('#insp-practice').innerText(),/Practice complete/);
  assert.equal(await page.evaluate(()=>captured.filter(e=>e.event==='inspiration_activity_completed').length),1);
  await page.locator('#insp-reflection').fill('<b>A curved edge</b>');await page.locator('#insp-save-note').click();
  assert.match(await page.locator('#insp-practice-status').innerText(),/saved/);
  await page.locator('#insp-restart').click();assert.equal(await page.locator('#insp-seconds').textContent(),'30');
  for(const category of ['flowers','animals']) {
   await page.locator('#insp-category').selectOption(category);await page.locator('#insp-run:not([disabled])').waitFor();
   assert.match(await page.locator('#insp-reference-image').getAttribute('src'),new RegExp('/'+category+'-'));
  }
  await page.locator('#insp-reference').selectOption('custom');assert.equal(await page.locator('#insp-run').isDisabled(),true);
  // Use the known local photograph as a stand-in for a user's chosen animal photograph.
  await page.locator('#insp-photo-input').setInputFiles(require('node:path').resolve(__dirname,'../material-art/cardboard/assets/pencils.png'));
  await page.locator('#insp-run:not([disabled])').waitFor();await page.locator('#insp-run').click();await page.clock.runFor(1000);await page.locator('#insp-run').click();
  await page.reload();await page.locator('#insp-photo-input').waitFor();assert.equal(await page.locator('#insp-run').isDisabled(),true);
  // User photos never enter localStorage or analytics. Another student cannot resume this student's practice.
  const stored=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
  assert(!JSON.stringify(stored).includes('blob:'));assert(!JSON.stringify(stored).includes('data:image'));
  await page.evaluate(()=>sessionStorage.setItem('fei_user_profile',JSON.stringify({studentCode:'SECOND-STUDENT'})));
  await page.reload();await page.locator('#insp-run:not([disabled])').waitFor();assert.equal(await page.locator('#insp-seconds').textContent(),'60');
  await page.evaluate(p=>{sessionStorage.setItem('fei_user_profile',p);location.hash='inspire/activity/memory-practice';},profile);
  await page.locator('#insp-run:not([disabled])').waitFor();await page.clock.install();await page.locator('#insp-run').click();await page.clock.runFor(10000);
  await page.locator('#insp-reveal').waitFor();assert.equal(await page.locator('#insp-reference-image').isVisible(),false);
  await page.locator('#insp-reveal').click();assert.equal(await page.locator('#insp-reference-image').isVisible(),true);
  // Verified videos are lazy and use the supplied IDs. No automatic completion from loading.
  for(const [id,videoId] of [['visual-memory-video','rHx81caDLTE'],['shape-creation-1','Dn5buTqRQgk'],['gun-shape-creation','_KrF09U6W68']]){
   await page.evaluate(id=>location.hash='inspire/activity/'+id,id);await page.locator('#insp-load-video').waitFor();assert.equal(await page.locator('.insp-video').count(),0);
   await page.locator('#insp-load-video').click();assert.match(await page.locator('.insp-video').getAttribute('src'),new RegExp(videoId));
  }
  await page.evaluate(()=>location.hash='inspire/activity/line-language');await page.locator('#insp-line-marks').waitFor();
  await page.locator('[data-line=count]').fill('8');await page.locator('[data-line=count]').dispatchEvent('change');assert.equal(await page.locator('#insp-line-marks path').count(),8);
  await page.locator('#insp-lines-done').click();assert.match(await page.locator('#insp-line-status').innerText(),/Saved/);
  await page.evaluate(()=>location.hash='inspire/activity/color-mixing');await page.locator('#insp-start-existing').waitFor();await page.locator('#insp-start-existing').click();await page.locator('#insp-local-status a').waitFor();
  assert.match(await page.locator('#insp-local-status').innerText(),/Sign in/);
  await page.evaluate(()=>location.hash='inspire');await page.locator('#insp-dialog[open]').waitFor({state:'hidden'});
  await page.locator('.insp-legacy summary').click();
  for(const id of ['color','shape','material','character','project']){await page.locator(`[data-station=${id}]`).click();assert.equal(await page.locator('#zoomOverlay.active').count(),1);await page.keyboard.press('Escape');}
  // Responsive bounds and meaningful keyboard/visible controls.
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:1050});await page.evaluate(()=>location.hash='inspire');await page.waitForTimeout(80);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Studio overflow '+width);
   for(const element of await page.locator('[data-seat]').all()){const box=await element.boundingBox();assert(box.width>=44&&box.height>=44);}
   const boxes=await Promise.all((await page.locator('[data-seat]').all()).map(e=>e.boundingBox()));
   for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
    const a=boxes[i],b=boxes[j];assert(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y,'Overlapping station labels at '+width);
   }
   assert(await page.locator('#room').evaluate(e=>getComputedStyle(e).marginLeft==='0px'),'Legacy room offset returned');
   await page.locator('.insp-quick').click();await page.locator('#insp-practice').waitFor();
   assert(await page.locator('#insp-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'Activity overflow '+width);
   await page.evaluate(()=>location.hash='inspire');await page.locator('#insp-dialog[open]').waitFor({state:'hidden'});
  }
  await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('#room-artchi .wing').evaluate(e=>getComputedStyle(e).animationName),'none');
  await page.setViewportSize({width:1440,height:1050});await page.screenshot({path:'/tmp/inspiration-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/inspiration-mobile.png',fullPage:true});
  await page.locator('.insp-quick').click();await page.locator('#insp-practice').waitFor();
  await page.locator('#insp-restart').click();await page.locator('#insp-category').selectOption('flowers');await page.locator('#insp-run:not([disabled])').waitFor();
  await page.screenshot({path:'/tmp/inspiration-practice.png',fullPage:true});
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('fei_user_profile')),profile);
  assert(!JSON.stringify(await page.evaluate(()=>captured)).includes('A curved edge'));
  assert(!JSON.stringify(await page.evaluate(()=>captured)).includes('INSPIRATION-TEST'));
  assert.deepEqual(errors,[]);
  console.log('PASS: six stations, original room/Artchi/tools, optional introduction, timer pause/reload/resume/finish/retry, custom photos, identity isolation, memory reveal, 3 video IDs, line manipulation, access gate, privacy, desktop/mobile bounds and reduced motion.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
