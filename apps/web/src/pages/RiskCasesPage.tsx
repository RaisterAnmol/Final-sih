import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Search,
  CheckCircle2,
  Clock,
  AlertOctagon,
  ArrowRight,
  UserCheck,
  Send,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Layers,
  LayoutGrid,
  List,
  MessageSquare,
  FileCheck2,
  X,
  Info,
} from "lucide-react";
import api from "../services/api";
import { RiskCase } from "../types";
import { RiskBadge } from "../components/common/RiskBadge";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";

const STATUS_COLUMNS: Array<{
  id: "OPEN" | "UNDER_REVIEW" | "ESCALATED" | "VERIFIED" | "DISMISSED";
  label: string;
  badgeBg: string;
}> = [
  {
    id: "OPEN",
    label: "Open Inquiries",
    badgeBg: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    id: "UNDER_REVIEW",
    label: "Under Review",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    id: "ESCALATED",
    label: "Escalated for Action",
    badgeBg: "bg-rose-100 text-[#B42318] border-rose-300",
  },
  {
    id: "VERIFIED",
    label: "Action Completed",
    badgeBg: "bg-emerald-100 text-[#138A45] border-emerald-300",
  },
  {
    id: "DISMISSED",
    label: "Clarified / Closed",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-300",
  },
];

export const RiskCasesPage: React.FC = () => {
  const [cases, setCases] = useState<RiskCase[]>([]);
  const [statusSummary, setStatusSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"KANBAN" | "LIST">("KANBAN");
  const [selectedCase, setSelectedCase] = useState<RiskCase | null>(null);
  const [newNoteInput, setNewNoteInput] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await api.get("/risk-cases");
      setCases(res.data.data.cases || []);
      setStatusSummary(res.data.data.statusSummary || {});
    } catch (err) {
      console.error("Failed to load risk cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !newNoteInput.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await api.post(`/risk-cases/${selectedCase.caseId}/notes`, {
        content: newNoteInput.trim(),
      });
      setSelectedCase(res.data.data.case);
      setNewNoteInput("");
      fetchCases();
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleUpdateStatus = async (
    newStatus: "OPEN" | "UNDER_REVIEW" | "ESCALATED" | "VERIFIED" | "DISMISSED",
  ) => {
    if (!selectedCase) return;
    setUpdatingStatus(true);
    try {
      const res = await api.patch(`/risk-cases/${selectedCase.caseId}/status`, {
        status: newStatus,
        resolutionNote: `Status updated to ${newStatus} during administrative review.`,
      });
      setSelectedCase(res.data.data.case);
      fetchCases();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.caseId?.toLowerCase().includes(q) ||
      c.projectTitle?.toLowerCase().includes(q) ||
      c.district?.toLowerCase().includes(q) ||
      c.projectId?.toLowerCase().includes(q) ||
      c.contractorName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE7] dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#1F2A5A] font-bold">
              ADMINISTRATIVE WORKFLOW
            </span>
            <span className="text-slate-300">//</span>
            <span className="text-[10px] font-mono text-[#138A45] font-bold bg-[#138A45]/10 px-2 py-0.5 rounded-sm">
              PUBLIC SOURCE SNAPSHOT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A5A] dark:text-white tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-[#1F2A5A]" />
            <span>Administrative Review Inquiries</span>
          </h1>
          <p className="text-xs text-[#5B6472] mt-0.5">
            Case tracking for flagged works requiring administrative clarification, cost estimation review, or field audit.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#D9DEE7] rounded-sm p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("KANBAN")}
              className={`px-3 py-1.5 font-bold transition-all cursor-pointer rounded-sm flex items-center gap-1.5 ${
                viewMode === "KANBAN"
                  ? "bg-[#1F2A5A] text-white"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("LIST")}
              className={`px-3 py-1.5 font-bold transition-all cursor-pointer rounded-sm flex items-center gap-1.5 ${
                viewMode === "LIST"
                  ? "bg-[#1F2A5A] text-white"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory AI Disclaimer */}
      <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] p-3.5 rounded-r-md text-xs text-[#92400E] space-y-1 shadow-2xs">
        <div className="font-bold flex items-center gap-1.5 text-sm">
          <Info className="w-4 h-4 text-[#F59E0B]" />
          <span>Analytical Notice</span>
        </div>
        <p className="leading-relaxed">
          AI-assisted observations are analytical signals intended to support review and prioritisation. They do not constitute a finding of fraud, misconduct, corruption, or wrongdoing. Review cases serve as structured workflow items for administrative inquiries.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#D9DEE7] dark:border-slate-800 p-3 rounded-md shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search review inquiries by case ID, work title, district, or authority..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#F7F8FA] border border-[#D9DEE7] rounded-sm text-xs focus:outline-hidden text-slate-800"
          />
        </div>
      </div>

      {/* Kanban Board View */}
      {loading ? (
        <LoadingSkeleton count={4} className="h-64" />
      ) : viewMode === "KANBAN" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {STATUS_COLUMNS.map((col) => {
            const colCases = filteredCases.filter((c) => c.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-[#F7F8FA] dark:bg-[#151A22] border border-[#D9DEE7] dark:border-slate-800 rounded-md p-3 space-y-3 min-h-[400px]"
              >
                <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-2">
                  <span className="font-mono text-xs font-bold text-[#1F2A5A] dark:text-white uppercase">
                    {col.label}
                  </span>
                  <span className="px-2 py-0.2 rounded-sm text-[10px] font-mono font-bold bg-white dark:bg-[#0D1016] border border-[#D9DEE7] text-slate-700">
                    {colCases.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {colCases.map((c) => (
                    <div
                      key={c.caseId}
                      onClick={() => setSelectedCase(c)}
                      className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 hover:border-[#1F2A5A] p-3 rounded-sm shadow-xs transition-all cursor-pointer space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-[#1F2A5A] bg-[#F7F8FA] px-1.5 py-0.5 rounded-sm border border-[#D9DEE7]">
                          {c.caseId}
                        </span>
                        <RiskBadge score={c.riskScore} level={c.priority === "CRITICAL" ? "CRITICAL" : "HIGH"} />
                      </div>

                      <div className="font-bold text-[#1F2A5A] dark:text-white line-clamp-2">
                        {c.projectTitle}
                      </div>

                      <div className="text-[10px] font-mono text-[#5B6472] space-y-0.5">
                        <div>Location: <strong className="text-slate-700">{c.district}, {c.state}</strong></div>
                        <div>Allocation: <strong className="text-[#138A45]">₹{(c.allocatedAmount || 0).toLocaleString("en-IN")}</strong></div>
                      </div>
                    </div>
                  ))}
                  {colCases.length === 0 && (
                    <div className="text-center py-8 text-[11px] font-mono text-slate-400">
                      No cases in this tier
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-[#D9DEE7] rounded-md overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1F2A5A] text-white uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Work Title</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE7] text-slate-800">
              {filteredCases.map((c) => (
                <tr key={c.caseId} className="hover:bg-[#F7F8FA]">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#1F2A5A]">{c.caseId}</td>
                  <td className="py-2.5 px-3 font-semibold max-w-xs truncate">{c.projectTitle}</td>
                  <td className="py-2.5 px-3">{c.district}, {c.state}</td>
                  <td className="py-2.5 px-3 font-mono">{c.status}</td>
                  <td className="py-2.5 px-3"><RiskBadge score={c.riskScore} level={c.priority === "CRITICAL" ? "CRITICAL" : "HIGH"} /></td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedCase(c)}
                      className="px-2.5 py-1 bg-[#F7F8FA] hover:bg-slate-200 rounded-sm font-semibold border border-[#D9DEE7]"
                    >
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-[#090B0F]/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md max-w-2xl w-full p-6 space-y-4 shadow-xl text-xs border border-[#D9DEE7] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#1F2A5A] bg-[#F7F8FA] px-2 py-0.5 rounded-sm border border-[#D9DEE7]">
                  {selectedCase.caseId}
                </span>
                <h3 className="font-bold text-base text-[#1F2A5A] mt-1">{selectedCase.projectTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Case Details Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-2.5 bg-[#F7F8FA] border border-[#D9DEE7] rounded-sm">
                <span className="text-[10px] text-[#5B6472] uppercase block">Location</span>
                <span className="font-bold text-slate-800">{selectedCase.district}, {selectedCase.state}</span>
              </div>
              <div className="p-2.5 bg-[#F7F8FA] border border-[#D9DEE7] rounded-sm">
                <span className="text-[10px] text-[#5B6472] uppercase block">Allocation</span>
                <span className="font-bold text-[#138A45]">₹{(selectedCase.allocatedAmount || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="p-2.5 bg-[#F7F8FA] border border-[#D9DEE7] rounded-sm">
                <span className="text-[10px] text-[#5B6472] uppercase block">Assigned Nodal</span>
                <span className="font-bold text-slate-800">{selectedCase.assignedToName || "Audit Officer"}</span>
              </div>
              <div className="p-2.5 bg-[#F7F8FA] border border-[#D9DEE7] rounded-sm">
                <span className="text-[10px] text-[#5B6472] uppercase block">Current Status</span>
                <span className="font-bold text-[#1F2A5A]">{selectedCase.status}</span>
              </div>
            </div>

            {/* Status Update Actions */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] text-[#5B6472] uppercase font-bold">Advance Inquiry Status</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {STATUS_COLUMNS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    disabled={updatingStatus || selectedCase.status === col.id}
                    onClick={() => handleUpdateStatus(col.id)}
                    className={`px-3 py-1 rounded-sm font-mono text-[11px] font-bold border transition-colors cursor-pointer ${
                      selectedCase.status === col.id
                        ? "bg-[#1F2A5A] text-white border-[#1F2A5A]"
                        : "bg-[#F7F8FA] text-slate-700 hover:bg-slate-200 border-[#D9DEE7]"
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Log */}
            <div className="space-y-2 border-t border-[#D9DEE7] pt-3">
              <span className="font-mono text-[10px] text-[#5B6472] uppercase font-bold">Administrative Log & Notes</span>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedCase.notes?.map((n: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-[#F7F8FA] border border-[#D9DEE7] rounded-sm space-y-0.5">
                    <div className="flex justify-between text-[10px] font-mono text-[#5B6472]">
                      <span className="font-bold text-slate-700">{n.authorName}</span>
                      <span>{new Date(n.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-800">{n.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  placeholder="Record administrative finding or voucher verification note..."
                  className="flex-1 p-2 bg-[#F7F8FA] border border-[#D9DEE7] rounded-sm focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={submittingNote}
                  className="px-4 py-2 bg-[#1F2A5A] text-white rounded-sm font-bold cursor-pointer"
                >
                  {submittingNote ? "Adding..." : "Add Note"}
                </button>
              </form>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#D9DEE7]">
              <button
                type="button"
                onClick={() => navigate(`/projects/${selectedCase.projectId}`)}
                className="text-[#1F2A5A] font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Full Work Record</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="px-4 py-1.5 bg-[#F7F8FA] border border-[#D9DEE7] rounded-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
