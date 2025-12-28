import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

export const useTokenValidation = () => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await api.get("/workspaces/my");
        setIsValidating(false);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/auth/login", { replace: true });
        } else {
          setIsValidating(false);
        }
      }
    };

    validateToken();
  }, [navigate]);

  return { isValidating };
};

