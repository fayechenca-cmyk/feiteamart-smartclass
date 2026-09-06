/* ═══════════════════════════════════════════════════════════════════════════
 *  COURSE DATA · Perspective Drawing Foundation
 *
 *  RENAMED (2026-09-19): this course used to be titled "Scene Drawing
 *  Foundation" — that name now belongs to a separate, newer course (see
 *  lessons/scene-drawing-foundation/index.html) covering shot size /
 *  visual storytelling, unrelated to this one's perspective-construction
 *  focus. Only the display fields below changed (title, subtitle/eyebrow)
 *  — `id` and both lesson files are untouched on purpose: `id` is what
 *  scene-drawing-app.js and this course's own history use internally, and
 *  changing it isn't part of a display-only rename. `description` is also
 *  untouched — it already describes these two lessons' actual perspective/
 *  structure content accurately, independent of the old course-level name.
 *
 *  Faye's plan (not part of this task): when Unit 05 of the new course
 *  needs perspective content later, these two lessons' real content gets
 *  reused there directly, just re-labeled into that course/sequence.
 *
 *  This is the only file you need to edit to add a new lesson to the list:
 *  1. Create scene-drawing/lesson-N-your-lesson-name.js (copy an existing one)
 *  2. Add it to COURSE.lessons below
 *  3. Add a <script src="../lesson-N-your-lesson-name.js"> tag in both
 *     scene-drawing/index.html and scene-drawing/lesson/index.html
 *  No other files need to change.
 * ═══════════════════════════════════════════════════════════════════════════ */

const COURSE = {
  id: 'scene-drawing-foundation',
  title: 'Perspective Drawing Foundation',
  subtitle: 'Perspective & Structure',
  description: 'Learn to build a believable space — streets, rooms, and the world around you — using perspective, structure, and grey-scale value. No color yet: this stage is about space, line, and light.',
  materials: ['HB or 2B Pencil', 'Eraser', 'Ruler', 'Grey Markers', 'Print Paper'],
  // Lesson objects are defined in their own files and pushed in here so this
  // file never grows past a simple ordered list.
  lessons: [
    SCENE_DRAWING_LESSON_1_ONE_POINT_STREET,
    SCENE_DRAWING_LESSON_2_TWO_POINT_BEDROOM
    // Future: outdoor landscape, classroom scene, city corner, fantasy
    // world, café interior, advanced perspective scene — append here.
  ]
};
