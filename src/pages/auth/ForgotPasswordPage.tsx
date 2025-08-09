import { Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import { useTranslation } from "react-i18next";
import KuInput from "@/components/form/KuInput";
import KuButton from "@/components/form/KuButton";
import { useForgotPassword } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
      <div className="flex flex-col items-center">
        <img
          src="/src/assets/images/logo.png"
          alt="Logo"
          className="h-16 mb-6"
        />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("forgotPassword.title")}
        </h2>

        {forgotPassword.success && (
          <Alert color="success" className="mb-4 w-full">
            {t("forgotPassword.success_message")}
          </Alert>
        )}

        {!forgotPassword.success && (
          <>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t("forgotPassword.description")}
            </p>
            <form onSubmit={forgotPassword.handleSubmit} className="w-full space-y-4">
              <KuInput
                type="input"
                name="email"
                dataType="email"
                label={t("forgotPassword.email_label")}
                value={forgotPassword.email}
                onChange={(e) => forgotPassword.setEmail(e.target.value)}
                error={forgotPassword.errorMessage && !forgotPassword.email ? t("forgotPassword.email_required") : ""}
                isRequired={true}
                placeholder={t("forgotPassword.email_placeholder")}
                isDisabled={forgotPassword.loading}
              />
              
              <KuButton
                id="forgot-password-button"
                type="button"
                label={forgotPassword.loading ? t("forgotPassword.submit_loading") : t("forgotPassword.submit_button")}
                actionType="submit"
                isDisabled={forgotPassword.loading || !forgotPassword.email}
                customClass="w-full"
              />
            </form>
          </>
        )}

        <div className="text-sm text-center mt-6">
          <p className="text-gray-500 dark:text-gray-400">
            <Link
              to="/auth/login"
              className="font-medium text-cyan-700 hover:underline dark:text-cyan-500"
            >
              {t("forgotPassword.back_to_login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
