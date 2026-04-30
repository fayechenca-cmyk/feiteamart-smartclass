const STORAGE_KEY = "fei.smartclass.profile.v1";

function canUseStorage() {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch (error) {
    return false;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readStorage() {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function writeStorage(profile) {
  if (!canUseStorage()) {
    return profile;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

function createProfileShape({
  learnerId,
  name,
  ageGroup,
  tier = "guest",
  email = "",
  currentLessonId = "",
  currentScreenId = "",
  totalXP = 0,
  completedLessonIds = [],
  createdAt = new Date().toISOString(),
}) {
  return {
    learnerId,
    name,
    ageGroup,
    tier,
    email,
    currentLessonId,
    currentScreenId,
    totalXP,
    completedLessonIds,
    createdAt,
    updatedAt: new Date().toISOString(),
  };
}

function generateLearnerId() {
  return `learner_${Math.random().toString(36).slice(2, 10)}`;
}

export function getProfile() {
  return readStorage();
}

export function createGuest({ name = "Guest", ageGroup = "teen" } = {}) {
  const existing = getProfile();
  if (existing) {
    return existing;
  }

  const profile = createProfileShape({
    learnerId: generateLearnerId(),
    name,
    ageGroup,
  });

  return writeStorage(profile);
}

export function updateProfile(patch) {
  const current = getProfile();
  const next = {
    ...(current ?? createProfileShape({ learnerId: generateLearnerId(), name: "Guest", ageGroup: "teen" })),
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  return writeStorage(next);
}

export function upgradeToFreeIntro(email) {
  return updateProfile({
    email,
    tier: "free_intro",
  });
}

export function setMemberState(memberPayload = {}) {
  return updateProfile({
    tier: "member",
    ...memberPayload,
  });
}

export function setCurrentLesson({ lessonId, screenId }) {
  return updateProfile({
    currentLessonId: lessonId,
    currentScreenId: screenId,
  });
}

export function markLessonComplete({ lessonId, xpEarned = 0 }) {
  const current = getProfile() ?? createGuest();
  const completedLessonIds = current.completedLessonIds.includes(lessonId)
    ? current.completedLessonIds
    : [...current.completedLessonIds, lessonId];

  return updateProfile({
    completedLessonIds,
    totalXP: current.totalXP + xpEarned,
    currentLessonId: lessonId,
  });
}

export function resetForProfileSwitch() {
  if (canUseStorage()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function clearProfile() {
  resetForProfileSwitch();
}

export function getProfileSnapshot() {
  return clone(getProfile());
}
