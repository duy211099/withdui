const STATIC_CACHE = 'withdui-static-v2'
const STATIC_ASSETS = [
  '/manifest.webmanifest',
  '/images/icon-48x48.png',
  '/images/icon-72x72.png',
  '/images/icon-96x96.png',
  '/images/icon-128x128.png',
  '/images/icon-144x144.png',
  '/images/icon-152x152.png',
  '/images/icon-192x192.png',
  '/images/icon-192x192-maskable.png',
  '/images/icon-256x256.png',
  '/images/icon-384x384.png',
  '/images/icon-512x512.png',
  '/images/icon-512x512-maskable.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== STATIC_CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  // for flash to work properly
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request))
    return
  }

  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)))
    return
  }

  event.respondWith(fetch(event.request))
})
