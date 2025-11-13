import { useMemo } from 'react';
import { calculateStats } from '../utils/statsCalculator';

export const useStats = (activities, publisherType) => {
  const stats = useMemo(() => {
    return calculateStats(activities, publisherType);
  }, [activities, publisherType]);

  return stats;
};