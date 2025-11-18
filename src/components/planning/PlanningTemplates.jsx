import React from 'react';
import { Copy, Wand2, X } from 'lucide-react';

const PlanningTemplates = ({ onClose, onCopyPrevious, onUseTemplate }) => {
  const templates = [
    { name: 'Fines de Semana', days: [0, 6], hours: 3, emoji: '=Å' },
    { name: 'Entre Semana', days: [1, 2, 3, 4, 5], hours: 2, emoji: '=Ý' },
    { name: 'Mar/Jue', days: [2, 4], hours: 2.5, emoji: '=Ì' },
    { name: 'Sábados', days: [6], hours: 4, emoji: 'P' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="w-6 h-6" />
              <h3 className="text-xl font-bold">Plantillas</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Copiar mes anterior */}
          <button
            onClick={onCopyPrevious}
            className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border-2 border-blue-200 transition-all active:scale-95"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Copy className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-gray-900">Copiar Mes Anterior</h4>
              <p className="text-xs text-gray-600">Duplica la planificación del mes pasado</p>
            </div>
          </button>

          {/* Plantillas predefinidas */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-gray-700 mb-2">Plantillas Predefinidas</h4>
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => onUseTemplate(template)}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl border-2 border-purple-200 transition-all active:scale-95"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                  {template.emoji}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-gray-900">{template.name}</h4>
                  <p className="text-xs text-gray-600">{template.hours}h por día</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningTemplates;
