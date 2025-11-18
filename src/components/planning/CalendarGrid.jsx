import React from 'react';
import DayCell from './DayCell';

const CalendarGrid = ({ calendarDays, onDayClick }) => {
  const weekDaysMedium = ['Dom', 'Lun', 'Mar', 'MiÃ©', 'Jue', 'Vie', 'SÃ¡b'];

  return (
    <div className="card-gradient p-2 sm:p-3">
      {/* DÃ­as de la semana - Adaptativos */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
        {weekDaysMedium.map(day => (
          <div key={day} className="text-center text-xs font-bold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grid de dÃ­as */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {calendarDays.map((dayInfo, index) => (
          <DayCell
            key={index}
            dayInfo={dayInfo}
            onClick={onDayClick}
          />
        ))}
      </div>

      {/* Leyenda - Compacta en mÃ³vil */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-gray-200">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[10px] xs:text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 border-2 border-green-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold text-[10px] xs:text-xs">â</span>
            </div>
            <span className="text-gray-700 font-medium">Completado</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-100 border-2 border-yellow-400 rounded-lg flex-shrink-0"></div>
            <span className="text-gray-700 font-medium">Planeado</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white border border-gray-200 rounded-lg ring-2 ring-blue-500 flex-shrink-0"></div>
            <span className="text-gray-700 font-medium">Hoy</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white border border-gray-200 rounded-lg flex-shrink-0"></div>
            <span className="text-gray-700 font-medium">Sin plan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
