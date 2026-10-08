from pathlib import Path
import asyncio,json,hashlib,re
import edge_tts
ROOT=Path(__file__).resolve().parents[1]/'assets/sketch-support'
items=json.loads((ROOT/'pause-audit.json').read_text())
extra={
'Start with a straight centerline':'A light centerline helps you compare the left and right sides of the bottle. Keep it straight, then check both sides against it.',
'Measure proportions with tick marks':'Compare the height and width before adding detail. Small tick marks help you keep the bottle and cup in proportion.',
'Straight lines block in the shape':'Use light, straight construction lines to find the big shape first. You can soften the corners once the proportions look right.',
'Straight edges find angles fast':'Look at the sloping edges of the bottle. Compare their angles with your pencil before refining the curved outline.'}
manifest={}
for p in items:
 text=p.get('voiceoverEn') or p.get('text') or extra.get(p['title'],p['title'])
 if p['lesson']=='lesson-3-cube':text=re.sub(r'\bsphere\b','cube',text,flags=re.I)
 text='Let’s pause here. '+text
 key=p['lesson']+'|'+p['title']+'|'+str(p['time'])
 uid=hashlib.sha256((key+text).encode()).hexdigest()[:16]
 manifest[key]={'file':f'audio/{uid}.mp3','text':text}
(ROOT/'audio').mkdir(exist_ok=True)
(ROOT/'narration.json').write_text(json.dumps(manifest,indent=2))
async def main():
 sem=asyncio.Semaphore(3)
 async def one(key,item):
  path=ROOT/item['file']
  if path.exists() and path.stat().st_size>1000:return
  async with sem:
   for attempt in range(3):
    try:
     await edge_tts.Communicate(item['text'],'en-US-AvaMultilingualNeural',rate='+0%').save(str(path));print('Generated',key,flush=True);return
    except Exception:
     if attempt==2:raise
     await asyncio.sleep(2)
 await asyncio.gather(*(one(k,v) for k,v in manifest.items()))
asyncio.run(main())
