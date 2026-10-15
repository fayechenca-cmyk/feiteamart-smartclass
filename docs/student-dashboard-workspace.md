# Student Dashboard workspace

The existing `index.html` now opens Self-paced Classes and retains the original login, course screens, lesson gates, progress records, teacher feedback and live-class renderer.

## Navigation

The primary sidebar order is Self-paced Classes → Live Classes → My Journey. LFC has its own visually distinct entrance. The course landing header contains only the welcome greeting, student name and practice prompt; it does not duplicate the page title above them.

- My Journey: Overview, My Studio (existing artwork/portfolio), Progress & Feedback, Badges, Student Art Journey.
- Self-paced Classes: original resume action, learning map, learning paths and course browser.
- Live Classes: original enrolled-student schedule or an explicit non-enrolled state.
- LFC: links to the existing Learn from Collections site. Activity synchronization is not implemented.
- Events: announcement placeholder with a contact link; there is no event feed yet.
- Edit profile: animal avatar, display name and learning intention.

Hash routes (`#dashboard/journey`, `#dashboard/courses/foundation-a`, etc.) support reload and browser back/forward. Nested course screens retain the sidebar. Lesson pages themselves remain unchanged.

## Integration

`core/student-dashboard.js` moves existing DOM nodes once at startup rather than duplicating their IDs or replacing their existing renderers. The adapter in `index.html` supplies the current profile and student record. Its CSS is scoped to `#student-shell`.

Badge links are explicitly mapped to verified course entry points. Unmapped badges remain display-only. The three featured badges link to Foundation A, Still Life and Texture, and Fashion Design; Fashion remains labelled demo practice and cannot auto-award a completion badge.

Learning shape signals come only from deduplicated `completedLessons` entries in explicitly mapped course families. Course-to-dimension mappings use the existing `core/art-learning-profile.js` calculator; `learningActivity` applies display weights and normalization. The older single-page profile card is replaced by the Journey view. Radius uses a saturating activity transform (`1 - exp(-count * weight / 6)`); it is not a grade or a percentage of artistic ability. The faint outer contour is a visual reference. Visual Thinking is marked unconnected until LFC supplies actual activity data. No fabricated progress is stored.

Profile preferences use `feiDashboard.preferences.v1:<student identity>` in localStorage, isolated by Supabase user ID or legacy student identity. They survive reload/sign-out on that browser and are not cloud-synced. Storage errors are shown instead of reporting a successful save. There are no avatar uploads in this version.

## Verification

Run a local server from the repository (`python3 -m http.server 8011 --bind 127.0.0.1`), then run `node scripts/test-student-dashboard.cjs` with Playwright available on NODE_PATH. Override the URL with DASHBOARD_TEST_URL if needed.

The suite mocks external services and the student roster so no real student data is written. It covers:

- Signed-out shell visibility and access-code login using a test fixture.
- Navigation, back, direct routes and reload.
- Avatar/name/intention persistence, literal-text rendering and account isolation.
- Badge course links, existing artwork/progress sections, empty journey and completion milestones.
- Resume calling the existing deny/paywall path for an authenticated-account fixture.
- Enrolled and non-enrolled live-class views, using the existing static schedule fallback.
- Deduplicated learning activity and unconnected LFC state.
- Forty overflow checks: ten sections at 320, 390, 768 and 1024 pixels.
- Browser runtime errors.

Desktop and mobile screenshots are under `docs/dashboard-preview/` and were visually inspected. Actual Google OAuth, Supabase writes and live production enrollment were not exercised. No deployment or remote push was performed.

## Studio landing refresh (October 14, 2026)

The landing uses a paper-colored background, solid sage/blue/clay panels, course-image recommendation cards, and larger Skill / Creation entrances. Account recommendations reuse the existing onboarding preferences; access-code students receive starter suggestions. Course actions retain their existing destinations. The independent Skill introduction/video remains future work.

`core/dashboard-explore.js` supplies a five-stop, non-modal Artchi tour: recommendations, Skill, Creation, resume, and My Journey. It offers automatic first-visit guidance after onboarding, Back/Next, Skip, Escape, replay, viewport repositioning, and reduced-motion support. Dismissal/completion is stored per student in this browser. Navigation and sign-out close the tour. The SVG reuses the onboarding character. Two default course thumbnails are local copies of the existing course CDN images (`assets/dashboard/`).

Verified with the dashboard browser suite: tour progression/replay/Escape, three recommendation images, existing login/navigation/profile/course gates, and 40 responsive checks. External services remain mocked; production authentication was not exercised.

## Simplified landing and visual Skill catalogue

The landing now contains compact recommendations and two large Skill / Creation directions. Each direction has its own multi-project Continue Learning list. The Foundation map and My Courses card moved to My Journey → Progress & Feedback. The legacy resume node is retained in a hidden compatibility container for the original renderer and is no longer offered as an automatic Preparation suggestion.

Continuations combine the existing account's opened-lesson lists with account-scoped local opening history and saved step evidence. A default `currentLesson` alone is not treated as activity. Completed items are excluded; more than three projects expand under a details control. New successful lesson-open calls in `core/access.js` keep local ordering, including admin users. Direct Skill catalogue entries for Fashion / Color also record their opening locally. Resume actions check the existing branch access gate. Older lessons without an account opening record or recognized saved progress cannot be reconstructed as unfinished projects; local ordering is browser-specific. Destination mappings are explicit in `core/studio-catalog.js`.

Skill now uses six illustrated category cards. The images are actual course assets: dog drawing, the fashion module's three reference figures, Color Practice materials, a Zodiac ink-painting video frame, the art-history cathedral photograph, and the cardboard cathedral. The separate Skill intro video remains deferred.

Validation: mocked browser regression passes, including separate multi-project lists, completion exclusion, denied-resume gating, 44 responsive checks, and desktop/mobile visual inspection. Screenshots with progress use synthetic test data, never real student records. No production deployment.

## Typography constraint

Use the existing brand fonts throughout: Open Sans for body copy and Montserrat for titles. Do not introduce serif fonts or substitute a new font family. Keep titles restrained: Skill / Creation 26px, Skill page heading 24px (22px mobile), course-card headings 18px, recommendation heading 18px. This is an explicit user requirement, not a stylistic suggestion.

## Homepage color alignment and continuation emphasis

The dashboard theme follows the live FEI homepage inspected October 14: warm white `#fffdf9`, light green `#defde2`, and dark ink `#17182f`. Tinted surfaces use pale green and warm cream. The two original track background images (the existing CDN IDs in `index.html`) are restored below the photo collages, with translucent color masks. Local copies live at `assets/dashboard/skill-background.jpg` and `creation-background.jpg`.

Continuation links retain their original guarded link behavior but now display a dark pill CTA with a soft branch-tinted glow, hover feedback, keyboard focus treatment and reduced-motion handling. All theme rules are dashboard-scoped; Artchi artwork and standalone Fashion Design remain unchanged. Browser regression and 44 responsive checks pass; progress screenshots contain test fixtures.

Artchi first-visit memory is now saved as soon as the tour becomes visible, rather than waiting for Skip/Finish. Leaving mid-tour, reloading, or ending a session therefore cannot trigger another automatic welcome for that identity in the same browser. The account-scoped `feiDashboard.tour.v1` key survives the sign-out cleanup; manual replay remains available. Browser regression covers interruption, reload, repeat login, and replay. Storage is browser-local, not cross-device account synchronization.
