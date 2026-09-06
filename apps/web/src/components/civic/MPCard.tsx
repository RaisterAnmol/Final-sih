import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface MPRecord {
  id: string;
  name: string;
  constituency: string;
  state: string;
  house: "LOK_SABHA" | "RAJYA_SABHA";
  party?: string;
  termYears: string;
  entitlementINR: number;
  utilizedINR: number;
  totalWorks: number;
  completedWorks: number;
  completionRate: number;
  primarySectorFocus: string;
  avatarUrl?: string;
}

export interface MPCardProps {
  mp: MPRecord;
  onClick?: () => void;
}

export const MPCard: React.FC<MPCardProps> = ({ mp, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(
        `/projects?state=${encodeURIComponent(
          mp.state
        )}&search=${encodeURIComponent(mp.constituency)}`
      );
    }
  };

  const utilizationRate = Math.min(
    100,
    Math.round((mp.utilizedINR / mp.entitlementINR) * 100)
  );

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={handleClick}
      className="border border-slate-800/90 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700/90 p-5 space-y-4 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-blue-950/20 transition-all text-left flex flex-col justify-between group"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-900/60 to-indigo-800/60 border border-blue-700/40 flex items-center justify-center text-blue-300 font-bold text-base shrink-0 group-hover:border-blue-500 transition-colors">
              {mp.avatarUrl ? (
                <img
                  src={mp.avatarUrl}
                  alt={mp.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span>
                  {mp.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                {mp.name}
              </h4>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="truncate">
                  {mp.constituency}, {mp.state}
                </span>
              </div>
            </div>
          </div>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold border ${
              mp.house === "LOK_SABHA"
                ? "bg-emerald-950/70 text-emerald-300 border-emerald-800/60"
                : "bg-indigo-950/70 text-indigo-300 border-indigo-800/60"
            }`}
          >
            {mp.house === "LOK_SABHA" ? "Lok Sabha" : "Rajya Sabha"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/70">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Entitlement Draw
            </span>
            <span className="text-sm font-bold font-mono text-amber-400 mt-0.5 block">
              ₹{(mp.utilizedINR / 10000000).toFixed(2)}{" "}
              <span className="text-[10px] text-slate-400">/ ₹5.00 Cr</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {utilizationRate}% Disbursed
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Sanctioned Works
            </span>
            <span className="text-sm font-bold font-mono text-white mt-0.5 block">
              {mp.totalWorks}{" "}
              <span className="text-[10px] text-slate-400">Projects</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              {mp.completedWorks} Completed
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Execution Benchmark</span>
            <span className="font-bold text-emerald-400">
              {mp.completionRate}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
              style={{ width: `${mp.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[10px] font-mono truncate max-w-[170px]">
          Focus: <strong className="text-slate-300">{mp.primarySectorFocus}</strong>
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-blue-400 group-hover:text-blue-300 text-[11px]">
          <span>View Works</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </motion.div>
  );
};

export default MPCard;
