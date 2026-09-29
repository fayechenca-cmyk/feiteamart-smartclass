// Run with NODE_PATH pointing to a Playwright installation and a local HTTP server.
// External services are mocked: this suite never writes real student records.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const base = process.env.DASHBOARD_TEST_URL || 'http://127.0.0.1:8011/';
const output = path.resolve(__dirname, '../docs/dashboard-preview');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1050}});
 await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin!==new URL(base).origin)return route.abort();
   if(url.pathname==='/core/auth.js')return route.fulfill({contentType:'application/javascript',body:'window.FEIAuth={_isConfigured:()=>false,isEmbedded:()=>false};'});
   if(url.pathname==='/core/student-access-codes.js')return route.fulfill({contentType:'application/javascript',body:'const fixture=[{id:"DASHBOARD-TEST",displayName:"Preview Student",isTrial:true}];'});
   if(url.pathname==='/core/students.json')return route.fulfill({json:[]});
   return route.continue();
 });
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE ERROR:',e.stack);});
 await page.goto(base);await page.locator('#signin-screen').waitFor({state:'visible'});
 assert.equal(await page.locator('#student-shell').isVisible(),false);
 await page.locator('.access-code-section summary').click();
 await page.locator('#signin-code').fill('DASHBOARD-TEST');await page.locator('#signin-btn').click();
 await page.locator('#dashboard-page-courses').waitFor({state:'visible'});
 assert.equal(await page.locator('#dashboard-heading').isVisible(),false);
 assert.deepEqual(await page.locator('.dashboard-nav[aria-label="Student workspace"] a').evaluateAll(links=>links.map(a=>a.dataset.page)),['courses','live','journey']);
 await page.locator('[data-page=journey]').click();await page.locator('#dashboard-page-journey').waitFor({state:'visible'});
 assert.equal(await page.locator('#dashboard-page-courses').isVisible(),false);
 assert.match(await page.locator('#dashboard-dimension-description').innerText(),/No completed activities/);
 assert.equal(await page.locator('#dashboard-featured-badges a').count(),3);
 await page.screenshot({path:path.join(output,'journey-desktop.png'),fullPage:true});
 // Profile persistence and account isolation.
 await page.locator('.dashboard-person a').click();
 await page.locator('#dashboard-profile-name').fill('<Faye & Studio>');
 await page.locator('#dashboard-profile-goal').fill('Bring my own characters to life.');
 await page.locator('input[name=avatar][value=fox]').check({force:true});
 await page.locator('#dashboard-profile-form button[type=submit]').click();
 assert.match(await page.locator('#dashboard-profile-status').innerText(),/Saved/);
 await page.reload();await page.locator('#dashboard-page-profile').waitFor({state:'visible'});
 assert.equal(await page.locator('#dashboard-profile-name').inputValue(),'<Faye & Studio>');
 assert.equal(await page.locator('#dashboard-name').innerText(),'<Faye & Studio>');
 assert.equal(await page.locator('#dashboard-name img').count(),0);
 await page.locator('[data-page=courses]').click();
 await page.locator('#resume-card').waitFor({state:'visible'});
 assert.equal(await page.locator('#dashboard-page-journey').isVisible(),false);
 await page.screenshot({path:path.join(output,'courses-desktop.png'),fullPage:true});
 await page.locator('[data-page=journey]').click();
 await page.locator('#dashboard-featured-badges a').first().click();
 await page.locator('#drawing-screen').waitFor({state:'visible'});
 assert.equal(await page.locator('[data-page=courses]').getAttribute('aria-current'),'page');
 await page.reload();await page.locator('#drawing-screen').waitFor({state:'visible'});
 await page.locator('[data-page=journey]').click();
 await page.locator('[data-tab=badges]').click();
 assert.equal(await page.locator('#studio-badge-grid a[href="lessons/still-life/"]').count(),1);
 assert.equal(await page.locator('#studio-badge-grid a[href="fashion-design/"]').count(),1);
 await page.locator('[data-tab=studio]').click();await page.locator('#dashboard-journey-studio').waitFor({state:'visible'});assert.equal(await page.locator('#dashboard-journey-studio').isVisible(),true);
 await page.locator('[data-tab=feedback]').click();await page.locator('#dashboard-journey-feedback').waitFor({state:'visible'});assert.equal(await page.locator('#studio-progress-value').isVisible(),true);
 await page.locator('[data-tab=story]').click();assert.match(await page.locator('#dashboard-timeline').innerText(),/first completed lesson/);
 await page.locator('[data-page=live]').click();await page.locator('#dashboard-live-empty').waitFor({state:'visible'});
 assert.equal(await page.locator('#live-class-section').isVisible(),false);
 await page.locator('[data-page=lfc]').click();assert.match(await page.locator('#dashboard-page-lfc').innerText(),/not yet connected/);
 await page.locator('[data-page=events]').click();await page.locator('#dashboard-page-events').waitFor({state:'visible'});assert.equal(await page.locator('#dashboard-page-events').isVisible(),true);
 await page.goBack();await page.locator('#dashboard-page-lfc').waitFor({state:'visible'});
 // Existing course guard is still called from Resume.
 await page.locator('[data-page=courses]').click();
 await page.evaluate(()=>{const p=JSON.parse(sessionStorage.getItem('fei_user_profile'));p.studentCode=null;p.supabaseUserId='dashboard-test-auth';sessionStorage.setItem('fei_user_profile',JSON.stringify(p));});
 await page.reload();await page.locator('#resume-card').waitFor({state:'visible'});
 await page.evaluate(()=>{window.FEIAccess.canOpenLesson=async()=>({allowed:false});});
 await page.locator('#resume-btn').click();await page.locator('#paywall-modal').waitFor({state:'visible'});
 await page.locator('#paywall-modal .paywall-dismiss').click();
 // All-complete, live enrolment, identity switch and signal deduplication.
 await page.evaluate(()=>{const p=JSON.parse(sessionStorage.getItem('fei_user_profile'));p.id='DASHBOARD-TEST-OTHER';delete p.supabaseUserId;p.studentCode='DASHBOARD-TEST-OTHER';p.name='Another student';p.isLiveClass=true;p.completedLessons=window.FOUNDATION_A_PATH.map(l=>l.id);sessionStorage.setItem('fei_user_profile',JSON.stringify(p));});
 await page.goto(base+'#dashboard/journey');await page.reload();await page.locator('#dashboard-page-journey').waitFor({state:'visible'});
 assert.equal(await page.locator('#dashboard-name').innerText(),'Another student');
 assert.equal(await page.locator('#dashboard-avatar').innerText(),'🐰');
 assert.match(await page.locator('#dashboard-dimension-description').innerText(),/11 completed activities/);
 assert.match(await page.locator('#dashboard-featured-badges').innerText(),/Earned/);
 const activity=await page.evaluate(()=>window.FEIStudentDashboard.learningActivity({completedLessons:['cube','cube','unknown','art-history-western-1','lfc054']},['cube']).map(x=>({id:x.id,count:x.count,value:x.value})));
 assert.deepEqual(activity.map(x=>x.count),[1,1,1,0]);assert.equal(activity[3].value,null);
 await page.locator('[data-page=live]').click();await page.locator('#live-class-section').waitFor({state:'visible'});
 assert.equal(await page.locator('#dashboard-live-empty').isVisible(),false);
 await page.screenshot({path:path.join(output,'live-desktop.png'),fullPage:true});
 // Every section at mobile/tablet widths must fit without horizontal document overflow.
 for(const width of [320,390,768,1024]){
   await page.setViewportSize({width,height:900});
   for(const section of ['journey','journey/studio','journey/feedback','journey/badges','journey/story','courses','live','lfc','events','profile']){
     await page.evaluate(hash=>{location.hash=hash},'#dashboard/'+section);
     await page.waitForFunction(hash=>location.hash===hash,'#dashboard/'+section);
     await page.waitForTimeout(50);
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
     assert.equal(overflow,false,`Overflow at ${width}px ${section}`);
   }
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'#dashboard/journey');await page.reload();await page.locator('#dashboard-page-journey').waitFor({state:'visible'});
 await page.screenshot({path:path.join(output,'journey-mobile.png'),fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS: login shell, navigation/back/reload, avatar/profile persistence and isolation, badges, progress, course gate, live states, activity rules, and 40 responsive checks.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
