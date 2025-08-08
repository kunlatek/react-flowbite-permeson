export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  timeout?: number;
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, timeout?: number) => void;
  removeToast: (id: string) => void;
}
