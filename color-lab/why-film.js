/* Color Practice · "Why Color?" film.
   mountWhyFilm(containerEl, audioEl|null, {cues, images, onCue, onEnd, music, musicVolume})
   - One scene per spoken line. Scene timing comes from `cues` ([{start,end,text}] — e.g. the
     captions.json built from the voice's .srt); without cues it uses an estimated reading pace,
     so the film can be previewed before the voice exists.
   - Beats inside a scene are fractions of that line's duration, so they stay in place when the
     real voice is a little faster or slower.
   - Background music is generated with Web Audio (no audio file). If the voice cannot play,
     the film keeps moving on a timer.
   - Pollock and Rothko scenes are original animations about their ideas, not their paintings
     (their works are still in copyright). Mondrian and Kandinsky use public-domain images. */
(function(){
  const LINES=[ // [scene, spoken line, beats as fractions of that line's duration]
    ['why','Why do we study color?',{k:[0,0]}],
    ['subject','Because color is not simply something we add after we finish a drawing.',{b1:0,b2:.55}],
    ['equal','Color is a visual language of its own, and learning color can be just as important as learning drawing or sketching.',{k:[0,.5]}],
    ['life','Artists have spent their entire lives exploring what color can do.',{b1:0,k:[.15,.55]}],
    ['mondrian','Mondrian used simple primary colors to create images that feel bold, balanced, and surprisingly expressive.',{k:[0,.06,.18,.26,.34,.42,.5,.62]}],
    ['simple','His paintings later influenced everything from graphic design to fashion.',{k:[0,.45,.6,.8]}],
    ['kandinsky','Kandinsky explored how colors could create movement, energy, and emotion.',{b2:.5,b3:.45,k:[0,.08,.5,.68,.85]}],
    ['pollock','Pollock showed us that color, gesture, and rhythm could become the artwork itself.',{k:[0,.5,.7]}],
    ['rothko','And Rothko created large fields of color that can make us feel calm, tension, depth, or even something difficult to put into words.',{k:[0,.15,.05,.1,.42,.52,.6,.72]}],
    ['outline','Color can create shape without outlines.',{b1:0,b2:.45,k:[.6]}],
    ['elements','It can create space, movement, mood, and meaning.',{k:[.25,.45,.65,.85]}],
    ['speak','Even when we remove the lines, color can still speak.',{b1:.2,b2:.55,k:[.75]}],
    ['balance','That is why we study color:',{b1:.3}],
    ['begin','not just to make art colorful, but to learn a whole new visual language.',{b1:0,k:[.5,1.15]}]];
  // Measured from the ElevenLabs voice (Dan): start/end of each line, in seconds.
  const VOICE_CUES=[[0,1.27],[2.48,6.43],[7.67,15.18],[16.52,22.0],[23.14,30.55],[31.62,36.28],[37.46,41.88],[42.91,48.22],[49.43,59.09],[59.59,62.09],[62.68,66.23],[66.99,70.3],[71.06,72.33],[72.89,77.56]];
  const TAIL=4.5; // music carries the last scene a moment after the voice ends

  function estimateCues(){let t=0.6;return LINES.map(([,text])=>{const d=text.split(/\s+/).length/2.55+0.25;const c={start:+t.toFixed(2),end:+(t+d).toFixed(2),text};t+=d+0.55;return c})}

  const ph=(name)=>`<div class="ph">${name}<br>public-domain image</div>`;
  const art=(src,alt,name)=>src?`<img src="${src}" alt="${alt}">`:ph(name);
  function html(img){return `
  <div class="wf-scene s-title" data-s="title"><div class="t"><div class="wf-eyebrow">Color Practice · Course introduction</div><div class="wf-big">Why do we study color?</div></div>
    <div class="dots"><i style="--c:#d8392f;left:0;top:0"></i><i style="--c:#f1c232;left:9cqw;top:6cqw"></i><i style="--c:#2c5aa8;left:3cqw;top:12cqw"></i></div></div>
  <div class="wf-scene s-title s-why" data-s="why"><div class="t"><div class="wf-eyebrow wf-k">Color Practice · Course introduction</div><div class="wf-big wf-k">Why do we study color?</div></div>
    <div class="dots"><i style="--c:#d8392f;left:0;top:0"></i><i style="--c:#f1c232;left:9cqw;top:6cqw"></i><i style="--c:#2c5aa8;left:3cqw;top:12cqw"></i></div></div>
  <div class="wf-scene s-subject" data-s="subject">
    <div class="apple"><div class="fill"></div><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 30C38 20 18 24 16 46s14 44 34 42c20 2 36-20 34-42S62 20 50 30Z"/><path d="M50 30c0-8 3-14 9-18"/><path d="M53 22c6-6 14-6 18-3-5 5-12 6-18 3Z"/></svg></div>
    <div class="steps"><span>1 · DRAW</span><span>2 · ADD COLOR?</span></div></div>
  <div class="wf-scene s-equal" data-s="equal"><div class="head wf-k"><div class="wf-eyebrow">Color is</div><div class="wf-big">a visual language of its own</div></div>
    <div class="pair wf-k"><i>DRAWING</i><b>=</b><i>COLOR</i></div></div>
  <div class="wf-scene s-life" data-s="life"><div class="years"><span>1700s</span><span>1800s</span><span>1900s</span><span>TODAY</span></div>
    <div class="wheel">${['#f2d43c','#f5b335','#ef8a35','#e55a35','#d83c3f','#b23d6b','#7a4a9c','#4e57b0','#3a74c4','#2f9a9c','#4fae5c','#a9c843'].map((c,n)=>`<i style="--c:${c};--n:${n}"></i>`).join('')}</div>
    <div class="tag l wf-k">A whole lifetime</div><div class="tag r wf-k">What can color do?</div></div>
  <div class="wf-scene s-mondrian" data-s="mondrian"><div class="frame wf-k">${art(img.mondrian,'Piet Mondrian, Composition II in Red, Blue, and Yellow, 1930','Piet Mondrian · 1930')}</div>
    <div class="plate wf-k"><b>Piet Mondrian</b><span>1872–1944 · Netherlands</span><small>Composition II in Red, Blue, and Yellow, 1930. Kunsthaus Zürich. Public domain.</small></div>
    <div class="chips"><span class="wf-k"><i style="--c:#d8392f"></i>RED</span><span class="wf-k"><i style="--c:#f1c232"></i>YELLOW</span><span class="wf-k"><i style="--c:#2c5aa8"></i>BLUE</span><span class="wf-k"><i style="--c:#1f1d22"></i>BLACK LINES</span><span class="wf-k"><i style="--c:#fbfaf6"></i>WHITE SPACE</span></div>
    <div class="triad wf-k">bold · balanced · expressive</div></div>
  <div class="wf-scene s-simple" data-s="simple"><div class="head wf-k"><div class="wf-eyebrow">From painting to</div><div class="wf-big">graphic design and <span>fashion</span></div></div>
    <div class="goods"><div class="good poster wf-k"><div class="pat"><i class="r"></i><i></i><i></i><i class="b"></i><i class="y"></i><i></i></div>POSTER</div>
      <div class="good scarf wf-k"><div class="pat"><i></i><i class="b"></i><i class="r"></i><i></i><i></i><i class="y"></i><i></i><i></i></div>SCARF</div>
      <div class="good tote wf-k"><div class="pat"><i class="r"></i><i></i><i></i><i class="y"></i><i class="b"></i><i></i></div>BAG</div></div></div>
  <div class="wf-scene s-kandinsky" data-s="kandinsky"><div class="frame wf-k">${art(img.kandinsky,'Wassily Kandinsky, Several Circles, 1926','Wassily Kandinsky · 1926')}</div>
    <div class="plate wf-k"><b>Wassily Kandinsky</b><span>1866–1944 · Russia, Germany, France</span><small>Several Circles, 1926. Solomon R. Guggenheim Museum, New York. Public domain.</small></div>
    <div class="feel"><span class="wf-k"><i style="--c:#3a74c4"></i>MOVEMENT</span><span class="wf-k"><i style="--c:#ef8a35"></i>ENERGY</span><span class="wf-k"><i style="--c:#b23d6b"></i>EMOTION</span></div>
    <svg class="music" viewBox="0 0 200 40" aria-hidden="true"><path d="M2 20C20 2 30 38 48 20S76 4 94 20s28 14 46 0 28-14 58 0" stroke="#7a4a9c"/><path d="M2 26C24 14 34 34 54 26s30-10 50 0 30 8 50-2 30-6 44 0" stroke="#ef8a35"/></svg></div>
  <div class="wf-scene s-pollock" data-s="pollock"><canvas width="1120" height="880" aria-hidden="true"></canvas>
    <div class="plate wf-k"><b>Jackson Pollock</b><span>1912–1956 · United States</span></div>
    <div class="wf-note wf-k">Color, gesture and rhythm became <em>the artwork.</em></div>
    <div class="orig wf-k">Animation inspired by his pouring method, not one of his paintings. Look him up in a museum collection to see the real thing.</div></div>
  <div class="wf-scene s-rothko" data-s="rothko"><div class="field wf-k"><i class="a"></i><i class="b"></i></div>
    <div class="viewer wf-k"><svg viewBox="0 0 20 64" aria-hidden="true"><circle cx="10" cy="7" r="5" fill="#3a3440"/><path d="M4 16h12l2 24h-4l-1 24H7L6 40H2Z" fill="#3a3440"/></svg></div>
    <div class="plate wf-k"><b>Mark Rothko</b><span>1903–1970 · United States</span></div>
    <div class="orig wf-k">Original animation about color fields, not one of his paintings.</div>
    <div class="moods"><span class="wf-k">calm</span><span class="wf-k">tension</span><span class="wf-k">depth</span><span class="wf-k">something without words…</span></div></div>
  <div class="wf-scene s-outline" data-s="outline"><div class="still"><svg viewBox="0 0 230 200" aria-hidden="true">
      <rect class="shape" style="--f:#e9dcc4" x="0" y="150" width="230" height="50" fill="#fff"/>
      <path class="shape" style="--f:#3f7f74" d="M60 40h22v26c14 8 20 22 20 40v44H40v-44c0-18 6-32 20-40Z" fill="#fff"/>
      <circle class="shape" style="--f:#e25b3c" cx="140" cy="128" r="24" fill="#fff"/><circle class="shape" style="--f:#f1c232" cx="180" cy="134" r="18" fill="#fff"/>
      <g class="lines"><path d="M0 150h230"/><path d="M60 40h22v26c14 8 20 22 20 40v44H40v-44c0-18 6-32 20-40Z"/><ellipse cx="140" cy="128" rx="24" ry="24"/><ellipse cx="180" cy="134" rx="18" ry="18"/></g></svg></div>
    <div class="lbl wf-k">NO OUTLINES · <b>STILL A SHAPE</b></div></div>
  <div class="wf-scene s-elements" data-s="elements"><svg width="0" height="0" style="position:absolute"><defs><linearGradient id="wfLineGrad"><stop offset="0" stop-color="#d8392f"/><stop offset=".5" stop-color="#f1c232"/><stop offset="1" stop-color="#2c5aa8"/></linearGradient></defs></svg>
    <div class="trio quad"><figure class="space wf-k"><div class="box"><i class="sp a"></i><i class="sp b"></i><i class="sp c"></i></div><figcaption>SPACE</figcaption></figure>
      <figure class="line wf-k"><div class="box"><svg viewBox="0 0 100 100"><path d="M12 70C30 20 46 84 62 42S84 30 90 24"/></svg></div><figcaption>MOVEMENT</figcaption></figure>
      <figure class="feeling wf-k"><div class="box"><i class="glow"></i></div><figcaption>MOOD</figcaption></figure>
      <figure class="meaning wf-k"><div class="box"><svg viewBox="0 0 100 100"><path d="M50 78C20 58 14 40 22 30s22-8 28 4c6-12 20-14 28-4s2 28-28 48Z"/></svg></div><figcaption>MEANING</figcaption></figure></div></div>
  <div class="wf-scene s-language s-speak" data-s="speak"><svg class="scribble" viewBox="0 0 300 60" aria-hidden="true"><path d="M10 40c30-30 50 20 80-6s40 18 70-4 50 20 80-6 30 10 50 0"/></svg>
    <div class="word">${[['C','#d8392f'],['O','#ef8a35'],['L','#f1c232'],['O','#3a74c4'],['R','#7a4a9c']].map(([l,c],n)=>`<span style="--c:${c};--n:${n}">${l}</span>`).join('')}</div>
    <div class="sub wf-k"><div class="wf-eyebrow">can still speak</div></div></div>
  <div class="wf-scene s-balance" data-s="balance"><div class="scale"><div class="post"></div><div class="beam"><div class="pan l">DRAWING</div><div class="pan r">COLOR</div></div></div></div>
  <div class="wf-scene s-begin" data-s="begin"><i class="prim" style="--c:#d8392f;left:24cqw"></i><i class="prim" style="--c:#f1c232;left:43.5cqw"></i><i class="prim" style="--c:#2c5aa8;left:63cqw"></i>
    <div class="vl wf-k"><div class="wf-big">A whole new visual language</div></div>
    <div class="next wf-k"><div class="wf-eyebrow">Next · Lesson 01 · Primary Colors</div></div></div>
  <p class="wf-cap" aria-live="off"></p><p class="wf-msg" role="status" hidden></p>
  <button class="wf-big-btn" type="button"><b>▶</b><span>Watch the introduction</span></button>
  <div class="wf-bar"><button class="wf-play" type="button">▶ Play</button><div class="wf-track" role="slider" aria-label="Film progress" tabindex="0"><i></i></div><span class="wf-time">0:00</span><button class="wf-music" type="button" aria-pressed="true">♪ Music</button><button class="wf-cc" type="button" aria-pressed="true">CC</button></div>`}

  /* Pollock scene: original poured-line animation, drawn progressively and deterministic */
  function pourLines(){let s=11;const r=()=>(s=(s*16807)%2147483647)/2147483647;const out=[];const cols=['#1f1d22','#1f1d22','#fbf7ee','#c9a24a','#3f7f74','#b8402f','#6d6a72'];
    for(let i=0;i<46;i++){const pts=[];let x=r()*1120,y=r()*880,a=r()*Math.PI*2;for(let k=0;k<28;k++){a+=(r()-.5)*1.4;x+=Math.cos(a)*(18+r()*30);y+=Math.sin(a)*(18+r()*30);pts.push([x,y])}
      out.push({c:cols[i%cols.length],w:i%6===0?9:2+r()*4,pts,drops:Array.from({length:4},()=>[r()*1120,r()*880,1+r()*4])})}
    return out}
  const POUR=pourLines();
  function drawPour(cv,p){const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);c.lineCap='round';c.lineJoin='round';
    const n=POUR.length*Math.min(1,p);POUR.forEach((l,i)=>{if(i>n)return;const part=Math.min(1,n-i),m=Math.max(2,Math.floor(l.pts.length*part));c.strokeStyle=l.c;c.lineWidth=l.w;c.globalAlpha=.9;c.beginPath();c.moveTo(l.pts[0][0],l.pts[0][1]);
      for(let k=1;k<m-1;k++){const [x1,y1]=l.pts[k],[x2,y2]=l.pts[k+1];c.quadraticCurveTo(x1,y1,(x1+x2)/2,(y1+y2)/2)}c.stroke();
      if(part>=1){c.fillStyle=l.c;l.drops.forEach(([x,y,r])=>{c.beginPath();c.arc(x,y,r,0,7);c.fill()})}});c.globalAlpha=1}

  /* Music: composed in code, reflective-but-bright, ducked under each line; rendered in idle slices */
  const MUSIC_SR=22050;
  function composeMusic(END,CUES,changes,done){
    const SR=MUSIC_SR,N=Math.ceil(SR*END),out=new Float32Array(N),BEAT=60/96,BAR=4*BEAT,TAU=Math.PI*2,ev=[];
    const mid=m=>440*Math.pow(2,(m-69)/12),add=(t,len,gain,fn)=>ev.push([t,len,gain,fn]);
    const pluck=(f,b)=>x=>Math.exp(-x*6)*(1-Math.exp(-x*400))*(Math.sin(TAU*f*x)+0.22*b*Math.sin(TAU*4*f*x)*Math.exp(-x*20)+0.14*Math.sin(TAU*2*f*x));
    const bass=f=>x=>Math.exp(-x*2.6)*(1-Math.exp(-x*200))*(Math.sin(TAU*f*x)+0.15*Math.sin(TAU*2*f*x));
    const bell=f=>x=>Math.exp(-x*3.6)*(1-Math.exp(-x*600))*(Math.sin(TAU*f*x)+0.3*Math.sin(TAU*2.76*f*x)*Math.exp(-x*8));
    const pad=(fs,d)=>x=>Math.min(1,x/0.7)*Math.min(1,Math.max(0,(d-x)/0.8))*fs.reduce((s,f)=>s+Math.sin(TAU*f*x)+0.3*Math.sin(TAU*2*f*x+0.5),0)/fs.length;
    // F – C – Dm – Bb  (I–V–vi–IV in F major)
    const CH=[[53,[65,69,72,77]],[48,[64,67,72,76]],[50,[62,65,69,74]],[46,[62,65,70,74]]],PAT=[0,2,1,2,3,2,1,2];
    for(let b=0;b*BAR<END-2;b++){const t0=b*BAR,[root,tones]=CH[b%4],full=b>=1;
      add(t0,BAR+0.4,0.06,pad(tones.slice(0,3).map(m=>mid(m-12)),BAR+0.4));
      if(full){add(t0,1.4,0.3,bass(mid(root-12)));add(t0+2*BEAT,1.4,0.2,bass(mid(root-12)))}
      PAT.forEach((ix,k)=>add(t0+k*BEAT/2,0.7,(full||k%2===0)?0.17:0.1,pluck(mid(tones[ix]),1)));
      if(b%2===1)[0,1.5,3].forEach((o,j)=>add(t0+o*BEAT,1.4,0.05,bell(mid(tones[[3,2,1][j]]+12))))}
    const endT=Math.max(0,END-3.2);[77,81,84,89].forEach((m,i)=>add(endT+i*0.13,2,0.14,bell(mid(m))));add(endT,3,0.08,pad([65,69,72].map(mid),3));add(endT,2.6,0.3,bass(mid(41)));
    changes.forEach(s=>[84,88,91].forEach((m,i)=>add(s-0.05+i*0.07,1.2,0.06,bell(mid(m)))));
    let k=0;
    const finish=()=>{const duck=new Float32Array(N),ramp=0.2*SR;
      CUES.forEach(({start:a,end:b})=>{const i0=Math.max(0,Math.floor(a*SR-ramp)),i1=Math.min(N,Math.floor(b*SR+ramp));for(let i=i0;i<i1;i++){const e=Math.min(1,(i-(a*SR-ramp))/ramp,((b*SR+ramp)-i)/ramp);if(e>duck[i])duck[i]=e}});
      let sum=0,cnt=0;for(let i=0;i<N;i++){const s=i/SR;out[i]*=(1-0.55*duck[i])*Math.min(1,s/1.4)*Math.max(0,Math.min(1,(END-s)/2));if(duck[i]<0.1&&s<END-3){sum+=out[i]*out[i];cnt++}}
      const g=Math.pow(10,-34/20)/Math.sqrt(sum/cnt||1);for(let i=0;i<N;i++)out[i]*=g;done(out)};
    const step=()=>{const stop=performance.now()+12;while(k<ev.length&&performance.now()<stop){const [t,len,gain,fn]=ev[k++],i0=Math.floor(t*SR),n=Math.min(Math.floor(len*SR),N-i0);for(let s=0;s<n;s++)out[i0+s]+=gain*fn(s/SR)}
      if(k<ev.length)setTimeout(step,0);else finish()};
    setTimeout(step,0);
  }

  const fmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  window.mountWhyFilm=function(root,audio,opts={}){
    const CUES=(opts.cues&&opts.cues.length===LINES.length)?opts.cues:(opts.estimate?estimateCues():VOICE_CUES.map(([s,e],i)=>({start:s,end:e,text:LINES[i][1]})));
    const VOICE_END=CUES[CUES.length-1].end,END=+(VOICE_END+TAIL).toFixed(2);
    // scene i is visible from its line's start until the next line's start
    const SC=LINES.map(([id,,b],i)=>({id,start:i?CUES[i].start-0.25:0,a:CUES[i].start,d:CUES[i].end-CUES[i].start,b}));
    root.classList.add('why-film');root.innerHTML=html(opts.images||{});
    const q=s=>root.querySelector(s),cap=q('.wf-cap'),fill=q('.wf-track i'),time=q('.wf-time'),play=q('.wf-play'),msg=q('.wf-msg');
    const scenes=Object.fromEntries([...root.querySelectorAll('.wf-scene')].map(el=>[el.dataset.s,el]));
    const pourCv=q('.s-pollock canvas');let pourP=-1;
    let lastId='',raf=0,started=false;
    const hasVoice=!!audio;let voiceOK=hasVoice,timer=!hasVoice,running=false,base=0,t0=0,watchdog=0;
    const now=()=>timer?(running?Math.min(END,base+(performance.now()-t0)/1000):base):audio.currentTime;
    const isPlaying=()=>timer?running:!audio.paused;
    const startTimer=at=>{timer=true;base=at;t0=performance.now();running=true};

    let actx=null,mbuf=null,msrc=null,mgain=null,musicOn=opts.music!==false,mdata=null,mbusy=false;const mwait=[];
    const prepMusic=cb=>{if(mdata)return cb&&cb(mdata);cb&&mwait.push(cb);if(mbusy)return;mbusy=true;composeMusic(END,CUES,SC.slice(1).map(s=>s.a),d=>{mdata=d;mbusy=false;opts.onMusic&&opts.onMusic(d,MUSIC_SR);mwait.splice(0).forEach(f=>f(d))})};
    const musicStop=()=>{if(msrc){try{msrc.stop()}catch(e){}msrc.disconnect();msrc=null}};
    const musicStart=at=>{musicStop();if(!musicOn||!actx||!mbuf||at>=END-0.2)return;msrc=actx.createBufferSource();msrc.buffer=mbuf;msrc.connect(mgain);msrc.start(0,at)};
    function musicInit(){if(!musicOn)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      if(!actx){actx=new AC();mgain=actx.createGain();mgain.gain.value=opts.musicVolume??0.8;mgain.connect(actx.destination)}
      if(actx.state==='suspended')actx.resume();
      if(!mbuf)prepMusic(d=>{if(mbuf)return;mbuf=actx.createBuffer(1,d.length,MUSIC_SR);mbuf.copyToChannel(d,0);if(isPlaying())musicStart(now())})}catch(e){actx=null}}
    if(musicOn)setTimeout(()=>prepMusic(),800);

    function render(t){
      let cur=null;if(started)for(const s of SC)if(t>=s.start)cur=s;
      const id=cur?cur.id:'title';
      if(id!==lastId){Object.entries(scenes).forEach(([k,el])=>el.classList.toggle('on',k===id));lastId=id;opts.onCue&&opts.onCue(id,t,started)}
      if(cur){const el=scenes[id],f=(t-cur.a)/cur.d;
        ['b1','b2','b3'].forEach(b=>el.classList.toggle(b,cur.b[b]!==undefined&&f>=cur.b[b]));
        const ks=el.querySelectorAll('.wf-k'),fr=cur.b.k||[];ks.forEach((k,i)=>k.classList.toggle('in',f>=(fr[Math.min(i,fr.length-1)]??0)));
        if(id==='pollock'){const p=Math.max(0,Math.min(1,f*1.15));if(Math.abs(p-pourP)>0.004){pourP=p;drawPour(pourCv,p)}}}
      else{const el=scenes.title;el.querySelectorAll('.wf-k').forEach(k=>k.classList.add('in'))}
      const line=started?CUES.find(c=>t>=c.start&&t<c.end+0.15):null;
      cap.textContent=line?line.text:'';cap.classList.toggle('show',!!line);
      const c2=started?now():0;fill.style.width=Math.min(c2/END,1)*100+'%';time.textContent=fmt(c2)+' / '+fmt(END);
    }
    const setBtn=()=>{play.textContent=isPlaying()?'❚❚ Pause':(started&&now()>=END-0.1?'↺ Replay':'▶ Play')};
    function loop(){cancelAnimationFrame(raf);
      if(!root.isConnected){pause();return}
      const t=now();render(t);
      if(timer&&running&&t>=END){running=false;base=END;musicStop();setBtn();opts.onEnd&&opts.onEnd();return}
      if(isPlaying())raf=requestAnimationFrame(loop)}
    const noVoice=why=>{if(!voiceOK)return;voiceOK=false;const at=Math.min(audio.currentTime||0,VOICE_END);try{audio.pause()}catch(e){}if(!timer){startTimer(at);musicStart(at)}msg.textContent=why;msg.hidden=false;setTimeout(()=>{msg.hidden=true},5000);setBtn();loop()};
    function playFrom(at){started=true;root.classList.add('playing');musicInit();if(at>=END-0.1)at=0;
      if(voiceOK&&at<VOICE_END){timer=false;running=false;if(Math.abs(audio.currentTime-at)>0.05)audio.currentTime=at;
        const p=audio.play();if(p&&p.catch)p.catch(()=>noVoice('Sound could not start here, so the voice is off for this play.'));
        clearTimeout(watchdog);watchdog=setTimeout(()=>{if(!timer&&voiceOK&&audio.paused===false&&audio.currentTime-at<0.2)noVoice('The voice is not loading on this device, so the film is playing without it.')},2000)}
      else{if(hasVoice&&!audio.paused)audio.pause();startTimer(at)}
      musicStart(at);setBtn();loop()}
    function pause(){const t=now();if(timer){base=t;running=false}else audio.pause();musicStop();setBtn();render(t)}
    const toggle=()=>isPlaying()?pause():playFrom(started?now():0);
    function seekTo(s){s=Math.max(0,Math.min(END,s));if(!started){started=true;root.classList.add('playing')}
      if(isPlaying())playFrom(s);else{if(voiceOK&&s<VOICE_END){timer=false;audio.currentTime=s}else{timer=true;base=s;running=false}render(s);setBtn()}}
    if(hasVoice){
      audio.addEventListener('ended',()=>{if(!timer&&started){startTimer(VOICE_END);setBtn();loop()}});
      audio.addEventListener('playing',()=>{if(!timer)loop()});
      audio.addEventListener('pause',()=>{if(!timer&&!audio.ended){musicStop();setBtn();render(audio.currentTime)}});
      audio.addEventListener('error',()=>{if(started)noVoice('The voice could not load, so the film is playing without it.');else voiceOK=false})}
    q('.wf-big-btn').onclick=toggle;play.onclick=toggle;
    const track=q('.wf-track');
    track.addEventListener('pointerdown',e=>{const r=track.getBoundingClientRect();seekTo((e.clientX-r.left)/r.width*END)});
    track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){seekTo(now()+(e.key==='ArrowRight'?3:-3));e.preventDefault()}});
    q('.wf-cc').onclick=e=>{const off=root.dataset.cc!=='off';root.dataset.cc=off?'off':'on';e.currentTarget.setAttribute('aria-pressed',String(!off))};
    const mb=q('.wf-music');mb.hidden=opts.music===false;
    mb.onclick=()=>{musicOn=!musicOn;mb.setAttribute('aria-pressed',String(musicOn));mb.textContent=musicOn?'♪ Music':'♪ Off';if(musicOn&&isPlaying()){musicInit();musicStart(now())}else musicStop()};
    render(0);
    return {toggle,pause,seekTo,isPlaying,now,END,CUES};
  };
  window.WHY_FILM_LINES=LINES.map(l=>l[1]); // the narration script, one sentence per line, for building the voice
})();
