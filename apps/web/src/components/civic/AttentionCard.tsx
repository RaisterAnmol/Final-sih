import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface AttentionItem {
  id: string;
  projectId: string;
  projectTitle: string;
  district: string;
  state: string;
  category: string;
  allocatedAmount: number;
  utilizedAmount: number;
  indicatorType:
    | "SANCTION_DISPARITY"
    | "VENDOR_CONCENTRATION"
    | "TIMELINE_EXTENSION"
    | "DUPLICATE_SCOPE";
  flagTitle: string;
  flagReason: string;
  evidence: string;
  severity: "REVIEW_RECOMMENDED" | "HIGH_ATTENTION" | "CRITICAL_REVIEW";
  sourceRule: string;
}

export interface AttentionCardProps {
  item: AttentionItem;
}

export const AttentionCard: React.FC<AttentionCardProps> = ({ item }) => {
  const navigate = useNavigate();

  const getSeverityBadge = () => {
    switch (item.severity) {
      case "CRITICAL_REVIEW":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-950/80 text-red-300 border border-red-800/60">
            Priority Audit Review
          </span>
        );
      case "HIGH_ATTENTION":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/60">
            High Variance Indicator
          </span>
        );
      case "REVIEW_RECOMMENDED":
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
            Standard Verification Flag
          </span>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="border border-slate-800/80 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700/90 p-5 space-y-3.5 shadow-lg text-left flex flex-col justify-between"
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {getSeverityBadge()}
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            Rule {item.sourceRule}
          </span>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">
            {item.flagTitle}
          </h4>
          <p className="text-xs text-slate-300 font-medium mt-0.5 line-clamp-1">
            {item.projectTitle}
          </p>
          <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
            Ref: {item.projectId} • {item.district}, {item.state}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/70 space-y-1.5 text-xs">
          <div className="flex items-start gap-1.5 text-slate-300">
            <span className="font-semibold text-amber-400 shrink-0">
              Why flagged:
            </span>
            <span className="leading-relaxed">{item.flagReason}</span>
          </div>

          <div className="flex items-start gap-1.5 text-slate-400 text-[11px] pt-1 border-t border-slate-900">
            <span className="font-semibold text-slate-300 shrink-0">
              Evidence:
            </span>
            <span className="leading-relaxed font-mono">{item.evidence}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-500">
          Financial Impact: ₹{(item.allocatedAmount / 100000).toFixed(1)}L
        </span>

        <button
          type="button"
          onClick={() => navigate(`/projects/${item.projectId}`)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 group"
        >
          <span>View Verification File</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default AttentionCard;
