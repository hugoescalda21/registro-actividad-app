import React from 'react';
import { MapPin, Phone, Calendar, MessageCircle } from 'lucide-react';
import { RETURN_VISIT_STATUSES, formatVisitDate } from '../utils/returnVisitsUtils';

const ReturnVisitCard = ({ returnVisit, onClick }) => {
  const status = RETURN_VISIT_STATUSES[returnVisit.status];
  const totalVisits = returnVisit.visits.length;

  return (
    <div
      onClick={onClick}
      className="card-gradient p-5 cursor-pointer hover:shadow-xl transition-all duration-200 hover:-translate-y-1 active:scale-95 border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-700"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
            {returnVisit.name}
          </h3>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-${status.color}-100 dark:bg-${status.color}-900/30 text-${status.color}-700 dark:text-${status.color}-300`}>
            <span>{status.emoji}</span>
            <span>{status.label}</span>
          </div>
        </div>
        {totalVisits > 0 && (
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {totalVisits}
          </div>
        )}
      </div>

      {/* Información */}
      <div className="space-y-2">
        {returnVisit.address && (
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
            <span className="line-clamp-1">{returnVisit.address}</span>
          </div>
        )}

        {returnVisit.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4 flex-shrink-0 text-gray-500" />
            <span>{returnVisit.phone}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 flex-shrink-0 text-gray-500" />
          <span>
            Última visita: <span className="font-semibold">{formatVisitDate(returnVisit.lastVisitDate)}</span>
          </span>
        </div>

        {returnVisit.notes && (
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
            <span className="line-clamp-2">{returnVisit.notes}</span>
          </div>
        )}
      </div>

      {/* Próxima visita */}
      {returnVisit.nextVisitDate && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Próxima visita:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {new Date(returnVisit.nextVisitDate).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short'
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnVisitCard;
