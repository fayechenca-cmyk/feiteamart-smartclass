# Foundation of Sketch welcome

A 35.2-second English course introduction, placed above the four Foundation branches.

- `intro.mp3`: finished stereo mix, 160 kbps, 44.1 kHz.
- `voice.mp3`: synthesized narration, Microsoft `en-US-AvaMultilingualNeural`, rate -3%, generated using [edge-tts](https://github.com/rany2/edge-tts) 7.2.8. This is not a recording of a human teacher.
- `narration.txt`: exact spoken copy.
- `voice.srt`: voice timing from synthesis.
- `captions.json`: subtitle cues shifted by 0.5 seconds to match the music lead-in.

Music is an original synthesized soft keyboard motif (78 BPM); no stock recording or third-party music samples. Voice is normalized to -17 LUFS; the music bed to -32 LUFS, with a short fade-in and fade-out. The mix is limited to avoid clipping.

Playback is opt-in. It uses the recorded file, so learners do not depend on browser TTS voices or a runtime speech service. A full transcript and synchronized visible captions are available. Navigation and backgrounding pause the audio. The introduction describes the full planned learning journey; branch cards retain their existing release labels.

Verified in Chromium at desktop 1440×1000, iPad landscape 1024×768, iPad portrait 768×1024 and phone 390×844. Real iPad/Safari and listening preference still benefit from user review.

To rebuild the mix from the recorded voice: install `numpy` and `imageio-ffmpeg`, then run `python3 scripts/build-sketch-intro-audio.py`. To regenerate the voice first, use `edge-tts --voice en-US-AvaMultilingualNeural --rate=-3% --file assets/sketch-intro/narration.txt --write-media assets/sketch-intro/voice.mp3 --write-subtitles assets/sketch-intro/voice.srt`. If narration timing changes, update scene timestamps in `core/sketch-intro.js`.

## Real-course film (published version)

`intro-film.mp4` pairs the approved 35-second mix with seven slide-like scenes. It is H.264/AAC, 1280×720, with fast-start metadata. `poster.jpg` is an actual frame; `captions.vtt` is an optional English caption track. The film shares one playback clock for picture, sound and captions. The page adds a subtle cube-plane outline and a five-value scale at the matching teaching moments; these page overlays are not baked into native fullscreen playback.

Source inventory (all from the existing FEI TeamArt system):

- 0–6.667 seconds, and 31.8–end: Preparation hatching demonstration, Cloudflare video `8bd402e0d2480692b41a65817038baf3`, source 98–108 seconds.
- 6.667–12.967: The Cube, video `9da68fb322c273cf67a707be97c9d7f7`, source 198–205 seconds.
- 12.967–19.367: Glass Cup and Bottle, video `7a16d51aea7a8c0fe366e76807085fdc`, source 35–42 seconds.
- 19.367–22.4: LFC-015, *Landscapes (Graphic Bands & Simple Shadows)*, existing course-library cover `685de20c9796613725769d1c_f0d46a5298a665ae2c3d7b66caf8c847.JPG`.
- 22.4–25.8: LFC-099, *Male Portrait Study*, existing course-library thumbnail `69fc1b9b7af2b9e530aaf771_Screenshot%202026-05-06%20at%209.56.55%E2%80%AFPM.png`. Empty left margin cropped for framing.
- 25.8–31.8: Preparation materials photo `6a173bd23acbf487b452a628_49dc1cbc-f5e2-4aa3-a113-5d89a228a165.png`.

The landscape and portrait scenes are labeled course-library studies, not released Foundation lesson footage. Existing branch availability remains unchanged. No student dashboards, names, progress or personal records were captured.

## Second visual edit

The current `intro-film-v2.mp4` (1280×720) and `intro-film-mobile-v2.mp4` (720×960) contain all titles, animated arrows, glow rings and teaching highlights in the actual video, including direct-link and fullscreen playback. Small screens select the portrait file on initial load. Both retain the approved narration/music and optional English VTT. Versioned URLs avoid stale video caches.

The twelve beats are: course preview, materials, hand control (shown once), cube structure, ice cream, glass edges, cup light/shadow, landscape, portrait, paper crane, gift box and closing invitation. The colored annotations identify concrete learning points.

Additional source frames are existing Cloudflare course-video thumbnails:
- Ice cream: `38837e97c0c435214adc35b0cc3b8fb2`, 80 seconds.
- Cup: `01cb2719246c22e4509ca54ed0c01c88`, 60 seconds.
- Paper crane: `7e43378fd346f73ec130e46a98c8fede`, 60 seconds.
- Gift box: `7c6090590f645d78bd35033ffcd9ec25`, 60 seconds.

Render with `scripts/render-sketch-intro-film.py --media-dir <selected-media-directory>` using Pillow, numpy and imageio-ffmpeg. Input names are listed in the script; preserve the downloaded course frames and short excerpts in the authoring media directory. Source images are not synthetic substitutes.

## Swan correction (v3)

The active wide and portrait videos are now `intro-film-v3.mp4` and `intro-film-mobile-v3.mp4`. The 19.365–22.4 second scene uses the teacher’s graphite swan supplied by Faye, preserved unchanged as `swan-teacher-study.jpg`. It replaces the colored-pencil landscape entirely in both current exports. The title and annotations now teach light/dark contrast and reflection. The swan source is part of the repository and is read directly by the render script. The other scenes, approved narration and timing remain the same.
