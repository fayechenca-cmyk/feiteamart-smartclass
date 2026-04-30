const createPlaceholderArtwork = (label, start, end, accent, note) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)" />
      <ellipse cx="840" cy="260" rx="240" ry="170" fill="${accent}" fill-opacity="0.16" />
      <ellipse cx="300" cy="640" rx="210" ry="160" fill="${accent}" fill-opacity="0.12" />
      <path d="M742 256C798 214 888 216 952 292C1008 360 980 468 892 516C816 555 720 530 674 462C639 412 633 332 690 281C704 268 721 261 742 256Z" fill="#f8f1e7" fill-opacity="0.88" />
      <rect x="232" y="182" width="370" height="470" rx="34" fill="#fff7ee" fill-opacity="0.82" />
      <text x="78" y="112" fill="#1f1a17" font-family="Fraunces, serif" font-size="64">${label}</text>
      <text x="78" y="170" fill="#4f4a45" font-family="Manrope, sans-serif" font-size="28">${note}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const artworkLibrary = {
  orchard: {
    artworkId: "art-runtime-a",
    title: "Orchard With Impossible Scale",
    artist: "Placeholder Surreal Reference",
    imageSrc: createPlaceholderArtwork("Orchard", "#efe7dd", "#d8cabd", "#6e8c78", "Large fruit suspended above a small field."),
    alt: "A calm orchard scene interrupted by an object at the wrong scale.",
  },
  hallway: {
    artworkId: "art-runtime-b",
    title: "Hallway With Floating Bird",
    artist: "Placeholder Surreal Reference",
    imageSrc: createPlaceholderArtwork("Hallway", "#f1ebe5", "#dfd3c7", "#8d6f6f", "A bird appears indoors where it should not belong."),
    alt: "An interior hallway with a bird placed in an impossible context.",
  },
  window: {
    artworkId: "art-runtime-c",
    title: "Window Becoming Ocean",
    artist: "Placeholder Surreal Reference",
    imageSrc: createPlaceholderArtwork("Window", "#efece7", "#d7d0cb", "#6d7fa5", "An ordinary window opens into something unreal."),
    alt: "A familiar window scene transformed into an impossible environment.",
  },
  study: {
    artworkId: "art-runtime-study",
    title: "Study Image",
    artist: "Placeholder Surreal Reference",
    imageSrc: createPlaceholderArtwork("Study", "#efe9e0", "#ddd2c4", "#a38464", "One image, one move, one clue at a time."),
    alt: "A surreal artwork suitable for hotspot analysis.",
  },
};

export const runtimePrototypeLesson = {
  lesson: {
    lessonId: "LFC054-runtime-prototype",
    slug: "lfc054-runtime-prototype",
    title: "Surreal Worlds",
    shortTitle: "LFC054 Prototype",
    lessonFamily: "lfc",
    ageGroups: ["kids", "teen", "adult"],
    totalSteps: 5,
    badge: {
      badgeId: "creative-transformer",
      badgeName: "Creative Transformer",
      badgeCategory: "creative_thinking",
      badgeMessage: "You used a surreal move to create your own visual idea.",
    },
  },
  accessConfig: {
    accessModel: "free",
    previewScreenIds: [],
  },
  defaults: {
    ageGroup: "teen",
    currentStep: 1,
    currentScreenId: "screen-1-see-the-strange",
    progressState: "not_started",
    reflectionState: "not_started",
    badgeState: "locked",
  },
  artworkLibrary,
  screens: [
    {
      screenId: "screen-1-see-the-strange",
      stepNumber: 1,
      title: "See the Strange",
      partLabel: "Look",
      xpValue: 10,
      progressOnComplete: "started",
      saveMessage: "First instinct saved",
      completionRule: {
        type: "single_choice_with_optional_chips",
        field: "responses.screen1.artworkChoiceId",
      },
      prompt: {
        kids: "Which picture feels the most strange or dream-like?",
        teen: "Which image feels the most surreal to you right away?",
        adult: "Which image disrupts ordinary reality most clearly at first glance?",
      },
      helperText: {
        kids: "Pick fast. Trust your eyes before you explain.",
        teen: "Start with instinct before analysis.",
        adult: "Let visual instinct lead before interpretation.",
      },
      blocks: {
        artworkChoice: {
          items: [
            { id: "orchard", label: "Orchard", imageSrc: artworkLibrary.orchard.imageSrc, alt: artworkLibrary.orchard.alt },
            { id: "hallway", label: "Hallway", imageSrc: artworkLibrary.hallway.imageSrc, alt: artworkLibrary.hallway.alt },
            { id: "window", label: "Window", imageSrc: artworkLibrary.window.imageSrc, alt: artworkLibrary.window.alt },
          ],
          reasonChips: [
            { id: "scale", label: "Wrong scale" },
            { id: "place", label: "Wrong place" },
            { id: "dream", label: "Dream feeling" },
            { id: "mixed", label: "Mixed realities" },
          ],
        },
        teacherPulse: {
          line: {
            kids: "You do not need the right answer. You only need the one that catches you first.",
            teen: "The first reaction matters. That is where noticing starts.",
            adult: "The lesson begins with perception, not explanation.",
          },
        },
      },
    },
    {
      screenId: "screen-2-spot-the-move",
      stepNumber: 2,
      title: "Spot the Move",
      partLabel: "Notice",
      xpValue: 15,
      progressOnComplete: "in_progress",
      saveMessage: "Surreal move identified",
      completionRule: {
        type: "single_choice",
        field: "responses.screen2.selectedMoveId",
      },
      prompt: {
        kids: "What did the artist change from normal life?",
        teen: "What visual move makes this image feel uncanny?",
        adult: "Which deliberate move pushes this image beyond realism?",
      },
      helperText: {
        kids: "Tap clues. Then choose the move.",
        teen: "Open one or two clues, then name the artist's move.",
        adult: "Reveal details, then identify the primary surreal intervention.",
      },
      blocks: {
        artworkStudy: {
          artwork: artworkLibrary.study,
          hotspots: [
            { id: "scale", x: 40, y: 30, revealText: "A familiar thing has the wrong size." },
            { id: "place", x: 70, y: 62, revealText: "The subject appears where it should not exist." },
          ],
          moveOptions: [
            { id: "changed-size", label: "Changed the size" },
            { id: "wrong-place", label: "Put it in the wrong place" },
            { id: "mixed-realities", label: "Mixed two realities" },
            { id: "transformed-object", label: "Transformed the object" },
          ],
        },
      },
    },
    {
      screenId: "screen-3-choose-your-twist",
      stepNumber: 3,
      title: "Choose Your Twist",
      partLabel: "Make",
      xpValue: 20,
      progressOnComplete: "building",
      saveMessage: "Your idea is locked in",
      completionRule: {
        type: "required_pair",
        fields: ["responses.screen3.subjectId", "responses.screen3.strategyId"],
      },
      prompt: {
        kids: "Pick one ordinary thing. Then give it one strange change.",
        teen: "Choose a normal subject, then choose one surreal twist.",
        adult: "Choose a familiar subject and apply one controlled surreal intervention.",
      },
      helperText: {
        kids: "Borrow the move, not the whole artwork.",
        teen: "Take the move. Make the idea yours.",
        adult: "Borrow the visual logic, not the image itself.",
      },
      blocks: {
        subjectOptions: {
          label: "Choose a subject",
          options: [
            { id: "face", label: "Face" },
            { id: "bird", label: "Bird" },
            { id: "house", label: "House" },
            { id: "tree", label: "Tree" },
            { id: "cup", label: "Cup" },
            { id: "clock", label: "Clock" },
          ],
        },
        strategyOptions: {
          label: "Choose a surreal move",
          options: [
            { id: "huge", label: "Make it huge" },
            { id: "tiny", label: "Make it tiny" },
            { id: "wrong-place", label: "Put it in a strange place" },
            { id: "merge", label: "Merge it with something else" },
            { id: "transform", label: "Let it become something new" },
          ],
        },
        conceptPreview: {
          prefix: "Your direction",
        },
      },
    },
    {
      screenId: "screen-4-build-the-image",
      stepNumber: 4,
      title: "Build the Image",
      partLabel: "Draw",
      xpValue: 25,
      progressOnComplete: "drawing",
      saveMessage: "Build plan saved",
      completionRule: {
        type: "min_checks",
        field: "responses.screen4.checklistIds",
        minRequired: 2,
      },
      prompt: {
        kids: "What needs to be in your drawing so the strange part feels clear?",
        teen: "What needs to stay normal so the surreal change stands out?",
        adult: "What visual structure will keep the surreal intervention readable?",
      },
      helperText: {
        kids: "Check the parts you want to remember while you draw.",
        teen: "Choose the anchors that will keep the image legible.",
        adult: "Select the stabilizing elements that give the surreal move force.",
      },
      blocks: {
        buildChecklist: {
          items: [
            { id: "clear-subject", label: "Make the main subject easy to recognize" },
            { id: "single-move", label: "Keep one surreal move dominant" },
            { id: "normal-anchor", label: "Leave part of the world normal" },
            { id: "strong-silhouette", label: "Use a clear silhouette" },
          ],
        },
        teacherPulse: {
          line: {
            kids: "The strange part works better when some things stay normal.",
            teen: "Surreal images are strongest when one move leads and the rest supports it.",
            adult: "Restraint increases force. Preserve enough normality to sharpen the rupture.",
          },
        },
      },
    },
    {
      screenId: "screen-5-reflect-and-keep",
      stepNumber: 5,
      title: "Reflect and Keep",
      partLabel: "Keep",
      xpValue: 30,
      progressOnComplete: "completed",
      saveMessage: "Saved to My Journey",
      completionRule: {
        type: "reflection_submit",
        chipField: "responses.screen5.reflectionChipIds",
        textField: "responses.screen5.reflectionText",
      },
      prompt: {
        kids: "What kind of strange feeling did your picture end up with?",
        teen: "What happened to your idea once you made it your own?",
        adult: "What changed when the borrowed move became your image?",
      },
      helperText: {
        kids: "Choose a feeling, then add one sentence.",
        teen: "Choose one lens, then leave a short trace in your journey.",
        adult: "Mark the shift between influence and authorship.",
      },
      blocks: {
        reflection: {
          chips: [
            { id: "dreamy", label: "Dreamy" },
            { id: "funny", label: "Funny" },
            { id: "unsettling", label: "Unsettling" },
            { id: "quiet", label: "Quiet" },
          ],
          responseField: {
            placeholder: {
              kids: "Mine felt strange because…",
              teen: "My image changed when…",
              adult: "The move became mine when…",
            },
            maxLength: 180,
          },
        },
        completion: {
          title: "Prototype badge unlocked",
          message: "This prototype saves the visual decision, not just the answer. That is the direction for the larger LFC system.",
          journeySaveMessage: "Future-ready: this reflection can connect to My Journey, badges, and shared learner history.",
          badge: {
            badgeName: "Creative Transformer",
          },
        },
      },
    },
  ],
};

export const runtimePrototypeInitialRunState = {
  learnerId: "",
  lessonId: "LFC054-runtime-prototype",
  ageGroup: "teen",
  currentStep: 1,
  currentScreenId: "screen-1-see-the-strange",
  progressState: "not_started",
  reflectionState: "not_started",
  badgeState: "locked",
  completedScreenIds: [],
  currentLessonXP: 0,
  isLessonComplete: false,
  responses: {
    screen1: {
      artworkChoiceId: "",
      reasonChipIds: [],
    },
    screen2: {
      hotspotIdsViewed: [],
      selectedMoveId: "",
    },
    screen3: {
      subjectId: "",
      strategyId: "",
      conceptPreview: "",
    },
    screen4: {
      checklistIds: [],
    },
    screen5: {
      reflectionChipIds: [],
      reflectionText: "",
      completedAt: "",
    },
  },
  badge: {
    badgeId: "creative-transformer",
    earned: false,
    earnedAt: "",
  },
};
