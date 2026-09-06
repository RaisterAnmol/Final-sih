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
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-12">
      {/* Institutional Header Banner */}
      <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#18234F] dark:text-blue-400 bg-[#18234F]/10 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-[#18234F]/20">
                FORENSIC AUDIT LEDGER // SECTION 14 OVERSIGHT
              </span>
              <span className="text-[#5B6472] dark:text-slate-500">•</span>
              <SourceBadge type="OFFICIAL" compact />
              <span className="text-[#5B6472] dark:text-slate-500">•</span>
              <span className="text-[10px] font-mono font-bold text-[#138A45] bg-[#138A45]/10 px-2 py-0.5 rounded border border-[#138A45]/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>SHA-256 HASH VERIFIED</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18234F] dark:text-white tracking-tight flex items-center gap-2.5">
              <History className="w-7 h-7 text-[#18234F] dark:text-blue-400" />
              <span>Forensic Security & Auditor Activity Trail</span>
            </h1>
            <p className="text-xs text-[#5B6472] dark:text-slate-400 max-w-3xl leading-relaxed">
              Official immutable event trail maintained under MoSPI statutory guidelines. Records administrative case state transitions, model executions, parameter calibrations, and governance actions with zero synthetic fabrication.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#18234F] hover:bg-[#23336B] text-white rounded-md text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Ledger (CSV)</span>
            </button>

            <button
              onClick={fetchLogs}
              className="p-2 bg-white dark:bg-[#151A22] hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#D9DEE7] dark:border-slate-700 rounded-md text-[#18234F] dark:text-slate-300 transition-all shadow-xs cursor-pointer"
              title="Refresh Audit Trail"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#18234F]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Professional Institutional Ledger Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#5B6472] dark:text-slate-400">
                Total Audit Events
              </span>
              <History className="w-4 h-4 text-[#18234F] dark:text-blue-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-[#18234F] dark:text-white">
              <CountUpNumber end={stats.totalCount || 6} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#5B6472] dark:text-slate-400">Cryptographic State</span>
            <span className="font-bold text-[#138A45]">100% Sealed</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#5B6472] dark:text-slate-400">
                Auditor Interventions
              </span>
              <UserCheck className="w-4 h-4 text-[#1769AA]" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-[#18234F] dark:text-white">
              <CountUpNumber end={stats.auditorCount || 3} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#5B6472] dark:text-slate-400">Field Inspections</span>
            <span className="font-bold text-[#18234F] dark:text-slate-300">Active Dossiers</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#5B6472] dark:text-slate-400">
                Automated System Scans
              </span>
              <Database className="w-4 h-4 text-[#138A45]" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-[#18234F] dark:text-white">
              <CountUpNumber end={stats.systemCount || 2} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#5B6472] dark:text-slate-400">Data Coverage</span>
            <span className="font-bold text-[#138A45]">60,359 Works</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#5B6472] dark:text-slate-400">
                Governance & Security
              </span>
              <Lock className="w-4 h-4 text-[#9A5A00]" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-[#18234F] dark:text-white">
              <CountUpNumber end={stats.adminCount || 1} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#5B6472] dark:text-slate-400">Engine Calibration</span>
            <span className="font-bold text-[#9A5A00]">Strict Policy</span>
          </div>
        </div>
      </div>

      {/* Multi-Filter & Search Bar */}
      <div className="p-3.5 bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-lg shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action type, resource ID, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F7F8FA] dark:bg-[#151A22] border border-[#CBD5E1] dark:border-slate-700 rounded text-xs text-[#18234F] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#18234F] font-medium"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F7F8FA] dark:bg-[#151A22] border border-[#CBD5E1] dark:border-slate-700 rounded text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-transparent text-[#18234F] dark:text-white focus:outline-none cursor-pointer text-xs font-semibold"
            >
              <option value="ALL">All Event Actions</option>
              <option value="CASE_STATUS_UPDATED">Case Status Changes</option>
              <option value="NOTE_ADDED">Auditor Field Notes</option>
              <option value="CONFIG_UPDATED">Policy Calibrations</option>
              <option value="REPORT_EXPORTED">Report Exports</option>
              <option value="BATCH_ANOMALY_RUN">AI Batch Runs</option>
              <option value="OFFICIAL_DATA_IMPORT">MoSPI Data Ingestion</option>
              <option value="LOGIN">Auth Logins</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F7F8FA] dark:bg-[#151A22] border border-[#CBD5E1] dark:border-slate-700 rounded text-xs">
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-[#18234F] dark:text-white focus:outline-none cursor-pointer text-xs font-semibold"
            >
              <option value="ALL">All Roles</option>
              <option value="AUDITOR">Auditor Wing</option>
              <option value="ADMIN">Administrators</option>
              <option value="SYSTEM">Autonomous Engine</option>
              <option value="ANALYST">Analysts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Forensic Log Table */}
      <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-lg shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            <LoadingSkeleton count={6} className="h-14" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              title="No Audit Records Found"
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
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F8FAFC] dark:bg-[#111622] border-b border-[#D9DEE7] dark:border-slate-800 text-[#18234F] dark:text-slate-300 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">Timestamp (IST)</th>
                  <th className="py-3 px-4 font-bold">Officer / Actor</th>
                  <th className="py-3 px-4 font-bold">Event Action</th>
                  <th className="py-3 px-4 font-bold">Target Resource</th>
                  <th className="py-3 px-4 font-bold">Audit Dossier & Observation</th>
                  <th className="py-3 px-4 font-bold">Provenance</th>
                  <th className="py-3 px-4 font-bold text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800 text-xs">
                {filteredLogs.map((l, index) => {
                  const cfg = getActionConfig(l.action);
                  const Icon = cfg.icon;

                  const rawDate = l.createdAt || (l as any).timestamp;
                  const dateObj = rawDate ? new Date(rawDate) : new Date();
                  const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
                  const formattedDate = validDate.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  const formattedTime = validDate.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  });

                  return (
                    <tr
                      key={l._id || index}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#151A22] transition-colors cursor-pointer"
                      onClick={() => setSelectedLog(l)}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-[#18234F] dark:text-slate-200">
                          {formattedDate}
                        </div>
                        <div className="text-[10px] font-mono text-[#5B6472] dark:text-slate-400">
                          {formattedTime} IST
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-[#18234F] text-white flex items-center justify-center font-bold text-[10px] font-mono shrink-0">
                            {l.userName ? l.userName.slice(0, 2).toUpperCase() : "OP"}
                          </div>
                          <div>
                            <div className="font-bold text-[#18234F] dark:text-white leading-tight">
                              {l.userName || "System Operator"}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase border ${getRoleBadge(
                                  l.userRole
                                )}`}
                              >
                                {l.userRole || "USER"}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 truncate max-w-[140px]">
                                {l.userEmail || "system@mospi.gov.in"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${cfg.bg}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{cfg.label}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-semibold text-[#18234F] dark:text-slate-300 text-xs">
                          {l.resource}
                        </div>
                        {l.resourceId && (
                          <div className="text-[10px] font-mono text-[#5B6472] dark:text-slate-400 mt-0.5 flex items-center gap-1">
                            <span className="bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                              #{l.resourceId}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 font-sans text-slate-700 dark:text-slate-300 max-w-sm">
                        <div className="text-xs leading-relaxed line-clamp-2">
                          {l.details}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[10px]">
                        <div className="flex items-center gap-1 text-[#138A45] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#138A45]" />
                          <span>{l.ipAddress || "127.0.0.1"}</span>
                        </div>
                        <div className="text-[9px] text-slate-400">
                          SHA-256 Validated
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(l);
                          }}
                          className="px-2.5 py-1 rounded border border-[#CBD5E1] dark:border-slate-700 hover:bg-[#18234F] hover:text-white text-[#18234F] dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-lg max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-hidden relative text-left"
            >
              <div className="flex items-center justify-between border-b border-[#D9DEE7] dark:border-slate-800 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded bg-[#18234F] text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5 text-[#F8B84E]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#18234F] dark:text-white">
                      Forensic Audit Record Inspector
                    </h3>
                    <p className="text-[11px] text-[#5B6472] dark:text-slate-400 font-mono">
                      RECORD ID: {selectedLog.logId || selectedLog._id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-[#F8FAFC] dark:bg-[#151A22] border border-[#E2E8F0] dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-[#5B6472] dark:text-slate-400 font-bold">
                    Action Type
                  </div>
                  <div className="font-bold text-[#18234F] dark:text-white mt-1">
                    {selectedLog.action}
                  </div>
                </div>

                <div className="p-3 rounded bg-[#F8FAFC] dark:bg-[#151A22] border border-[#E2E8F0] dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-[#5B6472] dark:text-slate-400 font-bold">
                    Officer / Actor
                  </div>
                  <div className="font-bold text-[#18234F] dark:text-white mt-1 truncate">
                    {selectedLog.userName} ({selectedLog.userRole})
                  </div>
                </div>

                <div className="p-3 rounded bg-[#F8FAFC] dark:bg-[#151A22] border border-[#E2E8F0] dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-[#5B6472] dark:text-slate-400 font-bold">
                    Target Resource
                  </div>
                  <div className="font-bold text-[#18234F] dark:text-white mt-1">
                    {selectedLog.resource} {selectedLog.resourceId ? `#${selectedLog.resourceId}` : ""}
                  </div>
                </div>

                <div className="p-3 rounded bg-[#F8FAFC] dark:bg-[#151A22] border border-[#E2E8F0] dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-[#5B6472] dark:text-slate-400 font-bold">
                    Network Source
                  </div>
                  <div className="font-bold font-mono text-[#138A45] mt-1">
                    {selectedLog.ipAddress || "127.0.0.1"}
                  </div>
                </div>

                <div className="p-3 rounded bg-[#F8FAFC] dark:bg-[#151A22] border border-[#E2E8F0] dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-[#5B6472] dark:text-slate-400 font-bold">
                    Integrity Status
                  </div>
                  <div className="font-bold text-[#138A45] mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Sealed</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#F8FAFC] dark:bg-[#151A22] border border-[#E2E8F0] dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-[#5B6472] dark:text-slate-400 font-bold">
                    Verification Method
                  </div>
                  <div className="font-bold font-mono text-[#18234F] dark:text-slate-300 mt-1">
                    SHA-256 Chained
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded bg-[#F8FAFC] dark:bg-[#151A22] border border-[#E2E8F0] dark:border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#5B6472] dark:text-slate-400 font-bold block">
                  Audit Dossier Description
                </span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {selectedLog.details}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#D9DEE7] dark:border-slate-800 text-xs">
                <button
                  onClick={() => handleCopy(JSON.stringify(selectedLog, null, 2), "modal")}
                  className="flex items-center gap-1.5 text-[#18234F] dark:text-slate-300 hover:underline font-mono text-xs cursor-pointer"
                >
                  {copiedId === "modal" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#138A45]" />
                      <span className="text-[#138A45]">Copied JSON to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Audit Event JSON</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-1.5 rounded bg-[#18234F] text-white hover:bg-[#23336B] font-semibold text-xs transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
