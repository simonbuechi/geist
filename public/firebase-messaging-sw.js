/* eslint-disable no-undef */
// Firebase Messaging Service Worker for KGS PWA
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Parse configuration from query params or use default project configuration
const urlParams = new URL(location.href).searchParams;
const apiKey = urlParams.get('apiKey') || 'AIzaSyBKmmRJdolnT2abMN9cLXIn5u1XMiKJzy0';
const projectId = urlParams.get('projectId') || 'geist-8cbce';
const messagingSenderId = urlParams.get('messagingSenderId') || '671968848501';
const appId = urlParams.get('appId') || '1:671968848501:web:8fd0ddd1c30c22f02c663c';

if (!firebase.apps.length && apiKey && projectId) {
  try {
    firebase.initializeApp({
      apiKey,
      projectId,
      messagingSenderId,
      appId
    });
  } catch (err) {
    console.error('[firebase-messaging-sw.js] Error initializing Firebase:', err);
  }
}

let messaging = null;
try {
  if (firebase.apps.length) {
    messaging = firebase.messaging();
  }
} catch (err) {
  console.warn('[firebase-messaging-sw.js] Firebase messaging not available:', err);
}

// Handle background messages
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || 'Körper Geist Seele';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Zeit für deinen Wochenrückblick!',
    icon: payload.notification?.icon || '/pwa-192x192.png',
    badge: '/favicon-32x32.png',
    tag: payload.data?.tag || 'kgs-review-reminder',
    data: {
      url: payload.data?.url || '/?action=review',
      ...payload.data
    },
    actions: [
      {
        action: 'review',
        title: 'Jetzt reflektieren'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Handle notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/?action=review';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if open
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
