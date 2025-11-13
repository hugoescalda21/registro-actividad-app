import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useActivities = () => {
  const [activities, setActivities] = useLocalStorage('publisherActivities', []);
  const [editingId, setEditingId] = useState(null);

  const addActivity = (activity) => {
    const newActivity = {
      id: Date.now(),
      ...activity,
      totalMinutes: parseInt(activity.hours || 0) * 60 + parseInt(activity.minutes || 0)
    };
    setActivities([...activities, newActivity]);
    return newActivity;
  };

  const updateActivity = (id, updatedActivity) => {
    const updated = {
      ...updatedActivity,
      id,
      totalMinutes: parseInt(updatedActivity.hours || 0) * 60 + parseInt(updatedActivity.minutes || 0)
    };
    setActivities(activities.map(a => a.id === id ? updated : a));
    return updated;
  };

  const deleteActivity = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      setActivities(activities.filter(a => a.id !== id));
      return true;
    }
    return false;
  };

  const getSortedActivities = () => {
    return [...activities].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return {
    activities,
    setActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    getSortedActivities,
    editingId,
    setEditingId
  };
};