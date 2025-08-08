import { useAuth } from "@/hooks/useAuth";
import KuButton from "@/components/form/KuButton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { profileService } from "@/services/profileService";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      if (isAuthenticated) {
        try {
          const profiles = await profileService.checkUserProfiles();
          if (!profiles.hasPerson && !profiles.hasCompany) {
            navigate("/profile/select");
          }
        } catch (error) {
          console.error("Failed to check user profiles on home page:", error);
        }
      }
    };

    checkProfile();
  }, [isAuthenticated, navigate]);

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Gerenciamento de Perfis com Autenticação Segura
      </h1>
      <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
        Uma plataforma completa para gerenciar perfis de pessoas e empresas, com
        autenticação multi-provider e controle de funções.
      </p>
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        {isAuthenticated ? (
          <KuButton
            id="go-to-dashboard"
            type="button"
            actionType="link"
            href="/dashboard"
            size="xl"
            label="Ir para o Dashboard"
          />
        ) : (
          <>
            <KuButton
              id="login-home"
              type="button"
              actionType="link"
              href="/auth/login"
              size="xl"
              label="Entrar na plataforma"
            />
            <KuButton
              id="register-home"
              type="button"
              actionType="link"
              href="/auth/register"
              size="xl"
              variant="secondary"
              label="Criar uma conta"
            />
          </>
        )}
      </div>
    </div>
  );
}
