import React, { useState, useEffect } from 'react';
import { X, Target, Clock, BookOpen, Video, Users, Award, AlertCircle, RotateCcw } from 'lucide-react';
import { saveCustomGoal, getCustomGoal, deleteCustomGoal, hasCustomGoal } from '../utils/goalUtils';
import { useModal } from '../contexts/ModalContext';

const CustomGoalModal = ({ isOpen, onClose, month, year, publisherType, publisherTypes }) => {
  const modal = useModal();
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

  const handleReset = async () => {
    const confirmed = await modal.confirm(
      '¿Restaurar metas predeterminadas para este mes?',
      'Restaurar metas'
    );
    if (confirmed) {
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white p-6 rounded-t-3xl">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                <Target className="w-7 h-7" />
                Metas Personalizadas
              </h2>
              <p className="text-purple-100 text-sm font-medium">
                {monthNames[month - 1]} {year}
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-2 transition-all duration-200 hover-scale"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {hasCustom && (
            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-3 text-sm font-medium border border-white border-opacity-30">
              ⚙️ Este mes tiene metas personalizadas activas
            </div>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">💡 Consejo</p>
              <p>Personaliza las metas para este mes específico. Útil para vacaciones, congresos o situaciones especiales.</p>
            </div>
          </div>

          {/* Formulario de metas */}
          <div className="space-y-4">
            <GoalInput
              icon={Clock}
              label="Horas de Predicación"
              value={customGoals.hours}
              onChange={(value) => setCustomGoals({ ...customGoals, hours: value })}
              defaultValue={defaultGoals.hours}
              color="blue"
              step="0.5"
              placeholder="Ej: 10"
            />

            <GoalInput
              icon={BookOpen}
              label="Publicaciones"
              value={customGoals.placements}
              onChange={(value) => setCustomGoals({ ...customGoals, placements: value })}
              defaultValue={defaultGoals.placements}
              color="green"
              placeholder="Ej: 5"
            />

            <GoalInput
              icon={Video}
              label="Videos Mostrados"
              value={customGoals.videos}
              onChange={(value) => setCustomGoals({ ...customGoals, videos: value })}
              defaultValue={defaultGoals.videos}
              color="red"
              placeholder="Ej: 3"
            />

            <GoalInput
              icon={Users}
              label="Revisitas"
              value={customGoals.returnVisits}
              onChange={(value) => setCustomGoals({ ...customGoals, returnVisits: value })}
              defaultValue={defaultGoals.returnVisits}
              color="purple"
              placeholder="Ej: 2"
            />

            <GoalInput
              icon={Award}
              label="Estudios Bíblicos"
              value={customGoals.studies}
              onChange={(value) => setCustomGoals({ ...customGoals, studies: value })}
              defaultValue={defaultGoals.studies}
              color="yellow"
              placeholder="Ej: 1"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            {hasCustom && (
              <button
                onClick={handleReset}
                className="flex-1 px-5 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-2 hover-lift"
              >
                <RotateCcw className="w-5 h-5" />
                Restaurar
              </button>
            )}
            <button
              onClick={handleSave}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover-lift"
            >
              ✓ Guardar Metas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de input de meta
const GoalInput = ({ icon: Icon, label, value, onChange, defaultValue, color, step = "1", placeholder }) => {
  const colors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-300 focus:border-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-300 focus:border-green-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-300 focus:border-red-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-300 focus:border-purple-500' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-300 focus:border-yellow-500' },
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${colors[color].text}`} />
          {label}
        </span>
        <span className="text-xs text-gray-500 font-normal">
          Predeterminado: {defaultValue || 'Sin meta'}
        </span>
      </label>
      <div className={`${colors[color].bg} rounded-xl p-1`}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 border-2 ${colors[color].border} rounded-lg focus:ring-0 transition-all duration-200 bg-white font-semibold`}
          placeholder={placeholder}
          step={step}
          min="0"
        />
      </div>
    </div>
  );
};

export default CustomGoalModal;