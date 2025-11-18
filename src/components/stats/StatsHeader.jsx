import React from 'react';
import { BarChart3, Edit } from 'lucide-react';
import { MONTHS } from '../../constants';

const StatsHeader = ({
  selectedMonth,
  selectedYear,
  customGoal,
  onPreviousMonth,
  onNextMonth,
  onEditGoal
}) => {
  return (
    <div className="card-gradient p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-blue-600" />
          Estadísticas
        </h2>
        <button
          onClick={onEditGoal}
          className="p-2 hover:bg-blue-100 rounded-xl transition-colors active:scale-95"
          title="Editar meta del mes"
        >
          <Edit className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onPreviousMonth}
          className="p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
        >
          ←
        </button>

        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800">
            {MONTHS[selectedMonth - 1]} {selectedYear}
          </h3>
          {customGoal && (
            <p className="text-xs text-blue-600 font-semibold">Meta personalizada</p>
          )}
        </div>

        <button
          onClick={onNextMonth}
          className="p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default StatsHeader;
