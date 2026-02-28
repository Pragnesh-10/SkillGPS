/* SkillGPS Service Worker v1.0 */

const CACHE_NAME = 'skillgps-v1';
const STATIC_CACHE = 'skillgps-static-v1';
const DYNAMIC_CACHE = 'skillgps-dynamic-v1';

// Core assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// ─── Install ───────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing SkillGPS Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ─── Activate ──────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating SkillGPS Service Worker...');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch Strategy ────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and external API calls (AI APIs, etc.)
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  // Network-first for HTML pages (always fresh content)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Cache-first for static assets (JS, CSS, images, fonts)
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf)$/)
  ) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Network-first for everything else
  event.respondWith(networkFirstStrategy(request));
});

// ─── Cache-First Strategy ──────────────────────────────────────────────────
async function cacheFirstStrategy(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline - Asset not available', { status: 503 });
  }
}

// ─── Network-First Strategy ────────────────────────────────────────────────
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback offline page for navigation requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/') || new Response(offlinePage(), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    return new Response('Offline', { status: 503 });
  }
}

// ─── Push Notifications ────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'SkillGPS';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Dismiss' },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// ─── Notification Click ────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;

  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ─── Offline Fallback Page ─────────────────────────────────────────────────
function offlinePage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>SkillGPS - Offline</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: system-ui, sans-serif;
          background: #0f0f1a;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          padding: 2rem;
        }
        .icon { font-size: 4rem; margin-bottom: 1rem; }
        h1 { font-size: 1.8rem; margin-bottom: 0.5rem; color: #6c63ff; }
        p { color: rgba(255,255,255,0.6); margin-bottom: 2rem; line-height: 1.6; }
        button {
          background: #6c63ff;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
        }
        button:hover { background: #5a52e0; }
      </style>
    </head>
    <body>
      <div class="icon">🧭</div>
      <h1>You're Offline</h1>
      <p>SkillGPS needs an internet connection to navigate your career path.<br/>Please check your connection and try again.</p>
      <button onclick="window.location.reload()">Try Again</button>
    </body>
    </html>
  `;
}
