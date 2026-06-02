# Life OS — Grayson

Personal operating system dashboard.
**Live:** https://life-os-mu-bay.vercel.app
**Repo:** https://github.com/GrayW3b/life-os (branch: main)

---

## Stack
Plain HTML / CSS / vanilla JS — no framework, no build step. State in localStorage.

| File | Purpose |
|------|---------|
| `index.html` | Single-page app, all page markup |
| `style.css` | Design system + all component styles |
| `app.js` | All frontend logic, routing, data |
| `api/chat.js` | Vercel serverless — Groq AI persona chat |
| `api/feed.js` | Vercel serverless — structured briefings (not called by frontend yet) |

---

## Run locally
```
C:\Users\grays\anaconda3\python.exe -m http.server 3000
```
Or use the **life-os** config in `.claude/launch.json`. Bare `python` doesn't work — must use full Anaconda path.

## Deploy
```
git add index.html style.css app.js api/
git commit -m "msg"
git push
```
Vercel auto-deploys on push to `main` (~60s). No build step.

---

## Architecture — Hash-based routing
Pages: `#home` `#income` `#health` `#markets` `#code` `#growth` `#tools`
Each page is a `.page` div. `navigate(page)` in `app.js` handles show/hide + sidebar active state.

### Pages
| Hash | Name | Key content |
|------|------|-------------|
| `#home` | Overview | Hero, 3 stat cards, 6 pillar nav cards (3×2 grid), habits, milestones, HN headlines |
| `#income` | Income Lab | Milestones, HN news, AI chat |
| `#health` | Health HQ | Habits mirror, 3-day workout split, nutrition targets, news, AI chat |
| `#markets` | Markets | HN news, AI chat |
| `#code` | Code Lab | Daily JS challenge + project idea, dev news, AI chat |
| `#growth` | Growth | Baby countdown, daily quote, parenting tip, baby prep checklist, news, AI chat |
| `#tools` | Tools | KDP (live), YouTube Pipeline (soon), Etsy (soon) |

---

## Design system
```
--bg: #0d0f1a       dark navy base
--card: #181d30     elevated cards
--card-2: #1f2540   inputs, inner elements
--ink: #e4e6f0      primary text
--muted: #7880a0    secondary text
--brand: #6366f1    indigo primary
--brand-2: #8b5cf6  violet secondary
--r: 16px           border radius
--sidebar-w: 236px
```

**Pillar accent colors:**
- Income → `#f59e0b` (amber)
- Health → `#10b981` (emerald)
- Markets → `#3b82f6` (blue)
- Code → `#8b5cf6` (violet)
- Growth → `#f43f5e` (rose)
- Tools → `#0ea5e9` (sky)

---

## AI — Groq (free tier)
- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Model: `llama-3.3-70b-versatile`
- Env var: `GROQ_API_KEY` — set in **Vercel project settings only**, never in code
- AI only works on Vercel (not from `file://`)

Each pillar page has a sticky chat panel (`#cp-{space}`). 5 quick-action buttons per space. `openChat(spaceKey, message)` fires pre-written prompts from content cards.

---

## News feeds — HN Algolia
`hn.algolia.com/api/v1/search` — CORS-native, no key, works locally.
Cached 15 min in `store.news[page]`. 12 items per pillar feed, 6 on home.
**Avoid:** rss2json (rate-limited), corsproxy.io (unreliable) — both tested and rejected.

---

## localStorage
Key: `lifeos-v4` — changing this key loses all user data.
Stores: `habitsList`, `habitsDone`, `habitsDate`, `milestones`, `chats`, `news`, `babyPrep`, `quoteIdx`, `tipIdx`

---

## User context
- **Owner:** Grayson, 30, Denver (MDT)
- **Goal:** Passive/automated income only — NOT active sales. North star: $100/day.
- **Automation stack:** KDP Tool (live) → YouTube Pipeline (next) → Etsy (after)
- **Health:** Fat loss, 6'3" 250lbs, ~3 hrs/week
- **Baby due:** November 12, 2026
- **Coding level:** Beginner, ~2 hrs/week
- **Tone:** No fluff. Push back on shiny objects. Be consultative.

---

## Key decisions / gotchas
- **Pillar grid is `repeat(3, 1fr)`** — was `repeat(5,1fr)` but 6th card (Tools) broke layout
- **Income Lab hero says** "KDP · YouTube · Etsy · passive income" — NOT "Freelance SDR"
- **No Tailwind, no React** — intentional, keeps it simple for a beginner
- **HN only for news** — other sources tried and rejected (see above)
- **PDF generation is client-side** — uses pdf-lib CDN, no server timeout issues
