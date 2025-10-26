import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth-context';
import type { AuthContextType, AuthUser } from '@/models/auth';
import { login as loginApi } from '@/modules/login/api/login';
import { useToast } from '@/hooks/use-toast';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const toast = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        
        if (storedUser) {
          // Use stored user data
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } else {
          // Fallback to mock user data
          const mockUser: AuthUser = {
            userId: '1',
            email: 'user@example.com',
            activeRole: 'person',
            availableRoles: ['person', 'company']
          };
          setUser(mockUser);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const setSession = (accessToken: string, userEmail?: string): AuthUser => {
    // Save token to localStorage
    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    setIsAuthenticated(true);
    
    localStorage.removeItem('selectedWorkspaceId');
    
    // Create user data with email from login or fallback to mock
    const userData: AuthUser = {
      userId: '1',
      email: userEmail || 'user@example.com',
      activeRole: 'person',
      availableRoles: ['person', 'company']
    };
    
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    setUser(userData);
    setError(null);
    
    return userData;
  };

  const updateToken = (accessToken: string) => {
    // Update only the token without changing user data
    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedWorkspaceId');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
    
    // Redirect to home
    navigate('/');
    
    toast.success('Logout realizado com sucesso!');
  };

  const switchRole = (role: string) => {
    if (user) {
      setUser({
        ...user,
        activeRole: role
      });
      toast.success(`Papel alterado para: ${role === 'company' ? 'Empresa' : 'Pessoa'}`);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await loginApi(email, password);
      
      if (response.statusCode === 200 && response.data?.access_token) {
        const user = setSession(response.data.access_token, email);
        toast.success(response.message || 'Login realizado com sucesso!');
        navigate('/dashboard');
        return true;
      } else {
        throw new Error(response.message || 'Erro no login');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao fazer login';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    setSession,
    updateToken,
    loading,
    error,
    logout,
    switchRole,
    login
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
