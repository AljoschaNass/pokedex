const CACHE_VERSION = "v1";
const STATIC_CACHE = `pokedex-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `pokedex-runtime-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./styles/theme.css",
  "./styles/standard.css",
  "./styles/overlay.css",
  "./styles/color.css",
  "./scripts/state.js",
  "./scripts/storage.js",
  "./scripts/api.js",
  "./scripts/templates.js",
  "./scripts/render.js",
  "./scripts/events.js",
  "./scripts/main.js",
  "./assets/img/pokeball.png",
  "./assets/img/lens.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(req));
    return;
  }

  if (
    url.hostname === "pokeapi.co" ||
    url.hostname === "raw.githubusercontent.com"
  ) {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    return cached || Response.error();
  }
}

async function networkFirst(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const cached = await cache.match(req);
    if (cached) return cached;
    throw err;
  }
}
