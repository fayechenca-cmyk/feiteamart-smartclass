"""Build fixed narration and matching word boundaries; edge-tts 7.2.8."""
import asyncio,json
from pathlib import Path
import edge_tts
ROOT=Path(__file__).resolve().parents[1]
SHOT=ROOT/'lessons/scene-drawing-foundation/unit-01-shot-size'
INTRO=ROOT/'lessons/scene-drawing-foundation/unit-02-viewpoints-perspective'
INTRO_TEXT="You’ve explored shot sizes, from wide shots to extreme close-ups. Moving closer helps us notice a person, an action, or one tiny detail. Now, let’s move our camera in a different direction: up and down. At eye level, a normal shot feels like standing beside someone. From above, a high angle reveals more of the ground and can make a character feel small. From below, a low angle can make someone feel tall, powerful, or impressive. In these lessons, we’ll move the camera, follow the horizon and vanishing points, and build simple scenes together. Same story, different viewpoint. Grab your sketchbook, and let’s explore!"
async def main():
 clips=json.loads((SHOT/'situation-audio/manifest.json').read_text())
 jobs=[(SHOT/'situation-audio'/f'{k}.mp3',v['text']) for k,v in clips.items()]
 jobs.append((INTRO/'audio/viewpoints-intro.mp3',INTRO_TEXT))
 sem=asyncio.Semaphore(3)
 async def make(file,text):
  timing=file.with_suffix('.json')
  if file.exists() and timing.exists():return json.loads(timing.read_text())
  async with sem:
   for attempt in range(3):
    try:
     cues=[]
     with file.with_suffix('.part').open('wb') as f:
      async for chunk in edge_tts.Communicate(text,'en-US-AvaMultilingualNeural',rate='-3%',boundary='WordBoundary').stream():
       if chunk['type']=='audio':f.write(chunk['data'])
       elif chunk['type']=='WordBoundary':cues.append(dict(text=chunk['text'],start=chunk['offset']/1e7,end=(chunk['offset']+chunk['duration'])/1e7))
     data=dict(text=text,cues=cues)
     timing.write_text(json.dumps(data,ensure_ascii=False,indent=2))
     file.with_suffix('.part').replace(file)
     print(file.name,flush=True)
     return data
    except Exception:
     if attempt==2:raise
     await asyncio.sleep(2)
 results=await asyncio.gather(*(make(*job) for job in jobs))
 manifest=[dict(file='situation-audio/'+file.name,**result) for (file,_),result in zip(jobs[:-1],results[:-1])]
 (SHOT/'situation-audio/data.js').write_text('window.SITUATION_AUDIO = '+json.dumps(manifest,ensure_ascii=False)+';\n')
 (INTRO/'intro-timing.js').write_text('window.INTRO_SPEECH = '+json.dumps(results[-1],ensure_ascii=False)+';\n')
asyncio.run(main())
