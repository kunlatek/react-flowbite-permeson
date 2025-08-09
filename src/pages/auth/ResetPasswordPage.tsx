import { useParams, useNavigate } from "react-router-dom";
import { Alert } from "flowbite-react";
import { useTranslation } from "react-i18next";
import KuInput from "@/components/form/KuInput";
import KuButton from "@/components/form/KuButton";
import { useResetPassword } from "@/hooks/useAuth";

export default function ResetPasswordPage() {
  const resetPassword = useResetPassword();
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Validation helpers
  const passwordLength = resetPassword.password.length >= 8;
  const passwordsMatch = resetPassword.password === resetPassword.confirmPassword;
  const formIsValid = 
    resetPassword.password && 
    resetPassword.confirmPassword && 
    passwordLength && 
    passwordsMatch;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!token) {
      return;
    }
    
    const success = await resetPassword.handleSubmit(event, token);
    if (success) {
      // Redirect to login after successful password reset
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    }
  };

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
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <KuInput
                type="input"
                name="password"
                dataType="password"
                label={t("resetPassword.password_label")}
                value={resetPassword.password}
                onChange={(e) => resetPassword.setPassword(e.target.value)}
                error={
                  resetPassword.password && !passwordLength 
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
                type="input"
                name="confirmPassword"
                dataType="password"
                label={t("resetPassword.confirm_password_label")}
                value={resetPassword.confirmPassword}
                onChange={(e) => resetPassword.setConfirmPassword(e.target.value)}
                error={
                  resetPassword.confirmPassword && !passwordsMatch 
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
                isDisabled={resetPassword.loading || !formIsValid || !token}
                customClass="w-full"
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
}
