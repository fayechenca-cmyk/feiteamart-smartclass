import { createGuest, getProfile } from "./profile.js";
import { createLessonApp, resolveAgeVariant } from "./lesson-app.js";

function getRouteContext() {
  const url = new URL(window.location.href);
  return {
    routeType: "lesson",
    lessonId: url.searchParams.get("lessonId") ?? "",
    slug: url.pathname.split("/").filter(Boolean).at(-1) ?? "",
    urlParams: Object.fromEntries(url.searchParams.entries()),
  };
}

export function bootstrapApp({
  root,
  lessonPackage,
  initialRunState,
  render,
  analytics,
}) {
  const lessonApp = createLessonApp({
    lessonPackage,
    initialRunState,
    analytics,
  });

  const lessonMeta = lessonApp.getLessonMeta();
  const routeContext = getRouteContext();
  let profile = getProfile();

  // Temporary Track 1 fallback until core/welcome-page.js is extracted.
  if (!profile) {
    profile = createGuest({
      name: "Guest",
      ageGroup: lessonPackage.defaults?.ageGroup ?? initialRunState.ageGroup ?? "teen",
    });
  }

  if (profile.currentLessonId === lessonMeta.lessonId && profile.currentScreenId) {
    lessonApp.resumeLesson({ profile });
  } else {
    lessonApp.startLesson({ profile });
  }

  const renderApp = () => {
    render({
      root,
      lessonApp,
      lessonMeta,
      routeContext,
      resolveAgeVariant,
    });
  };

  lessonApp.subscribe(renderApp);
  renderApp();

  return {
    lessonApp,
    lessonMeta,
    routeContext,
    resolveAgeVariant,
  };
}
