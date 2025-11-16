import React, { useState, useEffect } from 'react';
import { Trophy, X } from 'lucide-react';

const AchievementBadge = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animar entrada
    setTimeout(() => setIsVisible(true), 100);

    // Auto-cerrar después de 5 segundos
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!achievement) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-[90] transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl shadow-2xl p-5 max-w-sm border-4 border-yellow-300 animate-bounce-once">
        <div className="flex items-start gap-3">
          <div className="bg-white rounded-full p-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-1">
              {achievement.title}
            </h3>
            <p className="text-yellow-100 text-sm">
              {achievement.description}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de progreso de cierre */}
        <div className="mt-3 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white animate-achievement-progress"
            style={{ animation: 'achievement-progress 5s linear' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;