const CACHE_NAME = "radio-amble-v2";
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
  // Only cache GET requests and non-chrome-extension / external APIs if needed.
  // Real live audio stream URLs should NOT be cached or run through CACHE-FIRST strategy.
  if (event.request.method !== "GET" || event.request.url.includes("/api/") || event.request.url.includes("firestore") || event.request.url.includes("google") || event.request.url.includes("cdn")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cache dynamic assets if they are basic static files of our origin
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // Fallback for document navigation when completely offline
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
      });
    })
  );
});
