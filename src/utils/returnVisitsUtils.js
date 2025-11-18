/**
 * Utilidades para gestionar revisitas
 */

// Cargar revisitas del localStorage
export const loadReturnVisits = () => {
  try {
    const saved = localStorage.getItem('returnVisits');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error al cargar revisitas:', error);
    return [];
  }
};

// Guardar revisitas en localStorage
export const saveReturnVisits = (visits) => {
  try {
    localStorage.setItem('returnVisits', JSON.stringify(visits));
    return true;
  } catch (error) {
    console.error('Error al guardar revisitas:', error);
    return false;
  }
};

// Crear nueva revisita
export const createReturnVisit = (data) => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: data.name || '',
    address: data.address || '',
    phone: data.phone || '',
    email: data.email || '',
    createdDate: new Date().toISOString(),
    lastVisitDate: null,
    nextVisitDate: data.nextVisitDate || null,
    status: data.status || 'interested', // interested, studying, inactive
    notes: data.notes || '',
    visits: []
  };
};

// Crear nueva visita
export const createVisit = (data) => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    date: data.date || new Date().toISOString(),
    duration: data.duration || 0,
    notes: data.notes || '',
    publications: data.publications || [],
    wasHome: data.wasHome !== undefined ? data.wasHome : true,
    topic: data.topic || '',
    nextSteps: data.nextSteps || ''
  };
};

// Agregar visita a una revisita
export const addVisitToReturnVisit = (returnVisit, visitData) => {
  const newVisit = createVisit(visitData);
  const updatedReturnVisit = {
    ...returnVisit,
    visits: [...returnVisit.visits, newVisit],
    lastVisitDate: newVisit.date
  };
  return updatedReturnVisit;
};

// Obtener estadísticas de revisitas
export const getReturnVisitsStats = (returnVisits) => {
  const total = returnVisits.length;
  const active = returnVisits.filter(rv => rv.status === 'interested' || rv.status === 'studying').length;
  const studying = returnVisits.filter(rv => rv.status === 'studying').length;
  const totalVisits = returnVisits.reduce((sum, rv) => sum + rv.visits.length, 0);

  return {
    total,
    active,
    studying,
    inactive: total - active,
    totalVisits
  };
};

// Obtener revisitas que necesitan visita
export const getReturnVisitsNeedingVisit = (returnVisits, daysThreshold = 7) => {
  const now = new Date();
  return returnVisits.filter(rv => {
    if (rv.status === 'inactive') return false;
    if (!rv.lastVisitDate) return true; // Nunca visitada

    const lastVisit = new Date(rv.lastVisitDate);
    const daysSinceLastVisit = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));

    return daysSinceLastVisit >= daysThreshold;
  });
};

// Filtrar revisitas
export const filterReturnVisits = (returnVisits, filters) => {
  let filtered = [...returnVisits];

  // Filtrar por estado
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(rv => rv.status === filters.status);
  }

  // Filtrar por búsqueda de texto
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(rv =>
      rv.name.toLowerCase().includes(searchLower) ||
      rv.address.toLowerCase().includes(searchLower) ||
      rv.phone.includes(searchLower) ||
      rv.notes.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

// Ordenar revisitas
export const sortReturnVisits = (returnVisits, sortBy = 'name') => {
  const sorted = [...returnVisits];

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'lastVisit':
      return sorted.sort((a, b) => {
        if (!a.lastVisitDate) return 1;
        if (!b.lastVisitDate) return -1;
        return new Date(b.lastVisitDate) - new Date(a.lastVisitDate);
      });
    case 'nextVisit':
      return sorted.sort((a, b) => {
        if (!a.nextVisitDate) return 1;
        if (!b.nextVisitDate) return -1;
        return new Date(a.nextVisitDate) - new Date(b.nextVisitDate);
      });
    case 'status':
      return sorted.sort((a, b) => {
        const statusOrder = { studying: 0, interested: 1, inactive: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
    default:
      return sorted;
  }
};

// Estados disponibles
export const RETURN_VISIT_STATUSES = {
  interested: {
    label: 'Interesado',
    emoji: '😊',
    color: 'blue'
  },
  studying: {
    label: 'Estudiando',
    emoji: '📖',
    color: 'green'
  },
  inactive: {
    label: 'Inactivo',
    emoji: '💤',
    color: 'gray'
  }
};

// Formatear fecha para mostrar
export const formatVisitDate = (dateString) => {
  if (!dateString) return 'Nunca';

  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Sugerir próxima visita (7 días después de la última)
export const suggestNextVisitDate = (lastVisitDate) => {
  if (!lastVisitDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  const nextVisit = new Date(lastVisitDate);
  nextVisit.setDate(nextVisit.getDate() + 7);
  return nextVisit.toISOString().split('T')[0];
};
