import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'confirm' // 'confirm', 'alert', 'success', 'error', 'warning', 'info'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Iconos y colores según el tipo
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'error':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
      default:
        return {
          icon: AlertCircle,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;
  const showCancel = type === 'confirm' || type === 'warning';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={showCancel ? handleCancel : handleConfirm}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
        {/* Header con icono */}
        <div className={`${config.bgColor} p-6 rounded-t-2xl`}>
          <div className="flex items-start gap-4">
            <div className={`${config.iconColor} flex-shrink-0`}>
              <Icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                {title}
              </h3>
            </div>
            {type === 'alert' || type === 'info' ? (
              <button
                onClick={handleConfirm}
                className="p-1 hover:bg-white hover:bg-opacity-30 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Botones */}
        <div className="px-6 pb-6 flex gap-3">
          {showCancel && (
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors active:scale-95"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-3 ${config.buttonColor} text-white font-semibold rounded-xl transition-colors shadow-lg active:scale-95`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
