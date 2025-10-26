import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export const useHome = () => {
const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      if (isAuthenticated && !loading) {
        try {
          // const profiles = await profileService.checkUserProfiles();
          // if (profiles.hasPerson || profiles.hasCompany) {
          //   navigate("/dashboard");
          // } else {
          //   navigate("/profile/select");
          // }
          navigate("/dashboard");
        } catch (error) {
          console.error("Failed to check user profiles on home page:", error);
          // If there's an error, redirect to dashboard anyway
          navigate("/dashboard");
        }
      }
    };

    checkProfile();
  }, [isAuthenticated, loading, navigate]);

    return { isAuthenticated, loading };
}