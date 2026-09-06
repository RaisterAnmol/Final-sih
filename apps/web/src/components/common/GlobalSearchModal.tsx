import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FolderKanban,
  Building2,
  MapPin,
  X,
  ArrowRight,
  Loader2,
  Layers,
  Sparkles,
  Command,
  TrendingUp,
} from "lucide-react";
import api from "../../services/api";
import { RiskBadge } from "./RiskBadge";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    projects: any[];
    contractors: any[];
  }>({ projects: [], contractors: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({ projects: [], contractors: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [projRes, contRes] = await Promise.all([
          api.get(`/projects?search=${encodeURIComponent(query)}&limit=6`),
          api.get(`/contractors?search=${encodeURIComponent(query)}&limit=4`),
        ]);
        setResults({
          projects: projRes.data.data.projects || [],
          contractors: contRes.data.data.contractors || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-[#090B0F]/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#151A22] border border-[#232D3B] rounded-2xl shadow-2xl overflow-hidden text-left animate-in zoom-in-95">
        {/* Search Input Box */}
        <div className="p-4 border-b border-[#232D3B] flex items-center gap-3 bg-[#0D1016]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Type work ID, title, contractor name, or district..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-[#F4F7FB] placeholder-[#6F7885] focus:outline-none font-mono"
          />
          {loading && (
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
          )}
          <button
            onClick={onClose}
            className="text-[#6F7885] hover:text-white p-1 rounded-lg hover:bg-[#151A22]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Navigation Suggestions */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {query.trim().length < 2 && (
            <div className="space-y-3 py-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6F7885] px-1 font-semibold">
                Quick Navigation Shortcuts
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#0D1016] hover:bg-[#1A202A] border border-[#232D3B] text-left text-[#A7B0BE] hover:text-white flex items-center justify-between"
                >
                  <span>Executive HUD</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
                <button
                  onClick={() => {
                    navigate("/mps");
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#0D1016] hover:bg-[#1A202A] border border-[#232D3B] text-left text-[#A7B0BE] hover:text-white flex items-center justify-between"
                >
                  <span>MPs Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
                <button
                  onClick={() => {
                    navigate("/anomalies");
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#0D1016] hover:bg-[#1A202A] border border-[#232D3B] text-left text-[#A7B0BE] hover:text-white flex items-center justify-between"
                >
                  <span>Anomaly Screening</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
                <button
                  onClick={() => {
                    navigate("/geographic");
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#0D1016] hover:bg-[#1A202A] border border-[#232D3B] text-left text-[#A7B0BE] hover:text-white flex items-center justify-between"
                >
                  <span>GIS Intelligence</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          )}

          {/* Projects Results */}
          {results.projects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#A7B0BE] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                <span>Works ({results.projects.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.projects.map((p) => (
                  <div
                    key={p.projectId}
                    onClick={() => {
                      navigate(`/projects/${p.projectId}`);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-[#0D1016] hover:bg-[#1A202A] border border-[#232D3B] hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">
                          {p.projectId}
                        </span>
                        <RiskBadge
                          level={p.riskLevel}
                          score={p.riskScore}
                          size="sm"
                        />
                      </div>
                      <div className="text-xs font-semibold text-[#F4F7FB] truncate">
                        {p.title}
                      </div>
                      <div className="text-[10px] text-[#6F7885] font-mono">
                        {p.district}, {p.state} • {p.category}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#6F7885] group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contractors Results */}
          {results.contractors.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#A7B0BE] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Contractor Entities ({results.contractors.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.contractors.map((c) => (
                  <div
                    key={c.contractorId}
                    onClick={() => {
                      navigate(`/contractors/${c.contractorId}`);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-[#0D1016] hover:bg-[#1A202A] border border-[#232D3B] hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-[#F4F7FB] text-xs">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-[#6F7885] font-mono">
                        {c.totalProjects} Works • ₹
                        {((c.totalAllocatedValue || 0) / 10000000).toFixed(1)} Cr
                        Portfolio
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#6F7885] group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
