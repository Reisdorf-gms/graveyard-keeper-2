const CACHE = 'reisdorf-planner-shell-v1-1-public-seo';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('reisdorf-planner-shell-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      if (!response.ok) throw new Error('Indisponível');
      return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  if (SHELL.some(path => new URL(path, self.registration.scope).href === event.request.url)) {
    event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request)));
  }
});
