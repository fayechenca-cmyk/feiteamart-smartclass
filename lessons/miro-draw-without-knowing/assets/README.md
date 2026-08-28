# Assets for "Draw Without Knowing"

This lesson has no downloadable public-domain artwork to fetch (per the
compliance rule: no Miró artworks are embedded or reproduced anywhere —
museum links only). Item 1 is now resolved; item 3 is still fully pending
from Faye; item 2's four teacher-demo videos are wired in and titled but
carries two open confirmation flags of its own.

## 1. Mrs. Dawn's finished watercolor piece (Screen 02 — "Look First") — resolved 2026-08-28 (Addendum 3)

Faye supplied the real photo via a Cloudflare Images delivery URL, now
wired in as `MRS_DAWN_ARTWORK_SRC` in `index.html` (referenced directly,
same pattern as `STUDIO_STEPS`' Cloudflare Stream `videoSrc` values — not
downloaded into this folder). It's always labeled **"MRS. DAWN'S
VERSION — Inspired by Joan Miró"** on screen, never presented as an
original Miró piece.

All 7 discovery-chip hotspots in `LOOK_FIRST_CHIPS` were re-positioned
against the real artwork (previously generic/spread placeholders): each
`left`/`top` was verified by cropping the actual image at the proposed
coordinates and visually confirming the shape underneath (eye → the
circle-with-dot glyph, star → the asterisk mark, line → the zigzag,
dot → the isolated round dot, creature → the yellow/pink tentacled
figure, moon → the large yellow circle, strange → the spiral coil).

## 2. Teacher demo videos (Steps 1-4) — finalized 2026-08-28 (Addendum 2)

All 4 studio steps now ship with real video and real titles — the
"coming next" placeholder state has been retired entirely (no
`status: 'pending-content'` left anywhere in `STUDIO_STEPS`). The
video-to-step mapping is **confirmed** by Faye (she titled "the third
one" / "the fourth one" in order), not an assumption — see
`STUDIO_STEP_VIDEO_IDS` in `index.html`.

- Step 1 ("Let the Colors Flow") and Step 2 ("Let Shapes Appear"): real
  title/content/copy grounded in a video description Faye gave, plus
  real video.
- Step 3 ("Let Your Lines Wander") and Step 4 ("Add Color Sparks"): real
  title and real video, but their prompt/tiny-note copy was **drafted
  from the title alone** (Faye gave no video description for these two,
  only titles) — each carries `copyUnverified: true` in `STUDIO_STEPS`
  as a flag. **Faye still needs to sanity-check this copy against what's
  actually in the two videos** before it's treated as final the way
  Steps 1-2's copy is. If either video's content contradicts the current
  framing, it needs a one-line correction, not a rebuild.

Still open:
- Faye's sanity-check of Steps 3-4's copy against the actual videos
  (see above).
- Whether Steps 3-4 introduce any material beyond the existing four
  (Watercolor Paper, Watercolors, Medium Flat Brush, Marker/Drawing
  Tools). "Let Your Lines Wander" suggests a fine liner/detail pen may
  be involved; "Add Color Sparks" suggests a small/fine brush or
  dropper for accents — but no icon has been added to the Materials
  screen on that guess. The Materials screen (`renderMaterials()`) still
  shows its original 4 tiles plus one explicitly pending 5th slot,
  unchanged until Faye confirms.

## 3. Joan Miró portrait (Screen 03 — "Meet Joan Miró")

Ships **without a portrait** — Screen 03 uses an original hand-drawn
"artist mark" instead. Do not source a portrait image without Faye's
explicit confirmation of its license (public-domain or otherwise properly
licensed). If/when she supplies or approves one:
- Save it as `miro-portrait.jpg` (or the appropriate extension) in this
  folder.
- Document the source and license here, the same way `hokusai-great-wave.jpg`
  and `kandinsky-several-circles.jpg`'s provenance are documented in their
  own lessons' `assets/README.md` files.
