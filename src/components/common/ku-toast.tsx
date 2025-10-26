import { useContext } from "react";
import { Toast as FlowbiteToast } from "flowbite-react";
import {
  HiCheck,
  HiX,
  HiExclamation,
  HiInformationCircle,
} from "react-icons/hi";
import { ToastContext } from "@/contexts/toast-context";

const toastConfig = {
  success: { 
    icon: HiCheck,
    className: "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
  },
  error: { 
    icon: HiX,
    className: "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
  },
  warning: { 
    icon: HiExclamation,
    className: "bg-yellow-100 text-yellow-500 dark:bg-yellow-800 dark:text-yellow-200"
  },
  info: { 
    icon: HiInformationCircle,
    className: "bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200"
  },
};

export const KuToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    return null;
  }

  const { toasts, removeToast } = context;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 max-w-md w-full px-4">
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];
        const Icon = config.icon;

        return (
          <FlowbiteToast key={toast.id} className="w-full">
            <div className="mx-3 text-sm font-normal">{toast.message}</div>
            <div
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.className}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </FlowbiteToast>
        );
      })}
    </div>
  );
};
