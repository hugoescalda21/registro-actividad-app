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

// Actualizar notificación del cronómetro usando Foreground Service
export const updateAndroidStopwatchNotification = async (time, isRunning, isPaused) => {
  console.log('[Android] 🔔 Intentando actualizar notificación del cronómetro...');
  console.log('[Android] Estado:', { time, isRunning, isPaused });

  try {
    const isCapacitor = window.Capacitor !== undefined;

    // Si no hay cronómetro activo, detener servicio
    if (!isRunning && time === 0) {
      console.log('[Android] Cronómetro detenido, ocultando notificación');
      await hideAndroidStopwatchNotification();
      return;
    }

    // Formatear tiempo
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const hoursDecimal = (time / 3600).toFixed(2);

    // Estado
    const status = isPaused ? 'Pausado' : 'En curso';

    if (isCapacitor) {
      // Usar Foreground Service para notificación persistente
      console.log('[Android] Usando ForegroundService de Capacitor para cronómetro');
      const { ForegroundService } = await import('@capawesome-team/capacitor-android-foreground-service');

      // Crear botones de acción
      const buttons = [];
      if (isPaused) {
        buttons.push({ id: 1, title: '▶️ Reanudar' });
      } else {
        buttons.push({ id: 1, title: '⏸️ Pausar' });
      }
      buttons.push({ id: 2, title: '💾 Guardar' });
      buttons.push({ id: 3, title: '⏹️ Detener' });

      // Iniciar/Actualizar servicio de primer plano
      await ForegroundService.startForegroundService({
        id: 1,
        title: '⏱️ Cronómetro',
        body: `${timeStr} (${hoursDecimal}h) - ${status}`,
        smallIcon: 'ic_launcher',
        buttons: buttons
      });

      console.log('[Android] ✅ Servicio de primer plano actualizado:', timeStr);
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

// Ocultar notificación del cronómetro (detener Foreground Service)
export const hideAndroidStopwatchNotification = async () => {
  try {
    const isCapacitor = window.Capacitor !== undefined;

    if (isCapacitor) {
      // Detener servicio de primer plano
      console.log('[Android] Deteniendo servicio de primer plano (Capacitor)');
      const { ForegroundService } = await import('@capawesome-team/capacitor-android-foreground-service');

      // Detener servicio de primer plano
      await ForegroundService.stopForegroundService();
      console.log('[Android] ✅ Servicio de primer plano detenido');
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