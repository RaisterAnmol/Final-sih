import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ServerCrash,
  RefreshCw,
  Home,
  Database,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Activity,
  Layers,
} from "lucide-react";

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0B0F17] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col font-sans selection:bg-[#1F2A5A] selection:text-white transition-colors">
      {/* Top Header */}
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
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            TELEMETRY: 500 SERVICE ANOMALY
          </span>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full text-center space-y-8 my-auto">
          {/* Animated Server Node Graphic */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
            {/* Animated network lines connecting nodes */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-amber-400/50 dark:border-amber-500/30"
            />

            {/* Pulsing warning node */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-4 rounded-full bg-amber-500/10 border border-amber-400/40"
            />

            {/* Center Server Core */}
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-28 h-28 rounded-2xl bg-white dark:bg-[#131823] border-2 border-amber-300 dark:border-amber-800/60 shadow-xl flex flex-col items-center justify-center"
            >
              <ServerCrash className="w-10 h-10 text-amber-600 dark:text-amber-400 mb-1" />
              <div className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">
                500
              </div>
              <div className="text-[9px] font-mono font-bold text-[#5B6472] dark:text-slate-400 tracking-wider">
                PIPELINE PAUSE
              </div>
            </motion.div>
          </div>

          {/* Heading & Explanation */}
          <div className="space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Activity className="w-3.5 h-3.5" />
              <span>UPSTREAM COMPUTATION INTERRUPTION</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2A5A] dark:text-white tracking-tight">
              Telemetry Pipeline Interrupted
            </h1>

            <p className="text-sm text-[#5B6472] dark:text-slate-300 leading-relaxed">
              The analytical intelligence gateway encountered an unexpected calculation
              timeout or microservice disconnect. The public-source dataset remains
              secure and accessible.
            </p>
          </div>

          {/* Diagnostic Sub-system Health Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
            <div className="p-3 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-[#5B6472] dark:text-slate-400 font-bold uppercase">
                  Data Layer
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xs font-bold text-[#1F2A5A] dark:text-white">
                Snapshot Cached
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                60,359 Works Ready
              </div>
            </div>

            <div className="p-3 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-[#5B6472] dark:text-slate-400 font-bold uppercase">
                  API Gateway
                </span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xs font-bold text-[#1F2A5A] dark:text-white">
                Re-establishing
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Port 5000 Handshake
              </div>
            </div>

            <div className="p-3 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-[#5B6472] dark:text-slate-400 font-bold uppercase">
                  Frontend Station
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xs font-bold text-[#1F2A5A] dark:text-white">
                Operational
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                React 18 / Vite 6
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#1F2A5A] text-white text-xs font-bold hover:bg-[#162044] transition-colors cursor-pointer shadow-xs disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${retrying ? "animate-spin" : ""}`}
              />
              <span>{retrying ? "Reconnecting..." : "Retry Pipeline Connection"}</span>
            </button>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 border-t border-[#D9DEE7] dark:border-slate-800 bg-white dark:bg-[#0F141F] text-center text-xs text-[#5B6472] dark:text-slate-400 font-mono">
        Ministry of Statistics & Programme Implementation • SIH 2026 Telemetry Node
      </footer>
    </div>
  );
};
