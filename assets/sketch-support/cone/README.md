# Cone key moments

23 reviewed points across all six teacher demonstrations (4 / 3 / 2 / 5 / 7 / 2).
Source video IDs/durations are in sources.json. plan.json contains the timestamp,
short label, teaching narration and annotation category for each point.

SVGs embed unchanged teacher frames with blue #1262ff construction marks and mint
#00d5b0 arrows, following the existing Cube/Sphere teaching palette. The early
clean-up is erasing (video 2, 10s); tissue over the fingertip is shown at video 5,
520s. They are deliberately explained as different actions.

core/cone-key-moments.js uses the official Cloudflare Stream SDK timeupdate event.
Each point pauses once per visit; seeking skips earlier points instead of replaying
a backlog. The key-moment menu can reopen any point. Continue stops narration and
resumes the teacher video. There is no countdown. Step changes clean up listeners,
overlays and audio. A failed SDK load leaves manually accessible image guides.

Recorded teacher-style English narration is in the shared narration.json/audio
library (AvaMultilingualNeural), with tap-to-play fallback and optional transcript.

Rebuild images: python scripts/build-cone-key-moments.py
Rebuild missing audio: scripts/build-sketch-pause-audio.py (edge-tts required).
Temporary source JPEGs live outside the repository in /tmp/cone-pauses; only the
embedded final SVG and generated audio are retained.

Validation: all 23 image/audio entries load; automatic crossing pauses; repeated
updates do not repeat a shown point; explicit continue resumes; step changes remove
guides; 1440/1024/390px widths; existing lesson indices and reference layout retained.
