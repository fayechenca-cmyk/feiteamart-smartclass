/* Original interaction-test content, NOT approved anatomical instruction.
 * All geometry uses the same 400 × 700 viewBox. Replace data, not the engine. */
window.FashionCourse = {
  id: 'fashion-design', title: 'Fashion Design', version: 2,
  units: [
    {id:'figure',title:'Fashion Figure',description:'Figure proportions and movement',lessons:[{id:'standing-demo',title:'Pose 1 · Basic Standing',status:'demo'},{id:'weight-shift',title:'Pose 2 · Weight Shift',status:'reference-received'},{id:'fashion-walk',title:'Pose 3 · Fashion Walk',status:'reference-received'},{id:'relaxed-asymmetry',title:'Pose 4 · Relaxed Asymmetry',status:'reference-received'}]},
    {id:'close-fitting',title:'Close-fitting Clothing',description:'Explore swimwear, camisoles, one-piece and two-piece outfits, and leggings. Compare body and clothing contours.',status:'planned'},
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
  window.FashionLesson={
    unitId:'figure',id:'standing-demo',title:'Basic Standing Pose',estimatedMinutes:35,status:'demo',revision:2,
    introduction:'Fashion design begins with the figure. We use the head as one measuring unit, build a nine-head grid, locate the body landmarks, and only then begin drawing.',
    orientation:{
      title:'Fashion starts with the figure',
      narration:'Fashion and costume design begin with the figure underneath. Everyday characters are often six to seven heads tall. Fashion figures are usually eight, nine, or nine and a half heads tall, giving them longer legs and a more elegant silhouette. Today, we will use nine heads.',
      comparison:[{label:'Everyday character',units:6.5,note:'Often 6–7 heads tall'},{label:'Fashion figure',units:9,note:'This demonstration uses 9 head units'}],sequence:[{id:'body',text:'Fashion and costume design begin with the figure underneath.'},{id:'everyday',text:'Everyday characters are often six to seven heads tall.'},{id:'fashion',text:'Fashion figures are usually eight, nine, or nine and a half heads tall, giving them longer legs and a more elegant silhouette.'},{id:'today',text:'Today, we will use nine heads.'}]
    },
    proportionGrid:{units:9,lineCount:10,narration:'Watch the guide build itself. Ten light lines make nine equal spaces. One head is one unit. The shoulder, chest, waist, hips, knees, ankles, and feet are placed against this guide. On paper, draw the same light grid before you begin.',sequence:[{id:'lines',text:'First, ten light horizontal lines make nine equal spaces.'},{id:'head',text:'One head is one unit.'},{id:'shoulder',text:'Here is the shoulder line. The demonstration width is about two and a half heads.'},{id:'chest',text:'The chest line sits below the shoulders.'},{id:'waist',text:'The waist is narrower, about one and a half heads wide.'},{id:'hip',text:'The hips are wider, about two heads wide.'},{id:'knee',text:'Next, find the knee line.'},{id:'ankle',text:'Then place the ankles.'},{id:'feet',text:'The heels and toes finish the figure. On paper, make this light guide before drawing.'}]},
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
})();
