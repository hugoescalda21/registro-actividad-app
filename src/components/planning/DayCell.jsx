import React from 'react';

const DayCell = ({ dayInfo, onClick }) => {
  if (!dayInfo) {
    return <div className="min-h-[60px] xs:min-h-[65px] sm:min-h-[70px]" />;
  }

  const { day, isToday, isCompleted, isPast, planned, activity } = dayInfo;

  const getDayStyle = () => {
    if (isCompleted) {
      return 'bg-green-500 text-white font-bold shadow-md hover:bg-green-600 active:scale-95';
    }

    if (isToday) {
      if (planned) {
        return 'bg-yellow-400 text-gray-900 font-bold shadow-lg ring-4 ring-yellow-200 hover:bg-yellow-500 active:scale-95';
      }
      return 'bg-yellow-100 text-gray-900 font-bold shadow-lg ring-4 ring-yellow-200 hover:bg-yellow-200 active:scale-95';
    }

    if (planned) {
      return 'bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 active:scale-95';
    }

    if (isPast) {
      return 'bg-gray-100 text-gray-400 hover:bg-gray-200 active:scale-95';
    }

    return 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:scale-95';
  };

  // Calcular horas totales (predicación + aprobadas)
  const totalHours = activity
    ? (activity.hours || 0) + (activity.approvedHours || 0)
    : 0;

  return (
    <button
      onClick={() => onClick(dayInfo)}
      className={`
        min-h-[60px] xs:min-h-[65px] sm:min-h-[70px]
        rounded-lg sm:rounded-2xl
        transition-all duration-200
        flex flex-col items-center justify-center
        p-0.5 sm:p-1
        cursor-pointer
        ${getDayStyle()}
      `}
    >
      {/* Número del día - Responsive */}
      <span className="text-base xs:text-lg sm:text-xl font-bold mb-0.5 sm:mb-1">
        {day}
      </span>

      {/* Horas - Responsive y legible */}
      {(planned || activity) && (
        <span className="text-[9px] xs:text-[10px] sm:text-xs font-bold px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full bg-black bg-opacity-20">
          {activity
            ? `${totalHours.toFixed(1)}h`
            : `${planned}h`}
        </span>
      )}

      {/* Check para completados */}
      {isCompleted && (
        <span className="text-sm xs:text-base sm:text-lg mt-0.5 sm:mt-1">✓</span>
      )}
    </button>
  );
};

export default DayCell;