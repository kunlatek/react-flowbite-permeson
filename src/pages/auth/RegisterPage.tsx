import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import axios from "axios";
import { authService } from "@/services/authService";
import KuInput from "@/components/form/KuInput";
import KuButton from "@/components/form/KuButton";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Email é obrigatório");
      setLoading(false);
      return;
    }

    try {
      await authService.registerInit(email);
      setSuccess(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Erro ao enviar email de registro."
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
          Criar nova conta
        </h2>

        {success && (
          <Alert color="success" className="mb-4 w-full">
            Email enviado com sucesso! Verifique sua caixa de entrada para
            continuar o cadastro.
          </Alert>
        )}

        {errorMessage && !loading && (
          <Alert
            color="failure"
            className="mb-4 w-full"
            onDismiss={() => setErrorMessage("")}
          >
            {errorMessage}
          </Alert>
        )}

        {!success && (
          <>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              Digite seu email abaixo e enviaremos um link para completar seu
              cadastro.
            </p>
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <KuInput
                type="input"
                name="email"
                dataType="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errorMessage && !email ? "Email é obrigatório" : ""}
                isRequired={true}
                placeholder="seu@email.com"
              />
              <KuButton
                id="register-button"
                type="button"
                label={loading ? "Enviando..." : "Enviar Email de Cadastro"}
                actionType="submit"
                isDisabled={loading}
                customClass="w-full"
              />
            </form>
          </>
        )}

        <div className="text-sm text-center mt-6">
          <p className="text-gray-500 dark:text-gray-400">
            Já tem uma conta?
            <Link
              to="/auth/login"
              className="font-medium text-cyan-700 hover:underline dark:text-cyan-500 ml-1"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
