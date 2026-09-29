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

Learning shape signals come only from deduplicated `completedLessons` entries in explicitly mapped course families. Dimension rules and weights live in `learningActivity`. Radius uses a saturating activity transform (`1 - exp(-count * weight / 6)`); it is not a grade or a percentage of artistic ability. The faint outer contour is a visual reference. Visual Thinking is marked unconnected until LFC supplies actual activity data. No fabricated progress is stored.

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
