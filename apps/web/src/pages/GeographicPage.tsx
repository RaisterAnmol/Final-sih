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
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import api from "../services/api";
import { District } from "../types";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { SourceBadge } from "../components/civic/SourceBadge";
import { CountUpNumber } from "../components/civic/CountUpNumber";

// Helper component to smoothly center map on selected district
const MapFlyTo: React.FC<{ center: [number, number]; zoom?: number }> = ({
  center,
  zoom = 7,
}) => {
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    21.5937, 78.9629,
  ]);
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
        const highestRisk = [...districtList].sort(
          (a, b) => b.averageRiskScore - a.averageRiskScore,
        )[0];
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
      if (
        riskTierFilter === "CRITICAL" &&
        d.averageRiskScore < 50 &&
        d.highRiskProjectsCount === 0
      )
        return false;
      if (
        riskTierFilter === "HIGH" &&
        (d.averageRiskScore < 30 || d.averageRiskScore >= 50)
      )
        return false;
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
    const totalProjectsSum = districts.reduce(
      (acc, d) => acc + (d.totalProjects || 0),
      0,
    );
    const totalAllocatedSum = districts.reduce(
      (acc, d) => acc + (d.totalAllocated || 0),
      0,
    );
    const totalUtilizedSum = districts.reduce(
      (acc, d) => acc + (d.totalUtilized || 0),
      0,
    );
    const totalHighRiskWorks = districts.reduce(
      (acc, d) => acc + (d.highRiskProjectsCount || 0),
      0,
    );
    const criticalDistrictsCount = districts.filter(
      (d) => d.averageRiskScore >= 50 || d.highRiskProjectsCount > 0,
    ).length;
    const avgRisk =
      districts.length > 0
        ? Math.round(
            (districts.reduce((a, b) => a + (b.averageRiskScore || 0), 0) /
              districts.length) *
              10,
          ) / 10
        : 0;
    const utilizationRate =
      totalAllocatedSum > 0
        ? Math.round((totalUtilizedSum / totalAllocatedSum) * 100)
        : 0;

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
      .sort(
        (a, b) =>
          b.averageRiskScore - a.averageRiskScore ||
          b.highRiskProjectsCount - a.highRiskProjectsCount,
      )
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
        fill: "#DC2626",
        border: "#991B1B",
        badge:
          "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900",
        label: "CRITICAL RISK",
        ring: "ring-red-500/50",
      };
    }
    if (riskScore >= 30 || highRiskCount > 0) {
      return {
        fill: "#D97706",
        border: "#B45309",
        badge:
          "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
        label: "ELEVATED RISK",
        ring: "ring-amber-500/50",
      };
    }
    return {
      fill: "#138A45",
      border: "#0F6E36",
      badge:
        "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
      label: "HEALTHY DISPERSION",
      ring: "ring-emerald-500/50",
    };
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-10">
      {/* Header & Spatial Intelligence Tag */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D9DEE7] dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#1F2A5A] dark:text-blue-400 font-bold">
              NATIONAL GIS TELEMETRY
            </span>
            <span className="text-slate-300 dark:text-slate-600">//</span>
            <span className="text-[10px] font-mono text-[#138A45] font-bold bg-[#138A45]/10 px-2 py-0.5 rounded-sm">
              OFFICIAL MOSPI SOURCE
            </span>
            <span className="text-slate-300 dark:text-slate-600">//</span>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-sm border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
              <span>SPATIAL CLUSTERING ACTIVE</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A5A] dark:text-white tracking-tight flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-[#1F2A5A] dark:text-blue-400" />
            <span>Spatial GIS &amp; Constituency Risk Canvas</span>
          </h1>
          <p className="text-xs text-[#5B6472] dark:text-slate-400 mt-0.5">
            Geospatial intelligence analyzing fund dispersion, contractor
            concentrations, and anomaly hot-spots across India's parliamentary
            territories.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={resetMap}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#131823] hover:bg-slate-100 dark:hover:bg-[#1C2536] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            <LocateFixed className="w-3.5 h-3.5 text-[#1F2A5A] dark:text-blue-400" />
            <span>Reset Pan-India</span>
          </button>

          <button
            type="button"
            onClick={fetchDistricts}
            className="p-1.5 bg-white dark:bg-[#131823] hover:bg-slate-100 dark:hover:bg-[#1C2536] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
            title="Refresh GIS Data"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-[#1F2A5A]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* 4 Sharp Institutional KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Block 1: Monitored Territories */}
        <div className="p-4 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6472] dark:text-slate-400 font-bold">
              Mapped Territories
            </span>
            <div className="w-8 h-8 rounded-sm bg-[#1F2A5A]/5 dark:bg-blue-500/10 text-[#1F2A5A] dark:text-blue-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1F2A5A] dark:text-white tracking-tight">
              <CountUpNumber end={stats.totalDistrictsCount} />
            </div>
            <div className="flex items-center justify-between text-xs text-[#5B6472] dark:text-slate-400 mt-1 font-mono">
              <span>National Coverage</span>
              <span className="text-[10px] font-bold text-[#1F2A5A] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded-sm">
                100% Geo-Tagged
              </span>
            </div>
          </div>
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-[#1F2A5A] dark:bg-blue-500 rounded-full w-full" />
          </div>
        </div>

        {/* Block 2: Spatial Risk Hotspots */}
        <div className="p-4 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6472] dark:text-slate-400 font-bold">
              Anomaly Hotspots
            </span>
            <div className="w-8 h-8 rounded-sm bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-red-600 dark:text-red-400 tracking-tight">
              <CountUpNumber end={stats.criticalDistrictsCount} />
            </div>
            <div className="flex items-center justify-between text-xs text-[#5B6472] dark:text-slate-400 mt-1 font-mono">
              <span>High Risk Works</span>
              <span className="text-[10px] font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 px-1.5 py-0.5 rounded-sm">
                {stats.totalHighRiskWorks} works
              </span>
            </div>
          </div>
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full w-full" />
          </div>
        </div>

        {/* Block 3: Sanctioned Capital */}
        <div className="p-4 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6472] dark:text-slate-400 font-bold">
              Total Mapped Capital
            </span>
            <div className="w-8 h-8 rounded-sm bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1F2A5A] dark:text-white tracking-tight">
              ₹{(stats.totalAllocatedSum / 10000000).toFixed(1)} Cr
            </div>
            <div className="flex items-center justify-between text-xs text-[#5B6472] dark:text-slate-400 mt-1 font-mono">
              <span>Active Works</span>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-sm">
                {stats.totalProjectsSum} works
              </span>
            </div>
          </div>
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-full" />
          </div>
        </div>

        {/* Block 4: Fund Utilization Rate */}
        <div className="p-4 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6472] dark:text-slate-400 font-bold">
              Fund Utilization Rate
            </span>
            <div className="w-8 h-8 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 tracking-tight">
              {stats.utilizationRate}%
            </div>
            <div className="flex items-center justify-between text-xs text-[#5B6472] dark:text-slate-400 mt-1 font-mono">
              <span>Disbursed</span>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-sm">
                ₹{(stats.totalUtilizedSum / 10000000).toFixed(1)} Cr
              </span>
            </div>
          </div>
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${Math.min(stats.utilizationRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Quick Hotspot Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#1F2A5A] text-white text-xs font-mono font-bold shrink-0 shadow-xs">
          <Zap className="w-3 h-3 text-[#F59E0B]" />
          <span>STATUTORY HOTSPOTS:</span>
        </div>
        {topHotspots.map((h, idx) => {
          const isSelected = activeDistrict?.district === h.district;
          return (
            <button
              key={`${h.state}-${h.district}-${idx}`}
              type="button"
              onClick={() => handleSelectDistrict(h)}
              className={`px-3 py-1.5 rounded-sm border text-xs font-mono font-semibold shrink-0 transition-colors flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? "bg-[#1F2A5A] text-white border-[#1F2A5A] shadow-xs"
                  : "bg-white dark:bg-[#131823] text-slate-700 dark:text-slate-300 border-[#D9DEE7] dark:border-slate-800 hover:border-[#1F2A5A]"
              }`}
            >
              <span>{h.district}</span>
              <span
                className={`px-1.5 py-0.2 rounded-xs text-[10px] font-bold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : h.averageRiskScore >= 50
                      ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
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
      <div className="p-3.5 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search mapped districts by name, state, or constituency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0B0F17] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1F2A5A] dark:focus:border-blue-500 font-medium transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* State Filter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-[#0B0F17] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs">
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer text-xs font-semibold"
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
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-[#0B0F17] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={riskTierFilter}
              onChange={(e) => setRiskTierFilter(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer text-xs font-semibold"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="CRITICAL">
                Critical Hotspots (Score &gt; 50)
              </option>
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
                const riskConfig = getRiskColor(
                  d.averageRiskScore,
                  d.highRiskProjectsCount,
                );

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
                      radius={
                        isSelected ? 16 : d.averageRiskScore >= 50 ? 12 : 9
                      }
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
                              <span className="text-slate-500">
                                Works Monitored:
                              </span>
                              <strong className="text-[#0F172A]">
                                {d.totalProjects}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">
                                Average Risk:
                              </span>
                              <strong
                                className={
                                  d.averageRiskScore >= 50
                                    ? "text-red-600"
                                    : "text-emerald-600"
                                }
                              >
                                {d.averageRiskScore}/100
                              </strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">
                                Sanctioned:
                              </span>
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

            {/* Floating Interactive Map Legend (Bottom-Left Institutional Overlay) */}
            <div className="absolute bottom-4 left-4 z-[999] p-3 rounded-sm bg-white/95 dark:bg-[#131823]/95 backdrop-blur-md border border-[#D9DEE7] dark:border-slate-800 shadow-md space-y-2 text-xs font-mono">
              <div className="text-[10px] font-bold text-[#1F2A5A] dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D9DEE7] dark:border-slate-800 pb-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>GIS RISK SPECTRUM</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 ring-1 ring-red-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Critical Hotspot (&gt; 50)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-1 ring-amber-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Elevated Risk (30–50)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-1 ring-emerald-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Healthy Spread (&lt; 30)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1F2A5A] dark:bg-blue-400 ring-1 ring-blue-300" />
                  <span className="font-semibold text-[#1F2A5A] dark:text-blue-400">
                    Selected Focus
                  </span>
                </div>
              </div>
            </div>

            {/* Floating District Profile HUD Panel (Top-Right Institutional Dossier) */}
            <AnimatePresence>
              {activeDistrict && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute top-4 right-4 z-[999] w-84 p-4 rounded-sm shadow-xl space-y-3 bg-white/95 dark:bg-[#131823]/95 backdrop-blur-md border border-[#D9DEE7] dark:border-slate-800 text-left"
                >
                  {/* Header Banner */}
                  <div className="flex items-start justify-between border-b border-[#D9DEE7] dark:border-slate-800 pb-2.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#1F2A5A] dark:bg-blue-400" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#1F2A5A] dark:text-blue-400 font-bold">
                          TERRITORY DOSSIER
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#1F2A5A] dark:text-white tracking-tight mt-0.5">
                        {activeDistrict.district}
                      </h3>
                      <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                        {activeDistrict.state} State Constituency
                      </span>
                    </div>
                    {(() => {
                      const rConfig = getRiskColor(
                        activeDistrict.averageRiskScore,
                        activeDistrict.highRiskProjectsCount,
                      );
                      return (
                        <span
                          className={`px-2 py-0.5 rounded-xs text-[9px] font-mono font-bold border ${rConfig.badge}`}
                        >
                          {rConfig.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Risk Score Meter Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">
                        Territory Risk Rating
                      </span>
                      <span
                        className={`text-sm font-extrabold ${
                          activeDistrict.averageRiskScore >= 50
                            ? "text-red-600 dark:text-red-400"
                            : activeDistrict.averageRiskScore >= 30
                              ? "text-amber-700 dark:text-amber-400"
                              : "text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {activeDistrict.averageRiskScore} / 100
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          activeDistrict.averageRiskScore >= 50
                            ? "bg-red-600"
                            : activeDistrict.averageRiskScore >= 30
                              ? "bg-amber-500"
                              : "bg-emerald-600"
                        }`}
                        style={{
                          width: `${Math.min(activeDistrict.averageRiskScore, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* 2-Column Metrics Summary Grid */}
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="p-2.5 rounded-xs bg-slate-50 dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                        Works Monitored
                      </span>
                      <span className="text-xl font-extrabold text-[#1F2A5A] dark:text-white mt-0.5 block">
                        {activeDistrict.totalProjects}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xs bg-red-50/50 dark:bg-[#0D1016] border border-red-200 dark:border-red-950">
                      <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase block">
                        Risk Flagged
                      </span>
                      <span className="text-xl font-extrabold text-red-600 dark:text-red-400 mt-0.5 block">
                        {activeDistrict.highRiskProjectsCount}
                      </span>
                    </div>
                  </div>

                  {/* Capital Sanction vs Disbursed Card */}
                  <div className="p-2.5 rounded-xs bg-slate-50 dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Sanctioned:
                      </span>
                      <span className="font-bold text-[#1F2A5A] dark:text-slate-200">
                        ₹{(activeDistrict.totalAllocated / 10000000).toFixed(2)}{" "}
                        Cr
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Disbursed:
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        ₹{(activeDistrict.totalUtilized / 10000000).toFixed(2)}{" "}
                        Cr
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-[#D9DEE7] dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">
                        Avg Work Cost:
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        ₹
                        {(activeDistrict.averageProjectCost / 100000).toFixed(
                          1,
                        )}{" "}
                        L
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        (window.location.href = `/projects?district=${encodeURIComponent(
                          activeDistrict.district,
                        )}`)
                      }
                      className="w-full py-2 bg-[#1F2A5A] hover:bg-[#162044] text-white text-xs font-semibold rounded-sm shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Inspect {activeDistrict.district} Works</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        (window.location.href = `/anomalies?district=${encodeURIComponent(
                          activeDistrict.district,
                        )}`)
                      }
                      className="w-full py-1.5 bg-white dark:bg-[#141B26] hover:bg-slate-50 dark:hover:bg-[#1C2536] text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold rounded-sm border border-[#D9DEE7] dark:border-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      <span>
                        View Risk Signals (
                        {activeDistrict.highRiskProjectsCount})
                      </span>
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
