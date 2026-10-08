const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const source=fs.readFileSync('core/onboarding.js','utf8');
async function test(){
  for(const user of [null,{}, {id:'u',studentCode:'CODE'}, {id:'u',is_anonymous:true}]){
    const c={window:{},sessionStorage:{getItem:()=>null}};vm.createContext(c);vm.runInContext(source,c);
    assert.equal(await c.window.FEIOnboarding.open(user),null);
  }
  const c={window:{},sessionStorage:{getItem:()=>JSON.stringify({studentCode:'CODE'})}};vm.createContext(c);vm.runInContext(source,c);
  assert.equal(await c.window.FEIOnboarding.open({id:'google-account'}),null);
  const start=html.indexOf('  function hasStudentCodeSession()');
  const end=html.indexOf('  // ═',html.indexOf('  async function onAuthSuccess',start));
  const auth=html.slice(start,end);
  for(const scenario of [{studentCode:'CODE',sessionId:'u'}, {studentCode:null,sessionId:null},{studentCode:null,sessionId:'someone-else'}]){
    let calls=0;
    const context={userProfile:scenario.studentCode?{studentCode:scenario.studentCode}:null,PROFILE_KEY:'profile',sessionStorage:{getItem:()=>null},window:{FEIAuth:{getSession:async()=>({user:{id:scenario.sessionId}})}},clearAuthLoadingTimer:()=>{calls++;throw Error('Must not proceed');}};
    vm.createContext(context);vm.runInContext(auth,context);await context.onAuthSuccess({id:'u'});assert.equal(calls,0);
  }
  assert.ok(auth.indexOf('showHome();')<auth.indexOf('FEIOnboarding.open(user)'));
  for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())new vm.Script(m[1]);
  console.log('PASS: signed-out and anonymous bypass; Student Code isolation; session mismatch rejection; authenticated home before onboarding; inline JS syntax.');
}
test().catch(e=>{console.error(e);process.exitCode=1;});
