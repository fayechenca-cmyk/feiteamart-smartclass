export const lfc054PromptPackDraft = {
  promptPackId: "lfc054-surreal-worlds",
  version: 1,
  status: "draft",
  note:
    "Draft prompt pack for system-connected LFC054 lesson flow. Designed to sit above the existing gallery-native docent/curator chat and the existing Thinking Quest structure.",

  aiModes: {
    lfc_guide: {
      label: "LFC Guide",
      intent:
        "Help the learner understand what surrealism is through direct, visual, artwork-led guidance.",
      systemInstruction: {
        kids:
          "You are a calm and friendly art guide for a child. Use simple language. Focus on what changed in the picture and what still feels normal. Keep answers short, visual, and encouraging.",
        teen:
          "You are an artwork-led LFC guide. Help the learner notice how surrealism changes reality. Focus on scale, placement, dream logic, and visual effect. Keep answers clear, visual, and concise.",
        adult:
          "You are an editorial LFC guide. Help the learner understand how surrealism alters reality through visual structure, contrast, and image logic. Stay grounded in what can be seen.",
      },
      starterPrompts: [
        "Why does this image feel surreal?",
        "What stayed normal here?",
        "What changed the logic of reality?",
      ],
    },

    surreal_logic_helper: {
      label: "Surreal Logic Helper",
      intent:
        "Help the learner identify the visual mechanism that makes an artwork or idea feel surreal.",
      systemInstruction: {
        kids:
          "You help a young learner name the strange move in a picture. Talk about big and small, bendy and stiff, floating and grounded, right place and wrong place.",
        teen:
          "You help the learner identify the surreal move in an image. Focus on one change at a time and explain its visual effect without turning the answer into a long lecture.",
        adult:
          "You help the learner identify the specific visual decision that creates the surreal effect. Focus on one altered rule of reality and its impact on tone, tension, and meaning.",
      },
      starterPrompts: [
        "What kind of surreal move is this?",
        "Is this more about scale or placement?",
        "Which change creates the strongest effect?",
      ],
    },

    idea_builder: {
      label: "Idea Builder",
      intent:
        "Help the learner move from a real scene into one clear surreal concept.",
      systemInstruction: {
        kids:
          "You help a young learner choose one fun and clear strange change for a normal scene. Keep the advice simple. One strong idea is enough.",
        teen:
          "You help the learner build one strong surreal image idea from a believable real scene. Encourage one clear change instead of many weak ones.",
        adult:
          "You help the learner build a surreal concept from a real situation plus one deliberate visual disruption. Keep the concept focused and image-based.",
      },
      starterPrompts: [
        "Is this idea clear enough?",
        "Which surreal move fits this scene?",
        "How do I keep the real world believable?",
      ],
    },

    making_companion: {
      label: "Making Companion",
      intent:
        "Support the learner during the drawing process without replacing the teacher's recorded guidance.",
      systemInstruction: {
        kids:
          "You are a gentle drawing companion. Help the learner keep the real scene clear and the strange part easy to notice. Use short, practical advice.",
        teen:
          "You are a drawing companion inside a surrealism lesson. Help the learner check whether the real scene still holds together and whether the surreal move reads clearly.",
        adult:
          "You are a restrained making companion. Help the learner strengthen image clarity, spatial logic, and surreal effect without overwhelming the drawing with extra ideas.",
      },
      starterPrompts: [
        "Does my sketch still feel clear?",
        "Is the strange part strong enough?",
        "Does this still belong to the same space?",
      ],
    },

    final_reflection_helper: {
      label: "Final Reflection Helper",
      intent:
        "Help the learner summarize what they changed and what effect they created.",
      systemInstruction: {
        kids:
          "You help a young learner say what changed in their picture and how it feels. Keep the language simple and positive.",
        teen:
          "You help the learner summarize the surreal move they used, the feeling they aimed for, and what became stronger from sketch to final.",
        adult:
          "You help the learner reflect on how one altered rule of reality shaped the final image, mood, and viewer response.",
      },
      starterPrompts: [
        "Help me describe my surreal change.",
        "What is working best in this image?",
        "How can I summarize my idea for My Journey?",
      ],
    },
  },

  artchiModes: {
    look: {
      tone: "quiet, observant, lightly curious",
      lines: {
        kids: [
          "Look for the part that feels a little impossible.",
          "One strange thing is enough to begin.",
          "Which picture catches you first?",
        ],
        teen: [
          "Start with what your eye notices first.",
          "Look for the part that bends reality without warning.",
          "Do not solve it yet. Notice the shift first.",
        ],
        adult: [
          "Let the image strike before you explain it.",
          "The surreal often begins where one rule quietly changes.",
          "Stay with what the eye knows before the mind interprets.",
        ],
      },
    },

    think: {
      tone: "clear, companion-like, gently analytical",
      lines: {
        kids: [
          "Is it too big, too bendy, or in the wrong place?",
          "What stayed normal around the strange part?",
          "Choose the change you can feel most clearly.",
        ],
        teen: [
          "Try naming the exact move before naming the meaning.",
          "One altered rule often makes the whole image work.",
          "Which part changes the mood most strongly?",
        ],
        adult: [
          "Stay with the visual decision before widening into interpretation.",
          "A surreal image often keeps most of reality intact and changes one governing rule.",
          "Ask what kind of logic the image replaces ordinary life with.",
        ],
      },
    },

    make: {
      tone: "steady, supportive, practical",
      lines: {
        kids: [
          "Keep your real scene easy to recognize first.",
          "Now let one thing become strange.",
          "The picture does not need many tricks. One strong one works.",
        ],
        teen: [
          "Let the real world hold the strange thing.",
          "One clear move is stronger than many scattered ones.",
          "Keep the drawing light while the idea gets stronger.",
        ],
        adult: [
          "Preserve enough reality for the disruption to matter.",
          "The image gains force when the strange element is precise.",
          "Use color to support mood, not to distract from structure.",
        ],
      },
    },

    reflect: {
      tone: "warm, concise, lightly proud",
      lines: {
        kids: [
          "What changed in your world?",
          "How does your picture feel now?",
          "You made the ordinary turn strange.",
        ],
        teen: [
          "What rule of reality did you change?",
          "What became stronger from sketch to final?",
          "You turned one clear shift into an image world.",
        ],
        adult: [
          "Name the altered rule and the effect it created.",
          "What remained believable, and why did that matter?",
          "Your final image now has its own internal logic.",
        ],
      },
    },
  },

  thinkingQuestAdapters: {
    level1_observation: {
      description:
        "Surrealism-specific adapter for existing Thinking Quest Level 1.",
      prompts: {
        teen: {
          question: "What breaks reality first in this image?",
          choices: [
            "Scale feels wrong",
            "Placement feels impossible",
            "The space feels dreamlike",
            "The object behaves strangely",
            "The mood changes reality first",
          ],
          followUp: "What still feels normal around that change?",
        },
        adult: {
          question: "What is the first altered rule of reality you notice here?",
          choices: [
            "Scale",
            "Spatial logic",
            "Material behavior",
            "Object placement",
            "Dreamlike mood structure",
          ],
          followUp: "Which ordinary element makes the disruption more convincing?",
        },
        pro: {
          question: "Which formal disruption most clearly reorganizes reality in this work?",
          choices: [
            "Scale hierarchy",
            "Spatial contradiction",
            "Material instability",
            "Narrative dislocation",
            "Psychological atmosphere",
          ],
          followUp: "What constraint keeps the image from collapsing into randomness?",
        },
      },
    },

    level2_choice_change: {
      description:
        "Surrealism-specific adapter for existing Thinking Quest Level 2.",
      prompts: {
        teen: {
          question: "If you could strengthen one surreal change, what would you change?",
          choices: [
            "Make something larger or smaller",
            "Bend or soften one object",
            "Move one thing to the wrong place",
            "Make one thing float",
            "Mix two worlds together",
          ],
          followUp: "What would that change do to the feeling of the image?",
        },
        adult: {
          question: "Which single intervention would most intensify the surreal logic of the image?",
          choices: [
            "Scale disruption",
            "Spatial misplacement",
            "Material distortion",
            "Gravity shift",
            "Dream-logic combination",
          ],
          followUp: "Would that primarily change mood, tension, or interpretation?",
        },
        pro: {
          question: "Which intervention would most productively reframe the work's surreal structure?",
          choices: [
            "Scale system",
            "Spatial syntax",
            "Object ontology",
            "Perceptual instability",
            "Conceptual contradiction",
          ],
          followUp: "How would that alter the discourse-level reading of the image?",
        },
      },
    },

    light_kids_compare: {
      description:
        "Lightweight kids-friendly compare prompt that avoids the full Quest overlay.",
      prompts: {
        kids: {
          question: "Which one feels the strangest?",
          choices: [
            "The one with the too-big thing",
            "The one with the bendy thing",
            "The one with the floating thing",
            "The one with the wrong-place thing",
          ],
          followUp: "What changed first?",
        },
      },
    },
  },

  drawPrompts: {
    segment1_real_scene: {
      label: "Sketch the real scene",
      checkpoints: {
        kids: "I can tell what the normal place is.",
        teen: "The real scene is clear before the strange change enters.",
        adult: "The ordinary structure is established and readable.",
      },
      companionLines: [
        "Keep the lines light.",
        "Make the normal world believable first.",
        "Do not chase details too early.",
      ],
    },

    segment2_entry_point: {
      label: "Choose where the surreal change enters",
      checkpoints: {
        kids: "I know where the strange thing will happen.",
        teen: "I picked one place for the surreal move to enter.",
        adult: "The disruption has one clear point of entry.",
      },
      companionLines: [
        "One strong change is enough.",
        "Choose the place the eye should notice first.",
        "Keep the rest of the world calm around it.",
      ],
    },

    segment3_draw_the_move: {
      label: "Draw the strange move",
      checkpoints: {
        kids: "The strange thing is easy to spot.",
        teen: "The surreal move reads clearly in the image.",
        adult: "The disruption is specific enough to carry the image.",
      },
      companionLines: [
        "Let the strange move be visible.",
        "Keep part of the object recognizable.",
        "Push the change clearly, not halfway.",
      ],
    },

    segment4_connect_space: {
      label: "Connect the real and the strange",
      checkpoints: {
        kids: "The strange part still belongs in the picture.",
        teen: "The real space and the surreal change now feel connected.",
        adult: "The image now holds its disruption inside one visual world.",
      },
      companionLines: [
        "Let the room react to the strange thing.",
        "Think about contact, edge, and direction.",
        "The impossible still needs a place to live.",
      ],
    },

    segment5_color_mood: {
      label: "Color the mood",
      checkpoints: {
        kids: "My colors help the feeling.",
        teen: "The color supports the surreal mood.",
        adult: "The palette strengthens mood without weakening structure.",
      },
      companionLines: [
        "Use color to support feeling.",
        "Quiet colors can still feel surreal.",
        "Do not decorate randomly.",
      ],
    },

    segment6_final_push: {
      label: "Final push and stop",
      checkpoints: {
        kids: "I can see what changed in my world.",
        teen: "The real scene, surreal move, and mood all read together.",
        adult: "The image now sustains its altered logic without overworking the surface.",
      },
      companionLines: [
        "Strengthen what already works.",
        "Do not fix everything.",
        "Stop when the idea is clear.",
      ],
    },
  },
};
