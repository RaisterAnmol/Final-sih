import React, { useState } from "react";
import {
  Search,
  Bell,
  Sparkles,
  LogOut,
  ShieldCheck,
  UserCheck,
  Sun,
  Moon,
  Activity,
  ChevronDown,
  Zap,
  Globe,
  HelpCircle,
  Eye,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  onOpenDemoModal: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDemoModal,
  onOpenSearch,
}) => {
  const { user, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "larger">("normal");
  const [lang, setLang] = useState<"EN" | "HI">("EN");
  const location = useLocation();

  const handleFontSize = (size: "normal" | "large" | "larger") => {
    setFontSize(size);
    if (size === "normal") document.documentElement.style.fontSize = "16px";
    else if (size === "large") document.documentElement.style.fontSize = "17.5px";
    else if (size === "larger") document.documentElement.style.fontSize = "19px";
  };

  const getPageContext = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "MPLADS Monitoring Dashboard // National Summary";
    if (path.startsWith("/projects")) return "Works Register // Official Public Snapshot";
    if (path.startsWith("/mps")) return "Parliamentary MPs // Directory";
    if (path.startsWith("/anomalies")) return "AI-Assisted Review Signals // Outlier Detection";
    if (path.startsWith("/risk-cases")) return "Administrative Review Inquiries";
    if (path.startsWith("/contractors")) return "Implementing District Authorities (IDA)";
    if (path.startsWith("/geographic")) return "Spatial GIS // District Density Map";
    if (path.startsWith("/analytics/financial")) return "Allocation Analytics // Sector Distribution";
    if (path.startsWith("/analytics/efficiency")) return "Execution Velocity & Timelines";
    if (path.startsWith("/reports")) return "Statutory Reports & Data Exports";
    if (path.startsWith("/data-quality")) return "Data Quality & Completeness Audit";
    if (path.startsWith("/sources") || path.startsWith("/provenance")) return "Data Sources & Ingestion Provenance";
    if (path.startsWith("/alerts")) return "Priority Review Alerts Feed";
    if (path.startsWith("/audit-logs")) return "Forensic Audit Log Trail";
    if (path.startsWith("/settings")) return "Engine Calibration Settings";
    return "MPLADS Platform // Operational View";
  };

  return (
    <div className="flex flex-col select-none border-b border-[#D9DEE7] dark:border-slate-800 bg-white dark:bg-[#0D1016] sticky top-0 z-30 shadow-xs">
      {/* 1. Government Utility Bar */}
      <div className="bg-[#1F2A5A] text-white text-[11px] px-6 py-1 flex items-center justify-between border-b border-[#172554]">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wide">भारत सरकार</span>
          <span className="text-white/40">|</span>
          <span className="font-semibold tracking-wide">GOVERNMENT OF INDIA</span>
          <span className="hidden md:inline text-white/40">|</span>
          <span className="hidden md:inline text-[#F59E0B] font-bold">
            Ministry of Statistics & Programme Implementation (MoSPI)
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono">
          <a
            href="#main-content"
            className="hidden sm:inline hover:underline text-white/80 hover:text-white"
          >
            Skip to Main Content
          </a>
          <span className="text-white/40">|</span>

          {/* Font Size Accessibility Controls */}
          <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded-sm">
            <button
              type="button"
              onClick={() => handleFontSize("normal")}
              className={`px-1 hover:text-[#F59E0B] ${fontSize === "normal" ? "font-bold text-[#F59E0B]" : "text-white/80"}`}
              title="Standard Font Size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => handleFontSize("large")}
              className={`px-1 hover:text-[#F59E0B] ${fontSize === "large" ? "font-bold text-[#F59E0B]" : "text-white/80"}`}
              title="Large Font Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => handleFontSize("larger")}
              className={`px-1 hover:text-[#F59E0B] ${fontSize === "larger" ? "font-bold text-[#F59E0B]" : "text-white/80"}`}
              title="Extra Large Font Size"
            >
              A+
            </button>
          </div>
          <span className="text-white/40">|</span>

          {/* Language Selector */}
          <button
            type="button"
            onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
            className="flex items-center gap-1 hover:text-[#F59E0B] transition-colors"
          >
            <Globe className="w-3 h-3 text-[#F59E0B]" />
            <span className="font-bold">{lang === "EN" ? "English" : "हिन्दी"}</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Navigation / Command Bar */}
      <header className="h-14 px-6 flex items-center justify-between">
        {/* Left: Section Context & SIH Badge */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
            <span className="text-[#1F2A5A] dark:text-blue-400 font-bold text-[10px] uppercase">
              VIEW:
            </span>
            <span className="text-[#1F2A5A] dark:text-slate-200 font-semibold tracking-wide truncate max-w-xs bg-[#F7F8FA] dark:bg-[#151A22] px-2.5 py-1 rounded-sm border border-[#D9DEE7] dark:border-slate-800 text-[11px]">
              {getPageContext()}
            </span>
          </div>

          {/* Global Search Quick Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex-1 flex items-center justify-between px-3.5 py-1.5 bg-[#F7F8FA] dark:bg-[#131823] hover:bg-white dark:hover:bg-[#1A202A] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs text-slate-700 dark:text-slate-300 transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate text-[11px]">Search works, MPs, constituencies, IDAs...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white dark:bg-[#090B0F] text-slate-600 dark:text-slate-400 font-bold rounded-sm border border-[#D9DEE7] dark:border-slate-800">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Command Actions */}
        <div className="flex items-center gap-3">
          {/* Data Sources Link */}
          <Link
            to="/sources"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F8FA] dark:bg-[#131823] hover:bg-slate-100 text-[#1F2A5A] dark:text-slate-300 border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs font-semibold transition-colors"
          >
            <span>Provenance</span>
          </Link>

          {/* Trigger Statistical Analysis Pipeline */}
          <button
            type="button"
            onClick={onOpenDemoModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1F2A5A] hover:bg-[#172554] text-white rounded-sm text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Zap className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
            <span>Run Pipeline</span>
          </button>

          {/* Alerts Bell */}
          <Link
            to="/alerts"
            className="p-1.5 rounded-sm text-slate-700 dark:text-slate-300 hover:bg-[#F7F8FA] border border-[#D9DEE7] dark:border-slate-800 transition-all relative"
            title="Real-Time Alerts Feed"
          >
            <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B42318] ring-2 ring-white dark:ring-[#0D1016]" />
          </Link>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleMenu((prev) => !prev)}
              className="flex items-center gap-2 px-2 py-1 bg-[#F7F8FA] dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs hover:border-[#1F2A5A] transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-sm bg-[#1F2A5A] text-white flex items-center justify-center font-bold text-[9px]">
                {user?.name?.[0] || "A"}
              </div>
              <span className="font-bold text-[#1F2A5A] dark:text-white hidden sm:inline text-xs">
                {user?.name || "Auditor Station"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm shadow-md py-1 z-50 text-left">
                <div className="px-3 py-2 border-b border-[#D9DEE7] dark:border-slate-800">
                  <span className="font-bold text-[#1F2A5A] dark:text-white block text-xs truncate">
                    {user?.name || "Auditor Station"}
                  </span>
                  <span className="text-[10px] text-[#5B6472] block font-mono">
                    {user?.email || "auditor@mplad-insight.demo"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#B42318] hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};
