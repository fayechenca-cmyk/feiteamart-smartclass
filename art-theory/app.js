/* app.js — FEI Art History Journey (Tracks + vertical learning path)
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
  let returnFocus = null;

  function safeNum(n, fallback) {
    const x = Number(n);
    return Number.isFinite(x) ? x : fallback;
  }

  function normalizeProgress(p, total) {
    const unlocked = Math.max(1, Math.min(total || 1, safeNum(p?.unlocked, 1)));
    const completed = Array.isArray(p?.completed)
      ? [...new Set(p.completed.map(Number).filter(id => Number.isInteger(id) && id >= 1 && id <= total))]
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
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {
      const status = document.getElementById("history-save-status");
      if (status) status.textContent = "Progress cannot be saved in this browser.";
    }
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
        <div class="fei-brand-tag">ART THEORY · HISTORY CLASS</div>
        <h1 class="fei-track-title">Every artwork has a story.</h1>
        <p class="fei-track-desc"><span id="track-student">Student</span>, choose a history path. Look closely, discover new ideas, and build your own creative perspective.</p>
        <div class="fei-track-grid" id="track-grid"></div>
      </div>
    </div>

    <!-- MAP VIEW -->
    <div id="fei-map-view" class="fei-hidden">
      <div class="fei-header">
        <button id="btn-switch-track" class="fei-link-reset">← History paths</button>
        <button id="btn-reset" class="fei-link-reset">Reset progress</button>
      </div>
      <section class="fei-journey-hero">
        <div><div class="fei-brand-tag">YOUR ART HISTORY PATH</div>
          <h1 id="track-pill">Western Art History</h1>
          <p>From the first marks to new media. Discover art, one story at a time.</p>
          <button id="btn-continue" class="fei-primary">Start learning →</button>
        </div>
        <div id="history-badge" class="fei-reward-token" role="status"></div>
      </section>
      <section class="fei-journey-current" aria-labelledby="current-title">
        <div class="fei-brand-tag" id="current-label">YOU ARE HERE</div>
        <h2 id="current-title"></h2>
        <p>Watch · Explore · Create · Challenge</p>
        <div class="fei-progress-line"><span id="display-name"></span><span id="progress-display"></span></div>
        <progress id="history-progress" value="0" max="36" aria-label="Completed lessons"></progress>
        <small>Pass each lesson’s Challenge to unlock the next circle. Return to completed lessons anytime.</small>
      </section>
      <div class="fei-map-scroll">
        <div class="fei-board-viewport">
          <div class="fei-board-wrap" id="board-wrap">
            <ol class="fei-board" id="map-container" aria-label="Lesson path"></ol>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div id="fei-modal" class="fei-overlay fei-hidden">
      <div class="fei-modal-window" role="dialog" aria-modal="true" aria-labelledby="m-title" tabindex="-1">
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
    const source = new URL(url);
    const start = source.searchParams.get("start") || source.searchParams.get("t");
    const seconds = /^\d+s?$/.test(start || "") ? parseInt(start, 10) : 0;
    return `https://www.youtube.com/embed/${id}${seconds ? `?start=${seconds}` : ""}`;
  }

  function escapeMediaText(value) {
    return String(value || "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
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

      const card = document.createElement("button");
      card.type = "button";
      card.className = "fei-track-card";
      card.disabled = k === "china";
      card.innerHTML = `
        <span class="fei-track-symbol" aria-hidden="true">${k === "china" ? `<svg viewBox="0 0 64 64" width="58" height="58" fill="none" aria-hidden="true"><path d="M14 16c8-4 28-4 36 0v32c-8-4-28-4-36 0Z" fill="#fff8eb" stroke="#ac9275" stroke-width="2"/><path d="M14 12v40M50 12v40" stroke="#ac9275" stroke-width="5" stroke-linecap="round"/><path d="M25 39c8-1 5-15 16-18M26 39c4-8 10-12 15-18" stroke="#4b6c62" stroke-width="2.5" stroke-linecap="round"/><path d="m31 30-7-4 3 7m8-7 1-6" stroke="#4b6c62" stroke-width="2"/><rect x="39" y="39" width="6" height="6" rx="1" fill="#b96059"/></svg>` : "✦"}</span>
        <span class="t">${meta.label}</span>
        <span class="s">${k === "china" ? "A new history path is taking shape." : "36 stories, from ancient worlds to contemporary art."}</span>
        <span class="mini">${k === "china" ? "Coming soon" : `${p.completed.length}/${total} completed · Explore path →`}</span>
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
    if (state.activeTrack === "china") return showTrackSelect();
    hide($("#fei-track-view"));
    show($("#fei-map-view"));

    const meta = getTrackMeta(state.activeTrack);
    $("#display-name").textContent = state.name || "Student";
    $("#track-pill").textContent = meta.label;

    renderMap();
  }

  // ---------- vertical learning path
  function renderMap() {
    const lessons = getLessons(state.activeTrack);
    ensureProgress(state.activeTrack);
    const prog = state.progress[state.activeTrack];
    const count = prog.completed.length;
    const finished = count === lessons.length && lessons.length > 0;
    const current = lessons.find(l => !prog.completed.includes(Number(l.id)) && Number(l.id) <= prog.unlocked) || lessons[lessons.length - 1];
    $("#progress-display").textContent = `${count} / ${lessons.length} completed`;
    $("#history-progress").max = lessons.length || 1;
    $("#history-progress").value = count;
    $("#current-label").textContent = finished ? "YOUR PATH IS COMPLETE" : "YOU ARE HERE";
    $("#current-title").textContent = finished ? "36 stories. A new way of seeing." : `Lesson ${current?.id || 1} · ${current?.title || "Welcome"}`;
    $("#btn-continue").textContent = finished ? "Revisit the final lesson →" : count ? "Continue learning →" : "Start learning →";
    $("#btn-continue").onclick = () => current && openLevel(current);
    $("#history-badge").classList.toggle("earned", finished);
    $("#history-badge").innerHTML = `<span aria-hidden="true">🏺</span><strong>Art History badge</strong><small>${finished ? "Badge earned · Well done!" : `${count} / ${lessons.length} lessons · Keep exploring`}</small>`;
    const container = $("#map-container");
    container.innerHTML = "";
    lessons.forEach(lesson => {
      const id = Number(lesson.id);
      const done = prog.completed.includes(id);
      const unlocked = id <= prog.unlocked;
      const active = !finished && id === Number(current?.id);
      const photo = lesson.images?.[0];
      const item = document.createElement("li");
      item.className = `fei-path-stop ${done ? "completed" : unlocked ? "unlocked" : "locked"}${active ? " current" : ""}`;
      item.innerHTML = `
        <button class="fei-lesson-circle" ${unlocked ? "" : "disabled"} ${active ? 'aria-current="step"' : ""} aria-label="${escapeMediaText(`${done ? "Revisit" : unlocked ? "Open" : "Locked"} lesson ${id}: ${lesson.title}`)}">
          ${photo?.src ? `<img src="${escapeMediaText(photo.src)}" alt="" loading="lazy">` : ""}
          <span class="fei-circle-number">${done ? "✓" : id}</span>
        </button>
        <div class="fei-stop-content">
          <span class="fei-stop-status">${done ? "✓ Completed" : active ? "Your next discovery" : unlocked ? "Ready to explore" : "Locked · Complete the previous lesson"}</span>
          <h2>${escapeMediaText(lesson.title)}</h2>
          <p>${escapeMediaText(lesson.era)}</p>
          ${unlocked ? `<button class="fei-open-lesson">${done ? "Revisit lesson" : "Explore lesson"} →</button>` : ""}
          ${photo?.generated ? `<details class="fei-map-credit"><summary>About this illustration</summary><p>${escapeMediaText(photo.title)}<br>AI-assisted teaching illustration, not a historical artwork.<br><a href="${escapeMediaText(photo.sourceUrl)}" target="_blank" rel="noopener">How this image was made</a></p></details>` : photo?.src ? `<details class="fei-map-credit"><summary>Image credit</summary><p>${escapeMediaText(photo.title)} · ${escapeMediaText(photo.credit)}<br><a href="${escapeMediaText(photo.sourceUrl)}" target="_blank" rel="noopener">Source</a> · <a href="${escapeMediaText(photo.licenseUrl)}" target="_blank" rel="noopener">${escapeMediaText(photo.license)}</a><br>Reduced-size preview; original proportions preserved.</p></details>` : ""}
        </div>`;
      if (unlocked) item.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => openLevel(lesson)));
      container.appendChild(item);
    });
  }

  // ---------- modal
  function closeModal() {
    hide($("#fei-modal"));
    document.body.style.overflow = "";
    if (returnFocus?.isConnected) returnFocus.focus();
    else $("#btn-continue").focus();
    $("#m-video-box").innerHTML = "";
    $("#m-video-credit")?.replaceChildren();
    $("#m-feedback").innerHTML = "";
  }

  function openLevel(lesson) {
    if (state.activeTrack === "china") return;
    returnFocus = document.activeElement;
    currentLevelId = safeNum(lesson.id, 0);
    show($("#fei-modal"));
    switchTab("study");
    document.body.style.overflow = "hidden";
    $(".fei-tab-body").scrollTop = 0;
    $("#btn-close").focus();

    $("#m-title").textContent = lesson.title || "";
    $("#m-era").textContent = lesson.era || "";

    // video
    const videoBox = $("#m-video-box");
    const v = normalizeVideoUrl(lesson.videoUrl || "");
    if (v) {
      videoBox.innerHTML = `
        <iframe width="100%" height="100%"
          src="${v}"
          title="${escapeMediaText(lesson.videoSource?.title || lesson.title)}"
          referrerpolicy="strict-origin-when-cross-origin"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          style="border-radius:10px;"></iframe>`;
      videoBox.style.display = "block";
    } else {
      videoBox.innerHTML = "";
      videoBox.style.display = "none";
    }

    let videoCredit = $("#m-video-credit");
    if (!videoCredit) {
      videoCredit = document.createElement("div");
      videoCredit.id = "m-video-credit";
      videoCredit.className = "fei-media-credit";
      videoBox.after(videoCredit);
    }
    const source = lesson.videoSource;
    videoCredit.innerHTML = source ? `
      <strong>${escapeMediaText(source.title)}</strong>
      <span>By <a href="${escapeMediaText(source.channelUrl)}" target="_blank" rel="noopener">${escapeMediaText(source.channel)}</a></span>
      <a href="${escapeMediaText(source.watchUrl)}" target="_blank" rel="noopener">Open on YouTube ↗</a>
      ${source.note ? `<p>${escapeMediaText(source.note)}</p>` : ""}
      <small>If the player is unavailable in your region or browser, try the original YouTube page.</small>
      ${(lesson.companionVideos || []).map(video => `<p>Also watch: <a href="${escapeMediaText(video.watchUrl)}" target="_blank" rel="noopener">${escapeMediaText(video.title)}</a> · ${escapeMediaText(video.channel)}</p>
        <div class="fei-video-container"><iframe width="100%" height="100%" loading="lazy"
          src="${escapeMediaText(normalizeVideoUrl(video.watchUrl))}" title="${escapeMediaText(video.title)}"
          referrerpolicy="strict-origin-when-cross-origin" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`).join("")}
    ` : "";
    videoCredit.hidden = !source;

    // lecture
    $("#m-lecture-content").innerHTML = lesson.lecture || "";

    // images
    $("#m-images").innerHTML = (lesson.galleryNote ? `<p class="fei-gallery-note">${escapeMediaText(lesson.galleryNote)}</p>` : "") +
      (lesson.images || []).map(image => {
        const item = typeof image === "string" ? { src: image, title: lesson.title } : image;
        return `<figure class="fei-gallery-item">
          <div class="fei-img-box"><img src="${escapeMediaText(item.src)}" alt="${escapeMediaText(item.title)}" loading="lazy" /></div>
          ${item.generated ? `<figcaption><strong>${escapeMediaText(item.title)}</strong><span>AI-assisted teaching illustration for FEI TeamArt.</span><small>Concept illustration, not a historical artwork or an artist’s portrait.</small><a href="${escapeMediaText(item.sourceUrl)}" target="_blank" rel="noopener">About this illustration ↗</a></figcaption>` : item.sourceUrl ? `<figcaption>
            <strong>${escapeMediaText(item.title)}</strong>
            <span>${escapeMediaText(item.credit)}</span>
            <a href="${escapeMediaText(item.sourceUrl)}" target="_blank" rel="noopener">Image source ↗</a> ·
            <a href="${escapeMediaText(item.licenseUrl)}" target="_blank" rel="noopener">${escapeMediaText(item.license)}</a>
            <small>${escapeMediaText(item.changes)}</small>
          </figcaption>` : ""}
        </figure>`;
      }).join("");
    $("#m-images").querySelectorAll("img").forEach(img => {
      img.addEventListener("error", () => {
        img.hidden = true;
        const message = document.createElement("p");
        message.className = "fei-image-fallback";
        message.textContent = "Image could not load. Open the image source below to view it.";
        img.parentElement.appendChild(message);
      }, { once: true });
    });

    // resources
    $("#m-resources").innerHTML = [...(lesson.artworkLinks || []), ...(lesson.resources || [])]
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

    $("#fei-modal").addEventListener("keydown", e => {
      if (e.key !== "Tab") return;
      const focusable = [...$("#fei-modal").querySelectorAll('button, a, iframe, [tabindex="0"]')].filter(el => el.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    });
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
