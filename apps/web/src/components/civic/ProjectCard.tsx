import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Building,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ProjectCardData {
  projectId: string;
  title: string;
  category: string;
  state: string;
  district: string;
  constituency?: string;
  mpName?: string;
  allocatedAmount: number;
  utilizedAmount: number;
  progress: number;
  status:
    | "SANCTIONED"
    | "UNSANCTIONED"
    | "RECOMMENDED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "DELAYED"
    | "CANCELLED";
  contractorName?: string;
  riskScore?: number;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  financialYear?: string;
}

export interface ProjectCardProps {
  project: ProjectCardData;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/projects/${project.projectId}`);
    }
  };

  const getStatusBadge = () => {
    switch (project.status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            COMPLETED
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 shadow-xs">
            <Clock className="w-3 h-3 text-blue-600" />
            IN PROGRESS
          </span>
        );
      case "DELAYED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-xs">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            DELAYED
          </span>
        );
      case "UNSANCTIONED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shadow-xs">
            UNSANCTIONED
          </span>
        );
      case "RECOMMENDED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800 shadow-xs">
            RECOMMENDED
          </span>
        );
      case "SANCTIONED":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-xs">
            SANCTIONED
          </span>
        );
    }
  };

  // Determine vibrant theme based on sector category
  const getCategoryColor = () => {
    if (project.category.includes("Education"))
      return "card-purple text-purple-700 border-purple-300 bg-purple-100 dark:bg-purple-950/60";
    if (
      project.category.includes("Roads") ||
      project.category.includes("Bridges")
    )
      return "card-amber text-amber-800 border-amber-300 bg-amber-100 dark:bg-amber-950/60";
    if (
      project.category.includes("Health") ||
      project.category.includes("Wellness")
    )
      return "card-rose text-rose-700 border-rose-300 bg-rose-100 dark:bg-rose-950/60";
    if (
      project.category.includes("Water") ||
      project.category.includes("Sanitation")
    )
      return "card-cyan text-cyan-700 border-cyan-300 bg-cyan-100 dark:bg-cyan-950/60";
    if (
      project.category.includes("Rural") ||
      project.category.includes("Community")
    )
      return "card-emerald text-emerald-700 border-emerald-300 bg-emerald-100 dark:bg-emerald-950/60";
    return "card-blue text-blue-700 border-blue-300 bg-blue-100 dark:bg-blue-950/60";
  };

  const costInLakhs = (project.allocatedAmount / 100000).toFixed(1);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={handleCardClick}
      className="p-5 rounded-3xl bg-white dark:bg-[#131823] border border-indigo-100 dark:border-slate-800 hover:border-indigo-400 hover:shadow-playful-lg space-y-4 cursor-pointer transition-all text-left flex flex-col justify-between group shadow-playful"
    >
      {/* Top row: Status pill & Sector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {getStatusBadge()}
          <span
            className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border truncate max-w-[170px] ${getCategoryColor()}`}
          >
            {project.category}
          </span>
        </div>

        {/* Work ID & Title */}
        <div>
          <span className="text-[11px] font-mono font-extrabold text-indigo-600 dark:text-cyan-400 block mb-1">
            {project.projectId}
          </span>
          <h4 className="text-sm font-bold text-[#0F172A] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
            {project.title}
          </h4>
        </div>

        {/* Location & MP Metadata */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-indigo-900/80 dark:text-indigo-200 font-medium">
          <span className="inline-flex items-center gap-1 font-mono">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>
              {project.district}, {project.state}
            </span>
          </span>
          {project.financialYear && (
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200">
              FY {project.financialYear}
            </span>
          )}
        </div>
      </div>

      {/* Financial & Execution Bottom Area */}
      <div className="pt-3 border-t border-indigo-100 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-extrabold block">
              Sanctioned Cost
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
              ₹{costInLakhs}{" "}
              <span className="text-xs text-indigo-900/70 font-semibold">
                Lakh
              </span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-extrabold block">
              Progress
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {project.progress}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-indigo-50 dark:bg-slate-800 overflow-hidden border border-indigo-100/60">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 shadow-glow-purple"
            style={{
              width: `${Math.min(100, Math.max(8, project.progress))}%`,
            }}
          />
        </div>

        {/* Implementing Contractor badge & Detail link */}
        <div className="flex items-center justify-between text-[11px] text-indigo-950 dark:text-indigo-200 pt-1 font-medium">
          <span className="truncate max-w-[200px]">
            Vendor:{" "}
            <strong className="text-indigo-900 dark:text-white font-bold">
              {project.contractorName || "District Agency"}
            </strong>
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 text-xs">
            <span>Inspect</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
