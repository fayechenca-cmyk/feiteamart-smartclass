# Meet the cylinder

83.15-second H.264/AAC film, 1280×720, with English Ava teacher-style synthetic
narration, optional English captions, teacher drawing clips and a moving-light
animation. No music competes with instruction. Replaces the two opening images,
long welcome prose, and the separate reference / drag-the-sun screens.

The original numeric slots 1 and 2 remain retired and hidden so saved local and
cloud progress still points at the same teacher drawing video. Opening continues
to slot 3 (tools). Retired slots redirect to tools. The opening carries the combined
10 XP. No access, submission, or student-record schema changes.

## Sources and reproduction
Use scripts/render-cylinder-intro.py --media-dir <temporary directory>, with
Pillow, numpy, imageio-ffmpeg and macOS Arial fonts. scenes.json contains the
complete narration and timing. Generate voice-0.mp3 … voice-7.mp3 using
edge-tts en-US-AvaMultilingualNeural, rate +3%; scenes.json input is an array of
[title, cue, narration]; durations.json is the duration of each MP3 plus 0.5 seconds.

Teacher Cloudflare Stream UIDs and selections (seconds; retain 12 seconds where
available; use sequential decoding and the 480p rendition):
- structure: ba31784be13c1abc6875e4ce3c576502, 130
- ellipse: ba31784be13c1abc6875e4ce3c576502, 235
- shadow: 7041b79d8a1c9260ff1edafe698c3803, 100
- tones: 9add7a539ac67b520577be264a5a0efb, 100
- finish: 7f14e8ccbc6831ec6710578bf58f3d6c, 2

Original lesson images, saved temporarily as reference.png and process.png:
- https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/6a04015ab9ca88ca7443c9b5_13c170a0-dc4c-4939-82fe-b67443f69ffd.png
- https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/6a05f01239dce22e7426971a_ChatGPT%20Image%20May%2014%2C%202026%2C%2008_53_19%20AM.png

Clips are paced to the narration. Blue/mint overlays highlight construction and
surface changes. The six-panel summary follows the existing process image.
Only the final video, poster, captions and small script/source records are kept
in the repository; temporary clips and intermediate renders stay outside it.
