import React from 'react';
import { ProgressCard } from './ProgressCard';
import { ActivityCard } from './ActivityCard';

export const RegisterView = ({ 
  stats, 
  config, 
  sortedActivities, 
  onNewActivity, 
  onEdit, 
  onDelete,
  selectedMonth,
  selectedYear
}) => {
  const now = new Date();
  const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();

  // Filtrar actividades del mes seleccionado
  const monthActivities = sortedActivities.filter(activity => {
    const date = new Date(activity.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  return (
    <div>
      {isCurrentMonth && <ProgressCard stats={stats} config={config} />}
      
      {isCurrentMonth && (
        <button
          onClick={onNewActivity}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 mb-6"
        >
          ➕ Nueva Actividad
        </button>
      )}

      <div className="space-y-4">
        {monthActivities.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-500 text-lg">No hay actividades registradas en este mes</p>
            {isCurrentMonth && (
              <p className="text-gray-400 text-sm mt-2">Presiona "Nueva Actividad" para comenzar</p>
            )}
          </div>
        ) : (
          monthActivities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};