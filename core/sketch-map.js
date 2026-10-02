
window.SketchMap = {
 badge(id){return (window.BADGE_CATALOG||[]).find(b=>b.id===id)||{};},
 reward(id){const b=this.badge(id);return `<div class="sketch-badge"><img src="${b.imgUrl}" alt="${b.title} badge"><strong>${b.title}</strong><small>${b.artist}</small><small>Branch badge goal</small></div>`;},
 hero(title,description,badge){return `<div class="sketch-hero"><div><span class="sketch-eyebrow">Drawing · Foundation of Sketch</span><h1>${title}</h1><p>${description}</p></div>${this.reward(badge)}</div>`;}
};
