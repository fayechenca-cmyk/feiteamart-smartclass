# Assets for "Draw Without Knowing"

This lesson has no downloadable public-domain artwork to fetch (per the
compliance rule: no Miró artworks are embedded or reproduced anywhere —
museum links only). Three items are still pending from Faye before the
lesson can be considered fully shipped.

## 1. Mrs. Dawn's finished watercolor piece (Screen 02 — "Look First")

Needs a photo/scan of Mrs. Dawn's own Miró-inspired watercolor piece.
Once supplied:
- Save it as `mrs-dawn-artwork.jpg` in this folder.
- It must always be labeled **"MRS. DAWN'S VERSION — Inspired by Joan
  Miró"** on screen — never presented as an original Miró piece.
- The discovery-chip hotspot coordinates in `index.html`
  (`LOOK_FIRST_CHIPS`) are currently generic/spread placeholders — once
  the real photo is in place, recheck each hotspot's `left`/`top`/`reveal`
  against what's actually visible in the photo, the same way hotspots were
  verified against real artwork in the Yōkai and Kandinsky lessons.

## 2. Three teacher demo videos (Steps 1, 2, 3)

- Step 1 ("Let the Colors Flow") and Step 2 ("Let Shapes Appear") have
  their real title/content/copy already written per the spec — only the
  Cloudflare Stream `videoSrc` needs to be pasted into `STUDIO_STEPS` in
  `index.html` once Faye sends the embed URL (same pattern as every other
  course's video steps).
- Step 3 is **intentionally a placeholder** — `STUDIO_STEPS[2]` carries
  `status: 'pending-content'`. Do not invent a title, materials list, or
  instructional copy for it. It ships as "STEP 3 — COMING NEXT" until
  Faye has reviewed the third video and supplied real content.

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
