/* Curated completed works. Provenance: docs/creation-artwork-manifest.json.
   Student book examples are explicitly approved by the owner and labelled. */
(() => {
  const asset=(name,alt,width,height,crop)=>({url:'../assets/creation-gallery/'+name+'.jpg',alt,width,height,crop});
  Object.assign(FEICreationAssets.finalArtworkCovers,{
    'color-magic':asset('color-magic','Teacher’s finished colorful leaf painting',1000,562,[.154,0,.694,1]),
    'zodiac-skill':asset('zodiac-rat','Teacher’s finished zodiac rat ink painting',1000,562,[.554,.14,.446,.728]),
    'dancing-ballerina':asset('ballerina','Teacher’s finished articulated ballerina',1000,562,[.23,0,.51,1]),
    'lfc017':asset('basquiat','Teacher’s finished Basquiat-inspired drawing',1000,562,[.06,.01,.72,.97]),
    'lfc018':asset('pop-art','Teacher’s finished Pop Art portrait',1000,562,[.27,.02,.40,.97]),
    'kandinsky-music-into-shape':asset('kandinsky','Teacher’s finished three-dimensional rhythm artwork',1000,562,[.08,0,.86,1]),
    'thiebaud-my-sweet-fridge':asset('fridge','Teacher’s finished sweet fridge collage',1000,562,[.17,.05,.64,.85]),
    'lfc054':asset('surrealism','Teacher’s finished surreal illustration',1000,562,[0,0,.85,.96]),
    'dream-art-studio':asset('dream-studio','Faye’s completed handmade miniature art studio',1024,768),
    'rousseau-jungle':asset('rousseau','Teacher’s completed layered paper jungle',1000,562),
    'yokai-in-the-great-wave':asset('yokai','Teacher’s finished imagined cats in the Great Wave painting',537,768),
    'my-magical-city':asset('magical-city','Teacher’s finished colorful city painting',768,768),
    'first-illustration-book':asset('coraline-book','Coraline’s finished illustrated book artwork — student example',1400,980),
    'carle-colorful-chameleon':asset('chameleon','Teacher’s finished chameleon collage',1028,768),
    'miro-draw-without-knowing':asset('miro','Teacher’s finished Miró-inspired watercolor',983,768),
    'color-bloom-collage':asset('color-bloom','Teacher’s finished watercolor flower collage',910,1400)
  });
  FEICreationAssets.details={
    'color-magic':{categories:['painting','learn-from-masters'],artist:'Henri Matisse'},
    'zodiac-skill':{title:'Zodiac Brush Technique',desc:'Paint the twelve zodiac animals with ink and a brush. Start with the rat, in the same course available in Skill.',route:'../lessons/zodiac-skill/',gateInLesson:true,categories:['painting'],tags:['Ink Painting','Zodiac Animals','Brush Technique'],crossListing:'Also in Skill'},
    'dancing-ballerina':{categories:['handcrafts'],tags:['Handcrafts','Paper Doll','Stop-motion','Animation']},
    'lfc017':{categories:['learn-from-masters','painting'],artist:'Jean-Michel Basquiat'},
    'lfc018':{categories:['learn-from-masters','painting'],artist:'Andy Warhol & Roy Lichtenstein'},
    'yokai-in-the-great-wave':{categories:['learn-from-masters','painting'],artist:'Hokusai & Kuniyoshi'},
    'kandinsky-music-into-shape':{categories:['learn-from-masters','handcrafts','painting'],artist:'Wassily Kandinsky'},
    'miro-draw-without-knowing':{categories:['learn-from-masters','painting'],artist:'Joan Miró'},
    'dream-art-studio':{categories:['handcrafts','learn-from-masters'],artist:'Henri Matisse'},
    'carle-colorful-chameleon':{categories:['handcrafts','learn-from-masters'],artist:'Eric Carle'},
    'rousseau-jungle':{categories:['handcrafts','learn-from-masters'],artist:'Henri Rousseau'},
    'thiebaud-my-sweet-fridge':{categories:['handcrafts','learn-from-masters'],artist:'Wayne Thiebaud'},
    'color-bloom-collage':{categories:['handcrafts','painting']},
    'my-magical-city':{categories:['painting','learn-from-masters'],artist:'Paul Klee'},
    'first-illustration-book':{categories:['illustration','handcrafts'],status:'Ongoing',statusNote:'This course is being developed. Explore the available steps while more teaching material is added.',examples:[
      {label:'Coraline · Student book',cover:asset('coraline-book','Coraline’s illustrated book — student example',1400,980)},
      {label:'Alicia · Student book',cover:asset('alicia-book','Alicia’s illustrated book — student example',1400,980)}
    ]},
    'lfc054':{categories:['illustration','painting'],tags:['Illustration','Surrealism','Storytelling','Drawing']}
  };
})();
