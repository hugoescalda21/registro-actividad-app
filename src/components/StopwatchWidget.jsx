import React, { useState, useEffect, useRef } from 'react';
import { Timer, Maximize2, Play, Pause, Square, Save, RotateCcw, ChevronUp, ChevronDown, Move } from 'lucide-react';

const StopwatchWidget = ({ onOpen }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Estados para drag
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('stopwatchWidgetPosition');
    return saved ? JSON.parse(saved) : { x: window.innerWidth - 340, y: 100 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef(null);

  // Actualizar tiempo
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

  // Guardar posición
  useEffect(() => {
    localStorage.setItem('stopwatchWidgetPosition', JSON.stringify(position));
  }, [position]);

  // Handlers de drag
  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return; // No arrastrar si se clickea un botón
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('button')) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    setDragOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Límites de la pantalla
        const maxX = window.innerWidth - (widgetRef.current?.offsetWidth || 320);
        const maxY = window.innerHeight - (widgetRef.current?.offsetHeight || 200);
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging) {
        const touch = e.touches[0];
        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;
        
        const maxX = window.innerWidth - (widgetRef.current?.offsetWidth || 320);
        const maxY = window.innerHeight - (widgetRef.current?.offsetHeight || 200);
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

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
        savedStartTime: null
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
    <div
      ref={widgetRef}
      className="fixed z-50 animate-scaleIn"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
    >
      {/* Widget compacto */}
      {!isExpanded ? (
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl shadow-2xl transition-all duration-300 border-2 border-white ${
            isDragging ? 'scale-105' : ''
          }`}
        >
          <div className="p-4 flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-xl backdrop-blur-sm">
              <Timer className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold opacity-90 flex items-center gap-2">
                <Move className="w-3 h-3" />
                {isPaused ? '⏸️ Pausado' : '⏱️ Activo'}
              </div>
              <div className="text-xl font-bold font-mono tracking-wider">
                {timeFormatted.display}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors ml-2"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Widget expandido */
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-2xl border-2 border-white overflow-hidden w-80">
          {/* Header draggable */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`bg-gradient-to-r from-orange-500 to-red-600 p-4 flex items-center justify-between ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4" />
              <Timer className="w-5 h-5" />
              <span className="font-bold">Cronómetro</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
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
                <div className="text-4xl font-bold font-mono">{timeFormatted.hours}</div>
                <div className="text-xs text-gray-400">hrs</div>
              </div>
              <div className="text-3xl font-bold text-gray-500">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold font-mono">{timeFormatted.minutes}</div>
                <div className="text-xs text-gray-400">min</div>
              </div>
              <div className="text-3xl font-bold text-gray-500">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold font-mono">{timeFormatted.seconds}</div>
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
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <Pause className="w-5 h-5" />
                Pausar
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <Play className="w-5 h-5" />
                Reanudar
              </button>
            )}

            {/* Guardar */}
            <button
              onClick={handleSave}
              disabled={time === 0}
              className={`w-full font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
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
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar
              </button>
              <button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
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

