import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Award, Calendar, Target, Flame, Edit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import CustomGoalModal from './CustomGoalModal';
import { getCustomGoal, saveCustomGoal } from '../utils/goalUtils';
import { getMonthYear, formatDateShort } from '../utils/dateUtils';

const StatsView = ({ activities, publisherType, config, publisherTypes }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showGoalModal, setShowGoalModal] = useState(false);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

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

  // Calcular estadísticas
  const stats = useMemo(() => ({
    totalHours: monthActivities.reduce((sum, act) => sum + (act.hours || 0), 0),
    totalPlacements: monthActivities.reduce((sum, act) => sum + (act.placements || 0), 0),
    totalVideos: monthActivities.reduce((sum, act) => sum + (act.videos || 0), 0),
    totalReturnVisits: monthActivities.reduce((sum, act) => sum + (act.returnVisits || 0), 0),
    totalStudies: monthActivities.reduce((sum, act) => sum + (act.studies || 0), 0),
    totalApprovedHours: monthActivities.reduce((sum, act) => sum + (act.approvedHours || 0), 0)
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

  // Datos para gráfico de barras por semana
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
        weeks[weekIndex].hours += activity.hours || 0;
      }
    });

    return weeks.filter(week => week.hours > 0 || weeks.some(w => w.hours > 0));
  }, [monthActivities, selectedMonth, selectedYear]);

  // Datos para gráfico circular
  const activityTypeData = useMemo(() => {
    const data = [];
    
    if (stats.totalHours > 0) {
      data.push({ name: 'Horas', value: stats.totalHours, color: '#3b82f6' });
    }
    if (stats.totalStudies > 0) {
      data.push({ name: 'Estudios', value: stats.totalStudies, color: '#f59e0b' });
    }
    if (stats.totalApprovedHours > 0) {
      data.push({ name: 'Horas Aprobadas', value: stats.totalApprovedHours, color: '#10b981' });
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
      <div className="card-gradient p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Estadísticas
          </h2>
          <button
            onClick={() => setShowGoalModal(true)}
            className="p-2 hover:bg-blue-100 rounded-xl transition-colors active:scale-95"
            title="Editar meta del mes"
          >
            <Edit className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousMonth}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
          >
            ←
          </button>

          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">
              {months[selectedMonth - 1]} {selectedYear}
            </h3>
            {customGoal && (
              <p className="text-xs text-blue-600 font-semibold">Meta personalizada</p>
            )}
          </div>

          <button
            onClick={handleNextMonth}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
          >
            →
          </button>
        </div>
      </div>

      {/* Progreso de meta */}
      {goals.hours > 0 && (
        <div className="card-gradient p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Meta del Mes</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-800">
                {stats.totalHours.toFixed(1)}h
              </span>
              <span className="text-sm text-gray-500"> / {goals.hours}h</span>
            </div>
          </div>

          <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                isGoalMet 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">
              {progress.toFixed(0)}% completado
            </span>
            {isGoalMet && (
              <span className="text-green-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                ¡Meta alcanzada!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {config.canLogHours && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold opacity-90">Horas</span>
              <span className="text-2xl">⏱️</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalHours.toFixed(1)}</p>
            {goals.hours > 0 && (
              <p className="text-xs opacity-75 mt-1">Meta: {goals.hours}h</p>
            )}
          </div>
        )}

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold opacity-90">Estudios</span>
            <span className="text-2xl">🎓</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalStudies}</p>
          {goals.studies > 0 && (
            <p className="text-xs opacity-75 mt-1">Meta: {goals.studies}</p>
          )}
        </div>

        {config.canLogApproved && stats.totalApprovedHours > 0 && (
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold opacity-90">Aprobadas</span>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalApprovedHours.toFixed(1)}</p>
            <p className="text-xs opacity-75 mt-1">horas</p>
          </div>
        )}

        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold opacity-90">Racha</span>
            <Flame className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">{streak}</p>
          <p className="text-xs opacity-75 mt-1">días seguidos</p>
        </div>
      </div>

      {/* Gráfico de horas por semana */}
      {config.canLogHours && weeklyData.length > 0 && (
        <div className="card-gradient p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Horas por Semana
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '8px 12px'
                }}
                formatter={(value) => [`${value.toFixed(1)}h`, 'Horas']}
              />
              <Bar 
                dataKey="hours" 
                fill="url(#colorGradient)" 
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico circular de distribución */}
      {activityTypeData.length > 0 && (
        <div className="card-gradient p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Distribución de Actividad
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={activityTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {activityTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '8px 12px'
                }}
                formatter={(value) => value.toFixed(1)}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Lista de actividades del mes */}
      {monthActivities.length > 0 && (
        <div className="card-gradient p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Actividades del Mes ({monthActivities.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {monthActivities
              .sort((a, b) => b.date.localeCompare(a.date))
              .map(activity => (
                <div 
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {formatDateShort(activity.date)}
                    </span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    {activity.hours > 0 && (
                      <span className="badge badge-primary">{activity.hours}h</span>
                    )}
                    {activity.studies > 0 && (
                      <span className="badge badge-warning">{activity.studies} 🎓</span>
                    )}
                    {activity.approvedHours > 0 && (
                      <span className="badge badge-success">{activity.approvedHours}h ✅</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Mensaje si no hay actividades */}
      {monthActivities.length === 0 && (
        <div className="card-gradient p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No hay actividades este mes
          </h3>
          <p className="text-gray-500">
            Comienza a registrar tu actividad para ver estadísticas
          </p>
        </div>
      )}

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