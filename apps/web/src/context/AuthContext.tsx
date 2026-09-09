import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // C1 FIX: Start in unauthenticated state — never auto-login with hardcoded credentials.
  // A governance system must require explicit authentication.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem("mplad_user");
      const storedToken = localStorage.getItem("mplad_auth_token");
      if (cached && storedToken && storedToken.startsWith("eyJ")) {
        return JSON.parse(cached);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem("mplad_auth_token");
    // Only restore real JWTs — reject hardcoded demo tokens
    return stored && stored.startsWith("eyJ") ? stored : null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const hasSyncedRef = React.useRef(false);

  useEffect(() => {
    if (hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    async function syncBackendSession() {
      const storedToken = localStorage.getItem("mplad_auth_token");
      if (!storedToken || !storedToken.startsWith("eyJ")) {
        // Clear any stale demo state from previous sessions
        localStorage.removeItem("mplad_auth_token");
        localStorage.removeItem("mplad_user");
        setUser(null);
        setToken(null);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        if (res.data?.data?.user) {
          setUser(res.data.data.user);
          localStorage.setItem(
            "mplad_user",
            JSON.stringify(res.data.data.user),
          );
        }
      } catch {
        // Token is expired or backend offline — clear stale session
        localStorage.removeItem("mplad_auth_token");
        localStorage.removeItem("mplad_user");
        setUser(null);
        setToken(null);
      }
    }

    syncBackendSession();
  }, []);

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    setLoading(true);
    try {
      // C1 FIX: Login must succeed with real credentials or fail visibly.
      // Never create a mock user on network failure.
      const res = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });
      if (res.data?.data?.token) {
        const { token: jwtToken, user: userData } = res.data.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem("mplad_auth_token", jwtToken);
        localStorage.setItem("mplad_user", JSON.stringify(userData));
      } else {
        throw new Error("Authentication failed: no token returned");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    // C1 FIX: Logout clears to unauthenticated state — not a default demo user
    setUser(null);
    setToken(null);
    localStorage.removeItem("mplad_auth_token");
    localStorage.removeItem("mplad_user");
  };

  const switchDemoRole = async (role: UserRole) => {
    const email = `${role.toLowerCase()}@mplad-insight.demo`;
    await login(email, "Demo@12345");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, switchDemoRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
