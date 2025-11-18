import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import storage from '../services/storage';

export const useActivitiesManager = () => {
  const { showToast } = useToast();
  const [activities, setActivities] = useState(() => storage.getActivities());
  const [editingActivity, setEditingActivity] = useState(null);

  const addActivity = useCallback((activity) => {
    setActivities(prev => {
      const newActivities = [...prev, activity];
      storage.setActivities(newActivities);
      return newActivities;
    });
    showToast('✅ Actividad guardada correctamente', 'success');
  }, [showToast]);

  const updateActivity = useCallback((updatedActivity) => {
    setActivities(prev => {
      const newActivities = prev.map(act =>
        act.id === updatedActivity.id ? updatedActivity : act
      );
      storage.setActivities(newActivities);
      return newActivities;
    });
    showToast('✅ Actividad actualizada correctamente', 'success');
    setEditingActivity(null);
  }, [showToast]);

  const deleteActivity = useCallback((id) => {
    setActivities(prev => {
      const newActivities = prev.filter(act => act.id !== id);
      storage.setActivities(newActivities);
      return newActivities;
    });
    showToast('🗑️ Actividad eliminada', 'info');
  }, [showToast]);

  const startEditing = useCallback((activity) => {
    setEditingActivity(activity);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingActivity(null);
  }, []);

  const importActivities = useCallback((importedActivities) => {
    const mergedActivities = [...activities];
    let addedCount = 0;

    importedActivities.forEach(imported => {
      const exists = mergedActivities.some(act => act.id === imported.id);
      if (!exists) {
        mergedActivities.push(imported);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setActivities(mergedActivities);
      storage.setActivities(mergedActivities);
      showToast(`📥 ${addedCount} actividad(es) importada(s)`, 'success');
    } else {
      showToast('ℹ️ No hay actividades nuevas para importar', 'info');
    }
  }, [activities, showToast]);

  return {
    activities,
    editingActivity,
    addActivity,
    updateActivity,
    deleteActivity,
    startEditing,
    cancelEditing,
    importActivities
  };
};