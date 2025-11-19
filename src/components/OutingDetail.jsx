import React from 'react';
import { ArrowLeft, Edit2, Trash2, Calendar, Clock, Users, MapPin, FileText, Award } from 'lucide-react';
import { OUTING_TYPES } from '../utils/congregationOutingsUtils';

const OutingDetail = ({ outing, onClose, onEdit, onDelete }) => {
  const typeInfo = OUTING_TYPES[outing.type] || OUTING_TYPES.other;
  const outingDate = new Date(outing.date);

  const formattedDate = outingDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const formattedTime = outingDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r from-${typeInfo.color}-600 to-${typeInfo.color}-700 text-white p-6`}>
          <button
            onClick={onClose}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="flex items-start gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <span className="text-5xl">{typeInfo.emoji}</span>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{typeInfo.label}</h2>
              <p className="text-white/80 text-sm mb-3">{typeInfo.description}</p>

              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4" />
                  <span className="capitalize">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>{formattedTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Statistics */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Resultados
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Horas</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {outing.hours || 0}h
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Colocaciones</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {outing.placements || 0}
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Videos</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {outing.videos || 0}
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border-2 border-orange-200 dark:border-orange-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Revisitas</div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {outing.returnVisits || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Territory */}
          {outing.territory && (
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Territorio
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {outing.territory}
                </p>
              </div>
            </div>
          )}

          {/* Companions */}
          {outing.companions && outing.companions.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Compañeros ({outing.companions.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {outing.companions.map((companion, index) => (
                  <div
                    key={index}
                    className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800
                             text-green-700 dark:text-green-300 px-4 py-2 rounded-full font-medium"
                  >
                    {companion}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {outing.notes && (
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Notas y Experiencias
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {outing.notes}
                </p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm">
              Información del registro
            </h4>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <p>
                <strong>Creado:</strong>{' '}
                {new Date(outing.createdAt).toLocaleString('es-ES')}
              </p>
              {outing.updatedAt && outing.updatedAt !== outing.createdAt && (
                <p>
                  <strong>Última actualización:</strong>{' '}
                  {new Date(outing.updatedAt).toLocaleString('es-ES')}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onEdit(outing)}
              className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold
                       flex items-center justify-center gap-2 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              Editar
            </button>
            <button
              onClick={() => onDelete(outing.id)}
              className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold
                       flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutingDetail;
