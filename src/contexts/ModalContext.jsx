import React, { createContext, useContext, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal debe usarse dentro de un ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    onConfirm: null
  });

  // Función para mostrar modal de confirmación
  const confirm = (message, title = 'Confirmar acción', options = {}) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type: 'confirm',
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        onConfirm: () => resolve(true)
      });
    });
  };

  // Función para mostrar alerta simple
  const alert = (message, title = 'Aviso', type = 'info') => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type,
        confirmText: 'Aceptar',
        cancelText: '',
        onConfirm: () => resolve(true)
      });
    });
  };

  // Función para mostrar alerta de éxito
  const success = (message, title = 'Éxito') => {
    return alert(message, title, 'success');
  };

  // Función para mostrar alerta de error
  const error = (message, title = 'Error') => {
    return alert(message, title, 'error');
  };

  // Función para mostrar alerta de advertencia
  const warning = (message, title = 'Advertencia') => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type: 'warning',
        confirmText: 'Entendido',
        cancelText: 'Cancelar',
        onConfirm: () => resolve(true)
      });
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ confirm, alert, success, error, warning }}>
      {children}
      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
      />
    </ModalContext.Provider>
  );
};
