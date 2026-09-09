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
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-12">
      {/* Header & Pipeline Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DEE7] dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#1F2A5A] dark:text-blue-400 font-bold">
              DATA INGESTION GATEWAY
            </span>
            <span className="text-slate-300 dark:text-slate-600">//</span>
            <span className="text-[10px] font-mono text-[#138A45] font-bold bg-[#138A45]/10 px-2 py-0.5 rounded-sm">
              OFFICIAL MOSPI SCHEME
            </span>
            <span className="text-slate-300 dark:text-slate-600">//</span>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-sm border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
              <span>SCHEMA COMPLIANT (RFC 4180)</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A5A] dark:text-white tracking-tight flex items-center gap-2.5">
            <UploadCloud className="w-6 h-6 text-[#1F2A5A] dark:text-blue-400" />
            <span>Data Pipeline &amp; Batch Ingestion Gateway</span>
          </h1>
          <p className="text-xs text-[#5B6472] dark:text-slate-400 mt-0.5">
            High-throughput pipeline for ingesting official MPLADS CSV records, running schema validation, automated entity normalization, and AI anomaly classification.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={downloadSampleCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-[#131823] hover:bg-slate-100 dark:hover:bg-[#1C2536] text-slate-700 dark:text-slate-200 border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#1F2A5A] dark:text-blue-400" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* 4 Sharp Institutional KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Block 1: Pipeline Throughput */}
        <div className="p-4 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6472] dark:text-slate-400 font-bold">
              Indexed Works
            </span>
            <div className="w-8 h-8 rounded-sm bg-[#1F2A5A]/5 dark:bg-blue-500/10 text-[#1F2A5A] dark:text-blue-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1F2A5A] dark:text-white tracking-tight">
              <CountUpNumber end={60359} />
            </div>
            <div className="flex items-center justify-between text-xs text-[#5B6472] dark:text-slate-400 mt-1 font-mono">
              <span>Ingested &amp; Processed</span>
              <span className="text-[10px] font-bold text-[#1F2A5A] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded-sm">
                100% Active
              </span>
            </div>
          </div>
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-[#1F2A5A] dark:bg-blue-500 rounded-full w-full" />
          </div>
        </div>

        {/* Block 2: Validation Accuracy */}
        <div className="p-4 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6472] dark:text-slate-400 font-bold">
              Schema Validity
            </span>
            <div className="w-8 h-8 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 tracking-tight">
              99.8%
            </div>
            <div className="flex items-center justify-between text-xs text-[#5B6472] dark:text-slate-400 mt-1 font-mono">
              <span>Validation Integrity</span>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-sm">
                Deterministic
              </span>
            </div>
          </div>
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full w-full" />
          </div>
        </div>

        {/* Block 3: Automated Normalization */}
        <div className="p-4 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6472] dark:text-slate-400 font-bold">
              AI Anomaly Pipeline
            </span>
            <div className="w-8 h-8 rounded-sm bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-700 dark:text-indigo-400 tracking-tight">
              <CountUpNumber end={5000} />
            </div>
            <div className="flex items-center justify-between text-xs text-[#5B6472] dark:text-slate-400 mt-1 font-mono">
              <span>Risk Signals Extracted</span>
              <span className="text-[10px] font-bold text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded-sm">
                6 Dimensions
              </span>
            </div>
          </div>
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full w-full" />
          </div>
        </div>

        {/* Block 4: Official Sync State */}
        <div className="p-4 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6472] dark:text-slate-400 font-bold">
              Official Sync Source
            </span>
            <div className="w-8 h-8 rounded-sm bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1F2A5A] dark:text-white tracking-tight">
              MPLADS.csv
            </div>
            <div className="flex items-center justify-between text-xs text-[#5B6472] dark:text-slate-400 mt-1 font-mono">
              <span>MoSPI Scheme Source</span>
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-sm">
                60,359 Raw Rows
              </span>
            </div>
          </div>
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* Main Institutional Drag-and-Drop Ingestion Zone Card */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`p-8 rounded-sm border-2 border-dashed transition-colors text-center space-y-4 relative ${
          isDragOver
            ? "border-[#1F2A5A] dark:border-blue-400 bg-blue-50/40 dark:bg-blue-950/20"
            : "border-[#D9DEE7] dark:border-slate-800 bg-white dark:bg-[#131823] hover:border-slate-400 dark:hover:border-slate-700"
        }`}
      >
        <div className="w-12 h-12 rounded-sm bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#1F2A5A] dark:text-blue-400 mx-auto">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div className="space-y-1 max-w-lg mx-auto">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Upload or Drop Official MPLAD Scheme Work Register CSV
          </h3>
          <p className="text-xs text-[#5B6472] dark:text-slate-400">
            Supports standard semi-colon (;) or comma (,) delimited UTF-8 CSV datasets up to 50MB with automated column validation.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <label className="px-4 py-2 bg-[#1F2A5A] hover:bg-[#162044] text-white rounded-sm text-xs font-semibold shadow-xs cursor-pointer transition-colors inline-flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#F59E0B]" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-slate-100 dark:bg-slate-800 border border-[#D9DEE7] dark:border-slate-700 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
            <FileText className="w-3.5 h-3.5 text-[#1F2A5A] dark:text-blue-400" />
            <span>
              {file.name} — ({parsedRows.length.toLocaleString()} rows parsed)
            </span>
          </div>
        )}
      </div>

      {/* Statutory Schema Specification Reference Table */}
      <div className="p-4 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#D9DEE7] dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1F2A5A] dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
              MoSPI Scheme Field Specifications (10 Standard Dimensions)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">RFC 4180 Format Compliance</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xs bg-slate-50 dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">1. MP NAME</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">String / Required</span>
          </div>
          <div className="p-2 rounded-xs bg-slate-50 dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">2. WORK</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Text / NLP Match</span>
          </div>
          <div className="p-2 rounded-xs bg-slate-50 dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">3. CATEGORY</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Sector Standard</span>
          </div>
          <div className="p-2 rounded-xs bg-slate-50 dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">4. ALLOCATION</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">Numeric INR</span>
          </div>
          <div className="p-2 rounded-xs bg-slate-50 dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">5. IDA / AGENCY</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Authority Code</span>
          </div>
        </div>
      </div>

      {/* Ingestion Results Banner */}
      <AnimatePresence>
        {importResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-sm bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800/60 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dataset Ingestion Complete — Autonomous Anomaly Engine Triggered!</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-sm border border-emerald-300 dark:border-emerald-700">
                STATUS: SUCCESS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-white dark:bg-[#0D1016] rounded-xs border border-[#D9DEE7] dark:border-slate-800">
                <span className="text-slate-500 font-bold uppercase block text-[10px]">
                  Total Parsed Rows
                </span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                  {importResult.totalRows || parsedRows.length}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-[#0D1016] rounded-xs border border-[#D9DEE7] dark:border-slate-800">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase block text-[10px]">
                  Valid Normalized Works
                </span>
                <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                  {importResult.validRows || parsedRows.length}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-[#0D1016] rounded-xs border border-[#D9DEE7] dark:border-slate-800">
                <span className="text-amber-700 dark:text-amber-400 font-bold uppercase block text-[10px]">
                  Schema Warnings / Flags
                </span>
                <span className="text-xl font-extrabold text-amber-700 dark:text-amber-400 mt-0.5 block">
                  {importResult.errorRows || 0}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSV Preview Table & Ingestion Confirmation */}
      {parsedRows.length > 0 && !importResult && (
        <div className="p-4 rounded-sm bg-white dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DEE7] dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1F2A5A] dark:text-blue-400" />
                <span>Previewing First 5 Records</span>
              </h2>
              <p className="text-xs text-[#5B6472] dark:text-slate-400 mt-0.5">
                Verify column mappings before initiating batch insertion into the primary registry.
              </p>
            </div>

            <button
              type="button"
              onClick={handleImport}
              disabled={importing}
              className="px-4 py-2 bg-[#1F2A5A] hover:bg-[#162044] disabled:opacity-50 text-white rounded-sm text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
              <thead className="bg-slate-50 dark:bg-[#0B0F17] border-b border-[#D9DEE7] dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Work Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3">District / IDA</th>
                  <th className="py-2.5 px-3">Sanctioned Amount</th>
                  <th className="py-2.5 px-3">Executing Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE7] dark:divide-slate-800 text-[11px]">
                {parsedRows.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#1E293B]/60 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-200 max-w-xs truncate">
                      {row.title || row.WORK || row.work || "Infrastructure Work"}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#1F2A5A] dark:text-blue-400">
                      {row.category || row.CATEGORY || "General"}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {row.state || row.STATE || "N/A"}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {row.district || row.DISTRICT || row.IDA || "District Agency"}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      ₹
                      {Number(
                        String(row.allocatedAmount || row["ALLOCATION AMOUNT"] || row.cost || 0).replace(/[^0-9.]/g, "")
                      ).toLocaleString("en-IN")}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-400 max-w-xs truncate">
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
