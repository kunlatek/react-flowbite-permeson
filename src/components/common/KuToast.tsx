import { useContext } from "react";
import { Toast as FlowbiteToast } from "flowbite-react";
import {
  HiCheck,
  HiX,
  HiExclamation,
  HiInformationCircle,
} from "react-icons/hi";
import { ToastContext } from "@/contexts/ToastContext";

const toastConfig = {
  success: { color: "green", icon: HiCheck },
  error: { color: "red", icon: HiX },
  warning: { color: "yellow", icon: HiExclamation },
  info: { color: "blue", icon: HiInformationCircle },
};

export default function KuToast() {
  const context = useContext(ToastContext);

  if (!context) {
    return null;
  }

  const { toasts, removeToast } = context;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];
        const Icon = config.icon;

        return (
          <FlowbiteToast key={toast.id}>
            <div className="mx-3 text-sm font-normal">{toast.message}</div>
            <div
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-${config.color}-100 text-${config.color}-500 dark:bg-${config.color}-800 dark:text-${config.color}-200`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </FlowbiteToast>
        );
      })}
    </div>
  );
}
