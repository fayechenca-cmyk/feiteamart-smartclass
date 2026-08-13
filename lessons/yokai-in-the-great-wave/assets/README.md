# Assets for "Yōkai in the Great Wave"

## hokusai-great-wave.jpg — done
Downloaded and self-hosted from the Met's Open Access API (public domain,
no restrictions). Resized to 1600px on the long edge for web use.

Source: https://images.metmuseum.org/CRDImages/as/original/DP130155.jpg
Credit shown in the course: "Katsushika Hokusai, Under the Wave off Kanagawa
(The Great Wave), ca. 1830–32. The Metropolitan Museum of Art, H. O.
Havemeyer Collection, Bequest of Mrs. H. O. Havemeyer, 1929. Public Domain."

## kuniyoshi-cat-demon.jpg — NEEDS FAYE TO DOWNLOAD MANUALLY

The MFA Houston object page returns HTTP 403 to non-browser requests (both
direct curl and the fetch tool), and their own download flow requires
clicking through a Terms acceptance in a real browser first — this can't be
done programmatically, and their dispatcher/download URL shouldn't be
hotlinked in production per the museum's terms.

**To finish this asset:**
1. Open https://emuseum.mfah.org/objects/112457/scene-from-a-ghost-story-the-okazaki-cat-demon
   in a browser.
2. Use their download option, accepting the Terms click-through.
3. Save the file as exactly: `kuniyoshi-cat-demon.jpg` in this folder
   (`lessons/yokai-in-the-great-wave/assets/`).

Once that file exists at that exact path, Part 3 ("Meet the Yōkai") will
automatically display it — no code changes needed. Until then, that section
shows a clearly-marked "artwork coming soon" placeholder (the `<img>` tag
has an `onerror` fallback wired for this).

Credit to show once added (already wired into the code, shown automatically
once the image loads): "Utagawa Kuniyoshi, Scene from a Ghost Story: The
Okazaki Cat Demon, 1847–48. The Museum of Fine Arts, Houston. Public
Domain."
