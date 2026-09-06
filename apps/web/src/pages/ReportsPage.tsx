import React, { useState } from "react";
import { FileText, Download, Loader2, CheckCircle2, ShieldCheck, ArrowRight, FileSpreadsheet } from "lucide-react";
import api from "../services/api";
import { SourceBadge } from "../components/civic/SourceBadge";

export const ReportsPage: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadOverviewCSV = async () => {
    setDownloading("overview");
    try {
      const res = await api.get("/reports/overview/csv", { responseType: "blob" });
      if (res.data && typeof res.data !== "string") {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "MPLAD_Scheme_Overview_Audit_Report.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setDownloading(null);
        return;
      }
    } catch {}

    try {
      const pRes = await api.get("/projects?limit=500");
      const projects = pRes.data?.data?.projects || [];
      const headers = [
        "Work ID,Title,Category,State,District,Sanctioned Amount,Implementing Authority,Risk Level,Risk Score\n",
      ];
      const rows = projects.map(
        (p: any) =>
          `"${p.projectId}","${(p.title || '').replace(/"/g, '""')}","${p.category}","${p.state}","${p.district}",${p.allocatedAmount},"${p.implementingAgency || p.ida || 'District Authority'}","${p.riskLevel}",${p.riskScore}`,
      );

      const csvContent = headers.concat(rows.join("\n")).join("");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "MPLAD_Scheme_Overview_Audit_Report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error("Failed to generate CSV:", e);
    } finally {
      setDownloading(null);
    }
  };

  const downloadHighRiskCSV = async () => {
    setDownloading("highrisk");
    try {
      const res = await api.get("/projects/export/csv?riskLevel=HIGH", {
        responseType: "blob",
      });
      if (res.data && typeof res.data !== "string") {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "MPLAD_High_Risk_Audit_Dossier.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setDownloading(null);
        return;
      }
    } catch {}

    try {
      const pRes = await api.get("/projects?limit=300&riskLevel=HIGH");
      const highRiskWorks = pRes.data?.data?.projects || [];
      const headers = [
        "Work ID,Title,Category,State,District,Implementing Authority,Allocated Amount,Risk Score,Signals\n",
      ];
      const rows = highRiskWorks.map(
        (p: any) =>
          `"${p.projectId}","${(p.title || '').replace(/"/g, '""')}","${p.category}","${p.state}","${p.district}","${p.implementingAgency || p.ida || 'District Authority'}",${p.allocatedAmount},${p.riskScore},"${(p.signals || []).map((s: any) => s.signal).join("; ")}"`,
      );

      const csvContent = headers.concat(rows.join("\n")).join("");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "MPLAD_High_Risk_Audit_Dossier.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error("Failed to generate High Risk CSV:", e);
    } finally {
      setDownloading(null);
    }
  };

  const downloadProjectPDF = async () => {
    setDownloading("pdf");
    try {
      const pRes = await api.get("/projects?limit=20&riskLevel=HIGH");
      const topProjects = pRes.data?.data?.projects || [];

      const jsPDFModule = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");
      const jsPDF = jsPDFModule.default;
      const autoTable = autoTableModule.default;

      const doc = new jsPDF();
      doc.setFillColor(31, 42, 90);
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("MoSPI — MPLAD STATUTORY AUDIT DOSSIER", 14, 18);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Government of India | Ministry of Statistics & Programme Implementation",
        14,
        25,
      );
      doc.text(
        `Generated: ${new Date().toLocaleDateString()} | Scope: National High-Risk Audit Registry (Public Source Snapshot)`,
        14,
        30,
      );

      autoTable(doc, {
        startY: 45,
        head: [
          [
            "Work ID",
            "Project Title",
            "Category",
            "District",
            "Cost (Lakhs)",
            "Risk",
            "Status",
          ],
        ],
        body: topProjects.map((p: any) => [
          p.projectId,
          (p.title || '').substring(0, 45),
          p.category,
          `${p.district}, ${p.state}`,
          `Rs. ${((p.allocatedAmount || 0) / 100000).toFixed(1)}L`,
          `${p.riskScore} (${p.riskLevel})`,
          p.status,
        ]),
        theme: "striped",
        headStyles: { fillColor: [31, 42, 90], textColor: [255, 255, 255] },
      });

      doc.save(`MoSPI_National_Audit_Registry_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error("PDF generation error:", e);
    } finally {
      setDownloading(null);
    }
  };

  const reports = [
    {
      id: "overview",
      title: "National Works Telemetry Dataset",
      desc: "Complete analytical export containing verified public developmental works, financial allocations, implementing authorities, and status tags.",
      badge: "CSV DATASET",
      action: downloadOverviewCSV,
      icon: FileSpreadsheet,
    },
    {
      id: "highrisk",
      title: "High-Priority Review Anomaly Dossier",
      desc: "Detailed audit roster of high-risk works with risk score >= 60, statistical peer deviation signals, and IDA review flags.",
      badge: "AUDIT EXPORT",
      action: downloadHighRiskCSV,
      icon: FileSpreadsheet,
    },
    {
      id: "pdf",
      title: "Official MoSPI Statutory Audit Dossier",
      desc: "Publication-grade audit document with executive briefing headers, certified telemetry tables, and MoSPI statutory provenance formatting.",
      badge: "VECTOR PDF",
      action: downloadProjectPDF,
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-[#DDE2E8] dark:border-[#232D3B] pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#1F2A5A] font-semibold">
            AUDIT EXPORT STATION
          </span>
          <span className="text-[#8B949E] dark:text-[#6F7885]">//</span>
          <SourceBadge type="OFFICIAL" compact />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A5A] dark:text-[#F4F7FB] tracking-tight flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-[#1F2A5A]" />
          <span>Statutory Audit Report Generator</span>
        </h1>
        <p className="text-xs text-[#5F6875] dark:text-[#A7B0BE] mt-1">
          Generate, verify, and export official CSV datasets and vector PDF dossiers for parliamentary audit presentation.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((r) => {
          const Icon = r.icon;
          const isDownloading = downloading === r.id;

          return (
            <div
              key={r.id}
              className="bg-white dark:bg-[#0D1016] border border-[#D9DEE7] dark:border-slate-800 p-6 rounded-md space-y-4 flex flex-col justify-between hover:border-[#1F2A5A] transition-all shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-sm bg-[#1F2A5A]/10 border border-[#1F2A5A]/20 flex items-center justify-center text-[#1F2A5A]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F0F2F5] dark:bg-[#0D1016] text-[#5F6875] dark:text-cyan-300 border border-[#DDE2E8] dark:border-[#232D3B]">
                    {r.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#1F2A5A] dark:text-[#F4F7FB]">
                  {r.title}
                </h3>
                <p className="text-xs text-[#5F6875] dark:text-[#A7B0BE] leading-relaxed">
                  {r.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={r.action}
                disabled={isDownloading}
                className="w-full py-2.5 bg-[#1F2A5A] hover:bg-[#172554] disabled:opacity-50 text-white rounded-sm text-xs font-semibold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Compiling Telemetry...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Report</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
