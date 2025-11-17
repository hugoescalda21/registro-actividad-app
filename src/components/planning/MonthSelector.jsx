import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTHS } from '../../constants';

const MonthSelector = ({
  selectedMonth,
  selectedYear,
  onPreviousMonth,
  onNextMonth
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onPreviousMonth}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Mes anterior"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
        {MONTHS[selectedMonth - 1]} {selectedYear}
      </h2>

      <button
        onClick={onNextMonth}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Mes siguiente"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default MonthSelector;
