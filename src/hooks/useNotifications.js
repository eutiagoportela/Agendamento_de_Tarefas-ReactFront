import { useState } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      autoClose: true,
      duration: 3000,
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const success = (message, title = 'Sucesso!') => 
    addNotification({ 
      type: 'success', 
      title, 
      message,
      duration: 3000,
      autoClose: true
    });

  const error = (message, title = 'Erro!') => 
    addNotification({ 
      type: 'error', 
      title, 
      message, 
      duration: 5000,
      autoClose: true
    });

  const info = (message, title = 'Informação') => 
    addNotification({ 
      type: 'info', 
      title, 
      message,
      duration: 4000,
      autoClose: true
    });

  const warning = (message, title = 'Atenção!') => 
    addNotification({ 
      type: 'warning', 
      title, 
      message,
      duration: 4000,
      autoClose: true
    });

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    info,
    warning
  };
};