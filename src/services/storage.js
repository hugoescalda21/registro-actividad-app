import { STORAGE_KEYS } from '../constants';

/**
 * Servicio centralizado para manejo de localStorage
 * Proporciona métodos seguros para guardar, obtener y eliminar datos
 */

class StorageService {
  /**
   * Obtiene un valor del localStorage
   * @param {string} key - Clave del localStorage
   * @param {any} defaultValue - Valor por defecto si no existe o hay error
   * @returns {any} Valor parseado del localStorage o defaultValue
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error al obtener '${key}' del localStorage:`, error);
      return defaultValue;
    }
  }

  /**
   * Guarda un valor en el localStorage
   * @param {string} key - Clave del localStorage
   * @param {any} value - Valor a guardar (se convierte a JSON)
   * @returns {boolean} true si se guardó exitosamente, false si hubo error
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error al guardar '${key}' en localStorage:`, error);
      return false;
    }
  }

  /**
   * Elimina un valor del localStorage
   * @param {string} key - Clave a eliminar
   * @returns {boolean} true si se eliminó exitosamente
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error al eliminar '${key}' del localStorage:`, error);
      return false;
    }
  }

  /**
   * Limpia todo el localStorage
   * @returns {boolean} true si se limpió exitosamente
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
      return false;
    }
  }

  /**
   * Verifica si existe una clave en el localStorage
   * @param {string} key - Clave a verificar
   * @returns {boolean} true si existe la clave
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  }

  // ========================================
  // MÉTODOS ESPECÍFICOS DE LA APLICACIÓN
  // ========================================

  /**
   * Obtiene las actividades del usuario
   * @returns {Array} Array de actividades
   */
  getActivities() {
    return this.get(STORAGE_KEYS.ACTIVITIES, []);
  }

  /**
   * Guarda las actividades del usuario
   * @param {Array} activities - Array de actividades
   * @returns {boolean} true si se guardó exitosamente
   */
  setActivities(activities) {
    return this.set(STORAGE_KEYS.ACTIVITIES, activities);
  }

  /**
   * Obtiene el tipo de publicador
   * @returns {string} Tipo de publicador
   */
  getPublisherType() {
    return this.get(STORAGE_KEYS.PUBLISHER_TYPE, 'publicador');
  }

  /**
   * Guarda el tipo de publicador
   * @param {string} type - Tipo de publicador
   * @returns {boolean} true si se guardó exitosamente
   */
  setPublisherType(type) {
    return this.set(STORAGE_KEYS.PUBLISHER_TYPE, type);
  }

  /**
   * Obtiene el estado del cronómetro
   * @returns {Object|null} Estado del cronómetro o null
   */
  getStopwatchState() {
    return this.get(STORAGE_KEYS.STOPWATCH_STATE, null);
  }

  /**
   * Guarda el estado del cronómetro
   * @param {Object} state - Estado del cronómetro
   * @returns {boolean} true si se guardó exitosamente
   */
  setStopwatchState(state) {
    if (state === null) {
      return this.remove(STORAGE_KEYS.STOPWATCH_STATE);
    }
    return this.set(STORAGE_KEYS.STOPWATCH_STATE, state);
  }

  /**
   * Obtiene la configuración de notificaciones
   * @returns {Object} Configuración de notificaciones
   */
  getNotificationSettings() {
    return this.get(STORAGE_KEYS.NOTIFICATION_SETTINGS, {
      enabled: true,
      goalReminders: true,
      achievements: true,
      streaks: true,
      dailyGoal: true
    });
  }

  /**
   * Guarda la configuración de notificaciones
   * @param {Object} settings - Configuración de notificaciones
   * @returns {boolean} true si se guardó exitosamente
   */
  setNotificationSettings(settings) {
    return this.set(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
  }

  /**
   * Obtiene las metas mensuales personalizadas
   * @returns {Object} Metas mensuales por mes/año
   */
  getMonthlyGoals() {
    return this.get(STORAGE_KEYS.MONTHLY_GOALS, {});
  }

  /**
   * Guarda las metas mensuales personalizadas
   * @param {Object} goals - Metas mensuales
   * @returns {boolean} true si se guardó exitosamente
   */
  setMonthlyGoals(goals) {
    return this.set(STORAGE_KEYS.MONTHLY_GOALS, goals);
  }

  /**
   * Obtiene la planificación mensual
   * @returns {Object} Planificación mensual por mes/año
   */
  getMonthlyPlan() {
    return this.get(STORAGE_KEYS.MONTHLY_PLAN, {});
  }

  /**
   * Guarda la planificación mensual
   * @param {Object} plan - Planificación mensual
   * @returns {boolean} true si se guardó exitosamente
   */
  setMonthlyPlan(plan) {
    return this.set(STORAGE_KEYS.MONTHLY_PLAN, plan);
  }

  /**
   * Obtiene las plantillas de planificación
   * @returns {Array} Array de plantillas
   */
  getPlanningTemplates() {
    return this.get(STORAGE_KEYS.PLANNING_TEMPLATES, []);
  }

  /**
   * Guarda las plantillas de planificación
   * @param {Array} templates - Array de plantillas
   * @returns {boolean} true si se guardó exitosamente
   */
  setPlanningTemplates(templates) {
    return this.set(STORAGE_KEYS.PLANNING_TEMPLATES, templates);
  }

  /**
   * Obtiene la última fecha de verificación de notificaciones
   * @returns {string|null} Fecha ISO o null
   */
  getLastNotificationCheck() {
    return this.get(STORAGE_KEYS.LAST_NOTIFICATION_CHECK, null);
  }

  /**
   * Guarda la última fecha de verificación de notificaciones
   * @param {string} date - Fecha ISO
   * @returns {boolean} true si se guardó exitosamente
   */
  setLastNotificationCheck(date) {
    return this.set(STORAGE_KEYS.LAST_NOTIFICATION_CHECK, date);
  }

  /**
   * Obtiene el historial de logros
   * @returns {Array} Array de logros
   */
  getAchievementHistory() {
    return this.get(STORAGE_KEYS.ACHIEVEMENT_HISTORY, []);
  }

  /**
   * Guarda el historial de logros
   * @param {Array} history - Array de logros
   * @returns {boolean} true si se guardó exitosamente
   */
  setAchievementHistory(history) {
    return this.set(STORAGE_KEYS.ACHIEVEMENT_HISTORY, history);
  }

  /**
   * Exporta todos los datos de la aplicación
   * @returns {Object} Objeto con todos los datos
   */
  exportAll() {
    return {
      activities: this.getActivities(),
      publisherType: this.getPublisherType(),
      notificationSettings: this.getNotificationSettings(),
      monthlyGoals: this.getMonthlyGoals(),
      monthlyPlan: this.getMonthlyPlan(),
      planningTemplates: this.getPlanningTemplates(),
      achievementHistory: this.getAchievementHistory(),
      exportDate: new Date().toISOString(),
      version: '2.5.3'
    };
  }

  /**
   * Importa datos a la aplicación
   * @param {Object} data - Datos a importar
   * @returns {boolean} true si se importó exitosamente
   */
  importAll(data) {
    try {
      if (data.activities) this.setActivities(data.activities);
      if (data.publisherType) this.setPublisherType(data.publisherType);
      if (data.notificationSettings) this.setNotificationSettings(data.notificationSettings);
      if (data.monthlyGoals) this.setMonthlyGoals(data.monthlyGoals);
      if (data.monthlyPlan) this.setMonthlyPlan(data.monthlyPlan);
      if (data.planningTemplates) this.setPlanningTemplates(data.planningTemplates);
      if (data.achievementHistory) this.setAchievementHistory(data.achievementHistory);
      return true;
    } catch (error) {
      console.error('Error al importar datos:', error);
      return false;
    }
  }
}

// Exportar instancia única (singleton)
const storage = new StorageService();
export default storage;
