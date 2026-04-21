// Willow Vibes service worker — handles background web push notifications.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
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
