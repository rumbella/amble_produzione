// __CACHE_VERSION__ is auto-replaced at build time (see scripts/bump-sw-version.mjs)
// with a fresh build identifier, so every deploy automatically invalidates old caches.
const CACHE_NAME = "radio-amble-network-first-__CACHE_VERSION__";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests with http/https scheme.
  if (event.request.method !== "GET") {
    return;
  }

  try {
    const url = new URL(event.request.url);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return;
    }
  } catch (err) {
    return;
  }

  // Network-first: try network first, then cache, and fallback to 504 Response if unavailable
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const responseToCache = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => {
              try {
                cache.put(event.request, responseToCache).catch(() => {});
              } catch (e) {
                // Ignore caching errors for uncacheable requests/schemes
              }
            })
            .catch(() => {});
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === "navigate") {
            return caches.match("/").then((navigationFallback) => {
              if (navigationFallback) {
                return navigationFallback;
              }
              return new Response("", { status: 504, statusText: "Offline" });
            });
          }
          return new Response("", { status: 504, statusText: "Offline" });
        });
      })
  );
});
