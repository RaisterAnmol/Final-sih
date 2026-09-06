import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  AlertTriangle,
  ArrowUpRight,
  Coins,
  ShieldCheck,
  FolderKanban,
  MapPin,
  Building,
  Users,
  Info,
} from "lucide-react";
import api from "../services/api";
import { Contractor } from "../types";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";

export const ContractorsPage: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchContractors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("limit", "100");

      const res = await api.get(`/contractors?${params.toString()}`);
      setContractors(res.data.data.contractors || []);
    } catch (err) {
      console.error("Failed to load authorities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, [search]);

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE7] dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#1F2A5A] font-bold">
              ADMINISTRATIVE STRUCTURE
            </span>
            <span className="text-slate-300">//</span>
            <span className="text-[10px] font-mono text-[#138A45] font-bold bg-[#138A45]/10 px-2 py-0.5 rounded-sm">
              PUBLIC SOURCE SNAPSHOT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A5A] dark:text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#1F2A5A]" />
            <span>Implementing District Authorities (IDA)</span>
          </h1>
          <p className="text-xs text-[#5B6472] mt-0.5">
            Official directory of district nodal implementing authorities (District Collectors, DMs, Municipal Commissioners) designated for MPLADS works.
          </p>
        </div>
      </div>

      {/* Institutional Explanatory Note */}
      <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] p-3 text-xs text-[#92400E] space-y-0.5">
        <div className="font-bold flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Implementing Agency (IDA) Classification</span>
        </div>
        <p>
          In the official MPLADS scheme structure, the Implementing District Authority (IDA) is the district administrative office (such as the District Collector / District Magistrate) tasked with administrative sanctions, tendering, and technical oversight.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white border border-[#D9DEE7] dark:border-slate-800 p-3 rounded-md shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search implementing authorities by agency name, district, or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#F7F8FA] border border-[#D9DEE7] rounded-sm text-xs focus:outline-hidden text-slate-800"
          />
        </div>
      </div>

      {/* Authorities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} count={1} className="h-40" />
          ))}
        </div>
      ) : contractors.length === 0 ? (
        <EmptyState
          title="No Authorities Found"
          description="Try modifying your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractors.map((c) => (
            <div
              key={c.contractorId}
              onClick={() => navigate(`/contractors/${c.contractorId}`)}
              className="bg-white border border-[#D9DEE7] dark:border-slate-800 p-4 rounded-md shadow-xs hover:border-[#1F2A5A] transition-all cursor-pointer space-y-3 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-2">
                <span className="font-mono text-[10px] font-bold text-[#1F2A5A] bg-[#F7F8FA] px-2 py-0.5 rounded-sm border border-[#D9DEE7]">
                  {c.contractorId}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#138A45] bg-[#138A45]/10 px-2 py-0.5 rounded-sm">
                  IDA NODAL
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#1F2A5A] dark:text-white line-clamp-1">
                  {c.name}
                </h3>
                <div className="text-[11px] text-[#5B6472] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{c.districtsOperating?.join(", ") || "District Authority"}, {c.statesOperating?.join(", ") || "India"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                <div className="p-2 bg-[#F7F8FA] rounded-sm border border-[#D9DEE7]">
                  <span className="text-[10px] text-[#5B6472] uppercase block">Designated Works</span>
                  <span className="font-bold text-[#1F2A5A] text-sm block mt-0.5">{c.totalProjects || 0}</span>
                </div>
                <div className="p-2 bg-[#F7F8FA] rounded-sm border border-[#D9DEE7]">
                  <span className="text-[10px] text-[#5B6472] uppercase block">Total Allocation</span>
                  <span className="font-bold text-[#138A45] text-sm block mt-0.5">
                    ₹{((c.totalAllocatedValue || 0) / 100000).toFixed(1)} L
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#D9DEE7] text-[11px]">
                <span className="text-[#5B6472]">Average Work Cost: ₹{((c.averageProjectValue || 0) / 100000).toFixed(1)} L</span>
                <span className="text-[#1F2A5A] font-bold flex items-center gap-0.5">
                  Inspect →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
