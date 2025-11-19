import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Users, TrendingUp, X, Download, Upload } from 'lucide-react';
import {
  loadOutings,
  getOutingsStats,
  filterOutings,
  sortOutings,
  OUTING_TYPES,
  getUniqueCompanions,
  deleteOuting,
  exportOutingsToJSON,
  importOutingsFromJSON,
  saveOutings
} from '../utils/congregationOutingsUtils';
import OutingForm from './OutingForm';
import OutingCard from './OutingCard';
import OutingDetail from './OutingDetail';

const CongregationOutingsView = () => {
  const [outings, setOutings] = useState([]);
  const [filteredOutings, setFilteredOutings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOuting, setSelectedOuting] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editingOuting, setEditingOuting] = useState(null);

  // Cargar salidas al montar el componente
  useEffect(() => {
    const loadedOutings = loadOutings();
    setOutings(loadedOutings);
    setFilteredOutings(loadedOutings);
  }, []);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let result = filterOutings(outings, {
      search: searchTerm,
      type: typeFilter
    });

    result = sortOutings(result, sortBy);
    setFilteredOutings(result);
  }, [outings, searchTerm, typeFilter, sortBy]);

  const stats = getOutingsStats(outings);
  const uniqueCompanions = getUniqueCompanions(outings);

  const handleAddOuting = () => {
    setEditingOuting(null);
    setShowForm(true);
  };

  const handleEditOuting = (outing) => {
    setEditingOuting(outing);
    setShowForm(true);
    setShowDetail(false);
  };

  const handleDeleteOuting = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta salida?')) {
      deleteOuting(id);
      const updated = loadOutings();
      setOutings(updated);
      setShowDetail(false);
    }
  };

  const handleFormSuccess = () => {
    const updated = loadOutings();
    setOutings(updated);
    setShowForm(false);
    setEditingOuting(null);
  };

  const handleViewDetail = (outing) => {
    setSelectedOuting(outing);
    setShowDetail(true);
  };

  const handleExport = () => {
    exportOutingsToJSON(outings);
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const importedOutings = await importOutingsFromJSON(file);
      if (window.confirm(`¿Deseas importar ${importedOutings.length} salidas? Los datos actuales se combinarán.`)) {
        const combined = [...outings, ...importedOutings];
        saveOutings(combined);
        setOutings(combined);
        alert('✅ Salidas importadas correctamente');
      }
    } catch (error) {
      console.error('Error al importar:', error);
      alert('❌ Error al importar el archivo. Verifica que sea un archivo válido.');
    }
  };

  if (showForm) {
    return (
      <OutingForm
        outing={editingOuting}
        onClose={() => {
          setShowForm(false);
          setEditingOuting(null);
        }}
        onSuccess={handleFormSuccess}
        companions={uniqueCompanions}
      />
    );
  }

  if (showDetail && selectedOuting) {
    return (
      <OutingDetail
        outing={selectedOuting}
        onClose={() => {
          setShowDetail(false);
          setSelectedOuting(null);
        }}
        onEdit={handleEditOuting}
        onDelete={handleDeleteOuting}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            Salidas de Congregación
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Registra tu participación en las salidas a predicar
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total Salidas</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600">{stats.thisMonth}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Este Mes</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
          <div className="text-2xl font-bold text-purple-600">{stats.totalHours}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Horas Totales</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-orange-200 dark:border-orange-800">
          <div className="text-2xl font-bold text-orange-600">{stats.averageHoursPerOuting}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Promedio/Salida</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por territorio, compañero o notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
              showFilters
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:border-blue-500 transition-all"
          >
            <option value="date-desc">Más reciente</option>
            <option value="date-asc">Más antigua</option>
            <option value="hours-desc">Más horas</option>
            <option value="hours-asc">Menos horas</option>
            <option value="type">Por tipo</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600 space-y-3 animate-slideDown">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Filtrar por tipo</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => setTypeFilter('all')}
                className={`p-2 rounded-lg border-2 transition-all text-sm ${
                  typeFilter === 'all'
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 font-semibold'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                📋 Todas ({stats.total})
              </button>

              {Object.values(OUTING_TYPES).map(type => (
                <button
                  key={type.id}
                  onClick={() => setTypeFilter(type.id)}
                  className={`p-2 rounded-lg border-2 transition-all text-sm ${
                    typeFilter === type.id
                      ? `bg-${type.color}-50 dark:bg-${type.color}-900/30 border-${type.color}-500 text-${type.color}-600 font-semibold`
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {type.emoji} {type.label.split(' ')[0]} ({stats.byType[type.id] || 0})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleAddOuting}
          className="flex-1 btn-primary py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Nueva Salida
        </button>

        <button
          onClick={handleExport}
          className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
          title="Exportar salidas"
        >
          <Download className="w-5 h-5" />
        </button>

        <label className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors cursor-pointer">
          <Upload className="w-5 h-5" />
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      {/* Outings List */}
      {filteredOutings.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {searchTerm || typeFilter !== 'all'
              ? 'No se encontraron salidas'
              : 'Aún no hay salidas registradas'}
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-4">
            {searchTerm || typeFilter !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Empieza registrando tu primera salida a predicar'}
          </p>
          {!searchTerm && typeFilter === 'all' && (
            <button
              onClick={handleAddOuting}
              className="btn-primary py-2 px-6 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Registrar Primera Salida
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOutings.map(outing => (
            <OutingCard
              key={outing.id}
              outing={outing}
              onClick={() => handleViewDetail(outing)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CongregationOutingsView;
