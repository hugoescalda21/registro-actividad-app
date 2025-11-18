import React, { createContext, useContext, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const ModalContext = createContext(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal debe ser usado dentro de un ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'info',
    message: '',
    title: '',
    resolve: null
  });

  const showModal = (type, message, title = '') => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type,
        message,
        title,
        resolve
      });
    });
  };

  const handleClose = (result = false) => {
    if (modalState.resolve) {
      modalState.resolve(result);
    }
    setModalState({
      isOpen: false,
      type: 'info',
      message: '',
      title: '',
      resolve: null
    });
  };

  const value = {
    confirm: (message, title = '¿Confirmar?') => showModal('confirm', message, title),
    alert: (message, title = 'Información') => showModal('info', message, title),
    success: (message, title = 'Éxito') => showModal('success', message, title),
    error: (message, title = 'Error') => showModal('error', message, title),
    warning: (message, title = 'Advertencia') => showModal('warning', message, title),
    info: (message, title = 'Información') => showModal('info', message, title)
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modalState.isOpen && (
        <ConfirmModal
          isOpen={modalState.isOpen}
          onConfirm={() => handleClose(true)}
          onCancel={() => handleClose(false)}
          message={modalState.message}
          title={modalState.title}
          type={modalState.type}
        />
      )}
    </ModalContext.Provider>
  );
};