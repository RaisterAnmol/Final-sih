import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export interface CivicNavbarProps {
  onOpenSearch?: () => void;
}

export const CivicNavbar: React.FC<CivicNavbarProps> = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Overview", path: "/" },
    { label: "MPs", path: "/mps" },
    { label: "Projects", path: "/projects" },
    { label: "Funds & Spending", path: "/analytics/financial" },
    { label: "Efficiency", path: "/analytics/efficiency" },
    { label: "Attention Areas", path: "/anomalies" },
    { label: "Contractors", path: "/contractors" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled
            ? "bg-slate-950/85 backdrop-blur-md border-b border-slate-800/90 shadow-xl py-3"
            : "bg-slate-950/60 backdrop-blur-sm border-b border-slate-800/40 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-950/40 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-wide">
                  MPLAD INSIGHT
                </span>
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                  CIVIC DATA
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                Official MoSPI Telemetry Station
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-xl p-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-950/40"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenSearch || (() => navigate("/projects"))}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search projects, MPs...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800 font-mono">
                ⌘K
              </kbd>
            </button>

            <Link
              to="/dashboard"
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition-all"
            >
              <span>Auditor Station</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 p-6 space-y-4 animate-fadeIn">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              <span>Open Auditor Station</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CivicNavbar;
