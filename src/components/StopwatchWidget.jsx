import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, Square, Save, RotateCcw, X, ChevronUp, ChevronDown } from 'lucide-react';

const StopwatchWidget = ({ onOpen, onSave }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const stopwatchState = localStorage.getItem('stopwatchState');
      if (stopwatchState) {
        const { savedTime, savedIsRunning, savedStartTime } = JSON.parse(stopwatchState);
        setIsRunning(savedIsRunning);
        if (savedIsRunning && savedStartTime) {
          const elapsed = Math.floor((Date.now() - savedStartTime) / 1000);
          setTime(savedTime + elapsed);
          setIsPaused(false);
        } else {
          setTime(savedTime);
          setIsPaused(savedIsRunning && !savedStartTime);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      display: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      hours: hours,
      minutes: minutes,
      seconds: secs
    };
  };

  const handlePause = () => {
    const stopwatchState = localStorage.getItem('stopwatchState');
    if (stopwatchState) {
      const state = JSON.parse(stopwatchState);
      localStorage.setItem('stopwatchState', JSON.stringify({
        savedTime: time,
        savedIsRunning: true,
        savedStartTime: null // Pausado
      }));
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    const newStartTime = Date.now() - (time * 1000);
    localStorage.setItem('stopwatchState', JSON.stringify({
      savedTime: time,
      savedIsRunning: true,
      savedStartTime: newStartTime
    }));
    setIsPaused(false);
  };

  const handleStop = () => {
    if (window.confirm('¿Detener el cronómetro? El tiempo no se guardará.')) {
      localStorage.removeItem('stopwatchState');
    }
  };

  const handleSave = () => {
    if (time === 0) {
      alert('No hay tiempo para guardar');
      return;
    }
    
    const hours = time / 3600;
    
    if (window.confirm(`¿Guardar ${hours.toFixed(2)} horas como actividad?`)) {
      // Crear actividad
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
        notes: `Registrado con cronómetro - ${formatTime(time).display}`
      };

      // Obtener actividades existentes
      const savedActivities = localStorage.getItem('activities');
      let activities = [];
      if (savedActivities) {
        try {
          activities = JSON.parse(savedActivities);
        } catch (error) {
          console.error('Error al cargar actividades:', error);
        }
      }

      // Agregar nueva actividad
      activities.push(activity);
      localStorage.setItem('activities', JSON.stringify(activities));

      // Limpiar cronómetro
      localStorage.removeItem('stopwatchState');

      // Recargar la página para actualizar las actividades
      window.location.reload();
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Reiniciar el cronómetro? Se perderá el tiempo actual.')) {
      localStorage.removeItem('stopwatchState');
    }
  };

  const timeFormatted = formatTime(time);

  if (!isRunning && time === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scaleIn">
      {/* Widget compacto */}
      {!isExpanded ? (
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl shadow-2xl transition-all duration-300 border-2 border-white">
          <button
            onClick={() => setIsExpanded(true)}
            className="p-4 flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <div className="bg-white bg-opacity-20 p-2 rounded-xl backdrop-blur-sm">
              <Timer className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold opacity-90">
                {isPaused ? '⏸️ Pausado' : '⏱️ Activo'}
              </div>
              <div className="text-xl font-bold font-mono tracking-wider">
                {timeFormatted.display}
              </div>
            </div>
            <ChevronUp className="w-5 h-5 ml-2 opacity-75" />
          </button>
        </div>
      ) : (
        /* Widget expandido con controles */
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-2xl border-2 border-white overflow-hidden w-80">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              <span className="font-bold">Cronómetro</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Display del tiempo */}
          <div className="p-6 text-center">
            <div className="text-xs text-gray-400 mb-2 font-semibold">
              {isPaused ? '⏸️ PAUSADO' : '⏱️ EN EJECUCIÓN'}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              <div className="text-center">
                <div className="text-4xl font-bold font-mono">{timeFormatted.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400">hrs</div>
              </div>
              <div className="text-3xl font-bold text-gray-500">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold font-mono">{timeFormatted.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400">min</div>
              </div>
              <div className="text-3xl font-bold text-gray-500">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold font-mono">{timeFormatted.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400">seg</div>
              </div>
            </div>
            <div className="text-sm text-blue-400 font-semibold">
              {(time / 3600).toFixed(2)} horas
            </div>
          </div>

          {/* Controles */}
          <div className="p-4 space-y-2 bg-gray-800">
            {/* Play/Pause */}
            {!isPaused ? (
              <button
                onClick={handlePause}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <Pause className="w-5 h-5" />
                Pausar
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <Play className="w-5 h-5" />
                Reanudar
              </button>
            )}

            {/* Guardar */}
            <button
              onClick={handleSave}
              disabled={time === 0}
              className={`w-full font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                time === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Save className="w-5 h-5" />
              Guardar como Actividad
            </button>

            {/* Acciones secundarias */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleReset}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar
              </button>
              <button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4" />
                Detener
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StopwatchWidget;
