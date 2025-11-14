import { useMemo } from 'react';
import { calculateStats } from '../utils/statsCalculator';

export const useStats = (activities, publisherType, selectedMonth = null, selectedYear = null) => {
  const stats = useMemo(() => {
    return calculateStats(activities, publisherType, selectedMonth, selectedYear);
  }, [activities, publisherType, selectedMonth, selectedYear]);

  return stats;
};