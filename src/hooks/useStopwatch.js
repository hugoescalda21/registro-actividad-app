import { useState, useEffect, useRef, useCallback } from 'react';

export const useStopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  // Cargar estado guardado al montar
  useEffect(() => {
    const savedState = localStorage.getItem('stopwatchState');
    if (savedState) {
      try {
        const { savedTime, savedIsRunning, savedStartTime } = JSON.parse(savedState);
        if (savedIsRunning && savedStartTime) {
          const elapsed = Math.floor((Date.now() - savedStartTime) / 1000);
          setTime(savedTime + elapsed);
          setIsRunning(true);
          setIsPaused(false);
          startTimeRef.current = Date.now() - ((savedTime + elapsed) * 1000);
        } else if (savedIsRunning) {
          // Está pausado
          setTime(savedTime);
          setIsRunning(true);
          setIsPaused(true);
          pausedTimeRef.current = savedTime;
        } else {
          setTime(savedTime);
        }
      } catch (error) {
        console.error('Error al cargar cronómetro:', error);
        localStorage.removeItem('stopwatchState');
      }
    }
  }, []);

  // Guardar estado
  useEffect(() => {
    if (isRunning) {
      const stateToSave = {
        savedTime: time,
        savedIsRunning: isRunning,
        savedStartTime: isPaused ? null : startTimeRef.current
      };
      localStorage.setItem('stopwatchState', JSON.stringify(stateToSave));
    } else if (time === 0) {
      localStorage.removeItem('stopwatchState');
    }
  }, [time, isRunning, isPaused]);

  // Actualizar tiempo
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTime(elapsed);
      }, 100); // Actualizar cada 100ms para mayor precisión

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isRunning, isPaused]);

  // Notificación cada hora
  useEffect(() => {
    if (time > 0 && time % 3600 === 0 && isRunning && !isPaused) {
      const hours = Math.floor(time / 3600);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⏱️ Cronómetro', {
          body: `¡Has completado ${hours} hora${hours > 1 ? 's' : ''}!`,
          icon: '/icon-192.png'
        });
      }
    }
  }, [time, isRunning, isPaused]);

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - (time * 1000);
      setIsRunning(true);
      setIsPaused(false);
      
      // CRÍTICO: Guardar en localStorage inmediatamente
    localStorage.setItem('stopwatchState', JSON.stringify({
      savedTime: time,
      savedIsRunning: true,
      savedStartTime: startTimeRef.current
    }));

    }
  }, [time, isRunning]);

  const pause = useCallback(() => {
    setIsPaused(true);
    pausedTimeRef.current = time;
  }, [time]);

  const resume = useCallback(() => {
    startTimeRef.current = Date.now() - (time * 1000);
    setIsPaused(false);
  }, [time]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setIsPaused(false);
    localStorage.removeItem('stopwatchState');
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTime(0);
    setIsRunning(false);
    setIsPaused(false);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    localStorage.removeItem('stopwatchState');
  }, []);

  const getFormattedTime = useCallback(() => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      total: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };
  }, [time]);

  return {
    time,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    reset,
    getFormattedTime
  };
};
