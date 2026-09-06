import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface StateData {
  id: string;
  name: string;
  code: string;
  sanctionedWorks: number;
  completedWorks: number;
  totalAllocatedCrore: number;
  totalUtilizedCrore: number;
  completionRate: number;
  constituenciesCount: number;
  primarySector: string;
  path: string;
  cx: number;
  cy: number;
}

const STATE_RECORDS: StateData[] = [
  {
    id: "UP",
    name: "Uttar Pradesh",
    code: "UP",
    sanctionedWorks: 1240,
    completedWorks: 1118,
    totalAllocatedCrore: 284.5,
    totalUtilizedCrore: 256.2,
    completionRate: 90.2,
    constituenciesCount: 80,
    primarySector: "Roads, Pathways & Bridges",
    path: "M 260 170 L 320 180 L 350 210 L 330 240 L 280 235 L 240 200 Z",
    cx: 290,
    cy: 205,
  },
  {
    id: "MH",
    name: "Maharashtra",
    code: "MH",
    sanctionedWorks: 940,
    completedWorks: 846,
    totalAllocatedCrore: 215.8,
    totalUtilizedCrore: 194.0,
    completionRate: 90.0,
    constituenciesCount: 48,
    primarySector: "Public Health & Wellness",
    path: "M 190 280 L 260 270 L 280 320 L 230 360 L 170 320 Z",
    cx: 225,
    cy: 315,
  },
  {
    id: "TN",
    name: "Tamil Nadu",
    code: "TN",
    sanctionedWorks: 780,
    completedWorks: 712,
    totalAllocatedCrore: 178.4,
    totalUtilizedCrore: 161.8,
    completionRate: 91.3,
    constituenciesCount: 39,
    primarySector: "Drinking Water & Sanitation",
    path: "M 210 440 L 250 430 L 260 480 L 220 520 L 200 480 Z",
    cx: 230,
    cy: 475,
  },
  {
    id: "BI",
    name: "Bihar",
    code: "BR",
    sanctionedWorks: 680,
    completedWorks: 602,
    totalAllocatedCrore: 154.2,
    totalUtilizedCrore: 136.5,
    completionRate: 88.5,
    constituenciesCount: 40,
    primarySector: "Education Infrastructure",
    path: "M 350 210 L 400 215 L 410 245 L 360 250 Z",
    cx: 380,
    cy: 230,
  },
  {
    id: "KA",
    name: "Karnataka",
    code: "KA",
    sanctionedWorks: 620,
    completedWorks: 554,
    totalAllocatedCrore: 142.6,
    totalUtilizedCrore: 128.0,
    completionRate: 89.4,
    constituenciesCount: 28,
    primarySector: "Rural Electrification",
    path: "M 190 370 L 230 360 L 240 430 L 190 440 Z",
    cx: 215,
    cy: 400,
  },
  {
    id: "GU",
    name: "Gujarat",
    code: "GJ",
    sanctionedWorks: 540,
    completedWorks: 489,
    totalAllocatedCrore: 124.0,
    totalUtilizedCrore: 112.5,
    completionRate: 90.6,
    constituenciesCount: 26,
    primarySector: "Skill Development Centers",
    path: "M 130 230 L 180 235 L 190 280 L 140 290 L 115 260 Z",
    cx: 155,
    cy: 260,
  },
  {
    id: "RA",
    name: "Rajasthan",
    code: "RJ",
    sanctionedWorks: 510,
    completedWorks: 458,
    totalAllocatedCrore: 118.5,
    totalUtilizedCrore: 104.2,
    completionRate: 89.8,
    constituenciesCount: 25,
    primarySector: "Drinking Water & Sanitation",
    path: "M 170 170 L 240 170 L 230 240 L 160 235 Z",
    cx: 200,
    cy: 205,
  },
  {
    id: "WB",
    name: "West Bengal",
    code: "WB",
    sanctionedWorks: 490,
    completedWorks: 432,
    totalAllocatedCrore: 112.0,
    totalUtilizedCrore: 98.7,
    completionRate: 88.2,
    constituenciesCount: 42,
    primarySector: "Community Assets & Halls",
    path: "M 410 230 L 435 240 L 420 300 L 395 280 Z",
    cx: 415,
    cy: 265,
  },
];

export interface IndiaInteractiveMapProps {
  onSelectState?: (stateName: string) => void;
}

export const IndiaInteractiveMap: React.FC<IndiaInteractiveMapProps> = ({
  onSelectState,
}) => {
  const [activeState, setActiveState] = useState<StateData>(STATE_RECORDS[0]);
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const navigate = useNavigate();

  const handleStateClick = (state: StateData) => {
    setActiveState(state);
    if (onSelectState) {
      onSelectState(state.name);
    } else {
      navigate(`/projects?state=${encodeURIComponent(state.name)}`);
    }
  };

  const currentDisplayState = hoveredState || activeState;

  return (
    <div className="border border-slate-800/90 rounded-2xl bg-slate-900/60 backdrop-blur-md p-6 lg:p-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="w-full lg:w-3/5 flex flex-col items-center relative">
          <div className="w-full max-w-[480px] aspect-[4/5] relative flex items-center justify-center">
            <svg
              viewBox="0 0 520 560"
              className="w-full h-full drop-shadow-2xl select-none"
              style={{
                filter: "drop-shadow(0 10px 25px rgba(2, 6, 23, 0.6))",
              }}
            >
              <path
                d="M 230 60 L 270 90 L 310 130 L 370 150 L 450 190 L 480 230 L 420 310 L 380 340 L 320 400 L 260 520 L 220 540 L 190 480 L 170 380 L 110 280 L 130 210 L 180 140 Z"
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {STATE_RECORDS.map((state) => {
                const isSelected = activeState.id === state.id;
                const isHovered = hoveredState?.id === state.id;

                return (
                  <g
                    key={state.id}
                    onClick={() => handleStateClick(state)}
                    onMouseEnter={() => setHoveredState(state)}
                    onMouseLeave={() => setHoveredState(null)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    <path
                      d={state.path}
                      fill={
                        isSelected
                          ? "#10b981"
                          : isHovered
                          ? "#3b82f6"
                          : "#1e293b"
                      }
                      stroke={
                        isSelected
                          ? "#34d399"
                          : isHovered
                          ? "#60a5fa"
                          : "#334155"
                      }
                      strokeWidth={isSelected || isHovered ? "2" : "1"}
                      className="transition-colors duration-200 hover:brightness-110"
                    />

                    <circle
                      cx={state.cx}
                      cy={state.cy}
                      r={isSelected ? 6 : isHovered ? 5 : 3.5}
                      fill={
                        isSelected
                          ? "#ffffff"
                          : isHovered
                          ? "#93c5fd"
                          : "#64748b"
                      }
                      className="transition-all duration-200"
                    />
                    <text
                      x={state.cx}
                      y={state.cy - 9}
                      textAnchor="middle"
                      fill={isSelected ? "#ffffff" : "#94a3b8"}
                      fontSize={isSelected ? "11" : "9"}
                      fontFamily="monospace"
                      fontWeight={isSelected ? "bold" : "normal"}
                      className="pointer-events-none select-none transition-all"
                    >
                      {state.code}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-2 left-2 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-[10px] font-mono text-slate-400 backdrop-blur-sm">
              <span>Click state to filter 5,200 verified works</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/5 space-y-5">
          <div className="border border-slate-800 rounded-xl bg-slate-950/80 p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold block">
                  State Development Profile
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                  {currentDisplayState.name}
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {currentDisplayState.constituenciesCount} Constituencies
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Sanctioned Works
                </span>
                <span className="text-xl font-bold font-mono text-white mt-1 block">
                  {currentDisplayState.sanctionedWorks.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  {currentDisplayState.completedWorks.toLocaleString("en-IN")}{" "}
                  Completed
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Sanctioned Capital
                </span>
                <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
                  ₹{currentDisplayState.totalAllocatedCrore}{" "}
                  <span className="text-xs text-slate-400">Cr</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                  ₹{currentDisplayState.totalUtilizedCrore} Cr Disbursed
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Physical Milestone Completion
                </span>
                <span className="font-bold text-emerald-400">
                  {currentDisplayState.completionRate}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentDisplayState.completionRate}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Primary Sector:</span>
              </div>
              <span className="font-semibold text-white font-mono text-[11px] truncate max-w-[180px]">
                {currentDisplayState.primarySector}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleStateClick(currentDisplayState)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 group"
            >
              <span>Inspect All {currentDisplayState.name} Projects</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaInteractiveMap;
