import React from 'react';
import { exportBackup, importBackup, downloadReport } from '../utils/exportUtils';

export const SettingsModal = ({ 
  show, 
  onClose, 
  publisherType, 
  onPublisherTypeChange, 
  publisherTypes,
  activities,
  setActivities,
  isDark,
  toggleTheme,
  requestNotificationPermission
}) => {
  if (!show) return null;

  const handleExportBackup = () => {
    const backup = exportBackup(activities, publisherType);
    const filename = `backup_${new Date().toISOString().split('T')[0]}.json`;
    downloadReport(backup, filename);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backup = importBackup(event.target.result);
        if (window.confirm(`¿Importar ${backup.activities.length} actividades? Esto reemplazará tus datos actuales.`)) {
          setActivities(backup.activities);
          onPublisherTypeChange(backup.publisherType || publisherType);
          alert('¡Datos importados correctamente!');
        }
      } catch (error) {
        alert(error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between sticky top-0">
          <h2 className="text-xl font-bold">Configuración</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tipo de Publicador */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Publicador</label>
            <div className="space-y-2">
              {Object.entries(publisherTypes).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    onPublisherTypeChange(key);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    publisherType === key
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{value.label}</span>
                    {value.goal > 0 && <span className="text-sm opacity-75">{value.goal} hrs/mes</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Modo Oscuro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Apariencia</label>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
            >
              <span className="flex items-center gap-2">
                <span>{isDark ? '🌙' : '☀️'}</span>
                <span>Modo {isDark ? 'Oscuro' : 'Claro'}</span>
              </span>
              <div className={`w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${isDark ? 'translate-x-6 ml-1' : 'ml-0.5'}`} />
              </div>
            </button>
          </div>

          {/* Notificaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Notificaciones</label>
            <button
              onClick={requestNotificationPermission}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              🔔 Activar Recordatorios
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Recibe recordatorios diarios para registrar tu actividad
            </p>
          </div>

          {/* Backup y Restauración */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Respaldo de Datos</label>
            <div className="space-y-2">
              <button
                onClick={handleExportBackup}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                💾 Exportar Respaldo
              </button>
              
              <label className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                📥 Importar Respaldo
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              El respaldo incluye todas tus actividades y configuración
            </p>
          </div>

          {/* Información */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Versión 2.0 - PWA Profesional
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Con historial, gráficos y notificaciones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};