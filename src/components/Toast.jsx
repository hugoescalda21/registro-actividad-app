import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    warning: <AlertCircle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />
  };

  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slideIn">
      <div className={`${styles[type]} rounded-xl shadow-2xl p-4 pr-12 flex items-center gap-3 min-w-[300px] max-w-md backdrop-blur-sm`}>
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <p className="font-semibold text-sm">{message}</p>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;