/* Account onboarding. Student-code profiles never call this module. */
(function () {
  'use strict';
  const VERSION = 1;
  const courses = [
    {id:'color',title:'My Magical City',image:'https://customer-a78os4oj56dr67ab.cloudflarestream.com/2f8f0d0f117e6a9abfe42e9a2710e9c8/thumbnails/thumbnail.jpg?time=620s&height=360',motion:'https://customer-a78os4oj56dr67ab.cloudflarestream.com/2f8f0d0f117e6a9abfe42e9a2710e9c8/thumbnails/thumbnail.gif?time=620s&duration=3s&height=360',href:'lessons/my-magical-city/',tags:['Color','Painting','Acrylic','Color mixing','Watercolor'],hint:'Discover what happens when colors meet.'},
    {id:'craft',title:'Build a tiny art studio',image:'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/ee229d4d-10e7-4dc8-f174-7ebc98d7fa00/public',href:'lessons/dream-art-studio/',tags:['Making','Design','Creative exploration','Handicrafts','Cute elements'],hint:'Turn everyday materials into your own little world.'},
    {id:'sketch',title:'See it. Sketch it.',image:'assets/sketch-map/apple.jpg',href:'lessons/sketch-branches/',tags:['Drawing','Realism','Teacher guidance'],hint:'Build confidence with shapes, light, and patient looking.'},
    {id:'fashion',title:'Think like a designer',image:'assets/creation-intro/craft.jpg',href:'fashion-design/',tags:['Fashion design','Design','Creative exploration'],hint:'Explore figures and bring your design ideas to life.'},
    {id:'theory',title:'Look a little closer',image:'assets/creation-intro/color.jpg',href:'art-theory/',tags:['Art stories','Theory','Color','Art history','Art theory','Contemporary art','Art criticism'],hint:'Explore the ideas behind the art.'},
    {id:'handcraft',title:'Make a colorful chameleon',image:'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/cf313ccd-d1e3-4f62-dc9e-2150b3a22500/public',href:'lessons/carle-colorful-chameleon/',tags:['Making','Color','Creative exploration','Handicrafts','Cute elements','Painting','Storytelling'],hint:'Make painted textures into a character of your own.'},
    {id:'leather',title:'Make it in leather',image:'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/6833b240839a771394ce7139_Screenshot%202025-05-25%20at%205.13.29%E2%80%AFPM.png',href:'https://www.feiteamart.com/leathercraft-for-beginners',tags:['Making','Design','Leather craft','Leather crafting','Handicrafts'],hint:'Explore hands-on leather crafting.'},
    {id:'scene',title:'Imagine a scene',image:'lessons/scene-drawing-foundation/unit-01-shot-size/lesson-01-extreme-wide-shot/card3-night-city-illustration-only.png',href:'lessons/scene-drawing-foundation/',tags:['Drawing','Storytelling','Creative exploration','Movie scenes','Photography','Animation'],hint:'Turn a place into a visual story.'}
    ,{id:'cathedral',title:'Build a cardboard cathedral',image:'material-art/cardboard/assets/gothic/project-map.png',href:'material-art/cardboard/#project/gothic',tags:['Handicrafts','Making','Design'],hint:'Turn cardboard into arches, towers, and a little building.'},
    {id:'mixing',title:'Discover color mixing',image:'assets/creation-intro/mixed.jpg',href:'color-lab/',tags:['Color mixing','Color','Painting'],hint:'Mix colors and discover new possibilities.'},
    {id:'yokai',title:'Yōkai cats in the Great Wave',image:'https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/87850c69-3dfa-4ffa-a00e-316d548bbd00/public',href:'lessons/yokai-in-the-great-wave/',tags:['Storytelling','Painting','Art history','Cute elements','Character design','Anime characters'],hint:'Invent extraordinary creatures inside a world of waves.'},
    {id:'dog',title:'Draw a realistic dog',image:'https://customer-a78os4oj56dr67ab.cloudflarestream.com/8876d665061fa07356f6a08db27ef169/thumbnails/thumbnail.jpg?time=431s&height=600',href:'lessons/still-life-4a-dog-structure/',tags:['Realism','Drawing','Teacher guidance'],hint:'Build a portrait with light, detail, and soft fur textures.'}
  ];
  // Only real visual samples are presented as artwork choices; other cards are course suggestions.
  const sampleBatches = [['color','craft','sketch','handcraft','leather','scene'],['cathedral','mixing','yokai','dog']].map(ids=>ids.map(id=>courses.find(c=>c.id===id)));
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let active;
  function recommend(d) {
    return courses.map((c,i)=>({ ...c,score:c.tags.filter(t=>d.interests.includes(t)).length*3+(d.pictures.includes(c.id)?5:0)+(d.identity==='guided'&&c.tags.includes('Teacher guidance')?2:0)+(d.identity==='explorer'&&c.tags.includes('Creative exploration')?2:0)+(d.identity==='beginner'&&c.id==='color'?1:0),order:i})).sort((a,b)=>b.score-a.score||a.order-b.order).slice(0,3);
  }
  function eligible(user) {
    if (!user?.id || user.studentCode || user.is_anonymous) return false;
    try {
      const profile = JSON.parse(sessionStorage.getItem('fei_user_profile') || 'null');
      if (profile?.studentCode) return false;
    } catch {}
    return true;
  }
  function open(user, force=false) {
    if (!eligible(user)) return Promise.resolve(null);
    if(active) return active;
    const saved=user.user_metadata?.art_preferences;
    if(!force && saved?.version===VERSION && saved.completed_at) return Promise.resolve(saved);
    active=new Promise(resolve=>{
      let step=0, busy=false, batch=0;
      const d={name:window.FEIAuth.displayName(user),age:'',gender:'',interests:[],otherInterest:'',pictures:[],identity:'',pace:'',...saved};
      const previous=document.activeElement;
      const dialog=document.createElement('dialog');dialog.className='fei-start';dialog.setAttribute('aria-labelledby','start-title');
      document.body.append(dialog);
      const titles=['Every artist starts with a hello.','A little about your chapter.','What lights you up?','Follow your eyes.','How do you like to create?','Your journey, your rhythm.','A little world of possibilities.'];
      const hints=['I’m Artchi, your studio companion. What would you like me to call you?','All ages belong in this studio. Choose your age range.','Collect a few sparks. Choose as many interests as you like.','Which course glimpses make you curious? Pick a few — there’s no right answer.','No talent test here. Choose what feels like you today.','A suggested path or room to wander? You can always change your mind.','These are starting points, not labels. Your interests can grow with you.'];
      function choice(field,value,label,sub='') {const selected=Array.isArray(d[field])?d[field].includes(value):d[field]===value;return `<button type="button" class="start-choice ${selected?'selected':''}" data-field="${field}" data-value="${esc(value)}" aria-pressed="${selected}"><span>${label}</span>${sub?`<small>${sub}</small>`:''}<b aria-hidden="true">${selected?'✓':'+'}</b></button>`;}
      function media(c){if(c.id==='cathedral')return `<span class="start-cathedral-image" role="img" aria-label="Completed cardboard Gothic cathedral"></span>`;return `<img src="${c.image}" ${c.motion?`data-motion="${c.motion}" data-poster="${c.image}"`:''} alt="${c.title}"/>${c.motion?'<small class="start-motion-label">3-second glimpse</small>':''}`;}
      function cards(list,links=false){return `<div class="start-gallery">${list.map(c=>links?`<a href="${c.href}">${media(c)}<strong>${c.title}</strong><small>${c.hint}</small><small>${d.pictures.includes(c.id)?'You picked this visual spark':c.tags.some(t=>d.interests.includes(t))?'Inspired by your interests':'A new direction to try'} ↗</small></a>`:choice('pictures',c.id,`${media(c)}<strong>${c.title}</strong>`)).join('')}</div>`;}
      function valid(){return step===0?!!d.name.trim():step===1?!!d.age:step===2?(d.interests.length>0&&(!d.interests.includes('Others')||!!d.otherInterest.trim())):step===3?d.pictures.length>0:step===4?!!d.identity:step===5?!!d.pace:true;}
      function render(){
        let content='';
        if(step===0)content=`<label class="start-name">Call me…<input id="start-name" maxlength="50" autocomplete="nickname" value="${esc(d.name)}" placeholder="Your favorite name"/></label><p class="start-note">Your Google or account name is just a suggestion. Make it yours.</p>`;
        if(step===1)content=`<div class="start-options">${['Under 6','6–8','9–12','13–15','16–17','18+ · Adult'].map(v=>choice('age',v,v)).join('')}</div><fieldset><legend>How do you describe your gender? <small>Optional · no default choice</small></legend><div class="start-options compact">${['Boy / Man','Girl / Woman','Neutral / No defined label','Prefer not to say'].map(v=>choice('gender',v,v)).join('')}</div></fieldset><p class="start-note">Gender does not affect your recommendations.</p>`;
        if(step===2)content=`<div class="start-options sparks">${['Realism','Art history','Art theory','Contemporary art','Art criticism','Storytelling','Photography','Color mixing','Painting','Watercolor','Handicrafts','Cute elements','Movie scenes','Leather crafting','Animation','Character design','Anime characters','Others'].map((v,i)=>choice('interests',v,['✦','◒','✿','◐'][i%4]+' '+v)).join('')}</div>${d.interests.includes('Others')?`<label class="start-other" for="start-other-interest">What do you love?<input id="start-other-interest" maxlength="200" value="${esc(d.otherInterest)}" placeholder="Tell Artchi what you’d love to explore…"/><small>Your own interests belong here, too.</small></label>`:''}`;
        if(step===3)content=`<div class="start-batch-bar"><span>Collection ${batch+1} of 2 · ${d.pictures.length} selected across both</span><button type="button" id="start-batch">${batch===0?'Show me another collection →':'← Back to the first collection'}</button></div>`+cards(sampleBatches[batch])+(batch===0?`<button type="button" id="start-motion" aria-pressed="false">Play 3-second glimpse</button>`:'')+`<p class="start-note">A tiny looking exercise: notice whether color, texture, or realistic detail catches your eye.</p>`;
        if(step===4)content=`<div class="start-options">${[['beginner','A fresh start','I’m new. Help me find my first marks.'],['practiced','Finding my confidence','I’ve been drawing for a while.'],['creative','Full of ideas','I love imagining and making things.'],['guided','Create beside a teacher','Show me the steps, then let me try.'],['explorer','My own creative adventure','Give me a starting point and room to explore.']].map(v=>choice('identity',...v)).join('')}</div>`;
        if(step===5)content=`<div class="start-options">${choice('pace','guided','A little trail to follow','Suggest a starting point, then what to try next.')}${choice('pace','explore','An open studio','Show me the possibilities. I’ll choose my next stop.')}</div><p class="start-note">This is a recommendation preference. Course access stays based on your membership.</p>`;
        dialog.innerHTML=`<header><span>FEI TEAMART / BEFORE YOU START</span><span>${step+1} / 7</span></header><div class="start-progress" aria-label="Step ${step+1} of 7">${titles.map((_,i)=>`<i class="${i<=step?'lit':''}"></i>`).join('')}</div><div class="start-scene"><div class="start-guide"><svg width="110" height="110" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="startArtchiBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e9d5ff"/>
            <stop offset="50%" stop-color="#c4b5fd"/>
            <stop offset="100%" stop-color="#a78bfa"/>
          </linearGradient>
          <linearGradient id="startArtchiWing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.85"/>
            <stop offset="50%" stop-color="#fda4af" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#c4b5fd" stop-opacity="0.85"/>
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="92" rx="22" ry="4" fill="rgba(0,0,0,0.08)"/>
        <path d="M 22 50 Q 5 32 12 55 Q 18 70 32 62 Z" fill="url(#startArtchiWing)" opacity="0.9"/>
        <path d="M 78 50 Q 95 32 88 55 Q 82 70 68 62 Z" fill="url(#startArtchiWing)" opacity="0.9"/>
        <ellipse cx="50" cy="62" rx="22" ry="26" fill="url(#startArtchiBody)"/>
        <ellipse cx="50" cy="40" rx="20" ry="18" fill="url(#startArtchiBody)"/>
        <path d="M 34 28 Q 34 16 44 18 L 56 18 Q 66 16 66 28 Z" fill="#8b5cf6"/>
        <circle cx="50" cy="16" r="3.5" fill="#c8a96e"/>
        <path d="M 34 26 Q 38 20 42 26 Q 40 30 34 28 Z" fill="#c4b5fd"/>
        <path d="M 66 26 Q 62 20 58 26 Q 60 30 66 28 Z" fill="#c4b5fd"/>
        <g class="artchi-eye">
          <circle cx="42" cy="43" r="3.5" fill="#1a1d2b"/>
          <circle cx="58" cy="43" r="3.5" fill="#1a1d2b"/>
          <circle cx="43" cy="42" r="1" fill="#fff"/>
          <circle cx="59" cy="42" r="1" fill="#fff"/>
        </g>
        <circle cx="36" cy="50" r="2.5" fill="#fda4af" opacity="0.7"/>
        <circle cx="64" cy="50" r="2.5" fill="#fda4af" opacity="0.7"/>
        <path d="M 46 50 Q 50 53 54 50" stroke="#1a1d2b" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <ellipse cx="35" cy="72" rx="9" ry="6" fill="#fff"/>
        <circle cx="31" cy="70" r="2" fill="#ef4444"/>
        <circle cx="36" cy="70" r="2" fill="#f59e0b"/>
        <circle cx="34" cy="75" r="2" fill="#1d9e75"/>
        <circle cx="39" cy="74" r="2" fill="#3b82f6"/>
      </svg><span>ARTCHI</span></div><div><p class="start-eyebrow">${step===6?'YOUR FIRST SPARKS':'A SMALL HELLO. A BIG CREATIVE WORLD.'}</p><h1 id="start-title" tabindex="-1">${titles[step]}</h1><div class="start-speech" role="note" aria-label="Artchi says"><span class="start-speech-name">ARTCHI</span><p>${hints[step]}</p></div></div></div><main>${content}</main><p id="start-error" role="alert"></p><footer><button type="button" id="start-back" ${step===0?'disabled':''}>← Back</button><span>You can change these later.</span><button type="button" id="start-next" ${valid()?'':'disabled'}>${step===6?'Save & enter my studio ✦':step===5?'Find my sparks ✦':'Next →'}</button></footer>`;
        // The final preview is informational; only the visual-choice step changes preferences.
        if(step===6)dialog.querySelector('main').innerHTML=cards(recommend(d),true).replace(/<a href="[^"]*">/g,'<article>').replace(/<\/a>/g,'</article>')+`<p class="start-note">${d.pace==='guided'?'Your suggested trail, in order.':'Your open studio. Choose any spark.'} Save below to keep your picks.</p>`;
        dialog.querySelectorAll('[data-field]').forEach(b=>b.onclick=()=>{let f=b.dataset.field,v=b.dataset.value;if(Array.isArray(d[f]))d[f]=d[f].includes(v)?d[f].filter(x=>x!==v):[...d[f],v];else d[f]=v;render();dialog.querySelector(`[data-field="${f}"][data-value="${CSS.escape(v)}"]`)?.focus();});
        const batchButton=dialog.querySelector('#start-batch');
        if(batchButton)batchButton.onclick=()=>{batch=1-batch;render();dialog.querySelector('#start-batch').focus();};
        const motionButton=dialog.querySelector('#start-motion');
        if(motionButton)motionButton.onclick=()=>{const img=dialog.querySelector('[data-motion]');const playing=motionButton.getAttribute('aria-pressed')==='true';img.src=playing?img.dataset.poster:img.dataset.motion;motionButton.setAttribute('aria-pressed',String(!playing));motionButton.textContent=playing?'Play 3-second glimpse':'Pause glimpse';};
        const otherInput=dialog.querySelector('#start-other-interest');if(otherInput)otherInput.oninput=()=>{d.otherInterest=otherInput.value;dialog.querySelector('#start-next').disabled=!valid();};
        const input=dialog.querySelector('#start-name');if(input)input.oninput=()=>{d.name=input.value;dialog.querySelector('#start-next').disabled=!valid();};
        dialog.querySelector('#start-back').onclick=()=>{step--;render();dialog.querySelector('h1').focus();};
        dialog.querySelector('#start-next').onclick=async()=>{
          if(busy||!valid())return;
          if(step<6){step++;render();dialog.querySelector('h1').focus();return;}
          busy=true;dialog.querySelector('#start-next').disabled=true;dialog.querySelector('#start-back').disabled=true;
          const preferences={...d,otherInterest:d.interests.includes('Others')?d.otherInterest.trim():'',name:d.name.trim(),version:VERSION,completed_at:new Date().toISOString(),recommendations:recommend(d).map(c=>c.id)};
          try{
            const {error}=await window.FEIAuth.getClient().auth.updateUser({data:{art_preferences:preferences,name:preferences.name}});
            if(error)throw error;
            user.user_metadata={...user.user_metadata,art_preferences:preferences,name:preferences.name};
            dialog.close();dialog.remove();active=null;previous?.focus();resolve(preferences);
          }catch(e){dialog.querySelector('#start-error').textContent='Your picks are still here. We couldn’t save them — please try again.';busy=false;dialog.querySelector('#start-next').disabled=false;dialog.querySelector('#start-back').disabled=false;}
        };
      }
      dialog.addEventListener('cancel',e=>e.preventDefault());render();dialog.showModal();dialog.querySelector('input')?.focus();
    });return active;
  }
  function mount(user,preferences,onChange){
    document.getElementById('fei-personal-picks')?.remove();
    if (!eligible(user) || !preferences) return;
    const hero=document.querySelector('#home-screen .hero');if(!hero)return;
    const section=document.createElement('section');section.id='fei-personal-picks';section.className='fei-picks';
    section.setAttribute('aria-labelledby','fei-recommended-title');
    section.innerHTML=`<div class="start-recommend-heading"><div><h2 id="fei-recommended-title">Recommended courses for you</h2><p>${preferences.pace==='guided'?'A suggested order, based on your interests.':'Courses to explore, based on your interests.'}</p></div><button type="button">Edit interests ↗</button></div><ol class="start-course-list">${recommend(preferences).map(c=>`<li><a href="${c.href}"><span><strong>${c.title}</strong><small>${c.hint}</small></span><span aria-hidden="true">↗</span></a></li>`).join('')}</ol>`;
    section.querySelector('button').onclick=async()=>{const next=await open(user,true);if(!next)return;onChange(next);const name=document.getElementById('hero-name');if(name)name.textContent=next.name;mount(user,next,onChange);};
    hero.after(section);
  }
  window.FEIOnboarding={open,mount,recommend};
})();
