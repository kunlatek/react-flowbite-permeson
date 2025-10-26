import { createContext } from "react";
import { ToastContextType } from "@/models/toast";

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
