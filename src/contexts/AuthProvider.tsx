import {
  useState,
  useEffect,
  type ReactNode,
  type FC,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { type AuthUser } from "@/models/auth";
import { authService } from "@/services/authService";
import { browser } from "@/utils/browser";
import { AuthContext } from "./AuthContext";

interface JwtPayload {
  sub: string;
  email: string;
  activeRole?: string;
  availableRoles?: string[];
  exp: number;
}

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (browser) {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          const decodedToken = jwtDecode<JwtPayload>(storedToken);
          if (decodedToken.exp * 1000 > Date.now()) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            localStorage.clear();
          }
        }
      } catch (e) {
        console.error("Failed to initialize auth state from storage", e);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const setSession = (accessToken: string): AuthUser => {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    const userData: AuthUser = {
      userId: decoded.sub,
      email: decoded.email,
      activeRole: decoded.activeRole || null,
      availableRoles: decoded.availableRoles || [],
    };

    if (browser) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
    }

    setToken(accessToken);
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);
    return userData;
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      return setSession(data.access_token);
    } catch (err: unknown) {
      let errorMessage = "Login failed";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (browser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const switchRole = useCallback(async (role: string) => {
    try {
      const data = await authService.switchRole(role);
      if (data && data.access_token) {
        setSession(data.access_token);
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to switch role", err);
    }
  }, []);

  const value = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    setSession,
    switchRole,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
