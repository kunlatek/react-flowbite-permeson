export interface AuthUser {
  userId: string;
  email: string;
  activeRole: string | null;
  availableRoles: string[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  setSession: (accessToken: string) => AuthUser;
  loading: boolean;
  error: string | null;
  logout: () => void;
  switchRole: (role: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
}
