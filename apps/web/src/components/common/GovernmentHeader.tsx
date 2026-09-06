import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Accessibility,
  Activity,
  ArrowRight,
  Bell,
  ChevronDown,
  ExternalLink,
  Globe,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

interface GovernmentHeaderProps {
  publicMode?: boolean;
  onOpenDemoModal?: () => void;
  onOpenSearch?: () => void;
}

const NAV_LINKS = [
  { label: "Overview", path: "/" },
  { label: "MPs", path: "/mps" },
  { label: "Works Register", path: "/projects" },
  { label: "Funds & Spending", path: "/analytics/financial" },
  { label: "Efficiency", path: "/analytics/efficiency" },
  { label: "AI Signals", path: "/anomalies" },
  { label: "Authorities", path: "/contractors" },
];

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({
  publicMode = false,
  onOpenDemoModal,
  onOpenSearch,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "larger">("normal");
  const [lang, setLang] = useState<"EN" | "HI">("EN");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const setFont = (size: "normal" | "large" | "larger") => {
    setFontSize(size);
    document.documentElement.style.fontSize =
      size === "normal" ? "16px" : size === "large" ? "17.5px" : "19px";
  };

  const pageContext = () => {
    const p = location.pathname;
    if (p.startsWith("/dashboard")) return "National Monitoring Dashboard";
    if (p.startsWith("/projects")) return "MPLADS Works Register";
    if (p.startsWith("/mps")) return "Parliamentary Members Directory";
    if (p.startsWith("/anomalies")) return "AI-Assisted Review Signals";
    if (p.startsWith("/risk-cases")) return "Administrative Review Inquiries";
    if (p.startsWith("/contractors")) return "Implementing Authorities";
    if (p.startsWith("/geographic")) return "Spatial GIS Intelligence";
    if (p.startsWith("/analytics/financial")) return "Allocation & Spending Analytics";
    if (p.startsWith("/analytics/efficiency")) return "Execution Velocity Analytics";
    if (p.startsWith("/reports")) return "Statutory Reports & Exports";
    if (p.startsWith("/alerts")) return "Priority Review Alerts";
    if (p.startsWith("/audit")) return "Forensic Audit Trail";
    if (p.startsWith("/settings")) return "Intelligence Engine Calibration";
    return "MPLADS Intelligence Platform";
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="sticky top-0 z-[60] w-full max-w-full overflow-x-clip select-none">
      {/* Government utility strip */}
      <div className="bg-[#18234F] text-white border-b border-white/10 w-full">
        <div className="w-full px-3 sm:px-5 lg:px-8 min-h-8 py-1 flex items-center justify-between gap-3 text-[10px] sm:text-[11px]">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
            <span className="font-bold tracking-wide whitespace-nowrap">भारत सरकार</span>
            <span className="text-white/35">|</span>
            <span className="font-semibold tracking-wide hidden sm:inline whitespace-nowrap">GOVERNMENT OF INDIA</span>
            <span className="text-white/35 hidden md:inline">|</span>
            <span className="text-white/75 truncate hidden lg:inline">Ministry of Statistics &amp; Programme Implementation</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a href="#main-content" className="hidden lg:inline whitespace-nowrap hover:text-[#F8B84E] transition-colors">
              Skip to Main Content
            </a>
            <span className="text-white/30 hidden lg:inline">|</span>
            <div className="flex items-center gap-0.5 bg-white/10 rounded px-1 shrink-0">
              {(["normal", "large", "larger"] as const).map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFont(s)}
                  className={`px-1.5 py-0.5 ${fontSize === s ? "text-[#F8B84E] font-bold" : "text-white/80 hover:text-white"}`}
                  aria-label={i === 0 ? "Standard font size" : i === 1 ? "Large font size" : "Extra large font size"}
                >
                  {i === 0 ? "A-" : i === 1 ? "A" : "A+"}
                </button>
              ))}
            </div>
            <span className="text-white/30">|</span>
            <button
              type="button"
              onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
              className="flex items-center gap-1 hover:text-[#F8B84E] transition-colors whitespace-nowrap"
            >
              <Globe className="w-3 h-3" />
              <span>{lang === "EN" ? "English" : "हिन्दी"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Institutional identity + command row */}
      <div
        className={`bg-white/95 dark:bg-[#0D1016]/96 backdrop-blur-xl border-b border-[#D9DEE7] dark:border-slate-800 transition-shadow w-full ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="w-full px-3 sm:px-5 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3 min-w-0">
            {/* Brand / government identity */}
            <Link
              to="/"
              onClick={closeMobile}
              className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 shrink-0 group"
            >
              <div className="w-9 h-11 sm:w-11 sm:h-13 lg:w-12 lg:h-14 flex items-center justify-center shrink-0">
                <img
                  src="/india-emblem.png"
                  alt="State Emblem of India"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="h-10 sm:h-12 w-px bg-[#D9DEE7] dark:bg-slate-700 shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.12em] leading-tight text-[#596273] dark:text-slate-400 truncate max-w-[240px] sm:max-w-none">
                  Ministry of Statistics &amp; Programme Implementation
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[17px] sm:text-[20px] lg:text-[22px] font-extrabold tracking-tight text-[#18234F] dark:text-white whitespace-nowrap">
                    MPLADS INSIGHT
                  </span>
                  <span className="hidden sm:inline shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFF4DE] text-[#9A5A00] border border-[#F6D28A]">
                    SIH 2026
                  </span>
                </div>
                <div className="text-[8px] sm:text-[9px] font-mono font-semibold text-[#138A45] uppercase tracking-wider mt-0.5 truncate hidden sm:block">
                  Public Works Intelligence • Audit &amp; Transparency
                </div>
              </div>
            </Link>

            {/* Governance context cards: only displayed on ultra-wide screens (2xl: 1536px+) so they never squeeze or overflow laptops */}
            <div className="hidden 2xl:flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#D9DEE7] bg-[#F8FAFC] dark:bg-[#131823] dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-[#138A45]" />
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">Governance Layer</div>
                  <div className="text-[10px] font-bold text-[#18234F] dark:text-white">Traceable • Explainable • Secure</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#D9DEE7] bg-[#F8FAFC] dark:bg-[#131823] dark:border-slate-800">
                <Activity className="w-4 h-4 text-[#2563EB]" />
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">Data Snapshot</div>
                  <div className="text-[10px] font-bold text-[#18234F] dark:text-white">2023–24 Works Register</div>
                </div>
              </div>
            </div>

            {/* Command actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

              {publicMode ? (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#18234F] dark:text-white bg-white dark:bg-[#151A22] border border-[#CBD5E1] dark:border-slate-700 rounded-md hover:border-[#18234F] transition-colors whitespace-nowrap"
                  >
                    Sign In / Demo
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs font-bold text-white bg-[#138A45] hover:bg-[#0F7439] rounded-md shadow-sm transition-all whitespace-nowrap"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Open Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onOpenSearch}
                    className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md border border-[#D9DEE7] dark:border-slate-800 text-[#667085] dark:text-slate-400 hover:text-[#18234F] dark:hover:text-white bg-white dark:bg-[#131823] text-xs whitespace-nowrap"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                    <kbd className="px-1.5 py-0.5 rounded border border-[#E2E8F0] dark:border-slate-700 text-[9px] font-mono">Ctrl K</kbd>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenDemoModal}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#18234F] text-white text-xs font-bold hover:bg-[#24346F] whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F8B84E]" /> Run Pipeline
                  </button>
                  <Link
                    to="/alerts"
                    className="relative p-2 rounded-md border border-[#D9DEE7] dark:border-slate-800 text-[#18234F] dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-[#151A22]"
                    title="Alerts"
                    aria-label="Alerts"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#B42318] ring-2 ring-white dark:ring-[#0D1016]" />
                  </Link>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="hidden sm:block p-2 rounded-md border border-[#D9DEE7] dark:border-slate-800 text-xs"
                    title="Toggle theme"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? "☀" : "◐"}
                  </button>
                  <div className="relative hidden xs:block">
                    <button
                      type="button"
                      onClick={() => setShowUser(!showUser)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-[#D9DEE7] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#131823] max-w-[170px]"
                    >
                      <span className="w-6 h-6 rounded-sm bg-[#18234F] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {user?.name?.[0] || "A"}
                      </span>
                      <span className="hidden lg:block text-xs font-bold text-[#18234F] dark:text-white truncate">
                        {user?.name || "Auditor"}
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                    </button>
                    {showUser && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-700 rounded-md shadow-xl p-2 z-[80]">
                        <div className="px-2 py-2 border-b border-[#E2E8F0] dark:border-slate-800 mb-1">
                          <div className="text-xs font-bold text-[#18234F] dark:text-white truncate">{user?.name || "Auditor Station"}</div>
                          <div className="text-[10px] text-slate-500 truncate">{user?.email || "auditor@mplad-insight.demo"}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowUser(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-2 py-2 text-xs font-semibold text-[#B42318] hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Log Out Session
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-md border border-[#D9DEE7] dark:border-slate-800 text-[#18234F] dark:text-white bg-white dark:bg-[#131823]"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Public navigation / authenticated platform utility row */}
      <div className="bg-[#111A3D] border-b border-[#2B3767] w-full">
        <div className="w-full px-3 sm:px-5 lg:px-8 min-h-10 flex items-center justify-between gap-4">
          {publicMode ? (
            <nav className="hidden lg:flex items-center gap-0.5 py-1 overflow-x-auto min-w-0">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-sm text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    active(item.path)
                      ? "bg-white text-[#18234F]"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : (
            <div className="flex items-center gap-2 text-[10px] text-white/80 py-2 min-w-0">
              <span className="font-bold text-[#F8B84E] shrink-0">MPLADS INSIGHT</span>
              <span className="text-white/30 shrink-0">/</span>
              <span className="truncate">{pageContext()}</span>
              <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded bg-[#138A45]/20 text-[#71D79A] border border-[#138A45]/30 shrink-0">
                <ShieldCheck className="w-3 h-3" /> Verified snapshot
              </span>
            </div>
          )}
          <div className="ml-auto hidden sm:flex items-center gap-3 text-[10px] text-white/70 shrink-0">
            <span className="flex items-center gap-1">
              <Accessibility className="w-3 h-3 text-[#F8B84E]" /> Accessible design
            </span>
            <span className="text-white/20">|</span>
            <a
              href="https://mplads.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white"
            >
              MPLADS Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Responsive navigation drawer */}
      {mobileOpen && (
        <div className="lg:hidden absolute left-0 right-0 top-full bg-[#111A3D] border-t border-white/10 shadow-2xl p-3 max-h-[calc(100vh-64px)] overflow-y-auto">
          {publicMode ? (
            NAV_LINKS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={`block px-4 py-3 rounded-md text-sm font-semibold ${
                  active(item.path)
                    ? "bg-white text-[#18234F]"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link to="/dashboard" onClick={closeMobile} className="px-3 py-3 rounded-md bg-white/10 text-white text-xs font-semibold">Dashboard</Link>
              <Link to="/projects" onClick={closeMobile} className="px-3 py-3 rounded-md bg-white/10 text-white text-xs font-semibold">Works Register</Link>
              <Link to="/anomalies" onClick={closeMobile} className="px-3 py-3 rounded-md bg-white/10 text-white text-xs font-semibold">AI Signals</Link>
              <Link to="/reports" onClick={closeMobile} className="px-3 py-3 rounded-md bg-white/10 text-white text-xs font-semibold">Reports</Link>
              <button type="button" onClick={() => { closeMobile(); onOpenSearch?.(); }} className="text-left px-3 py-3 rounded-md bg-white/10 text-white text-xs font-semibold">Search</button>
              <button type="button" onClick={() => { closeMobile(); onOpenDemoModal?.(); }} className="text-left px-3 py-3 rounded-md bg-white/10 text-white text-xs font-semibold">Run Pipeline</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GovernmentHeader;
