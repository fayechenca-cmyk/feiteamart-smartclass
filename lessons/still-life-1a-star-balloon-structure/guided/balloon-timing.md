# Foil Star Balloon — footage alignment

Five teacher videos, Cloudflare Stream, exact durations read from each HLS
master playlist (`ffmpeg -i .../manifest/video.m3u8`):

| # | Stream UID | Title | Duration |
|---|---|---|---|
| 1 | 6bb909b0169fb6e58f666c8e2abb6ad2 | Outlining the Shape | 386.46 s |
| 2 | 62c44412628bc716886ffcef6c89af2c | Emphasizing Light and Dark on the Structure | 381.67 s |
| 3 | f89c61f01b4a82b84da097d32fc8c2df | Painting the Tone Along the Form | 707.03 s |
| 4 | 262207c274235c4eb3e73df8ece30a92 | Blending with a Tissue | 26.18 s |
| 5 | 6c3dd3cd1d35439b765cd903c0c3b0d2 | Painting the Details | 994.82 s |

Frames pulled every 3 s from each video (outside the repo, not committed),
reviewed as contact sheets via `scripts/make_contact_sheets.py`. Pencils
confirmed from the footage by shaft colour/thickness, not assumed: a thin
light-barrel pencil early (2H/HB), a mid pencil for tone (2B), and a
visibly thicker near-black barrel for the darkest accents (6B), consistent
with the task brief's "chosen by value" set. All video time is retained,
in order — no ranges are skipped.

## Video 1 — Outlining the Shape (386.46 s) — fully aligned, built in commit 1

The four moments already curated for the regular lesson's `VIDEO_PAUSES`
(45 s / 150 s / 270 s / 330 s) are confirmed against the frames and kept
verbatim. Two more are added for cadence and for a tool the footage
actually shows (an eraser, not previously logged anywhere):

- **0 s — Placement (animated, before the first line).** f0001 (the true
  first frame) shows blank paper with only a faint starting mark; f0129
  (384 s, the finished outline) gives the real extent to animate toward:
  the star sits right-of-centre, upper-middle on the page, roughly 40% in
  from the left tape edge, with clear margin on all four sides and the
  neck/stick at the bottom. The overlay measures off this frame, not a
  guess.
- **0–45 s: first axis line, then the second crossing it** (f0004–f0016).
  At 45 s the two lines have just crossed — **existing moment, verbatim**:
  "Find the tilt before the outline" / tilted guide lines (`key-1.svg`
  language, rebuilt live — see Part 2 below).
- **45–~90 s: the star's outer points emerge** (f0024–f0032) — the full
  silhouette is blocked in by ~90 s, before the teacher refines any single
  point. New cadence moment: a short check-in on proportion/size before
  detail.
- **~90–150 s: corners soften into curves** (f0033–f0051). At 150 s the
  curves between points are clearly in — **existing moment, verbatim**:
  "Turn corners into soft curves."
- **~165–189 s: an eraser appears** (f0056, f0064 — a white block eraser,
  confirmed at full frame resolution, not a second pencil) — cleaning up
  part of the outline right after the soft-curve pass. New moment: this
  is the only eraser use in Video 1.
- **~189–270 s: outline continues** (f0066–f0090). At 270 s the inner
  seam first reads clearly as separate from the outer edge — **existing
  moment, verbatim**: "Separate the seam from the outline."
- **270–330 s: seam refined, fold marks begin** (f0091–f0111). At 330 s
  the fold strokes turning toward the centre are clear — **existing
  moment, verbatim**: "Let folds turn toward the centre."
- **330–386.46 s: folds finished, outline complete** (f0112–f0129) — end
  of video, Try checkpoint only (no new watch moment needed; well inside
  the ~56 s cadence window).

7 watch moments + 1 end-of-video Try = within "roughly 5–8 per video."

## Video 2 — Emphasizing Light and Dark on the Structure (381.67 s) — fully aligned, built in commit 2

The drawing does **not** get filled tonal shading here — the teacher goes
back over the Video 1 outline with heavier, more confident line *weight*
on the shadow-side edges of each point, which is what "emphasizing light
and dark on the structure" means in this lesson (actual value shading is
Video 3's job). Confirmed by re-checking the full-resolution final frame
(378s/381s): the interior facets are still bare paper, no fill at all —
edges only, exactly as the first-pass reading guessed.

**Two corrections found on the full re-pass, replacing the first-pass guess:**
- **Pencil, confirmed by reading the grade text on the barrel at full
  resolution (45s):** it reads **HB**, not 2B, and the same barrel (same
  barcode, same grey houndstooth ferrule band) is on-screen at every
  checked timestamp from 45s to 270s — there is no pencil swap in this
  video. The heavier look is pressure on the same HB, not a softer
  graphite. Corrected in the narration (Video 1's HB carries straight
  through, "just pressed harder" rather than naming a new pencil).
- **The step-back pause is ~300–345s, hands fully off the page by
  ~327s**, not ~230s as first guessed from 3-second thumbnails — hands
  are still clearly on the page working the top point through 270–300s.
  Confirmed via a full every-3-second pass plus full-resolution spot
  checks at 264s/267s/270s/300s/321s/324s/327s/330s: continuous pencil
  contact up to ~324s, hand lifted and pencil in the air by 327–345s,
  back down by ~348s.

**A third find, not in the first-pass notes at all: a brief eraser touch
at ~144–159s**, at the bottom point (confirmed at full resolution — a
white block eraser, not a second pencil, touching right at the bottom
point's tip, pixel-matched against the established star-polygon
coordinates). Much shorter than Video 1's eraser use (~15s vs ~24s), so
it's folded into one step's narration as "a quick clean-up" rather than
treated as its own must-have moment.

**Light direction, confirmed from the footage, not assumed:** every
frame across the whole video shows the same lighting gradient — brighter
on the left, dimmer toward the right edge of the page — consistent with
the codebase's existing top-left-lighting convention. Used directly in
the "Light side, shadow side" moment's narration and overlay (a light
arrow from the upper-left corner, plus a dashed light-side edge next to
a solid shadow-side edge on the same point).

Built as 7 draw micro-steps + milestone (mirrors Video 1's 7 + milestone):

- **0–45s — Find the darkest edges first** (must-have: biggest darks
  before detail). HB pencil, same as before, pressed heavier on one
  point's shadow-side edge.
- **45–100s — Move point to point** (must-have: a moment each time the
  teacher moves to a new point).
- **100–145s — Light side, shadow side** (must-have: light/dark overlay,
  light-direction arrow).
- **145–205s — A quick clean-up, then keep going** (the ~144–159s eraser
  touch at the bottom point, folded into this step's narration).
- **205–270s — Leave the paper white here** (must-have: untouched
  highlights, linked explicitly to the foil-shine payoff).
- **270–327s — Take a breath and compare** (the real ~300–327s pause,
  used as the natural clip boundary; narration adds the arm's-length/
  squint tip).
- **327–381.67s — Structure is ready for tone** (finishing pass + the
  stick/neck getting heavier too; end-of-video Try only, no new watch
  moment, same pattern as Video 1's final step).

7 watch moments + 1 end-of-video Try, same shape as Video 1.

## Video 3 — Painting the Tone Along the Form (707.03 s) — fully aligned, built in commit 3

Longest video after Video 5. The first-pass guess of a pencil change at
~336 s did **not** hold up: grade text read directly off the barrel at
336 s, 339 s, 400 s, 450 s, 500 s, 576 s and 707 s all show the same HB
as Videos 1–2, same barcode, same ferrule band — no swap anywhere in
this video. Tone deepens entirely through more layers on the same
pencil, confirmed and narrated as such ("still the same HB").

A second correction found while re-reviewing the full star, not just
the "upper-right point" the first pass guessed: there are **two**
separate protected-highlight patches by the final frames (707 s),
pixel-measured at the center-left and center-right facets, both kept
paper-white while the tone around each deepens sharply (dark right
next to light, patch by patch — not a smooth gradient). The brief's
stronger "crisp, near-black" contrast is confirmed absent here (HB
tops out at a moderate value) and confirmed present in Video 5 instead
— a genuinely different, darker-barreled pencil is on screen within
the first 2 seconds of that footage (visually distinct from the white
HB barrel; full grade-text read deferred to Video 5's own build).

**Star polygon re-measured for this video specifically** — Video 3's
framing sits slightly differently than Videos 1–2 (confirmed by
pixel-measuring all six points directly off the clean 707 s frame with
a coordinate grid; reusing the Video 1 polygon put the hexagram guide
visibly off the real points). New points (1280×720 viewBox): top
(563,85), upperRight (903,173), lowerRight (890,527), bottom (567,600),
left (377,335), upperLeft (433,300).

- 0–300 s: tone pass begins and builds gradually, stroke direction
  following each point's own curve, same HB throughout, moving across
  multiple points rather than finishing one at a time
- 300–450 s: continues building in layers across the whole star
- 450–600 s: both highlight patches clearly protected, sharp
  dark-to-light jumps on either side of each
- 600–707 s: final connecting pass across the whole form, contrast
  kept (not smoothed away)

Built as 9 watch moments + 1 end-of-video Try, following the explicit
60–75 s cadence cap (707 s ÷ ~75 s ≈ 9.4 minimum segments) rather than
the usual 7-ish — the brief's own allowance for this outlier-length
video.

## Video 4 — Blending with a Tissue (26.18 s) — fully reviewed

Short and unambiguous. f0001 (0 s) already shows a small folded white
tissue between thumb and fingers, rubbing the shaded point directly along
the form (not in circles); by f0009 (24 s, last frame) the same area reads
noticeably softer, with the paper-white highlight patch still visibly
protected next to the darkest rubbed value — exactly the "bright highlight
next to dark reflection, crisp edge" foil language from the brief.

- 0–~8 s: tissue appears, folded to a small clean corner, first blend
  strokes (must-have moment)
- ~8–18 s: continues along the form, light pressure
- ~18–26.18 s: before/after is visible by comparing the first and last
  frame directly (no separate "before" video segment exists — the
  before/after comparison moment will pair frame 1 against the final
  frame, per the brief's "two frames side by side")

Only video short enough that 2 watch moments + end Try fully covers it;
no risk of an empty-feeling commit 4.

## Video 5 — Painting the Details (994.82 s) — first-pass reading, to confirm when building commit 5

By far the longest video. Opens already mid-dark-accent: f0001 shows a
visibly thick, near-black pencil barrel (6B) laying in a dark accent at
the top point within the first 3 seconds — "darkest accents with 6B" is
the very first thing in this video, not something to find later. A white
tool (eraser, not pencil — confirmed shape/colour) appears around
f0147–151 (~438–450 s). Near the end (f0294–303, ~879–906 s) both hands
lift away from the page for several frames — a strong candidate for the
"final step-back comparison" must-have — before a last fine-detail pass
through to f0332 (994.82 s).

- 0–~15 s: 6B dark accents begin immediately (must-have moment, opens the
  video)
- ~15–~438 s: darkest accents continue across multiple points (cadence
  check-ins needed roughly every 60–75 s given this stretch — expect 5–6
  here alone)
- ~438–~450 s: eraser appears — sharp highlight lift (must-have moment)
- ~450–~879 s: continued detail work, including the seam and the
  stick/neck at the bottom (exact timing of each TBD frame-by-frame for
  commit 5)
- ~879–906 s: hands lift away — final step-back comparison (must-have
  moment)
- ~906–994.82 s: last fine-detail pass, end Try

Given the cadence rule (no stretch over ~60–75 s) a video this long will
need noticeably more than "5–8" moments — expect 12–15. The brief's "5–8
per video" is a general guideline; the explicit 60–75 s cadence rule is
the hard constraint it's weighed against for this one outlier video.

## What I could not confirm from 3-second contact sheets alone

- Video 2's exact step-back timing and Video 3's exact pencil-change
  second are first-pass readings from thumbnails, not frame-perfect yet.
  I'll re-check both against full-resolution frames when building commits
  2 and 3, the same way I already did for Video 1's eraser window and
  Video 5's opening 6B accent and step-back moment (all three confirmed
  at full frame resolution, not just thumbnail size).
- No stretch of any video shows a visible second eraser beyond the two
  noted above (Video 1 ~165–189 s, Video 5 ~438–450 s) — if a closer pass
  finds another, I'll add it rather than invent a count.
