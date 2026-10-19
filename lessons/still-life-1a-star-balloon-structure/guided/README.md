# Foil Star Balloon guided studio — independent design preview

An isolated experiment at `lessons/still-life-1a-star-balloon-structure/guided/`.
The existing regular lesson (`../index.html`) is unchanged. Built this commit:
welcome/materials/tissue/paper + Video 1 ("Outlining the Shape") complete,
with all six teaching moments plus the new animated placement overlay.
Videos 2–5 ship in later commits (see balloon-timing.md for the full
five-video plan).

## Learning flow (this commit)

Welcome → pencils (HB/2B/2H/6B, by value) → tissue (what it's for, used in
Video 4) → feel your paper → **placement** (animated: where the balloon
sits) → Video 1 in 7 micro-steps (6 teaching moments + an end-of-video
checkpoint) → milestone ("outline is ready").

Every second of Video 1 (386.46s) streams in order; no time range is
skipped. Four of the six moments (tilt guide lines 45s, soft curves 150s,
seam 270s, folds 330s) are the same ones already curated in the regular
lesson's `VIDEO_PAUSES`, reused verbatim. Two are new, found while
reviewing the footage frame-by-frame (see balloon-timing.md): blocking in
the whole shape at ~90s (closes an otherwise 105-second gap between the
two existing moments — well past the ~60–75s cadence rule), and a real
eraser the teacher uses at ~165–189s that wasn't logged anywhere before.

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

## Deliberate prototype boundaries

Only the `fei.balloon.guided-preview.v1` localStorage key is written.
This preview does not change official XP, account progress, paid access
*records*, submissions, or badges — `totalXP`, `completedLessons`,
`FOUNDATION_A_PATH` and `fei_user_profile` are never written by this file.
The eventual photo/submit step (later commit) will link to the regular
lesson for a real teacher submission, the same pattern Cube's preview
uses.

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
checkpoint, the ducked watch-narration starts exactly once per clip,
Video 1's 7 draw steps are contiguous from 0 to the real 386.46s
duration with no gaps, every referenced frame/audio file exists and is
non-trivial, native video controls stay off, and the access gate targets
this lesson's own id.

`node tests/balloon-guided-preview.cjs` — a full run through all 12
stages against a deterministic Cloudflare Stream mock (Playwright):
narration-gates each non-video scene, confirms teacher-audio ducking
starts/ends around each watch-narration, confirms an out-of-range seek
cannot complete a checkpoint while the real `clipEnd` does, confirms the
live SVG overlay (not a flattened image) is present at a checkpoint,
confirms the reference pane always shows the finished drawing, checks
desktop/iPad/phone/landscape layouts for horizontal overflow and
in-bounds controls, checks mute and the locked-future-steps map, and
finally confirms an unauthenticated visitor is redirected away before any
of this loads.
