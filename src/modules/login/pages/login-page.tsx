import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KuInput, KuButton } from "@/components/form";
import { useLogin } from "../hooks/use-login";

export default function LoginPage() {
    const { t } = useTranslation();
    const { email, setEmail, password, setPassword, handleSubmit, loading } = useLogin();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
                <div className="flex flex-col items-center">
                    <img
                        src="/src/assets/images/logo.png"
                        alt="Logo"
                        className="h-16 mb-6"
                    />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {t("login.title", "Acesse sua conta")}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <KuInput
                            name="email"
                            label={t("login.email_label", "Email")}
                            type="input"
                            dataType="email"
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                            isRequired
                        />
                        <KuInput
                            name="password"
                            label={t("login.password_label", "Senha")}
                            type="input"
                            dataType="password"
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                            isRequired
                        />
                        <KuButton
                            label={loading ? t("login.loading", "Entrando...") : t("login.submit_button", "Entrar")}
                            type="button"
                            actionType="submit"
                            isDisabled={loading}
                            customClass="w-full"
                        />
                    </form>

                    <div className="text-sm text-center mt-6">
                        <p className="text-gray-500 dark:text-gray-400">
                            {t("login.no_account", "Não tem uma conta?")}
                            <Link
                                to="/auth/pre-register"
                                className="font-medium text-cyan-700 hover:underline dark:text-cyan-500 ml-1"
                            >
                                {t("login.register_link", "Registre-se")}
                            </Link>
                        </p>
                        <p className="mt-2">
                            <Link
                                to="/auth/forgot-password"
                                className="text-sm text-cyan-700 hover:underline dark:text-cyan-500"
                            >
                                {t("login.forgot_password", "Esqueceu a senha?")}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}