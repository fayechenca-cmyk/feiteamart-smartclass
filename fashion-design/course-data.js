/* Original interaction-test content, NOT approved anatomical instruction.
 * All geometry uses the same 400 × 700 viewBox. Replace data, not the engine. */
window.FashionCourse = {
  id: 'fashion-design', title: 'Fashion Design', version: 2,
  units: [
    {id:'figure',title:'Fashion Figure',description:'Figure proportions and movement',lessons:[{id:'standing-demo',title:'Pose 1 · Basic Standing',status:'demo'},{id:'weight-shift',title:'Pose 2 · Side Leg & Hand on Hip',status:'demo'},{id:'fashion-walk',title:'Pose 3 · Fashion Walk',status:'demo'},{id:'relaxed-asymmetry',title:'Pose 4 · Strong Asymmetry',status:'demo'}]},
    {id:'close-fitting',title:'Close-fitting Clothing',description:'Explore how a swimsuit and a fitted top with leggings sit around the figure instead of replacing the body contour.',lessons:[{id:'swimsuit-study',title:'Look 1 · Swimsuit',status:'demo'},{id:'fitted-separates',title:'Look 2 · Fitted Top & Leggings',status:'demo'}]},
    {id:'everyday',title:'Everyday Clothing',description:'Draw T-shirts, long sleeves, shorts and skirts. Notice fabric thickness and the space between clothing and skin.',status:'planned'},
    {id:'folds',title:'Fabric and Folds',description:'Begin with a hanging towel, then explore folds at the underarm, elbow, waist, hip and knee.',status:'planned'},
    {id:'motion',title:'Fabric in Motion',description:'Compare sleeves or hems in silk, canvas and heavy sweatshirt fabric, then apply them to a full figure. One additional material has a working name only; its name and visual qualities await teacher confirmation.',status:'awaiting-teacher'},
    {id:'project',title:'Fashion Design Project',description:'Choose a pose, garment and fabric to create your own fashion illustration.',status:'planned'}
  ]
};
(() => {
  // Original geometry rebuilt from the teacher's sequence, NOT photo coordinates.
  const guides = [
    ['head-top','Head top',38],['chin','Chin · line 2',108],['shoulder','Shoulder level',152],
    ['chest','Chest',202],['waist','Waist level',254],['hip','Hip level',310],
    ['knee','Knee',452],['ankle','Ankle',610],['heel','Heel',630],['toe','Toes',652]
  ].map(([id,label,y])=>({id,label,y,explanation:`${label}: use this height to locate the figure. Exact spacing is still under teacher review.`}));
  const points = [
    ['head-top',200,38,'Head top'],['chin',200,108,'Chin'],
    ['shoulder-left',142,145,'Left shoulder'],['shoulder-right',258,160,'Right shoulder'],
    ['chest-left',157,202,'Left chest'],['chest-right',243,202,'Right chest'],
    ['waist-left',176,258,'Left waist'],['waist-right',224,250,'Right waist'],
    ['hip-left',149,319,'Left hip'],['hip-right',251,302,'Right hip'],
    ['knee-support',174,452,'Supporting knee'],['knee-free',240,449,'Other knee'],
    ['ankle-support',184,610,'Supporting ankle'],['ankle-free',244,596,'Other ankle'],
    ['toe-support',161,652,'Supporting toes'],['toe-free',272,635,'Other toes'],
    ['back-head',184,64,'Back-of-head cue']
  ].map(([id,x,y,label])=>({id,x,y,label}));
  const groups = [
    ['head','Build the head',{x:70,y:0,width:260,height:250}],['shoulders','Set the shoulder line',{x:45,y:35,width:310,height:285}],['waist','Set the waist line',{x:45,y:105,width:310,height:310}],['hips','Set the hip line',{x:45,y:145,width:310,height:315}],
    ['upper-body','Connect shoulders to waist',{x:45,y:75,width:310,height:355}],['lower-body','Connect waist to hips',{x:45,y:155,width:310,height:330}],['balance','Find the supporting leg',{x:45,y:270,width:310,height:420}],
    ['thighs','Build thighs and knees',{x:45,y:245,width:310,height:360}],['calves','Build the lower legs',{x:45,y:365,width:310,height:335}],['feet','Place ankles and feet',{x:45,y:450,width:310,height:250}],
    ['neck','Add the neck cylinder',{x:65,y:20,width:270,height:260}],['shoulder-slopes','Add the shoulder slopes',{x:45,y:35,width:310,height:285}],['upper-arms','Draw the upper arms',{x:25,y:90,width:350,height:355}],['forearms','Draw the forearms',{x:25,y:145,width:350,height:340}]
  ].map(([id,title,focus],i)=>({id,title,number:i+1,focus}));
  const phases = [
    {id:'Head and directional lines',review:'The circle leaves room for the jaw. Compare the shoulder tilt with the parallel waist and hip lines.'},
    {id:'Connect the torso',review:'Check both sides from shoulder to waist, then both sides from waist to hip.'},
    {id:'Balance and legs',review:'Find the supporting ankle and its plumb line. Compare the two knee positions and lower legs.'},
    {id:'Neck and shoulders',review:'The neck is a small cylinder. The sloping shoulders connect it back to the shoulder-line ends.'},
    {id:'Arms',review:'Upper arms first, forearms second. Notice where each segment changes direction at the elbow.'}
  ];
  const steps=[];
  function stroke(id,groupId,phase,title,path,guideIds,prompt,tip,extra={}) {
    steps.push({id,kind:'stroke',groupId,phase,title,path,guideIds,prompt,
      tip:{title:'Look for the relationship',body:tip},
      direction:'Follow the circle toward the square in the demonstrated direction.',
      startRegion:{radius:18},endRegion:{radius:20},animation:{duration:2600},
      tolerance:{mouse:22,pen:25,touch:30,coverage:.5,order:.5},
      feedback:{success:extra.success||'You connected the intended landmarks. Keep this relationship in mind.',retry:prompt},
      narration:extra.narration||`${prompt} ${tip}`,audio:null,video:{src:null,start:null,end:null,poster:null},
      teacherNote:'Sequence follows the teacher briefing and IMG_9095 / IMG_9096. Original geometry still awaits exact proportion approval.',
      confirmation:{sequence:'teacher-directed',geometry:'provisional'},confirmed:false,...extra});
  }
  const P=phases.map(p=>p.id);
  stroke('head-circle','head',P[0],'Draw the head circle','M200 38 C171 38 171 82 200 82 C229 82 229 38 200 38',['head-top','chin'],
    'Draw a small circle for the upper part of the head. Leave room below it.',
    'The circle does not fill the entire first interval. The chin will reach the second guide line.',{success:'Your circle leaves room for the jaw below.'});
  stroke('jaw','head',P[0],'Connect the jaw to line 2','M179 69 Q181 94 200 108 Q219 94 221 69',['chin'],
    'From the side of the circle, curve down to the chin on line 2 and back up the other side.',
    'Circle plus jaw makes the head. Keep this as one teaching step with two strokes; do not add the neck yet.',{success:'The jaw reaches the chin guide and joins the circle.'});
  stroke('shoulder-line','shoulders',P[0],'Draw the shoulder direction','M142 145 L258 160',['shoulder'],
    'Connect the two shoulder points. Notice the gentle downward tilt to the right.',
    'The shoulder line sets the upper-body direction. Establish its width and tilt before drawing the neck.',{pointIds:['shoulder-left','shoulder-right'],success:'Your shoulder line connects both width points.'});
  stroke('waist-line','waist',P[0],'Draw the waist direction','M176 258 L224 250',['waist'],
    'Connect the waist points, tilting gently upward to the right.',
    'In this pose, the waist line is not parallel to the shoulder line. Compare their directions.',{pointIds:['waist-left','waist-right'],success:'Your waist line shows a different tilt from the shoulders.'});
  stroke('hip-line','hips',P[0],'Draw the hip direction','M149 319 L251 302',['waist','hip'],
    'Connect the hip points using the same tilt as the waist line.',
    'Teacher tip for this construction: keep the hip line parallel to the waist line. The hips are wider than the waist.',{pointIds:['hip-left','hip-right'],overlays:['waist-parallel'],success:'Your hip line follows the same direction as the waist.'});
  stroke('torso-left','upper-body',P[1],'Connect the left upper torso','M142 145 Q157 205 176 258',['shoulder','waist'],
    'Connect the left shoulder point to the left waist point.', 'Work on both sides of the upper torso before moving below the waist.');
  stroke('torso-right','upper-body',P[1],'Connect the right upper torso','M258 160 Q239 207 224 250',['shoulder','waist'],
    'Now connect the right shoulder point to the right waist point.', 'Compare the narrowing on both sides. The waist endpoints control the width.');
  stroke('waist-hip-left','lower-body',P[1],'Connect the left waist and hip','M176 258 Q159 287 149 319',['waist','hip'],
    'Open outward from the left waist point toward the left hip.', 'First upper torso on both sides; now waist to hip on both sides.');
  stroke('waist-hip-right','lower-body',P[1],'Connect the right waist and hip','M224 250 Q243 274 251 302',['waist','hip'],
    'Open outward from the right waist point toward the right hip.', 'Let the hip width open out from the narrower waist.');
  steps.push({id:'support-landmark',kind:'locate',groupId:'balance',phase:P[2],title:'Find the supporting ankle',
    pointIds:['ankle-support'],targetPoint:'ankle-support',guideIds:['knee','ankle'],overlays:['plumb'],
    prompt:'Find the ankle directly below the back-of-head cue. Tap that ankle to choose the supporting leg.',
    tip:{title:'A plumb-line check',body:'For this pose, use the teacher cue: a vertical line from the back of the head toward the supporting ankle. It meets the ground at 90°. This is a pose-specific observation, not a rule for every figure.'},
    feedback:{success:'You found the supporting ankle. Draw that leg first.',retry:'Follow the vertical line down to the ankle on the left side of the page.'},
    narration:'Find the supporting ankle before drawing the legs. Follow the purple plumb line from the back of the head down to the standing ankle.',
    path:null,animation:{duration:2600},audio:null,video:{src:null,start:null,end:null,poster:null},confirmed:false});
  stroke('support-thigh-outer','thighs',P[2],'Supporting thigh · outer edge','M149 319 Q146 383 164 451',['hip','knee'],
    'Draw the outer thigh of the supporting leg first, from hip toward knee.', 'Left and right always mean the sides of the page in this demo.',{overlays:['plumb']});
  stroke('support-thigh-inner','thighs',P[2],'Supporting thigh · inner edge','M201 335 Q190 392 184 451',['hip','knee'],
    'Draw the other edge of the supporting thigh toward the same knee.', 'Leave width for the thigh. Do not replace the whole leg with one straight stick.');
  stroke('support-knee','thighs',P[2],'Describe the supporting knee','M164 451 Q174 465 184 451',['knee'],
    'Use a small curved line to describe the knee.', 'The knee is a rounded transition between thigh and lower leg.',{tolerance:{mouse:16,pen:19,touch:23,coverage:.5,order:.4},startRegion:{radius:16},endRegion:{radius:16}});
  stroke('free-thigh-outer','thighs',P[2],'Other thigh · outer edge','M251 302 Q270 377 251 444',['hip','knee'],
    'Move to the other thigh. Follow its outer edge toward the knee.', 'Compare its direction with the supporting thigh; the two legs do not have identical outlines.');
  stroke('free-thigh-inner','thighs',P[2],'Other thigh · inner edge','M201 335 Q218 391 228 453',['hip','knee'],
    'Draw the inner edge of the other thigh.', 'Use its own knee position rather than mirroring the first leg.');
  stroke('free-knee','thighs',P[2],'Describe the other knee','M228 453 Q242 464 251 444',['knee'],
    'Round the second knee with a short arc.', 'A simple arc describes the bend without adding too much detail.',{tolerance:{mouse:16,pen:19,touch:23,coverage:.5,order:.4},startRegion:{radius:16},endRegion:{radius:16}});
  stroke('support-calf-outer','calves',P[2],'Supporting lower leg · outer edge','M164 451 Q163 512 177 600',['knee','ankle'],
    'Begin with the lower leg that has less foreshortening. Draw toward the supporting ankle.', 'Keep the knee and supporting ankle relationship visible.',{overlays:['plumb']});
  stroke('support-calf-inner','calves',P[2],'Supporting lower leg · inner edge','M184 451 Q199 520 191 600',['knee','ankle'],
    'Complete the inside of this lower leg.', 'The lower leg narrows toward the ankle.');
  stroke('free-calf-outer','calves',P[2],'Other lower leg · outer edge','M251 444 Q263 506 251 588',['knee','ankle'],
    'Draw the other lower leg, noticing its different direction.', 'Do not copy the first leg exactly; compare the angle and visible length.');
  stroke('free-calf-inner','calves',P[2],'Other lower leg · inner edge','M228 453 Q222 517 237 590',['knee','ankle'],
    'Complete the inner edge toward the other ankle.', 'Keep the two ankle positions distinct.');
  stroke('support-ankle','feet',P[2],'Place the supporting ankle','M177 600 Q184 607 191 600',['ankle'],
    'Join the lower-leg edges with a small ankle curve.', 'The supporting ankle stays beneath the plumb-line cue.',{overlays:['plumb']});
  stroke('free-ankle','feet',P[2],'Place the other ankle','M237 590 Q244 597 251 588',['ankle'],
    'Indicate the second ankle with a small curve.', 'Check the ankle before extending the foot.');
  stroke('support-foot','feet',P[2],'Place the supporting foot','M177 600 L175 626 L161 652 Q181 658 199 651 L191 600',['ankle','heel','toe'],
    'Continue from ankle to heel and toes, then return to the ankle.', 'Keep the supporting foot planted. The ankle is narrower than the foot.');
  stroke('free-foot','feet',P[2],'Place the other foot','M237 590 L236 615 L255 640 Q267 642 272 635 L251 588',['ankle','heel','toe'],
    'Draw the second foot in its own direction.', 'Compare the shape and visible length rather than making identical feet.');
  stroke('neck-left','neck',P[3],'Return to the neck · left side','M190 103 L187 140',['chin','shoulder'],
    'Now return to the head. Draw one side of the neck down toward the shoulder line.', 'The neck comes after the body and legs in this sequence. Think of a small cylinder.');
  stroke('neck-right','neck',P[3],'Neck cylinder · right side','M210 103 L213 143',['chin','shoulder'],
    'Draw the other side of the neck cylinder.', 'Keep a little width between the two sides.');
  stroke('neck-base','neck',P[3],'Neck cylinder · curved base','M187 140 Q200 132 213 143 Q200 155 187 140',['shoulder'],
    'Describe the base of the cylinder with a small oval.', 'This oval helps the neck sit above the shoulder direction.');
  stroke('slope-left','shoulder-slopes',P[3],'Left shoulder slope','M187 128 Q166 136 142 145',['shoulder'],
    'Slope from the neck outward to the left shoulder point.', 'The sloping shoulder contour is different from the earlier structural shoulder line.');
  stroke('slope-right','shoulder-slopes',P[3],'Right shoulder slope','M213 131 Q234 145 258 160',['shoulder'],
    'Slope from the neck outward to the right shoulder point.', 'Use the established shoulder endpoint; do not invent a new shoulder width.');
  stroke('upper-arm-left-outer','upper-arms',P[4],'Left upper arm · outer edge','M142 145 Q122 199 118 242',['shoulder','waist'],
    'Draw the upper arm from shoulder to elbow.', 'Locate the elbow before drawing the forearm.');
  stroke('upper-arm-left-inner','upper-arms',P[4],'Left upper arm · inner edge','M155 170 Q143 212 136 244',['shoulder','waist'],
    'Add the inner edge of the same upper arm.', 'The upper arm has width; leave a gap between its two edges.');
  stroke('upper-arm-right-outer','upper-arms',P[4],'Right upper arm · outer edge','M258 160 Q282 204 286 245',['shoulder','waist'],
    'Draw the other upper arm toward its elbow.', 'Finish both upper arms before moving to the forearms.');
  stroke('upper-arm-right-inner','upper-arms',P[4],'Right upper arm · inner edge','M245 181 Q262 219 268 248',['shoulder','waist'],
    'Give the other upper arm its inner contour.', 'Compare the arm width with the space beside the torso.');
  stroke('forearm-left-outer','forearms',P[4],'Left forearm · outer edge','M118 242 Q107 281 107 313 L114 333',['waist','hip'],
    'Continue from elbow toward the wrist and hand.', 'The forearm is a second segment. Notice the change of direction at the elbow.');
  stroke('forearm-left-inner','forearms',P[4],'Left forearm · inner edge','M136 244 Q130 284 124 316 Q125 332 114 333',['waist','hip'],
    'Draw the inner edge and close the simple hand shape.', 'Let the forearm narrow toward the wrist.');
  stroke('forearm-right-outer','forearms',P[4],'Right forearm · outer edge','M286 245 Q296 284 290 318 L282 336',['waist','hip'],
    'Draw from the other elbow toward the wrist.', 'Follow the second arm on its own terms rather than mirroring blindly.');
  stroke('forearm-right-inner','forearms',P[4],'Right forearm · inner edge','M268 248 Q275 286 274 318 Q272 331 282 336',['waist','hip'],
    'Finish the inner forearm and simple hand shape.', 'Look over the whole figure: head, directional lines, body, supporting leg, neck and arms.');
  const voiceMeta={provider:'ElevenLabs',voice:'Hope – Professional, Clear and Natural',rights:'Generated in the teacher’s ElevenLabs account for this course.'};
  const clip=(src,start,end)=>({...voiceMeta,src,start,end});
  const introClips=[[0,2.94],[4.54,7.74],[9.36,16.2],[17.88,19.958]];
  const gridClips=[[0,3.86],[5.38,6.82],[8.44,12.76],[14.3,16.46],[17.98,20.9],[22.56,25.14],[26.64,28.34],[29.82,31.26],[32.9,39.001]];
  const drawingClips=[[0,5.08],[6.62,12.92],[14.5,20.04],[21.54,25.7],[27.16,31.42],[32.82,36.5],[38,41.8],[43.3,47.44],[49,52.98],[54.7,61.4],[62.96,68.16],[69.74,74.08],[75.5,78.98],[80.38,85],[86.38,89.36],[90.78,94.04],[95.52,101.36],[102.9,105.96],[107.56,111.82],[113.36,116.74],[118.24,122.28],[123.74,127.44],[128.88,133.9],[135.32,138.84],[140.32,147.06],[148.46,151.86],[153.32,157.42],[158.98,162.86],[164.4,168.24],[169.82,173.36],[174.94,178.32],[179.62,182.9],[184.28,187.88],[189.22,193.1],[194.66,198.56],[200.16,203.78],[205.36,210.495]];
  steps.forEach((step,index)=>{const timing=drawingClips[index];step.audio=timing?clip('assets/audio/hope-drawing-steps.mp3',...timing):null;});
  window.FashionLesson={
    unitId:'figure',id:'standing-demo',title:'Basic Standing Pose',estimatedMinutes:35,status:'demo',revision:2,
    introduction:'Fashion design begins with the figure. We use the head as one measuring unit, build a nine-head grid, locate the body landmarks, and only then begin drawing.',
    orientation:{
      title:'Fashion starts with the figure',
      narration:'Fashion and costume design begin with the figure underneath. Everyday characters are often six to seven heads tall. Fashion figures are usually eight, nine, or nine and a half heads tall, giving them longer legs and a more elegant silhouette. Today, we will use nine heads.',
      comparison:[{label:'Everyday character',units:6.5,note:'Often 6–7 heads tall'},{label:'Fashion figure',units:9,note:'This demonstration uses 9 head units'}],sequence:[{id:'body',text:'Fashion and costume design begin with the figure underneath.'},{id:'everyday',text:'Everyday characters are often six to seven heads tall.'},{id:'fashion',text:'Fashion figures are usually eight, nine, or nine and a half heads tall, giving them longer legs and a more elegant silhouette.'},{id:'today',text:'Today, we will use nine heads.'}],audio:{...voiceMeta,src:'assets/audio/hope-intro.mp3',clips:introClips}
    },
    proportionGrid:{units:9,lineCount:10,narration:'Watch the guide build itself. Ten light lines make nine equal spaces. One head is one unit. The shoulder, chest, waist, hips, knees, ankles, and feet are placed against this guide. On paper, draw the same light grid before you begin.',sequence:[{id:'lines',text:'First, ten light horizontal lines make nine equal spaces.'},{id:'head',text:'One head is one unit.'},{id:'shoulder',text:'Here is the shoulder line. The demonstration width is about two and a half heads.'},{id:'chest',text:'The chest line sits below the shoulders.'},{id:'waist',text:'The waist is narrower, about one and a half heads wide.'},{id:'hip',text:'The hips are wider, about two heads wide.'},{id:'knee',text:'Next, find the knee line.'},{id:'ankle',text:'Then place the ankles.'},{id:'feet',text:'The heels and toes finish the figure. On paper, make this light guide before drawing.'}],audio:{...voiceMeta,src:'assets/audio/hope-grid.mp3',clips:gridClips}},
    confirmation:{approved:false,label:'Teacher-guided sequence · Proportions under review',note:'Rebuilt from the teaching references. Exact spacing, widths and final paths still need teacher approval.'},
    objectives:['Build a nine-head proportion grid','Locate the major body levels and widths before drawing','Build the figure one clear stroke at a time'],
    materials:['A mouse, trackpad, touchscreen or Apple Pencil','Paper, a pencil and an eraser'],
    canvas:{width:400,height:700},guides,points,groups,phases,steps,
    centerLine:{x:200,label:'Construction center',explanation:'A construction guide, distinct from the supporting-leg plumb line.'},
    balance:{x:184,top:64,bottom:652,pointIds:['back-head','ankle-support'],label:'Supporting-leg plumb line'},
    overlays:[{id:'waist-parallel',path:'M135 265 L271 242.3',label:'Waist direction',color:'#a78bfa'}],
    landmarks:[
      {id:'head',title:'Head unit',pointIds:['head-top','chin'],guideIds:['head-top','chin'],tip:'Tap the head top and chin. You are locating two markers, not drawing yet.',widthNote:'The distance from head top to chin is one unit.',narration:'Do not draw yet. Tap the head top and the chin. This distance is one head unit.'},
      {id:'shoulders',title:'Shoulder level and width',pointIds:['shoulder-left','shoulder-right'],guideIds:['shoulder'],tip:'Tap both shoulder endpoints. Their height difference also shows the shoulder tilt.',widthNote:'Demonstration width: about two and a half head widths.',narration:'Do not draw yet. Tap the two shoulder endpoints. The demonstration shoulder span is about two and a half head widths.'},
      {id:'chest',title:'Chest level',pointIds:['chest-left','chest-right'],guideIds:['chest'],tip:'Tap across the chest level so you can see where the upper torso has volume.',widthNote:'The chest sits below the shoulder line and above the waist.',narration:'Tap the two chest markers. The chest level sits below the shoulders and above the waist.'},
      {id:'waist',title:'Waist level and width',pointIds:['waist-left','waist-right'],guideIds:['waist'],tip:'Tap both waist endpoints. The waist is narrower and tilts differently from the shoulders.',widthNote:'Demonstration width: about one and a half head widths.',narration:'Tap the two waist endpoints. The demonstration waist is about one and a half head widths, and its angle is different from the shoulders.'},
      {id:'hips',title:'Hip level and width',pointIds:['hip-left','hip-right'],guideIds:['waist','hip'],tip:'Tap the wider hip endpoints. The hip and waist direction lines are parallel in this construction.',widthNote:'Demonstration width: about two head widths.',narration:'Tap the two hip endpoints. The demonstration hips are about two head widths. In this pose, the hip line is parallel to the waist line.'},
      {id:'knees',title:'Knee level',pointIds:['knee-support','knee-free'],guideIds:['knee'],tip:'Tap both knees. They are not at exactly the same position because the pose shifts its weight.',widthNote:'Compare each knee with the hip and foot above and below it.',narration:'Tap both knee markers. The pose shifts its weight, so the two knees do not need to sit at exactly the same height.'},
      {id:'ankles',title:'Ankle level',pointIds:['ankle-support','ankle-free'],guideIds:['ankle'],tip:'Tap both ankles before placing the feet.',widthNote:'The standing ankle also helps us check the body balance.',narration:'Tap both ankle markers. The standing ankle will later help us check the balance of the whole pose.'},
      {id:'toes',title:'Heel and toe level',pointIds:['toe-support','toe-free'],guideIds:['heel','toe'],tip:'Tap the toe endpoints. High heels can extend the fashion figure toward nine and a half head units.',widthNote:'Flat feet and high heels finish at different levels.',narration:'Tap the two toe endpoints. A flat foot and a high heel finish differently. High heels can extend a fashion figure toward nine and a half head units.'}
    ],
    sound:{volume:.11,strokeNotes:[784,1046.5],phaseNotes:[659.25,783.99,1046.5],duration:.28,noteGap:.12},
    teacherVideo:{src:null,poster:null,rights:null,note:'Awaiting teacher recording; each stroke has editable start/end times.'},
    assets:{svg:null,demonstrationImage:null,finalImage:null,video:null,audio:null,source:'Teacher references IMG_9095.HEIC, IMG_9096.HEIC, IMG_9104.HEIC and IMG_9105.HEIC. Newly constructed paths; no photo-coordinate extraction.',rights:'Teacher-provided references; public media publication not included.'},
    pendingTeacherChecks:['Exact head units, guide heights and widths','Interpretation of lower-leg versus foot perspective order','Final weight-bearing pose and back-of-head marker','Step-matched video timestamps'],
    paper:{levels:['Full steps and proportion guides','Guides, joint markers and short prompts','Blank drawing space with a side reference'],prompts:['Locate the head, shoulder, waist and hip endpoints.','Circle + jaw; shoulders, waist, hips; connect the torso.','Supporting leg first. Neck and arms come last.']}
  };
  const baseLesson=window.FashionLesson;
  function pathPoints(d,warp,step){
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);
    const length=path.getTotalLength(),count=Math.max(12,Math.ceil(length/6)),points=Array.from({length:count+1},(_,i)=>warp(path.getPointAtLength(length*i/count),step));
    return points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  }
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const poseWarps={
    'weight-shift':(p,step)=>{let x=p.x,y=p.y;if(y<320)x+=10-(y-160)*.035;if(y>=300){const amount=(y-300)/350;x+=p.x<205?-12*amount:92*amount;}if(step.groupId==='upper-arms'||step.groupId==='forearms'){const amount=Math.max(0,(y-145)/190);x+=p.x<200?42*amount:-42*amount;y-=18*amount;}return{x:clamp(x,28,375),y};},
    'fashion-walk':(p,step)=>{let x=p.x,y=p.y;if(y<320)x-=10;if(y>=300){const amount=(y-300)/350;x+=(p.x<205?-62:66)*amount;}if(step.groupId==='upper-arms'||step.groupId==='forearms'){const amount=Math.max(0,(y-145)/190);x+=(p.x<200?-70:58)*amount;y+=p.x<200?18*amount:-12*amount;}return{x:clamp(x,24,376),y:clamp(y,24,675)};},
    'relaxed-asymmetry':(p,step)=>{let x=p.x,y=p.y;if(y<320)x+=10*Math.sin((y-40)/120);if(y>=300){const amount=(y-300)/350;x+=(p.x<205?42:-30)*amount;}if((step.groupId==='upper-arms'||step.groupId==='forearms')&&p.x<205){const amount=Math.max(0,(p.y-140)/200);x=145+70*amount;y=145-92*amount;}else if(step.groupId==='upper-arms'||step.groupId==='forearms'){const amount=Math.max(0,(y-145)/190);x-=48*amount;y-=15*amount;}return{x:clamp(x,24,376),y:clamp(y,28,675)};}
  };
  function makePose(id,title,number,focus,teacherNote){
    const lesson=structuredClone(baseLesson),warp=poseWarps[id];lesson.id=id;lesson.title=title;lesson.poseNumber=number;lesson.status='demo';lesson.estimatedMinutes=28;
    lesson.steps=lesson.steps.map(step=>({...step,path:step.path?pathPoints(step.path,warp,step):null,teacherNote,confirmation:{sequence:'teacher-directed',geometry:'provisional-reference-study'}}));
    if(id==='fashion-walk'){
      const cleanRightThigh={
        'free-thigh-outer':'M241.4 302 L278.2 444',
        'free-thigh-inner':'M205 335 L256.9 453',
        'free-knee':'M256.9 453 Q268 462 278.2 444'
      };
      lesson.steps=lesson.steps.map(step=>cleanRightThigh[step.id]?{...step,path:cleanRightThigh[step.id],teacherNote:`${teacherNote} The right thigh uses a clean hip-to-knee line without the earlier outward bulge.`}:step);
    }
    if(id==='relaxed-asymmetry'){
      const cleanPoseFour={
        'support-thigh-outer':'M149 319 L159 451','support-thigh-inner':'M201 335 L184 451','support-knee':'M159 451 Q171 462 184 451',
        'free-thigh-outer':'M251 302 L250 444','free-thigh-inner':'M201 335 L225 453','free-knee':'M225 453 Q238 461 250 444',
        'support-calf-outer':'M159 451 L169 600','support-calf-inner':'M184 451 L184 600','free-calf-outer':'M250 444 L263 590','free-calf-inner':'M225 453 L243 590',
        'support-ankle':'M169 600 Q176 607 184 600','free-ankle':'M243 590 Q253 598 263 590',
        'support-foot':'M169 600 L168 626 L154 650 Q178 656 194 650 L184 600','free-foot':'M243 590 L243 615 L260 639 Q273 641 279 634 L263 590',
        'upper-arm-left-outer':'M142 145 Q112 151 96 186','upper-arm-left-inner':'M155 170 Q129 176 110 194',
        'forearm-left-outer':'M96 186 Q120 138 168 94','forearm-left-inner':'M110 194 Q136 151 178 104',
        'upper-arm-right-outer':'M258 160 Q279 207 280 252','upper-arm-right-inner':'M245 181 Q262 218 264 252',
        'forearm-right-outer':'M280 252 Q288 292 275 334','forearm-right-inner':'M264 252 Q272 292 263 326'
      };
      lesson.steps=lesson.steps.map(step=>cleanPoseFour[step.id]?{...step,path:cleanPoseFour[step.id],teacherNote:`${teacherNote} Clean construction follows the teacher's raised-hand pose: a readable bent arm and even, uninterrupted leg contours.`}:step);
    }
    lesson.points=lesson.points.map(point=>({...point,...warp(point,{groupId:'landmarks'})}));
    lesson.balance={...lesson.balance,x:warp({x:lesson.balance.x,y:lesson.balance.bottom},{groupId:'balance'}).x};
    lesson.orientation={...lesson.orientation,title,sequence:[{id:'body',text:`This is Pose ${number}. First, look at the whole figure and find its balance.`},{id:'everyday',text:'Use the same nine-head guide and landmark order you already know.'},{id:'fashion',text:focus},{id:'today',text:'Keep the visual guidance on. Voice guidance is optional while you practise.'}],audio:null};
    lesson.proportionGrid={...lesson.proportionGrid,audio:null};lesson.confirmation={approved:false,label:'Teacher reference received · Practice geometry under review',note:'The pose follows the teacher reference as an original provisional construction. Exact demonstration paths still await teacher approval.'};
    lesson.assets={...lesson.assets,demonstrationImage:null,source:'Teacher reference IMG_9104.HEIC; provisional paths are newly constructed and do not trace photo coordinates. The classroom photo is not shown to students.'};
    return lesson;
  }
  window.FashionLessons=[baseLesson,
    makePose('weight-shift','Pose 2 · Side Leg & Hand on Hip',2,'Notice the hand-on-hip shape, the supporting leg, and the leg extending clearly to the side.','Pose 2 follows the side-leg teacher pose; final landmarks and paths await confirmation.'),
    makePose('fashion-walk','Pose 3 · Fashion Walk',3,'Compare the crossing leg directions while keeping the torso clear.','Pose 3 follows the third teacher pose; final landmarks and paths await confirmation.'),
    makePose('relaxed-asymmetry','Pose 4 · Strong Asymmetry',4,'One arm reaches up near the head while the other returns toward the hip. Compare the two sides before drawing.','Pose 4 follows the strong asymmetric teacher pose; final landmarks and paths await confirmation.')];
  function garmentStep(id,groupId,title,path,prompt,tip,guideIds=['shoulder','waist','hip']){return{id,kind:'stroke',groupId,phase:'Fit clothing over the figure',title,path,guideIds,prompt,tip:{title:'Clothing sits around the body',body:tip},direction:'Follow the circle toward the square.',startRegion:{radius:20},endRegion:{radius:22},animation:{duration:2500},tolerance:{mouse:24,pen:27,touch:32,coverage:.48,order:.45},feedback:{success:'The clothing line sits clearly over the figure.',retry:prompt},narration:`${prompt} ${tip}`,audio:null,video:{src:null,start:null,end:null,poster:null},teacherNote:'Provisional clothing path rebuilt from teacher reference IMG_9105. Final garment line awaits approval.',confirmation:{sequence:'teacher-directed',geometry:'provisional'},confirmed:false};}
  function makeClothingLesson(source,id,title,look,garmentSteps){const lesson=structuredClone(source);lesson.id=id;lesson.title=title;lesson.poseNumber=null;lesson.lessonType='close-fitting';lesson.estimatedMinutes=32;lesson.groups.push({id:'garment-top',title:'Fit the top layer',number:lesson.groups.length+1,focus:{x:45,y:85,width:310,height:300}},{id:'garment-bottom',title:'Fit the lower layer',number:lesson.groups.length+2,focus:{x:35,y:220,width:330,height:450}});lesson.phases.push({id:'Fit clothing over the figure',review:'Compare the dark body contour with the clothing contour. Clothing follows the body but does not erase it.'});lesson.steps.push(...garmentSteps);lesson.orientation={...lesson.orientation,title,sequence:[{id:'body',text:`First draw the figure for ${look}.`},{id:'everyday',text:'Keep the body construction visible so you can compare skin and clothing.'},{id:'fashion',text:'Place the garment edge just outside or just inside the correct body landmark, depending on the opening.'},{id:'today',text:'Draw one clothing edge at a time. Do not simply trace every body contour.'}],audio:null};lesson.proportionGrid={...lesson.proportionGrid,audio:null};lesson.confirmation={approved:false,label:'Teacher reference received · Clothing paths under review',note:'Original provisional clothing construction based on IMG_9105. No photo coordinates were traced.'};lesson.assets={...lesson.assets,demonstrationImage:null,source:'Teacher reference IMG_9105.HEIC; classroom photo is not displayed to students.'};return lesson;}
  const swimsuit=[
    garmentStep('swim-neck','garment-top','Place the swimsuit neckline','M181 151 Q200 169 219 153','Draw the neckline across the upper chest.','The neckline is a garment opening. It sits below the neck and does not replace the shoulder line.'),
    garmentStep('swim-armhole-left','garment-top','Left strap and armhole','M181 151 Q165 162 160 202','Connect the neckline toward the left underarm.','Leave the shoulder and arm visible outside the swimsuit opening.'),
    garmentStep('swim-armhole-right','garment-top','Right strap and armhole','M219 153 Q237 170 244 203','Connect the neckline toward the right underarm.','The garment follows the body while keeping its own edge.'),
    garmentStep('swim-side-left','garment-top','Left swimsuit side','M160 202 Q169 252 156 307','Carry the swimsuit edge from underarm toward the hip.','Keep a small, visible relationship between the garment edge and the body contour.'),
    garmentStep('swim-side-right','garment-top','Right swimsuit side','M244 203 Q232 252 254 302','Carry the other side toward the hip.','Compare both sides instead of tracing the torso blindly.'),
    garmentStep('swim-leg-left','garment-bottom','Left leg opening','M156 307 Q177 325 200 337','Curve the leg opening toward the center.','The opening wraps over the hip and meets the center above the legs.'),
    garmentStep('swim-leg-right','garment-bottom','Right leg opening','M254 302 Q225 324 200 337','Complete the second leg opening.','The two openings describe one garment sitting on the figure.')
  ];
  const separates=[
    garmentStep('fit-neck','garment-top','Place the fitted neckline','M181 151 Q200 164 219 153','Draw a simple fitted neckline.','Keep it below the neck cylinder so both structures remain readable.'),
    garmentStep('fit-sleeve-left','garment-top','Left fitted sleeve','M181 151 Q158 153 139 164','Extend the garment slightly beyond the shoulder into a short sleeve.','The sleeve edge sits over the shoulder; it is not the shoulder itself.'),
    garmentStep('fit-sleeve-right','garment-top','Right fitted sleeve','M219 153 Q241 161 263 176','Build the other short sleeve.','Use the body underneath to judge where fabric begins and ends.'),
    garmentStep('fit-top-left','garment-top','Left top edge','M139 164 Q153 218 171 263','Draw the fitted top beside the torso.','Keep the garment edge slightly separate from the skin contour.'),
    garmentStep('fit-top-right','garment-top','Right top edge','M263 176 Q246 219 229 257','Draw the other side of the fitted top.','The fitted shape follows the waist without becoming the body outline.'),
    garmentStep('fit-top-hem','garment-top','Finish the top hem','M171 263 Q200 271 229 257','Connect the two sides with the hem.','A hem is a clothing edge with its own direction.'),
    garmentStep('legging-waist','garment-bottom','Place the leggings waistband','M151 312 Q200 326 252 302','Place a waistband just over the hip area.','The waistband wraps around the body and stays distinct from the hip construction line.'),
    garmentStep('legging-left-outer','garment-bottom','Left leggings outer edge','M151 312 Q142 452 174 610','Draw the fitted fabric down the outside of the left leg.','Keep a narrow fabric offset so the clothing can be read over the body.', ['hip','knee','ankle']),
    garmentStep('legging-left-inner','garment-bottom','Left leggings inner edge','M199 336 Q190 461 188 607','Draw the inside edge toward the ankle.','Follow the leg direction while preserving the crotch and knee landmarks.', ['hip','knee','ankle']),
    garmentStep('legging-right-inner','garment-bottom','Right leggings inner edge','M203 336 Q219 459 240 597','Continue down the inside of the other leg.','The two inner edges remain separate; fabric does not merge the legs.', ['hip','knee','ankle']),
    garmentStep('legging-right-outer','garment-bottom','Right leggings outer edge','M252 302 Q274 448 254 596','Finish the outside edge of the right leg.','Compare the fabric contour with the body contour underneath.', ['hip','knee','ankle'])
  ];
  window.FashionLessons.push(makeClothingLesson(baseLesson,'swimsuit-study','Look 1 · Swimsuit','a one-piece swimsuit',swimsuit),makeClothingLesson(baseLesson,'fitted-separates','Look 2 · Fitted Top & Leggings','a fitted top and leggings',separates));
})();
