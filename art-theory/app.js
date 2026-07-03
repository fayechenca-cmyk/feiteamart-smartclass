/* app.js — FEI Art History Journey (Tracks + No-scroll board)
   - loads tracks from window.FEI_ART_HISTORY_TRACKS (curriculum.js)
   - injects UI into #fei-art-history (Webflow embed stays tiny)
   - per-track progress in localStorage
*/
(function () {
  "use strict";

  const ROOT_ID = "fei-art-history";
  const KEY = "fei_art_history_tracks_2026";
  const PASS_SCORE = 4;

  const root = document.getElementById(ROOT_ID);
  if (!root) return;

  // prevent double init
  if (root.dataset.feiInit === "1") return;
  root.dataset.feiInit = "1";

  // ---------- data
  const TRACKS = (window.FEI_ART_HISTORY_TRACKS && typeof window.FEI_ART_HISTORY_TRACKS === "object")
    ? window.FEI_ART_HISTORY_TRACKS
    : null;

  const FALLBACK = Array.isArray(window.FEI_ART_HISTORY_CURRICULUM) ? window.FEI_ART_HISTORY_CURRICULUM : [];

  const trackKeys = TRACKS ? Object.keys(TRACKS).filter(k => TRACKS[k] && Array.isArray(TRACKS[k].lessons)) : [];
  const hasTracks = TRACKS && trackKeys.length > 0;

  // ---------- state
  // progress per track: { unlocked, completed[] }
  let state = {
    name: "",
    activeTrack: hasTracks ? trackKeys[0] : "western",
    progress: {}
  };

  let currentLevelId = null;

  function safeNum(n, fallback) {
    const x = Number(n);
    return Number.isFinite(x) ? x : fallback;
  }

  function normalizeProgress(p, total) {
    const unlocked = Math.max(1, Math.min(total || 1, safeNum(p?.unlocked, 1)));
    const completed = Array.isArray(p?.completed)
      ? p.completed.map(Number).filter(Number.isFinite)
      : [];
    return { unlocked, completed };
  }

  function getLessons(trackKey) {
    if (hasTracks) return TRACKS[trackKey]?.lessons || [];
    return FALLBACK;
  }

  function getTrackMeta(trackKey) {
    if (!hasTracks) return { label: "Art History Journey", desc: "Curriculum" };
    return {
      label: TRACKS[trackKey]?.label || trackKey,
      desc: TRACKS[trackKey]?.desc || ""
    };
  }

  function totalLessons(trackKey) {
    return getLessons(trackKey).length;
  }

  function ensureProgress(trackKey) {
    const total = totalLessons(trackKey);
    if (!state.progress[trackKey]) state.progress[trackKey] = { unlocked: 1, completed: [] };
    state.progress[trackKey] = normalizeProgress(state.progress[trackKey], total);
  }

  function saveState() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      state.name = (typeof parsed.name === "string") ? parsed.name : "";
      state.activeTrack = (typeof parsed.activeTrack === "string") ? parsed.activeTrack : state.activeTrack;
      state.progress = (parsed && typeof parsed.progress === "object") ? parsed.progress : {};

    } catch (e) {
      // ignore
    }

    // validate tracks/progress
    if (hasTracks && !trackKeys.includes(state.activeTrack)) state.activeTrack = trackKeys[0];
    if (hasTracks) trackKeys.forEach(k => ensureProgress(k));
    else ensureProgress(state.activeTrack);
  }

  function resetApp() {
    if (!confirm("Reset your Art History Journey?")) return;
    localStorage.removeItem(KEY);
    location.reload();
  }

  // ---------- HTML (injected)
  root.innerHTML = `
  <div id="fei-art-system">
    <!-- TRACK SELECT -->
    <div id="fei-track-view" class="fei-fullscreen">
      <div class="fei-track-panel">
        <div class="fei-brand-tag">SELECT A TRACK</div>
        <h2 class="fei-track-title">Welcome, <span id="track-student">Student</span></h2>
        <p class="fei-track-desc">Pick your learning path.</p>
        <div class="fei-track-grid" id="track-grid"></div>
      </div>
    </div>

    <!-- MAP VIEW -->
    <div id="fei-map-view" class="fei-hidden">
      <div class="fei-header">
        <div class="fei-user-badge">
          <div class="fei-avatar">LFC</div>
          <div class="fei-user-text">
            <span id="display-name">Student</span>
            <span class="fei-progress-pill" id="progress-display">0/0 Credits</span>
            <span class="fei-track-pill" id="track-pill">Track</span>
          </div>
        </div>
        <div class="fei-header-actions">
          <button id="btn-switch-track" class="fei-link-reset">Tracks</button>
          <button id="btn-reset" class="fei-link-reset">Reset</button>
        </div>
      </div>

      <div class="fei-map-scroll">
        <div class="fei-board-viewport">
          <div class="fei-board-wrap" id="board-wrap">
            <div class="fei-board" id="map-container"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div id="fei-modal" class="fei-overlay fei-hidden">
      <div class="fei-modal-window">
        <button class="fei-close" id="btn-close" aria-label="Close">×</button>

        <div class="fei-modal-top">
          <div class="fei-era-tag" id="m-era">ERA</div>
          <h2 id="m-title">Title</h2>
        </div>

        <div class="fei-tabs">
          <button class="fei-tab active" data-tab="study">Lecture</button>
          <button class="fei-tab" data-tab="gallery">Gallery & Sources</button>
          <button class="fei-tab" data-tab="think">Studio & Thought</button>
          <button class="fei-tab" data-tab="quiz">Challenge</button>
        </div>

        <div class="fei-tab-body">
          <div id="tab-study" class="fei-view active">
            <div class="fei-notebook">
              <div class="fei-video-container" id="m-video-box"></div>
              <div id="m-lecture-content"></div>
            </div>
          </div>

          <div id="tab-gallery" class="fei-view">
            <div class="fei-gallery-grid" id="m-images"></div>
            <h3 class="fei-sub-heading">Academic Resources</h3>
            <div id="m-resources" class="fei-resource-list"></div>
          </div>

          <div id="tab-think" class="fei-view">
            <div class="fei-think-box">
              <h3>🧠 Critical Thinking</h3>
              <p id="m-critical-text"></p>
            </div>
            <div class="fei-mission-paper">
              <h3>🎨 Practical Studio</h3>
              <p id="m-mission-text"></p>
            </div>
          </div>

          <div id="tab-quiz" class="fei-view">
            <div class="fei-quiz-intro">Pass 4/5 to earn credit.</div>
            <div id="m-quiz-list"></div>
            <button id="btn-submit" class="fei-btn-black full">SUBMIT ANSWERS</button>
            <div id="m-feedback"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  // ---------- helpers (scoped)
  const $ = (sel) => root.querySelector(sel);
  const $$ = (sel) => Array.from(root.querySelectorAll(sel));

  function show(el) { el.classList.remove("fei-hidden"); }
  function hide(el) { el.classList.add("fei-hidden"); }

  function switchTab(tabName) {
    $$(".fei-tab").forEach(t => t.classList.remove("active"));
    $$(".fei-view").forEach(v => v.classList.remove("active"));
    root.querySelector(`.fei-tab[data-tab="${tabName}"]`)?.classList.add("active");
    $(`#tab-${tabName}`)?.classList.add("active");
  }

  // ---------- YouTube normalizer (so you can paste watch?v= links)
  function parseYouTubeId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "").trim();
      }
      if (u.hostname.includes("youtube.com")) {
        if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1].split("/")[0];
        if (u.pathname === "/watch") return u.searchParams.get("v");
      }
    } catch (e) {}
    return null;
  }

  function normalizeVideoUrl(url) {
    if (!url) return "";
    const id = parseYouTubeId(url);
    if (!id) return url; // might be another provider
    return `https://www.youtube.com/embed/${id}`;
  }

  // ---------- views
  function showTrackSelect() {
    show($("#fei-track-view"));
    hide($("#fei-map-view"));

    $("#track-student").textContent = state.name || "Student";

    const grid = $("#track-grid");
    grid.innerHTML = "";

    if (!hasTracks) {
      // fallback single track
      const btn = document.createElement("div");
      btn.className = "fei-track-card";
      btn.innerHTML = `<div class="t">Art History Journey</div><div class="s">Curriculum</div>`;
      btn.addEventListener("click", () => {
        state.activeTrack = "western";
        ensureProgress(state.activeTrack);
        saveState();
        showMap();
      });
      grid.appendChild(btn);
      return;
    }

    trackKeys.forEach((k) => {
      const meta = getTrackMeta(k);
      const total = totalLessons(k);
      const p = state.progress[k] || { unlocked: 1, completed: [] };

      const card = document.createElement("div");
      card.className = "fei-track-card";
      card.innerHTML = `
        <div class="t">${meta.label}</div>
        <div class="s">${meta.desc}</div>
        <div class="mini">${p.completed.length}/${total} completed</div>
      `;
      card.addEventListener("click", () => {
        state.activeTrack = k;
        ensureProgress(k);
        saveState();
        showMap();
      });
      grid.appendChild(card);
    });
  }

  function showMap() {
    hide($("#fei-track-view"));
    show($("#fei-map-view"));

    const meta = getTrackMeta(state.activeTrack);
    $("#display-name").textContent = state.name || "Student";
    $("#track-pill").textContent = meta.label;

    renderMap();
  }

  // ---------- map render (NO SCROLL: auto scale to fit)
  function fitBoard() {
    const viewport = root.querySelector(".fei-board-viewport");
    const wrap = $("#board-wrap");
    const board = $("#map-container");
    if (!viewport || !wrap || !board) return;

    // reset
    wrap.style.transform = "scale(1)";
    wrap.dataset.scale = "1";

    const availH = viewport.clientHeight - 10;
    const contentH = board.scrollHeight;

    if (contentH <= 0) return;

    const scale = Math.max(0.55, Math.min(1.12, availH / contentH)); // don't shrink to unreadable dot
    wrap.style.transform = `scale(${scale})`;
    wrap.dataset.scale = String(scale);
  }

  function renderMap() {
    const lessons = getLessons(state.activeTrack);
    const total = lessons.length;

    ensureProgress(state.activeTrack);
    const prog = state.progress[state.activeTrack];

    $("#progress-display").textContent = `${prog.completed.length}/${total || 0} Credits`;

    const container = $("#map-container");
    container.innerHTML = "";

    if (!lessons.length) {
      const box = document.createElement("div");
      box.className = "fei-empty";
      box.innerHTML = `<div class="fei-empty-title">No lessons yet</div><div class="fei-empty-sub">This track is coming soon.</div>`;
      container.appendChild(box);
      requestAnimationFrame(fitBoard);
      return;
    }

    lessons.forEach((lesson) => {
      const id = safeNum(lesson.id, 0);
      const isUnlocked = id <= prog.unlocked;
      const isDone = prog.completed.includes(id);

      const card = document.createElement("div");
      card.className = "fei-node-card";
      if (isDone) card.classList.add("completed");
      else if (isUnlocked) card.classList.add("unlocked");
      else card.classList.add("locked");

      card.innerHTML = `
        <div class="fei-node-num">${id}</div>
        <h4>${lesson.title || "Untitled"}</h4>
        <p>${lesson.era || ""}</p>
      `;

      if (isUnlocked) {
        card.addEventListener("click", () => openLevel(lesson));
      }

      container.appendChild(card);
    });

    // scale to fit
    setTimeout(fitBoard, 50);
  }

  // ---------- modal
  function closeModal() {
    hide($("#fei-modal"));
    $("#m-video-box").innerHTML = "";
    $("#m-feedback").innerHTML = "";
  }

  function openLevel(lesson) {
    currentLevelId = safeNum(lesson.id, 0);
    show($("#fei-modal"));
    switchTab("study");

    $("#m-title").textContent = lesson.title || "";
    $("#m-era").textContent = lesson.era || "";

    // video
    const videoBox = $("#m-video-box");
    const v = normalizeVideoUrl(lesson.videoUrl || "");
    if (v) {
      videoBox.innerHTML = `
        <iframe width="100%" height="100%"
          src="${v}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          style="border-radius:10px;"></iframe>`;
      videoBox.style.display = "block";
    } else {
      videoBox.innerHTML = "";
      videoBox.style.display = "none";
    }

    // lecture
    $("#m-lecture-content").innerHTML = lesson.lecture || "";

    // images
    $("#m-images").innerHTML = (lesson.images || [])
      .map(src => `
        <div class="fei-img-box">
          <img src="${src}" loading="lazy" referrerpolicy="no-referrer"
               onerror="this.style.opacity='0.2';" />
        </div>
      `).join("");

    // resources
    $("#m-resources").innerHTML = (lesson.resources || [])
      .map(r => `<a href="${r.url}" target="_blank" rel="noopener" class="fei-resource-link">📚 ${r.name} ➔</a>`)
      .join("");

    // critical + mission
    $("#m-critical-text").textContent = lesson.criticalThinking || "";
    $("#m-mission-text").innerHTML = lesson.mission || "";

    renderQuiz(lesson);
  }

  function renderQuiz(lesson) {
    const qList = $("#m-quiz-list");
    qList.innerHTML = "";
    $("#m-feedback").innerHTML = "";

    (lesson.quiz || []).forEach((q, i) => {
      const item = document.createElement("div");
      item.className = "fei-quiz-item";
      item.innerHTML = `<p>${i + 1}. ${q.q}</p>`;

      (q.opts || []).forEach((opt, oIdx) => {
        const btn = document.createElement("button");
        btn.className = "fei-quiz-opt";
        btn.textContent = opt;
        btn.dataset.idx = String(oIdx);
        btn.addEventListener("click", () => {
          item.querySelectorAll(".fei-quiz-opt").forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
        });
        item.appendChild(btn);
      });

      qList.appendChild(item);
    });
  }

  function handleSubmit() {
    const lessons = getLessons(state.activeTrack);
    const lesson = lessons.find(l => safeNum(l.id, 0) === currentLevelId);
    if (!lesson) return;

    const quiz = lesson.quiz || [];
    const items = $$(".fei-quiz-item");
    let correct = 0;
    let answered = 0;

    items.forEach((item, i) => {
      const selected = item.querySelector(".selected");
      if (!selected) return;
      answered++;

      const picked = Number(selected.dataset.idx);
      if (picked === quiz[i]?.ans) {
        correct++;
        selected.classList.add("correct");
      } else {
        selected.classList.add("wrong");
      }
    });

    if (answered < quiz.length) return alert("Please answer all questions.");

    const fb = $("#m-feedback");
    if (correct >= PASS_SCORE) {
      fb.innerHTML = `<div class="fei-feedback good">Passed! Credit Earned.</div>`;

      ensureProgress(state.activeTrack);
      const prog = state.progress[state.activeTrack];
      const total = totalLessons(state.activeTrack);

      if (!prog.completed.includes(currentLevelId)) {
        prog.completed.push(currentLevelId);
        prog.unlocked = Math.max(prog.unlocked, Math.min(total, currentLevelId + 1));
        state.progress[state.activeTrack] = prog;
        saveState();
        renderMap();
        setTimeout(closeModal, 650);

        // write into the shared Art GPS profile so the homepage badge grid
        // and Artchi's celebration reflect real progress, not just this
        // widget's own local track state
        if (typeof artHistoryMarkLessonComplete === "function") {
          const courseId = `art-history-${state.activeTrack}-${currentLevelId}`;
          const badgeResult = artHistoryMarkLessonComplete(courseId);
          if (badgeResult.justUnlocked && typeof showArtchiBubble === "function") {
            setTimeout(() => showArtchiBubble("you earned the Art History badge! 🏺✨", 4000), 800);
          } else if (typeof showArtchiBubble === "function") {
            setTimeout(() => showArtchiBubble(artchiRandomLine ? artchiRandomLine("lessonComplete") : "nice work! ✨", 2600), 800);
          }
        }
      }
    } else {
      fb.innerHTML = `<div class="fei-feedback bad">Score: ${correct}/${quiz.length}. Try again.</div>`;
    }
  }

  // ---------- bind
  function bind() {
    $("#btn-switch-track").addEventListener("click", () => {
      showTrackSelect();
    });

    $("#btn-reset").addEventListener("click", resetApp);
    $("#btn-close").addEventListener("click", closeModal);
    $("#btn-submit").addEventListener("click", handleSubmit);

    $$(".fei-tab").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));

    $("#fei-modal").addEventListener("click", (e) => {
      if (e.target === $("#fei-modal")) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !$("#fei-modal").classList.contains("fei-hidden")) closeModal();
    });

    window.addEventListener("resize", () => setTimeout(fitBoard, 80));
  }

  // ---------- Art GPS profile bridge
  function loadArtGpsName() {
    try {
      const raw = localStorage.getItem("fei_user_profile");
      if (!raw) return "";
      const profile = JSON.parse(raw);
      return (profile && typeof profile.name === "string") ? profile.name : "";
    } catch (e) {
      return "";
    }
  }

  // ---------- init
  loadState();
  state.name = loadArtGpsName() || state.name || "Student";
  saveState();
  bind();

  showTrackSelect();

})();
