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
    if (time > 0) {
      const hours = time / 3600;
      onSave(hours);
    }
  };

  return (
    <div className="card-gradient p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/50"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">⏱️</span>
            Cronómetro
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 mb-8 shadow-2xl border-4 border-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex flex-col items-center">
                <div className="text-6xl font-bold text-white tracking-wider font-mono">
                  {formattedTime.hours}
                </div>
                <div className="text-xs text-gray-400 font-semibold mt-1">HORAS</div>
              </div>
              <div className="text-5xl text-gray-500 font-bold">:</div>
              <div className="flex flex-col items-center">
                <div className="text-6xl font-bold text-white tracking-wider font-mono">
                  {formattedTime.minutes}
                </div>
                <div className="text-xs text-gray-400 font-semibold mt-1">MINUTOS</div>
              </div>
              <div className="text-5xl text-gray-500 font-bold">:</div>
              <div className="flex flex-col items-center">
                <div className="text-6xl font-bold text-white tracking-wider font-mono">
                  {formattedTime.seconds}
                </div>
                <div className="text-xs text-gray-400 font-semibold mt-1">SEGUNDOS</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-gray-400 text-sm font-semibold mb-1">TIEMPO TOTAL</div>
              <div className="text-2xl font-bold text-blue-400">
                {(time / 3600).toFixed(2)} horas
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {!isRunning ? (
            <button
              onClick={start}
              className="col-span-2 btn-success py-5 text-lg flex items-center justify-center gap-3 shadow-xl"
            >
              <Play className="w-6 h-6" />
              Iniciar
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button
                  onClick={pause}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Pause className="w-6 h-6" />
                  Pausar
                </button>
              ) : (
                <button
                  onClick={resume}
                  className="btn-success py-5 flex items-center justify-center gap-2"
                >
                  <Play className="w-6 h-6" />
                  Reanudar
                </button>
              )}
              <button
                onClick={stop}
                className="btn-danger py-5 flex items-center justify-center gap-2"
              >
                <Square className="w-6 h-6" />
                Detener
              </button>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            disabled={time === 0}
            className={`flex-1 px-5 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              time === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700 shadow-lg hover:shadow-xl hover-lift'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            Reiniciar
          </button>
          <button
            onClick={handleSave}
            disabled={time === 0}
            className={`flex-1 px-5 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              time === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'btn-primary shadow-lg hover:shadow-xl'
            }`}
          >
            <Save className="w-5 h-5" />
            Guardar Tiempo
          </button>
        </div>

        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-medium">
            <span className="font-bold">💡 Consejo:</span> El cronómetro sigue funcionando aunque cambies de pestaña o apagues la pantalla.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;