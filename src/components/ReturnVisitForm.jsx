import React, { useState } from 'react';
import { X, Save, User, MapPin, Phone, Mail, Calendar, MessageCircle } from 'lucide-react';
import { createReturnVisit, RETURN_VISIT_STATUSES } from '../utils/returnVisitsUtils';

const ReturnVisitForm = ({ returnVisit, onSave, onCancel }) => {
  const isEditing = !!returnVisit;

  const [formData, setFormData] = useState({
    name: returnVisit?.name || '',
    address: returnVisit?.address || '',
    phone: returnVisit?.phone || '',
    email: returnVisit?.email || '',
    status: returnVisit?.status || 'interested',
    nextVisitDate: returnVisit?.nextVisitDate || '',
    notes: returnVisit?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al cambiar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (formData.phone && !/^[0-9\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Teléfono inválido';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (isEditing) {
      // Actualizar existente
      onSave({
        ...returnVisit,
        ...formData
      });
    } else {
      // Crear nuevo
      const newReturnVisit = createReturnVisit(formData);
      onSave(newReturnVisit);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card-gradient p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <User className="w-7 h-7 text-blue-600" />
            {isEditing ? 'Editar Revisita' : 'Nueva Revisita'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Nombre *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
              }`}
              placeholder="Nombre completo"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              Dirección
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="Calle, número, ciudad"
            />
          </div>

          {/* Teléfono y Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                  errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
                placeholder="+1 234 567 890"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-600" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                  errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
                placeholder="email@ejemplo.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              Estado
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(RETURN_VISIT_STATUSES).map(([key, status]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleChange('status', key)}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${
                    formData.status === key
                      ? `border-${status.color}-500 bg-${status.color}-50 dark:bg-${status.color}-900/30`
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <span className="text-2xl">{status.emoji}</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {status.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Próxima visita */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Próxima Visita
            </label>
            <input
              type="date"
              value={formData.nextVisitDate}
              onChange={(e) => handleChange('nextVisitDate', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-indigo-600" />
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
              placeholder="Intereses, temas de conversación, situación personal, etc."
            />
          </div>

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
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnVisitForm;
