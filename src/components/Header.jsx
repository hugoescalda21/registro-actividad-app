import React from 'react';

export const Header = ({ publisherType, currentView, onViewChange, onSettingsClick, publisherTypes }) => {
  const config = publisherTypes[publisherType];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Registro de Actividad</h1>
          <button
            onClick={onSettingsClick}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
          >
            ⚙️
          </button>
        </div>
        
        <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-4">
          <div className="text-sm opacity-90 mb-1">Tipo de Publicador</div>
          <div className="font-semibold">{config.label}</div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onViewChange('register')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'register' ? 'bg-white text-blue-700' : 'bg-blue-500 hover:bg-blue-400'
            }`}
          >
            Registrar
          </button>
          <button
            onClick={() => onViewChange('stats')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'stats' ? 'bg-white text-blue-700' : 'bg-blue-500 hover:bg-blue-400'
            }`}
          >
            Estadísticas
          </button>
        </div>
      </div>
    </div>
  );
};