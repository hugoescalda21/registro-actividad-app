import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDateShort } from '../../utils/dateUtils';

const MonthActivityList = ({ monthActivities }) => {
  if (monthActivities.length === 0) {
    return (
      <div className="card-gradient p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          No hay actividades este mes
        </h3>
        <p className="text-gray-500">
          Comienza a registrar tu actividad para ver estadísticas
        </p>
      </div>
    );
  }

  return (
    <div className="card-gradient p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        Actividades del Mes ({monthActivities.length})
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {monthActivities
          .sort((a, b) => b.date.localeCompare(a.date))
          .map(activity => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {formatDateShort(activity.date)}
                </span>
              </div>
              <div className="flex gap-2 text-sm flex-wrap justify-end">
                {activity.hours > 0 && (
                  <span className="badge badge-primary">
                    ⏱️ {activity.hours}h
                  </span>
                )}
                {activity.approvedHours > 0 && (
                  <span className="badge badge-success">
                    ✅ {activity.approvedHours}h aprob
                  </span>
                )}
                {(activity.hours > 0 && activity.approvedHours > 0) && (
                  <span className="badge badge-info">
                    📊 {(activity.hours + activity.approvedHours).toFixed(1)}h total
                  </span>
                )}
                {activity.studies > 0 && (
                  <span className="badge badge-warning">
                    🎓 {activity.studies}
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MonthActivityList;
