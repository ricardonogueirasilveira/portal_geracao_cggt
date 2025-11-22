const CACHE_NAME = 'portal-cggt-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Clear old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Network First Strategy: Try to get from network, if fails (offline), get from cache
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if(!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            // Don't cache POST requests or external API calls excessively if not needed
            if (event.request.method === 'GET' && !event.request.url.includes('chrome-extension')) {
                try {
                    cache.put(event.request, responseToCache);
                } catch (e) {
                    // Ignore cache errors for non-supported schemes
                }
            }
          });

        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});