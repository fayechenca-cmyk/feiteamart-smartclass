# Assets for "Yōkai in the Great Wave"

## hokusai-great-wave.jpg — done
Downloaded and self-hosted from the Met's Open Access API (public domain,
no restrictions). Resized to 1600px on the long edge for web use.

Source: https://images.metmuseum.org/CRDImages/as/original/DP130155.jpg
Credit shown in the course: "Katsushika Hokusai, Under the Wave off Kanagawa
(The Great Wave), ca. 1830–32. The Metropolitan Museum of Art, H. O.
Havemeyer Collection, Bequest of Mrs. H. O. Havemeyer, 1929. Public Domain."

Hotspot coordinates in the code (curve, foam, boats, Mt. Fuji, the two blue
tones, the title cartouche, the signature) were placed by actually cropping
and inspecting this exact downloaded file, not guessed from memory — see the
`WAVE_HOTSPOTS` array in index.html.

## vangogh-plum-orchard.jpg / vangogh-bridge-rain.jpg — done
Both downloaded from Wikimedia Commons, sourced from the Van Gogh Museum's
own digitized files (object IDs s0115V1962 and s0114V1962), confirmed
"Public domain" via the Commons API license metadata. Resized to 900px long
edge for web use. Used in Part 1's "The Prints Travelled" aside comparing
Van Gogh's 1887 copies to the ukiyo-e prints that inspired them.

## kuniyoshi-cat-demon.jpg — NEEDS FAYE TO DOWNLOAD MANUALLY

The MFA Houston object page returns HTTP 403 to non-browser requests (both
direct curl and the fetch tool), and their own download flow requires
clicking through a Terms acceptance in a real browser first — this can't be
done programmatically, and their dispatcher/download URL shouldn't be
hotlinked in production per the museum's terms.

Note this is a **triptych** — three separate printed sheets/panels (right,
center, left) — not a single image. The museum page should have a single
combined download; if it instead offers three separate panel files, save
all three and see the "if you get 3 separate panel files" note in
index.html's asset-loading comment (search for `kuniyoshi-cat-demon`).

**To finish this asset:**
1. Open https://emuseum.mfah.org/objects/112457/scene-from-a-ghost-story-the-okazaki-cat-demon
   in a browser.
2. Use their download option, accepting the Terms click-through.
3. Save the file as exactly: `kuniyoshi-cat-demon.jpg` in this folder
   (`lessons/yokai-in-the-great-wave/assets/`).

Once that file exists at that exact path, Stage 3 ("Meet the Yōkai") will
automatically display it — no code changes needed. Until then, that section
shows a clearly-marked "artwork coming soon" placeholder (the `<img>` tag
has an `onerror` fallback wired for this), and the triptych-panels-joining
reveal animation simply won't trigger.

Credit to show once added (already wired into the code, shown automatically
once the image loads): "Utagawa Kuniyoshi, Scene from a Ghost Story: The
Okazaki Cat Demon, 1847–48. The Museum of Fine Arts, Houston. Public
Domain."

**Hotspot coordinates for this image are estimates**, not verified against
the real file (since it isn't downloaded yet) — recheck `YOKAI_HOTSPOTS` in
index.html once the real image is in place, the same way the Hokusai
hotspots were verified against the actual downloaded photo.
