import React from 'react';
import { Settings, Zap } from 'lucide-react';

const Header = ({
  publisherType,
  currentView,
  onViewChange,
  onSettingsClick,
  publisherTypes,
  stats
}) => {

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