// Bump CACHE whenever any ASSETS entry's content or ?v= query changes —
// this is a cache-first strategy, so a stale CACHE name means returning
// visitors keep the old file forever until this constant changes.
const CACHE = 'pp-v4';
const ASSETS = [
  '/', '/index.html', '/index.css?v=22',
  '/index.js?v=1', '/theme.js?v=1', '/projects.json',
  '/favicon.svg', '/apple-touch-icon.png', '/og-image.svg', '/PranavPankhawala-Resume.pdf', '/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
      .catch(() => caches.match('/index.html'))
  );
});
