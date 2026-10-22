# Get Inspired · implementation and handoff

Quick Sketch now supports selected multi-image sets; see [current gallery and set update](creation-gallery-and-sketch-sets.md). The single-image flow and Make Something missing-cover list below describe the initial release.

## Scope and preserved inventory

Static HTML/CSS/JavaScript on the existing `feat/creation-3-discovery` branch. No dependencies, database, authentication, Dashboard, Skill, Foundation C, LFC navigation or lesson progress schemas changed. The Dashboard palette and Make Something final-artwork-only cover policy are unchanged. No production deployment.

Inspection found the original room and furniture authored as separate SVG groups inside `creation/index.html`, with native JavaScript pan/fit, station details, course catalogs and Artchi wandering/resting/summoning. The adapter moves the original `#stage` DOM into the renovated scene and restores its position when leaving. It retains the original window, walls, floor, easel/palette, drafting desk, material bench, character noticeboard, bookshelf, floor cat and Artchi. An observation desk and lamp are additive SVG groups. Independent HTML station links provide keyboard/touch control; decoration is not the click target. Small screens reuse cropped original furniture illustrations as station previews.

All five original work areas remain under **Original Studio projects & tools**. Their catalog, course maps, legacy coming-soon records, zoom/detail renderer and tools remain. Original Color Magic, Magical City, Ink Animal, Ballerina, Basquiat, Pop Art, Yōkai, Kandinsky, Miró, Dream Studio, Chameleon, Rousseau, Sweet Fridge, Color Bloom, Illustration Book and Surrealism routes remain intact. Existing per-lesson videos, drawing tools, submissions, badges and saved progress are untouched. The original optional narrated tour remains available. Original pan/minimap implementation is retained in source; overview navigation uses a fitted room instead of requiring panning.

Existing integrations: `FEIAccess` for original lesson gates/history, session `fei_user_profile` for identity, existing `FEICreationEvents` for optional aggregate export. No new rendering or animation library. Studio styles are scoped to the Inspiration page; reduced motion stops Artchi's wandering schedule and animated wings.

## Six stations and routes

Entry: `creation/#inspire`. Station: `#inspire/station/<id>`. Activity: `#inspire/activity/<id>`.

| ID / workstation | Physical area | Published activities |
| --- | --- | --- |
| material / Material Playground | Material bench, papers, scissors, paint | Play With Colors → existing Color Magic step 3 |
| visual / Visual Language | Easel, marks and palette | The Language of Lines: direction, thickness, repetition |
| observation / Look Closer | Sketchbook desk, pencils, magnifier, timer | Quick Sketch; Look, Hide, Remember; Training Your Visual Memory video |
| shape / Shape Playground | Drafting desk and shape papers | Draw Without Knowing → existing Miró; two shape videos |
| light / Light & Mood | Composition board and lamp | Draft preview only |
| thinking / Think About Art | Bookshelf and small display wall | Draft preview only |

Workstations expose purposes before selection, hover/focus highlights, explicit Explore/Preview actions, optional Artchi guidance, native dialogs and Escape/back navigation. No mandatory welcome or tour. First Artchi note is dismissed automatically on later visits to the same browser identity; Ask Artchi replays it. Continue Learning appears for paused/recall practices, including immediately after exiting an activity.

## Quick Sketch and photo provenance

Owner supplied `/Users/fayechen/Desktop/quick sketch animals` and `/Users/fayechen/Desktop/quick sketch flowers`. Visually reviewed 47 animal-folder images and 24 flower-folder images. Selected **25 animal photographs and 18 flower photographs**. Two existing FEI object photographs provide the Everyday Objects category. Source filenames and exclusions are recorded in `inspiration-photo-manifest.json`; selected image labels are in `inspiration-photo-selection.json`.

Selections favor recognizable subjects and avoid unnecessary near duplicates, broad distant views and unrelated subjects. Owner screenshots showing animal/flower photographs are eligible references here; they are not Make Something artwork covers. Fourteen MOV clips are inventoried but not used as arbitrary video frames. No AI images or external stock images. Desktop originals remain unchanged.

`scripts/import-inspiration-photos.py` creates orientation-correct JPEG copies up to 1400px, strips EXIF/location metadata and generates review contact sheets. macOS HEIC decoding requires normal system-service access; sandbox decoding returned black images and was rejected. Approved system decoding produced the reviewed copies. The selected 43 JPEGs total about 12 MB, but only the current practice image is loaded, not the whole collection. Activity thumbnails lazy-load. `core/inspiration-photos.js` is generated from reviewed selections.

Flow: choose Animals/Flowers/Everyday Objects → choose photo → choose 30/60/120 seconds (60 default) → start → draw on paper → pause/resume or finish → optional reflection → same-picture retry / next picture / optional sketch photo preview and download. No upload or score required. Custom JPG/PNG/WebP references up to 12 MB are supported with temporary blob URLs; users must reselect custom files after reload. Files are never uploaded or serialized to browser storage. Full-reference photographs use `object-fit: contain`.

Clock uses a monotonic deadline, not accumulated interval counts. It stops on navigation, background tab and page exit; elapsed remaining time is saved on state boundaries. A page left closed does not consume drawing time. State is scoped under `feiInspiration.practice.v1:<encoded identity>` with validated references, phases, duration, remaining time and bounded reflection. No cross-account resume. Signed-out or storage-blocked sessions still work but explain that persistence is unavailable. Browser-local state is not cloud progress or teacher evidence. Optional reflection and line discoveries remain local.

Look, Hide, Remember uses the same photographic library: observe for 10 seconds → image hidden → draw from memory → reveal/compare. No exact-match evaluation.

## Teacher videos

The owner supplied all three links. YouTube oEmbed returned FEI TeamArt as author and the following titles on 2026-10-21:

| Activity | Video | Returned title |
| --- | --- | --- |
| Visual memory | https://www.youtube.com/watch?v=rHx81caDLTE | Art Class - Training your visual memory |
| Shape transformation 1 | https://www.youtube.com/watch?v=Dn5buTqRQgk | Art class- Transforming shapes to creation1 |
| Shape transformation 2 | https://www.youtube.com/watch?v=_KrF09U6W68 | Art class-Shapes to Creation |

The last is labelled **Shapes to Creation**, matching the published title rather than claiming the requested working title “Gun Shape to Creation.” Its stable data ID remains `gun-shape-creation`. No clips are substituted or sliced. Metadata/owner attribution and embed IDs are verified; end-to-end public playback is not part of the mocked browser suite. Videos load only after clicking Load teacher video, use youtube-nocookie embeds and offer an external fallback. A physical creative challenge accompanies each. Loading a video does not count as completing the practice; completion is explicitly self-reported.

## Analytics

Existing adapter exports only when the host explicitly sets `FEICreationAnalyticsConsent === true` and provides `gtag`. No new tracker. Envelope: `eventId`, ISO `timestamp`, random `sessionId`; allowlisted Inspiration metadata: `creationSpace`, `stationId`, `activityId`, `activityType`, optional subject `category`, `source`, `completionStatus`. Student identity, filenames, images, free text and reflection are excluded.

| Event | Trigger |
| --- | --- |
| inspiration_studio_entered | New Studio mount |
| studio_station_opened | Station panel opened |
| inspiration_activity_opened | Published activity opened |
| inspiration_activity_started | Timer start, explicit video load/practice, line change, or allowed original lesson start |
| inspiration_activity_completed | Timer finishes or learner explicitly reports/reveals completion |
| inspiration_activity_retried | Retry / Next Picture |
| inspiration_activity_resumed | Paused timer resumed |
| inspiration_result_saved | Local reflection/line save or requested sketch download |
| inspiration_activity_exited | Leaving activity |
| artchi_suggestion_selected | Following Artchi's Quick Sketch suggestion |

Attempt IDs deduplicate start/completion/save over reloads. Existing adapter remembers up to 200 event IDs per session. No tick, frame or pointer telemetry; slider start deduplicates per attempt. Interaction completion is not teacher assessment. No teacher dashboard or cloud analytics database introduced.

## Drafts and limits

- Texture Discovery: standalone activity pending; existing Chameleon/material lesson tools remain available.
- Light & Mood: activity and approved reference set pending; original composition board remains.
- Art Thinking: authorized attributed artwork and prompts pending.
- No missing Animal/Flower assets for the launched Quick Sketch library. The 14 source videos remain unimported intentionally. Other finished-artwork covers still missing in Make Something are listed in `creation-3.md` and remain placeholders.
- Actual OAuth, Supabase writes, Webflow parent embedding and live YouTube playback require their normal integration environment. Local test services are mocked.

## Files

- `creation/index.html`: scoped stylesheet/scripts, Artchi reduced-motion guard.
- `core/creation-discovery.js`: lifecycle and hash navigation adapter.
- `core/creation-events.js`: event names and allowlisted metadata.
- `core/inspiration-content.js`: station/activity/reference records.
- `core/inspiration-photos.js`, `assets/inspiration/*.jpg`: owner photographic library.
- `core/inspiration-practice.js`: scoped storage and deadline clock.
- `core/inspiration-studio.js`, `core/inspiration-studio.css`: room renovation and activity UI.
- `scripts/import-inspiration-photos.py`: review/import utility.
- `scripts/test-inspiration-studio.cjs`, `scripts/test-creation-discovery.cjs`: browser checks.
- `docs/inspiration-photo-selection.json`, `docs/inspiration-photo-manifest.json`, this document and `docs/creation-3.md`: provenance and handoff.

## Add an activity

1. Add a stable record to `core/inspiration-content.js` with existing `stationId`, title, short purpose, mode and `published:false` while incomplete.
2. Choose a working renderer kind: `sketch`, `memory`, `lines`, `video` (verified `videoId`), or `existing` (verified local `existingRoute` and gate `lessonId`). Implement and test a new renderer before publishing a new kind.
3. Add an authorized thumbnail/reference and accurate materials. Do not substitute process frames for finished artwork. Keep unavailable activities as explicit drafts without Start links.
4. Add photographs by running the importer for contact-sheet review, annotating selected stable IDs, then running `--publish`. `--refresh` regenerates review copies. Check orientation and non-black pixels before publishing.
5. Test start, exit, return, keyboard, mobile and storage/gate failures. Existing lessons must retain their own progress and submission logic. Do not deploy without approval.

## Validation

Static site: no bundler or install step. Browser tests use the existing Playwright runtime and local HTTP port 8037.

- Inspiration suite: six accessible stations, original room/furniture/Artchi, original five tools, optional introduction, 30-second timer pause/reload/resume/completion/retry, real Animals/Flowers sources, custom-file reload, account isolation, memory hide/reveal, three lazy video IDs, line manipulation, access denial, reflection privacy, five responsive widths, label overlap and reduced motion.
- Creation regression: all 16 course routes; 3 final-artwork covers and 13 honest placeholders; search; preview; bookmark/account isolation; original station panels; 20 responsive checks; profile unchanged; access denial; opt-in telemetry and deduplication.
- Syntax checks and `git diff --check`; photo decode/metadata checks. Desktop/mobile screenshots reviewed locally. Dashboard source/palette files unchanged; previously passing Dashboard suite documented in `creation-3.md`.
