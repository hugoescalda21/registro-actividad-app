import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState(
    'Notification' in window ? Notification.permission : 'denied'
  );

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador no soporta notificaciones');
      return false;
    }

    if (Notification.permission === 'granted') {
      alert('Ya tienes las notificaciones activadas ✓');
      return true;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Mostrar notificación de prueba
        new Notification('¡Notificaciones activadas! 🎉', {
          body: 'Recibirás recordatorios para registrar tu actividad',
          icon: '/icon-192.png',
          badge: '/icon-192.png'
        });
        return true;
      } else {
        alert('Necesitas activar las notificaciones para recibir recordatorios');
        return false;
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      return false;
    }
  };

  const scheduleNotification = () => {
    if (permission !== 'granted') return;

    // Programar notificación para dentro de 24 horas
    setTimeout(() => {
      if (document.hidden) { // Solo si la app está en segundo plano
        new Notification('📝 Recordatorio', {
          body: '¿Ya registraste tu actividad de hoy?',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'daily-reminder',
          requireInteraction: true
        });
      }
    }, 24 * 60 * 60 * 1000); // 24 horas
  };

  const sendMonthEndReminder = (daysRemaining, hoursRemaining) => {
    if (permission !== 'granted') return;

    if (daysRemaining <= 3 && hoursRemaining > 0) {
      new Notification('⏰ ¡Atención!', {
        body: `Quedan ${daysRemaining} días y te faltan ${hoursRemaining} horas para tu meta`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'month-end-reminder'
      });
    }
  };

  return {
    permission,
    requestPermission,
    scheduleNotification,
    sendMonthEndReminder
  };
};