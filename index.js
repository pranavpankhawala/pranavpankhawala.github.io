/* ----- Global flags ----- */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ----- Theme ----- */
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
function autoTheme() { const h = new Date().getHours(); return h >= 19 || h < 7 ? 'dark' : 'light'; }
function setTheme(t) {
  document.documentElement.classList.add('theme-transitioning');
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('pp-theme', t);
  themeIcon.innerHTML = t === 'dark'
    ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
    : '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
  setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 300);
}
setTheme(localStorage.getItem('pp-theme') || autoTheme());
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
const ringFill = document.getElementById('ringFill');
const heroH1 = document.querySelector('.hero-main h1');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 4);
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  scrollProg.style.width = pct + '%';
  backToTop.classList.toggle('visible', window.scrollY > 400);
  if (ringFill) ringFill.style.strokeDashoffset = String(106.8 * (1 - pct / 100));
  if (heroH1 && !reducedMotion) heroH1.style.transform = `translateY(${window.scrollY * 0.28}px)`;
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
  { ic: '#', label: 'Go to Blog', target: '#blog', hint: '⏎' },
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
  { ic: '?', label: 'Keyboard shortcuts', action: () => openHelp(), hint: '?' },
  { ic: '>', label: 'Open terminal', action: () => openTerminal(), hint: '`' },
];
function fuzzyMatch(q, s) {
  if (!q) return true;
  q = q.toLowerCase(); s = s.toLowerCase();
  let si = 0;
  for (let qi = 0; qi < q.length; qi++) {
    si = s.indexOf(q[qi], si);
    if (si < 0) return false;
    si++;
  }
  return true;
}
function renderCmdk(q = '') {
  const filtered = cmdkItems.filter(i => fuzzyMatch(q, i.label));
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
  const tag = document.activeElement.tagName;
  const editable = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable;
  if (e.key === 's' && !editable && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); openCmdk(); }
  else if (e.key === '`' && !editable) { e.preventDefault(); openTerminal(); }
  else if (e.key === '?' && !editable) { e.preventDefault(); openHelp(); }
  else if (e.key === 'Escape') { closeCmdk(); closeHelp(); closeTerminal(); navLinks.classList.remove('open'); document.querySelectorAll('.proj.flipped').forEach(c => c.classList.remove('flipped')); }
  else if (e.key === 'Enter' && cmdk.classList.contains('open')) {
    const active = cmdkList.querySelector('.cmdk-item.active') || cmdkList.querySelector('.cmdk-item');
    if (active) active.click();
  } else if (cmdk.classList.contains('open') && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    e.preventDefault();
    const items = [...cmdkList.querySelectorAll('.cmdk-item')];
    const activeIdx = items.findIndex(i => i.classList.contains('active'));
    const nextIdx = e.key === 'ArrowDown'
      ? (activeIdx + 1) % items.length
      : (activeIdx - 1 + items.length) % items.length;
    items[activeIdx]?.classList.remove('active');
    items[nextIdx]?.classList.add('active');
    items[nextIdx]?.scrollIntoView({ block: 'nearest' });
  }
});

/* ----- Role cycler (typewriter) ----- */
const heroRole = document.getElementById('heroRole');
const roles = [
  'AI Automation Engineer',
  'Computer Vision Engineer',
  'Cybersecurity Engineer',
  'Edge AI Specialist',
];
if (heroRole) {
  if (reducedMotion) {
    heroRole.textContent = roles[0];
  } else {
    heroRole.textContent = '';
    let rIdx = 0, cIdx = 0, deleting = false;
    function typewrite() {
      const full = roles[rIdx];
      if (!deleting) {
        cIdx++;
        heroRole.textContent = full.slice(0, cIdx);
        if (cIdx === full.length) {
          setTimeout(() => { deleting = true; typewrite(); }, 2000);
          return;
        }
        setTimeout(typewrite, 70);
      } else {
        cIdx--;
        heroRole.textContent = full.slice(0, cIdx);
        if (cIdx === 0) {
          deleting = false;
          rIdx = (rIdx + 1) % roles.length;
          setTimeout(typewrite, 320);
          return;
        }
        setTimeout(typewrite, 38);
      }
    }
    setTimeout(typewrite, 600);
  }
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

/* ----- Impact strip counters ----- */
const iCountEls = document.querySelectorAll('.icount[data-target]');
if (iCountEls.length) {
  const impactEl = document.querySelector('.impact-strip');
  const impactIO = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { iCountEls.forEach(animateCount); impactIO.disconnect(); }
  }, { threshold: 0.4 });
  if (impactEl) impactIO.observe(impactEl);
}

/* ----- Project modals ----- */
const projectDetails = {
  'surveillance': {
    label: 'SELF · ONGOING', badge: 'In Progress', glyph: 'α',
    plainEng: "Teaches cameras to catch problems on factory floors instantly — no human needed",
    meta: "Solo · Ongoing · YOLO + classical CV pipeline",
    codePeek: `# Core detection loop\nresults = model(frame)\nfor box in results[0].boxes:\n    conf = float(box.conf)\n    if conf > THRESHOLD:\n        cls = int(box.cls)\n        alert(cls, conf, frame)`,
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
    plainEng: "Spots network attacks using AI trained on real IoT traffic — published research",
    meta: "Solo · M.Tech thesis · 2022 · Published",
    codePeek: `# Feature extraction\nfeatures = extract_packet_features(pcap)\nX = scaler.transform(features)\npred = model.predict(X)\nflag_malicious(pred, threshold=0.85)`,
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
    plainEng: "Lets robots see in pitch darkness and autonomously patrol perimeters on battery power",
    meta: "Team · B.E. capstone · Embedded · Raspberry Pi",
    codePeek: `# Night-vision preprocessing\ngray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)\neq = cv2.equalizeHist(gray)\nedges = cv2.Canny(eq, 50, 150)\nmotion = detect_motion(prev, eq)`,
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

/* ----- Project cards: highlights (list view) + flip (grid view) ----- */
document.querySelectorAll('.proj[data-project-id]').forEach(card => {
  const d = projectDetails[card.dataset.projectId];
  if (!d) return;

  // Inject plain-English description and meta row into front face
  if (d.meta || d.plainEng) {
    const h3 = card.querySelector('.proj-body h3');
    if (h3 && d.meta) {
      const metaEl = document.createElement('div');
      metaEl.className = 'proj-meta-row';
      metaEl.textContent = d.meta;
      h3.after(metaEl);
    }
    if (d.plainEng) {
      const plainEl = document.createElement('div');
      plainEl.className = 'proj-plain-eng';
      plainEl.textContent = d.plainEng;
      const metaRow = card.querySelector('.proj-meta-row');
      if (metaRow) metaRow.after(plainEl);
      else h3 && h3.after(plainEl);
    }
  }
  // Code peek
  if (d.codePeek) {
    const projBody = card.querySelector('.proj-body');
    if (projBody) {
      const btn = document.createElement('button');
      btn.className = 'code-peek-btn';
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> code peek';
      const block = document.createElement('div');
      block.className = 'code-peek-block';
      block.innerHTML = `<pre class="code-block">${d.codePeek}</pre>`;
      btn.addEventListener('click', e => { e.stopPropagation(); block.classList.toggle('open'); });
      projBody.appendChild(btn);
      projBody.appendChild(block);
    }
  }

  // Populate list-view inline content (CSS hides these in grid)
  const ul = card.querySelector('.proj-highlights');
  if (ul) ul.innerHTML = d.highlights.map(h => `<li>${h}</li>`).join('');
  const linksEl = card.querySelector('.proj-links');
  if (linksEl) linksEl.innerHTML = d.links.map(l =>
    `<a href="${l.href}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost" style="font-size:12px;height:30px">${l.label}<svg class="i arrow" viewBox="0 0 24 24" width="12" height="12"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg></a>`
  ).join('');

  // Build back face for grid flip
  const back = card.querySelector('.proj-back');
  if (back) {
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

  // Flip on click — grid view only
  card.addEventListener('click', e => {
    if (e.target.closest('a') || e.target.closest('.proj-flip-close')) return;
    if (card.closest('.projects.list')) return;
    card.classList.toggle('flipped');
  });
});

/* ----- Section dots TOC ----- */
const sectionDotsEl = document.getElementById('sectionDots');
window.addEventListener('scroll', () => {
  sectionDotsEl.classList.toggle('visible', window.scrollY > 120);
}, { passive: true });
const dotIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const dot = sectionDotsEl.querySelector(`.section-dot-item[data-section="${e.target.id}"]`);
    if (dot) dot.classList.toggle('active', e.isIntersecting);
  });
}, { rootMargin: '-35% 0px -55% 0px' });
navSections.forEach(s => dotIO.observe(s));

/* ----- Staggered reveals ----- */
const staggerIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const children = Array.from(e.target.children);
    children.forEach((child, i) => {
      setTimeout(() => {
        child.style.transition = 'opacity 500ms ease, transform 500ms cubic-bezier(.2,.7,.2,1)';
        child.style.opacity = '1';
        child.style.transform = 'none';
        setTimeout(() => {
          child.style.opacity = '';
          child.style.transform = '';
          child.style.transition = '';
        }, 520);
      }, i * 60);
    });
    e.target.classList.add('revealed');
    staggerIO.unobserve(e.target);
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-stagger]').forEach(container => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    container.classList.add('revealed');
    return;
  }
  Array.from(container.children).forEach(child => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(14px)';
  });
  staggerIO.observe(container);
});

/* ----- Ambient cursor spotlight ----- */
if (window.matchMedia('(hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.addEventListener('mousemove', e => {
    document.body.style.setProperty('--cursor-x', e.clientX + 'px');
    document.body.style.setProperty('--cursor-y', e.clientY + 'px');
  }, { passive: true });
}

/* ----- Skills proficiency dots ----- */
document.querySelectorAll('.skills-grid .tag[data-level]').forEach(tag => {
  const level = parseInt(tag.dataset.level, 10);
  const dots = document.createElement('span');
  dots.className = 'skill-dots';
  dots.innerHTML = Array.from({ length: 5 }, (_, i) =>
    `<span class="skill-dot${i < level ? ' filled' : ''}" style="--dot-delay:${i * 50}ms"></span>`
  ).join('');
  tag.appendChild(dots);
});

/* ----- Keyboard shortcuts help modal ----- */
const helpModal = document.getElementById('helpModal');
function openHelp() { helpModal.classList.add('open'); }
function closeHelp() { helpModal.classList.remove('open'); }
helpModal.addEventListener('click', e => { if (e.target === helpModal) closeHelp(); });

/* ----- Magnetic buttons ----- */
if (!reducedMotion) {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ----- Click ripple ----- */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', e => {
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  });
});

/* ----- Section copy-link buttons ----- */
document.querySelectorAll('section[id] .section-head .eyebrow').forEach(eyebrow => {
  const sectionId = eyebrow.closest('section[id]').id;
  const btn = document.createElement('button');
  btn.className = 'section-link-btn';
  btn.title = 'Copy link to section';
  btn.setAttribute('aria-label', 'Copy link to section');
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
  btn.addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}#${sectionId}`;
    try { await navigator.clipboard.writeText(url); showToast('Link copied'); } catch {}
  });
  eyebrow.appendChild(btn);
});

/* ----- Terminal easter egg ----- */
const terminalBackdrop = document.getElementById('terminalBackdrop');
const terminalBody = document.getElementById('terminalBody');
const terminalInput = document.getElementById('terminalInput');
const terminalCommands = {
  help: () => [
    { cls: 't-dim', text: 'Available commands:' },
    { cls: 't-cmd', text: 'whoami    skills    contact    clear    help' },
  ],
  whoami: () => [
    { cls: '', text: 'Pranav Pankhawala' },
    { cls: 't-dim', text: 'AI Automation & Cybersecurity Engineer' },
    { cls: 't-dim', text: 'Pune, India · C4i4 Lab' },
  ],
  skills: () => [
    { cls: 't-dim', text: 'Top skills:' },
    { cls: 't-cmd', text: 'Python · PyTorch · YOLO · OpenCV · OWASP · Kali Linux' },
    { cls: 't-dim', text: 'Edge: Jetson Nano · Jetson AGX Xavier · Raspberry Pi' },
  ],
  contact: () => [
    { cls: '', text: 'Email    pranav.pankhawala@gmail.com' },
    { cls: '', text: 'GitHub   github.com/pranavpankhawala' },
    { cls: '', text: 'LinkedIn linkedin.com/in/pranavpankhawala' },
  ],
  clear: () => { terminalBody.innerHTML = ''; return []; },
};
function termPrint(lines) {
  lines.forEach(({ cls, text }) => {
    const d = document.createElement('div');
    d.className = 't-line' + (cls ? ' ' + cls : '');
    d.textContent = text;
    terminalBody.appendChild(d);
  });
  terminalBody.scrollTop = terminalBody.scrollHeight;
}
function openTerminal() {
  terminalBackdrop.classList.add('open');
  if (!terminalBody.children.length) {
    termPrint([{ cls: 't-dim', text: 'Type help for available commands. Press Esc to close.' }]);
  }
  terminalInput.focus();
}
function closeTerminal() { terminalBackdrop.classList.remove('open'); }
document.getElementById('terminalClose').addEventListener('click', closeTerminal);
terminalBackdrop.addEventListener('click', e => { if (e.target === terminalBackdrop) closeTerminal(); });
terminalInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const cmd = terminalInput.value.trim().toLowerCase();
  terminalInput.value = '';
  if (cmd) termPrint([{ cls: 't-ps', text: `% ${cmd}` }]);
  if (!cmd) return;
  const fn = terminalCommands[cmd];
  if (fn) { const out = fn(); if (out.length) termPrint(out); }
  else termPrint([{ cls: 't-err', text: `command not found: ${cmd}` }]);
});

/* ----- GitHub live repo count ----- */
fetch('https://api.github.com/users/pranavpankhawala')
  .then(r => r.json())
  .then(d => {
    const el = document.getElementById('ghCount');
    if (el && d.public_repos != null) el.textContent = d.public_repos;
  })
  .catch(() => {});

/* ----- GitHub top languages ----- */
const LANG_COLORS = {
  Python: '#3572A5', JavaScript: '#f1e05a', HTML: '#e34c26',
  CSS: '#563d7c', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600',
  Shell: '#89e051', TypeScript: '#3178c6', 'Jupyter Notebook': '#DA5B0B',
};
fetch('https://api.github.com/users/pranavpankhawala/repos?per_page=100')
  .then(r => r.json())
  .then(repos => {
    if (!Array.isArray(repos)) return;
    const counts = {};
    repos.forEach(repo => { if (repo.language) counts[repo.language] = (counts[repo.language] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const wrap = document.getElementById('ghStatsWrap');
    if (!wrap || !top.length) return;
    const pills = top.map(([lang]) => {
      const color = LANG_COLORS[lang] || 'var(--ink-3)';
      return `<span class="gh-lang-pill"><span class="gh-lang-dot" style="background:${color}"></span>${lang}</span>`;
    }).join('');
    wrap.innerHTML = `<div class="gh-stats-title">Top languages</div><div class="gh-lang-pills">${pills}</div><a href="https://github.com/pranavpankhawala" target="_blank" rel="noopener noreferrer" class="gh-view-btn">View GitHub ↗</a>`;
  })
  .catch(() => {});

/* ----- GitHub activity heatmap ----- */
fetch('https://api.github.com/users/pranavpankhawala/events/public')
  .then(r => r.json())
  .then(events => {
    const wrap = document.getElementById('contribWrap');
    if (!wrap || !Array.isArray(events)) return;
    const today = new Date();
    const dayCounts = {};
    events.forEach(ev => {
      const d = ev.created_at?.slice(0, 10);
      if (d) dayCounts[d] = (dayCounts[d] || 0) + 1;
    });
    const cells = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const n = dayCounts[key] || 0;
      const lvl = n === 0 ? '' : n === 1 ? 'l1' : n <= 3 ? 'l2' : n <= 6 ? 'l3' : 'l4';
      cells.push(`<span class="contrib-day ${lvl.trim()}" title="${key}: ${n} events"></span>`);
    }
    wrap.innerHTML = '<div class="contrib-title">12-week activity</div><div class="contrib-grid">' + cells.join('') + '</div>';
  })
  .catch(() => {});

/* ----- Open to Work Banner dismiss ----- */
(function() {
  const banner = document.getElementById('otwBanner');
  const closeBtn = document.getElementById('otwClose');
  if (!banner || !closeBtn) return;
  if (localStorage.getItem('pp-otw-dismissed') === '1') {
    banner.classList.add('dismissed');
  }
  closeBtn.addEventListener('click', () => {
    banner.classList.add('dismissed');
    localStorage.setItem('pp-otw-dismissed', '1');
  });
})();

/* ----- Video Demo Modal ----- */
(function() {
  const backdrop = document.getElementById('demoBackdrop');
  const closeBtn = document.getElementById('demoModalClose');
  const titleEl = document.getElementById('demoModalTitle');
  if (!backdrop) return;
  document.querySelectorAll('.demo-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (titleEl) titleEl.textContent = btn.dataset.title || 'Project Demo';
      backdrop.classList.add('open');
    });
  });
  if (closeBtn) closeBtn.addEventListener('click', () => backdrop.classList.remove('open'));
  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') backdrop.classList.remove('open'); });
})();

/* ----- Skill tag tooltips ----- */
const skillTip = document.createElement('div');
skillTip.className = 'skill-tip';
document.body.appendChild(skillTip);
let tipTimer;
document.querySelectorAll('.tag[data-tooltip]').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => {
      skillTip.textContent = tag.dataset.tooltip;
      skillTip.classList.add('visible');
    }, 120);
  });
  tag.addEventListener('mousemove', e => {
    skillTip.style.left = e.clientX + 14 + 'px';
    skillTip.style.top = e.clientY - 42 + 'px';
  });
  tag.addEventListener('mouseleave', () => {
    clearTimeout(tipTimer);
    skillTip.classList.remove('visible');
  });
});

/* ----- Service Worker registration ----- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
