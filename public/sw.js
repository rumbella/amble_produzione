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
  // Only GET requests
  if (event.request.method !== "GET") return;

  // Only http/https schemes (blocks chrome-extension:// and similar)
  const url = new URL(event.request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Skip APIs / streaming / third-party / heavy CDN media
  const href = event.request.url;
  if (
    href.includes("/api/") ||
    href.includes("firestore") ||
    href.includes("google") ||
    href.includes("cdn")
  ) {
    return;
  }

  // Network-first, with a valid Response guaranteed in every branch
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            try {
              cache.put(event.request, responseToCache);
            } catch (e) {
              // ignore uncacheable requests
            }
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === "navigate") {
            return caches.match("/").then((shell) => {
              return shell || new Response("", { status: 504, statusText: "Offline" });
            });
          }
          return new Response("", { status: 504, statusText: "Offline" });
        });
      })
  );
});
