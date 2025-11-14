import React from 'react';
import { Settings, Zap, Target, TrendingUp } from 'lucide-react';
import { getCustomGoal } from '../utils/goalUtils';

const Header = ({ 
  publisherType, 
  currentView, 
  onViewChange, 
  onSettingsClick,
  publisherTypes,
  stats 
}) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  const customGoal = getCustomGoal(currentMonth, currentYear);
  const goals = customGoal || publisherTypes[publisherType];

  const calculateProgress = () => {
    if (!stats || !goals.hours) return 0;
    return Math.min((stats.totalHours / goals.hours) * 100, 100);
  };

  const progress = calculateProgress();
  const isGoalMet = stats && goals.hours && stats.totalHours >= goals.hours;

  return (
    <header className="sticky top-0 z-50 animate-fadeIn">
      <div className="glass-dark backdrop-blur-xl border-b border-white border-opacity-20">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* Top Bar - Más compacto en móvil */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-white to-blue-50 p-2 rounded-xl shadow-lg md:p-3">
                <Zap className="w-5 h-5 text-blue-600 md:w-6 md:h-6" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight md:text-xl">
                  Registro de Actividad
                </h1>
                <p className="text-xs text-blue-100 font-medium md:text-sm">
                  {publisherTypes[publisherType].emoji} {publisherTypes[publisherType].label}
                </p>
              </div>
            </div>
            
            <button
              onClick={onSettingsClick}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm hover-scale touch-target md:p-3"
            >
              <Settings className="w-5 h-5 text-white md:w-6 md:h-6" />
            </button>
          </div>

          {/* Progress Widget - Más compacto */}
          {stats && goals.hours > 0 && (
            <div className="glass-dark rounded-xl p-3 border border-white border-opacity-20 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-white md:w-4 md:h-4" />
                  <span className="text-xs font-semibold text-white md:text-sm">
                    Meta del Mes
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-white md:text-lg">
                    {stats.totalHours.toFixed(1)}h
                  </span>
                  <span className="text-xs text-blue-100 md:text-sm">
                    / {goals.hours}h
                  </span>
                </div>
              </div>
              
              <div className="relative w-full bg-white bg-opacity-20 rounded-full h-2.5 overflow-hidden md:h-3">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                    isGoalMet 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                  }`}
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-blue-100 font-medium">
                  {progress.toFixed(0)}% completado
                </span>
                {isGoalMet && (
                  <span className="text-xs font-bold text-green-300 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    ¡Meta alcanzada!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Navegación - Solo visible en desktop */}
          <nav className="hidden md:flex gap-2 mt-3">
            {/* Mantener la navegación desktop existente */}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;