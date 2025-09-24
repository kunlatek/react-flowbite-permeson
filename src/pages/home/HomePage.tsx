import { useAuth } from "@/hooks/useAuth";
import KuButton from "@/components/form/KuButton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { profileService } from "@/services/profileService";

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const checkProfile = async () => {
      if (isAuthenticated && !loading) {
        try {
          // const profiles = await profileService.checkUserProfiles();
          // if (profiles.hasPerson || profiles.hasCompany) {
          //   navigate("/dashboard");
          // } else {
          //   navigate("/profile/select");
          // }
          navigate("/dashboard");
        } catch (error) {
          console.error("Failed to check user profiles on home page:", error);
          // If there's an error, redirect to dashboard anyway
          navigate("/dashboard");
        }
      }
    };

    checkProfile();
  }, [isAuthenticated, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        {t("home.title")}
      </h1>
      <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
        {t("home.description")}
      </p>
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        {isAuthenticated ? (
          <KuButton
            id="go-to-dashboard"
            type="button"
            actionType="link"
            href="/dashboard"
            size="xl"
            label={t("home.go_to_dashboard")}
          />
        ) : (
          <>
            <KuButton
              id="login-home"
              type="button"
              actionType="link"
              href="/auth/login"
              size="xl"
              label={t("home.login_platform")}
            />
            <KuButton
              id="register-home"
              type="button"
              actionType="link"
              href="/auth/pre-register"
              size="xl"
              variant="secondary"
              label={t("home.create_account")}
            />
          </>
        )}
      </div>
    </div>
  );
}
