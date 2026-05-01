export const lfc054LessonDataDraft = {
  lessonMeta: {
    lessonId: "lfc054-surreal-worlds",
    courseId: "lfc-classics-creation-skills",
    familyId: "lfc",
    title: "Illustration Through Surrealism",
    shortTitle: "Illustration Through Surrealism",
    sequenceNumber: 54,
    slug: "surreal-worlds",
    status: "draft",
    visibility: "members",
    estimatedDurationMin: 55,
    xpTotal: 100,
    subtitle: "Use surrealism to turn a real scene into an illustration.",
    description:
      "An artwork-led lesson that teaches learners how to use surrealist visual logic to build an illustration through guided colored-pencil making.",
    tags: ["surrealism", "lfc", "creation", "critical-thinking", "colored-pencil"],
    badgeId: "lfc054-surreal-worlds",
    nextLessonId: null,
  },

  accessConfig: {
    accessModel: "preview_then_member",
    previewScreenIds: ["welcome", "what-is-surrealism", "meet-the-artists"],
    memberGate: {
      gateAfterScreenId: "meet-the-artists",
      gateMessage: "Continue the full lesson inside FEI TeamArt Smart Class.",
    },
  },

  learnerModes: {
    ageGroups: ["kids", "teen", "adult"],
    defaultAgeGroup: "teen",
    voiceEnabled: false,
    uploadEnabled: true,
    journeyEnabled: true,
    variants: {
      kids: {
        criticalThinking: "light",
        artworkPool: "kids",
        aiTone: "gentle_playful",
      },
      teen: {
        criticalThinking: "full",
        artworkPool: "teen",
        aiTone: "guided_clear",
      },
      adult: {
        criticalThinking: "full",
        artworkPool: "adult",
        aiTone: "editorial_reflective",
      },
    },
  },

  screenFlow: {
    screens: [
      {
        screenId: "welcome",
        type: "welcome_reflection",
        title: "Illustration Through Surrealism",
        partLabel: "Part A",
        xpValue: 0,
        completionRule: { mode: "viewed" },
        content: {
          hero: {
            eyebrow: "LFC054",
            title: "Illustration Through Surrealism",
            subtitle: "Use surrealism to change one rule inside a real scene.",
            body: "This lesson begins by looking closely, then builds toward your own surreal illustration with colored pencils.",
            primaryAction: "Begin lesson",
            secondaryAction: "See materials",
          },
        },
        systemHooks: {
          artworkSource: null,
          aiMode: null,
          thinkingQuest: null,
          uploadPoint: null,
          teacherHelp: null,
          journeyWriteback: ["lesson_opened"],
        },
      },
      {
        screenId: "what-is-surrealism",
        type: "reference",
        title: "What Is Surrealism?",
        partLabel: "Part A",
        xpValue: 8,
        completionRule: {
          mode: "made_choice",
          requiredKeys: ["selectedArtworkId"],
        },
        content: {
          hero: {
            eyebrow: "Enter Surrealism",
            title: "What Is Surrealism?",
            body: "A surreal image often begins in the real world, then changes one rule so the whole picture starts to feel strange.",
          },
          artwork_compare: {
            poolBinding: "what-is-surrealism",
            interactionLabel: "Which image feels least like ordinary reality?",
          },
          hotspot_annotation: {
            prompts: [
              "What stayed normal?",
              "What changed first?",
            ],
          },
        },
        ageVariants: {
          kids: {
            artworkPool: "kids",
            promptTone: "light",
            thinkingQuest: "light_kids_compare",
          },
          teen: {
            artworkPool: "teen",
            promptTone: "clear",
            thinkingQuest: "level1_observation",
          },
          adult: {
            artworkPool: "adult",
            promptTone: "editorial",
            thinkingQuest: "level1_observation",
          },
        },
        systemHooks: {
          artworkSource: "subset_intro",
          aiMode: "lfc_guide",
          thinkingQuest: "age_variant",
          uploadPoint: null,
          teacherHelp: null,
          journeyWriteback: ["surrealism_intro_completed", "first_observation_choice_saved"],
        },
      },
      {
        screenId: "meet-the-artists",
        type: "lfc_embed",
        title: "Meet the Artists",
        partLabel: "Part A",
        xpValue: 10,
        completionRule: {
          mode: "completed_interaction",
          requiredKeys: ["selectedArtistCardId"],
        },
        content: {
          hero: {
            eyebrow: "Artist Logic",
            title: "Meet the Artists",
            body: "Artists make surreal images through deliberate visual choices. Look for the exact move each artist makes.",
          },
          artwork_carousel: {
            poolBinding: "meet-the-artists",
            interactionLabel: "Slide through artists and compare the kind of strangeness each one creates.",
          },
          hotspot_annotation: {
            prompts: [
              "What rule of reality changed here?",
              "Is the effect about scale, placement, mood, or dream logic?",
            ],
          },
        },
        ageVariants: {
          kids: {
            artworkPool: "kids",
            promptTone: "light",
            thinkingQuest: null,
          },
          teen: {
            artworkPool: "teen",
            promptTone: "clear",
            thinkingQuest: "level1_observation",
          },
          adult: {
            artworkPool: "adult",
            promptTone: "editorial",
            thinkingQuest: "level1_observation",
          },
        },
        systemHooks: {
          artworkSource: "subset_artist_compare",
          aiMode: "surreal_logic_helper",
          thinkingQuest: "age_variant",
          uploadPoint: null,
          teacherHelp: null,
          journeyWriteback: ["artist_reference_selected", "artist_compare_completed"],
        },
      },
      {
        screenId: "how-surreal-enters-an-image",
        type: "quest_reflection",
        title: "How Surreal Enters an Image",
        partLabel: "Part A",
        xpValue: 10,
        completionRule: {
          mode: "completed_interaction",
          requiredKeys: ["selectedMoveId"],
        },
        content: {
          hero: {
            eyebrow: "See the Shift",
            title: "How Surreal Enters an Image",
            body: "Surreal images can change scale, bend an object, make something float, move something into the wrong place, or combine two worlds.",
          },
          move_cards: {
            moveIds: ["scale_shift", "bending", "floating", "wrong_place", "dream_combination"],
          },
          drag_playground: {
            modes: ["scale_shift", "bending", "floating", "wrong_place"],
          },
        },
        ageVariants: {
          kids: {
            artworkPool: "kids",
            promptTone: "light",
            thinkingQuest: "light_kids_compare",
          },
          teen: {
            artworkPool: "teen",
            promptTone: "clear",
            thinkingQuest: "level2_choice_change",
          },
          adult: {
            artworkPool: "adult",
            promptTone: "editorial",
            thinkingQuest: "level2_choice_change",
          },
        },
        systemHooks: {
          artworkSource: "subset_move_examples",
          aiMode: "surreal_logic_helper",
          thinkingQuest: "age_variant",
          uploadPoint: null,
          teacherHelp: null,
          journeyWriteback: ["surreal_move_explored", "move_selected"],
        },
      },
      {
        screenId: "pick-your-real-scene",
        type: "guided_practice",
        title: "Pick Your Real Scene",
        partLabel: "Part B",
        xpValue: 6,
        completionRule: {
          mode: "made_choice",
          requiredKeys: ["selectedSceneId"],
        },
        content: {
          hero: {
            eyebrow: "Build Your Idea",
            title: "Pick Your Real Scene",
            body: "Start with a normal world first. The surreal change will feel stronger when the base scene is believable.",
          },
          choice_grid: {
            field: "selectedSceneId",
            options: ["room", "desk", "window", "outdoor-corner", "table-scene"],
          },
          reflection_prompt: {
            field: "selectedMoodId",
            prompt: "What feeling do you want this scene to carry?",
          },
        },
        systemHooks: {
          artworkSource: null,
          aiMode: "idea_builder",
          thinkingQuest: null,
          uploadPoint: null,
          teacherHelp: null,
          journeyWriteback: ["base_scene_selected", "mood_selected"],
        },
      },
      {
        screenId: "add-the-strange",
        type: "guided_practice",
        title: "Add the Strange",
        partLabel: "Part B",
        xpValue: 8,
        completionRule: {
          mode: "completed_interaction",
          requiredKeys: ["selectedMoveId", "selectedStorySeedId"],
        },
        content: {
          hero: {
            eyebrow: "Build Your Idea",
            title: "Add the Strange",
            body: "Choose one strong surreal change. A clear move is stronger than many weak ones.",
          },
          choice_grid: {
            fields: ["selectedMoveId", "selectedStorySeedId"],
          },
          reflection_prompt: {
            field: "conceptSentence",
            prompt: "Turn your scene and strange move into one clear image sentence.",
          },
        },
        systemHooks: {
          artworkSource: "selected_reference_recap",
          aiMode: "idea_builder",
          thinkingQuest: null,
          uploadPoint: null,
          teacherHelp: null,
          journeyWriteback: ["surreal_move_selected", "story_seed_selected", "concept_sentence_created"],
        },
      },
      {
        screenId: "prepare-materials",
        type: "ready_check",
        title: "Prepare Materials",
        partLabel: "Part B",
        xpValue: 3,
        completionRule: {
          mode: "completed_interaction",
          requiredKeys: ["materialsReady"],
        },
        content: {
          material_checklist: {
            items: [
              "colored-pencils",
              "sketch-paper",
              "no-eraser-needed",
            ],
          },
        },
        systemHooks: {
          artworkSource: null,
          aiMode: null,
          thinkingQuest: null,
          uploadPoint: null,
          teacherHelp: null,
          journeyWriteback: ["materials_ready_confirmed"],
        },
      },
      {
        screenId: "draw-sketch-real-scene",
        type: "demo",
        title: "Sketch the Real Scene",
        partLabel: "Part C",
        xpValue: 10,
        completionRule: {
          mode: "completed_video_checkpoint",
          requiredKeys: ["segment1Complete"],
        },
        content: {
          video_segment: {
            segmentId: "segment1_real_scene",
            checkpointField: "segment1Complete",
          },
          checkpoint: {
            field: "segment1Complete",
            uploadField: "sketchUploadUsed",
          },
        },
        systemHooks: {
          artworkSource: "selected_reference_recap",
          aiMode: "making_companion",
          thinkingQuest: null,
          uploadPoint: "sketch_upload",
          teacherHelp: "premium_only",
          journeyWriteback: ["draw_segment_1_complete", "sketch_upload_if_used"],
        },
      },
      {
        screenId: "draw-place-the-change",
        type: "demo",
        title: "Choose Where the Change Enters",
        partLabel: "Part C",
        xpValue: 8,
        completionRule: {
          mode: "completed_video_checkpoint",
          requiredKeys: ["segment2Complete"],
        },
        content: {
          video_segment: {
            segmentId: "segment2_entry_point",
            checkpointField: "segment2Complete",
          },
          checkpoint: {
            field: "selectedEntryPointId",
          },
        },
        systemHooks: {
          artworkSource: "selected_reference_recap",
          aiMode: "making_companion",
          thinkingQuest: null,
          uploadPoint: "midpoint_upload",
          teacherHelp: "premium_only",
          journeyWriteback: ["draw_segment_2_complete", "surreal_entry_point_selected"],
        },
      },
      {
        screenId: "draw-make-the-strange-visible",
        type: "guided_practice",
        title: "Draw the Strange Move",
        partLabel: "Part C",
        xpValue: 10,
        completionRule: {
          mode: "completed_video_checkpoint",
          requiredKeys: ["segment3Complete"],
        },
        content: {
          video_segment: {
            segmentId: "segment3_draw_the_move",
            checkpointField: "segment3Complete",
          },
          checkpoint: {
            field: "segment3Complete",
          },
        },
        systemHooks: {
          artworkSource: "selected_reference_recap",
          aiMode: "making_companion",
          thinkingQuest: null,
          uploadPoint: "midpoint_upload",
          teacherHelp: "premium_only",
          journeyWriteback: ["draw_segment_3_complete"],
        },
      },
      {
        screenId: "draw-connect-real-and-strange",
        type: "guided_practice",
        title: "Connect the Real and the Strange",
        partLabel: "Part C",
        xpValue: 8,
        completionRule: {
          mode: "completed_video_checkpoint",
          requiredKeys: ["segment4Complete"],
        },
        content: {
          video_segment: {
            segmentId: "segment4_connect_space",
            checkpointField: "segment4Complete",
          },
          checkpoint: {
            field: "segment4Complete",
          },
        },
        ageVariants: {
          kids: {
            thinkingQuest: null,
          },
          teen: {
            thinkingQuest: "level2_choice_change",
          },
          adult: {
            thinkingQuest: "level2_choice_change",
          },
        },
        systemHooks: {
          artworkSource: "selected_reference_recap",
          aiMode: "making_companion",
          thinkingQuest: "age_variant_optional",
          uploadPoint: "midpoint_upload",
          teacherHelp: "premium_only",
          journeyWriteback: ["draw_segment_4_complete", "space_logic_checkpoint_complete"],
        },
      },
      {
        screenId: "draw-color-the-mood",
        type: "guided_practice",
        title: "Color With Colored Pencils",
        partLabel: "Part C",
        xpValue: 8,
        completionRule: {
          mode: "completed_video_checkpoint",
          requiredKeys: ["segment5Complete"],
        },
        content: {
          video_segment: {
            segmentId: "segment5_color_mood",
            checkpointField: "segment5Complete",
          },
          reflection_prompt: {
            field: "selectedColorMoodId",
            prompt: "What color mood supports your surreal idea best?",
          },
        },
        systemHooks: {
          artworkSource: "selected_reference_recap",
          aiMode: "making_companion",
          thinkingQuest: null,
          uploadPoint: "midpoint_upload",
          teacherHelp: "premium_only",
          journeyWriteback: ["draw_segment_5_complete", "color_mood_selected"],
        },
      },
      {
        screenId: "draw-final-push",
        type: "guided_practice",
        title: "Final Push and Stop",
        partLabel: "Part C",
        xpValue: 8,
        completionRule: {
          mode: "completed_video_checkpoint",
          requiredKeys: ["segment6Complete"],
        },
        content: {
          video_segment: {
            segmentId: "segment6_final_push",
            checkpointField: "segment6Complete",
          },
          checkpoint: {
            field: "segment6Complete",
            uploadField: "finalUploadUsed",
          },
        },
        systemHooks: {
          artworkSource: null,
          aiMode: "final_reflection_helper",
          thinkingQuest: null,
          uploadPoint: "final_upload",
          teacherHelp: "premium_only",
          journeyWriteback: ["draw_segment_6_complete", "final_draw_checkpoint_complete", "final_upload_if_used"],
        },
      },
      {
        screenId: "reflection-and-journey",
        type: "submit_reflection",
        title: "Reflection and Journey",
        partLabel: "Part D",
        xpValue: 6,
        completionRule: {
          mode: "saved_reflection",
          requiredKeys: ["finalReflection"],
        },
        content: {
          reflection_prompt: {
            field: "finalReflection",
            prompts: [
              "What rule of reality did you change?",
              "What feeling were you trying to create?",
              "What changed from sketch to final image?",
            ],
          },
          journey_summary: {
            source: "my_journey",
          },
        },
        systemHooks: {
          artworkSource: "selected_reference_recap",
          aiMode: "final_reflection_helper",
          thinkingQuest: null,
          uploadPoint: null,
          teacherHelp: null,
          journeyWriteback: ["reflection_saved", "journey_summary_requested"],
        },
      },
      {
        screenId: "continue-your-path",
        type: "submit_next",
        title: "Continue Your Path",
        partLabel: "Part D",
        xpValue: 5,
        completionRule: {
          mode: "submitted_or_skipped",
        },
        content: {
          continuation_panel: {
            showJourney: true,
            showPremium: true,
            showRecommendedCourses: true,
          },
        },
        systemHooks: {
          artworkSource: null,
          aiMode: null,
          thinkingQuest: null,
          uploadPoint: null,
          teacherHelp: "premium_only",
          journeyWriteback: ["lesson_completed", "continuation_choice_if_any"],
        },
      },
    ],
  },

  completionConfig: {
    completionScreenId: "continue-your-path",
    badgeAwardMode: "claim_gate",
    lessonCompletionEventKey: "lfc054_completed",
    journeyMilestoneText: "Completed Illustration Through Surrealism",
    teaserNextLessonId: null,
    teaserText: "Keep building your image world through the next LFC lesson.",
  },

  portalConfig: {
    journeyCategory: "lfc-creation",
    showInMyJourney: true,
    portfolioEligible: true,
    reviewEligible: true,
    recommendationWeight: "high",
    relatedLessonIds: [],
  },

  integrations: {
    artworkSubsetId: "lfc054-surreal-worlds",
    thinkingQuestChapterId: "chapter-1",
    aiPromptPackId: "lfc054-surreal-worlds",
    journeyWritebackKey: "lfc054_surreal_worlds",
    premiumServices: ["service-mentor", "service-curator"],
    recommendedCourseTags: ["technique", "theory"],
  },
};
