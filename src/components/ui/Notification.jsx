import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

const Notification = ({ notification, onRemove }) => {
  useEffect(() => {
    if (notification.autoClose) {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, notification.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.autoClose, notification.duration, onRemove]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getColorClasses = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className={`notification-toast ${getColorClasses()}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="ml-3 flex-1 min-w-0">
          {notification.title && (
            <p className="text-sm font-medium mb-1">
              {notification.title}
            </p>
          )}
          
          <p className="text-sm break-words">
            {notification.message}
          </p>
        </div>

        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => onRemove(notification.id)}
            className="inline-flex rounded-md p-1.5 hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-colors"
          >
            <span className="sr-only">Fechar</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationContainer;

// ✅ ESTILOS CSS PARA NOTIFICAÇÕES CENTRALIZADAS
if (typeof document !== 'undefined' && !document.querySelector('#notification-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'notification-styles';
  styleSheet.innerText = `
    .notification-container {
      position: fixed;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: calc(100vw - 2rem);
      width: 100%;
      max-width: 32rem;
      pointer-events: none;
    }
    
    .notification-toast {
      pointer-events: auto;
      width: 100%;
      max-width: 100%;
      padding: 1rem;
      border-radius: 0.75rem;
      border: 1px solid;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      animation: slideInUp 0.3s ease-out;
      backdrop-filter: blur(8px);
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(100px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    /* ✅ RESPONSIVO - Ajustar em telas pequenas */
    @media (max-width: 640px) {
      .notification-container {
        bottom: 0.5rem;
        left: 0.5rem;
        right: 0.5rem;
        transform: none;
        max-width: none;
        width: auto;
      }
      
      .notification-toast {
        font-size: 0.875rem;
        padding: 0.875rem;
      }
    }
    
    /* ✅ Garantir que apareça sobre modais */
    .notification-container {
      z-index: 10000 !important;
    }
  `;
  document.head.appendChild(styleSheet);
}