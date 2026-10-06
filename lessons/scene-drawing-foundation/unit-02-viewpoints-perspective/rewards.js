// Local practice milestones, separate from official course completion and badges.
const PracticeReward=(()=>{
 const key='fei_viewpoints_practice_v1',panel=document.getElementById('reward-panel');
 let state={completed:[],sound:true},pending=null,context;
 try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved&&Array.isArray(saved.completed))state={completed:saved.completed,sound:saved.sound!==false}}catch{}
 function save(){try{localStorage.setItem(key,JSON.stringify(state))}catch{}}
 function sound(){
  if(!state.sound)return;
  try{context??=new(window.AudioContext||window.webkitAudioContext)();context.resume().then(()=>{
   [523.25,659.25,783.99].forEach((frequency,i)=>{const oscillator=context.createOscillator(),gain=context.createGain(),t=context.currentTime+i*.11;oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.07,t+.018);gain.gain.exponentialRampToValueAtTime(.001,t+.3);oscillator.connect(gain);gain.connect(context.destination);oscillator.start(t);oscillator.stop(t+.32)});
  }).catch(()=>{})}catch{}
 }
 const toggle=document.getElementById('reward-sound');
 function label(){toggle.textContent=state.sound?'Reward sound on':'Reward sound off';toggle.setAttribute('aria-pressed',String(state.sound))}
 toggle.onclick=()=>{state.sound=!state.sound;save();label()};label();
 function celebrate(stage,done){
  const review=stage.kind==='review',id=review?'review':`angle-${stage.lesson}-story-${stage.story}`;
  if(state.completed.includes(id)){done();return}
  state.completed.push(id);save();StepVoice.stop();
  const wholeAngle=!review&&[0,1,2].every(story=>state.completed.includes(`angle-${stage.lesson}-story-${story}`));
  document.getElementById('reward-title').textContent=review?'Three viewpoints explored!':wholeAngle?['Normal Shot complete!','Low Angle complete!','High Angle complete!'][stage.lesson]:'Story sketch complete!';
  document.getElementById('reward-message').textContent=review?'You told one story from three different viewpoints.':wholeAngle?'You finished all three story sketches.':'You turned a simple space into your own drawing.';
  pending=done;panel.showModal();sound();document.getElementById('reward-continue').focus();
 }
 function close(){panel.close();const done=pending;pending=null;if(done)done()}
 document.getElementById('reward-continue').onclick=close;
 panel.addEventListener('cancel',event=>{event.preventDefault();close()});
 return {celebrate};
})();
