import { useEffect, useRef } from 'react';
import { 
  isAndroid, 
  updateAndroidStopwatchNotification, 
  hideAndroidStopwatchNotification 
} from '../utils/androidNotifications';
import { loadNotificationSettings } from '../utils/notificationUtils';

export const useStopwatchNotification = (time, isRunning, isPaused) => {
  const notificationUpdateInterval = useRef(null);
  const lastNotificationTime = useRef(0);

  useEffect(() => {
    console.log('[useStopwatchNotification] Hook ejecutado', { time, isRunning, isPaused });

    // Verificar configuración
    const settings = loadNotificationSettings();
    console.log('[useStopwatchNotification] Settings:', settings);

    if (!settings.enabled || !settings.persistentStopwatch) {
      console.log('[useStopwatchNotification] Notificaciones deshabilitadas o persistentStopwatch deshabilitado');
      return;
    }

    // Verificar Service Worker
    if (!('serviceWorker' in navigator)) {
      console.warn('[useStopwatchNotification] Service Worker no disponible');
      return;
    }

    // Verificar permiso
    if (Notification.permission !== 'granted') {
      console.warn('[useStopwatchNotification] Sin permiso de notificaciones:', Notification.permission);
      return;
    }

    console.log('[useStopwatchNotification] ✅ Todas las validaciones pasadas');

    const updateNotification = async (forceUpdate = false) => {
      // Solo actualizar cada 5 segundos (excepto si es forzado)
      const now = Date.now();
      if (!forceUpdate && now - lastNotificationTime.current < 5000) {
        console.log('[useStopwatchNotification] Esperando cooldown (< 5s)');
        return;
      }
      lastNotificationTime.current = now;

      console.log('[useStopwatchNotification] Actualizando notificación...', { forceUpdate });

      // Usar sistema específico para Android
      if (isAndroid()) {
        console.log('[useStopwatchNotification] Usando método Android');
        await updateAndroidStopwatchNotification(time, isRunning, isPaused);
      } else {
        // Para desktop/iOS, usar el método anterior
        console.log('[useStopwatchNotification] Usando método Desktop/iOS');
        if (navigator.serviceWorker.controller) {
          console.log('[useStopwatchNotification] Service Worker controller disponible, enviando mensaje');
          navigator.serviceWorker.controller.postMessage({
            type: 'UPDATE_STOPWATCH_NOTIFICATION',
            time,
            isRunning,
            isPaused
          });
        } else {
          console.warn('[useStopwatchNotification] Service Worker controller no disponible');
        }
      }
    };

    if (isRunning || time > 0) {
      console.log('[useStopwatchNotification] Cronómetro activo, configurando notificaciones');
      // Mostrar notificación inicial (forzada para ignorar cooldown)
      updateNotification(true);

      // Actualizar cada 5 segundos
      notificationUpdateInterval.current = setInterval(updateNotification, 5000);
      console.log('[useStopwatchNotification] Intervalo de actualización configurado');
    } else {
      console.log('[useStopwatchNotification] Cronómetro detenido, ocultando notificación');
      // Ocultar notificación
      if (isAndroid()) {
        console.log('[useStopwatchNotification] Ocultando notificación (Android)');
        hideAndroidStopwatchNotification();
      } else {
        console.log('[useStopwatchNotification] Ocultando notificación (Desktop/iOS)');
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'HIDE_STOPWATCH_NOTIFICATION'
          });
        }
      }
    }

    return () => {
      console.log('[useStopwatchNotification] Limpiando intervalo de actualización');
      if (notificationUpdateInterval.current) {
        clearInterval(notificationUpdateInterval.current);
      }
    };
  }, [time, isRunning, isPaused]);

  // Escuchar mensajes del Service Worker
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleMessage = (event) => {
      if (event.data) {
        switch (event.data.type) {
          case 'PAUSE_STOPWATCH':
            window.dispatchEvent(new CustomEvent('stopwatch-pause'));
            break;
          case 'RESUME_STOPWATCH':
            window.dispatchEvent(new CustomEvent('stopwatch-resume'));
            break;
          case 'SAVE_STOPWATCH':
            window.dispatchEvent(new CustomEvent('stopwatch-save'));
            break;
          case 'STOP_STOPWATCH':
            window.dispatchEvent(new CustomEvent('stopwatch-stop'));
            break;
          default:
            break;
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);
};