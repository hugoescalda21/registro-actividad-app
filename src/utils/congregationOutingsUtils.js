/**
 * Utilidades para gestionar Salidas de la Congregación
 *
 * Gestiona el registro de salidas a predicar con la congregación:
 * - Predicación pública
 * - Carritos/Stands
 * - Campañas especiales
 * - Territorios
 */

const STORAGE_KEY = 'congregationOutings';

/**
 * Tipos de salidas disponibles
 */
export const OUTING_TYPES = {
  public: {
    id: 'public',
    label: 'Predicación Pública',
    emoji: '🏙️',
    color: 'blue',
    description: 'Predicación en lugares públicos'
  },
  cart: {
    id: 'cart',
    label: 'Carrito/Stand',
    emoji: '🛒',
    color: 'green',
    description: 'Predicación con carrito o stand'
  },
  campaign: {
    id: 'campaign',
    label: 'Campaña Especial',
    emoji: '📢',
    color: 'purple',
    description: 'Campaña de invitaciones o memorial'
  },
  territory: {
    id: 'territory',
    label: 'Territorio Asignado',
    emoji: '🗺️',
    color: 'orange',
    description: 'Predicación en territorio asignado'
  },
  business: {
    id: 'business',
    label: 'Predicación Comercial',
    emoji: '🏢',
    color: 'indigo',
    description: 'Predicación en negocios'
  },
  phone: {
    id: 'phone',
    label: 'Predicación Telefónica',
    emoji: '📞',
    color: 'pink',
    description: 'Predicación por teléfono'
  },
  letter: {
    id: 'letter',
    label: 'Predicación por Cartas',
    emoji: '✉️',
    color: 'cyan',
    description: 'Predicación mediante cartas'
  },
  other: {
    id: 'other',
    label: 'Otra Actividad',
    emoji: '🎯',
    color: 'gray',
    description: 'Otra forma de predicación'
  }
};

/**
 * Crear nueva salida
 */
export const createOuting = (data) => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    date: data.date || new Date().toISOString(),
    type: data.type || 'public',
    companions: data.companions || [],
    territory: data.territory || '',
    hours: data.hours || 0,
    placements: data.placements || 0,
    videos: data.videos || 0,
    returnVisits: data.returnVisits || 0,
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Cargar salidas desde localStorage
 */
export const loadOutings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error al cargar salidas:', error);
  }
  return [];
};

/**
 * Guardar salidas en localStorage
 */
export const saveOutings = (outings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outings));
    return true;
  } catch (error) {
    console.error('Error al guardar salidas:', error);
    return false;
  }
};

/**
 * Agregar nueva salida
 */
export const addOuting = (outingData) => {
  const outings = loadOutings();
  const newOuting = createOuting(outingData);
  outings.unshift(newOuting);
  saveOutings(outings);
  return newOuting;
};

/**
 * Actualizar salida existente
 */
export const updateOuting = (id, updates) => {
  const outings = loadOutings();
  const index = outings.findIndex(o => o.id === id);

  if (index !== -1) {
    outings[index] = {
      ...outings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveOutings(outings);
    return outings[index];
  }

  return null;
};

/**
 * Eliminar salida
 */
export const deleteOuting = (id) => {
  const outings = loadOutings();
  const filtered = outings.filter(o => o.id !== id);
  saveOutings(filtered);
  return true;
};

/**
 * Obtener estadísticas de salidas
 */
export const getOutingsStats = (outings) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filtrar salidas del mes actual
  const thisMonthOutings = outings.filter(outing => {
    const outingDate = new Date(outing.date);
    return outingDate.getMonth() === currentMonth &&
           outingDate.getFullYear() === currentYear;
  });

  // Contar por tipo
  const byType = {};
  Object.keys(OUTING_TYPES).forEach(type => {
    byType[type] = outings.filter(o => o.type === type).length;
  });

  // Compañeros más frecuentes
  const companionCounts = {};
  outings.forEach(outing => {
    outing.companions.forEach(companion => {
      companionCounts[companion] = (companionCounts[companion] || 0) + 1;
    });
  });

  const topCompanions = Object.entries(companionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // Territorios más trabajados
  const territoryCounts = {};
  outings.forEach(outing => {
    if (outing.territory) {
      territoryCounts[outing.territory] = (territoryCounts[outing.territory] || 0) + 1;
    }
  });

  const topTerritories = Object.entries(territoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([territory, count]) => ({ territory, count }));

  return {
    total: outings.length,
    thisMonth: thisMonthOutings.length,
    totalHours: outings.reduce((sum, o) => sum + (o.hours || 0), 0),
    thisMonthHours: thisMonthOutings.reduce((sum, o) => sum + (o.hours || 0), 0),
    totalPlacements: outings.reduce((sum, o) => sum + (o.placements || 0), 0),
    totalVideos: outings.reduce((sum, o) => sum + (o.videos || 0), 0),
    totalReturnVisits: outings.reduce((sum, o) => sum + (o.returnVisits || 0), 0),
    byType,
    topCompanions,
    topTerritories,
    averageHoursPerOuting: outings.length > 0
      ? (outings.reduce((sum, o) => sum + (o.hours || 0), 0) / outings.length).toFixed(1)
      : 0
  };
};

/**
 * Filtrar salidas
 */
export const filterOutings = (outings, filters) => {
  let filtered = [...outings];

  // Filtro por búsqueda (territorio, compañeros, notas)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(outing =>
      outing.territory?.toLowerCase().includes(searchLower) ||
      outing.companions?.some(c => c.toLowerCase().includes(searchLower)) ||
      outing.notes?.toLowerCase().includes(searchLower)
    );
  }

  // Filtro por tipo
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(outing => outing.type === filters.type);
  }

  // Filtro por fecha (mes específico)
  if (filters.month) {
    const [year, month] = filters.month.split('-').map(Number);
    filtered = filtered.filter(outing => {
      const outingDate = new Date(outing.date);
      return outingDate.getFullYear() === year &&
             outingDate.getMonth() === month - 1;
    });
  }

  // Filtro por compañero
  if (filters.companion) {
    filtered = filtered.filter(outing =>
      outing.companions?.includes(filters.companion)
    );
  }

  return filtered;
};

/**
 * Ordenar salidas
 */
export const sortOutings = (outings, sortBy) => {
  const sorted = [...outings];

  switch (sortBy) {
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));

    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));

    case 'hours-desc':
      return sorted.sort((a, b) => (b.hours || 0) - (a.hours || 0));

    case 'hours-asc':
      return sorted.sort((a, b) => (a.hours || 0) - (b.hours || 0));

    case 'type':
      return sorted.sort((a, b) => a.type.localeCompare(b.type));

    default:
      return sorted;
  }
};

/**
 * Obtener lista de compañeros únicos
 */
export const getUniqueCompanions = (outings) => {
  const companions = new Set();
  outings.forEach(outing => {
    outing.companions?.forEach(companion => companions.add(companion));
  });
  return Array.from(companions).sort();
};

/**
 * Obtener lista de territorios únicos
 */
export const getUniqueTerritories = (outings) => {
  const territories = new Set();
  outings.forEach(outing => {
    if (outing.territory) {
      territories.add(outing.territory);
    }
  });
  return Array.from(territories).sort();
};

/**
 * Exportar salidas a JSON
 */
export const exportOutingsToJSON = (outings) => {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    outings: outings
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `salidas-congregacion-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Importar salidas desde JSON
 */
export const importOutingsFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.outings && Array.isArray(data.outings)) {
          resolve(data.outings);
        } else {
          reject(new Error('Formato de archivo inválido'));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
};
