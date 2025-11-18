const CACHE_NAME = 'registro-actividad-v2.8.1';
const BASE_URL = '/registro-actividad-app';
const urlsToCache = [
  `${BASE_URL}/`,
  `${BASE_URL}/index.html`,
  `${BASE_URL}/manifest.json`,
  `${BASE_URL}/icon-192.png`,
  `${BASE_URL}/icon-512.png`
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cacheando archivos de la app');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Todos los archivos cacheados');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error al cachear archivos:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service Worker activado');
      return self.clients.claim();
    })
  );
});

// Estrategia de Cache First
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isExternal = url.origin !== location.origin;
  const isCDN = url.hostname.includes('cdn') || 
                url.hostname.includes('unpkg') ||
                url.hostname.includes('jsdelivr');

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            if (!isExternal || isCDN) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch((error) => {
            console.error('[SW] Error en fetch:', error);
            return caches.match('/index.html');
          });
      })
  );
});

// Manejo de mensajes
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Mostrar notificación general desde la app
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    showGeneralNotification(title, options);
  }

  // Actualizar notificación del cronómetro
  if (event.data && event.data.type === 'UPDATE_STOPWATCH_NOTIFICATION') {
    const { time, isRunning, isPaused } = event.data;
    updateStopwatchNotification(time, isRunning, isPaused);
  }

  // Mostrar notificación del cronómetro
  if (event.data && event.data.type === 'SHOW_STOPWATCH_NOTIFICATION') {
    const { time, isRunning, isPaused } = event.data;
    showStopwatchNotification(time, isRunning, isPaused);
  }

  // Ocultar notificación del cronómetro
  if (event.data && event.data.type === 'HIDE_STOPWATCH_NOTIFICATION') {
    hideStopwatchNotification();
  }
});

// Mostrar notificación general
function showGeneralNotification(title, options = {}) {
  const defaultOptions = {
    icon: `${BASE_URL}/icon-192.png`,
    badge: `${BASE_URL}/icon-192.png`,
    vibrate: options.vibrate || [200, 100, 200],
    requireInteraction: options.requireInteraction || false,
    silent: options.silent || false,
    ...options
  };

  self.registration.showNotification(title, defaultOptions);
}

// Mostrar notificación persistente del cronómetro
function showStopwatchNotification(time, isRunning, isPaused) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const status = isPaused ? '⏸️ Pausado' : '⏱️ En curso';
  const hoursDecimal = (time / 3600).toFixed(2);

  const actions = [];
  
  if (isPaused) {
    actions.push({
      action: 'resume',
      title: '▶️ Reanudar',
      icon: `${BASE_URL}/icon-192.png`
    });
  } else {
    actions.push({
      action: 'pause',
      title: '⏸️ Pausar',
      icon: `${BASE_URL}/icon-192.png`
    });
  }

  actions.push({
    action: 'save',
    title: '💾 Guardar',
    icon: `${BASE_URL}/icon-192.png`
  });

  actions.push({
    action: 'stop',
    title: '⏹️ Detener',
    icon: `${BASE_URL}/icon-192.png`
  });

  const options = {
    body: `${timeStr} (${hoursDecimal}h)\n${status}`,
    icon: `${BASE_URL}/icon-192.png`,
    badge: `${BASE_URL}/icon-192.png`,
    tag: 'stopwatch-notification',
    requireInteraction: true,
    silent: true,
    actions: actions,
    data: { time, isRunning, isPaused }
  };

  self.registration.showNotification('⏱️ Cronómetro', options);
}

// Actualizar notificación existente
function updateStopwatchNotification(time, isRunning, isPaused) {
  // Cerrar notificación anterior
  self.registration.getNotifications({ tag: 'stopwatch-notification' })
    .then(notifications => {
      notifications.forEach(notification => notification.close());
    })
    .then(() => {
      // Mostrar notificación actualizada
      if (isRunning || time > 0) {
        showStopwatchNotification(time, isRunning, isPaused);
      }
    });
}

// Ocultar notificación
function hideStopwatchNotification() {
  self.registration.getNotifications({ tag: 'stopwatch-notification' })
    .then(notifications => {
      notifications.forEach(notification => notification.close());
    });
}

// Manejar clics en las acciones de la notificación
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificación clickeada:', event.action, 'Tag:', event.notification.tag);

  event.notification.close();

  // Para notificaciones generales, simplemente abrir/enfocar la app
  if (!event.action && event.notification.tag !== 'stopwatch-notification') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url.includes('registro-actividad-app') && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(`${BASE_URL}/`);
          }
        })
    );
    return;
  }

  // Manejo de acciones del cronómetro
  if (event.action === 'pause') {
    // Pausar cronómetro
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          if (clientList.length > 0) {
            clientList[0].postMessage({ type: 'PAUSE_STOPWATCH' });
            return clientList[0].focus();
          }
          return clients.openWindow(`${BASE_URL}/`);
        })
    );
  } else if (event.action === 'resume') {
    // Reanudar cronómetro
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          if (clientList.length > 0) {
            clientList[0].postMessage({ type: 'RESUME_STOPWATCH' });
            return clientList[0].focus();
          }
          return clients.openWindow(`${BASE_URL}/`);
        })
    );
  } else if (event.action === 'save') {
    // Guardar actividad
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          if (clientList.length > 0) {
            clientList[0].postMessage({ type: 'SAVE_STOPWATCH' });
            return clientList[0].focus();
          }
          return clients.openWindow(`${BASE_URL}/`);
        })
    );
  } else if (event.action === 'stop') {
    // Detener cronómetro
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          if (clientList.length > 0) {
            clientList[0].postMessage({ type: 'STOP_STOPWATCH' });
            return clientList[0].focus();
          }
          return clients.openWindow(`${BASE_URL}/`);
        })
    );
  } else {
    // Click en el cuerpo de la notificación - abrir app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url.includes('registro-actividad-app') && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(`${BASE_URL}/`);
          }
        })
    );
  }
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notificación cerrada:', event.notification.tag);
});