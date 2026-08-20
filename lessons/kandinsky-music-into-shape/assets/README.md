# Assets for "Music into Shape"

## kandinsky-several-circles.jpg — done
Wassily Kandinsky, "Several Circles" (Einige Kreise), January–February 1926,
oil on canvas, 55 3/8 x 55 1/4 in. Solomon R. Guggenheim Museum, New York.

Downloaded and self-hosted from its Wikimedia Commons file page (not
hotlinked from Guggenheim's own site), per the brief — Commons documents the
public-domain rationale explicitly even though the painting itself is
unambiguously PD (Kandinsky d. 1944; life+70 expired in the EU/UK in 2015;
also published in the US before 1931).

Source: https://commons.wikimedia.org/wiki/File:Vassily_Kandinsky,_1926_-_Several_Circles,_Gugg_0910_25.jpg
Commons license metadata confirmed via API: `LicenseShortName: Public domain`,
`Copyrighted: false`, `Restrictions: (none)`.
Resized to 1400px on the long edge for web use.

Credit shown in the course: "Wassily Kandinsky, Several Circles, 1926.
Solomon R. Guggenheim Museum, New York. Public Domain."

Geometry Sweep (Stage 3) hotspot coordinates in the code (`GEOMETRY_HOTSPOTS`
in index.html) were placed by actually viewing this exact downloaded file,
not guessed from memory. This painting reads almost entirely as overlapping
circles — LINE, ANGLE, COLOR FIELD, MOVEMENT and RHYTHM are all interpretive
readings of real regions (a flowing boundary edge, an overlap intersection,
a background color mass, a scattered cluster, a trail of repeated dots),
not literal separate elements. Worth a look if you want to sanity-check the
placements once you see it rendered.

## grieg-mountain-king.m4a — done

**Track:** "In the Hall of the Mountain King," from Peer Gynt Suite No. 1,
Op. 46, by Edvard Grieg. Performed by the Musopen Symphony Orchestra.
Duration: 2:34 (154s).

**Why this track:** genuine dynamic contrast within one short piece — opens
quiet, low, and mysterious (pizzicato strings, sneaking tempo), then builds
steadily louder and faster to a full-orchestra, high-energy climax. Real
calm-vs-strong sections and a noticeable rhythm/tempo change, not just
volume — exactly the "what does the music look like" contrast the Listen
stage needs.

**License — verified at the specific-recording level, not just the site's
general reputation:**
- Source page: https://commons.wikimedia.org/wiki/File:Musopen_-_In_the_Hall_Of_The_Mountain_King.ogg
- Commons license metadata (checked via API): `LicenseShortName: Public domain`,
  `UsageTerms: Public domain`, `Restrictions: (none)`.
- Per the file's own credit note: this recording comes from Musopen
  (musopen.org/music/777-peer-gynt-suite-no-1-op-46/#recordings), a
  nonprofit whose uploaders must "represent and warrant that content
  uploaded to the site is in the public domain" (Musopen FAQ #4). This is
  the recording itself being PD — separate from, and not to be confused
  with, Musopen's own site tooling/branding, which is copyrighted and NOT
  what's being used here.
- The underlying composition (Grieg, d. 1907) is long since public domain
  regardless.

**Format note:** the Commons master file is Ogg Vorbis, which iOS Safari
does not support natively (this site is mobile/iPad-first). Converted
locally to AAC/M4A via macOS `afconvert` (128kbps, 48kHz stereo) — verified
the converted file's duration matches the source exactly (154.09s) before
using it. No re-encoding tool or third-party service was used; only a
local, lossless-to-the-tool container/codec conversion.
