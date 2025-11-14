import React from 'react';
import { Play, Pause, Square, RotateCcw, Save, X } from 'lucide-react';
import { useStopwatch } from '../hooks/useStopwatch';

const Stopwatch = ({ onSave, onCancel }) => {
  const {
    time,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    reset,
    getFormattedTime
  } = useStopwatch();

  const formattedTime = getFormattedTime();

  const handleSave = () => {
    if (time === 0) {
      alert('No hay tiempo para guardar');
      return;
    }
    
    const hours = time / 3600;
    onSave(hours);
  };

  return (
    <div className="card-gradient p-6 relative overflow-hidden md:p-8">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/50"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 md:text-2xl">
            <span className="text-2xl md:text-3xl">⏱️</span>
            Cronómetro
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors touch-target"
            aria-label="Cerrar cronómetro"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Display del tiempo */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 mb-6 shadow-2xl border-4 border-gray-700 md:p-8 md:mb-8">
          <div className="text-center">
            {/* Indicador de estado */}
            <div className="mb-3">
              {isRunning && !isPaused ? (
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold border border-green-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  EN EJECUCIÓN
                </div>
              ) : isPaused ? (
                <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold border border-yellow-500/30">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  PAUSADO
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-gray-500/20 text-gray-400 px-4 py-2 rounded-full text-sm font-bold border border-gray-500/30">
                  DETENIDO
                </div>
              )}
            </div>

            {/* Display de tiempo */}
            <div className="flex items-center justify-center gap-1 mb-2 md:gap-2">
              <div className="text-center">
                <div className="text-4xl font-bold text-white tracking-wider font-mono md:text-6xl">
                  {formattedTime.hours}
                </div>
                <div className="text-xs text-gray-400 font-semibold mt-1">HORAS</div>
              </div>
              <div className="text-3xl text-gray-500 font-bold md:text-5xl">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white tracking-wider font-mono md:text-6xl">
                  {formattedTime.minutes}
                </div>
                <div className="text-xs text-gray-400 font-semibold mt-1">MINUTOS</div>
              </div>
              <div className="text-3xl text-gray-500 font-bold md:text-5xl">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white tracking-wider font-mono md:text-6xl">
                  {formattedTime.seconds}
                </div>
                <div className="text-xs text-gray-400 font-semibold mt-1">SEGUNDOS</div>
              </div>
            </div>
            
            {/* Tiempo decimal */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-gray-400 text-xs font-semibold mb-1 md:text-sm">TIEMPO TOTAL</div>
              <div className="text-xl font-bold text-blue-400 md:text-2xl">
                {(time / 3600).toFixed(2)} horas
              </div>
            </div>
          </div>
        </div>

        {/* Controles principales */}
        <div className="grid grid-cols-2 gap-3 mb-4 md:gap-4 md:mb-6">
          {!isRunning ? (
            <button
              onClick={start}
              className="col-span-2 btn-success py-4 text-base flex items-center justify-center gap-3 shadow-xl active:scale-95 md:py-5 md:text-lg"
            >
              <Play className="w-6 h-6" />
              Iniciar
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button
                  onClick={pause}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 md:py-5"
                >
                  <Pause className="w-6 h-6" />
                  <span className="hidden sm:inline">Pausar</span>
                </button>
              ) : (
                <button
                  onClick={resume}
                  className="btn-success py-4 flex items-center justify-center gap-2 active:scale-95 md:py-5"
                >
                  <Play className="w-6 h-6" />
                  <span className="hidden sm:inline">Reanudar</span>
                </button>
              )}
              <button
                onClick={stop}
                className="btn-danger py-4 flex items-center justify-center gap-2 active:scale-95 md:py-5"
              >
                <Square className="w-6 h-6" />
                <span className="hidden sm:inline">Detener</span>
              </button>
            </>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={reset}
            disabled={time === 0}
            className={`flex-1 px-5 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 ${
              time === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700 shadow-lg hover:shadow-xl hover-lift'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
          <button
            onClick={handleSave}
            disabled={time === 0}
            className={`flex-1 px-5 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 ${
              time === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'btn-primary shadow-lg hover:shadow-xl'
            }`}
          >
            <Save className="w-5 h-5" />
            <span className="hidden sm:inline">Guardar</span>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-medium">
            <span className="font-bold">💡 Consejo:</span> El cronómetro sigue funcionando aunque cambies de vista o apagues la pantalla.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;