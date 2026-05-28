const CACHE_NAME = 'favorites-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/public/favicon.svg'
];

const CDN_ASSETS = [
    'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2',
    'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@600;700&display=swap'
];

// Install — cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([...STATIC_ASSETS, ...CDN_ASSETS]);
        })
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch — stale-while-revalidate for data, network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Stale-while-revalidate for Gist data
    if (url.hostname === 'gist.githubusercontent.com') {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cached) => {
                    const fetchPromise = fetch(event.request).then((response) => {
                        cache.put(event.request, response.clone());
                        return response;
                    }).catch(() => cached);
                    return cached || fetchPromise;
                });
            })
        );
        return;
    }

    // Network-first for API calls (auth required)
    if (url.hostname === 'api.github.com') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-first for static assets
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                return response;
            });
        })
    );
});
