/**
 * Hook para gestionar recordatorios de revisitas
 *
 * Crea notificaciones inteligentes basadas en:
 * - Fecha de próxima visita programada
 * - Días desde última visita
 * - Revisitas sin visitar en mucho tiempo
 */

import { useEffect } from 'react';
import { loadReturnVisits } from '../utils/returnVisitsUtils';
import { loadNotificationSettings } from '../utils/notificationUtils';

export const useReturnVisitReminders = () => {
  useEffect(() => {
    const checkReminders = () => {
      const settings = loadNotificationSettings();

      // Solo proceder si las notificaciones están habilitadas
      if (!settings.enabled) return;

      const returnVisits = loadReturnVisits();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      returnVisits.forEach(visit => {
        // Solo revisitas activas (no inactivas)
        if (visit.status === 'inactive') return;

        // Verificar si hay fecha de próxima visita
        if (visit.nextVisitDate) {
          const nextDate = new Date(visit.nextVisitDate);
          nextDate.setHours(0, 0, 0, 0);

          const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));

          // Notificar si es hoy
          if (diffDays === 0) {
            sendReminder(visit, 'Visita programada para hoy', `Es momento de visitar a ${visit.name}`);
          }
          // Notificar si es mañana
          else if (diffDays === 1) {
            sendReminder(visit, 'Visita programada mañana', `Recuerda visitar a ${visit.name} mañana`);
          }
          // Notificar si está atrasada
          else if (diffDays < 0) {
            const daysLate = Math.abs(diffDays);
            sendReminder(
              visit,
              'Visita atrasada',
              `La visita a ${visit.name} está atrasada ${daysLate} día${daysLate > 1 ? 's' : ''}`
            );
          }
        }

        // Verificar revisitas sin visitar en mucho tiempo (30 días)
        if (visit.lastVisitDate) {
          const lastVisit = new Date(visit.lastVisitDate);
          lastVisit.setHours(0, 0, 0, 0);

          const daysSinceLastVisit = Math.ceil((today - lastVisit) / (1000 * 60 * 60 * 24));

          if (daysSinceLastVisit >= 30 && daysSinceLastVisit % 7 === 0) {
            sendReminder(
              visit,
              'Revisita sin visitar',
              `Han pasado ${daysSinceLastVisit} días desde la última visita a ${visit.name}`
            );
          }
        }
      });
    };

    const sendReminder = (visit, title, body) => {
      // Verificar si ya se envió esta notificación hoy
      const notificationKey = `reminder-${visit.id}-${new Date().toDateString()}`;
      if (localStorage.getItem(notificationKey)) return;

      // Verificar si el navegador soporta notificaciones
      if (!('Notification' in window)) return;

      // Verificar permisos
      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: `return-visit-${visit.id}`,
          requireInteraction: false,
          data: { visitId: visit.id }
        });

        notification.onclick = () => {
          window.focus();
          // Navegar a la vista de revisitas
          window.location.hash = '#/returnVisits';
          notification.close();
        };

        // Marcar como enviada
        localStorage.setItem(notificationKey, 'true');

        // Limpiar notificaciones antiguas (más de 7 días)
        cleanOldNotifications();
      }
    };

    const cleanOldNotifications = () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('reminder-')) {
          try {
            const dateStr = key.split('-').slice(-3).join(' ');
            const notifDate = new Date(dateStr);
            if (notifDate < sevenDaysAgo) {
              localStorage.removeItem(key);
            }
          } catch (e) {
            // Ignorar errores de parseo
          }
        }
      }
    };

    // Verificar recordatorios al cargar y cada hora
    checkReminders();
    const interval = setInterval(checkReminders, 60 * 60 * 1000); // Cada hora

    return () => clearInterval(interval);
  }, []);

  return null;
};

/**
 * Obtener resumen de revisitas pendientes
 */
export const getUpcomingVisitsReminder = () => {
  const returnVisits = loadReturnVisits();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    overdue: []
  };

  returnVisits.forEach(visit => {
    if (visit.status === 'inactive' || !visit.nextVisitDate) return;

    const nextDate = new Date(visit.nextVisitDate);
    nextDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      upcoming.today.push(visit);
    } else if (diffDays === 1) {
      upcoming.tomorrow.push(visit);
    } else if (diffDays > 1 && diffDays <= 7) {
      upcoming.thisWeek.push(visit);
    } else if (diffDays < 0) {
      upcoming.overdue.push(visit);
    }
  });

  return upcoming;
};
