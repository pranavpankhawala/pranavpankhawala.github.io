/* ----- Theme ----- */
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('pp-theme', t);
  themeIcon.innerHTML = t === 'dark'
    ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
    : '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
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
  if (p && p !== 'forest') document.documentElement.setAttribute('data-palette', p);
  else document.documentElement.removeAttribute('data-palette');
  localStorage.setItem('pp-palette', p || 'forest');
  palOpts.forEach(o => o.classList.toggle('active', o.dataset.pal === (p || 'forest')));
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

/* ----- Nav scroll state + scroll progress + back to top ----- */
const nav = document.getElementById('nav');
const scrollProg = document.getElementById('scroll-progress');
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 4);
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  scrollProg.style.width = pct + '%';
  backToTop.classList.toggle('visible', window.scrollY > 300);
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

/* ----- Hero role cycle ----- */
const heroRoles = ['AI Automation Engineer', 'Computer Vision Developer', 'Edge ML Engineer', 'Cybersecurity Researcher'];
let heroRoleIdx = 0;
const heroRoleEl = document.getElementById('heroRole');
setInterval(() => {
  heroRoleEl.classList.add('fade');
  setTimeout(() => {
    heroRoleIdx = (heroRoleIdx + 1) % heroRoles.length;
    heroRoleEl.textContent = heroRoles[heroRoleIdx];
    heroRoleEl.classList.remove('fade');
  }, 280);
}, 2800);

/* ----- Animated counters ----- */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function animateCount(el, target, duration) {
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOutCubic(p) * target);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const countEls = document.querySelectorAll('[data-count]');
if (countEls.length) {
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target, +e.target.dataset.count, 1000);
        countIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  countEls.forEach(el => countIO.observe(el));
}

/* ----- Card tilt ----- */
const projGrid = document.getElementById('projectsGrid');
document.querySelectorAll('.proj').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (projGrid.classList.contains('list')) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

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
  else if (e.key === 'Escape') { closeCmdk(); navLinks.classList.remove('open'); }
  else if (e.key === 'Enter' && cmdk.classList.contains('open')) {
    const active = cmdkList.querySelector('.cmdk-item.active') || cmdkList.querySelector('.cmdk-item');
    if (active) active.click();
  }
});
