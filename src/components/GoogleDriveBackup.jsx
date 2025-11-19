import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, Upload, Download, Trash2, Check, AlertCircle, Loader } from 'lucide-react';
import { useGoogleDrive } from '../hooks/useGoogleDrive';

const GoogleDriveBackup = ({ activities, publisherType, onImport }) => {
  const {
    isInitialized,
    isSignedIn,
    userInfo,
    isLoading,
    error,
    signIn,
    signOut,
    saveBackup,
    listBackups,
    downloadBackup,
    deleteBackup,
  } = useGoogleDrive();

  const [backupsList, setBackupsList] = useState([]);
  const [showBackupsList, setShowBackupsList] = useState(false);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar lista de backups al autenticarse
  useEffect(() => {
    if (isSignedIn && showBackupsList) {
      loadBackupsList();
    }
  }, [isSignedIn, showBackupsList]);

  const loadBackupsList = async () => {
    setLoadingBackups(true);
    try {
      const backups = await listBackups();
      setBackupsList(backups);
    } catch (err) {
      console.error('Error al cargar backups:', err);
    } finally {
      setLoadingBackups(false);
    }
  };

  const handleSaveBackup = async () => {
    const data = {
      publisherType,
      activities,
      exportDate: new Date().toISOString(),
    };

    const result = await saveBackup(data);

    if (result) {
      setSuccessMessage('✅ Backup guardado en Google Drive');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Recargar lista
      if (showBackupsList) {
        await loadBackupsList();
      }
    }
  };

  const handleRestoreBackup = async (fileId) => {
    if (!window.confirm('¿Deseas restaurar este backup? Los datos actuales se reemplazarán.')) {
      return;
    }

    const data = await downloadBackup(fileId);

    if (data) {
      onImport(data.activities, data.publisherType);
      setSuccessMessage('✅ Backup restaurado correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteBackup = async (fileId, fileName) => {
    if (!window.confirm(`¿Estás seguro de eliminar el backup "${fileName}"?`)) {
      return;
    }

    const success = await deleteBackup(fileId);

    if (success) {
      setSuccessMessage('✅ Backup eliminado');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadBackupsList();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  if (!isInitialized) {
    return (
      <div className="text-center py-4">
        <Loader className="w-6 h-6 animate-spin mx-auto text-blue-600" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Inicializando Google Drive...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-800 dark:text-red-200">Error</p>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600" />
          <p className="text-sm font-semibold text-green-800 dark:text-green-200">{successMessage}</p>
        </div>
      )}

      {/* Estado de autenticación */}
      {!isSignedIn ? (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg">
              <Cloud className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1">
                Backup en Google Drive
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Guarda tus datos de forma segura en la nube y accede a ellos desde cualquier dispositivo.
              </p>
            </div>
          </div>

          <button
            onClick={signIn}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Conectar con Google
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            Tus datos se guardarán de forma privada en tu cuenta de Google Drive
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Usuario conectado */}
          <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {userInfo?.imageUrl && (
                  <img
                    src={userInfo.imageUrl}
                    alt={userInfo.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{userInfo?.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{userInfo?.email}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                disabled={isLoading}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold flex items-center gap-1 disabled:opacity-50"
              >
                <CloudOff className="w-4 h-4" />
                Desconectar
              </button>
            </div>
          </div>

          {/* Acciones principales */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSaveBackup}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              Guardar Backup
            </button>

            <button
              onClick={() => setShowBackupsList(!showBackupsList)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-5 h-5" />
              Ver Backups
            </button>
          </div>

          {/* Lista de backups */}
          {showBackupsList && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Backups Disponibles
              </h4>

              {loadingBackups ? (
                <div className="text-center py-4">
                  <Loader className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Cargando backups...</p>
                </div>
              ) : backupsList.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 py-4">
                  No hay backups guardados
                </p>
              ) : (
                <div className="space-y-2">
                  {backupsList.map((backup) => (
                    <div
                      key={backup.id}
                      className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                          {backup.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(backup.modifiedTime)} • {formatSize(backup.size)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => handleRestoreBackup(backup.id)}
                          disabled={isLoading}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50"
                          title="Restaurar"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBackup(backup.id, backup.name)}
                          disabled={isLoading}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleDriveBackup;
