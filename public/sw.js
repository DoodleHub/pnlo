// Pnlok service worker. Bump VERSION to drop old caches.
// Only content-hashed build assets and the static offline/launch pages are cached; pages and
// server actions always go to the network so P&L data is never served stale.
const VERSION = "v3";
const CACHE = `pnlok-${VERSION}`;
const OFFLINE_URL = "/offline.html";
const LAUNCH_URL = "/launch.html";
const PRECACHE = [OFFLINE_URL, LAUNCH_URL, "/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    // The launch page is static (no data), so serve it from cache to paint instantly.
    if (url.pathname === LAUNCH_URL) {
      event.respondWith(caches.match(LAUNCH_URL).then((cached) => cached || fetch(request)));
      return;
    }
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      ),
    );
  }
});
