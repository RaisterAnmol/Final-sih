import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { User, UserRole } from "../types";

const DEFAULT_AUDITOR_USER: User = {
  id: "usr-auditor",
  name: "Priya Iyer (Senior Audit Officer)",
  email: "auditor@mplad-insight.demo",
  role: "AUDITOR",
  department: "Principal Directorate of Audit (Central)",
  designation: "Senior Audit Officer (CAG Nominee)",
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem("mplad_user");
      return cached ? JSON.parse(cached) : DEFAULT_AUDITOR_USER;
    } catch {
      return DEFAULT_AUDITOR_USER;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("mplad_auth_token") || "demo_jwt_auditor";
  });

  const [loading, setLoading] = useState<boolean>(false);
  const hasSyncedRef = React.useRef(false);

  useEffect(() => {
    if (hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    async function syncBackendSession() {
      try {
        const storedToken = localStorage.getItem("mplad_auth_token");
        if (storedToken && storedToken.startsWith("eyJ")) {
          const res = await api.get("/auth/me");
          if (res.data?.data?.user) {
            setUser(res.data.data.user);
            localStorage.setItem("mplad_user", JSON.stringify(res.data.data.user));
            return;
          }
        }

        // Connect with backend to get live JWT token for active user email
        const targetEmail = user?.email || "auditor@mplad-insight.demo";
        const loginRes = await api.post("/auth/login", {
          email: targetEmail,
          password: "Demo@12345",
        });

        if (loginRes.data?.data?.token) {
          const { token: jwtToken, user: userData } = loginRes.data.data;
          setToken(jwtToken);
          setUser(userData);
          localStorage.setItem("mplad_auth_token", jwtToken);
          localStorage.setItem("mplad_user", JSON.stringify(userData));
        }
      } catch (e) {
        // Backend offline or starting — preserve local state seamlessly
        console.debug("Backend session sync deferred:", e);
      }
    }

    syncBackendSession();
  }, []);

  const login = async (email: string, password = "Demo@12345") => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Determine persona role
    let targetRole: UserRole = "AUDITOR";
    let personaName = "Audit Nodal Officer";
    let dept = "Principal Directorate of Audit (Central)";

    if (normalizedEmail.includes("admin")) {
      targetRole = "ADMIN";
      personaName = "Dr. Rajesh Sharma (Director General)";
      dept = "Ministry of Statistics and Programme Implementation";
    } else if (normalizedEmail.includes("analyst")) {
      targetRole = "ANALYST";
      personaName = "Vikram Singh (Data Science Lead)";
      dept = "National Informatics Centre / MoSPI Analytics";
    } else if (normalizedEmail.includes("viewer")) {
      targetRole = "VIEWER";
      personaName = "Ananya Deshmukh (Public Observer)";
      dept = "Citizen & Parliamentary Oversight Cell";
    }

    const fallbackUser: User = {
      id: `usr-${targetRole.toLowerCase()}`,
      name: personaName,
      email: normalizedEmail,
      role: targetRole,
      department: dept,
      designation: targetRole === "ADMIN" ? "Director General (MoSPI)" : "Officer",
    };

    try {
      const res = await api.post("/auth/login", { email: normalizedEmail, password });
      if (res.data?.data?.token) {
        const { token: jwtToken, user: userData } = res.data.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem("mplad_auth_token", jwtToken);
        localStorage.setItem("mplad_user", JSON.stringify(userData));
        return;
      }
    } catch {
      // Offline fallback
    }

    // Immediate guaranteed local authentication
    const mockToken = `demo_jwt_token_${targetRole.toLowerCase()}`;
    setToken(mockToken);
    setUser(fallbackUser);
    localStorage.setItem("mplad_auth_token", mockToken);
    localStorage.setItem("mplad_user", JSON.stringify(fallbackUser));
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(DEFAULT_AUDITOR_USER);
    setToken("demo_jwt_auditor");
    localStorage.setItem("mplad_user", JSON.stringify(DEFAULT_AUDITOR_USER));
    localStorage.setItem("mplad_auth_token", "demo_jwt_auditor");
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
