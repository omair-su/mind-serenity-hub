// Willow Vibes service worker — handles background web push notifications
// AND caches downloaded meditation audio for offline playback.

const AUDIO_CACHE = "wv-audio-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Clean up legacy caches
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k.startsWith("wv-audio-") && k !== AUDIO_CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// Cache-first strategy for audio files (mp3/m4a/ogg/wav).
// Pages can preload by fetching the URL — the SW will store it transparently.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isAudio = /\.(mp3|m4a|ogg|wav)(\?|$)/i.test(url.pathname);
  if (!isAudio) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(AUDIO_CACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const fresh = await fetch(req);
        if (fresh.ok && (fresh.type === "basic" || fresh.type === "cors")) {
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch (err) {
        if (cached) return cached;
        throw err;
      }
    })()
  );
});

// Allow the app to explicitly preload a list of audio URLs into cache.
self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "WV_CACHE_AUDIO" && Array.isArray(data.urls)) {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(AUDIO_CACHE);
        await Promise.all(
          data.urls.map(async (u) => {
            try {
              const r = await fetch(u);
              if (r.ok) await cache.put(u, r.clone());
            } catch {}
          })
        );
      })()
    );
  }
  if (data.type === "WV_CLEAR_AUDIO_CACHE") {
    event.waitUntil(caches.delete(AUDIO_CACHE));
  }
});

self.addEventListener("push", (event) => {
  let payload = {
    title: "Time for your Willow practice 🌿",
    body: "Take 10 minutes to breathe and reset.",
    url: "/app",
  };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch (e) {
    try {
      if (event.data) payload.body = event.data.text();
    } catch {}
  }

  const options = {
    body: payload.body,
    icon: "/favicon.png",
    badge: "/favicon.png",
    tag: payload.tag || "wv-reminder",
    data: { url: payload.url || "/app" },
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/app";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
