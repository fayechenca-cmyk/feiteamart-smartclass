import {
  getProfile,
  markLessonComplete,
  setCurrentLesson,
  updateProfile,
} from "./profile.js";
import { canAccessScreen, getAccessState, getLockState } from "./access-control.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function resolveAgeVariant(value, ageGroup) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  if ("kids" in value || "teen" in value || "adult" in value) {
    return value[ageGroup] ?? value.teen ?? value.kids ?? value.adult;
  }

  return value;
}

function getValueAtPath(target, path) {
  return path.split(".").reduce((value, part) => value?.[part], target);
}

function normalizeLessonPackage(lessonPackage) {
  const screens = lessonPackage.screens.map((screen) => ({
    ...screen,
  }));

  return {
    lessonMeta: {
      lessonId: lessonPackage.lesson.lessonId,
      familyId: lessonPackage.lesson.lessonFamily,
      title: lessonPackage.lesson.title,
      shortTitle: lessonPackage.lesson.shortTitle,
      slug: lessonPackage.lesson.slug,
      totalSteps: lessonPackage.lesson.totalSteps,
      ageGroups: lessonPackage.lesson.ageGroups,
      badge: lessonPackage.lesson.badge,
      screens,
    },
    defaults: lessonPackage.defaults ?? {},
    accessConfig: lessonPackage.accessConfig ?? {
      accessModel: "free",
      previewScreenIds: [],
    },
    screens,
    raw: lessonPackage,
  };
}

function createStore(initialState) {
  let state = clone(initialState);
  const listeners = new Set();

  return {
    getState() {
      return state;
    },
    update(updater) {
      const draft = clone(state);
      const next = typeof updater === "function" ? updater(draft) : { ...draft, ...updater };
      state = next;
      listeners.forEach((listener) => listener(clone(state)));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function evaluateCompletionRule(screen, state) {
  const rule = screen.completionRule ?? {};

  switch (rule.type) {
    case "always":
      return true;
    case "single_choice":
    case "single_choice_with_optional_chips":
      return Boolean(getValueAtPath(state, rule.field));
    case "required_pair":
      return rule.fields.every((field) => Boolean(getValueAtPath(state, field)));
    case "min_checks": {
      const values = getValueAtPath(state, rule.field) ?? [];
      return values.length >= (rule.minRequired ?? 1);
    }
    case "reflection_submit": {
      const chips = getValueAtPath(state, rule.chipField) ?? [];
      const text = getValueAtPath(state, rule.textField) ?? "";
      return chips.length > 0 && text.trim().length > 0;
    }
    default:
      return true;
  }
}

function getScreenById(lessonMeta, screenId) {
  return lessonMeta.screens.find((screen) => screen.screenId === screenId) ?? lessonMeta.screens[0];
}

function getScreenByStep(lessonMeta, currentStep) {
  return lessonMeta.screens.find((screen) => screen.stepNumber === currentStep) ?? lessonMeta.screens[0];
}

function getNextScreenId(lessonMeta, currentScreenId) {
  const currentIndex = lessonMeta.screens.findIndex((screen) => screen.screenId === currentScreenId);
  const nextScreen = lessonMeta.screens[currentIndex + 1];
  return nextScreen?.screenId ?? "";
}

function createInitialLessonState({ lessonMeta, initialRunState, profile, accessState }) {
  const fallbackScreen = getScreenByStep(lessonMeta, initialRunState.currentStep).screenId;
  const resumedScreen =
    profile?.currentLessonId === lessonMeta.lessonId && profile?.currentScreenId
      ? profile.currentScreenId
      : "";

  return {
    ...clone(initialRunState),
    learnerId: profile?.learnerId ?? initialRunState.learnerId ?? "",
    lessonId: lessonMeta.lessonId,
    familyId: lessonMeta.familyId,
    ageGroup: profile?.ageGroup ?? initialRunState.ageGroup ?? "teen",
    currentScreenId: resumedScreen || initialRunState.currentScreenId || fallbackScreen,
    currentStep:
      getScreenById(lessonMeta, resumedScreen || initialRunState.currentScreenId || fallbackScreen)
        .stepNumber,
    completedScreenIds: clone(initialRunState.completedScreenIds ?? []),
    currentLessonXP: initialRunState.currentLessonXP ?? 0,
    isLessonComplete: initialRunState.isLessonComplete ?? false,
    accessState,
  };
}

export function createLessonApp({
  lessonPackage,
  initialRunState,
  analytics = { track() {} },
}) {
  const normalizedLesson = normalizeLessonPackage(lessonPackage);
  const profile = getProfile();
  const accessState = getAccessState({
    lessonMeta: normalizedLesson.lessonMeta,
    accessConfig: normalizedLesson.accessConfig,
    profile,
  });

  const store = createStore(
    createInitialLessonState({
      lessonMeta: normalizedLesson.lessonMeta,
      initialRunState,
      profile,
      accessState,
    }),
  );

  function syncProfilePointer(screenId) {
    setCurrentLesson({
      lessonId: normalizedLesson.lessonMeta.lessonId,
      screenId,
    });
  }

  function getLessonState() {
    return store.getState();
  }

  function getCurrentScreen() {
    return getScreenById(normalizedLesson.lessonMeta, store.getState().currentScreenId);
  }

  function getLessonMeta() {
    return normalizedLesson.lessonMeta;
  }

  function getScreenCompletion(screenId = getCurrentScreen().screenId) {
    const screen = getScreenById(normalizedLesson.lessonMeta, screenId);
    return evaluateCompletionRule(screen, store.getState());
  }

  function loadLesson() {
    return normalizedLesson;
  }

  function startLesson({ profile: learnerProfile }) {
    const firstScreenId = normalizedLesson.lessonMeta.screens[0].screenId;
    store.update((draft) => {
      draft.learnerId = learnerProfile?.learnerId ?? draft.learnerId;
      draft.ageGroup = learnerProfile?.ageGroup ?? draft.ageGroup;
      draft.currentScreenId = firstScreenId;
      draft.currentStep = getScreenById(normalizedLesson.lessonMeta, firstScreenId).stepNumber;
      draft.accessState = getAccessState({
        lessonMeta: normalizedLesson.lessonMeta,
        accessConfig: normalizedLesson.accessConfig,
        profile: learnerProfile,
      });
      return draft;
    });
    syncProfilePointer(firstScreenId);
    analytics.track("lesson_started", {
      lessonId: normalizedLesson.lessonMeta.lessonId,
      familyId: normalizedLesson.lessonMeta.familyId,
    });
    return getLessonState();
  }

  function resumeLesson({ profile: learnerProfile }) {
    const access = getAccessState({
      lessonMeta: normalizedLesson.lessonMeta,
      accessConfig: normalizedLesson.accessConfig,
      profile: learnerProfile,
    });
    const requestedScreenId =
      learnerProfile?.currentLessonId === normalizedLesson.lessonMeta.lessonId
        ? learnerProfile.currentScreenId
        : normalizedLesson.lessonMeta.screens[0].screenId;
    const allowedScreenId = canAccessScreen({
      lessonMeta: normalizedLesson.lessonMeta,
      accessConfig: normalizedLesson.accessConfig,
      profile: learnerProfile,
      screenId: requestedScreenId,
    })
      ? requestedScreenId
      : access.allowedScreenIds.at(-1) ?? normalizedLesson.lessonMeta.screens[0].screenId;

    store.update((draft) => {
      draft.learnerId = learnerProfile?.learnerId ?? draft.learnerId;
      draft.ageGroup = learnerProfile?.ageGroup ?? draft.ageGroup;
      draft.currentScreenId = allowedScreenId;
      draft.currentStep = getScreenById(normalizedLesson.lessonMeta, allowedScreenId).stepNumber;
      draft.accessState = access;
      return draft;
    });
    syncProfilePointer(allowedScreenId);
    analytics.track("lesson_resumed", {
      lessonId: normalizedLesson.lessonMeta.lessonId,
      familyId: normalizedLesson.lessonMeta.familyId,
      screenId: allowedScreenId,
    });
    return getLessonState();
  }

  function goToScreen(screenId) {
    const profileSnapshot = getProfile();
    const lockState = getLockState({
      lessonMeta: normalizedLesson.lessonMeta,
      accessConfig: normalizedLesson.accessConfig,
      profile: profileSnapshot,
      screenId,
    });

    if (lockState.isLocked) {
      store.update((draft) => {
        draft.accessState = lockState;
        return draft;
      });
      analytics.track("lesson_screen_locked", {
        lessonId: normalizedLesson.lessonMeta.lessonId,
        familyId: normalizedLesson.lessonMeta.familyId,
        screenId,
        reason: lockState.lockReason,
      });
      return false;
    }

    store.update((draft) => {
      draft.currentScreenId = screenId;
      draft.currentStep = getScreenById(normalizedLesson.lessonMeta, screenId).stepNumber;
      draft.accessState = lockState;
      return draft;
    });
    syncProfilePointer(screenId);
    analytics.track("screen_viewed", {
      lessonId: normalizedLesson.lessonMeta.lessonId,
      familyId: normalizedLesson.lessonMeta.familyId,
      screenId,
    });
    return true;
  }

  function saveInteraction(screenId, interactionPayload) {
    store.update((draft) => {
      if (typeof interactionPayload === "function") {
        return interactionPayload(draft) ?? draft;
      }

      return {
        ...draft,
        ...interactionPayload,
      };
    });

    analytics.track("screen_interaction_saved", {
      lessonId: normalizedLesson.lessonMeta.lessonId,
      familyId: normalizedLesson.lessonMeta.familyId,
      screenId,
    });

    return getLessonState();
  }

  function completeLesson() {
    const state = getLessonState();
    if (state.isLessonComplete) {
      return state;
    }

    const earnedAt = new Date().toISOString();
    const finalScreenId = getCurrentScreen().screenId;
    store.update((draft) => {
      draft.progressState = "completed";
      draft.reflectionState = "completed";
      draft.badgeState = "earned";
      if (draft.badge) {
        draft.badge.earned = true;
        draft.badge.earnedAt = earnedAt;
      }
      if (draft.responses?.screen5) {
        draft.responses.screen5.completedAt = earnedAt;
      }
      draft.isLessonComplete = true;
      return draft;
    });

    setCurrentLesson({
      lessonId: normalizedLesson.lessonMeta.lessonId,
      screenId: finalScreenId,
    });

    markLessonComplete({
      lessonId: normalizedLesson.lessonMeta.lessonId,
      xpEarned: state.currentLessonXP,
    });

    analytics.track("lesson_completed", {
      lessonId: normalizedLesson.lessonMeta.lessonId,
      familyId: normalizedLesson.lessonMeta.familyId,
      totalXP: state.currentLessonXP,
    });

    return getLessonState();
  }

  function completeScreen(screenId, interactionPayload = null) {
    if (interactionPayload) {
      saveInteraction(screenId, interactionPayload);
    }

    const screen = getScreenById(normalizedLesson.lessonMeta, screenId);
    if (!evaluateCompletionRule(screen, getLessonState())) {
      return false;
    }

    store.update((draft) => {
      if (!draft.completedScreenIds.includes(screenId)) {
        draft.completedScreenIds.push(screenId);
        draft.currentLessonXP += screen.xpValue ?? 0;
      }
      draft.progressState = screen.progressOnComplete ?? draft.progressState;
      return draft;
    });

    updateProfile({
      currentLessonId: normalizedLesson.lessonMeta.lessonId,
      currentScreenId: screenId,
    });

    analytics.track("screen_completed", {
      lessonId: normalizedLesson.lessonMeta.lessonId,
      familyId: normalizedLesson.lessonMeta.familyId,
      screenId,
      xpValue: screen.xpValue ?? 0,
    });

    const nextScreenId = getNextScreenId(normalizedLesson.lessonMeta, screenId);
    if (!nextScreenId) {
      completeLesson();
      return true;
    }

    goToScreen(nextScreenId);
    return true;
  }

  return {
    loadLesson,
    getLessonState,
    getCurrentScreen,
    getLessonMeta,
    getScreenCompletion,
    startLesson,
    resumeLesson,
    goToScreen,
    saveInteraction,
    completeScreen,
    completeLesson,
    subscribe: store.subscribe,
  };
}
