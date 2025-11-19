/**
 * Sistema de notificaciones avanzadas
 */

// Verificar soporte de notificaciones
export const isNotificationSupported = () => {
  // En Android/iOS con Capacitor, las notificaciones nativas están disponibles
  const isCapacitor = window.Capacitor !== undefined;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Si es una app Capacitor o móvil, asumimos que soporta notificaciones
  if (isCapacitor || isMobile) {
    return true;
  }

  // Para web, verificar la API de Notification
  return 'Notification' in window;
};

// Solicitar permiso de notificaciones
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  try {
    // En Capacitor/móvil, asumir que los permisos se manejan nativamente
    const isCapacitor = window.Capacitor !== undefined;
    if (isCapacitor) {
      // En Capacitor, los permisos se manejan a nivel nativo
      return 'granted';
    }

    // Para web, usar la API estándar
    if (typeof Notification !== 'undefined' && Notification.requestPermission) {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return 'granted'; // Para móvil sin Notification API
  } catch (error) {
    console.error('Error al solicitar permiso:', error);
    return 'granted'; // Asumir concedido en caso de error en móvil
  }
};

// Verificar si hay permiso
export const hasNotificationPermission = () => {
  if (!isNotificationSupported()) return false;

  const isCapacitor = window.Capacitor !== undefined;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // En Capacitor o móvil, asumir que hay permiso (se maneja nativamente)
  if (isCapacitor || isMobile) {
    return true;
  }

  // Para web, verificar la API de Notification
  try {
    return typeof Notification !== 'undefined' && Notification.permission === 'granted';
  } catch {
    return false;
  }
};

// Detectar si está en Android
const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

// Enviar notificación del sistema
export const sendNotification = async (title, options = {}) => {
  console.log('[sendNotification] Iniciando...', title);

  if (!hasNotificationPermission()) {
    console.warn('[sendNotification] No hay permiso para notificaciones');
    alert('⚠️ No tienes permiso para notificaciones. Por favor, actívalas en tu navegador.');
    return null;
  }

  console.log('[sendNotification] Permiso confirmado');

  const defaultOptions = {
    icon: '/registro-actividad-app/icon-192.png',
    badge: '/registro-actividad-app/icon-192.png',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    ...options
  };

  console.log('[sendNotification] Opciones:', defaultOptions);

  try {
    // En Android o cuando hay Service Worker, usar registration.showNotification
    if ('serviceWorker' in navigator) {
      console.log('[sendNotification] Service Worker disponible');

      // Esperar a que el Service Worker esté listo
      const registration = await navigator.serviceWorker.ready;
      console.log('[sendNotification] Service Worker ready:', registration);

      if (registration && registration.active) {
        console.log('[sendNotification] Service Worker activo, usando registration.showNotification');

        // Enviar directamente desde el registro
        await registration.showNotification(title, defaultOptions);

        console.log('[sendNotification] ✅ Notificación enviada exitosamente vía Service Worker');
        return { success: true, method: 'service-worker' };
      } else {
        console.log('[sendNotification] Service Worker no está activo, usando fallback');
      }
    }

    // Fallback para navegadores sin Service Worker
    console.log('[sendNotification] Usando new Notification() como fallback');
    const notification = new Notification(title, defaultOptions);

    // Click en notificación: enfocar la app
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    console.log('[sendNotification] ✅ Notificación enviada vía new Notification()');
    return { success: true, method: 'notification-api' };
  } catch (error) {
    console.error('[sendNotification] ❌ Error al enviar notificación:', error);
    alert(`Error al enviar notificación: ${error.message}`);
    return null;
  }
};

// Notificaciones predefinidas
export const NotificationTemplates = {
  activitySaved: () => ({
    title: '✅ Actividad Guardada',
    options: {
      body: 'Tu actividad se registró correctamente',
      tag: 'activity-saved'
    }
  }),

  goalReached: (percentage) => ({
    title: '🎯 ¡Progreso!',
    options: {
      body: `Has alcanzado el ${percentage}% de tu meta`,
      tag: 'goal-progress',
      requireInteraction: true
    }
  }),

  goalCompleted: () => ({
    title: '🎉 ¡Meta Alcanzada!',
    options: {
      body: '¡Felicitaciones! Completaste tu meta del mes',
      tag: 'goal-completed',
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200]
    }
  }),

  streakMilestone: (days) => ({
    title: '🔥 ¡Racha Increíble!',
    options: {
      body: `${days} días consecutivos registrando actividad`,
      tag: 'streak',
      requireInteraction: true
    }
  }),

  dailyReminder: () => ({
    title: '📝 Recordatorio',
    options: {
      body: '¿Ya registraste tu actividad de hoy?',
      tag: 'daily-reminder',
      requireInteraction: false
    }
  }),

  weeklyReport: (hours, studies) => ({
    title: '📊 Resumen Semanal',
    options: {
      body: `Esta semana: ${hours}h de predicación, ${studies} estudios`,
      tag: 'weekly-report',
      requireInteraction: true
    }
  }),

  hourMilestone: (hours) => ({
    title: '⏱️ Cronómetro',
    options: {
      body: `¡Has completado ${hours} hora${hours > 1 ? 's' : ''}!`,
      tag: 'hour-milestone'
    }
  }),

  firstActivity: () => ({
    title: '🎊 ¡Primera Actividad!',
    options: {
      body: 'Has dado el primer paso. ¡Sigue así!',
      tag: 'first-activity',
      requireInteraction: true
    }
  }),

  tenActivities: () => ({
    title: '🏆 ¡10 Actividades!',
    options: {
      body: 'Has registrado 10 actividades. ¡Excelente constancia!',
      tag: 'ten-activities'
    }
  })
};

// Programar notificación para una hora específica
export const scheduleNotification = (title, options, scheduledTime) => {
  const now = new Date();
  const scheduled = new Date(scheduledTime);
  const delay = scheduled.getTime() - now.getTime();

  if (delay < 0) {
    console.warn('La hora programada ya pasó');
    return null;
  }

  const timeoutId = setTimeout(() => {
    sendNotification(title, options);
  }, delay);

  return timeoutId;
};

// Cancelar notificación programada
export const cancelScheduledNotification = (timeoutId) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
};

// Guardar configuración de notificaciones
export const saveNotificationSettings = (settings) => {
  localStorage.setItem('notificationSettings', JSON.stringify(settings));
};

// Cargar configuración de notificaciones
export const loadNotificationSettings = () => {
  // Configuración por defecto
  const defaultSettings = {
    enabled: false,
    dailyReminder: false,
    dailyReminderTime: '20:00',
    customReminders: [], // Array de { id, time, label, enabled }
    goalAlerts: true,
    streakAlerts: true,
    achievementAlerts: true,
    weeklyReport: false,
    weeklyReportDay: 0,
    sound: true,
    vibration: true,
    persistentStopwatch: true
  };

  const saved = localStorage.getItem('notificationSettings');
  if (saved) {
    try {
      const savedSettings = JSON.parse(saved);
      // Hacer merge con valores por defecto para asegurar que todos los campos existan
      return { ...defaultSettings, ...savedSettings };
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  }

  return defaultSettings;
};