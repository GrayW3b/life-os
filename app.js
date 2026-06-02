// ════════════════════════════════════════════════════════
//  Life OS — v4  (dark · multi-page · live news · inline AI)
// ════════════════════════════════════════════════════════

const BABY_DAY = new Date('2026-11-12T00:00:00');

// ── Shared AI context ─────────────────────────────────────
const GRAYSON = `You are speaking with Grayson: 30, married, first child due November 12 2026, sole income provider, lives in Denver. Account Manager with strong consultative sales and people skills, basic coding knowledge. ~15 hrs/week available, ~$100/mo budget. Tone: consultative, educational, realistic — no fluff. Push back when he's chasing shiny objects. Never give medical advice. Keep replies focused and skimmable.`;

// ── AI Spaces ─────────────────────────────────────────────
const SPACES = {
  income: {
    name: 'Income Lab', icon: '💰', accent: '#f59e0b',
    sub: 'Pragmatic idea-validation partner',
    system: `${GRAYSON}\n\nYou are a pragmatic passive-income and indie-hacker advisor. Income goal: $100/day in 6–12 months through autonomous income streams — digital products, micro-SaaS, content sites, or small tools that earn without active selling. Grayson is NOT looking for freelance or sales work. He wants to build something once, then have it earn while he's being a dad. Be skeptical of hype. For any idea: (1) explain the smallest buildable version, (2) describe exactly how it earns without him showing up daily, (3) give a realistic ramp timeline, (4) name the biggest risk.`,
    quick: [
      { label: '💡 Passive Ideas',    text: 'Give me 3 realistic passive income ideas I can build with basic coding skills and ~15 hrs/week. Must earn automatically — digital products, SaaS tools, or content sites. No freelance, no sales. For each: what it is, how it earns passively, build time, realistic monthly potential at 6 months.' },
      { label: '🔍 Pressure-Test',    text: 'I want to pressure-test a passive income idea. Ask me what it is, then tell me: smallest buildable version, how it earns without me, realistic ramp time, biggest risk.' },
      { label: '🛒 Launch a Product', text: 'Walk me through launching a digital product this week — a PDF guide, Notion template, or mini resource kit. What should I make, who buys it, where do I list it, how do I get first sales without cold outreach?' },
      { label: '⚙️ Automate It',     text: "I have an income idea I'm building. Help me design it so it runs without me — automated delivery, passive traffic, recurring revenue. Ask me what the idea is first." },
    ],
  },
  health: {
    name: 'Health HQ', icon: '💪', accent: '#10b981',
    sub: 'Evidence-based habit coach',
    system: `${GRAYSON}\n\nYou are an evidence-based coach for training, nutrition, sleep, and habits. He has ~3 hrs/week. Goals: sustainable fat loss, baseline strength, energy, longevity. NOT a doctor. No extreme restriction or unsafe loads. Ask about equipment and injuries before building plans. Favor habits he can maintain through a newborn phase.`,
    quick: [
      { label: '💪 Custom Workout',   text: 'Build me a personalized workout plan for this week. I have about 3 hours total. First ask me what equipment I have and if I have any injuries or limitations.' },
      { label: '🍽️ Meal Plan',        text: 'Create a simple weekly meal plan for fat loss and energy. Ask me about food preferences, restrictions, and how much time I have to cook.' },
      { label: '📊 Weekly Check-In',  text: 'Run my weekly health check-in. Ask about workouts, nutrition, sleep, and energy levels. Give me one focused adjustment — just one.' },
      { label: '😴 Sleep Routine',    text: 'Build me a practical wind-down routine. Remind me why protecting sleep now matters before the baby arrives.' },
    ],
  },
  markets: {
    name: 'Markets', icon: '📈', accent: '#3b82f6',
    sub: 'Business educator & idea generator',
    system: `${GRAYSON}\n\nYou are a business educator, markets explainer, and entrepreneurship idea generator. Teach the "why" behind finance and markets. NOT a financial advisor — explain concepts, never give specific buy/sell advice. For every development, draw the entrepreneurial angle. Quiz him and build on prior lessons.`,
    quick: [
      { label: '📰 Markets Brief',    text: 'Give me a business and markets briefing. Cover 4 important developments in plain English — why each matters and what entrepreneurial angle it suggests.' },
      { label: '🎓 Teach Me',        text: 'Teach me one foundational business or finance concept. Explain the real-world why, give a concrete example, then quiz me.' },
      { label: '💡 Business Ideas',  text: 'Generate 3 business ideas that fit my sales background. For each: what it is, who pays, why my skills give me an edge, first testable step.' },
      { label: '📚 12-Week Syllabus', text: 'Create a personalized 12-week business and finance learning plan starting from scratch.' },
    ],
  },
  code: {
    name: 'Code Lab', icon: '⌨️', accent: '#8b5cf6',
    sub: 'Patient senior engineer & mentor',
    system: `${GRAYSON}\n\nYou are a patient senior engineer and coding mentor. Near-complete beginner, ~2 hrs/week. Goal: build small, useful, sellable tools. Teach through real finishable projects tied to his goals. Guide toward answers rather than dumping solutions. Review code honestly. Encouraging but no fluff.`,
    quick: [
      { label: '🛠️ Suggest a Project', text: 'Suggest one beginner project I can finish in ~2 hours this week, tied to one of my real goals. Give the what, why it fits me, and step one.' },
      { label: '📚 Teach a Concept',   text: 'Explain one coding concept I should learn next. Plain English, small working example, why it matters for building tools.' },
      { label: '🚀 What Language?',    text: 'Tell me the best language to learn first for building sellable tools. Direct recommendation and tell me exactly why.' },
      { label: '🐙 GitHub Help',       text: 'Walk me step by step through creating a repo, making a first commit, and pushing code to GitHub.' },
    ],
  },
  growth: {
    name: 'Growth', icon: '🌱', accent: '#f43f5e',
    sub: 'Grounded reflection partner',
    system: `${GRAYSON}\n\nYou are a grounded mentor and reflection partner. Goal: dependable, capable, steady family leader. Use journaling prompts, honest questions, accountability. NOT a therapist. Encourage real-world action. Challenge him when he's avoiding something. Remind him: being a great partner to his wife matters as much as any personal goal.`,
    quick: [
      { label: '📋 Weekly Review',  text: 'Run my weekly review — tight and honest. Ask: biggest win, where I fell short, how I showed up for my wife, one focus for next week.' },
      { label: '🌅 Morning Prompt', text: "Give me one sharp morning journal prompt. One specific question I'll actually sit with." },
      { label: '🎯 Set Intention',  text: "Ask what's weighing on me most. Help me commit to one concrete thing for the week." },
      { label: '👶 Dad Mindset',    text: 'Talk to me about the mindset shift that comes with becoming a father. What should I be thinking about, preparing for emotionally?' },
    ],
  },
};

// ── Default data ──────────────────────────────────────────
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
  'Do the hard thing first. Everything else gets easier.',
  'You are the example your child will grow up to follow.',
  'Progress beats perfection every single time.',
];

// ── News queries ──────────────────────────────────────────
const NEWS_QUERIES = {
  home:    { hn: 'startup technology software',              devto: 'productivity' },
  income:  { hn: 'passive income saas indie hacker product', devto: 'passive-income' },
  health:  { hn: 'health longevity fitness nutrition',       devto: 'health' },
  markets: { hn: 'business markets economy finance investing',    devto: 'career' },
  code:    { hn: 'programming tools software web show hn',        devto: 'javascript' },
  growth:  { hn: 'productivity habits leadership mindset',        devto: 'beginners' },
};

// ── Workout plan ──────────────────────────────────────────
const WORKOUT_PLAN = [
  {
    day: 'Day 1', focus: 'Push — Chest, Shoulders, Triceps', color: '#f59e0b', duration: '~40 min',
    exercises: [
      { name: 'Push-ups',          sets: '4 × 12',   note: 'Elevate feet on a chair to increase difficulty' },
      { name: 'Pike Push-ups',     sets: '3 × 10',   note: 'Shoulders — form a V with your hips high' },
      { name: 'Diamond Push-ups',  sets: '3 × 10',   note: 'Hands form a diamond, hits triceps hard' },
      { name: 'Plank',             sets: '3 × 45 s', note: 'Squeeze glutes, brace core, flat back' },
    ],
  },
  {
    day: 'Day 2', focus: 'Pull + Legs — Back, Biceps, Glutes', color: '#10b981', duration: '~45 min',
    exercises: [
      { name: 'Inverted Rows',     sets: '4 × 10',   note: 'Under a sturdy table, body straight' },
      { name: 'Bodyweight Squats', sets: '4 × 15',   note: 'Go below parallel, chest up' },
      { name: 'Reverse Lunges',    sets: '3 × 10 ea', note: 'Step back, knee hovers near floor' },
      { name: 'Superman Hold',     sets: '3 × 12',   note: 'Lying prone, lift arms + legs, squeeze glutes' },
    ],
  },
  {
    day: 'Day 3', focus: 'Full Body Circuit — Fat Burn', color: '#8b5cf6', duration: '~35 min',
    exercises: [
      { name: 'Burpees',           sets: '3 × 10',   note: 'Full jump at the top' },
      { name: 'Mountain Climbers', sets: '3 × 30 s', note: 'Fast and controlled' },
      { name: 'Jump Squats',       sets: '3 × 12',   note: 'Land soft — absorb with legs, not knees' },
      { name: 'Hollow Body Hold',  sets: '3 × 30 s', note: 'Lower back stays pressed to floor' },
    ],
  },
];

// ── Nutrition targets ─────────────────────────────────────
const NUTRITION = {
  note: 'Estimated for 250 lb male, moderate deficit, fat loss focus.',
  macros: [
    { label: 'Calories', value: '2,400', unit: 'kcal', color: '#f59e0b', note: '~500 cal deficit' },
    { label: 'Protein',  value: '190',   unit: 'g',    color: '#10b981', note: '0.75g per lb' },
    { label: 'Carbs',    value: '240',   unit: 'g',    color: '#3b82f6', note: 'Fuel workouts' },
    { label: 'Fat',      value: '70',    unit: 'g',    color: '#8b5cf6', note: 'Hormones & satiety' },
  ],
  tips: [
    'Hit protein first — fat loss follows when protein is high.',
    'Meal prep one protein source on Sunday (chicken, eggs, ground beef).',
    'Track for just 2 weeks to calibrate — then cook by feel.',
  ],
};

// ── Coding challenges ─────────────────────────────────────
const CODE_CHALLENGES = [
  { title: 'FizzBuzz', difficulty: 'beginner', desc: 'Loop 1–100. Print "Fizz" for multiples of 3, "Buzz" for 5, "FizzBuzz" for both. Classic for a reason.', tags: ['loops', 'conditionals'] },
  { title: 'Reverse a String', difficulty: 'beginner', desc: 'Write a function that reverses a string without using .reverse(). Build it manually with a loop.', tags: ['strings', 'functions'] },
  { title: 'Count Vowels', difficulty: 'beginner', desc: 'Write a function that takes a sentence and returns the number of vowels (a, e, i, o, u). Case-insensitive.', tags: ['strings', 'loops'] },
  { title: 'Palindrome Check', difficulty: 'beginner', desc: 'Write a function that returns true if a word reads the same forwards and backwards. "racecar" → true.', tags: ['strings', 'logic'] },
  { title: 'Find the Largest', difficulty: 'beginner', desc: 'Given an array of numbers, return the largest without using Math.max(). Loop through manually.', tags: ['arrays', 'loops'] },
  { title: 'Flatten an Array', difficulty: 'intermediate', desc: 'Take a nested array like [1,[2,[3]],4] and return [1,2,3,4]. Try it with recursion.', tags: ['arrays', 'recursion'] },
  { title: 'Todo List in the DOM', difficulty: 'beginner', desc: 'Build a working to-do list: an input, an "Add" button, and items that toggle done/undone on click. Pure HTML/CSS/JS.', tags: ['DOM', 'events', 'CSS'] },
  { title: 'Local Storage Persistence', difficulty: 'beginner', desc: 'Take your to-do list and make it survive page refresh using localStorage.getItem and .setItem.', tags: ['localStorage', 'JSON'] },
  { title: 'Fetch an API', difficulty: 'intermediate', desc: 'Fetch the top 5 stories from Hacker News API (hn.algolia.com) and display titles as a list in the DOM.', tags: ['fetch', 'async', 'API'] },
  { title: 'Temperature Converter', difficulty: 'beginner', desc: 'Build a form that converts Fahrenheit ↔ Celsius in real-time as you type. Update the result on every keystroke.', tags: ['DOM', 'math', 'events'] },
  { title: 'Word Frequency Counter', difficulty: 'intermediate', desc: 'Given a paragraph, return an object with each word as a key and its count as the value. Split on spaces, ignore punctuation.', tags: ['objects', 'strings'] },
  { title: 'Countdown Timer', difficulty: 'intermediate', desc: 'Build a countdown timer with start/pause/reset buttons. Display MM:SS format. Use setInterval.', tags: ['timers', 'DOM', 'state'] },
];

// ── Project ideas (passive income — build once, earn autonomously) ────────
const PROJECT_IDEAS = [
  {
    title: 'Niche Directory Site',
    badge: 'passive',
    desc: 'Curate the best tools/resources for one niche (e.g. "best apps for new dads" or "free sales tools"). Monetize with affiliate links — earns every time someone clicks and buys.',
    steps: ['Pick a niche you know. Build a simple HTML page listing 20–30 tools', 'Add affiliate links (Amazon, Gumroad, AppSumo all have programs)', 'Write one SEO-focused intro paragraph so Google sends free traffic'],
    hours: 3,
  },
  {
    title: 'Gumroad Digital Product',
    badge: 'passive',
    desc: 'Package what you know into a PDF guide, cheat sheet, or resource kit. List it for $9–$29. Automated delivery — Gumroad handles payments and emailing the file.',
    steps: ['Write a 10–20 page guide on something you\'ve learned (SDR scripts, sales objections, new dad prep)', 'Upload to Gumroad, set a price, write a short sales page', 'Post in 2–3 relevant Reddit communities or Facebook groups'],
    hours: 5,
  },
  {
    title: 'Chrome Extension',
    badge: 'passive',
    desc: 'A simple browser utility (LinkedIn message templates, tab manager, productivity tool). List on the Chrome Web Store for $3–$5 one-time. Earns while you sleep.',
    steps: ['Build a popup with an HTML/CSS/JS file — simpler than a full site', 'Submit to Chrome Web Store ($5 one-time fee)', 'Market in the r/productivity or relevant subreddit'],
    hours: 8,
  },
  {
    title: 'Notion Template Pack',
    badge: 'passive',
    desc: 'Design 5–10 Notion templates for a niche (sales CRM, habit tracker, baby prep, budget). Sell on Gumroad or Etsy for $7–$19. Zero ongoing work after launch.',
    steps: ['Build templates in Notion — no coding required', 'Duplicate them as shareable links, bundle into a Gumroad product', 'Post on Notion template forums and r/Notion'],
    hours: 4,
  },
  {
    title: 'Micro SaaS Tool',
    badge: 'passive',
    desc: 'One-screen web app solving a specific pain (e.g. cold email subject line tester, QR code generator). Charge $5–$9/mo via Stripe. Recurring revenue with zero selling.',
    steps: ['Build the core tool — one HTML page, some JS logic', 'Add Stripe Checkout for a subscription plan', 'Find 10 people who have this exact problem and share the link'],
    hours: 15,
  },
  {
    title: 'SEO Affiliate Blog',
    badge: 'passive',
    desc: 'A simple blog targeting low-competition search terms in a niche you know. Monetize with Google AdSense + Amazon affiliate. Traffic compounds — posts earn forever.',
    steps: ['Pick 10 keywords with low competition (use Google "People Also Ask" for ideas)', 'Write honest comparison/review posts (500–1000 words each)', 'Deploy free on Vercel, add Google Analytics + AdSense'],
    hours: 6,
  },
  {
    title: 'Email Newsletter',
    badge: 'passive',
    desc: 'Weekly email to a targeted audience on a topic you know. Monetize via affiliate links in every issue. With 500 subscribers, a single affiliate mention earns $50–$200.',
    steps: ['Start free on Beehiiv or ConvertKit', 'Write 4 issues before you launch — consistency matters', 'Post in relevant communities to get first 100 subscribers'],
    hours: 3,
  },
  {
    title: 'Stock Asset Pack',
    badge: 'passive',
    desc: 'Create icons, illustrations, or templates and upload to Envato, Creative Market, or Canva. Each sale is 100% passive — the marketplace handles everything.',
    steps: ['Design 20–30 matching icons or 5–10 templates around a theme', 'Upload to Creative Market or Envato Elements', 'Optimize titles and tags for search — that\'s your only marketing'],
    hours: 6,
  },
];

// ── Daily quotes ──────────────────────────────────────────
const QUOTES = [
  { text: "The most important thing a father can do for his children is to love their mother.", author: "Theodore Hesburgh" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "A ship in harbor is safe, but that's not what ships are for.", author: "John A. Shedd" },
  { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock. Do what it does — keep going.", author: "Sam Levenson" },
  { text: "It is not the load that breaks you down — it's the way you carry it.", author: "C.S. Lewis" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.", author: "John C. Maxwell" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Your children will become who you are, so be who you want them to be.", author: "Unknown" },
  { text: "We do not rise to the level of our expectations. We fall to the level of our training.", author: "Archilochus" },
  { text: "Someday is not a day of the week.", author: "Janet Dailey" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Do the hard work. Especially when you don't feel like it.", author: "Seth Godin" },
  { text: "Your family is your greatest investment. Everything else is secondary.", author: "Unknown" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
  { text: "Be the kind of man your son wants to be and your daughter wants to marry.", author: "Unknown" },
  { text: "Rich or poor, a man's job is to protect and provide. That never changes.", author: "Unknown" },
];

// ── Parenting tips ────────────────────────────────────────
const PARENTING_TIPS = [
  { category: 'Prep Now', tip: "Pack the hospital bag by week 36. Pack snacks for yourself too — you're there for the long haul and will forget to eat." },
  { category: 'Birth Day', tip: 'Skin-to-skin contact with dad matters just as much as with mom. Ask for it immediately in the delivery room — it builds your bond fast.' },
  { category: 'Sleep', tip: 'Take shifts in the early weeks. Each of you needs one 4–5 hour uninterrupted stretch to function. Split the nights and protect each other.' },
  { category: 'Sleep', tip: "Start a bedtime routine by 6–8 weeks: bath → feed → dark room → white noise. The consistency matters more than the specific steps." },
  { category: 'Feeding', tip: "If breastfeeding, know it's genuinely hard for the first 2–3 weeks. That's normal. A lactation consultant is worth every dollar." },
  { category: 'For Dad', tip: "Your job in the delivery room: be calm, be present, advocate for your wife, and eat something before you go in. You're her anchor." },
  { category: 'For Dad', tip: "Take every diaper change you can in the first weeks. It builds confidence, gives your wife rest, and bonds you to the baby faster than you'd expect." },
  { category: 'Development', tip: "Talk to your baby constantly from day one — narrate what you're doing. Language development starts long before they respond. They're absorbing everything." },
  { category: 'Development', tip: "Read out loud starting in the hospital. Doesn't matter what — your voice is what matters. Board books, news, whatever you have." },
  { category: 'Marriage', tip: "Schedule a 20-minute check-in with your wife weekly after baby arrives. Keeping the partnership strong is not optional — it's what your kid needs most." },
  { category: 'Finances', tip: "Add the baby to your health insurance within 30 days of birth — missing this window means waiting for open enrollment. Don't let it slip." },
  { category: 'Finances', tip: "Open a small savings account when the baby arrives, even if it's just $25/month. The habit matters more than the amount right now." },
  { category: 'Safety', tip: "Get the car seat inspected at a local fire station before the due date. Most are installed incorrectly. Free service, 10 minutes, peace of mind." },
  { category: 'Mental Health', tip: "Paternal postpartum depression is real and affects ~1 in 10 dads. Irritability, withdrawal, or emptiness after baby — talk to someone. It's not weakness." },
  { category: 'Big Picture', tip: "The days are long and the years are short. You'll blink and they'll be walking. The exhaustion is real but so is the joy — try to notice both." },
];

// ── Baby prep checklist ───────────────────────────────────
const BABY_PREP = [
  { id: 'carseat',   label: 'Install + get car seat inspected', cat: 'Safety' },
  { id: 'nursery',   label: 'Set up nursery / sleep space',      cat: 'Nursery' },
  { id: 'pediatric', label: 'Choose a pediatrician',             cat: 'Medical' },
  { id: 'insurance', label: 'Add baby to health insurance',      cat: 'Finances' },
  { id: 'leave',     label: 'File for paternity leave',          cat: 'Work' },
  { id: 'bag',       label: 'Pack hospital bag (both of you)',   cat: 'Birth' },
  { id: 'tour',      label: 'Take hospital tour',                cat: 'Birth' },
  { id: 'class',     label: 'Attend birth prep / CPR class',     cat: 'Education' },
  { id: 'will',      label: 'Update will + life insurance',      cat: 'Finances' },
  { id: 'savings',   label: 'Open baby savings account',         cat: 'Finances' },
  { id: 'freezer',   label: 'Freeze 1–2 weeks of meals',         cat: 'Prep' },
  { id: 'contact',   label: 'Lock in emergency contact list',    cat: 'Safety' },
];

// ── Auto-emoji for habits ─────────────────────────────────
const EMOJI_MAP = [
  [/journal|write|grat/i,     '📝'],
  [/meditat|breath|mindful/i, '🧘'],
  [/workout|gym|lift|train/i, '💪'],
  [/run|jog|cardio/i,         '🏃'],
  [/walk|steps|outside/i,     '🚶'],
  [/water|hydrat/i,           '💧'],
  [/eat|meal|nutrition|food/i,'🥗'],
  [/sleep|bed|rest/i,         '😴'],
  [/read|book/i,              '📚'],
  [/code|build|dev|program/i, '⌨️'],
  [/income|earn|money|sale/i, '💰'],
  [/wife|family|partner|pres/i,'❤️'],
  [/stretch|yoga|mobility/i,  '🧘'],
  [/cold|shower/i,            '🚿'],
  [/vitamin|supplement/i,     '💊'],
  [/plan|review|reflect/i,    '📋'],
  [/learn|study|course/i,     '🎓'],
];
function autoEmoji(label) {
  for (const [re, em] of EMOJI_MAP) if (re.test(label)) return em;
  return '✅';
}

// ── Toast ─────────────────────────────────────────────────
function toast(msg, type = '') {
  const stack = document.getElementById('toast-stack');
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.textContent = msg;
  stack.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 250); }, 2200);
}

// ── Store ─────────────────────────────────────────────────
const KEY   = 'lifeos-v4';
const today = () => new Date().toISOString().slice(0, 10);

function load()  { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

let store = load();
if (!store.habitsList) store.habitsList = DEFAULT_HABITS.map(h => ({ ...h }));
if (!store.milestones) {
  store.milestones = {};
  DEFAULT_MILESTONES.forEach(m => { store.milestones[m.id] = { label: m.label, sub: m.sub, hit: false, date: null }; });
}
if (!store.chats)     store.chats    = {};
if (!store.news)      store.news     = {};
if (!store.babyPrep)  store.babyPrep = {};
if (!store.quoteIdx)  store.quoteIdx  = Math.floor(Date.now() / 86400000) % QUOTES.length;
if (!store.tipIdx)    store.tipIdx    = Math.floor(Date.now() / 86400000) % PARENTING_TIPS.length;
if (store.habitsDate !== today()) { store.habitsDate = today(); store.habitsDone = {}; }
if (!store.habitsDone) store.habitsDone = {};
save(store);
function persist() { save(store); }

// Daily content indices (stable per day, user can advance)
const DAY_NUM = Math.floor(Date.now() / 86400000);

// ── Clock ─────────────────────────────────────────────────
function tick() {
  const now = new Date();
  const h   = now.getHours();
  const g   = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent = `${g}, Grayson`;
  document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// ── Stats ─────────────────────────────────────────────────
function renderStats() {
  const now   = new Date();
  const total = store.habitsList.length;
  const done  = Object.values(store.habitsDone || {}).filter(Boolean).length;
  const hits  = Object.values(store.milestones).filter(m => m.hit).length;
  const days  = Math.max(0, Math.ceil((BABY_DAY - now) / 86400000));

  document.getElementById('hero-focus').textContent =
    FOCUS_LINES[DAY_NUM % FOCUS_LINES.length];

  const hEl = document.getElementById('stat-habits');
  hEl.textContent = `${done}/${total}`;
  hEl.style.color = total && done === total ? 'var(--green)' : done > 0 ? 'var(--brand)' : '';

  const gEl = document.getElementById('stat-goals');
  gEl.textContent = `${hits}/${DEFAULT_MILESTONES.length}`;
  gEl.style.color = hits === DEFAULT_MILESTONES.length ? 'var(--green)' : hits > 0 ? 'var(--brand)' : '';

  document.getElementById('stat-days').textContent      = days;
  document.getElementById('baby-countdown').textContent = days;
}

// ── Habits — home page ────────────────────────────────────
function renderHabits() {
  const total = store.habitsList.length;
  const done  = Object.values(store.habitsDone || {}).filter(Boolean).length;
  document.getElementById('habit-fill').style.width  = total ? `${(done / total) * 100}%` : '0%';
  document.getElementById('habit-count').textContent = `${done}/${total}`;

  const list = document.getElementById('habit-list');
  list.innerHTML = store.habitsList.map(h => `
    <div class="habit ${store.habitsDone[h.id] ? 'done' : ''}" data-id="${h.id}">
      <span class="habit-emoji">${h.emoji || '✅'}</span>
      <span class="habit-label">${escapeHTML(h.label)}</span>
      <span class="check">✓</span>
      <button class="habit-del" data-del="${h.id}" title="Remove">✕</button>
    </div>`).join('');

  list.querySelectorAll('.habit').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.habit-del')) return;
      const id = el.dataset.id;
      const h  = store.habitsList.find(x => x.id === id);
      if (store.habitsDone[id]) { delete store.habitsDone[id]; }
      else { store.habitsDone[id] = true; if (h) toast(`${h.emoji || '✓'} ${h.label}`, 'green'); }
      persist(); renderHabits(); renderHabitsHQ(); renderStats();
    });
  });
  list.querySelectorAll('.habit-del').forEach(btn =>
    btn.addEventListener('click', () => {
      store.habitsList = store.habitsList.filter(h => h.id !== btn.dataset.del);
      delete store.habitsDone[btn.dataset.del];
      persist(); renderHabits(); renderHabitsHQ(); renderStats();
    }));
}

document.getElementById('habit-add').addEventListener('submit', e => {
  e.preventDefault();
  const inp = document.getElementById('habit-input');
  const lbl = inp.value.trim(); if (!lbl) return;
  store.habitsList.push({ id: 'h' + Date.now(), emoji: autoEmoji(lbl), label: lbl });
  inp.value = '';
  persist(); renderHabits(); renderHabitsHQ(); renderStats();
});

document.getElementById('reset-habits').addEventListener('click', () => {
  store.habitsDone = {}; persist(); renderHabits(); renderHabitsHQ(); renderStats();
});

// ── Habits — health page (mirror, check-only) ─────────────
function renderHabitsHQ() {
  const list = document.getElementById('hq-habit-list'); if (!list) return;
  const total = store.habitsList.length;
  const done  = Object.values(store.habitsDone || {}).filter(Boolean).length;
  const fill  = document.getElementById('hq-fill');
  const count = document.getElementById('hq-count');
  if (fill)  fill.style.width  = total ? `${(done / total) * 100}%` : '0%';
  if (count) count.textContent = `${done}/${total}`;

  list.innerHTML = store.habitsList.map(h => `
    <div class="habit ${store.habitsDone[h.id] ? 'done' : ''}" data-id="${h.id}">
      <span class="habit-emoji">${h.emoji || '✅'}</span>
      <span class="habit-label">${escapeHTML(h.label)}</span>
      <span class="check">✓</span>
    </div>`).join('');

  list.querySelectorAll('.habit').forEach(el =>
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const h  = store.habitsList.find(x => x.id === id);
      if (store.habitsDone[id]) { delete store.habitsDone[id]; }
      else { store.habitsDone[id] = true; if (h) toast(`${h.emoji || '✓'} ${h.label}`, 'green'); }
      persist(); renderHabitsHQ(); renderHabits(); renderStats();
    }));
}

// ── Milestones ────────────────────────────────────────────
function buildMilestonesHTML() {
  return DEFAULT_MILESTONES.map(d => {
    const m = store.milestones[d.id];
    const ds = m.hit && m.date
      ? new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '';
    return `
      <div class="milestone ${m.hit ? 'hit' : ''}" data-id="${d.id}">
        <span class="ms-dot"></span>
        <div class="ms-info">
          <div class="ms-label">${escapeHTML(m.label)}</div>
          <div class="ms-sub">${m.hit && ds ? 'Hit ' + ds : escapeHTML(m.sub || '')}</div>
        </div>
        <button class="ms-edit" data-edit="${d.id}" title="Rename">✎</button>
        <span class="ms-tag">${m.hit ? '✓ Hit it' : 'mark hit'}</span>
      </div>`;
  }).join('');
}

function bindMilestones(id) {
  const box = document.getElementById(id); if (!box) return;
  box.querySelectorAll('.milestone').forEach(el =>
    el.addEventListener('click', e => {
      if (e.target.closest('.ms-edit') || e.target.closest('.ms-inline-input')) return;
      const m = store.milestones[el.dataset.id];
      m.hit = !m.hit; m.date = m.hit ? new Date().toISOString() : null;
      if (m.hit) toast(`🎯 ${m.label}`, 'brand');
      persist(); renderMilestones(); renderStats();
    }));
  box.querySelectorAll('.ms-edit').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const lbl = btn.closest('.milestone').querySelector('.ms-label');
      const m   = store.milestones[btn.dataset.edit];
      const inp = document.createElement('input');
      inp.className = 'ms-inline-input'; inp.value = m.label;
      lbl.replaceWith(inp); inp.focus(); inp.select();
      const commit = () => { const v = inp.value.trim(); if (v) { m.label = v; persist(); } renderMilestones(); };
      inp.addEventListener('blur', commit);
      inp.addEventListener('keydown', ev => {
        if (ev.key === 'Enter')  { ev.preventDefault(); inp.blur(); }
        if (ev.key === 'Escape') renderMilestones();
      });
    }));
}

function renderMilestones() {
  const html = buildMilestonesHTML();
  ['milestones', 'ms-income'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.innerHTML = html; bindMilestones(id); }
  });
}

// ── Workout plan renderer ─────────────────────────────────
function renderWorkoutPlan() {
  const el = document.getElementById('workout-plan'); if (!el) return;
  el.innerHTML = WORKOUT_PLAN.map(s => `
    <div class="workout-session" style="--ws-color:${s.color}">
      <div class="ws-header">
        <span class="ws-day">${s.day}</span>
        <span class="ws-focus">${s.focus}</span>
        <span class="ws-badge">${s.duration}</span>
      </div>
      <div class="ws-exercises">
        ${s.exercises.map(ex => `
          <div class="ws-ex-name">▸ ${escapeHTML(ex.name)}</div>
          <div class="ws-ex-sets">${escapeHTML(ex.sets)}</div>
          <div class="ws-ex-note">${escapeHTML(ex.note)}</div>`).join('')}
      </div>
      <button class="ws-ai-btn" data-day="${escapeHTML(s.day)}" data-focus="${escapeHTML(s.focus)}">
        Customize ${s.day} with AI →
      </button>
    </div>`).join('');

  el.querySelectorAll('.ws-ai-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = `I want to customize my ${btn.dataset.day} workout (${btn.dataset.focus}). Ask me about my available equipment, any injuries, and fitness level — then build me a personalized version of this session.`;
      openChat('health', msg);
    });
  });
}

// ── Nutrition card renderer ───────────────────────────────
function renderNutritionCard() {
  const el = document.getElementById('nutrition-card'); if (!el) return;
  el.innerHTML = `
    <div class="macro-grid">
      ${NUTRITION.macros.map(m => `
        <div class="macro-item" style="--mc:${m.color}">
          <div><span class="macro-num">${m.value}</span><span class="macro-unit">${m.unit}</span></div>
          <div class="macro-label">${m.label}</div>
          <div class="macro-note">${m.note}</div>
        </div>`).join('')}
    </div>
    <p style="font-size:.72rem;color:var(--faint);margin-bottom:10px">${escapeHTML(NUTRITION.note)}</p>
    <div class="nutrition-tips">
      ${NUTRITION.tips.map(t => `<div class="nutrition-tip">${escapeHTML(t)}</div>`).join('')}
    </div>
    <button class="nutrition-ai-btn" id="meal-plan-btn">Build me a personalized meal plan →</button>`;

  document.getElementById('meal-plan-btn').addEventListener('click', () => {
    openChat('health', "I want a personalized weekly meal plan for fat loss. Ask me about my food preferences, restrictions, cooking time, and schedule before building it.");
  });
}

// ── Code challenge renderer ───────────────────────────────
function renderCodeChallenge() {
  const el = document.getElementById('challenge-card'); if (!el) return;
  const idx = DAY_NUM % CODE_CHALLENGES.length;
  const c   = CODE_CHALLENGES[idx];
  el.innerHTML = `
    <div class="cc-head">
      <span class="cc-type">Daily Challenge</span>
      <span class="cc-badge ${c.difficulty}">${c.difficulty}</span>
    </div>
    <div class="cc-title">${escapeHTML(c.title)}</div>
    <div class="cc-body">${escapeHTML(c.desc)}</div>
    <div class="cc-tags">${c.tags.map(t => `<span class="cc-tag">${escapeHTML(t)}</span>`).join('')}</div>
    <button class="cc-action" id="challenge-help-btn">Get a hint →</button>`;

  document.getElementById('challenge-help-btn').addEventListener('click', () => {
    openChat('code', `I'm working on the "${c.title}" coding challenge. Here's the problem: "${c.desc}". I'm a beginner — walk me through how to think about this, give me a small hint without giving away the full answer.`);
  });

  const hint = document.getElementById('challenge-hint');
  if (hint) hint.textContent = `Challenge ${idx + 1} of ${CODE_CHALLENGES.length}`;
}

// ── Project ideas renderer ────────────────────────────────
function renderProjectCard() {
  const el = document.getElementById('project-card'); if (!el) return;
  const idx = Math.floor(DAY_NUM / 3) % PROJECT_IDEAS.length; // rotates every 3 days
  const p   = PROJECT_IDEAS[idx];
  el.innerHTML = `
    <div class="cc-head">
      <span class="cc-type">Project Idea</span>
      <span class="cc-badge project">~${p.hours}h build</span>
    </div>
    <div class="cc-title">${escapeHTML(p.title)}</div>
    <div class="cc-body">${escapeHTML(p.desc)}</div>
    <div class="cc-steps">${p.steps.map(s => `<div class="cc-step">${escapeHTML(s)}</div>`).join('')}</div>
    <button class="cc-action" id="project-help-btn">Start this project →</button>`;

  document.getElementById('project-help-btn').addEventListener('click', () => {
    openChat('code', `I want to build "${p.title}". Here's the description: "${p.desc}". I'm a beginner. Walk me through step one — what to build first, what HTML/JS I need, and how to get started right now.`);
  });
}

// ── Daily quote renderer ──────────────────────────────────
function renderQuote() {
  const el = document.getElementById('quote-card'); if (!el) return;
  const q  = QUOTES[store.quoteIdx % QUOTES.length];
  el.innerHTML = `
    <div class="quote-mark">"</div>
    <div class="quote-text">${escapeHTML(q.text)}</div>
    <div class="quote-author">— ${escapeHTML(q.author)}</div>
    <div class="quote-nav">
      <button class="quote-btn" id="prev-quote">← Prev</button>
      <button class="quote-btn" id="next-quote">Next →</button>
      <button class="quote-btn" id="more-quotes" style="margin-left:auto">More like this →</button>
    </div>`;

  document.getElementById('next-quote').addEventListener('click', () => {
    store.quoteIdx = (store.quoteIdx + 1) % QUOTES.length; persist(); renderQuote();
  });
  document.getElementById('prev-quote').addEventListener('click', () => {
    store.quoteIdx = (store.quoteIdx - 1 + QUOTES.length) % QUOTES.length; persist(); renderQuote();
  });
  document.getElementById('more-quotes').addEventListener('click', () => {
    openChat('growth', "Give me 3 powerful quotes about discipline, fatherhood, or building a great life. For each one, tell me why it resonates for someone in my situation.");
  });
}

// ── Parenting tip renderer ────────────────────────────────
function renderParentingTip() {
  const el = document.getElementById('tip-card'); if (!el) return;
  const t  = PARENTING_TIPS[store.tipIdx % PARENTING_TIPS.length];
  el.innerHTML = `
    <div class="cc-head">
      <span class="cc-type">Parenting Tip</span>
      <span class="tip-category">${escapeHTML(t.category)}</span>
    </div>
    <div class="cc-title" style="font-size:.95rem;line-height:1.55">${escapeHTML(t.tip)}</div>
    <div style="display:flex;gap:8px;margin-top:auto;padding-top:8px">
      <button class="cc-action secondary" id="next-tip">Next tip →</button>
      <button class="cc-action" id="ask-parenting">Ask AI →</button>
    </div>`;

  document.getElementById('next-tip').addEventListener('click', () => {
    store.tipIdx = (store.tipIdx + 1) % PARENTING_TIPS.length; persist(); renderParentingTip();
  });
  document.getElementById('ask-parenting').addEventListener('click', () => {
    openChat('growth', `I just read this parenting tip: "${t.tip}" — I want to know more about this. What should I know, and what's the most practical thing I can do right now to prepare?`);
  });
}

// ── Baby prep checklist ───────────────────────────────────
function renderBabyPrep() {
  const el = document.getElementById('prep-card'); if (!el) return;
  const done  = BABY_PREP.filter(i => store.babyPrep[i.id]).length;
  const total = BABY_PREP.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  el.innerHTML = `
    <div class="prep-title">Baby Prep Checklist</div>
    <div class="prep-progress-row">
      <div class="prep-progress-bar"><div class="prep-progress-fill" style="width:${pct}%"></div></div>
      <span class="prep-progress-label">${done}/${total} done</span>
    </div>
    <div class="prep-list">
      ${BABY_PREP.map(item => `
        <div class="prep-item ${store.babyPrep[item.id] ? 'done' : ''}" data-id="${item.id}">
          <span class="prep-check">✓</span>
          <span class="prep-label">${escapeHTML(item.label)}</span>
          <span class="prep-cat">${escapeHTML(item.cat)}</span>
        </div>`).join('')}
    </div>`;

  el.querySelectorAll('.prep-item').forEach(row =>
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      store.babyPrep[id] = !store.babyPrep[id];
      if (store.babyPrep[id]) toast('✓ Checked off', 'green');
      persist(); renderBabyPrep();
    }));
}

// ── News helpers ──────────────────────────────────────────
const NEWS_TTL = 15 * 60 * 1000;

function ago(d) {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 3600)  return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function domain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

async function fetchHN(query, n = 6) {
  const r = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${n}`);
  if (!r.ok) throw new Error('HN fetch failed');
  return (await r.json()).hits.map(h => ({
    title: h.title, url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
    source: 'HN', score: h.points || 0, created_at: h.created_at,
  }));
}

async function fetchDevTo(tag, n = 6) {
  const r = await fetch(`https://dev.to/api/articles?per_page=${n}&tag=${encodeURIComponent(tag)}&state=fresh`);
  if (!r.ok) throw new Error('Dev.to fetch failed');
  return (await r.json()).map(a => ({
    title: a.title, url: a.url || a.canonical_url,
    source: 'dev.to', score: a.positive_reactions_count || 0, created_at: a.published_at,
  }));
}

function interleave(a, b) {
  const out = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) { if (a[i]) out.push(a[i]); if (b[i]) out.push(b[i]); }
  return out;
}

// Headlines (home)
async function loadHeadlines() {
  const grid = document.getElementById('headlines-grid');
  const hint = document.getElementById('hl-hint');
  const c    = store.news.home;
  if (c && Date.now() - c.ts < NEWS_TTL) { renderHeadlines(c.items); hint.textContent = 'live · HN + Dev.to'; return; }
  grid.innerHTML = Array(6).fill('<div class="hl-skel"></div>').join('');
  hint.textContent = 'loading…';
  try {
    const q = NEWS_QUERIES.home;
    const [hn, dt] = await Promise.allSettled([fetchHN(q.hn, 3), fetchDevTo(q.devto, 3)]);
    const items = interleave(
      hn.status === 'fulfilled' ? hn.value : [],
      dt.status === 'fulfilled' ? dt.value : [],
    );
    store.news.home = { items, ts: Date.now() }; persist();
    renderHeadlines(items); hint.textContent = 'live · HN + Dev.to';
  } catch {
    grid.innerHTML = '<p style="grid-column:1/-1;padding:12px;font-size:.82rem;color:var(--muted)">Headlines load once deployed to Vercel.</p>';
    hint.textContent = 'offline';
  }
}

function renderHeadlines(items) {
  const grid = document.getElementById('headlines-grid');
  if (!items?.length) { grid.innerHTML = '<p style="color:var(--muted);font-size:.82rem">No stories right now.</p>'; return; }
  grid.innerHTML = items.slice(0, 6).map(i => `
    <a class="hl-card" href="${escapeHTML(i.url)}" target="_blank" rel="noopener">
      <div class="hl-meta"><span class="hl-tag">${i.source}</span><span class="hl-pts">▲ ${i.score}</span><span class="hl-time">${ago(i.created_at)} ago</span></div>
      <div class="hl-title">${escapeHTML(i.title || '')}</div>
      <div class="hl-domain">${domain(i.url || '')}</div>
    </a>`).join('');
}

// Pillar news feeds
async function loadNews(page) {
  const el = document.getElementById('news-' + page); if (!el) return;
  const c  = store.news[page];
  if (c && Date.now() - c.ts < NEWS_TTL) { renderNews(el, c.items); return; }
  el.innerHTML = Array(6).fill('<div class="news-skel"></div>').join('');
  try {
    const q = NEWS_QUERIES[page] || NEWS_QUERIES.home;
    const [hn, dt] = await Promise.allSettled([fetchHN(q.hn, 6), fetchDevTo(q.devto, 6)]);
    const items = interleave(
      hn.status === 'fulfilled' ? hn.value : [],
      dt.status === 'fulfilled' ? dt.value : [],
    ).slice(0, 12);
    store.news[page] = { items, ts: Date.now() }; persist();
    renderNews(el, items);
  } catch {
    el.innerHTML = '<div class="news-empty">News feed loads once deployed to Vercel.</div>';
  }
}

function renderNews(el, items) {
  if (!items?.length) { el.innerHTML = '<div class="news-empty">No stories found.</div>'; return; }
  el.innerHTML = items.map(i => `
    <a class="news-item" href="${escapeHTML(i.url)}" target="_blank" rel="noopener">
      <div class="news-title">${escapeHTML(i.title || '')}</div>
      <div class="news-meta">
        <span class="news-src ${i.source === 'HN' ? 'src-hn' : 'src-devto'}">${i.source}</span>
        <span class="news-domain">${domain(i.url || '')}</span>
        <span class="news-pts">▲ ${i.score}</span>
        <span class="news-age">${ago(i.created_at)} ago</span>
      </div>
    </a>`).join('');
}

// ── Inline chat panel ─────────────────────────────────────
function initChatPanel(id, key) {
  const el = document.getElementById(id);
  if (!el || el.dataset.init === key) return;
  el.dataset.init = key;
  const sp = SPACES[key];
  el.style.setProperty('--cp-accent', sp.accent);

  el.innerHTML = `
    <div class="cp-head">
      <div class="cp-icon">${sp.icon}</div>
      <div class="cp-info"><div class="cp-name">${sp.name}</div><div class="cp-sub">${sp.sub}</div></div>
      <button class="cp-clear" id="cpc-${key}">Clear</button>
    </div>
    <div class="cp-quick" id="cpq-${key}">
      ${sp.quick.map((q, i) => `<button class="cp-qbtn" data-q="${i}">${q.label}</button>`).join('')}
    </div>
    <div class="cp-messages" id="cpm-${key}"></div>
    <form class="cp-input" id="cpf-${key}">
      <textarea rows="1" placeholder="Ask ${sp.name}…" id="cpt-${key}"></textarea>
      <button type="submit" class="cp-send"><svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>
    </form>`;

  document.getElementById('cpq-' + key).querySelectorAll('.cp-qbtn').forEach(b =>
    b.addEventListener('click', () => sendChat(key, sp.quick[+b.dataset.q].text)));

  document.getElementById('cpc-' + key).addEventListener('click', () => {
    store.chats[key] = []; persist(); renderChat(key);
  });

  const form = document.getElementById('cpf-' + key);
  const ta   = document.getElementById('cpt-' + key);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const t = ta.value.trim(); if (!t) return;
    ta.value = ''; ta.style.height = 'auto';
    sendChat(key, t);
  });
  ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 110) + 'px'; });
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });

  renderChat(key);
}

function renderChat(key) {
  const box = document.getElementById('cpm-' + key); if (!box) return;
  const h   = store.chats[key] || [];
  box.innerHTML = h.length
    ? h.map(m => `<div class="bubble ${m.role === 'user' ? 'me' : 'ai'}">${m.role === 'user' ? escapeHTML(m.text) : md(m.text)}</div>`).join('')
    : `<div class="cp-empty">Ask a question or tap a quick action to start chatting with ${SPACES[key].name}.</div>`;
  box.scrollTop = box.scrollHeight;
}

async function sendChat(key, text) {
  text = text.trim(); if (!text) return;
  const sp = SPACES[key];
  if (!store.chats[key]) store.chats[key] = [];
  store.chats[key].push({ role: 'user', text }); persist(); renderChat(key);

  const box = document.getElementById('cpm-' + key);
  if (box) { box.insertAdjacentHTML('beforeend', `<div class="bubble ai typing" id="ty-${key}"><span></span><span></span><span></span></div>`); box.scrollTop = box.scrollHeight; }

  try {
    const res  = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: sp.system, messages: store.chats[key].slice(-12).map(m => ({ role: m.role, text: m.text })) }) });
    let data;
    try { data = await res.json(); } catch { data = {}; }
    document.getElementById('ty-' + key)?.remove();
    store.chats[key].push({ role: 'model', text: res.ok ? (data.text || "No response — try again.") : `⚠️ ${data.error || 'Something went wrong.'}` });
  } catch {
    document.getElementById('ty-' + key)?.remove();
    const isFile = location.protocol === 'file:';
    store.chats[key].push({ role: 'model', text: isFile
      ? '⚠️ AI chat only works on Vercel — not from a local file.'
      : '⚠️ Could not reach AI — check that GROQ_API_KEY is set in Vercel project settings, then redeploy.' });
  }
  persist(); renderChat(key);
}

// Helper to open a chat panel and send a message from content cards
function openChat(spaceKey, message) {
  navigate(spaceKey);
  setTimeout(() => sendChat(spaceKey, message), 100);
}

// ── Helpers ───────────────────────────────────────────────
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function md(text) {
  let h = escapeHTML(text);
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<em>$2</em>');
  h = h.replace(/`([^`]+?)`/g, '<code>$1</code>');
  h = h.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>');
  h = h.replace(/((?:<li>[^\n]*<\/li>\n?)+)/g, '<ul>$1</ul>');
  h = h.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
  h = h.replace(/<\/ul><br>/g, '</ul>').replace(/<br><ul>/g, '<ul>');
  return h;
}

// ── Router ────────────────────────────────────────────────
const PAGES = ['home', 'income', 'health', 'markets', 'code', 'growth', 'tools'];

function navigate(page) {
  if (!PAGES.includes(page)) page = 'home';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === page));
  history.replaceState(null, '', '#' + page);

  switch (page) {
    case 'home':
      renderStats(); renderHabits(); renderMilestones(); loadHeadlines(); break;
    case 'income':
      renderMilestones(); initChatPanel('cp-income', 'income'); loadNews('income'); break;
    case 'health':
      renderHabitsHQ(); renderWorkoutPlan(); renderNutritionCard();
      initChatPanel('cp-health', 'health'); loadNews('health'); break;
    case 'markets':
      initChatPanel('cp-markets', 'markets'); loadNews('markets'); break;
    case 'code':
      renderCodeChallenge(); renderProjectCard();
      initChatPanel('cp-code', 'code'); loadNews('code'); break;
    case 'growth':
      document.getElementById('baby-big').textContent = Math.max(0, Math.ceil((BABY_DAY - new Date()) / 86400000));
      renderQuote(); renderParentingTip(); renderBabyPrep();
      initChatPanel('cp-growth', 'growth'); loadNews('growth'); break;
    case 'tools':
      break;
  }
  closeSidebar();
}

// ── Nav + pillar click handlers ───────────────────────────
document.querySelectorAll('.nav-link').forEach(l =>
  l.addEventListener('click', e => { e.preventDefault(); navigate(l.dataset.page); }));

document.querySelectorAll('.pillar[data-page]').forEach(p =>
  p.addEventListener('click', () => navigate(p.dataset.page)));

// ── Mobile sidebar ────────────────────────────────────────
const sidebar = document.getElementById('sidebar');
const scrim   = document.getElementById('scrim');
function closeSidebar() { sidebar.classList.remove('open'); scrim.classList.remove('show'); }
document.getElementById('menu-btn').addEventListener('click', () => { sidebar.classList.add('open'); scrim.classList.add('show'); });
scrim.addEventListener('click', closeSidebar);

// ── Boot ──────────────────────────────────────────────────
tick();
setInterval(tick, 60_000);
const start = PAGES.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
navigate(start);
