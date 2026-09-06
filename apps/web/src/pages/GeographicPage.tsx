import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Layers,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Filter,
  CheckCircle2,
  FolderKanban,
  Coins,
  Search,
  Compass,
  Eye,
  TrendingUp,
  Gauge,
  Zap,
  BarChart3,
  Sparkles,
  RefreshCw,
  Globe,
  LocateFixed,
  Radio,
  SlidersHorizontal,
} from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import api from "../services/api";
import { District } from "../types";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { SourceBadge } from "../components/civic/SourceBadge";
import { CountUpNumber } from "../components/civic/CountUpNumber";

// Helper component to smoothly center map on selected district
const MapFlyTo: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 7 }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

export const GeographicPage: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("ALL");
  const [riskTierFilter, setRiskTierFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDistrict, setActiveDistrict] = useState<District | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([21.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);

  const fetchDistricts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedState !== "ALL") params.append("state", selectedState);
      const res = await api.get(`/districts?${params.toString()}`);
      const districtList = res.data.data.districts || [];
      setDistricts(districtList);
      if (districtList.length > 0 && !activeDistrict) {
        // Default to highest risk district
        const highestRisk = [...districtList].sort((a, b) => b.averageRiskScore - a.averageRiskScore)[0];
        setActiveDistrict(highestRisk || districtList[0]);
      }
    } catch (err) {
      console.error("Failed to load districts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, [selectedState]);

  // Filtered districts according to risk tier and search
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      // Risk tier filter
      if (riskTierFilter === "CRITICAL" && d.averageRiskScore < 50 && d.highRiskProjectsCount === 0) return false;
      if (riskTierFilter === "HIGH" && (d.averageRiskScore < 30 || d.averageRiskScore >= 50)) return false;
      if (riskTierFilter === "LOW" && d.averageRiskScore >= 30) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          d.district.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [districts, riskTierFilter, searchQuery]);

  // High-level aggregate statistics
  const stats = useMemo(() => {
    const totalDistrictsCount = districts.length;
    const totalProjectsSum = districts.reduce((acc, d) => acc + (d.totalProjects || 0), 0);
    const totalAllocatedSum = districts.reduce((acc, d) => acc + (d.totalAllocated || 0), 0);
    const totalUtilizedSum = districts.reduce((acc, d) => acc + (d.totalUtilized || 0), 0);
    const totalHighRiskWorks = districts.reduce((acc, d) => acc + (d.highRiskProjectsCount || 0), 0);
    const criticalDistrictsCount = districts.filter(
      (d) => d.averageRiskScore >= 50 || d.highRiskProjectsCount > 0
    ).length;
    const avgRisk =
      districts.length > 0
        ? Math.round(
            (districts.reduce((a, b) => a + (b.averageRiskScore || 0), 0) / districts.length) * 10
          ) / 10
        : 0;
    const utilizationRate =
      totalAllocatedSum > 0 ? Math.round((totalUtilizedSum / totalAllocatedSum) * 100) : 0;

    return {
      totalDistrictsCount,
      totalProjectsSum,
      totalAllocatedSum,
      totalUtilizedSum,
      totalHighRiskWorks,
      criticalDistrictsCount,
      avgRisk,
      utilizationRate,
    };
  }, [districts]);

  // Top 5 Hotspots for Quick Access Rail
  const topHotspots = useMemo(() => {
    return [...districts]
      .sort((a, b) => b.averageRiskScore - a.averageRiskScore || b.highRiskProjectsCount - a.highRiskProjectsCount)
      .slice(0, 5);
  }, [districts]);

  const handleSelectDistrict = (district: District) => {
    setActiveDistrict(district);
    if (district.latitude && district.longitude) {
      setMapCenter([district.latitude, district.longitude]);
      setMapZoom(8);
    }
  };

  const resetMap = () => {
    setMapCenter([21.5937, 78.9629]);
    setMapZoom(5);
  };

  const getRiskColor = (riskScore: number, highRiskCount: number) => {
    if (riskScore >= 50 || highRiskCount > 5) {
      return {
        fill: "#EF4444",
        border: "#DC2626",
        badge: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
        label: "CRITICAL RISK",
        ring: "ring-rose-500/50",
      };
    }
    if (riskScore >= 30 || highRiskCount > 0) {
      return {
        fill: "#F59E0B",
        border: "#D97706",
        badge: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        label: "ELEVATED RISK",
        ring: "ring-amber-500/50",
      };
    }
    return {
      fill: "#10B981",
      border: "#059669",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
      label: "HEALTHY SPREAD",
      ring: "ring-emerald-500/50",
    };
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
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-10">
      {/* Header & Spatial Intelligence Tag */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-indigo-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 dark:text-cyan-400 font-extrabold bg-indigo-100 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-200">
              NATIONAL GIS TELEMETRY
            </span>
            <span className="text-indigo-300">//</span>
            <SourceBadge type="OFFICIAL" compact />
            <span className="text-indigo-300">//</span>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-extrabold bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>SPATIAL CLUSTERING ACTIVE</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-glow-blue shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span>Spatial GIS & Constituency Risk Canvas</span>
          </h1>
          <p className="text-xs text-indigo-900/80 dark:text-indigo-300 mt-1.5 font-medium">
            High-fidelity geospatial map displaying fund dispersion, contractor concentrations, and anomaly hot-spots across India's parliamentary territories.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={resetMap}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#131823] hover:bg-indigo-50 dark:hover:bg-[#1E293B] border border-indigo-200 dark:border-slate-800 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 transition-all shadow-xs cursor-pointer"
          >
            <LocateFixed className="w-4 h-4 text-indigo-500" />
            <span>Reset Pan-India</span>
          </button>

          <button
            onClick={fetchDistricts}
            className="p-2 bg-white dark:bg-[#131823] hover:bg-indigo-50 dark:hover:bg-[#1E293B] border border-indigo-200 dark:border-slate-800 hover:border-blue-500 rounded-xl text-indigo-600 dark:text-indigo-400 hover:text-blue-600 transition-all shadow-xs cursor-pointer"
            title="Refresh GIS Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* 4 Vivid Chromatic KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Block 1: Monitored Territories (Ocean Azure / Blue) */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card-blue p-6 rounded-3xl space-y-3 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-extrabold">
              Mapped Territories
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 dark:bg-blue-500/25 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white font-mono tracking-tight">
              <CountUpNumber end={stats.totalDistrictsCount} />
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-mono font-bold">
              <span>National Coverage</span>
              <span className="text-blue-700 dark:text-blue-400 font-extrabold bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200">
                100% Geo-Tagged
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-blue-100 dark:bg-blue-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-full animate-pulse-glow" />
          </div>
        </motion.div>

        {/* Block 2: Spatial Risk Hotspots (Coral Rose) */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card-rose p-6 rounded-3xl space-y-3 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-rose-700 dark:text-rose-400 font-extrabold">
              Anomaly Hotspots
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 dark:bg-rose-500/25 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5 animate-bounce-subtle" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 dark:text-rose-400 font-mono tracking-tight">
              <CountUpNumber end={stats.criticalDistrictsCount} />
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-mono font-bold">
              <span>High Risk Works Flagged</span>
              <span className="text-rose-700 dark:text-rose-400 font-extrabold bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full border border-rose-200">
                {stats.totalHighRiskWorks} works
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-rose-100 dark:bg-rose-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-full w-full" />
          </div>
        </motion.div>

        {/* Block 3: Sanctioned Capital (Sunny Amber / Gold) */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card-amber p-6 rounded-3xl space-y-3 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-extrabold">
              Total Mapped Capital
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-amber-500/25 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white font-mono tracking-tight">
              ₹{(stats.totalAllocatedSum / 10000000).toFixed(1)} Cr
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-mono font-bold">
              <span>Active Parliamentary Works</span>
              <span className="text-amber-700 dark:text-amber-400 font-extrabold bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200">
                {stats.totalProjectsSum} works
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-amber-100 dark:bg-amber-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-full" />
          </div>
        </motion.div>

        {/* Block 4: Fund Utilization Rate (Emerald Mint) */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card-emerald p-6 rounded-3xl space-y-3 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-extrabold">
              Fund Utilization Rate
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
              {stats.utilizationRate}%
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-mono font-bold">
              <span>Disbursed On Ground</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200">
                ₹{(stats.totalUtilizedSum / 10000000).toFixed(1)} Cr
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-[74%]" />
          </div>
        </motion.div>
      </div>

      {/* Interactive Quick Hotspot Selector Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-mono font-extrabold shrink-0 shadow-sm">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          <span>TOP RISK HOTSPOTS:</span>
        </div>
        {topHotspots.map((h, idx) => {
          const isSelected = activeDistrict?.district === h.district;
          return (
            <button
              key={`${h.state}-${h.district}-${idx}`}
              onClick={() => handleSelectDistrict(h)}
              className={`px-4 py-2 rounded-2xl border text-xs font-mono font-bold shrink-0 transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                isSelected
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md scale-102"
                  : "bg-white dark:bg-[#131823] text-indigo-950 dark:text-slate-200 border-indigo-200 dark:border-slate-800 hover:border-blue-400 hover:bg-indigo-50/50"
              }`}
            >
              <span>{h.district}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : h.averageRiskScore >= 50
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                Risk {h.averageRiskScore}
              </span>
            </button>
          );
        })}
      </div>

      {/* Multi-Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#131823] border border-indigo-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search mapped districts by name, state, or constituency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-indigo-50/40 dark:bg-[#0B0F17] border border-indigo-200 dark:border-slate-800 rounded-2xl text-xs text-indigo-950 dark:text-white placeholder-indigo-400 focus:outline-none focus:border-blue-500 font-medium transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* State Filter */}
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50/40 dark:bg-[#0B0F17] border border-indigo-200 dark:border-slate-800 rounded-2xl text-xs shadow-xs">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-indigo-950 dark:text-white focus:outline-none cursor-pointer text-xs font-bold"
            >
              <option value="ALL">All States (Pan-India)</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Bihar">Bihar</option>
            </select>
          </div>

          {/* Risk Tier Filter */}
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50/40 dark:bg-[#0B0F17] border border-indigo-200 dark:border-slate-800 rounded-2xl text-xs shadow-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-500" />
            <select
              value={riskTierFilter}
              onChange={(e) => setRiskTierFilter(e.target.value)}
              className="bg-transparent text-indigo-950 dark:text-white focus:outline-none cursor-pointer text-xs font-bold"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="CRITICAL">Critical Hotspots (Score &gt; 50)</option>
              <option value="HIGH">Elevated Risk (Score 30-50)</option>
              <option value="LOW">Healthy Dispersion (Score &lt; 30)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dominant Spatial Canvas with Floating Glass HUD Panels */}
      <div className="relative h-[calc(100vh-320px)] min-h-[600px] w-full rounded-3xl overflow-hidden border-2 border-indigo-200 dark:border-slate-800 shadow-xl bg-slate-950">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center bg-indigo-50/20 dark:bg-[#090B0F]">
            <LoadingSkeleton count={1} className="h-full w-full" />
          </div>
        ) : (
          <>
            {/* Leaflet Map Canvas */}
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%", zIndex: 1 }}
            >
              <MapFlyTo center={mapCenter} zoom={mapZoom} />

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {filteredDistricts.map((d, idx) => {
                const isSelected = activeDistrict?.district === d.district;
                const riskConfig = getRiskColor(d.averageRiskScore, d.highRiskProjectsCount);

                return (
                  <React.Fragment key={`${d.state}-${d.district}-${idx}`}>
                    {/* Outer Glow Halo for Selected or Critical District */}
                    {(isSelected || d.averageRiskScore >= 50) && (
                      <CircleMarker
                        center={[d.latitude, d.longitude]}
                        radius={isSelected ? 26 : 18}
                        pathOptions={{
                          color: isSelected ? "#3B82F6" : riskConfig.border,
                          fillColor: isSelected ? "#60A5FA" : riskConfig.fill,
                          fillOpacity: isSelected ? 0.25 : 0.15,
                          weight: 1,
                        }}
                      />
                    )}

                    {/* Core Interactive Node */}
                    <CircleMarker
                      center={[d.latitude, d.longitude]}
                      radius={isSelected ? 16 : d.averageRiskScore >= 50 ? 12 : 9}
                      pathOptions={{
                        color: isSelected ? "#1D4ED8" : riskConfig.border,
                        fillColor: isSelected ? "#2563EB" : riskConfig.fill,
                        fillOpacity: isSelected ? 0.95 : 0.8,
                        weight: isSelected ? 3.5 : 2,
                      }}
                      eventHandlers={{
                        click: () => handleSelectDistrict(d),
                      }}
                    >
                      <Popup className="custom-leaflet-popup">
                        <div className="p-2 font-sans text-xs min-w-[200px] space-y-2">
                          <div className="border-b border-indigo-100 pb-1.5">
                            <strong className="text-sm font-extrabold text-[#0F172A] block">
                              {d.district}
                            </strong>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">
                              {d.state} Territory
                            </span>
                          </div>

                          <div className="space-y-1 font-mono text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Works Monitored:</span>
                              <strong className="text-[#0F172A]">{d.totalProjects}</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Average Risk:</span>
                              <strong className={d.averageRiskScore >= 50 ? "text-red-600" : "text-emerald-600"}>
                                {d.averageRiskScore}/100
                              </strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Sanctioned:</span>
                              <strong className="text-amber-600">
                                ₹{(d.totalAllocated / 10000000).toFixed(2)} Cr
                              </strong>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectDistrict(d)}
                            className="w-full py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold rounded-lg shadow-xs mt-2 cursor-pointer"
                          >
                            Inspect In Canvas
                          </button>
                        </div>
                      </Popup>
                    </CircleMarker>
                  </React.Fragment>
                );
              })}
            </MapContainer>

            {/* Floating Interactive Map Legend (Bottom-Left Glassmorphic Overlay) */}
            <div className="absolute bottom-5 left-5 z-[999] p-4 rounded-3xl bg-white/90 dark:bg-[#131823]/90 backdrop-blur-xl border border-indigo-200 dark:border-slate-800 shadow-2xl space-y-2 text-xs font-mono">
              <div className="text-[10px] font-bold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-indigo-100 dark:border-slate-800 pb-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>GIS RISK SPECTRUM</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-300 dark:ring-red-900 animate-pulse" />
                  <span className="font-bold text-[#0F172A] dark:text-white">Critical Hotspot (Score &gt; 50)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-300 dark:ring-amber-900" />
                  <span className="font-bold text-[#0F172A] dark:text-white">Elevated Risk (Score 30-50)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-900" />
                  <span className="font-bold text-[#0F172A] dark:text-white">Healthy Dispersion (Score &lt; 30)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-blue-300 dark:ring-blue-900" />
                  <span className="font-bold text-blue-600 dark:text-blue-400">Selected Territory Focus</span>
                </div>
              </div>
            </div>

            {/* Floating District Profile HUD Panel (Top-Right Glassmorphic Card) */}
            <AnimatePresence>
              {activeDistrict && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  className="absolute top-5 right-5 z-[999] w-88 p-6 rounded-3xl shadow-2xl space-y-4 bg-white/95 dark:bg-[#131823]/95 backdrop-blur-xl border-2 border-indigo-200 dark:border-slate-800 text-left"
                >
                  {/* Header Banner */}
                  <div className="flex items-start justify-between border-b border-indigo-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:text-cyan-400 font-extrabold">
                          TERRITORY DOSSIER
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight mt-0.5">
                        {activeDistrict.district}
                      </h3>
                      <span className="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400">
                        {activeDistrict.state} State Constituency
                      </span>
                    </div>
                    {(() => {
                      const rConfig = getRiskColor(
                        activeDistrict.averageRiskScore,
                        activeDistrict.highRiskProjectsCount
                      );
                      return (
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-mono font-extrabold border shadow-xs ${rConfig.badge}`}
                        >
                          {rConfig.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Risk Score Meter Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="text-indigo-900 dark:text-indigo-300">Territory Risk Rating</span>
                      <span
                        className={`text-sm font-extrabold ${
                          activeDistrict.averageRiskScore >= 50
                            ? "text-rose-600 dark:text-rose-400"
                            : activeDistrict.averageRiskScore >= 30
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {activeDistrict.averageRiskScore} / 100
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-indigo-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          activeDistrict.averageRiskScore >= 50
                            ? "bg-gradient-to-r from-rose-500 to-red-600"
                            : activeDistrict.averageRiskScore >= 30
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-emerald-500 to-teal-500"
                        }`}
                        style={{ width: `${Math.min(activeDistrict.averageRiskScore, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* 2-Column Metrics Summary Grid */}
                  <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                    <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-[#0D1016] border border-blue-200/70 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase block">
                        Works Monitored
                      </span>
                      <span className="text-2xl font-extrabold text-[#0F172A] dark:text-white mt-1 block">
                        {activeDistrict.totalProjects}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-[#0D1016] border border-rose-200/70 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase block">
                        Risk Flagged
                      </span>
                      <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 block">
                        {activeDistrict.highRiskProjectsCount}
                      </span>
                    </div>
                  </div>

                  {/* Capital Sanction vs Disbursed Card */}
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-[#0D1016] border border-indigo-100 dark:border-slate-800 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-800 dark:text-indigo-300 font-medium">Sanctioned Capital:</span>
                      <span className="font-extrabold text-amber-700 dark:text-amber-400">
                        ₹{(activeDistrict.totalAllocated / 10000000).toFixed(2)} Cr
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-800 dark:text-indigo-300 font-medium">Disbursed Capital:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">
                        ₹{(activeDistrict.totalUtilized / 10000000).toFixed(2)} Cr
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-indigo-100/70 dark:border-slate-800">
                      <span className="text-indigo-800 dark:text-indigo-300 font-medium">Avg Work Cost:</span>
                      <span className="font-bold text-[#0F172A] dark:text-slate-200">
                        ₹{(activeDistrict.averageProjectCost / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        (window.location.href = `/projects?district=${encodeURIComponent(
                          activeDistrict.district
                        )}`)
                      }
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Explore {activeDistrict.district} Works</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        (window.location.href = `/anomalies?district=${encodeURIComponent(
                          activeDistrict.district
                        )}`)
                      }
                      className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold rounded-2xl border border-rose-200 dark:border-rose-900 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>View Risk Signals ({activeDistrict.highRiskProjectsCount})</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};
