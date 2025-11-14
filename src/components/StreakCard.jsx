import React from 'react';
import { Flame, Trophy, Calendar, TrendingUp, Zap } from 'lucide-react';
import { calculateStreak, getStreakEmoji, getStreakMessage } from '../utils/streakUtils';

const StreakCard = ({ activities }) => {
  const streak = calculateStreak(activities);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg hover-lift">
      {/* Fondo con gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Contenido */}
      <div className="relative p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Flame className="w-6 h-6" />
            Racha de Actividad
          </h3>
          <div className="text-5xl animate-pulse">
            {getStreakEmoji(streak.current)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Racha Actual */}
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-semibold">Racha Actual</span>
            </div>
            <div className="text-4xl font-bold mb-1">{streak.current}</div>
            <div className="text-xs opacity-90 font-medium">
              {streak.current === 1 ? 'día' : 'días'}
            </div>
          </div>

          {/* Mejor Racha */}
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-30">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-semibold">Mejor Racha</span>
            </div>
            <div className="text-4xl font-bold mb-1">{streak.longest}</div>
            <div className="text-xs opacity-90 font-medium">
              {streak.longest === 1 ? 'día' : 'días'}
            </div>
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">{getStreakMessage(streak.current)}</p>
              {streak.lastActivityDate && (
                <p className="text-xs opacity-75 mt-1">
                  Última actividad: {new Date(streak.lastActivityDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCard;