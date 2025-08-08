import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert } from "flowbite-react";
import axios from "axios";
import { authService } from "@/services/authService";
import KuInput from "@/components/form/KuInput";
import KuButton from "@/components/form/KuButton";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    if (!token) {
      setError("Token de redefinição inválido ou ausente.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.resetPassword(token, password);
      navigate("/auth/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erro ao redefinir a senha.");
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
        Redefinir Senha
      </h1>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Digite sua nova senha abaixo.
      </p>
      {error && <Alert color="failure">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <KuInput
          type="input"
          name="password"
          label="Nova Senha"
          dataType="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isRequired={true}
          placeholder="••••••••"
        />
        <KuInput
          type="input"
          name="confirmPassword"
          label="Confirmar Nova Senha"
          dataType="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isRequired={true}
          placeholder="••••••••"
        />
        <KuButton
          id="reset-password-button"
          type="button"
          label={loading ? "Redefinindo..." : "Redefinir Senha"}
          actionType="submit"
          isDisabled={loading || !password || !confirmPassword}
          customClass="w-full"
        />
      </form>
    </div>
  );
}
