import { useEffect, useCallback, useRef } from 'react';
import { 
  hasNotificationPermission,
  sendNotification,
  NotificationTemplates,
  loadNotificationSettings,
  scheduleNotification
} from '../utils/notificationUtils';

export const useNotifications = (activities, stats, config) => {
  const settings = loadNotificationSettings();
  const lastProgressRef = useRef({});
  const scheduledRemindersRef = useRef([]);

  // Verificar logros cuando cambian las actividades
  useEffect(() => {
    if (!settings.enabled || !hasNotificationPermission()) return;

    checkAchievements();
  }, [activities.length, settings.enabled]);

  // Verificar inactividad (cada hora)
  useEffect(() => {
    if (!settings.enabled || !hasNotificationPermission()) return;

    const checkInactivity = () => {
      if (activities.length === 0) return;

      const sortedActivities = [...activities].sort(
        (a, b) => b.date.localeCompare(a.date)
      );
      const lastActivity = new Date(sortedActivities[0].date);
      const now = new Date();
      const daysSinceLastActivity = Math.floor(
        (now - lastActivity) / (1000 * 60 * 60 * 24)
      );

      const lastInactivityAlert = localStorage.getItem('lastInactivityAlert');
      const lastActivityDate = sortedActivities[0].date;

      // Recordatorio después de 3 días sin actividad (solo una vez por período)
      if (
        daysSinceLastActivity >= 3 &&
        lastInactivityAlert !== lastActivityDate
      ) {
        sendNotification('🤔 Te Extrañamos', {
          body: `Hace ${daysSinceLastActivity} días que no registras actividad. ¿Todo bien?`,
          tag: 'inactivity-reminder',
          requireInteraction: true
        });
        localStorage.setItem('lastInactivityAlert', lastActivityDate);
      }
    };

    // Verificar inmediatamente
    checkInactivity();

    // Verificar cada hora
    const intervalId = setInterval(checkInactivity, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [activities, settings.enabled]);

  // Verificar progreso de meta
  useEffect(() => {
    if (!settings.enabled || !settings.goalAlerts || !hasNotificationPermission()) return;
    if (!config.hours || stats.totalHours === 0) return;

    checkGoalProgress();
  }, [stats.totalHours, settings.enabled, settings.goalAlerts]);

  // Verificar racha
  useEffect(() => {
    if (!settings.enabled || !settings.streakAlerts || !hasNotificationPermission()) return;

    checkStreak();
  }, [activities.length, settings.enabled, settings.streakAlerts]);

  // Programar recordatorio diario
  useEffect(() => {
    if (!settings.enabled || !settings.dailyReminder || !hasNotificationPermission()) return;

    scheduleDailyReminder();

    return () => {
      // Limpiar recordatorios programados
      scheduledRemindersRef.current.forEach(id => clearTimeout(id));
      scheduledRemindersRef.current = [];
    };
  }, [settings.enabled, settings.dailyReminder, settings.dailyReminderTime]);

  // Programar resumen semanal
  useEffect(() => {
    if (!settings.enabled || !settings.weeklyReport || !hasNotificationPermission()) return;

    scheduleWeeklyReport();

    return () => {
      scheduledRemindersRef.current.forEach(id => clearTimeout(id));
      scheduledRemindersRef.current = [];
    };
  }, [settings.enabled, settings.weeklyReport, settings.weeklyReportDay]);

  // Programar recordatorios personalizados
  useEffect(() => {
    if (!settings.enabled || !hasNotificationPermission()) return;
    if (!settings.customReminders || settings.customReminders.length === 0) return;

    const activeReminders = settings.customReminders.filter(r => r.enabled);

    activeReminders.forEach(reminder => {
      scheduleCustomReminder(reminder);
    });

    return () => {
      scheduledRemindersRef.current.forEach(id => clearTimeout(id));
      scheduledRemindersRef.current = [];
    };
  }, [settings.enabled, settings.customReminders]);

  // Verificar logros
  const checkAchievements = useCallback(() => {
    if (!settings.achievementAlerts) return;

    const count = activities.length;
    const lastCount = parseInt(localStorage.getItem('lastActivityCount') || '0');

    const achievements = [
      { count: 1, title: '🎊 ¡Primera Actividad!', body: 'Has dado el primer paso. ¡Sigue así!', tag: 'first-activity' },
      { count: 10, title: '🏆 ¡10 Actividades!', body: 'Has registrado 10 actividades. ¡Excelente constancia!', tag: 'ten-activities' },
      { count: 25, title: '🌟 ¡25 Actividades!', body: '¡Vas por muy buen camino! Sigue así.', tag: 'twenty-five-activities' },
      { count: 50, title: '🎉 ¡50 Actividades!', body: '¡Increíble constancia! Has registrado 50 actividades.', tag: 'fifty-activities' },
      { count: 100, title: '💎 ¡100 Actividades!', body: '¡Felicitaciones! Has alcanzado un hito importante.', tag: 'hundred-activities' },
      { count: 250, title: '🌠 ¡250 Actividades!', body: '¡Asombroso! Tu dedicación es inspiradora.', tag: 'two-fifty-activities' },
      { count: 500, title: '⭐ ¡500 Actividades!', body: '¡Wow! Has demostrado una constancia excepcional.', tag: 'five-hundred-activities' },
      { count: 1000, title: '👑 ¡1000 Actividades!', body: '¡Legendario! Has alcanzado el máximo nivel.', tag: 'thousand-activities' }
    ];

    achievements.forEach(achievement => {
      if (count === achievement.count && lastCount < achievement.count) {
        sendNotification(achievement.title, {
          body: achievement.body,
          tag: achievement.tag,
          requireInteraction: true
        });
      }
    });

    localStorage.setItem('lastActivityCount', count.toString());
  }, [activities.length, settings.achievementAlerts]);

  // Verificar progreso de meta
  const checkGoalProgress = useCallback(() => {
    const percentage = Math.floor((stats.totalHours / config.hours) * 100);
    const lastPercentage = lastProgressRef.current[getCurrentMonthKey()] || 0;

    // Notificar en 25%, 50%, 75%, 100%
    const milestones = [25, 50, 75, 100];
    
    for (const milestone of milestones) {
      if (percentage >= milestone && lastPercentage < milestone) {
        const { title, options } = milestone === 100 
          ? NotificationTemplates.goalCompleted()
          : NotificationTemplates.goalReached(milestone);
        
        sendNotification(title, options);
        lastProgressRef.current[getCurrentMonthKey()] = milestone;
        break;
      }
    }
  }, [stats.totalHours, config.hours]);

  // Verificar racha
  const checkStreak = useCallback(() => {
    const streak = calculateStreak(activities);
    const lastStreak = parseInt(localStorage.getItem('lastStreak') || '0');

    // Notificar en rachas de 3, 7, 14, 30 días
    const milestones = [3, 7, 14, 30, 60, 90];
    
    for (const milestone of milestones) {
      if (streak === milestone && lastStreak < milestone) {
        const { title, options } = NotificationTemplates.streakMilestone(milestone);
        sendNotification(title, options);
        break;
      }
    }

    localStorage.setItem('lastStreak', streak.toString());
  }, [activities]);

  // Programar recordatorio diario (con reprogramación automática)
  const scheduleDailyReminder = useCallback(() => {
    const now = new Date();
    const [hours, minutes] = settings.dailyReminderTime.split(':').map(Number);

    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Si ya pasó la hora hoy, programar para mañana
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      // Verificar si ya registró actividad hoy
      const today = new Date().toISOString().split('T')[0];
      const hasActivityToday = activities.some(act => act.date === today);

      if (!hasActivityToday) {
        const { title, options } = NotificationTemplates.dailyReminder();
        sendNotification(title, options);
      }

      // Reprogramar para mañana
      setTimeout(() => scheduleDailyReminder(), 1000);
    }, delay);

    scheduledRemindersRef.current.push(timeoutId);
  }, [activities, settings.dailyReminderTime]);

  // Programar resumen semanal (con reprogramación automática)
  const scheduleWeeklyReport = useCallback(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const targetDay = settings.weeklyReportDay;

    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7;
    }

    const scheduledTime = new Date();
    scheduledTime.setDate(scheduledTime.getDate() + daysUntilTarget);
    scheduledTime.setHours(20, 0, 0, 0); // 8 PM

    const delay = scheduledTime.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      // Calcular estadísticas de la semana
      const weekActivities = getLastWeekActivities(activities);
      const totalHours = weekActivities.reduce(
        (sum, act) => sum + (act.hours || 0) + (act.approvedHours || 0),
        0
      );
      const totalStudies = weekActivities.reduce((sum, act) => sum + (act.studies || 0), 0);

      const { title, options } = NotificationTemplates.weeklyReport(
        totalHours.toFixed(1),
        totalStudies
      );

      sendNotification(title, options);

      // Reprogramar para la próxima semana
      setTimeout(() => scheduleWeeklyReport(), 1000);
    }, delay);

    scheduledRemindersRef.current.push(timeoutId);
  }, [activities, settings.weeklyReportDay]);

  // Programar recordatorio personalizado (con reprogramación automática)
  const scheduleCustomReminder = useCallback((reminder) => {
    const now = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);

    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Si ya pasó la hora hoy, programar para mañana
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      sendNotification(`⏰ ${reminder.label}`, {
        body: '¿Ya registraste tu actividad?',
        tag: `custom-reminder-${reminder.id}`,
        requireInteraction: false
      });

      // Reprogramar para mañana
      setTimeout(() => scheduleCustomReminder(reminder), 1000);
    }, delay);

    scheduledRemindersRef.current.push(timeoutId);
  }, []);

  // Funciones auxiliares
  const getCurrentMonthKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}`;
  };

  const calculateStreak = (activities) => {
    if (activities.length === 0) return 0;

    const sortedActivities = [...activities]
      .sort((a, b) => a.date.localeCompare(b.date))
      .reverse();

    let currentStreak = 0;
    let lastDate = new Date().toISOString().split('T')[0];

    for (const activity of sortedActivities) {
      const activityDate = activity.date;
      const date1 = new Date(lastDate);
      const date2 = new Date(activityDate);
      const diffTime = Math.abs(date1 - date2);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        currentStreak++;
        lastDate = activityDate;
      } else {
        break;
      }
    }

    return currentStreak;
  };

  const getLastWeekActivities = (activities) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= oneWeekAgo && activityDate <= now;
    });
  };

  return {
    checkAchievements,
    checkGoalProgress,
    checkStreak
  };
};