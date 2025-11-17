import { useState, useEffect, useCallback } from 'react';
import storage from '../services/storage';
import { useToast } from '../contexts/ToastContext';

/**
 * Hook personalizado para gestionar actividades
 * Centraliza toda la lógica CRUD de actividades
 */
export const useActivitiesManager = () => {
  const { showToast } = useToast();
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);

  // Cargar actividades del storage al iniciar
  useEffect(() => {
    try {
      const savedActivities = storage.getActivities();
      if (savedActivities.length > 0) {
        setActivities(savedActivities);
      }
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      showToast('Error al cargar actividades guardadas', 'error');
    }
  }, [showToast]);

  // Guardar actividades en storage cuando cambien
  useEffect(() => {
    storage.setActivities(activities);
  }, [activities]);

  // Agregar nueva actividad
  const addActivity = useCallback((activity) => {
    setActivities(prev => [...prev, activity]);
    setEditingActivity(null);
    showToast(' Actividad guardada correctamente', 'success');
  }, [showToast]);

  // Actualizar actividad existente
  const updateActivity = useCallback((updatedActivity) => {
    setActivities(prev =>
      prev.map(a => a.id === updatedActivity.id ? updatedActivity : a)
    );
    setEditingActivity(null);
    showToast(' Actividad actualizada correctamente', 'success');
  }, [showToast]);

  // Eliminar actividad
  const deleteActivity = useCallback((id) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    showToast('=Ñ Actividad eliminada', 'info');
  }, [showToast]);

  // Iniciar edición de actividad
  const startEditing = useCallback((activity) => {
    setEditingActivity(activity);
  }, []);

  // Cancelar edición
  const cancelEditing = useCallback(() => {
    setEditingActivity(null);
  }, []);

  // Importar actividades desde archivo
  const importActivities = useCallback((importedActivities) => {
    if (importedActivities && Array.isArray(importedActivities)) {
      setActivities(importedActivities);
      showToast('=å Actividades importadas exitosamente', 'success');
      return true;
    }
    return false;
  }, [showToast]);

  // Exportar actividades
  const exportActivities = useCallback(() => {
    return activities;
  }, [activities]);

  // Limpiar todas las actividades
  const clearAllActivities = useCallback(() => {
    setActivities([]);
    showToast('=Ñ Todas las actividades eliminadas', 'info');
  }, [showToast]);

  // Obtener actividades por período
  const getActivitiesByPeriod = useCallback((month, year) => {
    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return (
        activityDate.getMonth() + 1 === month &&
        activityDate.getFullYear() === year
      );
    });
  }, [activities]);

  // Obtener actividad por ID
  const getActivityById = useCallback((id) => {
    return activities.find(a => a.id === id);
  }, [activities]);

  return {
    // Estado
    activities,
    editingActivity,

    // Acciones CRUD
    addActivity,
    updateActivity,
    deleteActivity,

    // Edición
    startEditing,
    cancelEditing,

    // Importar/Exportar
    importActivities,
    exportActivities,
    clearAllActivities,

    // Consultas
    getActivitiesByPeriod,
    getActivityById,

    // Información
    totalActivities: activities.length
  };
};
