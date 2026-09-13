// Service Worker v2 — Force unregister and clear all caches
// This fixes the %BASE_URL% cached index.html issue on GitHub Pages

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Delete ALL caches (including 'muscle-chicken-v1' that cached broken %BASE_URL% html)
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((name) => caches.delete(name)));
    }).then(() => {
      // Unregister this service worker completely
      return self.registration.unregister();
    }).then(() => {
      // Force all clients to reload with fresh content from network
      return self.clients.matchAll();
    }).then((clients) => {
      clients.forEach((client) => client.navigate(client.url));
    })
  );
});
