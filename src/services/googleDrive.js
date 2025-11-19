/**
 * Servicio de Google Drive para backup/restore
 *
 * IMPORTANTE: Para usar este servicio necesitas:
 * 1. Crear un proyecto en Google Cloud Console
 * 2. Habilitar Google Drive API
 * 3. Crear credenciales OAuth 2.0
 * 4. Configurar el Client ID en la variable GOOGLE_CLIENT_ID
 */

import { gapi } from 'gapi-script';

// ⚠️ CONFIGURACIÓN REQUERIDA
// Obtén tu Client ID en: https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
const API_KEY = process.env.VITE_GOOGLE_API_KEY || 'YOUR_API_KEY_HERE';

// Scopes necesarios
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Nombre del archivo de backup
const BACKUP_FILE_NAME = 'registro-actividad-backup.json';
const BACKUP_FOLDER_NAME = 'Registro de Actividad Backups';

class GoogleDriveService {
  constructor() {
    this.isInitialized = false;
    this.isSignedIn = false;
  }

  /**
   * Inicializar la API de Google
   */
  async initialize() {
    if (this.isInitialized) return true;

    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: API_KEY,
            clientId: GOOGLE_CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          });

          // Escuchar cambios en el estado de autenticación
          gapi.auth2.getAuthInstance().isSignedIn.listen((signedIn) => {
            this.isSignedIn = signedIn;
            console.log('[GoogleDrive] Estado de autenticación:', signedIn);
          });

          // Verificar estado inicial
          this.isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
          this.isInitialized = true;

          console.log('[GoogleDrive] ✅ API inicializada correctamente');
          resolve(true);
        } catch (error) {
          console.error('[GoogleDrive] ❌ Error al inicializar:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * Iniciar sesión con Google
   */
  async signIn() {
    try {
      await this.initialize();
      await gapi.auth2.getAuthInstance().signIn();
      this.isSignedIn = true;
      console.log('[GoogleDrive] ✅ Sesión iniciada');
      return true;
    } catch (error) {
      console.error('[GoogleDrive] ❌ Error al iniciar sesión:', error);
      throw new Error('No se pudo iniciar sesión con Google');
    }
  }

  /**
   * Cerrar sesión
   */
  async signOut() {
    try {
      await gapi.auth2.getAuthInstance().signOut();
      this.isSignedIn = false;
      console.log('[GoogleDrive] ✅ Sesión cerrada');
      return true;
    } catch (error) {
      console.error('[GoogleDrive] ❌ Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated() {
    return this.isSignedIn;
  }

  /**
   * Obtener información del usuario
   */
  getUserInfo() {
    if (!this.isSignedIn) return null;

    const user = gapi.auth2.getAuthInstance().currentUser.get();
    const profile = user.getBasicProfile();

    return {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl(),
    };
  }

  /**
   * Crear o obtener carpeta de backups
   */
  async getOrCreateBackupFolder() {
    try {
      // Buscar carpeta existente
      const response = await gapi.client.drive.files.list({
        q: `name='${BACKUP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
        spaces: 'drive',
      });

      if (response.result.files && response.result.files.length > 0) {
        return response.result.files[0].id;
      }

      // Crear nueva carpeta
      const folderMetadata = {
        name: BACKUP_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
      };

      const folder = await gapi.client.drive.files.create({
        resource: folderMetadata,
        fields: 'id',
      });

      console.log('[GoogleDrive] ✅ Carpeta de backup creada:', folder.result.id);
      return folder.result.id;
    } catch (error) {
      console.error('[GoogleDrive] ❌ Error al crear carpeta:', error);
      throw error;
    }
  }

  /**
   * Guardar backup en Google Drive
   */
  async saveBackup(data) {
    try {
      await this.initialize();

      if (!this.isSignedIn) {
        throw new Error('Debes iniciar sesión primero');
      }

      const folderId = await this.getOrCreateBackupFolder();

      // Preparar datos
      const backupData = {
        ...data,
        backupDate: new Date().toISOString(),
        version: '2.9.0',
      };

      const content = JSON.stringify(backupData, null, 2);
      const blob = new Blob([content], { type: 'application/json' });

      const metadata = {
        name: `${BACKUP_FILE_NAME.replace('.json', '')}_${new Date().toISOString().split('T')[0]}.json`,
        mimeType: 'application/json',
        parents: [folderId],
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', blob);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({ Authorization: 'Bearer ' + gapi.auth.getToken().access_token }),
        body: form,
      });

      const result = await response.json();

      console.log('[GoogleDrive] ✅ Backup guardado:', result.id);
      return {
        success: true,
        fileId: result.id,
        fileName: metadata.name,
      };
    } catch (error) {
      console.error('[GoogleDrive] ❌ Error al guardar backup:', error);
      throw error;
    }
  }

  /**
   * Listar backups disponibles
   */
  async listBackups() {
    try {
      await this.initialize();

      if (!this.isSignedIn) {
        throw new Error('Debes iniciar sesión primero');
      }

      const folderId = await this.getOrCreateBackupFolder();

      const response = await gapi.client.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, createdTime, modifiedTime, size)',
        orderBy: 'modifiedTime desc',
        spaces: 'drive',
      });

      console.log('[GoogleDrive] ✅ Backups encontrados:', response.result.files.length);
      return response.result.files || [];
    } catch (error) {
      console.error('[GoogleDrive] ❌ Error al listar backups:', error);
      throw error;
    }
  }

  /**
   * Descargar backup desde Google Drive
   */
  async downloadBackup(fileId) {
    try {
      await this.initialize();

      if (!this.isSignedIn) {
        throw new Error('Debes iniciar sesión primero');
      }

      const response = await gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media',
      });

      console.log('[GoogleDrive] ✅ Backup descargado');
      return JSON.parse(response.body);
    } catch (error) {
      console.error('[GoogleDrive] ❌ Error al descargar backup:', error);
      throw error;
    }
  }

  /**
   * Eliminar backup
   */
  async deleteBackup(fileId) {
    try {
      await this.initialize();

      if (!this.isSignedIn) {
        throw new Error('Debes iniciar sesión primero');
      }

      await gapi.client.drive.files.delete({
        fileId: fileId,
      });

      console.log('[GoogleDrive] ✅ Backup eliminado');
      return true;
    } catch (error) {
      console.error('[GoogleDrive] ❌ Error al eliminar backup:', error);
      throw error;
    }
  }

  /**
   * Restaurar backup más reciente
   */
  async restoreLatestBackup() {
    try {
      const backups = await this.listBackups();

      if (backups.length === 0) {
        throw new Error('No hay backups disponibles');
      }

      // Obtener el backup más reciente
      const latestBackup = backups[0];
      const data = await this.downloadBackup(latestBackup.id);

      console.log('[GoogleDrive] ✅ Backup restaurado:', latestBackup.name);
      return data;
    } catch (error) {
      console.error('[GoogleDrive] ❌ Error al restaurar backup:', error);
      throw error;
    }
  }
}

// Exportar instancia única (Singleton)
export const googleDriveService = new GoogleDriveService();
export default googleDriveService;
