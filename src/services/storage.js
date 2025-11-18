const STORAGE_KEYS = {
  ACTIVITIES: 'activities',
  PUBLISHER_TYPE: 'publisherType',
  STOPWATCH_STATE: 'stopwatchState',
  PLANNED_DAYS: 'plannedDays',
  CUSTOM_GOALS: 'customGoals',
  NOTIFICATION_SETTINGS: 'notificationSettings',
  LAST_NOTIFICATION_DATE: 'lastNotificationDate'
};

class StorageService {
  /**
   * Obtiene un valor del localStorage
   * @param {string} key - Clave del item
   * @param {any} defaultValue - Valor por defecto si no existe
   * @returns {any} Valor parseado o defaultValue
   */
 get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      // Intentar parsear como JSON
      try {
        return JSON.parse(item);
      } catch (parseError) {
        // Si falla el parse, devolver el valor tal cual (compatibilidad con valores legacy)
        return item;
      }
    } catch (error) {
      console.error(`Error al leer ${key} de localStorage:`, error);
      return defaultValue;
    }
  }

  /**
   * Guarda un valor en localStorage
   * @param {string} key - Clave del item
   * @param {any} value - Valor a guardar
   * @returns {boolean} true si tuvo éxito
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error);
      return false;
    }
  }

  /**
   * Elimina un valor del localStorage
   * @param {string} key - Clave del item
   * @returns {boolean} true si tuvo éxito
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error al eliminar ${key} de localStorage:`, error);
      return false;
    }
  }

  /**
   * Limpia todo el localStorage
   * @returns {boolean} true si tuvo éxito
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

  // ==================== ACTIVITIES ====================

  /**
   * Obtiene todas las actividades
   * @returns {Array} Array de actividades
   */
  getActivities() {
    return this.get(STORAGE_KEYS.ACTIVITIES, []);
  }

  /**
   * Guarda todas las actividades
   * @param {Array} activities - Array de actividades
   * @returns {boolean} true si tuvo éxito
   */
  setActivities(activities) {
    return this.set(STORAGE_KEYS.ACTIVITIES, activities);
  }

  /**
   * Agrega una nueva actividad
   * @param {Object} activity - Objeto de actividad
   * @returns {boolean} true si tuvo éxito
   */
  addActivity(activity) {
    const activities = this.getActivities();
    activities.push(activity);
    return this.setActivities(activities);
  }

  /**
   * Actualiza una actividad existente
   * @param {string} id - ID de la actividad
   * @param {Object} updatedActivity - Datos actualizados
   * @returns {boolean} true si tuvo éxito
   */
  updateActivity(id, updatedActivity) {
    const activities = this.getActivities();
    const index = activities.findIndex(act => act.id === id);
    if (index === -1) return false;
    
    activities[index] = { ...activities[index], ...updatedActivity };
    return this.setActivities(activities);
  }

  /**
   * Elimina una actividad
   * @param {string} id - ID de la actividad
   * @returns {boolean} true si tuvo éxito
   */
  deleteActivity(id) {
    const activities = this.getActivities();
    const filtered = activities.filter(act => act.id !== id);
    return this.setActivities(filtered);
  }

  // ==================== PUBLISHER TYPE ====================

  /**
   * Obtiene el tipo de publicador
   * @returns {string} Tipo de publicador
   */
  getPublisherType() {
    return this.get(STORAGE_KEYS.PUBLISHER_TYPE, 'publisher');
  }

  /**
   * Guarda el tipo de publicador
   * @param {string} type - Tipo de publicador
   * @returns {boolean} true si tuvo éxito
   */
  setPublisherType(type) {
    return this.set(STORAGE_KEYS.PUBLISHER_TYPE, type);
  }

  // ==================== STOPWATCH ====================

  /**
   * Obtiene el estado del cronómetro
   * @returns {Object|null} Estado del cronómetro
   */
  getStopwatchState() {
    return this.get(STORAGE_KEYS.STOPWATCH_STATE, null);
  }

  /**
   * Guarda el estado del cronómetro
   * @param {Object} state - Estado del cronómetro
   * @returns {boolean} true si tuvo éxito
   */
  setStopwatchState(state) {
    return this.set(STORAGE_KEYS.STOPWATCH_STATE, state);
  }

  /**
   * Elimina el estado del cronómetro
   * @returns {boolean} true si tuvo éxito
   */
  clearStopwatchState() {
    return this.remove(STORAGE_KEYS.STOPWATCH_STATE);
  }

  // ==================== PLANNED DAYS ====================

  /**
   * Obtiene los días planificados
   * @returns {Object} Objeto con días planificados
   */
  getPlannedDays() {
    return this.get(STORAGE_KEYS.PLANNED_DAYS, {});
  }

  /**
   * Guarda los días planificados
   * @param {Object} plannedDays - Objeto con días planificados
   * @returns {boolean} true si tuvo éxito
   */
  setPlannedDays(plannedDays) {
    return this.set(STORAGE_KEYS.PLANNED_DAYS, plannedDays);
  }

  /**
   * Agrega un día planificado
   * @param {string} dayKey - Clave del día (YYYY-MM-DD)
   * @param {number} hours - Horas planificadas
   * @returns {boolean} true si tuvo éxito
   */
  addPlannedDay(dayKey, hours) {
    const plannedDays = this.getPlannedDays();
    plannedDays[dayKey] = hours;
    return this.setPlannedDays(plannedDays);
  }

  /**
   * Elimina un día planificado
   * @param {string} dayKey - Clave del día (YYYY-MM-DD)
   * @returns {boolean} true si tuvo éxito
   */
  removePlannedDay(dayKey) {
    const plannedDays = this.getPlannedDays();
    delete plannedDays[dayKey];
    return this.setPlannedDays(plannedDays);
  }

  // ==================== CUSTOM GOALS ====================

  /**
   * Obtiene las metas personalizadas
   * @returns {Object} Objeto con metas personalizadas
   */
  getCustomGoals() {
    return this.get(STORAGE_KEYS.CUSTOM_GOALS, {});
  }

  /**
   * Guarda las metas personalizadas
   * @param {Object} customGoals - Objeto con metas personalizadas
   * @returns {boolean} true si tuvo éxito
   */
  setCustomGoals(customGoals) {
    return this.set(STORAGE_KEYS.CUSTOM_GOALS, customGoals);
  }

  /**
   * Obtiene la meta personalizada de un mes específico
   * @param {number} month - Mes (1-12)
   * @param {number} year - Año
   * @returns {Object|null} Meta personalizada o null
   */
  getCustomGoal(month, year) {
    const customGoals = this.getCustomGoals();
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    return customGoals[key] || null;
  }

  /**
   * Guarda la meta personalizada de un mes específico
   * @param {number} month - Mes (1-12)
   * @param {number} year - Año
   * @param {Object} goal - Meta personalizada
   * @returns {boolean} true si tuvo éxito
   */
  setCustomGoal(month, year, goal) {
    const customGoals = this.getCustomGoals();
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    customGoals[key] = goal;
    return this.setCustomGoals(customGoals);
  }

  // ==================== NOTIFICATIONS ====================

  /**
   * Obtiene la configuración de notificaciones
   * @returns {Object} Configuración de notificaciones
   */
  getNotificationSettings() {
    return this.get(STORAGE_KEYS.NOTIFICATION_SETTINGS, {
      enabled: false,
      time: '09:00'
    });
  }

  /**
   * Guarda la configuración de notificaciones
   * @param {Object} settings - Configuración de notificaciones
   * @returns {boolean} true si tuvo éxito
   */
  setNotificationSettings(settings) {
    return this.set(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
  }

  /**
   * Obtiene la última fecha de notificación
   * @returns {string|null} Fecha de la última notificación
   */
  getLastNotificationDate() {
    return this.get(STORAGE_KEYS.LAST_NOTIFICATION_DATE, null);
  }

  /**
   * Guarda la última fecha de notificación
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {boolean} true si tuvo éxito
   */
  setLastNotificationDate(date) {
    return this.set(STORAGE_KEYS.LAST_NOTIFICATION_DATE, date);
  }

  // ==================== UTILITIES ====================

  /**
   * Exporta todos los datos como JSON
   * @returns {string} JSON con todos los datos
   */
  exportData() {
    const data = {
      activities: this.getActivities(),
      publisherType: this.getPublisherType(),
      plannedDays: this.getPlannedDays(),
      customGoals: this.getCustomGoals(),
      notificationSettings: this.getNotificationSettings(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Importa datos desde JSON
   * @param {string} jsonData - JSON con los datos
   * @returns {boolean} true si tuvo éxito
   */
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.activities) this.setActivities(data.activities);
      if (data.publisherType) this.setPublisherType(data.publisherType);
      if (data.plannedDays) this.setPlannedDays(data.plannedDays);
      if (data.customGoals) this.setCustomGoals(data.customGoals);
      if (data.notificationSettings) this.setNotificationSettings(data.notificationSettings);
      
      return true;
    } catch (error) {
      console.error('Error al importar datos:', error);
      return false;
    }
  }
}

// Exportar instancia singleton
export default new StorageService();