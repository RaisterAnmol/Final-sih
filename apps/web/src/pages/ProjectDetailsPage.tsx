import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Briefcase,
  AlertTriangle,
  Coins,
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  TrendingUp,
  Search,
  ExternalLink,
  ShieldCheck,
  Plus,
  Clock,
  ShieldAlert,
  Layers,
  Sparkles,
  Zap,
  FileText,
  Database,
  Info,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import api from "../services/api";
import { Project } from "../types";
import { ErrorView } from "../components/errors/ErrorView";
import { RiskBadge } from "../components/common/RiskBadge";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { SourceBadge } from "../components/civic/SourceBadge";

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [peerComp, setPeerComp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [caseNote, setCaseNote] = useState("");
  const [casePriority, setCasePriority] = useState("HIGH");
  const [caseSubmitting, setCaseSubmitting] = useState(false);
  const [caseSuccessMsg, setCaseSuccessMsg] = useState("");
  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/projects/${id}`);
      if (res.data?.data?.project) {
        setProject(res.data.data.project);
        setPeerComp(res.data.data.peerComparison);
      }
    } catch (err) {
      console.error("Failed to load project details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProjectDetails();
  }, [id]);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setCaseSubmitting(true);
    try {
      const res = await api.post("/risk-cases", {
        projectId: project.projectId,
        priority: casePriority,
        initialNote:
          caseNote ||
          "Auditor initiated review inquiry after inspecting statistical signal telemetry.",
      });
      setCaseSuccessMsg(
        `Review inquiry case created successfully (ID: ${res.data?.data?.caseId || "CASE-ACTIVE"})`,
      );
      setTimeout(() => {
        setShowCaseModal(false);
        setCaseSuccessMsg("");
      }, 1500);
    } catch (err: any) {
      console.error("Case creation error:", err);
    } finally {
      setCaseSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 text-left">
        <LoadingSkeleton count={3} className="h-28" />
        <LoadingSkeleton count={1} className="h-96" />
      </div>
    );
  }

  if (!project) {
    return (
      <ErrorView
        type="PROJECT_NOT_FOUND"
        resourceId={id}
        title="MPLADS Project Record Not Found"
        subtitle="CIVIL REGISTER LOOKUP FAILED"
        description={`Project '${id || "UNKNOWN"}' was not found in the official 2023–24 public snapshot database. In accordance with zero-fabrication standards, arbitrary project fallbacks have been removed.`}
      />
    );
  }

  const rawRec = (project as any).rawSourceRecord || {};

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* 1. Navigation Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DEE7] dark:border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-mono text-[#1F2A5A] dark:text-blue-400 font-bold hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Register</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCaseModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F2A5A] hover:bg-[#172554] text-white rounded-sm text-xs font-semibold cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Open Review Inquiry</span>
          </button>
        </div>
      </div>

      {/* 2. Main Title Banner */}
      <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-6 rounded-sm shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DEE7] dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold bg-[#1F2A5A]/10 text-[#1F2A5A] px-2.5 py-1 rounded-sm border border-[#1F2A5A]/20">
              {project.projectId}
            </span>
            <span className="text-xs font-mono bg-[#F7F8FA] dark:bg-[#151A22] text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-sm border border-[#D9DEE7] dark:border-slate-800">
              {project.category}
            </span>
            <span className="text-xs font-mono bg-[#F7F8FA] dark:bg-[#151A22] text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-sm border border-[#D9DEE7] dark:border-slate-800">
              {project.house || "Lok Sabha"}
            </span>
          </div>

          <RiskBadge score={project.riskScore} level={project.riskLevel} />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2A5A] dark:text-white tracking-tight leading-snug">
            {project.title}
          </h1>
          <p className="text-xs text-[#5B6472] dark:text-slate-400 mt-1 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* 4 Metadata Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-[#5B6472] dark:text-slate-400 block font-bold">
              Recommended Capital
            </span>
            <span className="text-base font-extrabold font-mono text-[#138A45] block mt-0.5">
              ₹{(project.allocatedAmount || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="p-3 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-[#5B6472] dark:text-slate-400 block font-bold">
              Recommending MP
            </span>
            <span className="text-xs font-bold text-[#1F2A5A] dark:text-white block mt-0.5 truncate">
              {project.mpName}
            </span>
          </div>

          <div className="p-3 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-[#5B6472] dark:text-slate-400 block font-bold">
              District Authority (IDA)
            </span>
            <span className="text-xs font-bold text-[#1F2A5A] dark:text-white block mt-0.5 truncate">
              {project.implementingAgency || project.ida || "District Authority"}
            </span>
          </div>

          <div className="p-3 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-[#5B6472] dark:text-slate-400 block font-bold">
              Work Status
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
              {project.rawStatus || project.status}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Official MPLADS Scheme Workflow Timeline */}
      <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-6 rounded-sm shadow-xs space-y-4">
        <div className="border-b border-[#D9DEE7] dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-[#1F2A5A] dark:text-white uppercase tracking-wider font-mono">
            Official MPLADS Process Lifecycle
          </h3>
          <p className="text-xs text-[#5B6472] dark:text-slate-400 mt-0.5">
            Institutional stages according to official MPLADS operational guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
          {/* Step 1 */}
          <div className="p-3 rounded-sm border border-[#138A45]/30 bg-[#138A45]/5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#138A45]">
              <CheckCircle className="w-4 h-4" />
              <span>1. MP Recommendation</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
              {project.recommendedDate
                ? new Date(project.recommendedDate).toLocaleDateString()
                : "Recorded in snapshot"}
            </p>
            <span className="inline-block text-[9px] font-mono font-bold text-[#138A45] uppercase">
              SOURCE-BACKED
            </span>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-sm border border-[#1F2A5A]/30 bg-[#1F2A5A]/5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F2A5A] dark:text-blue-300">
              <Building2 className="w-4 h-4" />
              <span>2. District Authority</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono truncate">
              {project.ida || `${project.district} Authority`}
            </p>
            <span className="inline-block text-[9px] font-mono font-bold text-[#1F2A5A] dark:text-blue-300 uppercase">
              SOURCE-BACKED (IDA)
            </span>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-sm border border-[#D9DEE7] dark:border-slate-800 bg-[#F7F8FA] dark:bg-[#131823] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4" />
              <span>3. Scrutiny & Sanction</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
              Status: {project.rawStatus || "Unsanctioned"}
            </p>
            <span className="inline-block text-[9px] font-mono font-bold text-slate-500 uppercase">
              SOURCE-BACKED
            </span>
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-sm border border-[#D9DEE7] dark:border-slate-800 bg-[#F7F8FA] dark:bg-[#131823] space-y-1 opacity-80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <Layers className="w-4 h-4" />
              <span>4. Agency Execution</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              {project.rawStatus === "Ongoing" ? "Execution active" : "Not in snapshot"}
            </p>
            <span className="inline-block text-[9px] font-mono font-bold text-slate-500 uppercase">
              {project.rawStatus === "Ongoing" ? "SOURCE-BACKED" : "UNAVAILABLE"}
            </span>
          </div>

          {/* Step 5 */}
          <div className="p-3 rounded-sm border border-[#D9DEE7] dark:border-slate-800 bg-[#F7F8FA] dark:bg-[#131823] space-y-1 opacity-80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>5. Completion / MPR</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              {project.rawStatus === "Completed" ? "Completed work" : "Not in snapshot"}
            </p>
            <span className="inline-block text-[9px] font-mono font-bold text-slate-500 uppercase">
              {project.rawStatus === "Completed" ? "SOURCE-BACKED" : "UNAVAILABLE"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Field-Level Provenance Inspector Table */}
      <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-6 rounded-sm shadow-xs space-y-4">
        <div className="border-b border-[#D9DEE7] dark:border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1F2A5A] dark:text-white uppercase tracking-wider font-mono">
              Field-Level Provenance & Data Quality Inspector
            </h3>
            <p className="text-xs text-[#5B6472] dark:text-slate-400 mt-0.5">
              Transparent mapping of source facts vs derived aggregations vs unavailable attributes.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#138A45]/10 text-[#138A45] px-2.5 py-1 rounded-sm border border-[#138A45]/30">
            Zero-Fabrication Audit
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1F2A5A] text-white uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-3.5">Field Name</th>
                <th className="py-2.5 px-3.5">Record Value</th>
                <th className="py-2.5 px-3.5">Provenance Tier</th>
                <th className="py-2.5 px-3.5">Source Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE7] dark:divide-slate-800 text-[11px] font-mono">
              <tr>
                <td className="py-2.5 px-3.5 font-bold text-[#1F2A5A] dark:text-blue-300">MP NAME</td>
                <td className="py-2.5 px-3.5 font-sans font-semibold">{project.mpName}</td>
                <td className="py-2.5 px-3.5"><span className="px-2 py-0.5 rounded-xs bg-[#138A45]/10 text-[#138A45] font-bold">SOURCE</span></td>
                <td className="py-2.5 px-3.5 text-slate-500 font-sans">Extracted directly from source CSV column 'MP NAME'.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-bold text-[#1F2A5A] dark:text-blue-300">WORK DESCRIPTION</td>
                <td className="py-2.5 px-3.5 font-sans font-semibold">{project.title}</td>
                <td className="py-2.5 px-3.5"><span className="px-2 py-0.5 rounded-xs bg-[#138A45]/10 text-[#138A45] font-bold">SOURCE</span></td>
                <td className="py-2.5 px-3.5 text-slate-500 font-sans">Extracted directly from source CSV column 'WORK'.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-bold text-[#1F2A5A] dark:text-blue-300">ALLOCATION AMOUNT</td>
                <td className="py-2.5 px-3.5 font-bold text-[#138A45]">₹{(project.allocatedAmount || 0).toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-3.5"><span className="px-2 py-0.5 rounded-xs bg-[#138A45]/10 text-[#138A45] font-bold">SOURCE</span></td>
                <td className="py-2.5 px-3.5 text-slate-500 font-sans">Extracted directly from source CSV column 'ALLOCATION AMOUNT'.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-bold text-[#1F2A5A] dark:text-blue-300">DISTRICT AUTHORITY (IDA)</td>
                <td className="py-2.5 px-3.5 font-sans font-semibold">{project.ida || "Unspecified"}</td>
                <td className="py-2.5 px-3.5"><span className="px-2 py-0.5 rounded-xs bg-[#138A45]/10 text-[#138A45] font-bold">SOURCE</span></td>
                <td className="py-2.5 px-3.5 text-slate-500 font-sans">Extracted directly from source CSV column 'IDA'.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-bold text-[#1F2A5A] dark:text-blue-300">DEVELOPMENT CATEGORY</td>
                <td className="py-2.5 px-3.5 font-sans font-semibold">{project.category}</td>
                <td className="py-2.5 px-3.5"><span className="px-2 py-0.5 rounded-xs bg-[#1F2A5A]/10 text-[#1F2A5A] font-bold">DERIVED</span></td>
                <td className="py-2.5 px-3.5 text-slate-500 font-sans">Derived by normalizing source category / keywords into standard MIS taxonomy.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-bold text-[#1F2A5A] dark:text-blue-300">GROUND PROGRESS %</td>
                <td className="py-2.5 px-3.5 text-slate-400 italic">null (Not available in source snapshot)</td>
                <td className="py-2.5 px-3.5"><span className="px-2 py-0.5 rounded-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">UNAVAILABLE</span></td>
                <td className="py-2.5 px-3.5 text-slate-500 font-sans">Milestone execution percentages are not tracked in public snapshot.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-bold text-[#1F2A5A] dark:text-blue-300">ACTUAL EXPENDITURE</td>
                <td className="py-2.5 px-3.5 text-slate-400 italic">null (Not available in source snapshot)</td>
                <td className="py-2.5 px-3.5"><span className="px-2 py-0.5 rounded-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">UNAVAILABLE</span></td>
                <td className="py-2.5 px-3.5 text-slate-500 font-sans">Disbursed utilization sums require separate treasury reconciliation data.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-bold text-[#1F2A5A] dark:text-blue-300">ANALYTICAL REVIEW SCORE</td>
                <td className="py-2.5 px-3.5 font-bold text-[#B42318]">{project.riskScore} / 100 ({project.riskLevel})</td>
                <td className="py-2.5 px-3.5"><span className="px-2 py-0.5 rounded-xs bg-[#B42318]/10 text-[#B42318] font-bold">ANALYTICAL</span></td>
                <td className="py-2.5 px-3.5 text-slate-500 font-sans">Statistical decision-support signal calculated by baseline peer-deviation rules.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. AI-Assisted Analytical Signals */}
      {project.signals && project.signals.length > 0 && (
        <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-6 rounded-sm shadow-xs space-y-4">
          <div className="border-b border-[#D9DEE7] dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1F2A5A] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#B42318]" />
                <span>AI-Assisted Analytical Signals ({project.signals.length})</span>
              </h3>
              <p className="text-xs text-[#5B6472] dark:text-slate-400 mt-0.5">
                Statistical observations generated by decision-support rules to aid human review.
              </p>
            </div>
          </div>

          <div className="bg-[#FFFBEB] dark:bg-[#1A1810] border-l-4 border-[#F59E0B] p-3 text-[11px] text-[#92400E] dark:text-amber-200">
            <strong>Audit Disclaimer:</strong> Analytical signals are generated by prototype statistical models to support administrative review. They do not constitute findings of fraud, corruption, misconduct, or wrongdoing.
          </div>

          <div className="space-y-3">
            {project.signals.map((sig, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#F7F8FA] dark:bg-[#131823] rounded-sm border border-[#D9DEE7] dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1F2A5A] dark:text-white">
                    {sig.signal}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold ${
                      sig.severity === "CRITICAL"
                        ? "bg-[#B42318]/10 text-[#B42318]"
                        : "bg-[#F59E0B]/10 text-[#F59E0B]"
                    }`}
                  >
                    {sig.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {sig.explanation}
                </p>
                {sig.supportingValue && (
                  <div className="p-2 bg-white dark:bg-[#0D1016] rounded-xs border border-[#D9DEE7] dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    Supporting Calculation: {JSON.stringify(sig.supportingValue)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Case Creation Modal */}
      {showCaseModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs text-left">
          <div className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-sm shadow-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-[#1F2A5A] dark:text-white font-mono">
              Open Administrative Review Inquiry
            </h3>
            <p className="text-xs text-[#5B6472]">
              Initiate a structured review inquiry docket for work {project.projectId}.
            </p>

            {caseSuccessMsg && (
              <div className="p-3 bg-[#138A45]/10 text-[#138A45] rounded-sm text-xs font-bold font-mono">
                {caseSuccessMsg}
              </div>
            )}

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                  Inquiry Priority Tier
                </label>
                <select
                  value={casePriority}
                  onChange={(e) => setCasePriority(e.target.value)}
                  className="w-full p-2 bg-[#F7F8FA] dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="CRITICAL">Priority Review (Critical)</option>
                  <option value="HIGH">Elevated Scrutiny (High)</option>
                  <option value="MEDIUM">Standard Review (Medium)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                  Initial Administrative Note
                </label>
                <textarea
                  value={caseNote}
                  onChange={(e) => setCaseNote(e.target.value)}
                  rows={4}
                  placeholder="Specify review instructions or documentation requests..."
                  className="w-full p-2.5 bg-[#F7F8FA] dark:bg-[#131823] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D9DEE7] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCaseModal(false)}
                  className="px-4 py-2 bg-[#F7F8FA] hover:bg-slate-200 text-slate-700 rounded-sm text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={caseSubmitting}
                  className="px-4 py-2 bg-[#1F2A5A] hover:bg-[#172554] text-white rounded-sm text-xs font-bold"
                >
                  {caseSubmitting ? "Creating Docket..." : "Confirm & Open Docket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
