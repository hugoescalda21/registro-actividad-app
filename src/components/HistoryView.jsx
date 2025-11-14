import React, { useState, useMemo } from 'react';
import { Calendar, Search, Edit2, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmModal from './ConfirmModal';

const HistoryView = ({ activities, onEdit, onDelete }) => {
  const { confirmState, showConfirm, closeConfirm } = useConfirm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Obtener años disponibles
  const availableYears = useMemo(() => {
    const years = [...new Set(activities.map(a => new Date(a.date).getFullYear()))];
    return years.sort((a, b) => b - a);
  }, [activities]);

  // Filtrar actividades
  const filteredActivities = useMemo(() => {
    return activities
      .filter(activity => {
        const activityDate = new Date(activity.date);
        const matchesMonth = activityDate.getMonth() + 1 === selectedMonth;
        const matchesYear = activityDate.getFullYear() === selectedYear;
        const matchesSearch = searchTerm === '' || 
          activity.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.approvedDetail?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesMonth && matchesYear && matchesSearch;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [activities, selectedMonth, selectedYear, searchTerm]);

  // Calcular totales del mes
  const monthTotals = useMemo(() => {
    return {
      hours: filteredActivities.reduce((sum, a) => sum + (a.hours || 0), 0),
      studies: filteredActivities.reduce((sum, a) => sum + (a.studies || 0), 0),
      approvedHours: filteredActivities.reduce((sum, a) => sum + (a.approvedHours || 0), 0)
    };
  }, [filteredActivities]);

  // Navegación de meses
  const goToPreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(new Date().getMonth() + 1);
    setSelectedYear(new Date().getFullYear());
  };

  const handleDeleteClick = (activity) => {
    const formattedDate = new Date(activity.date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    showConfirm({
      title: '¿Eliminar actividad?',
      message: `Se eliminará la actividad del ${formattedDate}. Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: () => onDelete(activity.id)
    });
  };

  const isCurrentMonth = selectedMonth === new Date().getMonth() + 1 && 
                         selectedYear === new Date().getFullYear();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header con navegación */}
      <div className="card-gradient p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 md:text-2xl">
            <Calendar className="w-6 h-6 text-blue-600" />
            Historial
          </h2>
          {!isCurrentMonth && (
            <button
              onClick={goToCurrentMonth}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Mes actual
            </button>
          )}
        </div>

        {/* Navegación de mes/año */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-target"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1 flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white font-semibold text-gray-800"
              style={{ fontSize: '16px' }}
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white font-semibold text-gray-800"
              style={{ fontSize: '16px' }}
            >
              {availableYears.length > 0 ? (
                availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))
              ) : (
                <option value={new Date().getFullYear()}>
                  {new Date().getFullYear()}
                </option>
              )}
            </select>
          </div>

          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-target"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white"
            style={{ fontSize: '16px' }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Resumen del mes */}
      {filteredActivities.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-xs font-semibold opacity-90 mb-1">HORAS TOTALES</p>
            <p className="text-2xl md:text-3xl font-bold">{monthTotals.hours.toFixed(1)}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-xs font-semibold opacity-90 mb-1">ESTUDIOS</p>
            <p className="text-2xl md:text-3xl font-bold">{monthTotals.studies}</p>
          </div>
          {monthTotals.approvedHours > 0 && (
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg col-span-2 md:col-span-1">
              <p className="text-xs font-semibold opacity-90 mb-1">HORAS APROBADAS</p>
              <p className="text-2xl md:text-3xl font-bold">{monthTotals.approvedHours.toFixed(1)}</p>
            </div>
          )}
        </div>
      )}

      {/* Lista de actividades */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="card-gradient p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No hay actividades
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'No se encontraron actividades con ese criterio de búsqueda'
                : `No hay actividades registradas en ${months[selectedMonth - 1]} ${selectedYear}`
              }
            </p>
          </div>
        ) : (
          filteredActivities.map(activity => (
            <div
              key={activity.id}
              className="card-gradient p-4 md:p-5 hover-lift border-l-4 border-blue-500"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <p className="font-bold text-gray-800 text-base md:text-lg">
                      {new Date(activity.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(activity)}
                    className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors touch-target"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(activity)}
                    className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors touch-target"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-3">
                {activity.hours > 0 && (
                  <div className="bg-blue-50 rounded-lg p-2 md:p-3">
                    <p className="text-xs text-blue-600 font-semibold mb-1">HORAS</p>
                    <p className="text-lg md:text-xl font-bold text-blue-700">{activity.hours}</p>
                  </div>
                )}
                {activity.studies > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-2 md:p-3">
                    <p className="text-xs text-yellow-600 font-semibold mb-1">ESTUDIOS</p>
                    <p className="text-lg md:text-xl font-bold text-yellow-700">{activity.studies}</p>
                  </div>
                )}
                {activity.approvedHours > 0 && (
                  <div className="bg-green-50 rounded-lg p-2 md:p-3 col-span-2">
                    <p className="text-xs text-green-600 font-semibold mb-1">HORAS APROBADAS</p>
                    <p className="text-lg md:text-xl font-bold text-green-700">{activity.approvedHours}</p>
                  </div>
                )}
              </div>

              {/* Detalle de horas aprobadas */}
              {activity.approvedDetail && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 mb-3">
                  <p className="text-xs text-green-600 font-bold mb-1">DETALLE DE HORAS APROBADAS</p>
                  <p className="text-sm text-green-800">{activity.approvedDetail}</p>
                </div>
              )}

              {/* Notas */}
              {activity.notes && (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-bold mb-1">NOTAS</p>
                  <p className="text-sm text-gray-700">{activity.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Total de registros */}
      {filteredActivities.length > 0 && (
        <div className="text-center text-sm text-gray-500 font-medium">
          {filteredActivities.length} {filteredActivities.length === 1 ? 'registro' : 'registros'} en {months[selectedMonth - 1]} {selectedYear}
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        type={confirmState.type}
      />
    </div>
  );
};

export default HistoryView;
