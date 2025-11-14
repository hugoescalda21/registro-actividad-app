import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, Award, FileText, Save, X, CheckCircle } from 'lucide-react';
import Stopwatch from './Stopwatch';
import LoadingSpinner from './LoadingSpinner';

const RegisterView = ({ 
  onSave, 
  onUpdate,
  config, 
  activities, 
  triggerFormOpen, 
  triggerStopwatchOpen,
  editingActivity
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showStopwatch, setShowStopwatch] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: '',
    studies: '',
    approvedHours: '',
    approvedDetail: '',
    notes: ''
  });

  useEffect(() => {
    if (editingActivity) {
      setFormData({
        date: editingActivity.date,
        hours: editingActivity.hours || '',
        studies: editingActivity.studies || '',
        approvedHours: editingActivity.approvedHours || '',
        approvedDetail: editingActivity.approvedDetail || '',
        notes: editingActivity.notes || ''
      });
      setIsEditing(true);
      setShowForm(true);
      setShowStopwatch(false);
    }
  }, [editingActivity]);

  useEffect(() => {
    if (triggerFormOpen > 0 && !editingActivity) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        hours: '',
        studies: '',
        approvedHours: '',
        approvedDetail: '',
        notes: ''
      });
      setIsEditing(false);
      setShowForm(true);
      setShowStopwatch(false);
    }
  }, [triggerFormOpen, editingActivity]);

  useEffect(() => {
    if (triggerStopwatchOpen > 0) {
      setShowStopwatch(true);
      setShowForm(false);
      setIsEditing(false);
    }
  }, [triggerStopwatchOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (config.canLogHours && (!formData.hours || parseFloat(formData.hours) === 0)) {
      alert('Debes ingresar las horas de predicación');
      return;
    }

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 400));

    const activity = {
      id: isEditing ? editingActivity.id : Date.now(),
      date: formData.date,
      hours: config.canLogHours ? parseFloat(formData.hours) || 0 : 0,
      placements: 0,
      videos: 0,
      returnVisits: 0,
      studies: parseInt(formData.studies) || 0,
      approvedHours: config.canLogApproved ? parseFloat(formData.approvedHours) || 0 : 0,
      approvedDetail: config.canLogApproved ? formData.approvedDetail.trim() : '',
      notes: formData.notes.trim()
    };

    if (isEditing && onUpdate) {
      onUpdate(activity);
    } else {
      onSave(activity);
    }

    setIsSubmitting(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      hours: '',
      studies: '',
      approvedHours: '',
      approvedDetail: '',
      notes: ''
    });
    setShowForm(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleStopwatchSave = (hours) => {
    setFormData({ ...formData, hours: hours.toFixed(2) });
    setShowStopwatch(false);
    setShowForm(true);
  };

  const lastActivity = activities.length > 0 
    ? [...activities].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {lastActivity && !showForm && !showStopwatch && (
        <div className="card-gradient p-5 border-l-4 border-blue-500 hover-lift md:p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Última actividad registrada
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-base font-bold text-gray-800 mb-2 md:text-lg">
                {new Date(lastActivity.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                {config.canLogHours && lastActivity.hours > 0 && (
                  <span className="badge badge-primary">
                    ⏱️ {lastActivity.hours}h
                  </span>
                )}
                {lastActivity.studies > 0 && (
                  <span className="badge badge-warning">
                    🎓 {lastActivity.studies} estudio{lastActivity.studies !== 1 ? 's' : ''}
                  </span>
                )}
                {config.canLogApproved && lastActivity.approvedHours > 0 && (
                  <span className="badge badge-success">
                    ✅ {lastActivity.approvedHours}h aprobadas
                  </span>
                )}
              </div>
            </div>
            {config.canLogHours && lastActivity.hours > 0 && (
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-bold text-lg shadow-sm ml-4">
                {lastActivity.hours}h
              </div>
            )}
          </div>
        </div>
      )}

      {!showForm && !showStopwatch && !lastActivity && (
        <div className="card-gradient p-12 text-center">
          <div className="text-6xl mb-4">👇</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            Comienza a registrar
          </h3>
          <p className="text-gray-500 text-base">
            <span className="hidden md:inline">Usa el botón flotante + de la esquina inferior izquierda</span>
            <span className="md:hidden">Usa el botón Nueva de abajo</span>
            <br />para agregar una nueva actividad
          </p>
        </div>
      )}

      {showStopwatch && config.canLogHours && (
        <div className="animate-scaleIn">
          <Stopwatch
            onSave={handleStopwatchSave}
            onCancel={() => setShowStopwatch(false)}
          />
        </div>
      )}

      {showForm && (
        <div className="card-gradient p-5 animate-scaleIn md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 md:text-2xl">
              <FileText className="w-5 h-5 text-blue-600 md:w-6 md:h-6" />
              {isEditing ? 'Editar Actividad' : 'Nueva Actividad'}
            </h2>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-target disabled:opacity-50"
              aria-label="Cancelar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Fecha
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white"
                required
                disabled={isSubmitting}
                style={{ fontSize: '16px' }}
              />
            </div>

            {config.canLogHours && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Horas de Predicación *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white"
                    placeholder="0.0"
                    required
                    disabled={isSubmitting}
                    style={{ fontSize: '16px' }}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    horas
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-600" />
                Estudios Bíblicos
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={formData.studies}
                onChange={(e) => setFormData({ ...formData, studies: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-0 transition-colors bg-white"
                placeholder="0"
                min="0"
                disabled={isSubmitting}
                style={{ fontSize: '16px' }}
              />
            </div>

            {config.canLogApproved && (
              <>
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <label className="block text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Horas Aprobadas
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={formData.approvedHours}
                    onChange={(e) => setFormData({ ...formData, approvedHours: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:border-green-500 focus:ring-0 transition-colors bg-white font-semibold"
                    placeholder="0.0"
                    min="0"
                    disabled={isSubmitting}
                    style={{ fontSize: '16px' }}
                  />
                </div>

                {formData.approvedHours && parseFloat(formData.approvedHours) > 0 && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 animate-fadeIn">
                    <label className="block text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      Detalle de Horas Aprobadas *
                    </label>
                    <textarea
                      value={formData.approvedDetail}
                      onChange={(e) => setFormData({ ...formData, approvedDetail: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:border-green-500 focus:ring-0 transition-colors bg-white resize-none"
                      rows="3"
                      placeholder="Ej: Construcción de Salón del Reino, Ayuda en Betel, etc."
                      required={formData.approvedHours && parseFloat(formData.approvedHours) > 0}
                      disabled={isSubmitting}
                      style={{ fontSize: '16px' }}
                    />
                    <p className="text-xs text-green-700 mt-2">
                      💡 Especifica la actividad que generó las horas aprobadas
                    </p>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                Notas (opcional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 transition-colors bg-white resize-none"
                rows="3"
                placeholder="Agrega comentarios sobre tu actividad..."
                disabled={isSubmitting}
                style={{ fontSize: '16px' }}
              />
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 font-medium">
                <span className="font-bold">ℹ️ Campos para {config.label}:</span>
                <br />
                {config.canLogHours && '• Horas de predicación'}
                {config.canLogHours && <br />}
                • Estudios bíblicos
                {config.canLogApproved && <br />}
                {config.canLogApproved && '• Horas aprobadas con detalle'}
                <br />
                • Notas
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors active:scale-95 min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary flex items-center justify-center gap-2 active:scale-95 min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span>{isEditing ? 'Actualizando...' : 'Guardando...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{isEditing ? 'Actualizar' : 'Guardar'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegisterView;