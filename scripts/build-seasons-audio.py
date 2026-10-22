"""Build Seasons in Color narration with the same Ava voice used by Foundation."""
from pathlib import Path
import asyncio
import json
import edge_tts

ROOT = Path(__file__).resolve().parents[1]
COURSE = ROOT / "seasons-in-color"
VOICE = "en-US-AvaMultilingualNeural"

flow = json.loads((COURSE / "flow.json").read_text())
clips = {step["id"]: step["say"] for step in flow}
clips.update({
    "feedback-great": "Wow, congratulations! You created four seasonal color ideas of your own. You already have a strong feeling for color, weather, and atmosphere.",
    "feedback-expressive": "Wonderful. You created four seasonal color ideas of your own. Color can carry weather, temperature, and emotion. Now let us compare your choices with the colors in today's classroom painting.",
})


async def main():
    out = COURSE / "audio"
    out.mkdir(exist_ok=True)
    semaphore = asyncio.Semaphore(3)

    async def build(clip_id, text):
        path = out / f"{clip_id}.mp3"
        if path.exists() and path.stat().st_size > 1000:
            return
        async with semaphore:
            for attempt in range(4):
                try:
                    await edge_tts.Communicate(text, VOICE, rate="+0%").save(str(path))
                    print(f"Generated {path.relative_to(ROOT)}", flush=True)
                    return
                except Exception:
                    if attempt == 3:
                        raise
                    await asyncio.sleep(2 + attempt * 2)

    await asyncio.gather(*(build(clip_id, text) for clip_id, text in clips.items()))


asyncio.run(main())
