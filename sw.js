// ==========================================================================
// KanTime PWA Service Worker (v2.5.8 — Network-First HTML + Auto-Update)
// ==========================================================================

const APP_VERSION = "2.5.8";
const CACHE_NAME = `kantime-cache-v${APP_VERSION}`;

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./script.js",
  "./manifest.json",
  "./lame.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",
  // Images & Avatars
  "./images/favicon.ico",
  "./images/kantime-logo.png",
  "./images/icon-192.png",
  "./images/icon-512.png",
  "./images/icon-maskable-192.png",
  "./images/icon-maskable-512.png",
  "./images/kantime-bg.png",
  "./images/iloilo-stake-choir-logo.jpg",
  "./images/boy-choir.jpg",
  "./images/girl-choir.jpg",
  "./images/ym-choir.jpg",
  "./images/yw-choir.jpg",
  "./images/eq-choir.jpg",
  "./images/rs-choir.jpg",
  "./images/elder-choir.jpg",
  "./images/sister-choir.jpg",
  // Local Repertoire Resources
  "./kantime-resources/kantime-thumbnail.png",
  "./kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day.mp3",
  "./kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day%20(piano).mp3",
  "./kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day%20-%20SOPRANO.mp3",
  "./kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day%20-%20ALTO.mp3",
  "./kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day%20-%20TENOR.mp3",
  "./kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day%20-%20BASS.mp3",
  "./kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day.pdf"
];

// --------------------------------------------------------------------------
// INSTALL — Pre-cache all static assets & take over immediately
// --------------------------------------------------------------------------
self.addEventListener("install", (event) => {
  // Immediately activate this SW without waiting for old SW to stop
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("[SW] Failed to precache:", url, err);
          })
        )
      );
    })
  );
});

// --------------------------------------------------------------------------
// ACTIVATE — Delete all stale caches & claim all clients immediately
// --------------------------------------------------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith("kantime-") && name !== CACHE_NAME)
            .map((name) => {
              console.log("[SW] Deleting stale cache:", name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// --------------------------------------------------------------------------
// MESSAGE — Handle SKIP_WAITING request from the page
// --------------------------------------------------------------------------
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// --------------------------------------------------------------------------
// Helper: Handle HTTP Range requests for cached audio/video (Safari & Chrome)
// --------------------------------------------------------------------------
async function handleRangeRequest(request, cachedResponse) {
  const rangeHeader = request.headers.get("range");
  if (!rangeHeader) return cachedResponse;
  try {
    const arrayBuffer = await cachedResponse.arrayBuffer();
    const bytes = rangeHeader.replace(/bytes=/, "").split("-");
    const start = parseInt(bytes[0], 10) || 0;
    const end = bytes[1] ? parseInt(bytes[1], 10) : arrayBuffer.byteLength - 1;
    const slicedBuffer = arrayBuffer.slice(start, end + 1);

    const headers = new Headers(cachedResponse.headers);
    headers.set("Content-Range", `bytes ${start}-${end}/${arrayBuffer.byteLength}`);
    headers.set("Content-Length", slicedBuffer.byteLength);
    headers.set("Accept-Ranges", "bytes");

    return new Response(slicedBuffer, {
      status: 206,
      statusText: "Partial Content",
      headers: headers
    });
  } catch (e) {
    return cachedResponse;
  }
}

// --------------------------------------------------------------------------
// FETCH — Tiered caching strategy
//   • Google Apps Script API calls  → Always bypass (no caching)
//   • HTML navigation requests       → Network-First (fallback to cache)
//   • All other assets               → Cache-First (fallback to network)
// --------------------------------------------------------------------------
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // 1️⃣ Never intercept Google Apps Script / external API calls
  if (url.hostname.includes("script.google.com")) return;

  // 2️⃣ Network-First strategy for HTML navigation requests
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Only cache successful same-origin responses
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback: serve cached index.html
          return caches.match("./index.html");
        })
    );
    return;
  }

  // 3️⃣ Cache-First strategy for all other assets (CSS, JS, images, audio)
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        if (request.headers.get("range")) {
          return handleRangeRequest(request, cachedResponse.clone());
        }
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === "basic" || networkResponse.type === "cors")
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => {
          // Silent failure for non-critical offline assets
        });
    })
  );
});
