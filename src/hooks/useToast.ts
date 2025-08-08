import { useContext } from "react";
import { ToastContext } from "@/contexts/ToastContext";

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { addToast } = context;

  return {
    success: (message: string, timeout?: number) =>
      addToast(message, "success", timeout),
    error: (message: string, timeout?: number) =>
      addToast(message, "error", timeout),
    warning: (message: string, timeout?: number) =>
      addToast(message, "warning", timeout),
    info: (message: string, timeout?: number) =>
      addToast(message, "info", timeout),
  };
};
