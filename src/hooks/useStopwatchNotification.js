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
    // Verificar configuración
    const settings = loadNotificationSettings();
    if (!settings.enabled || !settings.persistentStopwatch) {
      return;
    }

    // Verificar Service Worker
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker no disponible');
      return;
    }

    // Verificar permiso
    if (Notification.permission !== 'granted') {
      console.warn('Sin permiso de notificaciones');
      return;
    }

    const updateNotification = async () => {
      // Solo actualizar cada 5 segundos
      const now = Date.now();
      if (now - lastNotificationTime.current < 5000) {
        return;
      }
      lastNotificationTime.current = now;

      // Usar sistema específico para Android
      if (isAndroid()) {
        await updateAndroidStopwatchNotification(time, isRunning, isPaused);
      } else {
        // Para desktop/iOS, usar el método anterior
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'UPDATE_STOPWATCH_NOTIFICATION',
            time,
            isRunning,
            isPaused
          });
        }
      }
    };

    if (isRunning || time > 0) {
      // Mostrar notificación inicial
      updateNotification();

      // Actualizar cada 5 segundos
      notificationUpdateInterval.current = setInterval(updateNotification, 5000);
    } else {
      // Ocultar notificación
      if (isAndroid()) {
        hideAndroidStopwatchNotification();
      } else {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'HIDE_STOPWATCH_NOTIFICATION'
          });
        }
      }
    }

    return () => {
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