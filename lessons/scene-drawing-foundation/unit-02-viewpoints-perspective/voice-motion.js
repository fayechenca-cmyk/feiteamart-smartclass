// Drive all guidance from the audio clock, including pause, replay and seeking.
const VoiceMotion = (() => {
  const audio = document.getElementById('step-audio');
  const caption = document.getElementById('voice-caption');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let cues = [], frame = 0, touched = [];
  const lengths = new WeakMap();
  function clearTargets() {
    for (const node of touched) {
      node.classList.remove('voice-highlight');
      node.style.removeProperty('--voice-glow');
      node.style.removeProperty('stroke-dasharray');
      node.style.removeProperty('stroke-dashoffset');
    }
    touched = [];
  }
  function visible(node) { return !node.closest('[hidden]'); }
  function targetsFor(sentence) {
    const tags = [];
    if (/camera|look.*(up|down)|eye level/i.test(sentence)) tags.push('camera');
    if (/eye|face|head/i.test(sentence)) tags.push('face');
    if (/horizon|height/i.test(sentence)) tags.push('horizon');
    if (/vanishing|purple|dot|drag|point/i.test(sentence)) tags.push('vp');
    if (/line|road|pavement|floor|wall|room|direction|space|ground|corner/i.test(sentence)) tags.push('space');
    if (/person|friend|character|feet|body|figure|hand/i.test(sentence)) tags.push('character');
    if (/background|building|tree|desk|shelf|shape/i.test(sentence)) tags.push('background');
    if (/teacher|reference/i.test(sentence)) tags.push('reference');
    const nodes = Array.from(document.querySelectorAll('[data-focus]')).filter(node => visible(node) && tags.some(tag => node.dataset.focus.split(' ').includes(tag)));
    if (nodes.length) return nodes;
    return [document.querySelector('#intro-stage svg'),document.getElementById('picture'),document.querySelector('.reference-frame'),document.querySelector('.finish-icons')].filter(visible);
  }
  function update() {
    clearTargets();
    const cue = cues.find(item => audio.currentTime >= item.start && audio.currentTime < item.end);
    caption.hidden = !cue;
    caption.textContent = cue?.text || '';
    if (!cue) return;
    const progress = Math.min(1, Math.max(0, (audio.currentTime-cue.start)/(cue.end-cue.start)));
    const glow = reduceMotion.matches ? 3 : 3 + 3 * Math.sin(progress*Math.PI*3)**2;
    for (const target of targetsFor(cue.text)) {
      target.classList.add('voice-highlight');
      target.style.setProperty('--voice-glow',glow+'px');touched.push(target);
      // Reveal construction strokes only when the sentence describes building them.
      if (!reduceMotion.matches && /follow|add|grow|open|draw.*line|passes.*through/i.test(cue.text) && /space|background|horizon/.test(target.dataset.focus||'')) {
        for (const path of target.querySelectorAll('path')) {
          let length=lengths.get(path);
          if (length===undefined) {length=path.getTotalLength();lengths.set(path,length);}
          path.style.strokeDasharray=String(length);
          path.style.strokeDashoffset=String(length*(1-Math.min(1,progress*2.5)));
          touched.push(path);
        }
      }
    }
  }
  function loop(){update();if(!audio.paused&&!audio.ended)frame=requestAnimationFrame(loop)}
  function halt(){cancelAnimationFrame(frame);frame=0}
  function reset(){halt();clearTargets();caption.hidden=true;caption.textContent='';document.body.classList.remove('voice-guiding')}
  function setSource(src){reset();cues=(typeof NARRATION_TIMINGS==='undefined'?{}:NARRATION_TIMINGS)[src]||[];}
  audio.addEventListener('play',()=>{halt();document.body.classList.add('voice-guiding');loop()});
  audio.addEventListener('pause',()=>{halt();update()});
  audio.addEventListener('seeked',update);
  audio.addEventListener('ended',reset);
  return {setSource,reset};
})();
