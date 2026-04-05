// AlecRae Voice — Service Worker
// Provides offline support for attorneys in courtrooms and low-connectivity areas

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `alecrae-static-${CACHE_VERSION}`;
const API_CACHE = `alecrae-api-${CACHE_VERSION}`;
const ALL_CACHES = [STATIC_CACHE, API_CACHE];

// Critical assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/app',
  '/manifest.json',
];

// API routes that use SSE/streaming — NEVER cache these
const STREAMING_ROUTES = [
  '/api/enhance',
  '/api/transcribe-stream',
  '/api/transcribe-batch',
];

// API routes that should use network-first caching
const CACHEABLE_API_ROUTES = [
  '/api/settings',
  '/api/vocabulary',
  '/api/dictations',
];

// Static asset extensions — cache-first
const STATIC_EXTENSIONS = [
  '.js', '.css', '.woff', '.woff2', '.ttf', '.otf',
  '.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp',
];

// ——— Install: pre-cache critical assets ———
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// ——— Activate: clean up old caches ———
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !ALL_CACHES.includes(name))
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ——— Fetch: route requests to appropriate strategy ———
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip non-GET requests (POST for transcribe/auth, etc.)
  if (request.method !== 'GET') return;

  // Never intercept streaming API routes
  if (STREAMING_ROUTES.some((route) => url.pathname.startsWith(route))) return;

  // Cacheable API routes — network-first
  if (CACHEABLE_API_ROUTES.some((route) => url.pathname.startsWith(route))) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Any other /api/ route — skip caching entirely
  if (url.pathname.startsWith('/api/')) return;

  // Static assets (by extension) — cache-first
  if (STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext))) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Navigation requests (HTML pages) — network-first so fresh deploys land immediately
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

  // Next.js data requests and other assets — cache-first
  event.respondWith(cacheFirst(request, STATIC_CACHE));
});

// ——— Strategies ———

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return offlineResponse();
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return offlineResponse();
  }
}

function offlineResponse() {
  return new Response(
    '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AlecRae Voice — Offline</title><style>*{margin:0;padding:0;box-sizing:border-box}body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#111920;color:#e2e0dc;font-family:Georgia,serif;padding:2rem}div{text-align:center;max-width:400px}h1{font-size:1.5rem;margin-bottom:1rem;color:#c9a84c}p{font-size:1rem;line-height:1.6;opacity:0.8}button{margin-top:1.5rem;padding:0.75rem 2rem;background:#c9a84c;color:#111920;border:none;border-radius:8px;font-size:1rem;cursor:pointer;font-family:Georgia,serif}</style></head><body><div><h1>You\'re Offline</h1><p>AlecRae Voice requires a network connection for transcription and AI enhancement. Your previous dictations are saved locally.</p><button onclick="location.reload()">Try Again</button></div></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html' } }
  );
}

// ——— Offline status messaging to clients ———
self.addEventListener('message', (event) => {
  if (event.data === 'CHECK_ONLINE') {
    fetch('/manifest.json', { method: 'HEAD', cache: 'no-store' })
      .then(() => postToAllClients({ type: 'ONLINE_STATUS', online: true }))
      .catch(() => postToAllClients({ type: 'ONLINE_STATUS', online: false }));
  }
});

async function postToAllClients(message) {
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach((client) => client.postMessage(message));
}
