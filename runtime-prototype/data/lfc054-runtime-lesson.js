const createArtworkPanel = (label, start, end, accent, note) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)" />
      <ellipse cx="870" cy="240" rx="250" ry="170" fill="${accent}" fill-opacity="0.18" />
      <ellipse cx="280" cy="650" rx="210" ry="160" fill="${accent}" fill-opacity="0.12" />
      <rect x="190" y="170" width="400" height="500" rx="38" fill="#fff7f0" fill-opacity="0.86" />
      <path d="M744 250C808 208 894 220 952 292C1006 359 990 468 907 525C816 588 691 561 650 467C623 405 639 310 706 268C717 262 730 255 744 250Z" fill="#f8f0e6" fill-opacity="0.92" />
      <text x="76" y="108" fill="#1a1d2b" font-family="Montserrat, sans-serif" font-size="58" font-weight="800">${label}</text>
      <text x="76" y="164" fill="#4a4f5e" font-family="Open Sans, sans-serif" font-size="28">${note}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const artworkLibrary = {
  magritte: {
    artworkId: "magritte-scale",
    label: "Magritte",
    title: "Ordinary Room, Impossible Scale",
    artist: "René Magritte",
    imageSrc: createArtworkPanel(
      "Magritte",
      "#efe9df",
      "#d8cdc0",
      "#82938f",
      "An ordinary world interrupted by one impossible change."
    ),
    alt: "A Magritte-inspired scene where scale changes ordinary reality.",
  },
  dali: {
    artworkId: "dali-dream",
    label: "Dalí",
    title: "Dream Logic in a Familiar Space",
    artist: "Salvador Dalí",
    imageSrc: createArtworkPanel(
      "Dalí",
      "#f3ebe3",
      "#decec3",
      "#a78666",
      "Dream logic softens and distorts what should feel stable."
    ),
    alt: "A Dalí-inspired surreal image where a dreamlike transformation changes the scene.",
  },
  varo: {
    artworkId: "varo-world",
    label: "Varo",
    title: "A World Built on Uncanny Logic",
    artist: "Remedios Varo",
    imageSrc: createArtworkPanel(
      "Varo",
      "#eee9e5",
      "#d7d2cf",
      "#7a73a3",
      "The world feels internally coherent, but its logic is no longer ordinary."
    ),
    alt: "A Varo-inspired surreal image where the whole world feels transformed.",
  },
  study: {
    artworkId: "study-magritte",
    label: "Study Image",
    title: "One Move Under the Microscope",
    artist: "Surrealist Study",
    imageSrc: createArtworkPanel(
      "Study",
      "#efe6dc",
      "#dfd0c2",
      "#8d705b",
      "One altered element changes the whole emotional logic."
    ),
    alt: "A surreal study image focused on a single impossible change.",
  },
  teacherFrame: {
    artworkId: "teacher-draw-frame",
    label: "Teacher Demo",
    title: "Recorded Demonstration Frame",
    artist: "FEI Teacher Media",
    imageSrc: createArtworkPanel(
      "Draw Frame",
      "#ede9e2",
      "#d7d0c5",
      "#6f8fa2",
      "Recorded making guidance, one move at a time."
    ),
    alt: "A still frame representing a recorded teacher drawing demonstration.",
  },
};

export const runtimePrototypeLesson = {
  lesson: {
    lessonId: "lfc054-surreal-worlds-prototype",
    slug: "lfc054-surreal-worlds-prototype",
    title: "Surreal Worlds",
    shortTitle: "LFC054",
    lessonFamily: "lfc",
    ageGroups: ["kids", "teen", "adult"],
    totalSteps: 3,
    badge: {
      badgeId: "creative-transformer",
      badgeName: "Creative Transformer",
      badgeCategory: "creative_thinking",
      badgeMessage: "You turned artist logic into your own image.",
    },
  },
  accessConfig: {
    accessModel: "free",
    previewScreenIds: [],
  },
  defaults: {
    ageGroup: "teen",
    currentStep: 1,
    currentScreenId: "look-see-the-strange",
    progressState: "not_started",
    reflectionState: "not_started",
    badgeState: "locked",
  },
  artworkLibrary,
  screens: [
    {
      screenId: "look-see-the-strange",
      stepNumber: 1,
      title: "See the Strange",
      partLabel: "Look",
      xpValue: 20,
      progressOnComplete: "looking",
      saveMessage: "First instinct saved",
      completionRule: {
        type: "single_choice_with_optional_chips",
        field: "responses.look.selectedArtworkId",
      },
      prompt: {
        kids: "Which image feels the most strange or dream-like?",
        teen: "Which image feels the most surreal to you first?",
        adult: "Which image disrupts ordinary reality most strongly at first glance?",
      },
      helperText: {
        kids: "Choose first. Explain later.",
        teen: "Trust the first image that shifts your sense of reality.",
        adult: "Let visual instinct lead before interpretation.",
      },
      blocks: {
        artworkSelection: {
          items: [
            {
              id: "magritte",
              label: artworkLibrary.magritte.label,
              artist: artworkLibrary.magritte.artist,
              title: artworkLibrary.magritte.title,
              imageSrc: artworkLibrary.magritte.imageSrc,
              alt: artworkLibrary.magritte.alt,
            },
            {
              id: "dali",
              label: artworkLibrary.dali.label,
              artist: artworkLibrary.dali.artist,
              title: artworkLibrary.dali.title,
              imageSrc: artworkLibrary.dali.imageSrc,
              alt: artworkLibrary.dali.alt,
            },
            {
              id: "varo",
              label: artworkLibrary.varo.label,
              artist: artworkLibrary.varo.artist,
              title: artworkLibrary.varo.title,
              imageSrc: artworkLibrary.varo.imageSrc,
              alt: artworkLibrary.varo.alt,
            },
          ],
          reactionChips: [
            { id: "wrong-scale", label: "Wrong scale" },
            { id: "wrong-place", label: "Wrong place" },
            { id: "dream-logic", label: "Dream logic" },
            { id: "hard-to-explain", label: "Hard to explain" },
          ],
        },
        recordedTeacherIntro: {
          label: "Recorded teacher note",
          line: {
            kids: "You do not need the right answer. You only need the image that catches you first.",
            teen: "Do not solve it yet. Just notice which image bends reality most strongly for you.",
            adult: "Begin with perception, not explanation. Let the image strike before you interpret it.",
          },
        },
      },
    },
    {
      screenId: "understand-why-it-works",
      stepNumber: 2,
      title: "Why It Works",
      partLabel: "Understand",
      xpValue: 25,
      progressOnComplete: "understanding",
      saveMessage: "Visual logic captured",
      completionRule: {
        type: "single_choice",
        field: "responses.understand.selectedEffectId",
      },
      prompt: {
        kids: "What feeling does this change create?",
        teen: "What effect does this impossible change create in the image?",
        adult: "What visual effect emerges when one part stays ordinary and one part breaks reality?",
      },
      helperText: {
        kids: "Look first. Then choose the effect.",
        teen: "Use the image, not a long explanation, to decide.",
        adult: "Stay with the visual logic. Choose the effect the image produces.",
      },
      blocks: {
        visualCompare: {
          mainArtwork: {
            imageSrc: artworkLibrary.study.imageSrc,
            alt: artworkLibrary.study.alt,
            artist: "René Magritte",
            title: "The studied surreal move",
          },
          compareNotes: [
            {
              label: "What stays ordinary",
              text: "The room, its edges, and the calm setting remain believable.",
            },
            {
              label: "What breaks reality",
              text: "One object changes scale beyond what ordinary life allows.",
            },
          ],
        },
        effectChoice: {
          options: [
            { id: "uncanny", label: "Uncanny" },
            { id: "funny", label: "Funny" },
            { id: "dreamlike", label: "Dreamlike" },
            { id: "tense", label: "Tense" },
          ],
        },
        microInsight: {
          label: "Visual logic",
          line: {
            kids: "When one part stays normal and one part changes too much, the picture can feel strange.",
            teen: "When most of the world stays ordinary and one part breaks reality, the image becomes uncanny.",
            adult: "A single impossible change grows more powerful when the surrounding world remains calm and believable.",
          },
        },
      },
    },
    {
      screenId: "draw-guided-making",
      stepNumber: 3,
      title: "Asynchronous Guided Making",
      partLabel: "Draw",
      xpValue: 35,
      progressOnComplete: "drawing",
      saveMessage: "Current segment saved",
      completionRule: {
        type: "min_checks",
        field: "responses.draw.completedSegmentIds",
        minRequired: 5,
      },
      prompt: {
        kids: "Watch one move, stop, do it, then continue when you are ready.",
        teen: "Recorded teacher guidance leads the move. The smart system keeps you focused between clips.",
        adult: "This is asynchronous guided making: short teacher media, pause points, system prompts, and self-paced action.",
      },
      helperText: {
        kids: "You are not alone, but you are not being rushed.",
        teen: "The teacher demonstrates. The system accompanies. You make.",
        adult: "The clip demonstrates one move. The companion prompt sharpens the action. You proceed at your own pace.",
      },
      blocks: {
        drawSegments: [
          {
            segmentId: "ordinary-anchor",
            title: "Set the Ordinary World",
            goal: "Place the ordinary subject and its stable setting first.",
            teacherMedia: {
              label: "Recorded teacher guidance",
              durationLabel: "0:48",
              imageSrc: artworkLibrary.teacherFrame.imageSrc,
              title: "Place the ordinary world",
              caption: "The teacher blocks in the normal subject and the calm setting before introducing any surreal change.",
            },
            pausePoint: {
              label: "Now it’s your turn",
              title: "Place your anchor",
              instruction: "Draw the ordinary version first. Keep it readable before making it strange.",
            },
            companionPrompt: {
              label: "Smart companion",
              type: "logic_reminder",
              text: "The surreal move works better if the normal part is clear first.",
            },
            checkpoint: {
              label: "Quick check",
              question: "Can you still recognize the subject in one glance?",
            },
          },
          {
            segmentId: "break-reality-once",
            title: "Break Reality Once",
            goal: "Introduce one impossible change and let it stay dominant.",
            teacherMedia: {
              label: "Recorded teacher guidance",
              durationLabel: "0:56",
              imageSrc: artworkLibrary.teacherFrame.imageSrc,
              title: "Add one impossible change",
              caption: "The teacher changes scale or placement in one decisive move rather than scattering surreal details everywhere.",
            },
            pausePoint: {
              label: "Now it’s your turn",
              title: "Add the impossible change",
              instruction: "Change only the part you chose. Keep the rest of the world stable.",
            },
            companionPrompt: {
              label: "Smart companion",
              type: "warning",
              text: "Do not add a second surreal move yet. One change should lead the image.",
            },
            checkpoint: {
              label: "Quick check",
              question: "Is the surreal change already visible without explanation?",
            },
          },
          {
            segmentId: "strengthen-contrast",
            title: "Strengthen the Contrast",
            goal: "Make the normal and strange read against each other clearly.",
            teacherMedia: {
              label: "Recorded teacher guidance",
              durationLabel: "0:44",
              imageSrc: artworkLibrary.teacherFrame.imageSrc,
              title: "Clarify the difference",
              caption: "The teacher strengthens the relationship between ordinary logic and impossible logic so the surreal move reads immediately.",
            },
            pausePoint: {
              label: "Now it’s your turn",
              title: "Clarify the contrast",
              instruction: "Adjust the drawing so the ordinary part and the strange part feel deliberately different.",
            },
            companionPrompt: {
              label: "Smart companion",
              type: "compare",
              text: "What still feels ordinary? What now feels impossible?",
            },
            checkpoint: {
              label: "Quick check",
              question: "Does the normal part make the strange part stronger?",
            },
          },
          {
            segmentId: "refine-main-idea",
            title: "Refine the Main Idea",
            goal: "Add only what strengthens the main surreal logic.",
            teacherMedia: {
              label: "Recorded teacher guidance",
              durationLabel: "0:51",
              imageSrc: artworkLibrary.teacherFrame.imageSrc,
              title: "Refine without overloading",
              caption: "The teacher sharpens silhouette and focal clarity while resisting unnecessary extra details.",
            },
            pausePoint: {
              label: "Now it’s your turn",
              title: "Refine carefully",
              instruction: "Add only what makes the main idea clearer.",
            },
            companionPrompt: {
              label: "Smart companion",
              type: "focus",
              text: "If a detail does not strengthen the surreal idea, leave it out.",
            },
            checkpoint: {
              label: "Quick check",
              question: "Is the main idea clearer now than before?",
            },
          },
          {
            segmentId: "step-back-stop",
            title: "Step Back and Stop",
            goal: "Check clarity, then stop before the image becomes crowded.",
            teacherMedia: {
              label: "Recorded teacher guidance",
              durationLabel: "0:35",
              imageSrc: artworkLibrary.teacherFrame.imageSrc,
              title: "Know when to stop",
              caption: "The teacher steps back, checks the image’s logic, and stops before overworking the drawing.",
            },
            pausePoint: {
              label: "Now it’s your turn",
              title: "Step back",
              instruction: "Look at the whole image once more. Then stop before it gets crowded.",
            },
            companionPrompt: {
              label: "Smart companion",
              type: "check",
              text: "Can someone feel the surreal logic without needing you to explain it?",
            },
            checkpoint: {
              label: "Quick check",
              question: "Is there still one dominant surreal move in the final image?",
            },
          },
        ],
        futureContinuity: {
          label: "Future continuity",
          aiScan: "Next in the full lesson: AI artwork scan feedback.",
          teacherReview: "Premium path: asynchronous teacher review.",
          journey: "My Journey and badge continuity will attach at Submit.",
        },
      },
    },
  ],
};

export const runtimePrototypeInitialRunState = {
  learnerId: "",
  lessonId: "lfc054-surreal-worlds-prototype",
  ageGroup: "teen",
  currentStep: 1,
  currentScreenId: "look-see-the-strange",
  progressState: "not_started",
  reflectionState: "not_started",
  badgeState: "locked",
  completedScreenIds: [],
  currentLessonXP: 0,
  isLessonComplete: false,
  responses: {
    look: {
      selectedArtworkId: "",
      reactionChipIds: [],
    },
    understand: {
      selectedEffectId: "",
    },
    draw: {
      activeSegmentIndex: 0,
      completedSegmentIds: [],
      acknowledgedCheckpointIds: [],
    },
  },
  badge: {
    badgeId: "creative-transformer",
    earned: false,
    earnedAt: "",
  },
};
