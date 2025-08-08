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
  login: (email: string, password: string) => Promise<AuthUser | undefined>;
  logout: () => void;
  setSession: (accessToken: string) => AuthUser;
  switchRole: (role: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}
