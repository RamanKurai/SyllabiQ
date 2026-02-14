import React from "react";
import { authLogin, getAuthMe } from "../../lib/api";
import { saveToken, clearToken, getToken } from "../../lib/auth";
import { showSuccess, showError } from "../lib/toast";

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  // login returns minimal user/profile that can be used immediately by caller
  login: (email: string, password: string) => Promise<Record<string, any> | null>;
  logout: () => void;
  user: Record<string, any> | null;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(() => getToken());
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState<Record<string, any> | null>(null);

  // on mount, if token exists fetch authoritative user profile
  React.useEffect(() => {
    let cancelled = false;
    const t = getToken();
    if (!t) return;
    (async () => {
      try {
        const me = await getAuthMe();
        if (!cancelled) setUser(me);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authLogin({ email, password });
      if (res?.access_token) {
        saveToken(res.access_token);
        setToken(res.access_token);
        // If login response included roles, use them immediately so UI can redirect
        if (res.roles && Array.isArray(res.roles)) {
          const minimal = { email, roles: res.roles };
          setUser(minimal);
          showSuccess("Signed in successfully.");
          // fetch authoritative profile in background
          getAuthMe().then((me) => setUser(me)).catch(() => {});
          return minimal;
        } else {
          try {
            const me = await getAuthMe();
            setUser(me);
            showSuccess("Signed in successfully.");
            return me;
          } catch {
            // fallback to token decode minimal info
            const fallback = { email };
            setUser(fallback);
            return fallback;
          }
        }
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

