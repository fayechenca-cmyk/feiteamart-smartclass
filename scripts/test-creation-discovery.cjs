const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.DASHBOARD_TEST_URL||'http://127.0.0.1:8037/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.route('**/*',route=>{
  const u=new URL(route.request().url());
  if(u.origin!==new URL(base).origin)return route.abort();
  if(u.pathname==='/core/auth.js')return route.fulfill({body:'window.FEIAuth={_isConfigured:()=>false};',contentType:'application/javascript'});
  if(u.pathname==='/core/access.js')return route.fulfill({body:'window.FEIAccess={init:async()=>{},getStatus:async()=>({openedCreationLessons:[]}),canOpenLesson:async()=>({allowed:!window.deny,reason:"paywall_creation"}),recordLessonOpened:async()=>{window.recorded=true}};',contentType:'application/javascript'});
  return route.continue();
 });
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{sessionStorage.setItem('fei_user_profile',JSON.stringify({studentCode:'TEST',currentLesson:'dream-art-studio',currentStepIdx:2,completedSteps:{},completedLessons:[]}));window.events=[];window.gtag=(...args)=>window.events.push(args)});
 await page.goto(base+'creation/');
 await page.locator('.c3-choices').waitFor();
 assert.equal(await page.locator('#creation-tour').evaluate(e=>e.open),false);
 const before=await page.evaluate(()=>sessionStorage.getItem('fei_user_profile'));
 await page.locator('[data-entry=make]').click();await page.locator('#c3-gallery').waitFor();assert.equal(await page.locator('.c3-card').count(),16);
 const projects=await page.evaluate(()=>FEICreationProjects);
 const covers=projects.filter(p=>p.cover);
 assert.deepEqual(covers.map(p=>p.id).sort(),['carle-colorful-chameleon','color-bloom-collage','miro-draw-without-knowing']);
 assert(covers.every(p=>/finished/i.test(p.cover.alt)));
 assert.equal(projects.filter(p=>!p.cover).length,13);
 assert.equal(await page.locator('.c3-card img').count(),3);
 for(const p of projects){assert(p.id);const r=await context.request.get(new URL(p.route,base+'creation/').href);assert.equal(r.status(),200,p.title)}
 await page.locator('#c3-search').fill('chameleon');assert.equal(await page.locator('.c3-card').count(),1);
 await page.locator('.c3-card a').click();await page.locator('.c3-preview').waitFor();assert.match(await page.locator('.c3-preview').innerText(),/Painted Paper/);
 await page.locator('[data-save]').click();assert.equal(await page.locator('[data-save]').getAttribute('aria-pressed'),'true');
 await page.reload();assert.equal(await page.locator('[data-save]').getAttribute('aria-pressed'),'true');
 await page.evaluate(()=>sessionStorage.setItem('fei_user_profile',JSON.stringify({studentCode:'OTHER'})));
 await page.locator('[href="#make"]').first().click();await page.locator('#c3-saved').click();assert.equal(await page.locator('.c3-card').count(),0);
 await page.evaluate(p=>sessionStorage.setItem('fei_user_profile',p),before);
 await page.locator('[href="#inspire"]').click();await page.locator('.inspiration').waitFor();assert.equal(await page.locator('#room-artchi').count(),1);assert.equal(await page.locator('#stage').isVisible(),true);
 await page.locator('.insp-legacy summary').click();
 for(const id of ['color','shape','character','material','project']){await page.locator(`[data-station=${id}]`).click();assert.equal(await page.locator('#zoomOverlay').evaluate(e=>e.classList.contains('active')),true);await page.keyboard.press('Escape')}
 await page.locator('[href="#welcome"]').first().click();await page.locator('.c3-choices').waitFor();assert.equal(await page.locator('#stage').isVisible(),false);
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:1000});
  for(const hash of ['welcome','make','project/carle-colorful-chameleon','inspire']){
   await page.evaluate(h=>location.hash=h,hash);await page.waitForTimeout(80);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width} ${hash}`);
  }
 }
 assert.equal(await page.evaluate(()=>events.length),0);
 await page.evaluate(()=>{window.FEICreationAnalyticsConsent=true;FEICreationEvents.track('project_saved',{projectId:'dream-art-studio',email:'private@example.com',studentId:'secret'},'one');FEICreationEvents.track('project_saved',{},'one')});
 assert.equal(await page.evaluate(()=>events.length),1);assert(!JSON.stringify(await page.evaluate(()=>events)).includes('private'));
 assert.equal(await page.evaluate(()=>sessionStorage.getItem('fei_user_profile')),before);
 await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>location.hash='welcome');await page.waitForTimeout(100);
 await page.screenshot({path:'/tmp/creation-welcome.png',fullPage:true});
 await page.evaluate(()=>location.hash='make');await page.waitForTimeout(100);if(await page.locator('#c3-saved').getAttribute('aria-pressed')==='true')await page.locator('#c3-saved').click();await page.screenshot({path:'/tmp/creation-gallery.png',fullPage:true});
 await page.evaluate(()=>{window.deny=true;location.hash='project/dream-art-studio'});await page.locator('[data-start="dream-art-studio"]').click();await page.waitForURL('**/upgrade/**');
 assert.deepEqual(errors,[]);console.log('PASS: 16 routes, gallery/search, preview, bookmarks/account isolation, Studio/5 stations, 20 responsive checks, progress preservation, access denial, opt-in analytics and event deduplication.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
