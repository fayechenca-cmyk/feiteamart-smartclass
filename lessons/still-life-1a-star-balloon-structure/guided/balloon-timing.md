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

## Video 2 — Emphasizing Light and Dark on the Structure (381.67 s) — first-pass reading, to confirm when building commit 2

The drawing does **not** get filled tonal shading here — the teacher goes
back over the Video 1 outline with heavier, more confident line *weight*
on the shadow-side edges of each point, which is what "emphasizing light
and dark on the structure" means in this lesson (actual value shading is
Video 3's job). Confirmed at full-frame resolution at the 378 s mark.

- 0–~45 s: first heavier pass, one point's shadow-side edge (f0001–f0016)
- ~45–~140 s: sweeping the same heavier line across the remaining points
- ~140–~230 s: continues toward the lower/base points
- ~230 s: a brief pause with hands off the page (f0101–f0109) — possibly
  stepping back to compare; worth a short check-in moment
- ~230–381.67 s: finishing pass across all points, ending on the full
  structure with clear light/dark edge weight throughout

Expect ~6 moments once re-reviewed frame-by-frame for commit 2: first-dark
highlight (must-have), 3–4 cadence check-ins across the sweep, one
step-back moment, end-of-video Try.

## Video 3 — Painting the Tone Along the Form (707.03 s) — first-pass reading, to confirm when building commit 3

Longest video after Video 5. Starts with the same thin pencil as Video 1;
a visibly darker, thicker barrel appears by the ~336 s mark (f0113–120)
and stays in use through the rest of the video. By the final minutes
(f0193–236, ~576–705 s) the tone is rich and a **clear untouched-white
highlight patch** is visible and deliberately preserved on the upper-right
point (f0196–200) — confirms the "protecting the brightest highlights"
must-have directly from the footage.

- 0–~150 s: light tone pass begins, 2H/HB-weight pencil, stroke direction
  following each point's curve
- ~150–~336 s: tone builds across more of the form, pencil change to 2B
  around ~336 s (needs frame-by-frame confirmation, not just contact-sheet
  reading, before commit 3)
- ~336–~576 s: deepest mid-tones built up, strokes still following form
- ~576–707 s: highlight areas deliberately left/kept white while
  surrounding tone deepens; final pass

Expect ~7–8 moments: stroke-direction-follows-curve, each pencil change,
protect-the-highlights, 2–3 cadence check-ins given the length, end Try.

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
