import { useAuth } from "@/hooks/use-auth";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { Spinner } from "flowbite-react";

export default function ProtectedRoute() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
