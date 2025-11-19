import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, Users, MapPin, FileText, Plus, Trash2 } from 'lucide-react';
import { addOuting, updateOuting, OUTING_TYPES, getUniqueTerritories, loadOutings } from '../utils/congregationOutingsUtils';

const OutingForm = ({ outing, onClose, onSuccess, companions }) => {
  const isEditing = !!outing;

  const [formData, setFormData] = useState({
    date: outing?.date ? new Date(outing.date).toISOString().slice(0, 16) :
          new Date().toISOString().slice(0, 16),
    type: outing?.type || 'public',
    companions: outing?.companions || [],
    territory: outing?.territory || '',
    hours: outing?.hours || 0,
    placements: outing?.placements || 0,
    videos: outing?.videos || 0,
    returnVisits: outing?.returnVisits || 0,
    notes: outing?.notes || ''
  });

  const [newCompanion, setNewCompanion] = useState('');
  const [showCompanionSuggestions, setShowCompanionSuggestions] = useState(false);
  const [territories, setTerritories] = useState([]);

  // Cargar territorios únicos al montar el componente
  useEffect(() => {
    const outings = loadOutings();
    setTerritories(getUniqueTerritories(outings));
  }, []);

  const filteredCompanions = companions.filter(c =>
    c.toLowerCase().includes(newCompanion.toLowerCase()) &&
    !formData.companions.includes(c)
  );

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCompanion = (companion) => {
    if (companion.trim() && !formData.companions.includes(companion.trim())) {
      setFormData(prev => ({
        ...prev,
        companions: [...prev.companions, companion.trim()]
      }));
      setNewCompanion('');
      setShowCompanionSuggestions(false);
    }
  };

  const handleRemoveCompanion = (index) => {
    setFormData(prev => ({
      ...prev,
      companions: prev.companions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const outingData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      hours: parseFloat(formData.hours) || 0,
      placements: parseInt(formData.placements) || 0,
      videos: parseInt(formData.videos) || 0,
      returnVisits: parseInt(formData.returnVisits) || 0
    };

    if (isEditing) {
      updateOuting(outing.id, outingData);
    } else {
      addOuting(outingData);
    }

    onSuccess();
  };

  const selectedType = OUTING_TYPES[formData.type];

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {isEditing ? '✏️ Editar Salida' : '➕ Nueva Salida'}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {isEditing ? 'Modifica los detalles de la salida' : 'Registra una salida a predicar'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date and Time */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Fecha y Hora
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
              Tipo de Actividad
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.values(OUTING_TYPES).map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleChange('type', type.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    formData.type === type.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 font-semibold'
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.emoji}</div>
                  <div className="text-xs">{type.label.split(' ')[0]}</div>
                </button>
              ))}
            </div>
            {selectedType && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {selectedType.description}
              </p>
            )}
          </div>

          {/* Companions */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Compañeros
            </label>

            {/* Companion chips */}
            {formData.companions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.companions.map((companion, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300
                             px-3 py-1 rounded-full text-sm font-medium"
                  >
                    <span>{companion}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCompanion(index)}
                      className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add companion input */}
            <div className="relative">
              <input
                type="text"
                value={newCompanion}
                onChange={(e) => {
                  setNewCompanion(e.target.value);
                  setShowCompanionSuggestions(true);
                }}
                onFocus={() => setShowCompanionSuggestions(true)}
                placeholder="Agregar compañero..."
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:border-blue-500 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => handleAddCompanion(newCompanion)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Suggestions */}
              {showCompanionSuggestions && filteredCompanions.length > 0 && newCompanion && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600
                              rounded-xl shadow-lg max-h-40 overflow-y-auto">
                  {filteredCompanions.map((companion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAddCompanion(companion)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600
                               text-gray-900 dark:text-white transition-colors"
                    >
                      {companion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Territory */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Territorio
            </label>
            <input
              type="text"
              value={formData.territory}
              onChange={(e) => handleChange('territory', e.target.value)}
              placeholder="Ej: 12-A, Centro, Plaza Principal..."
              list="territories"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:border-blue-500 transition-all"
            />
            <datalist id="territories">
              {territories.map((territory, index) => (
                <option key={index} value={territory} />
              ))}
            </datalist>
          </div>

          {/* Hours and Counts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                ⏱️ Horas
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.hours}
                onChange={(e) => handleChange('hours', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                📚 Colocaciones
              </label>
              <input
                type="number"
                min="0"
                value={formData.placements}
                onChange={(e) => handleChange('placements', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                📱 Videos
              </label>
              <input
                type="number"
                min="0"
                value={formData.videos}
                onChange={(e) => handleChange('videos', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                🔄 Revisitas
              </label>
              <input
                type="number"
                min="0"
                value={formData.returnVisits}
                onChange={(e) => handleChange('returnVisits', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Notas y Experiencias
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Describe la experiencia, personas interesadas, etc..."
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 btn-primary rounded-xl font-semibold
                       flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isEditing ? 'Guardar Cambios' : 'Registrar Salida'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutingForm;
