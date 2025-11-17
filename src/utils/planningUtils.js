/**
 * Utilidades para planificación y metas diarias
 */

import { getMonthYear } from './dateUtils';

/**
 * Calcular progreso y metas del mes actual
 * @param {Array} activities - Lista de actividades
 * @param {Object} config - Configuración del tipo de publicador
 * @returns {Object} - Información de progreso y metas
 */
export const calculateMonthlyProgress = (activities, config) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const currentDay = now.getDate();

  // Filtrar actividades del mes actual
  const monthActivities = activities.filter(activity => {
    const { month, year } = getMonthYear(activity.date);
    return month === currentMonth && year === currentYear;
  });

  // Calcular total de horas del mes
  const totalHours = monthActivities.reduce((sum, act) => sum + (act.hours || 0), 0);

  // Meta del mes
  const monthlyGoal = config.hours || 0;

  // Días del mes
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Días transcurridos (incluyendo hoy)
  const daysElapsed = currentDay;

  // Días restantes (sin contar hoy)
  const daysRemaining = daysInMonth - currentDay;

  // Progreso en porcentaje
  const progressPercentage = monthlyGoal > 0 ? (totalHours / monthlyGoal) * 100 : 0;

  // Horas que deberías llevar a esta altura del mes
  const expectedHours = monthlyGoal > 0 ? (monthlyGoal / daysInMonth) * daysElapsed : 0;

  // Diferencia entre lo esperado y lo real
  const hoursDifference = totalHours - expectedHours;

  // Meta diaria original
  const dailyGoalOriginal = monthlyGoal > 0 ? monthlyGoal / daysInMonth : 0;

  // Meta diaria ajustada (para los días restantes)
  const hoursRemaining = Math.max(0, monthlyGoal - totalHours);
  const dailyGoalAdjusted = daysRemaining > 0 ? hoursRemaining / daysRemaining : 0;

  // Proyección al final del mes (si continúas al ritmo actual)
  const averagePerDay = daysElapsed > 0 ? totalHours / daysElapsed : 0;
  const projectedTotal = averagePerDay * daysInMonth;

  // Estado (adelantado, al día, atrasado)
  let status = 'on-track';
  if (hoursDifference < -2) {
    status = 'behind';
  } else if (hoursDifference > 2) {
    status = 'ahead';
  }

  return {
    totalHours,
    monthlyGoal,
    daysInMonth,
    daysElapsed,
    daysRemaining,
    progressPercentage: Math.min(progressPercentage, 100),
    expectedHours,
    hoursDifference,
    dailyGoalOriginal,
    dailyGoalAdjusted,
    hoursRemaining,
    projectedTotal,
    status,
    willMeetGoal: projectedTotal >= monthlyGoal
  };
};

/**
 * Obtener mensaje motivacional según el estado
 * @param {Object} progress - Objeto de progreso
 * @returns {Object} - { emoji, title, message, color }
 */
export const getMotivationalMessage = (progress) => {
  const { status, hoursDifference, progressPercentage, daysRemaining } = progress;

  if (progressPercentage >= 100) {
    return {
      emoji: '🎉',
      title: '¡Meta Completada!',
      message: 'Ya alcanzaste tu meta del mes. ¡Excelente trabajo!',
      color: 'green'
    };
  }

  if (status === 'ahead') {
    return {
      emoji: '🚀',
      title: '¡Vas Adelantado!',
      message: `Llevas ${Math.abs(hoursDifference).toFixed(1)}h de ventaja. ¡Sigue así!`,
      color: 'green'
    };
  }

  if (status === 'on-track') {
    return {
      emoji: '✅',
      title: '¡Al Día!',
      message: 'Estás en el ritmo perfecto para alcanzar tu meta.',
      color: 'blue'
    };
  }

  if (status === 'behind' && daysRemaining > 5) {
    return {
      emoji: '💪',
      title: 'Aún hay tiempo',
      message: `Necesitas ${Math.abs(hoursDifference).toFixed(1)}h más para nivelarte.`,
      color: 'orange'
    };
  }

  if (status === 'behind' && daysRemaining <= 5) {
    return {
      emoji: '⚡',
      title: '¡Última semana!',
      message: `Quedan ${daysRemaining} días. Necesitas un esfuerzo extra.`,
      color: 'red'
    };
  }

  return {
    emoji: '🎯',
    title: 'Comienza hoy',
    message: 'Cada hora cuenta para tu meta.',
    color: 'blue'
  };
};

/**
 * Obtener recomendación de horas para hoy
 * @param {Object} progress - Objeto de progreso
 * @returns {number} - Horas recomendadas
 */
export const getTodayRecommendation = (progress) => {
  const { status, dailyGoalAdjusted, hoursDifference } = progress;

  if (status === 'ahead') {
    // Si vas adelantado, puedes bajar el ritmo
    return Math.max(dailyGoalAdjusted * 0.8, 1);
  }

  if (status === 'behind') {
    // Si vas atrasado, necesitas más
    const catchUpHours = Math.abs(hoursDifference) * 0.3; // 30% de la diferencia
    return dailyGoalAdjusted + catchUpHours;
  }

  // Si vas al día, mantén el ritmo
  return dailyGoalAdjusted;
};