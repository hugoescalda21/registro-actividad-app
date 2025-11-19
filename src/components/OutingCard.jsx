import React from 'react';
import { Calendar, Clock, Users, MapPin, ChevronRight } from 'lucide-react';
import { OUTING_TYPES } from '../utils/congregationOutingsUtils';

const OutingCard = ({ outing, onClick }) => {
  const typeInfo = OUTING_TYPES[outing.type] || OUTING_TYPES.other;
  const outingDate = new Date(outing.date);
  const formattedDate = outingDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = outingDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700
                 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg
                 transition-all cursor-pointer active:scale-98"
    >
      <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div className={`p-3 rounded-xl bg-${typeInfo.color}-100 dark:bg-${typeInfo.color}-900/30 flex-shrink-0`}>
          <span className="text-3xl">{typeInfo.emoji}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                {typeInfo.label}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formattedTime}
                </span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {/* Hours */}
            {outing.hours > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                <div className="text-xs text-gray-600 dark:text-gray-400">Horas</div>
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {outing.hours}h
                </div>
              </div>
            )}

            {/* Placements */}
            {outing.placements > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                <div className="text-xs text-gray-600 dark:text-gray-400">Colocaciones</div>
                <div className="font-semibold text-green-600 dark:text-green-400">
                  {outing.placements}
                </div>
              </div>
            )}

            {/* Videos */}
            {outing.videos > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                <div className="text-xs text-gray-600 dark:text-gray-400">Videos</div>
                <div className="font-semibold text-purple-600 dark:text-purple-400">
                  {outing.videos}
                </div>
              </div>
            )}

            {/* Return Visits */}
            {outing.returnVisits > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2">
                <div className="text-xs text-gray-600 dark:text-gray-400">Revisitas</div>
                <div className="font-semibold text-orange-600 dark:text-orange-400">
                  {outing.returnVisits}
                </div>
              </div>
            )}
          </div>

          {/* Territory */}
          {outing.territory && (
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Territorio: {outing.territory}</span>
            </div>
          )}

          {/* Companions */}
          {outing.companions && outing.companions.length > 0 && (
            <div className="flex items-start gap-2 text-sm">
              <Users className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-gray-600 dark:text-gray-400">Con: </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {outing.companions.join(', ')}
                </span>
              </div>
            </div>
          )}

          {/* Notes Preview */}
          {outing.notes && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {outing.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutingCard;
