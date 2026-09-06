import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ExternalLink, Database, FileText, Landmark, MapPinned, Bell, FileSearch, ArrowUpRight } from "lucide-react";

export const CivicFooter: React.FC = () => {
  return (
    <footer className="border-t border-[#D9DEE7] dark:border-slate-800 bg-[#1F2A5A] text-slate-200 text-xs text-left select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-9">
        {/* Government-style important links panel */}
        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#F8B84E]">Important Links</div>
              <h3 className="mt-1 text-sm sm:text-base font-extrabold text-white">Quick access to the oversight ecosystem</h3>
            </div>
            <span className="text-[9px] font-mono text-white/45 uppercase">MPLADS INSIGHT • SIH 2026</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              [Landmark, "MPLADS Portal", "Official public portal", "https://mplads.gov.in/"],
              [Database, "Works Register", "Public snapshot", "/projects"],
              [MapPinned, "Spatial GIS", "District intelligence", "/geographic"],
              [Bell, "Priority Alerts", "Review queue", "/alerts"],
              [FileSearch, "Audit Trail", "Evidence lineage", "/audit-logs"],
              [FileText, "Statutory Reports", "Exports & review", "/reports"],
            ].map(([Icon, title, sub, href]) => {
              const I = Icon as React.ElementType;
              const external = String(href).startsWith("http");
              return external ? (
                <a key={String(title)} href={String(href)} target="_blank" rel="noopener noreferrer" className="group min-h-[68px] rounded-md bg-white/95 text-[#18234F] border border-white/20 p-3 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start justify-between gap-2"><I className="w-4 h-4 text-[#1769AA]" /><ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-[#18234F]" /></div>
                  <div className="mt-2 text-[10px] font-extrabold">{String(title)}</div>
                  <div className="text-[8px] text-slate-500">{String(sub)}</div>
                </a>
              ) : (
                <Link key={String(title)} to={String(href)} className="group min-h-[68px] rounded-md bg-white/95 text-[#18234F] border border-white/20 p-3 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start justify-between gap-2"><I className="w-4 h-4 text-[#1769AA]" /><ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-[#18234F]" /></div>
                  <div className="mt-2 text-[10px] font-extrabold">{String(title)}</div>
                  <div className="text-[8px] text-slate-500">{String(sub)}</div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Institutional SIH Prototype Identity */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center text-[#F59E0B] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white tracking-tight block">
                  MPLADS Insight
                </span>
                <span className="text-[10px] text-[#F59E0B] font-mono uppercase font-bold tracking-wider block">
                  Smart India Hackathon 2026 Prototype
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-md">
              A transparent public information and monitoring platform organizing public-source MPLADS work-register snapshots. Designed following UX4G accessibility and government-design principles.
            </p>

            <div className="pt-2 text-[11px] text-slate-300 space-y-1 font-mono">
              <div>Source Snapshot: <span className="text-[#F59E0B] font-bold">26 Apr 2023 – 04 Mar 2024</span></div>
              <div>Total Records: <span className="text-white font-bold">60,359 Works</span></div>
            </div>
          </div>

          {/* Column 2: Data Exploration */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] font-bold">
              Monitoring
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                  Monitoring Dashboard
                </Link>
              </li>
              <li>
                <Link to="/mps" className="text-slate-300 hover:text-white transition-colors">
                  Parliamentary MPs
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-slate-300 hover:text-white transition-colors">
                  Works Register
                </Link>
              </li>
              <li>
                <Link to="/contractors" className="text-slate-300 hover:text-white transition-colors">
                  District Authorities (IDA)
                </Link>
              </li>
              <li>
                <Link to="/geographic" className="text-slate-300 hover:text-white transition-colors">
                  Spatial GIS Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Analytics & Review */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] font-bold">
              Intelligence & Audit
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/anomalies" className="text-slate-300 hover:text-white transition-colors">
                  AI-Assisted Signals
                </Link>
              </li>
              <li>
                <Link to="/risk-cases" className="text-slate-300 hover:text-white transition-colors">
                  Review Inquiries
                </Link>
              </li>
              <li>
                <Link to="/analytics/financial" className="text-slate-300 hover:text-white transition-colors">
                  Allocation Analytics
                </Link>
              </li>
              <li>
                <Link to="/data-quality" className="text-slate-300 hover:text-white transition-colors">
                  Data Quality Metrics
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-slate-300 hover:text-white transition-colors">
                  Statutory Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Provenance & Public Portals */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] font-bold">
              Provenance & Lineage
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/sources" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                  <Database className="w-3 h-3 text-[#F59E0B]" />
                  <span>Sources & Provenance</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://mplads.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>mplads.gov.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Vonter/india-mplads-works"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Public Snapshot Repo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link to="/audit-logs" className="text-slate-300 hover:text-white transition-colors">
                  Audit Trail Logs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & SIH Prototype Disclaimer */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-300">
          <p className="leading-relaxed text-center md:text-left">
            <strong className="text-white">SIH 2026 Prototype Notice:</strong> This prototype is developed for Smart India Hackathon 2026 and is not an official Government of India portal. Data shown is derived from identified public-source MPLADS records for demonstration and analytical purposes.
          </p>
          <div className="shrink-0 text-center md:text-right font-mono text-[10px] text-slate-400">
            <span>WCAG 2.1 AA Compliant Design Principles</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
