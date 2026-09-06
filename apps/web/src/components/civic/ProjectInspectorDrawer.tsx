import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  X,
  ArrowUpRight,
  Briefcase,
  AlertTriangle,
  Building2,
  MapPin,
  Calendar,
  ShieldAlert,
  Download,
  Coins,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingUp,
  FileText,
  Info,
  Users,
  Database,
} from "lucide-react";
import { Project, RiskLevel } from "../../types";
import { RiskBadge } from "../common/RiskBadge";
import { SourceBadge } from "./SourceBadge";
import api from "../../services/api";

export interface ProjectInspectorDrawerProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectInspectorDrawer: React.FC<ProjectInspectorDrawerProps> = ({
  project,
  onClose,
}) => {
  const navigate = useNavigate();
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [casePriority, setCasePriority] = useState("HIGH");
  const [caseNote, setCaseNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [caseCreatedMsg, setCaseCreatedMsg] = useState("");

  if (!project) return null;

  const handleEscalateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/risk-cases", {
        projectId: project.projectId,
        priority: casePriority,
        initialNote:
          caseNote ||
          `Administrative inquiry initiated for ${project.title} (Risk: ${project.riskScore}/100)`,
      });
      setCaseCreatedMsg(
        `Review Inquiry Case ${res.data.data.case?.caseId || ""} successfully opened!`,
      );
      setTimeout(() => {
        setCaseCreatedMsg("");
        setShowCaseForm(false);
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to open review case");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const jsPDFModule = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");
      const jsPDF = jsPDFModule.default;
      const autoTable = autoTableModule.default;

      const doc = new jsPDF();
      doc.setFillColor(31, 42, 90);
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("GOVERNMENT OF INDIA — MPLADS STATUTORY RECORD DOSSIER", 14, 18);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Ministry of Statistics & Programme Implementation | Smart India Hackathon Prototype",
        14,
        25,
      );
      doc.text(
        `Generated: ${new Date().toLocaleDateString()} | Work ID: ${project.projectId}`,
        14,
        30,
      );

      autoTable(doc, {
        startY: 45,
        head: [["Attribute", "Source Record Value"]],
        body: [
          ["Work ID", project.projectId],
          ["Title", project.title],
          ["Category", project.category],
          ["MP Name & House", `${project.mpName || "N/A"} (${(project as any).house || "Lok Sabha"})`],
          ["State & District", `${project.district}, ${project.state}`],
          ["Constituency", project.constituency || "N/A"],
          ["Implementing Authority (IDA)", (project as any).implementingAgency || (project as any).ida || "District Authority"],
          ["Recommended Allocation", `Rs. ${(project.allocatedAmount || 0).toLocaleString("en-IN")}`],
          [
            "Utilized Expenditure",
            project.utilizedAmount != null
              ? `Rs. ${project.utilizedAmount.toLocaleString("en-IN")}`
              : "Not available in current source snapshot",
          ],
          [
            "Physical Progress",
            project.progress != null
              ? `${project.progress}%`
              : "Not available in current source snapshot",
          ],
          ["Status", (project as any).rawStatus || project.status],
          ["Analytical Review Score", `${project.riskScore}/100 [Level: ${project.riskLevel}]`],
        ],
        theme: "striped",
        headStyles: { fillColor: [31, 42, 90], textColor: [255, 255, 255] },
      });

      doc.save(`MPLADS_Dossier_${project.projectId}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#090B0F]/50 backdrop-blur-xs transition-opacity cursor-pointer"
        />

        {/* Slide-Over Drawer Container */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 320 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#0D1016] border-l border-[#D9DEE7] dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 text-left overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-[#D9DEE7] dark:border-slate-800 bg-[#F7F8FA] dark:bg-[#151A22] flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#1F2A5A] dark:text-blue-400 bg-white dark:bg-[#0D1016] px-2.5 py-1 rounded-sm border border-[#D9DEE7] dark:border-slate-800">
                {project.projectId}
              </span>
              <RiskBadge level={project.riskLevel} score={project.riskScore} />
              <span className="text-[10px] font-mono font-bold bg-[#138A45]/10 text-[#138A45] px-2 py-0.5 rounded-sm border border-[#138A45]/30">
                PUBLIC SNAPSHOT
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Metadata */}
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-extrabold text-[#1F2A5A] dark:text-white leading-snug">
                {project.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-[#5B6472] font-mono flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.district}, {project.state}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.category}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.mpName} ({(project as any).house || "Lok Sabha"})</span>
                </span>
              </div>
            </div>

            {/* Financial Telemetry Box */}
            <div className="bg-[#F7F8FA] dark:bg-[#151A22] border border-[#D9DEE7] dark:border-slate-800 p-4 rounded-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#5B6472] font-bold">
                Financial Allocation & Verified Telemetry
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-sm">
                  <span className="text-[10px] text-[#5B6472] uppercase block font-semibold">
                    Recommended Allocation
                  </span>
                  <span className="text-base font-extrabold text-[#138A45] mt-0.5 block">
                    ₹{(project.allocatedAmount / 100000).toFixed(1)} Lakhs
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-sm">
                  <span className="text-[10px] text-[#5B6472] uppercase block font-semibold">
                    Expenditure / Utilization
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1 block">
                    {project.utilizedAmount != null
                      ? `₹${(project.utilizedAmount / 100000).toFixed(1)} Lakhs`
                      : "Not available in snapshot"}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#5B6472] flex items-center justify-between font-mono pt-1">
                <span>Status: <strong className="text-slate-800 dark:text-slate-200">{(project as any).rawStatus || project.status}</strong></span>
                <span>Physical Progress: <strong className="text-slate-800 dark:text-slate-200">{project.progress != null ? `${project.progress}%` : "Not available in snapshot"}</strong></span>
              </div>
            </div>

            {/* Implementing Authority Details */}
            <div className="bg-[#F7F8FA] dark:bg-[#151A22] border border-[#D9DEE7] dark:border-slate-800 p-4 rounded-sm space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6472] font-bold block">
                Implementing District Authority (IDA)
              </span>
              <div className="font-bold text-[#1F2A5A] dark:text-white text-sm">
                {(project as any).implementingAgency || (project as any).ida || "District Collector / Magistrate Authority"}
              </div>
              <p className="text-[11px] text-[#5B6472]">
                Public district authority responsible for administrative sanction and scheme implementation.
              </p>
            </div>

            {/* Explainable AI Risk Signals */}
            <div className="bg-white border border-[#D9DEE7] dark:border-slate-800 p-4 rounded-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#D9DEE7] dark:border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F2A5A] dark:text-white font-mono">
                  <ShieldAlert className="w-4 h-4 text-[#B42318]" />
                  <span>Statistical Review Signals</span>
                </div>
                <span className="text-[10px] font-mono text-[#B42318] font-bold bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-sm border border-rose-200">
                  {project.riskScore}/100 Priority
                </span>
              </div>

              {/* AI Disclaimer */}
              <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] p-2.5 text-[11px] text-[#92400E]">
                Analytical observations support review and prioritisation. They do not constitute findings of misconduct or fraud.
              </div>

              {/* Signals list */}
              {project.signals && project.signals.length > 0 ? (
                <div className="space-y-2.5">
                  {project.signals.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#F7F8FA] dark:bg-[#151A22] border border-[#D9DEE7] dark:border-slate-800 rounded-sm space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-rose-100 text-[#B42318]">
                          {s.dimension}
                        </span>
                        <span className="text-[10px] font-mono text-[#5B6472]">
                          Severity: {s.severity}
                        </span>
                      </div>
                      <div className="font-bold text-[#1F2A5A] dark:text-white pt-0.5">
                        {s.signal}
                      </div>
                      <p className="text-[11px] text-[#5B6472] leading-relaxed">
                        {s.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-[#F7F8FA] text-xs font-mono text-[#138A45] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No elevated statistical outlier signals detected.</span>
                </div>
              )}
            </div>

            {/* Escalate Case Action */}
            {showCaseForm ? (
              <form
                onSubmit={handleEscalateCase}
                className="p-4 rounded-sm bg-[#F7F8FA] border border-[#D9DEE7] space-y-3 text-xs"
              >
                <div className="font-bold text-[#1F2A5A]">Initiate Administrative Review Inquiry</div>
                <textarea
                  value={caseNote}
                  onChange={(e) => setCaseNote(e.target.value)}
                  placeholder="Enter initial review inquiry notes..."
                  className="w-full p-2.5 bg-white border border-[#D9DEE7] rounded-sm text-xs focus:outline-hidden"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCaseForm(false)}
                    className="px-3 py-1.5 border border-[#D9DEE7] bg-white rounded-sm text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-1.5 bg-[#1F2A5A] text-white rounded-sm text-xs font-bold"
                  >
                    {submitting ? "Opening..." : "Submit Inquiry"}
                  </button>
                </div>
              </form>
            ) : null}

            {caseCreatedMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-sm text-xs font-semibold">
                {caseCreatedMsg}
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-[#D9DEE7] dark:border-slate-800 bg-[#F7F8FA] dark:bg-[#151A22] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 hover:bg-slate-100 text-xs font-semibold text-[#1F2A5A] dark:text-slate-200 rounded-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Dossier</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCaseForm(true)}
                className="px-3 py-2 bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 hover:bg-slate-100 text-xs font-semibold text-[#1F2A5A] dark:text-slate-200 rounded-sm transition-colors cursor-pointer"
              >
                Initiate Review
              </button>
              <button
                type="button"
                onClick={() => navigate(`/projects/${project.projectId}`)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1F2A5A] hover:bg-[#172554] text-white text-xs font-bold rounded-sm transition-colors cursor-pointer"
              >
                <span>Full Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
