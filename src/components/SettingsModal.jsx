import React, { useState } from 'react';
import { X, User, Download, Upload, Trash2, CheckCircle, AlertCircle, Database, Zap } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, publisherType, onPublisherTypeChange, publisherTypes, activities, onImport }) => {
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const data = {
      publisherType,
      activities,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registro-actividad-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.activities && Array.isArray(data.activities)) {
          onImport(data.activities, data.publisherType);
          setImportSuccess(true);
          setImportError('');
          setTimeout(() => {
            setImportSuccess(false);
            onClose();
          }, 2000);
        } else {
          setImportError('Formato de archivo inválido');
        }
      } catch (error) {
        setImportError('Error al leer el archivo');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ ¿Estás seguro de que quieres borrar TODOS los datos? Esta acción no se puede deshacer.')) {
      if (window.confirm('🚨 ÚLTIMA ADVERTENCIA: Se borrarán todas las actividades registradas. ¿Continuar?')) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  const totalHours = activities.reduce((sum, act) => sum + act.hours, 0);
  const totalActivities = activities.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 rounded-t-3xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                <Zap className="w-7 h-7" />
                Configuración
              </h2>
              <p className="text-purple-100 text-sm font-medium">
                Gestiona tu cuenta y datos
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-2 transition-all duration-200 hover-scale"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Mensajes de estado */}
          {importSuccess && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-semibold">¡Datos importados exitosamente!</span>
            </div>
          )}

          {importError && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-semibold">{importError}</span>
            </div>
          )}

          {/* Estadísticas rápidas */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-800">Resumen de Datos</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-blue-600">{totalActivities}</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Actividades</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-purple-600">{totalHours.toFixed(1)}</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Horas Totales</div>
              </div>
            </div>
          </div>

          {/* Tipo de Publicador */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Tipo de Publicador
            </label>
            <div className="space-y-2">
              {Object.entries(publisherTypes).map(([key, type]) => (
                <button
                  key={key}
                  onClick={() => onPublisherTypeChange(key)}
                  className={`w-full px-5 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-between border-2 ${
                    publisherType === key
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg scale-105'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:shadow-md hover-lift'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{type.emoji}</span>
                    <span>{type.label}</span>
                  </span>
                  {publisherType === key && (
                    <CheckCircle className="w-5 h-5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Gestión de Datos */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-gray-600" />
              Gestión de Datos
            </h3>
            <div className="space-y-3">
              {/* Exportar */}
              <button
                onClick={handleExport}
                className="w-full px-5 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover-lift"
              >
                <Download className="w-5 h-5" />
                Exportar Datos
              </button>

              {/* Importar */}
              <label className="block">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <div className="w-full px-5 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover-lift">
                  <Upload className="w-5 h-5" />
                  Importar Datos
                </div>
              </label>

              {/* Borrar todo */}
              <button
                onClick={handleClearData}
                className="w-full px-5 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover-lift"
              >
                <Trash2 className="w-5 h-5" />
                Borrar Todos los Datos
              </button>
            </div>
          </div>

          {/* Información */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
            <p className="font-semibold text-gray-800 mb-2">ℹ️ Información</p>
            <ul className="space-y-1">
              <li>• Los datos se guardan localmente en tu dispositivo</li>
              <li>• Exporta regularmente para hacer respaldo</li>
              <li>• La importación reemplazará todos los datos actuales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;