import React from 'react';
import { Settings, BarChart3, Plus, History, Zap, Target, TrendingUp } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-white to-blue-50 p-3 rounded-2xl shadow-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Registro de Actividad
                </h1>
                <p className="text-sm text-blue-100 font-medium">
                  {publisherTypes[publisherType].label}
                </p>
              </div>
            </div>
            
            <button
              onClick={onSettingsClick}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-xl transition-all duration-200 backdrop-blur-sm hover-scale"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress Widget */}
          {stats && goals.hours > 0 && (
            <div className="glass-dark rounded-2xl p-4 mb-4 border border-white border-opacity-20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">
                    Meta del Mes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">
                    {stats.totalHours.toFixed(1)}h
                  </span>
                  <span className="text-sm text-blue-100">
                    / {goals.hours}h
                  </span>
                </div>
              </div>
              
              <div className="relative w-full bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
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
              
              <div className="flex items-center justify-between mt-2">
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

          {/* Navigation */}
          <nav className="flex gap-2">
            <NavButton
              icon={Plus}
              label="Registrar"
              active={currentView === 'register'}
              onClick={() => onViewChange('register')}
            />
            <NavButton
              icon={BarChart3}
              label="Estadísticas"
              active={currentView === 'stats'}
              onClick={() => onViewChange('stats')}
            />
            <NavButton
              icon={History}
              label="Historial"
              active={currentView === 'history'}
              onClick={() => onViewChange('history')}
            />
          </nav>
        </div>
      </div>
    </header>
  );
};

const NavButton = ({ icon: Icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
        active
          ? 'bg-white text-blue-600 shadow-lg scale-105'
          : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20 backdrop-blur-sm hover-scale'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline text-sm">{label}</span>
    </button>
  );
};

export default Header;