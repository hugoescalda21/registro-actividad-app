import React, { useState } from 'react';
import { Calendar, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmModal from './ConfirmModal';
import { formatDateWithWeekday, formatDate } from '../utils/dateUtils';

const HistoryView = ({ activities, onEdit, onDelete }) => {
  const { confirmState, showConfirm, closeConfirm } = useConfirm();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const filteredActivities = activities
    .filter(activity => {
      // Parsear la fecha correctamente
      const [year, month, day] = activity.date.split('-').map(Number);
      const activityMonth = month;
      const activityYear = year;
      
      const matchesMonth = activityMonth === selectedMonth;
      const matchesYear = activityYear === selectedYear;
      const matchesSearch = searchTerm === '' || 
        activity.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(activity.date).includes(searchTerm);
      
      return matchesMonth && matchesYear && matchesSearch;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date) > 0 ? -1 : 1);

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

  const handleDeleteClick = (activity) => {
    const formattedDate = formatDate(activity.date);

    showConfirm({
      title: '¿Eliminar actividad?',
      message: `Se eliminará la actividad del ${formattedDate}. Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: () => onDelete(activity.id)
    });
  };

  const totalHours = filteredActivities.reduce((sum, act) => sum + (act.hours || 0), 0);
  const totalStudies = filteredActivities.reduce((sum, act) => sum + (act.studies || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header con controles */}
      <div className="card-gradient p-5 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-7 h-7 text-blue-600" />
          Historial de Actividades
        </h2>

        {/* Navegación de mes/año */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousMonth}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">
              {months[selectedMonth - 1]} {selectedYear}
            </h3>
            <p className="text-sm text-gray-600">
              {filteredActivities.length} actividad{filteredActivities.length !== 1 ? 'es' : ''}
            </p>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por notas o fecha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white"
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* Resumen rápido */}
        {filteredActivities.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-200">
              <p className="text-xs font-semibold text-blue-600 mb-1">Total Horas</p>
              <p className="text-2xl font-bold text-blue-800">{totalHours.toFixed(1)}h</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 border-2 border-yellow-200">
              <p className="text-xs font-semibold text-yellow-600 mb-1">Estudios</p>
              <p className="text-2xl font-bold text-yellow-800">{totalStudies}</p>
            </div>
          </div>
        )}
      </div>

      {/* Lista de actividades */}
      {filteredActivities.length === 0 ? (
        <div className="card-gradient p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No hay actividades
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'No se encontraron resultados para tu búsqueda'
              : `No hay actividades registradas en ${months[selectedMonth - 1]} ${selectedYear}`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map(activity => (
            <div
              key={activity.id}
              className="card-gradient p-4 hover-lift transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-gray-800">
                      {formatDateWithWeekday(activity.date)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {activity.hours > 0 && (
                      <span className="badge badge-primary">
                        ⏱️ {activity.hours}h
                      </span>
                    )}
                    {activity.studies > 0 && (
                      <span className="badge badge-warning">
                        🎓 {activity.studies} estudio{activity.studies !== 1 ? 's' : ''}
                      </span>
                    )}
                    {activity.approvedHours > 0 && (
                      <span className="badge badge-success">
                        ✅ {activity.approvedHours}h aprobadas
                      </span>
                    )}
                  </div>

                  {activity.notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      💭 {activity.notes}
                    </p>
                  )}

                  {activity.approvedDetail && (
                    <p className="text-sm text-green-700 mt-2 bg-green-50 p-2 rounded-lg border border-green-200">
                      📋 {activity.approvedDetail}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(activity)}
                    className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors active:scale-95"
                    title="Editar"
                    aria-label="Editar actividad"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(activity)}
                    className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors active:scale-95"
                    title="Eliminar"
                    aria-label="Eliminar actividad"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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