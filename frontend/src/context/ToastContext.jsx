import { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error'),
    warning: (message) => addToast(message, 'warning'),
    info: (message) => addToast(message, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            <span className="toast-icon">
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✕'}
              {toast.type === 'warning' && '⚠'}
              {toast.type === 'info' && 'ℹ'}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .toast {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          min-width: 320px;
          max-width: 450px;
          animation: slideIn 0.3s ease-out;
          cursor: pointer;
          border-left: 4px solid;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-success {
          border-left-color: #10b981;
        }

        .toast-success .toast-icon {
          color: #10b981;
        }

        .toast-error {
          border-left-color: #ef4444;
        }

        .toast-error .toast-icon {
          color: #ef4444;
        }

        .toast-warning {
          border-left-color: #f59e0b;
        }

        .toast-warning .toast-icon {
          color: #f59e0b;
        }

        .toast-info {
          border-left-color: #3b82f6;
        }

        .toast-info .toast-icon {
          color: #3b82f6;
        }

        .toast-icon {
          font-size: 1.2rem;
          font-weight: bold;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toast-message {
          flex: 1;
          color: #1f2937;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .toast-close:hover {
          color: #4b5563;
        }

        @media (max-width: 576px) {
          .toast-container {
            top: 10px;
            right: 10px;
            left: 10px;
          }

          .toast {
            min-width: auto;
            width: 100%;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
