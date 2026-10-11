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
      studio.insertAdjacentHTML('beforeend', `<section class="micro-lab watch-palette" data-lab><h3>Analogous colors used in this wash</h3><p>Watch how one color flows into the next.</p><div class="watch-swatches">${[
        ['Yellow','#efcf4f'],['Yellow-orange','#eda447'],['Red','#df544f'],['Rose','#cf3f78'],['Violet','#7d479e']
      ].map(([name,color])=>`<span style="--c:${color}"><i></i><b>${name}</b></span>`).join('<em>→</em>')}</div><p class="check-msg">No tapping needed—use this as your visual guide while you watch.</p></section>`);
      finishInteraction('No tapping needed—use this as your visual guide while you watch.');
    } else if (step === 1) {
      const row = colors => colors.map(([name,color])=>`<span style="--c:${color}"><i></i><b>${name}</b></span>`).join('');
      studio.insertAdjacentHTML('beforeend', `<section class="micro-lab side-palettes" data-lab><h3>Two sides, two color directions</h3><div class="palette-sides"><div><strong>LEFT SIDE · COOLER LAYER</strong><div class="watch-swatches">${row([['Rose violet','#a64091'],['Red','#d94d57'],['Blue-violet','#654da1'],['Blue','#496daf']])}</div></div><div><strong>RIGHT SIDE · WARMER, DEEPER LAYER</strong><div class="watch-swatches">${row([['Deep yellow','#d2aa37'],['Yellow-orange','#e59843'],['Red','#d94d57'],['Rose violet','#a64091']])}</div></div></div><p class="check-msg">Watch where the cool family and warm family stay transparent over the first wash.</p></section>`);
      finishInteraction('Watch where the cool family and warm family stay transparent over the first wash.');
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
