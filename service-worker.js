// Service Worker for Offline Support

const CACHE_NAME = 'pp69-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/styles/arabic-typography.css',
    '/js/app-init.js',
    '/js/firebase-init.js',
    '/js/firebase-operations.js',
    '/js/main.js',
    '/js/employees.js',
    '/js/payroll.js',
    '/js/reports.js',
    '/js/utils.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch((error) => {
                console.error('Cache installation error:', error);
            })
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Event Strategy
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Handle Firebase API requests differently
    if (event.request.url.includes('firestore.googleapis.com')) {
        // Let Firebase handle its own caching
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found
                if (response) {
                    return response;
                }

                // Clone the request because it's a one-time use stream
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then((response) => {
                        // Check if response is valid
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response because it's a one-time use stream
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline page if fetch fails
                        return caches.match('/offline.html');
                    });
            })
    );
});

// Handle Background Sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'syncData') {
        event.waitUntil(
            // Sync data with server when online
            syncData()
        );
    }
});

// Handle Push Notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/icon.png',
        badge: '/badge.png',
        dir: 'rtl',
        lang: 'ar'
    };

    event.waitUntil(
        self.registration.showNotification('نظام الرواتب', options)
    );
});

// Handle Notification Click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
