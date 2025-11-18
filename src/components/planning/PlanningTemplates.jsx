import React from 'react';
import { X, Copy, Wand2 } from 'lucide-react';

const PlanningTemplates = ({ onClose, onCopyPrevious, onUseTemplate }) => {
  const templates = [
    { name: 'Fines de Semana', days: [0, 6], hours: 3, emoji: '📅' },
    { name: 'Entre Semana', days: [1, 2, 3, 4, 5], hours: 2, emoji: '📝' },
    { name: 'Mar/Jue', days: [2, 4], hours: 2.5, emoji: '📌' },
    { name: 'Sábados', days: [6], hours: 4, emoji: '⭐' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-md p-5 sm:p-6 animate-slideUp max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            Plantillas de Planificación
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Copiar mes anterior */}
        <button
          onClick={onCopyPrevious}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg mb-4"
        >
          <Copy className="w-5 h-5" />
          Copiar Mes Anterior
        </button>

        <div className="border-t-2 border-gray-200 pt-4 mb-3">
          <p className="text-sm text-gray-600 mb-3">O usa una plantilla predefinida:</p>
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-2 gap-3">
          {templates.map(template => (
            <button
              key={template.name}
              onClick={() => onUseTemplate(template)}
              className="bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-semibold py-3 px-2 rounded-xl transition-all text-xs sm:text-sm active:scale-95 shadow-md flex flex-col items-center justify-center gap-1"
            >
              <span className="text-2xl">{template.emoji}</span>
              <span className="text-xs leading-tight text-center">{template.name}</span>
              <span className="text-xs opacity-90">{template.hours}h</span>
            </button>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanningTemplates;