import React, { useState, useEffect } from 'react';
import { X, Target, Clock, BookOpen, Video, Users, Award } from 'lucide-react';
import { saveCustomGoal, getCustomGoal, deleteCustomGoal, hasCustomGoal } from '../utils/goalUtils';

const CustomGoalModal = ({ isOpen, onClose, month, year, publisherType, publisherTypes }) => {
  const [customGoals, setCustomGoals] = useState({
    hours: '',
    placements: '',
    videos: '',
    returnVisits: '',
    studies: ''
  });

  const defaultGoals = publisherTypes[publisherType];
  const hasCustom = hasCustomGoal(month, year);

  useEffect(() => {
    if (isOpen) {
      const saved = getCustomGoal(month, year);
      if (saved) {
        setCustomGoals({
          hours: saved.hours || '',
          placements: saved.placements || '',
          videos: saved.videos || '',
          returnVisits: saved.returnVisits || '',
          studies: saved.studies || ''
        });
      } else {
        setCustomGoals({
          hours: defaultGoals.hours || '',
          placements: defaultGoals.placements || '',
          videos: defaultGoals.videos || '',
          returnVisits: defaultGoals.returnVisits || '',
          studies: defaultGoals.studies || ''
        });
      }
    }
  }, [isOpen, month, year, publisherType]);

  const handleSave = () => {
    const goals = {
      hours: parseFloat(customGoals.hours) || 0,
      placements: parseInt(customGoals.placements) || 0,
      videos: parseInt(customGoals.videos) || 0,
      returnVisits: parseInt(customGoals.returnVisits) || 0,
      studies: parseInt(customGoals.studies) || 0
    };
    saveCustomGoal(month, year, goals);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('¿Restaurar metas predeterminadas para este mes?')) {
      deleteCustomGoal(month, year);
      onClose();
    }
  };

  if (!isOpen) return null;

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6" />
                Metas Personalizadas
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                {monthNames[month - 1]} {year}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {hasCustom && (
            <div className="bg-purple-500 bg-opacity-50 rounded-lg p-2 text-sm">
              ⚙️ Este mes tiene metas personalizadas
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <strong>💡 Tip:</strong> Personaliza las metas para este mes específico (ej: vacaciones, congresos, etc.)
          </div>

          {/* Horas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Horas de Predicación
              <span className="text-xs text-gray-500 font-normal">
                (Predeterminado: {defaultGoals.hours})
              </span>
            </label>
            <input
              type="number"
              value={customGoals.hours}
              onChange={(e) => setCustomGoals({ ...customGoals, hours: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`${defaultGoals.hours} horas`}
              step="0.5"
              min="0"
            />
          </div>

          {/* Publicaciones */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-600" />
              Publicaciones
              <span className="text-xs text-gray-500 font-normal">
                (Predeterminado: {defaultGoals.placements || 'Sin meta'})
              </span>
            </label>
            <input
              type="number"
              value={customGoals.placements}
              onChange={(e) => setCustomGoals({ ...customGoals, placements: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={`${defaultGoals.placements || 0} publicaciones`}
              min="0"
            />
          </div>

          {/* Videos */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Video className="w-4 h-4 text-red-600" />
              Videos Mostrados
              <span className="text-xs text-gray-500 font-normal">
                (Predeterminado: {defaultGoals.videos || 'Sin meta'})
              </span>
            </label>
            <input
              type="number"
              value={customGoals.videos}
              onChange={(e) => setCustomGoals({ ...customGoals, videos: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={`${defaultGoals.videos || 0} videos`}
              min="0"
            />
          </div>

          {/* Revisitas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Revisitas
              <span className="text-xs text-gray-500 font-normal">
                (Predeterminado: {defaultGoals.returnVisits || 'Sin meta'})
              </span>
            </label>
            <input
              type="number"
              value={customGoals.returnVisits}
              onChange={(e) => setCustomGoals({ ...customGoals, returnVisits: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={`${defaultGoals.returnVisits || 0} revisitas`}
              min="0"
            />
          </div>

          {/* Estudios */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-600" />
              Estudios Bíblicos
              <span className="text-xs text-gray-500 font-normal">
                (Predeterminado: {defaultGoals.studies || 'Sin meta'})
              </span>
            </label>
            <input
              type="number"
              value={customGoals.studies}
              onChange={(e) => setCustomGoals({ ...customGoals, studies: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder={`${defaultGoals.studies || 0} estudios`}
              min="0"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            {hasCustom && (
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                🔄 Restaurar
              </button>
            )}
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              ✓ Guardar Metas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomGoalModal;