import React, { useState } from 'react';
import { Plus, BarChart3, History, Timer, Edit, X, Calendar, Users, MapPinned } from 'lucide-react';

const BottomNav = ({ currentView, onViewChange, onNewActivity, onStopwatch, showStopwatch, canUseStopwatch }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleNewClick = () => {
    if (canUseStopwatch) {
      // Si puede usar cronómetro, mostrar menú
      setShowMenu(!showMenu);
    } else {
      // Si no puede, abrir directamente el formulario
      onNewActivity();
    }
  };

  const handleManualClick = () => {
    setShowMenu(false);
    onNewActivity();
  };

  const handleStopwatchClick = () => {
    setShowMenu(false);
    onStopwatch();
  };

  return (
    <>
      {/* Backdrop cuando el menú está abierto */}
      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 animate-fadeIn"
        />
      )}

      {/* Menú flotante de opciones */}
      {showMenu && canUseStopwatch && (
        <div className="fixed bottom-24 left-0 right-0 z-50 px-4 animate-slideIn">
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Registro Manual */}
            <button
              onClick={handleManualClick}
              className="w-full bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 active:scale-95 transition-transform border-2 border-blue-200"
            >
              <div className="bg-blue-500 p-4 rounded-xl shadow-lg">
                <Edit className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-800 text-lg">Registro Manual</p>
                <p className="text-sm text-gray-600">Ingresa horas y detalles</p>
              </div>
            </button>

            {/* Cronómetro */}
            <button
              onClick={handleStopwatchClick}
              className="w-full bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 active:scale-95 transition-transform border-2 border-orange-200"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-xl shadow-lg">
                <Timer className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-800 text-lg">Cronómetro</p>
                <p className="text-sm text-gray-600">Registra tiempo en vivo</p>
              </div>
            </button>

            {/* Botón Cancelar */}
            <button
              onClick={() => setShowMenu(false)}
              className="w-full bg-gray-100 rounded-2xl shadow-lg p-4 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <X className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Cancelar</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 safe-area-bottom">
        <div className="max-w-4xl mx-auto px-2 py-2">
          <div className="grid grid-cols-6 gap-1">
            {/* Nueva Actividad */}
            <button
              onClick={handleNewClick}
              className="flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 hover:bg-blue-50 active:scale-95 relative"
            >
              <div className={`p-2.5 rounded-full mb-1 shadow-lg ${
                showMenu
                  ? 'bg-gray-600'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}>
                {showMenu ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Plus className="w-6 h-6 text-white" />
                )}
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {showMenu ? 'Cerrar' : 'Nueva'}
              </span>
              
              {/* Indicador de opciones disponibles */}
              {canUseStopwatch && !showMenu && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
              )}
            </button>

            {/* Planificación */}
            <button
              onClick={() => {
                setShowMenu(false);
                onViewChange('planning');
              }}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
                currentView === 'planning'
                  ? 'bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`p-2.5 rounded-full mb-1 ${
                currentView === 'planning'
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              }`}>
                <Calendar className={`w-6 h-6 ${
                  currentView === 'planning' ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <span className={`text-xs font-semibold ${
                currentView === 'planning' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                Plan
              </span>
            </button>

            {/* Revisitas */}
            <button
              onClick={() => {
                setShowMenu(false);
                onViewChange('returnVisits');
              }}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
                currentView === 'returnVisits'
                  ? 'bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`p-2.5 rounded-full mb-1 ${
                currentView === 'returnVisits'
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              }`}>
                <Users className={`w-6 h-6 ${
                  currentView === 'returnVisits' ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <span className={`text-xs font-semibold ${
                currentView === 'returnVisits' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                Revisitas
              </span>
            </button>

            {/* Salidas */}
            <button
              onClick={() => {
                setShowMenu(false);
                onViewChange('outings');
              }}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
                currentView === 'outings'
                  ? 'bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`p-2.5 rounded-full mb-1 ${
                currentView === 'outings'
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              }`}>
                <MapPinned className={`w-6 h-6 ${
                  currentView === 'outings' ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <span className={`text-xs font-semibold ${
                currentView === 'outings' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                Salidas
              </span>
            </button>

            {/* Historial */}
            <button
              onClick={() => {
                setShowMenu(false);
                onViewChange('history');
              }}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
                currentView === 'history'
                  ? 'bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`p-2.5 rounded-full mb-1 ${
                currentView === 'history'
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              }`}>
                <History className={`w-6 h-6 ${
                  currentView === 'history' ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <span className={`text-xs font-semibold ${
                currentView === 'history' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                Historial
              </span>
            </button>

            {/* Cronómetro (si está activo) / Inicio */}
            {showStopwatch ? (
              <button
                onClick={() => {
                  setShowMenu(false);
                  onViewChange('register');
                }}
                className="flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 hover:bg-orange-50 active:scale-95 relative"
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2.5 rounded-full mb-1 shadow-lg animate-pulse">
                  <Timer className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-orange-600">Activo</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowMenu(false);
                  onViewChange('register');
                }}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
                  currentView === 'register'
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`p-2.5 rounded-full mb-1 ${
                  currentView === 'register'
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}>
                  <Timer className={`w-6 h-6 ${
                    currentView === 'register' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <span className={`text-xs font-semibold ${
                  currentView === 'register' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  Inicio
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;