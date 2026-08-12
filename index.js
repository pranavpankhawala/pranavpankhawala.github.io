(function () {
'use strict';

/* ----- Global flags ----- */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ----- Contact info (single source for JS-side references; static mailto:/tel: links in the HTML stay as-is) ----- */
const CONTACT = {
  email: 'pranav.pankhawala@gmail.com',
  phone: '+918408069188',
  github: 'https://github.com/pranavpankhawala',
  githubHandle: 'github.com/pranavpankhawala',
  linkedin: 'https://www.linkedin.com/in/pranavpankhawala',
  linkedinHandle: 'linkedin.com/in/pranavpankhawala',
};

/* ----- HTML escaping for any dynamic string interpolated into innerHTML ----- */
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

/* ----- Shared modal focus trap (Tab stays inside, focus restores on close) ----- */
function makeFocusTrap(container) {
  const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let lastFocus = null;
  container.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = [...container.querySelectorAll(FOCUSABLE)];
    if (!focusable.length) { e.preventDefault(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  return {
    activate(focusTarget) {
      lastFocus = document.activeElement;
      (focusTarget || container.querySelector(FOCUSABLE))?.focus();
    },
    deactivate() {
      lastFocus?.focus();
      // lastFocus may be unfocusable (e.g. <body> when nothing had focus
      // before opening) — focus() on it is a silent no-op, which would
      // otherwise leave focus stuck inside the now-hidden dialog.
      if (container.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    },
  };
}

/* ----- Theme (bootstrap + toggle live in theme.js, shared with 404.html) ----- */
const themeBtn = document.getElementById('themeBtn');

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

/* ----- Nav scroll state, scroll progress, back-to-top, parallax, section-dots visibility -----
   Single rAF-throttled scroll listener — avoids stacking several synchronous
   style-writing scroll handlers on top of each other. */
const nav = document.getElementById('nav');
const scrollProg = document.getElementById('scroll-progress');
const ringFill = document.getElementById('ringFill');
const heroH1 = document.querySelector('.hero-main h1');
const backToTop = document.getElementById('backToTop');
const sectionDotsEl = document.getElementById('sectionDots');
let scrollTicking = false;
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 4);
  const pct = y / (document.body.scrollHeight - window.innerHeight) * 100;
  scrollProg.style.width = pct + '%';
  backToTop.classList.toggle('visible', y > 400);
  if (ringFill) ringFill.style.strokeDashoffset = String(106.8 * (1 - pct / 100));
  if (heroH1 && !reducedMotion) heroH1.style.transform = `translateY(${y * 0.28}px)`;
  sectionDotsEl.classList.toggle('visible', y > 120);
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(onScroll);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ----- Mobile menu ----- */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

/* ----- Nav "More" overflow menu ----- */
const navMoreBtn = document.getElementById('navMoreBtn');
const navMorePanel = document.getElementById('navMorePanel');
function closeNavMore() {
  navMorePanel.classList.remove('open');
  navMoreBtn.setAttribute('aria-expanded', 'false');
}
navMoreBtn.addEventListener('click', e => {
  e.stopPropagation();
  const open = navMorePanel.classList.toggle('open');
  navMoreBtn.setAttribute('aria-expanded', String(open));
});
navMorePanel.addEventListener('click', e => { if (e.target.tagName === 'A') closeNavMore(); });
document.addEventListener('click', e => {
  if (!navMorePanel.contains(e.target) && !navMoreBtn.contains(e.target)) closeNavMore();
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
const projEmpty = document.getElementById('projEmpty');
filterBtns.forEach(b => b.addEventListener('click', () => {
  filterBtns.forEach(x => { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
  b.classList.add('active'); b.setAttribute('aria-selected', 'true');
  const f = b.dataset.filter;
  let visible = 0;
  projs.forEach(p => {
    const show = f === 'all' || p.dataset.cat.split(' ').includes(f);
    p.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  if (projEmpty) projEmpty.hidden = visible > 0;
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
  try { await navigator.clipboard.writeText(CONTACT.email); showToast('Email copied'); } catch {}
});

/* ----- Command palette ----- */
const cmdk = document.getElementById('cmdk');
const cmdkInput = document.getElementById('cmdkInput');
const cmdkList = document.getElementById('cmdkList');
const cmdkTrap = makeFocusTrap(cmdk);
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
  { ic: '@', label: 'Email Pranav', action: () => location.href = 'mailto:' + CONTACT.email, hint: 'mail' },
  { ic: '☎', label: 'Call Pranav', action: () => location.href = 'tel:' + CONTACT.phone, hint: 'tel' },
  { ic: '↗', label: 'Open GitHub', action: () => window.open(CONTACT.github,'_blank'), hint: 'ext' },
  { ic: '↗', label: 'Open LinkedIn', action: () => window.open(CONTACT.linkedin,'_blank'), hint: 'ext' },
  { ic: '↓', label: 'Download Resume', action: () => { const a = document.createElement('a'); a.href = 'PranavPankhawala-Resume.pdf'; a.download = ''; a.click(); }, hint: 'pdf' },
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
function openCmdk() { cmdk.classList.add('open'); renderCmdk(); cmdkInput.value=''; cmdkTrap.activate(cmdkInput); }
function closeCmdk() { cmdk.classList.remove('open'); cmdkTrap.deactivate(); }
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
  else if (e.key === 'Escape') {
    closeCmdk(); closeHelp(); closeTerminal(); closeNavMore();
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.querySelectorAll('.proj.flipped').forEach(c => c.classList.remove('flipped'));
  }
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

/* ----- Project cards: highlights (list view) + flip (grid view) -----
   Core identity (title, tags, label, badge, link) lives once in index.html —
   the source of truth for SEO/no-JS. projects.json supplies only the extra
   copy (plain-English blurb, meta line, code peek, highlights) that isn't
   in the markup, so nothing is duplicated between the two. All dynamic
   strings go through escapeHTML before hitting innerHTML. */
fetch('projects.json')
  .then(r => r.json())
  .catch(() => ({}))
  .then(projectDetails => {
    document.querySelectorAll('.proj[data-project-id]').forEach(card => {
      const d = projectDetails[card.dataset.projectId] || {};

      const projArt = card.querySelector('.proj-art');
      const label = projArt?.querySelector('.label')?.textContent || '';
      const badge = projArt?.querySelector('.badge')?.textContent || '';
      const projBody = card.querySelector('.proj-body');
      const h3 = projBody?.querySelector('h3');
      const title = h3?.textContent || '';
      const tags = [...(projBody?.querySelectorAll('.tagrow .tag') || [])].map(t => t.textContent);
      const primaryLink = card.querySelector('.proj-meta .links a');
      const links = primaryLink
        ? [{ label: primaryLink.getAttribute('aria-label') || 'Link', href: primaryLink.getAttribute('href') }]
        : [];

      // Inject plain-English description and meta row into front face
      if (h3 && (d.meta || d.plainEng)) {
        if (d.meta) {
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
          else h3.after(plainEl);
        }
      }
      // Code peek
      if (d.codePeek && projBody) {
        const btn = document.createElement('button');
        btn.className = 'code-peek-btn';
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> code peek';
        const block = document.createElement('div');
        block.className = 'code-peek-block';
        block.innerHTML = `<pre class="code-block">${escapeHTML(d.codePeek)}</pre>`;
        btn.addEventListener('click', e => { e.stopPropagation(); block.classList.toggle('open'); });
        projBody.appendChild(btn);
        projBody.appendChild(block);
      }

      const highlights = d.highlights || [];

      // Populate list-view inline content (CSS hides these in grid)
      const ul = card.querySelector('.proj-highlights');
      if (ul) ul.innerHTML = highlights.map(h => `<li>${escapeHTML(h)}</li>`).join('');
      const linksEl = card.querySelector('.proj-links');
      if (linksEl) linksEl.innerHTML = links.map(l =>
        `<a href="${escapeHTML(l.href)}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost" style="font-size:12px;height:30px">${escapeHTML(l.label)}<svg class="i arrow" viewBox="0 0 24 24" width="12" height="12"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg></a>`
      ).join('');

      // Build back face for grid flip
      const back = card.querySelector('.proj-back');
      if (back) {
        back.innerHTML = `
          <button class="icon-btn proj-flip-close" aria-label="Flip back">
            <svg class="i" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div class="proj-back-label">${escapeHTML(label)}${badge ? ' · ' + escapeHTML(badge) : ''}</div>
          <h3 class="proj-back-title">${escapeHTML(title)}</h3>
          <div>
            <div class="proj-back-section-label">Highlights</div>
            <ul class="proj-back-highlights">${highlights.map(h => `<li>${escapeHTML(h)}</li>`).join('')}</ul>
          </div>
          <div class="tagrow">${tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}</div>
          <div class="proj-back-links">${links.map(l =>
            `<a href="${escapeHTML(l.href)}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost" style="font-size:12px">${escapeHTML(l.label)}<svg class="i arrow" viewBox="0 0 24 24" width="12" height="12"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg></a>`
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
  });

/* ----- Section dots TOC (visibility toggle lives in the consolidated scroll handler above) ----- */
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
  if (reducedMotion) {
    container.classList.add('revealed');
    return;
  }
  Array.from(container.children).forEach(child => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(14px)';
  });
  staggerIO.observe(container);
});

/* ----- Ambient cursor spotlight lives in theme.js (shared with 404.html) ----- */

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
const helpTrap = makeFocusTrap(helpModal);
function openHelp() { helpModal.classList.add('open'); helpTrap.activate(); }
function closeHelp() { helpModal.classList.remove('open'); helpTrap.deactivate(); }
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
const terminalTrap = makeFocusTrap(terminalBackdrop);
const terminalCommands = {
  help: () => [
    { cls: 't-dim', text: 'Available commands:' },
    { cls: 't-cmd', text: 'whoami    skills    projects    blog    contact    clear    help' },
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
    { cls: '', text: `Email    ${CONTACT.email}` },
    { cls: '', text: `GitHub   ${CONTACT.githubHandle}` },
    { cls: '', text: `LinkedIn ${CONTACT.linkedinHandle}` },
  ],
  projects: () => [
    { cls: 't-dim', text: 'Featured projects:' },
    { cls: 't-cmd', text: 'AI Surveillance · ML Network Security · Night Vision' },
    { cls: 't-dim', text: 'Type "help" or scroll to #projects for details.' },
  ],
  blog: () => [
    { cls: 't-dim', text: 'Blog posts (coming soon):' },
    { cls: 't-cmd', text: 'YOLO on Edge · VAPT Guide · Jetson Nano ML' },
    { cls: 't-dim', text: 'Follow on LinkedIn for updates.' },
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
let terminalArtShown = false;
function openTerminal() {
  terminalBackdrop.classList.add('open');
  if (!terminalBody.children.length) {
    termPrint([{ cls: 't-dim', text: 'Type help for available commands. Press Esc to close.' }]);
  }
  if (!terminalArtShown) {
    terminalArtShown = true;
    const art = [
      '  ____  ____',
      ' |  _ \\|  _ \\',
      ' | |_) | |_) |',
      ' |  __/|  __/',
      ' |_|   |_|    pranavpankhawala.github.io',
    ];
    const div = document.createElement('div');
    div.className = 't-line t-dim';
    div.style.fontFamily = '"JetBrains Mono", monospace';
    div.style.whiteSpace = 'pre';
    div.textContent = art.join('\n');
    terminalBody.insertBefore(div, terminalBody.firstChild);
  }
  terminalTrap.activate(terminalInput);
}
function closeTerminal() { terminalBackdrop.classList.remove('open'); terminalTrap.deactivate(); }
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

/* ----- GitHub stats (repo count, stars, top languages, activity heatmap) -----
   Reads a snapshot refreshed daily by .github/workflows/gh-stats.yml instead of
   calling the GitHub API live from the browser — unauthenticated client-side calls
   are capped at 60 req/hr per visitor IP and would go blank under shared-IP traffic. */
const LANG_COLORS = {
  Python: '#3572A5', JavaScript: '#f1e05a', HTML: '#e34c26',
  CSS: '#563d7c', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600',
  Shell: '#89e051', TypeScript: '#3178c6', 'Jupyter Notebook': '#DA5B0B',
};
const GH_LINK = `<a href="${CONTACT.github}" target="_blank" rel="noopener noreferrer" class="gh-view-btn">View GitHub ↗</a>`;

fetch('gh-stats.json')
  .then(r => r.json())
  .then(stats => {
    const countEl = document.getElementById('ghCount');
    if (countEl && stats.repos != null) countEl.textContent = stats.repos;
    const starsEl = document.getElementById('ghStars');
    if (starsEl && stats.stars != null) starsEl.textContent = stats.stars;

    const statsWrap = document.getElementById('ghStatsWrap');
    if (statsWrap) {
      if (stats.languages?.length) {
        const pills = stats.languages.map(({ name }) => {
          const color = LANG_COLORS[name] || 'var(--ink-3)';
          return `<span class="gh-lang-pill"><span class="gh-lang-dot" style="background:${color}"></span>${escapeHTML(name)}</span>`;
        }).join('');
        statsWrap.innerHTML = `<div class="gh-stats-title">Top languages</div><div class="gh-lang-pills">${pills}</div>${GH_LINK}`;
      } else {
        statsWrap.innerHTML = `<div class="gh-stats-title">Languages unavailable</div>${GH_LINK}`;
      }
    }

    const contribWrap = document.getElementById('contribWrap');
    if (contribWrap) {
      if (stats.activity?.length) {
        const cells = stats.activity.map(({ date, count: n }) => {
          const lvl = n === 0 ? '' : n === 1 ? 'l1' : n <= 3 ? 'l2' : n <= 6 ? 'l3' : 'l4';
          return `<span class="contrib-day ${lvl}" title="${escapeHTML(date)}: ${n} events"></span>`;
        }).join('');
        contribWrap.innerHTML = '<div class="contrib-title">12-week activity</div><div class="contrib-grid">' + cells + '</div>';
      } else {
        contribWrap.innerHTML = '<div class="contrib-title">Activity unavailable</div>';
      }
    }
  })
  .catch(() => {
    const statsWrap = document.getElementById('ghStatsWrap');
    if (statsWrap) statsWrap.innerHTML = `<div class="gh-stats-title">Languages unavailable</div>${GH_LINK}`;
    const contribWrap = document.getElementById('contribWrap');
    if (contribWrap) contribWrap.innerHTML = '<div class="contrib-title">Activity unavailable</div>';
  });

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

/* ----- Blog coming-soon toast ----- */
document.querySelectorAll('[data-coming-soon]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    showToast('Blog posts coming soon — follow on LinkedIn for updates.');
  });
});

/* ----- Video Demo Modal with focus trap ----- */
(function() {
  const backdrop = document.getElementById('demoBackdrop');
  const closeBtn = document.getElementById('demoModalClose');
  const titleEl = document.getElementById('demoModalTitle');
  if (!backdrop) return;
  const trap = makeFocusTrap(backdrop);

  function openDemo(title) {
    if (titleEl) titleEl.textContent = title || 'Project Demo';
    backdrop.classList.add('open');
    trap.activate();
  }
  function closeDemo() {
    backdrop.classList.remove('open');
    trap.deactivate();
  }

  document.querySelectorAll('.demo-trigger').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openDemo(btn.dataset.title); });
  });
  if (closeBtn) closeBtn.addEventListener('click', closeDemo);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeDemo(); });
  backdrop.addEventListener('keydown', e => { if (e.key === 'Escape') closeDemo(); });
})();

/* ----- Skill tag + cert card tooltips ----- */
const skillTip = document.createElement('div');
skillTip.className = 'skill-tip';
document.body.appendChild(skillTip);
let tipTimer;
function attachTooltip(el) {
  el.addEventListener('mouseenter', () => {
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => {
      skillTip.textContent = el.dataset.tooltip;
      skillTip.classList.add('visible');
    }, 120);
  });
  el.addEventListener('mousemove', e => {
    skillTip.style.left = e.clientX + 14 + 'px';
    skillTip.style.top = e.clientY - 42 + 'px';
  });
  el.addEventListener('mouseleave', () => {
    clearTimeout(tipTimer);
    skillTip.classList.remove('visible');
  });
}
document.querySelectorAll('.tag[data-tooltip], .cert-card[data-tooltip]').forEach(attachTooltip);

/* ----- Footer shortcut hint ----- */
const footHint = document.getElementById('footShortcutHint');
if (footHint) footHint.addEventListener('click', () => { if (typeof openHelp === 'function') openHelp(); });

/* ----- Konami code easter egg ----- */
(function() {
  const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  document.addEventListener('keydown', e => {
    if (e.key === SEQ[idx]) {
      idx++;
      if (idx === SEQ.length) {
        idx = 0;
        showToast('↑↑↓↓←→←→BA — cheat code activated 🎮');
        document.body.classList.add('konami');
        setTimeout(() => document.body.classList.remove('konami'), 3000);
      }
    } else { idx = 0; }
  });
})();

/* ----- Service Worker registration ----- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

})();
