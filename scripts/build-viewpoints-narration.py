"""Generate the lesson's authored cues using the existing Sketch intro voice.
Run with an environment containing edge-tts==7.2.8. No credentials are stored.
"""
import asyncio, json
from pathlib import Path
import edge_tts
BASE = Path(__file__).resolve().parents[1] / 'lessons/scene-drawing-foundation/unit-02-viewpoints-perspective'
async def main():
    manifest = json.loads((BASE/'audio/manifest.json').read_text())
    limit = asyncio.Semaphore(3)
    async def generate(key, clip):
        target = BASE/clip['file']
        timing = target.with_suffix('.timing.json')
        if target.exists() and target.stat().st_size > 1000 and timing.exists():
            return
        async with limit:
            for attempt in range(3):
                temporary = target.with_suffix('.part.mp3')
                try:
                    cues = []
                    with temporary.open('wb') as audio:
                        async for chunk in edge_tts.Communicate(clip['text'], manifest['voice'], rate=manifest['rate'], boundary='SentenceBoundary').stream():
                            if chunk['type'] == 'audio':
                                audio.write(chunk['data'])
                            elif chunk['type'] == 'SentenceBoundary':
                                cues.append({'start': chunk['offset']/10000000, 'end': (chunk['offset']+chunk['duration'])/10000000, 'text': chunk['text']})
                    if not cues:
                        raise RuntimeError('Speech service returned no sentence timings')
                    timing.write_text(json.dumps(cues, indent=2)+'\n')
                    temporary.replace(target)
                    print('Generated ' + key, flush=True)
                    return
                except Exception:
                    if attempt == 2:
                        raise
                    await asyncio.sleep(2)
    await asyncio.gather(*(generate(key,clip) for key,clip in manifest['clips'].items()))
    timings = {clip['file']: json.loads((BASE/clip['file']).with_suffix('.timing.json').read_text()) for clip in manifest['clips'].values()}
    (BASE/'narration-timings.js').write_text('// Sentence timings returned with the matching synthesized audio.\nconst NARRATION_TIMINGS = '+json.dumps(timings, indent=2)+';\n')
asyncio.run(main())
