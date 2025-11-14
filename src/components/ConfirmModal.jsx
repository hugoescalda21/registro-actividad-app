import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = '¿Estás seguro?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger' // danger, warning, info
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: {
      bg: 'bg-red-500',
      hover: 'hover:bg-red-600',
      icon: 'text-red-600'
    },
    warning: {
      bg: 'bg-yellow-500',
      hover: 'hover:bg-yellow-600',
      icon: 'text-yellow-600'
    },
    info: {
      bg: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      icon: 'text-blue-600'
    }
  };

  const color = colors[type];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Icon */}
        <div className={`w-16 h-16 rounded-full bg-${type === 'danger' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-100 flex items-center justify-center mx-auto mb-4`}>
          <AlertTriangle className={`w-8 h-8 ${color.icon}`} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors active:scale-95"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-6 py-3 ${color.bg} ${color.hover} text-white rounded-xl font-semibold transition-colors active:scale-95 shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;