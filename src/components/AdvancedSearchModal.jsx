import React, { useState } from 'react';
import { X, Search, Filter, Download } from 'lucide-react';

const AdvancedSearchModal = ({ isOpen, onClose, activities, onExport }) => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    minHours: '',
    maxHours: '',
    hasStudies: false,
    hasPlacements: false,
    hasVideos: false,
    hasReturnVisits: false
  });

  if (!isOpen) return null;

  const filteredActivities = activities.filter(act => {
    const actDate = new Date(act.date);

    if (filters.dateFrom && actDate < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && actDate > new Date(filters.dateTo)) return false;

    const totalHours = (act.hours || 0) + (act.approvedHours || 0);
    if (filters.minHours && totalHours < parseFloat(filters.minHours)) return false;
    if (filters.maxHours && totalHours > parseFloat(filters.maxHours)) return false;

    if (filters.hasStudies && (!act.studies || act.studies === 0)) return false;
    if (filters.hasPlacements && (!act.placements || act.placements === 0)) return false;
    if (filters.hasVideos && (!act.videos || act.videos === 0)) return false;
    if (filters.hasReturnVisits && (!act.returnVisits || act.returnVisits === 0)) return false;

    return true;
  });

  const handleClear = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      minHours: '',
      maxHours: '',
      hasStudies: false,
      hasPlacements: false,
      hasVideos: false,
      hasReturnVisits: false
    });
  };

  const handleExport = () => {
    onExport(filteredActivities);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Filter className="w-7 h-7" />
              Búsqueda Avanzada
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Date Range */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Rango de Fechas</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Desde</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Hasta</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Hours Range */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Horas</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Mínimo</label>
                <input
                  type="number"
                  step="0.5"
                  value={filters.minHours}
                  onChange={(e) => setFilters({ ...filters, minHours: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Máximo</label>
                <input
                  type="number"
                  step="0.5"
                  value={filters.maxHours}
                  onChange={(e) => setFilters({ ...filters, maxHours: e.target.value })}
                  placeholder="∞"
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Activity Types */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Debe incluir</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer
                              hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.hasStudies}
                  onChange={(e) => setFilters({ ...filters, hasStudies: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-gray-900 dark:text-white">🎓 Estudios Bíblicos</span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer
                              hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.hasPlacements}
                  onChange={(e) => setFilters({ ...filters, hasPlacements: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-gray-900 dark:text-white">📚 Colocaciones</span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer
                              hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.hasVideos}
                  onChange={(e) => setFilters({ ...filters, hasVideos: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-gray-900 dark:text-white">📱 Videos</span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer
                              hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.hasReturnVisits}
                  onChange={(e) => setFilters({ ...filters, hasReturnVisits: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-gray-900 dark:text-white">🔄 Revisitas</span>
              </label>
            </div>
          </div>

          {/* Results */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Actividades encontradas</div>
                <div className="text-3xl font-bold text-blue-600">{filteredActivities.length}</div>
              </div>
              {filteredActivities.length > 0 && (
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                           font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                     rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Limpiar Filtros
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 btn-primary rounded-xl font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchModal;
