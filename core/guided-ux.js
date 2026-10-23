/* Shared visual guidance: accurate teacher diagrams, timed cues, and dot rewards. */
window.GuidedUX=(()=>{
 const root='../../../',tools='https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/6a173bd23acbf487b452a628_49dc1cbc-f5e2-4aa3-a113-5d89a228a165.png';
 let current=null,spoken=null,last=-1;
 const boxes={pencils:[980,100,315,800],tissue:[215,560,510,290],eraser:[585,130,285,135],tape:[205,160,240,245],paper:[90,65,1265,960]};
 const esc=x=>String(x||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function dots(label){return '<div class="completion-orbit" aria-label="Practice milestone"><svg viewBox="0 0 240 240" aria-hidden="true">'+Array.from({length:24},(_,i)=>{const a=(i*15-90)*Math.PI/180;return `<circle cx="${120+92*Math.cos(a)}" cy="${120+92*Math.sin(a)}" r="${4+i*.12}" style="--i:${i}"/>`;}).join('')+'</svg><span>'+esc(label)+'</span></div>';}
 function reset(s){current=s;spoken=null;last=-1;document.querySelectorAll('.teaching-tip,.analysis-stage').forEach(x=>x.remove());}
 // #stage sizing (Oct 2026) -- #stage has no in-flow content of its own
 // (its #media/#visual children are both position:absolute), so a pure
 // CSS `aspect-ratio` + `width/height:auto` fix has nothing to resolve
 // against and the box just collapses to ~0 (tried first; it did).
 // `width:100%` alone works width-first but breaks the ratio whenever
 // HEIGHT, not width, is the binding constraint -- short windows, and
 // worst on iPad portrait (#stage rendered as a tall, narrow,
 // letterboxed box instead of 16:9). A ResizeObserver on .stage-col is
 // the only fully reliable fix: compute the actual largest 16:9 box
 // that fits the real available space and set it directly. This block
 // self-starts -- no per-lesson call site needed, every guided lesson
 // gets it just by loading this file, which all ten already do.
 function fitStage(col){
  const stage=col.querySelector('#stage');if(!stage)return;
  const controls=col.querySelector('#clipControls');
  const controlsH=controls&&!controls.hidden?controls.getBoundingClientRect().height+8:0;
  const availW=col.clientWidth,availH=col.clientHeight-controlsH;
  if(availW<=0||availH<=0)return;
  let w=availW,h=w*9/16;
  if(h>availH){h=availH;w=h*16/9;}
  stage.style.width=Math.floor(w)+'px';stage.style.height=Math.floor(h)+'px';
 }
 if(typeof ResizeObserver!=='undefined'){
  // Observes .stage-col itself (viewport/layout changes) AND
  // #clipControls (its hidden<->visible toggle during watch/pause
  // doesn't change .stage-col's OWN box, since .stage-col's height
  // comes from its flex parent, not its content -- so that toggle
  // would never otherwise trigger a callback, yet it's exactly what
  // changes how much room #stage actually has).
  const stageRO=new ResizeObserver(entries=>{
   for(const e of entries){const col=e.target.closest('.stage-col');if(col)fitStage(col);}
  });
  const startStageFit=()=>{
   const col=document.querySelector('.stage-col');
   if(col){stageRO.observe(col);const cc=col.querySelector('#clipControls');if(cc)stageRO.observe(cc);fitStage(col);}
   else requestAnimationFrame(startStageFit);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startStageFit);else startStageFit();
 }
 function scene(s){
  if(s.materialScene){document.getElementById('visual').innerHTML=`<div class="material-canvas"><svg viewBox="0 0 1448 1086" role="img" aria-label="Pencils, eraser, tissue and artist tape on sketch paper"><image href="${tools}" width="1448" height="1086"/><rect id="materialFocus" x="980" y="100" width="315" height="800" rx="22"/></svg><strong id="materialLabel">Your tools</strong></div>`;}
  if(s.kind==='milestone'||s.kind==='badge'){
   const symbol=document.querySelector('.milestone-star,.big-symbol');
   if(symbol)symbol.outerHTML=dots(location.pathname.includes('cube')?'Cube':location.pathname.includes('sphere-realworld')?'Apple':location.pathname.includes('sphere')?'Sphere':location.pathname.includes('cylinder')?'Cylinder':location.pathname.includes('cone')?'Cone':location.pathname.includes('intersecting')?'Two forms':location.pathname.includes('giftbox')?'Gift Box':'Ready');
  }
 }
 function narrate(s){spoken=s;last=-1;tick(0);}
 function tick(time){
  const tip=document.querySelector('.teaching-tip strong'),caption=document.getElementById('caption')?.textContent;if(tip&&caption)tip.textContent=caption;
  const cues=spoken?.cues||[];let at=-1;for(let i=0;i<cues.length;i++)if(time>=cues[i].time)at=i;
  if(at<0||at===last)return;last=at;const cue=cues[at];
  if(cue.zone!==undefined){const button=document.querySelector(`[data-zone="${cue.zone}"]`);button?.click();const ring=document.getElementById('zoneRing');if(ring){ring.classList.remove('cue-pulse');void ring.getBoundingClientRect();ring.classList.add('cue-pulse');}}
  if(cue.tool){const box=boxes[cue.tool],rect=document.getElementById('materialFocus');if(rect&&box){['x','y','width','height'].forEach((attr,i)=>rect.setAttribute(attr,box[i]));document.getElementById('materialLabel').textContent=cue.label||cue.tool;}}
 }
 // Stages (Oct 2026): flat step lists of 30-60+ steps overwhelmed
 // students ("dozens of steps at once"). Every guided lesson's flow
 // already carries a `chapter` field per step, originally just a label
 // -- this groups those chapters into STAGES of ~7-10 steps (never more
 // than 15) and is the one place that grouping rule lives, so all ten
 // lessons get it for free from their existing flow.json, no per-lesson
 // re-authoring. Rule: merge consecutive same-kind chapters forward
 // toward the target; a chapter boundary between non-drawing content
 // (materials, welcome) and actual drawing is a hard break, since that's
 // always the real teaching seam; tiny interstitial chapters (a single
 // "A little encouragement" card, len<=2) never force a break on their
 // own -- they're absorbed into whichever stage they land inside; any
 // single chapter that alone exceeds the hard cap is split into even
 // parts. Verified against all ten lessons' real flow.json data before
 // shipping (see commit message) -- every resulting stage lands in
 // [1,15] steps.
 const FILLER_CHAPTERS=new Set(['a little encouragement','your progress','your work','look again','finish','your milestone','bonus polish','hand warm-up']);
 let stagesCache=null,stagesCacheFlow=null;
 function computeStages(flow,target=8,hardCap=15){
  if(flow===stagesCacheFlow&&stagesCache)return stagesCache;
  const runs=[];
  flow.forEach(s=>{
   const chapter=s.chapter||'Lesson',hasDraw=s.kind==='draw';
   const last=runs[runs.length-1];
   if(last&&last.chapter===chapter){last.len++;last.hasDraw=last.hasDraw||hasDraw;}
   else runs.push({chapter,len:1,hasDraw});
  });
  runs.forEach(r=>{r.filler=FILLER_CHAPTERS.has(r.chapter.trim().toLowerCase())||r.len<=2;});
  const split=[];
  runs.forEach(r=>{
   if(r.len>hardCap){
    const parts=Math.ceil(r.len/target),base=Math.floor(r.len/parts),rem=r.len%parts;
    for(let i=0;i<parts;i++)split.push({chapter:r.chapter,len:base+(i<rem?1:0),hasDraw:r.hasDraw,filler:false,part:i+1,parts});
   }else split.push(r);
  });
  const stages=[];let cur=null;
  split.forEach(r=>{
   const wouldBe=(cur?cur.len:0)+r.len;
   const hardBreak=!r.filler&&cur&&cur.hasDraw!=null&&cur.hasDraw!==r.hasDraw;
   if(!cur)cur={chapters:[r],len:r.len,hasDraw:r.filler?null:r.hasDraw};
   else if(hardBreak||(!r.filler&&(cur.len>=target||wouldBe>hardCap))||(r.filler&&wouldBe>hardCap)){
    stages.push(cur);cur={chapters:[r],len:r.len,hasDraw:r.filler?null:r.hasDraw};
   }else{cur.chapters.push(r);cur.len+=r.len;if(!r.filler)cur.hasDraw=r.hasDraw;}
  });
  if(cur)stages.push(cur);
  let idx=0;
  stages.forEach(st=>{
   st.start=idx;idx+=st.len;st.end=idx;st.name=null;
   for(const c of st.chapters){if(!c.filler){st.name=c.chapter+(c.parts?` (${c.part}/${c.parts})`:'');break;}}
   if(!st.name)st.name=st.chapters[0].chapter;
  });
  stagesCache=stages;stagesCacheFlow=flow;
  return stages;
 }
 function stageAt(flow,index){
  const stages=computeStages(flow);
  return stages.find(st=>index>=st.start&&index<st.end)||stages[stages.length-1]||{start:0,end:flow.length,name:'',len:flow.length};
 }
 // Lesson map grouping -- each lesson's own openMap() loop calls this
 // instead of diffing raw `chapter` itself, so a map header always
 // matches a stage, even where several small chapters were merged.
 function mapStageGroups(flow){return computeStages(flow).map(st=>({name:st.name,start:st.start,end:st.end}));}
 // Persistent "<Stage name> · N of M" line. Needed because the existing
 // setMode() status text in each lesson's own enter() is overwritten
 // almost immediately by "WATCH CLOSELY" / "YOUR TURN · TAKE YOUR TIME"
 // -- students never actually got to read it. This writes to its own
 // #stepCounter element instead, which nothing else touches, so it
 // stays visible for the whole step. Deliberately never shows the
 // lesson's grand total step count -- that's the whole point of stages.
 function stepCounter(flow,index){
  const el=document.getElementById('stepCounter');if(!el||!flow.length)return;
  const st=stageAt(flow,index);
  const pos=index-st.start+1;
  // Approximate time left in this stage: real clip length for the
  // remaining draw steps (clipEnd-start), ignoring narration-only steps
  // -- a rough lower bound, not exact, but enough to see a finish line.
  let remaining=0;
  for(let i=index;i<st.end;i++){const s=flow[i];if(s.kind==='draw'&&s.clipEnd!=null)remaining+=Math.max(0,s.clipEnd-(s.start||0));}
  const mins=Math.round(remaining/60);
  const timeLeft=remaining>20?` · ~${mins<1?'1':mins} min left`:'';
  el.innerHTML=`<b>${esc(st.name)}</b> · ${pos} of ${st.len}${timeLeft}`;
 }
 // Top-of-page stage dots: one circle per stage for the whole lesson --
 // filled for done, gently pulsing for current, empty outline for
 // upcoming -- plus the plain current-stage name underneath. Reaching a
 // milestone (always the last step of a stage) also shows the warm
 // pause line here, once, the moment that stage first completes.
 let glowedFor=-1;
 function stageDots(flow,index,completed){
  const el=document.getElementById('stageDots');if(!el||!flow.length)return;
  const stages=computeStages(flow);
  const curIdx=stages.findIndex(st=>index>=st.start&&index<st.end);
  const circles=stages.map((st,i)=>{
   const done=completed.has(st.end-1);
   const cls=i===curIdx?'current':done?'done':'';
   return `<span class="stage-dot${cls?' '+cls:''}"></span>`;
  }).join('');
  const cur=stages[curIdx]||stages[stages.length-1];
  const justCompleted=index>0&&flow[index-1]?.kind==='milestone'&&completed.has(index-1)&&glowedFor!==index-1;
  if(justCompleted)glowedFor=index-1;
  const milestoneNote=flow[index]?.kind==='milestone'?'<div class="stage-milestone-note">Stage complete — take a short break. Continue whenever you’re ready.</div>':'';
  el.innerHTML=`<div class="stage-dot-row">${circles}</div><div class="stage-name">${esc(cur?.name||'')}</div>${milestoneNote}`;
  if(justCompleted){
   const dot=el.querySelectorAll('.stage-dot.done')[curIdx-1]||el.querySelectorAll('.stage-dot.done')[el.querySelectorAll('.stage-dot.done').length-1];
   if(dot){dot.classList.remove('glow-once');void dot.getBoundingClientRect();dot.classList.add('glow-once');}
  }
 }
 // Footer step-jump row, scoped to only the current stage's own steps
 // (never the whole lesson) -- this is what "dozens of steps at once"
 // was actually about. `onJump` is the lesson's own jumpToStep(i).
 function stageProgress(flow,index,completed,skipped,onJump){
  const bar=document.getElementById('progress');if(!bar)return;
  bar.innerHTML='';
  const st=stageAt(flow,index);
  const preview=document.getElementById('stepPreview');
  for(let i=st.start;i<st.end;i++){
   const step=flow[i],pos=i-st.start+1;
   const b=document.createElement('button');b.type='button';
   b.className='step-jump '+(i===index?'current':completed.has(i)?'done':skipped.has(i)?'skipped':'');
   const label=`${pos}. ${step.title}${step.optional?' · Optional':''}`;
   b.textContent=String(pos);b.title=label;b.setAttribute('aria-label','Jump to '+label);
   if(i===index)b.setAttribute('aria-current','step');
   b.onclick=()=>onJump(i);
   if(preview){b.onmouseenter=b.onfocus=()=>{preview.textContent=label;};b.onmouseleave=b.onblur=()=>{preview.textContent='';};}
   bar.append(b);
  }
 }
 function pause(s){
  const stage=document.getElementById('visual');
  // The exact authored annotated frame fills the main teaching stage.
  // Animate its arrival; do not invent generic arrows at unrelated positions.
  if(s.analysis){const layer=document.createElement('div');layer.className='analysis-stage';const img=document.createElement('img');img.src=s.analysis;img.alt=s.title+' — enlarged teacher analysis';layer.append(img);stage.append(layer);}
  const card=document.createElement('aside');card.className='teaching-tip';card.setAttribute('aria-label','Artchi’s drawing tip');
  card.innerHTML=`<img src="${root}core/dashboard-artchi.svg" alt="Artchi"><div><small>LOOK CLOSELY</small><strong>${esc(s.hint||s.title)}</strong></div><button aria-label="Hide drawing tip">×</button>`;
  card.querySelector('button').onclick=()=>card.remove();stage.append(card);
  const reference=document.getElementById('referenceImage');if(reference)reference.style.cursor='zoom-in';
 }
 return {reset,scene,narrate,tick,pause,dots,stepCounter,stageDots,stageProgress,mapStageGroups};
})();
