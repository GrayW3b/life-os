/* Life OS — Command Center
   Premium control-tower wall. Dot-matrix globe (d3-geo canvas) with
   comet-pulse arcs + city rings, canvas gauges, animated count-ups,
   gradient Chart.js charts, live ticker. All libs vendored — no CDN. */

const DPR = () => window.devicePixelRatio || 1;

/* ---------- clock ---------- */
function tick(){
  const n=new Date();
  document.getElementById('clock').textContent=n.toLocaleTimeString('en-US',{hour12:false});
  document.getElementById('date').textContent=
    n.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
}
tick(); setInterval(tick,1000);

/* ---------- animated count-ups ---------- */
function countUp(el){
  const target=+el.dataset.count, suffix=el.dataset.suffix||'';
  const dur=1400, t0=performance.now();
  (function step(t){
    const p=Math.min((t-t0)/dur,1), e=1-Math.pow(1-p,3);
    const v=Math.round(target*e);
    el.textContent=v.toLocaleString('en-US')+suffix;
    if(p<1) requestAnimationFrame(step);
  })(t0);
}
document.querySelectorAll('[data-count]').forEach(countUp);

/* ---------- automation bar fills ---------- */
requestAnimationFrame(()=>{
  document.querySelectorAll('.pb i[data-w]').forEach(i=>{ i.style.width=i.dataset.w+'%'; });
});

/* ---------- canvas gauges ---------- */
function gauge(wrap){
  const cv=wrap.querySelector('canvas'), ctx=cv.getContext('2d');
  const target=+wrap.dataset.gauge, color=wrap.dataset.color||'#7c8aff';
  const r=wrap.getBoundingClientRect(), dpr=DPR();
  cv.width=r.width*dpr; cv.height=r.height*dpr; ctx.scale(dpr,dpr);
  const W=r.width,H=r.height,cx=W/2,cy=H/2,rad=Math.min(W,H)/2-5;
  const start=-Math.PI/2, t0=performance.now(), dur=1500;
  (function draw(t){
    const p=Math.min((t-t0)/dur,1), e=1-Math.pow(1-p,3), val=target*e;
    ctx.clearRect(0,0,W,H);
    ctx.beginPath(); ctx.arc(cx,cy,rad,0,2*Math.PI);
    ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.lineWidth=W>90?9:6; ctx.stroke();
    const end=start+(val/100)*2*Math.PI;
    ctx.beginPath(); ctx.arc(cx,cy,rad,start,end);
    ctx.strokeStyle=color; ctx.lineWidth=W>90?9:6; ctx.lineCap='round';
    ctx.shadowColor=color; ctx.shadowBlur=12; ctx.stroke(); ctx.shadowBlur=0;
    if(p<1) requestAnimationFrame(draw);
  })(t0);
}
document.querySelectorAll('.gauge[data-gauge]').forEach(gauge);

/* ---------- globe ---------- */
const ORIGIN=[-104.99,39.74];
const MARKETS=[
  {c:[-122.33,47.60],col:'#34d399'}, {c:[-122.08,37.39],col:'#fbbf24'},
  {c:[-73.95,40.65], col:'#7c8aff'}, {c:[-0.12,51.50], col:'#2dd4ee'},
  {c:[13.40,52.52],  col:'#2dd4ee'}, {c:[139.69,35.68],col:'#a78bfa'},
  {c:[151.20,-33.87],col:'#a78bfa'},
];

(async function initGlobe(){
  const world=await fetch('vendor/world.json').then(r=>r.json());
  const cv=document.getElementById('globe'), ctx=cv.getContext('2d');
  const projection=d3.geoOrthographic().clipAngle(90).rotate([95,-20,0]);
  const path=d3.geoPath(projection,ctx);
  const sphere={type:'Sphere'};
  let W,H,cx,cy,rad;

  // dot-matrix land points (fibonacci sphere filtered by land)
  const N=11000, GA=Math.PI*(3-Math.sqrt(5)), dots=[];
  for(let i=0;i<N;i++){
    const y=1-(i/(N-1))*2, r=Math.sqrt(1-y*y), th=i*GA;
    const lng=Math.atan2(Math.sin(th)*r,Math.cos(th)*r)*180/Math.PI;
    const lat=Math.asin(y)*180/Math.PI;
    if(d3.geoContains(world.land,[lng,lat])) dots.push([lng,lat]);
  }

  function resize(){
    const r=cv.parentElement.getBoundingClientRect(), dpr=DPR();
    W=r.width; H=r.height; cv.width=W*dpr; cv.height=H*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    rad=Math.min(W*0.6,H*0.94)/2; cx=W*0.47; cy=H*0.52;
    projection.scale(rad).translate([cx,cy]);
  }
  resize(); window.addEventListener('resize',resize);

  const arcs=MARKETS.map((m,i)=>{
    const interp=d3.geoInterpolate(ORIGIN,m.c), pts=[];
    for(let k=0;k<=60;k++) pts.push(interp(k/60));
    return {pts,col:m.col,c:m.c,phase:(i/MARKETS.length),ring:Math.random()};
  });

  const vis=p=>{const c=projection.rotate(); return d3.geoDistance(p,[-c[0],-c[1]])<Math.PI/2;};
  const depth=p=>{const c=projection.rotate(); return 1-d3.geoDistance(p,[-c[0],-c[1]])/(Math.PI/2);};

  function frame(){
    const rot=projection.rotate(); projection.rotate([rot[0]+0.10,rot[1],rot[2]]);
    ctx.clearRect(0,0,W,H);

    // atmosphere
    const atm=ctx.createRadialGradient(cx,cy,rad*0.72,cx,cy,rad*1.22);
    atm.addColorStop(0,'rgba(45,212,238,0)'); atm.addColorStop(.8,'rgba(96,165,250,.10)');
    atm.addColorStop(1,'rgba(96,165,250,0)');
    ctx.beginPath(); ctx.arc(cx,cy,rad*1.22,0,2*Math.PI); ctx.fillStyle=atm; ctx.fill();

    // sphere
    ctx.beginPath(); path(sphere);
    const sg=ctx.createRadialGradient(cx-rad*.35,cy-rad*.4,rad*.1,cx,cy,rad);
    sg.addColorStop(0,'#0e1b30'); sg.addColorStop(1,'#05080f');
    ctx.fillStyle=sg; ctx.fill();

    // land dots
    for(const p of dots){
      if(!vis(p)) continue;
      const xy=projection(p); if(!xy) continue;
      const d=depth(p);
      ctx.globalAlpha=0.18+d*0.55;
      ctx.fillStyle=d>0.55?'#3fa9d6':'#2b5f82';
      const s=d>0.7?1.5:1.1;
      ctx.fillRect(xy[0],xy[1],s,s);
    }
    ctx.globalAlpha=1;

    // faint borders for definition
    ctx.beginPath(); path(world.borders);
    ctx.strokeStyle='rgba(110,170,230,.12)'; ctx.lineWidth=.4; ctx.stroke();

    // rim
    ctx.beginPath(); path(sphere);
    ctx.strokeStyle='rgba(45,212,238,.28)'; ctx.lineWidth=1; ctx.stroke();

    // arcs (static faint line + comet pulse)
    arcs.forEach(a=>{
      // faint full line
      ctx.beginPath(); let started=false;
      for(const p of a.pts){ if(!vis(p)){started=false;continue;} const xy=projection(p);
        if(!started){ctx.moveTo(xy[0],xy[1]);started=true;} else ctx.lineTo(xy[0],xy[1]); }
      ctx.strokeStyle=a.col; ctx.globalAlpha=.18; ctx.lineWidth=1; ctx.stroke(); ctx.globalAlpha=1;

      // comet head
      a.phase=(a.phase+0.0045)%1;
      const headLen=14, hi=Math.floor(a.phase*(a.pts.length-1));
      for(let k=0;k<headLen;k++){
        const idx=hi-k; if(idx<0) break; const p=a.pts[idx]; if(!vis(p)) continue;
        const xy=projection(p), al=(1-k/headLen);
        ctx.beginPath(); ctx.arc(xy[0],xy[1],1.6*al+0.4,0,2*Math.PI);
        ctx.fillStyle=a.col; ctx.globalAlpha=al*0.9;
        ctx.shadowColor=a.col; ctx.shadowBlur=8*al; ctx.fill();
      }
      ctx.globalAlpha=1; ctx.shadowBlur=0;

      // city ring pulse
      a.ring=(a.ring+0.012)%1;
      if(vis(a.c)){
        const xy=projection(a.c);
        ctx.beginPath(); ctx.arc(xy[0],xy[1],2+a.ring*10,0,2*Math.PI);
        ctx.strokeStyle=a.col; ctx.globalAlpha=(1-a.ring)*0.6; ctx.lineWidth=1; ctx.stroke();
        ctx.globalAlpha=1;
        ctx.beginPath(); ctx.arc(xy[0],xy[1],2.2,0,2*Math.PI);
        ctx.fillStyle=a.col; ctx.shadowColor=a.col; ctx.shadowBlur=8; ctx.fill(); ctx.shadowBlur=0;
      }
    });

    // home base
    if(vis(ORIGIN)){
      const xy=projection(ORIGIN);
      ctx.beginPath(); ctx.arc(xy[0],xy[1],3.4,0,2*Math.PI);
      ctx.fillStyle='#fff'; ctx.shadowColor='#2dd4ee'; ctx.shadowBlur=12; ctx.fill(); ctx.shadowBlur=0;
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ---------- charts ---------- */
Chart.defaults.color='#828cb0';
Chart.defaults.font.family="'JetBrains Mono','JetBrains Mono',monospace";
Chart.defaults.font.size=9;
function vgrad(ctx,area,c1,c2){
  if(!area) return c1;
  const g=ctx.createLinearGradient(0,area.top,0,area.bottom);
  g.addColorStop(0,c1); g.addColorStop(1,c2); return g;
}

new Chart(document.getElementById('leadChart'),{
  type:'line',
  data:{labels:['Q1','Q2','Q3','Q4'],datasets:[
    {data:[31,27,24,19],borderColor:'#2dd4ee',borderWidth:2,tension:.45,pointRadius:0,fill:true,
      backgroundColor:c=>vgrad(c.chart.ctx,c.chart.chartArea,'rgba(45,212,238,.28)','rgba(45,212,238,0)')},
    {data:[26,28,22,21],borderColor:'#7c8aff',borderDash:[4,4],borderWidth:1.4,tension:.45,pointRadius:0,fill:false},
  ]},
  options:{responsive:true,maintainAspectRatio:false,animation:{duration:900},
    plugins:{legend:{display:false}},scales:{
      x:{grid:{display:false},ticks:{maxRotation:0}},
      y:{grid:{color:'rgba(140,160,255,.05)'},ticks:{maxTicksLimit:3},suggestedMin:10}}}
});

new Chart(document.getElementById('outChart'),{
  type:'bar',
  data:{labels:Array.from({length:12},(_,i)=>i+1),datasets:[
    {data:[40,55,38,62,70,48,80,66,90,74,102,88],borderRadius:3,barPercentage:.72,
      backgroundColor:c=>vgrad(c.chart.ctx,c.chart.chartArea,'rgba(124,138,255,.95)','rgba(124,138,255,.35)')},
    {data:[8,6,12,5,9,14,7,11,6,10,8,13],borderRadius:3,barPercentage:.72,
      backgroundColor:'rgba(251,113,133,.6)'},
  ]},
  options:{responsive:true,maintainAspectRatio:false,animation:{duration:900},
    plugins:{legend:{display:false}},scales:{
      x:{stacked:true,grid:{display:false},ticks:{display:false}},
      y:{stacked:true,grid:{color:'rgba(140,160,255,.05)'},ticks:{maxTicksLimit:3}}}}
});

new Chart(document.getElementById('incSpark'),{
  type:'line',
  data:{labels:Array.from({length:30},(_,i)=>i),datasets:[
    {data:[2,1,3,2,4,3,5,4,3,6,5,7,6,8,7,9,8,10,9,11,10,12,11,13,12,14,13,15,14,16],
      borderColor:'#fbbf24',borderWidth:1.5,tension:.4,pointRadius:0,fill:true,
      backgroundColor:c=>vgrad(c.chart.ctx,c.chart.chartArea,'rgba(251,191,36,.3)','rgba(251,191,36,0)')}]},
  options:{responsive:true,maintainAspectRatio:false,animation:{duration:900},
    plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}}}
});

/* ---------- ticker ---------- */
const TICK=`<b>KDP</b> auto-publishing <span class="g">▲ +3 books</span><span class="sep">/</span>`+
  `<b>YouTube</b> render 40%<span class="sep">/</span>`+
  `<b>Income</b> $0 of $100 today<span class="sep">/</span>`+
  `<b>Next payout</b> 19 days <span class="g">▼ 12d</span><span class="sep">/</span>`+
  `<b>Agents</b> 3 live · 1 blocked<span class="sep">/</span>`+
  `<b>Output</b> 1,240 units <span class="g">▲ 18%</span><span class="sep">/</span>`+
  `<b>Etsy</b> <span class="r">queued</span><span class="sep">/</span>`+
  `<b>Baby prep</b> 30% · due Nov 12<span class="sep">/</span>`;
document.getElementById('tickerRun').innerHTML=TICK+TICK;

/* ---------- drawer ---------- */
const drawer=document.getElementById('drawer'),
      dK=document.getElementById('drawer-kicker'),
      dT=document.getElementById('drawer-title'),
      dB=document.getElementById('drawer-body');
const DRILL={
  pipeline:['01 · PIPELINE','Pipeline','Live status of every income engine, the markets they reach, and time-to-first-payout. Globe arcs map each automation to where it earns.'],
  news:['02 · NEWS','News','Full HN feed — drops into your existing Algolia source. Featured story + filmstrip of recent items.'],
  income:['03 · INCOME','Income','Daily progress toward the $100/day north star, pulled from real income tracking.'],
  automation:['04 · AUTOMATION','Automation','Health of each engine (KDP / YouTube / Etsy) broken down by sub-step, so you see exactly where a pipeline stalls.'],
  output:['05 · OUTPUT','Output','Units produced and shipped over the last 30 days — books published, videos rendered, listings created.'],
  issues:['06 · AGENT QUEUE','Agent Queue','What every agent is doing, what failed, and what is blocked on you. The control surface for the mini-company.'],
};
document.querySelectorAll('.panel').forEach(p=>{
  p.addEventListener('click',()=>{
    const d=DRILL[p.dataset.drill]||['','Tile','Drill-down coming soon.'];
    dK.textContent=d[0]; dT.textContent=d[1]; dB.textContent=d[2]; drawer.classList.add('open');
  });
});
const close=()=>drawer.classList.remove('open');
document.getElementById('drawer-close').addEventListener('click',close);
drawer.addEventListener('click',e=>{if(e.target===drawer)close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
