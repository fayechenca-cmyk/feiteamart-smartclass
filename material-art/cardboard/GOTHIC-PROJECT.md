# Gothic example project — teacher handoff

Entry: `#project/gothic`. Linked from the course overview as TODAY’S BUILD, and from Lessons 2 and 5. It is an optional example within RE:MAKE 01; the six-lesson course and Leather Craft are unchanged.

## Available guides

1. Pointed arch — 8 steps (download-1.png).
2. Gothic window / tracery — 9 steps (download-3.png).
3. Tower + spire — 9 steps, including details and variations (download-4.png).

4. Buttress — 7 steps (download-5.png).
5. Decorative detail — 5 choices; completing one is sufficient, and decoration can be skipped (download-6.png).
6. Plan + gather — first 2 assembly panels; build — remaining 6 panels (download-7.png).

The overall project map is download-2.png. All seven original sheets are copied unchanged under `assets/gothic/`. Each step displays an SVG viewport into its original sheet, preserving the user's artwork and dimensions. It is a display crop, not an AI redraw or modified source image. A full-sheet reference remains available; each main diagram can be enlarged in an accessible dialog.

## Extend later

Edit `gothic-data.js`. Each element has a stable ID, source sheet dimensions, overview thumbnail rectangle, finished-piece rectangle, and a `steps` array. Rectangles are `[x,y,width,height]` in source pixels. Add a `sheet`, `width`, `height`, `resultRect` and steps to the existing empty element to activate its guide. Keep IDs stable to preserve responses.

Each step supports `screenId`, title, a short instruction, diagram rectangle, hidden `teacherNote`, estimatedTime, activityType and video metadata. Fill `video.src` with a playable video file URL; optional `poster`, WebVTT `captions`, and `transcript` are rendered when provided. No empty player/autoplay. Teacher notes never enter student HTML.

Pending teacher assets:

- [x] Buttress process guide (element 4)
- [x] Decorative detail process guide (element 5)
- [x] Combine the elements process guide
- [x] Final assembly / base / walls / joining sequence
- [ ] Step videos for arch, window and tower, with captions
- [ ] Step videos for later elements and assembly
- [ ] Review cutting transitions: some supplied frames depict hollow centres before the diagram explains removing them
- [ ] Check prototype dimensions with actual cardboard thickness; tower strip has no glue tab, so the short instruction uses a taped seam
- [ ] Confirm final example or student model photo for presentation

The title is Gothic-inspired Cathedral, not a claim that the pictured building is Notre-Dame. Dimension values are transcribed from the supplied sheets; they are example dimensions, not a tested production template. The teacher notes call out outer-cut/inner-cut transitions, cutting tower windows while flat, and 9 cm being a triangular face height.

## State

Uses the existing course-local store, not a second profile: `responses['gothic:done']` holds stable element:step IDs; `responses['gothic:position:<element>']` holds the last viewed step. The existing project-notes export includes both. Previewing next does not mark work complete. Completing these example elements does not mark the six-lesson course complete. Assembly now leads into Lesson 6 photograph/presentation. Decoration uses any-one completion; other sections retain per-step completion. Original element and step IDs were preserved.

## Verification

All 26 source rectangles fit within their images, and all four copied PNGs match the supplied files byte-for-byte. Browser checks exercised all three element completion flows at 390px width, confirmed completion after reload, and tested the enlarged-picture dialog. No browser console errors were reported. Desktop first-step and project-map layouts and mobile tower layout were visually reviewed. No live deployment was performed.

## Latest validation

All 46 diagram viewports are within their source image bounds. The three new source images are byte-identical copies. All 15 new sequential screens passed 390px overflow checks; decoration choice completion and the six assembly completion actions were tested, including saved choice completion after reload. Source diagrams are now explicitly clipped so neighboring panels cannot bleed into wide display areas. Videos are still pending; the supplied assembly sheet is a visual overview, with detailed joints/base demonstrations to record.
