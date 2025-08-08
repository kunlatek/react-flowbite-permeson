import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileSelectPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const availableRoles = user?.availableRoles || [];
  const canCreatePerson = !availableRoles.includes("person");
  const canCreateCompany = !availableRoles.includes("company");

  useEffect(() => {
    if (!canCreatePerson && !canCreateCompany) {
      navigate("/dashboard");
    }
  }, [canCreatePerson, canCreateCompany, navigate]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Bem-vindo à Plataforma
        </h1>
        <div className="text-gray-700 dark:text-gray-300 mb-8">
          <p>
            Para continuar, você precisa criar pelo menos um perfil na
            plataforma. Escolha uma das opções abaixo:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {canCreatePerson && (
            <Card>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Perfil de Pessoa</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Crie um perfil pessoal com suas informações, contatos e
                  documentos.
                </p>
              </div>
              <Button
                color="blue"
                onClick={() => navigate("/profile/person/new")}
              >
                Criar Perfil de Pessoa
              </Button>
            </Card>
          )}

          {canCreateCompany && (
            <Card>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">
                  Perfil de Empresa
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Crie um perfil empresarial com informações da empresa,
                  contatos e documentos.
                </p>
              </div>
              <Button
                color="blue"
                onClick={() => navigate("/profile/company/new")}
              >
                Criar Perfil de Empresa
              </Button>
            </Card>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Você precisa criar pelo menos um perfil para acessar as
            funcionalidades da plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
