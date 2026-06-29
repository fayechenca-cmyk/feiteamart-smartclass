/* ═══════════════════════════════════════════════════════════════════════════
 *  Artchi — platform-wide companion, ported into Scene Drawing
 *
 *  This is the SAME character used across FEI TeamArt's other lessons
 *  (see lessons/lfc018-learn-from-masters-pop-art/index.html and the
 *  Foundation A lesson files) — same SVG body, same gradient colors, same
 *  sleep/wake/excited states, same drag behavior, same speech-bubble API.
 *  Scene Drawing reuses the shell as-is so Artchi looks and behaves
 *  identically everywhere a student meets her.
 *
 *  WHAT'S DIFFERENT FROM THE ORIGINAL
 *  The original also opens an AI chat modal on click (Scene Drawing has no
 *  chat feature yet, so clicking just shows an encouraging line instead).
 *  Everything else — markup, CSS classes, function names, localStorage key
 *  — is unchanged, specifically so this stays a true "same character,
 *  same behavior" port rather than a new mascot that merely looks similar.
 * ═══════════════════════════════════════════════════════════════════════════ */

const ARTCHI_GLOBAL_FLAG = 'fei_artchi_introduced'; // shared across the whole platform — same key as every other lesson
let artchiSleepTimer = null;

// Short, varied lines for different moments. Kept here (not hardcoded into
// scene-drawing-app.js) so future lessons can add their own without
// touching the mascot shell itself.
const ARTCHI_LINES = {
  stepAdvance: [
    'nice — keep going ✨', 'good work 🎨', 'love it 💛', 'onward!',
    'your space is starting to grow.', 'check your guide lines before adding details.'
  ],
  interactiveHint: [
    'try dragging the VP!', 'drag the horizon line and watch the room change!',
    'go ahead — pull it around.', 'see what happens when you move it!'
  ],
  lessonComplete: [
    'you completed this perspective challenge!', 'ready for the next room?',
    'nicely built ✨'
  ],
  reflectionDone: [
    'nice reflection! your artist brain is warming up.',
    'good check. perspective gets easier when you can name what you did.'
  ],
  idleClick: [
    'ready to build your room?', 'tap a step to keep going!', 'i’m right here ✨'
  ]
};
function artchiRandomLine(category) {
  const lines = ARTCHI_LINES[category] || ARTCHI_LINES.idleClick;
  return lines[Math.floor(Math.random() * lines.length)];
}

function artchiMarkup() {
  return `
    <!-- Floating mascot (draggable, sleeps after idle) -->
    <div class="artchi-mascot awake hidden" id="artchi-character" onclick="" title="Artchi">
      <svg width="110" height="110" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="artchiBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e9d5ff"/>
            <stop offset="50%" stop-color="#c4b5fd"/>
            <stop offset="100%" stop-color="#a78bfa"/>
          </linearGradient>
          <linearGradient id="artchiWing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.85"/>
            <stop offset="50%" stop-color="#fda4af" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#c4b5fd" stop-opacity="0.85"/>
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="92" rx="22" ry="4" fill="rgba(0,0,0,0.08)"/>
        <path d="M 22 50 Q 5 32 12 55 Q 18 70 32 62 Z" fill="url(#artchiWing)" opacity="0.9"/>
        <path d="M 78 50 Q 95 32 88 55 Q 82 70 68 62 Z" fill="url(#artchiWing)" opacity="0.9"/>
        <ellipse cx="50" cy="62" rx="22" ry="26" fill="url(#artchiBody)"/>
        <ellipse cx="50" cy="40" rx="20" ry="18" fill="url(#artchiBody)"/>
        <path d="M 34 28 Q 34 16 44 18 L 56 18 Q 66 16 66 28 Z" fill="#8b5cf6"/>
        <circle cx="50" cy="16" r="3.5" fill="#c8a96e"/>
        <path d="M 34 26 Q 38 20 42 26 Q 40 30 34 28 Z" fill="#c4b5fd"/>
        <path d="M 66 26 Q 62 20 58 26 Q 60 30 66 28 Z" fill="#c4b5fd"/>
        <g class="artchi-eye">
          <circle cx="42" cy="43" r="3.5" fill="#1a1d2b"/>
          <circle cx="58" cy="43" r="3.5" fill="#1a1d2b"/>
          <circle cx="43" cy="42" r="1" fill="#fff"/>
          <circle cx="59" cy="42" r="1" fill="#fff"/>
        </g>
        <circle cx="36" cy="50" r="2.5" fill="#fda4af" opacity="0.7"/>
        <circle cx="64" cy="50" r="2.5" fill="#fda4af" opacity="0.7"/>
        <path d="M 46 50 Q 50 53 54 50" stroke="#1a1d2b" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <ellipse cx="35" cy="72" rx="9" ry="6" fill="#fff"/>
        <circle cx="31" cy="70" r="2" fill="#ef4444"/>
        <circle cx="36" cy="70" r="2" fill="#f59e0b"/>
        <circle cx="34" cy="75" r="2" fill="#1d9e75"/>
        <circle cx="39" cy="74" r="2" fill="#3b82f6"/>
      </svg>
    </div>

    <!-- Speech bubble (shows encouragement messages) -->
    <div class="artchi-bubble" id="artchi-bubble">
      <span class="artchi-bubble-close" onclick="closeArtchiBubble()">×</span>
      <span id="artchi-bubble-text">Hi! I'm Artchi ✨</span>
    </div>

    <!-- Persistent "Ask Artchi" label -->
    <div class="artchi-label hidden" id="artchi-label">💬 Hi, I'm Artchi</div>

    <!-- Onboarding modal (first visit anywhere on the platform, then never again) -->
    <div class="artchi-onboard-backdrop" id="artchi-onboard">
      <div class="artchi-onboard-card">
        <div class="artchi-onboard-svg-wrap">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="onboardBody2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#e9d5ff"/>
                <stop offset="50%" stop-color="#c4b5fd"/>
                <stop offset="100%" stop-color="#a78bfa"/>
              </linearGradient>
              <linearGradient id="onboardWing2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.85"/>
                <stop offset="50%" stop-color="#fda4af" stop-opacity="0.7"/>
                <stop offset="100%" stop-color="#c4b5fd" stop-opacity="0.85"/>
              </linearGradient>
            </defs>
            <path d="M 22 50 Q 5 32 12 55 Q 18 70 32 62 Z" fill="url(#onboardWing2)" opacity="0.9"/>
            <path d="M 78 50 Q 95 32 88 55 Q 82 70 68 62 Z" fill="url(#onboardWing2)" opacity="0.9"/>
            <ellipse cx="50" cy="62" rx="22" ry="26" fill="url(#onboardBody2)"/>
            <ellipse cx="50" cy="40" rx="20" ry="18" fill="url(#onboardBody2)"/>
            <path d="M 34 28 Q 34 16 44 18 L 56 18 Q 66 16 66 28 Z" fill="#8b5cf6"/>
            <circle cx="50" cy="16" r="3.5" fill="#c8a96e"/>
            <circle cx="42" cy="43" r="3.5" fill="#1a1d2b"/>
            <circle cx="58" cy="43" r="3.5" fill="#1a1d2b"/>
            <circle cx="43" cy="42" r="1" fill="#fff"/>
            <circle cx="59" cy="42" r="1" fill="#fff"/>
            <circle cx="36" cy="50" r="2.5" fill="#fda4af" opacity="0.7"/>
            <circle cx="64" cy="50" r="2.5" fill="#fda4af" opacity="0.7"/>
            <path d="M 46 50 Q 50 53 54 50" stroke="#1a1d2b" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="artchi-onboard-title">Hi, I'm Artchi!</div>
        <div class="artchi-onboard-sub">Your art companion ✨</div>
        <button class="btn btn-ink" style="margin-top: 6px;" onclick="closeArtchiOnboard()">Let's go →</button>
      </div>
    </div>

    ${artchiChatMarkup()}
  `;
}

function showArtchi() {
  const character = document.getElementById('artchi-character');
  if (!character) return; // host page didn't include artchiMarkup() — fail quietly
  character.classList.remove('hidden');
  document.getElementById('artchi-label').classList.remove('hidden');
  resetArtchiSleep();
  if (!localStorage.getItem(ARTCHI_GLOBAL_FLAG)) {
    setTimeout(() => openArtchiOnboard(), 600);
  } else {
    setTimeout(() => showArtchiBubble(artchiRandomLine('idleClick'), 3000), 800);
  }
}

function resetArtchiSleep() {
  clearTimeout(artchiSleepTimer);
  const a = document.getElementById('artchi-character');
  if (!a) return;
  a.classList.remove('sleep');
  a.classList.add('awake');
  artchiSleepTimer = setTimeout(() => {
    a.classList.remove('awake');
    a.classList.add('sleep');
  }, 60000);
}

function showArtchiBubble(text, duration) {
  const b = document.getElementById('artchi-bubble');
  const t = document.getElementById('artchi-bubble-text');
  if (!b || !t) return;
  t.textContent = text;
  b.classList.add('show');
  const label = document.getElementById('artchi-label');
  if (label) label.classList.add('muted');
  if (duration) setTimeout(() => closeArtchiBubble(), duration);
}
function closeArtchiBubble() {
  const b = document.getElementById('artchi-bubble');
  if (b) b.classList.remove('show');
  const label = document.getElementById('artchi-label');
  if (label) label.classList.remove('muted');
}

// ─── SOUND (ported from Foundation A's playTone — same synthesized tone,
// no audio files needed, respects a simple on/off toggle) ───
let sceneDrawingSoundOn = true;
function artchiPlayTone(freq, dur) {
  if (!sceneDrawingSoundOn) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(); osc.stop(ctx.currentTime + dur);
  } catch (e) { /* Web Audio unavailable — fail silently, never block the click */ }
}

function onArtchiClick() {
  const a = document.getElementById('artchi-character');
  if (a) {
    a.classList.add('excited');
    setTimeout(() => a.classList.remove('excited'), 1800);
  }
  artchiPlayTone(880, 0.15);
  setTimeout(() => artchiPlayTone(1100, 0.15), 100);
  openArtchiChat();
}

// ─── CHAT (ported shell from Foundation A's chat modal — same look and
// greeting, but canned encouragement instead of a real AI backend, since
// Scene Drawing has no chat API yet) ───
function artchiChatMarkup() {
  return `
    <div class="artchi-chat" id="artchi-chat">
      <div class="artchi-chat-head">
        <div class="artchi-chat-head-info">
          <b>Artchi</b>
          <span>● Online · here to help</span>
        </div>
        <div class="artchi-chat-close" onclick="closeArtchiChat()">×</div>
      </div>
      <div class="artchi-chat-body" id="artchi-chat-body">
        <div class="artchi-msg bot">Hi! I'm Artchi ✨ Ask me anything about this lesson!</div>
      </div>
      <div class="artchi-chat-input-wrap">
        <input type="text" class="artchi-chat-input" placeholder="Type your question..." id="artchi-chat-inp"
          onkeypress="if(event.key==='Enter') sendArtchiChat()">
        <button class="artchi-chat-send" onclick="sendArtchiChat()">Send</button>
      </div>
    </div>
  `;
}

const ARTCHI_CHAT_REPLIES = [
  "Try dragging the VP and watch what happens to the lines!",
  "Remember: the horizon line is your eye level.",
  "You've got this — one step at a time ✨",
  "Check the Teacher Tip on this step for a hint.",
  "I'm not a full AI chat yet, but I'm cheering you on either way!"
];
function openArtchiChat() {
  const chat = document.getElementById('artchi-chat');
  if (chat) chat.classList.add('show');
  closeArtchiBubble();
}
function closeArtchiChat() {
  const chat = document.getElementById('artchi-chat');
  if (chat) chat.classList.remove('show');
}
function sendArtchiChat() {
  const inp = document.getElementById('artchi-chat-inp');
  const body = document.getElementById('artchi-chat-body');
  if (!inp || !body || !inp.value.trim()) return;
  const userText = inp.value.trim();
  body.innerHTML += `<div class="artchi-msg user">${userText}</div>`;
  inp.value = '';
  const reply = ARTCHI_CHAT_REPLIES[Math.floor(Math.random() * ARTCHI_CHAT_REPLIES.length)];
  setTimeout(() => {
    body.innerHTML += `<div class="artchi-msg bot">${reply}</div>`;
    body.scrollTop = body.scrollHeight;
  }, 350);
  body.scrollTop = body.scrollHeight;
}

// ─── SIDE PANEL (tablet/desktop only — mirrors Foundation A's Actions
// panel: My Journey / Upload my work / Bring Artchi back / About Artchi) ───
function sidePanelMarkup() {
  return `
    <div class="side-panel-title">Actions</div>
    <div class="side-artchi-preview">
      <svg width="60" height="60" viewBox="0 0 100 100" style="display:block; margin:0 auto 8px;">
        <defs>
          <linearGradient id="sidePreviewBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e9d5ff"/>
            <stop offset="100%" stop-color="#a78bfa"/>
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="62" rx="22" ry="26" fill="url(#sidePreviewBody)"/>
        <ellipse cx="50" cy="40" rx="20" ry="18" fill="url(#sidePreviewBody)"/>
        <path d="M 34 28 Q 34 16 44 18 L 56 18 Q 66 16 66 28 Z" fill="#8b5cf6"/>
        <circle cx="50" cy="16" r="3.5" fill="#c8a96e"/>
        <circle cx="42" cy="43" r="3.5" fill="#1a1d2b"/>
        <circle cx="58" cy="43" r="3.5" fill="#1a1d2b"/>
        <path d="M 46 50 Q 50 53 54 50" stroke="#1a1d2b" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      </svg>
      <div class="side-artchi-preview-name">Artchi lives in the corner</div>
      <div class="side-artchi-preview-sub">Tap her to chat. Use buttons below for actions.</div>
    </div>
    <div class="side-actions">
      <button class="side-action-btn primary" onclick="if(typeof openMyJourney === 'function') openMyJourney(); else showArtchiBubble('My Journey opens from the main app menu ✨', 2600);">
        <span class="side-action-btn-ico">📖</span><span>My Journey</span>
      </button>
      <button class="side-action-btn" onclick="document.querySelector('.upload-drop-zone') ? document.querySelector('.upload-drop-zone').scrollIntoView({behavior:'smooth'}) : showArtchiBubble('Upload from the lesson wrap-up screen ✨', 2600);">
        <span class="side-action-btn-ico">📸</span><span>Upload my work</span>
      </button>
      <button class="side-action-btn" onclick="showArtchi(); showArtchiBubble('I’m back! ✨', 2200);">
        <span class="side-action-btn-ico">🧚</span><span>Bring Artchi back</span>
      </button>
      <button class="side-action-btn" onclick="openArtchiAbout()">
        <span class="side-action-btn-ico">ℹ️</span><span>About Artchi</span>
      </button>
    </div>
  `;
}
function openArtchiAbout() { openArtchiOnboard(); }

function openArtchiOnboard() {
  const el = document.getElementById('artchi-onboard');
  if (el) el.classList.add('show');
}
function closeArtchiOnboard() {
  const el = document.getElementById('artchi-onboard');
  if (el) el.classList.remove('show');
  localStorage.setItem(ARTCHI_GLOBAL_FLAG, 'true');
  resetArtchiSleep();
  setTimeout(() => showArtchiBubble("i'm here whenever you need me ✨", 3000), 400);
}

// ─── DRAG + CLICK ──────────────────────────────────────────────────────
function initArtchiDrag() {
  const a = document.getElementById('artchi-character');
  if (!a) return;
  let dragging = false, offX = 0, offY = 0, moved = false;

  function onDown(e) {
    dragging = true; moved = false;
    const rect = a.getBoundingClientRect();
    const cx = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
    const cy = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);
    offX = cx - rect.left; offY = cy - rect.top;
    a.style.right = 'auto'; a.style.bottom = 'auto';
    if (e.preventDefault) e.preventDefault();
  }
  function onMove(e) {
    if (!dragging) return;
    moved = true;
    const cx = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
    const cy = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);
    const rect = a.getBoundingClientRect();
    let x = cx - offX, y = cy - offY;
    x = Math.max(0, Math.min(window.innerWidth - rect.width, x));
    y = Math.max(0, Math.min(window.innerHeight - rect.height, y));
    a.style.left = x + 'px'; a.style.top = y + 'px';
  }
  function onUp() {
    if (dragging && !moved) onArtchiClick();
    dragging = false;
  }
  a.addEventListener('mousedown', onDown);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  a.addEventListener('touchstart', onDown, { passive: false });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onUp);

  document.addEventListener('click', () => { if (!a.classList.contains('hidden')) resetArtchiSleep(); });
  document.addEventListener('touchstart', () => { if (!a.classList.contains('hidden')) resetArtchiSleep(); }, { passive: true });
}
