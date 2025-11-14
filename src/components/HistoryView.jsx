import React, { useState } from 'react';
import { Calendar, Clock, Edit2, Trash2, Search, Filter, BookOpen, Video, Users, Award, ChevronDown, ChevronUp } from 'lucide-react';

const HistoryView = ({ activities, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Obtener años únicos
  const years = [...new Set(activities.map(a => new Date(a.date).getFullYear()))].sort((a, b) => b - a);

  // Filtrar actividades
  const filteredActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    const matchesSearch = activity.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         activityDate.toLocaleDateString('es-ES').includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || activityDate.getFullYear() === parseInt(selectedYear);
    const matchesMonth = selectedMonth === 'all' || activityDate.getMonth() + 1 === parseInt(selectedMonth);
    
    return matchesSearch && matchesYear && matchesMonth;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Agrupar por mes
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!groups[key]) {
      groups[key] = {
        month: date.getMonth(),
        year: date.getFullYear(),
        activities: []
      };
    }
    groups[key].activities.push(activity);
    return groups;
  }, {});

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header con filtros */}
      <div className="card-gradient p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="w-7 h-7 text-blue-600" />
          Historial Completo
        </h2>

        {/* Buscador */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por fecha o notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white"
          />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              Año
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white"
            >
              <option value="all">Todos los años</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              Mes
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white"
            >
              <option value="all">Todos los meses</option>
              {monthNames.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickStat
            icon={Calendar}
            label="Total"
            value={filteredActivities.length}
            color="blue"
          />
          <QuickStat
            icon={Clock}
            label="Horas"
            value={filteredActivities.reduce((sum, a) => sum + a.hours, 0).toFixed(1)}
            color="green"
          />
          <QuickStat
            icon={BookOpen}
            label="Publicaciones"
            value={filteredActivities.reduce((sum, a) => sum + (a.placements || 0), 0)}
            color="purple"
          />
          <QuickStat
            icon={Award}
            label="Estudios"
            value={filteredActivities.reduce((sum, a) => sum + (a.studies || 0), 0)}
            color="yellow"
          />
        </div>
      </div>

      {/* Actividades agrupadas por mes */}
      {Object.keys(groupedActivities).length > 0 ? (
        <div className="space-y-6">
          {Object.values(groupedActivities).map((group) => (
            <div key={`${group.year}-${group.month}`} className="card-gradient p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {monthNames[group.month]} {group.year}
                <span className="ml-auto badge badge-primary">
                  {group.activities.length} {group.activities.length === 1 ? 'actividad' : 'actividades'}
                </span>
              </h3>
              <div className="space-y-3">
                {group.activities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    expanded={expandedId === activity.id}
                    onToggle={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-gradient p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No se encontraron actividades
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

// Componente de estadística rápida
const QuickStat = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className={`${colors[color]} rounded-xl p-4 text-center`}>
      <Icon className="w-5 h-5 mx-auto mb-2" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
};

// Componente de item de actividad
const ActivityItem = ({ activity, expanded, onToggle, onEdit, onDelete }) => {
  return (
    <div className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-r-xl overflow-hidden hover-lift transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-lg font-bold text-gray-800 mb-1">
              {new Date(activity.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <div className="flex items-center gap-3">
              <span className="badge" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
                <Clock className="w-3 h-3 mr-1" />
                {activity.hours}h
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(activity)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(activity.id)}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Datos básicos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {activity.placements > 0 && (
            <ActivityBadge icon={BookOpen} value={activity.placements} label="Publicaciones" color="green" />
          )}
          {activity.videos > 0 && (
            <ActivityBadge icon={Video} value={activity.videos} label="Videos" color="red" />
          )}
          {activity.returnVisits > 0 && (
            <ActivityBadge icon={Users} value={activity.returnVisits} label="Revisitas" color="purple" />
          )}
          {activity.studies > 0 && (
            <ActivityBadge icon={Award} value={activity.studies} label="Estudios" color="yellow" />
          )}
        </div>

        {/* Detalles expandidos */}
        {expanded && activity.notes && (
          <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>💭</span>
              Notas
            </p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {activity.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Badge de actividad
const ActivityBadge = ({ icon: Icon, value, label, color }) => {
  const colors = {
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  return (
    <div className={`${colors[color]} border rounded-lg p-2 text-center`}>
      <Icon className="w-4 h-4 mx-auto mb-1" />
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
};

export default HistoryView;