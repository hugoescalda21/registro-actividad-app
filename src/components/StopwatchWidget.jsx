import React, { useState, useEffect, useRef } from 'react';
import { Timer, Maximize2, Play, Pause, Square, Save, RotateCcw, ChevronUp, ChevronDown, Move } from 'lucide-react';
import { useModal } from '../contexts/ModalContext';

const StopwatchWidget = ({ onOpen }) => {
  const modal = useModal();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Estados para drag
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('stopwatchWidgetPosition');
    if (saved) {
      return JSON.parse(saved);
    }
    // Posición inicial diferente según dispositivo
    const isMobile = window.innerWidth < 768;
    return { 
      x: isMobile ? 10 : window.innerWidth - 340, 
      y: isMobile ? 80 : 100 
    };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef(null);

  // Actualizar tiempo - FIX: Lee correctamente sin duplicar
  useEffect(() => {
    const interval = setInterval(() => {
      const stopwatchState = localStorage.getItem('stopwatchState');
      if (stopwatchState) {
        try {
          const { savedTime, savedIsRunning, savedStartTime } = JSON.parse(stopwatchState);
          setIsRunning(savedIsRunning);
          
          if (savedIsRunning && savedStartTime) {
            // El cronómetro está corriendo
            const savedTimeValue = parseInt(localStorage.getItem('stopwatchSavedTime') || '0');
            const elapsed = Math.floor((Date.now() - savedStartTime) / 1000);
            setTime(savedTimeValue + elapsed);
            setIsPaused(false);
          } else if (savedIsRunning && !savedStartTime) {
            // El cronómetro está pausado
            setTime(savedTime);
            setIsPaused(true);
          } else {
            // El cronómetro está detenido
            setTime(savedTime);
            setIsPaused(false);
          }
        } catch (error) {
          console.error('Error al leer estado del cronómetro:', error);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Guardar posición
  useEffect(() => {
    localStorage.setItem('stopwatchWidgetPosition', JSON.stringify(position));
  }, [position]);

  // Ajustar posición al cambiar tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      const maxX = window.innerWidth - (widgetRef.current?.offsetWidth || 320);
      const maxY = window.innerHeight - (widgetRef.current?.offsetHeight || 200);
      
      setPosition(prev => ({
        x: Math.max(0, Math.min(prev.x, maxX)),
        y: Math.max(0, Math.min(prev.y, maxY))
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handlers de drag
  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    
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
        e.preventDefault();
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
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
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
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const handlePause = () => {
    const stopwatchState = localStorage.getItem('stopwatchState');
    if (stopwatchState) {
      localStorage.setItem('stopwatchState', JSON.stringify({
        savedTime: time,
        savedIsRunning: true,
        savedStartTime: null
      }));
      localStorage.setItem('stopwatchSavedTime', time.toString());
      setIsPaused(true);
    }
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

  const handleStop = async () => {
    const confirmed = await modal.confirm(
      '¿Detener el cronómetro? El tiempo no se guardará.',
      'Detener cronómetro'
    );
    if (confirmed) {
      localStorage.removeItem('stopwatchState');
      localStorage.removeItem('stopwatchSavedTime');
    }
  };

  const handleSave = async () => {
    if (time === 0) {
      await modal.warning('No hay tiempo para guardar', 'Cronómetro vacío');
      return;
    }

    const hours = time / 3600;

    const confirmed = await modal.confirm(
      `¿Guardar ${hours.toFixed(2)} horas como actividad?`,
      'Guardar actividad'
    );
    if (confirmed) {
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

  const handleReset = async () => {
    const confirmed = await modal.confirm(
      '¿Reiniciar el cronómetro? Se perderá el tiempo actual.',
      'Reiniciar cronómetro'
    );
    if (confirmed) {
      localStorage.removeItem('stopwatchState');
      localStorage.removeItem('stopwatchSavedTime');
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
        touchAction: 'none',
        maxWidth: 'calc(100vw - 20px)' // Responsive en móvil
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
          <div className="p-3 flex items-center gap-2 md:p-4 md:gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-xl backdrop-blur-sm">
              <Timer className="w-5 h-5 animate-pulse md:w-6 md:h-6" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="text-xs font-semibold opacity-90 flex items-center gap-1">
                <Move className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{isPaused ? '⏸️ Pausado' : '⏱️ Activo'}</span>
              </div>
              <div className="text-lg font-bold font-mono tracking-wider md:text-xl">
                {timeFormatted.display}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors flex-shrink-0"
              aria-label="Expandir"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Widget expandido */
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-2xl border-2 border-white overflow-hidden w-80 max-w-full">
          {/* Header draggable */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`bg-gradient-to-r from-orange-500 to-red-600 p-3 flex items-center justify-between ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            } md:p-4`}
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
              aria-label="Contraer"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Display del tiempo */}
          <div className="p-4 text-center md:p-6">
            <div className="text-xs text-gray-400 mb-2 font-semibold">
              {isPaused ? '⏸️ PAUSADO' : '⏱️ EN EJECUCIÓN'}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              <div className="text-center">
                <div className="text-3xl font-bold font-mono md:text-4xl">{timeFormatted.hours}</div>
                <div className="text-xs text-gray-400">hrs</div>
              </div>
              <div className="text-2xl font-bold text-gray-500 md:text-3xl">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono md:text-4xl">{timeFormatted.minutes}</div>
                <div className="text-xs text-gray-400">min</div>
              </div>
              <div className="text-2xl font-bold text-gray-500 md:text-3xl">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono md:text-4xl">{timeFormatted.seconds}</div>
                <div className="text-xs text-gray-400">seg</div>
              </div>
            </div>
            <div className="text-sm text-blue-400 font-semibold">
              {(time / 3600).toFixed(2)} horas
            </div>
          </div>

          {/* Controles */}
          <div className="p-3 space-y-2 bg-gray-800 md:p-4">
            {/* Play/Pause */}
            {!isPaused ? (
              <button
                onClick={handlePause}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-95 md:py-3"
              >
                <Pause className="w-5 h-5" />
                <span>Pausar</span>
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-95 md:py-3"
              >
                <Play className="w-5 h-5" />
                <span>Reanudar</span>
              </button>
            )}

            {/* Guardar */}
            <button
              onClick={handleSave}
              disabled={time === 0}
              className={`w-full font-bold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-95 md:py-3 ${
                time === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Save className="w-5 h-5" />
              <span className="text-sm md:text-base">Guardar Actividad</span>
            </button>

            {/* Acciones secundarias */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleReset}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1 active:scale-95 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reiniciar</span>
              </button>
              <button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1 active:scale-95 text-sm"
              >
                <Square className="w-4 h-4" />
                <span>Detener</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StopwatchWidget;