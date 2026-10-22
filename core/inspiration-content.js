/* Get Inspired content. Draft records never produce a Start action. */
window.FEIInspirationContent = {
  stations: [
    {id:'material',title:'Material Playground',subtitle:'What can this material do?',objects:'Paint, paper, brushes and texture swatches',art:'material',x:79,y:75,color:'#eed3a9',guidance:"Let's see what these materials can do!"},
    {id:'visual',title:'Visual Language',subtitle:'Can lines and shapes express a feeling?',objects:'An easel, marks, shapes and a palette',art:'color',x:13,y:75,color:'#c9dce9',guidance:'Follow a line. Change its rhythm.'},
    {id:'observation',title:'Look Closer',subtitle:'Train your eyes. Discover more.',objects:'A sketchbook, pencils, photographs and a timer',art:'observation',x:30,y:58,color:'#f4edb9',guidance:'Look carefully. You might notice something new!'},
    {id:'shape',title:'Shape Playground',subtitle:'Turn simple shapes into surprising ideas.',objects:'A drafting desk with circles, triangles and squares',art:'shape',x:47,y:79,color:'#ded2ea',guidance:'How many ideas can one shape become?'},
    {id:'light',title:'Light & Mood',subtitle:'See how visual choices change a feeling.',objects:'A lamp, a shadow study and composition boards',art:'character',x:78,y:48,color:'#d5dfd0',guidance:'Notice where the light takes your eye.'},
    {id:'thinking',title:'Think About Art',subtitle:'Look at art. Ask questions. Explore different ideas.',objects:'Art books, a small exhibition wall and question notes',art:'project',x:49,y:10,color:'#e5d9c8',guidance:'Start with something you notice. What makes you curious?'}
  ],
  activities: [
    {id:'quick-sketch',stationId:'observation',title:'Quick Sketch',description:'Choose a set of animals, flowers or objects. Sketch each picture for 30, 60 or 120 seconds.',mode:'physical-practice',materials:'Paper and a pencil',thumbnail:'../assets/inspiration/animals-3b2d8f8d3a.jpg',published:true,kind:'sketch'},
    {id:'memory-practice',stationId:'observation',title:'Look, Hide, Remember',description:'Observe a photograph for 10 seconds, draw from memory, then reveal it to compare.',mode:'physical-practice',materials:'Paper and a pencil',thumbnail:'../color-lab/assets/materials-reference.png',published:true,kind:'memory'},
    {id:'visual-memory-video',stationId:'observation',title:'Training Your Visual Memory',description:'Watch the FEI TeamArt demonstration, then try looking, hiding and recalling a photograph.',mode:'video-guided',published:true,kind:'video',videoId:'rHx81caDLTE',challenge:'Notice three large shapes. Try the memory practice, then compare what stayed with you.'},
    {id:'color-mixing',stationId:'material',title:'Play With Colors',description:'Drag two colors together and discover the new mix in the original Color Magic lab.',mode:'interactive',thumbnail:'../assets/creation-intro/mixed.jpg',existingRoute:'../lessons/color-magic/step-3/',lessonId:'color-magic',published:true,kind:'existing'},
    {id:'texture-discovery',stationId:'material',title:'Texture Discovery',description:'Compare painted surfaces, then make a mark on your own paper.',mode:'physical-practice',published:false,missing:'Standalone texture activity pending; original Chameleon tools remain available'},
    {id:'line-language',stationId:'visual',title:'The Language of Lines',description:'Change direction, thickness and repetition. Notice how the same line begins to feel different.',mode:'interactive',published:true,kind:'lines'},
    {id:'automatism',stationId:'shape',title:'Draw Without Knowing',description:'Explore the original Miró lesson and let an unplanned line suggest an idea.',mode:'hybrid',existingRoute:'../lessons/miro-draw-without-knowing/',lessonId:'miro-draw-without-knowing',published:true,kind:'existing'},
    {id:'shape-creation-1',stationId:'shape',title:'Transforming Shape to Creation 1',description:'Watch the FEI TeamArt demonstration, then transform a simple shape on your own paper.',mode:'video-guided',published:true,kind:'video',videoId:'Dn5buTqRQgk',challenge:'Draw a circle, triangle or square. Turn it into three different things. Which idea surprised you?'},
    {id:'gun-shape-creation',stationId:'shape',title:'Shapes to Creation',description:'Explore a second FEI TeamArt shape transformation demonstration.',mode:'video-guided',published:true,kind:'video',videoId:'_KrF09U6W68',challenge:'Choose an outline from the demonstration. Rotate it on your paper and imagine another possibility.'},
    {id:'light-study',stationId:'light',title:'Light & Mood',description:'A light and composition experiment is being prepared for this work area.',mode:'interactive',published:false,missing:'Activity and approved reference images pending'},
    {id:'art-conversations',stationId:'thinking',title:'An Artwork, Two Questions',description:'An attributed artwork and close-looking prompts will be added here.',mode:'hybrid',published:false,missing:'Authorized artwork and attribution required'}
  ],
  // Existing FEI photographic assets, visually inspected. No generated subjects.
  references: [
    ...(window.FEIInspirationPhotos||[]),
    {id:'paint-table',category:'objects',title:'Paint tubes and a palette',url:'../color-lab/assets/materials-reference.png',alt:'Photograph of paint tubes, a mixing palette, water and a brush on a cutting mat',source:'Existing Color Practice teacher materials photograph'},
    {id:'two-pencils',category:'objects',title:'Two well-used pencils',url:'../material-art/cardboard/assets/pencils.png',alt:'Photograph of two sharpened wooden pencils',source:'Existing Cardboard course pencil photograph'}
  ]
};
