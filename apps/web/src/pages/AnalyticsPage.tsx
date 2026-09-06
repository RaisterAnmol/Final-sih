import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  BarChart3,
  TrendingUp,
  Activity,
  Coins,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import api from "../services/api";
import { FinancialView } from "../components/analytics/FinancialView";
import { EfficiencyView } from "../components/analytics/EfficiencyView";
import { SourceBadge } from "../components/civic/SourceBadge";

type AnalyticsTab = "FINANCIAL" | "TEMPORAL" | "EFFICIENCY";

const TABS: { key: AnalyticsTab; label: string; code: string; path: string }[] = [
  {
    key: "FINANCIAL",
    label: "Financial Analytics",
    code: "FIN-01",
    path: "/analytics/financial",
  },
  {
    key: "EFFICIENCY",
    label: "Execution Velocity",
    code: "EFF-02",
    path: "/analytics/efficiency",
  },
  {
    key: "TEMPORAL",
    label: "Temporal Sanction Rush",
    code: "TMP-03",
    path: "/analytics/temporal",
  },
];

export const AnalyticsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTabFromPath = (): AnalyticsTab => {
    if (location.pathname.includes("/efficiency")) return "EFFICIENCY";
    if (location.pathname.includes("/temporal")) return "TEMPORAL";
    return "FINANCIAL";
  };

  const [activeTab, setActiveTab] = useState<AnalyticsTab>(
    getActiveTabFromPath(),
  );
  const [finData, setFinData] = useState<any>(null);
  const [effData, setEffData] = useState<any>(null);
  const [tempData, setTempData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tabKey: AnalyticsTab) => {
    setActiveTab(tabKey);
    const target = TABS.find((t) => t.key === tabKey);
    if (target) navigate(target.path);
  };

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const [fRes, eRes, tRes] = await Promise.allSettled([
          api.get("/analytics/financial"),
          api.get("/analytics/efficiency"),
          api.get("/analytics/temporal"),
        ]);
        if (fRes.status === "fulfilled") setFinData(fRes.value.data?.data);
        if (eRes.status === "fulfilled") setEffData(eRes.value.data?.data);
        if (tRes.status === "fulfilled") setTempData(tRes.value.data?.data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const monthlyApprovalsData =
    tempData?.monthlyApprovals?.length > 0
      ? tempData.monthlyApprovals
      : [
          { month: "Apr", count: 180, fill: "#4F46E5" },
          { month: "May", count: 210, fill: "#4F46E5" },
          { month: "Jun", count: 240, fill: "#4F46E5" },
          { month: "Jul", count: 190, fill: "#4F46E5" },
          { month: "Aug", count: 220, fill: "#4F46E5" },
          { month: "Sep", count: 250, fill: "#4F46E5" },
          { month: "Oct", count: 290, fill: "#4F46E5" },
          { month: "Nov", count: 310, fill: "#4F46E5" },
          { month: "Dec", count: 340, fill: "#4F46E5" },
          { month: "Jan", count: 420, fill: "#6366F1" },
          { month: "Feb", count: 580, fill: "#F59E0B" },
          { month: "Mar (Rush Spike)", count: 1970, fill: "#EF4444" },
        ];

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-300 pb-12">
      {/* Page Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 dark:text-cyan-400 font-extrabold bg-indigo-100 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-200">
              NATIONAL MACRO INTELLIGENCE
            </span>
            <span className="text-indigo-300">//</span>
            <SourceBadge type="OFFICIAL" compact />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            {activeTab === "FINANCIAL" ? (
              <>
                <Coins className="w-7 h-7 text-indigo-600" />
                <span>Financial Intelligence & Capital Analytics</span>
              </>
            ) : activeTab === "EFFICIENCY" ? (
              <>
                <Activity className="w-7 h-7 text-blue-600" />
                <span>Execution Velocity & Progress Telemetry</span>
              </>
            ) : (
              <>
                <Calendar className="w-7 h-7 text-rose-600" />
                <span>Temporal Sanction Rush Patterns (Fiscal Spike)</span>
              </>
            )}
          </h1>
          <p className="text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-medium max-w-3xl">
            {activeTab === "FINANCIAL"
              ? "Multi-tiered expenditure dispersion, category absorption variance, and peer median divergence across 5,200 scheme works."
              : activeTab === "EFFICIENCY"
                ? "Correlation between treasury fund drawdowns and verified physical ground milestones to isolate execution anomalies."
                : "Detection of fiscal year-end budget clearance spikes and March 31 sanction rush patterns across parliamentary constituencies."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-white dark:bg-[#131823] border border-indigo-200 dark:border-slate-800 rounded-2xl p-1 text-xs shrink-0 self-start md:self-auto shadow-playful">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`relative px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-glow-blue"
                    : "text-indigo-950 dark:text-indigo-200 hover:text-indigo-600"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Views */}
      {activeTab === "FINANCIAL" && (
        <FinancialView finData={finData} loading={loading} />
      )}

      {activeTab === "EFFICIENCY" && (
        <EfficiencyView effData={effData} loading={loading} />
      )}

      {activeTab === "TEMPORAL" && (
        <div className="space-y-6">
          <div className="hud-panel p-6 rounded-3xl space-y-4 shadow-playful">
            <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-600 animate-pulse" />
                  <span>Fiscal Year-End Sanction Spike (March Phenomenon)</span>
                </h3>
                <p className="text-xs text-indigo-900/80 dark:text-indigo-300 mt-0.5 font-medium">
                  Monthly distribution of administrative approvals revealing critical year-end budget clearance rush.
                </p>
              </div>
              <span className="text-xs font-mono font-extrabold text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
                🚨 +360% March Surge
              </span>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyApprovalsData} margin={{ top: 15, right: 15, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" opacity={0.8} />
                  <XAxis dataKey="month" tick={{ fill: "#312E81", fontSize: 10, fontWeight: 700 }} />
                  <YAxis tick={{ fill: "#312E81", fontSize: 10, fontWeight: 700 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Sanctions" radius={[8, 8, 0, 0]} isAnimationActive={true} animationDuration={1600}>
                    {monthlyApprovalsData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill || "#4F46E5"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
