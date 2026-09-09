import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass,
  ArrowLeft,
  Home,
  FileSearch,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  Layers,
} from "lucide-react";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Generate deterministic incident trace ID based on path
  const incidentRef = `ERR-404-${Math.abs(
    location.pathname.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0),
  )
    .toString(16)
    .toUpperCase()
    .padStart(5, "0")}`;

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0B0F17] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col font-sans selection:bg-[#1F2A5A] selection:text-white transition-colors">
      {/* Top Institutional Header Bar */}
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

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              STATUS: 404 NOT FOUND
            </span>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#1F2A5A] text-white text-xs font-bold hover:bg-[#162044] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl w-full text-center space-y-8 my-auto">
          {/* Animated Telemetry Radar Graphic */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
            {/* Pulsing outer sonar wave 1 */}
            <motion.div
              animate={{ scale: [1, 1.45, 1], opacity: [0.15, 0.45, 0.15] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#1F2A5A] dark:border-blue-500"
            />

            {/* Pulsing outer sonar wave 2 */}
            <motion.div
              animate={{ scale: [1.2, 1.7, 1.2], opacity: [0.08, 0.25, 0.08] }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
              className="absolute inset-0 rounded-full border border-indigo-400 dark:border-indigo-600"
            />

            {/* Rotating Scanning Sweep */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(31, 42, 90, 0.12) 360deg)",
              }}
            />

            {/* Center Core Floating 404 Badge */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white dark:bg-[#131823] border-2 border-[#1F2A5A]/20 dark:border-blue-500/30 shadow-2xl flex flex-col items-center justify-center"
            >
              <Compass className="w-9 h-9 text-[#1F2A5A] dark:text-blue-400 mb-1" />
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#1F2A5A] dark:text-white font-mono">
                404
              </div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-[#5B6472] dark:text-slate-400 font-bold">
                UNRESOLVED
              </div>
            </motion.div>
          </div>

          {/* Heading and Narrative */}
          <div className="space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E8EEF8] dark:bg-blue-950/60 text-[#1F2A5A] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>RESOURCE ROUTE NOT IN 2023–24 SNAPSHOT</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1F2A5A] dark:text-white tracking-tight">
              Parliamentary Register Path Missing
            </h1>

            <p className="text-sm text-[#5B6472] dark:text-slate-300 leading-relaxed">
              The requested MPLADS endpoint or analytical record{" "}
              <code className="px-2 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-800 font-mono text-xs text-[#1F2A5A] dark:text-blue-300 font-bold">
                {location.pathname}
              </code>{" "}
              does not correspond to any indexed civil work, Member of Parliament,
              or verified telemetry dashboard.
            </p>
          </div>

          {/* Search Box to find actual works */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6472] dark:text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 60,359 works or 633 MPs..."
                className="w-full pl-10 pr-24 py-2.5 bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#1F2A5A] dark:focus:ring-blue-500 shadow-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#1F2A5A] text-white text-xs font-bold rounded-xs hover:bg-[#162044] transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2">
            <Link
              to="/dashboard"
              className="p-3.5 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 hover:border-[#1F2A5A] dark:hover:border-blue-400 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-sm bg-blue-50 dark:bg-blue-950 text-[#1F2A5A] dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1F2A5A] dark:text-white">
                  Dashboard
                </div>
                <div className="text-[10px] text-[#5B6472] dark:text-slate-400">
                  Operational console
                </div>
              </div>
            </Link>

            <Link
              to="/projects"
              className="p-3.5 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 hover:border-[#1F2A5A] dark:hover:border-blue-400 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-sm bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileSearch className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1F2A5A] dark:text-white">
                  Works Register
                </div>
                <div className="text-[10px] text-[#5B6472] dark:text-slate-400">
                  60,359 Civil records
                </div>
              </div>
            </Link>

            <Link
              to="/mps"
              className="p-3.5 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 hover:border-[#1F2A5A] dark:hover:border-blue-400 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-sm bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1F2A5A] dark:text-white">
                  MPs Directory
                </div>
                <div className="text-[10px] text-[#5B6472] dark:text-slate-400">
                  633 Parliamentarians
                </div>
              </div>
            </Link>
          </div>

          {/* Diagnostic Metadata Footer */}
          <div className="pt-6 border-t border-[#D9DEE7] dark:border-slate-800 max-w-xl mx-auto flex flex-wrap items-center justify-between text-[11px] font-mono text-[#5B6472] dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Snapshot Ingest: 60,359 Canonical Works</span>
            </div>
            <div className="flex items-center gap-2 mt-1 sm:mt-0">
              <span className="font-bold">Trace Ref:</span>
              <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-xs">
                {incidentRef}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Civic Footer */}
      <footer className="py-4 border-t border-[#D9DEE7] dark:border-slate-800 bg-white dark:bg-[#0F141F] text-center text-xs text-[#5B6472] dark:text-slate-400 font-mono">
        Ministry of Statistics & Programme Implementation • Smart India Hackathon 2026
      </footer>
    </div>
  );
};
