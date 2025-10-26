import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AuthLayout = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center">
        <Outlet />
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;