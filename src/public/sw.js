// Nuclear service worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // Block ALL devtools requests
    if (event.request.url.includes('chrome-devtools') ||
        event.request.url.includes('devtools') ||
        event.request.url.includes('debug') ||
        event.request.url.includes('inspect')) {
        event.respondWith(new Response('Access Denied by Security Policy', {
            status: 403,
            headers: { 'Content-Type': 'text/plain' }
        }));
    }
});