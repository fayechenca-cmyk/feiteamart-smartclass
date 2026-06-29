/* ═══════════════════════════════════════════════════════════════════════════
 *  LESSON 1 · One Point Perspective Street Scene
 *  V2 — visual-first, interactive rewrite (June 2026, per Faye)
 *
 *  Pure data — no HTML/layout here. The shared engine in
 *  /core/scene-drawing-app.js + /core/interactive-perspective-block.js
 *  renders this into the actual UI.
 *
 *  WHAT CHANGED FROM V1
 *  - Steps now lead with `shortInstruction` (1 line) instead of paragraphs.
 *  - `studentTask` paragraphs replaced by a single `taskChip` verb
 *    (Watch / Try / Drag / Draw / Check / Upload...).
 *  - `checkPoint` is now a short phrase shown next to a checkbox, not a question.
 *  - Steps 3–9 follow Faye's "Lesson 1 Updated Flow" exactly (9 steps) and
 *    carry an `interactive` config instead of static
 *    videoPlaceholder/imagePlaceholder where the spec calls for one.
 *  - The "Camera Angle Mini Demo" (spec item 3) lives INSIDE Step 3 as a
 *    second tab next to the horizon-line drag — both teach camera angle,
 *    one by free drag, one by tapping 3 fixed positions — rather than
 *    being its own step, to keep the flow at exactly 9 steps as specified.
 * ═══════════════════════════════════════════════════════════════════════════ */

const SCENE_DRAWING_LESSON_1_ONE_POINT_STREET = {
  id: 'one-point-street',
  title: 'Lesson 1: One Point Perspective Street Scene',
  lessonGoalShort: 'Build a street scene using one Vanishing Point — drag, watch, and build your way to a finished street.',
  lessonGoal: 'Build a one point perspective street scene. Drag the horizon line and the VP yourself, then build the road, buildings, and depth.',

  steps: [
    // ── Step 1: Scene Drawing Preview ──
    {
      stepNumber: 1,
      title: 'Scene Drawing Preview',
      shortInstruction: 'A scene can be a street, a room, or a world you invent.',
      videoPlaceholder: 'Teacher introduction video',
      imagePlaceholder: 'Final street / room / outdoor scene examples',
      taskChip: 'Watch',
      teacherTip: 'Scene drawing is about building a space, not just objects.',
      checkPoint: ''
    },
    // ── Step 2: Materials ──
    {
      stepNumber: 2,
      title: 'Materials',
      shortInstruction: 'Pencil, eraser, ruler, grey marker, paper.',
      videoPlaceholder: 'Materials introduction video',
      imagePlaceholder: 'Flat-lay of materials',
      taskChip: 'Check',
      teacherTip: 'Simple paper is fine — this is about learning space.',
      checkPoint: 'All materials ready'
    },
    // ── Step 3: Move the Horizon Line (drag + mini camera-position demo) ──
    {
      stepNumber: 3,
      title: 'Move the Horizon Line',
      taskChip: 'Drag',
      teacherTip: 'Eye level decides what kind of view you get.',
      checkPoint: 'Tried all three camera heights',
      interactive: {
        type: 'horizon-line-drag',
        title: 'Camera Angle + Horizon Line',
        shortInstruction: 'Move the horizon line. The camera angle changes.',
        labels: { high: 'Higher camera angle', mid: 'Normal eye level', low: 'Lower camera angle' },
        showReplay: false,
        showConstructionToggle: false,
        relatedStepId: 4
      },
      // Second, simpler interaction for the same concept — tap instead of
      // drag. Rendered below the drag widget on this same step card.
      secondaryInteractive: {
        type: 'camera-angle-demo',
        title: 'Or just tap a position',
        shortInstruction: 'High Camera · Eye Level · Low Camera',
        labels: { high: 'High Camera', mid: 'Eye Level', low: 'Low Camera' }
      }
    },
    // ── Step 4: Drag the Vanishing Point (interactive) ──
    {
      stepNumber: 4,
      title: 'Drag the Vanishing Point',
      taskChip: 'Drag',
      teacherTip: 'All depth lines move toward the VP.',
      checkPoint: 'VP stays on the horizon line',
      interactive: {
        type: 'vp-drag',
        title: 'Vanishing Point',
        shortInstruction: 'Drag the VP and watch the street turn.',
        showReplay: false,
        showConstructionToggle: false,
        relatedStepId: 3
      }
    },
    // ── Step 5: Build the Road (animated reveal) ──
    {
      stepNumber: 5,
      title: 'Build the Road',
      taskChip: 'Watch',
      teacherTip: 'Guide lines help you place the road and buildings.',
      checkPoint: 'Can find VP, Horizon, Road, Guide Lines',
      interactive: {
        type: 'guide-line-animation',
        title: 'Road + Guide Lines',
        shortInstruction: 'Guide lines help you place the road and buildings.',
        showReplay: true,
        showConstructionToggle: true,
        relatedStepId: 6
      }
    },
    // ── Step 6: Add Building Blocks (construction/clean toggle) ──
    {
      stepNumber: 6,
      title: 'Add Building Blocks',
      shortInstruction: 'Every building starts from a box.',
      videoPlaceholder: 'Building block demo',
      imagePlaceholder: 'Simple building blocks on both sides',
      taskChip: 'Draw',
      teacherTip: 'Add 2–3 buildings on each side, tall and short.',
      checkPoint: 'Buildings follow the same VP'
    },
    // ── Step 7: Add Shop Details (before/after compare) ──
    {
      stepNumber: 7,
      title: 'Add Shop Details',
      taskChip: 'Design',
      teacherTip: 'Follow the demo, or design your own shop.',
      checkPoint: 'Windows and doors align with perspective',
      interactive: {
        type: 'construction-toggle',
        title: 'Before / After — Shop Details',
        shortInstruction: 'Turn one plain box into a bakery, café, or shop you design.',
        before: { label: 'Plain box' },
        after: { label: 'Designed shop' }
      }
    },
    // ── Step 8: Complete the Street (visual checklist) ──
    {
      stepNumber: 8,
      title: 'Complete the Street',
      shortInstruction: 'Small details make the space feel alive.',
      videoPlaceholder: 'Street detail demo',
      imagePlaceholder: 'Lamp posts, trees, signs, benches, clouds',
      taskChip: 'Draw',
      teacherTip: 'Add details to both sides of the street.',
      checkPoint: 'The whole street feels connected'
    },
    // ── Step 9: Grey Marker Depth (before/after slider) ──
    {
      stepNumber: 9,
      title: 'Grey Marker Depth',
      taskChip: 'Try',
      teacherTip: 'Far objects lighter, near objects stronger.',
      checkPoint: 'Foreground, middle, and background are clear',
      interactive: {
        type: 'construction-toggle',
        title: 'Before / After — Grey Marker',
        shortInstruction: 'Add grey marker to build depth and shadow.',
        before: { label: 'Pencil only' },
        after: { label: 'With grey marker' }
      }
    }
  ],

  finalArtworkGoal: 'A complete one point perspective street scene in pencil and grey marker.',

  // Multiple-choice / checkbox reflection — per Faye, June 2026: open text
  // reflections weren't getting answered seriously, so these are now easy
  // taps instead. type: 'single' (pick one) or 'multi' (checkbox, several OK).
  reflectionQuestions: [
    { text: 'Where is your Vanishing Point?', type: 'single',
      options: ['On the horizon line', 'Under the road', 'Inside a building', 'I am not sure yet'] },
    { text: 'What camera angle did you use?', type: 'single',
      options: ['Slightly high', 'Eye level', 'Slightly low', 'I want to try another one'] },
    { text: 'What did you design in your street?', type: 'multi',
      options: ['Bakery', 'Café', 'Bookstore', 'Flower shop', 'Tall buildings', 'Trees', 'Street lights', 'Other'] },
    { text: 'What part feels closest to the viewer?', type: 'single',
      options: ['Road', 'Front buildings', 'Sky', 'Far background'] },
    { text: 'How confident do you feel about one point perspective?', type: 'single',
      options: ['I understand it', 'I understand some parts', 'I need more practice', 'I want to watch the demo again'] }
  ],

  // NOTE: this is NOT a per-lesson badge — per Faye's standing rule, badges
  // are course-level only (see core/scene-drawing-platform-bridge.js). This
  // field is descriptive metadata for this lesson's milestone, shown as a
  // "Lesson complete" callout, not a badge graphic. The real badge
  // ("Scene Designer") unlocks only once every lesson in the course is done.
  completionBadge: {
    name: 'Street Scene Builder',
    emoji: '🏙️',
    desc: 'You built a one point perspective street scene from a single vanishing point all the way to a finished, shaded space.'
  }
};
