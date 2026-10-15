# Form and Structure — Level 2 intro film

Shown on the Form and Structure path under the "Level 2" divider, between Intersecting Geometry and Gift Box.

- `level2-intro-v1.mp4` — 1280×720, 30 fps, H.264/AAC, 92.8 s, fast-start.
- `poster.jpg` — a frame from the film (cube → gift box).
- Narration: Faye's ElevenLabs English voice-over (voice "Dan"), 88 s, placed 1.5 s after the music starts.
- Music: original synthesized bed (112 BPM, I–vi–IV–V in C), no samples; ducked about 7 dB under the voice. Mix about -18.5 LUFS.
- Pictures: real teacher demonstration frames from `assets/sketch-support/finals/` (cube, sphere, cylinder, cone, intersecting, box, apple, cup, ice cream, paper crane, dog) and the teacher's swan study in `assets/sketch-intro/`. These are still frames, not moving clips — the Cloudflare Stream footage could not be downloaded in the build environment. A later version can swap in 2–3 s live clips.

Rebuild: `python3 scripts/form-structure-intro/build-level2-intro-audio.py <narration.mp3>` (writes `mix.m4a`), then `python3 scripts/form-structure-intro/render-level2-intro.py out.mp4 mix.m4a` (Pillow + ffmpeg).

"Watched" state is stored per browser in localStorage key `fei_fs_level2_intro_watched`; it is a convenience only and does not affect access or progress.
