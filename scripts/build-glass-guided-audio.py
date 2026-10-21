"""Generates guide-voice narration for the Glass Cup and Bottle guided
studio (lessons/still-life-2a-glass-structure/guided/) from its flow.json.
Same voice/rate as every other guided lesson: en-US-AvaMultilingualNeural,
+2% rate -- a guide voice, not a clone of the teacher. Run from anywhere;
paths are relative to this file.
"""
from pathlib import Path
import asyncio, json
import edge_tts

ROOT = Path(__file__).resolve().parents[1]
LESSON = ROOT / 'lessons/still-life-2a-glass-structure/guided'
flow = json.loads((LESSON / 'flow.json').read_text())

jobs = []
for step in flow:
    if step.get('audio') and step.get('say'):
        jobs.append((step['audio'], step['say']))
    if step.get('watchAudio') and step.get('watchSay'):
        jobs.append((step['watchAudio'], step['watchSay']))

(LESSON / 'audio').mkdir(exist_ok=True)
print(f'{len(jobs)} audio files to generate')

async def one(rel_path, text):
    path = LESSON / rel_path
    if path.exists() and path.stat().st_size > 1000:
        print('skip (exists)', rel_path)
        return
    for attempt in range(3):
        try:
            await edge_tts.Communicate(text, 'en-US-AvaMultilingualNeural', rate='+2%').save(str(path))
            print('generated', rel_path)
            return
        except Exception as e:
            if attempt == 2:
                raise
            await asyncio.sleep(2)

async def main():
    sem = asyncio.Semaphore(3)
    async def guarded(rel_path, text):
        async with sem:
            await one(rel_path, text)
    await asyncio.gather(*(guarded(p, t) for p, t in jobs))

asyncio.run(main())
