/**
 * Utilidades simples para gestión de territorios
 */

const STORAGE_KEY = 'territories';

export const loadTerritories = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

export const saveTerritories = (territories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(territories));
};

export const addTerritory = (name, description = '') => {
  const territories = loadTerritories();
  const newTerritory = {
    id: Date.now().toString(),
    name,
    description,
    lastWorked: null,
    timesWorked: 0,
    createdAt: new Date().toISOString()
  };
  territories.push(newTerritory);
  saveTerritories(territories);
  return newTerritory;
};

export const updateTerritoryWorked = (territoryId) => {
  const territories = loadTerritories();
  const territory = territories.find(t => t.id === territoryId);
  if (territory) {
    territory.lastWorked = new Date().toISOString();
    territory.timesWorked = (territory.timesWorked || 0) + 1;
    saveTerritories(territories);
  }
};

export const deleteTerritory = (territoryId) => {
  const territories = loadTerritories();
  const filtered = territories.filter(t => t.id !== territoryId);
  saveTerritories(filtered);
};
