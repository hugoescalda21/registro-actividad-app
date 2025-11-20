import React, { useState } from 'react';
import { X, User, Download, Upload, Share2, Bell, Sun, Moon, Monitor, FileText, Cloud } from 'lucide-react';
import NotificationSettings from './NotificationSettings';
import GoogleDriveBackup from './GoogleDriveBackup';
import { useThemeContext } from '../contexts/ThemeContext';
import { generateMonthlyReportPDF } from '../utils/pdfGenerator';

const SettingsModal = ({
  isOpen,
  onClose,
  publisherType,
  onPublisherTypeChange,
  publisherTypes,
  activities,
  onImport
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const { themeMode, setTheme, THEME_MODES } = useThemeContext();

  if (!isOpen) return null;

  const handleExport = async () => {
    const data = {
      publisherType,
      activities,
      exportDate: new Date().toISOString(),
      version: '2.3'
    };

    const jsonContent = JSON.stringify(data, null, 2);
    const fileName = `registro-actividad-backup-${new Date().toISOString().split('T')[0]}.json`;

    // Detectar si estamos en Capacitor (Android/iOS)
    const isCapacitor = window.Capacitor !== undefined;

    if (isCapacitor) {
      try {
        // Usar filesystem nativo de Capacitor
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        const { Share } = await import('@capacitor/share');

        // Guardar archivo en el directorio de cache (temporal)
        const result = await Filesystem.writeFile({
          path: fileName,
          data: jsonContent,
          directory: Directory.Cache,
          encoding: 'utf8'
        });

        console.log('[Export] Archivo guardado:', result.uri);

        // Compartir el archivo usando el sistema de compartir nativo
        await Share.share({
          title: 'Exportar Respaldo',
          text: 'Respaldo de Registro de Actividad',
          url: result.uri,
          dialogTitle: 'Guardar respaldo'
        });

        console.log('[Export] ✅ Archivo exportado exitosamente');
      } catch (error) {
        console.error('[Export] Error al exportar:', error);
        alert('Error al exportar el respaldo. Inténtalo de nuevo.');
      }
    } else {
      // Método tradicional para navegador web
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.activities && data.publisherType) {
          if (window.confirm('¿Deseas importar estos datos? Los datos actuales se reemplazarán.')) {
            onImport(data.activities, data.publisherType);
          }
        } else {
          alert('Archivo de respaldo inválido');
        }
      } catch (error) {
        console.error('Error al importar:', error);
        alert('Error al leer el archivo. Verifica que sea un respaldo válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportPDF = async () => {
    try {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const monthActivities = activities.filter(act => {
        const actDate = new Date(act.date);
        return actDate.getMonth() + 1 === currentMonth && actDate.getFullYear() === currentYear;
      });

      const config = publisherTypes[publisherType];

      // Calculate stats
      const stats = {
        totalHours: monthActivities.reduce((sum, act) => sum + (act.hours || 0) + (act.approvedHours || 0), 0),
        preachingHours: monthActivities.reduce((sum, act) => sum + (act.hours || 0), 0),
        approvedHours: monthActivities.reduce((sum, act) => sum + (act.approvedHours || 0), 0),
        totalPlacements: monthActivities.reduce((sum, act) => sum + (act.placements || 0), 0),
        totalVideos: monthActivities.reduce((sum, act) => sum + (act.videos || 0), 0),
        totalReturnVisits: monthActivities.reduce((sum, act) => sum + (act.returnVisits || 0), 0),
        totalStudies: monthActivities.reduce((sum, act) => sum + (act.studies || 0), 0),
      };

      const publisherTypeName = config.label;

      const pdfResult = generateMonthlyReportPDF({
        activities: monthActivities,
        stats,
        config,
        publisherTypeName,
        month: currentMonth,
        year: currentYear
      });

      // Detectar si estamos en Capacitor
      const isCapacitor = window.Capacitor !== undefined;

      if (isCapacitor) {
        // Usar filesystem nativo de Capacitor
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        const { Share } = await import('@capacitor/share');

        // Convertir PDF a base64
        const base64Data = pdfResult.getBase64();

        // Guardar PDF en el directorio de cache
        const result = await Filesystem.writeFile({
          path: pdfResult.fileName,
          data: base64Data,
          directory: Directory.Cache
        });

        console.log('[PDF Export] Archivo guardado:', result.uri);

        // Compartir el PDF usando el sistema de compartir nativo
        await Share.share({
          title: 'Exportar Informe PDF',
          text: 'Informe mensual de actividad',
          url: result.uri,
          dialogTitle: 'Guardar informe'
        });

        console.log('[PDF Export] ✅ PDF exportado exitosamente');
      } else {
        // Método tradicional para navegador web
        pdfResult.save();
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  };

  const handleShare = () => {
    const currentMonth = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const monthActivities = activities.filter(act => {
      const actDate = new Date(act.date);
      const now = new Date();
      return actDate.getMonth() === now.getMonth() && actDate.getFullYear() === now.getFullYear();
    });

    const totalHours = monthActivities.reduce((sum, act) => sum + (act.hours || 0), 0);
    const totalStudies = monthActivities.reduce((sum, act) => sum + (act.studies || 0), 0);
    const config = publisherTypes[publisherType];

    const message = `📊 Mi Informe de Actividad - ${currentMonth}

${config.emoji} ${config.label}

⏱️ Horas: ${totalHours.toFixed(1)}h${config.hours > 0 ? ` / ${config.hours}h` : ''}
🎓 Estudios: ${totalStudies}${config.studies > 0 ? ` / ${config.studies}` : ''}

📱 Registrado con Registro de Actividad`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">⚙️</span>
              Configuración
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all rounded-t-lg ${
              activeTab === 'general'
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <User className="w-4 h-4" />
            General
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all rounded-t-lg ${
              activeTab === 'backup'
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Cloud className="w-4 h-4" />
            Nube
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all rounded-t-lg ${
              activeTab === 'notifications'
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notificaciones
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Tema */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-600" />
                  Tema de la Aplicación
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme(THEME_MODES.LIGHT)}
                    className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      themeMode === THEME_MODES.LIGHT
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Sun className={`w-6 h-6 ${themeMode === THEME_MODES.LIGHT ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span className={`text-sm font-semibold ${themeMode === THEME_MODES.LIGHT ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                      Claro
                    </span>
                  </button>

                  <button
                    onClick={() => setTheme(THEME_MODES.DARK)}
                    className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      themeMode === THEME_MODES.DARK
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Moon className={`w-6 h-6 ${themeMode === THEME_MODES.DARK ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span className={`text-sm font-semibold ${themeMode === THEME_MODES.DARK ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                      Oscuro
                    </span>
                  </button>

                  <button
                    onClick={() => setTheme(THEME_MODES.AUTO)}
                    className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      themeMode === THEME_MODES.AUTO
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Monitor className={`w-6 h-6 ${themeMode === THEME_MODES.AUTO ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span className={`text-sm font-semibold ${themeMode === THEME_MODES.AUTO ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                      Auto
                    </span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {themeMode === THEME_MODES.AUTO
                    ? 'Se ajusta automáticamente según las preferencias de tu dispositivo'
                    : `Tema ${themeMode === THEME_MODES.DARK ? 'oscuro' : 'claro'} activado`}
                </p>
              </div>

              {/* Tipo de publicador */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Tipo de Publicador
                </label>
                <div className="space-y-2">
                  {Object.entries(publisherTypes).map(([key, type]) => (
                    <label
                      key={key}
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        publisherType === key
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="publisherType"
                        value={key}
                        checked={publisherType === key}
                        onChange={(e) => onPublisherTypeChange(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{type.emoji}</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{type.label}</span>
                        </div>
                        {type.hours > 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Meta: {type.hours} horas
                            {type.studies > 0 && `, ${type.studies} estudios`}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Exportar datos */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-600" />
                  Respaldo de Datos
                </label>
                <button
                  onClick={handleExport}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  💾 Exportar Respaldo
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Guarda tus datos en un archivo JSON para respaldo
                </p>
              </div>

              {/* Importar datos */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Restaurar Datos
                </label>
                <label className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95">
                  <Upload className="w-5 h-5" />
                  📥 Importar Respaldo
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Restaura tus datos desde un archivo de respaldo
                </p>
              </div>

              {/* Exportar informe PDF */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  Informe en PDF
                </label>
                <button
                  onClick={handleExportPDF}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <FileText className="w-5 h-5" />
                  📄 Exportar Informe en PDF
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Genera un informe en PDF del mes actual con todas tus actividades
                </p>
              </div>

              {/* Compartir */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-600" />
                  Compartir Informe
                </label>
                <button
                  onClick={handleShare}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <Share2 className="w-5 h-5" />
                  💬 Compartir por WhatsApp
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Comparte tu informe del mes actual
                </p>
              </div>

              {/* Info de la app */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Información</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Versión:</strong> 2.11.0</p>
                  <p><strong>Actividades registradas:</strong> {activities.length}</p>
                  <p><strong>Tipo actual:</strong> {publisherTypes[publisherType].label}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  Respaldo en la Nube
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Sincroniza y respalda tus datos de forma segura en Google Drive.
                  Accede a ellos desde cualquier dispositivo.
                </p>
              </div>

              <GoogleDriveBackup
                activities={activities}
                publisherType={publisherType}
                onImport={onImport}
              />
            </div>
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings onClose={onClose} />
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full btn-primary py-3"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;