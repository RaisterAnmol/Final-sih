import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, AlertTriangle, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import api from "../services/api";
import { AlertItem } from "../types";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { SourceBadge } from "../components/civic/SourceBadge";

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/alerts?limit=50");
      setAlerts(res.data.data.alerts || []);
      setUnreadCount(res.data.data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.put(`/alerts/${id}/read`);
      setAlerts((prev) =>
        prev.map((a) => (a.alertId === id ? { ...a, isRead: true } : a)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE2E8] dark:border-[#232D3B] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C93636] font-semibold">
              REAL-TIME AUDIT SIGNALS
            </span>
            <span className="text-[#8B949E] dark:text-[#6F7885]">//</span>
            <SourceBadge type="OFFICIAL" compact />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16191D] dark:text-[#F4F7FB] tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-[#2457D6] dark:text-cyan-400" />
            <span>Real-Time Audit Alert Center</span>
          </h1>
          <p className="text-xs text-[#5F6875] dark:text-[#A7B0BE] mt-1">
            Automated alerts triggered by risk models, March sanction rush spikes, and contractor concentration thresholds ({unreadCount} unread).
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 border border-[#DDE2E8] dark:border-[#232D3B] rounded-xl bg-white dark:bg-[#151A22]">
          <LoadingSkeleton count={5} className="h-16" />
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState
          title="All Caught Up!"
          description="No active high-priority alerts at this time."
        />
      ) : (
        <div className="space-y-2.5">
          {alerts.map((a) => (
            <div
              key={a.alertId}
              onClick={() => a.projectId && navigate(`/projects/${a.projectId}`)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-sm ${
                a.isRead
                  ? "bg-white dark:bg-[#151A22] border-[#DDE2E8] dark:border-[#232D3B] text-[#5F6875] dark:text-[#A7B0BE]"
                  : "bg-blue-50/50 dark:bg-[#1A202A] border-[#2457D6]/40 text-[#16191D] dark:text-white"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    a.priority === "CRITICAL" || a.priority === "HIGH"
                      ? "bg-red-100 text-[#C93636] border border-red-200"
                      : "bg-amber-100 text-[#C47A00] border border-amber-200"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#2457D6] dark:text-cyan-400">
                      {a.alertId}
                    </span>
                    <span className="text-[10px] font-mono text-[#8B949E]">
                      {new Date(a.createdAt).toLocaleString()}
                    </span>
                    {a.projectId && (
                      <span className="text-[10px] font-mono font-bold text-[#16191D] dark:text-white bg-[#F0F2F5] dark:bg-[#0D1016] px-1.5 py-0.2 rounded border border-[#DDE2E8] dark:border-[#232D3B]">
                        {a.projectId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[#16191D] dark:text-[#F4F7FB] pt-0.5">
                    {a.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!a.isRead && (
                  <button
                    onClick={(e) => markAsRead(a.alertId, e)}
                    className="p-1.5 rounded-md hover:bg-white dark:hover:bg-[#151A22] text-[#8B949E] hover:text-[#2457D6] transition-colors"
                    title="Mark as Read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <span className="text-xs text-[#2457D6] dark:text-cyan-400 font-mono font-semibold hidden sm:inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
