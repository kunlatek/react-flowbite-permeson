import { Alert } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import KuInput from "@/components/form/KuInput";
import KuButton from "@/components/form/KuButton";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);
    setErrorMessage("");
    
    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (!success) {
        setErrorMessage("Credenciais inválidas");
      }
    } catch (error) {
      setErrorMessage("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
      <div className="flex flex-col items-center">
        <img src="/src/assets/images/logo.png" alt="Logo" className="h-16 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("login.title")}
        </h2>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <KuInput
            name="email"
            type="input"
            dataType="email"
            label={t("login.email_label")}
            placeholder={t("login.email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired={true}
            isDisabled={loading}
          />

          <KuInput
            name="password"
            type="input"
            dataType="password"
            label={t("login.password_label")}
            placeholder={t("login.password_placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired={true}
            isDisabled={loading}
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
            label={loading ? t("login.submit_loading") : t("login.submit_button")}
            isDisabled={loading || !email || !password}
            customClass="w-full"
          />

          <div className="text-sm text-center mt-6">
            <p className="text-gray-500 dark:text-gray-400">
              {t("login.no_account")}{" "}
              <a
                href="/auth/register"
                className="font-medium text-cyan-700 hover:underline dark:text-cyan-500"
              >
                {t("login.create_account")}
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
