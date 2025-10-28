import { Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { KuInput, KuButton } from "@/components/ku-components";
import { useRegister } from "../hooks/use-register";

export default function RegisterPage() {
  
  const register = useRegister();
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
          {t("register.title")}
        </h2>

        {register.success && (
          <Alert color="success" className="mb-4 w-full">
            {t("register.success_message")}
          </Alert>
        )}

        {!register.success && (
          <>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t("register.description")}
            </p>
            <form onSubmit={register.handleSubmit} className="w-full space-y-4">
              <KuInput
                name="email"
                dataType="email"
                label={t("register.email_label")}
                value={register.email}
                onChange={(e) => register.setEmail(e.target.value)}
                error={register.errorMessage && !register.email ? t("register.email_required") : ""}
                isRequired={true}
                placeholder={t("register.email_placeholder")}
                isDisabled={true}
              />
              
              <KuInput
                name="password"
                dataType="password"
                label={t("register.password_label")}
                value={register.password}
                onChange={(e) => register.setPassword(e.target.value)}
                error={
                  register.password && !register.passwordLength 
                    ? t("register.password_min_length") 
                    : register.errorMessage && !register.password 
                    ? t("register.password_required") 
                    : ""
                }
                isRequired={true}
                placeholder={t("register.password_placeholder")}
                isDisabled={register.loading}
              />
              
              <KuInput
                name="confirmPassword"
                dataType="password"
                label={t("register.confirm_password_label")}
                value={register.confirmPassword}
                onChange={(e) => register.setConfirmPassword(e.target.value)}
                error={
                  register.confirmPassword && !register.passwordsMatch 
                    ? t("register.passwords_not_match") 
                    : register.errorMessage && !register.confirmPassword 
                    ? t("register.confirm_password_required") 
                    : ""
                }
                isRequired={true}
                placeholder={t("register.confirm_password_placeholder")}
                isDisabled={register.loading}
              />
              
              <KuButton
                id="register-button"
                type="button"
                label={register.loading ? t("register.submit_loading") : t("register.submit_button")}
                actionType="submit"
                isDisabled={register.loading || !register.formIsValid}
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
