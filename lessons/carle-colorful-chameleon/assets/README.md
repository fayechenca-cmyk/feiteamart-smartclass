# Assets for "The Colorful Chameleon"

Updated 2026-08-28 (course-correction pass): Faye supplied the two real
source photos this course is now built from. Nothing here is invented —
every color/shape/texture in the lesson traces back to one of these two
photos or a crop derived from them.

## Source photos (referenced directly by URL, not downloaded)

- **Final chameleon artwork** — Mrs. Dawn's finished paper-collage piece.
  `FINAL_ARTWORK_SRC` in `index.html`:
  `https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/cf313ccd-d1e3-4f62-dc9e-2150b3a22500/public`
  Used as: the Opening hero, the "Find the Textures" hotspot image, the
  "before" state in the Screen 3 disassembly, and the Completion Reveal —
  always labeled **"MRS. DAWN'S VERSION"**, never "Correct Example" or
  "Final Answer."
- **Texture papers reference sheet** — 8 real painted-paper swatches on a
  cutting mat. `TEXTURE_REFERENCE_SRC` in `index.html`:
  `https://imagedelivery.net/IoNSXjEbekGjbxAZrhrYGQ/b42da379-6a69-4b1d-d838-00ffc9486900/public`
  Used as a "check your own papers against this" reference in the Texture
  Lab / Mission 1 area — a reference, not a template to copy.

## Derived crops (new files in this folder, cropped from the reference sheet above)

Each was cropped with a percentage bounding box against the reference
sheet's real pixel dimensions (1024×768), then visually verified (cropped,
viewed, confirmed clean before accepting) rather than guessed blind:

| file | source region (crop box, % of 1024×768) | technique |
|---|---|---|
| `texture-watercolor-lavender.jpg` | x 12–28%, y 10–26% | horizontal dry-brush watercolor |
| `texture-press-coral.jpg` | x 41–52%, y 9–24% | mottled wash, press/dab character |
| `texture-scratch-red-yellow.jpg` | x 63–87%, y 4–19% | densely scratched/combed — this is the beetle's paper in the final artwork |
| `texture-layer-green-gold.jpg` | x 11–29%, y 35.5–39.5% | dabbed mossy layered texture — a thin strip in the source photo (partially covered by the lavender sheet above it), cropped honestly as visible, not padded out |
| `texture-brush-sage.jpg` | x 59–69%, y 35–63% | visible horizontal brushstroke passes |
| `texture-bubble-blue-white.jpg` | x 77–95%, y 30–63% | heavy bubble-wrap print, the clearest example on the sheet |
| `texture-decorative-bubble-blue-yellow.jpg` | x 41–53%, y 35–58% | bubble-wrap print over color — used decoratively (Texture Lab backdrop), not one of the 6 named collection categories |
| `texture-decorative-watercolor-magenta.jpg` | x 7–31%, y 57–83% | vertical watercolor drips — used decoratively, same reason as above |

## Derived crop (from the final-artwork photo)

| file | source region (pixel box, 1028×768) | use |
|---|---|---|
| `wood-grain-tile.jpg` | (205,660)–(270,725) | a clean patch of the branch's wood grain, tiled as the course-map progress rail texture |

## What's intentionally NOT a real cutout

The Screen 3 "pieces separate" transition (finished chameleon → head/
body/eye/tail spread across a worktable) does **not** attempt a real
alpha-matte cutout of the chameleon from the final-artwork photo — that
needs image-segmentation/matting tooling this environment doesn't have,
and a naive rectangular crop would look broken, not like a separated
paper piece. It shows the real photo as the "before" state, then
transitions to generic torn-rectangle/circle/triangle shapes rendered in
the real sampled palette (documented in `index.html`'s `:root` CSS
variables, each with a comment naming which photo region it was sampled
from) as the "after" visual. Flagging this plainly rather than shipping a
bad fake cutout.

## No Eric Carle artwork

Screen 4 ("Meet Eric Carle") uses typography + a simple process diagram
only — no scraped or imitated Eric Carle illustration anywhere in this
lesson.
