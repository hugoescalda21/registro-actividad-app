import React from 'react';
import { Flame } from 'lucide-react';

const StatsCards = ({ stats, goals, config, streak }) => {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {config.canLogHours && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold opacity-90">Horas Total</span>
            <span className="text-2xl">⏱️</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalHours.toFixed(1)}</p>
          {goals.hours > 0 && (
            <p className="text-xs opacity-75 mt-1">Meta: {goals.hours}h</p>
          )}
        </div>
      )}

      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold opacity-90">Estudios</span>
          <span className="text-2xl">🎓</span>
        </div>
        <p className="text-3xl font-bold">{stats.totalStudies}</p>
        {goals.studies > 0 && (
          <p className="text-xs opacity-75 mt-1">Meta: {goals.studies}</p>
        )}
      </div>

      {config.canLogApproved && stats.approvedHours > 0 && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold opacity-90">Aprobadas</span>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-3xl font-bold">{stats.approvedHours.toFixed(1)}</p>
          <p className="text-xs opacity-75 mt-1">
            De {stats.totalHours.toFixed(1)}h totales
          </p>
        </div>
      )}

      <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold opacity-90">Racha</span>
          <Flame className="w-6 h-6" />
        </div>
        <p className="text-3xl font-bold">{streak}</p>
        <p className="text-xs opacity-75 mt-1">días seguidos</p>
      </div>
    </div>
  );
};

export default StatsCards;