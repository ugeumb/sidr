/* Service worker SIDR UGE. Network-first agar perubahan di GitHub langsung terbaca, cache sebagai cadangan offline. */
var V = 'sidr-v2';
var ASSETS = ['./', 'index.html', 'style.css', 'app.js', 'quotes.js', 'config.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/logo.png', 'icons/favicon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(
    fetch(u.href, { cache: 'no-store', credentials: 'same-origin' }).then(function (res) {
      if (res && res.ok) { var cp = res.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); }
      return res;
    }).catch(function () {
      return caches.match(r).then(function (m) { return m || caches.match('index.html'); });
    })
  );
});
