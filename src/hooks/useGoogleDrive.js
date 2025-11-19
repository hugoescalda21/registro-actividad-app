import { useState, useEffect, useCallback } from 'react';
import googleDriveService from '../services/googleDrive';

export const useGoogleDrive = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inicializar al montar
  useEffect(() => {
    const init = async () => {
      try {
        await googleDriveService.initialize();
        setIsInitialized(true);
        setIsSignedIn(googleDriveService.isAuthenticated());

        if (googleDriveService.isAuthenticated()) {
          setUserInfo(googleDriveService.getUserInfo());
        }
      } catch (err) {
        console.error('[useGoogleDrive] Error al inicializar:', err);
        setError(err.message);
      }
    };

    init();
  }, []);

  /**
   * Iniciar sesión con Google
   */
  const signIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await googleDriveService.signIn();
      setIsSignedIn(true);
      setUserInfo(googleDriveService.getUserInfo());
      return true;
    } catch (err) {
      console.error('[useGoogleDrive] Error al iniciar sesión:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cerrar sesión
   */
  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await googleDriveService.signOut();
      setIsSignedIn(false);
      setUserInfo(null);
      return true;
    } catch (err) {
      console.error('[useGoogleDrive] Error al cerrar sesión:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Guardar backup en Drive
   */
  const saveBackup = useCallback(async (data) => {
    if (!isSignedIn) {
      setError('Debes iniciar sesión primero');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await googleDriveService.saveBackup(data);
      return result;
    } catch (err) {
      console.error('[useGoogleDrive] Error al guardar backup:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  /**
   * Listar backups
   */
  const listBackups = useCallback(async () => {
    if (!isSignedIn) {
      setError('Debes iniciar sesión primero');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const backups = await googleDriveService.listBackups();
      return backups;
    } catch (err) {
      console.error('[useGoogleDrive] Error al listar backups:', err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  /**
   * Descargar backup específico
   */
  const downloadBackup = useCallback(async (fileId) => {
    if (!isSignedIn) {
      setError('Debes iniciar sesión primero');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await googleDriveService.downloadBackup(fileId);
      return data;
    } catch (err) {
      console.error('[useGoogleDrive] Error al descargar backup:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  /**
   * Restaurar backup más reciente
   */
  const restoreLatestBackup = useCallback(async () => {
    if (!isSignedIn) {
      setError('Debes iniciar sesión primero');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await googleDriveService.restoreLatestBackup();
      return data;
    } catch (err) {
      console.error('[useGoogleDrive] Error al restaurar backup:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  /**
   * Eliminar backup
   */
  const deleteBackup = useCallback(async (fileId) => {
    if (!isSignedIn) {
      setError('Debes iniciar sesión primero');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await googleDriveService.deleteBackup(fileId);
      return true;
    } catch (err) {
      console.error('[useGoogleDrive] Error al eliminar backup:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  return {
    // Estado
    isInitialized,
    isSignedIn,
    userInfo,
    isLoading,
    error,

    // Acciones
    signIn,
    signOut,
    saveBackup,
    listBackups,
    downloadBackup,
    restoreLatestBackup,
    deleteBackup,
  };
};

export default useGoogleDrive;
