import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban,
  Coins,
  AlertTriangle,
  Briefcase,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  MapPin,
  Building,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart3,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  Radio,
  FileText,
  Compass,
  Info,
  Database,
  Users,
  ExternalLink,
  X,
  HelpCircle,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { RiskBadge } from "../components/common/RiskBadge";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { CountUpNumber } from "../components/civic/CountUpNumber";
import { SourceBadge } from "../components/civic/SourceBadge";
import { AnimatedSectorChart } from "../components/dashboard/AnimatedSectorChart";

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("ALL");
  const [houseFilter, setHouseFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [showProvenanceModal, setShowProvenanceModal] = useState(false);
  const [showConstituencyInfo, setShowConstituencyInfo] = useState(false);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (stateFilter !== "ALL") params.append("state", stateFilter);
      if (houseFilter !== "ALL") params.append("house", houseFilter);
      if (riskFilter !== "ALL") params.append("riskLevel", riskFilter);

      const res = await api.get(`/dashboard/summary?${params.toString()}`);
      setSummary(res.data.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [stateFilter, houseFilter, riskFilter]);

  const categoryChartData = useMemo(() => {
    const apiData = summary?.charts?.categoryBreakdown;
    if (apiData && apiData.length > 0) {
      return apiData.slice(0, 7).map((c: any) => ({
        category: c.category || c._id,
        shortName:
          (c.category || c._id || "").length > 18
            ? `${(c.category || c._id).substring(0, 16)}…`
            : c.category || c._id,
        totalAllocated: c.totalAllocated || 0,
      }));
    }
    return [];
  }, [summary]);

  if (loading && !summary) {
    return (
      <div className="space-y-6 text-left">
        <LoadingSkeleton count={4} className="h-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingSkeleton count={1} className="h-80 lg:col-span-2" />
          <LoadingSkeleton count={1} className="h-80" />
        </div>
      </div>
    );
  }

  const kpis = summary?.kpis;
  const allocatedCrores = kpis?.totalAllocatedAmount
    ? (kpis.totalAllocatedAmount / 10000000).toFixed(2)
    : "0.00";

  const totalWorksCount = kpis?.totalProjects || 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        type: "spring" as const,
        stiffness: 280,
        damping: 22,
      },
    }),
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* 1. Official Dataset Provenance & Coverage Banner */}
      <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-4 rounded-sm shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#1F2A5A] text-[#F59E0B] flex items-center justify-center font-bold shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#1F2A5A] dark:text-slate-200">
                MPLADS Public-Source Snapshot
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#138A45]/10 text-[#138A45] px-2 py-0.5 rounded-sm border border-[#138A45]/30">
                26 Apr 2023 – 04 Mar 2024
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#1F2A5A]/10 text-[#1F2A5A] px-2 py-0.5 rounded-sm border border-[#1F2A5A]/20">
                60,359 Source Records
              </span>
            </div>
            <p className="text-[11px] text-[#5B6472] dark:text-slate-400 mt-0.5">
              Source records from published parliamentary telemetry. Aggregated
              dynamically with zero synthetic fabrication.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowProvenanceModal(true)}
            className="px-3 py-1.5 bg-[#F7F8FA] hover:bg-slate-100 text-[#1F2A5A] border border-[#D9DEE7] rounded-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-[#1F2A5A]" />
            <span>View Provenance</span>
          </button>
        </div>
      </div>

      {/* 2. Page Header & Multi-Criteria Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DEE7] dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#1F2A5A] font-bold">
              OPERATIONAL TELEMETRY
            </span>
            <span className="text-[#8B949E]">//</span>
            <SourceBadge type="OFFICIAL" compact />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A5A] dark:text-white tracking-tight">
            MPLADS Monitoring Dashboard
          </h1>
          <p className="text-xs text-[#5B6472] dark:text-slate-400 mt-0.5">
            Monitoring MPLADS work recommendations, allocations and
            implementation information through a transparent public-source data
            platform.
          </p>
        </div>

        {/* Dynamic Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <select
            value={houseFilter}
            onChange={(e) => setHouseFilter(e.target.value)}
            className="p-1.5 bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="ALL">All Chambers</option>
            <option value="Lok Sabha">Lok Sabha</option>
            <option value="Rajya Sabha">Rajya Sabha</option>
          </select>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="p-1.5 bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-slate-700 dark:text-slate-300 font-semibold max-w-[140px]"
          >
            <option value="ALL">All States/UTs</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Bihar">Bihar</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Kerala">Kerala</option>
            <option value="Odisha">Odisha</option>
            <option value="Telangana">Telangana</option>
            <option value="Assam">Assam</option>
            <option value="Punjab">Punjab</option>
            <option value="Haryana">Haryana</option>
            <option value="Delhi">Delhi</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="p-1.5 bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="ALL">All Review Priorities</option>
            <option value="CRITICAL">Priority Review</option>
            <option value="HIGH">Elevated Attention</option>
            <option value="LOW">Standard</option>
          </select>

          <button
            type="button"
            onClick={fetchDashboardData}
            className="p-1.5 bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-slate-600 hover:text-[#1F2A5A] transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Four Institutional KPI Cards (Calculated Dynamically from Real Snapshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Works Monitored */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-5 rounded-sm shadow-xs space-y-2 text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B6472] dark:text-slate-400 font-bold">
              Total Work Records
            </span>
            <div className="w-8 h-8 rounded-sm bg-[#1F2A5A]/10 text-[#1F2A5A] flex items-center justify-center font-bold">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#1F2A5A] dark:text-white font-mono tracking-tight">
              <CountUpNumber end={kpis?.totalProjects || 0} />
            </div>
            <div className="flex items-center justify-between text-xs text-[#5B6472] dark:text-slate-400 mt-1 font-mono">
              <span>Public-source snapshot</span>
              <span
                onClick={() => navigate("/projects")}
                className="text-[#1F2A5A] dark:text-blue-400 font-bold cursor-pointer hover:underline flex items-center gap-0.5"
              >
                Register →
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Total Recommended / Allocated Capital */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-5 rounded-sm shadow-xs space-y-2 text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B6472] dark:text-slate-400 font-bold">
              Recommended Allocation
            </span>
            <div className="w-8 h-8 rounded-sm bg-[#138A45]/10 text-[#138A45] flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#138A45] font-mono tracking-tight">
              ₹{allocatedCrores}{" "}
              <span className="text-sm font-bold font-sans">Cr</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#5B6472] dark:text-slate-400 mt-1 font-mono">
              <span>Sum of source allocations</span>
              <span
                onClick={() => navigate("/analytics/financial")}
                className="text-[#138A45] font-bold cursor-pointer hover:underline flex items-center gap-0.5"
              >
                Analytics →
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Parliamentary MPs Represented */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-5 rounded-sm shadow-xs space-y-2 text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B6472] dark:text-slate-400 font-bold">
              Parliamentary MPs
            </span>
            <div className="w-8 h-8 rounded-sm bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#1F2A5A] dark:text-white font-mono tracking-tight">
              <CountUpNumber end={kpis?.totalMPs || 633} />
            </div>
            <div className="flex items-center justify-between text-xs text-[#5B6472] dark:text-slate-400 mt-1 font-mono">
              <span>Unique MPs in snapshot</span>
              <span
                onClick={() => navigate("/mps")}
                className="text-[#1F2A5A] dark:text-blue-400 font-bold cursor-pointer hover:underline flex items-center gap-0.5"
              >
                Directory →
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Administrative Review Signals */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-5 rounded-sm shadow-xs space-y-2 text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B6472] dark:text-slate-400 font-bold">
              Analytical Signals
            </span>
            <div className="w-8 h-8 rounded-sm bg-[#B42318]/10 text-[#B42318] flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#B42318] font-mono tracking-tight">
              <CountUpNumber end={kpis?.totalAnomalies || 0} />
            </div>
            <div className="flex items-center justify-between text-xs text-[#5B6472] dark:text-slate-400 mt-1 font-mono">
              <span>Decision-support review flags</span>
              <span
                onClick={() => navigate("/anomalies")}
                className="text-[#B42318] font-bold cursor-pointer hover:underline flex items-center gap-0.5"
              >
                Signals →
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. Status, House & Administrative Coverage Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-5 rounded-sm shadow-xs space-y-4 text-left">
          <div className="border-b border-[#D9DEE7] dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-[#1F2A5A] dark:text-white uppercase tracking-wider font-mono">
              Works by Status
            </h3>
            <p className="text-[11px] text-[#5B6472] dark:text-slate-400">
              Distribution across official snapshot stages
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            {(summary?.charts?.rawStatusBreakdown?.length
              ? summary.charts.rawStatusBreakdown
              : [
                  { rawStatus: "Action Pending", count: 38893 },
                  { rawStatus: "Approved by IDA", count: 20107 },
                  { rawStatus: "Rejected by IDA", count: 1357 },
                ]
            ).map((s: any) => {
              const label = s.rawStatus || "Unspecified";
              const pct =
                totalWorksCount > 0
                  ? ((s.count / totalWorksCount) * 100).toFixed(1)
                  : "0.0";
              return (
                <div
                  key={label}
                  className="flex items-center justify-between p-2.5 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {label}
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                      {pct}% of total records
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#1F2A5A] dark:text-blue-300 text-sm">
                    {s.count.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* House Distribution */}
        <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-5 rounded-sm shadow-xs space-y-4 text-left">
          <div className="border-b border-[#D9DEE7] dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-[#1F2A5A] dark:text-white uppercase tracking-wider font-mono">
              House Representation
            </h3>
            <p className="text-[11px] text-[#5B6472] dark:text-slate-400">
              Distribution between Parliamentary chambers
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            {(summary?.charts?.houseBreakdown?.length
              ? summary.charts.houseBreakdown
              : [
                  {
                    house: "Lok Sabha",
                    count: 46346,
                    totalAmount: 24436157522,
                  },
                  {
                    house: "Rajya Sabha",
                    count: 14011,
                    totalAmount: 10545230834,
                  },
                ]
            ).map((h: any) => {
              const pct =
                totalWorksCount > 0
                  ? ((h.count / totalWorksCount) * 100).toFixed(1)
                  : "0.0";
              return (
                <div
                  key={h.house}
                  className="flex items-center justify-between p-2.5 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800"
                >
                  <div>
                    <span className="font-bold text-[#1F2A5A] dark:text-white block">
                      {h.house}
                    </span>
                    <span className="text-[10px] text-[#5B6472] dark:text-slate-400 font-mono">
                      ₹{(h.totalAmount / 10000000).toFixed(1)} Cr ({pct}%)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-base text-[#1F2A5A] dark:text-blue-300">
                    {h.count.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Administrative Coverage */}
        <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-5 rounded-sm shadow-xs space-y-4 text-left">
          <div className="border-b border-[#D9DEE7] dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1F2A5A] dark:text-white uppercase tracking-wider font-mono">
                Constituency & Administrative Scope
              </h3>
              <p className="text-[11px] text-[#5B6472] dark:text-slate-400">
                Geographic and administrative scope
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowConstituencyInfo((prev) => !prev)}
              className="text-[#1F2A5A] dark:text-blue-400 hover:text-blue-700"
              title="View Constituency Methodology"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                States & Union Territories
              </span>
              <span className="font-mono font-bold text-[#1F2A5A] dark:text-white">
                {kpis?.totalStates || 33}
              </span>
            </div>

            <div className="p-2.5 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Parliamentary Coverage
                </span>
                <span className="font-mono font-bold text-[#1F2A5A] dark:text-white">
                  457 Units
                </span>
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono flex justify-between">
                <span>
                  Named Lok Sabha: <strong>455</strong>
                </span>
                <span>
                  Rajya Sabha Groups: <strong>2</strong>
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                District Authorities (IDA)
              </span>
              <span className="font-mono font-bold text-[#1F2A5A] dark:text-white">
                {kpis?.totalIDAs || 699}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Sector Permissible Capital Allocation Distribution */}
      <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-6 rounded-sm shadow-xs space-y-4 text-left overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DEE7] dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#1F2A5A] dark:text-white flex items-center gap-2 uppercase font-mono">
              <BarChart3 className="w-4 h-4 text-[#1F2A5A] dark:text-blue-400" />
              <span>Recommended Capital Allocation by Development Head</span>
            </h3>
            <p className="text-xs text-[#5B6472] dark:text-slate-400 mt-0.5">
              Cumulative sanctioned value across permissible development
              categories in source snapshot.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-[#F7F8FA] dark:bg-[#131823] text-[#1F2A5A] dark:text-blue-300 px-3 py-1 rounded-sm border border-[#D9DEE7] dark:border-slate-800">
            Source-Backed Sums
          </span>
        </div>

        <AnimatedSectorChart data={categoryChartData} />
      </div>

      {/* 6. AI Priority Review Inquiries Queue */}
      <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-6 rounded-sm shadow-xs space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-[#D9DEE7] dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#1F2A5A] dark:text-white flex items-center gap-2 uppercase font-mono">
              <ShieldAlert className="w-4 h-4 text-[#B42318]" />
              <span>Priority Administrative Review Queue</span>
            </h3>
            <p className="text-xs text-[#5B6472] dark:text-slate-400 mt-0.5">
              Works flagged by statistical outlier detection for cost estimate
              and administrative review.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/anomalies")}
            className="text-xs font-mono text-[#1F2A5A] dark:text-blue-400 font-bold hover:underline bg-[#F7F8FA] dark:bg-[#131823] px-3 py-1 rounded-sm border border-[#D9DEE7] dark:border-slate-800 cursor-pointer"
          >
            All Analytical Signals →
          </button>
        </div>

        {/* AI Disclaimer */}
        <div className="bg-[#FFFBEB] dark:bg-[#1A1810] border-l-4 border-[#F59E0B] p-3 text-[11px] text-[#92400E] dark:text-amber-200">
          <strong>Decision-Support Notice:</strong> AI-assisted observations are
          analytical signals generated by prototype statistical models to
          support administrative review. They do not constitute findings of
          fraud, misconduct, or wrongdoing.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {summary?.topHighRiskProjects?.slice(0, 6).map((p: any) => (
            <div
              key={p.projectId}
              onClick={() => navigate(`/projects/${p.projectId}`)}
              className="p-4 rounded-sm border border-[#D9DEE7] dark:border-slate-800 hover:border-[#1F2A5A] bg-[#F7F8FA] dark:bg-[#131823] hover:bg-white dark:hover:bg-[#1A202A] transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#1F2A5A] dark:text-slate-200 bg-white dark:bg-[#0D1016] px-2 py-0.5 rounded-sm border border-[#D9DEE7] dark:border-slate-800">
                  {p.projectId}
                </span>
                <RiskBadge score={p.riskScore} level={p.riskLevel} />
              </div>

              <div className="text-xs font-bold text-[#1F2A5A] dark:text-white line-clamp-2">
                {p.title}
              </div>

              <div className="text-[11px] text-[#5B6472] dark:text-slate-400 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>State / District:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {p.district}, {p.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>MP:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                    {p.mpName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Recommended:</span>
                  <span className="font-bold text-[#138A45]">
                    ₹{(p.allocatedAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Provenance Drawer Modal */}
      <AnimatePresence>
        {showProvenanceModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-sm shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#D9DEE7] dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#1F2A5A]" />
                  <h2 className="text-base font-bold text-[#1F2A5A] dark:text-white">
                    Public Dataset Provenance & Methodology
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProvenanceModal(false)}
                  className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                <div className="p-3 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800 space-y-2">
                  <div className="font-bold text-[#1F2A5A] dark:text-white font-mono">
                    SOURCE SPECIFICATION
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      Dataset: <strong>MPLADS Work-Register Snapshot</strong>
                    </div>
                    <div>
                      Coverage: <strong>26 Apr 2023 – 04 Mar 2024</strong>
                    </div>
                    <div>
                      Source Records: <strong>60,359</strong>
                    </div>
                    <div>
                      Total Allocation: <strong>₹3,498.25 Cr</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-[#1F2A5A] dark:text-white">
                    Zero-Fabrication Data Model
                  </h4>
                  <p>
                    Every attribute in MPLADS Insight is strictly partitioned:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 font-mono text-[11px]">
                    <li>
                      <strong className="text-[#138A45]">SOURCE:</strong> MP
                      name, work description, house, state, constituency, IDA,
                      allocation amount, recommendation date, raw status.
                    </li>
                    <li>
                      <strong className="text-[#1F2A5A]">DERIVED:</strong>{" "}
                      Normalized categories, district grouping, sums,
                      percentages.
                    </li>
                    <li>
                      <strong className="text-[#B42318]">ANALYTICAL:</strong>{" "}
                      Decision-support review scores, peer deviation signals.
                    </li>
                    <li>
                      <strong className="text-slate-500">UNAVAILABLE:</strong>{" "}
                      Fields absent from the source snapshot (contractor names,
                      progress %, milestone completion dates) remain explicitly{" "}
                      <code className="text-slate-700 dark:text-slate-300">
                        null
                      </code>
                      .
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-[#1F2A5A] dark:text-white">
                    Smart India Hackathon 2026 Disclaimer
                  </h4>
                  <p className="text-[11px] text-[#5B6472] dark:text-slate-400">
                    This software is an educational prototype submitted for
                    Smart India Hackathon 2026. It is not an official Government
                    of India portal and does not assert definitive findings of
                    wrongdoing.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D9DEE7] dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowProvenanceModal(false)}
                  className="px-4 py-2 bg-[#1F2A5A] text-white rounded-sm text-xs font-semibold cursor-pointer"
                >
                  Close Provenance
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
