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

## 2. Teacher demo videos (Steps 1-4)

Updated 2026-08-28: Faye supplied three real Cloudflare Stream video IDs,
now wired into `STUDIO_STEPS` via `cfStreamSrc()` in `index.html`. There
are now **4** studio steps, not 3 — Faye confirmed a 4th video is still
being finalized.

- Step 1 ("Let the Colors Flow") and Step 2 ("Let Shapes Appear") have
  their real title/content/copy per the spec, and now real video too.
- Step 3 has a real video (`STUDIO_STEP_VIDEO_IDS.step3`) but still
  carries `status: 'pending-content'` — its title/materials/instructional
  copy remain undefined until Faye describes what the video shows
  (materials, colors, shapes). Do not invent that copy. It ships as
  "STEP 3 — COMING NEXT" with the real video embedded above the
  placeholder note.
- Step 4 is brand new (`STUDIO_STEPS[3]`), also `status:
  'pending-content'`, with no video yet — `videoSrc` is still an empty
  TODO. It ships as "STEP 4 — COMING NEXT."
- The **video-order mapping is an assumption**, not yet confirmed by
  Faye: Video A → Step 1, Video B → Step 2, Video C → Step 3, read off
  the order the three IDs were pasted in. It's centralized in the single
  `STUDIO_STEP_VIDEO_IDS` config object in `index.html` — if Faye
  corrects the order, only that one object needs to change.

Still needed from Faye:
- A one-line description of what Video C (Step 3) shows, so its title
  and tiny-note copy can be written in the same style as Steps 1-2.
- Confirmation of the video-order mapping above.
- Video 4, whenever it's ready.

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
