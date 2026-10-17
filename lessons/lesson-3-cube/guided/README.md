# Cube guided studio — independent design preview

An isolated experiment at `lessons/lesson-3-cube/guided/`. The existing Cube lesson is unchanged.

## Learning flow

Welcome → anatomy → move the light → pencils → blending tools → readiness → structure → tones → optional refinement → optional background → drawing check/photo → optional bonus polish → reflection → preview milestone.

The complete original welcome and five teacher videos are streamed, with no omitted time ranges. Eighteen existing semantic pause points plus five end-of-video practice checkpoints form 23 drawing stages. Preparation and closing bring the total to 34 stages. The background and bonus videos remain complete segments in this first prototype; their finer pauses still need teacher review.

Practice never resumes on a timer. Continue is enabled at a teacher checkpoint; the guide speaks automatically and waits. Intro ends advance automatically. Anatomy needs three face taps; light needs a slider movement. Materials and readiness wait after narration. Muting affects both teacher and guide; captions remain. Browser-blocked playback has a visible tap-to-resume recovery.

## Deliberate prototype boundaries

Only the `fei.cube.guided-preview.v2` localStorage key is written. This preview does not change official XP, account progress, paid access rules, submissions, or badges. Selected photos remain in a temporary object URL on this page; the upload screen explicitly links to the regular lesson for a real teacher submission. The closing reward is labelled a preview milestone. Reflection is an optional in-session note, not saved to the account.

## Media and provenance

Teacher footage and 23 stage snapshots: the existing FEI TeamArt Cube Cloudflare Stream videos. The 18 teaching diagrams are compressed copies of existing course diagrams; original URLs are retained as `analysisSource` in flow.json. Two pairs in the source audit were incorrectly matched (cross-layer / full dark plane; light-gray face / meeting edge). This preview pairs them by the visible diagram contents. Two old sphere references in Cube narration were rewritten for the cube.

Toolkit and Artchi reuse existing repository assets. New guide audio is generated with en-US-AvaMultilingualNeural, +2% rate, not a clone of Mrs. Dawn. Mrs. Dawn's own recorded video audio is unchanged. Complete new scripts are in flow.json. No new video files or full teacher-video downloads are stored.

## Verification

`node tests/cube-guided-preview.cjs` with a local server on 18816 tests all 34 transitions, pause boundaries, replay, locked future map steps, mute, and desktop/iPad/phone/landscape layouts using a deterministic Stream mock. A separate live-browser check confirmed the real 15.1-second intro auto-advances and the new guide audio plays unmuted; all 33 MP3 metadata loads were verified. The real first drawing clip also paused at 22 seconds and automatically started its narration. Full teacher review of the new phrasing remains appropriate before replacing the production lesson.

## October 16 follow-up

Dashboard palette reused: #F9EDDA, #E4FCE4, #A9CEA7, #7560a7, #17182D. Added voiced sketch-paper texture/side and A4-size stages. Native whole-video controls and iframe pointer/focus access are disabled. The lesson supplies a pause button and a range restricted to the current microstep. Out-of-range time updates and ended events are clamped before any completion logic; no other step is unlocked. Version 1 local progress is migrated by shifting original indices after the two inserted paper stages.

`node tests/cube-guided-boundaries.cjs` verifies the seek/ended guard without a browser. Live UI verification: seeking the 22–97s step to its end stays on its own drawing checkpoint, with the next step locked until Continue.

## Real paper photography

Replaced the digital texture and paper-size SVGs with three unmodified Hahnemühle photographs. Surface examples are explicitly two paper samples, not a manufactured front/back pair. The guide directs learners to feel their own sheet. Photo credit links are visible; full original URLs are in paper/sources.json. New narration: audio/paper-real.mp3.
