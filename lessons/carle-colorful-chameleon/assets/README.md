# Assets for "The Colorful Chameleon"

This lesson has no downloadable Eric Carle artwork to fetch (per the
compliance rule: no scraping/imitating copyrighted Eric Carle
illustrations — Screen 4 uses typography + a simple process diagram
only). One real asset is still pending from Faye.

## 1. Mrs. Dawn's finished chameleon collage artwork (Screens 1, 3, 14, 16)

Needs a photo of Mrs. Dawn's own finished paper-collage chameleon piece.
Used as the hero image on the Opening screen, in the "how was it made"
disassembly moment, as the labeled "MRS. DAWN'S VERSION" reference on
Details, and as the big reveal on the Completion screen. Once supplied:

- Save it as `mrs-dawn-chameleon-artwork.jpg` in this folder.
- Wire it into `index.html`'s `MRS_DAWN_ARTWORK_SRC` constant (added in
  Commit 2) the same way Miró's `MRS_DAWN_ARTWORK_SRC` and the Chameleon
  video IDs are referenced directly rather than downloaded — or download
  it locally if Faye's source is a personal photo rather than a stable
  CDN URL.
- It must always be labeled **"MRS. DAWN'S VERSION"** — never "Correct
  Example," "Final Answer," or anything implying it's the target to copy
  (per the spec's own repeated rule: "your colors, your textures, your
  shapes, your chameleon").
- Until supplied, every screen that shows it uses the same
  `onerror`-driven missing-image fallback UI already established for
  Miró's Screen 02 and Kandinsky's hero images.
- The "pieces separate" disassembly transition on Screen 3 does **not**
  attempt to crop real pieces out of this photo — it uses generic
  torn-paper silhouette shapes in the course's own palette instead (see
  the approved plan for why). That part of Screen 3 works the same
  whether or not this photo has been supplied yet.

## 2. Everything else is generated, not photographed

Texture swatches, worktable objects, the Texture Detective samples, and
the leftover-scrap shapes are all built with CSS/SVG (gradients, dot
patterns, scratch-line SVG, layered brush strokes) rather than
photographed or downloaded images — a deliberate choice (see the
approved plan), not a placeholder gap. Nothing to supply here.
