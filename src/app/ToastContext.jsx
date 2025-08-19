import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, [removeToast]);

  const showSuccess = useCallback((message, duration) => {
    return showToast(message, "success", duration);
  }, [showToast]);

  const showError = useCallback((message, duration) => {
    return showToast(message, "error", duration);
  }, [showToast]);

  const showInfo = useCallback((message, duration) => {
    return showToast(message, "info", duration);
  }, [showToast]);

  const value = {
    showToast,
    showSuccess,
    showError,
    showInfo,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Render toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={0} // We handle duration manually in the context
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
