import {
  runtimePrototypeInitialRunState,
  runtimePrototypeLesson as legacyRuntimePrototypeLesson,
} from "./lfc054-runtime-lesson.js";
import { lfc054ArtworkSubsetDraft } from "./lfc054-artwork-subset.js";
import { lfc054PromptPackDraft } from "./lfc054-prompt-pack.js";
import { lfc054LessonDataDraft } from "./lfc054-lesson-data.js";

const legacyArtworkLibrary = legacyRuntimePrototypeLesson.artworkLibrary;

function pickRecords(ids = []) {
  const allPools = Object.values(lfc054ArtworkSubsetDraft.pools).flat();
  return ids
    .map((id) => allPools.find((record) => record.artworkId === id))
    .filter(Boolean);
}

function createFallbackArtworkImage(record) {
  if (!record) return legacyArtworkLibrary.study.imageSrc;
  if (record.artworkId.includes("magritte")) return legacyArtworkLibrary.magritte.imageSrc;
  if (record.artworkId.includes("dali")) return legacyArtworkLibrary.dali.imageSrc;
  if (record.artworkId.includes("varo")) return legacyArtworkLibrary.varo.imageSrc;
  return legacyArtworkLibrary.study.imageSrc;
}

function toSelectionItem(record, fallbackKey = "study") {
  return {
    id: record.artworkId,
    label: record.artist,
    artist: record.artist,
    title: record.title,
    year: record.year,
    medium: record.medium,
    sourceType: record.sourceType,
    sourceFloor: record.sourceFloor,
    creditLine: `${record.artist} · ${record.title}${record.year ? ` · ${record.year}` : ""}`,
    sourceLine:
      record.sourceFloor != null
        ? `Source: LFC Gallery Floor ${record.sourceFloor}`
        : record.sourceType === "lesson_original"
          ? "Source: FEI lesson reference"
          : "Source: lesson reference",
    imageSrc:
      record.img || createFallbackArtworkImage(record) || legacyArtworkLibrary[fallbackKey].imageSrc,
    alt: `${record.title} by ${record.artist}`,
  };
}

function makeScreenId(index, baseId) {
  return { stepNumber: index + 1, screenId: baseId };
}

function createSystemHooks({
  artworkSource = null,
  aiMode = null,
  thinkingQuest = null,
  uploadPoint = null,
  teacherHelp = null,
  journeyWriteback = [],
} = {}) {
  return {
    artworkSource,
    aiMode,
    thinkingQuest,
    uploadPoint,
    teacherHelp,
    journeyWriteback,
  };
}

function createWelcomeScreen(index) {
  return {
    ...makeScreenId(index, "welcome"),
    uiKind: "welcome",
    title: "Illustration Through Surrealism",
    partLabel: "Start",
    xpValue: 0,
    progressOnComplete: "started",
    saveMessage: "Lesson opened",
    completionRule: { type: "always" },
    prompt: {
      kids: "Start from a normal world, then change one rule.",
      teen: "This lesson begins with artworks, then moves toward your own surreal illustration.",
      adult: "Begin with visual logic, then carry one altered rule into your own illustration-making.",
    },
    helperText: {
      kids: "You will look, choose, and draw one clear strange change.",
      teen: "The lesson stays visual first, then moves toward guided making.",
      adult: "Observation, artist logic, and guided making remain connected throughout the lesson.",
    },
    blocks: {
      heroMessage: {
        eyebrow: "LFC054",
        title: "Illustration Through Surrealism",
        body: "Start from a real scene. Change one rule. Build a surreal illustration through artworks, visual logic, and guided colored-pencil making.",
      },
    },
    systemHooks: createSystemHooks({
      journeyWriteback: ["lesson_opened"],
    }),
  };
}

function createLookScreen(index, screenId, title, partLabel, poolBinding, saveMessage) {
  const ids = lfc054ArtworkSubsetDraft.screenBindings[poolBinding].kids;
  const records = pickRecords(ids);

  return {
    ...makeScreenId(index, screenId),
    uiKind: "look",
    title,
    partLabel,
    xpValue: 8,
    skipAllowed: true,
    progressOnComplete: "looking",
    saveMessage,
    completionRule: {
      type: "single_choice_with_optional_chips",
      field: `responses.${screenId}.selectedArtworkId`,
    },
    prompt: {
      kids: "Which image feels the strangest first?",
      teen: "Which image changes reality most clearly for you?",
      adult: "Which image alters reality most decisively at first glance?",
    },
    helperText: {
      kids: lfc054PromptPackDraft.artchiModes.look.lines.kids[0],
      teen: lfc054PromptPackDraft.artchiModes.look.lines.teen[0],
      adult: lfc054PromptPackDraft.artchiModes.look.lines.adult[0],
    },
    blocks: {
      artworkSelection: {
        items: records.map((record) => toSelectionItem(record)),
        reactionChips: [
          { id: "scale_shift", label: "Scale shift" },
          { id: "bending", label: "Bending" },
          { id: "floating", label: "Floating" },
          { id: "dream_logic", label: "Dream logic" },
        ],
      },
      recordedTeacherIntro: {
        label: "Recorded teacher note",
        line: {
          kids: "Look first for the part that feels a little impossible.",
          teen: "Notice the shift before you explain it.",
          adult: "Let visual instinct lead before interpretation.",
        },
      },
    },
    systemHooks: createSystemHooks({
      artworkSource: poolBinding,
      aiMode: "lfc_guide",
      thinkingQuest: screenId === "meet-the-artists" ? "level1_observation" : "light_kids_compare",
      journeyWriteback: [screenId, `${screenId}_saved`],
    }),
  };
}

function createUnderstandScreen(index) {
  const compareRecord =
    pickRecords(lfc054ArtworkSubsetDraft.screenBindings["how-surreal-enters-an-image"].teen)[0] ??
    pickRecords(lfc054ArtworkSubsetDraft.screenBindings["what-is-surrealism"].teen)[0];

  return {
    ...makeScreenId(index, "how-surreal-enters-an-image"),
    uiKind: "understand",
    title: "How Surreal Enters an Image",
    partLabel: "Understand",
    xpValue: 10,
    skipAllowed: true,
    progressOnComplete: "understanding",
    saveMessage: "Visual logic captured",
    completionRule: {
      type: "single_choice",
      field: "responses.understand.selectedEffectId",
    },
    prompt: {
      kids: "What kind of strange change do you notice most?",
      teen: "What kind of surreal move creates the strongest effect here?",
      adult: "Which altered rule of reality produces the main surreal effect here?",
    },
    helperText: {
      kids: lfc054PromptPackDraft.artchiModes.think.lines.kids[0],
      teen: lfc054PromptPackDraft.artchiModes.think.lines.teen[0],
      adult: lfc054PromptPackDraft.artchiModes.think.lines.adult[0],
    },
    blocks: {
      visualCompare: {
        mainArtwork: {
          imageSrc: compareRecord?.img || createFallbackArtworkImage(compareRecord),
          alt: compareRecord ? `${compareRecord.title} by ${compareRecord.artist}` : legacyArtworkLibrary.study.alt,
          artist: compareRecord?.artist || "LFC Reference",
          title: compareRecord?.title || "Surreal move study",
          year: compareRecord?.year || "",
          medium: compareRecord?.medium || "",
          sourceLine:
            compareRecord?.sourceFloor != null
              ? `Source: LFC Gallery Floor ${compareRecord.sourceFloor}`
              : "Source: lesson reference",
        },
        compareNotes: [
          {
            label: "What stays ordinary",
            text: "Part of the image still feels believable enough for the strange change to matter.",
          },
          {
            label: "What breaks reality",
            text: "One shift in scale, placement, material, or dream logic changes the whole image.",
          },
        ],
      },
      effectChoice: {
        options: [
          { id: "scale_shift", label: "Scale shift" },
          { id: "bending", label: "Bending" },
          { id: "floating", label: "Floating" },
          { id: "wrong_place", label: "Wrong place" },
          { id: "dream_combination", label: "Dream combination" },
        ],
      },
      microInsight: {
        label: "Visual logic",
        line: {
          kids: "One strange move can change how the whole picture feels.",
          teen: "A surreal image often keeps one part ordinary and changes one strong rule.",
          adult: "The surreal effect grows when the disruption is precise and the surrounding world remains legible.",
        },
      },
    },
    systemHooks: createSystemHooks({
      artworkSource: "subset_move_examples",
      aiMode: "surreal_logic_helper",
      thinkingQuest: "level2_choice_change",
      journeyWriteback: ["surreal_move_explored", "visual_logic_saved"],
    }),
  };
}

function createChoiceScreen(index, config) {
  return {
    ...makeScreenId(index, config.screenId),
    uiKind: "choice",
    title: config.title,
    partLabel: config.partLabel,
    xpValue: config.xpValue,
    skipAllowed: true,
    progressOnComplete: config.progressOnComplete,
    saveMessage: config.saveMessage,
    completionRule: {
      type: "single_choice",
      field: config.field,
    },
    prompt: config.prompt,
    helperText: config.helperText,
    blocks: {
      choiceGrid: {
        field: config.field,
        options: config.options.map((option) =>
          typeof option === "string" ? { id: option, label: option } : option,
        ),
      },
      reflectionPrompt: config.reflectionPrompt ?? null,
    },
    systemHooks: createSystemHooks({
      aiMode: "idea_builder",
      journeyWriteback: [config.screenId, `${config.screenId}_saved`],
    }),
  };
}

function createPairChoiceScreen(index) {
  return {
    ...makeScreenId(index, "add-the-strange"),
    uiKind: "pair_choice",
    title: "Add the Strange",
    partLabel: "Plan",
    xpValue: 8,
    skipAllowed: true,
    progressOnComplete: "planning",
    saveMessage: "Surreal idea captured",
    completionRule: {
      type: "required_pair",
      fields: [
        "responses.buildIdea.selectedMoveId",
        "responses.buildIdea.selectedStorySeedId",
      ],
    },
    prompt: {
      kids: "Choose one strong strange change for your normal scene.",
      teen: "Pick one surreal move and one story seed. Keep the idea clear.",
      adult: "Build one precise surreal intervention inside a believable scene.",
    },
    helperText: {
      kids: lfc054PromptPackDraft.aiModes.idea_builder.starterPrompts[1],
      teen: "One strong idea is better than many scattered ones.",
      adult: "Let one altered rule lead the whole image.",
    },
    blocks: {
      pairChoice: {
        left: {
          field: "responses.buildIdea.selectedMoveId",
          label: "Choose your surreal move",
          options: [
            { id: "scale_shift", label: "Make something too large or too small" },
            { id: "bending", label: "Bend or soften one object" },
            { id: "floating", label: "Make one thing float" },
            { id: "wrong_place", label: "Put one thing in the wrong place" },
            { id: "dream_combination", label: "Mix two worlds together" },
          ],
        },
        right: {
          field: "responses.buildIdea.selectedStorySeedId",
          label: "Choose a story seed",
          options: [
            { id: "grows-too-large", label: "Something grows too large" },
            { id: "time-softens", label: "Time begins to soften" },
            { id: "wrong-object", label: "One object no longer belongs" },
            { id: "gravity-stops", label: "The room stops obeying gravity" },
          ],
        },
      },
      reflectionPrompt: {
        field: "responses.buildIdea.conceptSentence",
        label: "Concept sentence",
        prompt: "Write one short sentence that combines your scene and surreal change.",
      },
    },
    systemHooks: createSystemHooks({
      artworkSource: "selected_reference_recap",
      aiMode: "idea_builder",
      journeyWriteback: ["surreal_move_selected", "story_seed_selected", "concept_sentence_created"],
    }),
  };
}

function createChecklistScreen(index) {
  return {
    ...makeScreenId(index, "prepare-materials"),
    uiKind: "checklist",
    title: "Prepare Materials",
    partLabel: "Prepare",
    xpValue: 3,
    skipAllowed: true,
    progressOnComplete: "ready",
    saveMessage: "Materials ready",
    completionRule: {
      type: "min_checks",
      field: "responses.materials.readyIds",
      minRequired: 3,
    },
    prompt: {
      kids: "Get your materials ready before your surreal illustration starts.",
      teen: "Prepare the materials for this surreal illustration before the drawing stage begins.",
      adult: "Set the materials for this surreal illustration before the recorded guidance begins.",
    },
    helperText: {
      kids: "This lesson is shown with colored pencils and sketch paper. Other materials are okay too.",
      teen: "This example is mainly demonstrated with colored pencils and sketch paper, though other materials are allowed.",
      adult: "This lesson is primarily demonstrated with colored pencils on sketch paper, though learners may adapt the process to other materials.",
    },
    blocks: {
      checklist: {
        field: "responses.materials.readyIds",
        items: [
          { id: "colored-pencils", label: "Colored pencils" },
          { id: "sketch-paper", label: "Sketch paper" },
          { id: "no-eraser-needed", label: "I know I do not need an eraser" },
        ],
      },
      materialsNote: {
        title: "Main tools for this lesson",
        body: {
          kids: "We will mainly use colored pencils and sketch paper in this surreal illustration example.",
          teen: "The main tools in this lesson example are colored pencils and sketch paper.",
          adult: "This demonstration is built around colored pencil illustration on sketch paper.",
        },
        extra: {
          kids: "If you want to try another material, that is fine.",
          teen: "You may still use other materials if you prefer, but the teaching example follows colored pencil steps.",
          adult: "Other materials remain possible, but the pacing, layering, and finish in this lesson are demonstrated through colored pencil handling.",
        },
      },
    },
    systemHooks: createSystemHooks({
      journeyWriteback: ["materials_ready_confirmed"],
    }),
  };
}

function createDrawScreen(index, segment, minRequired) {
  return {
    ...makeScreenId(index, segment.segmentId),
    uiKind: "draw",
    title: segment.title,
    partLabel: "Draw",
    xpValue: 8,
    progressOnComplete: "drawing",
    saveMessage: "Current segment saved",
    completionRule: {
      type: "min_checks",
      field: "responses.draw.completedSegmentIds",
      minRequired,
    },
    prompt: {
      kids: "Watch one move, pause, draw, and continue when you are ready.",
      teen: "Recorded teacher guidance leads the move. You work through one clear action at a time.",
      adult: "This remains asynchronous guided making: one recorded move, one pause point, one practical check.",
    },
    helperText: {
      kids: lfc054PromptPackDraft.artchiModes.make.lines.kids[0],
      teen: lfc054PromptPackDraft.artchiModes.make.lines.teen[0],
      adult: lfc054PromptPackDraft.artchiModes.make.lines.adult[0],
    },
    blocks: {
      drawSegments: [segment],
      futureContinuity: {
        label: "Support paths",
        aiScan: "AI help can respond to your sketch or current drawing step.",
        teacherReview: "Teacher help can appear as a premium path at sketch, midpoint, and final review.",
        journey: "My Journey can later save your surreal move, reflection, and final image continuity.",
      },
    },
    systemHooks: createSystemHooks({
      aiMode: "making_companion",
      uploadPoint: segment.segmentId === "draw-final-push" ? "final_upload" : "midpoint_upload",
      teacherHelp: "premium_only",
      journeyWriteback: [segment.segmentId, `${segment.segmentId}_saved`],
    }),
  };
}

function createReflectionScreen(index) {
  return {
    ...makeScreenId(index, "reflection-and-journey"),
    uiKind: "reflection",
    title: "Reflection and Journey",
    partLabel: "Reflect",
    xpValue: 6,
    skipAllowed: true,
    progressOnComplete: "reflecting",
    saveMessage: "Reflection saved",
    completionRule: {
      type: "reflection_submit",
      chipField: "responses.reflection.chips",
      textField: "responses.reflection.text",
    },
    prompt: {
      kids: "What changed in your world, and how does it feel now?",
      teen: "Name the surreal move you used and the feeling you tried to create.",
      adult: "Reflect on the altered rule of reality and the effect it created in the final image.",
    },
    helperText: {
      kids: lfc054PromptPackDraft.artchiModes.reflect.lines.kids[0],
      teen: lfc054PromptPackDraft.artchiModes.reflect.lines.teen[0],
      adult: lfc054PromptPackDraft.artchiModes.reflect.lines.adult[0],
    },
    blocks: {
      reflection: {
        chips: [
          { id: "scale_shift", label: "Scale shift" },
          { id: "bending", label: "Bending" },
          { id: "floating", label: "Floating" },
          { id: "wrong_place", label: "Wrong place" },
          { id: "dream_combination", label: "Dream combination" },
        ],
        promptLabel: "My Journey note",
        prompt: "Write one short reflection about what rule of reality you changed and what feeling the image now creates.",
      },
    },
    systemHooks: createSystemHooks({
      artworkSource: "selected_reference_recap",
      aiMode: "final_reflection_helper",
      journeyWriteback: ["reflection_saved", "journey_summary_requested"],
    }),
  };
}

function createContinueScreen(index) {
  return {
    ...makeScreenId(index, "continue-your-path"),
    uiKind: "continue",
    title: "Continue Your Path",
    partLabel: "Continue",
    xpValue: 5,
    progressOnComplete: "completed",
    saveMessage: "Lesson continuity ready",
    completionRule: { type: "always" },
    prompt: {
      kids: "You finished your surreal world.",
      teen: "Your surreal image, reflections, and next support paths can now continue through FEI TeamArt.",
      adult: "This lesson can now connect into Journey, AI review, and premium critique paths.",
    },
    helperText: {
      kids: "You can keep going with Artchi, My Journey, and the next lesson later.",
      teen: "My Journey, AI feedback, and teacher help can continue from here.",
      adult: "The image can now continue into reflection, review, and ecosystem continuity.",
    },
    blocks: {
      continuation: {
        items: [
          "Open My Journey",
          "Ask AI for review",
          "Book Artist Mentor",
          "Book Human Curator",
        ],
      },
    },
    systemHooks: createSystemHooks({
      teacherHelp: "premium_only",
      journeyWriteback: ["lesson_completed", "continuation_choice_if_any"],
    }),
  };
}

function createDrawSegments() {
  const drawPrompts = lfc054PromptPackDraft.drawPrompts;
  const teacherFrame = legacyArtworkLibrary.teacherFrame.imageSrc;

  return [
    {
      segmentId: "draw-sketch-real-scene",
      title: "Sketch the Real Scene",
      teacherMedia: {
        label: "Recorded video lesson",
        durationLabel: "0:48",
        imageSrc: teacherFrame,
        title: "Build the real world first",
        caption: "The teacher lightly places the ordinary scene before any surreal shift enters.",
        sourceLine: "Video slot: your recorded teaching clip for this step appears here.",
      },
      pausePoint: {
        label: "Now it’s your turn",
        title: "Set the ordinary world",
        instruction: "Sketch the normal scene lightly so the surreal change will have somewhere to land.",
      },
      companionPrompt: {
        label: "Smart companion",
        type: "logic_reminder",
        text: drawPrompts.segment1_real_scene.companionLines[1],
      },
      checkpoint: {
        label: "Quick check",
        question: drawPrompts.segment1_real_scene.checkpoints.teen,
      },
    },
    {
      segmentId: "draw-place-the-change",
      title: "Choose Where the Change Enters",
      teacherMedia: {
        label: "Recorded video lesson",
        durationLabel: "0:42",
        imageSrc: teacherFrame,
        title: "Choose one point of entry",
        caption: "The teacher decides exactly where reality changes instead of spreading strangeness everywhere.",
        sourceLine: "Video slot: your recorded teaching clip for this step appears here.",
      },
      pausePoint: {
        label: "Now it’s your turn",
        title: "Choose the entry point",
        instruction: "Pick one place for the strange move to enter. Let that place lead the image.",
      },
      companionPrompt: {
        label: "Smart companion",
        type: "warning",
        text: drawPrompts.segment2_entry_point.companionLines[0],
      },
      checkpoint: {
        label: "Quick check",
        question: drawPrompts.segment2_entry_point.checkpoints.teen,
      },
    },
    {
      segmentId: "draw-make-the-strange-visible",
      title: "Draw the Strange Move",
      teacherMedia: {
        label: "Recorded video lesson",
        durationLabel: "0:56",
        imageSrc: teacherFrame,
        title: "Push the strange move clearly",
        caption: "The teacher draws the surreal change decisively while keeping part of the subject recognizable.",
        sourceLine: "Video slot: your recorded teaching clip for this step appears here.",
      },
      pausePoint: {
        label: "Now it’s your turn",
        title: "Make the change visible",
        instruction: "Draw the surreal move clearly. Let the viewer notice it without explanation.",
      },
      companionPrompt: {
        label: "Smart companion",
        type: "focus",
        text: drawPrompts.segment3_draw_the_move.companionLines[1],
      },
      checkpoint: {
        label: "Quick check",
        question: drawPrompts.segment3_draw_the_move.checkpoints.teen,
      },
    },
    {
      segmentId: "draw-connect-real-and-strange",
      title: "Connect the Real and the Strange",
      teacherMedia: {
        label: "Recorded video lesson",
        durationLabel: "0:51",
        imageSrc: teacherFrame,
        title: "Connect the space",
        caption: "The teacher uses edge, contact, and direction to make the impossible feel placed inside one world.",
        sourceLine: "Video slot: your recorded teaching clip for this step appears here.",
      },
      pausePoint: {
        label: "Now it’s your turn",
        title: "Connect the space",
        instruction: "Adjust the image so the surreal part still belongs to the room, table, or space around it.",
      },
      companionPrompt: {
        label: "Smart companion",
        type: "compare",
        text: drawPrompts.segment4_connect_space.companionLines[0],
      },
      checkpoint: {
        label: "Quick check",
        question: drawPrompts.segment4_connect_space.checkpoints.teen,
      },
    },
    {
      segmentId: "draw-color-the-mood",
      title: "Color the Mood",
      teacherMedia: {
        label: "Recorded video lesson",
        durationLabel: "0:44",
        imageSrc: teacherFrame,
        title: "Color the feeling",
        caption: "The teacher uses color to support mood instead of decorating randomly.",
        sourceLine: "Video slot: your recorded teaching clip for this step appears here.",
      },
      pausePoint: {
        label: "Now it’s your turn",
        title: "Support the mood",
        instruction: "Color the image in a way that strengthens the mood of your strange idea.",
      },
      companionPrompt: {
        label: "Smart companion",
        type: "mood",
        text: drawPrompts.segment5_color_mood.companionLines[1],
      },
      checkpoint: {
        label: "Quick check",
        question: drawPrompts.segment5_color_mood.checkpoints.teen,
      },
    },
    {
      segmentId: "draw-final-push",
      title: "Final Push and Stop",
      teacherMedia: {
        label: "Recorded video lesson",
        durationLabel: "0:35",
        imageSrc: teacherFrame,
        title: "Know when to stop",
        caption: "The teacher checks whether the idea reads clearly, strengthens what matters, then stops.",
        sourceLine: "Video slot: your recorded teaching clip for this step appears here.",
      },
      pausePoint: {
        label: "Now it’s your turn",
        title: "Step back and stop",
        instruction: "Look once more at the whole image, strengthen only what helps, then stop before it gets crowded.",
      },
      companionPrompt: {
        label: "Smart companion",
        type: "check",
        text: drawPrompts.segment6_final_push.companionLines[2],
      },
      checkpoint: {
        label: "Quick check",
        question: drawPrompts.segment6_final_push.checkpoints.teen,
      },
    },
  ];
}

const screens = [];
screens.push(createWelcomeScreen(screens.length));
screens.push(
  createLookScreen(
    screens.length,
    "what-is-surrealism",
    "What Is Surrealism?",
    "Look",
    "what-is-surrealism",
    "First observation saved",
  ),
);
screens.push(
  createLookScreen(
    screens.length,
    "meet-the-artists",
    "Meet the Artists",
    "Look",
    "meet-the-artists",
    "Reference artist saved",
  ),
);
screens.push(createUnderstandScreen(screens.length));
screens.push(
  createChoiceScreen(screens.length, {
    screenId: "pick-your-real-scene",
    title: "Pick Your Real Scene",
    partLabel: "Plan",
    xpValue: 6,
    progressOnComplete: "planning",
    saveMessage: "Base scene saved",
    field: "responses.buildIdea.selectedSceneId",
    prompt: {
      kids: "Choose a normal scene first.",
      teen: "Choose a believable real-world scene as your base.",
      adult: "Begin from a clear and ordinary visual structure.",
    },
    helperText: {
      kids: "The strange part will feel stronger later.",
      teen: "A believable normal world gives the surreal move more power.",
      adult: "The disruption gains force when the ordinary structure is clear first.",
    },
    options: [
      { id: "room", label: "Room" },
      { id: "desk", label: "Desk" },
      { id: "window", label: "Window" },
      { id: "outdoor-corner", label: "Outdoor corner" },
      { id: "table-scene", label: "Table scene" },
    ],
    reflectionPrompt: {
      field: "responses.buildIdea.selectedMoodId",
      label: "Mood direction",
      prompt: "Choose the feeling you want the scene to carry.",
      options: [
        { id: "quiet", label: "Quiet" },
        { id: "funny", label: "Funny" },
        { id: "mysterious", label: "Mysterious" },
        { id: "lonely", label: "Lonely" },
        { id: "magical", label: "Magical" },
      ],
    },
  }),
);
screens.push(createPairChoiceScreen(screens.length));
screens.push(createChecklistScreen(screens.length));
createDrawSegments().forEach((segment, index) => {
  screens.push(createDrawScreen(screens.length, segment, index + 1));
});
screens.push(createReflectionScreen(screens.length));
screens.push(createContinueScreen(screens.length));

export const adaptedLfc054LessonPackage = {
  lesson: {
    lessonId: lfc054LessonDataDraft.lessonMeta.lessonId,
    slug: lfc054LessonDataDraft.lessonMeta.slug,
    title: lfc054LessonDataDraft.lessonMeta.title,
    shortTitle: "LFC054",
    lessonFamily: lfc054LessonDataDraft.lessonMeta.familyId,
    ageGroups: lfc054LessonDataDraft.learnerModes.ageGroups,
    totalSteps: screens.length,
    badge: {
      badgeId: lfc054LessonDataDraft.lessonMeta.badgeId,
      badgeName: "Creative Transformer",
      badgeCategory: "creative_thinking",
      badgeMessage: "You turned artist logic into your own image world.",
    },
  },
  accessConfig: {
    accessModel: "free",
    previewScreenIds: screens.slice(0, 3).map((screen) => screen.screenId),
  },
  defaults: {
    ageGroup: lfc054LessonDataDraft.learnerModes.defaultAgeGroup,
    currentStep: 1,
    currentScreenId: screens[0].screenId,
    progressState: "not_started",
    reflectionState: "not_started",
    badgeState: "locked",
  },
  artworkLibrary: legacyArtworkLibrary,
  screens,
};

export const adaptedLfc054InitialRunState = {
  ...runtimePrototypeInitialRunState,
  lessonId: lfc054LessonDataDraft.lessonMeta.lessonId,
  currentStep: 1,
  currentScreenId: screens[0].screenId,
  completedScreenIds: [],
  currentLessonXP: 0,
  isLessonComplete: false,
  progressState: "not_started",
  reflectionState: "not_started",
  badgeState: "locked",
  responses: {
    "what-is-surrealism": {
      selectedArtworkId: "",
      reactionChipIds: [],
    },
    "meet-the-artists": {
      selectedArtworkId: "",
      reactionChipIds: [],
    },
    understand: {
      selectedEffectId: "",
    },
    buildIdea: {
      selectedSceneId: "",
      selectedMoodId: "",
      selectedMoveId: "",
      selectedStorySeedId: "",
      conceptSentence: "",
    },
    materials: {
      readyIds: [],
    },
    draw: {
      activeSegmentIndex: 0,
      completedSegmentIds: [],
      acknowledgedCheckpointIds: [],
    },
    uploads: {},
    reflection: {
      chips: [],
      text: "",
    },
    quest: {},
    judgmentCards: [],
  },
  badge: {
    ...runtimePrototypeInitialRunState.badge,
    badgeId: lfc054LessonDataDraft.lessonMeta.badgeId,
  },
};
