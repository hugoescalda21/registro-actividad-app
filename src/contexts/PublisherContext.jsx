import React, { createContext, useContext, useState, useEffect } from 'react';
import storage from '../services/storage';

const PublisherContext = createContext();

export const usePublisher = () => {
  const context = useContext(PublisherContext);
  if (!context) {
    throw new Error('usePublisher debe usarse dentro de un PublisherProvider');
  }
  return context;
};

// Definición de tipos de publicadores
const PUBLISHER_TYPES = {
  publicador: {
    label: 'Publicador',
    emoji: '=Ö',
    hours: 0,
    placements: 0,
    videos: 0,
    returnVisits: 0,
    studies: 0,
    canLogHours: false,
    canLogApproved: false
  },
  auxiliar15: {
    label: 'Precursor Auxiliar (15 hrs)',
    emoji: 'P',
    hours: 15,
    placements: 0,
    videos: 0,
    returnVisits: 0,
    studies: 0,
    canLogHours: true,
    canLogApproved: false
  },
  auxiliar30: {
    label: 'Precursor Auxiliar (30 hrs)',
    emoji: '<',
    hours: 30,
    placements: 0,
    videos: 0,
    returnVisits: 0,
    studies: 0,
    canLogHours: true,
    canLogApproved: false
  },
  regular: {
    label: 'Precursor Regular',
    emoji: '=',
    hours: 50,
    placements: 15,
    videos: 8,
    returnVisits: 6,
    studies: 2,
    canLogHours: true,
    canLogApproved: true
  },
  especial: {
    label: 'Precursor Especial',
    emoji: '(',
    hours: 100,
    placements: 20,
    videos: 10,
    returnVisits: 8,
    studies: 3,
    canLogHours: true,
    canLogApproved: true
  }
};

export const PublisherProvider = ({ children }) => {
  const [publisherType, setPublisherTypeState] = useState('publicador');

  // Cargar tipo de publicador del storage al iniciar
  useEffect(() => {
    const savedType = storage.getPublisherType();
    if (savedType) {
      setPublisherTypeState(savedType);
    }
  }, []);

  // Guardar tipo de publicador cuando cambie
  useEffect(() => {
    storage.setPublisherType(publisherType);
  }, [publisherType]);

  // Función para cambiar el tipo de publicador
  const setPublisherType = (type) => {
    if (PUBLISHER_TYPES[type]) {
      setPublisherTypeState(type);
    } else {
      console.error(`Tipo de publicador inválido: ${type}`);
    }
  };

  // Obtener configuración del tipo actual
  const config = PUBLISHER_TYPES[publisherType];

  const value = {
    publisherType,
    setPublisherType,
    config,
    publisherTypes: PUBLISHER_TYPES,
    // Shortcuts útiles
    canLogHours: config.canLogHours,
    canLogApproved: config.canLogApproved,
    goalHours: config.hours,
    goalStudies: config.studies
  };

  return (
    <PublisherContext.Provider value={value}>
      {children}
    </PublisherContext.Provider>
  );
};
