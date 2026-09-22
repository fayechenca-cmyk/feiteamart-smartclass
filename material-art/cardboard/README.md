# RE:MAKE 01 — CARDBOARD

## Routes and architecture

Material Art (existing Art GPS menu) → Material Craft → existing Leather Craft for Beginners (unchanged Webflow URL).
Material Art → Material Design → RE:MAKE 01 — CARDBOARD.

Entry: `material-art/cardboard/`. Hash routes: `#overview`, `#prepare`, `#lesson/1/question` (through Lesson 6). Invalid routes fall back safely. Return link uses `index.html?view=material-art`, which opens the existing Material Art screen after the normal sign-in flow.

Six lessons: Meet Cardboard; Learn from Gothic; Design; Prototype; Build + Transform; Reflect + Present.

## Editing

`data.js` contains the course, material list, preparation groups, six lesson packages, and ordered screens. Each screen extends existing `core/lesson-app.js` naming (`screenId`, `stepNumber`, `completionRule`) and includes title, instruction, hidden teacherNote, video, image, discussionQuestion, estimatedTime, and activityType. Add/remove/reorder screens in data; the renderer builds navigation automatically. Teacher notes never appear in student markup. Set estimatedTime to a human-readable value such as `10 minutes`.

Each asset has a stable id, kind, src and alt. Fill src with a local relative URL and edit alt. Video slots support native playable video files, not YouTube/Cloudflare webpage URLs. Add captions/transcripts when producing video content; embed-provider support is a future extension. Empty src always displays a placeholder. Set kind to `video` for an experiment video. Download slots render a file link only when src is supplied.

## Reuse and limits

- Reuses the actual existing `.subtrack` course-card component/classes, typography, responsive menu and navigation in the homepage. Leather Craft URL/title/badge are preserved.
- Matches existing Montserrat/Open Sans typography, ink/paper/gold/purple tokens and rounded controls in the new course.
- Follows existing per-directory static HTML/JS/CSS delivery and lesson screen naming. No dependency or build step added.
- Shared `core/lesson-app.js` uses a different profile store (`fei.smartclass.profile.v1`) from the live homepage (`fei_user_profile` in sessionStorage). Its access and completion runtime is not imported, avoiding a second learner profile. Existing quizzes and video players are embedded in individual lessons, not standalone reusable components. This course has one new shared section/media renderer for all six lessons.
- Course-local progress and responses use localStorage, namespaced by existing session profile user ID, student code, email, or guest. It does not write global XP, badges, Journey or Supabase progress. Guest users on the same browser share guest notes. Storage availability failures are reported, with downloadable JSON notes as a fallback. No cross-device synchronization or photo upload.
- Completion is learner-controlled, suited to live teaching. Quick checks are draft open responses without automatic grading. Photo documentation remains a clearly labeled placeholder, with presentation notes/links available.
- The new course is accessible by direct URL, like a local classroom framework; no paid access policy is invented.

## First classroom test

First supply the Lesson 1 intro, materials photographs, cardboard edge diagram, four short experiment demonstrations, Make It Stand demo and one student example. Confirm each prompt, add teacher notes and timings, then write the three quick-check answer/feedback guides. Pilot the fold → predict → try → reflect loop before recording the other lessons.

## Local preview

From repository root: `python3 -m http.server 8017`, then open `http://localhost:8017/material-art/cardboard/`.

The existing Webflow Leather Craft course was inspected as reference only: https://www.feiteamart.com/leathercraft-for-beginners. No remote content was changed or published.

## Validation performed

- JavaScript syntax checks and git diff whitespace check passed.
- Browser: all 39 lesson sections rendered at 390px width with no document overflow or console errors.
- Desktop landing and mobile landing/experiment layout visually inspected.
- Preparation checkbox, experiment Try It state, text persistence after reload, design-plan summary and all six lesson completions checked.
- Final PROJECT COMPLETE heading appears after all six lessons are marked complete.
- The retained Webflow link was compared against the original homepage diff.
- Global authenticated Journey / Supabase synchronization is outside this framework; iframe embedding on the live Webflow site has not been tested.

## Photo-led update — September 22

Teacher photos now replace the cardboard overview/preparation image and six groups of tool images (pencils, scissors, UHU glue, capped knife, glue gun, gridded board). Preparation and Lesson 1 share the same photo checklist and existing preparation response keys. The hot glue gun is optional with adult-supervision labeling. Overview copy, lesson descriptions, teacher-video placeholders and optional tools use progressive disclosure; previous course content remains available. Navigation names the next action. Asset origins and imagegen prompts are in `assets/README.md`. Original HEIC files were not modified.

## Today’s Gothic example

See `GOTHIC-PROJECT.md` for the optional project, 26 supplied-image making steps, image viewport coordinates, progress keys and upcoming assembly/video slots. Entry: `#project/gothic`.
