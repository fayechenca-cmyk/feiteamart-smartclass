# My Sweet Fridge — build notes

Source: Faye's "Lesson Spec: My Sweet Fridge" doc (DRAFT v0.1) plus her
follow-up build instructions, 2026-08-31.

## Artwork — no image-gen available in this build session

Every treat, the fridge, and the "meet the artist" avatar are original
inline SVG (`<symbol>` defs at the top of `index.html`), hand-authored
directly in code. This session had no image-generation tool available,
so the painterly/gouache look described in the spec's §4 prompt
templates was **not** produced as raster art. If Faye later generates
real illustrated assets from those prompts (or from the teacher's own
photographed reference), they can replace the `treat-*` symbols and
`.fridge-shell` CSS shapes without touching any interaction logic —
every usage goes through `treatIcon(id, size)`.

## The required blue drop-shadow

Spec §4 calls the "cut paper + solid saturated blue drop-shadow"
device a required visual rule, not a style option. Implemented once,
platform-wide within this lesson, via `#treatShadowTint` (an SVG
`feFlood` + `feComposite operator="in"` filter) applied to a duplicate
`<use>` of each symbol, offset behind the real colored copy. This is
what `treatIcon()` and the magnet-tray icons both do — so the shadow
automatically carries through the treat picker, the fridge mini-game,
the magnet reward tray, and the badge, per spec, without being
redrawn per screen.

## No reproduced Wayne Thiebaud artwork

Per the platform's existing "no reproduced [artist] artworks" rule
(used for Huang Yongyu, and the still-open question on Miró's
portrait): Meet-the-Artist links out to museum/foundation pages only
(Wayne Thiebaud Foundation, National Gallery of Art, Crocker Art
Museum, Whitney Museum) and never embeds a painting image. The
"portrait" on that screen is a generic original illustration (beret,
apron, palette), not an attempt at Thiebaud's actual likeness.

## Storage

- Lesson-local `STATE` (picks, sketch/color/build completion, fridge
  mini-game placement, magnets earned, reflect chips) — `localStorage`,
  key `fei.creation.thiebaud_my_sweet_fridge.v1`. Matches every other
  Creation lesson's own STATE object (kandinsky, carle, miro, yokai).
- `fei_user_profile.completedLessons` (drives the real account-wide
  badge) — `sessionStorage`, matching `core/course-badge-registry.js`'s
  documented convention and `carle-colorful-chameleon`'s
  `awardCollageCreatorBadge()`.
- Finished-photo upload — IndexedDB (`openDB`/`compressImage`/
  `saveArtwork`/`listArtworks`), same as kandinsky-music-into-shape and
  miro-draw-without-knowing. `carle-colorful-chameleon` uses a real
  Supabase backend instead — that was a deliberate, Faye-confirmed
  exception for that course, not the default, so this lesson does not
  follow it.

## Reward mechanic — pilot, this lesson only

"Fridge magnets" (spec §6) are implemented as `STATE.magnets`, a plain
array of stage-tags rendered into a fixed tray (`#magnetTray`, bottom
left) — no new persistent data model, no account-wide storage. Per
Faye: pilot for My Sweet Fridge only; not wired into any other
Creation lesson.

## Videos (Cloudflare Stream, customer `a78os4oj56dr67ab`)

| Screen | Content | UID |
|---|---|---|
| Draw Your Treat — Pencil | Teacher sketches a treat in pencil | `582869d7a184afb724e906ec0472756b` |
| Color Your Treat | Teacher colors it with markers | `8a81cb08742cac6e718b70dcd6c2a226` |
| Draw the Fridge | Teacher draws the fridge | `0cb90fe78b10dc324fa7d980503ff590` |
| Cut & Glue Your Scene | Teacher cuts + glues the scene | `8160ecafcd7d7bda965fe80ce00fabbb` |

## Open items carried over from the spec (§7), still Faye's to confirm

- Donut + lollipop were flagged as placeholders in the original spec
  draft; Faye's build instructions listed them directly as final, so
  they're built in as-is — flagging here in case that wasn't a final
  decision.
- Placement path (`Creation → Material · The Workbench → My Sweet
  Fridge`) verified directly against `creation/index.html`'s live
  `stations.material` data before wiring the route in.
