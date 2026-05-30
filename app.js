// ════════════════════════════════════════════════════════
//  Life OS dashboard — v3 (AI spaces + daily brief)
// ════════════════════════════════════════════════════════

const BABY_DAY = new Date('2026-11-12T00:00:00');
const BRIEF_MAX_AGE = 18 * 60 * 60 * 1000; // regenerate briefs older than 18h

// Shared context baked into every space persona.
const GRAYSON = `You are speaking with Grayson: 30, married, first child due November 12, sole income provider, lives in Denver. Account Manager with strong consultative sales and people skills, basic coding knowledge. ~15 hrs/week available across goals, ~$100/mo budget. Tone: consultative, educational, realistic, no fluff. Push back when he's chasing shiny objects or getting ahead of himself. Never give medical advice — refer him to a professional for anything clinical. Keep replies focused and skimmable.`;

const SPACES = {
  income: {
    name: 'Income Lab', icon: '💰', accent: '#f59e0b',
    sub: 'Pragmatic idea-validation partner',
    system: `${GRAYSON}\n\nYou are a pragmatic business operator and idea-validation partner. Income goal: $100/day treated as a 6–12 month build. Active income first using his sales skills, passive later. Be skeptical of hype. For any idea give: (1) smallest testable version, (2) real time/money cost, (3) first 3 concrete steps, (4) biggest risk. Ground everything in what he can do this week.`,
    quick: [
      { label: '⚡ Income Ideas', text: 'Generate 3 realistic income ideas I can act on this week based on my consultative sales skills. For each: what it is, who pays, first step to test it, realistic first-month earning potential.' },
      { label: '🔍 Pressure-Test', text: 'I want to pressure-test an idea. Ask me what it is, then break it down: smallest testable version, real cost in time and money, first 3 steps, biggest risk.' },
      { label: "📅 This Week's Move", text: 'Given my income goals and a baby due in November, what is the single most important thing I should do this week? Be specific — what, how long, what success looks like.' },
      { label: '💼 Freelance Pitch', text: 'Draft a short cold outreach message I could send today to a small business offering to help with their sales outreach or lead follow-up.' },
    ],
  },
  health: {
    name: 'Health HQ', icon: '💪', accent: '#10b981',
    sub: 'Evidence-based habit coach',
    system: `${GRAYSON}\n\nYou are an evidence-based training, nutrition, sleep, and habit coach. He has ~3 hrs/week for health. Goals: sustainable fat loss, baseline strength, energy, longevity — be fit and active for his kid. You are NOT a doctor — send him to a professional for anything medical. No extreme restriction or unsafe loads. Ask about equipment and injuries before building plans. Favor habits he'll keep through a newborn phase; sleep disruption is coming, so build resilience in.`,
    quick: [
      { label: '💪 Weekly Workout', text: 'Build me a practical workout plan for this week. I have about 3 hours total. Before building it, ask me what equipment I have and if I have any injuries.' },
      { label: '🍽️ Meal Plan', text: 'Create a simple weekly meal plan for fat loss and energy. Ask me about food preferences, restrictions, and cooking time first.' },
      { label: '📊 Weekly Check-In', text: 'Run my weekly health check-in. Ask about workouts, nutrition, sleep, energy. Give me one focused adjustment for next week — just one.' },
      { label: '😴 Sleep Routine', text: 'Build me a practical wind-down routine. Flag that protecting sleep now matters even more before the baby arrives.' },
    ],
  },
  markets: {
    name: 'Markets', icon: '📈', accent: '#3b82f6',
    sub: 'Business educator & idea generator',
    system: `${GRAYSON}\n\nYou are a business educator, markets explainer, and entrepreneurship idea generator. Teach the "why" behind business, finance, and markets — never just facts. You are NOT a financial advisor — explain concepts and tradeoffs, never give buy/sell advice on specific assets. For every market or business development, draw the entrepreneurial angle. Quiz him and build on earlier lessons.`,
    quick: [
      { label: '📰 Business Briefing', text: 'Give me a business and entrepreneurship briefing. Cover 4 important things in business and markets right now — plain English, why it matters to me, and what entrepreneurial angle it suggests.' },
      { label: '🎓 Teach Me Something', text: 'Teach me one foundational business or finance concept. Explain the real-world why, give a concrete example, then quiz me.' },
      { label: '💡 Business Ideas', text: 'Generate 3 business ideas that fit my sales background. For each: what it is, who the customer is, why my skills give me an edge, first testable step.' },
      { label: '📚 Build My Syllabus', text: 'Create a personalized 12-week business and finance learning plan for a motivated beginner starting from scratch.' },
    ],
  },
  code: {
    name: 'Code Lab', icon: '⌨️', accent: '#8b5cf6',
    sub: 'Patient senior engineer & mentor',
    system: `${GRAYSON}\n\nYou are a patient senior engineer and coding mentor. He is a near-complete beginner with ~2 hrs/week; the goal is to build small useful or sellable tools. Teach through real finishable projects tied to his actual goals (income, health, daily life). Guide toward answers rather than dumping solutions. Track what you've covered. Help him set up Git/GitHub. Review code honestly. Encouraging but no fluff.`,
    quick: [
      { label: '🛠️ Suggest a Project', text: 'Suggest one beginner project I can finish in ~2 hours this week, tied to one of my real goals. Give the what, why it fits me, and step one.' },
      { label: '📚 Teach a Concept', text: 'Explain one coding concept I should learn next. Plain English, small working example, why it matters.' },
      { label: '🚀 Pick My Language', text: 'Tell me what language to learn first for building sellable tools. Direct recommendation, tell me why.' },
      { label: '🐙 GitHub Setup', text: 'Walk me through creating a repo, making a first commit, and pushing code — step by step.' },
    ],
  },
  growth: {
    name: 'Growth', icon: '🌱', accent: '#f43f5e',
    sub: 'Grounded reflection partner',
    system: `${GRAYSON}\n\nYou are a grounded mentor and reflection partner. Goal: he becomes dependable, capable, a steady leader for his family. Use journaling prompts, honest questions, accountability. You are NOT a therapist — point him to a professional or trusted person for serious struggles. Encourage real-world relationships and action over endless self-reflection. Challenge him directly when he's avoiding something. Remind him being a great partner to his wife matters as much as any personal goal.`,
    quick: [
      { label: '📋 Weekly Review', text: 'Run my weekly review — tight and honest. Ask: biggest win, where I fell short, how I showed up for my wife, one focus for next week. Reflect back what you hear.' },
      { label: '🌅 Morning Prompt', text: 'Give me one sharp morning journal prompt. One specific question I\'ll actually sit with.' },
      { label: '🎯 Set My Intention', text: 'Ask what\'s weighing on me most right now. Help me commit to one concrete thing for the week.' },
      { label: '💬 Values Check', text: 'Walk me through defining or revisiting 4–5 core values and what living them looks like right now.' },
    ],
  },
};

const DEFAULT_HABITS = [
  { id: 'journal', emoji: '📝', label: '2-min journal — grateful + one goal' },
  { id: 'workout', emoji: '💪', label: 'Workout or intentional movement' },
  { id: 'water',   emoji: '💧', label: 'Drink enough water' },
  { id: 'steps',   emoji: '🚶', label: 'Get your steps / short walk' },
  { id: 'income',  emoji: '💰', label: 'One income-building action' },
  { id: 'learn',   emoji: '📚', label: 'Learn something (code / business / markets)' },
  { id: 'family',  emoji: '❤️',  label: 'Be present for your wife' },
];

const DEFAULT_MILESTONES = [
  { id: 'first', label: 'First paid dollar',      sub: 'Target: weeks 2–4' },
  { id: 'five',  label: '$500 in a single month', sub: 'Target: ~month 2' },
  { id: 'onek',  label: '$1,000/mo repeatable',   sub: 'Target: months 3–4' },
  { id: 'north', label: '$3,000/mo (~$100/day)',  sub: 'Target: 6–12 months' },
];

const FOCUS_LINES = [
  'Build the man your family can count on.',
  'One income-building action beats a perfect plan.',
  'Consistency over intensity — show up today.',
  'Ship something small. Finished beats perfect.',
  'Protect time with your wife above optimizing yourself.',
  'Learn one thing today that levels you up.',
  "Steady, present, dependable. That's the whole game.",
];

// ── Store (single localStorage object) ───────────────────
const KEY = 'lifeos-v3';
const today = () => new Date().toISOString().slice(0, 10);

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

let store = load();
// Seed defaults once.
if (!store.habitsList) store.habitsList = DEFAULT_HABITS.map((h) => ({ ...h }));
if (!store.milestones) {
  store.milestones = {};
  DEFAULT_MILESTONES.forEach((m) => { store.milestones[m.id] = { label: m.label, sub: m.sub, hit: false, date: null }; });
}
if (!store.chats) store.chats = {};
if (!store.briefs) store.briefs = {};
if (store.habitsDate !== today()) { store.habitsDate = today(); store.habitsDone = {}; }
save(store);

function persist() { save(store); }

// ── Header / hero / stats ────────────────────────────────
function tick() {
  const now = new Date();
  const h = now.getHours();
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent = `${g}, Grayson`;
  document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function renderStats() {
  const now = new Date();
  document.getElementById('hero-focus').textContent =
    FOCUS_LINES[Math.floor(now.getTime() / 86400000) % FOCUS_LINES.length];

  const total = store.habitsList.length;
  const done = Object.values(store.habitsDone || {}).filter(Boolean).length;
  const goalsHit = Object.values(store.milestones).filter((m) => m.hit).length;
  const daysLeft = Math.max(0, Math.ceil((BABY_DAY - now) / 86400000));

  document.getElementById('stat-habits').textContent = `${done}/${total}`;
  document.getElementById('stat-goals').textContent = `${goalsHit}/${DEFAULT_MILESTONES.length}`;
  document.getElementById('stat-days').textContent = daysLeft;
  document.getElementById('baby-countdown').textContent = daysLeft;
}

// ── Habits (customizable) ────────────────────────────────
function renderHabits() {
  const total = store.habitsList.length;
  const done = Object.values(store.habitsDone || {}).filter(Boolean).length;
  document.getElementById('habit-fill').style.width = total ? `${(done / total) * 100}%` : '0%';
  document.getElementById('habit-count').textContent = `${done}/${total}`;

  const list = document.getElementById('habit-list');
  list.innerHTML = store.habitsList.map((h) => `
    <div class="habit ${store.habitsDone[h.id] ? 'done' : ''}" data-id="${h.id}">
      <span class="habit-emoji">${h.emoji || '•'}</span>
      <span class="habit-label">${escapeHTML(h.label)}</span>
      <span class="check">✓</span>
      <button class="habit-del" data-del="${h.id}" title="Remove" aria-label="Remove habit">✕</button>
    </div>`).join('');

  list.querySelectorAll('.habit').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.habit-del')) return;
      const id = el.dataset.id;
      if (store.habitsDone[id]) delete store.habitsDone[id]; else store.habitsDone[id] = true;
      persist(); renderHabits(); renderStats();
    });
  });
  list.querySelectorAll('.habit-del').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.del;
      store.habitsList = store.habitsList.filter((h) => h.id !== id);
      delete store.habitsDone[id];
      persist(); renderHabits(); renderStats();
    });
  });
}

document.getElementById('habit-add').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('habit-input');
  const label = input.value.trim();
  if (!label) return;
  store.habitsList.push({ id: 'h' + Date.now(), emoji: '•', label });
  input.value = '';
  persist(); renderHabits(); renderStats();
});

document.getElementById('reset-habits').addEventListener('click', () => {
  store.habitsDone = {};
  persist(); renderHabits(); renderStats();
});

// ── Milestones (editable + date stamp) ───────────────────
function renderMilestones() {
  const box = document.getElementById('milestones');
  box.innerHTML = DEFAULT_MILESTONES.map((d) => {
    const m = store.milestones[d.id];
    const dateStr = m.hit && m.date
      ? new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '';
    return `
      <div class="milestone ${m.hit ? 'hit' : ''}" data-id="${d.id}">
        <span class="ms-dot"></span>
        <div class="ms-info">
          <div class="ms-label">${escapeHTML(m.label)}</div>
          <div class="ms-sub">${m.hit && dateStr ? 'Hit ' + dateStr : escapeHTML(m.sub || '')}</div>
        </div>
        <button class="ms-edit" data-edit="${d.id}" title="Rename" aria-label="Rename">✎</button>
        <span class="ms-tag">${m.hit ? '✓ Hit it' : 'mark hit'}</span>
      </div>`;
  }).join('');

  box.querySelectorAll('.milestone').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.ms-edit')) return;
      const m = store.milestones[el.dataset.id];
      m.hit = !m.hit;
      m.date = m.hit ? new Date().toISOString() : null;
      persist(); renderMilestones(); renderStats();
    });
  });
  box.querySelectorAll('.ms-edit').forEach((btn) => {
    btn.addEventListener('click', () => {
      const m = store.milestones[btn.dataset.edit];
      const next = prompt('Rename milestone:', m.label);
      if (next && next.trim()) { m.label = next.trim(); persist(); renderMilestones(); }
    });
  });
}

// ── AI Chat drawer ───────────────────────────────────────
let activeSpace = null;

function openSpace(key) {
  activeSpace = key;
  const sp = SPACES[key];
  const drawer = document.getElementById('drawer');
  drawer.style.setProperty('--accent', sp.accent);
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.getElementById('drawer-scrim').classList.add('show');
  document.getElementById('drawer-icon').textContent = sp.icon;
  document.getElementById('drawer-name').textContent = sp.name;
  document.getElementById('drawer-sub').textContent = sp.sub;

  const quick = document.getElementById('chat-quick');
  quick.innerHTML = sp.quick.map((q, i) => `<button class="qbtn" data-q="${i}">${q.label}</button>`).join('');
  quick.querySelectorAll('.qbtn').forEach((b) =>
    b.addEventListener('click', () => sendMessage(sp.quick[b.dataset.q].text)));

  renderChat();
  document.getElementById('chat-text').focus();
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer').setAttribute('aria-hidden', 'true');
  document.getElementById('drawer-scrim').classList.remove('show');
  activeSpace = null;
}

function renderChat() {
  const box = document.getElementById('chat-messages');
  const history = store.chats[activeSpace] || [];
  if (!history.length) {
    box.innerHTML = `<div class="chat-empty">Ask a question or tap a quick action below to start.</div>`;
  } else {
    box.innerHTML = history.map((m) =>
      `<div class="bubble ${m.role === 'user' ? 'me' : 'ai'}">${m.role === 'user' ? escapeHTML(m.text) : renderMarkdown(m.text)}</div>`
    ).join('');
  }
  box.scrollTop = box.scrollHeight;
}

async function sendMessage(text) {
  text = (text || '').trim();
  if (!text || !activeSpace) return;
  const sp = SPACES[activeSpace];
  if (!store.chats[activeSpace]) store.chats[activeSpace] = [];
  const history = store.chats[activeSpace];

  history.push({ role: 'user', text });
  persist();
  renderChat();

  // typing indicator
  const box = document.getElementById('chat-messages');
  box.insertAdjacentHTML('beforeend', `<div class="bubble ai typing" id="typing"><span></span><span></span><span></span></div>`);
  box.scrollTop = box.scrollHeight;

  // Cap history sent to the model (cost control) — last 12 turns.
  const sent = history.slice(-12).map((m) => ({ role: m.role, text: m.text }));

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: sp.system, messages: sent }),
    });
    const data = await res.json();
    document.getElementById('typing')?.remove();
    if (!res.ok) {
      history.push({ role: 'model', text: `⚠️ ${data.error || 'Something went wrong.'}` });
    } else {
      history.push({ role: 'model', text: data.text });
    }
  } catch {
    document.getElementById('typing')?.remove();
    history.push({ role: 'model', text: '⚠️ Could not reach the AI. If you just opened this from a file, it only works once deployed to Vercel.' });
  }
  persist();
  renderChat();
}

document.getElementById('chat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const ta = document.getElementById('chat-text');
  sendMessage(ta.value);
  ta.value = '';
  ta.style.height = 'auto';
});
document.getElementById('chat-text').addEventListener('input', (e) => {
  e.target.style.height = 'auto';
  e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
});
document.getElementById('chat-text').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.getElementById('chat-form').requestSubmit(); }
});
document.getElementById('chat-clear').addEventListener('click', () => {
  if (activeSpace) { store.chats[activeSpace] = []; persist(); renderChat(); }
});
document.getElementById('drawer-close').addEventListener('click', closeDrawer);
document.getElementById('drawer-scrim').addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

document.querySelectorAll('.pillar').forEach((p) =>
  p.addEventListener('click', () => openSpace(p.dataset.space)));

// ── Daily Brief ──────────────────────────────────────────
function briefCard(type) { return document.querySelector(`.brief-card[data-brief="${type}"]`); }

function renderBrief(type) {
  const card = briefCard(type);
  const body = card.querySelector('[data-body]');
  const tsEl = card.querySelector('[data-ts]');
  const cached = store.briefs[type];

  if (!cached || !cached.items || !cached.items.length) {
    body.innerHTML = `<div class="brief-empty">No brief yet — tap ↻ to generate.</div>`;
    tsEl.textContent = '';
    return;
  }
  tsEl.textContent = 'Updated ' + new Date(cached.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  body.innerHTML = cached.items.map((it) => `
    <div class="brief-item">
      <div class="bi-title">${escapeHTML(it.title || '')}</div>
      <div class="bi-insight">${escapeHTML(it.insight || '')}</div>
      <div class="bi-action"><span>Do this:</span> ${escapeHTML(it.action || '')}</div>
    </div>`).join('');
}

async function loadBrief(type, force = false) {
  const cached = store.briefs[type];
  const fresh = cached && cached.ts && (Date.now() - cached.ts < BRIEF_MAX_AGE);
  if (fresh && !force) { renderBrief(type); return; }

  const card = briefCard(type);
  const body = card.querySelector('[data-body]');
  card.classList.add('loading');
  body.innerHTML = `<div class="brief-skel"></div><div class="brief-skel"></div><div class="brief-skel"></div>`;

  try {
    const res = await fetch(`/api/feed?type=${type}`);
    const data = await res.json();
    if (!res.ok || !data.items || !data.items.length) {
      body.innerHTML = `<div class="brief-empty">${escapeHTML(data.error || 'Could not generate the brief. Tap ↻ to retry.')}</div>`;
    } else {
      store.briefs[type] = { items: data.items, ts: Date.now() };
      persist();
      renderBrief(type);
    }
  } catch {
    body.innerHTML = `<div class="brief-empty">Could not reach the AI. This works once deployed to Vercel with your key set.</div>`;
  } finally {
    card.classList.remove('loading');
  }
}

document.querySelectorAll('.brief-refresh').forEach((btn) =>
  btn.addEventListener('click', () => {
    const type = btn.closest('.brief-card').dataset.brief;
    loadBrief(type, true);
  }));

// ── Helpers ──────────────────────────────────────────────
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Tiny markdown: **bold**, *italic*, `code`, bullet lines, line breaks.
function renderMarkdown(text) {
  let html = escapeHTML(text);
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<em>$2</em>');
  html = html.replace(/`([^`]+?)`/g, '<code>$1</code>');
  html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
  html = html.replace(/<\/ul><br>/g, '</ul>').replace(/<br><ul>/g, '<ul>');
  return html;
}

// ── Mobile sidebar + scrollspy ───────────────────────────
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');
function closeSidebar() { sidebar.classList.remove('open'); scrim.classList.remove('show'); }
document.getElementById('menu-btn').addEventListener('click', () => { sidebar.classList.add('open'); scrim.classList.add('show'); });
scrim.addEventListener('click', closeSidebar);

const navLinks = [...document.querySelectorAll('.nav-link')];
navLinks.forEach((l) => l.addEventListener('click', closeSidebar));
const spyTargets = ['top', 'habits', 'goals', 'feed'].map((id) => document.getElementById(id)).filter(Boolean);
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((l) => l.classList.toggle('active', l.dataset.target === e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
spyTargets.forEach((t) => spy.observe(t));

// ── Init ─────────────────────────────────────────────────
tick();
setInterval(tick, 60_000);
renderStats();
renderHabits();
renderMilestones();
renderBrief('business');
renderBrief('health');
loadBrief('business');
loadBrief('health');
