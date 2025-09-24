import { Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import { useTranslation } from "react-i18next";
import KuInput from "@/components/form/KuInput";
import KuButton from "@/components/form/KuButton";
import { usePreSignup } from "@/hooks/useAuth";

export default function PreRegisterPage() {
  const preSignup = usePreSignup();
  const { t } = useTranslation();

  const formIsValid = preSignup.email && preSignup.email.includes('@');

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
      <div className="flex flex-col items-center">
        <img
          src="/src/assets/images/logo.png"
          alt="Logo"
          className="h-16 mb-6"
        />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("preRegister.title")}
        </h2>

        {preSignup.success && (
          <Alert color="success" className="mb-4 w-full">
            {t("preRegister.success_message")}
          </Alert>
        )}

        {!preSignup.success && (
          <>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t("preRegister.description")}
            </p>
            <form onSubmit={preSignup.handleSubmit} className="w-full space-y-4">
              <KuInput
                type="input"
                name="email"
                dataType="email"
                label={t("preRegister.email_label")}
                value={preSignup.email}
                onChange={(e) => preSignup.setEmail(e.target.value)}
                error={preSignup.errorMessage && !preSignup.email ? t("preRegister.email_required") : ""}
                isRequired={true}
                placeholder={t("preRegister.email_placeholder")}
                isDisabled={preSignup.loading}
              />
              
              <KuButton
                id="pre-register-button"
                type="button"
                label={preSignup.loading ? t("preRegister.submit_loading") : t("preRegister.submit_button")}
                actionType="submit"
                isDisabled={preSignup.loading || !formIsValid}
                customClass="w-full"
              />
            </form>
          </>
        )}

        <div className="text-sm text-center mt-6">
          <p className="text-gray-500 dark:text-gray-400">
            {t("preRegister.already_have_account")}
            <Link
              to="/auth/login"
              className="font-medium text-cyan-700 hover:underline dark:text-cyan-500 ml-1"
            >
              {t("preRegister.login_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
