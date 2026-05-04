import { bootstrapApp } from "../core/app.js";
import { clearProfile, updateProfile } from "../core/profile.js";
import {
  adaptedLfc054InitialRunState,
  adaptedLfc054LessonPackage,
} from "./data/lfc054-lesson-adapter.js";
import { lfc054PromptPackDraft } from "./data/lfc054-prompt-pack.js";
import { studentAccessCodes } from "../core/student-access-codes.js";

const appRoot = document.querySelector("[data-app]");

const analytics = {
  track(eventName, payload = {}) {
    console.info("[lfc054-surreal-worlds]", eventName, payload);
  },
};

const LESSON_WRITEBACK_KEY = "lfc054_writeback_v1";
const JUDGMENT_CARD_KEY = "lfc_cards_v1";
const IDENTITY_KEY = "fei.identity.v1";
const DEFAULT_LEARNER_CONTEXT = {
  mode: "guest",
  studentId: null,
  portalCodeVerified: false,
  memberId: null,
  displayName: null,
};
const AGE_GROUP_OPTIONS = [
  { id: "kids", label: "Kids", ages: "Ages 4-10", icon: "🎈" },
  { id: "teen", label: "Teen", ages: "Ages 11-17", icon: "🎨" },
  { id: "adult", label: "Adult", ages: "Ages 18+", icon: "🖼️" },
];

function getStudentPortalUrl() {
  const fromWindow = window.FEI_STUDENT_PORTAL_URL;
  if (typeof fromWindow === "string" && fromWindow.trim()) {
    return fromWindow.trim();
  }

  const fromQuery = new URL(window.location.href).searchParams.get("portalUrl");
  if (fromQuery && fromQuery.trim()) {
    return fromQuery.trim();
  }

  return "";
}

function openStudentPortal() {
  const learner = getCurrentLearnerContext();

  if (typeof window.openStudentPortal === "function") {
    window.openStudentPortal(learner);
    return;
  }

  const portalUrl = getStudentPortalUrl();
  if (portalUrl) {
    const url = new URL(portalUrl, window.location.href);
    if (learner.studentId) {
      url.searchParams.set("studentId", learner.studentId);
    }
    if (learner.displayName) {
      url.searchParams.set("displayName", learner.displayName);
    }
    if (learner.ageGroup) {
      url.searchParams.set("ageGroup", learner.ageGroup);
    }
    url.searchParams.set("sourceLesson", adaptedLfc054LessonPackage.lesson.lessonId);
    url.searchParams.set("sourceFamily", adaptedLfc054LessonPackage.lesson.lessonFamily);
    window.location.href = url.toString();
    return;
  }

  window.alert("Student Portal link is not connected yet.");
}

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
  if (options.title) {
    btn.title = options.title;
  }
  return btn;
}

function getCurrentLearnerContext() {
  try {
    const raw = window.localStorage.getItem(IDENTITY_KEY);
    if (!raw) {
      return { ...DEFAULT_LEARNER_CONTEXT };
    }

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_LEARNER_CONTEXT,
      ...parsed,
    };
  } catch (error) {
    return { ...DEFAULT_LEARNER_CONTEXT };
  }
}

function persistLearnerContext(contextPatch) {
  try {
    const next = {
      ...getCurrentLearnerContext(),
      ...contextPatch,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(IDENTITY_KEY, JSON.stringify(next));
    return next;
  } catch (error) {
    return {
      ...DEFAULT_LEARNER_CONTEXT,
      ...contextPatch,
    };
  }
}

function ensureGuestLearnerContext() {
  const current = getCurrentLearnerContext();
  if (!current.mode) {
    return persistLearnerContext(DEFAULT_LEARNER_CONTEXT);
  }
  if (current.mode === "guest" || current.mode === "portal_code" || current.mode === "member") {
    return current;
  }
  return persistLearnerContext(DEFAULT_LEARNER_CONTEXT);
}

function canSyncToCloud(context = getCurrentLearnerContext()) {
  return context.mode === "member";
}

function normalizeStudentAccessCode(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\s+/g, "");
}

window.getCurrentLearnerContext = getCurrentLearnerContext;
window.setPortalLearnerContext = function setPortalLearnerContext(student) {
  return persistLearnerContext({
    mode: "portal_code",
    studentId: student?.id ?? null,
    portalCodeVerified: Boolean(student?.id),
    memberId: null,
    displayName: student?.display_name ?? student?.displayName ?? null,
  });
};
window.clearLearnerContext = function clearLearnerContext() {
  return persistLearnerContext(DEFAULT_LEARNER_CONTEXT);
};
window.canSyncToCloud = canSyncToCloud;

function findStudentAccessRecord(code) {
  const normalizedCode = normalizeStudentAccessCode(code);
  if (!normalizedCode) return null;
  return (
    studentAccessCodes.find(
      (entry) => normalizeStudentAccessCode(entry.id) === normalizedCode,
    ) ?? null
  );
}

function applyLessonGateAccess({ code, ageGroup }) {
  const matchedStudent = findStudentAccessRecord(code);
  if (!matchedStudent) {
    return { ok: false, reason: "invalid_code" };
  }

  const lessonMetaForGate = {
    lessonId: adaptedLfc054LessonPackage.lesson?.lessonId,
    screens: adaptedLfc054LessonPackage.screens ?? [],
  };

  const currentContext = getCurrentLearnerContext();
  if (currentContext.studentId && currentContext.studentId !== matchedStudent.id) {
    clearProfile();
    clearLessonDraftData(lessonMetaForGate);
  }

  updateProfile({
    name: matchedStudent.displayName,
    ageGroup,
    tier: "member",
    currentLessonId: lessonMetaForGate.lessonId,
  });

  persistLearnerContext({
    mode: "portal_code",
    studentId: matchedStudent.id,
    portalCodeVerified: true,
    memberId: null,
    displayName: matchedStudent.displayName,
    ageGroup,
  });

  return { ok: true, student: matchedStudent };
}

function renderLessonGate({ root, onSuccess }) {
  const shell = document.createElement("section");
  shell.className = "lesson-gate-shell";

  const card = document.createElement("div");
  card.className = "lesson-gate-card";

  const storedIdentity = getCurrentLearnerContext();
  let selectedAgeGroup = storedIdentity.ageGroup ?? "";
  let currentCode = "";
  let status = "idle";
  let isSubmitting = false;
  let gateErrorMessage = "";

  const renderGate = () => {
    const ageButtons = AGE_GROUP_OPTIONS.map((option) => `
      <button
        type="button"
        class="lesson-gate-age${selectedAgeGroup === option.id ? " is-active" : ""}"
        data-age="${option.id}"
      >
        <span class="lesson-gate-age-icon">${option.icon}</span>
        <span class="lesson-gate-age-copy">
          <strong>${option.label}</strong>
          <span>${option.ages}</span>
        </span>
      </button>
    `).join("");

    const invalidBlock =
      status === "invalid"
        ? `<div class="lesson-gate-error">That code doesn’t match. Please check the code and try again.</div>`
        : "";
    const launchErrorBlock =
      status === "launch_error" && gateErrorMessage
        ? `<div class="lesson-gate-error">${gateErrorMessage}</div>`
        : "";

    card.innerHTML = `
      <div class="lesson-gate-kicker">✨ About to Begin</div>
      <p class="lesson-gate-lesson">Illustration Lab</p>
      <h1 class="lesson-gate-title">Welcome —</h1>
      <p class="lesson-gate-copy">Enter your student code to begin. Smart Class is currently for FEI students only.</p>

      <label class="lesson-gate-label" for="studentAccessCode">Student Code</label>
      <input
        id="studentAccessCode"
        class="lesson-gate-input${status === "invalid" ? " is-invalid" : ""}"
        placeholder="e.g. FEI-2048"
        value="${currentCode}"
        autocomplete="off"
        autocapitalize="characters"
        spellcheck="false"
      />
      <p class="lesson-gate-hint">Use your student access code to enter this class.</p>
      ${invalidBlock}
      ${launchErrorBlock}

      <p class="lesson-gate-label">How old is the learner?</p>
      <div class="lesson-gate-age-grid">${ageButtons}</div>

      <button
        type="button"
        class="lesson-gate-submit"
        ${!currentCode.trim() || !selectedAgeGroup || isSubmitting ? "disabled" : ""}
      >
        ${isSubmitting ? "Opening..." : "✧ Let’s Begin →"}
      </button>

      <p class="lesson-gate-note">🔒 Your progress saves to this device only.</p>
    `;

    const input = card.querySelector("#studentAccessCode");
    const submitButton = card.querySelector(".lesson-gate-submit");
    const syncSubmitState = () => {
      submitButton.disabled = !currentCode.trim() || !selectedAgeGroup || isSubmitting;
    };

    input.addEventListener("input", (event) => {
      currentCode = event.target.value;
      if (status === "invalid" || status === "launch_error") {
        status = "idle";
        gateErrorMessage = "";
        input.classList.remove("is-invalid");
        card.querySelector(".lesson-gate-error")?.remove();
      }
      syncSubmitState();
    });

    card.querySelectorAll("[data-age]").forEach((buttonElement) => {
      buttonElement.addEventListener("click", () => {
        selectedAgeGroup = buttonElement.getAttribute("data-age") ?? "";
        status = "idle";
        gateErrorMessage = "";
        renderGate();
      });
    });

    card.querySelector(".lesson-gate-submit")?.addEventListener("click", () => {
      if (isSubmitting) {
        return;
      }

      isSubmitting = true;
      renderGate();
      let result;
      try {
        result = applyLessonGateAccess({
          code: currentCode,
          ageGroup: selectedAgeGroup,
        });
      } catch (error) {
        isSubmitting = false;
        status = "launch_error";
        gateErrorMessage = error?.message
          ? String(error.message)
          : "The class could not open yet.";
        renderGate();
        return;
      }

      if (!result.ok) {
        isSubmitting = false;
        status = "invalid";
        renderGate();
        return;
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          try {
            onSuccess();
          } catch (error) {
            isSubmitting = false;
            status = "launch_error";
            gateErrorMessage = error?.message
              ? String(error.message)
              : "The class could not open yet.";
            renderGate();
          }
        });
      });
    });

    syncSubmitState();
  };

  renderGate();
  shell.append(card);
  root.replaceChildren(shell);
}

function pickAssistantMode(screen) {
  if (screen.uiKind === "draw") {
    return {
      label: "Smart companion",
      note: "Artchi stays with the making process quietly. Recorded teacher guidance leads the move, and the lesson keeps the next check simple.",
    };
  }

  if (screen.uiKind === "reflection" || screen.uiKind === "continue") {
    return {
      label: "Portal companion",
      note: "Artchi helps you name what changed, what worked, and how this lesson can continue through your Student Portal and later support paths.",
    };
  }

  return {
    label: "LFC guide",
    note: "Artchi helps you look more carefully. The lesson teaches through artworks, artist choices, and visual logic before making begins.",
  };
}

function formatHookLabel(value) {
  if (!value) return "";
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getScreenSupportModel(screen) {
  const hooks = screen.systemHooks ?? {};
  const items = [];

  if (hooks.aiMode) {
    items.push({
      label: "AI help",
      value:
        hooks.aiMode === "making_companion"
          ? "Drawing support"
          : hooks.aiMode === "idea_builder"
            ? "Idea support"
            : "Artwork support",
    });
  }

  if (hooks.thinkingQuest) {
    items.push({
      label: "Thinking",
      value: "Available here",
    });
  }

  if (hooks.uploadPoint) {
    items.push({
      label: "Share work",
      value:
        hooks.uploadPoint === "final_upload"
          ? "Final upload"
          : "Work in progress",
    });
  }

  if (hooks.teacherHelp) {
    items.push({
      label: "Teacher help",
      value: "Available",
    });
  }

  return items;
}

function getStudentProgressLabel(screen, lessonMeta) {
  if (screen.uiKind === "welcome") {
    return "Lesson introduction";
  }
  if (screen.uiKind === "draw") {
    return `Drawing step ${Math.max(1, screen.stepNumber - 7)} of 6`;
  }
  if (screen.uiKind === "reflection" || screen.uiKind === "continue") {
    return "Final reflection";
  }
  return `${screen.partLabel} lesson step`;
}

function composeJourneyDraft(state) {
  const lines = [];
  const buildIdea = state.responses.buildIdea ?? {};
  const reflection = state.responses.reflection ?? {};
  const questEntries = Object.entries(state.responses.quest ?? {}).filter(
    ([, value]) => value && (value.choice || (value.text ?? "").trim()),
  );
  const uploadEntries = Object.entries(state.responses.uploads ?? {}).filter(
    ([, value]) => value && value.saved,
  );
  const judgmentCards = state.responses.judgmentCards ?? [];

  if (buildIdea.selectedSceneId) {
    lines.push(`Real scene: ${formatHookLabel(buildIdea.selectedSceneId)}`);
  }
  if (buildIdea.selectedMoodId) {
    lines.push(`Mood: ${formatHookLabel(buildIdea.selectedMoodId)}`);
  }
  if (buildIdea.selectedMoveId) {
    lines.push(`Surreal move: ${formatHookLabel(buildIdea.selectedMoveId)}`);
  }
  if (buildIdea.selectedStorySeedId) {
    lines.push(`Story seed: ${formatHookLabel(buildIdea.selectedStorySeedId)}`);
  }
  if ((buildIdea.conceptSentence ?? "").trim()) {
    lines.push(`Concept: ${buildIdea.conceptSentence.trim()}`);
  }
  if ((state.responses.draw?.completedSegmentIds ?? []).length) {
    lines.push(`Draw checkpoints: ${state.responses.draw.completedSegmentIds.length}`);
  }
  if (uploadEntries.length) {
    lines.push(`Uploads saved: ${uploadEntries.length}`);
  }
  if (judgmentCards.length) {
    lines.push(`Judgment cards: ${judgmentCards.length}`);
  }
  if (questEntries.length) {
    lines.push(`Quest cards: ${questEntries.length}`);
  }
  if (reflection.chips?.length) {
    lines.push(`Reflection tags: ${reflection.chips.map(formatHookLabel).join(", ")}`);
  }
  if ((reflection.text ?? "").trim()) {
    lines.push(`Reflection: ${reflection.text.trim()}`);
  }

  return lines;
}

function buildJourneySummary(state) {
  const buildIdea = state.responses.buildIdea ?? {};
  const reflection = state.responses.reflection ?? {};
  const judgmentCards = state.responses.judgmentCards ?? [];
  const uploadsSaved = Object.values(state.responses.uploads ?? {}).filter(
    (item) => item?.saved,
  ).length;
  const drawSteps = (state.responses.draw?.completedSegmentIds ?? []).length;

  const summary = {
    currentFocus: "Surreal image building",
    surrealMove: buildIdea.selectedMoveId ? formatHookLabel(buildIdea.selectedMoveId) : "Not chosen yet",
    realScene: buildIdea.selectedSceneId ? formatHookLabel(buildIdea.selectedSceneId) : "Not chosen yet",
    mood: buildIdea.selectedMoodId ? formatHookLabel(buildIdea.selectedMoodId) : "Not chosen yet",
    concept: (buildIdea.conceptSentence ?? "").trim() || "No concept sentence saved yet.",
    drawSteps,
    judgmentCards: judgmentCards.length,
    uploadsSaved,
    reflection:
      (reflection.text ?? "").trim() || "No reflection saved yet.",
  };

  return summary;
}

function buildPortalCompletionMapping(state, identity) {
  const reflection = state.responses.reflection ?? {};
  const uploadsSaved = Object.values(state.responses.uploads ?? {}).filter(
    (item) => item?.saved,
  ).length;
  const judgmentCards = state.responses.judgmentCards ?? [];
  const completedAt = new Date().toISOString();
  const lessonId = state.lessonId;
  const trackId = "illustration";
  const trackTitle = "Illustration Path";
  const target = 8;
  const badgeId = "storyteller";
  const nextLessonId = "lfc055-surreal-variation";

  const lessonProgress = {
    [lessonId]: {
      completed: Boolean(state.isLessonComplete),
      completed_at: state.isLessonComplete ? completedAt : null,
      family: state.familyId ?? "lfc",
      track: trackId,
      xp: state.currentLessonXP ?? 0,
      reflection_saved: Boolean((reflection.text ?? "").trim() || reflection.chips?.length),
      uploads_count: uploadsSaved,
      judgment_cards_count: judgmentCards.length,
      student_id: identity.studentId,
      member_id: identity.memberId,
    },
  };

  const priorTrack = state.portalTrackProgress?.[trackId] ?? null;
  const priorLessons = Array.isArray(priorTrack?.completed_lessons)
    ? priorTrack.completed_lessons
    : [];
  const completedLessons = Array.from(
    new Set(
      state.isLessonComplete
        ? [...priorLessons, lessonId]
        : priorLessons,
    ),
  );
  const count = completedLessons.length;
  const trackStatus = count >= target ? "completed" : count > 0 ? "in_progress" : "not_started";
  const badgeStatus = count >= target ? "unlocked" : count > 0 ? "in_progress" : "not_started";

  const trackProgress = {
    [trackId]: {
      title: trackTitle,
      count,
      target,
      completed_lessons: completedLessons,
      status: trackStatus,
      badge_id: badgeId,
      next_lesson_id: count >= target ? null : nextLessonId,
    },
  };

  const badgeProgress = {
    [badgeId]: {
      source_track: trackId,
      count,
      target,
      status: badgeStatus,
    },
  };

  const achievementCandidate =
    count >= target
      ? {
          badge_id: badgeId,
          date: completedAt.slice(0, 10),
          source_track: trackId,
        }
      : null;

  return {
    lesson_progress: lessonProgress,
    track_progress: trackProgress,
    badge_progress: badgeProgress,
    achievement_candidate: achievementCandidate,
  };
}

function buildWritebackEnvelope(state) {
  const visitorId = createLfcVisitorId();
  const identity = ensureGuestLearnerContext();
  const portalMapping = buildPortalCompletionMapping(state, identity);
  const uploads = Object.entries(state.responses.uploads ?? {})
    .filter(([, value]) => value)
    .map(([screenId, value]) => ({
      checkpointId: screenId,
      lessonId: state.lessonId,
      visitorId,
      uploadPoint: value.uploadPoint ?? screenId,
      note: value.note ?? "",
      saved: Boolean(value.saved),
      createdAt: value.createdAt ?? Date.now(),
      updatedAt: Date.now(),
      status: value.saved ? "saved" : "draft",
    }));

  return {
    lessonId: state.lessonId,
    visitorId,
    identity,
    ageGroup: state.ageGroup,
    lessonProgress: {
      lessonId: state.lessonId,
      learnerId: state.learnerId ?? "",
      studentId: identity.studentId,
      memberId: identity.memberId,
      visitorId,
      ageGroup: state.ageGroup,
      currentScreenId: state.currentScreenId,
      completedScreenIds: [...(state.completedScreenIds ?? [])],
      progressState: state.progressState,
      currentLessonXP: state.currentLessonXP,
      isLessonComplete: state.isLessonComplete,
      updatedAt: Date.now(),
    },
    buildIdea: {
      lessonId: state.lessonId,
      studentId: identity.studentId,
      visitorId,
      ...(state.responses.buildIdea ?? {}),
      updatedAt: Date.now(),
    },
    drawProgress: {
      lessonId: state.lessonId,
      studentId: identity.studentId,
      visitorId,
      completedSegmentIds: [...(state.responses.draw?.completedSegmentIds ?? [])],
      acknowledgedCheckpointIds: [...(state.responses.draw?.acknowledgedCheckpointIds ?? [])],
      activeSegmentIndex: state.responses.draw?.activeSegmentIndex ?? 0,
      updatedAt: Date.now(),
    },
    reflection: {
      lessonId: state.lessonId,
      studentId: identity.studentId,
      visitorId,
      chips: [...(state.responses.reflection?.chips ?? [])],
      text: state.responses.reflection?.text ?? "",
      updatedAt: Date.now(),
    },
    judgmentCards: [...(state.responses.judgmentCards ?? [])],
    uploads,
    journeySummary: {
      lessonId: state.lessonId,
      studentId: identity.studentId,
      visitorId,
      ...buildJourneySummary(state),
      updatedAt: Date.now(),
    },
    portalMapping,
    updatedAt: Date.now(),
  };
}

function persistWritebackEnvelope(state) {
  try {
    const envelope = buildWritebackEnvelope(state);
    window.localStorage.setItem(LESSON_WRITEBACK_KEY, JSON.stringify(envelope));
  } catch (error) {
    console.warn("[lfc054] writeback envelope local save failed", error);
  }
}

function readWritebackEnvelope() {
  try {
    const raw = window.localStorage.getItem(LESSON_WRITEBACK_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function clearLessonDraftData(lessonMeta) {
  try {
    window.localStorage.removeItem(LESSON_WRITEBACK_KEY);
    const lessonScreenIds = new Set((lessonMeta?.screens ?? []).map((screen) => screen.screenId));
    const existingCards = JSON.parse(window.localStorage.getItem(JUDGMENT_CARD_KEY) || "[]");
    const filteredCards = existingCards.filter((item) => !lessonScreenIds.has(item.screenId));
    window.localStorage.setItem(JUDGMENT_CARD_KEY, JSON.stringify(filteredCards));
  } catch (error) {
    console.warn("[lfc054] lesson draft reset failed", error);
  }
}

function createLfcVisitorId() {
  const key = "lfc_visitor_id";
  try {
    let id = window.localStorage.getItem(key);
    if (!id) {
      id = `v_${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(key, id);
    }
    return id;
  } catch (error) {
    return "unknown";
  }
}

function getQuestCardTitle(level, history, screenId) {
  const sameScreenCount = history.filter(
    (item) => item.level === level && item.screenId === screenId,
  ).length;

  if (level === 1) {
    if (sameScreenCount === 0) return "First Pause";
    if (sameScreenCount === 1) return "Returning Gaze";
    return "Learning to Stay";
  }

  if (level === 2) {
    return "Making a Stand";
  }

  return "Judgment Recorded";
}

function getQuestCardSummary(level) {
  if (level === 1) {
    return "You paused and stayed with an artwork instead of rushing past it.";
  }

  if (level === 2) {
    return "You made a conscious visual choice and reflected on how it changes the image.";
  }

  return "You reflected on an artwork.";
}

function stateSummary(state) {
  const context = getCurrentLearnerContext();
  return [
    `Mode: ${context.mode}`,
    context.studentId ? `Student: ${context.studentId}` : null,
    `Age: ${state.ageGroup}`,
    `Progress: ${state.progressState}`,
    `Badge: ${state.badgeState}`,
  ].filter(Boolean).join(" • ");
}

function getProgressPercent(lessonMeta, screen) {
  return Math.round((screen.stepNumber / lessonMeta.totalSteps) * 100);
}

function createProgressSteps(lessonMeta, state) {
  const wrap = document.createElement("div");
  wrap.className = "progress-steps";
  const groupedSteps = lessonMeta.screens.reduce((groups, screen) => {
    const existing = groups.find((item) => item.partLabel === screen.partLabel);
    if (existing) {
      existing.screenIds.push(screen.screenId);
      return groups;
    }
    groups.push({
      partLabel: screen.partLabel,
      screenIds: [screen.screenId],
    });
    return groups;
  }, []);

  groupedSteps.forEach((group) => {
    const isActive = group.screenIds.includes(state.currentScreenId);
    const isDone = group.screenIds.some((screenId) => state.completedScreenIds.includes(screenId));
    const step = document.createElement("div");
    step.className = `progress-step${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`;

    const title = document.createElement("strong");
    title.textContent = group.partLabel;

    step.append(title);
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
    label.textContent = [item.medium, item.year].filter(Boolean).join(" · ");

    const credit = document.createElement("p");
    credit.className = "art-card-credit";
    credit.textContent = item.creditLine ?? "";

    const source = document.createElement("p");
    source.className = "art-card-source";
    source.textContent = item.sourceLine ?? "";

    copy.append(kicker, title);
    if (label.textContent) {
      copy.append(label);
    }
    copy.append(credit, source);
    card.append(image, copy);
    grid.append(card);
  });

  return grid;
}

function createOptionGrid(items, selectedId, onSelect) {
  const grid = document.createElement("div");
  grid.className = "effect-row";

  items.forEach((item) => {
    const choice = button(item.label, {
      className: `effect-button${selectedId === item.id ? " is-active" : ""}`,
      onClick: () => onSelect(item.id),
    });
    choice.setAttribute("aria-pressed", String(selectedId === item.id));
    grid.append(choice);
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

function bindTextareaPersistence(input, onSave) {
  const persist = (event) => {
    onSave(event.target.value);
  };

  input.addEventListener("change", persist);
  input.addEventListener("blur", persist);
}

function createSupportStrip(screen) {
  const supportItems = getScreenSupportModel(screen);
  if (!supportItems.length) {
    return null;
  }

  const strip = document.createElement("div");
  strip.className = "support-strip";

  supportItems.forEach((item) => {
    const pill = document.createElement("div");
    pill.className = "support-pill";
    pill.innerHTML = `
      <p class="micro-kicker">${item.label}</p>
      <p class="support-pill-value">${item.value}</p>
    `;
    strip.append(pill);
  });

  return strip;
}

function getQuestPromptPack(screen, ageGroup) {
  const questKey = screen.systemHooks?.thinkingQuest;
  if (!questKey || questKey === "age_variant_optional") {
    return null;
  }

  if (ageGroup === "kids" && questKey !== "light_kids_compare") {
    return null;
  }

  const quest = lfc054PromptPackDraft.thinkingQuestAdapters[questKey];
  if (!quest?.prompts) {
    return null;
  }

  return quest.prompts[ageGroup] ?? quest.prompts.teen ?? quest.prompts.adult ?? quest.prompts.kids ?? null;
}

function createThinkingQuestCard({ lessonApp, screen, state, ageGroup }) {
  const questPrompt = getQuestPromptPack(screen, ageGroup);
  if (!questPrompt) {
    return null;
  }
  const isKidsLightQuest =
    ageGroup === "kids" && screen.systemHooks?.thinkingQuest === "light_kids_compare";

  const screenQuestState = state.responses.quest?.[screen.screenId] ?? {
    choice: "",
    text: "",
    saved: false,
  };

  const card = document.createElement("div");
  card.className = "quest-card";
  card.innerHTML = `
    <p class="micro-kicker">${isKidsLightQuest ? "Quick choice" : "Thinking Quest"}</p>
    <p class="side-card-title">${questPrompt.question}</p>
  `;

  card.append(
    createOptionGrid(questPrompt.choices.map((choice) => ({ id: choice, label: choice })), screenQuestState.choice, (selectedId) => {
      lessonApp.saveInteraction(screen.screenId, (draft) => {
        draft.responses.quest[screen.screenId] = {
          ...(draft.responses.quest[screen.screenId] ?? { choice: "", text: "" }),
          choice: selectedId,
        };
        return draft;
      });
    }),
  );

  if (questPrompt.followUp && !isKidsLightQuest) {
    const followUp = document.createElement("p");
    followUp.className = "quest-followup";
    followUp.textContent = questPrompt.followUp;
    card.append(followUp);
  }

  if (!isKidsLightQuest) {
    const input = document.createElement("textarea");
    input.className = "reflection-textarea";
    input.rows = 3;
    input.placeholder = "Optional: add one sentence of your own observation.";
    input.value = screenQuestState.text;
    bindTextareaPersistence(input, (value) => {
      lessonApp.saveInteraction(screen.screenId, (draft) => {
        draft.responses.quest[screen.screenId] = {
          ...(draft.responses.quest[screen.screenId] ?? { choice: "", text: "", saved: false }),
          text: value,
        };
        return draft;
      });
    });
    card.append(input);
  }

  if (!isKidsLightQuest) {
    const actions = document.createElement("div");
    actions.className = "mini-action-row";
    actions.append(
      button(screenQuestState.saved ? "Judgment Card saved" : "Save Judgment Card", {
        className: "mini-action checkpoint-toggle",
        onClick: () => {
          const currentState = lessonApp.getLessonState();
          const currentQuest = currentState.responses.quest?.[screen.screenId] ?? {
            choice: "",
            text: "",
            saved: false,
          };

          if (!currentQuest.choice && !(currentQuest.text ?? "").trim()) {
            return;
          }

          const level =
            screen.systemHooks?.thinkingQuest === "level2_choice_change"
              ? 2
              : 1;
          const visitorId = createLfcVisitorId();
          const existingCards = currentState.responses.judgmentCards ?? [];
          const title = getQuestCardTitle(level, existingCards, screen.screenId);
          const summary = getQuestCardSummary(level);

          const cardRecord = {
            id: `card_${Date.now()}`,
            lessonId: currentState.lessonId,
            visitorId,
            screenId: screen.screenId,
            artworkId: screen.screenId,
            artworkTitle: screen.title,
            artworkMeta: screen.partLabel,
            artworkImg: "",
            cardType: level === 1 ? "sight" : "choice_change",
            title,
            summary,
            chapter: 1,
            level,
            group: ageGroup,
            createdAt: Date.now(),
            timestamp: Date.now(),
            responses: {
              choice: currentQuest.choice,
              text: (currentQuest.text ?? "").trim(),
            },
          };

          lessonApp.saveInteraction(screen.screenId, (draft) => {
            draft.responses.quest[screen.screenId] = {
              ...(draft.responses.quest[screen.screenId] ?? {
                choice: "",
                text: "",
                saved: false,
              }),
              saved: true,
            };
            draft.responses.judgmentCards = [
              ...(draft.responses.judgmentCards ?? []).filter(
                (item) => item.screenId !== screen.screenId,
              ),
              cardRecord,
            ];
            return draft;
          });

          try {
            const existing = JSON.parse(window.localStorage.getItem(JUDGMENT_CARD_KEY) || "[]");
            const next = [
              ...existing.filter((item) => item.screenId !== screen.screenId),
              cardRecord,
            ];
            window.localStorage.setItem(JUDGMENT_CARD_KEY, JSON.stringify(next));
          } catch (error) {
            console.warn("[lfc054] judgment card local save failed", error);
          }
        },
      }),
    );
    card.append(actions);
  }

  return card;
}

function createUploadCard({ lessonApp, screen, state }) {
  const uploadPoint = screen.systemHooks?.uploadPoint;
  if (!uploadPoint) {
    return null;
  }

  const uploadState = state.responses.uploads?.[screen.screenId] ?? {
    saved: false,
    note: "",
  };

  const card = document.createElement("div");
  card.className = "upload-card";
  card.innerHTML = `
    <p class="micro-kicker">Share work</p>
    <p class="side-card-title">${formatHookLabel(uploadPoint)}</p>
    <p>Save a sketch note here if you want feedback, want to remember this moment, or want to come back later.</p>
  `;

  const input = document.createElement("textarea");
  input.className = "reflection-textarea";
  input.rows = 3;
  input.placeholder = "Optional note: what are you uploading or checking at this point?";
  input.value = uploadState.note;
  bindTextareaPersistence(input, (value) => {
    lessonApp.saveInteraction(screen.screenId, (draft) => {
      draft.responses.uploads[screen.screenId] = {
        ...(draft.responses.uploads[screen.screenId] ?? {
          saved: false,
          note: "",
          uploadPoint,
          createdAt: Date.now(),
        }),
        note: value,
      };
      return draft;
    });
  });
  card.append(input);

  const actions = document.createElement("div");
  actions.className = "mini-action-row";
  actions.append(
    button(uploadState.saved ? "Check-in saved" : "Save this check-in", {
      className: "mini-action checkpoint-toggle",
      onClick: () => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          draft.responses.uploads[screen.screenId] = {
            ...(draft.responses.uploads[screen.screenId] ?? {
              saved: false,
              note: "",
              uploadPoint,
              createdAt: Date.now(),
            }),
            saved: true,
            uploadPoint,
          };
          return draft;
        });
      },
    }),
  );
  actions.append(
    button("Ask AI about this step", {
      className: "mini-action",
    }),
  );
  if (screen.systemHooks?.teacherHelp) {
    actions.append(
      button("Save for teacher help", {
        className: "mini-action",
      }),
    );
  }
  card.append(actions);

  return card;
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
      state.responses[screen.screenId].selectedArtworkId,
      (selectedArtworkId) => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          draft.responses[screen.screenId].selectedArtworkId = selectedArtworkId;
          draft.progressState = screen.progressOnComplete;
          return draft;
        });
      },
    ),
  );

  wrap.append(
    createChipRow(
      screen.blocks.artworkSelection.reactionChips,
      state.responses[screen.screenId].reactionChipIds,
      (chipId) => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          const selected = draft.responses[screen.screenId].reactionChipIds;
          draft.responses[screen.screenId].reactionChipIds = selected.includes(chipId)
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

  const credit = document.createElement("div");
  credit.className = "compare-credit";
  credit.innerHTML = `
    <p>${screen.blocks.visualCompare.mainArtwork.artist} · ${screen.blocks.visualCompare.mainArtwork.title}${screen.blocks.visualCompare.mainArtwork.year ? ` · ${screen.blocks.visualCompare.mainArtwork.year}` : ""}</p>
    <p>${screen.blocks.visualCompare.mainArtwork.medium || ""}</p>
    <p>${screen.blocks.visualCompare.mainArtwork.sourceLine || ""}</p>
  `;
  compare.append(credit);

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
  const questCard = createThinkingQuestCard({
    lessonApp,
    screen,
    state,
    ageGroup: state.ageGroup,
  });
  if (questCard) {
    side.append(questCard);
  }
  layout.append(compare, side);

  return layout;
}

function renderChoiceStage({ lessonApp, screen, state }) {
  const layout = document.createElement("div");
  layout.className = "main-column";

  const choiceCard = document.createElement("div");
  choiceCard.className = "draw-side-card";
  choiceCard.innerHTML = `
    <p class="micro-kicker">Choose one</p>
    <p class="side-card-title">${screen.title}</p>
  `;
  choiceCard.append(
    createOptionGrid(
      screen.blocks.choiceGrid.options,
      state.responses.buildIdea[screen.blocks.choiceGrid.field.split(".").at(-1)],
      (selectedId) => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          draft.responses.buildIdea[screen.blocks.choiceGrid.field.split(".").at(-1)] = selectedId;
          draft.progressState = screen.progressOnComplete;
          return draft;
        });
      },
    ),
  );
  layout.append(choiceCard);

  if (screen.blocks.reflectionPrompt) {
    const promptCard = document.createElement("div");
    promptCard.className = "draw-side-card";
    promptCard.innerHTML = `
      <p class="micro-kicker">${screen.blocks.reflectionPrompt.label}</p>
      <p>${screen.blocks.reflectionPrompt.prompt}</p>
    `;

    if (screen.blocks.reflectionPrompt.options) {
      promptCard.append(
        createOptionGrid(
          screen.blocks.reflectionPrompt.options,
          state.responses.buildIdea[screen.blocks.reflectionPrompt.field.split(".").at(-1)],
          (selectedId) => {
            lessonApp.saveInteraction(screen.screenId, (draft) => {
              draft.responses.buildIdea[screen.blocks.reflectionPrompt.field.split(".").at(-1)] = selectedId;
              return draft;
            });
          },
        ),
      );
    }

    layout.append(promptCard);
  }

  return layout;
}

function renderPairChoiceStage({ lessonApp, screen, state }) {
  const layout = document.createElement("div");
  layout.className = "draw-layout";

  const left = document.createElement("div");
  left.className = "draw-side-card";
  left.innerHTML = `
    <p class="micro-kicker">Surreal move</p>
    <p class="side-card-title">${screen.blocks.pairChoice.left.label}</p>
  `;
  left.append(
    createOptionGrid(
      screen.blocks.pairChoice.left.options,
      state.responses.buildIdea.selectedMoveId,
      (selectedId) => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          draft.responses.buildIdea.selectedMoveId = selectedId;
          draft.progressState = screen.progressOnComplete;
          return draft;
        });
      },
    ),
  );

  const right = document.createElement("div");
  right.className = "draw-side-card";
  right.innerHTML = `
    <p class="micro-kicker">Story seed</p>
    <p class="side-card-title">${screen.blocks.pairChoice.right.label}</p>
  `;
  right.append(
    createOptionGrid(
      screen.blocks.pairChoice.right.options,
      state.responses.buildIdea.selectedStorySeedId,
      (selectedId) => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          draft.responses.buildIdea.selectedStorySeedId = selectedId;
          draft.progressState = screen.progressOnComplete;
          return draft;
        });
      },
    ),
  );

  const reflection = document.createElement("div");
  reflection.className = "draw-side-card";
  reflection.innerHTML = `
    <p class="micro-kicker">${screen.blocks.reflectionPrompt.label}</p>
    <p>${screen.blocks.reflectionPrompt.prompt}</p>
  `;

  const input = document.createElement("textarea");
  input.className = "reflection-textarea";
  input.value = state.responses.buildIdea.conceptSentence;
  input.rows = 4;
  input.placeholder = "A quiet room where one object becomes impossibly large.";
  bindTextareaPersistence(input, (value) => {
    lessonApp.saveInteraction(screen.screenId, (draft) => {
      draft.responses.buildIdea.conceptSentence = value;
      return draft;
    });
  });
  reflection.append(input);

  layout.append(left, right);

  const wrap = document.createElement("div");
  wrap.className = "main-column";
  wrap.append(layout, reflection);
  return wrap;
}

function renderChecklistStage({ lessonApp, screen, state, resolveAgeVariant }) {
  const wrap = document.createElement("div");
  wrap.className = "main-column";

  const card = document.createElement("div");
  card.className = "draw-side-card";
  card.innerHTML = `
    <p class="micro-kicker">Ready check</p>
    <p class="side-card-title">${screen.title}</p>
  `;

  card.append(
    createChipRow(
      screen.blocks.checklist.items,
      state.responses.materials.readyIds,
      (itemId) => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          const selected = draft.responses.materials.readyIds;
          draft.responses.materials.readyIds = selected.includes(itemId)
            ? selected.filter((value) => value !== itemId)
            : [...selected, itemId];
          draft.progressState = screen.progressOnComplete;
          return draft;
        });
      },
    ),
  );

  const helper = document.createElement("p");
  helper.className = "content-helper";
  helper.textContent = resolveAgeVariant(screen.helperText, state.ageGroup);
  card.append(helper);

  if (screen.blocks.materialsNote) {
    const note = document.createElement("div");
    note.className = "teacher-note";
    note.innerHTML = `
      <p class="micro-kicker">${screen.blocks.materialsNote.title}</p>
      <p>${resolveAgeVariant(screen.blocks.materialsNote.body, state.ageGroup)}</p>
      <p class="content-helper">${resolveAgeVariant(screen.blocks.materialsNote.extra, state.ageGroup)}</p>
    `;
    card.append(note);
  }

  wrap.append(card);
  return wrap;
}

function renderReflectionStage({ lessonApp, screen, state }) {
  const wrap = document.createElement("div");
  wrap.className = "main-column";

  const chipCard = document.createElement("div");
  chipCard.className = "draw-side-card";
  chipCard.innerHTML = `
    <p class="micro-kicker">Name the move</p>
    <p class="side-card-title">${screen.blocks.reflection.promptLabel}</p>
  `;
  chipCard.append(
    createChipRow(
      screen.blocks.reflection.chips,
      state.responses.reflection.chips,
      (chipId) => {
        lessonApp.saveInteraction(screen.screenId, (draft) => {
          const selected = draft.responses.reflection.chips;
          draft.responses.reflection.chips = selected.includes(chipId)
            ? selected.filter((value) => value !== chipId)
            : [...selected, chipId];
          draft.progressState = screen.progressOnComplete;
          return draft;
        });
      },
    ),
  );

  const textCard = document.createElement("div");
  textCard.className = "draw-side-card";
  textCard.innerHTML = `
    <p class="micro-kicker">Student Portal note</p>
    <p>${screen.blocks.reflection.prompt}</p>
  `;
  const input = document.createElement("textarea");
  input.className = "reflection-textarea";
  input.value = state.responses.reflection.text;
  input.rows = 5;
  input.placeholder = "I changed the scale of one ordinary thing so the whole room started to feel dreamlike.";
  bindTextareaPersistence(input, (value) => {
    lessonApp.saveInteraction(screen.screenId, (draft) => {
      draft.responses.reflection.text = value;
      return draft;
    });
  });
  textCard.append(input);

  wrap.append(chipCard, textCard);
  return wrap;
}

function renderContinueStage({ screen }) {
  const context = getCurrentLearnerContext();
  const writeback = readWritebackEnvelope();
  const portalMapping = writeback?.portalMapping ?? {};
  const illustrationTrack = portalMapping.track_progress?.illustration ?? null;
  const illustrationBadge = portalMapping.badge_progress?.storyteller ?? null;
  const lessonProgress =
    portalMapping.lesson_progress?.["lfc054-surreal-worlds"] ?? null;

  const wrap = document.createElement("div");
  wrap.className = "main-column";

  const card = document.createElement("div");
  card.className = "continuity-card";
  card.innerHTML = `
    <p class="micro-kicker">Your lesson is saved</p>
    <p>${screen.prompt.teen}</p>
  `;

  const statusGrid = document.createElement("div");
  statusGrid.className = "journey-summary-block";
  statusGrid.innerHTML = `
    <div class="mini-stat"><span>Lesson</span><strong>${lessonProgress?.completed ? "Completed" : "Saved in progress"}</strong></div>
    <div class="mini-stat"><span>Illustration path</span><strong>${illustrationTrack ? `${illustrationTrack.count} / ${illustrationTrack.target}` : "1 lesson started"}</strong></div>
    <div class="mini-stat"><span>Badge progress</span><strong>${illustrationBadge ? `${illustrationBadge.count} / ${illustrationBadge.target}` : "Not linked yet"}</strong></div>
    <div class="mini-stat"><span>Next lesson</span><strong>${illustrationTrack?.next_lesson_id || "Coming next"}</strong></div>
  `;
  card.append(statusGrid);

  const destinationGrid = document.createElement("div");
  destinationGrid.className = "continue-grid";

  const destinations = [
    {
      kicker: "Portal",
      title: context.mode === "portal_code" ? "Open your student portal" : "Student portal later",
      body:
        context.mode === "portal_code"
          ? "Your lesson can continue into your personal path progress and badge record."
          : "If you enter later through your student portal code, this lesson can connect to your personal report and badge path.",
      action: context.mode === "portal_code" ? "Go to Student Portal" : "Portal not linked yet",
      emphasis: context.mode === "portal_code",
      onClick: () => openStudentPortal(),
    },
    {
      kicker: "Portal",
      title: "Keep this in Student Portal",
      body: "Your choices, drawing steps, and reflection can stay connected in your Student Portal as this path grows.",
      action: "Open Student Portal",
      emphasis: true,
      onClick: () => openStudentPortal(),
    },
    {
      kicker: "Badge",
      title: "Grow your illustration badge",
      body: illustrationBadge
        ? `This lesson counts toward your illustration badge. You are currently ${illustrationBadge.count} out of ${illustrationBadge.target} steps into that path.`
        : "This lesson can become part of a longer illustration badge path.",
      action: "Keep growing this badge",
      emphasis: false,
    },
    {
      kicker: "Next Path",
      title: "Continue the illustration path",
      body: illustrationTrack
        ? `You are currently ${illustrationTrack.count} out of ${illustrationTrack.target} lessons into the Illustration Path.`
        : "This lesson is designed to become one step inside a longer illustration learning path.",
      action: illustrationTrack?.next_lesson_id || "Next lesson coming soon",
      emphasis: false,
    },
  ];

  destinations.forEach((item) => {
    const block = document.createElement("div");
    block.className = `continue-card${item.emphasis ? " is-emphasis" : ""}`;
    block.innerHTML = `
      <p class="micro-kicker">${item.kicker}</p>
      <p class="side-card-title">${item.title}</p>
      <p>${item.body}</p>
    `;
    block.append(
      button(item.action, {
        className: item.emphasis ? "footer-button primary" : "ghost-button",
        onClick: item.onClick,
      }),
    );
    destinationGrid.append(block);
  });

  wrap.append(card, destinationGrid);
  return wrap;
}

function createScreenActions(screen) {
  const hooks = screen.systemHooks ?? {};
  const row = document.createElement("div");
  row.className = "mini-action-row";

  if (hooks.aiMode) {
    row.append(
      button(`Ask AI · ${formatHookLabel(hooks.aiMode)}`, {
        className: "ghost-button",
      }),
    );
  }

  if (hooks.uploadPoint) {
    row.append(
      button(`Upload · ${formatHookLabel(hooks.uploadPoint)}`, {
        className: "ghost-button",
      }),
    );
  }

  if (hooks.teacherHelp) {
    row.append(
      button(`Teacher · ${formatHookLabel(hooks.teacherHelp)}`, {
        className: "ghost-button",
      }),
    );
  }

  if (!row.childNodes.length) {
    row.append(
      button("Save this step to Student Portal", {
        className: "ghost-button",
        onClick: () => openStudentPortal(),
      }),
    );
  }

  return row;
}

function createJourneyDraftCard(state) {
  return null;
  const lines = composeJourneyDraft(state);
  const summary = buildJourneySummary(state);
  const card = document.createElement("section");
  card.className = "surface future-card";
  card.innerHTML = `
    <p class="micro-kicker">Journey draft</p>
    <p>${lines.length ? "This is the current lesson data that can later write into My Journey." : "As you choose, think, and draw, this lesson will begin forming a Journey draft."}</p>
  `;

  const summaryBlock = document.createElement("div");
  summaryBlock.className = "journey-summary-block";
  summaryBlock.innerHTML = `
    <div class="mini-stat"><span>Current focus</span><strong>${summary.currentFocus}</strong></div>
    <div class="mini-stat"><span>Real scene</span><strong>${summary.realScene}</strong></div>
    <div class="mini-stat"><span>Surreal move</span><strong>${summary.surrealMove}</strong></div>
    <div class="mini-stat"><span>Mood</span><strong>${summary.mood}</strong></div>
    <div class="mini-stat"><span>Draw steps</span><strong>${summary.drawSteps}</strong></div>
    <div class="mini-stat"><span>Judgment cards</span><strong>${summary.judgmentCards}</strong></div>
    <div class="mini-stat"><span>Uploads</span><strong>${summary.uploadsSaved}</strong></div>
  `;
  card.append(summaryBlock);

  const conceptCard = document.createElement("div");
  conceptCard.className = "journey-summary-note";
  conceptCard.innerHTML = `
    <p class="micro-kicker">Concept sentence</p>
    <p>${summary.concept}</p>
  `;
  card.append(conceptCard);

  const reflectionCard = document.createElement("div");
  reflectionCard.className = "journey-summary-note";
  reflectionCard.innerHTML = `
    <p class="micro-kicker">Reflection preview</p>
    <p>${summary.reflection}</p>
  `;
  card.append(reflectionCard);

  if (lines.length) {
    const list = document.createElement("div");
    list.className = "journey-draft-list";
    lines.slice(0, 6).forEach((line) => {
      const row = document.createElement("div");
      row.className = "mini-stat";
      row.innerHTML = `<span>${line}</span><strong>saved</strong>`;
      list.append(row);
    });
    card.append(list);
  }

  return card;
}

function createWritebackReviewCard() {
  return null;
}

function renderDrawStage({ lessonApp, screen, state }) {
  const wrap = document.createElement("div");
  wrap.className = "stage-layout";

  const segments = screen.blocks.drawSegments;
  const activeSegment = segments[0];
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

  const mediaNote = document.createElement("div");
  mediaNote.className = "media-note";
  mediaNote.innerHTML = `
    <p class="micro-kicker">Video placement</p>
    <p>${activeSegment.teacherMedia.sourceLine || "Your recorded teacher video for this drawing step appears here."}</p>
  `;
  media.append(mediaNote);

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
      "Finish this stage",
      {
        className: "mini-action",
        onClick: () => {
          lessonApp.saveInteraction(screen.screenId, (draft) => {
            const completed = draft.responses.draw.completedSegmentIds;
            if (!completed.includes(activeSegment.segmentId)) {
              draft.responses.draw.completedSegmentIds = [...completed, activeSegment.segmentId];
            }
            draft.progressState = screen.progressOnComplete;
            return draft;
          });
        },
      },
    ),
  );
  controls.append(controlRow);

  const uploadCard = createUploadCard({ lessonApp, screen, state });

  const continuity = document.createElement("div");
  continuity.className = "continuity-card";
  continuity.innerHTML = `
    <p class="micro-kicker">${screen.blocks.futureContinuity.label}</p>
    <p>${screen.blocks.futureContinuity.aiScan}</p>
    <p style="margin-top:8px;">${screen.blocks.futureContinuity.teacherReview}</p>
    <p style="margin-top:8px;">${screen.blocks.futureContinuity.journey}</p>
  `;

  side.append(action, companion, checkpoint, controls);
  if (uploadCard) {
    side.append(uploadCard);
  }
  side.append(continuity);
  const questCard = createThinkingQuestCard({
    lessonApp,
    screen,
    state,
    ageGroup: state.ageGroup,
  });
  if (questCard) {
    side.append(questCard);
  }
  layout.append(media, side);

  wrap.append(progress, layout);
  return wrap;
}

function renderStageBody({ lessonApp, screen, state, resolveAgeVariant }) {
  if (screen.uiKind === "welcome") {
    const card = document.createElement("div");
    card.className = "teacher-note";
    card.innerHTML = `
      <p class="micro-kicker">${screen.blocks.heroMessage.eyebrow}</p>
      <p>${screen.blocks.heroMessage.body}</p>
    `;
    return card;
  }
  if (screen.uiKind === "look") {
    const stage = renderLookStage({ lessonApp, screen, state, resolveAgeVariant });
    const questCard = createThinkingQuestCard({
      lessonApp,
      screen,
      state,
      ageGroup: state.ageGroup,
    });
    if (questCard) {
      stage.append(questCard);
    }
    return stage;
  }
  if (screen.uiKind === "understand") {
    return renderUnderstandStage({ lessonApp, screen, state, resolveAgeVariant });
  }
  if (screen.uiKind === "choice") {
    return renderChoiceStage({ lessonApp, screen, state, resolveAgeVariant });
  }
  if (screen.uiKind === "pair_choice") {
    return renderPairChoiceStage({ lessonApp, screen, state, resolveAgeVariant });
  }
  if (screen.uiKind === "checklist") {
    return renderChecklistStage({ lessonApp, screen, state, resolveAgeVariant });
  }
  if (screen.uiKind === "reflection") {
    return renderReflectionStage({ lessonApp, screen, state, resolveAgeVariant });
  }
  if (screen.uiKind === "continue") {
    return renderContinueStage({ screen });
  }
  return renderDrawStage({ lessonApp, screen, state, resolveAgeVariant });
}

function renderPrototype({ root, lessonApp, lessonMeta, resolveAgeVariant }) {
  const state = lessonApp.getLessonState();
  persistWritebackEnvelope(state);
  const screen = lessonApp.getCurrentScreen();
  const ageGroup = state.ageGroup;
  const progressPercent = getProgressPercent(lessonMeta, screen);
  const completionReady = lessonApp.getScreenCompletion(screen.screenId);
  const canSkip = Boolean(screen.skipAllowed);
  const assistantMode = pickAssistantMode(screen);
  const progressLabel = getStudentProgressLabel(screen, lessonMeta);

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

  const heroBottom = document.createElement("div");
  heroBottom.className = "hero-bottom";

  const progressWrap = document.createElement("div");
  progressWrap.className = "progress-wrap";
  progressWrap.innerHTML = `
    <div class="progress-topline">
      <p class="progress-title">${progressLabel}</p>
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
  const helperMarkup =
    screen.uiKind === "look"
      ? ""
      : `<p class="content-helper">${resolveAgeVariant(screen.helperText, ageGroup)}</p>`;

  contentTop.innerHTML = `
    <div>
      <p class="stage-label">${screen.partLabel}</p>
      <h2 class="content-title">${screen.title}</h2>
      <p class="content-prompt">${resolveAgeVariant(screen.prompt, ageGroup)}</p>
      ${helperMarkup}
    </div>
    <div class="stage-pill"><p class="stage-label">LFC remains central</p></div>
  `;

  content.append(contentTop);
  content.append(renderStageBody({ lessonApp, screen, state, resolveAgeVariant }));

  const footer = document.createElement("section");
  footer.className = "surface footer-card";

  const footerCopy = document.createElement("div");
  footerCopy.className = "footer-copy";
  footerCopy.innerHTML = `
    <p class="save-line">${completionReady ? screen.saveMessage : "This lesson stays ready for Student Portal, feedback, and portal continuity."}</p>
  `;

  const footerActions = document.createElement("div");
  footerActions.className = "footer-actions";
  footerActions.append(
    button(screen.stepNumber === lessonMeta.totalSteps ? "Finish this stage" : "Continue", {
      className: "footer-button primary",
      disabled: !completionReady && !canSkip,
      onClick: () => {
        if (completionReady) {
          lessonApp.completeScreen(screen.screenId);
          return;
        }
        lessonApp.skipScreen(screen.screenId);
      },
    }),
  );
  if (!completionReady && canSkip) {
    footerActions.append(
      button("Skip for now", {
        className: "footer-button",
        onClick: () => lessonApp.skipScreen(screen.screenId),
      }),
    );
  }
  footerActions.append(
    button("Start over from beginning", {
      className: "footer-button",
      onClick: () => {
        clearLessonDraftData(lessonMeta);
        lessonApp.resetLesson();
      },
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
        <p class="assistant-title">Artchi stays nearby</p>
        <div class="assistant-mode">
          <span class="assistant-mode-dot"></span>
          <p class="assistant-mode-label">${assistantMode.label}</p>
        </div>
      </div>
    </div>
    <p>${assistantMode.note}</p>
  `;
  const assistantActions = document.createElement("div");
  assistantActions.className = "mini-action-row";
  assistantActions.append(
    button("Open Student Portal", {
      className: "ghost-button",
      onClick: () => openStudentPortal(),
    }),
  );
  assistant.append(assistantActions);

  main.append(hero, content, footer);
  const writebackCard = createWritebackReviewCard();
  side.append(assistant);
  if (writebackCard) {
    side.append(writebackCard);
  }
  shell.append(main, side);
  root.replaceChildren(shell);
}

function startLessonApp() {
  try {
    bootstrapApp({
      root: appRoot,
      lessonPackage: adaptedLfc054LessonPackage,
      initialRunState: adaptedLfc054InitialRunState,
      render: renderPrototype,
      analytics,
    });
  } catch (error) {
    console.error("[lfc054] lesson launch failed", error);

    const shell = document.createElement("section");
    shell.className = "lesson-gate-shell";

    const card = document.createElement("div");
    card.className = "lesson-gate-card";
    card.innerHTML = `
      <div class="lesson-gate-kicker">Launch paused</div>
      <p class="lesson-gate-lesson">Illustration Lab</p>
      <h1 class="lesson-gate-title">This lesson needs one more fix.</h1>
      <div class="lesson-gate-error">
        ${error?.message ? String(error.message) : "The lesson could not open."}
      </div>
      <p class="lesson-gate-hint">Please refresh once. If it still stops here, send this message to FEI TeamArt.</p>
    `;

    shell.append(card);
    appRoot.replaceChildren(shell);
  }
}

renderLessonGate({
  root: appRoot,
  onSuccess: startLessonApp,
});

ensureGuestLearnerContext();
