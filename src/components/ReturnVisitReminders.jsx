import React from 'react';
import { Bell, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { getUpcomingVisitsReminder } from '../hooks/useReturnVisitReminders';

const ReturnVisitReminders = ({ onVisitClick }) => {
  const upcoming = getUpcomingVisitsReminder();

  const totalReminders = upcoming.today.length + upcoming.tomorrow.length +
                        upcoming.thisWeek.length + upcoming.overdue.length;

  if (totalReminders === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20
                    rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500 rounded-lg">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Recordatorios de Visitas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {totalReminders} visita{totalReminders !== 1 ? 's' : ''} programada{totalReminders !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {/* Visitas atrasadas */}
        {upcoming.overdue.length > 0 && (
          <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 border-2 border-red-300 dark:border-red-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-700 dark:text-red-300 text-sm mb-1">
                  {upcoming.overdue.length} Atrasada{upcoming.overdue.length !== 1 ? 's' : ''}
                </h4>
                <div className="space-y-1">
                  {upcoming.overdue.slice(0, 3).map(visit => (
                    <button
                      key={visit.id}
                      onClick={() => onVisitClick(visit)}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline block text-left"
                    >
                      • {visit.name}
                    </button>
                  ))}
                  {upcoming.overdue.length > 3 && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      y {upcoming.overdue.length - 3} más...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visitas hoy */}
        {upcoming.today.length > 0 && (
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3 border-2 border-orange-300 dark:border-orange-800">
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-700 dark:text-orange-300 text-sm mb-1">
                  {upcoming.today.length} Para Hoy
                </h4>
                <div className="space-y-1">
                  {upcoming.today.map(visit => (
                    <button
                      key={visit.id}
                      onClick={() => onVisitClick(visit)}
                      className="text-xs text-orange-600 dark:text-orange-400 hover:underline block text-left"
                    >
                      • {visit.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visitas mañana */}
        {upcoming.tomorrow.length > 0 && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 border-2 border-yellow-300 dark:border-yellow-800">
            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 text-sm mb-1">
                  {upcoming.tomorrow.length} Para Mañana
                </h4>
                <div className="space-y-1">
                  {upcoming.tomorrow.map(visit => (
                    <button
                      key={visit.id}
                      onClick={() => onVisitClick(visit)}
                      className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline block text-left"
                    >
                      • {visit.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visitas esta semana */}
        {upcoming.thisWeek.length > 0 && (
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 border-2 border-blue-300 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-sm mb-1">
                  {upcoming.thisWeek.length} Esta Semana
                </h4>
                <div className="space-y-1">
                  {upcoming.thisWeek.slice(0, 3).map(visit => (
                    <button
                      key={visit.id}
                      onClick={() => onVisitClick(visit)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline block text-left"
                    >
                      • {visit.name}
                    </button>
                  ))}
                  {upcoming.thisWeek.length > 3 && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      y {upcoming.thisWeek.length - 3} más...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnVisitReminders;
