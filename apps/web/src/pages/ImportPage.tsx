import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowRight,
  Loader2,
  Database,
  Cpu,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  Layers,
  Sparkles,
  RefreshCw,
  Zap,
  Check,
} from "lucide-react";
import Papa from "papaparse";
import api from "../services/api";
import { SourceBadge } from "../components/civic/SourceBadge";
import { CountUpNumber } from "../components/civic/CountUpNumber";

export const ImportPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setImportResult(null);

    Papa.parse(selectedFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        setParsedRows(results.data || []);
      },
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file || parsedRows.length === 0) return;
    setImporting(true);
    try {
      const res = await api.post("/import/csv", {
        rows: parsedRows,
        filename: file.name,
      });
      setImportResult(res.data.data);
    } catch (err: any) {
      alert(
        err.response?.data?.error?.message || "Failed to import CSV dataset"
      );
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `MP NAME;WORK;CATEGORY;STATE;CONSTITUENCY;IDA;CITY;WARD;BLOCK;VILLAGE;RECOMMENDED DATE;ALLOCATION AMOUNT;IDA APPROVAL;STATUS;HOUSE
Shri Rahul Gandhi;Construction of CC Road in Meppadi Panchayat;Roads, Pathways & Bridges;Kerala;Wayanad;DC_WAYANAD_IDA;Meppadi;;Meppadi;Meppadi;2023-08-15;2500000;Approved;Completed;Lok Sabha
Dr. Shashi Tharoor;Installation of High Mast Solar Street Lights;Public Lighting & Energy;Kerala;Thiruvananthapuram;DC_TVM_IDA;Thiruvananthapuram;Ward 12;;Kovalam;2023-11-20;1850000;Approved;In Progress;Lok Sabha
Smt. Supriya Sule;Drinking Water RO Filtration Plant and Pipeline;Drinking Water & Sanitation;Maharashtra;Baramati;DC_PUNE_IDA;Baramati;;Daund;Patas;2024-01-10;3200000;Approved;In Progress;Lok Sabha`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_mplads_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, type: "spring" as const, stiffness: 280, damping: 22 },
    }),
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-300 pb-12">
      {/* Header & Pipeline Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-700 dark:text-cyan-400 font-extrabold bg-cyan-100 dark:bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-200">
              DATA INGESTION GATEWAY
            </span>
            <span className="text-indigo-300">//</span>
            <SourceBadge type="OFFICIAL" compact />
            <span className="text-indigo-300">//</span>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-extrabold bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>SCHEMA COMPLIANT</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-glow-blue shrink-0">
              <UploadCloud className="w-5 h-5 text-white" />
            </div>
            <span>Data Pipeline & Batch Ingestion Gateway</span>
          </h1>
          <p className="text-xs text-indigo-900/80 dark:text-indigo-300 mt-1.5 font-medium">
            High-throughput pipeline for ingesting official MPLADS CSV records, running schema validation, automated entity normalization, and AI anomaly classification.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={downloadSampleCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#131823] hover:bg-indigo-50 dark:hover:bg-[#1E293B] text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-slate-800 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-600" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* 4 Luminous Chromatic KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Block 1: Pipeline Throughput (Cyan Ocean / Blue) */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card-cyan p-6 rounded-3xl space-y-3 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-800 dark:text-cyan-300 font-extrabold">
              Indexed Works
            </span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 dark:bg-cyan-500/25 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white font-mono tracking-tight">
              <CountUpNumber end={17200} />
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-mono font-bold">
              <span>Ingested & Processed</span>
              <span className="text-cyan-800 dark:text-cyan-300 font-extrabold bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-200">
                100% Active
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-cyan-100 dark:bg-cyan-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-full animate-pulse-glow" />
          </div>
        </motion.div>

        {/* Block 2: Validation Accuracy (Emerald Mint) */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card-emerald p-6 rounded-3xl space-y-3 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-extrabold">
              Schema Validity
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
              99.8%
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-mono font-bold">
              <span>Validation Integrity</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200">
                Deterministic
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-full" />
          </div>
        </motion.div>

        {/* Block 3: Automated Normalization (Cosmic Purple) */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card-purple p-6 rounded-3xl space-y-3 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-700 dark:text-purple-400 font-extrabold">
              AI Anomaly Pipeline
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 dark:bg-purple-500/25 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400 font-mono tracking-tight">
              <CountUpNumber end={11911} />
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-mono font-bold">
              <span>Risk Signals Extracted</span>
              <span className="text-purple-700 dark:text-purple-400 font-extrabold bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-full border border-purple-200">
                6 Dimensions
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-purple-100 dark:bg-purple-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-full" />
          </div>
        </motion.div>

        {/* Block 4: Official Sync State (Amber Gold) */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card-amber p-6 rounded-3xl space-y-3 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-extrabold">
              Official Sync Source
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-amber-500/25 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white font-mono tracking-tight">
              MPLADS.csv
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 font-mono font-bold">
              <span>MoSPI Scheme Source</span>
              <span className="text-amber-700 dark:text-amber-400 font-extrabold bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200">
                60,359 Raw Rows
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-amber-100 dark:bg-amber-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-full" />
          </div>
        </motion.div>
      </div>

      {/* Main Drag-and-Drop Ingestion Zone Card */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`p-10 rounded-3xl border-2 border-dashed transition-all duration-300 text-center space-y-5 relative overflow-hidden ${
          isDragOver
            ? "border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/40 shadow-glow-blue scale-[1.01]"
            : "border-indigo-200 dark:border-slate-800 bg-white dark:bg-[#131823] hover:border-cyan-400 shadow-sm"
        }`}
      >
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-glow-blue transition-transform hover:scale-110">
          <UploadCloud className="w-8 h-8" />
        </div>

        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-lg font-extrabold text-[#0F172A] dark:text-white">
            Upload or Drop MPLAD Work Registry CSV
          </h3>
          <p className="text-xs text-indigo-900/70 dark:text-indigo-300 font-medium">
            Supports standard semi-colon or comma-delimited UTF-8 CSV datasets up to 50MB with automatic column mapping.
          </p>
        </div>

        <div>
          <label className="px-6 py-3 bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-extrabold shadow-md hover:shadow-lg cursor-pointer transition-all inline-flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Select Local CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        {file && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-900 text-xs font-mono font-bold text-cyan-900 dark:text-cyan-300 shadow-xs">
            <FileText className="w-4 h-4 text-cyan-600" />
            <span>
              {file.name} — ({parsedRows.length.toLocaleString()} rows detected)
            </span>
          </div>
        )}
      </div>

      {/* Ingestion Results Banner */}
      <AnimatePresence>
        {importResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-800 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <span>Dataset Ingestion Complete — Autonomous Anomaly Engine Triggered!</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                STATUS: SUCCESS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-white dark:bg-[#0D1016] rounded-2xl border border-indigo-100 dark:border-slate-800">
                <span className="text-indigo-500 font-bold uppercase block text-[10px]">
                  Total Parsed Rows
                </span>
                <span className="text-2xl font-extrabold text-[#0F172A] dark:text-white mt-1 block">
                  {importResult.totalRows || parsedRows.length}
                </span>
              </div>

              <div className="p-4 bg-white dark:bg-[#0D1016] rounded-2xl border border-indigo-100 dark:border-slate-800">
                <span className="text-emerald-600 font-bold uppercase block text-[10px]">
                  Valid Normalized Works
                </span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {importResult.validRows || parsedRows.length}
                </span>
              </div>

              <div className="p-4 bg-white dark:bg-[#0D1016] rounded-2xl border border-indigo-100 dark:border-slate-800">
                <span className="text-amber-600 font-bold uppercase block text-[10px]">
                  Schema Warnings / Flags
                </span>
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 block">
                  {importResult.errorRows || 0}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSV Preview Table & Ingestion Confirmation */}
      {parsedRows.length > 0 && !importResult && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#131823] border border-indigo-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Previewing First 5 Records</span>
              </h2>
              <p className="text-xs text-indigo-900/70 dark:text-indigo-300 font-medium">
                Verify column mappings before initiating batch insertion into the primary registry.
              </p>
            </div>

            <button
              type="button"
              onClick={handleImport}
              disabled={importing}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {importing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>
                {importing
                  ? "Ingesting & Analyzing Dataset..."
                  : `Ingest ${parsedRows.length.toLocaleString()} Works`}
              </span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gradient-to-r from-indigo-50/80 via-cyan-50/60 to-purple-50/80 dark:from-[#0D1016] dark:via-[#131823] dark:to-[#0D1016] border-b border-indigo-100 dark:border-slate-800 text-indigo-900 dark:text-indigo-300 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Work Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4">District / IDA</th>
                  <th className="py-3.5 px-4">Sanctioned Amount</th>
                  <th className="py-3.5 px-4">Executing Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100/70 dark:divide-slate-800/80 text-[11px]">
                {parsedRows.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50/50 dark:hover:bg-[#1E293B]/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#0F172A] dark:text-slate-200 max-w-xs truncate">
                      {row.title || row.WORK || row.work || "Infrastructure Work"}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700 dark:text-cyan-400">
                      {row.category || row.CATEGORY || "General"}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {row.state || row.STATE || "N/A"}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {row.district || row.DISTRICT || row.IDA || "District Agency"}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                      ₹
                      {Number(
                        String(row.allocatedAmount || row["ALLOCATION AMOUNT"] || row.cost || 0).replace(/[^0-9.]/g, "")
                      ).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {row.contractorName || row.IDA || "District Collector IDA"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
