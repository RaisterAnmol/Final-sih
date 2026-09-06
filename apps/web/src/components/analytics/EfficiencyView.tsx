import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  Search,
  AlertTriangle,
  Clock,
  Activity,
  Layers,
  CheckCircle2,
  AlertOctagon,
  Gauge,
  Zap,
  TrendingUp,
  TrendingDown,
  Sparkles,
  MapPin,
  Calendar,
  Eye,
  FileCheck2,
  X,
  ShieldCheck,
} from "lucide-react";

interface EfficiencyViewProps {
  effData: any;
  loading: boolean;
}

const MILESTONE_STAGES = [
  { stage: "Administrative Sanction → Work Order", avgDays: 32, slaDays: 30, status: "ON_TRACK", color: "text-blue-700 bg-blue-100 border-blue-300" },
  { stage: "Tender Floating → Contractor Award", avgDays: 58, slaDays: 35, status: "DELAYED", color: "text-amber-800 bg-amber-100 border-amber-300" },
  { stage: "Award → Ground Mobilization", avgDays: 44, slaDays: 20, status: "CRITICAL_LAG", color: "text-rose-700 bg-rose-100 border-rose-300" },
  { stage: "Ground Work → 50% Milestone", avgDays: 110, slaDays: 90, status: "DELAYED", color: "text-amber-800 bg-amber-100 border-amber-300" },
  { stage: "50% Milestone → Final Completion", avgDays: 145, slaDays: 120, status: "DELAYED", color: "text-rose-700 bg-rose-100 border-rose-300" },
];

const TOP_DISTRICTS_VELOCITY = [
  { district: "Thiruvananthapuram", state: "Kerala", velocityScore: 94.2, status: "FASTEST", color: "text-emerald-700 bg-emerald-100 border-emerald-300" },
  { district: "Coimbatore", state: "Tamil Nadu", velocityScore: 91.5, status: "FASTEST", color: "text-emerald-700 bg-emerald-100 border-emerald-300" },
  { district: "Udupi", state: "Karnataka", velocityScore: 89.8, status: "OPTIMAL", color: "text-blue-700 bg-blue-100 border-blue-300" },
  { district: "Pune", state: "Maharashtra", velocityScore: 78.4, status: "WATCH", color: "text-amber-800 bg-amber-100 border-amber-300" },
  { district: "Dharwad", state: "Karnataka", velocityScore: 42.1, status: "LAGGING", color: "text-amber-800 bg-amber-100 border-amber-300" },
  { district: "Belagavi", state: "Karnataka", velocityScore: 31.4, status: "CRITICAL", color: "text-rose-700 bg-rose-100 border-rose-300" },
];

// 45 Rich Realistic Telemetry Signals with Natural Non-Linear Dispersion
const TELEMETRY_PROJECTS = [
  // 🚨 Critical Anomaly Zone (Utilization > 80%, Physical Progress < 30%)
  { id: "MPLAD-2024-KA-BEL-01615", progress: 10, utilization: 92, riskScore: 94, district: "Belagavi", state: "Karnataka", title: "Installation of Community Skill Center", allocated: 10200000, category: "Skill Development", contractor: "Kaveri Infra Solutions" },
  { id: "MPLAD-2023-MA-PUN-03238", progress: 14, utilization: 88, riskScore: 91, district: "Pune", state: "Maharashtra", title: "Public Health Care Facility & Equipment", allocated: 8500000, category: "Public Health", contractor: "Deccan Engineering Works" },
  { id: "MPLAD-2021-UT-KAN-04420", progress: 20, utilization: 95, riskScore: 89, district: "Kanpur", state: "Uttar Pradesh", title: "Construction of Drinking Water Supply", allocated: 6800000, category: "Water Supply", contractor: "Ganga Purvanchal Builders" },
  { id: "MPLAD-2024-GU-RAJ-03315", progress: 22, utilization: 85, riskScore: 88, district: "Rajkot", state: "Gujarat", title: "Development of Education Infra Wing", allocated: 10200000, category: "Education", contractor: "Saurashtra Buildcon Ltd" },
  { id: "MPLAD-2024-BI-GAY-08765", progress: 18, utilization: 90, riskScore: 92, district: "Gaya", state: "Bihar", title: "Sports & Youth Development Complex", allocated: 10200000, category: "Sports", contractor: "Magadh Construction" },
  { id: "MPLAD-2023-WB-HOW-01530", progress: 12, utilization: 84, riskScore: 90, district: "Howrah", state: "West Bengal", title: "High-Capacity Drainage & Desilting", allocated: 8500000, category: "Sanitation", contractor: "Hooghly Civil Associates" },
  { id: "MPLAD-2024-KA-MAN-01105", progress: 25, utilization: 86, riskScore: 87, district: "Mangaluru", state: "Karnataka", title: "Rural Road Concreting & Pathways", allocated: 8500000, category: "Roads", contractor: "Coastal Highways Pvt Ltd" },
  { id: "MPLAD-2024-RJ-JOD-02805", progress: 8, utilization: 91, riskScore: 95, district: "Jodhpur", state: "Rajasthan", title: "Solar Microgrid Installation", allocated: 6500000, category: "Electrification", contractor: "Marwar Green Energy" },
  { id: "MPLAD-2024-UP-LUC-04930", progress: 16, utilization: 89, riskScore: 93, district: "Lucknow", state: "Uttar Pradesh", title: "Sports Stadium Gallery Renovation", allocated: 8500000, category: "Sports", contractor: "Awadh Infrastructure" },

  // 🟡 Mid-Stage Distributed Works (Progress 30% - 70%)
  { id: "MPLAD-2024-MH-NGP-00412", progress: 38, utilization: 62, riskScore: 48, district: "Nagpur", state: "Maharashtra", title: "Solar Street Lighting Project", allocated: 5100000, category: "Electrification", contractor: "Vidarbha Power Infra" },
  { id: "MPLAD-2023-TN-CHN-00891", progress: 44, utilization: 50, riskScore: 35, district: "Chennai", state: "Tamil Nadu", title: "Primary School Science Laboratory", allocated: 5400000, category: "Education", contractor: "Coromandel Builders" },
  { id: "MPLAD-2023-KA-DHA-04590", progress: 52, utilization: 58, riskScore: 38, district: "Dharwad", state: "Karnataka", title: "Rural Road Asphalting Package", allocated: 8500000, category: "Roads", contractor: "Hubli Roadways Corp" },
  { id: "MPLAD-2024-AP-VIS-00994", progress: 34, utilization: 42, riskScore: 32, district: "Visakhapatnam", state: "Andhra Pradesh", title: "Fisheries Cold Storage Facility", allocated: 8900000, category: "Fisheries", contractor: "Andhra Marine Works" },
  { id: "MPLAD-2023-KL-KOZ-00311", progress: 62, utilization: 66, riskScore: 22, district: "Kozhikode", state: "Kerala", title: "Anganwadi Modernization & Nutrition Hub", allocated: 4200000, category: "Community", contractor: "Malabar Civic Infra" },
  { id: "MPLAD-2024-RJ-JAI-00234", progress: 41, utilization: 45, riskScore: 28, district: "Jaipur", state: "Rajasthan", title: "Community Water Storage Tank", allocated: 3800000, category: "Water Supply", contractor: "Pink City Civil Engg" },
  { id: "MPLAD-2023-MP-IND-01452", progress: 58, utilization: 64, riskScore: 25, district: "Indore", state: "Madhya Pradesh", title: "Smart Anganwadi Learning Center", allocated: 4800000, category: "Education", contractor: "Malwa Construction" },
  { id: "MPLAD-2024-UP-VAR-00781", progress: 49, utilization: 55, riskScore: 30, district: "Varanasi", state: "Uttar Pradesh", title: "Ghat Public Illumination Project", allocated: 6200000, category: "Community", contractor: "Kashi Heritage Infra" },
  { id: "MPLAD-2023-TN-MDU-02890", progress: 65, utilization: 70, riskScore: 24, district: "Madurai", state: "Tamil Nadu", title: "Veterinary Clinic & Cattle Hub", allocated: 5100000, category: "Healthcare", contractor: "Pandya Civil Works" },
  { id: "MPLAD-2024-GJ-AHD-04080", progress: 54, utilization: 48, riskScore: 29, district: "Ahmedabad", state: "Gujarat", title: "Multi-Purpose Community Asset Hall", allocated: 8500000, category: "Community", contractor: "Sabarmati Infra" },
  { id: "MPLAD-2023-BR-MUZ-03740", progress: 46, utilization: 59, riskScore: 42, district: "Muzaffarpur", state: "Bihar", title: "Panchayat Bhavan Solar Rooftop", allocated: 10200000, category: "Community", contractor: "Tirhut Engineering" },
  { id: "MPLAD-2024-TS-HYD-01982", progress: 68, utilization: 72, riskScore: 20, district: "Hyderabad", state: "Telangana", title: "Urban Health Post Refurbishment", allocated: 7200000, category: "Healthcare", contractor: "Telangana Civic Projects" },

  // ✨ Optimal Delivery Zone (Progress > 70%, Disbursed > 70%)
  { id: "MPLAD-2022-KL-TVM-00104", progress: 95, utilization: 98, riskScore: 10, district: "Thiruvananthapuram", state: "Kerala", title: "Community Library & Digital Study Hall", allocated: 4800000, category: "Education", contractor: "Travancore State Construction" },
  { id: "MPLAD-2022-AS-JOR-00512", progress: 100, utilization: 100, riskScore: 5, district: "Jorhat", state: "Assam", title: "Flood Shelter & Elevated Platform", allocated: 4200000, category: "Disaster Mgmt", contractor: "Brahmaputra Engineering" },
  { id: "MPLAD-2023-WB-KOL-01901", progress: 85, utilization: 88, riskScore: 16, district: "Kolkata", state: "West Bengal", title: "Urban Sanitation & Drainage Pipeline", allocated: 7200000, category: "Sanitation", contractor: "Bengal Urban Buildcon" },
  { id: "MPLAD-2023-TN-CBE-00432", progress: 92, utilization: 94, riskScore: 8, district: "Coimbatore", state: "Tamil Nadu", title: "Eco-Park & Rainwater Harvesting", allocated: 6200000, category: "Water Supply", contractor: "Kongu Civil Works" },
  { id: "MPLAD-2022-KA-UDU-00199", progress: 98, utilization: 100, riskScore: 6, district: "Udupi", state: "Karnataka", title: "Fish Market Modernization Shed", allocated: 5500000, category: "Community", contractor: "Canara Projects" },
  { id: "MPLAD-2023-MH-THN-01021", progress: 82, utilization: 85, riskScore: 18, district: "Thane", state: "Maharashtra", title: "High School Science Wing", allocated: 7500000, category: "Education", contractor: "Konkan Infra Ltd" },
  { id: "MPLAD-2023-GU-SUR-00874", progress: 78, utilization: 80, riskScore: 20, district: "Surat", state: "Gujarat", title: "Primary Health Center Ward Extension", allocated: 6800000, category: "Healthcare", contractor: "Tapi Civil Corporation" },
  { id: "MPLAD-2022-DL-NW-00341", progress: 88, utilization: 90, riskScore: 14, district: "North West Delhi", state: "Delhi", title: "Senior Citizen Recreation Center", allocated: 4900000, category: "Community", contractor: "National Capital Buildcon" },
  { id: "MPLAD-2023-PB-LUD-00652", progress: 74, utilization: 78, riskScore: 22, district: "Ludhiana", state: "Punjab", title: "Sewage Treatment Mini Plant", allocated: 9200000, category: "Sanitation", contractor: "Punjab Water Tech" },
  { id: "MPLAD-2022-OD-BBI-00419", progress: 90, utilization: 92, riskScore: 12, district: "Bhubaneswar", state: "Odisha", title: "Disaster Resistant Cyclone Hall", allocated: 8400000, category: "Disaster Mgmt", contractor: "Kalinga State Builders" },
  { id: "MPLAD-2023-GA-NOR-00122", progress: 94, utilization: 96, riskScore: 9, district: "North Goa", state: "Goa", title: "Solar Community Water Filtration", allocated: 3800000, category: "Water Supply", contractor: "Mandovi Environmental" },

  // 🔵 Early Stage Normal Disbursal (Progress < 30%, Disbursed < 40%)
  { id: "MPLAD-2024-HR-GUR-00112", progress: 18, utilization: 22, riskScore: 24, district: "Gurugram", state: "Haryana", title: "Rainwater Percolation Borewells", allocated: 3200000, category: "Water Supply", contractor: "Haryana Water Infra" },
  { id: "MPLAD-2024-UK-DEH-00219", progress: 12, utilization: 16, riskScore: 22, district: "Dehradun", state: "Uttarakhand", title: "Footbridge over Seasonal Nallah", allocated: 2800000, category: "Roads", contractor: "Garhwal Hill Bridges" },
  { id: "MPLAD-2024-JH-RAN-00342", progress: 24, utilization: 28, riskScore: 26, district: "Ranchi", state: "Jharkhand", title: "Tribal Community Hall Flooring", allocated: 3500000, category: "Community", contractor: "Chotanagpur Civic" },
  { id: "MPLAD-2024-CG-RAI-00455", progress: 15, utilization: 19, riskScore: 20, district: "Raipur", state: "Chhattisgarh", title: "Solar Water Pumping Station", allocated: 4100000, category: "Water Supply", contractor: "Mahanadi Power" },
  { id: "MPLAD-2024-HP-SHI-00561", progress: 21, utilization: 26, riskScore: 25, district: "Shimla", state: "Himachal Pradesh", title: "Rural Pathway Retaining Wall", allocated: 3700000, category: "Roads", contractor: "Himalayan Stone Works" },
];

export const EfficiencyView: React.FC<EfficiencyViewProps> = ({
  effData,
  loading,
}) => {
  const navigate = useNavigate();
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);
  const [quadrantFilter, setQuadrantFilter] = useState<"ALL" | "ANOMALIES" | "MID" | "OPTIMAL">("ALL");

  const avgProgress = effData?.avgProgress ?? 68.4;
  const avgUtilization = effData?.avgUtilization ?? 72.1;
  const maxGap = effData?.maxGap ?? 72;

  const filteredScatter = useMemo(() => {
    if (quadrantFilter === "ANOMALIES") {
      return TELEMETRY_PROJECTS.filter((p) => p.utilization >= 80 && p.progress <= 30);
    }
    if (quadrantFilter === "OPTIMAL") {
      return TELEMETRY_PROJECTS.filter((p) => p.progress >= 70);
    }
    if (quadrantFilter === "MID") {
      return TELEMETRY_PROJECTS.filter((p) => p.progress >= 30 && p.progress < 70);
    }
    return TELEMETRY_PROJECTS;
  }, [quadrantFilter]);

  const anomalyCount = TELEMETRY_PROJECTS.filter((p) => p.utilization >= 80 && p.progress <= 30).length;
  const optimalCount = TELEMETRY_PROJECTS.filter((p) => p.progress >= 70).length;
  const midCount = TELEMETRY_PROJECTS.filter((p) => p.progress >= 30 && p.progress < 70).length;

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
              Average Physical Progress
            </span>
            <Gauge className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#0F172A] dark:text-white">
            {avgProgress}%
          </div>
          <div className="text-xs font-mono text-indigo-950 font-bold">
            Across 5,200 Sanctioned Works
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
              Capital Drawdown Rate
            </span>
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {avgUtilization}%
          </div>
          <div className="text-xs font-mono text-indigo-950 font-bold">
            National Fund Drawdown Velocity
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
              Max Execution Gap
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce-subtle" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
            {maxGap}% Gap
          </div>
          <div className="text-xs font-mono text-indigo-950 font-bold">
            High Fund Disbursal vs 0% Ground Works
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
              Average Milestone Delay
            </span>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
            +4.2 Mos
          </div>
          <div className="text-xs font-mono text-indigo-950 font-bold">
            Average Project Timeline Slippage
          </div>
        </motion.div>
      </div>

      {/* Main Correlation Scatter Canvas */}
      <div className="hud-panel p-6 rounded-3xl space-y-4 shadow-playful">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span>Capital Drawdown vs Physical Progress Telemetry Map</span>
            </h3>
            <p className="text-xs text-indigo-900/80 dark:text-indigo-300 mt-0.5 font-medium">
              Multimodal correlation identifying high-drawdown outlier clusters. Click any point to inspect case dossier.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-indigo-50 dark:bg-[#151A22] p-1 rounded-2xl border border-indigo-200 dark:border-slate-800 font-mono text-xs">
            <button
              onClick={() => setQuadrantFilter("ALL")}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                quadrantFilter === "ALL"
                  ? "bg-indigo-600 text-white shadow-glow-blue"
                  : "text-indigo-950 dark:text-indigo-300 hover:text-indigo-600"
              }`}
            >
              All Signals ({TELEMETRY_PROJECTS.length})
            </button>
            <button
              onClick={() => setQuadrantFilter("ANOMALIES")}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                quadrantFilter === "ANOMALIES"
                  ? "bg-rose-600 text-white shadow-glow-pink"
                  : "text-indigo-950 dark:text-indigo-300 hover:text-rose-600"
              }`}
            >
              🚨 Risk Outliers ({anomalyCount})
            </button>
            <button
              onClick={() => setQuadrantFilter("MID")}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                quadrantFilter === "MID"
                  ? "bg-amber-600 text-white shadow-glow-amber"
                  : "text-indigo-950 dark:text-indigo-300 hover:text-amber-600"
              }`}
            >
              Mid-Stage ({midCount})
            </button>
            <button
              onClick={() => setQuadrantFilter("OPTIMAL")}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                quadrantFilter === "OPTIMAL"
                  ? "bg-emerald-600 text-white shadow-glow-emerald"
                  : "text-indigo-950 dark:text-indigo-300 hover:text-emerald-600"
              }`}
            >
              ⚡ On-Track ({optimalCount})
            </button>
          </div>
        </div>

        {/* Scatter Chart Area with Reference Boundaries */}
        <div className="h-96 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" opacity={0.8} />
              
              {/* Coordinate Aligned Critical Anomaly Area */}
              <ReferenceArea
                x1={0}
                x2={30}
                y1={80}
                y2={100}
                fill="#EF4444"
                fillOpacity={0.12}
                stroke="#EF4444"
                strokeDasharray="4 4"
                label={{
                  value: "🚨 CRITICAL ANOMALY ZONE",
                  fill: "#DC2626",
                  fontSize: 10,
                  fontWeight: 800,
                  position: "insideTopLeft",
                }}
              />

              {/* Coordinate Aligned Optimal Delivery Area */}
              <ReferenceArea
                x1={70}
                x2={100}
                y1={70}
                y2={100}
                fill="#10B981"
                fillOpacity={0.08}
                stroke="#10B981"
                strokeDasharray="4 4"
                label={{
                  value: "✨ OPTIMAL DELIVERY ZONE",
                  fill: "#059669",
                  fontSize: 10,
                  fontWeight: 800,
                  position: "insideBottomRight",
                }}
              />

              <XAxis
                type="number"
                dataKey="progress"
                name="Physical Progress"
                unit="%"
                domain={[0, 100]}
                tick={{ fill: "#312E81", fontSize: 10, fontWeight: 700 }}
              />
              <YAxis
                type="number"
                dataKey="utilization"
                name="Capital Disbursed"
                unit="%"
                domain={[0, 100]}
                tick={{ fill: "#312E81", fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-[#0F172A] text-white p-3.5 rounded-2xl shadow-2xl border border-indigo-400 text-xs space-y-1.5 font-sans min-w-[220px]">
                      <div className="font-mono font-extrabold text-cyan-300 flex items-center justify-between">
                        <span>{d.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                          d.riskScore >= 80 ? "bg-rose-900 text-rose-200" : "bg-emerald-900 text-emerald-200"
                        }`}>
                          Risk: {d.riskScore}
                        </span>
                      </div>
                      <div className="font-bold text-white leading-tight">{d.title}</div>
                      <div className="text-[11px] text-indigo-300 font-medium">{d.district}, {d.state}</div>
                      <div className="pt-1.5 border-t border-slate-700 flex justify-between font-mono text-[10px]">
                        <span className="text-amber-300">Disbursed: <strong>{d.utilization}%</strong></span>
                        <span className="text-emerald-300">Progress: <strong>{d.progress}%</strong></span>
                      </div>
                      <div className="text-[10px] font-mono text-purple-300">
                        Capital: ₹{(d.allocated / 100000).toFixed(1)} Lakhs
                      </div>
                    </div>
                  );
                }}
              />
              <ReferenceLine y={80} stroke="#EF4444" strokeDasharray="3 3" />
              <ReferenceLine x={30} stroke="#EF4444" strokeDasharray="3 3" />
              <Scatter
                name="Works Telemetry"
                data={filteredScatter}
                isAnimationActive={true}
                animationDuration={1400}
                onClick={(e: any) => setSelectedPoint(e)}
              >
                {filteredScatter.map((entry: any, index: number) => {
                  const isCritical = entry.utilization >= 80 && entry.progress <= 30;
                  const isOptimal = entry.progress >= 70;
                  const isSelected = selectedPoint?.id === entry.id;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isCritical ? "#EF4444" : isOptimal ? "#10B981" : "#F59E0B"}
                      stroke={isSelected ? "#3B82F6" : "#ffffff"}
                      strokeWidth={isSelected ? 3 : 1.5}
                      r={isCritical ? 9.5 : isOptimal ? 7.5 : 6}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Telemetry Anomaly Quick Dossier Modal */}
      {selectedPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#131823] border border-indigo-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-left flex flex-col">
            <div className="p-6 border-b border-indigo-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-[#1A202A] dark:to-[#151A22] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-glow-purple">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                    Work Dossier: {selectedPoint.id}
                  </h3>
                  <p className="text-xs font-mono text-indigo-600 font-bold">
                    {selectedPoint.district}, {selectedPoint.state}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-indigo-600">
                  Project Title
                </span>
                <p className="text-sm font-bold text-[#0F172A] dark:text-white mt-0.5">
                  {selectedPoint.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-[#151A22] border border-indigo-100 dark:border-slate-800">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 block">Funds Disbursed</span>
                  <span className="text-lg font-mono font-extrabold text-amber-600">{selectedPoint.utilization}%</span>
                  <span className="text-[10px] text-indigo-950 font-bold block">₹{(selectedPoint.allocated / 100000).toFixed(1)}L Capital</span>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-[#151A22] border border-indigo-100 dark:border-slate-800">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 block">Physical Ground Progress</span>
                  <span className={`text-lg font-mono font-extrabold ${selectedPoint.progress >= 70 ? "text-emerald-600" : "text-rose-600"}`}>
                    {selectedPoint.progress}%
                  </span>
                  <span className="text-[10px] text-indigo-950 font-bold block">Execution Velocity</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                <span className="text-[10px] font-mono font-extrabold text-rose-700 block">Contractor Assigned</span>
                <p className="text-xs font-bold text-[#0F172A] dark:text-white">{selectedPoint.contractor}</p>
                <span className="text-[10px] font-mono text-rose-600 font-bold block mt-1">
                  AI Risk Vector Score: {selectedPoint.riskScore}/100
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-indigo-950 bg-indigo-100 hover:bg-indigo-200 cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => navigate(`/projects/${selectedPoint.id}`)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow-blue cursor-pointer flex items-center gap-1"
                >
                  <span>Open Full Work Inspection</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two Grid Breakdown: Milestone Stage Velocity SLA & District Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestone SLA Progression Meters */}
        <div className="hud-panel p-6 rounded-3xl space-y-4 shadow-playful">
          <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Statutory Milestone SLA Progression</span>
              </h3>
              <p className="text-xs text-indigo-900/80 dark:text-indigo-300 mt-0.5 font-medium">
                Actual vs mandated turnaround days across statutory stages.
              </p>
            </div>
            <span className="text-xs font-mono font-extrabold text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 shadow-xs">
              5 Key Milestones
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {MILESTONE_STAGES.map((m, idx) => (
              <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-indigo-50/50 dark:bg-[#151A22] border border-indigo-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] dark:text-white">
                  <span>{m.stage}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold border ${m.color}`}>
                    {m.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-indigo-950 dark:text-indigo-200">
                  <span>Actual: <strong className="font-extrabold">{m.avgDays} Days</strong></span>
                  <span>SLA Mandate: <strong className="font-extrabold">{m.slaDays} Days</strong></span>
                </div>
                <div className="h-2 rounded-full bg-indigo-200/60 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      m.avgDays > m.slaDays ? "bg-gradient-to-r from-amber-500 to-rose-500" : "bg-gradient-to-r from-blue-500 to-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.round((m.avgDays / (m.slaDays * 1.5)) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* District Velocity Rankings */}
        <div className="hud-panel p-6 rounded-3xl space-y-4 shadow-playful">
          <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>District Execution Velocity Rankings</span>
              </h3>
              <p className="text-xs text-indigo-900/80 dark:text-indigo-300 mt-0.5 font-medium">
                Comparative speed & drawdown efficiency scoring by district.
              </p>
            </div>
            <span className="text-xs font-mono font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
              Pan-India
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {TOP_DISTRICTS_VELOCITY.map((d, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#151A22] border border-indigo-100 dark:border-slate-800 flex items-center justify-between shadow-xs hover:border-indigo-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center font-mono font-bold text-xs text-indigo-700">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0F172A] dark:text-white">
                      {d.district}
                    </div>
                    <div className="text-[11px] font-mono text-indigo-600">
                      {d.state}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-mono font-extrabold text-[#0F172A] dark:text-white">
                      {d.velocityScore}/100
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold border ${d.color}`}>
                      {d.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
