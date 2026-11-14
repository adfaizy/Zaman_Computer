/* ============================================================
   ZAMAN COMPUTER — Service Worker
   Offline support, static asset caching, runtime image caching
   and automatic version management.
   ------------------------------------------------------------
   HOW TO UPDATE: bump CACHE_VERSION whenever you change any
   static file. Old caches are removed automatically on activate.
   ============================================================ */

const CACHE_VERSION = 'zaman-v1.15.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

/* Core files that make the app shell work offline */
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/* Hosts that are safe to cache on the fly (images / fonts) */
const CACHEABLE_HOSTS = [
  'images.unsplash.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

/* ---------- Install: pre-cache the app shell ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ---------- Activate: drop outdated caches ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

/* ---------- Fetch: smart strategy per resource ---------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1) Page navigations: network-first, fall back to cached shell (offline support)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html') || caches.match('./'))
    );
    return;
  }

  // 2) Static assets (same origin): stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request).then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // 3) Trusted third-party assets (Unsplash images, Google Fonts): cache-first with revalidate
  if (CACHEABLE_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request).then((response) => {
          if (response && (response.ok || response.type === 'opaque')) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Everything else: network, falling back to cache if available
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
