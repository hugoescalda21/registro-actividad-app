// ========================================
// CONSTANTES DE LA APLICACIÓN
// ========================================

// Claves de localStorage
export const STORAGE_KEYS = {
  ACTIVITIES: 'activities',
  PUBLISHER_TYPE: 'publisherType',
  STOPWATCH_STATE: 'stopwatchState',
  NOTIFICATION_SETTINGS: 'notificationSettings',
  MONTHLY_GOALS: 'monthlyGoals',
  MONTHLY_PLAN: 'monthlyPlan',
  PLANNING_TEMPLATES: 'planningTemplates',
  LAST_NOTIFICATION_CHECK: 'lastNotificationCheck',
  ACHIEVEMENT_HISTORY: 'achievementHistory'
};

// Tiempo (en milisegundos)
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000
};

// Tiempo (en segundos)
export const TIME_SECONDS = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 24 * 60 * 60
};

// Versión de la aplicación
export const APP_VERSION = '2.5.3';

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  CHECK_INTERVAL: 60 * 60 * 1000, // 1 hora
  GOAL_REMINDER_HOUR: 20, // 8 PM
  DAILY_GOAL_HOUR: 9, // 9 AM
  MAX_NOTIFICATIONS_PER_DAY: 5
};

// Tipos de publicadores
export const PUBLISHER_TYPES = {
  PUBLICADOR: 'publicador',
  AUXILIAR_15: 'auxiliar15',
  AUXILIAR_30: 'auxiliar30',
  REGULAR: 'regular',
  ESPECIAL: 'especial'
};

// Configuración de actividades
export const ACTIVITY_LIMITS = {
  MAX_HOURS_PER_DAY: 24,
  MAX_PLACEMENTS_PER_DAY: 100,
  MAX_VIDEOS_PER_DAY: 50,
  MAX_RETURN_VISITS_PER_DAY: 30,
  MAX_STUDIES_PER_DAY: 10
};

// Estados de sincronización
export const SYNC_STATUS = {
  IDLE: 'idle',
  SYNCING: 'syncing',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Tipos de toast
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Duración de toast (ms)
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000
};

// Colores de progreso
export const PROGRESS_COLORS = {
  LOW: '#EF4444', // rojo
  MEDIUM: '#F59E0B', // amarillo
  HIGH: '#10B981', // verde
  COMPLETE: '#3B82F6' // azul
};

// Z-index layers
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 100,
  MODAL: 150,
  NOTIFICATION: 200,
  TOOLTIP: 300
};

// Breakpoints (en px)
export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Meses del año
export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Días de la semana
export const WEEKDAYS = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles',
  'Jueves', 'Viernes', 'Sábado'
];

// Días de la semana (cortos)
export const WEEKDAYS_SHORT = [
  'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
];
