# FEI TeamArt Smart Class

Interactive art education platform — modular lessons with LFC (Learn From Collection) moments, AI-driven thinking responses, and adaptive age-group personalization.

## 🌐 Live URLs

- **Production**: https://fayechenca-cmyk.github.io/feiteamart-smartclass/
- **Lesson 1 (Sphere)**: https://fayechenca-cmyk.github.io/feiteamart-smartclass/lessons/lesson-1-sphere/
- **Lesson 2 (Cube)**: https://fayechenca-cmyk.github.io/feiteamart-smartclass/lessons/lesson-2-cube/

## 📁 Architecture

```
feiteamart-smartclass/
│
├── index.html                     ← Platform homepage (lesson directory)
│
├── /core/                         ← Shared modules (used by every lesson)
│   ├── style.css                  ← All styles (brand colors, components)
│   ├── profile.js                 ← UserProfile (guest → free_intro → member)
│   ├── waitlist.js                ← WaitlistStorage + Formspree integration
│   ├── analytics.js               ← Analytics layer
│   ├── journal.js                 ← JournalStorage (cross-lesson thinking)
│   ├── lfc-system.js              ← LFC artworks library + LFC.query()
│   ├── echo-engine.js             ← 4-layer Echo response generator
│   ├── access-control.js          ← AccessControl (free/preview/unlocked)
│   ├── welcome-page.js            ← Platform welcome (name + age group)
│   ├── members-lock.js            ← Members-only lock screen for paid lessons
│   ├── audio.js                   ← Sound + music
│   ├── shared-html.js             ← Shared HTML fragments (Artchi, modals, etc.)
│   └── lesson-app.js              ← The "shell" that runs any lesson
│
├── /lessons/                      ← Per-lesson content (data only)
│   ├── lesson-1-sphere/
│   │   ├── index.html             ← Loads core + injects this lesson's data
│   │   ├── lesson-data.js         ← LESSON metadata + steps
│   │   ├── lfc-moments.js         ← This lesson's LFC moments
│   │   └── echo-templates.js      ← This lesson's Echo response templates
│   │
│   └── lesson-2-cube/
│       └── (same structure)
│
└── /assets/
    └── lfc-artworks/              ← Real artwork images (replacing placeholders)
```

## 🎨 Brand

- **Fonts**: Montserrat (headings) + Open Sans (body)
- **Colors**: 
  - Ink: `#1a1d2b`
  - Accent: `#67e8f9`
  - Gold: `#c8a96e`
  - Green: `#1d9e75`
  - Mint: `#CFF5E4`
  - Cream: `#FBF0C7`
  - Purple: `#a78bfa` (Artchi mascot)

## 🔧 Tech Stack

- **Hosting**: GitHub Pages (free, https)
- **Email**: Formspree (free tier, 50/month) — endpoint: `https://formspree.io/f/mnjvqkdb`
- **Storage**: localStorage (zero-cost, will upgrade to Supabase when needed)
- **No build step**: pure HTML/CSS/JS, drag-and-drop deployment

## 📚 Adding a New Lesson

To add Lesson 3 (Cylinder), Lesson 4, etc.:

1. Copy `/lessons/lesson-2-cube/` → `/lessons/lesson-3-cylinder/`
2. Edit `lesson-data.js` (LESSON metadata, steps)
3. Edit `lfc-moments.js` (3 moments with new artists)
4. Edit `echo-templates.js` (responses for each Quest answer)
5. Edit `index.html` to load this lesson's data
6. Push to GitHub — auto-deploys to Pages

**No core code changes required.** Bug fixes and feature improvements happen once in `/core/` and benefit all lessons.

## 🔐 User Identity Tiers

| Tier | What they have | What they see |
|---|---|---|
| `guest` | Name + age group only (localStorage) | Full Lesson 1, badge gate at end |
| `free_intro` | + Email (after Lesson 1 badge claim) | Same as guest currently — different in future |
| `member` | + Paid subscription (future) | All lessons unlocked |

## 📧 Formspree Integration

When a student fills the Badge Gate or Members Lock email form:
1. Saved to `localStorage` (always works, even offline)
2. Sent via fetch to Formspree → arrives in Faye's Gmail (only works on `https://`, blocks `file://`)
3. Console shows friendly warning if testing locally on `file://` protocol

## 🚀 Local Development

```bash
# Clone the repo
git clone https://github.com/fayechenca-cmyk/feiteamart-smartclass.git
cd feiteamart-smartclass

# Serve locally (Python — comes pre-installed on Mac)
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

Local development requires `localhost` (not `file://`) for Formspree to work.

## 📝 Version History

- **v19-baseline** (Lesson 1 stable) — 8 bugs fixed, Formspree integrated
- **lesson-2-cube-v1** (WIP) — based on v19 architecture
- **modular-v1** (this repo) — single-file split into modules

## 👤 Created by

Faye Chen · FEI TeamArt · Burnaby BC · 2026
