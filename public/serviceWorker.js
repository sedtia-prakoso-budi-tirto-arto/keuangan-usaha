self.addEventListener('install', () => {
  console.log('Service Worker installing.');
  self.skipWaiting(); // Memaksa Service Worker untuk langsung menjadi aktif
});

self.addEventListener('activate', () => {
  console.log('Service Worker activating.');
  // Lakukan beberapa tugas
});

self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(fetch(event.request));
});
