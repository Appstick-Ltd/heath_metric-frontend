"use client";

import * as React from "react";
import { AuthService, AdminUser, AuthSession } from "./auth-service";

interface AuthContextType {
  user: AdminUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) {
        setSession(AuthService.getSession());
        setIsLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const login = async (username: string, pass: string) => {
    const res = await AuthService.login(username, pass);
    if (res.success && res.session) {
      setSession(res.session);
    }
    return { success: res.success, error: res.error };
  };

  const logout = () => {
    setSession(null);
    AuthService.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        session,
        isAuthenticated: !!session,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  return React.useContext(AuthContext);
}
