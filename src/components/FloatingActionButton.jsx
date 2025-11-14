import React, { useState } from 'react';
import { Plus, X, Edit, Timer } from 'lucide-react';

const FloatingActionButton = ({ onManualClick, onStopwatchClick, canUseStopwatch }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleManual = () => {
    setIsOpen(false);
    onManualClick();
  };

  const handleStopwatch = () => {
    setIsOpen(false);
    onStopwatchClick();
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm -z-10 animate-fadeIn"
        />
      )}

      {/* Opciones del menú */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 space-y-3 animate-slideIn">
          {/* Registro Manual */}
          <button
            onClick={handleManual}
            className="group flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 pr-5 pl-4 py-3 hover:scale-105"
          >
            <div className="bg-blue-500 p-3 rounded-full group-hover:bg-blue-600 transition-colors">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-800 whitespace-nowrap">
              Registro Manual
            </span>
          </button>

          {/* Cronómetro - Solo si puede usar horas */}
          {canUseStopwatch && (
            <button
              onClick={handleStopwatch}
              className="group flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 pr-5 pl-4 py-3 hover:scale-105"
            >
              <div className="bg-orange-500 p-3 rounded-full group-hover:bg-orange-600 transition-colors">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-gray-800 whitespace-nowrap">
                Cronómetro
              </span>
            </button>
          )}
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={toggleMenu}
        className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 p-5 ${
          isOpen ? 'rotate-45 scale-110' : 'hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="w-8 h-8" />
        ) : (
          <Plus className="w-8 h-8" />
        )}
      </button>

      {/* Indicador de ayuda (primera vez) */}
      {!isOpen && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          !
        </div>
      )}
    </div>
  );
};

export default FloatingActionButton;