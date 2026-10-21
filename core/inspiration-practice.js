/* Paper-first practice: a deadline clock, explicit state transitions, and
   identity-scoped browser storage. Never touches lesson progress or uploads. */
(() => {
  const PREFIX='feiInspiration.practice.v1:';
  function identity() {
    try { const p=JSON.parse(sessionStorage.getItem('fei_user_profile')||'{}'); return p.supabaseUserId||p.studentCode||p.learnerId||p.id||null; } catch { return null; }
  }
  function read() {
    const who=identity(); if(!who)return {};
    try {const data=JSON.parse(localStorage.getItem(PREFIX+encodeURIComponent(who))||'{}');return data&&typeof data==='object'&&!Array.isArray(data)?data:{};} catch {return {};}
  }
  function write(data) {
    const who=identity();if(!who)return false;
    try {localStorage.setItem(PREFIX+encodeURIComponent(who),JSON.stringify(data));return true;} catch {return false;}
  }
  class PracticeClock {
    constructor(seconds,onTick,onEnd,now=()=>performance.now()) {this.duration=seconds*1000;this.remaining=this.duration;this.onTick=onTick;this.onEnd=onEnd;this.now=now;this.running=false;this.handle=null;}
    start() {if(this.running||this.remaining<=0)return;this.running=true;this.deadline=this.now()+this.remaining;this.handle=setInterval(()=>this.tick(),100);this.tick();}
    tick() {if(!this.running)return;this.remaining=Math.max(0,this.deadline-this.now());this.onTick(this.remaining);if(this.remaining===0){this.stop();this.onEnd();}}
    stop() {clearInterval(this.handle);this.handle=null;this.running=false;}
    pause() {if(this.running){this.remaining=Math.max(0,this.deadline-this.now());this.stop();this.onTick(this.remaining);}return this.remaining;}
  }
  function load(id) {
    const value=read()[id];if(!value||typeof value!=='object')return null;
    if(!['ready','paused','complete','recall'].includes(value.phase)||![30,60,120].includes(value.duration))return null;
    if(typeof value.attemptId!=='string'||!/^[-a-zA-Z0-9]{1,80}$/.test(value.attemptId))return null;
    if(!Number.isFinite(value.remaining)||value.remaining<0||value.remaining>120000)return null;
    const refs=window.FEIInspirationContent.references;
    if(!['animals','flowers','objects'].includes(value.category))return null;
    if(value.reference!=='custom'&&!refs.some(r=>r.id===value.reference))return null;
    return {...value,reflection:typeof value.reflection==='string'?value.reflection.slice(0,500):''};
  }
  function save(id,value) {const data=read();data[id]=value;return write(data);}
  function forget(id) {const data=read();delete data[id];return write(data);}
  window.FEIInspirationPractice={identity,load,save,forget,PracticeClock};
})();
