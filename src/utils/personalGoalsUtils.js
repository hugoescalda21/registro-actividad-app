/**
 * Utilidades para metas personalizadas
 */

const STORAGE_KEY = 'personalGoals';

export const createPersonalGoal = (data) => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    type: data.type, // 'hours', 'placements', 'videos', 'returnVisits', 'studies', 'custom'
    target: data.target,
    period: data.period, // 'month', 'week', 'custom'
    customPeriodStart: data.customPeriodStart || null,
    customPeriodEnd: data.customPeriodEnd || null,
    label: data.label,
    icon: data.icon || '🎯',
    active: true,
    createdAt: new Date().toISOString()
  };
};

export const loadPersonalGoals = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al cargar metas:', error);
    return [];
  }
};

export const savePersonalGoals = (goals) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    return true;
  } catch (error) {
    console.error('Error al guardar metas:', error);
    return false;
  }
};

export const addPersonalGoal = (goalData) => {
  const goals = loadPersonalGoals();
  const newGoal = createPersonalGoal(goalData);
  goals.push(newGoal);
  savePersonalGoals(goals);
  return newGoal;
};

export const updatePersonalGoal = (id, updates) => {
  const goals = loadPersonalGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index !== -1) {
    goals[index] = { ...goals[index], ...updates };
    savePersonalGoals(goals);
    return goals[index];
  }
  return null;
};

export const deletePersonalGoal = (id) => {
  const goals = loadPersonalGoals();
  const filtered = goals.filter(g => g.id !== id);
  savePersonalGoals(filtered);
};

export const getGoalProgress = (goal, activities) => {
  const now = new Date();
  let startDate, endDate;

  if (goal.period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else if (goal.period === 'week') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    startDate = new Date(now.setDate(diff));
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  } else if (goal.period === 'custom') {
    startDate = new Date(goal.customPeriodStart);
    endDate = new Date(goal.customPeriodEnd);
  }

  const periodActivities = activities.filter(act => {
    const actDate = new Date(act.date);
    return actDate >= startDate && actDate <= endDate;
  });

  let current = 0;
  if (goal.type === 'hours') {
    current = periodActivities.reduce((sum, act) => sum + (act.hours || 0) + (act.approvedHours || 0), 0);
  } else if (goal.type === 'placements') {
    current = periodActivities.reduce((sum, act) => sum + (act.placements || 0), 0);
  } else if (goal.type === 'videos') {
    current = periodActivities.reduce((sum, act) => sum + (act.videos || 0), 0);
  } else if (goal.type === 'returnVisits') {
    current = periodActivities.reduce((sum, act) => sum + (act.returnVisits || 0), 0);
  } else if (goal.type === 'studies') {
    current = periodActivities.reduce((sum, act) => sum + (act.studies || 0), 0);
  }

  const percentage = goal.target > 0 ? Math.min((current / goal.target) * 100, 100) : 0;
  const remaining = Math.max(goal.target - current, 0);

  return {
    current,
    target: goal.target,
    percentage: percentage.toFixed(1),
    remaining,
    achieved: current >= goal.target,
    daysLeft: Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
  };
};
