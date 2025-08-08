import { useState, useCallback } from "react";
import { ToastContext } from "./ToastContext";
import { Toast, ToastType } from "@/models/toast";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType, timeout = 5000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      const newToast: Toast = { id, message, type, timeout };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      if (timeout > 0) {
        setTimeout(() => {
          removeToast(id);
        }, timeout);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
