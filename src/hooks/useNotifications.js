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

  // Verificar logros
  const checkAchievements = useCallback(() => {
    if (!settings.achievementAlerts) return;

    const count = activities.length;
    const lastCount = parseInt(localStorage.getItem('lastActivityCount') || '0');

    // Primera actividad
    if (count === 1 && lastCount === 0) {
      const { title, options } = NotificationTemplates.firstActivity();
      sendNotification(title, options);
    }

    // 10 actividades
    if (count === 10 && lastCount < 10) {
      const { title, options } = NotificationTemplates.tenActivities();
      sendNotification(title, options);
    }

    // 50 actividades
    if (count === 50 && lastCount < 50) {
      sendNotification('🎉 ¡50 Actividades!', {
        body: '¡Increíble constancia! Has registrado 50 actividades.',
        tag: 'fifty-activities',
        requireInteraction: true
      });
    }

    // 100 actividades
    if (count === 100 && lastCount < 100) {
      sendNotification('🏆 ¡100 Actividades!', {
        body: '¡Felicitaciones! Has alcanzado un hito importante.',
        tag: 'hundred-activities',
        requireInteraction: true
      });
    }

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

  // Programar recordatorio diario
  const scheduleDailyReminder = useCallback(() => {
    const now = new Date();
    const [hours, minutes] = settings.dailyReminderTime.split(':').map(Number);
    
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Si ya pasó la hora hoy, programar para mañana
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const { title, options } = NotificationTemplates.dailyReminder();
    const timeoutId = scheduleNotification(title, options, scheduledTime);
    
    if (timeoutId) {
      scheduledRemindersRef.current.push(timeoutId);
    }
  }, [settings.dailyReminderTime]);

  // Programar resumen semanal
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

    // Calcular estadísticas de la semana
    const weekActivities = getLastWeekActivities(activities);
    const totalHours = weekActivities.reduce((sum, act) => sum + (act.hours || 0), 0);
    const totalStudies = weekActivities.reduce((sum, act) => sum + (act.studies || 0), 0);

    const { title, options } = NotificationTemplates.weeklyReport(
      totalHours.toFixed(1), 
      totalStudies
    );
    
    const timeoutId = scheduleNotification(title, options, scheduledTime);
    
    if (timeoutId) {
      scheduledRemindersRef.current.push(timeoutId);
    }
  }, [activities, settings.weeklyReportDay]);

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