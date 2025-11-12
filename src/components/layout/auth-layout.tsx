import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KuNavbar } from "@/components/ku-components";

export const AuthLayout = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <KuNavbar />
      <main className="flex-grow flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Outlet />
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} {t("footer.copyright")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};