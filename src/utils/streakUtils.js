// Sistema de rachas - días consecutivos de actividad
export const calculateStreak = (activities) => {
  if (!activities || activities.length === 0) {
    return { current: 0, longest: 0, lastActivityDate: null };
  }

  // Ordenar actividades por fecha (más reciente primero)
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Obtener fechas únicas (sin duplicados del mismo día)
  const uniqueDates = [...new Set(sortedActivities.map(a => a.date.split('T')[0]))];
  
  if (uniqueDates.length === 0) {
    return { current: 0, longest: 0, lastActivityDate: null };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calcular racha actual
  let currentStreak = 0;
  let checkDate = new Date(today);
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const activityDate = new Date(uniqueDates[i]);
    activityDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((checkDate - activityDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === currentStreak) {
      currentStreak++;
    } else if (diffDays > currentStreak) {
      break;
    }
  }

  // Calcular racha más larga
  let longestStreak = 1;
  let tempStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return {
    current: currentStreak,
    longest: Math.max(longestStreak, currentStreak),
    lastActivityDate: uniqueDates[0]
  };
};

export const getStreakEmoji = (streak) => {
  if (streak >= 30) return '🔥🔥🔥';
  if (streak >= 14) return '🔥🔥';
  if (streak >= 7) return '🔥';
  if (streak >= 3) return '⭐';
  return '✨';
};

export const getStreakMessage = (streak) => {
  if (streak >= 30) return '¡Increíble! Un mes completo';
  if (streak >= 14) return '¡Excelente! Dos semanas seguidas';
  if (streak >= 7) return '¡Muy bien! Una semana completa';
  if (streak >= 3) return '¡Buen ritmo! Sigue así';
  if (streak >= 1) return 'Comenzando la racha';
  return 'Registra actividad hoy';
};