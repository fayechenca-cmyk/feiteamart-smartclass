# Leather Crafting — implementation and review notes

Local preview: `http://127.0.0.1:8042/material-art/leather/`.

Status: published Smart Class, 210 learner checkpoints. Introduction → Materials → Eye → Cat → Dog. The corrected Dog Coloring source is now divided into nine guided video steps.

## Implemented experience

- The complete original teacher introduction plays before the interactive overview. It is followed by four moves, three projects, and the watch/make/check rhythm.
- Eight numbered material photographs were found, rather than seven. All eight have English image labels and a zoomable tool-board gallery. Tool sizes shown in the photos are preserved; differences from the video are explained in the relevant prompt.
- Portrait teacher video and reference side by side on tablet/desktop; stacked on phones. Video uses contain sizing, preserving the hands. Fullscreen control is available where the browser allows it.
- Reviewed action boundaries for Materials and Eye. Cat and Dog chapter steps are based on the spoken transcript and visual reference sampling. Extended silent Cat Carving practice subdivisions still need a final continuous editorial watch before release; they are not claimed as frame-accurate lesson transitions.
- Each video step pauses at its endpoint. The material tour and selected significant checkpoints request learner confirmation; ordinary video steps can continue without repeated checkboxes. Replay, seeking, speed controls, reference zoom, original narration, quiet mode, and a course map are available.
- Material tool hotspots; selected portrait-reference hotspots; actual demonstration stills for other steps. These are per-step reference cues, not object tracking in the video.
- Eye, Cat, and Dog original printable patterns open at the relevant steps. Eye's outer triangle is checked against 6 cm. Cat/Dog source sheets have no verified print-scale metadata, so the learner must check the fit before cutting.
- Drying checkpoints preserve the wait in the lesson. Shared two-needle stitching is revisited from Eye. The Dog frame-making upload shows the Cat technique; the learner-facing note identifies this reuse.
- Progress is saved locally under the existing learner profile identity when present, otherwise guest. No cloud progress or badge integration is claimed. Reflection and JSON progress export are included.

## Voice

English guide voice: `en-US-JennyNeural`. Audio is prerecorded, not browser speech synthesis. Original video sound is muted in guide mode, preventing overlap.

Materials and Eye have 146 manually edited English narration cues timed to actual actions. These retain the important demonstrated instructions while correcting transcription errors (for example, edge creaser versus beveler, finger protectors, and inconsistent eye-size wording). Silent demonstration intervals remain silent. Cat outlining, carving, coloring, and shared framing also have edited narration at demonstrated key points, including the later burned-in carving captions. Remaining chapters have short English step introductions rather than a replacement of every sentence. The original narration remains selectable.

Guide playback follows video time, pause, seeking, buffering, and playback speed. Short guide text is shown as captions; original burned-in captions remain in the source videos. Machine-generated transcript drafts are kept outside the published course and are not used as learner captions.

## Source issues

1. **Dog Coloring**: the defective upload (`86acd9e369f6f0b7ddd77da244ba9006`) was replaced with `f32f4d9ba0323f18895b279f2764a031`. The replacement is 26:13. Sampled frames from 00:01 through 26:00 show the teacher continuing through base color, eyes, ears, gray highlights, and final details. Its HLS manifest has an audio rendition through the video end. The course now covers it in nine sequential steps and no longer blocks Dog completion.
2. **Cat Carving** (`e8590f29eada2dcfda7125417e72bee9`): actual video is about 3431 seconds; audio rendition is about 5954 seconds. Later video stills show continuing handwork, while the English audio is silent. The lesson ends within the actual video and never exposes the silent padded tail or ASR hallucinations. Extended carving practice needs final continuous editorial review and fuller narration.
3. **Dog Frame Making** repeats the Cat framing technique but its supplied picture and English audio do not align at the same timestamps (the 500-second frame is still skiving). The course therefore uses the verified Cat Frame source for both projects and explicitly labels it as shared technique.
4. No standalone Cat Carving Reference image was found among the relevant hosted images inspected. Actual carving-video stills and the original/finished Cat images are used instead.

## Files and rebuilding

- `material-art/leather/index.html`, `studio.css`, `studio.js`: isolated static player.
- `course.json`: checkpoint sequence, source IDs, print references, hotspots, narration cues.
- `sources.json`: public source-image and Stream asset mapping.
- `assets/sheet-1-en.png` … `sheet-8-en.png`: translated image boards.
- `assets/intro-material.mp4`: edited introduction excerpt.
- `assets/audio/`: prerecorded guides.
- Production scripts and transcript drafts: `/Users/fayechen/Documents/leather-production/` (not shipped as course assets).

Build the base data with `projects.py`, then `build_course.py`. The builder reapplies `timed-render.json` when present. `voices.py` generates short step guides; `timed_guides.py` and `render_timed_audio.py` prepare the timed Materials/Eye tracks. `check_course.py` checks unique IDs, source references, media bounds, missing local files, and guide duration.

## Validation and remaining release work

Browser checks cover real Cloudflare playback, endpoint pause, learner confirmation and continuation, reference zoom pausing, and tablet/phone layouts. Static validation checks all 210 steps and their media bounds.

Remaining editorial review: continuously watch the extended Cat Carving sections and expand Cat/Dog English narration if full replacement of the original audio becomes necessary.
