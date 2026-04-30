function normalizeAccessConfig(accessConfig = {}) {
  return {
    accessModel: accessConfig.accessModel ?? "free",
    previewScreenIds: accessConfig.previewScreenIds ?? [],
    resumeAfterUnlock: accessConfig.resumeAfterUnlock ?? true,
  };
}

function isMember(profile) {
  return profile?.tier === "member";
}

export function getAccessState({ lessonMeta, accessConfig = {}, profile }) {
  const normalized = normalizeAccessConfig(accessConfig);
  const allScreenIds = lessonMeta.screens.map((screen) => screen.screenId);

  if (normalized.accessModel === "free") {
    return {
      tier: profile?.tier ?? "guest",
      accessModel: normalized.accessModel,
      isLocked: false,
      isPreviewMode: false,
      canUpgrade: false,
      allowedScreenIds: allScreenIds,
      lockReason: "",
      resumeTargetScreenId: profile?.currentScreenId || allScreenIds[0],
    };
  }

  if (normalized.accessModel === "member_only" && !isMember(profile)) {
    return {
      tier: profile?.tier ?? "guest",
      accessModel: normalized.accessModel,
      isLocked: true,
      isPreviewMode: false,
      canUpgrade: true,
      allowedScreenIds: [],
      lockReason: "member_required",
      resumeTargetScreenId: allScreenIds[0],
    };
  }

  if (normalized.accessModel === "preview_then_member" && !isMember(profile)) {
    const allowedScreenIds = normalized.previewScreenIds.length
      ? normalized.previewScreenIds
      : [allScreenIds[0]];

    return {
      tier: profile?.tier ?? "guest",
      accessModel: normalized.accessModel,
      isLocked: false,
      isPreviewMode: true,
      canUpgrade: true,
      allowedScreenIds,
      lockReason: "",
      resumeTargetScreenId: allowedScreenIds[0],
    };
  }

  return {
    tier: profile?.tier ?? "guest",
    accessModel: normalized.accessModel,
    isLocked: false,
    isPreviewMode: false,
    canUpgrade: normalized.accessModel !== "free",
    allowedScreenIds: allScreenIds,
    lockReason: "",
    resumeTargetScreenId: profile?.currentScreenId || allScreenIds[0],
  };
}

export function canEnterLesson({ lessonMeta, accessConfig = {}, profile }) {
  const state = getAccessState({ lessonMeta, accessConfig, profile });
  if (state.accessModel === "member_only" && state.isLocked) {
    return false;
  }
  return true;
}

export function canAccessScreen({ lessonMeta, accessConfig = {}, profile, screenId }) {
  const state = getAccessState({ lessonMeta, accessConfig, profile });
  return state.allowedScreenIds.includes(screenId);
}

export function getLockState({ lessonMeta, accessConfig = {}, profile, screenId }) {
  const state = getAccessState({ lessonMeta, accessConfig, profile });
  return {
    ...state,
    requestedScreenId: screenId,
    isLocked: !state.allowedScreenIds.includes(screenId),
    lockReason: state.allowedScreenIds.includes(screenId) ? "" : state.lockReason || "screen_locked",
  };
}

export function applyUnlockSignal(unlockPayload = {}, profileApi = null) {
  if (!unlockPayload?.isUnlocked) {
    return null;
  }

  if (profileApi?.setMemberState) {
    return profileApi.setMemberState(unlockPayload.profilePatch ?? {});
  }

  return unlockPayload;
}

export function getPostUnlockResumeTarget({ lessonState, accessState }) {
  if (!lessonState) {
    return accessState.resumeTargetScreenId;
  }

  if (
    accessState.allowedScreenIds.includes(lessonState.currentScreenId) ||
    !accessState.isPreviewMode
  ) {
    return lessonState.currentScreenId;
  }

  return accessState.allowedScreenIds.at(-1) ?? accessState.resumeTargetScreenId;
}
