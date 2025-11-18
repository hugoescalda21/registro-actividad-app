import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Target, Flame, Trophy, Calendar, Volume2, Vibrate, Timer, Plus, X as XIcon, Edit2 } from 'lucide-react';
import { isAndroid } from '../utils/androidNotifications';
import { 
  isNotificationSupported, 
  hasNotificationPermission, 
  requestNotificationPermission,
  loadNotificationSettings,
  saveNotificationSettings,
  sendNotification
} from '../utils/notificationUtils';

const NotificationSettings = ({ onClose }) => {
  const [permission, setPermission] = useState(Notification.permission);
  const [settings, setSettings] = useState(loadNotificationSettings());
  const [isSupported] = useState(isNotificationSupported());

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    
    if (result === 'granted') {
      sendNotification('🔔 Notificaciones Activadas', {
        body: 'Recibirás notificaciones de la app',
        tag: 'permission-granted'
      });
    }
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
  };

  const handleTestNotification = async () => {
    console.log('[NotificationTest] Iniciando prueba de notificación...');
    console.log('[NotificationTest] Service Worker disponible:', 'serviceWorker' in navigator);
    console.log('[NotificationTest] Service Worker controlado:', navigator.serviceWorker?.controller);
    console.log('[NotificationTest] Permiso actual:', Notification.permission);

    const result = await sendNotification('🧪 Notificación de Prueba', {
      body: 'Así se verán tus notificaciones',
      tag: 'test',
      requireInteraction: false
    });

    console.log('[NotificationTest] Resultado:', result);

    if (result?.success) {
      console.log('[NotificationTest] ✅ Notificación enviada a través del Service Worker');
    } else {
      console.log('[NotificationTest] ℹ️ Notificación enviada directamente');
    }
  };

  const handleAddCustomReminder = () => {
    const newReminder = {
      id: Date.now().toString(),
      time: '12:00',
      label: 'Recordatorio',
      enabled: true
    };
    const newReminders = [...(settings.customReminders || []), newReminder];
    handleSettingChange('customReminders', newReminders);
  };

  const handleUpdateCustomReminder = (id, updates) => {
    const newReminders = settings.customReminders.map(r =>
      r.id === id ? { ...r, ...updates } : r
    );
    handleSettingChange('customReminders', newReminders);
  };

  const handleDeleteCustomReminder = (id) => {
    const newReminders = settings.customReminders.filter(r => r.id !== id);
    handleSettingChange('customReminders', newReminders);
  };

  {/* Botón de prueba Android */}
{isAndroid() && (
  <button
    onClick={async () => {
      const { showAndroidNotification } = await import('../utils/androidNotifications');
      const success = await showAndroidNotification('🧪 Prueba Android', {
        body: 'Notificación de prueba para Android',
        tag: 'test-android',
        requireInteraction: true,
        actions: [
          { action: 'ok', title: '✅ OK' },
          { action: 'cancel', title: '❌ Cancelar' }
        ]
      });
      if (success) {
        alert('✅ Notificación enviada (revisa la barra de notificaciones)');
      } else {
        alert('❌ Error al enviar notificación');
      }
    }}
    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
  >
    <Bell className="w-5 h-5" />
    Probar Notificación Android
  </button>
)}

  const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  if (!isSupported) {
    return (
      <div className="p-6 text-center">
        <BellOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Notificaciones No Disponibles
        </h3>
        <p className="text-gray-600">
          Tu navegador no soporta notificaciones del sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      {/* Solicitar permiso */}
      {permission !== 'granted' && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Bell className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-blue-800 mb-2">
                Activa las Notificaciones
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Permite que la app te envíe notificaciones para recordatorios y logros.
              </p>
              {permission === 'denied' ? (
                <p className="text-xs text-red-600 font-semibold">
                  ⚠️ Has bloqueado las notificaciones. Actívalas en la configuración de tu navegador.
                </p>
              ) : (
                <button
                  onClick={handleRequestPermission}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Permitir Notificaciones
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Activar/Desactivar notificaciones */}
      {permission === 'granted' && (
        <>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${settings.enabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Notificaciones</h3>
                  <p className="text-sm text-gray-600">
                    {settings.enabled ? 'Activadas' : 'Desactivadas'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>

          {/* Opciones de notificaciones */}
          {settings.enabled && (
            <div className="space-y-4">
              {/* Recordatorio diario */}
              <div className="card-gradient p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800 dark:text-gray-100">Recordatorio Diario</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.dailyReminder}
                          onChange={(e) => handleSettingChange('dailyReminder', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Recibe un recordatorio para registrar tu actividad
                    </p>
                    {settings.dailyReminder && (
                      <input
                        type="time"
                        value={settings.dailyReminderTime}
                        onChange={(e) => handleSettingChange('dailyReminderTime', e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:border-blue-500 focus:ring-0"
                        style={{ fontSize: '16px' }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Recordatorios personalizados */}
              <div className="card-gradient p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Bell className="w-5 h-5 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800 dark:text-gray-100">Recordatorios Personalizados</h4>
                      <button
                        onClick={handleAddCustomReminder}
                        className="p-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                        title="Agregar recordatorio"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Crea múltiples recordatorios a diferentes horas
                    </p>

                    {settings.customReminders && settings.customReminders.length > 0 && (
                      <div className="space-y-2">
                        {settings.customReminders.map((reminder) => (
                          <div
                            key={reminder.id}
                            className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={reminder.enabled}
                                onChange={(e) =>
                                  handleUpdateCustomReminder(reminder.id, {
                                    enabled: e.target.checked
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                            </label>

                            <input
                              type="text"
                              value={reminder.label}
                              onChange={(e) =>
                                handleUpdateCustomReminder(reminder.id, {
                                  label: e.target.value
                                })
                              }
                              className="flex-1 px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded focus:border-purple-500 focus:ring-0"
                              placeholder="Etiqueta"
                              style={{ fontSize: '14px' }}
                            />

                            <input
                              type="time"
                              value={reminder.time}
                              onChange={(e) =>
                                handleUpdateCustomReminder(reminder.id, {
                                  time: e.target.value
                                })
                              }
                              className="px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded focus:border-purple-500 focus:ring-0"
                              style={{ fontSize: '14px' }}
                            />

                            <button
                              onClick={() => handleDeleteCustomReminder(reminder.id)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                              title="Eliminar"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {(!settings.customReminders || settings.customReminders.length === 0) && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        No hay recordatorios personalizados. Haz clic en + para agregar uno.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Alertas de progreso */}
              <div className="card-gradient p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-bold text-gray-800">Alertas de Progreso</h4>
                      <p className="text-sm text-gray-600">25%, 50%, 75%, 100% de tu meta</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.goalAlerts}
                      onChange={(e) => handleSettingChange('goalAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>

              {/* Alertas de racha */}
              <div className="card-gradient p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-orange-600" />
                    <div>
                      <h4 className="font-bold text-gray-800">Alertas de Racha</h4>
                      <p className="text-sm text-gray-600">Notificaciones de días consecutivos</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.streakAlerts}
                      onChange={(e) => handleSettingChange('streakAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>

              {/* Alertas de logros */}
              <div className="card-gradient p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <div>
                      <h4 className="font-bold text-gray-800">Logros y Badges</h4>
                      <p className="text-sm text-gray-600">Primera actividad, 10 actividades, etc.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.achievementAlerts}
                      onChange={(e) => handleSettingChange('achievementAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
              </div>
              
              {/* Notificación persistente del cronómetro */}
<div className="card-gradient p-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Timer className="w-5 h-5 text-blue-600" />
      <div>
        <h4 className="font-bold text-gray-800">Notificación Persistente</h4>
        <p className="text-sm text-gray-600">Cronómetro en barra de notificaciones</p>
      </div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={settings.persistentStopwatch}
        onChange={(e) => handleSettingChange('persistentStopwatch', e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
    </label>
  </div>
  <p className="text-xs text-gray-500 mt-2">
    ℹ️ Muestra el cronómetro en la barra de notificaciones del sistema con controles rápidos
  </p>
</div>

              {/* Resumen semanal */}
              <div className="card-gradient p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800">Resumen Semanal</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.weeklyReport}
                          onChange={(e) => handleSettingChange('weeklyReport', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Recibe un resumen de tu actividad semanal
                    </p>
                    {settings.weeklyReport && (
                      <select
                        value={settings.weeklyReportDay}
                        onChange={(e) => handleSettingChange('weeklyReportDay', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-0"
                        style={{ fontSize: '16px' }}
                      >
                        {weekDays.map((day, index) => (
                          <option key={index} value={index}>
                            {day}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Opciones de sonido y vibración */}
              <div className="grid grid-cols-2 gap-3">
                <div className="card-gradient p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-800">Sonido</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.sound}
                        onChange={(e) => handleSettingChange('sound', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>

                <div className="card-gradient p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Vibrate className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-800">Vibración</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.vibration}
                        onChange={(e) => handleSettingChange('vibration', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Botón de prueba */}
              <button
                onClick={handleTestNotification}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                Enviar Notificación de Prueba
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationSettings;