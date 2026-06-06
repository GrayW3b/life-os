/* Life OS — Command Center
   Mockup wiring. Live clock + interactive drill-down stubs.
   Real data sources get plugged in tile by tile next. */

// --- live clock ---
function tick(){
  const now = new Date();
  const clock = document.getElementById('clock');
  const date  = document.getElementById('date');
  clock.textContent = now.toLocaleTimeString('en-US', { hour12:false });
  date.textContent  = now.toLocaleDateString('en-US',
    { weekday:'short', month:'short', day:'numeric' });
}
tick();
setInterval(tick, 1000);

// --- interactive cockpit: tile drill-down drawer (stub) ---
const drawer  = document.getElementById('drawer');
const dTitle  = document.getElementById('drawer-title');
const dBody   = document.getElementById('drawer-body');

const DRILL = {
  pipeline:   ['Pipeline', 'KDP → YouTube → Etsy stage health, payout timeline, and the next automation milestone. Wires to your real revenue + tool status.'],
  news:       ['News', 'Full HN feed — drops straight into your existing Algolia source. Click a story to open it.'],
  issues:     ['Agent Queue', 'What every agent is doing, what failed, and what is blocked on you. This is the control surface for the mini-company.'],
  income:     ['Income', 'Daily progress toward the $100/day north star. Pulls from your real income tracking.'],
  habits:     ['Habits', 'Today’s habit completion, mirrored from Life OS localStorage.'],
  milestones: ['Milestones', 'Progress across your active milestones — KDP, YouTube, Etsy, baby prep.'],
};

document.querySelectorAll('.tile').forEach(tile => {
  tile.addEventListener('click', () => {
    const key = tile.dataset.drill;
    const [title, body] = DRILL[key] || ['Tile', 'Drill-down coming soon.'];
    dTitle.textContent = title;
    dBody.textContent  = body;
    drawer.classList.add('open');
  });
});

function closeDrawer(){ drawer.classList.remove('open'); }
document.getElementById('drawer-close').addEventListener('click', closeDrawer);
drawer.addEventListener('click', e => { if (e.target === drawer) closeDrawer(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
