export const publisherTypes = {
  publicador: {
    label: 'Publicador',
    goal: 0,
    color: 'from-gray-500 to-gray-600',
    canLogHours: false,
    canLogApproved: false
  },
  auxiliar15: {
    label: 'Precursor Auxiliar (15 hrs)',
    goal: 15,
    color: 'from-blue-500 to-blue-600',
    canLogHours: true,
    canLogApproved: false
  },
  auxiliar30: {
    label: 'Precursor Auxiliar (30 hrs)',
    goal: 30,
    color: 'from-indigo-500 to-indigo-600',
    canLogHours: true,
    canLogApproved: false
  },
  regular: {
    label: 'Precursor Regular',
    goal: 50,
    color: 'from-purple-500 to-purple-600',
    canLogHours: true,
    canLogApproved: true
  },
  especial: {
    label: 'Precursor Especial',
    goal: 100,
    color: 'from-pink-500 to-pink-600',
    canLogHours: true,
    canLogApproved: true
  }
};

export const activityTypes = {
  predicacion: { label: 'Predicación Pública', color: 'bg-blue-500' },
  revisitas: { label: 'Revisitas', color: 'bg-green-500' },
  estudios: { label: 'Estudios Bíblicos', color: 'bg-purple-500' },
  informal: { label: 'Predicación Informal', color: 'bg-orange-500' }
};