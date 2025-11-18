import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Plus, MapPin, Phone, Mail, Calendar, MessageCircle, Clock } from 'lucide-react';
import { RETURN_VISIT_STATUSES, formatVisitDate, addVisitToReturnVisit } from '../utils/returnVisitsUtils';
import VisitForm from './VisitForm';

const ReturnVisitDetail = ({ returnVisit, onBack, onUpdate, onDelete, onEdit }) => {
  const [showVisitForm, setShowVisitForm] = useState(false);
  const status = RETURN_VISIT_STATUSES[returnVisit.status];

  const handleAddVisit = (visitData) => {
    const updated = addVisitToReturnVisit(returnVisit, visitData);
    onUpdate(updated);
    setShowVisitForm(false);
  };

  const handleDeleteVisit = (visitId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta visita?')) {
      const updatedVisits = returnVisit.visits.filter(v => v.id !== visitId);
      const lastVisit = updatedVisits.length > 0
        ? updatedVisits[updatedVisits.length - 1].date
        : null;

      onUpdate({
        ...returnVisit,
        visits: updatedVisits,
        lastVisitDate: lastVisit
      });
    }
  };

  if (showVisitForm) {
    return (
      <VisitForm
        returnVisit={returnVisit}
        onSave={handleAddVisit}
        onCancel={() => setShowVisitForm(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card-gradient p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la lista
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {returnVisit.name}
            </h1>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-${status.color}-100 dark:bg-${status.color}-900/30 text-${status.color}-700 dark:text-${status.color}-300`}>
              <span className="text-lg">{status.emoji}</span>
              <span>{status.label}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
              title="Editar"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(returnVisit.id)}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="card-gradient p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Información de Contacto
        </h2>
        <div className="space-y-3">
          {returnVisit.address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Dirección</div>
                <div className="font-semibold text-gray-800 dark:text-white">{returnVisit.address}</div>
              </div>
            </div>
          )}

          {returnVisit.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Teléfono</div>
                <a
                  href={`tel:${returnVisit.phone}`}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {returnVisit.phone}
                </a>
              </div>
            </div>
          )}

          {returnVisit.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                <a
                  href={`mailto:${returnVisit.email}`}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {returnVisit.email}
                </a>
              </div>
            </div>
          )}

          {returnVisit.nextVisitDate && (
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Próxima Visita</div>
                <div className="font-semibold text-gray-800 dark:text-white">
                  {new Date(returnVisit.nextVisitDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {returnVisit.notes && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Notas</div>
                <div className="text-gray-800 dark:text-white whitespace-pre-wrap">{returnVisit.notes}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historial de visitas */}
      <div className="card-gradient p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Historial de Visitas ({returnVisit.visits.length})
          </h2>
          <button
            onClick={() => setShowVisitForm(true)}
            className="btn-primary px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Registrar Visita
          </button>
        </div>

        {returnVisit.visits.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              Aún no hay visitas registradas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Comienza registrando tu primera visita a {returnVisit.name}
            </p>
            <button
              onClick={() => setShowVisitForm(true)}
              className="btn-primary px-6 py-3 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Registrar Primera Visita
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {[...returnVisit.visits].reverse().map((visit, index) => (
              <div
                key={visit.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        {new Date(visit.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      {index === 0 && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">
                          Más reciente
                        </span>
                      )}
                    </div>
                    {visit.duration > 0 && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ⏱️ Duración: {visit.duration} {visit.duration === 1 ? 'hora' : 'horas'}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteVisit(visit.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Eliminar visita"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {visit.topic && (
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tema: </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{visit.topic}</span>
                  </div>
                )}

                {visit.notes && (
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notas: </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mt-1">
                      {visit.notes}
                    </p>
                  </div>
                )}

                {visit.publications && visit.publications.length > 0 && (
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Publicaciones: </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {visit.publications.map((pub, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                        >
                          {pub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {visit.nextSteps && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Próximos pasos:
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{visit.nextSteps}</p>
                  </div>
                )}

                {!visit.wasHome && (
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                      No estaba en casa
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnVisitDetail;
