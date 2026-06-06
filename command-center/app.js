/* Life OS — Command Center
   Realistic control-tower wall. Live rotating globe (d3-geo canvas) +
   Chart.js charts. All libs vendored locally — no CDN. Placeholder data
   for now; real sources plug in tile by tile next. */

/* ---------- live clock ---------- */
function tick(){
  const n = new Date();
  document.getElementById('clock').textContent = n.toLocaleTimeString('en-US',{hour12:false});
  document.getElementById('date').textContent  =
    n.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
}
tick(); setInterval(tick,1000);

/* ---------- globe ---------- */
const ORIGIN = [-104.99, 39.74]; // Denver — home base
const MARKETS = [
  {name:'Amazon US', c:[-122.33, 47.60], col:'#10b981'}, // Seattle
  {name:'YouTube',   c:[-122.08, 37.39], col:'#f59e0b'}, // Bay Area
  {name:'Etsy',      c:[-73.95, 40.65],  col:'#6b7494'}, // Brooklyn
  {name:'EU',        c:[-0.12, 51.50],   col:'#22d3ee'}, // London
  {name:'DE',        c:[13.40, 52.52],   col:'#22d3ee'}, // Berlin
  {name:'JP',        c:[139.69, 35.68],  col:'#8b5cf6'}, // Tokyo
  {name:'AU',        c:[151.20,-33.87],  col:'#8b5cf6'}, // Sydney
];

(async function initGlobe(){
  const world = await fetch('vendor/world.json').then(r=>r.json());
  const canvas = document.getElementById('globe');
  const ctx = canvas.getContext('2d');
  const projection = d3.geoOrthographic().clipAngle(90).rotate([100,-18,0]);
  const path = d3.geoPath(projection, ctx);
  const graticule = d3.geoGraticule10();
  const sphere = {type:'Sphere'};
  let W=0,H=0,dpr=1;

  function resize(){
    const r = canvas.parentElement.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    W = r.width; H = r.height;
    canvas.width = W*dpr; canvas.height = H*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const scale = Math.min(W*0.62, H*0.92)/2;
    projection.scale(scale).translate([W*0.46, H*0.52]);
  }
  resize();
  window.addEventListener('resize', resize);

  // pre-build great-circle arc lines origin -> markets
  const arcs = MARKETS.map(m=>{
    const interp = d3.geoInterpolate(ORIGIN, m.c);
    const pts = []; for(let i=0;i<=48;i++) pts.push(interp(i/48));
    return {feat:{type:'LineString',coordinates:pts}, col:m.col, c:m.c};
  });

  function visible(coord){
    const c = projection.rotate();
    return d3.geoDistance(coord, [-c[0], -c[1]]) < Math.PI/2;
  }

  let dash = 0;
  function frame(){
    const rot = projection.rotate();
    projection.rotate([rot[0] + 0.12, rot[1], rot[2]]);
    dash = (dash + 0.6) % 16;
    ctx.clearRect(0,0,W,H);

    // sphere fill + atmosphere glow
    const cx = projection.translate()[0], cy = projection.translate()[1];
    const rad = projection.scale();
    const glow = ctx.createRadialGradient(cx,cy,rad*0.6, cx,cy,rad*1.18);
    glow.addColorStop(0,'rgba(34,211,238,0)');
    glow.addColorStop(0.82,'rgba(59,130,246,0.10)');
    glow.addColorStop(1,'rgba(59,130,246,0)');
    ctx.beginPath(); ctx.arc(cx,cy,rad*1.18,0,2*Math.PI); ctx.fillStyle=glow; ctx.fill();

    ctx.beginPath(); path(sphere);
    const sg = ctx.createRadialGradient(cx-rad*0.3,cy-rad*0.35,rad*0.1, cx,cy,rad);
    sg.addColorStop(0,'#13203a'); sg.addColorStop(1,'#070b16');
    ctx.fillStyle = sg; ctx.fill();

    // graticule
    ctx.beginPath(); path(graticule);
    ctx.strokeStyle='rgba(120,140,200,0.07)'; ctx.lineWidth=0.5; ctx.stroke();

    // land
    ctx.beginPath(); path(world.land);
    ctx.fillStyle='rgba(46,60,96,0.55)'; ctx.fill();

    // borders
    ctx.beginPath(); path(world.borders);
    ctx.strokeStyle='rgba(99,160,230,0.35)'; ctx.lineWidth=0.5; ctx.stroke();

    // terminator-ish rim light
    ctx.beginPath(); path(sphere);
    ctx.strokeStyle='rgba(34,211,238,0.25)'; ctx.lineWidth=1; ctx.stroke();

    // arcs
    ctx.save(); ctx.setLineDash([5,11]); ctx.lineDashOffset=-dash; ctx.lineWidth=1.4;
    arcs.forEach(a=>{
      ctx.beginPath(); path(a.feat);
      ctx.strokeStyle=a.col; ctx.globalAlpha=0.85;
      ctx.shadowColor=a.col; ctx.shadowBlur=6; ctx.stroke();
    });
    ctx.restore(); ctx.globalAlpha=1; ctx.shadowBlur=0;

    // origin + market pins
    function pin(coord,col,r){
      if(!visible(coord)) return;
      const p = projection(coord); if(!p) return;
      ctx.beginPath(); ctx.arc(p[0],p[1],r,0,2*Math.PI);
      ctx.fillStyle=col; ctx.shadowColor=col; ctx.shadowBlur=8; ctx.fill();
      ctx.shadowBlur=0;
    }
    arcs.forEach(a=>pin(a.c,a.col,2.4));
    pin(ORIGIN,'#ffffff',3.4);

    requestAnimationFrame(frame);
  }
  frame();
})();

/* ---------- charts ---------- */
Chart.defaults.color = '#6b7494';
Chart.defaults.font.family = '-apple-system,Segoe UI,Roboto,sans-serif';
Chart.defaults.font.size = 10;

// lead-time line (two series, like the reference)
new Chart(document.getElementById('leadChart'), {
  type:'line',
  data:{ labels:['Q1','Q2','Q3','Q4'],
    datasets:[
      {data:[31,27,24,19], borderColor:'#22d3ee', backgroundColor:'rgba(34,211,238,.12)',
        fill:true, tension:.4, borderWidth:2, pointRadius:0},
      {data:[26,28,22,21], borderColor:'#6366f1', borderDash:[4,4],
        fill:false, tension:.4, borderWidth:1.5, pointRadius:0},
    ]},
  options:{ responsive:true, maintainAspectRatio:false, animation:{duration:600},
    plugins:{legend:{display:false}}, scales:{
      x:{grid:{display:false}, ticks:{maxRotation:0}},
      y:{grid:{color:'rgba(255,255,255,.04)'}, ticks:{maxTicksLimit:3}, suggestedMin:10} } }
});

// output bar chart (deliveries)
const days = Array.from({length:12},(_,i)=>`${i+1}`);
new Chart(document.getElementById('outChart'), {
  type:'bar',
  data:{ labels:days, datasets:[
    {label:'shipped', data:[40,55,38,62,70,48,80,66,90,74,102,88],
      backgroundColor:'rgba(99,102,241,.85)', borderRadius:3, barPercentage:.7},
    {label:'pending', data:[8,6,12,5,9,14,7,11,6,10,8,13],
      backgroundColor:'rgba(244,63,94,.7)', borderRadius:3, barPercentage:.7},
  ]},
  options:{ responsive:true, maintainAspectRatio:false, animation:{duration:600},
    plugins:{legend:{display:false}}, scales:{
      x:{stacked:true, grid:{display:false}, ticks:{display:false}},
      y:{stacked:true, grid:{color:'rgba(255,255,255,.04)'}, ticks:{maxTicksLimit:3}} } }
});

/* ---------- interactive drill-down ---------- */
const drawer=document.getElementById('drawer'),
      dTitle=document.getElementById('drawer-title'),
      dBody=document.getElementById('drawer-body');
const DRILL={
  pipeline:['Pipeline','Live status of every income engine, the markets they reach, and time-to-first-payout. Globe arcs map each automation to where it earns.'],
  news:['News','Full HN feed — drops into your existing Algolia source. Featured story + filmstrip of recent items.'],
  issues:['Agent Queue','What every agent is doing, what failed, and what is blocked on you. The control surface for the mini-company.'],
  income:['Income','Daily progress toward the $100/day north star, pulled from real income tracking.'],
  automation:['Automation','Health of each engine (KDP / YouTube / Etsy) broken down by sub-step, so you see exactly where a pipeline stalls.'],
  output:['Output','Units produced and shipped over the last 30 days — books published, videos rendered, listings created.'],
};
document.querySelectorAll('.panel').forEach(p=>{
  p.addEventListener('click',()=>{
    const [t,b]=DRILL[p.dataset.drill]||['Tile','Drill-down coming soon.'];
    dTitle.textContent=t; dBody.textContent=b; drawer.classList.add('open');
  });
});
const close=()=>drawer.classList.remove('open');
document.getElementById('drawer-close').addEventListener('click',close);
drawer.addEventListener('click',e=>{if(e.target===drawer)close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
