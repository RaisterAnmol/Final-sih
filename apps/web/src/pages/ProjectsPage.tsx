import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  LayoutGrid,
  List,
  MapPin,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  Coins,
  Eye,
  ChevronsLeft,
  ChevronsRight,
  Users,
  Database,
  Building2,
  Printer,
} from "lucide-react";
import api from "../services/api";
import { Project, RiskLevel } from "../types";
import { RiskBadge } from "../components/common/RiskBadge";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { ProjectInspectorDrawer } from "../components/civic/ProjectInspectorDrawer";

export const ProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [inspectingProject, setInspectingProject] = useState<Project | null>(
    null,
  );
  const navigate = useNavigate();

  // Filters state
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const state = searchParams.get("state") || "ALL";
  const district = searchParams.get("district") || "ALL";
  const house = searchParams.get("house") || "ALL";
  const category = searchParams.get("category") || "ALL";
  const status = searchParams.get("status") || "ALL";
  const riskLevel = searchParams.get("riskLevel") || "ALL";
  const sortBy = searchParams.get("sortBy") || "riskScore";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const [searchInput, setSearchInput] = useState(search);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", viewMode === "grid" ? "12" : "15");
      if (search) params.append("search", search);
      if (state !== "ALL") params.append("state", state);
      if (district !== "ALL") params.append("district", district);
      if (house !== "ALL") params.append("house", house);
      if (category !== "ALL") params.append("category", category);
      if (status !== "ALL") params.append("status", status);
      if (riskLevel !== "ALL") params.append("riskLevel", riskLevel);
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      const res = await api.get(`/projects?${params.toString()}`);
      setProjects(res.data.data.projects || []);
      setTotal(res.data.data.pagination?.total || 0);
      setTotalPages(res.data.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [
    page,
    search,
    state,
    district,
    house,
    category,
    status,
    riskLevel,
    sortBy,
    sortOrder,
    viewMode,
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput) {
      newParams.set("search", searchInput);
    } else {
      newParams.delete("search");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "ALL") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== "page") {
      newParams.set("page", "1");
    }
    setSearchParams(newParams);
  };

  const handleSort = (field: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (sortBy === field) {
      newParams.set("sortOrder", sortOrder === "asc" ? "desc" : "asc");
    } else {
      newParams.set("sortBy", field);
      newParams.set("sortOrder", "desc");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  const handleExportCSV = () => {
    if (projects.length === 0) return;
    const headers = [
      "Work ID",
      "Title",
      "Category",
      "MP Name",
      "House",
      "State",
      "District",
      "Constituency",
      "Implementing Authority (IDA)",
      "Recommended Allocation (INR)",
      "Status",
      "Analytical Score",
    ];
    const csvRows = [headers.join(",")];
    projects.forEach((p) => {
      csvRows.push(
        [
          `"${p.projectId}"`,
          `"${p.title.replace(/"/g, '""')}"`,
          `"${p.category}"`,
          `"${p.mpName || "N/A"}"`,
          `"${(p as any).house || "Lok Sabha"}"`,
          `"${p.state}"`,
          `"${p.district}"`,
          `"${p.constituency || ""}"`,
          `"${(p as any).implementingAgency || (p as any).ida || ""}"`,
          p.allocatedAmount,
          `"${(p as any).rawStatus || p.status}"`,
          p.riskScore,
        ].join(","),
      );
    });

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MPLADS_Works_Register_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE7] dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#1F2A5A] font-bold">
              PUBLIC WORKS DIRECTORY
            </span>
            <span className="text-slate-300">//</span>
            <span className="text-[10px] font-mono text-[#138A45] font-bold bg-[#138A45]/10 px-2 py-0.5 rounded-sm">
              PUBLIC SOURCE SNAPSHOT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A5A] dark:text-white tracking-tight flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-[#1F2A5A]" />
            <span>MPLADS Works Register</span>
          </h1>
          <p className="text-xs text-[#5B6472] mt-0.5">
            Official public-source dataset containing{" "}
            {total > 0 ? total.toLocaleString() : "..."} verified works from the
            2023–24 snapshot.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#131823] hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-[#D9DEE7] dark:border-slate-800 rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 text-xs font-semibold bg-[#1F2A5A] hover:bg-[#172554] text-white rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D9DEE7] dark:border-slate-800 p-4 rounded-md shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Work Title, MP Name, Constituency, District, or IDA..."
              className="w-full pl-9 pr-4 py-2 bg-[#F7F8FA] dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-sm text-xs focus:outline-hidden text-slate-800 dark:text-slate-200"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#1F2A5A] hover:bg-[#172554] text-white text-xs font-bold rounded-sm transition-colors cursor-pointer"
          >
            Search
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="px-3 py-2 bg-[#F7F8FA] hover:bg-slate-200 text-slate-600 rounded-sm text-xs transition-colors cursor-pointer border border-[#D9DEE7]"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </form>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-mono text-[#5B6472] uppercase font-bold mb-1">
              Parliamentary Chamber
            </label>
            <select
              value={house}
              onChange={(e) => handleFilterChange("house", e.target.value)}
              className="w-full p-2 bg-[#F7F8FA] dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Chambers (Lok & Rajya)</option>
              <option value="Lok Sabha">Lok Sabha</option>
              <option value="Rajya Sabha">Rajya Sabha</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#5B6472] uppercase font-bold mb-1">
              Development Sector
            </label>
            <select
              value={category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full p-2 bg-[#F7F8FA] dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Categories</option>
              <option value="Roads, Pathways & Bridges">Roads & Bridges</option>
              <option value="Drinking Water & Sanitation">
                Drinking Water
              </option>
              <option value="Public Lighting & Energy">Public Lighting</option>
              <option value="Education Infrastructure">Education</option>
              <option value="Public Health & Wellness">Health</option>
              <option value="Community Asset & Halls">Community Halls</option>
              <option value="Normal/Others">General Infrastructure</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#5B6472] uppercase font-bold mb-1">
              Work Status
            </label>
            <select
              value={status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full p-2 bg-[#F7F8FA] dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Statuses</option>
              <option value="SANCTIONED">Sanctioned</option>
              <option value="UNSANCTIONED">Unsanctioned</option>
              <option value="RECOMMENDED">Recommended</option>
              <option value="IN_PROGRESS">Ongoing / In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#5B6472] uppercase font-bold mb-1">
              Review Priority
            </label>
            <select
              value={riskLevel}
              onChange={(e) => handleFilterChange("riskLevel", e.target.value)}
              className="w-full p-2 bg-[#F7F8FA] dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 rounded-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Review Tiers</option>
              <option value="CRITICAL">Priority Review (Critical)</option>
              <option value="HIGH">Elevated Attention (High)</option>
              <option value="MEDIUM">Moderate (Medium)</option>
              <option value="LOW">Standard (Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      {loading ? (
        <LoadingSkeleton count={8} className="h-12" />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No Works Match Selected Filters"
          description="Try broadening your search criteria or resetting filters."
        />
      ) : (
        <div className="bg-white border border-[#D9DEE7] dark:border-slate-800 rounded-md overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1F2A5A] text-white uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">Work ID</th>
                  <th className="py-3 px-3.5">Work Description</th>
                  <th className="py-3 px-3.5">MP Name & House</th>
                  <th className="py-3 px-3.5">Location</th>
                  <th className="py-3 px-3.5">Implementing Authority (IDA)</th>
                  <th className="py-3 px-3.5">Category</th>
                  <th className="py-3 px-3.5 text-right">Allocation (₹)</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                  <th className="py-3 px-3.5 text-center">Review</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE7] dark:divide-slate-800 text-[11px] text-slate-800 dark:text-slate-200">
                {projects.map((p) => (
                  <tr
                    key={p.projectId}
                    className="hover:bg-[#F7F8FA] dark:hover:bg-[#151A22] transition-colors"
                  >
                    <td className="py-3 px-3.5 font-mono font-bold text-[#1F2A5A] dark:text-blue-400 whitespace-nowrap">
                      {p.projectId}
                    </td>
                    <td
                      className="py-3 px-3.5 max-w-xs truncate font-semibold"
                      title={p.title}
                    >
                      {p.title}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-[#1F2A5A] dark:text-white">
                        {p.mpName}
                      </div>
                      <div className="text-[10px] text-[#5B6472]">
                        {(p as any).house || "Lok Sabha"}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-semibold">
                        {p.district}, {p.state}
                      </div>
                      <div className="text-[10px] text-[#5B6472]">
                        {p.constituency || "General"}
                      </div>
                    </td>
                    <td
                      className="py-3 px-3.5 max-w-[140px] truncate text-[#5B6472]"
                      title={(p as any).implementingAgency || (p as any).ida}
                    >
                      {(p as any).implementingAgency ||
                        (p as any).ida ||
                        "District Authority"}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono text-slate-700 dark:text-slate-300">
                      {p.category}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-[#138A45] whitespace-nowrap">
                      ₹{(p.allocatedAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-[#F7F8FA] border border-[#D9DEE7]">
                        {(p as any).rawStatus || p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <RiskBadge score={p.riskScore} level={p.riskLevel} />
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setInspectingProject(p)}
                          className="px-2 py-1 bg-[#F7F8FA] hover:bg-slate-200 text-slate-700 rounded-sm font-semibold text-[10px] border border-[#D9DEE7] cursor-pointer"
                        >
                          Inspect
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/projects/${p.projectId}`)}
                          className="p-1 text-[#1F2A5A] hover:bg-slate-100 rounded-sm cursor-pointer"
                          title="View Full Record"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="p-3.5 bg-[#F7F8FA] dark:bg-[#151A22] border-t border-[#D9DEE7] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-[#5B6472] font-mono">
              Showing{" "}
              <strong className="text-slate-900 dark:text-white">
                {(page - 1) * 15 + 1}
              </strong>{" "}
              –{" "}
              <strong className="text-slate-900 dark:text-white">
                {Math.min(page * 15, total)}
              </strong>{" "}
              of{" "}
              <strong className="text-slate-900 dark:text-white">
                {total.toLocaleString()}
              </strong>{" "}
              works
            </div>

            <div className="flex items-center gap-1 font-mono">
              <button
                type="button"
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className="p-1.5 rounded-sm bg-white border border-[#D9DEE7] disabled:opacity-40 cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-sm bg-white border border-[#D9DEE7] disabled:opacity-40 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-3 py-1 bg-white border border-[#D9DEE7] rounded-sm font-bold text-[#1F2A5A]">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-sm bg-white border border-[#D9DEE7] disabled:opacity-40 cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
                className="p-1.5 rounded-sm bg-white border border-[#D9DEE7] disabled:opacity-40 cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side Inspector Drawer */}
      <ProjectInspectorDrawer
        project={inspectingProject}
        onClose={() => setInspectingProject(null)}
      />
    </div>
  );
};
