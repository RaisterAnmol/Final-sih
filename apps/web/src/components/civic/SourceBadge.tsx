import React, { useState } from "react";
import { ShieldCheck, Info, ExternalLink, X } from "lucide-react";

export type SourceType = "OFFICIAL" | "DERIVED" | "SYNTHETIC" | "NOT_AVAILABLE";

export interface SourceBadgeProps {
  type?: SourceType;
  sourceOrg?: string;
  sourceDoc?: string;
  sourceUrl?: string;
  retrievedDate?: string;
  methodology?: string;
  compact?: boolean;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  type = "OFFICIAL",
  sourceOrg = "Ministry of Statistics & Programme Implementation (MoSPI) / PIB",
  sourceDoc = "MPLADS Guidelines 2023 & PIB Work Releases",
  sourceUrl = "https://mospi.gov.in/mplads",
  retrievedDate = "2026-08-29",
  methodology = "Directly extracted from published Government of India records and verified work registers.",
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getBadgeStyle = () => {
    switch (type) {
      case "OFFICIAL":
        return "bg-blue-950/60 text-blue-300 border-blue-800/60 hover:bg-blue-900/60 hover:border-blue-700";
      case "DERIVED":
        return "bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60 hover:border-emerald-700";
      case "NOT_AVAILABLE":
        return "bg-slate-900 text-slate-400 border-slate-700/80 hover:bg-slate-800";
      case "SYNTHETIC":
      default:
        return "bg-amber-950/40 text-amber-300 border-amber-800/50 hover:bg-amber-900/50";
    }
  };

  const getBadgeLabel = () => {
    switch (type) {
      case "OFFICIAL":
        return "✓ Official MoSPI Source";
      case "DERIVED":
        return "∑ Computed from Official Data";
      case "NOT_AVAILABLE":
        return "— Not Publicly Available";
      case "SYNTHETIC":
      default:
        return "Auditor Model Projection";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-md border font-mono transition-all text-left group ${
          compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
        } ${getBadgeStyle()}`}
        title="Click to view data source & verification provenance"
      >
        <ShieldCheck
          className={
            compact ? "w-3 h-3 text-blue-400" : "w-3.5 h-3.5 text-blue-400"
          }
        />
        <span className="font-semibold tracking-tight">{getBadgeLabel()}</span>
        <Info className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  Data Provenance & Audit Verification
                </h4>
                <span className="text-[10px] font-mono text-emerald-400">
                  {getBadgeLabel()}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Sponsoring Authority
                </span>
                <p className="text-slate-200 font-medium mt-0.5">{sourceOrg}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Source Citation / Document
                </span>
                <p className="text-slate-200 font-medium mt-0.5">{sourceDoc}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Methodology & Derivation
                </span>
                <p className="text-slate-300 leading-relaxed mt-0.5">
                  {methodology}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                <span className="text-slate-400 font-mono">
                  Retrieved: {retrievedDate}
                </span>
                {sourceUrl && sourceUrl !== "NOT_PUBLICLY_AVAILABLE" && (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-mono underline underline-offset-2"
                  >
                    <span>Inspect Portal Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SourceBadge;
