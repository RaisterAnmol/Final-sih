import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  LogIn,
  Sparkles,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Zap,
  Building2,
  Lock,
  Mail,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("auditor@mplad-insight.demo");
  const [password, setPassword] = useState("Demo@12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      // C1 FIX: Display error and stay on login page — do NOT silently bypass authentication
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          "Authentication failed. Please check your credentials and ensure the system is accessible.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (
    role: "ADMIN" | "AUDITOR" | "ANALYST" | "VIEWER",
  ) => {
    setError("");
    setLoading(true);
    try {
      await switchDemoRole(role);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          "Demo login failed. Please ensure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0B0F17] flex flex-col items-center justify-center p-6 text-[#1F2937] dark:text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Institutional Government Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-md bg-[#1F2A5A] text-[#F59E0B] flex items-center justify-center font-bold mx-auto shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold text-[#1F2A5A] dark:text-blue-400 uppercase tracking-wider">
              भारत सरकार // GOVERNMENT OF INDIA
            </div>
            <h1 className="text-2xl font-extrabold text-[#1F2A5A] dark:text-white tracking-tight mt-0.5">
              MPLADS Insight
            </h1>
            <p className="text-xs text-[#5B6472] dark:text-slate-400 font-medium">
              Ministry of Statistics & Programme Implementation (MoSPI)
            </p>
          </div>
        </div>

        {/* 1-Click Quick Persona Sign-in Box */}
        <div className="p-5 bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-md shadow-xs space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-2">
            <div className="text-xs font-bold text-[#1F2A5A] dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>1-Click Persona Sign-In</span>
            </div>
            <span className="text-[10px] text-[#138A45] font-mono font-bold bg-[#138A45]/10 px-2 py-0.5 rounded-sm">
              SIH PROTOTYPE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("AUDITOR")}
              disabled={loading}
              className="p-3 bg-[#F7F8FA] hover:bg-[#1F2A5A] hover:text-white border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-left transition-all group cursor-pointer"
            >
              <div className="text-xs font-bold text-[#1F2A5A] group-hover:text-white flex items-center justify-between">
                <span>Auditor</span>
                <UserCheck className="w-3.5 h-3.5 text-[#1F2A5A] group-hover:text-[#F59E0B]" />
              </div>
              <div className="text-[10px] text-[#5B6472] group-hover:text-white/80 mt-0.5 truncate font-mono">
                auditor@mplad-insight.demo
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("ADMIN")}
              disabled={loading}
              className="p-3 bg-[#F7F8FA] hover:bg-[#1F2A5A] hover:text-white border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-left transition-all group cursor-pointer"
            >
              <div className="text-xs font-bold text-[#1F2A5A] group-hover:text-white flex items-center justify-between">
                <span>Administrator</span>
                <ShieldAlert className="w-3.5 h-3.5 text-[#1F2A5A] group-hover:text-[#F59E0B]" />
              </div>
              <div className="text-[10px] text-[#5B6472] group-hover:text-white/80 mt-0.5 truncate font-mono">
                admin@mplad-insight.demo
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("ANALYST")}
              disabled={loading}
              className="p-3 bg-[#F7F8FA] hover:bg-[#1F2A5A] hover:text-white border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-left transition-all group cursor-pointer"
            >
              <div className="text-xs font-bold text-[#1F2A5A] group-hover:text-white flex items-center justify-between">
                <span>Analyst</span>
                <Sparkles className="w-3.5 h-3.5 text-[#1F2A5A] group-hover:text-[#F59E0B]" />
              </div>
              <div className="text-[10px] text-[#5B6472] group-hover:text-white/80 mt-0.5 truncate font-mono">
                analyst@mplad-insight.demo
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("VIEWER")}
              disabled={loading}
              className="p-3 bg-[#F7F8FA] hover:bg-[#1F2A5A] hover:text-white border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-left transition-all group cursor-pointer"
            >
              <div className="text-xs font-bold text-[#1F2A5A] group-hover:text-white flex items-center justify-between">
                <span>Observer</span>
                <UserCheck className="w-3.5 h-3.5 text-[#1F2A5A] group-hover:text-[#F59E0B]" />
              </div>
              <div className="text-[10px] text-[#5B6472] group-hover:text-white/80 mt-0.5 truncate font-mono">
                viewer@mplad-insight.demo
              </div>
            </button>
          </div>
        </div>

        {/* Manual Credentials Box */}
        <div className="p-5 bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-md shadow-xs space-y-4 text-left">
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2A5A] dark:text-slate-300">
                Official Account Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="auditor@mplad-insight.demo"
                  className="w-full pl-9 pr-3 py-2 bg-[#F7F8FA] dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs text-slate-800 dark:text-white focus:outline-hidden focus:border-[#1F2A5A]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2A5A] dark:text-slate-300">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#F7F8FA] dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs text-slate-800 dark:text-white focus:outline-hidden focus:border-[#1F2A5A]"
                />
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-sm bg-rose-50 border border-rose-200 text-[#B42318] text-[11px] font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1F2A5A] hover:bg-[#172554] text-white rounded-sm text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <LogIn className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{loading ? "Authenticating Session..." : "Sign In to Platform"}</span>
            </button>
          </form>

          <div className="pt-2 border-t border-[#D9DEE7] flex justify-between items-center text-[11px]">
            <Link to="/" className="text-[#1F2A5A] hover:underline font-semibold">
              ← Return to Portal Home
            </Link>
            <Link to="/sources" className="text-[#5B6472] hover:underline font-mono">
              Dataset Sources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
