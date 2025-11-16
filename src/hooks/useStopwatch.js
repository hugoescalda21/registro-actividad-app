import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  hasNotificationPermission, 
  sendNotification, 
  NotificationTemplates,
  loadNotificationSettings
} from '../utils/notificationUtils';
import { useStopwatchNotification } from './useStopwatchNotification';

export const useStopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Hook para manejar notificación persistente
  useStopwatchNotification(time, isRunning, isPaused);

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
          startTimeRef.current = savedStartTime;
        } else {
          setTime(savedTime);
          setIsRunning(false);
          setIsPaused(true);
        }
      } catch (error) {
        console.error('Error al cargar estado del cronómetro:', error);
      }
    }
  }, []);

  // Actualizar el tiempo cada segundo
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const savedTime = parseInt(localStorage.getItem('stopwatchSavedTime') || '0');
        setTime(savedTime + elapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  // Guardar estado en localStorage
  useEffect(() => {
    if (isRunning || isPaused) {
      const state = {
        savedTime: time,
        savedIsRunning: isRunning && !isPaused,
        savedStartTime: startTimeRef.current
      };
      localStorage.setItem('stopwatchState', JSON.stringify(state));
      localStorage.setItem('stopwatchSavedTime', time.toString());
    }
  }, [time, isRunning, isPaused]);

  // Notificaciones cada hora
  useEffect(() => {
    if (time > 0 && time % 3600 === 0 && isRunning && !isPaused) {
      const hours = Math.floor(time / 3600);
      
      const settings = loadNotificationSettings();
      
      if (settings.enabled && hasNotificationPermission()) {
        const { title, options } = NotificationTemplates.hourMilestone(hours);
        sendNotification(title, options);
      }
    }
  }, [time, isRunning, isPaused]);

  // Escuchar eventos del Service Worker
  useEffect(() => {
    const handlePauseEvent = () => {
      pause();
    };

    const handleResumeEvent = () => {
      resume();
    };

    const handleSaveEvent = () => {
      // Guardar actividad
      if (time > 0) {
        const hours = time / 3600;
        const activity = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          hours: parseFloat(hours.toFixed(2)),
          placements: 0,
          videos: 0,
          returnVisits: 0,
          studies: 0,
          approvedHours: 0,
          approvedDetail: '',
          notes: `Registrado con cronómetro - ${getFormattedTime().hours}:${getFormattedTime().minutes}:${getFormattedTime().seconds}`
        };

        const savedActivities = localStorage.getItem('activities');
        let activities = [];
        if (savedActivities) {
          try {
            activities = JSON.parse(savedActivities);
          } catch (error) {
            console.error('Error al cargar actividades:', error);
          }
        }

        activities.push(activity);
        localStorage.setItem('activities', JSON.stringify(activities));
        stop();
        window.location.reload();
      }
    };

    const handleStopEvent = () => {
      stop();
    };

    window.addEventListener('stopwatch-pause', handlePauseEvent);
    window.addEventListener('stopwatch-resume', handleResumeEvent);
    window.addEventListener('stopwatch-save', handleSaveEvent);
    window.addEventListener('stopwatch-stop', handleStopEvent);

    return () => {
      window.removeEventListener('stopwatch-pause', handlePauseEvent);
      window.removeEventListener('stopwatch-resume', handleResumeEvent);
      window.removeEventListener('stopwatch-save', handleSaveEvent);
      window.removeEventListener('stopwatch-stop', handleStopEvent);
    };
  }, [time]);

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
      setIsPaused(false);
      localStorage.setItem('stopwatchSavedTime', '0');
      
      const state = {
        savedTime: 0,
        savedIsRunning: true,
        savedStartTime: Date.now()
      };
      localStorage.setItem('stopwatchState', JSON.stringify(state));
    }
  }, [isRunning]);

  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      
      const state = {
        savedTime: time,
        savedIsRunning: false,
        savedStartTime: null
      };
      localStorage.setItem('stopwatchState', JSON.stringify(state));
      localStorage.setItem('stopwatchSavedTime', time.toString());
    }
  }, [isRunning, isPaused, time]);

  const resume = useCallback(() => {
    if (isRunning && isPaused) {
      startTimeRef.current = Date.now();
      setIsPaused(false);
      localStorage.setItem('stopwatchSavedTime', time.toString());
      
      const state = {
        savedTime: time,
        savedIsRunning: true,
        savedStartTime: Date.now()
      };
      localStorage.setItem('stopwatchState', JSON.stringify(state));
    }
  }, [isRunning, isPaused, time]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    startTimeRef.current = null;
    localStorage.removeItem('stopwatchState');
    localStorage.removeItem('stopwatchSavedTime');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    startTimeRef.current = Date.now();
    localStorage.setItem('stopwatchSavedTime', '0');
    
    if (isRunning && !isPaused) {
      const state = {
        savedTime: 0,
        savedIsRunning: true,
        savedStartTime: Date.now()
      };
      localStorage.setItem('stopwatchState', JSON.stringify(state));
    }
  }, [isRunning, isPaused]);

  const getFormattedTime = useCallback(() => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
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