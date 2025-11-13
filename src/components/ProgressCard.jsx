import React from 'react';

export const ProgressCard = ({ stats, config }) => {
  if (stats.goal === 0) return null;

  return (
    <div className={`bg-gradient-to-r ${config.color} rounded-xl shadow-lg p-4 mb-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-90">Progreso del mes</div>
          <div className="text-2xl font-bold">{stats.totalHoursDecimal} / {stats.goal} hrs</div>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-90">Faltan</div>
          <div className="text-2xl font-bold">{stats.remaining} hrs</div>
        </div>
      </div>
      <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-3">
        <div
          className="bg-white h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, stats.progress)}%` }}
        />
      </div>
    </div>
  );
};