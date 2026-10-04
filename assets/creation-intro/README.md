# Creation playground intro

51-second responsive narrated tour, mounted by `creation/index.html` and
`core/creation-intro.js/css`. The screenshots are real local course pages,
captured with a neutral test session and no student data. Titles, a moving
pointer, glowing click targets and rounded labels are live HTML/CSS; the
single audio clock controls every scene and caption.

Sources:
- map.jpg: Creation studio, 1280 × 800.
- material.jpg: Material workbench after clicking its hotspot.
- craft.jpg: Dream Art Studio course map.
- color.jpg: Color Magic course map.
- mix.jpg / mixed.jpg: Color Magic step 3, before dragging yellow onto blue
  and after the actual interaction produces Green.
- handcraft.jpg: Dream Art Studio step 6 teacher video thumbnail at 60s,
  Cloudflare Stream ID 8cb2e44a95f0efcaf5f033995946f8b5.

Voice: Microsoft Edge TTS en-US-AnaNeural, +5% rate, synthetic English voice.
Music: original synthesized keyboard/bell motif, no third-party recordings.
`narration.txt` and `voice.srt` are source text and generated timing.
Rebuild mix/captions with `scripts/build-creation-intro-audio.py` (numpy,
imageio-ffmpeg). It adds a 0.5-second voice lead-in to match scene timing.

First visit: welcome dialog, sound starts only on a Play click. Completing
playback stores `fei.creation-tour.v1=watched` in this browser's localStorage.
Explore without watching dismisses it for this session only. Neither action
changes course progress. The Studio tour button always offers replay. Storage
restrictions fall back to an ordinary dismissible welcome. Escape, close,
page hide and hidden-document events pause sound. Reduced-motion preference
removes decorative animations. CC toggles synchronized narration text.
