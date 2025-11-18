import React, { useState } from 'react';
import { X, Save, Calendar, Clock, MessageCircle, BookOpen, ArrowRight } from 'lucide-react';

const VisitForm = ({ returnVisit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    wasHome: true,
    topic: '',
    notes: '',
    publications: '',
    nextSteps: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const visitData = {
      ...formData,
      duration: parseFloat(formData.duration) || 0,
      publications: formData.publications
        ? formData.publications.split(',').map(p => p.trim()).filter(p => p)
        : []
    };

    onSave(visitData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card-gradient p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Calendar className="w-7 h-7 text-blue-600" />
              Registrar Visita
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Visita a: <span className="font-semibold">{returnVisit.name}</span>
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Fecha y duración */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Fecha
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                Duración (horas)
              </label>
              <input
                type="number"
                step="0.25"
                min="0"
                max="24"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="0.5"
              />
            </div>
          </div>

          {/* ¿Estaba en casa? */}
          <div>
            <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={formData.wasHome}
                onChange={(e) => handleChange('wasHome', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-semibold text-gray-800 dark:text-white">
                  ¿Estaba en casa?
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Marca si pudiste hablar con la persona
                </div>
              </div>
            </label>
          </div>

          {/* Tema de conversación */}
          {formData.wasHome && (
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                Tema de Conversación
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Ej: La esperanza de la resurrección"
              />
            </div>
          )}

          {/* Publicaciones */}
          {formData.wasHome && (
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-600" />
                Publicaciones Dejadas
              </label>
              <input
                type="text"
                value={formData.publications}
                onChange={(e) => handleChange('publications', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Ej: Atalaya Nov 2025, Folleto Vida (separados por comas)"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separa múltiples publicaciones con comas
              </p>
            </div>
          )}

          {/* Notas */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-indigo-600" />
              Notas de la Visita
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
              placeholder={
                formData.wasHome
                  ? "¿Qué hablaron? ¿Cómo reaccionó? ¿Qué aprendiste?"
                  : "Deja una nota (ej: Dejé folleto en la puerta)"
              }
            />
          </div>

          {/* Próximos pasos */}
          {formData.wasHome && (
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-orange-600" />
                Próximos Pasos
              </label>
              <textarea
                value={formData.nextSteps}
                onChange={(e) => handleChange('nextSteps', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                placeholder="¿Qué tema tratarás en la próxima visita?"
              />
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 btn-primary flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Guardar Visita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitForm;
