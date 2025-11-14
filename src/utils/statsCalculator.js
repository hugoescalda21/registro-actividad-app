import { publisherTypes } from './constants';

export const calculateStats = (activities, publisherType, month = null, year = null) => {
  const now = new Date();
  const targetMonth = month !== null ? month : now.getMonth();
  const targetYear = year !== null ? year : now.getFullYear();

  const monthActivities = activities.filter(a => {
    const date = new Date(a.date);
    return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
  });

  const totalMinutes = monthActivities.reduce((sum, a) => sum + (a.totalMinutes || 0), 0);
  const totalHoursDecimal = totalMinutes / 60;
  const totalApprovedHours = monthActivities.reduce((sum, a) => sum + parseFloat(a.approvedHours || 0), 0);

  const goal = publisherTypes[publisherType].goal;
  const remaining = goal > 0 ? Math.max(0, goal - totalHoursDecimal) : 0;
  const progress = goal > 0 ? Math.min(100, (totalHoursDecimal / goal) * 100) : 0;

  return {
    totalHours: Math.floor(totalMinutes / 60),
    remainingMinutes: totalMinutes % 60,
    totalHoursDecimal: totalHoursDecimal.toFixed(1),
    totalApprovedHours: totalApprovedHours.toFixed(1),
    goal,
    remaining: remaining.toFixed(1),
    progress: progress.toFixed(1),
    studies: monthActivities.reduce((sum, a) => sum + parseInt(a.studies || 0), 0),
    activities: monthActivities.length
  };
};