# 🚀 Guía Paso a Paso: Configurar Google Drive en 15 minutos

Esta guía te llevará desde cero hasta tener Google Drive funcionando en tu app.

## 📋 Checklist Rápido

- [ ] Crear proyecto en Google Cloud
- [ ] Habilitar Google Drive API
- [ ] Configurar pantalla de consentimiento OAuth
- [ ] Crear credenciales (Client ID + API Key)
- [ ] Agregar dominios autorizados
- [ ] Copiar credenciales al archivo .env
- [ ] Probar la integración

---

## Paso 1: Crear Proyecto en Google Cloud (2 min)

### 1.1 Acceder a Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Si es tu primera vez, acepta los términos de servicio
3. Busca el **selector de proyectos** en la parte superior (al lado del logo de Google Cloud)
   - Dice algo como "My First Project" o "Select a project"

### 1.2 Crear Nuevo Proyecto

1. Click en el selector de proyectos
2. En la ventana emergente, click en **"NUEVO PROYECTO"** (esquina superior derecha)
3. Completa:
   - **Nombre del proyecto**: `Registro Actividad App`
   - **Organización**: Dejar como está (No organization)
   - **Ubicación**: Dejar como está
4. Click en **"CREAR"**
5. Espera 10-15 segundos mientras se crea
6. Selecciona el proyecto recién creado desde el selector

✅ **Checkpoint**: Deberías ver "Registro Actividad App" en la barra superior

---

## Paso 2: Habilitar Google Drive API (1 min)

### 2.1 Ir a la Biblioteca de APIs

1. En el menú lateral izquierdo (☰), ve a:
   - **APIs y servicios** → **Biblioteca**

   O usa este enlace directo:
   https://console.cloud.google.com/apis/library

### 2.2 Buscar y Habilitar

1. En la barra de búsqueda, escribe: `Google Drive API`
2. Click en **"Google Drive API"** (el primer resultado)
3. Click en el botón azul **"HABILITAR"**
4. Espera unos segundos

✅ **Checkpoint**: Deberías ver "API habilitada" con una marca verde

---

## Paso 3: Configurar Pantalla de Consentimiento OAuth (5 min)

### 3.1 Acceder a Pantalla de Consentimiento

1. En el menú lateral, ve a:
   - **APIs y servicios** → **Pantalla de consentimiento de OAuth**

   O usa este enlace:
   https://console.cloud.google.com/apis/credentials/consent

### 3.2 Seleccionar Tipo de Usuario

1. Selecciona: **Externo** (External)
   - Esto permite que cualquier persona con cuenta de Google use tu app
2. Click en **"CREAR"**

### 3.3 Configurar Información de la App

**Página 1: Información de la aplicación OAuth**

Completa solo estos campos:

| Campo | Valor |
|-------|-------|
| **Nombre de la aplicación** | `Registro de Actividad` |
| **Correo de asistencia al usuario** | Tu correo Gmail |
| **Logotipo de la app** | (opcional, puedes omitirlo) |
| **Dominio de la aplicación** | (dejar vacío) |
| **Dominios autorizados** | `github.io` |
| **Correo de contacto del desarrollador** | Tu correo Gmail |

Click en **"GUARDAR Y CONTINUAR"**

**Página 2: Permisos (Scopes)**

1. NO agregues nada aquí
2. Click en **"GUARDAR Y CONTINUAR"**

**Página 3: Usuarios de prueba**

1. Click en **"+ ADD USERS"**
2. Agrega TU correo Gmail (el que usarás para probar)
3. Click en **"Agregar"**
4. Click en **"GUARDAR Y CONTINUAR"**

**Página 4: Resumen**

1. Revisa que todo esté correcto
2. Click en **"VOLVER AL PANEL"**

✅ **Checkpoint**: Deberías ver la pantalla de consentimiento configurada

---

## Paso 4: Crear Credenciales OAuth 2.0 (3 min)

### 4.1 Ir a Credenciales

1. En el menú lateral, ve a:
   - **APIs y servicios** → **Credenciales**

   O usa este enlace:
   https://console.cloud.google.com/apis/credentials

### 4.2 Crear ID de Cliente OAuth

1. Click en **"+ CREAR CREDENCIALES"** (arriba)
2. Selecciona: **"ID de cliente de OAuth"**

### 4.3 Configurar el Cliente Web

1. **Tipo de aplicación**: Selecciona **"Aplicación web"**

2. **Nombre**: `Registro Actividad Web Client`

3. **Orígenes de JavaScript autorizados**:
   - Click en **"+ AGREGAR URI"**
   - Agrega: `http://localhost:5173`
   - Click en **"+ AGREGAR URI"** nuevamente
   - Agrega: `https://tuusuario.github.io`
     - ⚠️ **IMPORTANTE**: Reemplaza `tuusuario` con tu usuario real de GitHub
     - Ejemplo: `https://hugoescalda21.github.io`

4. **URIs de redireccionamiento autorizados**:
   - Dejar vacío (no es necesario para JavaScript)

5. Click en **"CREAR"**

### 4.4 Guardar el Client ID

Se abrirá una ventana emergente con:

```
ID de cliente de OAuth creado

Tu ID de cliente:
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com

Tu secreto de cliente:
GOCSPX-abcdefghijklmnopqrst
```

**📋 COPIA Y GUARDA EL "ID DE CLIENTE"** en un lugar seguro (notepad, bloc de notas)

Ejemplo:
```
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

Click en **"ACEPTAR"**

✅ **Checkpoint**: Deberías ver tu credencial en la lista de "IDs de cliente de OAuth 2.0"

---

## Paso 5: Crear API Key (2 min)

### 5.1 Crear la Key

1. En la misma página de Credenciales
2. Click en **"+ CREAR CREDENCIALES"**
3. Selecciona: **"Clave de API"**

### 5.2 Copiar la API Key

Se abrirá una ventana con:

```
Clave de API creada

Tu clave de API:
AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

**📋 COPIA Y GUARDA LA "API KEY"** en un lugar seguro

Click en **"CERRAR"**

### 5.3 Restringir la API Key (IMPORTANTE para seguridad)

1. En la lista de "Claves de API", busca la que acabas de crear
2. Click en el nombre de la key (o el icono de lápiz ✏️)

**Restricciones de la aplicación:**

1. Selecciona: **"Referencias HTTP (sitios web)"**
2. Click en **"AGREGAR UN ELEMENTO"**
3. Agrega: `http://localhost:5173/*`
4. Click en **"AGREGAR UN ELEMENTO"** nuevamente
5. Agrega: `https://tuusuario.github.io/*`
   - ⚠️ Reemplaza `tuusuario` con tu usuario de GitHub
   - Ejemplo: `https://hugoescalda21.github.io/*`

**Restricciones de API:**

1. Selecciona: **"Restringir clave"**
2. En el desplegable, busca y marca SOLO:
   - ✅ **Google Drive API**
3. Desmarca cualquier otra API que esté seleccionada

4. Click en **"GUARDAR"** (abajo)

✅ **Checkpoint**: Tu API Key ahora está restringida y segura

---

## Paso 6: Configurar Variables de Entorno (2 min)

### 6.1 Crear archivo .env

En la raíz de tu proyecto, crea (o edita) el archivo `.env`:

```bash
# En la terminal, desde la raíz del proyecto:
touch .env
```

O créalo manualmente si estás en Windows.

### 6.2 Agregar las Credenciales

Abre el archivo `.env` y pega esto:

```env
# Google Drive API
VITE_GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI
VITE_GOOGLE_API_KEY=TU_API_KEY_AQUI
```

**Reemplaza con tus credenciales reales:**

```env
# Google Drive API
VITE_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

**Guarda el archivo** (Ctrl+S / Cmd+S)

### 6.3 Verificar que .env esté en .gitignore

Abre `.gitignore` y verifica que contenga:

```
.env
```

Esto evita que subas tus credenciales a GitHub.

✅ **Checkpoint**: Archivo .env creado con credenciales

---

## Paso 7: Probar la Integración (3 min)

### 7.1 Reiniciar el Servidor de Desarrollo

Si ya tienes el servidor corriendo, deténlo y reinícialo:

```bash
# Ctrl+C para detener
# Luego:
npm run dev
```

### 7.2 Probar la Conexión

1. Abre la app en el navegador: `http://localhost:5173`
2. Ve a **⚙️ Configuración** → **☁️ Nube**
3. Click en **"Conectar con Google"**
4. Debería abrirse una ventana de Google pidiendo autorización
5. Selecciona tu cuenta
6. **IMPORTANTE**: Verás una advertencia:

   ```
   Google hasn't verified this app
   ```

   Esto es NORMAL porque tu app está en modo "Testing"

7. Click en **"Advanced"** (Configuración avanzada)
8. Click en **"Go to Registro de Actividad (unsafe)"**
9. Revisa los permisos y click en **"Allow"** (Permitir)

### 7.3 Verificar que Funciona

Después de autorizar:

1. Deberías ver tu nombre y foto en la sección "Nube"
2. Click en **"Guardar Backup"**
3. Deberías ver: "✅ Backup guardado en Google Drive"
4. Click en **"Ver Backups"**
5. Deberías ver tu backup listado con fecha y tamaño

### 7.4 Verificar en Google Drive

1. Ve a https://drive.google.com
2. Busca la carpeta **"Registro Actividad Backups"**
3. Deberías ver tus archivos de backup ahí

✅ **¡ÉXITO!** La integración está funcionando

---

## Paso 8: Configurar para Producción (GitHub Pages)

### 8.1 Opción A: Variables Hardcodeadas (Más Simple)

Edita `src/services/googleDrive.js`:

```javascript
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || 'TU_CLIENT_ID_REAL_AQUI';
const API_KEY = process.env.VITE_GOOGLE_API_KEY || 'TU_API_KEY_REAL_AQUI';
```

Reemplaza con tus credenciales reales.

⚠️ **Nota**: Aunque las credenciales estarán en el código público, están restringidas a tus dominios en Google Cloud, así que es seguro.

### 8.2 Opción B: GitHub Secrets (Más Seguro)

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Click en **"New repository secret"**
4. Agrega dos secrets:
   - Nombre: `VITE_GOOGLE_CLIENT_ID`
   - Valor: Tu Client ID

   - Nombre: `VITE_GOOGLE_API_KEY`
   - Valor: Tu API Key

5. Modifica `.github/workflows/deploy.yml` (si existe) o tu script de deploy para inyectar las variables:

```yaml
- name: Build
  env:
    VITE_GOOGLE_CLIENT_ID: ${{ secrets.VITE_GOOGLE_CLIENT_ID }}
    VITE_GOOGLE_API_KEY: ${{ secrets.VITE_GOOGLE_API_KEY }}
  run: npm run build
```

### 8.3 Desplegar

```bash
npm run deploy
```

---

## 🎉 ¡Completado!

Tu app ahora tiene backup en Google Drive funcionando. Cada usuario que use la app podrá:

1. Conectarse con su propia cuenta de Google
2. Guardar sus datos en su Google Drive personal
3. Restaurar desde cualquier dispositivo
4. Gestionar sus backups

---

## 🆘 Solución de Problemas Comunes

### Error: "Origin not allowed"

**Problema**: El dominio no está autorizado

**Solución**:
1. Ve a Google Cloud Console → Credenciales
2. Edita tu OAuth Client ID
3. Verifica que `http://localhost:5173` esté en "Orígenes de JavaScript autorizados"
4. Agrega el dominio exacto que estás usando

### Error: "API key not valid"

**Problema**: La API Key no tiene permisos o está mal restringida

**Solución**:
1. Ve a Google Cloud Console → Credenciales
2. Edita tu API Key
3. Verifica que Google Drive API esté seleccionada en restricciones
4. Verifica que tu dominio esté en las referencias HTTP permitidas

### Error: "Google hasn't verified this app"

**Problema**: Tu app está en modo "Testing"

**Solución**: Esto es NORMAL. Solo click en "Advanced" → "Go to ... (unsafe)"

Para eliminarlo permanentemente:
1. Ve a Pantalla de consentimiento OAuth
2. Click en "PUBLISH APP"
3. Espera la verificación de Google (puede tomar días/semanas)
4. Para uso personal, no es necesario

### No se muestran los backups

**Solución**:
1. Abre la consola del navegador (F12)
2. Busca errores en la consola
3. Verifica que hayas dado permisos a la app
4. Intenta desconectar y volver a conectar

### Credenciales no se cargan

**Solución**:
1. Verifica que el archivo `.env` esté en la raíz del proyecto
2. Reinicia el servidor de desarrollo (`npm run dev`)
3. Verifica que las variables empiecen con `VITE_`
4. Revisa que no haya espacios extra en las credenciales

---

## 📚 Recursos Adicionales

- [Documentación Google Drive API](https://developers.google.com/drive/api/v3/about-sdk)
- [OAuth 2.0 para JavaScript](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## 🔒 Seguridad

✅ **Buenas prácticas implementadas:**
- Scope limitado a `drive.file` (solo archivos de la app)
- API Key restringida por dominio y API
- Variables de entorno para desarrollo
- Dominios autorizados específicos
- No se almacenan credenciales del usuario

✅ **Para usuarios finales:**
- Cada usuario autoriza con SU cuenta
- Los datos son privados (cada quien ve solo sus backups)
- Pueden revocar acceso en cualquier momento desde Google Account

---

¿Necesitas ayuda con algún paso específico? ¡Pregunta!
