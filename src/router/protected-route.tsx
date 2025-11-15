import { KuSpinner } from "@/components/ku-components";
import { useAuth } from "@/hooks/use-auth";
import { Navigate, useLocation, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <KuSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
