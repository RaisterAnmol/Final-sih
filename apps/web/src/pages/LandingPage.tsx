import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Coins,
  Cpu,
  Database,
  FileCheck2,
  FolderKanban,
  Gauge,
  Layers3,
  MapPin,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import GovernmentHeader from "../components/common/GovernmentHeader";
import { CivicFooter } from "../components/civic/CivicFooter";

const stages = [
  { n: "01", title: "Ingest & Validate", icon: Database, text: "Normalise public works-register data, validate fields and preserve source lineage.", tone: "blue" },
  { n: "02", title: "Detect Outliers", icon: Activity, text: "Isolation Forest, LOF and rule-based signals screen cost and timeline anomalies.", tone: "amber" },
  { n: "03", title: "Find Duplicates", icon: Search, text: "TF-IDF and cosine similarity surface potentially duplicated or ghost works.", tone: "purple" },
  { n: "04", title: "Map Concentration", icon: Network, text: "Contractor concentration and spatial proximity expose unusual clusters.", tone: "cyan" },
  { n: "05", title: "Prioritise Risk", icon: Gauge, text: "Signals combine into explainable risk tiers for faster officer review.", tone: "rose" },
  { n: "06", title: "Generate Dossier", icon: FileCheck2, text: "Every flagged case is traceable back to source evidence and audit events.", tone: "emerald" },
];

const toneClass: Record<string, string> = {
  blue: "border-[#B9D5FF] bg-[#F5F9FF] text-[#1559A6]",
  amber: "border-[#F2D39A] bg-[#FFF9ED] text-[#9A5A00]",
  purple: "border-[#D9C6F7] bg-[#FAF7FF] text-[#7042A5]",
  cyan: "border-[#B7E7EE] bg-[#F1FCFD] text-[#087B8C]",
  rose: "border-[#F1C2C9] bg-[#FFF6F7] text-[#B42318]",
  emerald: "border-[#B8E4CC] bg-[#F3FBF6] text-[#137A3F]",
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#18234F] overflow-x-hidden">
      <GovernmentHeader publicMode />

      <main id="main-content">
        {/* Hero: redesigned as an official digital-governance landing page */}
        <section className="relative overflow-hidden border-b border-[#DCE2EA] bg-[linear-gradient(180deg,#FFFFFF_0%,#F7F9FC_100%)]">
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#DDEAFF] blur-3xl" />
            <div className="absolute top-20 -right-40 w-[420px] h-[420px] rounded-full bg-[#E9F7EE] blur-3xl" />
          </div>

          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 py-14 lg:py-20 relative">
            <div className="grid lg:grid-cols-[1.08fr_.92fr] gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#F0D092] bg-[#FFF8E8] text-[#875000] text-[10px] font-bold uppercase tracking-[0.13em]">
                  <Sparkles className="w-3.5 h-3.5" /> Smart India Hackathon 2026 • PS26102
                </div>

                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[62px] leading-[1.04] font-extrabold tracking-[-0.035em] text-[#18234F]">
                  Intelligence for
                  <span className="block text-[#1769AA]">Transparent MPLADS</span>
                  <span className="block">Implementation.</span>
                </h1>

                <p className="mt-6 max-w-2xl text-base sm:text-lg leading-8 text-[#526071]">
                  MPLADS Insight turns public works data into an auditable decision-support layer—helping officers discover anomalies, duplicate works, concentration risks and execution bottlenecks before they become expensive review cases.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#138A45] hover:bg-[#0F7439] text-white text-sm font-bold shadow-md transition-all hover:-translate-y-0.5">
                    <Zap className="w-4 h-4" /> Explore Monitoring Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/projects" className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white hover:bg-[#F7FAFC] text-[#18234F] border border-[#CBD5E1] text-sm font-bold transition-colors">
                    <FolderKanban className="w-4 h-4 text-[#1769AA]" /> Inspect Works Register
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-semibold text-[#667085]">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#138A45]" /> Source traceability</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#138A45]" /> Explainable risk signals</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#138A45]" /> Officer-first workflow</span>
                </div>
              </motion.div>

              {/* Hero intelligence console */}
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6, delay: .1 }} className="relative">
                <div className="absolute -inset-4 bg-[#1B4F9C]/5 blur-2xl rounded-[28px]" />
                <div className="relative bg-white border border-[#CBD5E1] rounded-xl shadow-[0_20px_55px_-25px_rgba(24,35,79,.35)] overflow-hidden">
                  <div className="px-5 py-3 bg-[#18234F] text-white flex items-center justify-between border-b-4 border-[#F8B84E]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#F8B84E]" />
                      <span className="text-[11px] font-bold tracking-wide">NATIONAL MONITORING CONSOLE</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#A7F3C5]">LIVE SNAPSHOT</span>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ["60,359", "Total Work Records", "text-[#1769AA]"],
                        ["₹3,498.25 Cr", "Recommended Allocation", "text-[#138A45]"],
                        ["633", "Parliamentary MPs", "text-[#7042A5]"],
                        ["5,000", "Analytical Signals", "text-[#B42318]"],
                      ].map(([value, label, color]) => (
                        <div key={label} className="p-3.5 rounded-md border border-[#E2E8F0] bg-[#FAFBFD]">
                          <div className={`text-xl sm:text-2xl font-extrabold font-mono ${color}`}>{value}</div>
                          <div className="mt-1 text-[9px] uppercase tracking-wider font-bold text-[#667085]">{label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#18234F]">AI signal pipeline</div>
                        <span className="text-[9px] font-mono text-[#138A45] font-bold">6 / 6 READY</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[Database, Activity, Search, Network, Gauge, FileCheck2].map((Icon, i) => (
                          <React.Fragment key={i}>
                            <div className="w-8 h-8 rounded-md bg-white border border-[#D8DEE8] flex items-center justify-center">
                              <Icon className={`w-3.5 h-3.5 ${i === 4 ? "text-[#B42318]" : "text-[#1769AA]"}`} />
                            </div>
                            {i < 5 && <div className="h-px flex-1 bg-[#CBD5E1]" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-[1fr_auto] gap-3 items-center">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider font-bold text-[#667085]">Highest priority</div>
                        <div className="mt-1 text-xs font-bold text-[#18234F]">Cost outlier + contractor concentration</div>
                      </div>
                      <button onClick={() => navigate("/anomalies")} className="px-3 py-2 rounded-md bg-[#FFF2F3] text-[#B42318] border border-[#F1C2C9] text-[10px] font-bold">Review signal</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="bg-white border-b border-[#DCE2EA]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            {[
              ["Public-source lineage", "Every insight links back to source data"],
              ["Multi-signal AI", "Statistical + spatial + temporal checks"],
              ["Human-in-the-loop", "AI prioritises; officers decide"],
              ["Audit-ready", "Evidence and review trail preserved"],
            ].map(([title, text], i) => (
              <div key={title} className={`px-3 ${i ? "md:border-l md:border-[#E2E8F0]" : ""}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#18234F]">{title}</div>
                <div className="mt-1 text-[10px] leading-4 text-[#667085]">{text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Metrics */}
        <section className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#138A45]">At a glance</div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#18234F]">One view for public works oversight</h2>
            </div>
            <p className="max-w-xl text-xs leading-5 text-[#667085]">A competition-ready command surface designed to help evaluators see the problem, the intelligence layer, and the administrative action path immediately.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: FolderKanban,
                label: "Total Work Records",
                value: "60,359",
                note: "Public-source snapshot",
                action: "Register →",
                path: "/projects",
                cls: "border-[#B9D5FF]",
                valColor: "text-[#18234F]",
              },
              {
                icon: Coins,
                label: "Recommended Allocation",
                value: "₹3498.25 Cr",
                note: "Sum of source allocations",
                action: "Analytics →",
                path: "/analytics/financial",
                cls: "border-[#F2D39A]",
                valColor: "text-[#138A45]",
              },
              {
                icon: Users,
                label: "Parliamentary MPs",
                value: "633",
                note: "Unique MPs in snapshot",
                action: "Directory →",
                path: "/mps",
                cls: "border-[#D9C6F7]",
                valColor: "text-[#18234F]",
              },
              {
                icon: AlertTriangle,
                label: "Analytical Signals",
                value: "5,000",
                note: "Decision-support review flags",
                action: "Signals →",
                path: "/anomalies",
                cls: "border-[#F1C2C9]",
                valColor: "text-[#B42318]",
              },
            ].map(({ icon: Icon, label, value, note, action, path, cls, valColor }) => (
              <button
                key={label}
                type="button"
                onClick={() => navigate(path)}
                className={`text-left p-5 bg-white rounded-lg border ${cls} shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#667085]">{label}</span>
                    <Icon className="w-4 h-4 text-[#18234F]" />
                  </div>
                  <div className={`mt-3 text-2xl font-extrabold font-mono tracking-tight ${valColor}`}>{value}</div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] text-[#5B6472]">{note}</span>
                  <span className="font-bold text-[#18234F] hover:underline flex items-center gap-0.5 shrink-0">{action}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section className="bg-white border-y border-[#DCE2EA]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 py-14">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#EEF5FF] border border-[#C9DDF8] text-[#1559A6] text-[10px] font-bold uppercase tracking-wider"><Cpu className="w-3.5 h-3.5" /> Intelligence architecture</div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18234F]">From raw records to an explainable audit signal</h2>
              <p className="mt-3 text-sm leading-6 text-[#667085]">Six connected stages make the system easy to demonstrate, inspect and defend during an SIH evaluation.</p>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stages.map((stage) => {
                const Icon = stage.icon;
                return <motion.div key={stage.n} whileHover={{ y: -4 }} className={`p-5 rounded-lg border ${toneClass[stage.tone]} bg-opacity-60 transition-shadow hover:shadow-md`}>
                  <div className="flex items-start justify-between gap-3"><div className="w-9 h-9 rounded-md bg-white border border-current/15 flex items-center justify-center"><Icon className="w-4 h-4" /></div><span className="font-mono text-[10px] font-extrabold opacity-70">{stage.n}</span></div>
                  <h3 className="mt-4 text-sm font-extrabold text-[#18234F]">{stage.title}</h3>
                  <p className="mt-2 text-[11px] leading-5 text-[#5E6878]">{stage.text}</p>
                </motion.div>;
              })}
            </div>
          </div>
        </section>

        {/* Why it wins */}
        <section className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 py-14">
          <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-10 items-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9A5A00]">Designed for evaluation</div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18234F]">Professional enough for government. Clear enough for a jury.</h2>
              <p className="mt-4 text-sm leading-6 text-[#667085]">The interface deliberately combines government-style information hierarchy with modern intelligence tooling—without pretending the prototype is an official Government of India portal.</p>
              <Link to="/dashboard" className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-md bg-[#18234F] text-white text-xs font-bold hover:bg-[#24346F]">Enter the full platform <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                [Layers3, "Unified evidence layer", "Data quality, provenance, analytics and review cases live in one workflow."],
                [MapPin, "Spatial intelligence", "Geographic proximity and district patterns turn tables into actionable context."],
                [TrendingUp, "Financial visibility", "Allocation, disbursement and execution trends are surfaced without spreadsheet hunting."],
                [ShieldCheck, "Responsible AI", "Signals are explainable and reviewable; the system supports officers rather than replacing them."],
              ].map(([Icon, title, text]) => {
                const I = Icon as React.ElementType;
                return <div key={String(title)} className="p-5 rounded-lg bg-white border border-[#DCE2EA] shadow-sm"><I className="w-5 h-5 text-[#1769AA]" /><h3 className="mt-3 text-xs font-extrabold text-[#18234F]">{String(title)}</h3><p className="mt-2 text-[11px] leading-5 text-[#667085]">{String(text)}</p></div>;
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#18234F] border-y border-[#111A3D]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div><div className="text-[#F8B84E] text-[10px] font-bold uppercase tracking-widest">MPLADS Insight • SIH 2026</div><h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">See the complete intelligence workflow.</h2><p className="mt-2 text-xs text-white/65">Dashboard → signals → evidence → review dossier → audit trail.</p></div>
            <Link to="/dashboard" className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#138A45] hover:bg-[#0F7439] text-white text-sm font-bold shadow-lg">Launch Monitoring Dashboard <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>
      </main>

      <CivicFooter />
    </div>
  );
};
