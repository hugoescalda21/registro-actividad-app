import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Clock, BookOpen, Video, Users, Award, TrendingUp, ChevronLeft, ChevronRight, Target, Settings, Share2, Copy, Download } from 'lucide-react';
import { shareViaWhatsApp, copyToClipboard } from '../utils/shareUtils';
import { getCustomGoal, hasCustomGoal } from '../utils/goalUtils';
import CustomGoalModal from './CustomGoalModal';
import StreakCard from './StreakCard';

const StatsView = ({ activities, publisherType, config, publisherTypes }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showGoalModal, setShowGoalModal] = useState(false);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getGoalsForMonth = () => {
    const customGoal = getCustomGoal(selectedMonth, selectedYear);
    if (customGoal) return customGoal;
    return publisherTypes[publisherType];
  };

  const goals = getGoalsForMonth();
  const isCustomGoal = hasCustomGoal(selectedMonth, selectedYear);

  const filteredActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate.getMonth() + 1 === selectedMonth && 
           activityDate.getFullYear() === selectedYear;
  });

  const stats = {
    totalHours: filteredActivities.reduce((sum, act) => sum + (act.hours || 0), 0),
    totalPlacements: filteredActivities.reduce((sum, act) => sum + (act.placements || 0), 0),
    totalVideos: filteredActivities.reduce((sum, act) => sum + (act.videos || 0), 0),
    totalReturnVisits: filteredActivities.reduce((sum, act) => sum + (act.returnVisits || 0), 0),
    totalStudies: filteredActivities.reduce((sum, act) => sum + (act.studies || 0), 0),
    daysActive: filteredActivities.length
  };

  const progressData = [
    {
      category: 'Horas',
      actual: stats.totalHours,
      meta: goals.hours || 0,
      color: '#3B82F6',
      icon: '⏱️'
    },
    {
      category: 'Publicaciones',
      actual: stats.totalPlacements,
      meta: goals.placements || 0,
      color: '#10B981',
      icon: '📚'
    },
    {
      category: 'Videos',
      actual: stats.totalVideos,
      meta: goals.videos || 0,
      color: '#EF4444',
      icon: '🎥'
    },
    {
      category: 'Revisitas',
      actual: stats.totalReturnVisits,
      meta: goals.returnVisits || 0,
      color: '#8B5CF6',
      icon: '👥'
    },
    {
      category: 'Estudios',
      actual: stats.totalStudies,
      meta: goals.studies || 0,
      color: '#F59E0B',
      icon: '🎓'
    }
  ].filter(item => item.meta > 0);

  const chartData = progressData.map(item => ({
    name: item.category,
    Actual: item.actual,
    Meta: item.meta,
    icon: item.icon
  }));

  const pieData = progressData.map(item => ({
    name: item.category,
    value: item.actual,
    color: item.color
  })).filter(item => item.value > 0);

  const COLORS = progressData.map(item => item.color);

  const getProgressPercentage = (actual, meta) => {
    if (meta === 0) return 0;
    return Math.min(Math.round((actual / meta) * 100), 100);
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
      if (selectedMonth === 12) {
        setSelectedMonth(1);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const handleExport = () => {
    const reportData = {
      mes: monthNames[selectedMonth - 1],
      año: selectedYear,
      tipoPublicador: publisherType,
      estadisticas: stats,
      metas: goals,
      actividades: filteredActivities
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe-${selectedMonth}-${selectedYear}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isCurrentMonth = selectedMonth === new Date().getMonth() + 1 && 
                        selectedYear === new Date().getFullYear();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header con selector de mes */}
      <div className="card-gradient p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousMonth}
            className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover-scale"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              {monthNames[selectedMonth - 1]}
            </h2>
            <p className="text-lg text-gray-600 font-semibold">{selectedYear}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="badge badge-primary">
                {publisherTypes[publisherType].label}
              </span>
              {isCustomGoal && (
                <span className="badge" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}>
                  ⚙️ Personalizado
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isCurrentMonth 
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-gray-100 hover-scale'
            }`}
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <button
          onClick={() => setShowGoalModal(true)}
          className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 font-semibold flex items-center justify-center gap-2 border-2 border-purple-200 hover-lift"
        >
          <Settings className="w-5 h-5" />
          Personalizar Metas de Este Mes
        </button>
      </div>

      {/* Tarjeta de Rachas */}
      <StreakCard activities={activities} />

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Clock}
          label="Horas"
          value={stats.totalHours.toFixed(1)}
          goal={goals.hours}
          color="blue"
          unit="h"
        />
        <StatCard
          icon={BookOpen}
          label="Publicaciones"
          value={stats.totalPlacements}
          goal={goals.placements}
          color="green"
        />
        <StatCard
          icon={Video}
          label="Videos"
          value={stats.totalVideos}
          goal={goals.videos}
          color="red"
        />
        <StatCard
          icon={Users}
          label="Revisitas"
          value={stats.totalReturnVisits}
          goal={goals.returnVisits}
          color="purple"
        />
        <StatCard
          icon={Award}
          label="Estudios"
          value={stats.totalStudies}
          goal={goals.studies}
          color="yellow"
        />
        <StatCard
          icon={Calendar}
          label="Días Activos"
          value={stats.daysActive}
          color="indigo"
          unit={stats.daysActive === 1 ? 'día' : 'días'}
        />
      </div>

      {/* Botones de compartir */}
      <div className="card-gradient p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-blue-600" />
          Compartir Informe
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => shareViaWhatsApp(stats, goals, selectedMonth, selectedYear, monthNames)}
            className="btn-success flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            WhatsApp
          </button>
          <button
            onClick={() => copyToClipboard(stats, goals, selectedMonth, selectedYear, monthNames)}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Copy className="w-5 h-5" />
            Copiar
          </button>
          <button
            onClick={handleExport}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exportar
          </button>
        </div>
      </div>

      {/* Gráfico de Progreso */}
      {progressData.length > 0 && (
        <div className="card-gradient p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Progreso vs Metas
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Bar dataKey="Actual" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Meta" fill="#E5E7EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Pastel */}
      {pieData.length > 0 && (
        <div className="card-gradient p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            Distribución de Actividades
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Historial de actividades */}
      {filteredActivities.length > 0 ? (
        <div className="card-gradient p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            Historial del Mes
          </h2>
          <div className="space-y-3">
            {filteredActivities.sort((a, b) => new Date(b.date) - new Date(a.date)).map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card-gradient p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            Sin actividades registradas
          </h3>
          <p className="text-gray-500">
            No hay actividades para {monthNames[selectedMonth - 1]} {selectedYear}
          </p>
        </div>
      )}

      <CustomGoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        month={selectedMonth}
        year={selectedYear}
        publisherType={publisherType}
        publisherTypes={publisherTypes}
      />
    </div>
  );
};

// Componente de tarjeta de estadística
const StatCard = ({ icon: Icon, label, value, goal, color, unit = '' }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    red: 'from-red-500 to-pink-600',
    purple: 'from-purple-500 to-indigo-600',
    yellow: 'from-yellow-500 to-orange-600',
    indigo: 'from-indigo-500 to-purple-600',
  };

  const bgColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50',
    yellow: 'bg-yellow-50',
    indigo: 'bg-indigo-50',
  };

  const textColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600',
  };

  const progress = goal ? Math.min((value / goal) * 100, 100) : 0;

  return (
    <div className="card hover-lift">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={`${bgColors[color]} p-3 rounded-xl`}>
            <Icon className={`w-5 h-5 ${textColors[color]}`} />
          </div>
          <span className="text-2xl font-bold text-gray-800">
            {value}{unit}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-600 mb-1">{label}</h3>
        {goal > 0 && (
          <>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Meta: {goal}</span>
              <span className="font-semibold">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${colors[color]} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Componente de tarjeta de actividad
const ActivityCard = ({ activity }) => {
  return (
    <div className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white p-5 rounded-r-xl hover-lift">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold text-gray-800 text-lg">
            {new Date(activity.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
          {activity.hours}h
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {activity.placements > 0 && (
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-lg">📚</span>
            <span className="font-medium">{activity.placements} publicaciones</span>
          </div>
        )}
        {activity.videos > 0 && (
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-lg">🎥</span>
            <span className="font-medium">{activity.videos} videos</span>
          </div>
        )}
        {activity.returnVisits > 0 && (
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-lg">👥</span>
            <span className="font-medium">{activity.returnVisits} revisitas</span>
          </div>
        )}
        {activity.studies > 0 && (
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-lg">🎓</span>
            <span className="font-medium">{activity.studies} estudios</span>
          </div>
        )}
      </div>
      {activity.notes && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600 italic flex items-start gap-2">
            <span>💭</span>
            <span>{activity.notes}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsView;