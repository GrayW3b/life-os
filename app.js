// ════════════════════════════════════════════════════════
//  Life OS dashboard
// ════════════════════════════════════════════════════════

const REFRESH_MS = 30 * 60 * 1000;
const BABY_DAY = new Date('2026-11-12T00:00:00');

const HABITS = [
  { id: 'journal', emoji: '📝', label: '2-min journal — grateful + one goal' },
  { id: 'workout', emoji: '💪', label: 'Workout or intentional movement' },
  { id: 'water',   emoji: '💧', label: 'Drink enough water' },
  { id: 'steps',   emoji: '🚶', label: 'Get your steps / short walk' },
  { id: 'income',  emoji: '💰', label: 'One income-building action' },
  { id: 'learn',   emoji: '📚', label: 'Learn something (code / business / markets)' },
  { id: 'family',  emoji: '❤️',  label: 'Be present for your wife' },
];

const MILESTONES = [
  { id: 'first', label: 'First paid dollar',      sub: 'Target: weeks 2–4',   tag: 'Step 1' },
  { id: 'five',  label: '$500 in a single month', sub: 'Target: ~month 2',    tag: 'Step 2' },
  { id: 'onek',  label: '$1,000/mo repeatable',   sub: 'Target: months 3–4',  tag: 'Step 3' },
  { id: 'north', label: '$3,000/mo (~$100/day)',  sub: 'Target: 6–12 months', tag: 'North Star' },
];

const FOCUS_LINES = [
  'Build the man your family can count on.',
  'One income-building action beats a perfect plan.',
  'Consistency over intensity — show up today.',
  'Ship something small. Finished beats perfect.',
  'Protect time with your wife above optimizing yourself.',
  'Learn one thing today that levels you up.',
  'Steady, present, dependable. That\'s the whole game.',
];

const TABS = {
  markets: {
    label: 'Business & Markets',
    hn: ['economy', 'stock market', 'business', 'investing', 'interest rates'],
    rss: ['https://www.cnbc.com/id/10001147/device/rss/rss.html'],
  },
  building: {
    label: 'Tech & Building',
    hn: ['programming', 'artificial intelligence', 'software', 'startup', 'side project'],
    rss: [],
  },
  health: {
    label: 'Health & Longevity',
    hn: ['longevity', 'nutrition', 'sleep', 'fitness', 'health'],
    rss: ['https://www.health.harvard.edu/blog/feed'],
  },
};

let activeTab = 'markets';
let refreshTimer = null;

// ── Storage ──────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0, 10);

function getHabits() {
  try {
    const s = JSON.parse(localStorage.getItem('habits') || '{}');
    return s.date === today() ? (s.done || {}) : {};
  } catch { return {}; }
}
const setHabits = (done) => localStorage.setItem('habits', JSON.stringify({ date: today(), done }));

function getMilestones() {
  try { return JSON.parse(localStorage.getItem('milestones') || '{}'); } catch { return {}; }
}
const setMilestones = (m) => localStorage.setItem('milestones', JSON.stringify(m));

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

function renderHeroAndStats() {
  const now = new Date();
  // deterministic daily focus line
  const dayIndex = Math.floor(now.getTime() / 86400000) % FOCUS_LINES.length;
  document.getElementById('hero-focus').textContent = FOCUS_LINES[dayIndex];

  const habitsDone = Object.values(getHabits()).filter(Boolean).length;
  const goalsHit = Object.values(getMilestones()).filter(Boolean).length;
  const daysLeft = Math.max(0, Math.ceil((BABY_DAY - now) / 86400000));

  document.getElementById('stat-habits').textContent = `${habitsDone}/${HABITS.length}`;
  document.getElementById('stat-goals').textContent = `${goalsHit}/${MILESTONES.length}`;
  document.getElementById('stat-days').textContent = daysLeft;
  document.getElementById('baby-countdown').textContent = daysLeft;
}

// ── Habits ───────────────────────────────────────────────
function renderHabits() {
  const done = getHabits();
  const n = Object.values(done).filter(Boolean).length;
  document.getElementById('habit-fill').style.width = `${(n / HABITS.length) * 100}%`;
  document.getElementById('habit-count').textContent = `${n}/${HABITS.length}`;

  const list = document.getElementById('habit-list');
  list.innerHTML = HABITS.map(h => `
    <div class="habit ${done[h.id] ? 'done' : ''}" data-id="${h.id}">
      <span class="habit-emoji">${h.emoji}</span>
      <span class="habit-label">${h.label}</span>
      <span class="check">✓</span>
    </div>`).join('');

  list.querySelectorAll('.habit').forEach(el =>
    el.addEventListener('click', () => {
      const d = getHabits();
      d[el.dataset.id] ? delete d[el.dataset.id] : (d[el.dataset.id] = true);
      setHabits(d);
      renderHabits();
      renderHeroAndStats();
    }));
}

document.getElementById('reset-habits').addEventListener('click', () => {
  setHabits({});
  renderHabits();
  renderHeroAndStats();
});

// ── Milestones ───────────────────────────────────────────
function renderMilestones() {
  const hit = getMilestones();
  const box = document.getElementById('milestones');
  box.innerHTML = MILESTONES.map(m => `
    <div class="milestone ${hit[m.id] ? 'hit' : ''}" data-id="${m.id}">
      <span class="ms-dot"></span>
      <div class="ms-info"><div class="ms-label">${m.label}</div><div class="ms-sub">${m.sub}</div></div>
      <span class="ms-tag">${hit[m.id] ? '✓ Hit it' : m.tag}</span>
    </div>`).join('');

  box.querySelectorAll('.milestone').forEach(el =>
    el.addEventListener('click', () => {
      const m = getMilestones();
      m[el.dataset.id] = !m[el.dataset.id];
      setMilestones(m);
      renderMilestones();
      renderHeroAndStats();
    }));
}

// ── Feed ─────────────────────────────────────────────────
function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return 'Hacker News'; }
}
function timeAgo(d) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
const cutoff = () => Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 45;

async function fetchHN(query) {
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}`
    + `&tags=story&hitsPerPage=5&numericFilters=points%3E20,created_i%3E${cutoff()}`;
  try {
    const data = await (await fetch(url)).json();
    return (data.hits || []).filter(h => h.title).map(h => ({
      title: h.title,
      link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      source: domainOf(h.url),
      date: new Date(h.created_at),
      meta: `▲ ${h.points} · ${h.num_comments || 0} comments`,
    }));
  } catch { return []; }
}

async function fetchRSS(feedUrl) {
  try {
    const { contents } = await (await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`)).json();
    const xml = new DOMParser().parseFromString(contents, 'text/xml');
    const channel = xml.querySelector('channel > title')?.textContent || domainOf(feedUrl);
    return [...xml.querySelectorAll('item')].slice(0, 6).map(item => {
      const pub = item.querySelector('pubDate')?.textContent;
      return {
        title: item.querySelector('title')?.textContent?.trim() || 'Untitled',
        link: item.querySelector('link')?.textContent?.trim() || '#',
        source: channel,
        date: pub ? new Date(pub) : new Date(),
        meta: '',
      };
    });
  } catch { return []; }
}

function skeletons(n = 6) {
  document.getElementById('feed-grid').innerHTML =
    Array.from({ length: n }, () => '<div class="skeleton"></div>').join('');
}

async function loadFeed(tab) {
  const cfg = TABS[tab];
  skeletons();
  const results = await Promise.allSettled([...cfg.hn.map(fetchHN), ...cfg.rss.map(fetchRSS)]);

  const seen = new Set();
  const items = [];
  for (const r of results) {
    if (r.status !== 'fulfilled') continue;
    for (const it of r.value) {
      const key = it.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 50);
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(it);
    }
  }

  if (tab !== activeTab) return;

  const grid = document.getElementById('feed-grid');
  if (!items.length) {
    grid.innerHTML = '<div class="feed-msg">Couldn\'t reach the feed right now. Check your connection and hit Refresh.</div>';
    return;
  }

  items.sort((a, b) => b.date - a.date);
  grid.innerHTML = items.slice(0, 12).map(it => `
    <a class="feed-card" href="${it.link}" target="_blank" rel="noopener noreferrer">
      <div class="fc-source">${it.source}</div>
      <div class="fc-title">${it.title}</div>
      <div class="fc-meta"><span>${timeAgo(it.date)}</span>${it.meta ? `<span>${it.meta}</span>` : ''}</div>
    </a>`).join('');

  document.getElementById('last-refresh').textContent =
    'Updated ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function renderTabs() {
  const box = document.getElementById('tabs');
  box.innerHTML = Object.entries(TABS).map(([k, v]) =>
    `<button class="tab ${k === activeTab ? 'active' : ''}" data-tab="${k}">${v.label}</button>`).join('');
  box.querySelectorAll('.tab').forEach(btn =>
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      box.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === btn));
      loadFeed(activeTab);
    }));
}

// ── Refresh ──────────────────────────────────────────────
function refresh() {
  const btn = document.getElementById('refresh-btn');
  btn.classList.add('spinning');
  loadFeed(activeTab).finally(() => setTimeout(() => btn.classList.remove('spinning'), 700));
}
function scheduleAuto() {
  clearInterval(refreshTimer);
  refreshTimer = setInterval(() => loadFeed(activeTab), REFRESH_MS);
}
document.getElementById('refresh-btn').addEventListener('click', () => { refresh(); scheduleAuto(); });

// ── Mobile sidebar ───────────────────────────────────────
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');
function closeSidebar() { sidebar.classList.remove('open'); scrim.classList.remove('show'); }
document.getElementById('menu-btn').addEventListener('click', () => {
  sidebar.classList.add('open'); scrim.classList.add('show');
});
scrim.addEventListener('click', closeSidebar);

// ── Scrollspy nav ────────────────────────────────────────
const navLinks = [...document.querySelectorAll('.nav-link')];
navLinks.forEach(l => l.addEventListener('click', closeSidebar));

const spyTargets = ['top', 'habits', 'goals', 'feed']
  .map(id => document.getElementById(id))
  .filter(Boolean);

const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.target === e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
spyTargets.forEach(t => spy.observe(t));

// ── Init ─────────────────────────────────────────────────
tick();
setInterval(tick, 60_000);
renderHeroAndStats();
renderHabits();
renderMilestones();
renderTabs();
loadFeed(activeTab);
scheduleAuto();
