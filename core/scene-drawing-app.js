/* ═══════════════════════════════════════════════════════════════════════════
 *  FEI TeamArt · Scene Drawing — shared engine
 *
 *  WHAT THIS FILE IS
 *  A reusable renderer. It knows nothing about any specific lesson — it only
 *  knows how to turn a COURSE object (see data model below) into the actual
 *  step-by-step learning screens.
 *
 *  HOW TO ADD A NEW LESSON (no engine changes needed)
 *  1. Copy /scene-drawing/lesson-1-one-point-street.js
 *  2. Rename the const and fill in title / steps / etc.
 *  3. Add the new lesson object into COURSE.lessons in course-data.js
 *  4. Add a <script src="..."> tag for it next to the others in
 *     scene-drawing/index.html and scene-drawing/lesson/index.html
 *  That's it — the engine, the cards, the buttons, the progress rail all
 *  update automatically because they only ever read from COURSE.
 *
 *  DATA MODEL (matches Faye's spec, June 2026)
 *  Course   { id, title, subtitle, description, materials[], lessons[] }
 *  Lesson   { id, title, lessonGoal, steps[], finalArtworkGoal,
 *             reflectionQuestions[], completionBadge }
 *  Step     { stepNumber, title, shortExplanation, videoPlaceholder,
 *             imagePlaceholder, studentTask, teacherTip, checkPoint }
 *
 *  Each Lesson is data only — it never contains layout or HTML. All
 *  rendering lives here, once, shared by every current and future lesson.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ───────────────────────────────────────────────────────────────────────────
// localStorage keys (namespaced separately from Foundation A's
// fei_user_profile / fei_thinking_journal — Scene Drawing tracks its own
// per-lesson step progress and reflection answers independently)
// ───────────────────────────────────────────────────────────────────────────
const SCENE_DRAWING_PROGRESS_KEY = 'fei_scene_drawing_progress';

// Tracks the most recently scheduled "ambient" Artchi cheer timeout (step
// advance / interactive hint / lesson complete) so a fast click — either
// rapid step navigation or pressing Finish right after uploading — can
// cancel anything still pending instead of letting it fire later on top of
// whatever bubble the next action shows. Deliberate cheers triggered by an
// explicit user action (e.g. the validation message in
// completeSceneDrawingLesson) are NOT run through this timer, since they
// should always win over an ambient one.
let sceneDrawingPendingCheerTimeout = null;
function sceneDrawingScheduleCheer(line, delay, duration) {
  if (sceneDrawingPendingCheerTimeout) clearTimeout(sceneDrawingPendingCheerTimeout);
  sceneDrawingPendingCheerTimeout = setTimeout(() => {
    sceneDrawingPendingCheerTimeout = null;
    if (typeof showArtchiBubble === 'function') showArtchiBubble(line, duration);
  }, delay);
}
function sceneDrawingCancelPendingCheer() {
  if (sceneDrawingPendingCheerTimeout) {
    clearTimeout(sceneDrawingPendingCheerTimeout);
    sceneDrawingPendingCheerTimeout = null;
  }
}

function sceneDrawingLoadProgress() {
  try {
    return JSON.parse(localStorage.getItem(SCENE_DRAWING_PROGRESS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function sceneDrawingSaveProgress(progress) {
  try {
    localStorage.setItem(SCENE_DRAWING_PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Scene Drawing: could not save progress', e);
  }
}

function sceneDrawingGetLessonProgress(lessonId) {
  const all = sceneDrawingLoadProgress();
  return all[lessonId] || { currentStep: 0, completedSteps: [], checks: {}, reflections: {}, submitted: false, badgeClaimed: false };
}

function sceneDrawingSetLessonProgress(lessonId, lessonProgress) {
  const all = sceneDrawingLoadProgress();
  all[lessonId] = lessonProgress;
  sceneDrawingSaveProgress(all);
}

// ───────────────────────────────────────────────────────────────────────────
// SECTION 1 · COURSE OVERVIEW PAGE
// Renders into a container with id="course-overview-root"
// ───────────────────────────────────────────────────────────────────────────
function renderCourseOverview(course) {
  const materialIcons = {
    'pencil': '✏️', 'eraser': '🧹', 'ruler': '📏', 'marker': '🖊️', 'paper': '📄'
  };
  function iconFor(label) {
    const l = label.toLowerCase();
    if (l.includes('pencil')) return materialIcons.pencil;
    if (l.includes('eraser')) return materialIcons.eraser;
    if (l.includes('ruler')) return materialIcons.ruler;
    if (l.includes('marker')) return materialIcons.marker;
    if (l.includes('paper')) return materialIcons.paper;
    return '🎨';
  }

  const materialsHtml = (course.materials || []).map(m =>
    `<div class="material-chip"><span class="material-chip-icon">${iconFor(m)}</span>${m}</div>`
  ).join('');

  const lessonCardsHtml = course.lessons.map((lesson, idx) => {
    const progress = sceneDrawingGetLessonProgress(lesson.id);
    const totalSteps = lesson.steps.length;
    const doneCount = progress.completedSteps.length;
    const isComplete = progress.submitted;
    const pct = totalSteps ? Math.round((doneCount / totalSteps) * 100) : 0;
    const statusLabel = isComplete ? '✓ Complete' : (doneCount > 0 ? 'In progress' : 'Not started');
    const statusClass = isComplete ? 'done' : '';

    return `
      <a class="lesson-card" href="lesson/?id=${lesson.id}">
        <div class="lesson-card-top">
          <div class="lesson-card-number">Lesson ${idx + 1}</div>
          <div class="lesson-card-status ${statusClass}">${statusLabel}</div>
        </div>
        <div class="lesson-card-title">${lesson.title}</div>
        <div class="lesson-card-desc">${lesson.lessonGoalShort || ''}</div>
        <div class="lesson-card-meta">
          <span class="lesson-card-meta-item">📋 ${totalSteps} steps</span>
        </div>
        <div class="lesson-card-progress"><div class="lesson-card-progress-fill" style="width:${pct}%;"></div></div>
      </a>
    `;
  }).join('');

  const courseBadgeHtml = typeof renderCourseBadgeCard === 'function' ? renderCourseBadgeCard() : '';

  return `
    <div class="course-hero">
      <div class="course-kicker">${course.subtitle || ''}</div>
      <div class="course-title">${course.title}</div>
      <div class="course-desc">${course.description}</div>
      <div class="materials-strip">${materialsHtml}</div>
    </div>
    <div class="lesson-grid">
      ${courseBadgeHtml}
      ${lessonCardsHtml}
      <button class="btn btn-ghost" onclick="if(typeof openMyJourney === 'function') openMyJourney(); else if(typeof showArtchiBubble === 'function') showArtchiBubble('My Journey opens from the main app menu ✨', 2600);">View in My Journey →</button>
    </div>
    <aside class="side-panel">${typeof sidePanelMarkup === 'function' ? sidePanelMarkup() : ''}</aside>
  `;
}

// ───────────────────────────────────────────────────────────────────────────
// SECTION 2 · LESSON DETAIL PAGE (intro screen before stepping through)
// Renders into a container with id="lesson-detail-root"
// ───────────────────────────────────────────────────────────────────────────
function renderLessonDetail(lesson, lessonIndex) {
  const progress = sceneDrawingGetLessonProgress(lesson.id);
  const hasStarted = progress.completedSteps.length > 0;
  const startLabel = hasStarted ? 'Continue lesson →' : 'Start lesson →';

  return `
    <div class="course-hero" style="padding-bottom: 4px;">
      <div class="crumb"><a href="../">Scene Drawing</a> <span class="sep">/</span> Lesson ${lessonIndex + 1}</div>
      <div class="course-title">${lesson.title}</div>
      <div class="course-desc">${lesson.lessonGoal}</div>
    </div>
    <div class="step-card">
      <div class="step-kicker">📋 What you'll need</div>
      <div class="step-explanation" style="margin-bottom:0;">${lesson.steps.length} guided steps · pencil, eraser, ruler, grey marker, paper</div>
    </div>
    <button class="btn btn-ink" style="margin-bottom: 10px;" onclick="goToStep(${progress.completedSteps.length})">${startLabel}</button>
    <a class="btn btn-ghost" href="../" style="display:block; text-align:center;">← Back to all lessons</a>
    <aside class="side-panel">${typeof sidePanelMarkup === 'function' ? sidePanelMarkup() : ''}</aside>
  `;
}

// ───────────────────────────────────────────────────────────────────────────
// SECTION 3 · STEP-BY-STEP LEARNING VIEW
// One step rendered at a time into id="step-content", plus a progress rail
// and a Final Artwork / Upload / Reflection / Badge sequence after the
// last teaching step.
// ───────────────────────────────────────────────────────────────────────────
function renderProgressRail(lesson, activeIndex) {
  const total = lesson.steps.length + 1; // +1 = final wrap-up screen
  const progress = sceneDrawingGetLessonProgress(lesson.id);
  const dots = [];
  for (let i = 0; i < total; i++) {
    let cls = '';
    if (progress.completedSteps.includes(i)) cls = 'done';
    if (i === activeIndex) cls = 'active';
    dots.push(`<button class="rail-dot ${cls}" onclick="goToStep(${i})" aria-label="Step ${i + 1}"></button>`);
  }
  const stepLabel = activeIndex < lesson.steps.length ? `Step ${activeIndex + 1} / ${lesson.steps.length}` : 'Wrap up';
  return `
    <div class="progress-rail">
      <div class="rail-top">
        <div class="rail-label">${lesson.title}</div>
        <div class="rail-step-count">${stepLabel}</div>
      </div>
      <div class="rail-dots">${dots.join('')}</div>
    </div>
  `;
}

function renderPlaceholderFrame({ kind, emoji, caption, sublabel, src }) {
  // kind: 'video' | 'image'
  const isImage = kind === 'image';
  const mediaHtml = src
    ? `<img class="placeholder-real-media" src="${src}" alt="${caption || ''}">`
    : '';
  return `
    <div class="video-frame ${isImage ? 'is-image' : ''}">
      ${mediaHtml}
      <div class="video-placeholder">
        <div class="video-icon">${emoji || (isImage ? '🖼️' : '▶️')}</div>
        <div class="video-caption">${caption || (isImage ? 'Image / diagram' : 'Video')}</div>
        <div class="video-timestamp">${sublabel || (isImage ? 'Placeholder — teacher will add reference image' : 'Placeholder — teacher demo video')}</div>
      </div>
    </div>
  `;
}

// Verb → emoji map for the short task chip (Watch / Try / Drag / Draw / Check / Upload...)
const TASK_CHIP_ICONS = {
  watch: '▶️', try: '👉', drag: '✋', draw: '✏️', check: '✅', upload: '📸',
  tap: '👆', build: '🧱', compare: '🔁', design: '🎨'
};
function taskChipIcon(label) {
  const key = (label || '').toLowerCase().trim();
  return TASK_CHIP_ICONS[key] || '✏️';
}

function renderStepCard(step, lessonId) {
  const progress = sceneDrawingGetLessonProgress(lessonId);
  const checked = !!progress.checks[step.stepNumber];
  const domId = `ipb-${lessonId}-${step.stepNumber}`;

  // Visual-first mode: a step with `interactive` skips the old static
  // video/image placeholders entirely and mounts a live widget instead.
  const mediaHtml = step.interactive
    ? renderInteractiveBlock(step.interactive, domId)
    : `${renderPlaceholderFrame({ kind: 'video', caption: 'Video', sublabel: step.videoPlaceholder })}${renderPlaceholderFrame({ kind: 'image', caption: 'Image / diagram', sublabel: step.imagePlaceholder })}`;

  const secondaryDomId = `${domId}-secondary`;
  const secondaryMediaHtml = step.secondaryInteractive
    ? `<div class="ipb-secondary-label">${step.secondaryInteractive.title || ''}</div>${renderInteractiveBlock(step.secondaryInteractive, secondaryDomId)}`
    : '';

  // shortInstruction (new, 1 line) takes priority over the older, longer
  // shortExplanation field — both are supported so old lesson data still works.
  const explanationHtml = step.shortInstruction
    ? `<div class="step-explanation">${step.shortInstruction}</div>`
    : (step.shortExplanation ? `<div class="step-explanation">${step.shortExplanation}</div>` : '');

  // Student task: short verb chip(s) if `taskChip` is set, otherwise fall
  // back to the original full-sentence task-block for older steps.
  const taskHtml = step.taskChip
    ? `<div class="task-chip-row"><span class="task-chip"><span class="task-chip-icon">${taskChipIcon(step.taskChip)}</span>${step.taskChip}</span></div>`
    : (step.studentTask ? `<div class="mini-block task-block"><div class="mini-block-label">✏️ Student task</div><div class="mini-block-text">${step.studentTask}</div></div>` : '');

  // Teacher tip: always compact now (one line), still optional.
  const tipHtml = step.teacherTip
    ? `<div class="mini-block tip-block compact"><div class="mini-block-label">💡</div><div class="mini-block-text">${step.teacherTip}</div></div>`
    : '';

  // Check point: visual checkbox row, short text only.
  const checkHtml = step.checkPoint
    ? `<div class="visual-check-row">
        <div class="check-box ${checked ? 'checked' : ''}" onclick="toggleCheckPoint('${lessonId}', ${step.stepNumber}, this)">${checked ? '✓' : ''}</div>
        <div class="visual-check-text">${step.checkPoint}</div>
      </div>`
    : '';

  return `
    <div class="step-card">
      <div class="step-kicker">Step ${step.stepNumber}</div>
      <div class="step-title">${step.title}</div>
      ${explanationHtml}
      ${mediaHtml}
      ${secondaryMediaHtml}
      ${taskHtml}
      ${tipHtml}
      ${checkHtml}
    </div>
  `;
}

// Called after renderStepCard's HTML is inserted into the DOM — interactive
// widgets need their SVG elements to exist before drag/click listeners can
// attach. goToStep() in the navigation section below calls this.
function mountStepInteractive(step, lessonId) {
  if (step.interactive) {
    mountInteractiveBlock(step.interactive, `ipb-${lessonId}-${step.stepNumber}`);
  }
  if (step.secondaryInteractive) {
    mountInteractiveBlock(step.secondaryInteractive, `ipb-${lessonId}-${step.stepNumber}-secondary`);
  }
}

// Verb-icon map reused from renderStepCard's TASK_CHIP_ICONS pattern —
// kept local since multiple-choice options don't need it, just documenting
// why this file has two small icon maps rather than one shared one: they
// serve different vocabularies (task verbs vs. reflection answer kinds).

function renderMcQuestion(question, qIndex, lessonId, savedAnswer) {
  const isMulti = question.type === 'multi';
  const selected = isMulti ? (savedAnswer || []) : (savedAnswer ? [savedAnswer] : []);
  const optionsHtml = question.options.map((opt, oIndex) => {
    const isSelected = selected.includes(opt);
    return `
      <div class="mc-option ${isSelected ? 'selected' : ''}" data-multi="${isMulti}"
           onclick="selectMcOption('${lessonId}', ${qIndex}, ${oIndex}, ${isMulti})">
        <div class="mc-option-mark">${isSelected ? '✓' : ''}</div>
        <div>${opt}</div>
      </div>
    `;
  }).join('');
  return `
    <div class="mc-question-card">
      <div class="mc-question-text">${question.text}</div>
      <div class="mc-options" id="mc-options-${lessonId}-${qIndex}">${optionsHtml}</div>
    </div>
  `;
}

function selectMcOption(lessonId, qIndex, oIndex, isMulti) {
  const lesson = window.CURRENT_LESSON;
  if (!lesson) return;
  const question = lesson.reflectionQuestions[qIndex];
  const option = question.options[oIndex];
  const progress = sceneDrawingGetLessonProgress(lessonId);
  if (!progress.reflections) progress.reflections = {};

  if (isMulti) {
    const current = progress.reflections[qIndex] || [];
    const idx = current.indexOf(option);
    if (idx >= 0) current.splice(idx, 1); else current.push(option);
    progress.reflections[qIndex] = current;
  } else {
    progress.reflections[qIndex] = option;
  }
  sceneDrawingSetLessonProgress(lessonId, progress);

  // Re-render just this question's options (cheap, avoids losing scroll position)
  const mount = document.getElementById(`mc-options-${lessonId}-${qIndex}`);
  if (mount) {
    const savedAnswer = progress.reflections[qIndex];
    const selected = isMulti ? (savedAnswer || []) : (savedAnswer ? [savedAnswer] : []);
    mount.innerHTML = question.options.map((opt, i) => {
      const isSelected = selected.includes(opt);
      return `
        <div class="mc-option ${isSelected ? 'selected' : ''}" data-multi="${isMulti}"
             onclick="selectMcOption('${lessonId}', ${qIndex}, ${i}, ${isMulti})">
          <div class="mc-option-mark">${isSelected ? '✓' : ''}</div>
          <div>${opt}</div>
        </div>
      `;
    }).join('');
  }
}

function reflectionAllAnswered(lesson, progress) {
  return lesson.reflectionQuestions.every((q, i) => {
    const a = progress.reflections[i];
    return q.type === 'multi' ? (a && a.length > 0) : !!a;
  });
}

function renderCourseBadgeCard() {
  // Course-level badge only — per Faye's standing rule, individual lessons
  // award progress, not badges. This card shows where the student stands
  // toward the WHOLE Scene Drawing Foundation course (currently 2 lessons,
  // more planned), never claims completion early.
  if (typeof sceneDrawingCourseBadgeProgress !== 'function') return ''; // bridge not loaded — degrade gracefully
  const progress = sceneDrawingCourseBadgeProgress();
  const unlockedClass = progress.isComplete ? 'unlocked' : '';
  const metaText = progress.isComplete
    ? 'Earned — you completed your first scene drawing set.'
    : `${progress.doneCount} / ${progress.totalCount} lessons toward this badge`;
  return `
    <div class="course-badge-card">
      <div class="course-badge-row">
        <div class="course-badge-emoji ${unlockedClass}">🎬</div>
        <div class="course-badge-info">
          <div class="course-badge-name">Scene Designer ${progress.isComplete ? '· Earned' : '· Locked'}</div>
          <div class="course-badge-meta">${metaText}</div>
        </div>
      </div>
      <div class="course-badge-progress-bar"><div class="course-badge-progress-fill" style="width:${progress.pct}%;"></div></div>
    </div>
  `;
}

function renderFinalWrapUp(lesson) {
  const progress = sceneDrawingGetLessonProgress(lesson.id);
  if (!progress.reflections) progress.reflections = {};

  const reflectionsHtml = lesson.reflectionQuestions.map((q, i) =>
    renderMcQuestion(q, i, lesson.id, progress.reflections[i])
  ).join('');

  const journeyChip = progress.addedToJourney
    ? `<div class="journey-added-chip">✨ Added to My Journey</div>`
    : '';

  return `
    <div class="goal-card">
      <div class="goal-kicker">🎯 Final artwork goal</div>
      <div class="goal-text">${lesson.finalArtworkGoal}</div>
    </div>

    <div class="step-card">
      <div class="step-kicker">📤 Submit your artwork</div>
      <div class="video-frame is-image upload-drop-zone" onclick="submitArtwork('${lesson.id}')" role="button" tabindex="0">
        <div class="video-placeholder">
          <div class="video-icon">📸</div>
          <div class="video-caption" style="color: var(--gold);">${progress.submitted ? 'Uploaded — tap to replace' : 'Tap to upload your drawing'}</div>
          <div class="video-timestamp">Photo or scan — JPG, PNG</div>
        </div>
      </div>
    </div>

    <div class="step-card">
      <div class="step-kicker">💭 Quick reflection</div>
      ${reflectionsHtml}
      ${journeyChip}
      <button class="btn btn-ink" onclick="completeSceneDrawingLesson('${lesson.id}')" ${progress.submitted ? '' : 'disabled style="opacity:0.45;"'}>
        ${progress.lessonCompleteShown ? 'Lesson complete ✓' : 'Finish & save to My Journey →'}
      </button>
    </div>

    ${renderCourseBadgeCard()}

    <div class="lesson-complete-callout ${progress.lessonCompleteShown ? 'show' : ''}" id="lesson-complete-${lesson.id}">
      <div class="lesson-complete-emoji">🌱</div>
      <div class="lesson-complete-title">Lesson complete</div>
      <div class="lesson-complete-sub">Saved to My Journey. Keep going — the Scene Designer badge unlocks when the whole course is done.</div>
      <a class="btn btn-ghost" href="../">← Back to all lessons</a>
    </div>

    <!-- Real badge-earned celebration — only ever shown when the COURSE
         (not this single lesson) is actually complete. completeSceneDrawing
         Lesson() adds the 'show' class only when justUnlocked is true. -->
    <div class="badge-unlock" id="badge-unlock-${lesson.id}">
      <div class="badge-big">🎬</div>
      <div class="badge-title">Scene Designer</div>
      <div class="badge-desc">You completed your first scene drawing set.</div>
    </div>
  `;
}

// ───────────────────────────────────────────────────────────────────────────
// SECTION 4 · STEP NAVIGATION (shared logic used by lesson/index.html)
// The host page must define: window.CURRENT_LESSON = <lesson object>
// ───────────────────────────────────────────────────────────────────────────
function goToStep(index) {
  const lesson = window.CURRENT_LESSON;
  if (!lesson) return;
  const total = lesson.steps.length;
  const clamped = Math.max(0, Math.min(index, total));
  const progress = sceneDrawingGetLessonProgress(lesson.id);
  progress.currentStep = clamped;
  // Mark previous step as completed when moving forward past it
  for (let i = 0; i < clamped; i++) {
    if (!progress.completedSteps.includes(i)) progress.completedSteps.push(i);
  }
  sceneDrawingSetLessonProgress(lesson.id, progress);

  const railEl = document.getElementById('progress-rail-mount');
  const contentEl = document.getElementById('step-content');
  if (railEl) railEl.innerHTML = renderProgressRail(lesson, clamped);
  if (contentEl) {
    if (clamped < total) {
      contentEl.innerHTML = renderStepCard(lesson.steps[clamped], lesson.id);
      mountStepInteractive(lesson.steps[clamped], lesson.id);

      // Artchi: cheer on advancing, and nudge toward interactive widgets
      // the first time a student reaches one (per Faye: remind students to
      // try dragging — but only once per step, not every visit, so it
      // doesn't get annoying on replay). Scheduled through
      // sceneDrawingScheduleCheer so fast clicking through several steps
      // in a row cancels each earlier pending cheer instead of stacking them.
      if (typeof showArtchiBubble === 'function') {
        const step = lesson.steps[clamped];
        const hintKey = `sceneDrawingArtchiHint_${lesson.id}_${step.stepNumber}`;
        if (step.interactive && !sessionStorage.getItem(hintKey)) {
          sessionStorage.setItem(hintKey, '1');
          sceneDrawingScheduleCheer(artchiRandomLine('interactiveHint'), 500, 3200);
        } else if (clamped > 0) {
          sceneDrawingScheduleCheer(artchiRandomLine('stepAdvance'), 400, 2200);
        }
      }
    } else {
      contentEl.innerHTML = renderFinalWrapUp(lesson);
      if (typeof showArtchiBubble === 'function') {
        sceneDrawingScheduleCheer(artchiRandomLine('lessonComplete'), 400, 3000);
      }
    }
  }
  updateStepNav(clamped, total);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepNav(clamped, total) {
  const nextBtn = document.getElementById('step-nav-next-btn');
  const prevBtn = document.getElementById('step-nav-prev-btn');
  const navBar = nextBtn ? nextBtn.closest('.step-nav') : null;

  if (clamped >= total) {
    // Wrap-up screen has its own "Finish & save to My Journey" button and
    // its own back-link inside the card — the sticky bottom nav would just
    // duplicate "Finish" with different (confusing) behavior, so hide it.
    if (navBar) navBar.style.display = 'none';
    return;
  }
  if (navBar) navBar.style.display = 'flex';

  if (prevBtn) prevBtn.disabled = clamped === 0;
  if (nextBtn) {
    nextBtn.textContent = 'Next step →';
    nextBtn.onclick = () => goToStep(clamped + 1);
  }
}

function toggleCheckPoint(lessonId, stepNumber, el) {
  const progress = sceneDrawingGetLessonProgress(lessonId);
  const isChecked = !!progress.checks[stepNumber];
  progress.checks[stepNumber] = !isChecked;
  sceneDrawingSetLessonProgress(lessonId, progress);
  el.classList.toggle('checked');
  el.textContent = !isChecked ? '✓' : '';
}

// Replaces the old free-text saveReflection — multiple-choice answers are
// now saved directly by selectMcOption() above, as the student taps.

function completeSceneDrawingLesson(lessonId) {
  const lesson = window.CURRENT_LESSON;
  if (!lesson || lesson.id !== lessonId) return;
  const progress = sceneDrawingGetLessonProgress(lessonId);
  if (!progress.submitted) return; // upload gate — button is disabled until then, this is just a safety check

  if (!reflectionAllAnswered(lesson, progress)) {
    sceneDrawingCancelPendingCheer();
    if (typeof showArtchiBubble === 'function') showArtchiBubble('pick an answer for each question first ✨', 2400);
    return;
  }

  // Save each reflection answer into the platform's real shared journal
  // (My Journey), one entry per question — same shape every other lesson
  // uses, so this shows up in the same timeline.
  if (typeof JournalStorage !== 'undefined') {
    lesson.reflectionQuestions.forEach((q, i) => {
      const answer = progress.reflections[i];
      const answerText = Array.isArray(answer) ? answer.join(', ') : answer;
      JournalStorage.save({
        courseId: lesson.id,
        lessonId: lesson.id,
        momentKey: 'reflection',
        ageGroup: 'unspecified',
        promptText: q.text,
        studentText: answerText,
        inputType: 'selection'
      });
    });
  }

  // Mark lesson complete in the platform's real shared profile
  // (completedLessons) — this is also what the course-level badge checks.
  let badgeResult = { isComplete: false, justUnlocked: false };
  if (typeof sceneDrawingMarkLessonComplete === 'function') {
    badgeResult = sceneDrawingMarkLessonComplete(lessonId);
  }

  progress.addedToJourney = true;
  progress.lessonCompleteShown = true;
  sceneDrawingSetLessonProgress(lessonId, progress);

  sceneDrawingCancelPendingCheer();
  if (typeof showArtchiBubble === 'function') {
    showArtchiBubble(artchiRandomLine('reflectionDone'), 3000);
  }

  // Re-render so the "Added to My Journey" chip, updated badge card, and
  // "Lesson complete" button state all reflect what just happened. The
  // wrap-up branch in goToStep will try to schedule its own ambient
  // "lessonComplete" cheer — cancel that immediately after so it doesn't
  // overwrite the reflectionDone message just shown above.
  goToStep(lesson.steps.length);
  sceneDrawingCancelPendingCheer();

  if (badgeResult.justUnlocked) {
    setTimeout(() => {
      sceneDrawingCancelPendingCheer();
      if (typeof showArtchiBubble === 'function') showArtchiBubble('you controlled space with vanishing points ✨', 3500);
      const badgeEl = document.getElementById(`badge-unlock-${lessonId}`);
      if (badgeEl) badgeEl.classList.add('show');
    }, 600);
  }
}

function submitArtwork(lessonId) {
  // NOTE FOR FAYE: this currently just flips a localStorage flag, matching
  // the "stub now, wire to Supabase/Stripe-style backend later" pattern
  // already used elsewhere in the platform (see access.js).
  const progress = sceneDrawingGetLessonProgress(lessonId);
  progress.submitted = true;
  sceneDrawingSetLessonProgress(lessonId, progress);
  const lesson = window.CURRENT_LESSON;
  if (lesson) {
    // Re-render the wrap-up so the upload zone shows "uploaded" and the
    // Finish button becomes enabled. goToStep's wrap-up branch will try to
    // schedule its own ambient "just arrived" cheer — cancel it right
    // after, since the student was already on this screen mid-flow, not
    // freshly arriving. Without this, tapping Finish quickly after
    // uploading could show a stray cheer instead of the real message.
    goToStep(lesson.steps.length);
    sceneDrawingCancelPendingCheer();
  }
}
