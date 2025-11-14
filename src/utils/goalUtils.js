// Utilidades para manejar metas personalizadas por mes
export const getMonthKey = (month, year) => {
  return `${year}-${String(month).padStart(2, '0')}`;
};

export const saveCustomGoal = (month, year, goals) => {
  const customGoals = JSON.parse(localStorage.getItem('customGoals') || '{}');
  const key = getMonthKey(month, year);
  customGoals[key] = {
    ...goals,
    setDate: new Date().toISOString()
  };
  localStorage.setItem('customGoals', JSON.stringify(customGoals));
};

export const getCustomGoal = (month, year) => {
  const customGoals = JSON.parse(localStorage.getItem('customGoals') || '{}');
  const key = getMonthKey(month, year);
  return customGoals[key] || null;
};

export const deleteCustomGoal = (month, year) => {
  const customGoals = JSON.parse(localStorage.getItem('customGoals') || '{}');
  const key = getMonthKey(month, year);
  delete customGoals[key];
  localStorage.setItem('customGoals', JSON.stringify(customGoals));
};

export const hasCustomGoal = (month, year) => {
  return getCustomGoal(month, year) !== null;
};