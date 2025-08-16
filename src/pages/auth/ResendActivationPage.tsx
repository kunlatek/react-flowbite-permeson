import { Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import { useTranslation } from "react-i18next";
import KuInput from "@/components/form/KuInput";
import KuButton from "@/components/form/KuButton";
import { useResendActivation } from "@/hooks/useAuth";

export default function ResendActivationPage() {
  const resendActivation = useResendActivation();
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
      <div className="flex flex-col items-center">
        <img src="/src/assets/images/logo.png" alt="Logo" className="h-16 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("resendActivation.title")}
        </h2>

        {resendActivation.success && (
          <Alert color="success" className="mb-4 w-full">
            {t("resendActivation.success_message")}
          </Alert>
        )}

        {!resendActivation.success && (
          <>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t("resendActivation.description")}
            </p>
            <form onSubmit={resendActivation.handleSubmit} className="w-full space-y-4">
              <KuInput
                name="email"
                type="input"
                dataType="email"
                label={t("resendActivation.email_label")}
                placeholder={t("resendActivation.email_placeholder")}
                value={resendActivation.email}
                onChange={(e) => resendActivation.setEmail(e.target.value)}
                isRequired={true}
                isDisabled={resendActivation.loading}
              />

              <KuButton
                id="resend-activation-button"
                type="button"
                actionType="submit"
                label={resendActivation.loading ? t("resendActivation.submit_loading") : t("resendActivation.submit_button")}
                isDisabled={resendActivation.loading || !resendActivation.email}
                customClass="w-full"
              />
            </form>
          </>
        )}

        <div className="text-sm text-center mt-6">
          <p className="text-gray-500 dark:text-gray-400">
            {t("resendActivation.back_to_login")}{" "}
            <Link
              to="/auth/login"
              className="font-medium text-cyan-700 hover:underline dark:text-cyan-500"
            >
              {t("resendActivation.login_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
