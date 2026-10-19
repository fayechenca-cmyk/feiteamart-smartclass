# Foil Star Balloon guided studio — complete

A full guided rebuild at `lessons/still-life-1a-star-balloon-structure/guided/`,
all five teacher videos. The existing regular lesson (`../index.html`) is
unchanged except for the default redirect into this preview. Welcome/
materials/tissue/paper + Video 1 ("Outlining the Shape") + Video 2
("Emphasizing Light and Dark on the Structure") + Video 3 ("Painting the
Tone Along the Form") + Video 4 ("Blending with a Tissue") + Video 5
("Painting the Details") are all built — the lesson now ends here for
real (recap → in-lesson submission → completion celebration → back to the
Still Life course map), never handing off to the classic lesson any more.
See balloon-timing.md for the full five-video alignment record.

## Learning flow

Welcome → pencils (HB/2B/2H/6B, by value) → tissue (what it's for, used in
Video 4) → feel your paper → **placement** (animated: where the balloon
sits) → Video 1 in 7 micro-steps + milestone → Video 2 in 7 micro-steps +
milestone → Video 3 in 10 micro-steps + milestone → Video 4 in 2
micro-steps + a before/after compare step + milestone → Video 5 in 14
micro-steps + milestone → **recap** (the five stage-result images in a
row) → in-lesson photo submission → completion celebration → back to
`lessons/still-life/`.

Every second of Video 1 (386.46s), Video 2 (381.67s), Video 3 (707.03s),
Video 4 (26.18s) and Video 5 (994.82s, the longest, hence 14 micro-steps
instead of the usual 7-ish) streams in order; no time range is skipped in
any of them. Four of Video 1's seven moments (tilt guide lines 45s, soft curves
150s, seam 270s, folds 330s) are the same ones already curated in the
regular lesson's `VIDEO_PAUSES`, reused verbatim. Two are new, found while
reviewing the footage frame-by-frame (see balloon-timing.md): blocking in
the whole shape at ~90s (closes an otherwise 105-second gap between the
two existing moments — well past the ~60–75s cadence rule), and a real
eraser the teacher uses at ~165–189s that wasn't logged anywhere before.
Videos 2 and 3 have no `VIDEO_PAUSES` entries to reuse (never curated
before these commits) — every one of their moments was found and timed
from scratch, including corrections made mid-build each time: Video 2's
step-back pause first read as ~230s from 3-second thumbnails but a full
frame-by-frame pass placed it at ~300–327s instead, and Video 3's
first-pass guess of a ~336s pencil change to 2B did not hold up under a
full re-check (still HB throughout — see balloon-timing.md for the full
account of both, plus Video 2's HB-not-2B correction and brief ~144–159s
eraser touch). Video 3's star-polygon overlay coordinates were also
re-measured from scratch against its own footage rather than reused from
Video 1/2 — the camera framing shifts slightly between videos, confirmed
by a visible mismatch on first build, then fixed with a pixel-grid
measurement directly off a clean Video 3 frame. Video 4 shares Video 3's
exact framing (pixel-confirmed), so its overlays reuse Video 3's measured
coordinates directly. Video 4 also introduces a new non-video scene kind,
`compare` — a before/after image pair with no clip attached, added
because the before/after must-have needed two frames side by side rather
than a single checkpoint frame; see `.compare-scene` in studio.css and the
two-phase-narration branch in `enter()` in studio.js. Video 5 shares
neither video's framing exactly (confirmed: Video 3/4's measured polygon
visibly missed the real points when drawn onto a clean Video 5 frame,
worst at the bottom point) — its own six points were re-measured from
scratch: top(570,65) upperRight(913,153) lowerRight(908,515) bottom
(580,588) left(376,324) upperLeft(465,290). Video 5 also introduces
`recap` (see below) and reuses `submit` (`core/guided-submit.js`,
already used by Cube/Sphere/etc., newly wired up here).

## The real ending (Video 5 → recap → submit → celebration → course map)

The lesson now ends for real, here, never handing off to the classic
lesson. After Video 5's own milestone ("Details complete"): a **recap**
step (new scene kind, `.recap-scene` in studio.css) shows the five
stage-result images side by side — outline, observed edges, tone, blend,
details — with one or two warm closing sentences; then the real in-lesson
photo submission (`core/guided-submit.js`, `courseId:'still-life'`, an
additive option added to that shared file so Foundation-of-Sketch Step 1's
six lessons keep their existing `course_id:'foundation-a'` unchanged);
then the same completion celebration every guided lesson uses
(`core/guided-reward.js`), extended with additive `badgeId`/`courseLabel`/
`progressGroups` options so it can show Still Life's own five-painting
progress ("Still Life and Texture", counting Pillow's two lessons as one
of five) and a 🎈 emoji fallback (the `still_life` badge has no artwork
yet) instead of Form & Structure's 11-lesson count and `basic_sketch`
badge — every one of the six existing guided lessons calls this same
function with none of those options and is unaffected (confirmed:
all six still pass their own test suites unchanged). Finishing redirects
to `lessons/still-life/`, the course map — not another lesson, since this
is Still Life's first entry, not a mid-path step.

One pre-existing gap found, not fixed here (flagged, not a Video 5 bug):
`core/course-badge-registry.js`'s own `still_life` entry still lists only
the retired `still-life-2b-glass-texture` id and is missing this lesson's
real id entirely — its progress number (driving the dashboard's badge
grid) will disagree with the celebration dialog's own count until that
registry entry is corrected separately.

Each teaching moment follows the Watch → Try rhythm from the Preparation
guided preview: the teacher clip plays, a short ducked narration plays
*over* it (the teacher's own audio mutes while the guide speaks, un-mutes
after), the clip then pauses at its checkpoint, and a separate untimed Try
prompt waits for the student to tap Continue — never a countdown.

## The live teaching overlay (new this lesson)

The regular lesson's `assets/sketch-support/balloon/key-N.svg` files are
each a *flattened* PNG with the guide lines/arrow/card baked in as one
static image. This preview rebuilds the same visual language — blue
dashed guide strokes, a turquoise arrow, the white "LOOK CLOSELY" card —
as real SVG elements drawn live over the checkpoint photo
(`overlaySvg()` in studio.js, driven by a small declarative `overlay`
spec per step in flow.json). Being real SVG/CSS instead of a flattened
image means it scales correctly in fullscreen and can draw-on, fade, and
pulse (`.og-draw`/`.og-fade`/`.og-pulse` in studio.css) — all disabled
under `prefers-reduced-motion`.

The **placement** moment (before the first pencil line) is the most
involved use of this: paper edge → the balloon's bounding box grows into
place → centre cross + margins → fades toward the star silhouette. The
box coordinates are measured proportionally off the actual footage (the
blank first frame, and the finished 384s outline), not guessed — see
balloon-timing.md.

The finished reference drawing (`assets/sketch-support/finals/balloon.jpg`)
sits beside the video throughout Video 1, constant, no caption — the same
layout standard as the regular lesson, not a per-moment diagram.

## Access gate — this lesson is paid, not a free back door

Foundation of Sketch Step 2 (this lesson's `still-life-1a-...` id) is
gated the same way the regular lesson's own code is *designed* to gate
it: `FEIAccess.canOpenLesson('skills', lessonId)`, default-deny for any
id not in `core/access.js`'s free set (only `preparation` and `cube` are
free).

**Finding, reported as asked:** the regular lesson's own `gateThenStart()`
calls `FEIAccess.gateLessonPage(...)`, but `core/access.js` is never
`<script>`-included on that page — `window.FEIAccess` is undefined there,
so its `if (window.FEIAccess && ...)` guard silently no-ops and the page
currently enforces nothing at the page level (the dashboard's own
click-time check is what actually stops most students; a direct URL
bypasses it today). This preview does not inherit that gap: it loads
`core/auth.js` + `core/access.js` itself and calls
`FEIAccess.canOpenLesson('skills', 'still-life-1a-star-balloon-structure')`
directly — the same primitive `gateLessonPage()` itself calls — rather
than `gateLessonPage()`, because that helper's redirect path (`../../`)
assumes a lesson page one directory below the site root; this preview
lives one directory deeper (`lessons/<id>/guided/`), so it computes its
own correct `../../../` home path instead. Confirmed both ways in
`tests/balloon-guided-preview.cjs`: an unauthenticated visitor is
redirected away before the flow ever loads, and a paid/legacy session is
let straight through.

## Real completion, now that Video 5 is built

Unlike the earlier prototype commits, finishing this lesson now writes
for real: `completedLessons` gains this lesson's id (`GuidedPlatform.
complete(LESSON_ID)`), the in-lesson photo submission is a real
`student_submissions` row, and the completion celebration reads/updates
the same account profile every other guided lesson does. `totalXP`,
`FOUNDATION_A_PATH` and `fei_user_profile`'s own field names are never
renamed, per the platform's hard rule — only `completedLessons` and
`completedSteps` are written, the same two fields Cube/Sphere/etc. write.
Per-step progress still lives under its own `guided:fei.balloon.guided-
preview.v1` slot inside that profile (via `GuidedPlatform.save`/`restore`),
same as before.

## Media and provenance

Teacher footage: the five existing FEI TeamArt Cloudflare Stream videos
for this lesson (see balloon-timing.md for UIDs and exact durations, read
from each HLS playlist). Checkpoint frames in `frames/` are stills pulled
from that same footage. The finished-drawing reference and the toolkit/
paper images are existing repository assets (`assets/sketch-support/`),
reused from the Cube preview where identical. The tissue-intro icon is a
small hand-drawn inline SVG (no icon library, nothing to license). New
guide narration: `en-US-AvaMultilingualNeural`, +2% rate — the same guide
voice as Cube and Preparation, not a clone of the teacher; the teacher's
own recorded video audio is unchanged. All new narration scripts live in
flow.json; generated via `scripts/build-balloon-guided-audio.py`.

## Verification

`node tests/balloon-guided-boundaries.cjs` — a deterministic, browser-free
check: out-of-range seek/`ended` can never unlock or complete a
checkpoint, the ducked watch-narration starts exactly once per clip, each
video's draw steps are contiguous across that video's own real duration
with no gaps (386.46s for Video 1, 381.67s for Video 2, 707.03s for Video
3, 26.18s for Video 4, 994.82s for Video 5 — tracked per-uid, since each
video's own timeline starts at 0), every referenced frame/audio file
exists and is non-trivial (including Video 4's `compare.before`/
`compare.after` images and Video 5's recap's five stage images, none of
which have a uid/clip of their own), native video controls stay off, the
access gate targets this lesson's own id, the flow ends on its own
`submit` step, and the old classic-lesson handoff string is gone from
studio.js entirely.

`node tests/balloon-guided-preview.cjs` — a full run through all 53
stages against a deterministic Cloudflare Stream mock (Playwright):
narration-gates each non-video scene, confirms teacher-audio ducking
starts/ends around each watch-narration, confirms an out-of-range seek
cannot complete a checkpoint while the real `clipEnd` does, confirms the
live SVG overlay (not a flattened image) is present at a checkpoint —
except Video 5's own final moment, which deliberately has none, just the
finished drawing — confirms the reference pane shows that step's own
result (not a single constant image), checks desktop/iPad/phone/landscape
layouts for horizontal overflow and in-bounds controls, checks mute and
the intentionally-unlocked Journey map, confirms every video's own
milestone continues straight into the next video (or into the recap, for
Video 5's), exercises Video 4's "compare" step's two-phase narration
(watchAudio then audio, with `#next` staying disabled until both finish)
and confirms its two before/after images render, exercises Video 5's
`recap` scene (five images) and real `submit` step (continuing without a
photo still works), confirms clicking the true final step's "Celebrate"
opens the real completion dialog with Still Life's own progress numbers
and emoji-fallback badge, confirms it redirects to the Still Life course
map and that `completedLessons` actually gained this lesson's id, and
finally confirms an unauthenticated visitor is redirected away before any
of this loads. Hard rule, enforced in the test itself: it must never
reach the live Supabase project — every request to it is intercepted
(Playwright guarantees a routed request never reaches the real network)
and the test asserts the mock was actually exercised, not just silently
skipped.
