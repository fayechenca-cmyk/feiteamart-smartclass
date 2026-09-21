window.COLOR_LAB = {
  id: 'color-lab-01',
  title: 'Color Practice',
  stages: [
    { id:'opening', label:'Welcome' },
    { id:'prepare', label:'Prepare' },
    { id:'primaries', label:'Start' },
    { id:'warm', label:'Yellow to red' },
    { id:'violet', label:'Red to blue' },
    { id:'green', label:'Blue to yellow' },
    { id:'three', label:'All three' },
    { id:'white', label:'White' },
    { id:'black', label:'Black' },
    { id:'palette', label:'Palette' },
    { id:'reflect', label:'Finish' }
  ],
  materials: [
    ['#dc493a','Red paint'], ['#e6b633','Yellow paint'], ['#315e9f','Blue paint'],
    ['#292726','Black'], ['#f9f6ed','White'], ['🖌️','Brush'], ['💧','Water cup'],
    ['🎨','Palette'], ['▱','Paint paper'], ['◫','Cloth']
  ],
  mixes: {
    warm: { from:'#e6b633', to:'#dc493a', names:['Yellow','Golden yellow','Orange','Red-orange','Red-rich orange'],
      colors:['#e6b633','#e39a31','#dd762f','#d95834','#d45137'], prompt:'Add a little red.', idea:'Even the last mix still contains some yellow.' },
    violet: { from:'#dc493a', to:'#315e9f', names:['Red','Red-violet','Violet','Blue-violet','Blue-rich violet'],
      colors:['#dc493a','#a44667','#754982','#514f91','#3d5692'], prompt:'Add a little blue.', idea:'Even the last mix still contains some red.' },
    green: { from:'#315e9f', to:'#e6b633', names:['Blue','Blue-green','Green','Yellow-green','Yellow-rich green'],
      colors:['#315e9f','#327d78','#47935b','#91a842','#c4b43d'], prompt:'Move the color balance.', idea:'Even the last mix still contains some blue, so it is not pure yellow.' }
  }
};
