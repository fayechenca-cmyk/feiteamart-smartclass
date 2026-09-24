/* Original interaction-test content, NOT approved anatomical instruction.
 * All geometry uses the same 400 × 700 viewBox. Replace data, not the engine. */
window.FashionCourse = {
  id: 'fashion-design', title: 'Fashion Design', version: 1,
  units: [
    {id:'figure',title:'Fashion Figure',description:'Figure proportions and movement',lessons:[{id:'standing-demo',title:'Basic Standing Pose',status:'demo'},{id:'walking',title:'Walking Pose',status:'awaiting-teacher'},{id:'cross-stance',title:'Crossed-leg Standing Pose',status:'awaiting-teacher'},{id:'pose-4',title:'Pose 4 · To be selected by the teacher',status:'awaiting-teacher'},{id:'pose-5',title:'Pose 5 · To be selected by the teacher',status:'awaiting-teacher'}]},
    {id:'close-fitting',title:'Close-fitting Clothing',description:'Explore swimwear, camisoles, one-piece and two-piece outfits, and leggings. Compare body and clothing contours.',status:'planned'},
    {id:'everyday',title:'Everyday Clothing',description:'Draw T-shirts, long sleeves, shorts and skirts. Notice fabric thickness and the space between clothing and skin.',status:'planned'},
    {id:'folds',title:'Fabric and Folds',description:'Begin with a hanging towel, then explore folds at the underarm, elbow, waist, hip and knee.',status:'planned'},
    {id:'motion',title:'Fabric in Motion',description:'Compare sleeves or hems in silk, canvas and heavy sweatshirt fabric, then apply them to a full figure. One additional material has a working name only; its name and visual qualities await teacher confirmation.',status:'awaiting-teacher'},
    {id:'project',title:'Fashion Design Project',description:'Choose a pose, garment and fabric to create your own fashion illustration.',status:'planned'}
  ]
};
(() => {
  const guides = [['chin','Chin',116],['shoulder','Shoulder',158],['chest','Chest',206],['waist','Waist',265],['hip','Hip',320],['knee','Knee',464],['ankle','Ankle',608],['heel','Heel',634],['toe','Toes',657]].map(([id,label,y])=>({id,label,y,explanation:`${label} guide (demo). Its position awaits teacher confirmation.`}));
  const raw = [
    ['head','Find the structure','Head outline','M200 48 C157 48 157 115 200 116 C243 115 243 48 200 48',['chin'],'Start at the top of the head. Draw gently around and return to the start.','Your closed line gives the head its shape.'],
    ['neck-left','Find the structure','Left neck line','M187 114 L184 145 L145 158',['chin','shoulder'],'Move down from the left side of the chin, then out to the left shoulder.','Your neck line connects to the shoulder.'],
    ['neck-right','Find the structure','Right neck line','M213 114 L216 145 L255 158',['chin','shoulder'],'Move down from the right side of the chin, then out to the right shoulder.','Your neck line connects to the shoulder.'],
    ['shoulders','Find the structure','Shoulder line','M145 158 L255 158',['shoulder'],'Gently connect the left shoulder point to the right shoulder point.','Your shoulder line connects the two guide points.'],
    ['torso-left','Shape the body','Left waist and hip','M155 177 Q161 226 175 265 Q162 295 151 320',['chest','waist','hip'],'Find the waist guide first. Curve inward, then move outward toward the hip.','You found the change of direction between the waist and hip.'],
    ['torso-right','Shape the body','Right waist and hip','M245 177 Q239 226 225 265 Q238 295 249 320',['chest','waist','hip'],'Curve gently inward at the waist, then outward toward the hip.','Your waist and hip contours are connected.'],
    ['pelvis','Shape the body','Pelvis guide','M151 320 Q200 352 249 320',['hip'],'Draw a shallow curve from the left hip point to the right.','This curve helps you find where the legs begin.'],
    ['arm-left-outer','Shape the body','Left outer arm','M145 158 Q129 205 123 247 L111 309 L117 331',['shoulder','waist','hip'],'Draw down from the shoulder, letting the arm hang naturally.','Your arm extends down from the shoulder.'],
    ['arm-left-inner','Shape the body','Left inner arm','M117 331 L131 316 L143 255 L155 177',['hip','waist','chest'],'Draw back up from the hand, leaving room for the width of the arm.','The inner and outer lines leave space for the arm.'],
    ['arm-right-outer','Shape the body','Right outer arm','M255 158 Q271 205 277 247 L289 309 L283 331',['shoulder','waist','hip'],'Start at the right shoulder and draw down toward the hand.','The right arm hangs naturally too.'],
    ['arm-right-inner','Shape the body','Right inner arm','M283 331 L269 316 L257 255 L245 177',['hip','waist','chest'],'Draw up from the hand and stop at the upper-arm point.','You have given the other arm its width.'],
    ['leg-left-outer','Balance and feet','Left outer leg','M151 320 Q150 393 168 464 L172 608',['hip','knee','ankle'],'Draw from the hip, through the knee point, down to the ankle.','Your line passes through the knee and ankle positions.'],
    ['leg-left-inner','Balance and feet','Left inner leg','M200 352 Q189 402 188 464 L187 608',['hip','knee','ankle'],'Start between the legs and draw down past the knee.','Both sides of the left leg are in place.'],
    ['leg-right-inner','Balance and feet','Right inner leg','M200 352 Q211 402 212 464 L213 608',['hip','knee','ankle'],'Start in the middle and draw toward the right ankle.','The right leg now has its inner contour.'],
    ['leg-right-outer','Balance and feet','Right outer leg','M249 320 Q250 393 232 464 L228 608',['hip','knee','ankle'],'Draw down from the hip, past the right knee, to the ankle.','Your knee and ankle positions are connected.'],
    ['foot-left','Balance and feet','Left foot','M172 608 L166 634 L146 657 L187 657 L187 608',['ankle','heel','toe'],'Go to the heel, extend toward the toes, then return to the ankle.','The heel and toes give the foot a place to rest.'],
    ['foot-right','Balance and feet','Right foot','M213 608 L213 657 L254 657 L234 634 L228 608',['ankle','heel','toe'],'Draw down from the ankle, around the toes and heel.','Both feet now meet the ground.']
  ];
  window.FashionLesson = {
    unitId:'figure', id:'standing-demo', title:'Basic Standing Pose', introduction:'Watch one stroke, then draw it yourself. Find the points and connect them slowly.', estimatedMinutes:25,
    status:'demo', confirmation:{approved:false,label:'Demo content · Awaiting teacher confirmation',note:'Original practice drawing. These are not the final teacher-approved eight- or nine-head proportions.'},
    phases:[{id:'Find the structure',review:'Find the shoulder line. Notice how the head and shoulders connect.'},{id:'Shape the body',review:'Notice the curve from waist to hip and the space inside each arm.'},{id:'Balance and feet',review:'Look at the center line and both feet. Does the figure feel balanced?'}],
    objectives:['Recognize proportion guides and joint markers','Follow the demonstration to draw one figure','Practise with fewer hints, then try drawing on paper'], materials:['A mouse, trackpad, touchscreen or Apple Pencil','Paper, a pencil and an eraser for paper practice'],
    canvas:{width:400,height:700}, guides, centerLine:{x:200,label:'Center line',explanation:'Notice how the center of the figure relates to the space between the feet. This is a symmetrical standing-pose demo.'},
    points:[{id:'left-shoulder',x:145,y:158,label:'Left shoulder'},{id:'right-shoulder',x:255,y:158,label:'Right shoulder'},{id:'left-hip',x:151,y:320,label:'Left hip'},{id:'right-hip',x:249,y:320,label:'Right hip'},{id:'left-knee',x:168,y:464,label:'Left knee'},{id:'right-knee',x:232,y:464,label:'Right knee'},{id:'left-ankle',x:172,y:608,label:'Left ankle'},{id:'right-ankle',x:228,y:608,label:'Right ankle'}],
    steps:raw.map(([id,phase,title,path,guideIds,prompt,success])=>({id,phase,title,path,guideIds,direction:'Follow the path direction, from circle to square',startRegion:{radius:25},endRegion:{radius:29},animation:{duration:2400},prompt,audio:null,teacherNote:'Original demo. Proportions, instructions and paths await teacher review.',tolerance:{mouse:22,pen:26,touch:32,coverage:.65,order:.68},feedback:{success,retry:prompt},confirmed:false})),
    sound:{volume:.08,strokeHz:660,phaseHz:880,duration:.16},
    assets:{svg:null,demonstrationImage:null,finalImage:null,video:null,audio:null,source:'Original procedural demo for FEI TeamArt; teacher approval pending',rights:'Add source and usage permissions with the teacher-provided assets'},
    paper:{levels:['Full steps and proportion guides','Guides, joint markers and short prompts','Blank drawing space with a side reference'],prompts:['Look at the center line and proportion guides first.','Draw one complete figure at a time.','When you finish, notice where the weight rests.']}
  };
})();
