import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Coins,
  Building2,
  Copy,
  MapPin,
  Clock,
  Gauge,
  CheckCircle,
  ArrowUpRight,
  Filter,
  ShieldAlert,
  Search,
  RotateCcw,
  Eye,
  Sparkles,
  Info,
  Database,
  ExternalLink,
} from "lucide-react";
import api from "../services/api";
import { AnomalyItem, Project } from "../types";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { ProjectInspectorDrawer } from "../components/civic/ProjectInspectorDrawer";

const DIMENSION_TABS = [
  { id: "ALL", label: "All Signals", icon: AlertTriangle },
  { id: "FINANCIAL", label: "Allocation Outliers", icon: Coins },
  { id: "CONTRACTOR", label: "Agency Concentration", icon: Building2 },
  { id: "DUPLICATE", label: "Scope Overlap", icon: Copy },
  { id: "GEOGRAPHIC", label: "Spatial Clusters", icon: MapPin },
  { id: "DATA_QUALITY", label: "Metadata Gaps", icon: CheckCircle },
];

export const AnomaliesPage: React.FC = () => {
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [dimensionCounts, setDimensionCounts] = useState<Record<string, number>>({});
  const [selectedDimension, setSelectedDimension] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [inspectingProject, setInspectingProject] = useState<Project | null>(null);
  const [loadingInspector, setLoadingInspector] = useState(false);
  const navigate = useNavigate();

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDimension !== "ALL") params.append("dimension", selectedDimension);
      if (severityFilter !== "ALL") params.append("severity", severityFilter);
      params.append("limit", "100");

      const res = await api.get(`/anomalies?${params.toString()}`);
      setAnomalies(res.data.data.anomalies || []);
      setDimensionCounts(res.data.data.dimensionCounts || {});
      setTotal(res.data.data.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to load anomalies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, [selectedDimension, severityFilter]);

  const handleInspectProject = async (projectId: string) => {
    setLoadingInspector(true);
    try {
      const res = await api.get(`/projects/${projectId}`);
      setInspectingProject(res.data.data.project);
    } catch (err) {
      console.error("Failed to fetch project for inspector:", err);
      navigate(`/projects/${projectId}`);
    } finally {
      setLoadingInspector(false);
    }
  };

  const filteredAnomalies = anomalies.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.projectId?.toLowerCase().includes(q) ||
      a.signal?.toLowerCase().includes(q) ||
      a.explanation?.toLowerCase().includes(q) ||
      a.district?.toLowerCase().includes(q) ||
      a.contractorName?.toLowerCase().includes(q)
    );
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-rose-100 text-[#B42318] border border-rose-300">
            CRITICAL
          </span>
        );
      case "HIGH":
        return (
          <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
            HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-300">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE7] dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#1F2A5A] font-bold">
              AI-ASSISTED REVIEW SIGNALS
            </span>
            <span className="text-slate-300">//</span>
            <span className="text-[10px] font-mono text-[#5B6472] font-semibold">
              STATISTICAL OUTLIER DETECTION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A5A] dark:text-white tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-[#B42318]" />
            <span>AI-Assisted Review Signals</span>
          </h1>
          <p className="text-xs text-[#5B6472] mt-0.5">
            Statistical observations and outlier detection to assist administrative review and prioritisation across the public-source snapshot.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <div className="px-3 py-1.5 bg-white border border-[#D9DEE7] rounded-sm text-[#1F2A5A]">
            Active Review Signals: <span className="text-[#B42318]">{total}</span>
          </div>
        </div>
      </div>

      {/* Mandatory AI Monitoring Disclaimer Alert */}
      <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] p-3.5 rounded-r-md text-xs text-[#92400E] space-y-1 shadow-2xs">
        <div className="font-bold flex items-center gap-1.5 text-sm">
          <Info className="w-4 h-4 text-[#F59E0B]" />
          <span>Statutory AI Monitoring Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          AI-assisted observations are analytical signals intended to support review and prioritisation. They do not constitute a finding of fraud, misconduct, corruption, or wrongdoing. All administrative actions require ground-truth verification of physical measurement books and vouchers by competent district authorities.
        </p>
      </div>

      {/* Dimension Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {DIMENSION_TABS.map((tab) => {
          const count =
            tab.id === "ALL"
              ? Object.values(dimensionCounts).reduce((a, b) => a + b, 0)
              : dimensionCounts[tab.id] || 0;
          const isActive = selectedDimension === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedDimension(tab.id)}
              className={`px-3 py-2 rounded-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? "bg-[#1F2A5A] text-white border-[#1F2A5A] shadow-xs"
                  : "bg-white text-slate-700 hover:bg-[#F7F8FA] border-[#D9DEE7]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-sm font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-[#F7F8FA] text-slate-600 border border-[#D9DEE7]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Severity Filters */}
      <div className="bg-white border border-[#D9DEE7] dark:border-slate-800 p-3.5 rounded-md shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search signals by work ID, description, district, or explanation..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#F7F8FA] border border-[#D9DEE7] rounded-sm text-xs focus:outline-hidden text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="p-1.5 bg-[#F7F8FA] border border-[#D9DEE7] rounded-sm text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSelectedDimension("ALL");
              setSeverityFilter("ALL");
              setSearchQuery("");
            }}
            className="p-1.5 bg-[#F7F8FA] hover:bg-slate-200 border border-[#D9DEE7] rounded-sm text-slate-600 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Signals List */}
      {loading ? (
        <LoadingSkeleton count={6} className="h-24" />
      ) : filteredAnomalies.length === 0 ? (
        <EmptyState
          title="No Review Signals Match Filters"
          description="Try broadening the selected severity level or dimension filter."
        />
      ) : (
        <div className="space-y-3">
          {filteredAnomalies.map((a) => (
            <div
              key={a.anomalyId}
              className="bg-white border border-[#D9DEE7] dark:border-slate-800 p-4 rounded-md shadow-xs hover:border-[#1F2A5A] transition-all space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DEE7] pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {getSeverityBadge(a.severity)}
                  <span className="font-mono font-bold text-[#1F2A5A] bg-[#F7F8FA] px-2 py-0.5 rounded-sm border border-[#D9DEE7]">
                    {a.projectId}
                  </span>
                  <span className="text-[#5B6472] font-mono">
                    {a.district}, {a.state}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#5B6472]">
                    Score: <strong className="text-slate-900">{a.score}/100</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInspectProject(a.projectId)}
                    className="px-2.5 py-1 bg-[#F7F8FA] hover:bg-slate-200 text-[#1F2A5A] font-semibold text-[11px] rounded-sm border border-[#D9DEE7] transition-colors cursor-pointer"
                  >
                    Inspect Work
                  </button>
                </div>
              </div>

              <div className="font-bold text-[#1F2A5A] text-sm pt-0.5">
                {a.signal}
              </div>

              <p className="text-[11px] text-[#5B6472] leading-relaxed">
                {a.explanation}
              </p>

              <div className="text-[10px] font-mono text-[#5B6472] flex items-center gap-2 pt-1 border-t border-[#D9DEE7]/50">
                <span>Rule: <strong className="text-slate-700">{a.ruleId}</strong></span>
                <span>•</span>
                <span>Dimension: <strong className="text-slate-700">{a.dimension}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side Inspector Drawer */}
      <ProjectInspectorDrawer
        project={inspectingProject}
        onClose={() => setInspectingProject(null)}
      />
    </div>
  );
};
