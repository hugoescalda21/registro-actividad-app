/**
 * Sistema de notificaciones específico para Android
 */

// Verificar si estamos en Android
export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

// Solicitar permiso de notificaciones en Android
export const requestAndroidNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('Notificaciones no soportadas');
    return 'unsupported';
  }

  // En Android, primero verificar si hay Service Worker
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker no soportado');
    return 'no-sw';
  }

  try {
    // Esperar a que el Service Worker esté listo
    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker listo:', registration);

    // Solicitar permiso
    const permission = await Notification.requestPermission();
    console.log('Permiso de notificaciones:', permission);

    return permission;
  } catch (error) {
    console.error('Error al solicitar permiso:', error);
    return 'error';
  }
};

// Mostrar notificación nativa en Android usando Capacitor
export const showAndroidNotification = async (title, options = {}) => {
  try {
    const isCapacitor = window.Capacitor !== undefined;

    if (isCapacitor) {
      // Usar plugin nativo de Capacitor
      console.log('[Android] Usando LocalNotifications de Capacitor');
      const { LocalNotifications } = await import('@capacitor/local-notifications');

      // Verificar permisos primero
      const permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display !== 'granted') {
        console.warn('[Android] Permisos de notificación no concedidos');
        return false;
      }

      // Programar notificación inmediata
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: options.body || '',
            id: Math.floor(Math.random() * 1000000),
            schedule: { at: new Date(Date.now() + 100) }, // Mostrar inmediatamente
            sound: null,
            attachments: null,
            actionTypeId: '',
            extra: null
          }
        ]
      });

      console.log('[Android] ✅ Notificación programada:', title);
      return true;
    }

    // Fallback para navegador web
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker no disponible');
      return false;
    }

    const registration = await navigator.serviceWorker.ready;

    const defaultOptions = {
      body: '',
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'default',
      requireInteraction: false,
      silent: false,
      ...options
    };

    await registration.showNotification(title, defaultOptions);
    console.log('Notificación web mostrada:', title);
    return true;
  } catch (error) {
    console.error('[Android] Error al mostrar notificación:', error);
    return false;
  }
};

// Actualizar notificación del cronómetro específicamente
export const updateAndroidStopwatchNotification = async (time, isRunning, isPaused) => {
  console.log('[Android] 🔔 Intentando actualizar notificación del cronómetro...');
  console.log('[Android] Estado:', { time, isRunning, isPaused });

  try {
    const isCapacitor = window.Capacitor !== undefined;

    // Si no hay cronómetro activo, no mostrar nada
    if (!isRunning && time === 0) {
      console.log('[Android] Cronómetro detenido, no mostrar notificación');
      return;
    }

    // Formatear tiempo
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const hoursDecimal = (time / 3600).toFixed(2);

    // Estado
    const status = isPaused ? '⏸️ Pausado' : '⏱️ En curso';

    if (isCapacitor) {
      // Usar plugin nativo de Capacitor para Android
      console.log('[Android] Usando LocalNotifications de Capacitor para cronómetro');
      const { LocalNotifications } = await import('@capacitor/local-notifications');

      // Verificar permisos primero
      const permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display !== 'granted') {
        console.warn('[Android] ❌ Permisos de notificación no concedidos');
        return;
      }

      // Cancelar notificación anterior del cronómetro (ID fijo: 999999)
      try {
        await LocalNotifications.cancel({ notifications: [{ id: 999999 }] });
        console.log('[Android] Notificación anterior cancelada');
      } catch (e) {
        console.log('[Android] No había notificación anterior o error al cancelar:', e);
      }

      // Programar nueva notificación persistente
      await LocalNotifications.schedule({
        notifications: [
          {
            title: '⏱️ Cronómetro',
            body: `${timeStr} (${hoursDecimal}h)\n${status}`,
            id: 999999, // ID fijo para el cronómetro
            schedule: { at: new Date(Date.now() + 100) }, // Mostrar inmediatamente
            sound: null,
            attachments: null,
            actionTypeId: '',
            extra: { time, isRunning, isPaused },
            ongoing: true, // Notificación persistente
            autoCancel: false // No se cierra al tocar
          }
        ]
      });

      console.log('[Android] ✅ Notificación de cronómetro actualizada:', timeStr);
      return;
    }

    // Fallback para navegador web con Service Worker
    console.log('[Android] Usando Service Worker para navegador web');

    if (!('serviceWorker' in navigator)) {
      console.error('[Android] ❌ Service Worker no disponible');
      return;
    }

    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      console.error('[Android] ❌ Permiso de notificación no otorgado');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    console.log('[Android] ✅ Service Worker listo:', registration);

    // Cerrar notificación anterior
    const notifications = await registration.getNotifications({ tag: 'stopwatch-notification' });
    console.log('[Android] Notificaciones anteriores encontradas:', notifications.length);
    notifications.forEach(n => n.close());

    // Crear opciones de notificación
    const notificationOptions = {
      body: `${timeStr} (${hoursDecimal}h)\n${status}`,
      icon: '/registro-actividad-app/icon-192.png',
      badge: '/registro-actividad-app/icon-192.png',
      tag: 'stopwatch-notification',
      requireInteraction: false,
      silent: true,
      vibrate: [],
      data: { time, isRunning, isPaused }
    };

    // Mostrar notificación
    await registration.showNotification('⏱️ Cronómetro', notificationOptions);

    console.log('[Android] ✅ Notificación de cronómetro mostrada (web)');
  } catch (error) {
    console.error('[Android] ❌ Error al actualizar notificación:', error);
    console.error('[Android] Error stack:', error.stack);
  }
};

// Ocultar notificación del cronómetro
export const hideAndroidStopwatchNotification = async () => {
  try {
    const isCapacitor = window.Capacitor !== undefined;

    if (isCapacitor) {
      // Usar plugin nativo de Capacitor
      console.log('[Android] Cancelando notificación de cronómetro (Capacitor)');
      const { LocalNotifications } = await import('@capacitor/local-notifications');

      // Cancelar notificación del cronómetro (ID fijo: 999999)
      await LocalNotifications.cancel({ notifications: [{ id: 999999 }] });
      console.log('[Android] ✅ Notificación de cronómetro cancelada');
      return;
    }

    // Fallback para navegador web con Service Worker
    if (!('serviceWorker' in navigator)) {
      console.log('[Android] Service Worker no disponible');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const notifications = await registration.getNotifications({ tag: 'stopwatch-notification' });
    console.log('[Android] Cerrando notificaciones del cronómetro:', notifications.length);
    notifications.forEach(n => n.close());
    console.log('[Android] ✅ Notificaciones de cronómetro cerradas (web)');
  } catch (error) {
    console.error('[Android] ❌ Error al cerrar notificación:', error);
  }
};