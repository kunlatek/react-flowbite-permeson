import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { Spinner } from "flowbite-react";

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission?: keyof ReturnType<typeof useUserPermissions>['permissions'];
  redirectTo?: string;
}

export default function PermissionGuard({ 
  children, 
  requiredPermission, 
  redirectTo = "/dashboard" 
}: PermissionGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { permissions, loading, isOwner } = useUserPermissions();

  useEffect(() => {
    // Não redirecionar durante o loading
    if (loading) return;

    // Owner sempre tem acesso a tudo
    if (isOwner) return;

    // Se não há permissão requerida, permite acesso
    if (!requiredPermission) return;

    // Verificar se tem a permissão necessária
    const hasPermission = permissions[requiredPermission];
    
    if (!hasPermission) {
      console.warn(`[PermissionGuard] Acesso negado: ${requiredPermission} necessária para ${location.pathname}`);
      navigate(redirectTo, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner, permissions, requiredPermission, location.pathname]);

  // Mostrar loading enquanto carrega permissões
  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        </div>
      </div>
    );
  }

  // Owner sempre tem acesso
  if (isOwner) {
    return <>{children}</>;
  }

  // Se não há permissão requerida, permite acesso
  if (!requiredPermission) {
    return <>{children}</>;
  }

  // Verificar permissão
  const hasPermission = permissions[requiredPermission];
  
  if (!hasPermission) {
    return null; // O useEffect já está redirecionando
  }

  return <>{children}</>;
}
