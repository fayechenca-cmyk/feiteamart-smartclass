const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const base='lessons/scene-drawing-foundation/unit-02-viewpoints-perspective/';
const nodes={};const node=id=>nodes[id]??={innerHTML:'',textContent:'',hidden:false,dataset:{},pause(){},load(){},removeAttribute(){},addEventListener(){},setAttribute(){},classList:{toggle(){}}};
const ctx=vm.createContext({document:{getElementById:node},location:{href:''},StepVoice:{setStep(){}},Math,Number,URLSearchParams});
for(const file of ['quick-sketch-references.js','app.js'])vm.runInContext(fs.readFileSync(base+file,'utf8'),ctx);
const data=vm.runInContext('({journey,lessons})',ctx),clips={},steps={};
for(let i=0;i<data.journey.length;i++){
 const stage=data.journey[i];vm.runInContext(`cursor=${i};render()`,ctx);
 let copy=nodes.prompt.textContent;
 if(stage.kind==='intro')copy="Hi! Let's explore how a camera's position changes a picture. We'll start at eye level, then look from below and above. Grab something to draw with, and let's have fun.";
 else if(stage.kind==='finish')copy="Nice work! Put your three sketches side by side. Look at the ground and the character. What changed? Each viewpoint tells the story a little differently. Keep exploring, and have fun drawing!";
 else if(stage.kind==='reference')copy="This is our teacher's quick-sketch reference step. Watch the sketch when it's available, then give it a try yourself. Have fun, and make it your own.";
 else if(stage.kind==='review')copy=["Let's bring it all together. A friend stops to say hello. Draw a small sketch at eye level. Keep the person and the setting simple.","Keep the same greeting, but move the camera lower. Draw a second little sketch looking up. Notice what feels different.","Now move the camera higher and look down. Draw your third sketch. Notice how much ground you can see around your friend."][stage.angle];
 else if(stage.step===0)copy=["Let's start with a normal shot. The camera is at the same height as our friend's eyes. Look at the camera on the left, then see its picture on the right.","Now let's try a low angle. The camera moves down and looks gently upward. Compare the camera's position with the picture beside it.","Let's look from a high angle. The camera is above our friend, looking gently down. Notice the head and the ground around the figure."][stage.lesson];
 else if(stage.step===1)copy=["Start with a simple face and two eyes. See how the horizon line passes right through the eyes? In this scene, our camera and our friend's eyes are at the same height.","Begin with a simple head. Our camera is lower than the person's eyes, so the camera's horizon does not pass through their eyes this time.","Begin with a simple head. The camera is higher than our friend's eyes. Notice how the horizon and the person's eyes are at different heights."][stage.lesson];
 else if(stage.step===2)copy=stage.story===1?"This building faces two directions, so we use two vanishing points on the same horizon. One may be outside the picture. Drag the purple point and watch the lines change.":"This purple dot is the vanishing point. Drag it gently left and right along the horizon. Watch how the lines guide us into the space.";
 else if(stage.step===3)copy=stage.story===2?"Let's open up the room. Follow the floor and wall edges toward the vanishing point. Try a few light lines on your paper.":stage.story===1?"Follow the two directions around the building's corner. Each set of parallel edges leads toward its own vanishing point.":"Now follow the lines away from the vanishing point. They help us place the road and pavement. Keep your pencil lines light.";
 else if(stage.step===4)copy=stage.story===2?"Place a simple person inside the room, with their feet on the floor. A circle and a few lines are enough. You can use your own character style.":"Let's add our characters. Start with their feet on the ground, then add a head, body and a few simple lines. The friend farther away looks smaller.";
 else if(stage.step===5)copy=stage.story===2?"Add a desk and a shelf. Follow the room's perspective lines. Just a few simple shapes will tell us where we are.":"Add a little background: a couple of buildings and a tree. Keep it simple, so we can still see what our character is doing.";
 else if(stage.step===6)copy="Now it's your turn! "+data.lessons[stage.lesson].stories[stage.story][1]+" Use a simple stick figure, or invent your own character. Take your time, and have fun!";
 const key=crypto.createHash('sha256').update(copy).digest('hex').slice(0,12);
 clips[key]={text:copy,file:`audio/${key}.mp3`};steps[i]={text:copy,src:`audio/${key}.mp3`};
}
fs.writeFileSync(base+'audio/manifest.json',JSON.stringify({voice:'en-US-AvaMultilingualNeural',rate:'-3%',clips},null,2)+'\n');
fs.writeFileSync(base+'narration-data.js','// AI narration: same voice as the Foundation of Sketch introduction.\nconst STEP_NARRATION = '+JSON.stringify(steps,null,2)+';\n');
console.log(`${Object.keys(steps).length} steps, ${Object.keys(clips).length} unique audio clips.`);
