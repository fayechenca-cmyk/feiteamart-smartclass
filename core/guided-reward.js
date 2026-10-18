/* Guided-preview rewards only. Does not grant platform badges or write account progress. */
(() => {
'use strict';
const KEY='fei.guided.course-rewards.v1';let memory=[],context=null,active=null;
function ids(){return (window.FOUNDATION_A_PATH||[]).map(x=>x.id);}
function read(){try{const p=JSON.parse(sessionStorage.getItem('fei_user_profile')||'null');return (p?.completedLessons||[]).filter(x=>ids().includes(x));}catch{return [];}}
function record(id){const after=[...new Set(read())],added=window.GuidedPlatform?.justCompleted===id;if(added)window.GuidedPlatform.justCompleted=null;return {before:Math.max(0,after.length-(added?1:0)),after:after.length,total:ids().length||11,added};}
function fanfare(muted){if(muted)return null;try{context ||= new (window.AudioContext||window.webkitAudioContext)();context.resume();const master=context.createGain();master.gain.value=.18;master.connect(context.destination);const base=context.currentTime;
[[523.25,0,.16],[659.25,.18,.16],[783.99,.36,.18],[1046.5,.58,.75],[659.25,.58,.75],[783.99,.58,.75]].forEach(([hz,delay,duration])=>{const o=context.createOscillator(),g=context.createGain(),t=base+delay;o.type='triangle';o.frequency.value=hz;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g).connect(master);o.start(t);o.stop(t+duration+.03);});return master;}catch{return null;}}
window.GuidedReward={record,read,complete(options){
 if(active)return active;
 const state=options.preview?{before:0,after:1,total:ids().length||11,added:true}:record(options.lessonId),badge=(window.BADGE_CATALOG||[]).find(x=>x.id==='basic_sketch');
 let muted=!!options.muted,sound=null;
 const dialog=document.createElement('dialog');dialog.className='guided-reward';dialog.setAttribute('aria-labelledby','rewardTitle');
 dialog.innerHTML=`<div class="reward-sparkles" aria-hidden="true">✦ <span>✧</span> ✦</div><small>ONE MORE STEP ON YOUR JOURNEY</small><h2 id="rewardTitle"></h2><div class="reward-artchi"><img class="reward-character" src="../../../core/dashboard-artchi.svg" alt="Artchi holding your growing sketch medal"><div class="reward-medal"><div class="medal-base"><img alt="" src="${badge?.imgUrl||''}"></div><div class="medal-color"><img alt="Basic Sketch badge artwork by Alex" src="${badge?.imgUrl||''}"></div><i class="medal-hand left"></i><i class="medal-hand right"></i></div></div><p class="reward-message"></p><div class="reward-segments" aria-label="Course journey progress"></div><p class="reward-count" aria-live="polite"></p><button class="reward-continue primary"></button><button class="reward-sound"></button><small class="reward-local">Your account’s learning journey</small>`;
 if(options.preview)dialog.querySelector('.reward-local').textContent='Animation preview · no progress saved';
 dialog.querySelector('h2').textContent=options.title+' complete!';
 dialog.querySelector('.reward-message').textContent=state.added?'You kept going. A little more colour is yours.':'Your colour is already saved. Lovely to see you practise again.';
 dialog.querySelector('.reward-count').textContent=`${state.after} / ${state.total} lessons · Form & Structure`;
 dialog.querySelector('.reward-segments').innerHTML=Array.from({length:state.total},(_,i)=>`<span class="${i<state.before?'lit':i<state.after?'new':''}"></span>`).join('');
 const color=dialog.querySelector('.medal-color');color.style.clipPath=`inset(${100-state.before/state.total*100}% 0 0)`;
 const next=dialog.querySelector('.reward-continue');next.textContent=options.nextLabel||'Continue →';
 const soundButton=dialog.querySelector('.reward-sound');function soundLabel(){soundButton.textContent=muted?'Sound off':'Sound on';soundButton.setAttribute('aria-pressed',String(muted));}soundLabel();
 soundButton.onclick=()=>{muted=!muted;if(sound)sound.gain.value=muted?0:.18;options.onMutedChange?.(muted);soundLabel();};
 document.body.append(dialog);dialog.showModal();sound=fanfare(muted);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{color.style.clipPath=`inset(${100-state.after/state.total*100}% 0 0)`;dialog.classList.add('reward-lit');}));
 active=new Promise(resolve=>{function finish(go){if(sound)sound.gain.value=0;dialog.close();dialog.remove();active=null;resolve(go);}next.onclick=()=>finish(true);dialog.addEventListener('cancel',e=>{e.preventDefault();finish(false);});});return active;
}};
})();
