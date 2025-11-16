import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, Square, Save, ChevronDown, ChevronUp } from 'lucide-react';

const StopwatchBanner = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const stopwatchState = localStorage.getItem('stopwatchState');
      if (stopwatchState) {
        try {
          const { savedTime, savedIsRunning, savedStartTime } = JSON.parse(stopwatchState);
          setIsRunning(savedIsRunning);
          
          if (savedIsRunning && savedStartTime) {
            const savedTimeValue = parseInt(localStorage.getItem('stopwatchSavedTime') || '0');
            const elapsed = Math.floor((Date.now() - savedStartTime) / 1000);
            setTime(savedTimeValue + elapsed);
            setIsPaused(false);
          } else if (savedIsRunning && !savedStartTime) {
            setTime(savedTime);
            setIsPaused(true);
          } else {
            setTime(savedTime);
            setIsPaused(false);
          }
        } catch (error) {
          console.error('Error al leer estado del cronómetro:', error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      display: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
      hours: (seconds / 3600).toFixed(2)
    };
  };

  const handlePause = () => {
    localStorage.setItem('stopwatchState', JSON.stringify({
      savedTime: time,
      savedIsRunning: true,
      savedStartTime: null
    }));
    localStorage.setItem('stopwatchSavedTime', time.toString());
    setIsPaused(true);
  };

  const handleResume = () => {
    localStorage.setItem('stopwatchSavedTime', time.toString());
    const newStartTime = Date.now();
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
      localStorage.removeItem('stopwatchSavedTime');
      window.location.reload();
    }
  };

  const handleSave = () => {
    if (time === 0) {
      alert('No hay tiempo para guardar');
      return;
    }
    
    const hours = time / 3600;
    
    if (window.confirm(`¿Guardar ${hours.toFixed(2)} horas como actividad?`)) {
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
      localStorage.removeItem('stopwatchState');
      localStorage.removeItem('stopwatchSavedTime');
      window.location.reload();
    }
  };

  const timeFormatted = formatTime(time);

  if (!isRunning && time === 0) return null;

  return (
    <>
      {/* Espaciador para que el contenido no quede detrás del banner */}
      <div className={`transition-all duration-300 ${isExpanded ? 'h-32' : 'h-16'}`} />

      {/* Banner fijo */}
      <div className="fixed top-0 left-0 right-0 z-[90] animate-slideDown">
        {/* Modo compacto */}
        {!isExpanded ? (
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
              {/* Info del cronómetro */}
              <div 
                className="flex items-center gap-3 flex-1 cursor-pointer"
                onClick={() => setIsExpanded(true)}
              >
                <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
                  <Timer className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold opacity-90">
                    {isPaused ? '⏸️ Pausado' : '⏱️ En curso'}
                  </div>
                  <div className="text-lg font-bold font-mono tracking-wider">
                    {timeFormatted.display} <span className="text-sm opacity-75">| {timeFormatted.hours}h</span>
                  </div>
                </div>
              </div>

              {/* Botones compactos */}
              <div className="flex items-center gap-2">
                {!isPaused ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePause();
                    }}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors touch-target"
                    title="Pausar"
                  >
                    <Pause className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResume();
                    }}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors touch-target"
                    title="Reanudar"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors touch-target"
                  title="Expandir"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Modo expandido */
          <div className="bg-gradient-to-br from-orange-500 via-red-600 to-red-700 text-white shadow-2xl">
            <div className="max-w-4xl mx-auto px-4 py-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Timer className="w-6 h-6" />
                  <span className="font-bold text-lg">Cronómetro</span>
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    {isPaused ? '⏸️ Pausado' : '⏱️ Activo'}
                  </span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors touch-target"
                  title="Contraer"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
              </div>

              {/* Display de tiempo */}
              <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-3 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-4xl font-bold font-mono tracking-wider mb-1">
                    {timeFormatted.display}
                  </div>
                  <div className="text-sm opacity-90">
                    {timeFormatted.hours} horas
                  </div>
                </div>
              </div>

              {/* Controles */}
              <div className="grid grid-cols-3 gap-2">
                {!isPaused ? (
                  <button
                    onClick={handlePause}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Pause className="w-4 h-4" />
                    <span className="hidden sm:inline">Pausar</span>
                  </button>
                ) : (
                  <button
                    onClick={handleResume}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Play className="w-4 h-4" />
                    <span className="hidden sm:inline">Reanudar</span>
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={time === 0}
                  className={`font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    time === 0
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Guardar</span>
                </button>
                <button
                  onClick={handleStop}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Square className="w-4 h-4" />
                  <span className="hidden sm:inline">Detener</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StopwatchBanner;