import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import axios from "axios";
import { authService } from "@/services/authService";
import KuInput from "@/components/form/KuInput";
import KuButton from "@/components/form/KuButton";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Erro ao solicitar redefinição de senha."
        );
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Esqueceu sua Senha?
      </h1>
      {!success ? (
        <>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Digite seu email abaixo e enviaremos um link para redefinir sua
            senha.
          </p>
          {error && <Alert color="failure">{error}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <KuInput
              type="input"
              name="email"
              label="Email"
              dataType="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error && !email ? "Email é obrigatório" : ""}
              isRequired={true}
              placeholder="seu@email.com"
            />
            <KuButton
              id="forgot-password-button"
              type="button"
              label={loading ? "Enviando..." : "Enviar Email de Redefinição"}
              actionType="submit"
              isDisabled={loading || !email}
              customClass="w-full"
            />
          </form>
        </>
      ) : (
        <Alert color="success">
          Email de redefinição de senha enviado com sucesso! Verifique sua caixa
          de entrada.
        </Alert>
      )}
      <div className="text-sm text-center">
        <Link
          to="/auth/login"
          className="font-medium text-cyan-700 hover:underline dark:text-cyan-500"
        >
          Voltar para o Login
        </Link>
      </div>
    </div>
  );
}
