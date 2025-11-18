import React from 'react';
import { Target, TrendingUp, Calendar, Flame, Play } from 'lucide-react';
import { calculateMonthlyProgress, getMotivationalMessage, getTodayRecommendation } from '../utils/planningUtils';

const DailyGoalCard = ({ activities, config, onStartStopwatch }) => {
  // No mostrar si no hay meta de horas
  if (!config.canLogHours || config.hours === 0) {
    return null;
  }

  const progress = calculateMonthlyProgress(activities, config);
  const motivation = getMotivationalMessage(progress);
  const todayGoal = getTodayRecommendation(progress);

  const getStatusColor = () => {
    switch (motivation.color) {
      case 'green': return 'from-green-500 to-emerald-600';
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'orange': return 'from-orange-500 to-orange-600';
      case 'red': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBgColor = () => {
    switch (motivation.color) {
      case 'green': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
      case 'blue': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700';
      case 'orange': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700';
      case 'red': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      default: return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusTextColor = () => {
    switch (motivation.color) {
      case 'green': return 'text-green-800 dark:text-green-300';
      case 'blue': return 'text-blue-800 dark:text-blue-300';
      case 'orange': return 'text-orange-800 dark:text-orange-300';
      case 'red': return 'text-red-800 dark:text-red-300';
      default: return 'text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="card-gradient p-5 md:p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`bg-gradient-to-r ${getStatusColor()} p-2 rounded-xl`}>
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Meta de Hoy</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
        </div>
        <div className={`text-3xl ${motivation.emoji === '🎉' ? 'animate-bounce' : ''}`}>
          {motivation.emoji}
        </div>
      </div>

      {/* Meta de hoy destacada */}
      <div className={`bg-gradient-to-r ${getStatusColor()} rounded-2xl p-4 mb-4 shadow-lg`}>
        <div className="text-center">
          <p className="text-white text-sm font-semibold opacity-90 mb-1">
            Meta Sugerida para Hoy
          </p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold text-white">
              {todayGoal.toFixed(1)}
            </span>
            <span className="text-2xl text-white opacity-90">horas</span>
          </div>
        </div>
      </div>

      {/* Mensaje motivacional */}
      <div className={`${getStatusBgColor()} rounded-xl p-4 mb-4 border-2`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">
            {motivation.emoji}
          </div>
          <div className="flex-1">
            <h4 className={`font-bold ${getStatusTextColor()} mb-1`}>
              {motivation.title}
            </h4>
            <p className={`text-sm ${getStatusTextColor()} opacity-80`}>
              {motivation.message}
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas del mes */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{progress.daysRemaining}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">días restantes</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {progress.progressPercentage.toFixed(0)}%
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">completado</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {progress.hoursRemaining.toFixed(1)}h
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">faltan</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progreso del Mes</span>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
            {progress.totalHours.toFixed(1)}h / {progress.monthlyGoal}h
          </span>
        </div>
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-gradient-to-r ${getStatusColor()}`}
            style={{ width: `${Math.min(progress.progressPercentage, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Proyección */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-4 border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Proyección Final</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {progress.projectedTotal.toFixed(1)}h
            </p>
          </div>
          <div className="text-right">
            {progress.willMeetGoal ? (
              <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold">
                ✅ Alcanzarás meta
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold">
                ⚠️ Necesitas más ritmo
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Al ritmo actual de {(progress.projectedTotal / progress.daysInMonth).toFixed(1)}h por día
        </p>
      </div>

      {/* Botón de acción */}
      <button
        onClick={onStartStopwatch}
        className={`w-full bg-gradient-to-r ${getStatusColor()} text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95`}
      >
        <Play className="w-5 h-5" />
        <span>Iniciar Cronómetro</span>
      </button>
    </div>
  );
};

export default DailyGoalCard;