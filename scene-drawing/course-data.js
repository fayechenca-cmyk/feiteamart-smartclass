/* ═══════════════════════════════════════════════════════════════════════════
 *  COURSE DATA · Scene Drawing Foundation / Perspective Scene Drawing
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
  title: 'Scene Drawing Foundation',
  subtitle: 'Perspective Scene Drawing',
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
