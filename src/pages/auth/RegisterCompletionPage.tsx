import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import axios from "axios";
import { userService } from "@/services/userService";
import KuInput from "@/components/form/KuInput";
import KuButton from "@/components/form/KuButton";

export default function RegisterCompletionPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);

    if (!emailParam || !tokenParam) {
      navigate("/auth/register");
    }
  }, [searchParams, navigate]);

  const passwordMatch = password === confirmPassword;
  const passwordLength = password.length >= 8;
  const formIsValid =
    email &&
    password &&
    confirmPassword &&
    passwordMatch &&
    passwordLength &&
    token;

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formIsValid) {
      setErrorMessage("Por favor, verifique os dados do formulário.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      await userService.registerWithToken(email, password, token!);
      navigate("/auth/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Erro ao completar o registro."
        );
      } else {
        setErrorMessage("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
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
          Complete seu cadastro
        </h2>

        {errorMessage && !loading && (
          <Alert
            color="failure"
            className="mb-4 w-full"
            onDismiss={() => setErrorMessage("")}
          >
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleRegister} className="w-full space-y-4">
          <KuInput
            type="input"
            name="email"
            dataType="email"
            label="Email"
            value={email}
            onChange={() => {}}
            isRequired={true}
            isDisabled={true}
          />
          <KuInput
            type="input"
            name="password"
            dataType="password"
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired={true}
            isDisabled={loading}
            error={
              password && !passwordLength
                ? "A senha deve ter pelo menos 8 caracteres"
                : ""
            }
          />
          <KuInput
            type="input"
            name="confirmPassword"
            dataType="password"
            label="Confirmar Senha"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isRequired={true}
            isDisabled={loading}
            error={
              confirmPassword && !passwordMatch ? "As senhas não coincidem" : ""
            }
          />
          <KuButton
            id="register-completion-submit"
            type="button"
            actionType="submit"
            label={loading ? "Registrando..." : "Criar Conta"}
            isDisabled={loading || !formIsValid}
            customClass="w-full"
          />
        </form>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center mt-4">
          Já tem uma conta?
          <Link
            to="/auth/login"
            className="text-cyan-700 hover:underline dark:text-cyan-500 ml-1"
          >
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
