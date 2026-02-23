import React from "react";
import { authLogin, getAuthMe } from "../../lib/api";
import { saveToken, clearToken, getToken } from "../../lib/auth";
import { showSuccess, showError } from "../lib/toast";

const ADMIN_ROLES = ["SuperAdmin", "InstitutionAdmin", "Principal", "Teacher"];

type RoleAssignment = { role_name: string; institution_id?: number | null };

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  /** True when token exists but user profile (roles) not yet loaded */
  userLoading: boolean;
  isAdmin: boolean;
  roles: string[];
  /** Institution IDs the user can access (from role assignments). Empty for SuperAdmin (global). */
  accessibleInstitutionIds: number[];
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

  const roles = React.useMemo(() => (user?.roles && Array.isArray(user.roles) ? user.roles : []), [user]);
  const isAdmin = React.useMemo(
    () => roles.some((r) => ADMIN_ROLES.includes(r)),
    [roles],
  );
  const accessibleInstitutionIds = React.useMemo(() => {
    const ra = user?.role_assignments as RoleAssignment[] | undefined;
    if (!ra || !Array.isArray(ra)) return [];
    const ids = new Set<number>();
    for (const r of ra) {
      if (r.institution_id != null) ids.add(r.institution_id);
    }
    return Array.from(ids);
  }, [user]);
  const userLoading = !!token && user === null;

  const value = React.useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      loading,
      userLoading,
      isAdmin,
      roles,
      accessibleInstitutionIds,
      login,
      logout,
      user,
    }),
    [token, loading, userLoading, login, logout, user, isAdmin, roles, accessibleInstitutionIds],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

