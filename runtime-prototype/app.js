import { bootstrapApp } from "../core/app.js";
import {
  runtimePrototypeInitialRunState,
  runtimePrototypeLesson,
} from "./data/lfc054-runtime-lesson.js";

const appRoot = document.querySelector("[data-app]");

const analytics = {
  track(eventName, payload = {}) {
    console.info("[runtime-prototype]", eventName, payload);
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
  switch (screen.stepNumber) {
    case 1:
    case 2:
      return { label: "LFC Guide", note: "Visual noticing before explanation." };
    case 3:
    case 4:
      return { label: "Making Coach", note: "Borrow the move, then build your own image." };
    default:
      return { label: "Journey Companion", note: "Keep the thought, not just the answer." };
  }
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

function createArtGrid(items, selectedId, onSelect) {
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

    const label = document.createElement("p");
    label.className = "art-card-label";
    label.textContent = item.label;

    const title = document.createElement("p");
    title.className = "art-card-title";
    title.textContent = item.alt;

    copy.append(label, title);
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

function createOptionRow(items, selectedId, onSelect) {
  const row = document.createElement("div");
  row.className = "option-grid";

  items.forEach((item) => {
    const option = button(item.label, {
      className: `option-button${selectedId === item.id ? " is-active" : ""}`,
      onClick: () => onSelect(item.id),
    });
    option.setAttribute("aria-pressed", String(selectedId === item.id));
    row.append(option);
  });

  return row;
}

function createProgressNodes(lessonMeta, state) {
  const wrap = document.createElement("div");
  wrap.className = "progress-nodes";

  lessonMeta.screens.forEach((screen) => {
    const node = document.createElement("div");
    const isDone = state.completedScreenIds.includes(screen.screenId);
    const isActive = state.currentScreenId === screen.screenId;
    node.className = `progress-node${isDone ? " is-done" : ""}${isActive ? " is-active" : ""}`;

    const title = document.createElement("strong");
    title.textContent = `${screen.stepNumber}`;

    const label = document.createElement("span");
    label.textContent = screen.partLabel;

    node.append(title, label);
    wrap.append(node);
  });

  return wrap;
}

function renderScreenBody({ lessonApp, lessonMeta, screen, state, resolveAgeVariant }) {
  const ageGroup = state.ageGroup;
  const stage = document.createElement("div");
  stage.className = "visual-grid";

  if (screen.stepNumber === 1) {
    stage.append(
      createArtGrid(
        screen.blocks.artworkChoice.items,
        state.responses.screen1.artworkChoiceId,
        (artworkChoiceId) => {
          lessonApp.saveInteraction(screen.screenId, (draft) => {
            draft.responses.screen1.artworkChoiceId = artworkChoiceId;
            draft.progressState = screen.progressOnComplete;
            return draft;
          });
        },
      ),
    );

    const textCard = document.createElement("div");
    textCard.className = "teacher-pulse";
    textCard.innerHTML = `
      <p class="micro-kicker">Teacher pulse</p>
      <p>${resolveAgeVariant(screen.blocks.teacherPulse.line, ageGroup)}</p>
    `;
    stage.append(textCard);

    stage.append(
      createChipRow(
        screen.blocks.artworkChoice.reasonChips,
        state.responses.screen1.reasonChipIds,
        (chipId) => {
          lessonApp.saveInteraction(screen.screenId, (draft) => {
            const selected = draft.responses.screen1.reasonChipIds;
            draft.responses.screen1.reasonChipIds = selected.includes(chipId)
              ? selected.filter((item) => item !== chipId)
              : [...selected, chipId];
            return draft;
          });
        },
      ),
    );
  }

  if (screen.stepNumber === 2) {
    const studyStage = document.createElement("div");
    studyStage.className = "study-stage";

    const art = document.createElement("div");
    art.className = "study-art";

    const image = document.createElement("img");
    image.src = screen.blocks.artworkStudy.artwork.imageSrc;
    image.alt = screen.blocks.artworkStudy.artwork.alt;
    art.append(image);

    const hotspotLayer = document.createElement("div");
    hotspotLayer.className = "hotspot-layer";

    screen.blocks.artworkStudy.hotspots.forEach((hotspot, index) => {
      const revealed = state.responses.screen2.hotspotIdsViewed.includes(hotspot.id);
      const buttonNode = button(`${index + 1}`, {
        className: `hotspot-button${revealed ? " is-active" : ""}`,
        onClick: () => {
          lessonApp.saveInteraction(screen.screenId, (draft) => {
            const seen = draft.responses.screen2.hotspotIdsViewed;
            if (!seen.includes(hotspot.id)) {
              draft.responses.screen2.hotspotIdsViewed = [...seen, hotspot.id];
            }
            return draft;
          });
        },
      });
      buttonNode.style.left = `${hotspot.x}%`;
      buttonNode.style.top = `${hotspot.y}%`;
      buttonNode.style.transform = "translate(-50%, -50%)";
      hotspotLayer.append(buttonNode);
    });

    art.append(hotspotLayer);

    const side = document.createElement("div");
    side.className = "study-side";

    const insight = document.createElement("div");
    insight.className = "insight-card";

    const latestHotspot =
      screen.blocks.artworkStudy.hotspots.find((hotspot) =>
        state.responses.screen2.hotspotIdsViewed.includes(hotspot.id),
      ) ?? screen.blocks.artworkStudy.hotspots[0];

    insight.innerHTML = `
      <p class="micro-kicker">Latest clue</p>
      <p>${latestHotspot.revealText}</p>
    `;

    const moveOptions = createOptionRow(
      screen.blocks.artworkStudy.moveOptions,
      state.responses.screen2.selectedMoveId,
      (selectedMoveId) => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          draft.responses.screen2.selectedMoveId = selectedMoveId;
          draft.progressState = screen.progressOnComplete;
          return draft;
        });
      },
    );

    side.append(insight, moveOptions);
    studyStage.append(art, side);
    stage.append(studyStage);
  }

  if (screen.stepNumber === 3) {
    const subjectCard = document.createElement("div");
    subjectCard.className = "concept-card";
    subjectCard.innerHTML = `<p class="concept-title">${screen.blocks.subjectOptions.label}</p>`;
    subjectCard.append(
      createOptionRow(
        screen.blocks.subjectOptions.options,
        state.responses.screen3.subjectId,
        (subjectId) => {
          lessonApp.saveInteraction(screen.screenId, (draft) => {
            draft.responses.screen3.subjectId = subjectId;
            const subject = screen.blocks.subjectOptions.options.find((item) => item.id === subjectId);
            const strategy = screen.blocks.strategyOptions.options.find(
              (item) => item.id === draft.responses.screen3.strategyId,
            );
            draft.responses.screen3.conceptPreview =
              subject && strategy ? `${subject.label} + ${strategy.label}` : "";
            if (draft.responses.screen3.strategyId) {
              draft.progressState = screen.progressOnComplete;
            }
            return draft;
          });
        },
      ),
    );

    const strategyCard = document.createElement("div");
    strategyCard.className = "concept-card";
    strategyCard.innerHTML = `<p class="concept-title">${screen.blocks.strategyOptions.label}</p>`;
    strategyCard.append(
      createOptionRow(
        screen.blocks.strategyOptions.options,
        state.responses.screen3.strategyId,
        (strategyId) => {
          lessonApp.saveInteraction(screen.screenId, (draft) => {
            draft.responses.screen3.strategyId = strategyId;
            const subject = screen.blocks.subjectOptions.options.find(
              (item) => item.id === draft.responses.screen3.subjectId,
            );
            const strategy = screen.blocks.strategyOptions.options.find((item) => item.id === strategyId);
            draft.responses.screen3.conceptPreview =
              subject && strategy ? `${subject.label} + ${strategy.label}` : "";
            if (draft.responses.screen3.subjectId) {
              draft.progressState = screen.progressOnComplete;
            }
            return draft;
          });
        },
      ),
    );

    const preview = document.createElement("div");
    preview.className = "concept-card";
    preview.innerHTML = `
      <p class="micro-kicker">${screen.blocks.conceptPreview.prefix}</p>
      <p>${state.responses.screen3.conceptPreview || "Choose one subject and one move to build the idea."}</p>
    `;

    stage.append(subjectCard, strategyCard, preview);
  }

  if (screen.stepNumber === 4) {
    const checklistCard = document.createElement("div");
    checklistCard.className = "concept-card";
    checklistCard.innerHTML = `<p class="concept-title">Keep these visible while drawing</p>`;
    checklistCard.append(
      createChipRow(
        screen.blocks.buildChecklist.items,
        state.responses.screen4.checklistIds,
        (itemId) => {
          lessonApp.saveInteraction(screen.screenId, (draft) => {
            const selected = draft.responses.screen4.checklistIds;
            draft.responses.screen4.checklistIds = selected.includes(itemId)
              ? selected.filter((value) => value !== itemId)
              : [...selected, itemId];
            if (draft.responses.screen4.checklistIds.length >= 2) {
              draft.progressState = screen.progressOnComplete;
            }
            return draft;
          });
        },
      ),
    );

    const pulse = document.createElement("div");
    pulse.className = "teacher-pulse";
    pulse.innerHTML = `
      <p class="micro-kicker">Teacher pulse</p>
      <p>${resolveAgeVariant(screen.blocks.teacherPulse.line, ageGroup)}</p>
    `;

    stage.append(checklistCard, pulse);
  }

  if (screen.stepNumber === 5) {
    const reflection = document.createElement("div");
    reflection.className = "reflection-card";
    reflection.innerHTML = `<p class="concept-title">Leave a trace in your journey</p>`;
    reflection.append(
      createChipRow(
        screen.blocks.reflection.chips,
        state.responses.screen5.reflectionChipIds,
        (chipId) => {
          lessonApp.saveInteraction(screen.screenId, (draft) => {
            const selected = draft.responses.screen5.reflectionChipIds;
            draft.responses.screen5.reflectionChipIds = selected.includes(chipId)
              ? selected.filter((value) => value !== chipId)
              : [...selected, chipId];
            if (draft.responses.screen5.reflectionChipIds.length > 0) {
              draft.reflectionState = "partial";
            }
            return draft;
          });
        },
      ),
    );

    const field = document.createElement("textarea");
    field.className = "reflection-input";
    field.placeholder = resolveAgeVariant(screen.blocks.reflection.responseField.placeholder, ageGroup);
    field.maxLength = screen.blocks.reflection.responseField.maxLength ?? 180;
    field.value = state.responses.screen5.reflectionText;
    field.addEventListener("input", (event) => {
      lessonApp.saveInteraction(screen.screenId, (draft) => {
        draft.responses.screen5.reflectionText = event.target.value;
        draft.reflectionState = event.target.value.trim() ? "partial" : draft.reflectionState;
        return draft;
      });
    });
    reflection.append(field);
    stage.append(reflection);

    if (state.badgeState === "earned") {
      const done = document.createElement("div");
      done.className = "future-card";
      done.innerHTML = `
        <p class="micro-kicker">Prototype result</p>
        <strong>${screen.blocks.completion.title}</strong>
        <p>${screen.blocks.completion.message}</p>
        <p style="margin-top:8px;">${screen.blocks.completion.journeySaveMessage}</p>
      `;
      stage.append(done);
    }
  }

  return stage;
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
        <p class="hero-kicker"><span class="hero-kicker-dot"></span>FEI Smart Class Runtime Prototype</p>
        <h1 class="hero-title">${lessonMeta.title}</h1>
        <p class="hero-subtitle">
          A visual, interaction-first LFC lesson running through the shared Codex runtime.
          The lesson is intentionally light on explanation and heavy on looking, choosing, and making.
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

  const bottom = document.createElement("div");
  bottom.className = "hero-bottom";

  const progressWrap = document.createElement("div");
  progressWrap.className = "progress-wrap";
  progressWrap.innerHTML = `
    <div class="progress-topline">
      <p class="progress-title">Step ${screen.stepNumber} of ${lessonMeta.totalSteps} · ${screen.partLabel}</p>
      <p class="save-line">${completionReady ? screen.saveMessage : "Interaction-first: choose, notice, build, reflect."}</p>
    </div>
    <div class="progress-track"><div class="progress-fill" style="width:${progressPercent}%"></div></div>
  `;
  progressWrap.append(createProgressNodes(lessonMeta, state));

  const stats = document.createElement("div");
  stats.className = "hero-stats";
  stats.innerHTML = `
    <div class="hero-stat">
      <p class="hero-stat-num">${state.currentLessonXP}</p>
      <p class="mini-stat-label">XP in lesson</p>
    </div>
    <div class="hero-stat">
      <p class="hero-stat-num">${progressPercent}%</p>
      <p class="mini-stat-label">Runtime progress</p>
    </div>
  `;

  bottom.append(progressWrap, stats);
  hero.append(bottom);

  const content = document.createElement("section");
  content.className = "surface content-card";

  const contentTop = document.createElement("div");
  contentTop.className = "content-top";

  const copy = document.createElement("div");
  copy.innerHTML = `
    <h2 class="content-title">${screen.title}</h2>
    <p class="content-prompt">${resolveAgeVariant(screen.prompt, ageGroup)}</p>
    <p class="content-helper">${resolveAgeVariant(screen.helperText, ageGroup)}</p>
  `;

  const stagePill = document.createElement("div");
  stagePill.className = "stage-pill";
  stagePill.innerHTML = `<p class="stage-label">${screen.partLabel} · interaction-led</p>`;

  contentTop.append(copy, stagePill);
  content.append(contentTop, renderScreenBody({ lessonApp, lessonMeta, screen, state, resolveAgeVariant }));

  const footer = document.createElement("section");
  footer.className = "surface footer-card";

  const footerCopy = document.createElement("div");
  footerCopy.className = "footer-copy";
  footerCopy.innerHTML = `
    <p class="save-line">${completionReady ? screen.saveMessage : "Keep the lesson moving through choices, not long reading."}</p>
    <p class="footer-state">${stateSummary(state)}</p>
  `;

  const footerActions = document.createElement("div");
  footerActions.className = "footer-actions";

  footerActions.append(
    button("Continue", {
      className: "footer-button primary",
      disabled: !completionReady,
      onClick: () => lessonApp.completeScreen(screen.screenId),
    }),
  );

  footerActions.append(
    button("Reset lesson", {
      className: "footer-button",
      onClick: () => window.location.reload(),
    }),
  );

  footer.append(footerCopy, footerActions);

  const assistant = document.createElement("section");
  assistant.className = "assistant-card";
  assistant.innerHTML = `
    <div class="assistant-head">
      <div class="assistant-avatar">🧚</div>
      <div>
        <p class="assistant-title">Artchi-ready runtime</p>
        <div class="assistant-mode">
          <span class="assistant-mode-dot"></span>
          <p class="assistant-mode-label">${assistantMode.label}</p>
        </div>
      </div>
    </div>
    <p>
      This prototype keeps a dedicated assistant zone separate from lesson content,
      so the shared Artchi layer can plug into one runtime context instead of a lesson-local widget.
    </p>
    <div class="assistant-callout">
      <p>${assistantMode.note}</p>
    </div>
    <div class="assistant-actions">
      <button class="ghost-button" type="button">Ask about this step</button>
      <button class="ghost-button" type="button">Open My Journey</button>
    </div>
  `;

  const status = document.createElement("section");
  status.className = "status-card";
  status.innerHTML = `
    <p class="micro-kicker">Runtime compatibility</p>
    <div class="status-card-grid">
      <div class="mini-stat">
        <span>Shared profile/runtime</span>
        <strong>yes</strong>
      </div>
      <div class="mini-stat">
        <span>LFC family shape</span>
        <strong>yes</strong>
      </div>
      <div class="mini-stat">
        <span>Artwork backend ready</span>
        <strong>next</strong>
      </div>
      <div class="mini-stat">
        <span>Portal hooks</span>
        <strong>ready</strong>
      </div>
    </div>
  `;

  const future = document.createElement("section");
  future.className = "future-card";
  future.innerHTML = `
    <p class="micro-kicker">Why this prototype exists</p>
    <strong>Test the runtime, not just the lesson copy.</strong>
    <p>
      This surface is meant to show a Codex version that stays visual, interaction-first,
      and structurally compatible with the larger FEI Smart Class ecosystem.
    </p>
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
