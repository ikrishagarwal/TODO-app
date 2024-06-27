// Instantly update the service worker if available
self.skipWaiting();

const cacheName = "todo-site-v1";
const dynamicCacheName = "todo-dynamic-v1";
const paths = [
  "/",
  "/index.html",
  "/app.js",
  "/style.css",
  "/manifest.json",
  "/assets/delete.svg",
  "/assets/done.svg",
  "/assets/todo.svg",
  "/assets/icons/logo-512x512.png",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-256x256.png",
  "/assets/icons/icon-384x384.png",
];

self.addEventListener("install", function (res) {
  res.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(paths);
    })
  );
});

self.addEventListener("activate", function (ent) {
  ent.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if ([cacheName, dynamicCacheName].indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        if (event.request.url.startsWith("http")) {
          var responseToCache = response.clone();

          caches.open(dynamicCacheName).then(function (cache) {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      });
    })
  );
});
