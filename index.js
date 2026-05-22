/* ----- Theme ----- */
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
function setTheme(t) {
  document.documentElement.classList.add('theme-transitioning');
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('pp-theme', t);
  themeIcon.innerHTML = t === 'dark'
    ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
    : '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
  setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 300);
}
setTheme(localStorage.getItem('pp-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ----- Palette switcher ----- */
const palBtn = document.getElementById('palBtn');
const palPop = document.getElementById('palPop');
const palOpts = document.querySelectorAll('.pal-opt');
function setPalette(p) {
  document.documentElement.classList.add('theme-transitioning');
  if (p && p !== 'forest') document.documentElement.setAttribute('data-palette', p);
  else document.documentElement.removeAttribute('data-palette');
  localStorage.setItem('pp-palette', p || 'forest');
  palOpts.forEach(o => o.classList.toggle('active', o.dataset.pal === (p || 'forest')));
  setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 300);
}
setPalette(localStorage.getItem('pp-palette') || 'forest');
palBtn.addEventListener('click', e => {
  e.stopPropagation();
  palPop.classList.toggle('open');
});
palOpts.forEach(o => o.addEventListener('click', () => {
  setPalette(o.dataset.pal);
  showToast('Theme · ' + o.textContent.trim());
  setTimeout(() => palPop.classList.remove('open'), 140);
}));
document.addEventListener('click', e => {
  if (!palPop.contains(e.target) && !palBtn.contains(e.target)) palPop.classList.remove('open');
});

/* ----- Nav scroll state + scroll progress ----- */
const nav = document.getElementById('nav');
const scrollProg = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 4);
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  scrollProg.style.width = pct + '%';
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ----- Mobile menu ----- */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A') navLinks.classList.remove('open');
});

/* ----- Active nav highlight ----- */
const navSections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');
const navHIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
    if (link) link.classList.toggle('active', e.isIntersecting);
  });
}, { rootMargin: '-40% 0px -55% 0px' });
navSections.forEach(s => navHIO.observe(s));

/* ----- Reveal on scroll ----- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }});
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ----- Project filter ----- */
const filterBtns = document.querySelectorAll('.filters button');
const projs = document.querySelectorAll('.proj');
filterBtns.forEach(b => b.addEventListener('click', () => {
  filterBtns.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  const f = b.dataset.filter;
  projs.forEach(p => {
    const show = f === 'all' || p.dataset.cat.split(' ').includes(f);
    p.classList.toggle('hidden', !show);
  });
}));

/* ----- View toggle ----- */
const grid = document.getElementById('projectsGrid');
document.getElementById('viewGrid').addEventListener('click', e => {
  grid.classList.remove('list'); e.currentTarget.classList.add('active');
  document.getElementById('viewList').classList.remove('active');
});
document.getElementById('viewList').addEventListener('click', e => {
  grid.classList.add('list'); e.currentTarget.classList.add('active');
  document.getElementById('viewGrid').classList.remove('active');
});

/* ----- Copy email ----- */
function showToast(text) {
  const t = document.getElementById('toast');
  document.getElementById('toastText').textContent = text;
  t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1800);
}
document.getElementById('copyEmail').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('pranav.pankhawala@gmail.com'); showToast('Email copied'); } catch {}
});

/* ----- Command palette ----- */
const cmdk = document.getElementById('cmdk');
const cmdkInput = document.getElementById('cmdkInput');
const cmdkList = document.getElementById('cmdkList');
const cmdkItems = [
  { ic: '#', label: 'Go to Work', target: '#work', hint: '⏎' },
  { ic: '#', label: 'Go to About', target: '#about', hint: '⏎' },
  { ic: '#', label: 'Go to Capabilities', target: '#capabilities', hint: '⏎' },
  { ic: '#', label: 'Go to Projects', target: '#projects', hint: '⏎' },
  { ic: '#', label: 'Go to Publications', target: '#publications', hint: '⏎' },
  { ic: '#', label: 'Go to Skills', target: '#skills', hint: '⏎' },
  { ic: '#', label: 'Go to Certifications', target: '#certifications', hint: '⏎' },
  { ic: '#', label: 'Go to Interests', target: '#interests', hint: '⏎' },
  { ic: '#', label: 'Go to Contact', target: '#contact', hint: '⏎' },
  { ic: '@', label: 'Email Pranav', action: () => location.href = 'mailto:pranav.pankhawala@gmail.com', hint: 'mail' },
  { ic: '☎', label: 'Call Pranav', action: () => location.href = 'tel:+918408069188', hint: 'tel' },
  { ic: '↗', label: 'Open GitHub', action: () => window.open('https://github.com/pranavpankhawala','_blank'), hint: 'ext' },
  { ic: '↗', label: 'Open LinkedIn', action: () => window.open('https://www.linkedin.com/in/pranavpankhawala','_blank'), hint: 'ext' },
  { ic: '↓', label: 'Download Resume', action: () => { const a = document.createElement('a'); a.href = 'resume.pdf'; a.download = ''; a.click(); }, hint: 'pdf' },
  { ic: '◐', label: 'Toggle theme', action: () => themeBtn.click(), hint: '⇧T' },
];
function renderCmdk(q = '') {
  const filtered = cmdkItems.filter(i => i.label.toLowerCase().includes(q.toLowerCase()));
  cmdkList.innerHTML = filtered.map((i, idx) => `
    <div class="cmdk-item ${idx === 0 ? 'active' : ''}" data-idx="${cmdkItems.indexOf(i)}">
      <span class="ic mono">${i.ic}</span>
      <span>${i.label}</span>
      <span class="hint">${i.hint}</span>
    </div>`).join('') || '<div class="cmdk-item" style="opacity:.5">No results</div>';
}
function openCmdk() { cmdk.classList.add('open'); renderCmdk(); cmdkInput.value=''; cmdkInput.focus(); }
function closeCmdk() { cmdk.classList.remove('open'); }
document.getElementById('cmdkBtn').addEventListener('click', openCmdk);
cmdkInput.addEventListener('input', e => renderCmdk(e.target.value));
cmdkList.addEventListener('click', e => {
  const item = e.target.closest('.cmdk-item');
  if (!item) return;
  const i = cmdkItems[+item.dataset.idx];
  if (i.target) { location.hash = i.target; }
  else if (i.action) { i.action(); }
  closeCmdk();
});
cmdk.addEventListener('click', e => { if (e.target === cmdk) closeCmdk(); });
window.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmdk(); }
  else if (e.key === 'Escape') { closeCmdk(); navLinks.classList.remove('open'); document.querySelectorAll('.proj.flipped').forEach(c => c.classList.remove('flipped')); }
  else if (e.key === 'Enter' && cmdk.classList.contains('open')) {
    const active = cmdkList.querySelector('.cmdk-item.active') || cmdkList.querySelector('.cmdk-item');
    if (active) active.click();
  }
});

/* ----- Role cycler ----- */
const heroRole = document.getElementById('heroRole');
const roles = [
  'AI Automation Engineer',
  'Computer Vision Engineer',
  'Cybersecurity Engineer',
  'Edge AI Specialist',
];
let roleIdx = 0;
if (heroRole) {
  setInterval(() => {
    heroRole.classList.add('fade');
    setTimeout(() => {
      roleIdx = (roleIdx + 1) % roles.length;
      heroRole.textContent = roles[roleIdx];
      heroRole.classList.remove('fade');
    }, 280);
  }, 3200);
}

/* ----- Animated counters ----- */
function animateCount(el) {
  const target = +el.dataset.target;
  const duration = 1400;
  const startTime = performance.now();
  function tick(now) {
    const pct = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(eased * target);
    if (pct < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterEls = document.querySelectorAll('.count[data-target]');
if (counterEls.length) {
  const tickerEl = document.querySelector('.hero-ticker');
  const counterIO = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      counterEls.forEach(animateCount);
      counterIO.disconnect();
    }
  }, { threshold: 0.6 });
  if (tickerEl) counterIO.observe(tickerEl);
}

/* ----- Project modals ----- */
const projectDetails = {
  'surveillance': {
    label: 'SELF · ONGOING', badge: 'In Progress', glyph: 'α',
    title: 'AI-based Surveillance System',
    tags: ['YOLO', 'PyTorch', 'OpenCV', 'Jetson'],
    problem: 'Industrial and urban environments need automated, real-time monitoring without continuous human oversight. Traditional CCTV relies entirely on post-incident review and misses violations as they happen.',
    approach: 'Multi-module computer-vision pipeline combining YOLO-based object detection with classical CV techniques — color filtering, contour analysis, motion tracking. Deployed on NVIDIA Jetson Nano for sub-50ms edge inference with no cloud dependency.',
    outcome: 'Ongoing platform with configurable detection modules for traffic-violation detection, industrial site surveillance, and human-security applications. Supports alert pipelines with adjustable confidence thresholds.',
    highlights: [
      'Real-time YOLO inference at the edge — no cloud dependency',
      'Classical CV preprocessing significantly cuts false-positive rate',
      'Modular design: swap detection heads per deployment context',
      'Targeting Jetson AGX Xavier for production-grade throughput',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/pranavpankhawala' }],
  },
  'network-security': {
    label: 'M.TECH · THESIS', badge: 'Published', glyph: 'λ',
    title: 'AI / ML Network Security Model',
    tags: ['Network Security', 'Machine Learning', 'Python'],
    problem: 'IoT networks generate heterogeneous traffic that rule-based intrusion detection systems struggle to classify — especially under novel attack patterns that don\'t match known signatures, producing high false-positive rates.',
    approach: 'Engineered a set of packet-level markers from raw network traffic features and trained an ML classification model to distinguish benign from malicious packets. Applied feature selection and cross-validation to minimize false positives and improve generalization across traffic types.',
    outcome: 'Published in Neuro Quantology, Volume 20, Issue 9, 2022 (DOI: 10.14704/nq.2022.20.9.NQ440121). Demonstrated improved detection accuracy over baseline rule-based approaches on the validation dataset.',
    highlights: [
      'Feature engineering on raw packet metadata — no deep payload inspection needed',
      'Cross-validated to reduce false positives on unseen traffic patterns',
      'Peer-reviewed and published in Neuro Quantology',
      'Supervised by Dr. Sirsikar Sumedha, MIT World Peace University',
    ],
    links: [{ label: 'View Paper (DOI)', href: 'https://doi.org/10.14704/nq.2022.20.9' }],
  },
  'night-vision': {
    label: 'B.E. · CAPSTONE', badge: null, glyph: 'ν',
    title: 'Night Vision & Perimeter Security',
    tags: ['OpenCV', 'Python', 'Raspberry Pi', 'Embedded'],
    problem: 'Perimeter security in zero-light conditions requires expensive thermal cameras or constant human attention. Unmanned patrol vehicles need autonomous, battery-powered vision that works in full darkness.',
    approach: 'Built a night-vision system using IR-enhanced cameras with OpenCV-based processing: histogram equalization, edge detection, and motion-triggered alerting. Mounted on an unmanned ground vehicle and edge-deployed on Raspberry Pi for fully offline operation.',
    outcome: 'Functional B.E. capstone prototype demonstrating autonomous perimeter patrol with configurable detection zones and motion-triggered alert logging. Battery-powered with full-dark operation validated in field tests.',
    highlights: [
      'IR camera integration with OpenCV night-vision preprocessing pipeline',
      'Motion-triggered alerts with configurable detection zone polygons',
      'Edge-deployed on Raspberry Pi — battery-powered, zero cloud dependency',
      'Mounted on unmanned ground vehicle for fully autonomous perimeter patrol',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/pranavpankhawala' }],
  },
};

function buildProjectBack(card) {
  const id = card.dataset.projectId;
  const d = projectDetails[id];
  if (!d) return;
  const back = card.querySelector('.proj-back');
  back.innerHTML = `
    <button class="icon-btn proj-flip-close" aria-label="Flip back">
      <svg class="i" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <div class="proj-back-label">${d.label}${d.badge ? ' · ' + d.badge : ''}</div>
    <h3 class="proj-back-title">${d.title}</h3>
    <div>
      <div class="proj-back-section-label">Highlights</div>
      <ul class="proj-back-highlights">${d.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
    </div>
    <div class="tagrow">${d.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
    <div class="proj-back-links">${d.links.map(l =>
      `<a href="${l.href}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost" style="font-size:12px">${l.label}<svg class="i arrow" viewBox="0 0 24 24" width="12" height="12"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg></a>`
    ).join('')}</div>`;
  back.querySelector('.proj-flip-close').addEventListener('click', e => {
    e.stopPropagation();
    card.classList.remove('flipped');
  });
}

document.querySelectorAll('.proj[data-project-id]').forEach(card => {
  buildProjectBack(card);
  card.addEventListener('click', e => {
    if (e.target.closest('a') || e.target.closest('.proj-flip-close')) return;
    card.classList.toggle('flipped');
  });
});
