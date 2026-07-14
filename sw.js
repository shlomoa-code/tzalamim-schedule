const CACHE_NAME = 'tzalamim-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))))
  );
  self.clients.claim();
});

// רשת קודם, תמיד - הקאש משמש רק כגיבוי אם אין בכלל אינטרנט
self.addEventListener('fetch', (event) => {
  if(event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request, {cache:'no-store'})
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
