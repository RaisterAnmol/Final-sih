import React, { useState } from "react";
import {
  Droplet,
  GraduationCap,
  HeartPulse,
  Construction,
  Zap,
  Wrench,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface SectorItem {
  name: string;
  code: string;
  icon: any;
  allocatedCrore: number;
  utilizedCrore: number;
  totalWorks: number;
  completedWorks: number;
  completionRate: number;
  color: string;
}

const SECTOR_DATA: SectorItem[] = [
  {
    name: "Drinking Water & Sanitation",
    code: "DW",
    icon: Droplet,
    allocatedCrore: 345.0,
    utilizedCrore: 310.5,
    totalWorks: 1520,
    completedWorks: 1380,
    completionRate: 90.8,
    color: "#3b82f6",
  },
  {
    name: "Education Infrastructure",
    code: "ED",
    icon: GraduationCap,
    allocatedCrore: 240.0,
    utilizedCrore: 216.0,
    totalWorks: 1140,
    completedWorks: 1026,
    completionRate: 90.0,
    color: "#10b981",
  },
  {
    name: "Public Health & Wellness",
    code: "PH",
    icon: HeartPulse,
    allocatedCrore: 185.0,
    utilizedCrore: 164.6,
    totalWorks: 820,
    completedWorks: 730,
    completionRate: 89.0,
    color: "#ec4899",
  },
  {
    name: "Roads, Pathways & Bridges",
    code: "RD",
    icon: Construction,
    allocatedCrore: 165.0,
    utilizedCrore: 148.5,
    totalWorks: 760,
    completedWorks: 684,
    completionRate: 90.0,
    color: "#f59e0b",
  },
  {
    name: "Rural Electrification",
    code: "RE",
    icon: Zap,
    allocatedCrore: 95.0,
    utilizedCrore: 84.5,
    totalWorks: 420,
    completedWorks: 374,
    completionRate: 89.0,
    color: "#eab308",
  },
  {
    name: "Skill Development Centers",
    code: "SD",
    icon: Wrench,
    allocatedCrore: 80.0,
    utilizedCrore: 70.4,
    totalWorks: 310,
    completedWorks: 272,
    completionRate: 87.7,
    color: "#8b5cf6",
  },
  {
    name: "Sports & Youth Facilities",
    code: "SP",
    icon: Trophy,
    allocatedCrore: 63.2,
    utilizedCrore: 54.1,
    totalWorks: 230,
    completedWorks: 198,
    completionRate: 86.1,
    color: "#06b6d4",
  },
];

export const SectorBreakdown: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<SectorItem>(
    SECTOR_DATA[0]
  );
  const navigate = useNavigate();

  const handleFilterProjects = (sectorName: string) => {
    navigate(`/projects?category=${encodeURIComponent(sectorName)}`);
  };

  return (
    <div className="border border-slate-800/90 rounded-2xl bg-slate-900/60 backdrop-blur-md p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold block">
            Where Development Capital Goes
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Permissible Sector Expenditure Distribution
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Breakdown of ₹1,173.2 Crore sanctioned capital across core
            infrastructure categories under MPLADS Guidelines Annexure I.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-mono text-slate-400 block">
            Total Permissible Heads
          </span>
          <span className="text-lg font-bold font-mono text-emerald-400">
            7 Core Sectors
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {SECTOR_DATA.map((sector) => {
          const isSelected = selectedSector.code === sector.code;
          const Icon = sector.icon;

          return (
            <div
              key={sector.code}
              onClick={() => setSelectedSector(sector)}
              className={`p-4 rounded-xl border transition-all cursor-pointer text-left space-y-3 ${
                isSelected
                  ? "bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-950/30"
                  : "bg-slate-950/60 border-slate-800/70 hover:bg-slate-900/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${sector.color}20`,
                    color: sector.color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                  {sector.completionRate}% Done
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white tracking-tight line-clamp-1">
                  {sector.name}
                </h4>
                <div className="flex items-center justify-between text-[11px] font-mono mt-1 text-slate-400">
                  <span>₹{sector.allocatedCrore} Cr</span>
                  <span>{sector.totalWorks} Works</span>
                </div>
              </div>

              <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${sector.completionRate}%`,
                    backgroundColor: sector.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: selectedSector.color }}
            />
            <h4 className="text-sm font-bold text-white">
              {selectedSector.name}
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              Code: {selectedSector.code}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            ₹{selectedSector.allocatedCrore} Crore allocated • ₹
            {selectedSector.utilizedCrore} Crore disbursed •{" "}
            {selectedSector.completedWorks} of {selectedSector.totalWorks} works
            completed on site.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleFilterProjects(selectedSector.name)}
          className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-colors shrink-0"
        >
          View All {selectedSector.totalWorks} {selectedSector.name} Works →
        </button>
      </div>
    </div>
  );
};

export default SectorBreakdown;
