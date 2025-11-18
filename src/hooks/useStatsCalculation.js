import { useMemo, useCallback } from 'react';
import { getMonthYear } from '../utils/dateUtils';

export const useStatsCalculation = (activities, month = null, year = null) => {
  const periodActivities = useMemo(() => {
    if (month === null || year === null) {
      return activities;
    }
    
    return activities.filter(activity => {
      const activityDate = getMonthYear(activity.date);
      return activityDate.month === month && activityDate.year === year;
    });
  }, [activities, month, year]);

  const stats = useMemo(() => {
    const totalHours = periodActivities.reduce((sum, act) => {
      const preachingHours = act.hours || 0;
      const approvedHours = act.approvedHours || 0;
      return sum + preachingHours + approvedHours;
    }, 0);

    const preachingHours = periodActivities.reduce((sum, act) => sum + (act.hours || 0), 0);
    const approvedHours = periodActivities.reduce((sum, act) => sum + (act.approvedHours || 0), 0);
    const totalPlacements = periodActivities.reduce((sum, act) => sum + (act.placements || 0), 0);
    const totalVideos = periodActivities.reduce((sum, act) => sum + (act.videos || 0), 0);
    const totalReturnVisits = periodActivities.reduce((sum, act) => sum + (act.returnVisits || 0), 0);
    const totalStudies = periodActivities.reduce((sum, act) => sum + (act.studies || 0), 0);

    const activityCount = periodActivities.length;
    const averageHoursPerDay = activityCount > 0 ? totalHours / activityCount : 0;

    return {
      totalHours,
      preachingHours,
      approvedHours,
      totalPlacements,
      totalVideos,
      totalReturnVisits,
      totalStudies,
      activityCount,
      averageHoursPerDay
    };
  }, [periodActivities]);

  const calculateProgress = useCallback((goalHours) => {
    if (!goalHours || goalHours === 0) return 0;
    return Math.min((stats.totalHours / goalHours) * 100, 100);
  }, [stats.totalHours]);

  const getActivitiesByDay = useCallback((date) => {
    return periodActivities.filter(act => act.date === date);
  }, [periodActivities]);

  const streak = useMemo(() => {
    if (activities.length === 0) return 0;

    const sortedActivities = [...activities]
      .sort((a, b) => a.date.localeCompare(b.date))
      .reverse();

    let currentStreak = 0;
    let lastDate = new Date().toISOString().split('T')[0];

    for (const activity of sortedActivities) {
      const activityDate = activity.date;
      const daysDiff = Math.floor(
        (new Date(lastDate) - new Date(activityDate)) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff <= 1) {
        currentStreak++;
        lastDate = activityDate;
      } else {
        break;
      }
    }

    return currentStreak;
  }, [activities]);

  return {
    stats,
    periodActivities,
    calculateProgress,
    getActivitiesByDay,
    streak
  };
};