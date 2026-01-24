import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTokenValidation } from "@/hooks/use-token-validation";

export default function DashboardPage() {
  const { t } = useTranslation();
  useTokenValidation();

  useEffect(() => {
    const currentModule = localStorage.getItem('currentModule');
    localStorage.removeItem(`filters_${currentModule}`);
    localStorage.removeItem(`filters_${currentModule}_data`);
    localStorage.setItem('currentModule', 'dashboard');
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            {t("dashboard.welcome_title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("dashboard.welcome_message")}
          </p>
        </div>
      </div>
    </div>
  );
}
