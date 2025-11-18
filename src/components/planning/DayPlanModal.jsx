import React from 'react';
import { X, Save } from 'lucide-react';

const DayPlanModal = ({
  selectedDay,
  selectedMonth,
  selectedYear,
  plannedHours,
  setPlannedHours,
  onClose,
  onSave
}) => {
  if (!selectedDay) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-md p-5 sm:p-6 animate-slideUp max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Día {selectedDay.day}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-target"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="mb-5 sm:mb-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            {new Date(selectedYear, selectedMonth - 1, selectedDay.day).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>

          {selectedDay.isCompleted && selectedDay.activity && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-green-800 font-semibold flex items-center gap-2">
                <span className="text-xl sm:text-2xl">✅</span>
                Día completado: {((selectedDay.activity.hours || 0) + (selectedDay.activity.approvedHours || 0)).toFixed(1)}h registradas
              </p>
            </div>
          )}

          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
            Horas Planeadas
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.5"
            value={plannedHours}
            onChange={(e) => setPlannedHours(e.target.value)}
            className="w-full px-4 sm:px-5 py-3 sm:py-4 text-lg sm:text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
            placeholder="0.0"
            autoFocus
            style={{ fontSize: '18px' }}
          />
          <p className="text-[10px] xs:text-xs text-gray-500 mt-2">
            💡 Deja en blanco para quitar la planificación
          </p>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-3 sm:px-4 py-3 sm:py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base touch-target"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-3 sm:px-4 py-3 sm:py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base touch-target"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayPlanModal;