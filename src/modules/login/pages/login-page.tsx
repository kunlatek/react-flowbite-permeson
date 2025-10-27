import { useTranslation } from "react-i18next";
import {KuInput, KuButton} from "@/components/form";
import { useLogin } from "../hooks/use-login";

export default function LoginPage() {
  const login = useLogin();
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
      <div className="flex flex-col items-center">
        <img 
          src="/src/assets/images/logo.png" 
          alt="Logo" 
          className="h-16 mb-6 dark:invert dark:brightness-0 dark:contrast-100"
        />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("login.title")}
        </h2>

        <form onSubmit={login.handleSubmit} className="w-full space-y-4">
          <KuInput
            name="email"
            type="input"
            dataType="email"
            label={t("login.email_label")}
            placeholder={t("login.email_placeholder")}
            value={login.email}
            onChange={(e) => login.setEmail(e.target.value)}
            isRequired={true}
            isDisabled={login.loading}
          />

          <KuInput
            name="password"
            type="input"
            dataType="password"
            label={t("login.password_label")}
            placeholder={t("login.password_placeholder")}
            value={login.password}
            onChange={(e) => login.setPassword(e.target.value)}
            isRequired={true}
            isDisabled={login.loading}
          />

          <div className="flex items-center justify-end mt-2 mb-2">
            <a
              href="/auth/forgot-password"
              className="text-sm text-cyan-700 hover:underline dark:text-cyan-500"
            >
              {t("login.forgot_password")}
            </a>
          </div>


          <KuButton
            id="login-button"
            type="button"
            actionType="submit"
            label={login.loading ? t("login.submit_loading") : t("login.submit_button")}
            isDisabled={login.loading || !login.email || !login.password}
            customClass="w-full"
          />
        </form>
      </div>
    </div>
  );
}
