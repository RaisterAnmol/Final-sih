import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  ArrowLeft,
  Coins,
  AlertTriangle,
  FolderKanban,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Building,
  Info,
} from "lucide-react";
import api from "../services/api";
import { Contractor, Project } from "../types";
import { RiskBadge } from "../components/common/RiskBadge";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";

export const ContractorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [districtSpread, setDistrictSpread] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/contractors/${id}`);
      setContractor(res.data.data.contractor);
      setProjects(res.data.data.projects || []);
      setDistrictSpread(res.data.data.districtSpread || []);
    } catch (err) {
      console.error("Failed to load authority dossier:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  if (loading || !contractor) {
    return (
      <div className="space-y-6 text-left">
        <LoadingSkeleton count={3} className="h-24" />
        <LoadingSkeleton count={1} className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Back Button */}
      <div className="border-b border-[#D9DEE7] dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => navigate("/contractors")}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2A5A] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Implementing Authorities Directory</span>
        </button>
      </div>

      {/* Authority Profile Card */}
      <div className="bg-white border border-[#D9DEE7] dark:border-slate-800 p-6 rounded-md shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#1F2A5A] bg-[#F7F8FA] px-2 py-0.5 rounded-sm border border-[#D9DEE7]">
                {contractor.contractorId}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#138A45] bg-[#138A45]/10 px-2 py-0.5 rounded-sm">
                IMPLEMENTING DISTRICT AUTHORITY
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2A5A] dark:text-white tracking-tight">
              {contractor.name}
            </h1>

            <p className="text-xs text-[#5B6472] font-mono">
              Operating Jurisdictions: {contractor.districtsOperating?.join(", ") || "General District"}, {contractor.statesOperating?.join(", ") || "India"}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE7] rounded-sm text-right">
              <span className="text-[10px] text-[#5B6472] uppercase block font-bold">Total Allocation</span>
              <span className="text-lg font-extrabold text-[#138A45]">
                ₹{((contractor.totalAllocatedValue || 0) / 100000).toFixed(1)} Lakhs
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-2 border-t border-[#D9DEE7]">
          <div className="p-3 bg-[#F7F8FA] rounded-sm border border-[#D9DEE7]">
            <span className="text-[10px] text-[#5B6472] uppercase font-bold block">Designated Works</span>
            <span className="text-xl font-bold text-[#1F2A5A] mt-0.5 block">{contractor.totalProjects || 0}</span>
          </div>

          <div className="p-3 bg-[#F7F8FA] rounded-sm border border-[#D9DEE7]">
            <span className="text-[10px] text-[#5B6472] uppercase font-bold block">Average Work Cost</span>
            <span className="text-xl font-bold text-slate-800 mt-0.5 block">
              ₹{((contractor.averageProjectValue || 0) / 100000).toFixed(1)} Lakhs
            </span>
          </div>

          <div className="p-3 bg-[#F7F8FA] rounded-sm border border-[#D9DEE7]">
            <span className="text-[10px] text-[#5B6472] uppercase font-bold block">District Headquarters</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">
              {contractor.districtsOperating?.[0] || "District"} Collectorate
            </span>
          </div>
        </div>
      </div>

      {/* Associated Works Table */}
      <div className="bg-white border border-[#D9DEE7] dark:border-slate-800 rounded-md overflow-hidden shadow-xs space-y-3 p-5">
        <div className="border-b border-[#D9DEE7] pb-3">
          <h2 className="text-sm font-bold text-[#1F2A5A] uppercase tracking-wider font-mono">
            Designated MPLADS Works ({projects.length})
          </h2>
          <p className="text-xs text-[#5B6472]">
            List of developmental works assigned to this implementing authority in the public snapshot.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1F2A5A] text-white uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Work ID</th>
                <th className="py-2.5 px-3">Work Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">MP Name</th>
                <th className="py-2.5 px-3 text-right">Allocation (₹)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE7] text-slate-800">
              {projects.map((p) => (
                <tr key={p.projectId} className="hover:bg-[#F7F8FA]">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#1F2A5A]">{p.projectId}</td>
                  <td className="py-2.5 px-3 font-semibold max-w-xs truncate">{p.title}</td>
                  <td className="py-2.5 px-3">{p.category}</td>
                  <td className="py-2.5 px-3 font-semibold">{p.mpName}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#138A45]">
                    ₹{(p.allocatedAmount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono bg-[#F7F8FA] border border-[#D9DEE7]">
                      {(p as any).rawStatus || p.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/projects/${p.projectId}`)}
                      className="p-1 text-[#1F2A5A] hover:bg-slate-100 rounded-sm"
                      title="Inspect Work"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
