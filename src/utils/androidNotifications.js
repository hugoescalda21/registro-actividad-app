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

// Mostrar notificación usando Service Worker (mejor para Android)
export const showAndroidNotification = async (title, options = {}) => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker no disponible');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    const defaultOptions = {
      body: '',
      icon: '/registro-actividad-app/icon-192.png',
      badge: '/registro-actividad-app/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'default',
      requireInteraction: false,
      silent: false,
      ...options
    };

    await registration.showNotification(title, defaultOptions);
    console.log('Notificación mostrada:', title);
    return true;
  } catch (error) {
    console.error('Error al mostrar notificación:', error);
    return false;
  }
};

// Actualizar notificación del cronómetro específicamente
export const updateAndroidStopwatchNotification = async (time, isRunning, isPaused) => {
  if (!('serviceWorker' in navigator)) return;
  if (Notification.permission !== 'granted') return;

  try {
    const registration = await navigator.serviceWorker.ready;
    console.log('[Android] Actualizando notificación del cronómetro...', { time, isRunning, isPaused });

    // Cerrar notificación anterior
    const notifications = await registration.getNotifications({ tag: 'stopwatch-notification' });
    console.log('[Android] Notificaciones anteriores encontradas:', notifications.length);
    notifications.forEach(n => n.close());

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

    // Crear acciones
    const actions = [];

    if (isPaused) {
      actions.push({
        action: 'resume',
        title: '▶️ Reanudar'
      });
    } else {
      actions.push({
        action: 'pause',
        title: '⏸️ Pausar'
      });
    }

    actions.push({
      action: 'save',
      title: '💾 Guardar'
    });

    actions.push({
      action: 'stop',
      title: '⏹️ Detener'
    });

    // Mostrar notificación
    await registration.showNotification('⏱️ Cronómetro', {
      body: `${timeStr} (${hoursDecimal}h)\n${status}`,
      icon: '/registro-actividad-app/icon-192.png',
      badge: '/registro-actividad-app/icon-192.png',
      tag: 'stopwatch-notification',
      requireInteraction: true,
      silent: true,
      vibrate: [],
      actions: actions,
      data: { time, isRunning, isPaused }
    });

    console.log('[Android] ✅ Notificación de cronómetro mostrada exitosamente');
  } catch (error) {
    console.error('[Android] ❌ Error al actualizar notificación:', error);
  }
};

// Ocultar notificación del cronómetro
export const hideAndroidStopwatchNotification = async () => {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const notifications = await registration.getNotifications({ tag: 'stopwatch-notification' });
    console.log('[Android] Cerrando notificaciones del cronómetro:', notifications.length);
    notifications.forEach(n => n.close());
    console.log('[Android] ✅ Notificaciones de cronómetro cerradas');
  } catch (error) {
    console.error('[Android] ❌ Error al cerrar notificación:', error);
  }
};