/* Data-driven SVG tracing engine. No lesson-specific geometry or account writes. */
(() => {
  const NS='http://www.w3.org/2000/svg';
  const el=(name,attrs={})=>{const n=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));return n;};
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function pathNode(d,attrs={}) {return el('path',{d,fill:'none','stroke-linecap':'round','stroke-linejoin':'round',...attrs});}
  function sample(path,n=90) {const length=path.getTotalLength();return Array.from({length:n+1},(_,i)=>{const p=path.getPointAtLength(length*i/n);return {x:p.x,y:p.y};});}
  function resample(points,spacing=4) {
    const result=[points[0]];let remaining=spacing;
    for(let i=1;i<points.length;i++){let a=points[i-1],b=points[i],len=distance(a,b);while(len>=remaining&&len>0){a={x:a.x+(b.x-a.x)*remaining/len,y:a.y+(b.y-a.y)*remaining/len};result.push(a);len=distance(a,b);remaining=spacing;}remaining-=len;}
    result.push(points.at(-1));return result;
  }
  function assess(points,reference,step,pointer='mouse') {
    if(points.length<3)return {ok:false,reason:'Try drawing a line from the circle toward the square.'};
    const tol=step.tolerance[pointer]||step.tolerance.mouse, trace=resample(points);
    if(distance(trace[0],reference[0])>step.startRegion.radius+tol*.4)return {ok:false,reason:'Find the circle first, then begin your stroke there.'};
    if(distance(trace.at(-1),reference.at(-1))>step.endRegion.radius+tol*.4)return {ok:false,reason:'You have made a start! Look for the square where the stroke ends. '+step.feedback.retry};
    const near=trace.map(p=>reference.some(q=>distance(p,q)<=tol));
    const coverage=reference.filter(q=>trace.some(p=>distance(p,q)<=tol)).length/reference.length;
    if(coverage<step.tolerance.coverage||near.filter(Boolean).length/near.length<.62)return {ok:false,reason:'Look again at the places this stroke passes through. '+step.feedback.retry};
    let cursor=0,ordered=0;
    for(const fraction of [.2,.4,.6,.8]){const anchor=reference[Math.round((reference.length-1)*fraction)];const found=trace.findIndex((p,i)=>i>=cursor&&distance(p,anchor)<=tol*.7);if(found>=0){ordered++;cursor=found+1;}}
    if(ordered/4<step.tolerance.order)return {ok:false,reason:'Move slowly from start to finish. Try a little less back-and-forth movement.'};
    return {ok:true,reason:step.feedback.success};
  }
  function svg(lesson,{guides=false,points=false,reference=false,activeGuides=[],activePoints=[],overlays=[]}={}) {
    const s=el('svg',{viewBox:`0 0 ${lesson.canvas.width} ${lesson.canvas.height}`,xmlns:NS,role:'img','aria-label':'Figure drawing area'});
    s.append(el('rect',{width:lesson.canvas.width,height:lesson.canvas.height,fill:'#ffffff'}));
    if(guides){s.append(el('line',{x1:lesson.centerLine.x,x2:lesson.centerLine.x,y1:28,y2:675,stroke:'#cbd5e1','stroke-dasharray':'5 6'}));lesson.guides.forEach(g=>{s.append(el('line',{x1:66,x2:334,y1:g.y,y2:g.y,stroke:activeGuides.includes(g.id)?'#997a43':'#e8ecf2','stroke-width':activeGuides.includes(g.id)?1.8:1}));});}
    if(overlays.includes('plumb')&&lesson.balance){const b=lesson.balance;s.append(el('line',{x1:b.x,x2:b.x,y1:b.top,y2:b.bottom,stroke:'#a78bfa','stroke-width':2,'stroke-dasharray':'7 5'}));s.append(pathNode(`M${b.x} ${b.bottom-12} h12 v12`,{stroke:'#a78bfa','stroke-width':1.5}));}
    (lesson.overlays||[]).filter(o=>overlays.includes(o.id)).forEach(o=>s.append(pathNode(o.path,{stroke:o.color||'#a78bfa','stroke-dasharray':'5 5','stroke-width':1.5})));
    if(points)lesson.points.forEach(p=>s.append(el('circle',{cx:p.x,cy:p.y,r:3,fill:activePoints.includes(p.id)||lesson.guides.some(g=>activeGuides.includes(g.id)&&Math.abs(g.y-p.y)<12)?'#1d9e75':'#a8b6c8'})));
    if(reference)lesson.steps.filter(st=>st.path).forEach(st=>s.append(pathNode(st.path,{stroke:'#94a3b8','stroke-width':2})));
    return s;
  }
  function strokePath(points){return points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');}
  function addWork(s,strokes){Object.values(strokes).forEach(st=>{if(st.points?.length)s.append(pathNode(strokePath(st.points),{stroke:st.status==='passed'?'#1a1d2b':'#64748b','stroke-width':2.5}));});}
  function markers(svg,lesson,ids,onPick,selected=[]){
    svg.setAttribute('role','group');svg.setAttribute('aria-label','Locate the marked guide points');
    ids.forEach(id=>{const p=lesson.points.find(p=>p.id===id);if(!p)return;const g=el('g',{'data-point':id,class:'landmark-target',role:'button',tabindex:0,'aria-label':`Locate ${p.label}`});
      g.append(el('circle',{cx:p.x,cy:p.y,r:24,fill:'transparent'}));g.append(el('circle',{cx:p.x,cy:p.y,r:selected.includes(id)?7:6,fill:selected.includes(id)?'#1d9e75':'#fff',stroke:'#1d9e75','stroke-width':2}));
      const label=el('text',{x:p.x+12,y:p.y-12,'font-size':11,fill:'#475569'});label.textContent=selected.includes(id)?'✓':p.label;g.append(label);
      const pick=e=>{e.preventDefault();onPick(id);};g.addEventListener('click',pick);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')pick(e);});svg.append(g);
    });
  }
  class Board {
    constructor(host,lesson,step,options){this.lesson=lesson;this.step=step;this.options=options;
      this.svg=svg(lesson,{guides:options.guides,points:options.mode!=='own',activeGuides:step.guideIds,activePoints:step.pointIds||[],overlays:options.mode==='own'?[]:(step.overlays||[])});
      this.svg.setAttribute('aria-label',`${step.title}; ${step.prompt} Draw with a finger, stylus or mouse. Paper practice is also available.`);
      this.svg.classList.add('drawing-surface');host.replaceChildren(this.svg);
      addWork(this.svg,options.strokes);
      if(step.kind==='locate'){
        if(options.mode==='own'&&lesson.balance){const b=lesson.balance;this.svg.append(el('line',{x1:b.x,x2:b.x,y1:b.top,y2:b.bottom,stroke:'#a78bfa','stroke-dasharray':'7 5'}));}
        markers(this.svg,lesson,['ankle-support','ankle-free'],id=>options.onLocate?.(id),options.strokes[step.id]?.status==='passed'?[step.targetPoint]:[]);
        return;
      }
      this.reference=pathNode(step.path,{stroke:'#bbc9d9','stroke-width':5,opacity:options.mode==='follow'?.65:0});this.svg.append(this.reference);this.samples=sample(this.reference);
      if(options.mode!=='own'){
        const start=this.samples[0],end=this.samples.at(-1);
        this.svg.append(el('circle',{cx:start.x,cy:start.y,r:6,fill:'#ffffff',stroke:'#1d9e75','stroke-width':2}));
        this.svg.append(el('rect',{x:end.x-4,y:end.y-4,width:8,height:8,fill:'#997a43'}));
      }
      this.svg.addEventListener('pointerdown',e=>this.down(e));this.svg.addEventListener('pointermove',e=>this.move(e));this.svg.addEventListener('pointerup',e=>this.up(e));this.svg.addEventListener('pointercancel',()=>this.cancel());this.svg.addEventListener('lostpointercapture',()=>this.cancel());
    }
    position(e){const matrix=this.svg.getScreenCTM();if(!matrix)return null;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());return {x:Math.max(0,Math.min(this.lesson.canvas.width,p.x)),y:Math.max(0,Math.min(this.lesson.canvas.height,p.y))};}
    down(e){if(this.pointer!==undefined||e.button>0)return;e.preventDefault();this.stopDemo();this.pointer=e.pointerId;this.pointerType=e.pointerType;this.svg.setPointerCapture(e.pointerId);this.points=[this.position(e)];this.live=pathNode(strokePath(this.points),{stroke:'#1a1d2b','stroke-width':2.5});this.svg.append(this.live);this.options.onGesture?.();}
    move(e){if(e.pointerId!==this.pointer)return;e.preventDefault();for(const event of e.getCoalescedEvents?.().length?e.getCoalescedEvents():[e]){const p=this.position(event);if(distance(p,this.points.at(-1))>1.2&&this.points.length<5000)this.points.push(p);}this.live.setAttribute('d',strokePath(this.points));}
    up(e){if(e.pointerId!==this.pointer)return;this.points.push(this.position(e));const points=this.points;this.pointer=undefined;this.svg.releasePointerCapture(e.pointerId);const result=assess(points,this.samples,this.step,this.pointerType);this.options.onStroke(points,result);}
    cancel(){if(this.pointer===undefined)return;this.pointer=undefined;this.live?.remove();this.points=[];this.options.onCancel?.();}
    replay(){this.stopDemo();if(!this.step.path)return;this.demo=pathNode(this.step.path,{stroke:'#997a43','stroke-width':3});this.svg.append(this.demo);const length=this.demo.getTotalLength();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)this.animation=this.demo.animate([{strokeDasharray:`${length}`,strokeDashoffset:length},{strokeDasharray:`${length}`,strokeDashoffset:0}],{duration:this.step.animation.duration,fill:'forwards',easing:'linear'});}
    stopDemo(){this.animation?.cancel();this.demo?.remove();}
    destroy(){this.stopDemo();this.cancel();}
  }
  async function exportPNG(lesson,strokes){const s=svg(lesson);addWork(s,strokes);s.setAttribute('width',lesson.canvas.width*2);s.setAttribute('height',lesson.canvas.height*2);const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(s)],{type:'image/svg+xml'}));try{const img=new Image();img.src=url;await img.decode();const c=document.createElement('canvas');c.width=lesson.canvas.width*2;c.height=lesson.canvas.height*2;c.getContext('2d').drawImage(img,0,0);return await new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('The image could not be generated')),'image/png'));}finally{URL.revokeObjectURL(url);}}
  window.FEITracing={Board,svg,markers,addWork,assess,sample,exportPNG};
})();
