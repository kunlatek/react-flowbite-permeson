import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Spinner } from "flowbite-react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { profileService } from "@/services/profileService";
import KuInput from "@/components/form/KuInput";
import KuButton from "@/components/form/KuButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      const user = await login(email, password);
      toast.success("Login realizado com sucesso!");

      if (user) {
        const profiles = await profileService.checkUserProfiles();
        if (!profiles.hasPerson && !profiles.hasCompany) {
          navigate("/profile/select");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      let errorMessage = "Erro ao fazer login.";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      console.error("Login failed on component level:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center">
          <img src="/src/assets/images/logo.png" alt="Logo" className="h-16 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Entrar na sua conta
          </h2>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <KuInput
              name="email"
              type="input"
              dataType="email"
              label="Email"
              placeholder="nome@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired={true}
              isDisabled={loading}
            />

            <KuInput
              name="password"
              type="input"
              dataType="password"
              label="Senha"
              placeholder="••••••••"
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
                Esqueceu sua senha?
              </a>
            </div>

            <KuButton
              id="login-button"
              type="button"
              actionType="submit"
              label={loading ? "Entrando..." : "Entrar"}
              isDisabled={loading || !email || !password}
              customClass="w-full"
            >
              {loading && <Spinner size="sm" className="mr-3" />}
            </KuButton>

            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
              Não tem uma conta?{" "}
              <a
                href="/auth/register"
                className="text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Criar conta
              </a>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
