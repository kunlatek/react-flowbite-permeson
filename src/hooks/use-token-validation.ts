import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/contexts/auth-provider";

export const useTokenValidation = () => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const validateToken = async () => {
      try {
        await api.get("/workspaces/my");
        setIsValidating(false);
      } catch (error: any) {
        if (error.response?.status === 401) {
          logout();
        } else {
          setIsValidating(false);
        }
      }
    };

    validateToken();
  }, [navigate]);

  return { isValidating };
};

