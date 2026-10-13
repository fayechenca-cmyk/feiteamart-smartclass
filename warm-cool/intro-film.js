/* Warm & Cool · Step 1 teacher introduction film.
   mountIntroFilm(containerEl, audioEl, {onCue, onEnd, music, musicVolume})
   - The animation follows the teacher's voice (assets/audio/intro.mp3, 40.96 s); cue times were
     measured from the pauses between her sentences, so pause/replay/scrub stay in sync.
   - After the voice ends, a 9-second closing scene ("Today you will paint") runs on a timer.
   - Background music is generated with Web Audio at first play (no audio file); toggle with ♪ Music.
   - If the voice cannot play on a device, the film keeps moving on a timer instead of freezing. */
(function(){
  const SCENES=[ // [start, scene]
    [0,'primary'],[3.7,'analogous'],[7.2,'complement'],[11.5,'chain'],[18.8,'wheel'],[25.4,'question'],[30.2,'look'],[32.7,'world'],[41.2,'mission']];
  const BEATS=[ // [time, beat] — a beat stays on until the scene changes
    [0.1,'p1'],[1.6,'p2'],[4.2,'a1'],[7.5,'c1'],[9.0,'c2'],[11.9,'h1'],[13.1,'h2'],[16.0,'h3'],[17.3,'h4'],
    [19.5,'w1'],[22.5,'w2'],[26.2,'q1'],[28.5,'q2'],[30.6,'l1'],[33.2,'o1'],[34.1,'o2'],[35.85,'o3'],[38.3,'o4'],[41.5,'m1'],[47.6,'m2']];
  const MISSION_STEPS=[41.9,42.6,43.3,44.0,44.8,45.5,46.2,46.9]; // cool layers 1-4, then warm layers 1-4
  const END=50;
  const CAPS=[ // spoken lines, timed to the recording
    [0,3.3,'You already know how primary colors build new colors.'],
    [4.2,6.6,'You used analogous colors to build value,'],
    [7.46,10.9,'and complementary colors to create reflected light and shadow.'],
    [12.07,18.3,'Now we are going to use all of those ideas to explore color temperature.'],
    [19.48,21.95,'We often call blue and violet cool,'],
    [22.48,24.9,'and yellow, orange, and red warm.'],
    [26.22,27.65,'But is blue always cool?'],
    [28.49,29.75,'Is yellow always warm?'],
    [30.67,32.1,'Look at the colors around them.'],
    [33.18,37.9,'Light, nearby colors, and the whole environment'],
    [38.28,40.96,'can change how warm or cool a color feels.']];
  const sceneBeats={primary:['p1','p2'],analogous:['a1'],complement:['c1','c2'],chain:['h1','h2','h3','h4'],wheel:['w1','w2'],question:['q1','q2'],look:['l1'],world:['o1','o2','o3','o4'],mission:['m1','m2']};
  // same portrait drawing as the painting steps in app.js, so students preview exactly what they will paint
  function drawPortrait(canvas,world,phase){
    const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.max(300,r.width),h=Math.max(390,r.height);canvas.width=w*d;canvas.height=h*d;const c=canvas.getContext('2d');c.setTransform(d,0,0,d,0,0);const cool=world==='cool';c.fillStyle=phase>=1?(cool?'#607fb8':'#e67950'):'#f8f5f1';c.fillRect(0,0,w,h);
    c.fillStyle=phase>=2?(cool?'#486ca8':'#359494'):'#eee9e5';c.beginPath();c.moveTo(w*.2,h*.83);c.quadraticCurveTo(w*.1,h*.38,w*.31,h*.2);c.quadraticCurveTo(w*.5,h*.03,w*.7,h*.2);c.quadraticCurveTo(w*.91,h*.4,w*.8,h*.84);c.closePath();c.fill();
    c.fillStyle=phase>=2?(cool?'#dbc9a0':'#d95f55'):'#fbf8f4';c.beginPath();c.ellipse(w*.5,h*.48,w*.22,h*.3,0,0,Math.PI*2);c.fill();
    if(phase>=3){const g=c.createLinearGradient(w*.32,0,w*.7,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,cool?'rgba(163,92,103,.42)':'rgba(70,90,151,.42)');c.fillStyle=g;c.beginPath();c.ellipse(w*.5,h*.48,w*.22,h*.3,0,0,Math.PI*2);c.fill();c.fillStyle=cool?'#9c7081':'#79536f';c.beginPath();c.moveTo(w*.37,h*.67);c.lineTo(w*.29,h*.91);c.lineTo(w*.7,h*.91);c.lineTo(w*.62,h*.67);c.closePath();c.fill()}
    c.strokeStyle=phase>=4?(cool?'#304d85':'#67374d'):'#8b838a';c.lineWidth=phase>=4?4:2;c.lineCap='round';c.beginPath();c.moveTo(w*.34,h*.42);c.quadraticCurveTo(w*.4,h*.38,w*.45,h*.42);c.moveTo(w*.55,h*.42);c.quadraticCurveTo(w*.61,h*.38,w*.67,h*.42);c.moveTo(w*.5,h*.43);c.lineTo(w*.47,h*.57);c.moveTo(w*.42,h*.64);c.quadraticCurveTo(w*.5,h*.69,w*.59,h*.63);c.stroke();c.strokeStyle=phase>=4?(cool?'#d2e5ff':'#ffe5a7'):'#9a9298';c.lineWidth=phase>=4?7:2;for(let n=0;n<5;n++){c.beginPath();c.moveTo(w*(.32+n*.085),h*.19);c.lineTo(w*(.36+n*.07),h*.39);c.stroke()}c.strokeStyle='#716976';c.lineWidth=2;c.beginPath();c.ellipse(w*.5,h*.48,w*.22,h*.3,0,0,Math.PI*2);c.stroke()
  }

  const PATHS=['M120 20A100 100 0 0 0 120 220C82 196 75 48 120 20Z','M120 20C75 48 82 196 120 220C148 194 151 48 120 20Z','M120 20C151 48 148 194 120 220C172 196 180 49 120 20Z','M120 20C180 49 172 196 120 220C201 184 207 61 120 20Z','M120 20C207 61 201 184 120 220C222 163 222 78 120 20Z','M120 20C222 78 222 163 120 220A100 100 0 0 0 120 20Z'];
  // Lesson 03 sphere: Yellow + Violet pair, local color → deepest (same mix as complementary-colors/lesson.js)
  const MIX=Array.from({length:6},(_,i)=>`color-mix(in srgb, #f0ce43 ${100-i*12}%, #704e9d)`);
  const blob=(x,c,cls)=>`<i class="wc-blob ${cls}" style="left:${x}%;--c:${c}"></i>`;
  const HTML=`
  <div class="wc-scene s-primary"><div class="wc-tag">Primary<small>build new colors</small></div>
    ${blob(26,'#e2483f','p')}${blob(50,'#f2c832','p')}${blob(74,'#3f6fc4','p')}
    ${blob(38,'#ef8a35','m')}${blob(62,'#4fa25a','m')}${blob(86,'#7a4a9c','m')}
    <span class="plus" style="left:38%">+</span><span class="plus" style="left:62%">+</span></div>
  <div class="wc-scene s-analogous"><div class="wc-tag">Analogous<small>build value</small></div>
    <div class="row"><i style="background:#f3d64a"></i><i style="background:#f0b33f"></i><i style="background:#ec8a3d"></i><i style="background:#e05f3f"></i><i style="background:#c4454a"></i></div>
    <div class="value"><i style="background:#e9e8e6"></i><i style="background:#c9c6c3"></i><i style="background:#a29e9c"></i><i style="background:#77737a"></i><i style="background:#4c4851"></i></div>
    <div class="cap">LIGHT → DARK</div>
    <div class="cube"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8 92 28 50 48 8 28Z" fill="#f3d64a"/><path d="M8 28 50 48 50 94 8 72Z" fill="#ec8a3d"/><path d="M92 28 50 48 50 94 92 72Z" fill="#c4454a"/></svg></div></div>
  <div class="wc-scene s-complement"><div class="wc-tag">Complementary<small>reflected light and shadow</small></div>
    <div class="eq"><i style="--c:#ecc94f"></i><b>+</b><i style="--c:#7a4a9c"></i><b>→</b><i style="--c:#a08a7c"></i></div>
    <div class="comp-ball"><svg viewBox="0 0 240 240" aria-hidden="true">${PATHS.map((d,i)=>`<path d="${d}" style="--fill:${MIX[i]};--d:${i*0.22}s"/>`).join('')}</svg><i class="comp-reflection"></i><i class="comp-shadow"></i></div><div class="wc-note">REFLECTED VIOLET</div></div>
  <div class="wc-scene s-chain">
    <div class="chips"><span>PRIMARY<small>build color</small></span><span>ANALOGOUS<small>build value</small></span><span>COMPLEMENTARY<small>reflected color</small></span></div>
    <div class="new-chip">WARM + COOL</div>
    <div class="thermo"></div><div class="thermo-labels"><span>COOLER</span><span>COLOR TEMPERATURE</span><span>WARMER</span></div></div>
  <div class="wc-scene s-wheel"><div class="wheel"><div class="half l"></div><div class="half r"></div></div>
    <div class="wlabel cool">COOL<small>blue · violet</small></div><div class="wlabel warm">WARM<small>yellow · orange · red</small></div></div>
  <div class="wc-scene s-question">
    <div class="q one"><i style="--c:#3f6fc4"></i><b>Is blue always cool<em>?</em></b></div>
    <div class="q two"><i style="--c:#e9c54a"></i><b>Is yellow always warm<em>?</em></b></div></div>
  <div class="wc-scene s-look"><div class="ring">${['#3f6fc4','#ef8a35','#7a4a9c','#e2483f','#4fa25a','#f5b335','#2f9a9c','#c4454a'].map((c,i)=>`<i style="--c:${c};--a:${i*45}deg"></i>`).join('')}</div><div class="center"></div></div>
  <div class="wc-scene s-world">
    <div class="side c"><div class="glow"></div><div class="near"><i style="left:12%;--c:#7a6fb8"></i><i style="right:12%;--c:#4e7fc4"></i></div><div class="obj"></div><div class="lab">COOL WORLD<small>the yellow feels cooler</small></div></div>
    <div class="side w"><div class="glow"></div><div class="near"><i style="left:12%;--c:#e2483f"></i><i style="right:12%;--c:#f0a23e"></i></div><div class="obj"></div><div class="lab">WARM WORLD<small>the yellow feels warmer</small></div></div>
    <div class="same-tie"><span>SAME YELLOW PAINT</span></div></div>
  <div class="wc-scene s-mission"><div class="mission-head"><span>TODAY YOU WILL PAINT</span><b>Two characters, two worlds</b></div>
    <figure class="pf c"><canvas data-pf="cool" width="300" height="390"></canvas><figcaption>COOL WORLD</figcaption></figure>
    <figure class="pf w"><canvas data-pf="warm" width="300" height="390"></canvas><figcaption>WARM WORLD</figcaption></figure>
    <div class="mission-end">Paint layer by layer.<br>Then compare.</div></div>
  <p class="wc-cap" aria-live="off"></p>
  <p class="wc-msg" role="status" hidden></p>
  <button class="wc-big" type="button"><b>▶</b><span>Watch the introduction</span></button>
  <div class="wc-bar"><button class="wc-play" type="button">▶ Play</button><div class="wc-track" role="slider" aria-label="Introduction progress" tabindex="0"><i></i></div><span class="wc-time">0:00</span><button class="wc-music" type="button" aria-pressed="true">♪ Music</button><button class="wc-cc" type="button" aria-pressed="true">CC</button></div>`;

  const fmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  const VOICE_END=40.96; // length of assets/audio/intro.mp3; the closing scene runs on a timer after it

  /* ---------- Background music, composed in code (no audio file) ----------
     C major, 100 bpm, I–vi–IV–V; ducks under the teacher's lines; small sparkle on each scene change. */
  // Rendered in small slices during idle time so it never blocks the page or the play button.
  const MUSIC_SR=22050;let musicData=null,musicBusy=false;const musicWaiters=[];
  function composeMusic(done){
    if(musicData)return done(musicData);musicWaiters.push(done);if(musicBusy)return;musicBusy=true;
    const SR=MUSIC_SR,N=Math.ceil(SR*END),out=new Float32Array(N),BEAT=0.6,BAR=2.4,TAU=Math.PI*2,ev=[];
    const mid=m=>440*Math.pow(2,(m-69)/12);
    const add=(t,len,gain,fn)=>ev.push([t,len,gain,fn]);
    const pluck=(f,b)=>x=>Math.exp(-x*7)*(1-Math.exp(-x*400))*(Math.sin(TAU*f*x)+0.25*b*Math.sin(TAU*4*f*x)*Math.exp(-x*20)+0.12*Math.sin(TAU*2*f*x));
    const bass=f=>x=>Math.exp(-x*3.2)*(1-Math.exp(-x*200))*(Math.sin(TAU*f*x)+0.15*Math.sin(TAU*2*f*x));
    const glock=f=>x=>Math.exp(-x*4.5)*(1-Math.exp(-x*600))*(Math.sin(TAU*f*x)+0.3*Math.sin(TAU*2.76*f*x)*Math.exp(-x*9));
    const pad=(fs,d)=>x=>Math.min(1,x/0.5)*Math.min(1,Math.max(0,(d-x)/0.6))*fs.reduce((s,f)=>s+Math.sin(TAU*f*x)+0.3*Math.sin(TAU*2*f*x+0.5),0)/fs.length;
    let seed=3;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647-0.5;
    const shaker=()=>{let prev=0;return x=>{const n=rnd(),v=(n-prev)*Math.exp(-x*60);prev=n;return v*2}};
    const CH=[[60,[60,64,67,72]],[57,[57,60,64,69]],[53,[53,57,60,65]],[55,[55,59,62,67]]],PAT=[0,1,2,1,3,2,1,2],MISSION=41.2;
    for(let b=0;b*BAR<48;b++){
      const t0=b*BAR,[root,tones]=CH[b%4],full=b>=1,bright=t0>=MISSION-0.5;
      add(t0,BAR+0.3,0.05,pad(tones.slice(0,3).map(mid),BAR+0.3));
      if(full){add(t0,1.1,0.32,bass(mid(root-24)));add(t0+2*BEAT,1.1,0.22,bass(mid(root-24)))}
      PAT.forEach((ix,k)=>add(t0+k*BEAT/2,0.55,(full||k%2===0)?0.2:0.12,pluck(mid(tones[ix]+(bright&&k%2===0?12:0)),bright?1.3:1)));
      if(full)for(let k=0;k<4;k++)add(t0+k*BEAT+BEAT/2,0.08,0.035,shaker());
    }
    const endT=BAR*Math.floor(48/BAR);
    [72,76,79,84].forEach((m,i)=>add(endT+i*0.12,1.8,0.16,glock(mid(m))));
    add(endT,2.4,0.09,pad([60,64,67,72].map(mid),2.4));add(endT,2,0.35,bass(mid(36)));
    SCENES.slice(1).forEach(([s])=>[84,88,91].forEach((m,i)=>add(s-0.05+i*0.07,1.2,0.07,glock(mid(m)))));
    let k=0;
    const finish=()=>{ // duck under each spoken line, fade in/out, level about 10 dB under the voice
      const duck=new Float32Array(N),ramp=0.18*SR;
      CAPS.forEach(([a,b])=>{const i0=Math.max(0,Math.floor(a*SR-ramp)),i1=Math.min(N,Math.floor(b*SR+ramp));for(let i=i0;i<i1;i++){const e=Math.min(1,(i-(a*SR-ramp))/ramp,((b*SR+ramp)-i)/ramp);if(e>duck[i])duck[i]=e}});
      let sum=0,cnt=0;
      for(let i=0;i<N;i++){const s=i/SR;out[i]*=(1-0.55*duck[i])*Math.min(1,s/1.2)*Math.max(0,Math.min(1,(END-s)/1.5));if(duck[i]<0.1&&s<41){sum+=out[i]*out[i];cnt++}}
      const g=Math.pow(10,-34/20)/Math.sqrt(sum/cnt||1);for(let i=0;i<N;i++)out[i]*=g;
      musicData=out;musicBusy=false;musicWaiters.splice(0).forEach(fn=>fn(out));
    };
    const step=()=>{const stop=performance.now()+12;
      while(k<ev.length&&performance.now()<stop){const [t,len,gain,fn]=ev[k++],i0=Math.floor(t*SR),n=Math.min(Math.floor(len*SR),N-i0);for(let s=0;s<n;s++)out[i0+s]+=gain*fn(s/SR)}
      if(k<ev.length)setTimeout(step,0);else finish()};
    setTimeout(step,0);
  }

  window.mountIntroFilm=function(root,audio,opts={}){
    root.classList.add('wc-film');root.innerHTML=HTML;
    const q=s=>root.querySelector(s),cap=q('.wc-cap'),fill=q('.wc-track i'),time=q('.wc-time'),play=q('.wc-play'),msg=q('.wc-msg');
    let last="",lastStarted=false,raf=0,started=false,phases="";

    /* Clock. Voice mode: the teacher's audio drives the film (0 → 40.96 s).
       Timer mode: a silent timer drives it — used for the closing scene after the voice ends,
       and for the whole film if the voice cannot play on this device. */
    let voiceOK=true,timer=false,running=false,base=0,t0=0,watchdog=0;
    const now=()=>timer?(running?Math.min(END,base+(performance.now()-t0)/1000):base):audio.currentTime;
    const isPlaying=()=>timer?running:!audio.paused;
    const startTimer=at=>{timer=true;base=at;t0=performance.now();running=true};

    /* Music (Web Audio). Composed in the background shortly after the step opens. */
    let actx=null,mbuf=null,msrc=null,mgain=null,musicOn=opts.music!==false;
    const musicStop=()=>{if(msrc){try{msrc.stop()}catch(e){}msrc.disconnect();msrc=null}};
    const musicStart=at=>{musicStop();if(!musicOn||!actx||!mbuf||at>=END-0.2)return;msrc=actx.createBufferSource();msrc.buffer=mbuf;msrc.connect(mgain);msrc.start(0,at)};
    function musicInit(){ // must run inside the play tap so the browser allows sound
      if(!musicOn)return;
      try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
        if(!actx){actx=new AC();mgain=actx.createGain();mgain.gain.value=opts.musicVolume??0.8;mgain.connect(actx.destination)}
        if(actx.state==='suspended')actx.resume();
        if(!mbuf)composeMusic(data=>{if(mbuf)return;mbuf=actx.createBuffer(1,data.length,MUSIC_SR);mbuf.copyToChannel(data,0);if(isPlaying())musicStart(now())});
      }catch(e){actx=null}
    }
    if(musicOn)setTimeout(()=>composeMusic(()=>{}),800);

    function render(t){
      if(!started&&t===0)t=40.5; // before the first play, rest on a finished frame so the stage is never empty
      let scene=SCENES[0][1];for(const [s,n] of SCENES)if(t>=s)scene=n;
      const beats=BEATS.filter(([s,b])=>t>=s&&sceneBeats[scene].includes(b)).map(x=>x[1]).join(' ');
      const key=scene+'|'+beats;
      if(key!==last||started!==lastStarted){root.dataset.scene=scene;root.dataset.beat=beats;last=key;lastStarted=started;opts.onCue&&opts.onCue(scene,t,started)}
      if(scene==='mission'){const n=MISSION_STEPS.filter(s=>t>=s).length,c=Math.min(n,4),w=Math.max(0,n-4),k=c+'/'+w;
        if(k!==phases){phases=k;drawPortrait(q('[data-pf=cool]'),'cool',c);drawPortrait(q('[data-pf=warm]'),'warm',w)}}
      else phases='';
      const line=started?CAPS.find(([a,b])=>t>=a&&t<b):null;
      cap.textContent=line?line[2]:'';cap.classList.toggle('show',!!line);
      const cur=started?now():0;fill.style.width=Math.min(cur/END,1)*100+'%';time.textContent=fmt(cur)+' / '+fmt(END);
    }
    const setBtn=()=>{play.textContent=isPlaying()?'❚❚ Pause':(started&&now()>=END-0.1?'↺ Replay':'▶ Play')};
    function loop(){
      cancelAnimationFrame(raf);
      if(!root.isConnected){pause();return} // student left the step: stop voice and music
      const t=now();render(t);
      if(timer&&running&&t>=END){running=false;base=END;musicStop();setBtn();opts.onEnd&&opts.onEnd();return}
      if(isPlaying())raf=requestAnimationFrame(loop);
    }
    const noVoice=why=>{if(!voiceOK)return;voiceOK=false;const at=Math.min(audio.currentTime||0,VOICE_END);try{audio.pause()}catch(e){}if(!timer){startTimer(at);musicStart(at)}msg.textContent=why;msg.hidden=false;setTimeout(()=>{msg.hidden=true},5000);setBtn();loop()};
    function playFrom(at){
      started=true;root.classList.add('playing');musicInit();
      if(at>=END-0.1)at=0;
      if(voiceOK&&at<VOICE_END){
        timer=false;running=false;if(Math.abs(audio.currentTime-at)>0.05)audio.currentTime=at;
        const p=audio.play();if(p&&p.catch)p.catch(()=>noVoice('Sound could not start here, so the voice is off for this play.'));
        clearTimeout(watchdog);watchdog=setTimeout(()=>{if(!timer&&voiceOK&&audio.paused===false&&audio.currentTime-at<0.2)noVoice('The voice is not loading on this device, so the film is playing without it.')},2000);
      }else{if(!audio.paused)audio.pause();startTimer(at)}
      musicStart(at);setBtn();loop();
    }
    function pause(){const t=now();if(timer){base=t;running=false}else audio.pause();musicStop();setBtn();render(t)}
    const toggle=()=>isPlaying()?pause():playFrom(started?now():0);
    function seekTo(s){
      s=Math.max(0,Math.min(END,s));
      if(!started){started=true;root.classList.add('playing')}
      if(isPlaying())playFrom(s);
      else{if(voiceOK&&s<VOICE_END){timer=false;audio.currentTime=s}else{timer=true;base=s;running=false}render(s);setBtn()}
    }

    audio.addEventListener('ended',()=>{if(!timer&&started){startTimer(VOICE_END);setBtn();loop()}}); // hand off to the closing scene
    audio.addEventListener('playing',()=>{if(!timer)loop()});
    audio.addEventListener('pause',()=>{if(!timer&&!audio.ended){musicStop();setBtn();render(audio.currentTime)}});
    audio.addEventListener('error',()=>{if(started)noVoice('The voice could not load, so the film is playing without it.');else voiceOK=false});
    q('.wc-big').onclick=toggle;play.onclick=toggle;
    const track=q('.wc-track');
    track.addEventListener('pointerdown',e=>{const r=track.getBoundingClientRect();seekTo((e.clientX-r.left)/r.width*END)});
    track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){seekTo(now()+(e.key==='ArrowRight'?3:-3));e.preventDefault()}});
    q('.wc-cc').onclick=e=>{const off=root.dataset.cc!=='off';root.dataset.cc=off?'off':'on';e.currentTarget.setAttribute('aria-pressed',String(!off))};
    const mb=q('.wc-music');mb.hidden=opts.music===false;
    mb.onclick=()=>{musicOn=!musicOn;mb.setAttribute('aria-pressed',String(musicOn));mb.textContent=musicOn?'♪ Music':'♪ Off';if(musicOn&&isPlaying()){musicInit();musicStart(now())}else musicStop()};
    render(0);
    return {toggle,pause,seekTo,isPlaying,now};
  };
})();
