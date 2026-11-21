import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { loginRequest, meRequest } from '../services/authService';
import type { AuthUser, RoleName } from '../types/api';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: RoleName[]) => boolean;
  setSession: (token: string, user: AuthUser) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('culturehub_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const current = await meRequest();
        setUser(current);
        localStorage.setItem('culturehub_user', JSON.stringify(current));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [token]);

  const setSession = (nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem('culturehub_token', nextToken);
    localStorage.setItem('culturehub_user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (email: string, password: string) => {
    const auth = await loginRequest(email, password);
    const previousToken = localStorage.getItem('culturehub_token');
    const previousUser = localStorage.getItem('culturehub_user');

    // The Axios interceptor reads the token from localStorage. Store the
    // short-lived candidate session before requesting the current user, but
    // only expose it through React state after /auth/me succeeds.
    localStorage.setItem('culturehub_token', auth.access_token);
    try {
      const current = await meRequest();
      setSession(auth.access_token, current);
      toast.success('Accesso effettuato');
    } catch (error) {
      if (previousToken) {
        localStorage.setItem('culturehub_token', previousToken);
      } else {
        localStorage.removeItem('culturehub_token');
      }
      if (previousUser) {
        try {
          const restoredUser = JSON.parse(previousUser) as AuthUser;
          localStorage.setItem('culturehub_user', previousUser);
          setUser(restoredUser);
        } catch {
          localStorage.removeItem('culturehub_user');
          setUser(null);
        }
      } else {
        localStorage.removeItem('culturehub_user');
        setUser(null);
      }
      setToken(previousToken);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('culturehub_token');
    localStorage.removeItem('culturehub_user');
    setToken(null);
    setUser(null);
  };

  const hasRole = (roles: RoleName[]) => !!user && roles.includes(user.role.name);

  return <AuthContext.Provider value={{ user, token, loading, login, logout, hasRole, setSession }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
