import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  Building,
  RotateCcw,
  Coins,
  ArrowUpRight,
  Landmark,
  MapPin,
  FolderKanban,
  Database,
  ExternalLink,
} from "lucide-react";
import api from "../services/api";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";

interface MPDirectoryItem {
  mpName: string;
  house: string;
  state: string;
  constituency: string;
  totalWorks: number;
  totalAllocated: number;
  avgRiskScore: number;
}

export const MPsPage: React.FC = () => {
  const [mps, setMps] = useState<MPDirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHouse, setSelectedHouse] = useState<string>("ALL");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [totalMps, setTotalMps] = useState(633);
  const navigate = useNavigate();

  const fetchMPs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedHouse !== "ALL") params.append("house", selectedHouse);
      if (selectedState !== "ALL") params.append("state", selectedState);
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/projects/mps/directory?${params.toString()}`);
      if (res.data?.data?.mps) {
        setMps(res.data.data.mps);
        setTotalMps(res.data.data.totalMps || res.data.data.mps.length);
      }
    } catch (err) {
      console.error("Failed to load MP directory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMPs();
    }, 200);
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedHouse, selectedState]);

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE7] dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#1F2A5A] font-bold">
              PARLIAMENTARY DIRECTORY
            </span>
            <span className="text-slate-300">//</span>
            <span className="text-[10px] font-mono text-[#138A45] font-bold bg-[#138A45]/10 px-2 py-0.5 rounded-sm">
              PUBLIC-SOURCE SNAPSHOT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A5A] dark:text-white tracking-tight flex items-center gap-2.5">
            <Landmark className="w-6 h-6 text-[#1F2A5A]" />
            <span>Parliamentary MPs Directory</span>
          </h1>
          <p className="text-xs text-[#5B6472] dark:text-slate-400 mt-0.5">
            Members of Parliament represented in the public-source MPLADS
            work-register snapshot (Lok Sabha & Rajya Sabha).
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="px-3.5 py-1.5 bg-[#1F2A5A] hover:bg-[#172554] text-white text-xs font-bold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>View Works Register</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-4 rounded-sm shadow-xs space-y-1">
          <span className="text-[10px] text-[#5B6472] dark:text-slate-400 uppercase font-bold block">
            MPs in Snapshot
          </span>
          <span className="text-2xl font-extrabold text-[#1F2A5A] dark:text-white">
            {totalMps} MPs
          </span>
          <span className="text-[10px] text-[#5B6472] dark:text-slate-400 block">
            Lok Sabha & Rajya Sabha
          </span>
        </div>

        <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-4 rounded-sm shadow-xs space-y-1">
          <span className="text-[10px] text-[#5B6472] dark:text-slate-400 uppercase font-bold block">
            Parliamentary Coverage
          </span>
          <span className="text-2xl font-extrabold text-[#138A45]">
            457 Units
          </span>
          <span className="text-[10px] text-[#5B6472] dark:text-slate-400 block">
            455 Named LS + 2 RS Groups
          </span>
        </div>

        <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-4 rounded-sm shadow-xs space-y-1">
          <span className="text-[10px] text-[#5B6472] dark:text-slate-400 uppercase font-bold block">
            Source Snapshot Window
          </span>
          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block mt-1">
            26 Apr 2023 – 04 Mar 2024
          </span>
          <span className="text-[10px] text-[#5B6472] dark:text-slate-400 block">
            Public-source snapshot
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-4 rounded-sm shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search MPs by name, constituency, or state..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#F7F8FA] dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs focus:outline-hidden text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedHouse}
            onChange={(e) => setSelectedHouse(e.target.value)}
            className="p-1.5 bg-[#F7F8FA] dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Chambers</option>
            <option value="Lok Sabha">Lok Sabha</option>
            <option value="Rajya Sabha">Rajya Sabha</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedHouse("ALL");
              setSelectedState("ALL");
            }}
            className="p-1.5 bg-[#F7F8FA] dark:bg-[#131823] hover:bg-slate-200 border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MP Grid Display */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} count={1} className="h-40" />
          ))}
        </div>
      ) : mps.length === 0 ? (
        <EmptyState
          title="No MPs Found"
          description="Try modifying your search filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mps.map((mp, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-4 rounded-sm shadow-xs space-y-3 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#D9DEE7] dark:border-slate-800 pb-2">
                <span className="font-bold text-[#1F2A5A] dark:text-white text-sm line-clamp-1">
                  {mp.mpName}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-[#F7F8FA] dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800">
                  {mp.house}
                </span>
              </div>

              <div className="text-[11px] text-[#5B6472] dark:text-slate-400 space-y-1 font-mono">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">
                    {mp.constituency}, {mp.state}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1 border-t border-[#D9DEE7] dark:border-slate-800">
                <div className="p-2 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800">
                  <span className="text-[10px] text-[#5B6472] dark:text-slate-400 uppercase block">
                    Recorded Works
                  </span>
                  <span className="font-bold text-[#1F2A5A] dark:text-blue-300 text-sm block mt-0.5">
                    {mp.totalWorks}
                  </span>
                </div>
                <div className="p-2 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800">
                  <span className="text-[10px] text-[#5B6472] dark:text-slate-400 uppercase block">
                    Total Allocation
                  </span>
                  <span className="font-bold text-[#138A45] text-sm block mt-0.5">
                    ₹{((mp.totalAllocated || 0) / 100000).toFixed(1)} L
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/projects?search=${encodeURIComponent(mp.mpName)}`,
                    )
                  }
                  className="text-xs font-semibold text-[#1F2A5A] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore MP Works</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
