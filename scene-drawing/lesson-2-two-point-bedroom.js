/* ═══════════════════════════════════════════════════════════════════════════
 *  LESSON 2 · Two Point Perspective Bedroom Interior
 *  Pure data — no HTML/layout here. The shared engine in
 *  /core/scene-drawing-app.js renders this into the actual UI.
 * ═══════════════════════════════════════════════════════════════════════════ */

const SCENE_DRAWING_LESSON_2_TWO_POINT_BEDROOM = {
  id: 'two-point-bedroom',
  title: 'Lesson 2: Two Point Perspective Bedroom Interior',
  lessonGoalShort: 'Build a bedroom interior using two Vanishing Points — room structure, furniture, texture, and personal design.',
  lessonGoal: 'Build a two point perspective bedroom interior. Understand two VPs, camera angle, room structure, ceiling, floor, walls, bed, table, window, soft texture, and small objects.',

  steps: [
    // ── Step 1: Two Point Perspective + Indoor Camera Angle (interactive) ──
    // V3 — June 2026 per Faye: room now has ceiling/floor/walls/window,
    // a human eye-level reference figure, and VP drags now stretch real
    // furniture (bed/table/bookshelf) via shared depth-line math, not just
    // the bare room box. Construction/Clean toggle added.
    {
      stepNumber: 1,
      title: 'Two Point Perspective + Camera Angle',
      taskChip: 'Drag',
      teacherTip: 'VP controls the room direction and object depth.',
      checkPoint: 'Both VP points stay on the horizon line',
      interactive: {
        type: 'two-vp-room-drag',
        title: 'Two VP Room View',
        shortInstruction: 'Drag the VP points. Watch the room and furniture change.',
        labels: {
          vpLeft: 'VP Left', vpRight: 'VP Right', horizon: 'Horizon Line',
          eyeReference: 'Eye Level Reference', ceiling: 'Ceiling', floor: 'Floor', wall: 'Wall',
          bedConstruction: 'Bed Construction', objectGuides: 'Object Guide Lines'
        },
        showReplay: false,
        showConstructionToggle: true,
        relatedStepId: 2
      },
      secondaryInteractive: {
        type: 'indoor-camera-angle-demo',
        title: 'Indoor Camera Angle',
        shortInstruction: 'Camera height changes how we see the room.',
        labels: { high: 'Slightly High', mid: 'Eye Level', low: 'Slightly Low' }
      }
    },
    // ── Step 2: First Vertical Line / Room Corner (interactive) ──
    // V2 — interactive rewrite. Was static text/image; now a draggable
    // corner line (move + resize) plus a sequential "Show Room Frame"
    // reveal as a secondary widget, both tied to the same VP pair.
    {
      stepNumber: 2,
      title: 'First Vertical Line',
      taskChip: 'Drag',
      teacherTip: 'This line becomes the corner where two walls meet.',
      checkPoint: 'The line sits between VP Left and VP Right',
      interactive: {
        type: 'first-vertical-line-room',
        title: 'Start with One Vertical Line',
        shortInstruction: 'Move the line. It becomes the room corner.',
        labels: {
          line: 'First Vertical Line', corner: 'Room Corner',
          leftWall: 'Left Wall Direction', rightWall: 'Right Wall Direction',
          vpLeft: 'VP Left', vpRight: 'VP Right'
        },
        showReplay: false,
        showConstructionToggle: false,
        relatedStepId: 3
      },
      secondaryInteractive: {
        type: 'room-frame-reveal',
        title: 'Room Frame Preview',
        shortInstruction: 'Show Room Frame builds the box from the corner line.',
        showReplay: true,
        showConstructionToggle: true,
        relatedStepId: 3
      }
    },
    // ── Step 3: Build the Room Frame — UNCHANGED per Faye's instruction.
    // Stays a video-demo step: video placeholder, image placeholder,
    // student drawing task, checkpoint. Do not convert to interactive-only.
    {
      stepNumber: 3,
      title: 'Build the Room Frame',
      shortExplanation: 'Use both VP points to create the walls, ceiling, and floor. This creates the basic bedroom structure.',
      videoPlaceholder: 'Room frame construction demo',
      imagePlaceholder: 'Step-by-step room frame diagram',
      studentTask: 'Draw the floor lines, ceiling lines, and wall edges.',
      teacherTip: 'The room is also a box. We are drawing inside the box.',
      checkPoint: 'Do the floor and ceiling lines go back to the VP points?'
    },
    {
      stepNumber: 4,
      title: 'Add Large Furniture Blocks',
      shortExplanation: 'Add the biggest objects first: bed, large table, cabinet, or bookshelf, as simple rectangular blocks.',
      videoPlaceholder: 'Large furniture block demo',
      imagePlaceholder: 'Bed and table as simple boxes',
      studentTask: 'Add one bed and one large table using VP guide lines.',
      teacherTip: 'Do not draw details first. Build the big shapes first.',
      checkPoint: 'Do the furniture edges follow the two VP directions?'
    },
    {
      stepNumber: 5,
      title: 'Window + Wall Objects',
      shortExplanation: 'Add a window above or beside the bed, plus wall objects such as a poster, shelf, picture frame, or curtain.',
      videoPlaceholder: 'Wall object demo',
      imagePlaceholder: 'Window and wall frame examples',
      studentTask: 'Add one window and at least two wall objects.',
      teacherTip: 'Wall objects also need perspective.',
      checkPoint: 'Do the window edges follow the wall direction?'
    },
    {
      stepNumber: 6,
      title: 'Small Objects on Floor and Furniture',
      shortExplanation: 'Add smaller objects: books, pillow, lamp, chair, plant, rug, toy, cup, blanket.',
      videoPlaceholder: 'Small object demo',
      imagePlaceholder: 'Small objects placed on bed, table, and floor',
      studentTask: 'Add at least five small objects.',
      teacherTip: 'Small objects should still sit inside the perspective space.',
      checkPoint: 'Do the objects feel attached to the room, not floating?'
    },
    {
      stepNumber: 7,
      title: 'Texture and Soft Forms',
      shortExplanation: 'The bed, pillow, blanket, and curtain are soft. Change some straight lines into curved, folded, or slightly uneven lines.',
      videoPlaceholder: 'Soft texture demo',
      imagePlaceholder: 'Before/after: hard block bed to soft bed',
      studentTask: 'Add soft lines to the bed, pillow, blanket, curtain, and rug.',
      teacherTip: 'Structure first, softness second.',
      checkPoint: 'Can we still see the furniture structure under the soft lines?'
    },
    {
      stepNumber: 8,
      title: 'Personal Bedroom Design',
      shortExplanation: 'Change the design based on your own room or dream room.',
      videoPlaceholder: 'Bedroom design inspiration video',
      imagePlaceholder: 'Bedroom design moodboard',
      studentTask: 'Add personal details: favorite poster, books, art supplies, plants, toys, window view.',
      teacherTip: 'Your room should show your personality.',
      checkPoint: 'Does the room feel like a real space and a personal space?'
    },
    {
      stepNumber: 9,
      title: 'Grey Marker + Final Depth',
      shortExplanation: 'Use grey marker to add shadows under furniture, beside the bed, under the table, and near corners.',
      videoPlaceholder: 'Interior grey marker demo',
      imagePlaceholder: 'Before/after grey marker bedroom example',
      studentTask: 'Add simple shadows and depth.',
      teacherTip: 'Corners and objects touching the floor usually need shadow.',
      checkPoint: 'Is there a clear sense of depth inside the room?'
    }
  ],

  finalArtworkGoal: 'A complete two point perspective bedroom interior with bed, window, large furniture, small objects, soft textures, and grey marker shadows.',

  // Multiple-choice / checkbox reflection — see lesson 1's file for the
  // rationale. type: 'single' (pick one) or 'multi' (checkbox, several OK).
  reflectionQuestions: [
    { text: 'Where are your two VP points?', type: 'single',
      options: ['Both on the horizon line', 'One is above the horizon line', 'Both are inside the room', 'I am not sure yet'] },
    { text: 'What did you build first?', type: 'single',
      options: ['One vertical line / room corner', 'Bed details', 'Window decoration', 'Grey marker shadow'] },
    { text: 'What furniture did you add?', type: 'multi',
      options: ['Bed', 'Table', 'Bookshelf', 'Chair', 'Window', 'Rug', 'Lamp', 'Other'] },
    { text: 'Which objects are soft?', type: 'multi',
      options: ['Pillow', 'Blanket', 'Curtain', 'Rug', 'Bed sheet', 'None yet'] },
    { text: 'How confident do you feel about two point perspective?', type: 'single',
      options: ['I understand it', 'I understand some parts', 'I need more practice', 'I want to watch the demo again'] }
  ],

  // NOTE: NOT a per-lesson badge — see lesson 1's file for the same note.
  // Real badge ("Scene Designer") is course-level only.
  completionBadge: {
    name: 'Interior Space Builder',
    emoji: '🛋️',
    desc: 'You built a full bedroom interior from two vanishing points — structure, furniture, texture, and your own personal touch.'
  }
};
