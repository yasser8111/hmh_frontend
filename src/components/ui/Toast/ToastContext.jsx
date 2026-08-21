"use client";

import { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "./ToastContainer";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = "info", title = "", message = "", duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, title, message, duration, createdAt: Date.now() };

    setToasts((prev) => {
      // Keep up to 3 toasts active at once
      const updated = [newToast, ...prev].slice(0, 3);
      return updated;
    });

    return id;
  }, []);

  const toast = {
    success: (title, message, duration) =>
      addToast({ type: "success", title, message, duration }),
    error: (title, message, duration) =>
      addToast({ type: "error", title, message, duration }),
    warning: (title, message, duration) =>
      addToast({ type: "warning", title, message, duration }),
    info: (title, message, duration) =>
      addToast({ type: "info", title, message, duration }),
    dismiss: (id) => removeToast(id),
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}
