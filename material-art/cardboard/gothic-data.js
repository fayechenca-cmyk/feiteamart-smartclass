// Original teacher-supplied sheets are preserved byte-for-byte.
// Original sheet crops remain for unchanged steps; corrected arch assets follow teacher guidance.
const step=(id,title,instruction,rect,extra={})=>({screenId:id,title,instruction,rect,teacherNote:'',estimatedTime:null,activityType:'make',video:{src:'',poster:'',captions:'',transcript:''},...extra});
export const gothicProject={
 id:'gothic-example',title:'Build a Gothic-inspired Cathedral',
 map:{src:'assets/gothic/project-map.png',width:1226,height:1283},
 elements:[
 {id:'arch',title:'Pointed arch',sheet:'assets/gothic/pointed-arch.png',width:1312,height:1199,mapRect:[17,301,228,250],resultRect:[1002,598,269,275],steps:[
 step('rectangle','Cut your cardboard','8 cm wide × 14 cm tall. Keep enough card for three layers.',[34,222,191,254]),
 step('center','Find the centre','Mark 4 cm from either side. Draw a light centre line.',[298,214,194,257]),
 step('side-points','Mark both sides','Measure 7 cm up from the bottom.',[549,215,232,258]),
 step('draw','Draw the arch','Curve from each side mark to the top centre.',[835,220,202,257]),
 step('inside-line','Draw the inner arch','Draw inside the outer arch. Keep the cardboard uncut.',[24,603,218,243],{teacherNote:'In the recorded demonstration, draw the inner outline before cutting. Border measurements are in centimetres, not inches; the vertical gap at the pointed apex is larger than the side border.'}),
 step('outside','Cut the outer arch','Follow the outside line. Keep the inner shape for now.',[1090,215,218,259],{cutting:true,teacherNote:'Only cut the outside silhouette here. The inner doorway is still solid, with a pencil outline.'}),
 step('inside-cut','Open the first arch','Cut out the centre. Keep one single frame.',[280,603,250,235],{cutting:true}),
 step('layer-2','Make the second arch','Trace the same outside on a new piece. Draw and cut a wider frame.',[550,596,422,243],{cutting:true,teacherNote:'The teacher makes progressively smaller openings, not identical copies. Measurements refer to the border width along the sides.'}),
 step('layer-3','Make the third arch','Make one more frame. Keep the outside the same; widen the sides to 2 cm.',[550,596,422,243],{cutting:true}),
 step('layer','Test, then glue','Stack 1.2 cm, 1.5 cm and 2 cm borders from front to back. Align the outer edges.',[550,596,422,243],{teacherNote:'Dry-fit all three pieces before gluing. The widest border goes behind; each inner edge should remain visible. This replaces the earlier identical-layer extension.'})]},
 {id:'window',title:'Gothic window',sheet:'assets/gothic/window.png',width:1312,height:1199,mapRect:[267,300,221,252],resultRect:[1000,599,248,264],steps:[
 step('rectangle','Cut a rectangle','10 cm wide × 16 cm tall.',[19,216,205,260]),
 step('draw','Draw a pointed arch','Keep the two sides balanced.',[299,215,220,260],{teacherNote:'Confirm the border measurements in the source drawing during the live demonstration.'}),
 step('frame','Make the outer frame','Cut the outside shape. Plan the opening with your teacher.',[557,215,209,264],{cutting:true,teacherNote:'The sheet jumps from an outline to an open frame. Explain which areas stay connected before any interior cutting.'}),
 step('circle','Add a circle','About 5 cm across, near the top.',[824,208,204,267]),
 step('pattern','Design the tracery','Draw a simple pattern inside the circle.',[1110,215,174,259]),
 step('openings','Cut the openings','Keep the pattern connected to the frame.',[45,590,191,244],{cutting:true}),
 step('bars','Add vertical bars','Make the bars about 1–1.5 cm wide.',[290,590,202,244]),
 step('layer','Add a layer · optional','Glue a matching frame behind for strength.',[548,585,416,249]),
 step('finish','Hold it to the light','Notice your pattern. Keep this piece for assembly.',[1004,590,244,269])]},
 {id:'tower',title:'Tower + spire',sheet:'assets/gothic/tower.png',width:1226,height:1283,mapRect:[520,294,203,261],resultRect:[924,737,170,370],steps:[
 step('rectangle','Cut the tower piece','18 cm wide × 12 cm tall.',[15,347,163,222],{part:'A · Tower'}),
 step('fold-lines','Mark four panels','Mark a fold every 4.5 cm.',[190,323,178,225],{part:'A · Tower'}),
 step('tube','Fold a square tube','Fold four sides. Tape the joining edges.',[378,317,174,253],{part:'A · Tower',teacherNote:'18 cm gives four 4.5 cm panels with no glue tab. Tape the seam, or demonstrate adding a separate joining strip.'}),
 step('windows','Add windows · optional','Plan the openings before cutting.',[572,329,143,245],{part:'A · Tower',cutting:true,teacherNote:'Safer to mark and cut windows while the card is flat, before closing the tube. Open the seam again if needed.'}),
 step('triangles','Cut four triangles','Each face: base 4.5 cm · height 9 cm.',[748,331,137,231],{part:'B · Spire',cutting:true,teacherNote:'9 cm is the triangular face height, not the assembled pyramid vertical height. Dry-fit before gluing.'}),
 step('spire','Join the triangles','Tape or glue the four edges to form a spire.',[922,333,141,229],{part:'B · Spire'}),
 step('attach','Attach the spire','Try the fit, then join it to the tower.',[1116,330,94,247],{part:'B · Spire'}),
 step('details','Add your details · optional','Choose a border, a window shape, or small pinnacles.',[20,745,383,373],{part:'Make it yours'}),
 step('variations','Choose your tower style','One tower, twin towers, or your own variation.',[449,749,410,375],{part:'Make it yours'})]},
 {id:'buttress',title:'Buttress',sheet:'assets/gothic/buttress.png',width:1226,height:1283,mapRect:[758,315,185,235],resultRect:[925,620,283,278],steps:[
 step('rectangle','Cut a rectangle','8 cm wide × 10 cm tall.',[20,227,253,259]),
 step('shape','Draw the support','Mark a 2 cm upright. Add the diagonal and curved opening.',[305,217,267,279]),
 step('cut','Cut out the shape','Keep the upright, diagonal and foot connected.',[625,232,201,239],{cutting:true}),
 step('pair','Make a pair','Trace a matching piece for the other side.',[860,235,343,232]),
 step('layer','Add thickness · optional','Glue a matching layer behind each support.',[30,618,366,223]),
 step('attach','Try it against your tower','Keep the foot flat. Attach now, or save it for assembly.',[466,620,300,222],{teacherNote:'Dry-fit against the learner’s own tower. Final attachment can wait until the assembly sequence.'}),
 step('check','Check the support','Does it touch the wall and sit flat on the base?',[925,620,283,278])]},
 {id:'decoration',title:'Decorative detail',mode:'choices',sheet:'assets/gothic/decoration.png',width:1312,height:1199,mapRect:[1000,306,200,249],resultRect:[728,833,245,285],steps:[
 step('pinnacle','Small spire','Make four triangles: 2.5 cm base × 5 cm face height. Join them on a small base.',[24,314,246,432],{cutting:true}),
 step('finial','Finial','Draw and cut a top decoration. Glue it to a small base.',[306,327,197,227],{cutting:true}),
 step('pattern','Trefoil or quatrefoil','Choose three lobes or four. Draw and cut a simple connected shape.',[534,325,248,208],{cutting:true}),
 step('column','Column + capital','Roll or stack strips. Add a small cap on top.',[835,328,158,235]),
 step('gargoyle','Gargoyle · optional','Layer a few simple shapes to create your own creature.',[1091,343,207,203],{cutting:true,teacherNote:'This is an inspiration illustration, not a complete cutting template. Demonstrate simple body, head and wing pieces; exact copying is not required.'})]},
 {id:'combine',title:'Plan + gather your parts',sheet:'assets/gothic/assembly.png',width:1312,height:1199,mapRect:[20,897,395,256],resultRect:[338,218,305,333],steps:[
 step('plan','Plan your building','Sketch a front view. Choose where your parts will go.',[13,222,303,295]),
 step('parts','Gather your parts','Arrange your arch, window, towers, supports and chosen details.',[338,218,305,333])]},
 {id:'build',title:'Build it together',sheet:'assets/gothic/assembly.png',width:1312,height:1199,mapRect:[463,885,328,269],resultRect:[991,642,252,286],steps:[
 step('structure','Build the main structure','Join cardboard panels with glue or tape. Check that it stands.',[704,245,263,253],{teacherNote:'Size the main body to the student’s existing parts. The sheet is an overview, not a measured wall/base template. Demonstrate a dry fit and joints in the future video.'}),
 step('towers','Add towers','Try the positions, then attach. Keep the building balanced.',[1035,214,228,303]),
 step('supports','Add buttresses','Attach supports to the sides. Keep each foot flat.',[19,659,293,205]),
 step('details','Add your chosen details','Place small decorations on the roof, windows or walls.',[340,659,290,205]),
 step('check','Check + adjust','Look from every side. Fix loose joints and test stability.',[647,655,307,215]),
 step('present','Your building is ready','Show your design. What did you change to make it yours?',[991,642,252,286]) ]}
 ]
};

// Silent teacher demonstrations hosted in Cloudflare Stream.
const archStreams={
 "rectangle": {
  "motion": "dc315ef8dd0488cd6015ae26bda9b2b5",
  "src": "d2f061a889d8df07e5950cb7833d3fcc"
 },
 "center": {
  "motion": "23a9309cb33f5eac217fe0b1a7e1f605",
  "src": "33c3b48feee0a388944eb35e0e8897a2"
 },
 "side-points": {
  "motion": "0c17dbc5e0766b88cc10d7620ad532b9",
  "src": "664cdebf12d482f65d1c93283713fe68"
 },
 "draw": {
  "motion": "1a48323664c803fcdf8586e0827bb6a6",
  "src": "cba3be8b0f6def6b7139e99daa208880"
 },
 "inside-line": {
  "motion": "b709aac03ea38b129316aa3810a6465d",
  "src": "48c546c0dc7992c5528579753dbf0c10"
 },
 "outside": {
  "motion": "2ef4431c2fb2ca4dbefef789179df5f8",
  "src": "b67ac2e2ebbc97d1c057c457a62ed8cf"
 },
 "inside-cut": {
  "motion": "f3de0f06f1aeee51c8a87a3fae421a56",
  "src": "1d8dc88d10033ece9a2816531e23fb07"
 },
 "layer-2": {
  "motion": "1c7ccb5fa9850eb456a2d0c326d99285",
  "src": "3f3c08d8149f0c5728157f9cad58f718"
 },
 "layer-3": {
  "motion": "60c8c84772d16cba1e49d105b50e6ad8",
  "src": "e36f4821254c796bb2ca37a4a14bee5a"
 },
 "layer": {
  "motion": "7f1cbde7b8cb0e803eef5fc5b00ac3d0",
  "src": "72fd00e016d3788fcc068ff6c5eb7e6d"
 }
};
for(const s of gothicProject.elements[0].steps){
 s.video={...archStreams[s.screenId],captions:"",transcript:""};
}

// Teacher correction: side width differs from the vertical tip-to-tip gap.
const correctedArch={
 'inside-line':{image:'inner-line',goalLabel:'Piece 1 · draw only',sideWidth:'1.2',topGap:'1.5'},
 'outside':{image:'outer-cut',goalLabel:'Piece 1 · centre still solid',sideWidth:'1.2',topGap:'1.5'},
 'inside-cut':{image:'first-frame',goalLabel:'Piece 1 · single frame',sideWidth:'1.2',topGap:'1.5'},
 'layer-2':{image:'second-frame',goalLabel:'Piece 2 · single frame',sideWidth:'1.5',topGap:'2'},
 'layer-3':{image:'third-frame',goalLabel:'Piece 3 · single frame',sideWidth:'2'},
 'layer':{image:'stacked',goalLabel:'Now stack all 3 pieces'}
};
for(const s of gothicProject.elements[0].steps){
 const correction=correctedArch[s.screenId];
 if(correction)Object.assign(s,correction,{image:'assets/gothic/arch-corrected/'+correction.image+'.webp'});
}
gothicProject.elements[0].resultImage='assets/gothic/arch-corrected/stacked.webp';
