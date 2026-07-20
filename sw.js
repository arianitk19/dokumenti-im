/* Dokumenti Im — Service Worker (offline-first) */
const CACHE = 'dokumenti-im-v1';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './bio.js',
  './vault.js',
  './notify.js',
  './screens-core.js',
  './screens-docs.js',
  './screens-ai.js',
  './screens-more.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js'
];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(res => {
        if (res && res.status === 200 && (req.url.startsWith(self.location.origin) || req.url.includes('jsdelivr'))) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
