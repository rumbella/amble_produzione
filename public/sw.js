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
  // Only handle GET requests and skip APIs / streaming / third-party services.
  if (event.request.method !== "GET" || event.request.url.includes("/api/") || event.request.url.includes("firestore") || event.request.url.includes("google") || event.request.url.includes("cdn")) {
    return;
  }

  // Network-first: always try to fetch the freshest version. Only fall back
  // to the cache (or the offline shell for navigations) if the network fails.
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response && response.status === 200 && response.type === "basic") {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
      }
      return response;
    }).catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
      });
    })
  );
});
