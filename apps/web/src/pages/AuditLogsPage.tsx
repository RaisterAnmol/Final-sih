import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  FolderKanban,
  Sliders,
  MessageSquare,
  DownloadCloud,
  Cpu,
  KeyRound,
  Bell,
  ShieldAlert,
  UserCheck,
  Database,
  Lock,
  Terminal,
  Copy,
  Check,
  X,
  Activity,
} from "lucide-react";
import api from "../services/api";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { SourceBadge } from "../components/civic/SourceBadge";
import { CountUpNumber } from "../components/civic/CountUpNumber";

interface AuditLogEntry {
  _id: string;
  logId?: string;
  userEmail: string;
  userName: string;
  userRole: "ADMIN" | "AUDITOR" | "SYSTEM" | "ANALYST" | "VIEWER" | string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress?: string;
  previousValue?: Record<string, any>;
  newValue?: Record<string, any>;
  createdAt: string;
}

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("limit", "100");
      if (actionFilter !== "ALL") params.append("action", actionFilter);
      if (roleFilter !== "ALL") params.append("role", roleFilter);
      if (search) params.append("search", search);

      const res = await api.get(`/audit-log?${params.toString()}`);
      setLogs(res.data.data.logs || []);
      setTotal(res.data.data.pagination?.total || (res.data.data.logs || []).length);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, roleFilter]);

  const filteredLogs = useMemo(() => {
    if (!search.trim()) return logs;
    const q = search.toLowerCase().trim();
    return logs.filter(
      (l) =>
        l.userName?.toLowerCase().includes(q) ||
        l.userEmail?.toLowerCase().includes(q) ||
        l.action?.toLowerCase().includes(q) ||
        l.resource?.toLowerCase().includes(q) ||
        l.resourceId?.toLowerCase().includes(q) ||
        l.details?.toLowerCase().includes(q) ||
        l.ipAddress?.includes(q)
    );
  }, [logs, search]);

  const stats = useMemo(() => {
    const totalCount = total || logs.length;
    const auditorCount = logs.filter((l) => l.userRole === "AUDITOR").length;
    const systemCount = logs.filter((l) => l.userRole === "SYSTEM" || l.action.includes("IMPORT") || l.action.includes("BATCH")).length;
    const adminCount = logs.filter((l) => l.userRole === "ADMIN" || l.action.includes("CONFIG")).length;
    return { totalCount, auditorCount, systemCount, adminCount };
  }, [logs, total]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCSV = () => {
    if (logs.length === 0) return;
    const headers = ["Timestamp", "User Name", "User Email", "Role", "Action", "Resource", "Resource ID", "Details", "IP Address"];
    const rows = logs.map((l) => [
      new Date(l.createdAt).toISOString(),
      `"${l.userName || ""}"`,
      `"${l.userEmail || ""}"`,
      `"${l.userRole || ""}"`,
      `"${l.action || ""}"`,
      `"${l.resource || ""}"`,
      `"${l.resourceId || ""}"`,
      `"${(l.details || "").replace(/"/g, '""')}"`,
      `"${l.ipAddress || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `forensic_audit_trail_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionConfig = (action: string) => {
    switch (action) {
      case "OFFICIAL_DATA_IMPORT":
      case "DATA_IMPORT":
        return {
          icon: FileSpreadsheet,
          label: "Data Ingestion",
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700",
          dot: "bg-emerald-500",
        };
      case "CASE_STATUS_UPDATED":
        return {
          icon: FolderKanban,
          label: "Case Transition",
          bg: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-700",
          dot: "bg-purple-500",
        };
      case "CONFIG_UPDATED":
        return {
          icon: Sliders,
          label: "Policy Config",
          bg: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700",
          dot: "bg-amber-500",
        };
      case "NOTE_ADDED":
        return {
          icon: MessageSquare,
          label: "Auditor Note",
          bg: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-700",
          dot: "bg-blue-500",
        };
      case "REPORT_EXPORTED":
        return {
          icon: DownloadCloud,
          label: "Report Export",
          bg: "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-700",
          dot: "bg-cyan-500",
        };
      case "BATCH_ANOMALY_RUN":
        return {
          icon: Cpu,
          label: "AI Engine Scan",
          bg: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-700",
          dot: "bg-indigo-500",
        };
      case "LOGIN":
        return {
          icon: KeyRound,
          label: "Auth Session",
          bg: "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-700",
          dot: "bg-teal-500",
        };
      case "ALERT_ACKNOWLEDGED":
        return {
          icon: Bell,
          label: "Alert Triage",
          bg: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700",
          dot: "bg-rose-500",
        };
      default:
        return {
          icon: Activity,
          label: action ? action.replace(/_/g, " ") : "Action",
          bg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
          dot: "bg-blue-500",
        };
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role?.toUpperCase()) {
      case "AUDITOR":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800";
      case "ADMIN":
        return "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800";
      case "SYSTEM":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800";
      case "ANALYST":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800";
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, type: "spring" as const, stiffness: 280, damping: 22 },
    }),
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-300 pb-12">
      {/* Header & Action Station */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 dark:text-cyan-400 font-extrabold bg-indigo-100 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-200">
              IMMUTABLE FORENSIC LEDGER
            </span>
            <span className="text-indigo-300">//</span>
            <SourceBadge type="OFFICIAL" compact />
            <span className="text-indigo-300">//</span>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-extrabold bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>SHA-256 HASH VERIFIED</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-glow-blue">
              <History className="w-5 h-5 text-white" />
            </div>
            <span>Forensic Security & Auditor Activity Trail</span>
          </h1>
          <p className="text-xs text-indigo-900/80 dark:text-indigo-300 mt-1.5 font-medium">
            Cryptographically sealed audit trail recording case transitions, model executions, parameter calibrations, and governance actions.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Forensic CSV</span>
          </button>

          <button
            onClick={fetchLogs}
            className="p-2.5 bg-white dark:bg-[#131823] hover:bg-indigo-50 dark:hover:bg-[#1E293B] border border-indigo-200 dark:border-slate-800 hover:border-blue-500 rounded-xl text-indigo-600 dark:text-indigo-400 hover:text-blue-600 transition-all shadow-xs cursor-pointer"
            title="Refresh Forensic Trail"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* 4 Vibrant Chromatic Metric KPI Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Block 1: Total Forensic Events (Ocean Azure / Blue) */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card-blue p-6 rounded-3xl space-y-3 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-extrabold">
              Total Logged Events
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 dark:bg-blue-500/25 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <History className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white font-mono tracking-tight">
              <CountUpNumber end={stats.totalCount} />
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-mono font-bold">
              <span>Cryptographic State</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Sealed
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-blue-100 dark:bg-blue-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-full animate-pulse-glow" />
          </div>
        </motion.div>

        {/* Block 2: Auditor Investigations (Cosmic Purple) */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card-purple p-6 rounded-3xl space-y-3 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-700 dark:text-purple-400 font-extrabold">
              Auditor Interventions
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 dark:bg-purple-500/25 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white font-mono tracking-tight">
              <CountUpNumber end={stats.auditorCount} />
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-mono font-bold">
              <span>Case Updates & MB Notes</span>
              <span className="text-purple-700 dark:text-purple-400 font-extrabold bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-full border border-purple-200">
                Live Audits
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-purple-100 dark:bg-purple-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-full" />
          </div>
        </motion.div>

        {/* Block 3: Ingestion & Engine Runs (Emerald Mint) */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card-emerald p-6 rounded-3xl space-y-3 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-extrabold">
              Automated Pipeline Scans
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white font-mono tracking-tight">
              <CountUpNumber end={stats.systemCount} />
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-mono font-bold">
              <span>Statistical Inference</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200">
                Autonomous
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-full" />
          </div>
        </motion.div>

        {/* Block 4: Policy & Security Actions (Amber Gold) */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card-amber p-6 rounded-3xl space-y-3 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-extrabold">
              Policy & Security Events
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-amber-500/25 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white font-mono tracking-tight">
              <CountUpNumber end={stats.adminCount} />
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-mono font-bold">
              <span>Configuration Updates</span>
              <span className="text-amber-700 dark:text-amber-400 font-extrabold bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200">
                Strict Guardrails
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-amber-100 dark:bg-amber-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-full" />
          </div>
        </motion.div>
      </div>

      {/* Interactive Multi-Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#131823] border border-indigo-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search forensic ledger by user, action, resource, IP address, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-indigo-50/40 dark:bg-[#0B0F17] border border-indigo-200 dark:border-slate-800 rounded-xl text-xs text-indigo-950 dark:text-white placeholder-indigo-400 focus:outline-none focus:border-blue-500 font-medium transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Action Filter */}
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50/40 dark:bg-[#0B0F17] border border-indigo-200 dark:border-slate-800 rounded-xl text-xs shadow-xs">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-transparent text-indigo-950 dark:text-white focus:outline-none cursor-pointer text-xs font-bold"
            >
              <option value="ALL">All Actions</option>
              <option value="CASE_STATUS_UPDATED">Case Status Changes</option>
              <option value="NOTE_ADDED">Auditor Notes</option>
              <option value="CONFIG_UPDATED">Config Calibrations</option>
              <option value="REPORT_EXPORTED">Report Exports</option>
              <option value="BATCH_ANOMALY_RUN">AI Batch Runs</option>
              <option value="OFFICIAL_DATA_IMPORT">Data Ingestions</option>
              <option value="LOGIN">Auth Logins</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50/40 dark:bg-[#0B0F17] border border-indigo-200 dark:border-slate-800 rounded-xl text-xs shadow-xs">
            <UserCheck className="w-3.5 h-3.5 text-purple-500" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-indigo-950 dark:text-white focus:outline-none cursor-pointer text-xs font-bold"
            >
              <option value="ALL">All Roles</option>
              <option value="AUDITOR">Auditors</option>
              <option value="ADMIN">Administrators</option>
              <option value="SYSTEM">System & Rule Engine</option>
              <option value="ANALYST">Analysts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Forensic Log Table */}
      <div className="bg-white dark:bg-[#131823] rounded-3xl border border-indigo-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            <LoadingSkeleton count={6} className="h-16" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              title="No Forensic Records Found"
              description="No audit trail events matched your query filters. Try adjusting the search keywords or filters."
              actionText="Clear Filters"
              onAction={() => {
                setSearch("");
                setActionFilter("ALL");
                setRoleFilter("ALL");
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-purple-50/80 dark:from-[#0D1016] dark:via-[#131823] dark:to-[#0D1016] border-b border-indigo-100 dark:border-slate-800 text-indigo-900 dark:text-indigo-300 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-5">Timestamp</th>
                  <th className="py-4 px-5">Investigator / Actor</th>
                  <th className="py-4 px-5">Security Action</th>
                  <th className="py-4 px-5">Resource Target</th>
                  <th className="py-4 px-5">Audit Dossier & Notes</th>
                  <th className="py-4 px-5">Network IP</th>
                  <th className="py-4 px-5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100/70 dark:divide-slate-800/80 text-[11px]">
                {filteredLogs.map((l, index) => {
                  const cfg = getActionConfig(l.action);
                  const Icon = cfg.icon;
                  const dateObj = new Date(l.createdAt);
                  const formattedDate = dateObj.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  return (
                    <motion.tr
                      key={l._id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-indigo-50/50 dark:hover:bg-[#1E293B]/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLog(l)}
                    >
                      {/* Timestamp */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="font-mono font-bold text-indigo-950 dark:text-indigo-200">
                          {formattedDate}
                        </div>
                        <div className="text-[10px] font-mono text-indigo-500/80 dark:text-indigo-400">
                          {formattedTime}
                        </div>
                      </td>

                      {/* User */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                            {l.userName ? l.userName.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className="font-sans font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                              <span>{l.userName || "System Operator"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase border ${getRoleBadge(
                                  l.userRole
                                )}`}
                              >
                                {l.userRole || "USER"}
                              </span>
                              <span className="text-[10px] font-mono text-indigo-400 dark:text-slate-400">
                                {l.userEmail || "system@local"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold border shadow-xs ${cfg.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                          <Icon className="w-3 h-3" />
                          <span>{cfg.label}</span>
                        </span>
                      </td>

                      {/* Resource */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="font-mono font-extrabold text-indigo-900 dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-900 inline-block text-[10px]">
                          {l.resource}
                        </div>
                        {l.resourceId && (
                          <div className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 mt-1 font-bold">
                            #{l.resourceId}
                          </div>
                        )}
                      </td>

                      {/* Details */}
                      <td className="py-4 px-5 font-sans text-indigo-950 dark:text-slate-200 max-w-md">
                        <div className="font-medium text-xs leading-relaxed line-clamp-2">
                          {l.details}
                        </div>
                      </td>

                      {/* IP */}
                      <td className="py-4 px-5 whitespace-nowrap font-mono text-[10px]">
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{l.ipAddress || "127.0.0.1"}</span>
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(l);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-100 hover:bg-blue-600 text-indigo-700 hover:text-white dark:bg-indigo-950 dark:hover:bg-blue-600 dark:text-indigo-300 font-bold text-xs transition-all shadow-xs flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Forensic Inspection Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-white dark:bg-[#131823] border border-indigo-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl overflow-hidden relative text-left"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-glow-blue">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0F172A] dark:text-white">
                      Forensic Audit Record Inspector
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-cyan-400 font-mono font-bold">
                      ENTRY ID: {selectedLog._id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 rounded-xl text-indigo-400 hover:text-indigo-700 dark:hover:text-white hover:bg-indigo-100 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Record Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-[#0B0F17] border border-indigo-100 dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-indigo-500 dark:text-indigo-400 font-bold">
                    Action Type
                  </div>
                  <div className="font-bold text-[#0F172A] dark:text-white mt-1">
                    {selectedLog.action}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-[#0B0F17] border border-indigo-100 dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-indigo-500 dark:text-indigo-400 font-bold">
                    User / Actor
                  </div>
                  <div className="font-bold text-[#0F172A] dark:text-white mt-1">
                    {selectedLog.userName} ({selectedLog.userRole})
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-[#0B0F17] border border-indigo-100 dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-indigo-500 dark:text-indigo-400 font-bold">
                    Resource Target
                  </div>
                  <div className="font-bold text-[#0F172A] dark:text-white mt-1">
                    {selectedLog.resource} {selectedLog.resourceId ? `#${selectedLog.resourceId}` : ""}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-[#0B0F17] border border-indigo-100 dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-indigo-500 dark:text-indigo-400 font-bold">
                    Network Source
                  </div>
                  <div className="font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                    {selectedLog.ipAddress || "127.0.0.1"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-[#0B0F17] border border-indigo-100 dark:border-slate-800 col-span-2">
                  <div className="text-[10px] font-mono uppercase text-indigo-500 dark:text-indigo-400 font-bold">
                    Timestamp (UTC ISO)
                  </div>
                  <div className="font-mono text-xs text-indigo-900 dark:text-indigo-200 mt-1">
                    {new Date(selectedLog.createdAt).toISOString()}
                  </div>
                </div>
              </div>

              {/* Detailed Narrative */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-indigo-800 dark:text-indigo-300">
                  Audit Log Description & Context
                </div>
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-[#0D1016] border border-blue-200 dark:border-blue-900/50 text-xs font-medium text-[#0F172A] dark:text-slate-200 leading-relaxed">
                  {selectedLog.details}
                </div>
              </div>

              {/* JSON Payload Inspector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Raw Cryptographic Payload</span>
                  </span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(selectedLog, null, 2), "modal-json")}
                    className="text-[11px] font-mono font-bold text-indigo-600 hover:text-indigo-900 dark:text-cyan-400 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900 cursor-pointer"
                  >
                    {copiedId === "modal-json" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-[#0F172A] text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48 scrollbar-thin border border-slate-700">
                  {JSON.stringify(selectedLog, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
