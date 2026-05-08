// ─── EMS NC II Reviewer Service Worker ─────────────────────────────
// Provides offline capability and caching for the PWA

const CACHE_NAME = 'ems-ncii-v2.0';
const STATIC_CACHE = 'ems-ncii-static-v2.0';
const DYNAMIC_CACHE = 'ems-ncii-dynamic-v2.0';

// Static assets to pre-cache on install (app shell)
const APP_SHELL = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/logo.png',
  '/logo.svg',
];

// File extensions that should be cached with cache-first strategy
const STATIC_EXTENSIONS = [
  '.js', '.css', '.woff', '.woff2', '.ttf', '.otf',
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
  '.json', '.xml', '.txt', '.html',
];

// Routes that should use network-first strategy
const NETWORK_FIRST_ROUTES = [
  '/api/',
];

// ─── Install Event ─────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v2.0...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching app shell');
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('[SW] Some app shell resources failed to cache:', err);
        // Still continue - we'll cache them on demand
      });
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// ─── Activate Event ────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v2.0...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// ─── Helper: Check if URL is a static asset ────────────────────────
function isStaticAsset(url) {
  const pathname = new URL(url).pathname;
  return STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext));
}

// ─── Helper: Check if URL is an API route ──────────────────────────
function isApiRoute(url) {
  const pathname = new URL(url).pathname;
  return NETWORK_FIRST_ROUTES.some((route) => pathname.startsWith(route));
}

// ─── Helper: Check if same-origin ──────────────────────────────────
function isSameOrigin(url) {
  return new URL(url).origin === self.location.origin;
}

// ─── Cache-First Strategy ──────────────────────────────────────────
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // If offline and not cached, try offline.html for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) return offlinePage;
    }
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// ─── Network-First Strategy ────────────────────────────────────────
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response(JSON.stringify({ error: 'Offline', message: 'No cached data available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ─── Stale-While-Revalidate Strategy ───────────────────────────────
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, return cached if available
    return cachedResponse;
  });

  return cachedResponse || fetchPromise;
}

// ─── Fetch Event ───────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (except for fonts/CDN resources)
  if (!isSameOrigin(request.url)) {
    // For external resources like fonts, use stale-while-revalidate
    if (request.url.includes('fonts.googleapis.com') || request.url.includes('fonts.gstatic.com')) {
      event.respondWith(staleWhileRevalidate(request));
      return;
    }
    // For other cross-origin requests, just let them through
    return;
  }

  // Navigation requests (HTML pages) - Network first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the page
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(async () => {
          // Try cache first
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fall back to cached root page (SPA - all routes handled by /)
          const rootCached = await caches.match('/');
          if (rootCached) {
            return rootCached;
          }
          // Last resort: offline page
          const offlinePage = await caches.match('/offline.html');
          if (offlinePage) {
            return offlinePage;
          }
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        })
    );
    return;
  }

  // API routes - Network first
  if (isApiRoute(request.url)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets - Cache first
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Everything else - Stale while revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// ─── Handle messages from the app ──────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    if (Array.isArray(urls)) {
      caches.open(DYNAMIC_CACHE).then((cache) => {
        cache.addAll(urls).catch((err) => {
          console.warn('[SW] Failed to cache some URLs:', err);
        });
      });
    }
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
});
