import React from 'react';

const PlanningStats = ({ stats, config }) => {
  const { totalPlanned, totalCompleted, daysPlanned, daysCompleted, difference } = stats;

  return (
    <div className="card-gradient p-3 sm:p-4">
      {/* Estadísticas compactas - Responsive */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 border-blue-200">
          <p className="text-[10px] sm:text-xs font-semibold text-blue-600 mb-0.5 sm:mb-1">Planeado</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-800">{totalPlanned.toFixed(1)}h</p>
          <p className="text-[10px] sm:text-xs text-blue-600 mt-0.5 sm:mt-1">{daysPlanned} días</p>
        </div>
        <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 border-green-200">
          <p className="text-[10px] sm:text-xs font-semibold text-green-600 mb-0.5 sm:mb-1">Completado</p>
          <p className="text-xl sm:text-2xl font-bold text-green-800">{totalCompleted.toFixed(1)}h</p>
          <p className="text-[10px] sm:text-xs text-green-600 mt-0.5 sm:mt-1">{daysCompleted} días</p>
        </div>
      </div>

      {/* Diferencia destacada */}
      {totalPlanned > 0 && (
        <div className={`mt-2 sm:mt-3 rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 ${
          difference >= 0
            ? 'bg-green-50 border-green-200'
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs sm:text-sm font-semibold ${
              difference >= 0 ? 'text-green-700' : 'text-orange-700'
            }`}>
              Diferencia
            </span>
            <span className={`text-lg sm:text-xl font-bold ${
              difference >= 0 ? 'text-green-800' : 'text-orange-800'
            }`}>
              {difference >= 0 ? '+' : ''}{difference.toFixed(1)}h
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningStats;