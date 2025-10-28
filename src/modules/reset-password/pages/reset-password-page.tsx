import { Alert } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { KuInput, KuButton } from "@/components/ku-components";
import { useResetPassword } from "../hooks/use-reset-password";

export default function ResetPasswordPage() {
  const resetPassword = useResetPassword();
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
          {t("resetPassword.title")}
        </h2>

        {resetPassword.success && (
          <Alert color="success" className="mb-4 w-full">
            {t("resetPassword.success_message")}
          </Alert>
        )}

        {!resetPassword.success && (
          <>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t("resetPassword.description")}
            </p>
            <form onSubmit={resetPassword.handleSubmit} className="w-full space-y-4">
              <KuInput
                name="password"
                dataType="password"
                label={t("resetPassword.password_label")}
                value={resetPassword.password}
                onChange={(e) => resetPassword.setPassword(e.target.value)}
                error={
                  resetPassword.password && !resetPassword.passwordLength 
                    ? t("resetPassword.password_min_length") 
                    : resetPassword.errorMessage && !resetPassword.password 
                    ? t("resetPassword.password_required") 
                    : ""
                }
                isRequired={true}
                placeholder={t("resetPassword.password_placeholder")}
                isDisabled={resetPassword.loading}
              />
              
              <KuInput
                name="confirmPassword"
                dataType="password"
                label={t("resetPassword.confirm_password_label")}
                value={resetPassword.confirmPassword}
                onChange={(e) => resetPassword.setConfirmPassword(e.target.value)}
                error={
                  resetPassword.confirmPassword && !resetPassword.passwordsMatch 
                    ? t("resetPassword.passwords_not_match") 
                    : resetPassword.errorMessage && !resetPassword.confirmPassword 
                    ? t("resetPassword.confirm_password_required") 
                    : ""
                }
                isRequired={true}
                placeholder={t("resetPassword.confirm_password_placeholder")}
                isDisabled={resetPassword.loading}
              />
              
              <KuButton
                id="reset-password-button"
                type="button"
                label={resetPassword.loading ? t("resetPassword.submit_loading") : t("resetPassword.submit_button")}
                actionType="submit"
                isDisabled={resetPassword.loading || !resetPassword.formIsValid || !resetPassword.token}
                customClass="w-full"
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
}
