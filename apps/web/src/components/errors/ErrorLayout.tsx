import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Home,
  ArrowLeft,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { ErrorProps } from "./types";
import { ErrorAnimation } from "./ErrorAnimation";

export const ErrorLayout: React.FC<ErrorProps> = ({
  type = "404",
  code,
  title,
  subtitle,
  description,
  incidentId,
  resourceId,
  requiredRole,
  userRole,
  cooldownSeconds,
  details,
  actions,
  showSearch = false,
  onRetry,
  className = "",
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  // Generate deterministic incident reference if not provided
  const incidentRef =
    incidentId ||
    `ERR-${type}-${Math.abs(
      (title || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 100),
    )
      .toString(16)
      .toUpperCase()
      .padStart(5, "0")}`;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRetryClick = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    } else {
      setIsRetrying(true);
      setTimeout(() => {
        setIsRetrying(false);
        window.location.reload();
      }, 1000);
    }
  };

  // Status badge styling
  const getStatusBadge = () => {
    switch (type) {
      case "401":
      case "403":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            SECURITY: {code || type}
          </span>
        );
      case "500":
      case "503":
      case "ML_ERROR":
      case "NETWORK":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            TELEMETRY: {code || type}
          </span>
        );
      case "DATA_UNAVAILABLE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            EVIDENCE GAP: 2023–24 SNAPSHOT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            STATUS: {code || type}
          </span>
        );
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#F7F8FA] dark:bg-[#0B0F17] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col font-sans selection:bg-[#1F2A5A] selection:text-white transition-colors ${className}`}
    >
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
            {getStatusBadge()}
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

      {/* Main Content Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full text-center space-y-7 my-auto">
          {/* Animated Graphic Center */}
          <ErrorAnimation type={type} code={code} />

          {/* Titles & Narrative */}
          <div className="space-y-3 max-w-xl mx-auto">
            {subtitle && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E8EEF8] dark:bg-blue-950/60 text-[#1F2A5A] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Info className="w-3.5 h-3.5 text-[#1F2A5A] dark:text-blue-400" />
                <span>{subtitle}</span>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2A5A] dark:text-white tracking-tight">
              {title}
            </h1>

            <p className="text-sm text-[#5B6472] dark:text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Optional Search Bar */}
          {showSearch && (
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
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#1F2A5A] text-white text-xs font-bold rounded-xs hover:bg-[#162044] transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>
          )}

          {/* Details / Evidence Checklist / Clearance Box */}
          {details && details.length > 0 && (
            <div className="max-w-md mx-auto p-4 bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm shadow-xs text-left space-y-2.5">
              <div className="text-[11px] font-mono font-bold text-[#5B6472] dark:text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span>Field Integrity Analysis</span>
                <span>Source Snapshot</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {details.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-0.5">
                    <span className="text-[#5B6472] dark:text-slate-400">
                      {item.label}
                    </span>
                    <span className="font-mono font-bold flex items-center gap-1.5">
                      {item.status === "available" ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 dark:text-emerald-300">
                            {String(item.value)}
                          </span>
                        </>
                      ) : item.status === "unavailable" ? (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span className="text-rose-600 dark:text-rose-400">
                            {String(item.value)}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-700 dark:text-slate-300">
                          {String(item.value)}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RBAC Elevation Card for 403 / 401 */}
          {(type === "403" || type === "401") && (
            <div className="max-w-md mx-auto p-4 bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm shadow-xs text-left space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span className="text-[11px] font-mono font-bold uppercase text-[#5B6472] dark:text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  Statutory Clearance Verification
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  RBAC Level
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-[#5B6472] dark:text-slate-400 font-mono">
                    REQUIRED ROLE
                  </div>
                  <div className="font-bold text-rose-700 dark:text-rose-400 font-mono">
                    {requiredRole || "ADMIN / AUDITOR"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#5B6472] dark:text-slate-400 font-mono">
                    CURRENT PERSONA
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {userRole || "ANONYMOUS"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {actions && actions.length > 0 ? (
              actions.map((act, i) =>
                act.to ? (
                  <Link
                    key={i}
                    to={act.to}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold transition-all shadow-xs ${
                      act.variant === "primary"
                        ? "bg-[#1F2A5A] text-white hover:bg-[#162044]"
                        : "bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {act.icon}
                    <span>{act.label}</span>
                  </Link>
                ) : (
                  <button
                    key={i}
                    onClick={act.onClick}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      act.variant === "primary"
                        ? "bg-[#1F2A5A] text-white hover:bg-[#162044]"
                        : "bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {act.icon}
                    <span>{act.label}</span>
                  </button>
                ),
              )
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#1F2A5A] text-white text-xs font-bold hover:bg-[#162044] transition-colors shadow-xs"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Return to Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Previous View</span>
                </button>

                {(type === "500" ||
                  type === "503" ||
                  type === "ML_ERROR" ||
                  type === "NETWORK") && (
                  <button
                    type="button"
                    onClick={handleRetryClick}
                    disabled={isRetrying}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`}
                    />
                    <span>{isRetrying ? "Reconnecting..." : "Retry Request"}</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Diagnostic Metadata Footer */}
          <div className="pt-6 border-t border-[#D9DEE7] dark:border-slate-800 max-w-xl mx-auto flex flex-wrap items-center justify-between text-[11px] font-mono text-[#5B6472] dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Snapshot Source: 60,359 Official Records</span>
            </div>
            <div className="flex items-center gap-2 mt-1 sm:mt-0">
              <span className="font-bold">Incident Ref:</span>
              <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-xs font-mono font-bold text-[#1F2A5A] dark:text-blue-300">
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

