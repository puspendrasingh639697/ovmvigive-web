// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Firebase configuration - same as your main app
firebase.initializeApp({
  apiKey: "AIzaSyAO05nIto1UkqE4Yp61imFTrizspcXN1GA",
  authDomain: "hiddo-3887f.firebaseapp.com",
  projectId: "hiddo-3887f",
  storageBucket: "hiddo-3887f.appspot.com",
  messagingSenderId: "775242278433",
  appId: "1:775242278433:web:b76d914244d5d8fd37a560"
});

const messaging = firebase.messaging();

// Background messages handle karein
messaging.onBackgroundMessage((payload) => {
  console.log('📱 Received background message: ', payload);
  
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: payload.data || {}
  };

  // Notification display karein
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handle karein
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification);
  event.notification.close();
  
  // App open karein ya focus karein
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Pehle existing tab check karein
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Naya tab open karein
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});


self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Request interception for protection
  if (event.request.url.includes('chrome-extension') || 
      event.request.url.includes('devtools')) {
    event.respondWith(new Response('Access Denied', { status: 403 }));
  }
});