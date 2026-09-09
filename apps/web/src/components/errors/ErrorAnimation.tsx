import React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Lock,
  ServerCrash,
  Cpu,
  WifiOff,
  Clock,
  FileSpreadsheet,
  FileWarning,
  FileQuestion,
  Wrench,
  ShieldAlert,
  ShieldCheck,
  ZapOff,
} from "lucide-react";
import { ErrorType } from "./types";

export const ErrorAnimation: React.FC<{ type: ErrorType; code?: string | number }> = ({
  type,
  code,
}) => {
  switch (type) {
    // 1. Radar / Telemetry Sonar (404, Project Not Found, Risk Case Not Found)
    case "404":
    case "PROJECT_NOT_FOUND":
    case "RISK_CASE_NOT_FOUND":
      return (
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.45, 1], opacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#1F2A5A] dark:border-blue-500"
          />
          <motion.div
            animate={{ scale: [1.2, 1.7, 1.2], opacity: [0.08, 0.25, 0.08] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute inset-0 rounded-full border border-indigo-400 dark:border-indigo-600"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(31, 42, 90, 0.14) 360deg)",
            }}
          />
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-28 h-28 rounded-2xl bg-white dark:bg-[#131823] border-2 border-[#1F2A5A]/20 dark:border-blue-500/30 shadow-xl flex flex-col items-center justify-center"
          >
            {type === "PROJECT_NOT_FOUND" ? (
              <FileQuestion className="w-8 h-8 text-[#1F2A5A] dark:text-blue-400 mb-1" />
            ) : type === "RISK_CASE_NOT_FOUND" ? (
              <FileWarning className="w-8 h-8 text-[#1F2A5A] dark:text-blue-400 mb-1" />
            ) : (
              <Compass className="w-8 h-8 text-[#1F2A5A] dark:text-blue-400 mb-1" />
            )}
            <div className="text-2xl font-black font-mono tracking-tight text-[#1F2A5A] dark:text-white">
              {code || "404"}
            </div>
            <div className="text-[9px] font-mono font-bold tracking-wider text-[#5B6472] dark:text-slate-400 uppercase">
              {type === "PROJECT_NOT_FOUND"
                ? "NO RECORD"
                : type === "RISK_CASE_NOT_FOUND"
                ? "NO CASE"
                : "UNRESOLVED"}
            </div>
          </motion.div>
        </div>
      );

    // 2. Security Shield & Laser Scan (401, 403)
    case "401":
    case "403":
      return (
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-3xl border-2 border-dashed border-rose-400/35 dark:border-rose-600/40"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-3 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-800"
          />
          <motion.div
            animate={{ y: [-45, 45, -45] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-36 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent z-20 shadow-[0_0_12px_rgba(244,63,94,0.8)]"
          />
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-28 h-28 rounded-2xl bg-white dark:bg-[#131823] border-2 border-rose-200 dark:border-rose-800 shadow-xl flex flex-col items-center justify-center"
          >
            {type === "401" ? (
              <ShieldAlert className="w-9 h-9 text-rose-600 dark:text-rose-400 mb-1" />
            ) : (
              <Lock className="w-9 h-9 text-rose-600 dark:text-rose-400 mb-1" />
            )}
            <div className="text-2xl font-black font-mono text-rose-700 dark:text-rose-400">
              {code || (type === "401" ? "401" : "403")}
            </div>
            <div className="text-[9px] font-mono font-bold text-[#5B6472] dark:text-slate-400 uppercase tracking-wider">
              {type === "401" ? "UNAUTHORIZED" : "RESTRICTED"}
            </div>
          </motion.div>
        </div>
      );

    // 3. System Error / Telemetry Fracture (500)
    case "500":
      return (
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-amber-400/50 dark:border-amber-500/30"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-4 rounded-full bg-amber-500/10 border border-amber-400/40"
          />
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-28 h-28 rounded-2xl bg-white dark:bg-[#131823] border-2 border-amber-300 dark:border-amber-800/60 shadow-xl flex flex-col items-center justify-center"
          >
            <ServerCrash className="w-9 h-9 text-amber-600 dark:text-amber-400 mb-1" />
            <div className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">
              500
            </div>
            <div className="text-[9px] font-mono font-bold text-[#5B6472] dark:text-slate-400 uppercase tracking-wider">
              SYSTEM ERROR
            </div>
          </motion.div>
        </div>
      );

    // 4. ML / Microservice Circuit Interruption (503, ML_ERROR)
    case "503":
    case "ML_ERROR":
      return (
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ scale: [0.95, 1.15, 0.95], rotate: [0, 180, 360] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-2xl border border-dashed border-purple-400/40 dark:border-purple-600/40"
          />
          <motion.div
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-3 rounded-xl bg-purple-500/10 border border-purple-300 dark:border-purple-800"
          />
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-28 h-28 rounded-2xl bg-white dark:bg-[#131823] border-2 border-purple-300 dark:border-purple-800 shadow-xl flex flex-col items-center justify-center"
          >
            <Cpu className="w-9 h-9 text-purple-600 dark:text-purple-400 mb-1" />
            <div className="text-2xl font-black font-mono text-purple-700 dark:text-purple-400">
              {type === "ML_ERROR" ? "ML-ERR" : "503"}
            </div>
            <div className="text-[9px] font-mono font-bold text-[#5B6472] dark:text-slate-400 uppercase tracking-wider">
              AI PIPELINE
            </div>
          </motion.div>
        </div>
      );

    // 5. Network Link Disconnected
    case "NETWORK":
      return (
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-2 rounded-full border border-sky-400/60"
          />
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-28 h-28 rounded-2xl bg-white dark:bg-[#131823] border-2 border-sky-300 dark:border-sky-800 shadow-xl flex flex-col items-center justify-center"
          >
            <WifiOff className="w-9 h-9 text-sky-600 dark:text-sky-400 mb-1" />
            <div className="text-xl font-black font-mono text-sky-700 dark:text-sky-400">
              OFFLINE
            </div>
            <div className="text-[9px] font-mono font-bold text-[#5B6472] dark:text-slate-400 uppercase tracking-wider">
              GATEWAY LINK
            </div>
          </motion.div>
        </div>
      );

    // 6. Rate Limit (429)
    case "429":
      return (
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/50"
          />
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-28 h-28 rounded-2xl bg-white dark:bg-[#131823] border-2 border-amber-300 dark:border-amber-800 shadow-xl flex flex-col items-center justify-center"
          >
            <Clock className="w-9 h-9 text-amber-600 dark:text-amber-400 mb-1" />
            <div className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">
              429
            </div>
            <div className="text-[9px] font-mono font-bold text-[#5B6472] dark:text-slate-400 uppercase tracking-wider">
              RATE LIMIT
            </div>
          </motion.div>
        </div>
      );

    // 7. Data Ingestion / CSV Validation (IMPORT_ERROR)
    case "IMPORT_ERROR":
      return (
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-2 rounded-2xl border border-dashed border-rose-400/40"
          />
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-28 h-28 rounded-2xl bg-white dark:bg-[#131823] border-2 border-rose-300 dark:border-rose-800 shadow-xl flex flex-col items-center justify-center"
          >
            <FileSpreadsheet className="w-9 h-9 text-rose-600 dark:text-rose-400 mb-1" />
            <div className="text-lg font-black font-mono text-rose-700 dark:text-rose-400">
              IMPORT ERR
            </div>
            <div className="text-[9px] font-mono font-bold text-[#5B6472] dark:text-slate-400 uppercase tracking-wider">
              VALIDATION
            </div>
          </motion.div>
        </div>
      );

    // 8. Report Generation Error
    case "REPORT_ERROR":
      return (
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-2xl border border-dashed border-indigo-400/40"
          />
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-28 h-28 rounded-2xl bg-white dark:bg-[#131823] border-2 border-indigo-300 dark:border-indigo-800 shadow-xl flex flex-col items-center justify-center"
          >
            <FileWarning className="w-9 h-9 text-indigo-600 dark:text-indigo-400 mb-1" />
            <div className="text-lg font-black font-mono text-indigo-700 dark:text-indigo-400">
              REPORT ERR
            </div>
            <div className="text-[9px] font-mono font-bold text-[#5B6472] dark:text-slate-400 uppercase tracking-wider">
              GENERATION
            </div>
          </motion.div>
        </div>
      );

    // 9. Maintenance Mode
    case "MAINTENANCE":
      return (
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-slate-400/40"
          />
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-28 h-28 rounded-2xl bg-white dark:bg-[#131823] border-2 border-slate-300 dark:border-slate-700 shadow-xl flex flex-col items-center justify-center"
          >
            <Wrench className="w-9 h-9 text-slate-700 dark:text-slate-300 mb-1" />
            <div className="text-xl font-black font-mono text-slate-800 dark:text-white">
              MAINT
            </div>
            <div className="text-[9px] font-mono font-bold text-[#5B6472] dark:text-slate-400 uppercase tracking-wider">
              SCHEDULED
            </div>
          </motion.div>
        </div>
      );

    // 10. Data Unavailable (Evidence-first missing field state)
    case "DATA_UNAVAILABLE":
    default:
      return (
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-2 rounded-2xl border border-dashed border-amber-400/50"
          />
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-28 h-28 rounded-2xl bg-white dark:bg-[#131823] border-2 border-amber-300 dark:border-amber-800 shadow-xl flex flex-col items-center justify-center"
          >
            <ZapOff className="w-9 h-9 text-amber-600 dark:text-amber-400 mb-1" />
            <div className="text-lg font-black font-mono text-amber-700 dark:text-amber-400">
              UNAVAILABLE
            </div>
            <div className="text-[9px] font-mono font-bold text-[#5B6472] dark:text-slate-400 uppercase tracking-wider">
              SOURCE GAP
            </div>
          </motion.div>
        </div>
      );
  }
};

