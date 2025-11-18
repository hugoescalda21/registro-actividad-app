import React, { useState, useMemo } from 'react';
import CustomGoalModal from './CustomGoalModal';
import StatsHeader from './stats/StatsHeader';
import GoalProgress from './stats/GoalProgress';
import StatsCards from './stats/StatsCards';
import WeeklyHoursChart from './stats/WeeklyHoursChart';
import ActivityDistributionChart from './stats/ActivityDistributionChart';
import MonthActivityList from './stats/MonthActivityList';
import { getCustomGoal, saveCustomGoal } from '../utils/goalUtils';
import { getMonthYear } from '../utils/dateUtils';

const StatsView = ({ activities, publisherType, config, publisherTypes }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Obtener meta personalizada o usar la predeterminada
  const customGoal = getCustomGoal(selectedMonth, selectedYear);
  const goals = customGoal || config;

  // Filtrar actividades del mes seleccionado
  const monthActivities = useMemo(() => {
    return activities.filter(activity => {
      const { month, year } = getMonthYear(activity.date);
      return month === selectedMonth && year === selectedYear;
    });
  }, [activities, selectedMonth, selectedYear]);

  // Calcular estadísticas (CORREGIDO - Horas totales = predicación + aprobadas)
  const stats = useMemo(() => ({
    // Total de horas = predicación + aprobadas
    totalHours: monthActivities.reduce((sum, act) => {
      const preachingHours = act.hours || 0;
      const approvedHours = act.approvedHours || 0;
      return sum + preachingHours + approvedHours;
    }, 0),
    // Solo horas de predicación pura
    preachingHours: monthActivities.reduce((sum, act) => sum + (act.hours || 0), 0),
    // Solo horas aprobadas
    approvedHours: monthActivities.reduce((sum, act) => sum + (act.approvedHours || 0), 0),
    totalPlacements: monthActivities.reduce((sum, act) => sum + (act.placements || 0), 0),
    totalVideos: monthActivities.reduce((sum, act) => sum + (act.videos || 0), 0),
    totalReturnVisits: monthActivities.reduce((sum, act) => sum + (act.returnVisits || 0), 0),
    totalStudies: monthActivities.reduce((sum, act) => sum + (act.studies || 0), 0)
  }), [monthActivities]);

  // Calcular progreso
  const progress = useMemo(() => {
    if (!goals.hours) return 0;
    return Math.min((stats.totalHours / goals.hours) * 100, 100);
  }, [stats.totalHours, goals.hours]);

  // Calcular racha
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

  // Datos para gráfico de barras por semana (CORREGIDO - incluye aprobadas)
  const weeklyData = useMemo(() => {
    const weeks = [
      { name: 'Sem 1', hours: 0 },
      { name: 'Sem 2', hours: 0 },
      { name: 'Sem 3', hours: 0 },
      { name: 'Sem 4', hours: 0 },
      { name: 'Sem 5', hours: 0 }
    ];

    monthActivities.forEach(activity => {
      const { month, year } = getMonthYear(activity.date);
      if (month === selectedMonth && year === selectedYear) {
        const day = parseInt(activity.date.split('-')[2]);
        const weekIndex = Math.min(Math.floor((day - 1) / 7), 4);
        // Sumar predicación + aprobadas
        const activityHours = (activity.hours || 0) + (activity.approvedHours || 0);
        weeks[weekIndex].hours += activityHours;
      }
    });

    return weeks.filter(week => week.hours > 0 || weeks.some(w => w.hours > 0));
  }, [monthActivities, selectedMonth, selectedYear]);

  // Datos para gráfico circular
  const activityTypeData = useMemo(() => {
    const data = [];

    if (stats.preachingHours > 0) {
      data.push({ name: 'Predicación', value: stats.preachingHours, color: '#3b82f6' });
    }
    if (stats.approvedHours > 0) {
      data.push({ name: 'Horas Aprobadas', value: stats.approvedHours, color: '#10b981' });
    }
    if (stats.totalStudies > 0) {
      data.push({ name: 'Estudios', value: stats.totalStudies, color: '#f59e0b' });
    }

    return data;
  }, [stats]);

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleSaveGoal = (goalData) => {
    saveCustomGoal(selectedMonth, selectedYear, goalData);
    setShowGoalModal(false);
    window.location.reload();
  };

  const isGoalMet = goals.hours && stats.totalHours >= goals.hours;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header con navegación de mes */}
      <StatsHeader
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        customGoal={customGoal}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onEditGoal={() => setShowGoalModal(true)}
      />

      {/* Progreso de meta */}
      {goals.hours > 0 && (
        <GoalProgress
          stats={stats}
          goals={goals}
          config={config}
          progress={progress}
          isGoalMet={isGoalMet}
        />
      )}

      {/* Cards de estadísticas */}
      <StatsCards
        stats={stats}
        goals={goals}
        config={config}
        streak={streak}
      />

      {/* Gráfico de horas por semana */}
      {config.canLogHours && (
        <WeeklyHoursChart weeklyData={weeklyData} />
      )}

      {/* Gráfico circular de distribución */}
      <ActivityDistributionChart activityTypeData={activityTypeData} />

      {/* Lista de actividades del mes */}
      <MonthActivityList monthActivities={monthActivities} />

      {/* Modal de meta personalizada */}
      {showGoalModal && (
        <CustomGoalModal
          isOpen={showGoalModal}
          onClose={() => setShowGoalModal(false)}
          onSave={handleSaveGoal}
          month={selectedMonth}
          year={selectedYear}
          currentGoals={goals}
          publisherTypes={publisherTypes}
        />
      )}
    </div>
  );
};

export default StatsView;
