import React from 'react';
import { MonthlyChart } from './MonthlyChart';
import { activityTypes } from '../utils/constants';
import { exportMonthlyReport, downloadReport } from '../utils/exportUtils';

export const StatsView = ({ stats, config, activities, publisherType, selectedMonth, selectedYear }) => {
  const handleExport = () => {
    const monthName = new Date(selectedYear, selectedMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const report = exportMonthlyReport(stats, config.label, activities);
    const filename = `informe_${selectedYear}_${selectedMonth + 1}.txt`;
    downloadReport(report, filename);
  };

  // Filtrar actividades del mes seleccionado
  const monthActivities = activities.filter(a => {
    const date = new Date(a.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  return (
    <div>
      {stats.goal > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              🎯 Meta del Mes
            </h2>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              📄 Exportar Informe
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-3xl font-bold text-gray-800">{stats.totalHoursDecimal}</span>
                <span className="text-gray-500 text-lg"> / {stats.goal} horas</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{stats.progress}%</div>
                <div className="text-sm text-gray-500">completado</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500 rounded-full`}
                style={{ width: `${Math.min(100, stats.progress)}%` }}
              />
            </div>
            {parseFloat(stats.remaining) > 0 ? (
              <div className="mt-3 text-center">
                <span className="text-gray-600">Faltan </span>
                <span className="font-bold text-orange-600 text-lg">{stats.remaining} horas</span>
                <span className="text-gray-600"> para alcanzar la meta</span>
              </div>
            ) : (
              <div className="mt-3 text-center">
                <span className="font-bold text-green-600 text-lg">¡Meta alcanzada! 🎉</span>
              </div>
            )}
          </div>

          {config.canLogApproved && parseFloat(stats.totalApprovedHours) > 0 && (
            <div className="mt-4 bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span>✓</span>
                <span className="font-semibold text-green-800">Horas Aprobadas</span>
              </div>
              <div className="text-3xl font-bold text-green-700">{stats.totalApprovedHours} hrs</div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📊 Resumen del Mes
        </h2>
        
        {config.canLogHours && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span>⏰</span>
                <span className="text-sm opacity-90">Total de Horas</span>
              </div>
              <div className="text-4xl font-bold">{stats.totalHours}</div>
              {stats.remainingMinutes > 0 && (
                <div className="text-lg opacity-90">+{stats.remainingMinutes} minutos</div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <span>📖</span>
              <span className="text-sm text-purple-800 font-medium">Cursos Bíblicos</span>
            </div>
            <div className="text-3xl font-bold text-purple-700">{stats.studies}</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Días de Actividad</div>
            <div className="text-3xl font-bold text-gray-800">{stats.activities}</div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <MonthlyChart activities={monthActivities} activityTypes={activityTypes} />
    </div>
  );
};