import React from 'react';
import { formatDate } from '../utils/dateUtils';
import { activityTypes } from '../utils/constants';

export const ActivityCard = ({ activity, onEdit, onDelete }) => {
  const hours = Math.floor(activity.totalMinutes / 60);
  const minutes = activity.totalMinutes % 60;
  const actType = activityTypes[activity.type] || {};

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`${activity.totalMinutes > 0 ? actType.color || 'bg-gray-500' : 'bg-purple-500'} p-3 rounded-lg text-2xl`}>
            {activity.totalMinutes > 0 ? '👥' : '📖'}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              {activity.totalMinutes > 0 ? actType.label || 'Actividad' : 'Curso Bíblico'}
            </h3>
            <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(activity)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {activity.totalMinutes > 0 && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium mb-1">Tiempo</div>
            <div className="font-bold text-gray-800">{hours}h {minutes > 0 && `${minutes}m`}</div>
          </div>
        )}
        {parseInt(activity.studies) > 0 && (
          <div className="bg-purple-50 rounded-lg p-3 border-2 border-purple-200">
            <div className="text-xs text-purple-600 font-medium mb-1">Cursos Bíblicos</div>
            <div className="font-bold text-gray-800">{activity.studies}</div>
          </div>
        )}
        {parseFloat(activity.approvedHours) > 0 && (
          <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
            <div className="text-xs text-green-600 font-medium mb-1 flex items-center gap-1">
              ✓ Hrs Aprobadas
            </div>
            <div className="font-bold text-gray-800">{activity.approvedHours}</div>
          </div>
        )}
      </div>

      {activity.approvedDetail && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Detalle de horas aprobadas:</div>
          <p className="text-sm text-gray-700 font-medium">{activity.approvedDetail}</p>
        </div>
      )}

      {activity.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Notas:</div>
          <p className="text-sm text-gray-600">{activity.notes}</p>
        </div>
      )}
    </div>
  );
};