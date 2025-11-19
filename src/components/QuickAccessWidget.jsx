import React, { useState } from 'react';
import { Zap, Plus, Timer, Users, MapPinned, X } from 'lucide-react';

const QuickAccessWidget = ({ onNewActivity, onStopwatch, onReturnVisits, onOutings }) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    {
      icon: <Plus className="w-5 h-5" />,
      label: 'Nueva Actividad',
      color: 'blue',
      onClick: () => { onNewActivity(); setIsOpen(false); }
    },
    {
      icon: <Timer className="w-5 h-5" />,
      label: 'Cronómetro',
      color: 'orange',
      onClick: () => { onStopwatch(); setIsOpen(false); }
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Revisitas',
      color: 'green',
      onClick: () => { onReturnVisits(); setIsOpen(false); }
    },
    {
      icon: <MapPinned className="w-5 h-5" />,
      label: 'Salidas',
      color: 'purple',
      onClick: () => { onOutings(); setIsOpen(false); }
    }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 animate-fadeIn"
        />
      )}

      {/* Menu de acciones */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 space-y-2 animate-slideIn">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-full shadow-lg
                       hover:shadow-xl transition-all active:scale-95 border-2 border-${action.color}-200 dark:border-${action.color}-800`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`p-2 bg-${action.color}-500 rounded-full text-white`}>
                {action.icon}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white pr-2">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 right-4 z-50 p-4 rounded-full shadow-2xl
                   transition-all active:scale-95 ${
          isOpen
            ? 'bg-gray-600 rotate-45'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/50'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Zap className="w-6 h-6 text-white" />
        )}
      </button>
    </>
  );
};

export default QuickAccessWidget;
