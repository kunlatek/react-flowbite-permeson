import { Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import { useTranslation } from "react-i18next";
import {KuInput, KuButton} from "@/components/form";
import { usePreRegister } from "../hooks/use-pre-register";

export default function PreRegisterPage() {
  const preRegister = usePreRegister();
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
          {t("preRegister.title")}
        </h2>

        {preRegister.success && (
          <Alert color="success" className="mb-4 w-full">
            {t("preRegister.success_message")}
          </Alert>
        )}

        {!preRegister.success && (
          <>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t("preRegister.description")}
            </p>
            <form onSubmit={preRegister.handleSubmit} className="w-full space-y-4">
              <KuInput
                type="input"
                name="email"
                dataType="email"
                label={t("preRegister.email_label")}
                value={preRegister.email}
                onChange={(e) => preRegister.setEmail(e.target.value)}
                error={preRegister.errorMessage && !preRegister.email ? t("preRegister.email_required") : ""}
                isRequired={true}
                placeholder={t("preRegister.email_placeholder")}
                isDisabled={preRegister.loading}
              />
              
              <KuButton
                id="pre-register-button"
                type="button"
                label={preRegister.loading ? t("preRegister.submit_loading") : t("preRegister.submit_button")}
                actionType="submit"
                isDisabled={preRegister.loading || !preRegister.formIsValid}
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
