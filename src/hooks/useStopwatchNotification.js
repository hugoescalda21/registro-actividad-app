import { useEffect, useRef } from 'react';

export const useStopwatchNotification = (time, isRunning, isPaused) => {
  const notificationUpdateInterval = useRef(null);
  const lastNotificationTime = useRef(0);

  useEffect(() => {
    // Verificar si Service Worker está disponible
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker no disponible');
      return;
    }

    // Verificar permiso de notificaciones
    if (Notification.permission !== 'granted') {
      return;
    }

    const updateNotification = () => {
      if (navigator.serviceWorker.controller) {
        // Solo actualizar cada 5 segundos para no saturar
        const now = Date.now();
        if (now - lastNotificationTime.current < 5000) {
          return;
        }
        lastNotificationTime.current = now;

        navigator.serviceWorker.controller.postMessage({
          type: 'UPDATE_STOPWATCH_NOTIFICATION',
          time,
          isRunning,
          isPaused
        });
      }
    };

    if (isRunning || time > 0) {
      // Mostrar notificación inicial
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_STOPWATCH_NOTIFICATION',
          time,
          isRunning,
          isPaused
        });
      }

      // Actualizar notificación cada 5 segundos
      notificationUpdateInterval.current = setInterval(updateNotification, 5000);
    } else {
      // Ocultar notificación si no hay cronómetro activo
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'HIDE_STOPWATCH_NOTIFICATION'
        });
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
            // Pausar cronómetro desde notificación
            const pauseEvent = new CustomEvent('stopwatch-pause');
            window.dispatchEvent(pauseEvent);
            break;
          case 'RESUME_STOPWATCH':
            // Reanudar cronómetro desde notificación
            const resumeEvent = new CustomEvent('stopwatch-resume');
            window.dispatchEvent(resumeEvent);
            break;
          case 'SAVE_STOPWATCH':
            // Guardar cronómetro desde notificación
            const saveEvent = new CustomEvent('stopwatch-save');
            window.dispatchEvent(saveEvent);
            break;
          case 'STOP_STOPWATCH':
            // Detener cronómetro desde notificación
            const stopEvent = new CustomEvent('stopwatch-stop');
            window.dispatchEvent(stopEvent);
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