import React from "react";
import { authLogin } from "../../lib/api";
import { saveToken, clearToken, getToken, decodeJwt } from "../../lib/auth";

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: Record<string, any> | null;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(() => getToken());
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState<Record<string, any> | null>(() => {
    const t = getToken();
    return t ? decodeJwt(t) : null;
  });

  const login = React.useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authLogin({ email, password });
      if (res?.access_token) {
        saveToken(res.access_token);
        setToken(res.access_token);
        setUser(decodeJwt(res.access_token));
      } else {
        throw new Error("No token received");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = React.useCallback(() => {
    clearToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
      user,
    }),
    [token, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

