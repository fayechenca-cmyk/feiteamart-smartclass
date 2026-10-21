
window.SketchMap = {
 badge(id){return (window.BADGE_CATALOG||[]).find(b=>b.id===id)||{};},
 reward(id){const b=this.badge(id);return `<div class="sketch-badge"><img src="${b.imgUrl}" alt="${b.title} badge"><strong>${b.title}</strong><small>${b.artist}</small><small>Branch badge goal</small></div>`;},
 hero(title,description,badge){return `<div class="sketch-hero"><div><span class="sketch-eyebrow">Drawing · Foundation of Sketch</span><h1>${title}</h1><p>${description}</p></div>${this.reward(badge)}</div>`;}
};
// Both foundation packages use this same ordered lesson row.
// groupLabelFn (optional, Oct 2026): (lesson, index) => label|null — when
// given, a divider is inserted before any lesson whose label differs from
// the previous one (so consecutive lessons sharing a label render no
// divider between them). Still Life's existing calls omit this param
// entirely, so this stays a no-op for them — no Form-and-Structure-
// specific grouping logic lives in this shared file; the label text
// itself always comes from the caller.
// isAdmin (Oct 2026, admin preview): ONLY meant for the single FAYE-00
// account, passed in explicitly by each caller -- NOT the same thing as
// core/access.js's isAdmin flag, which is also true for DAWN-16 (see
// that file's own admin-tier comment) and must NOT gain this. When
// true, every ready-and-accessible lesson opens directly regardless of
// completion order; the paywall/access gate (the `access` param) is
// untouched -- an admin preview still respects course access, it only
// lifts the sequential "finish the previous one first" lock.
SketchMap.lessonRows=function(list,completed,prefix='',access=true,groupLabelFn,isAdmin=false){
 let nextFound=false;
 let lastGroupLabel=null;
 return list.map((l,i)=>{
  const done=l.ready&&completed.includes(l.id),current=l.ready&&!done&&!nextFound;
  if(!done)nextFound=true;
  const adminOpen=isAdmin&&l.ready&&!done;
  const state=!l.ready?'coming':done?'done':(current||adminOpen)&&access?'current':'locked';
  const clickable=state==='done'||state==='current';
  const key=l.id.startsWith('still-life-1')?'balloon':l.id.startsWith('still-life-2')?'glass':l.id;
  const art=['cube','sphere','cylinder','apple','cone','intersecting','cup','icecream','box','papercrane','balloon','glass'].includes(key)?`assets/sketch-map/${key}.jpg`:key==='preparation'?'assets/sketch-map/preparation.png':null;
  let dividerHtml='';
  if(typeof groupLabelFn==='function'){
   const label=groupLabelFn(l,i);
   if(label!=null&&label!==lastGroupLabel){
    dividerHtml=`<div class="path-group-divider">${label}</div>`;
    lastGroupLabel=label;
   }
  }
  return dividerHtml+`<${clickable?'a':'div'} class="path-node ${state}" ${clickable?`href="${prefix+l.href}"`:''} ${current?'aria-current="step"':''}><div class="node-icon">${art?`<img src="${prefix+art}" alt="${l.title} · teacher demonstration" loading="lazy">`:`<span>${i+1}</span>`}${done?'<b class="lesson-check" aria-label="Complete">✓</b>':''}</div><div class="node-info"><div class="node-kicker">Practice ${i+1} · ${done?'Complete ✓':!l.ready?'In development':(current||adminOpen)&&access?'Start now':'Up next'}</div><div class="node-title">${l.title}</div><div class="node-tag">${done?'Practice complete · Revisit anytime':!l.ready?'Teacher lesson in preparation':!access?'Course access required':(current||adminOpen)?(l.subtitle||'Follow the teacher, then draw your own study.'):'Complete the previous practice to continue'}</div></div><div class="node-arrow">${done?'↻':clickable?'→':'🔒'}</div></${clickable?'a':'div'}>`;
 }).join('');
};
