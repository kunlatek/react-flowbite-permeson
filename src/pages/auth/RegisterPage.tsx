import { Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import { useTranslation } from "react-i18next";
import KuInput from "@/components/form/KuInput";
import KuButton from "@/components/form/KuButton";
import { useSignup } from "@/hooks/useAuth";

export default function RegisterPage() {
  const signup = useSignup();
  const { t } = useTranslation();

  // Validation helpers
  const passwordLength = signup.password.length >= 8;
  const passwordsMatch = signup.password === signup.confirmPassword;
  const formIsValid = 
    signup.email && 
    signup.password && 
    signup.confirmPassword && 
    passwordLength && 
    passwordsMatch;

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
      <div className="flex flex-col items-center">
        <img
          src="/src/assets/images/logo.png"
          alt="Logo"
          className="h-16 mb-6"
        />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("register.title")}
        </h2>

        {signup.success && (
          <Alert color="success" className="mb-4 w-full">
            {t("register.success_message")}
          </Alert>
        )}

        {!signup.success && (
          <>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t("register.description")}
            </p>
            <form onSubmit={signup.handleSubmit} className="w-full space-y-4">
              <KuInput
                type="input"
                name="email"
                dataType="email"
                label={t("register.email_label")}
                value={signup.email}
                onChange={(e) => signup.setEmail(e.target.value)}
                error={signup.errorMessage && !signup.email ? t("register.email_required") : ""}
                isRequired={true}
                placeholder={t("register.email_placeholder")}
                isDisabled={signup.loading}
              />
              
              <KuInput
                type="input"
                name="password"
                dataType="password"
                label={t("register.password_label")}
                value={signup.password}
                onChange={(e) => signup.setPassword(e.target.value)}
                error={
                  signup.password && !passwordLength 
                    ? t("register.password_min_length") 
                    : signup.errorMessage && !signup.password 
                    ? t("register.password_required") 
                    : ""
                }
                isRequired={true}
                placeholder={t("register.password_placeholder")}
                isDisabled={signup.loading}
              />
              
              <KuInput
                type="input"
                name="confirmPassword"
                dataType="password"
                label={t("register.confirm_password_label")}
                value={signup.confirmPassword}
                onChange={(e) => signup.setConfirmPassword(e.target.value)}
                error={
                  signup.confirmPassword && !passwordsMatch 
                    ? t("register.passwords_not_match") 
                    : signup.errorMessage && !signup.confirmPassword 
                    ? t("register.confirm_password_required") 
                    : ""
                }
                isRequired={true}
                placeholder={t("register.confirm_password_placeholder")}
                isDisabled={signup.loading}
              />
              
              <KuButton
                id="register-button"
                type="button"
                label={signup.loading ? t("register.submit_loading") : t("register.submit_button")}
                actionType="submit"
                isDisabled={signup.loading || !formIsValid}
                customClass="w-full"
              />
            </form>
          </>
        )}

        <div className="text-sm text-center mt-6">
          <p className="text-gray-500 dark:text-gray-400">
            {t("register.already_have_account")}
            <Link
              to="/auth/login"
              className="font-medium text-cyan-700 hover:underline dark:text-cyan-500 ml-1"
            >
              {t("register.login_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
