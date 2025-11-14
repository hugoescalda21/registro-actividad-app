import { useState } from 'react';

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'danger'
  });

  const showConfirm = ({ title, message, onConfirm, confirmText, cancelText, type = 'danger' }) => {
    setConfirmState({
      isOpen: true,
      title: title || '¿Estás seguro?',
      message: message || '',
      onConfirm: onConfirm || (() => {}),
      confirmText: confirmText || 'Confirmar',
      cancelText: cancelText || 'Cancelar',
      type
    });
  };

  const closeConfirm = () => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    confirmState,
    showConfirm,
    closeConfirm
  };
};