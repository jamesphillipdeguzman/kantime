// ==========================================================================
// KanTime PWA Service Worker (Cache-First Offline Strategy)
// ==========================================================================

const CACHE_NAME = "kantime-pwa-v2.5.0";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./script.js",
  "./manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",
  // Images & Avatars
  "./images/favicon.ico",
  "./images/kantime-logo.png",
  "./images/kantime-bg.jpg",
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

// Service Worker Install & Pre-caching
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("Failed to precache:", url, err);
          })
        )
      );
    })
  );
});

// Service Worker Activation & Cache Cleanup
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Helper to support HTTP Range requests for cached audio/video playback (Safari & Chrome)
async function handleRangeRequest(request, cachedResponse) {
  const rangeHeader = request.headers.get("range");
  if (!rangeHeader) {
    return cachedResponse;
  }
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

// Fetch Interception: Cache-First Strategy
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  // Do not intercept external Google Apps Script requests
  if (request.url.includes("script.google.com")) return;

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
          if (networkResponse && networkResponse.status === 200 && (networkResponse.type === "basic" || networkResponse.type === "cors")) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is an HTML navigation, return cached index.html
          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});
