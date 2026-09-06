import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  AlertTriangle,
  Briefcase,
  Building2,
  MapPin,
  TrendingUp,
  Gauge,
  CheckCircle,
  UploadCloud,
  FileText,
  Bell,
  History,
  Settings,
  ShieldCheck,
  Users,
  Database,
  Info,
  Cpu,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

interface NavGroup {
  title: string;
  color: string;
  activeClass: string;
  iconColor: string;
  items: {
    label: string;
    to: string;
    icon: any;
    exact?: boolean;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "EXECUTIVE MONITORING",
    color: "text-[#1F2A5A] dark:text-blue-400 font-bold",
    activeClass:
      "bg-[#1F2A5A]/10 text-[#1F2A5A] dark:text-white border-l-4 border-[#1F2A5A] font-bold shadow-xs",
    iconColor: "text-[#1F2A5A] dark:text-blue-400",
    items: [
      {
        label: "Monitoring Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
      },
      { label: "Parliamentary MPs", to: "/mps", icon: Users },
      { label: "Works Register", to: "/projects", icon: FolderKanban },
    ],
  },
  {
    title: "INTELLIGENCE & REVIEW",
    color: "text-[#1F2A5A] dark:text-purple-400 font-bold",
    activeClass:
      "bg-[#1F2A5A]/10 text-[#1F2A5A] dark:text-white border-l-4 border-[#1F2A5A] font-bold shadow-xs",
    iconColor: "text-[#1F2A5A] dark:text-purple-400",
    items: [
      { label: "AI-Assisted Signals", to: "/anomalies", icon: AlertTriangle },
      { label: "Review Inquiries", to: "/risk-cases", icon: Briefcase },
      { label: "Spatial GIS Map", to: "/geographic", icon: MapPin },
      {
        label: "Implementing Authorities",
        to: "/contractors",
        icon: Building2,
      },
    ],
  },
  {
    title: "ANALYTICS & GOVERNANCE",
    color: "text-[#1F2A5A] dark:text-emerald-400 font-bold",
    activeClass:
      "bg-[#1F2A5A]/10 text-[#1F2A5A] dark:text-white border-l-4 border-[#1F2A5A] font-bold shadow-xs",
    iconColor: "text-[#1F2A5A] dark:text-emerald-400",
    items: [
      {
        label: "Allocation Analytics",
        to: "/analytics/financial",
        icon: TrendingUp,
      },
      { label: "Execution Velocity", to: "/analytics/efficiency", icon: Gauge },
      { label: "Data Quality Metrics", to: "/data-quality", icon: CheckCircle },
      { label: "Statutory Reports", to: "/reports", icon: FileText },
    ],
  },
  {
    title: "PROVENANCE & SYSTEM",
    color: "text-[#1F2A5A] dark:text-amber-400 font-bold",
    activeClass:
      "bg-[#1F2A5A]/10 text-[#1F2A5A] dark:text-white border-l-4 border-[#1F2A5A] font-bold shadow-xs",
    iconColor: "text-[#1F2A5A] dark:text-amber-400",
    items: [
      { label: "Sources & Provenance", to: "/sources", icon: Database },
      { label: "Data Ingestion", to: "/import", icon: UploadCloud },
      { label: "Real-Time Alerts", to: "/alerts", icon: Bell },
      { label: "Forensic Audit Trail", to: "/audit-logs", icon: History },
      { label: "Engine Calibration", to: "/settings", icon: Settings },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 border-r border-[#D9DEE7] dark:border-slate-800 bg-white dark:bg-[#0D1016] shrink-0 z-40 select-none text-left shadow-xs">
      {/* Institutional Brand Header */}
      <div className="h-16 px-4 border-b border-[#D9DEE7] dark:border-slate-800 flex items-center justify-between bg-[#1F2A5A] text-white">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2.5 group cursor-pointer"
          title="Return to Monitoring Dashboard"
        >
          <div className="w-8 h-8 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center text-[#F59E0B] font-bold shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-white text-xs tracking-tight leading-tight flex items-center gap-1.5">
              <span>MPLADS Insight</span>
            </div>
            <span className="text-[9px] font-mono text-[#F59E0B] uppercase font-bold tracking-wider block">
              SIH PROTOTYPE // MoSPI
            </span>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links Scroll Container */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <div
              className={`px-3 text-[9px] font-mono font-bold uppercase tracking-wider ${group.color}`}
            >
              {group.title}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-semibold transition-all group ${
                      isActive
                        ? `${group.activeClass} font-bold`
                        : "text-slate-700 dark:text-slate-300 hover:text-[#1F2A5A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151A22]"
                    }`
                  }
                >
                  <Icon className={`w-4 h-4 shrink-0 ${group.iconColor}`} />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer System Status & User Profile */}
      <div className="p-3 border-t border-[#D9DEE7] dark:border-slate-800 bg-[#F7F8FA] dark:bg-[#090B0F]/90 space-y-2">
        {/* Source Snapshot Tag */}
        <div className="px-2.5 py-1.5 rounded-sm bg-white dark:bg-[#151A22] border border-[#D9DEE7] dark:border-slate-800 flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-600 dark:text-slate-400 font-semibold">
            Snapshot Mode
          </span>
          <span className="text-[#138A45] font-bold">2023-24 Active</span>
        </div>

        {/* User Identity */}
        <div className="flex items-center justify-between px-1 pt-0.5 text-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-sm bg-[#1F2A5A] text-white flex items-center justify-center font-bold text-xs font-mono">
              {user?.name?.[0] || "A"}
            </div>
            <div className="truncate">
              <span className="font-bold text-[#1F2A5A] dark:text-white block text-xs truncate">
                {user?.name || "Auditor Station"}
              </span>
              <span className="text-[9px] text-[#5B6472] dark:text-slate-400 font-mono uppercase font-semibold block">
                {user?.role || "Auditor"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            className="p-1.5 rounded-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#151A22] border border-[#D9DEE7] dark:border-slate-800 transition-all cursor-pointer shrink-0"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#1F2A5A]" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
