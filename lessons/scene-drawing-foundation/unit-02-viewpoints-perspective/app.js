'use strict';
const $=id=>document.getElementById(id);
const lessons=[
 {title:'Normal Shot',idea:'Meet the character at eye level. In this first scene, the camera and the character’s eyes are at the same height.',stories:[['On the way to school','A friend faces you on the right-hand pavement. Small houses, a tree and an alley frame the street.','street'],['Hello at the corner','A student turns sideways to say hi. Another classmate approaches, with distant hills behind the street corner.','corner'],['Waiting in the classroom','A friend stands beside a desk. The floor and walls lead toward one vanishing point.','room']]},
 {title:'Low Angle',idea:'Lower the camera and look gently upward. Nearby feet or a reaching hand can feel larger; the effect depends on the pose and distance.',stories:[['A wave across the street','From a low camera, a friend raises a hand. The houses rise behind them.','street'],['Our little hero','Look up at a classmate greeting a friend at the corner of the school building.','corner'],['The tall classroom','From near the floor, watch a student reach toward a high shelf.','room']]},
 {title:'High Angle',idea:'Raise the camera and look gently downward. Notice the top of the head and more of the ground around the character.',stories:[['Hello from the window','Look down at a friend waving from the pavement. Follow the road into the distance.','street'],['Meeting in the courtyard','From a higher landing, see two friends meeting near a building corner.','corner'],['Where is my pencil?','Look down at a student beside a desk, searching the classroom floor.','room']]},
 {title:'One Story, Three Viewpoints',idea:'A friend stops to say hello. Compare all three camera positions, then choose how you want to tell the story.',stories:[['The street greeting','Draw the same greeting from eye level, below and above.','street'],['At the school corner','Keep the setting. Change the camera and compare the mood.','corner'],['Inside the classroom','Choose the view that makes the space and action clearest.','room']]}
];
// A single ordered studio journey. No lesson or story selection inside the classroom.
let lesson=0,angle=0,story=0,step=0,cursor=0;
const journey=[{kind:'intro'}];
for(let l=0;l<3;l++) for(let scene=0;scene<3;scene++) for(let phase=scene===0?0:2;phase<=6;phase++) {
 if(phase===6)journey.push({kind:'reference',lesson:l,story:scene,step:5});
 journey.push({kind:'practice',lesson:l,story:scene,step:phase});
}
for(let a=0;a<3;a++) journey.push({kind:'review',angle:a});
journey.push({kind:'finish'});
// Course-map links open the selected lesson; the unit entrance starts at Intro.
const requestedLesson=new URLSearchParams(location.search||'').get('lesson');
if(['0','1','2','3'].includes(requestedLesson)){
 const wanted=Number(requestedLesson);
 cursor=journey.findIndex(stage=>wanted===3?stage.kind==='review':stage.kind==='practice'&&stage.lesson===wanted);
}

const titles=['Meet the camera','Start with the eyes','Drag the vanishing point','Open up the space','Place your character','Add a little background','Draw this story'];
function line(a,b,color='var(--ink)',width=1.7,dash=''){return `<path d="M${a[0]},${a[1]} L${b[0]},${b[1]}" fill="none" stroke="${color}" stroke-width="${width}" ${dash?'stroke-dasharray="'+dash+'"':''}/>`}
function text(x,y,s,color='var(--soft)'){return `<text x="${x}" y="${y}" fill="${color}" font-size="12" font-family="Open Sans, sans-serif">${s}</text>`}
function circle(x,y,r,fill='none',stroke='var(--ink)'){return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.7"/>`}
function camera(){const cy=[111,248,53][angle],target=angle===0?111:175;const rot=Math.atan2(target-cy,190)*180/Math.PI;
$('camera').innerHTML=`${line([25,292],[392,292],'var(--line)')}${text(265,316,'character')}<g data-focus="face character">${circle(298,116,21)}${circle(290,111,2,'var(--ink)')}${line([298,137],[298,221])}${line([298,155],[272,191])}${line([298,155],[326,184])}${line([298,221],[277,290])}${line([298,221],[321,290])}</g><g class="camera-motion" data-focus="camera"><path d="M110 ${cy} L300 ${target-59} L300 ${target+59} Z" fill="#67e8f933" stroke="#a78bfa" stroke-dasharray="5 6"/>${line([110,cy],[299,target],'#a78bfa',1,'5 6')}<g transform="translate(87 ${cy}) rotate(${rot})"><path d="M-33 -18 L9 -18 L9 16 L-33 16 Z M9 -9 L28 -19 L28 17 L9 8" fill="#eee8fa" stroke="var(--ink)" stroke-width="2"/>${circle(-23,-27,10)}${circle(0,-29,12)}${line([-10,18],[-26,43])}${line([-10,18],[5,43])}</g></g>${angle===0?line([15,111],[340,111],'#a78bfa',1,'4 6'):''}${text(20,28,['Eye-level camera','Low camera · tilt up','High camera · tilt down'][angle])}`;
}
function picture(){const phase=step===0?5:step===2?2:step-1;const type=lessons[lesson].stories[story][2],two=type==='corner',cx=Number(vpPosition),f=360,cy=190,h=[1.6,.55,2.8][angle],tilt=[0,.12,-.16][angle],yaw=two?.65:0,c=Math.cos(tilt),s=Math.sin(tilt);
function project(x,y,z){let xx=x*Math.cos(yaw)-z*Math.sin(yaw),zz=x*Math.sin(yaw)+z*Math.cos(yaw)+ (two?9:0);let dy=y-h,depth=dy*s+zz*c;return [cx+(f*xx-2*(cx-320))/depth,cy-f*(dy*c-zz*s)/depth]}
function L(a,b,color,width){return line(project(...a),project(...b),color,width)}
function box(x,z,w,d,height){const v=[[x,0,z],[x+w,0,z],[x+w,0,z+d],[x,0,z+d],[x,height,z],[x+w,height,z],[x+w,height,z+d],[x,height,z+d]];return [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].map(([a,b])=>L(v[a],v[b])).join('')}
function person(x,z,wave=false,side=false){let out='';const head=project(x,1.48,z),top=project(x,1.68,z),r=Math.abs(top[1]-head[1]);out+=circle(...head,r,'#ffffff');out+=L([x,1.28,z],[x,.65,z]);out+=L([x,.65,z],[x-.18,0,z-.04]);out+=L([x,.65,z],[x+.2,0,z+.05]);out+=L([x,1.13,z],[x-.28,.8,z]);out+=L([x,1.13,z],[x+.32,wave?1.65:.88,z-.18]);const eye=project(x+(side?.08:0),1.6,z-.01);out+=circle(eye[0]- (side?0:4),eye[1],1.8,'var(--ink)');if(!side)out+=circle(eye[0]+4,eye[1],1.8,'var(--ink)');return out}
const hy=cy+f*Math.tan(tilt),vpz=[cx-f*Math.tan(yaw)/c,hy],vpx=[cx+f/(Math.tan(yaw)*c),hy];let out='';
if(phase===0||step===2){
 const eye=project(two?1:1.25,1.6,two?3:4.3);
 // Keep the face visible as the horizon and VP are introduced next.
 out+='<g data-focus="face">'+circle(eye[0],eye[1]+8,25,'#ffffff')+'</g>';
 if(phase===0){
  out+='<g data-focus="horizon">'+line([20,hy],[620,hy],'#a78bfa',1.6,'6 6');
  out+=text(24,hy-13,angle===0?'Eye level / Horizon line':'Horizon · camera eye level','#635583')+'</g>';
 }
 out+='<g data-focus="face">'+circle(eye[0]-8,eye[1],2.8,'var(--ink)')+circle(eye[0]+8,eye[1],2.8,'var(--ink)');
 out+=`<path d="M${eye[0]-8} ${eye[1]+18} Q${eye[0]} ${eye[1]+24} ${eye[0]+8} ${eye[1]+18}" fill="none" stroke="var(--ink)" stroke-width="1.7"/>`+'</g>';
} 
if(phase>=1){out+='<g data-focus="horizon">'+line([0,hy],[640,hy],'#a78bfa',1.4,'6 6')+text(15,hy-10,'Horizon · camera eye level')+'</g>';[vpz,...(two?[vpx]:[])].forEach((v,i)=>{out+=`<g data-focus="vp"><circle data-vp="true" cx="${v[0]}" cy="${v[1]}" r="17" fill="transparent" style="cursor:ew-resize"/>`+circle(...v,6,'#7854af','#7854af')+text(Math.min(594,Math.max(10,v[0]+10)),hy+23,two?'VP '+(i+1):'VP','#635583')+'</g>'});}
if(phase>=2){out+='<g data-focus="space">';if(showGuides){for(let x=-8;x<=8;x+=2)out+=L([x,0,2],[x,0,45],'#a78bfa',1);if(two)for(let z=2;z<=18;z+=3)out+=L([-8,0,z],[18,0,z],'#a78bfa',1)}
if(type==='room'){out+=box(-2.6,5,5.2,8,3.3);}else{out+=L([-1.6,0,2],[-1.6,0,50]);out+=L([1.6,0,2],[1.6,0,50]);out+=L([2.1,0,2],[2.1,0,50]);if(two)out+=box(1.7,7,3,4,3);}out+='</g>';}
if(phase>=3){out+='<g data-focus="character">';out+=person(two?1:1.25,two?3:4.3,angle!==0,two);out+=person(two?-1:.9,two?7:11,false,true);out+='</g>'}
if(phase>=4){out+='<g data-focus="background">';if(type==='room'){out+=box(-1.6,6,1.3,1.2,.8)+box(1.7,9,.6,1.8,2.6);}else{out+=box(-4,8,2,4,2.5)+box(2.8,14,2.4,4,3);out+=L([-2.5,0,15],[-2.5,2.3,15]);const crown=project(-2.5,2.5,15);out+=circle(...crown,15,'#ecfeff');if(two)out+=`<path d="M0 ${hy-6} l45 -16 35 12 45 -20 50 20 45 -10 50 14" fill="none" stroke="var(--soft)"/>`;}out+='</g>';}
$('picture').innerHTML=`<g class="${dragVP?'':'reveal'}">${out}</g>`;
}

let vpPosition=320,showGuides=true,dragVP=null;
const shortPrompts=[
 ['The camera meets the eyes. Watch both views.','Draw two eyes at the camera’s height.','Drag the purple VP along the horizon.','Watch the road grow out from the VP.','Place the feet on the pavement.','Add two houses and a tree.','Your turn: sketch this scene on paper.'],
 ['The camera is low. Look gently upward.','Begin with a simple head.','Drag the VP. Notice the low camera’s horizon.','Follow the lines into the scene.','Draw a friend raising one hand.','Add the buildings behind your friend.','Your turn: sketch this low-angle story.'],
 ['The camera is high. Look gently downward.','Notice the top of the head.','Drag the VP. Notice the high camera’s horizon.','Follow the ground lines into the scene.','Place a small figure on the ground.','Add the place around your character.','Your turn: sketch this high-angle story.']
];
function renderScreen(){
 const current=journey[cursor];
 const intro=current.kind==='intro',finish=current.kind==='finish',review=current.kind==='review',reference=current.kind==='reference';
 $('reference-stage').hidden=!reference;
 const player=$('reference-video');player.pause();player.hidden=true;player.removeAttribute('src');player.load();
 $('intro-stage').hidden=!intro;$('drawing-stage').hidden=intro||finish||reference;$('finish-stage').hidden=!finish;
 $('previous').disabled=cursor===0;$('progress').value=cursor;$('progress').max=journey.length-1;
 $('count').textContent=intro?'Intro':finish?'Complete':review?`${current.angle+1} / 3`:`${current.step-(current.story===0?0:2)+1+(reference||current.step===6?1:0)} / ${current.story===0?8:6}`;
 $('next').textContent=intro?'Begin Normal Shot →':finish?'Back to Scene Drawing →':(current.step===6||review)?'I finished my sketch ✓':'Next →';
 $('replay').hidden=intro||finish||reference;
 if(intro){$('number').textContent='INTRO · POINT OF VIEW & PERSPECTIVE';$('title').textContent='Where are we looking from?';$('prompt').textContent='Our camera’s position changes the picture.';return}
 if(finish){$('number').textContent='VIEWPOINTS & PERSPECTIVE';$('title').textContent='Three viewpoints. One story.';$('prompt').textContent='Put your three sketches side by side.';return}
 lesson=review?3:current.lesson;angle=review?current.angle:lesson;story=review?0:current.story;step=review?6:current.step;
 showGuides=step!==6;
 $('number').textContent=review?'04 · ONE STORY, THREE VIEWPOINTS':`${String(lesson+1).padStart(2,'0')} · ${lessons[lesson].title.toUpperCase()} · ${lessons[lesson].stories[story][0].toUpperCase()}`;
 if(reference){
  const id=['normal','low','high'][lesson]+'-story-'+(story+1);
  const asset=QUICK_SKETCH_REFERENCES[id];
  $('reference-stage').dataset.referenceId=id;
  $('title').textContent='Teacher’s Quick Sketch';
  $('prompt').textContent='Watch how your teacher sketches this scene.';
  $('reference-caption').textContent=lessons[lesson].title+' · '+lessons[lesson].stories[story][0];
  $('reference-placeholder').hidden=Boolean(asset.src);
  if(asset.src){player.src=asset.src;player.hidden=false;}
  $('next').textContent='Now you draw →';return;
 }
 $('title').textContent=review?['Draw it at eye level','Draw it from below','Draw it from above'][angle]:titles[step];
 let instruction=review?'Same greeting. Same place. Draw this new viewpoint.':shortPrompts[angle][step];
 if(!review&&story===1&&step===2)instruction='Two building directions. Two VPs on one horizon.';
 if(!review&&story===2&&step===3)instruction='Follow the floor and walls toward the VP.';
 if(!review&&story===2&&step===5)instruction='Add one desk and a shelf.';
 $('prompt').textContent=instruction;
 $('story-caption').textContent=step===6?lessons[lesson].stories[story][0]:'';
 $('camera-panel').hidden=step!==0;
 $('drawing-stage').classList.toggle('paired',step===0);
 $('picture').setAttribute('tabindex',step===2?'0':'-1');
 $('picture').setAttribute('aria-label',step===2?'Drag the purple vanishing point, or use the left and right arrow keys.':'Step-by-step perspective drawing');
 $('interaction-hint').hidden=step!==2;
 camera();picture();
}
function render(){renderScreen();StepVoice.setStep(cursor);}
function advance(delta){
 if(cursor===journey.length-1&&delta>0){location.href='../';return}
 const current=journey[cursor];
 const next=()=>{cursor=Math.max(0,Math.min(journey.length-1,cursor+delta));vpPosition=320;dragVP=null;render()};
 if(delta>0&&((current.kind==='practice'&&current.step===6)||(current.kind==='review'&&current.angle===2))){PracticeReward.celebrate(current,next);return}
 next();
}
$('next').onclick=()=>advance(1);$('previous').onclick=()=>advance(-1);
$('replay').onclick=()=>{camera();picture()};
$('picture').addEventListener('pointerdown',e=>{
 if(step!==2)return;
 const point=$('picture').createSVGPoint();point.x=e.clientX;point.y=e.clientY;
 const {x,y}=point.matrixTransform($('picture').getScreenCTM().inverse());
 const dots=[...$('picture').querySelectorAll('[data-vp]')];
 if(!dots.some(dot=>Math.hypot(x-Number(dot.getAttribute('cx')),y-Number(dot.getAttribute('cy')))<26))return;
 dragVP={x:e.clientX,value:vpPosition,scale:$('picture').getScreenCTM().a};$('picture').setPointerCapture(e.pointerId);e.preventDefault();
});
$('picture').addEventListener('pointermove',e=>{if(!dragVP)return;vpPosition=Math.max(250,Math.min(390,dragVP.value+(e.clientX-dragVP.x)/dragVP.scale));picture()});
['pointerup','pointercancel','lostpointercapture'].forEach(event=>$('picture').addEventListener(event,()=>{dragVP=null}));
$('picture').addEventListener('keydown',e=>{if(step!==2||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();vpPosition=Math.max(250,Math.min(390,vpPosition+(e.key==='ArrowLeft'?-10:10)));picture()});
render();
