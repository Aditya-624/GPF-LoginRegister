import React, { useState, useEffect } from 'react';
import './NotificationToast.css';

export default function NotificationToast({ 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose,
  position = 'top-right'
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': 
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`notification-toast ${type} ${position} ${isExiting ? 'exiting' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={handleClose} aria-label="Close notification">
          ×
        </button>
      </div>
      <div className="toast-progress">
        <div className="progress-bar" style={{ animationDuration: `${duration}ms` }}></div>
      </div>
    </div>
  );
}

// Toast container component for managing multiple toasts
export function ToastContainer({ toasts = [], removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <NotificationToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}