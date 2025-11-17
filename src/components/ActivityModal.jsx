import React, { useState, useEffect } from 'react';
import { activityTypes } from '../utils/constants';
import { useModal } from '../contexts/ModalContext';

export const ActivityModal = ({
  show,
  onClose,
  onSubmit,
  editingActivity,
  config
}) => {
  const modal = useModal();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'predicacion',
    hours: '',
    minutes: '',
    studies: '',
    approvedHours: '',
    approvedDetail: '',
    notes: ''
  });

  useEffect(() => {
    if (editingActivity) {
      setFormData(editingActivity);
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'predicacion',
        hours: '',
        minutes: '',
        studies: '',
        approvedHours: '',
        approvedDetail: '',
        notes: ''
      });
    }
  }, [editingActivity, show]);

  const handleSubmit = async () => {
    if (config.canLogHours) {
      const totalMinutes = parseInt(formData.hours || 0) * 60 + parseInt(formData.minutes || 0);
      if (totalMinutes === 0 && !formData.studies) {
        await modal.warning('Debes ingresar al menos horas o un curso bíblico', 'Campo requerido');
        return;
      }
    }

    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b px-4 py-3 flex justify-between rounded-t-2xl sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-800">
            {editingActivity ? 'Editar Actividad' : 'Nueva Actividad'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-3 pb-20">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {config.canLogHours && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Actividad</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(activityTypes).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horas</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minutos</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.minutes}
                    onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cursos Bíblicos</label>
            <input
              type="number"
              min="0"
              value={formData.studies}
              onChange={(e) => setFormData({ ...formData, studies: e.target.value })}
              className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          {config.canLogApproved && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span>✓</span>
                <label className="text-sm font-bold text-green-800">Horas Aprobadas</label>
              </div>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.approvedHours}
                onChange={(e) => setFormData({ ...formData, approvedHours: e.target.value })}
                className="w-full px-4 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
                placeholder="0"
              />
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detalle de Horas Aprobadas
              </label>
              <textarea
                value={formData.approvedDetail}
                onChange={(e) => setFormData({ ...formData, approvedDetail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="2"
                placeholder="Ej: Construcción de Salón del Reino, Congreso Regional, etc."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Notas adicionales (opcional)"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              {editingActivity ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};