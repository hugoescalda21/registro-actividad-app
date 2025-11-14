import React from 'react';

export const MonthSelector = ({ selectedMonth, selectedYear, onMonthChange }) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11, selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1, selectedYear);
    }
  };

  const handleNextMonth = () => {
    const now = new Date();
    const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();
    
    if (!isCurrentMonth) {
      if (selectedMonth === 11) {
        onMonthChange(0, selectedYear + 1);
      } else {
        onMonthChange(selectedMonth + 1, selectedYear);
      }
    }
  };

  const now = new Date();
  const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Anterior
        </button>

        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value), selectedYear)}
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => onMonthChange(selectedMonth, parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNextMonth}
          disabled={isCurrentMonth}
          className={`p-2 rounded-lg transition-colors ${
            isCurrentMonth 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'hover:bg-gray-100'
          }`}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};