import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  Home,
  UserCheck,
  AlertTriangle,
  KeyRound,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, switchDemoRole } = useAuth();

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0B0F17] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col font-sans selection:bg-[#1F2A5A] selection:text-white transition-colors">
      {/* Top Bar */}
      <header className="border-b border-[#D9DEE7] dark:border-slate-800 bg-white dark:bg-[#0F141F] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-md bg-[#1F2A5A] text-[#F59E0B] flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-[#1F2A5A] dark:text-blue-400 uppercase tracking-wider">
                भारत सरकार // GOVERNMENT OF INDIA
              </div>
              <div className="text-base font-extrabold text-[#1F2A5A] dark:text-white tracking-tight leading-tight">
                MPLADS Insight
              </div>
            </div>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            SECURITY: 403 FORBIDDEN
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full text-center space-y-8 my-auto">
          {/* Animated Security Clearance Emblem */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
            {/* Hexagonal / Octagonal glowing boundary */}
            <motion.div
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-3xl border-2 border-dashed border-rose-400/40 dark:border-rose-600/40"
            />

            {/* Pulsing security boundary */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-3 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-800"
            />

            {/* Laser scanning line across shield */}
            <motion.div
              animate={{ y: [-45, 45, -45] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-36 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent z-20 shadow-[0_0_12px_rgba(244,63,94,0.8)]"
            />

            {/* Center Lock Badge */}
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-28 h-28 rounded-2xl bg-white dark:bg-[#131823] border-2 border-rose-200 dark:border-rose-800 shadow-xl flex flex-col items-center justify-center"
            >
              <Lock className="w-10 h-10 text-rose-600 dark:text-rose-400 mb-1" />
              <div className="text-2xl font-black font-mono text-rose-700 dark:text-rose-400">
                403
              </div>
              <div className="text-[9px] font-mono font-bold text-[#5B6472] dark:text-slate-400 tracking-wider">
                RESTRICTED
              </div>
            </motion.div>
          </div>

          {/* Text Section */}
          <div className="space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>STATUTORY AUDIT CLEARANCE INSUFFICIENT</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2A5A] dark:text-white tracking-tight">
              Access Restricted Under Governance Rules
            </h1>

            <p className="text-sm text-[#5B6472] dark:text-slate-300 leading-relaxed">
              This operational section requires privileged role authorization (such as{" "}
              <strong className="text-slate-800 dark:text-white">Auditor</strong> or{" "}
              <strong className="text-slate-800 dark:text-white">Administrator</strong>).
              Your current session role is{" "}
              <code className="px-2 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-800 font-mono text-xs font-bold text-[#1F2A5A] dark:text-blue-300">
                {user?.role || "ANONYMOUS"}
              </code>
              .
            </p>
          </div>

          {/* 1-Click Role Switcher for SIH Presentation */}
          <div className="p-4 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 max-w-lg mx-auto shadow-xs text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase text-[#5B6472] dark:text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                SIH Prototype Elevation Console
              </span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-xs font-mono font-bold">
                1-Click Role
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={async () => {
                  await switchDemoRole("AUDITOR");
                  navigate("/dashboard");
                }}
                className="p-2.5 rounded-sm border border-slate-200 dark:border-slate-700 hover:border-[#1F2A5A] hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-left"
              >
                <div className="text-xs font-bold text-[#1F2A5A] dark:text-white">
                  Auditor Officer
                </div>
                <div className="text-[10px] text-[#5B6472] dark:text-slate-400">
                  CAG forensic clearance
                </div>
              </button>

              <button
                onClick={async () => {
                  await switchDemoRole("ADMIN");
                  navigate("/dashboard");
                }}
                className="p-2.5 rounded-sm border border-slate-200 dark:border-slate-700 hover:border-[#1F2A5A] hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-left"
              >
                <div className="text-xs font-bold text-[#1F2A5A] dark:text-white">
                  Administrator
                </div>
                <div className="text-[10px] text-[#5B6472] dark:text-slate-400">
                  MoSPI Director General
                </div>
              </button>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#1F2A5A] text-white text-xs font-bold hover:bg-[#162044] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Dashboard</span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sign In with Other Account</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 border-t border-[#D9DEE7] dark:border-slate-800 bg-white dark:bg-[#0F141F] text-center text-xs text-[#5B6472] dark:text-slate-400 font-mono">
        Ministry of Statistics & Programme Implementation • Statutory Access Security
      </footer>
    </div>
  );
};
