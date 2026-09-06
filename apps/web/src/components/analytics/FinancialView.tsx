import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { ArrowUpRight, Search, Layers, Coins, TrendingUp, AlertTriangle, CheckCircle2, Sparkles, BarChart3, PieChart } from "lucide-react";

interface FinancialViewProps {
  finData: any;
  loading: boolean;
}

const TIER_COLORS = ["#3B82F6", "#6366F1", "#8B5CF6", "#F59E0B", "#EF4444"];
const TIER_LABELS = [
  "Under ₹5L",
  "₹5L – ₹15L",
  "₹15L – ₹30L",
  "₹30L – ₹50L",
  "Above ₹50L",
];

export const FinancialView: React.FC<FinancialViewProps> = ({
  finData,
  loading,
}) => {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<
    "amount" | "multiplier" | "risk"
  >("multiplier");

  // Derive metric values from API
  const totalAlloc = finData?.totalAllocated ?? 1173200000;
  const totalUtil = finData?.totalUtilized ?? 848600000;
  const disbRate =
    totalAlloc > 0 ? ((totalUtil / totalAlloc) * 100).toFixed(1) : "72.3";
  const outlierCount = finData?.outlierCount ?? 70;
  const avgVariance = finData?.avgVariance ?? 34.2;

  // Chart data
  const rawCostDist = finData?.costDistribution || finData?.costHistogram || [];
  const costHistogramData = useMemo(() => {
    if (rawCostDist.length > 0) {
      return rawCostDist.map((item: any, idx: number) => ({
        tier: item.tier || TIER_LABELS[idx] || `Tier ${idx + 1}`,
        count: item.count,
        fill: item.fill || TIER_COLORS[idx] || "#3B82F6",
      }));
    }
    return [
      { tier: "Under ₹5L", count: 1840, fill: TIER_COLORS[0] },
      { tier: "₹5L – ₹15L", count: 2420, fill: TIER_COLORS[1] },
      { tier: "₹15L – ₹30L", count: 620, fill: TIER_COLORS[2] },
      { tier: "₹30L – ₹50L", count: 250, fill: TIER_COLORS[3] },
      { tier: "Above ₹50L", count: 70, fill: TIER_COLORS[4] },
    ];
  }, [rawCostDist]);

  const categoryData = useMemo(() => {
    if (finData?.categoryEfficiency?.length > 0) {
      return finData.categoryEfficiency.map((c: any) => ({
        category:
          c.category.length > 18
            ? `${c.category.substring(0, 16)}…`
            : c.category,
        fullName: c.category,
        allocated:
          c.allocated > 100000 ? Math.round(c.allocated / 100000) : c.allocated,
        utilized:
          c.utilized > 100000 ? Math.round(c.utilized / 100000) : c.utilized,
        rate:
          c.allocated > 0 ? Math.round((c.utilized / c.allocated) * 100) : 0,
      }));
    }
    return [
      {
        category: "Water & Sanitation",
        fullName: "Drinking Water & Sanitation",
        allocated: 3450,
        utilized: 2890,
        rate: 84,
      },
      {
        category: "Education Infra",
        fullName: "Education Infrastructure",
        allocated: 2400,
        utilized: 1980,
        rate: 83,
      },
      {
        category: "Skill Dev Centers",
        fullName: "Skill Development Centers",
        allocated: 1850,
        utilized: 1420,
        rate: 77,
      },
      {
        category: "Roads & Bridges",
        fullName: "Roads, Pathways & Bridges",
        allocated: 3100,
        utilized: 2150,
        rate: 69,
      },
      {
        category: "Rural Electrif.",
        fullName: "Rural Electrification",
        allocated: 1200,
        utilized: 740,
        rate: 62,
      },
    ];
  }, [finData]);

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-300">
      {/* 4 Flagship Animated KPI Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="card-blue p-6 rounded-3xl space-y-3 shadow-playful"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-extrabold text-blue-700 dark:text-blue-400 uppercase">
              Total Sanctioned
            </span>
            <Coins className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#0F172A] dark:text-white">
            ₹{(totalAlloc / 10000000).toFixed(2)} <span className="text-sm font-bold text-blue-700">Cr</span>
          </div>
          <div className="text-xs font-mono text-indigo-950 font-bold">
            Cumulative Pan-India Capital
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="card-emerald p-6 rounded-3xl space-y-3 shadow-playful"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-extrabold text-emerald-700 dark:text-emerald-400 uppercase">
              Capital Disbursed
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            ₹{(totalUtil / 10000000).toFixed(2)} <span className="text-sm font-bold text-emerald-700">Cr</span>
          </div>
          <div className="text-xs font-mono text-indigo-950 font-bold">
            {disbRate}% Drawdown Velocity
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="card-rose p-6 rounded-3xl space-y-3 shadow-playful"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-extrabold text-rose-700 dark:text-rose-400 uppercase">
              Cost Outliers
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce-subtle" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
            {outlierCount}
          </div>
          <div className="text-xs font-mono text-indigo-950 font-bold">
            &gt; 3.0× Standard Unit Cost
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="card-purple p-6 rounded-3xl space-y-3 shadow-playful"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-extrabold text-purple-700 dark:text-purple-400 uppercase">
              Avg Cost Variance
            </span>
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
            +{avgVariance}%
          </div>
          <div className="text-xs font-mono text-indigo-950 font-bold">
            Above Historical Baseline
          </div>
        </motion.div>
      </div>

      {/* Main Extraordinary Animated Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph 1: Animated Sector Expenditure Bar Chart */}
        <div className="hud-panel p-6 rounded-3xl space-y-4 shadow-playful">
          <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Permissible Head Capital Drawdowns</span>
              </h3>
              <p className="text-xs text-indigo-900/80 mt-0.5 font-medium">
                Sanctioned vs Disbursed capital per sector head (₹ Lakhs).
              </p>
            </div>
            <span className="text-xs font-mono font-extrabold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
              Live Animated
            </span>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 15, right: 15, left: -15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" opacity={0.8} />
                <XAxis dataKey="category" tick={{ fill: "#312E81", fontSize: 10, fontWeight: 700 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fill: "#312E81", fontSize: 10, fontWeight: 700 }} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip />
                <Bar dataKey="allocated" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Sanctioned" isAnimationActive={true} animationDuration={1400} />
                <Bar dataKey="utilized" fill="#10B981" radius={[6, 6, 0, 0]} name="Disbursed" isAnimationActive={true} animationDuration={1800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Animated Cost Bracket Histogram */}
        <div className="hud-panel p-6 rounded-3xl space-y-4 shadow-playful">
          <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                <span>Capital Sizing Distribution Tiers</span>
              </h3>
              <p className="text-xs text-indigo-900/80 mt-0.5 font-medium">
                Volume of sanctioned projects grouped by capital brackets.
              </p>
            </div>
            <span className="text-xs font-mono font-extrabold text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              5,200 Works
            </span>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costHistogramData} margin={{ top: 15, right: 15, left: -15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" opacity={0.8} />
                <XAxis dataKey="tier" tick={{ fill: "#312E81", fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fill: "#312E81", fontSize: 10, fontWeight: 700 }} />
                <Tooltip />
                <Bar dataKey="count" name="Projects" radius={[8, 8, 0, 0]} isAnimationActive={true} animationDuration={1600}>
                  {costHistogramData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
