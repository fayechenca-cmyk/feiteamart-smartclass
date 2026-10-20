/* A short observation exercise adapted from the original rotating-apple lesson. */
window.AppleIntro = (() => {
  function mount(host, kind, done) {
    if (kind === 'appleNotice') return notice(host, done);
    return rotate(host, done);
  }
  function rotate(host, done) {
    host.innerHTML = `<div class="apple-explore" aria-label="Turn the apple to compare its shape">
      <div class="apple-copy"><small>LOOK BEFORE YOU DRAW</small><strong>Same sphere. Different character.</strong><span id="appleAngle">Front view · 0°</span></div>
      <div class="apple-turner"><button id="turnLeft" aria-label="Turn apple left">‹</button><div id="appleTurnStage" role="img" aria-label="An illustrated apple that changes view when turned"><svg id="appleTurnSvg" viewBox="0 0 400 400" aria-hidden="true"><defs><radialGradient id="appleSkin" cx="35%" cy="25%" r="75%"><stop offset="0" stop-color="#f7d497"/><stop offset=".48" stop-color="#e77965"/><stop offset="1" stop-color="#8e5367"/></radialGradient><filter id="appleSoft"><feGaussianBlur stdDeviation="13"/></filter></defs><ellipse cx="200" cy="352" rx="115" ry="15" fill="#4d4663" opacity=".19" filter="url(#appleSoft)"/><g id="appleDrawing"></g><circle id="sphereGhost" cx="200" cy="198" r="116" fill="none" stroke="#675099" stroke-width="3" stroke-dasharray="8 8" opacity="0"/></svg></div><button id="turnRight" aria-label="Turn apple right">›</button></div>
      <div class="apple-clues"><button id="showSphere" type="button" aria-pressed="false">Show the sphere inside</button><span>↔ Drag or tap arrows</span><span id="appleRotateCheck">Find the changing top and two uneven sides</span></div></div>`;
    const drawing=host.querySelector('#appleDrawing'), label=host.querySelector('#appleAngle'), check=host.querySelector('#appleRotateCheck');
    let angle=0,travel=0,finished=false,dragX=null;
    function render(){
      const rad=angle*Math.PI/180, width=105+15*Math.cos(2*rad), lean=10*Math.sin(rad), stem=14*Math.sin(rad), dip=8+5*Math.cos(rad);
      const left=200-width+lean, right=200+width+lean;
      drawing.innerHTML=`<path d="M ${200+lean} ${78+dip} C ${158+lean} 54 ${left-7} 66 ${left} 129 C ${left-14} 198 ${left+24} 315 178 333 C 195 342 209 342 224 333 C ${right-20} 312 ${right+13} 198 ${right} 129 C ${right+5} 65 ${245+lean} 53 ${200+lean} ${78+dip}Z" fill="url(#appleSkin)" stroke="#65506b" stroke-width="3"/><path d="M ${171+lean} ${78+dip} Q ${200+lean} ${99+dip*1.2} ${230+lean} ${78+dip}" fill="none" stroke="#714e67" stroke-width="3" opacity=".65"/><path d="M ${200+lean+stem} ${87+dip} Q ${199+lean+stem} 56 ${208+lean+stem} 45" fill="none" stroke="#5c4a3d" stroke-width="6" stroke-linecap="round"/><path d="M ${211+lean+stem} 58 Q ${245+lean+stem} 30 ${256+lean+stem} 51 Q ${237+lean+stem} 73 ${211+lean+stem} 58Z" fill="#8baa7d" opacity=".9"/><path d="M ${left+37} 180 Q ${left+14} 261 193 314" fill="none" stroke="#774e65" stroke-width="7" opacity=".16"/>`;
      label.textContent=`${Math.abs(angle)<15?'Front view':Math.abs(angle)>155?'Back view':'Turning view'} · ${((angle%360)+360)%360}°`;
    }
    function turn(delta){angle=(angle+delta+360)%360;travel+=Math.abs(delta);render();if(travel>=90&&!finished){finished=true;check.textContent='✓ You noticed that this apple changes as it turns';check.classList.add('seen');done();}}
    host.querySelector('#showSphere').onclick=()=>{const b=host.querySelector('#showSphere'),g=host.querySelector('#sphereGhost'),on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.textContent=on?'Hide the sphere guide':'Show the sphere inside';g.setAttribute('opacity',on?'.75':'0');};
    host.querySelector('#turnLeft').onclick=()=>turn(-30);host.querySelector('#turnRight').onclick=()=>turn(30);
    const stage=host.querySelector('#appleTurnStage');stage.onpointerdown=e=>{dragX=e.clientX;stage.setPointerCapture(e.pointerId);};stage.onpointermove=e=>{if(dragX===null)return;const dx=e.clientX-dragX;if(Math.abs(dx)<10)return;turn(Math.max(-30,Math.min(30,Math.round(dx/3))));dragX=e.clientX;};stage.onpointerup=stage.onpointercancel=()=>{dragX=null;};render();
  }
  function notice(host, done){
    host.innerHTML=`<div class="apple-notice"><div class="apple-copy"><small>FROM SPHERE TO STILL LIFE</small><strong>Where do you see the change?</strong><span>Tap the glowing dots on the teacher’s apple.</span></div><div class="apple-photo"><div class="apple-photo-inner"><img src="reference-apple.jpg" alt="Teacher’s finished graphite apple with a stem dip, turning surface, and cast shadow"><button class="apple-hotspot" data-clue="dip" style="--x:49%;--y:34%" aria-label="Reveal stem dip">1</button><button class="apple-hotspot" data-clue="turn" style="--x:57%;--y:58%" aria-label="Reveal turning surface">2</button><button class="apple-hotspot" data-clue="shadow" style="--x:70%;--y:77%" aria-label="Reveal cast shadow">3</button></div></div><div id="appleClue" class="apple-clue" aria-live="polite">Look first, then tap a clue.</div></div>`;
    const messages={dip:'The stem sits in a dip. A perfect sphere has no dip.',turn:'The light turns across an uneven surface. Follow the apple, not an ideal circle.',shadow:'The cast shadow fixes the apple to the table.'};const seen=new Set(),clue=host.querySelector('#appleClue');
    host.querySelectorAll('.apple-hotspot').forEach(button=>button.onclick=()=>{const key=button.dataset.clue;seen.add(key);button.classList.add('seen');button.setAttribute('aria-pressed','true');clue.textContent=messages[key];if(seen.size===3){clue.textContent='✓ Dip, turning surface, cast shadow. You are ready to draw.';done();}});
  }
  return {mount};
})();
