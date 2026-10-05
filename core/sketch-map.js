
window.SketchMap = {
 badge(id){return (window.BADGE_CATALOG||[]).find(b=>b.id===id)||{};},
 reward(id){const b=this.badge(id);return `<div class="sketch-badge"><img src="${b.imgUrl}" alt="${b.title} badge"><strong>${b.title}</strong><small>${b.artist}</small><small>Branch badge goal</small></div>`;},
 hero(title,description,badge){return `<div class="sketch-hero"><div><span class="sketch-eyebrow">Drawing · Foundation of Sketch</span><h1>${title}</h1><p>${description}</p></div>${this.reward(badge)}</div>`;}
};
// Both foundation packages use this same ordered lesson row.
SketchMap.lessonRows=function(list,completed,prefix='',access=true){
 let nextFound=false;
 return list.map((l,i)=>{
  const done=l.ready&&completed.includes(l.id),current=l.ready&&!done&&!nextFound;
  if(!done)nextFound=true;
  const state=!l.ready?'coming':done?'done':current&&access?'current':'locked';
  const clickable=state==='done'||state==='current';
  const key=l.id.startsWith('still-life-1')?'balloon':l.id.startsWith('still-life-2')?'glass':l.id;
  const art=['cube','sphere','cylinder','apple','cone','intersecting','cup','icecream','box','papercrane','balloon','glass'].includes(key)?`assets/sketch-map/${key}.jpg`:key==='preparation'?'assets/sketch-map/preparation.png':null;
  return `<${clickable?'a':'div'} class="path-node ${state}" ${clickable?`href="${prefix+l.href}"`:''} ${current?'aria-current="step"':''}><div class="node-icon">${art?`<img src="${prefix+art}" alt="${l.title} · teacher demonstration" loading="lazy">`:`<span>${i+1}</span>`}${done?'<b class="lesson-check" aria-label="Complete">✓</b>':''}</div><div class="node-info"><div class="node-kicker">Practice ${i+1} · ${done?'Complete ✓':!l.ready?'In development':current&&access?'Start now':'Up next'}</div><div class="node-title">${l.title}</div><div class="node-tag">${done?'Practice complete · Revisit anytime':!l.ready?'Teacher lesson in preparation':!access?'Course access required':current?(l.subtitle||'Follow the teacher, then draw your own study.'):'Complete the previous practice to continue'}</div></div><div class="node-arrow">${done?'↻':clickable?'→':'🔒'}</div></${clickable?'a':'div'}>`;
 }).join('');
};
