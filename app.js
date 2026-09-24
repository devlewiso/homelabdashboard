(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);

  // ── Homelab data: edit this block to document your own lab ─────────────────
  const DATA = {
    svc: [
      { id: 'FILES', short: 'FILES', icon: 'bi-folder2-open', c: '#22d3ee', role: 'File Manager', desc: 'Web-based Content Administration' },
      { id: 'PLEX', short: 'PLEX', icon: 'bi-play-btn', c: '#fbbf24', role: 'Media Server', desc: 'Professional Streaming Platform' },
      { id: 'PROWLARR', short: 'PROWL', icon: 'bi-search', c: '#f472b6', role: 'Indexer', desc: 'Search Management System' },
      { id: 'JELLYFIN', short: 'JELLY', icon: 'bi-film', c: '#a78bfa', role: 'Media Server', desc: 'Open-Source Alternative' },
      { id: 'SONARR', short: 'SONARR', icon: 'bi-tv', c: '#38bdf8', role: 'TV Manager', desc: 'Automated Series Management' },
      { id: 'RADARR', short: 'RADARR', icon: 'bi-camera-reels', c: '#fb923c', role: 'Movie Manager', desc: 'Automated Film Management' },
      { id: 'OPENWEBUI', short: 'WEBUI', icon: 'bi-robot', c: '#22c55e', role: 'AI Interface', desc: 'Local LLM Interaction' },
      { id: 'NVR', short: 'NVR', icon: 'bi-camera-video', c: '#ef4444', role: 'Surveillance', desc: 'IP Camera Recording System' },
      { id: 'PROMETHEUS', short: 'PROM', icon: 'bi-activity', c: '#f97316', role: 'Metrics', desc: 'Real-time Monitoring System' },
      { id: 'HOME-AI', short: 'HA', icon: 'bi-house-gear', c: '#2dd4bf', role: 'Automation', desc: 'Smart Home Platform' },
      { id: 'OVERSEERR', short: 'OVER', icon: 'bi-inbox', c: '#c084fc', role: 'Request Portal', desc: 'Media Request Management' },
      { id: 'APPSTORE', short: 'STORE', icon: 'bi-grid-3x3-gap', c: '#60a5fa', role: 'Marketplace', desc: 'CasaOS Application Store' },
    ],
    vm: [
      { id: '101', name: 'OMADA', icon: 'bi-router', c: '#22d3ee', role: 'Network Controller', desc: 'TP-Link Omada Management System', load: 18 },
      { id: '102', name: 'BACKUP', icon: 'bi-cloud-arrow-up', c: '#22c55e', role: 'Backup System', desc: 'Automated Configuration Backup', load: 9 },
      { id: '104', name: 'NVR', icon: 'bi-camera-video', c: '#ef4444', role: 'Video Recorder', desc: '24/7 Surveillance System', load: 46 },
      { id: '120', name: 'MONITOR', icon: 'bi-graph-up', c: '#f97316', role: 'Monitoring Stack', desc: 'Grafana + Prometheus', load: 27 },
      { id: '121', name: 'WEBUI', icon: 'bi-window', c: '#a78bfa', role: 'Web Interface', desc: 'Modern Management Console', load: 22 },
      { id: '100', name: 'CASAOS', icon: 'bi-hdd-network', c: '#fbbf24', role: 'Media Server', desc: 'CasaOS Host System', load: 61 },
      { id: '200', name: 'HOME-AI', icon: 'bi-house-gear', c: '#2dd4bf', role: 'Home Automation', desc: 'Smart Home Control Center', load: 14 },
      { id: '289', name: 'HUB', icon: 'bi-diagram-3', c: '#f472b6', role: 'Custom Hub', desc: 'Automation & Integration Services', load: 33 },
    ],
    sto: [
      { id: 'STR', name: 'LOCALNET', short: 'NET', icon: 'bi-hdd-network', c: '#22d3ee', role: 'Storage', desc: 'Local Network Storage', load: 41 },
      { id: 'STR', name: 'ENTERTAINMENT', short: 'ENT', icon: 'bi-collection-play', c: '#f472b6', role: 'Storage', desc: 'Media Content Repository', load: 72 },
      { id: 'STR', name: 'LOCAL', short: 'LOC', icon: 'bi-hdd', c: '#fbbf24', role: 'Storage', desc: 'General Purpose Storage', load: 28 },
      { id: 'STR', name: 'SSD', short: 'SSD', icon: 'bi-lightning-charge', c: '#22c55e', role: 'Storage', desc: 'High-Speed SSD Array', load: 19 },
    ],
    stack: [['PROXMOX VE 9.0.11', 'bi-hdd-stack'], ['AMD RYZEN 7 5700G', 'bi-cpu'], ['LINUX 6.14', 'bi-terminal'], ['TP-LINK OMADA', 'bi-router'], ['HOME ASSISTANT', 'bi-house-gear'],
      ['NGINX', 'bi-signpost-split'], ['CLOUDFLARE', 'bi-cloud-haze2'], ['LINODE', 'bi-server'], ['NVR', 'bi-camera-video'], ['GRAFANA', 'bi-graph-up'],
      ['PROMETHEUS', 'bi-activity'], ['CASAOS', 'bi-hdd-network'], ['OPENWEBUI', 'bi-robot'], ['DOCKER', 'bi-box-seam']],
  };
  const RAM = 83.52; const STO = (97.44 / 495.96) * 100;

  $('year').textContent = new Date().getFullYear();

  // Clock + uptime counter (starts at 7d 22h 31m on page load)
  const t0 = Date.now() - ((7 * 24 + 22) * 3600 + 31 * 60) * 1000;
  const tick = () => {
    $('clock').textContent = new Date().toLocaleTimeString('es', { hour12: false });
    const s = Math.floor((Date.now() - t0) / 1000);
    $('uptime').textContent = `${Math.floor(s / 86400)}d ${Math.floor(s / 3600) % 24}h ${Math.floor(s / 60) % 60}m ${String(s % 60).padStart(2, '0')}s`;
  };
  tick(); setInterval(tick, 1000);

  // Boot log
  const boot = $('boot');
  const lines = [
    ['', 'System.initialize()'], ['ok', '[ OK ] proxmox-ve 9.0.11 · kernel 6.14'], ['ok', '[ OK ] 8 vms/lxc up · 4 storage pools mounted'],
    ['ok', '[ OK ] casaos: 12 services healthy'], ['ok', '[ OK ] cloudflare tunnel → homelab.domain.net'], ['hl', '→ Ready'],
  ];
  const renderBoot = (n, partial = '') => {
    boot.innerHTML = lines.slice(0, n).map(([c, t]) => `<span class="${c}">${t}</span>`).join('\n') + (n < lines.length ? `${n ? '\n' : ''}${partial}▌` : '');
  };
  if (reduce) renderBoot(lines.length);
  else {
    let l = 0; let ch = 0;
    const type = () => {
      if (l >= lines.length) return;
      const text = lines[l][1]; ch++;
      renderBoot(l, text.slice(0, ch));
      if (ch >= text.length) { l++; ch = 0; renderBoot(l); setTimeout(type, 280); } else setTimeout(type, 16);
    };
    setTimeout(type, 500);
  }

  // Gauges
  const setGauge = (el, pct) => { el.style.strokeDashoffset = String(314 - (314 * pct) / 100); };
  let cpu = 24;
  const cpuHist = Array.from({ length: 48 }, () => 18 + Math.random() * 14);
  requestAnimationFrame(() => { setGauge($('g-ram'), RAM); setGauge($('g-sto'), STO); setGauge($('g-cpu'), cpu); });

  // CPU sparkline (simulated load for the demo)
  const spark = $('spark'); const ctx = spark.getContext('2d');
  const drawSpark = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); const w = spark.clientWidth; const h = 60;
    spark.width = w * dpr; spark.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const step = w / (cpuHist.length - 1);
    const grad = ctx.createLinearGradient(0, 0, 0, h); grad.addColorStop(0, 'rgba(34,211,238,.35)'); grad.addColorStop(1, 'rgba(34,211,238,0)');
    ctx.beginPath(); cpuHist.forEach((v, i) => { const x = i * step; const y = h - (v / 100) * h * 1.6; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
  };
  drawSpark(); window.addEventListener('resize', drawSpark);
  if (!reduce) setInterval(() => {
    cpu = Math.max(8, Math.min(62, cpu + (Math.random() - 0.5) * 12));
    cpuHist.push(cpu); cpuHist.shift();
    $('t-cpu').textContent = `${Math.round(cpu)}%`; setGauge($('g-cpu'), cpu); drawSpark();
  }, 1500);

  // Topology chips
  $('chips-vms').innerHTML = DATA.vm.map((v) => `<button type="button" class="chip" data-kind="vm" data-key="${v.id}">⬢ ${v.id}</button>`).join('')
    + DATA.sto.map((s) => `<button type="button" class="chip" data-kind="sto" data-key="${s.name}">⬢ ${s.short}</button>`).join('');
  $('chips-svc').innerHTML = DATA.svc.map((s) => `<button type="button" class="chip" data-kind="svc" data-key="${s.id}">⬡ ${s.short}</button>`).join('');

  // Explorer
  let tab = 'svc';
  const cards = $('cards'); const detail = $('detail-body');
  const find = (kind, key) => DATA[kind].find((x) => (kind === 'svc' ? x.id : kind === 'vm' ? x.id : x.name) === key);
  const keyOf = (kind, x) => (kind === 'sto' ? x.name : x.id);
  const label = (kind, x) => (kind === 'svc' ? `[SVC] ${x.id}` : kind === 'vm' ? `[${x.id}] ${x.name}` : `[STR] ${x.name}`);
  const showDetail = (kind, key) => {
    const x = find(kind, key); if (!x) return;
    detail.parentElement.style.setProperty('--c', x.c);
    const load = x.load;
    const meter = load == null ? '' : `<dl class="specs mono small"><div><dt>${kind === 'sto' ? 'usage' : 'load'}</dt><dd>${load}%</dd></div></dl><div class="bar"><i style="width:${load}%"></i></div>`;
    detail.innerHTML = `<span class="d-icon"><i class="bi ${x.icon}"></i></span>
      <p class="mono dim" style="margin:.9rem 0 0">${kind === 'svc' ? 'CASAOS SERVICE' : kind === 'vm' ? 'PROXMOX VM / LXC' : 'STORAGE POOL'}</p>
      <h3>${label(kind, x)}</h3><p>${x.role} :: ${x.desc}</p>
      <dl class="specs mono small"><div><dt>status</dt><dd class="ok">● running</dd></div></dl>${meter}`;
    document.querySelectorAll('.card, .chip[data-key]').forEach((el) => el.classList.toggle('sel', el.dataset.kind === kind && el.dataset.key === key));
  };
  const renderCards = () => {
    cards.innerHTML = DATA[tab].map((x, i) => `<button type="button" class="card" style="--c:${x.c};animation-delay:${i * 35}ms" data-kind="${tab}" data-key="${keyOf(tab, x)}">
      <span class="c-id"><i class="bi ${x.icon}"></i> ${label(tab, x).split(' ')[0]}</span><b>${tab === 'svc' ? x.id : x.name}</b><small>${x.role} :: ${x.desc}</small></button>`).join('');
    showDetail(tab, keyOf(tab, DATA[tab][0]));
  };
  const setTab = (t) => {
    tab = t;
    document.querySelectorAll('[data-tab]').forEach((b) => { b.classList.toggle('active', b.dataset.tab === t); b.setAttribute('aria-selected', String(b.dataset.tab === t)); });
    renderCards();
  };
  document.querySelector('.tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) setTab(b.dataset.tab); });
  cards.addEventListener('click', (e) => { const c = e.target.closest('.card'); if (c) showDetail(c.dataset.kind, c.dataset.key); });
  document.querySelector('.topo').addEventListener('click', (e) => {
    const c = e.target.closest('.chip[data-key]'); if (!c) return;
    setTab(c.dataset.kind); showDetail(c.dataset.kind, c.dataset.key);
    $('explorer').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  renderCards();

  // Stack
  $('stack-list').innerHTML = DATA.stack.map(([n, i]) => `<div class="tech"><i class="bi ${i}"></i>${n}</div>`).join('');

  // Count-up + reveal
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    if (reduce) { el.textContent = target; return; }
    const start = performance.now();
    const step = (now) => { const p = Math.min((now - start) / 1200, 1); el.textContent = Math.round(target * p); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
  const reveals = document.querySelectorAll('.section');
  reveals.forEach((el) => el.classList.add('reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } }), { threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add('visible'));
})();
