import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Filter, Users, BookOpen, Moon, Calendar } from 'lucide-react';
import {
  loadReturnVisits,
  saveReturnVisits,
  getReturnVisitsStats,
  filterReturnVisits,
  sortReturnVisits,
  RETURN_VISIT_STATUSES
} from '../utils/returnVisitsUtils';
import ReturnVisitCard from './ReturnVisitCard';
import ReturnVisitForm from './ReturnVisitForm';
import ReturnVisitDetail from './ReturnVisitDetail';

const ReturnVisitsView = () => {
  const [returnVisits, setReturnVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Cargar revisitas al iniciar
  useEffect(() => {
    const visits = loadReturnVisits();
    setReturnVisits(visits);
  }, []);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let filtered = filterReturnVisits(returnVisits, {
      search: searchTerm,
      status: statusFilter
    });
    filtered = sortReturnVisits(filtered, sortBy);
    setFilteredVisits(filtered);
  }, [returnVisits, searchTerm, statusFilter, sortBy]);

  // Guardar cambios en localStorage
  const handleSave = (updatedVisits) => {
    setReturnVisits(updatedVisits);
    saveReturnVisits(updatedVisits);
  };

  // Agregar nueva revisita
  const handleAddReturnVisit = (newVisit) => {
    const updated = [...returnVisits, newVisit];
    handleSave(updated);
    setShowAddForm(false);
  };

  // Actualizar revisita existente
  const handleUpdateReturnVisit = (updatedVisit) => {
    const updated = returnVisits.map(rv =>
      rv.id === updatedVisit.id ? updatedVisit : rv
    );
    handleSave(updated);
    setEditingVisit(null);
    setSelectedVisit(updatedVisit);
  };

  // Eliminar revisita
  const handleDeleteReturnVisit = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta revisita?')) {
      const updated = returnVisits.filter(rv => rv.id !== id);
      handleSave(updated);
      setSelectedVisit(null);
    }
  };

  const stats = getReturnVisitsStats(returnVisits);

  // Si está mostrando detalles de una revisita
  if (selectedVisit) {
    return (
      <ReturnVisitDetail
        returnVisit={selectedVisit}
        onBack={() => setSelectedVisit(null)}
        onUpdate={handleUpdateReturnVisit}
        onDelete={handleDeleteReturnVisit}
        onEdit={() => {
          setEditingVisit(selectedVisit);
          setSelectedVisit(null);
        }}
      />
    );
  }

  // Si está editando o agregando
  if (showAddForm || editingVisit) {
    return (
      <ReturnVisitForm
        returnVisit={editingVisit}
        onSave={editingVisit ? handleUpdateReturnVisit : handleAddReturnVisit}
        onCancel={() => {
          setShowAddForm(false);
          setEditingVisit(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="card-gradient p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-7 h-7 text-blue-600" />
          Mis Revisitas
        </h2>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600">{stats.studying}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Estudiando</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-yellow-200 dark:border-yellow-800">
            <div className="text-2xl font-bold text-yellow-600">{stats.active}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Activos</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-600">{stats.totalVisits}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Visitas</div>
          </div>
        </div>

        {/* Botón agregar */}
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full mt-4 btn-primary py-3 flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Agregar Nueva Revisita
        </button>
      </div>

      {/* Búsqueda y filtros */}
      <div className="card-gradient p-4 space-y-3">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, dirección o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-3 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(RETURN_VISIT_STATUSES).map(([key, status]) => (
              <option key={key} value={key}>
                {status.emoji} {status.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            <option value="name">Ordenar por Nombre</option>
            <option value="lastVisit">Última Visita</option>
            <option value="nextVisit">Próxima Visita</option>
            <option value="status">Estado</option>
          </select>
        </div>
      </div>

      {/* Lista de revisitas */}
      {filteredVisits.length === 0 ? (
        <div className="card-gradient p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {searchTerm || statusFilter !== 'all'
              ? 'No se encontraron revisitas'
              : 'No tienes revisitas registradas'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Intenta con otros criterios de búsqueda'
              : 'Comienza agregando tu primera revisita'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary px-6 py-3 inline-flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Agregar Primera Revisita
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVisits.map((visit) => (
            <ReturnVisitCard
              key={visit.id}
              returnVisit={visit}
              onClick={() => setSelectedVisit(visit)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReturnVisitsView;
