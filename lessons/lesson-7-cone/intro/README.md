# Meet the cone

31.75-second orientation replaces the opening selection widget in-place. The
existing ready step, six teacher videos, completion and saved indices are unchanged.
Includes English teacher-style synthetic Ava narration (+5%), original 114 BPM
major-key pluck/bell music mixed under speech, optional English captions, short
labels, teacher work and real drawing motion. Final movie is H.264/AAC, 1280×720.

Rebuild with scripts/render-cone-intro.py --media-dir <scratch inputs>, using
Pillow, numpy, imageio-ffmpeg and macOS Arial. scenes.json records final narration
and timings; scratch scenes.json uses [title, narration] pairs. Generate the six
voice-N.mp3 files with edge-tts; the renderer measures them and creates music.

Teacher clip sources (Cloudflare UIDs, start seconds, 10-second excerpts):
- structure: 7b4009c2092517f6ba7521bda4f357b7, 90
- ellipse: 7b4009c2092517f6ba7521bda4f357b7, 169
- tone: 256f7d6adb99fb2b99fa6b1bba71a179, 40
Existing final drawings are read from assets/sketch-support/finals.

rocket.jpg uses the existing course image:
https://images.unsplash.com/photo-1516849677043-ef67c9557e16?w=1000
Only its tapered nose is highlighted; this is an everyday approximation of a cone.

examples.png is a generated photographic illustration (not a student photograph):
a full waffle cone on mint at left and a child wearing a pointed paper party hat
on peach at right. The old ice-cream photo showed only scoops, and the old party
photo had no hat, so neither was appropriate for teaching cone recognition.
Original generated illustration:
/Users/fayechen/.codex/generated_images/01a0fdd5-8654-7d90-853a-f1f71499dddb/exec-8d6f1461-ad65-4522-bf51-8914a6df3b8d.png

Scratch downloads, voice files and intermediate renders stay outside the repo.
Only the final movie, poster, captions and small production records are published.
