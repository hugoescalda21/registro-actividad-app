import React from 'react';
import { Target, TrendingUp } from 'lucide-react';

const GoalProgress = ({ stats, goals, config, progress, isGoalMet }) => {
  return (
    <div className="card-gradient p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Meta del Mes</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-800">
            {stats.totalHours.toFixed(1)}h
          </span>
          <span className="text-sm text-gray-500"> / {goals.hours}h</span>
        </div>
      </div>

      {/* Desglose de horas si hay aprobadas */}
      {config.canLogApproved && stats.approvedHours > 0 && (
        <div className="mb-3 p-3 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700 font-semibold">
              â±ï¸ PredicaciÃ³n: {stats.preachingHours.toFixed(1)}h
            </span>
            <span className="text-green-700 font-semibold">
              â Aprobadas: {stats.approvedHours.toFixed(1)}h
            </span>
          </div>
        </div>
      )}

      <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
            isGoalMet
              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
              : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 font-medium">
          {progress.toFixed(0)}% completado
        </span>
        {isGoalMet && (
          <span className="text-green-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Â¡Meta alcanzada!
          </span>
        )}
      </div>
    </div>
  );
};

export default GoalProgress;
