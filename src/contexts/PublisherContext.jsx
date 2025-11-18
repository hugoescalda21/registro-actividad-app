import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import storage from '../services/storage';

const PublisherContext = createContext(null);

export const usePublisher = () => {
  const context = useContext(PublisherContext);
  if (!context) {
    throw new Error('usePublisher debe ser usado dentro de un PublisherProvider');
  }
  return context;
};

const publisherTypes = {
  publisher: {
    name: 'Publicador',
    hours: 0,
    studies: 0,
    canLogHours: false,
    canLogApproved: false
  },
  auxiliaryPioneer: {
    name: 'Precursor Auxiliar',
    hours: 30,
    studies: 0,
    canLogHours: true,
    canLogApproved: true
  },
  regularPioneer: {
    name: 'Precursor Regular',
    hours: 50,
    studies: 0,
    canLogHours: true,
    canLogApproved: true
  },
  specialPioneer: {
    name: 'Precursor Especial',
    hours: 100,
    studies: 2,
    canLogHours: true,
    canLogApproved: true
  }
};

const legacyMapping = {
  'regular': 'regularPioneer',
  'auxiliary': 'auxiliaryPioneer',
  'special': 'specialPioneer',
  'Precursor Regular': 'regularPioneer',
  'Precursor Auxiliar': 'auxiliaryPioneer',
  'Precursor Especial': 'specialPioneer',
  'Publicador': 'publisher'
};

export const PublisherProvider = ({ children }) => {
  const [publisherType, setPublisherTypeState] = useState(() => {
    let type = storage.getPublisherType();
    
    if (legacyMapping[type]) {
      type = legacyMapping[type];
      storage.setPublisherType(type);
    }
    
    if (!publisherTypes[type]) {
      type = 'publisher';
      storage.setPublisherType(type);
    }
    
    return type;
  });

  const config = useMemo(() => {
    return publisherTypes[publisherType] || publisherTypes.publisher;
  }, [publisherType]);

  const setPublisherType = (newType) => {
    setPublisherTypeState(newType);
    storage.setPublisherType(newType);
  };

  const canLogHours = config.canLogHours;

  const value = {
    publisherType,
    setPublisherType,
    config,
    publisherTypes,
    canLogHours
  };

  return (
    <PublisherContext.Provider value={value}>
      {children}
    </PublisherContext.Provider>
  );
};