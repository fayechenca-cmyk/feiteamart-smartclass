# Foundation lesson support

## Final references
Teacher demonstration frames are shown alongside each Cloudflare video in the
10 Form & Structure drawing courses, Preparation, Balloon, Glass Cup and Bottle,
and Dog. Preparation uses individual practice/setup examples. Drawing lessons
use their finished goal throughout, labeled clearly so learners do not mistake
it for the output expected at every intermediate step. Original teacher media
IDs, selected times and source URLs are in finals/sources.json. Desktop uses
side-by-side layout; narrow screens use a compact card below the video. Tap to
enlarge. No access, submission or progress logic is changed.

## Key moments and narration
76 existing image/text pause points were audited: Sphere 26, Cube 18, Cylinder
28 and Glass 4. Balloon video 1 adds four reviewed demonstration frames at 45,
150, 270 and 330 seconds. Blue construction marks (#1262ff), mint arrows
(#00d5b0) and lavender prompts follow the existing Cube reference palette.
Annotations are SVG overlays over unaltered teacher frames, not replacement art.

All 80 points have recorded English synthetic teacher-style narration generated
with en-US-AvaMultilingualNeural at the default rate. No voice cloning or music.
Existing teaching text/voiceover is used; Glass's four image-only notes have new
short spoken explanations. Two copied references to a sphere in Cube's existing
copy were corrected to cube. narration.json is the audio/text manifest keyed by
lesson, title and timestamp; pause-audit.json records the source points.

Narration attempts playback when the video pauses, with a visible Listen control
when the browser requires a tap. Pause/replay and transcript are available. Voice
stops on Continue, hidden/removed panels, navigation or backgrounding. Key moments
wait for the learner instead of an automatic countdown, avoiding voice cutoffs.
Sphere's two-image point keeps its Next Tip then Continue sequence.

Build scripts: build-sketch-pause-audio.py (edge-tts 7.2.8),
build-balloon-key-moments.py, fetch-sketch-final-references.py. Existing completed
lesson/source work elsewhere in the repository was not modified.
