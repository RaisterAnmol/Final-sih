import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ErrorView } from "../components/errors/ErrorView";
import { ErrorType } from "../components/errors/types";

const ALL_ERROR_TYPES: Array<{
  id: ErrorType;
  label: string;
  category: "HTTP" | "SECURITY" | "PIPELINE" | "EVIDENCE";
}> = [
  { id: "404", label: "404 Not Found", category: "HTTP" },
  { id: "401", label: "401 Unauthorized", category: "SECURITY" },
  { id: "403", label: "403 Access Denied", category: "SECURITY" },
  { id: "429", label: "429 Rate Limited", category: "PIPELINE" },
  { id: "500", label: "500 System Error", category: "HTTP" },
  { id: "503", label: "503 Service Unavailable", category: "PIPELINE" },
  { id: "NETWORK", label: "Network Offline", category: "PIPELINE" },
  { id: "DATA_UNAVAILABLE", label: "Data Unavailable", category: "EVIDENCE" },
  { id: "ML_ERROR", label: "ML Analysis Failed", category: "PIPELINE" },
  { id: "PROJECT_NOT_FOUND", label: "Invalid Project", category: "EVIDENCE" },
  { id: "RISK_CASE_NOT_FOUND", label: "Case Not Found", category: "EVIDENCE" },
  { id: "IMPORT_ERROR", label: "CSV Import Failed", category: "PIPELINE" },
  { id: "REPORT_ERROR", label: "Report Gen Failed", category: "PIPELINE" },
  { id: "MAINTENANCE", label: "Maintenance Mode", category: "HTTP" },
];

export const ErrorShowcasePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as ErrorType) || "404";
  const [selectedType, setSelectedType] = useState<ErrorType>(initialType);

  const handleSelect = (t: ErrorType) => {
    setSelectedType(t);
    setSearchParams({ type: t });
  };

  return (
    <div className="relative">
      {/* Floating Category Selector Bar for SIH Evaluation / Testing */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-[#D9DEE7] dark:border-slate-800 py-2.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1F2A5A] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-xs border border-blue-200 dark:border-blue-800">
              AUDIT ERROR SUITE // SIH 2026
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Select error state to preview:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {ALL_ERROR_TYPES.map((item) => {
              const active = selectedType === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? "bg-[#1F2A5A] text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Render the Active Error State */}
      <ErrorView
        type={selectedType}
        resourceId={
          selectedType === "PROJECT_NOT_FOUND"
            ? "MPLAD-2024-NONEXISTENT-999"
            : selectedType === "RISK_CASE_NOT_FOUND"
            ? "CASE-2024-INVALID-999"
            : undefined
        }
      />
    </div>
  );
};

