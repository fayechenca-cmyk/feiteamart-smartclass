/* Content-only course package. Empty src means an intentional teacher asset slot.
   Screens extend core/lesson-app.js screenId/stepNumber/completionRule conventions. */
const photos = {
 'material-pencil': 'pencils.png', 'material-scissors': 'scissors.png',
 'material-glue': 'glue.png', 'material-knife': 'craft-knife.png',
 'material-mat': 'cutting-mat.png', 'material-hot-glue': 'glue-gun.png',
 'materials-flatlay': 'materials-flatlay.jpg', 'collected-cardboard': 'cardboard-landscape.jpg'
};
const asset = (id, label, kind = 'image') => ({ id, label, kind, src: photos[id] ? 'assets/' + photos[id] : '', alt: label });
const section = (screenId, type, title, instruction, extra = {}) => ({ screenId, type, title, instruction, teacherNote: '', video: null, image: null, discussionQuestion: '', estimatedTime: null, activityType: type, completionRule: { type: 'always' }, ...extra });
const prompt = (id, label) => ({ id, label });
export const materials = [
 ['corrugated','Recycled corrugated cardboard','Main structure and walls'],['thin','Thin cardboard / chipboard','Smaller parts and details'],['cardstock','Cardstock','Lightweight shape tests'],['pencil','Pencil','Sketch and mark'],['eraser','Eraser','Revise your drawing'],['ruler','Ruler','Measure and draw straight lines'],['scissors','Scissors','Cut manageable pieces'],['glue','Craft glue','Join pieces · UHU shown; white or tacky glue also works'],['tape','Masking tape','Hold temporary connections'],['tracing','Tracing paper','Trace and revise ideas',true],['translucent','Colored translucent paper','Explore light',true],['mat','Cutting mat','Protect your work surface',true],['knife','Craft knife','Detailed cuts',true,'Adult supervision required'],['hot-glue','Hot glue gun','Optional stronger joins',true,'Adult supervision required · hot tip and glue']
].map(([id,name,purpose,optional=false,safety=''])=>({id,name,purpose,optional,safety,image:asset('material-'+id,name)}));
export const preparation = [
 {title:'Find at home',items:['Clean shipping box','Clean packaging cardboard','Scrap cardstock','Paper']},
 {title:'Basic tools',items:['Pencil','Ruler','Eraser','Scissors','Glue','Masking tape']},
 {title:'Optional / advanced',items:['Tracing paper','Cutting mat','Craft knife','Colored translucent material']}
];
const tests = [
 ['fold','FOLD','Can a fold make cardboard stand?','Compare a flat piece with a folded piece.','Which do you think will stand more easily?'],
 ['roll','ROLL','Can a flat material become a column?','Compare a flat piece with a rolled piece.','Which shape do you predict will support more?'],
 ['layer','LAYER','Does adding layers make it stronger?','Compare one layer with several layers.','Which do you think will bend less?'],
 ['slot','SLOT / CONNECT','Can two pieces connect without glue?','Try connecting two pieces using slots.','What could help the connection stay upright?']
].map(([id,title,question,instruction,prediction])=>({id,title,question,instruction,prediction,media:asset('test-'+id,title+' test image / video')}));
const gothic = [
 ['pointed-arch','POINTED ARCH','How does changing the shape of an arch change the structure?'],
 ['rib-vault','RIB VAULT','How can ribs create a framework?'],
 ['flying-buttress','FLYING BUTTRESS','How can support come from outside the wall?'],
 ['verticality','VERTICALITY','How can design make a building feel taller?'],
 ['light-openings','LIGHT + OPENINGS','How can structure allow more light inside?'],
 ['rose-window','ROSE WINDOW','How can geometry, repetition, and light work together?']
].map(([id,title,question])=>({id,title,question,explanation:'Teacher explanation to come · 1–2 sentences',image:asset(id+'-reference',title+' architecture reference'),diagram:asset(id+'-diagram',title+' simplified support diagram')}));
const definitions = [ ['REUSE','Use something again.'],['RECYCLE','Process a material so it can become new material.'],['UPCYCLE','Transform discarded material into something with new or greater value.'] ];
const lessons = [
 {title:'MEET CARDBOARD',question:'Can Cardboard Become Structure?',focus:'Understand cardboard as a material and test its structural possibilities.',screens:[
 section('question','question',"TODAY’S QUESTION",'Can an old cardboard box become a strong creative structure?',{body:'Start with a piece of cardboard. What could it become?',image:asset('collected-cardboard','Cardboard collected at home'),video:asset('intro-video','Intro video','video')}),
 section('materials','materials','WHAT YOU NEED','Gather your materials. Reused, clean cardboard is our starting point.',{image:asset('materials-flatlay','Your teacher’s tools')}),
 section('observe','observe','Cardboard is already a structure.','What do you notice when you look at the edge?',{image:asset('cardboard-closeup','Corrugated cardboard close-up'),diagram:asset('cardboard-layers','Outer paper → corrugated / fluted middle layer → outer paper','diagram'),prompts:[prompt('edge','What do you notice?')]}),
 section('tests','tests','MATERIAL TESTS','Predict. Try it. Notice what changed.',{tests}),
 section('make','challenge','MAKE IT STAND','Use one piece of cardboard. Make it stand without holding it.',{constraints:['No glue at first.','You may fold, bend, roll, or slot.','Try at least two solutions.'],video:asset('stand-demo','Make It Stand tutorial / demo','video'),image:asset('stand-example','Student example'),prompts:[prompt('solution-one','Solution 1 — what did you try?'),prompt('solution-two','Solution 2 — what did you change?')]}),
 section('learn','chips','DESIGN THINKING','What changed the material?',{choices:['FOLD','CURVE','LAYER','ANGLE','CONNECTION'],body:'You did not change the material. You changed its structure.'}),
 section('reflect','reflect','REFLECT','Look back at what you discovered.',{prompts:['Which technique made cardboard strongest?','Which experiment surprised you?','What could you build using this idea?'].map((q,i)=>prompt('reflection-'+i,q))}),
 section('check','quiz','QUICK CHECK','Try these draft questions. Teacher answers and feedback will be added later.',{prompts:['Why is corrugated cardboard stronger than a single flat sheet?','Which technique can help a flat sheet stand?','What is the difference between material and structure?'].map((q,i)=>prompt('check-'+i,q))})
 ]},
 {title:'LEARN FROM GOTHIC',question:'How Can Structure Reach Higher?',focus:'Explore structure, support, height, repetition, and light through Gothic architecture.',screens:[
 section('question','question',"TODAY’S QUESTION",'How did medieval builders use structure to reach higher?',{body:'Architecture is one source of inspiration. Keep asking what these ideas could become in cardboard.'}),
 section('observe','references','LOOK / OBSERVE','Notice a structural idea, then imagine a cardboard test.',{elements:gothic}),
 section('compare','compare','ROUND OR POINTED?','What changes when the shape of the arch changes?',{assets:[asset('round-arch','ROMANESQUE ROUND ARCH','diagram'),asset('pointed-comparison','GOTHIC POINTED ARCH','diagram')],prompts:[prompt('comparison','What do you notice about the two shapes?')]}),
 section('challenge','challenge','DESIGN CHALLENGE','Build one Gothic-inspired structural element from cardboard.',{video:asset('gothic-demo','Gothic cardboard mini-build demo','video'),prompts:[prompt('idea','How could we use this with cardboard?')]})
 ]},
 {title:'DESIGN',question:'From Material to Idea',focus:'Develop your own Gothic-inspired cardboard structure.',screens:[
 section('purpose','choice','01 · CHOOSE A PURPOSE','What will your structure be for?',{choices:['Pavilion','Library','Small museum','Gathering space','Imaginary Gothic structure'],prompts:[prompt('own-purpose','Or describe your own purpose')]}),
 section('ideas','chips','02 · CHOOSE STRUCTURAL IDEAS','Choose ideas to explore in your own design.',{choices:['Pointed arch','Repetition','Buttress','Vertical structure','Rose-window geometry','Rib structure']}),
 section('front','make','03 · SKETCH THE FRONT','FRONT ELEVATION · Draw the view from the front.',{image:asset('front-guide','Front elevation drawing guide'),download:asset('front-download','Printable front elevation guide','download')}),
 section('side','make','04 · SKETCH THE SIDE','SIDE ELEVATION · Draw the view from the side.',{image:asset('side-guide','Side elevation drawing guide')}),
 section('openings','reflect','05 · OPENINGS + LIGHT','Where could light enter?',{prompts:[prompt('light-plan','Describe your openings and light ideas')]}),
 section('connections','reflect','06 · CHOOSE CONNECTIONS','How will your cardboard pieces connect?',{prompts:[prompt('connections','Describe the connections you will test')]}),
 section('plan','plan','MY DESIGN PLAN','Bring these decisions into your sketch. This is your design, not a cathedral to copy.',{image:asset('design-example','Example design sketch')})
 ]},
 {title:'PROTOTYPE',question:'From Drawing to 3D',focus:'Build a small model, test it, identify a problem, and revise.',screens:[
 section('make','make','BUILD A SMALL ROUGH MODEL','A prototype is not the final artwork. It is a way to test an idea.',{image:asset('prototype-before','Prototype before revision')}),
 section('tests','checklist','TEST YOUR PROTOTYPE','Look from multiple angles.',{items:['Test height','Test stability','Test proportions','Test connections','Look from multiple angles']}),
 section('reflect','reflect','TEST → NOTICE → CHANGE','Identify one problem, then revise the design.',{prompts:[prompt('test','TEST · What did you test?'),prompt('notice','NOTICE · What problem did you find?'),prompt('change','CHANGE · How will you revise it?')],image:asset('prototype-after','Prototype after revision')})
 ]},
 {title:'BUILD + TRANSFORM',question:'Create the Final Structure',focus:'Build your model and explore openings, light, surfaces, and connections.',screens:[
 ...['Prepare base','Build main walls / structure','Add structural supports','Add openings','Add Gothic-inspired elements','Explore light','Refine connections','Finish surface/details'].map((title,i)=>section('build-'+i,'make',`${i+1 < 10 ? '0' : ''}${i+1} · ${title}`,i===0?'Use your Lesson 3 design and Lesson 4 prototype to guide your own final model.':'Teacher instructions to come · adapt this step to your own design.',{video:asset('build-video-'+(i+1),title+' short tutorial','video'),...(i===5?{image:asset('light-example','Light / window example')}:{}),...(i===6?{diagram:asset('connection-diagram','Connection technique diagrams','diagram')}:{} )}))
 ]},
 {title:'REFLECT + PRESENT',question:'Tell the Story of Your Material',focus:'Photograph, explain, evaluate, and present your finished design.',screens:[
 section('document','document','BEFORE → PROCESS → AFTER','Arrange your photographs and drawings to tell the story.',{assets:[asset('before-photo','BEFORE · Original discarded cardboard'),asset('experiment-photo','PROCESS · Material experiments'),asset('sketch-photo','PROCESS · Design sketch'),asset('prototype-photo','PROCESS · Prototype'),asset('after-photo','AFTER · Finished model')],image:asset('documentation-example','Process documentation example'),prompts:[prompt('documentation-notes','Presentation notes / links to your photographs')]}),
 section('reflect','reflect','TELL YOUR MATERIAL’S STORY','UPCYCLE · Transforming a discarded material into something with new or greater value.',{prompts:['What was this material originally?','What did you discover about cardboard?','Which structural idea did you use?','What failed during your project?','What did you change?','How did you give the discarded material new value?','If you built Version 2, what would you change?'].map((q,i)=>prompt('final-'+i,q)),image:asset('finished-example','Finished project example')}),
 section('present','present','PRESENT YOUR PROJECT','Share your before, process, and after story with your class.')
 ]}
].map((l,i)=>({ ...l,lessonId:'remake-cardboard-'+(i+1),lessonFamily:'material-design',number:i+1,estimatedTime:null,ageGroups:['teen'],screens:[...l.screens,section('next','next',i===5?'PROJECT COMPLETE':'NEXT LESSON',i===5?'RE:MAKE 01 — CARDBOARD':'')].map((s,j)=>({...s,stepNumber:j+1})),totalSteps:l.screens.length+1}));
export const course = {id:'remake-01-cardboard',title:'RE:MAKE 01 — CARDBOARD',subtitle:'From Waste Material to Creative Structure',age:'Ages 10–15',type:'Project-Based Smart Class',cover:asset('collected-cardboard','Start here: cardboard collected at home'),finalProjectCover:asset('course-cover','Cardboard final project hero image'),definitions,lessons};
