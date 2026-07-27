const CACHE_NAME = 'tzalamim-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))))
  );
  self.clients.claim();
});

// רשת קודם, תמיד - אבל רק לקבצי האתר עצמו. בקשות ל-Supabase (או כל דומיין אחר)
// עוברות ישירות ולא נוגעים בהן בכלל, כדי שהנתונים תמיד יהיו חיים ולא ייתקעו על תשובה ישנה.
self.addEventListener('fetch', (event) => {
  if(event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return; // לא נוגעים בבקשות לדומיינים חיצוניים (כמו supabase.co)

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
