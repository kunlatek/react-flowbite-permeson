// MODIFICATION BASED ON: /Users/opah/Code/personal/kunlatek/rapida/quickstarts/react-flowbite-permeson/src/router/ProtectedRoute.tsx
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import { profileService } from "@/services/profileService";

export default function ProtectedRoute() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isProfileValid, setIsProfileValid] = useState<boolean | null>(null);

  useEffect(() => {
    setIsProfileValid(null);

    if (!authLoading && isAuthenticated) {
      const checkProfile = async () => {
        try {
          const profiles = await profileService.checkUserProfiles();
          if (profiles.hasPerson || profiles.hasCompany) {
            setIsProfileValid(true);
          } else {
            setIsProfileValid(false);
          }
        } catch (error) {
          console.error("Profile check failed in ProtectedRoute:", error);
          setIsProfileValid(false);
        }
      };
      checkProfile();
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || (isAuthenticated && isProfileValid === null)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (isProfileValid === false) {
    return <Navigate to="/profile/select" replace />;
  }

  return <Outlet />;
}
