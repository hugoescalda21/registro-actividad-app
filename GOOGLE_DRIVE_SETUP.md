# Configuración de Google Drive Backup

Esta guía te ayudará a configurar la integración con Google Drive para hacer respaldos de tus datos en la nube.

## Requisitos Previos

- Una cuenta de Google
- Acceso a [Google Cloud Console](https://console.cloud.google.com/)

## Pasos de Configuración

### 1. Crear un Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en el selector de proyectos en la parte superior
3. Haz clic en "Nuevo Proyecto"
4. Asigna un nombre a tu proyecto (ej: "Registro Actividad App")
5. Haz clic en "Crear"

### 2. Habilitar Google Drive API

1. En el menú lateral, ve a **APIs y servicios** > **Biblioteca**
2. Busca "Google Drive API"
3. Haz clic en "Google Drive API"
4. Haz clic en el botón "Habilitar"

### 3. Crear Credenciales OAuth 2.0

1. Ve a **APIs y servicios** > **Credenciales**
2. Haz clic en **+ CREAR CREDENCIALES** > **ID de cliente de OAuth**
3. Si es tu primera vez, configura la pantalla de consentimiento:
   - Tipo de usuario: **Externo**
   - Nombre de la aplicación: **Registro de Actividad**
   - Correo electrónico de asistencia: tu correo
   - Dominio autorizado: `github.io` (si desplegarás en GitHub Pages)
   - Alcances: No necesitas agregar alcances manualmente
   - Usuarios de prueba: Agrega tu correo electrónico
   - Haz clic en "Guardar y continuar"

4. Vuelve a **Credenciales** > **+ CREAR CREDENCIALES** > **ID de cliente de OAuth**
5. Tipo de aplicación: **Aplicación web**
6. Nombre: **Registro Actividad Web Client**
7. **Orígenes de JavaScript autorizados**, agrega:
   - `http://localhost:5173` (para desarrollo)
   - `https://tu-usuario.github.io` (reemplaza con tu usuario de GitHub)
8. **URIs de redireccionamiento autorizados**: No es necesario para aplicaciones JavaScript
9. Haz clic en "Crear"

### 4. Obtener las Credenciales

Después de crear las credenciales, verás una ventana con:
- **ID de cliente**: Algo como `123456789-abc123def456.apps.googleusercontent.com`
- **Secreto del cliente**: (No lo necesitas para aplicaciones JavaScript del lado del cliente)

Copia el **ID de cliente**.

### 5. Crear API Key (Opcional pero Recomendado)

1. Ve a **APIs y servicios** > **Credenciales**
2. Haz clic en **+ CREAR CREDENCIALES** > **Clave de API**
3. Se creará una API Key
4. Haz clic en "Restringir clave" (recomendado)
5. En "Restricciones de la aplicación", selecciona:
   - **Referencias HTTP (sitios web)**
   - Agrega `https://tu-usuario.github.io/*` y `http://localhost:5173/*`
6. En "Restricciones de API", selecciona:
   - **Restringir clave**
   - Marca solo **Google Drive API**
7. Guarda los cambios

### 6. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (si no existe):

```env
VITE_GOOGLE_CLIENT_ID=tu-client-id-aqui.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=tu-api-key-aqui
```

**IMPORTANTE:**
- No compartas estas credenciales públicamente
- Asegúrate de que `.env` esté en tu `.gitignore`
- Para producción en GitHub Pages, deberás configurar estas variables en tu proceso de build

### 7. Configuración para GitHub Pages (Producción)

Si despliegas en GitHub Pages, tienes dos opciones:

#### Opción A: Hardcodear las credenciales (Público - Solo para desarrollo)

En `src/services/googleDrive.js`, reemplaza:

```javascript
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || 'TU_CLIENT_ID_AQUI';
const API_KEY = process.env.VITE_GOOGLE_API_KEY || 'TU_API_KEY_AQUI';
```

⚠️ **Nota**: Las credenciales OAuth de JavaScript del lado del cliente son públicas por naturaleza, pero es importante restringirlas adecuadamente en Google Cloud Console.

#### Opción B: GitHub Actions con Secrets (Recomendado)

1. Ve a tu repositorio en GitHub
2. Settings > Secrets and variables > Actions
3. Agrega dos secrets:
   - `VITE_GOOGLE_CLIENT_ID`: Tu Client ID
   - `VITE_GOOGLE_API_KEY`: Tu API Key

4. Modifica tu workflow de GitHub Actions para inyectar estas variables:

```yaml
- name: Build
  env:
    VITE_GOOGLE_CLIENT_ID: ${{ secrets.VITE_GOOGLE_CLIENT_ID }}
    VITE_GOOGLE_API_KEY: ${{ secrets.VITE_GOOGLE_API_KEY }}
  run: npm run build
```

### 8. Probar la Integración

1. Ejecuta la aplicación en desarrollo: `npm run dev`
2. Ve a Configuración > Nube
3. Haz clic en "Conectar con Google"
4. Acepta los permisos solicitados
5. Prueba guardar un backup

## Seguridad

### Alcances (Scopes) Utilizados

La aplicación solo solicita el scope `https://www.googleapis.com/auth/drive.file`, que permite:
- ✅ Crear archivos nuevos
- ✅ Leer/modificar solo los archivos que la app creó
- ❌ NO puede acceder a otros archivos de tu Drive

### Datos Almacenados

Los backups se guardan en:
- **Ubicación**: Una carpeta llamada "Registro Actividad Backups" en tu Google Drive
- **Formato**: Archivos JSON con tus actividades
- **Privacidad**: Solo tú puedes ver estos archivos en tu cuenta de Google Drive

### Restringir Acceso

Para máxima seguridad en producción:
1. Restringe el Client ID a dominios específicos en Google Cloud Console
2. Restringe la API Key a dominios específicos
3. Mantén tu aplicación en modo "Prueba" en la pantalla de consentimiento si solo tú la usarás

## Solución de Problemas

### Error: "Error al inicializar Google Drive API"

- Verifica que hayas habilitado Google Drive API en Google Cloud Console
- Confirma que las credenciales sean correctas
- Revisa que los orígenes autorizados incluyan tu dominio

### Error: "redirect_uri_mismatch"

- Asegúrate de que el origen de JavaScript autorizado coincida exactamente con tu URL
- Incluye `http://localhost:5173` para desarrollo
- Incluye `https://tu-usuario.github.io` para producción

### No se muestran los backups

- Verifica que hayas dado permisos a la aplicación
- Revisa la consola del navegador para ver errores
- Confirma que la carpeta "Registro Actividad Backups" exista en tu Drive

## Soporte

Si tienes problemas con la configuración, revisa:
- [Documentación de Google Drive API](https://developers.google.com/drive/api/v3/about-sdk)
- [Guía de OAuth 2.0 para JavaScript](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)
