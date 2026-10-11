(() => {
  const lesson = document.querySelector('#lesson');
  const map = document.querySelector('#map');

  document.querySelector('[data-ready]')?.addEventListener('click', () => {
    document.querySelector('[data-step="0"]')?.click();
  });

  const finishInteraction = (message) => {
    const done = lesson.querySelector('[data-done]');
    const status = lesson.querySelector('.check-msg');
    if (done) done.disabled = false;
    if (status) status.textContent = message;
  };

  const choices = (items, prompt, multi = false) => `
    <section class="micro-lab" data-lab>
      <h3>${prompt}</h3>
      <p>${multi ? 'Choose the three colors that belong together.' : 'Choose one answer.'}</p>
      <div class="choice-row">${items.map((x, i) => `<button data-choice="${i}" style="--c:${x.color}"><i></i>${x.name}</button>`).join('')}</div>
      <p class="check-msg" role="status"></p>
    </section>`;

  function mountLab() {
    if (!lesson.classList.contains('active') || lesson.querySelector('[data-lab]')) return;
    const kicker = lesson.querySelector('.kicker')?.textContent || '';
    const step = Number(kicker.match(/STEP (\d)/)?.[1] || 0) - 1;
    if (step < 0) return;
    const studio = lesson.querySelector('.studio');
    const done = lesson.querySelector('[data-done]');
    if (!studio || !done) return;
    const frame = lesson.querySelector('iframe');
    if (step === 0 && frame && !frame.src.includes('muted=true')) {
      frame.src += '&muted=true';
      frame.title = `${frame.title} · muted classroom video`;
      lesson.querySelector('.video')?.insertAdjacentHTML('beforeend', '<span class="muted-video-label">Muted classroom video</span>');
    }
    done.disabled = true;

    if (step === 0) {
      studio.insertAdjacentHTML('beforeend', choices([
        {name:'Yellow',color:'#efcf4f',ok:true},{name:'Yellow-orange',color:'#eda447',ok:true},{name:'Red',color:'#df665b',ok:true},
        {name:'Rose violet',color:'#a64091'},{name:'Green',color:'#53916b'},{name:'Blue',color:'#5365ad'}
      ], 'Build the analogous family used in the video', true));
      const selected = new Set();
      lesson.querySelectorAll('[data-choice]').forEach(button => button.onclick = () => {
        const i = Number(button.dataset.choice); button.classList.toggle('on');
        button.classList.contains('on') ? selected.add(i) : selected.delete(i);
        if (selected.size === 3) {
          if ([...selected].every(n => n < 3)) { selected.forEach(n => lesson.querySelector(`[data-choice="${n}"]`).classList.add('good')); finishInteraction('Yes—yellow, yellow-orange and red move as one warm neighboring family.'); }
          else lesson.querySelector('.check-msg').textContent = 'Look for the three warm colors used together in the first wash.';
        }
      });
    } else if (step === 1) {
      studio.insertAdjacentHTML('beforeend', choices([{name:'Violet',color:'#7d479e',ok:true},{name:'Orange',color:'#e58b45'},{name:'Green',color:'#55916f'}], 'Which color can quiet the yellow layer?'));
      lesson.querySelectorAll('[data-choice]').forEach((button, i) => button.onclick = () => {
        lesson.querySelectorAll('[data-choice]').forEach(x => x.classList.remove('on'));
        button.classList.add('on');
        if (i === 0) { button.classList.add('good'); finishInteraction('Good choice. Violet is yellow’s complement. Use it lightly so the warm base still shows.'); }
        else lesson.querySelector('.check-msg').textContent = 'Try the cool opposite family shown in the teacher video.';
      });
    } else if (step === 2) {
      studio.insertAdjacentHTML('beforeend', `<section class="micro-lab" data-lab><h3>Keep the first layer visible</h3><p>Move the slider until both the warm base and cool upper layer can be seen.</p><div class="wash-lab"><span>transparent watercolor layers</span></div><input data-layer-range type="range" min="0" max="100" value="75" aria-label="Upper color layer strength"><p class="check-msg"></p></section>`);
      const range = lesson.querySelector('[data-layer-range]');
      range.oninput = () => {
        lesson.querySelector('.wash-lab').style.setProperty('--layer', Number(range.value) / 100);
        if (range.value >= 25 && range.value <= 62) finishInteraction('Balanced—the upper color is present, but the first wash can still breathe through.');
        else { done.disabled = true; lesson.querySelector('.check-msg').textContent = range.value > 62 ? 'Too opaque—let more of the first wash show.' : 'Too faint—add a little more of the second layer.'; }
      };
      range.oninput();
    } else if (step === 3) {
      studio.insertAdjacentHTML('beforeend', choices([{name:'Long',color:'#d83383'},{name:'Round',color:'#8f419b'},{name:'Pointed',color:'#5365ad'}], 'Collect three different petal shapes', true));
      const picked = new Set();
      lesson.querySelectorAll('[data-choice]').forEach((button, i) => { button.querySelector('i').classList.add('petal-icon'); button.onclick=()=>{button.classList.toggle('on');button.classList.contains('on')?picked.add(i):picked.delete(i);if(picked.size===3)finishInteraction('A varied petal family is ready to cut from your painted paper.');}; });
    } else if (step === 4) {
      studio.insertAdjacentHTML('beforeend', `<section class="micro-lab" data-lab><h3>Build from the bottom layer upward</h3><p>Tap “Add a petal” until your flower overlaps into a complete bloom.</p><div class="arrange-board" data-board></div><button class="btn" data-add-petal>Add a petal</button><p class="check-msg"></p></section>`);
      let count=0; lesson.querySelector('[data-add-petal]').onclick=()=>{const colors=['#d83383','#8f419b','#5365ad'];lesson.querySelector('[data-board]').insertAdjacentHTML('beforeend',`<i style="--c:${colors[count%3]};--r:${count*47}deg"></i>`);count++;if(count>=5)finishInteraction('Your petals now overlap into one flower. Arrange the real pieces before gluing.');};
    } else {
      studio.insertAdjacentHTML('beforeend', choices([{name:'Cut edge lines',color:'#d83383'},{name:'Blue marker family',color:'#5365ad'},{name:'Stop here',color:'#8f419b'}], 'Choose your optional finish'));
      lesson.querySelectorAll('[data-choice]').forEach(button=>button.onclick=()=>{button.classList.add('good');finishInteraction(`${button.textContent.trim()} selected. Optional means the artwork is also complete without it.`);});
    }
  }

  new MutationObserver(mountLab).observe(lesson, {childList:true,subtree:true,attributes:true});
  if (!map.hidden) document.querySelector('.journey')?.setAttribute('aria-label','Six-step Color Bloom Collage course map');
})();
