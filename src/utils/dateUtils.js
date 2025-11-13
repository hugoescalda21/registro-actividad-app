export const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getFullYear()
  };
};

export const isCurrentMonth = (dateString) => {
  const date = new Date(dateString);
  const { month, year } = getCurrentMonthYear();
  return date.getMonth() === month && date.getFullYear() === year;
};