# 📱 Registro de Actividad

Una aplicación web progresiva (PWA) moderna para registrar y gestionar tu actividad como publicador de la congregación.

![Version](https://img.shields.io/badge/version-2.9.0-blue)
![React](https://img.shields.io/badge/react-19.2.0-blue)
![Vite](https://img.shields.io/badge/vite-7.2.2-646cff)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Características Principales

### 📊 Gestión de Actividad
- **Registro de horas** de predicación y LDC
- **Contador de colocaciones**, videos, revisitas y estudios
- **Cronómetro integrado** para seguimiento en tiempo real
- **Visualización de progreso** hacia metas mensuales
- **Estadísticas detalladas** con gráficos y tendencias

### 📅 Planificación
- **Calendario mensual** interactivo
- **Metas diarias** personalizables
- **Racha de actividad** para mantener la consistencia
- **Tipos de publicador** configurables (Regular, Auxiliar, Regular Pioneer)

### 👥 Gestión de Revisitas
- **Directorio de personas** con información de contacto
- **Historial de visitas** con notas detalladas
- **Registro de publicaciones** dejadas
- **Estados de interés** (Interesado, Estudiando, Inactivo)
- **Próximas visitas** programadas
- **Búsqueda y filtros** avanzados

### 🔔 Notificaciones Inteligentes
- **Recordatorios diarios** personalizables
- **Alertas de metas** cuando alcanzas objetivos
- **Notificación persistente** del cronómetro en Android
- **Notificaciones de racha** para mantener motivación
- **Configuración granular** de todos los tipos de alertas

### ☁️ Respaldo en la Nube
- **Sincronización con Google Drive** para respaldo automático
- **Restauración de datos** desde cualquier dispositivo
- **Gestión de múltiples backups** con historial
- **Seguridad OAuth 2.0** de Google
- **Acceso solo a archivos de la app** (scope limitado)

### 📄 Exportación de Datos
- **Exportar a PDF** informes mensuales formateados
- **Respaldo JSON** para migración de datos
- **Compartir en WhatsApp** resumen de actividad
- **Formato profesional** para entregas

### 🎨 Experiencia de Usuario
- **Modo oscuro/claro/auto** adaptable
- **Diseño responsivo** para móvil, tablet y desktop
- **PWA instalable** funciona offline
- **Interfaz intuitiva** con animaciones fluidas
- **Tema personalizable** según preferencias del sistema

## 🚀 Inicio Rápido

### Instalación para Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/registro-actividad-app.git

# Navegar al directorio
cd registro-actividad-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Compilar para Producción

```bash
# Generar build optimizado
npm run build

# Preview del build
npm run preview
```

### Desplegar en GitHub Pages

```bash
# Desplegar automáticamente
npm run deploy
```

## ⚙️ Configuración

### Google Drive Backup (Opcional)

Para habilitar la funcionalidad de respaldo en Google Drive:

**Opción 1: Configuración Guiada (Recomendado)**

```bash
# Ejecutar el asistente de configuración
npm run setup:google

# Seguir las instrucciones en pantalla
```

**Opción 2: Manual**

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Sigue la guía paso a paso: [GUIA_CONFIGURACION_GOOGLE.md](./GUIA_CONFIGURACION_GOOGLE.md)

3. O sigue la guía técnica: [GOOGLE_DRIVE_SETUP.md](./GOOGLE_DRIVE_SETUP.md)

4. Edita `.env` con tus credenciales:
   ```env
   VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
   VITE_GOOGLE_API_KEY=tu-api-key
   ```

5. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

**Nota**: La app funciona completamente sin Google Drive. Esta característica es opcional para respaldo en la nube.

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Google Drive (Opcional)
VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=tu-api-key

# Configuración de base path para GitHub Pages
VITE_BASE_URL=/registro-actividad-app/
```

## 📱 Instalar como PWA

### Android
1. Abre la app en Chrome
2. Toca el menú (⋮)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma la instalación

### iOS
1. Abre la app en Safari
2. Toca el botón Compartir (⬆)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma la instalación

### Desktop (Chrome/Edge)
1. Haz clic en el icono de instalación en la barra de direcciones
2. Confirma la instalación
3. La app se abrirá en su propia ventana

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

- **Frontend**: React 19.2.0 con Hooks
- **Build Tool**: Vite 7.2.2 con Rolldown
- **Estilos**: Tailwind CSS 3.4.17
- **Iconos**: Lucide React 0.469.0
- **Gráficos**: Recharts 2.15.0
- **PDF**: jsPDF + html2canvas
- **PWA**: Service Workers con Cache API
- **Cloud**: Google Drive API v3 con gapi-script
- **Estado**: Context API + localStorage

### Estructura del Proyecto

```
registro-actividad-app/
├── public/               # Archivos estáticos
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service Worker
│   └── icons/          # Iconos de la app
├── src/
│   ├── components/      # Componentes React
│   │   ├── RegisterView.jsx
│   │   ├── StatsView.jsx
│   │   ├── PlanningView.jsx
│   │   ├── ReturnVisitsView.jsx
│   │   ├── GoogleDriveBackup.jsx
│   │   └── ...
│   ├── contexts/        # Context providers
│   │   └── ThemeContext.jsx
│   ├── hooks/          # Custom hooks
│   │   ├── useStopwatch.js
│   │   ├── useGoogleDrive.js
│   │   └── useStopwatchNotification.js
│   ├── services/       # Servicios externos
│   │   └── googleDrive.js
│   ├── utils/          # Utilidades
│   │   ├── returnVisitsUtils.js
│   │   ├── notificationUtils.js
│   │   ├── pdfGenerator.js
│   │   └── androidNotifications.js
│   ├── App.jsx         # Componente principal
│   └── main.jsx        # Entry point
├── .env                # Variables de entorno (gitignored)
├── vite.config.js      # Configuración de Vite
└── package.json        # Dependencias
```

## 🔒 Privacidad y Seguridad

- **Datos locales**: Toda la información se almacena en localStorage de tu navegador
- **Sin servidor**: No hay backend, tus datos nunca salen de tu dispositivo (excepto backups en Drive)
- **Google Drive**: Solo accede a archivos creados por la app (scope `drive.file`)
- **Sin tracking**: No se recopila información analítica ni de usuario
- **Código abierto**: El código fuente es público y auditable

## 📈 Roadmap

### Versiones Anteriores
- ✅ v2.6.0 - Modo oscuro adaptable
- ✅ v2.7.0 - Exportación a PDF
- ✅ v2.8.0 - Sistema de notificaciones mejorado
- ✅ v2.9.0 - Gestión de revisitas + Backup en Google Drive

### Próximas Características
- [ ] Salidas de la congregación
- [ ] Sincronización entre dispositivos en tiempo real
- [ ] Soporte para múltiples idiomas
- [ ] Importación desde otras apps
- [ ] Recordatorios inteligentes basados en patrones

## 🐛 Reporte de Bugs

Si encuentras algún error, por favor:

1. Verifica que estés usando la última versión
2. Limpia la caché del navegador
3. Revisa la consola del navegador para errores
4. Abre un issue en GitHub con:
   - Descripción del problema
   - Pasos para reproducirlo
   - Navegador y versión
   - Capturas de pantalla si es posible

## 🤝 Contribuir

Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para la comunidad de publicadores

## 🙏 Agradecimientos

- Iconos por [Lucide](https://lucide.dev/)
- Tailwind CSS por [Tailwind Labs](https://tailwindcss.com/)
- React por [Meta](https://react.dev/)
- Vite por [Evan You](https://vitejs.dev/)

---

**Nota**: Esta aplicación no está afiliada, asociada, autorizada, respaldada por, ni está en forma alguna oficialmente conectada con ninguna organización religiosa.
