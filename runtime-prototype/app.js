import { bootstrapApp } from "../core/app.js";
import {
  runtimePrototypeInitialRunState,
  runtimePrototypeLesson,
} from "./data/lfc054-runtime-lesson.js";

const appRoot = document.querySelector("[data-app]");

const analytics = {
  track(eventName, payload = {}) {
    console.info("[lfc054-surreal-worlds]", eventName, payload);
  },
};

function button(label, options = {}) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.className = options.className ?? "";
  if (options.disabled) {
    btn.disabled = true;
  }
  if (options.onClick) {
    btn.addEventListener("click", options.onClick);
  }
  return btn;
}

function pickAssistantMode(screen) {
  if (screen.stepNumber === 3) {
    return {
      label: "Smart companion",
      note: "Artchi stays with the making process quietly. Recorded teacher guidance leads the move, and the lesson keeps the next check simple.",
    };
  }

  return {
    label: "LFC guide",
    note: "Artchi helps you look more carefully. The lesson teaches through artworks, artist choices, and visual logic before making begins.",
  };
}

function stateSummary(state) {
  return [
    `Tier: guest`,
    `Age: ${state.ageGroup}`,
    `Progress: ${state.progressState}`,
    `Badge: ${state.badgeState}`,
  ].join(" • ");
}

function getProgressPercent(lessonMeta, screen) {
  return Math.round((screen.stepNumber / lessonMeta.totalSteps) * 100);
}

function createProgressSteps(lessonMeta, state) {
  const wrap = document.createElement("div");
  wrap.className = "progress-steps";

  lessonMeta.screens.forEach((screen) => {
    const step = document.createElement("div");
    step.className = `progress-step${state.currentScreenId === screen.screenId ? " is-active" : ""}${
      state.completedScreenIds.includes(screen.screenId) ? " is-done" : ""
    }`;

    const title = document.createElement("strong");
    title.textContent = screen.partLabel;

    const label = document.createElement("span");
    label.textContent = screen.title;

    step.append(title, label);
    wrap.append(step);
  });

  return wrap;
}

function createArtworkGrid(items, selectedId, onSelect) {
  const grid = document.createElement("div");
  grid.className = "art-grid";

  items.forEach((item) => {
    const card = button("", {
      className: `art-card${selectedId === item.id ? " is-active" : ""}`,
      onClick: () => onSelect(item.id),
    });
    card.setAttribute("aria-pressed", String(selectedId === item.id));

    const image = document.createElement("img");
    image.src = item.imageSrc;
    image.alt = item.alt;

    const copy = document.createElement("div");
    copy.className = "art-card-copy";

    const kicker = document.createElement("p");
    kicker.className = "art-card-kicker";
    kicker.textContent = item.artist;

    const title = document.createElement("p");
    title.className = "art-card-title";
    title.textContent = item.title;

    const label = document.createElement("p");
    label.className = "art-card-meta";
    label.textContent = item.alt;

    copy.append(kicker, title, label);
    card.append(image, copy);
    grid.append(card);
  });

  return grid;
}

function createChipRow(items, selectedValues, onToggle) {
  const row = document.createElement("div");
  row.className = "chip-row";

  items.forEach((item) => {
    const chip = button(item.label, {
      className: `chip-button${selectedValues.includes(item.id) ? " is-active" : ""}`,
      onClick: () => onToggle(item.id),
    });
    chip.setAttribute("aria-pressed", String(selectedValues.includes(item.id)));
    row.append(chip);
  });

  return row;
}

function createEffectRow(items, selectedId, onSelect) {
  const row = document.createElement("div");
  row.className = "effect-row";

  items.forEach((item) => {
    const effect = button(item.label, {
      className: `effect-button${selectedId === item.id ? " is-active" : ""}`,
      onClick: () => onSelect(item.id),
    });
    effect.setAttribute("aria-pressed", String(selectedId === item.id));
    row.append(effect);
  });

  return row;
}

function createDrawSegmentNodes(segments, state) {
  const wrap = document.createElement("div");
  wrap.className = "segment-nodes";

  segments.forEach((segment, index) => {
    const node = document.createElement("div");
    const isActive = state.responses.draw.activeSegmentIndex === index;
    const isComplete = state.responses.draw.completedSegmentIds.includes(segment.segmentId);
    node.className = `segment-node${isActive ? " is-active" : ""}${isComplete ? " is-complete" : ""}`;

    const title = document.createElement("strong");
    title.textContent = `${index + 1}`;

    const label = document.createElement("span");
    label.textContent = segment.title;

    node.append(title, label);
    wrap.append(node);
  });

  return wrap;
}

function renderLookStage({ lessonApp, screen, state, resolveAgeVariant }) {
  const wrap = document.createElement("div");
  wrap.className = "stage-layout";

  wrap.append(
    createArtworkGrid(
      screen.blocks.artworkSelection.items,
      state.responses.look.selectedArtworkId,
      (selectedArtworkId) => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          draft.responses.look.selectedArtworkId = selectedArtworkId;
          draft.progressState = screen.progressOnComplete;
          return draft;
        });
      },
    ),
  );

  wrap.append(
    createChipRow(
      screen.blocks.artworkSelection.reactionChips,
      state.responses.look.reactionChipIds,
      (chipId) => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          const selected = draft.responses.look.reactionChipIds;
          draft.responses.look.reactionChipIds = selected.includes(chipId)
            ? selected.filter((item) => item !== chipId)
            : [...selected, chipId];
          return draft;
        });
      },
    ),
  );

  const note = document.createElement("div");
  note.className = "teacher-note";
  note.innerHTML = `
    <p class="micro-kicker">${screen.blocks.recordedTeacherIntro.label}</p>
    <p>${resolveAgeVariant(screen.blocks.recordedTeacherIntro.line, state.ageGroup)}</p>
  `;
  wrap.append(note);

  return wrap;
}

function renderUnderstandStage({ lessonApp, screen, state, resolveAgeVariant }) {
  const layout = document.createElement("div");
  layout.className = "understand-layout";

  const compare = document.createElement("div");
  compare.className = "compare-card";

  const image = document.createElement("img");
  image.className = "compare-image";
  image.src = screen.blocks.visualCompare.mainArtwork.imageSrc;
  image.alt = screen.blocks.visualCompare.mainArtwork.alt;

  const copy = document.createElement("div");
  copy.className = "compare-copy";

  screen.blocks.visualCompare.compareNotes.forEach((note) => {
    const pair = document.createElement("div");
    pair.className = "compare-pair";

    const label = document.createElement("p");
    label.className = "compare-label";
    label.textContent = note.label;

    const text = document.createElement("p");
    text.textContent = note.text;

    pair.append(label, text);
    copy.append(pair);
  });

  compare.append(image, copy);

  const side = document.createElement("div");
  side.className = "main-column";

  const effectCard = document.createElement("div");
  effectCard.className = "draw-side-card";
  effectCard.innerHTML = `
    <p class="micro-kicker">Choose the effect</p>
    <p style="margin:8px 0 12px;">Use the image, not a long explanation, to decide.</p>
  `;
  effectCard.append(
    createEffectRow(
      screen.blocks.effectChoice.options,
      state.responses.understand.selectedEffectId,
      (selectedEffectId) => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          draft.responses.understand.selectedEffectId = selectedEffectId;
          draft.progressState = screen.progressOnComplete;
          return draft;
        });
      },
    ),
  );

  const insight = document.createElement("div");
  insight.className = "micro-insight-card";
  insight.innerHTML = `
    <p class="micro-kicker">${screen.blocks.microInsight.label}</p>
    <p>${resolveAgeVariant(screen.blocks.microInsight.line, state.ageGroup)}</p>
  `;

  side.append(effectCard, insight);
  layout.append(compare, side);

  return layout;
}

function renderDrawStage({ lessonApp, screen, state }) {
  const wrap = document.createElement("div");
  wrap.className = "stage-layout";

  const segments = screen.blocks.drawSegments;
  const activeIndex = state.responses.draw.activeSegmentIndex;
  const activeSegment = segments[activeIndex] ?? segments.at(-1);
  const checkpointDone = state.responses.draw.acknowledgedCheckpointIds.includes(activeSegment.segmentId);

  const progress = document.createElement("div");
  progress.className = "segment-progress";
  progress.innerHTML = `
    <p class="micro-kicker">Making sequence</p>
  `;
  progress.append(createDrawSegmentNodes(segments, state));

  const layout = document.createElement("div");
  layout.className = "draw-layout";

  const media = document.createElement("div");
  media.className = "draw-main";

  const mediaHeader = document.createElement("div");
  mediaHeader.className = "media-header";
  mediaHeader.innerHTML = `
    <div>
      <p class="micro-kicker">${activeSegment.teacherMedia.label}</p>
      <p class="media-title">${activeSegment.title}</p>
    </div>
    <p class="mini-label">${activeSegment.teacherMedia.durationLabel}</p>
  `;

  const mediaFrame = document.createElement("div");
  mediaFrame.className = "media-frame";
  const mediaImage = document.createElement("img");
  mediaImage.src = activeSegment.teacherMedia.imageSrc;
  mediaImage.alt = activeSegment.teacherMedia.title;
  mediaFrame.append(mediaImage);

  const mediaCopy = document.createElement("div");
  mediaCopy.className = "media-copy";
  mediaCopy.innerHTML = `
    <p class="micro-kicker">${activeSegment.teacherMedia.title}</p>
    <p>${activeSegment.teacherMedia.caption}</p>
  `;

  media.append(mediaHeader, mediaFrame, mediaCopy);

  const side = document.createElement("div");
  side.className = "draw-side";

  const action = document.createElement("div");
  action.className = "draw-side-card";
  action.innerHTML = `
    <p class="micro-kicker">${activeSegment.pausePoint.label}</p>
    <p class="side-card-title">${activeSegment.pausePoint.title}</p>
    <p>${activeSegment.pausePoint.instruction}</p>
  `;

  const companion = document.createElement("div");
  companion.className = "draw-side-card";
  companion.innerHTML = `
    <p class="micro-kicker">${activeSegment.companionPrompt.label}</p>
    <p>${activeSegment.companionPrompt.text}</p>
  `;

  const checkpoint = document.createElement("div");
  checkpoint.className = "draw-side-card";
  checkpoint.innerHTML = `
    <p class="micro-kicker">${activeSegment.checkpoint.label}</p>
    <p class="side-card-title">${activeSegment.checkpoint.question}</p>
  `;
  checkpoint.append(
    button(checkpointDone ? "Checkpoint saved" : "I checked this", {
      className: "mini-action checkpoint-toggle",
      onClick: () => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          const saved = draft.responses.draw.acknowledgedCheckpointIds;
          if (!saved.includes(activeSegment.segmentId)) {
            draft.responses.draw.acknowledgedCheckpointIds = [...saved, activeSegment.segmentId];
          }
          return draft;
        });
      },
    }),
  );

  const controls = document.createElement("div");
  controls.className = "draw-side-card";
  controls.innerHTML = `
    <p class="micro-kicker">Self-paced controls</p>
  `;

  const controlRow = document.createElement("div");
  controlRow.className = "mini-action-row";
  controlRow.append(
    button("Replay move", {
      className: "mini-action",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    }),
  );
  controlRow.append(
    button("I need more time", {
      className: "mini-action",
      onClick: () => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          draft.progressState = "drawing";
          return draft;
        });
      },
    }),
  );
  controlRow.append(
    button(
      activeIndex === segments.length - 1 ? "Finish this stage" : "Next segment",
      {
        className: "mini-action",
        onClick: () => {
          lessonApp.saveInteraction(screen.screenId, (draft) => {
            const completed = draft.responses.draw.completedSegmentIds;
            if (!completed.includes(activeSegment.segmentId)) {
              draft.responses.draw.completedSegmentIds = [...completed, activeSegment.segmentId];
            }
            if (draft.responses.draw.activeSegmentIndex < segments.length - 1) {
              draft.responses.draw.activeSegmentIndex += 1;
            }
            draft.progressState = screen.progressOnComplete;
            return draft;
          });
        },
      },
    ),
  );
  controls.append(controlRow);

  const continuity = document.createElement("div");
  continuity.className = "continuity-card";
  continuity.innerHTML = `
    <p class="micro-kicker">${screen.blocks.futureContinuity.label}</p>
    <p>${screen.blocks.futureContinuity.aiScan}</p>
    <p style="margin-top:8px;">${screen.blocks.futureContinuity.teacherReview}</p>
    <p style="margin-top:8px;">${screen.blocks.futureContinuity.journey}</p>
  `;

  side.append(action, companion, checkpoint, controls, continuity);
  layout.append(media, side);

  wrap.append(progress, layout);
  return wrap;
}

function renderStageBody({ lessonApp, screen, state, resolveAgeVariant }) {
  if (screen.stepNumber === 1) {
    return renderLookStage({ lessonApp, screen, state, resolveAgeVariant });
  }
  if (screen.stepNumber === 2) {
    return renderUnderstandStage({ lessonApp, screen, state, resolveAgeVariant });
  }
  return renderDrawStage({ lessonApp, screen, state, resolveAgeVariant });
}

function renderPrototype({ root, lessonApp, lessonMeta, resolveAgeVariant }) {
  const state = lessonApp.getLessonState();
  const screen = lessonApp.getCurrentScreen();
  const ageGroup = state.ageGroup;
  const progressPercent = getProgressPercent(lessonMeta, screen);
  const completionReady = lessonApp.getScreenCompletion(screen.screenId);
  const assistantMode = pickAssistantMode(screen);

  const shell = document.createElement("div");
  shell.className = "app-shell";

  const main = document.createElement("div");
  main.className = "main-column";

  const side = document.createElement("aside");
  side.className = "side-column";

  const hero = document.createElement("section");
  hero.className = "surface hero";
  hero.innerHTML = `
    <div class="hero-top">
      <div>
        <p class="hero-kicker"><span class="hero-kicker-dot"></span>FEI TeamArt · Smart Art Class</p>
        <h1 class="hero-title">${lessonMeta.title}</h1>
        <p class="hero-subtitle">
          A creation-oriented LFC lesson where real artworks lead the thinking, visual logic stays central,
          and drawing unfolds through recorded guidance, pause points, and self-paced making.
        </p>
      </div>
    </div>
  `;

  const ageSwitcher = document.createElement("div");
  ageSwitcher.className = "age-switcher";
  lessonMeta.ageGroups.forEach((group) => {
    ageSwitcher.append(
      button(group[0].toUpperCase() + group.slice(1), {
        className: `age-button${group === ageGroup ? " is-active" : ""}`,
        onClick: () => {
          lessonApp.saveInteraction(screen.screenId, (draft) => {
            draft.ageGroup = group;
            return draft;
          });
        },
      }),
    );
  });
  hero.querySelector(".hero-top").append(ageSwitcher);

  const heroBottom = document.createElement("div");
  heroBottom.className = "hero-bottom";

  const progressWrap = document.createElement("div");
  progressWrap.className = "progress-wrap";
  progressWrap.innerHTML = `
    <div class="progress-topline">
      <p class="progress-title">Stage ${screen.stepNumber} of ${lessonMeta.totalSteps} · ${screen.partLabel}</p>
      <p class="save-line">${completionReady ? screen.saveMessage : "Image first. Guidance second. Text stays light."}</p>
    </div>
    <div class="progress-track"><div class="progress-fill" style="width:${progressPercent}%"></div></div>
  `;
  progressWrap.append(createProgressSteps(lessonMeta, state));

  const stats = document.createElement("div");
  stats.className = "hero-stats";
  stats.innerHTML = `
    <div class="hero-stat">
      <p class="hero-stat-num">${state.currentLessonXP}</p>
      <p class="mini-label">XP this pass</p>
    </div>
    <div class="hero-stat">
      <p class="hero-stat-num">${progressPercent}%</p>
      <p class="mini-label">Stage progress</p>
    </div>
  `;

  heroBottom.append(progressWrap, stats);
  hero.append(heroBottom);

  const content = document.createElement("section");
  content.className = "surface content-card";

  const contentTop = document.createElement("div");
  contentTop.className = "content-top";
  contentTop.innerHTML = `
    <div>
      <p class="stage-label">${screen.partLabel}</p>
      <h2 class="content-title">${screen.title}</h2>
      <p class="content-prompt">${resolveAgeVariant(screen.prompt, ageGroup)}</p>
      <p class="content-helper">${resolveAgeVariant(screen.helperText, ageGroup)}</p>
    </div>
    <div class="stage-pill"><p class="stage-label">LFC remains central</p></div>
  `;

  content.append(contentTop, renderStageBody({ lessonApp, screen, state, resolveAgeVariant }));

  const footer = document.createElement("section");
  footer.className = "surface footer-card";

  const footerCopy = document.createElement("div");
  footerCopy.className = "footer-copy";
  footerCopy.innerHTML = `
    <p class="save-line">${completionReady ? screen.saveMessage : "This lesson stays ready for My Journey, feedback, and portal continuity."}</p>
    <p class="footer-state">${stateSummary(state)}</p>
  `;

  const footerActions = document.createElement("div");
  footerActions.className = "footer-actions";
  footerActions.append(
    button(screen.stepNumber === lessonMeta.totalSteps ? "Finish this stage" : "Continue", {
      className: "footer-button primary",
      disabled: !completionReady,
      onClick: () => lessonApp.completeScreen(screen.screenId),
    }),
  );
  footerActions.append(
    button("Start again", {
      className: "footer-button",
      onClick: () => window.location.reload(),
    }),
  );

  footer.append(footerCopy, footerActions);

  const assistant = document.createElement("section");
  assistant.className = "surface assistant-card";
  assistant.innerHTML = `
    <div class="assistant-head">
      <div class="assistant-avatar" aria-hidden="true">
        <div class="artchi-figure">
          <span class="artchi-wing artchi-wing-left"></span>
          <span class="artchi-wing artchi-wing-right"></span>
          <span class="artchi-crown"></span>
          <span class="artchi-body"></span>
          <span class="artchi-face">
            <span class="artchi-eye artchi-eye-left"></span>
            <span class="artchi-eye artchi-eye-right"></span>
            <span class="artchi-smile"></span>
            <span class="artchi-blush artchi-blush-left"></span>
            <span class="artchi-blush artchi-blush-right"></span>
          </span>
          <span class="artchi-palette"></span>
        </div>
      </div>
      <div>
        <p class="assistant-title">Artchi lives in the corner</p>
        <div class="assistant-mode">
          <span class="assistant-mode-dot"></span>
          <p class="assistant-mode-label">${assistantMode.label}</p>
        </div>
      </div>
    </div>
    <p>${assistantMode.note}</p>
    <div class="mini-action-row">
      <button class="ghost-button" type="button">Ask Artchi about this image</button>
      <button class="ghost-button" type="button">Save this step to My Journey</button>
    </div>
  `;

  const status = document.createElement("section");
  status.className = "surface status-card";
  status.innerHTML = `
    <p class="micro-kicker">Lesson qualities</p>
    <div class="mini-stat"><span>FEI tone</span><strong>yes</strong></div>
    <div class="mini-stat"><span>LFC centrality</span><strong>yes</strong></div>
    <div class="mini-stat"><span>Visual understand stage</span><strong>yes</strong></div>
    <div class="mini-stat"><span>Asynchronous draw model</span><strong>yes</strong></div>
  `;

  const future = document.createElement("section");
  future.className = "surface future-card";
  future.innerHTML = `
    <p class="micro-kicker">Future continuity</p>
    <p>AI scan, premium teacher review, My Journey, and badge continuity can attach later without changing the lesson’s visual logic.</p>
    <div class="future-mascot" aria-hidden="true">
      <div class="artchi-figure artchi-figure-small">
        <span class="artchi-wing artchi-wing-left"></span>
        <span class="artchi-wing artchi-wing-right"></span>
        <span class="artchi-crown"></span>
        <span class="artchi-body"></span>
        <span class="artchi-face">
          <span class="artchi-eye artchi-eye-left"></span>
          <span class="artchi-eye artchi-eye-right"></span>
          <span class="artchi-smile"></span>
          <span class="artchi-blush artchi-blush-left"></span>
          <span class="artchi-blush artchi-blush-right"></span>
        </span>
        <span class="artchi-palette"></span>
      </div>
    </div>
  `;

  main.append(hero, content, footer);
  side.append(assistant, status, future);
  shell.append(main, side);
  root.replaceChildren(shell);
}

bootstrapApp({
  root: appRoot,
  lessonPackage: runtimePrototypeLesson,
  initialRunState: runtimePrototypeInitialRunState,
  render: renderPrototype,
  analytics,
});
