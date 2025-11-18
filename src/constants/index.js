// Claves de localStorage
export const STORAGE_KEYS = {
  ACTIVITIES: 'activities',
  PUBLISHER_TYPE: 'publisherType',
  STOPWATCH_STATE: 'stopwatchState',
  PLANNED_DAYS: 'plannedDays',
  CUSTOM_GOALS: 'customGoals',
  NOTIFICATION_SETTINGS: 'notificationSettings',
  LAST_NOTIFICATION_DATE: 'lastNotificationDate'
};

// Constantes de tiempo
export const TIME_CONSTANTS = {
  MS_PER_SECOND: 1000,
  MS_PER_MINUTE: 60000,
  MS_PER_HOUR: 3600000,
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24
};

// Meses del año
export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

// Días de la semana (formato corto)
export const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Días de la semana (formato completo)
export const WEEKDAYS_FULL = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];

// Tipos de publicador
export const PUBLISHER_TYPES = {
  PUBLISHER: 'publisher',
  AUXILIARY_PIONEER: 'auxiliaryPioneer',
  REGULAR_PIONEER: 'regularPioneer',
  SPECIAL_PIONEER: 'specialPioneer'
};

// Configuración de metas por tipo de publicador
export const PUBLISHER_CONFIGS = {
  [PUBLISHER_TYPES.PUBLISHER]: {
    name: 'Publicador',
    hours: 0,
    studies: 0,
    canLogHours: false,
    canLogApproved: false
  },
  [PUBLISHER_TYPES.AUXILIARY_PIONEER]: {
    name: 'Precursor Auxiliar',
    hours: 30,
    studies: 0,
    canLogHours: true,
    canLogApproved: true
  },
  [PUBLISHER_TYPES.REGULAR_PIONEER]: {
    name: 'Precursor Regular',
    hours: 50,
    studies: 0,
    canLogHours: true,
    canLogApproved: true
  },
  [PUBLISHER_TYPES.SPECIAL_PIONEER]: {
    name: 'Precursor Especial',
    hours: 100,
    studies: 2,
    canLogHours: true,
    canLogApproved: true
  }
};

// Tipos de modal
export const MODAL_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  CONFIRM: 'confirm'
};

// Duración de toasts (ms)
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000
};

// Límites de campos
export const FIELD_LIMITS = {
  MAX_HOURS: 24,
  MAX_PLACEMENTS: 999,
  MAX_VIDEOS: 999,
  MAX_RETURN_VISITS: 999,
  MAX_STUDIES: 99
};

// Colores para gráficos
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  PURPLE: '#8b5cf6'
};

// Formato de fechas
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  DISPLAY_SHORT: 'DD/MM/YYYY',
  DISPLAY_LONG: 'DD de MMMM de YYYY'
};