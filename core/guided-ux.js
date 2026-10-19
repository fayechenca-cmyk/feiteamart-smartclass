/* Shared visual guidance: accurate teacher diagrams, timed cues, and dot rewards. */
window.GuidedUX=(()=>{
 const root='../../../',tools='https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/6a173bd23acbf487b452a628_49dc1cbc-f5e2-4aa3-a113-5d89a228a165.png';
 let current=null,spoken=null,last=-1;
 const boxes={pencils:[980,100,315,800],tissue:[215,560,510,290],eraser:[585,130,285,135],tape:[205,160,240,245],paper:[90,65,1265,960]};
 const esc=x=>String(x||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function dots(label){return '<div class="completion-orbit" aria-label="Practice milestone"><svg viewBox="0 0 240 240" aria-hidden="true">'+Array.from({length:24},(_,i)=>{const a=(i*15-90)*Math.PI/180;return `<circle cx="${120+92*Math.cos(a)}" cy="${120+92*Math.sin(a)}" r="${4+i*.12}" style="--i:${i}"/>`;}).join('')+'</svg><span>'+esc(label)+'</span></div>';}
 function reset(s){current=s;spoken=null;last=-1;document.querySelectorAll('.teaching-tip,.analysis-stage').forEach(x=>x.remove());}
 function scene(s){
  if(s.materialScene){document.getElementById('visual').innerHTML=`<div class="material-canvas"><svg viewBox="0 0 1448 1086" role="img" aria-label="Pencils, eraser, tissue and artist tape on sketch paper"><image href="${tools}" width="1448" height="1086"/><rect id="materialFocus" x="980" y="100" width="315" height="800" rx="22"/></svg><strong id="materialLabel">Your tools</strong></div>`;}
  if(s.kind==='milestone'||s.kind==='badge'){
   const symbol=document.querySelector('.milestone-star,.big-symbol');
   if(symbol)symbol.outerHTML=dots(location.pathname.includes('cube')?'Cube':location.pathname.includes('sphere')?'Sphere':location.pathname.includes('cylinder')?'Cylinder':'Ready');
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
 return {reset,scene,narrate,tick,pause,dots};
})();
