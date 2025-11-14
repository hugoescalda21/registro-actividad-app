/**
 * Utilidades para manejo de fechas sin problemas de zona horaria
 */

/**
 * Convierte una fecha en formato YYYY-MM-DD a Date sin problemas de zona horaria
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {Date}
 */
export const parseLocalDate = (dateString) => {
  if (!dateString) return new Date();
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Formatea una fecha para mostrar en español
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @param {object} options - Opciones de formato
 * @returns {string}
 */
export const formatDate = (dateString, options = {}) => {
  const date = parseLocalDate(dateString);
  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return date.toLocaleDateString('es-ES', { ...defaultOptions, ...options });
};

/**
 * Formatea fecha con día de la semana
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string}
 */
export const formatDateWithWeekday = (dateString) => {
  const date = parseLocalDate(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
};

/**
 * Formatea fecha corta (DD/MM/YYYY)
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string}
 */
export const formatDateShort = (dateString) => {
  const date = parseLocalDate(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Obtiene el mes y año de una fecha
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {object} - { month: number, year: number }
 */
export const getMonthYear = (dateString) => {
  const date = parseLocalDate(dateString);
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear()
  };
};

/**
 * Compara si dos fechas son del mismo día
 * @param {string} date1 - Fecha en formato YYYY-MM-DD
 * @param {string} date2 - Fecha en formato YYYY-MM-DD
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  return date1 === date2;
};

/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD
 * @returns {string}
 */
export const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calcula días entre dos fechas
 * @param {string} date1 - Fecha en formato YYYY-MM-DD
 * @param {string} date2 - Fecha en formato YYYY-MM-DD
 * @returns {number}
 */
export const daysBetween = (date1, date2) => {
  const d1 = parseLocalDate(date1);
  const d2 = parseLocalDate(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};