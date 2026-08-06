/* Shared theme/palette bootstrap + cursor spotlight — used by index.html and 404.html */
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function autoTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    const h = new Date().getHours(); return h >= 19 || h < 7 ? 'dark' : 'light';
  }

  const themeBtn = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  function setTheme(t) {
    document.documentElement.classList.add('theme-transitioning');
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('pp-theme', t);
    if (themeIcon) {
      themeIcon.innerHTML = t === 'dark'
        ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
        : '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
    }
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 300);
  }
  setTheme(localStorage.getItem('pp-theme') || autoTheme());

  const savedPalette = localStorage.getItem('pp-palette');
  if (savedPalette && savedPalette !== 'forest') document.documentElement.setAttribute('data-palette', savedPalette);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  if (window.matchMedia('(hover: hover)').matches && !reducedMotion) {
    let rafPending = false;
    document.addEventListener('mousemove', e => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        document.body.style.setProperty('--cursor-x', e.clientX + 'px');
        document.body.style.setProperty('--cursor-y', e.clientY + 'px');
        rafPending = false;
      });
    }, { passive: true });
  }
})();
