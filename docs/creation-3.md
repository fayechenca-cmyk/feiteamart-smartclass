# Creation 3.0 implementation and audit

## Architecture / preservation map

Audited before editing: static HTML/CSS/JS site, no package build. `index.html` and `core/student-dashboard.js` own the dashboard and hash routes. `core/dashboard-explore.js` owns Skill/Creation entrances and continuation lists. None are modified by this change. Existing uncommitted dashboard CSS and leather course work are excluded.

`creation/index.html` remains the original Studio: five station records, COURSE_ROUTES, COURSE_LESSON_IDS, room SVG, draggable room, minimap, paint tubes/palette, drafting papers, pinned notes, torn scraps, bookshelf and wandering/resting/summoned Artchi. Original station renderers, SVGs, animations, lessons, video, upload, rewards and storage remain. Added labels/keyboard activation and fixed invisible closed-overlay children intercepting taps. The optional narrated tour remains available; it no longer opens automatically.

Creation routes are additive hashes on the same page: `#welcome`, `#make`, `#project/<stable-id>`, `#inspire`. Old `/creation/` links still work. Gallery records derive from the 16 available station records and existing route maps, avoiding a second course catalog. My Sweet Fridge had a route but no lesson ID; its stable slug is now mapped. Gallery categories derive from the original work areas. No duration or age estimates have been invented.

`core/auth.js`: existing Supabase Auth and Webflow bridge. `core/access.js`: existing lesson gates and opened-course history. Both new gallery and original Studio starts call that gate; failures now ask for retry rather than silently allowing access. `core/progress.js`: existing student_progress Supabase records with local cache. `core/submissions.js`: existing Supabase artwork submission/storage service. These modules and lesson persistence are untouched.

Continuation reads existing profile completedSteps/currentStepIdx, opened course history and FEIAccess status, excluding completed lessons. It does not manufacture progress from a default currentLesson. It cannot reconstruct progress in isolated legacy lesson-local storage without identity evidence. Bookmarks follow existing dashboard preference conventions: `feiCreation.saved.v1:<encoded identity>`, browser-local, no cloud sync. Save failures and signed-out state are announced. No new database service or migration.

## Studio activity inventory

- Color / Easel: paint-tube/palette navigation; Color Magic, Magical City, Ink Animal Studio preserved.
- Shape / Drafting Desk: all four existing entries remain Coming Soon; no working activity retired.
- Character / Sketch Board: Ballerina, Basquiat, Pop Art, Yōkai preserved alongside original placeholders.
- Material / Workbench: Kandinsky, Miró, Dream Studio, Chameleon, Rousseau, Sweet Fridge, Bloom preserved; Trash Reborn and Touch Memory remain placeholders.
- Books & Stories / Bookshelf: Illustration Book and Surrealism preserved; future story projects remain labelled.
- Get Inspired offers explicit links to the existing color-mixing experiment and Miró exploration, plus named buttons for all five work areas. This first release reuses original activities; it does not claim new Observation / Light labs exist.

## Artwork inventory

Verified existing references used: local Chameleon, Rousseau paper jungle, Yōkai, Dream Studio teacher video frame, Color Bloom teacher collage; existing lesson CDN references for Miró and Magical City. CDN failures show a labelled fallback. Artwork-bearing projects sort first. Welcome uses existing teacher work and physical painted-paper texture photographs, with no generated art.

Missing confirmed finished-artwork covers (explicit placeholders): Color Magic; Ink Animal Studio; Dancing Ballerina; Basquiat; Pop Art; Music into Shape; My Sweet Fridge; Make My First Illustration Book; Illustration Through Surrealism. Historical artist reference images and arbitrary video posters are not substituted for teacher results. Materials appear only where already recorded; other previews point to the original teacher guide. Remote reference images still require production availability verification.

## Analytics contract and boundaries

`FEICreationEvents.track(name, properties, eventId?)` returns a standardized event with eventId, ISO timestamp and sessionId. It accepts the brief's core event names. Allowlisted metadata: creationSpace, projectId, experimentId, category, entrySource, completionStatus. Never pass names, email, student ID, URLs, raw search terms or artwork. No new third-party tracker is installed; audit found no GA4 bootstrap in the Creation/core entry files.

Export calls an existing host gtag only when `FEICreationAnalyticsConsent === true`. Host consent must reflect the actual guardian/privacy policy; this implementation does not assume consent. Events are not stored as student learning records. Session event IDs survive refresh (bounded to 200); callers retry with the same ID. Re-rendering previews does not duplicate opens. New deliberate actions get new IDs. There is no retry queue or network service.

Wired actions: entry selection, space entry/switch, project preview, save/unsave, guarded start/resume, continue, search (no query), filter, Studio area opening and experiment link start. Completion, upload, discovery-save and experiment completion/revisit names are extension points only: individual lesson success callbacks must integrate them before those metrics are available. No completion/upload is inferred from clicking a link. Student-level analytics, cloud bookmarks, retention/deletion workflows and teacher reporting remain future protected-service work; do not use this aggregate adapter as a learning database.

## Add a project

1. Create and verify the real lesson route, preserving its own steps/progress model.
2. Add the course to the appropriate existing station in creation/index.html, with available true only when ready.
3. Add COURSE_ROUTES and a stable COURSE_LESSON_IDS entry. Add dashboard continuation mapping in core/studio-catalog.js if needed.
4. Add a teacher cover and known materials to core/creation-projects.js. Absence produces an honest placeholder.
5. Run both browser suites; verify gate behavior, preview, return, and existing lesson saves. Never deploy unreviewed.

## Modified files

- creation/index.html: additive app mount/style/scripts and missing stable course ID.
- core/creation-intro.js: optional tour instead of automatic dialog.
- core/creation-projects.js: cover/material overrides.
- core/creation-discovery.js: navigation, metadata adapter, preview, gallery, saved projects, continuation and Studio navigation.
- core/creation-discovery.css: scoped responsive visual styles and reduced motion.
- core/creation-events.js: opt-in aggregate event contract.
- scripts/test-creation-discovery.cjs: mocked browser checks.
- docs/creation-3.md: this audit, handoff and test report.

## Verification

Local HTTP preview at port 8037. Playwright supplied by the existing Codex runtime (NODE_PATH); no dependencies added.

- Creation suite: 16 valid local routes; search; material preview; bookmark reload and identity isolation; five original work areas; 20 overflow checks across 320/390/768/1024/1440; original profile unchanged; denied-access redirect; analytics consent and duplicate-ID behavior; no runtime exceptions.
- Existing dashboard suite: PASS login, back/reload/navigation, profile/account isolation, badges, progress, course gate, live states, activity rules and 44 responsive checks.
- JavaScript syntax checked. Welcome and gallery screenshots inspected. Actual OAuth, production Supabase writes, remote video playback and Webflow parent embedding are not exercised by mocked tests. Original per-lesson tests do not exist in the inspected scripts directory.
- No production deployment. Missing artwork and unwired lesson outcome telemetry remain visible rollout limitations.
