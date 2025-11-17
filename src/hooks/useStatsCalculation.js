import { useMemo } from 'react';
import { getMonthYear } from '../utils/dateUtils';

/**
 * Hook personalizado para calcular estadísticas de actividades
 * Utiliza useMemo para optimizar cálculos
 */
export const useStatsCalculation = (activities, month = null, year = null) => {
  // Si no se especifica mes/año, usar mes actual
  const targetMonth = month || new Date().getMonth() + 1;
  const targetYear = year || new Date().getFullYear();

  // Filtrar actividades del período especificado
  const periodActivities = useMemo(() => {
    return activities.filter(activity => {
      const { month: actMonth, year: actYear } = getMonthYear(activity.date);
      return actMonth === targetMonth && actYear === targetYear;
    });
  }, [activities, targetMonth, targetYear]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const preachingHours = periodActivities.reduce(
      (sum, act) => sum + (act.hours || 0),
      0
    );

    const approvedHours = periodActivities.reduce(
      (sum, act) => sum + (act.approvedHours || 0),
      0
    );

    return {
      // Horas totales = predicación + aprobadas
      totalHours: preachingHours + approvedHours,

      // Horas por tipo
      preachingHours,
      approvedHours,

      // Otras métricas
      totalPlacements: periodActivities.reduce(
        (sum, act) => sum + (act.placements || 0),
        0
      ),
      totalVideos: periodActivities.reduce(
        (sum, act) => sum + (act.videos || 0),
        0
      ),
      totalReturnVisits: periodActivities.reduce(
        (sum, act) => sum + (act.returnVisits || 0),
        0
      ),
      totalStudies: periodActivities.reduce(
        (sum, act) => sum + (act.studies || 0),
        0
      ),

      // Información adicional
      activityCount: periodActivities.length,
      averageHoursPerDay: periodActivities.length > 0
        ? (preachingHours + approvedHours) / periodActivities.length
        : 0
    };
  }, [periodActivities]);

  // Calcular progreso hacia metas
  const calculateProgress = useMemo(() => (goalHours, goalStudies) => {
    const hoursProgress = goalHours > 0
      ? Math.min((stats.totalHours / goalHours) * 100, 100)
      : 0;

    const studiesProgress = goalStudies > 0
      ? Math.min((stats.totalStudies / goalStudies) * 100, 100)
      : 0;

    return {
      hoursProgress,
      studiesProgress,
      hoursRemaining: Math.max(goalHours - stats.totalHours, 0),
      studiesRemaining: Math.max(goalStudies - stats.totalStudies, 0),
      isHoursGoalMet: stats.totalHours >= goalHours,
      isStudiesGoalMet: stats.totalStudies >= goalStudies
    };
  }, [stats]);

  // Obtener actividades por día del mes
  const getActivitiesByDay = useMemo(() => {
    const byDay = {};

    periodActivities.forEach(activity => {
      const date = new Date(activity.date);
      const day = date.getDate();

      if (!byDay[day]) {
        byDay[day] = [];
      }
      byDay[day].push(activity);
    });

    return byDay;
  }, [periodActivities]);

  // Calcular racha de días consecutivos
  const calculateStreak = useMemo(() => {
    if (periodActivities.length === 0) return 0;

    const activeDays = Array.from(
      new Set(
        periodActivities.map(act => {
          const date = new Date(act.date);
          return date.toISOString().split('T')[0];
        })
      )
    ).sort();

    let currentStreak = 1;
    let maxStreak = 1;

    for (let i = 1; i < activeDays.length; i++) {
      const prevDate = new Date(activeDays[i - 1]);
      const currDate = new Date(activeDays[i]);
      const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  }, [periodActivities]);

  return {
    stats,
    periodActivities,
    calculateProgress,
    getActivitiesByDay,
    streak: calculateStreak,
    month: targetMonth,
    year: targetYear
  };
};
