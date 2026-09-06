import React, { useState, useEffect } from "react";
import {
  Settings,
  Sliders,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Sparkles,
  Save,
} from "lucide-react";
import api from "../services/api";
import { SourceBadge } from "../components/civic/SourceBadge";

export const SettingsPage: React.FC = () => {
  const [weights, setWeights] = useState({
    financial: 0.25,
    contractor: 0.2,
    duplicate: 0.15,
    geographic: 0.1,
    temporal: 0.1,
    efficiency: 0.1,
    dataQuality: 0.1,
  });
  const [costMultiplier, setCostMultiplier] = useState(2.2);
  const [monopolyShare, setMonopolyShare] = useState(30);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.68);
  const [savedMsg, setSavedMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await api.get("/settings");
        const cfg = res.data.data.configuration;
        if (cfg) {
          if (cfg.weights) setWeights(cfg.weights);
          if (cfg.peerCostOutlierMultiplier)
            setCostMultiplier(cfg.peerCostOutlierMultiplier);
          if (cfg.contractorMonopolyPercent)
            setMonopolyShare(cfg.contractorMonopolyPercent);
          if (cfg.similarityThreshold)
            setSimilarityThreshold(cfg.similarityThreshold);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg("");
    try {
      await api.put("/settings", {
        weights,
        peerCostOutlierMultiplier: costMultiplier,
        contractorMonopolyPercent: monopolyShare,
        similarityThreshold,
      });
      setSavedMsg(
        "Risk scoring weights and detection thresholds updated successfully!",
      );
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleWeightChange = (key: string, val: number) => {
    setWeights((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-[#DDE2E8] dark:border-[#232D3B] pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#2457D6] dark:text-cyan-400 font-semibold">
            ENGINE CALIBRATION
          </span>
          <span className="text-[#8B949E] dark:text-[#6F7885]">//</span>
          <SourceBadge type="OFFICIAL" compact />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16191D] dark:text-[#F4F7FB] tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-[#2457D6] dark:text-cyan-400" />
          <span>Risk Engine Weights & Calibration Settings</span>
        </h1>
        <p className="text-xs text-[#5F6875] dark:text-[#A7B0BE] mt-1">
          Calibrate multi-criteria anomaly detection weights, sensitivity thresholds, and audit parameters.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 text-xs text-[#198754] flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-[#198754] shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Risk Dimension Weight Sliders */}
        <div className="hud-panel p-6 rounded-xl space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DDE2E8] dark:border-[#232D3B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#16191D] dark:text-[#F4F7FB] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#2457D6] dark:text-cyan-400" />
                <span>Unified Risk Score Dimension Weights</span>
              </h3>
              <p className="text-[11px] text-[#8B949E]">
                Adjust the contribution percentage for each audit pillar in calculating the 0-100 score.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#8B949E]">
              Total Weight:{" "}
              <strong className="text-[#2457D6]">
                {(
                  Object.values(weights).reduce((a, b) => a + b, 0) * 100
                ).toFixed(0)}
                %
              </strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(weights).map(([key, val]) => (
              <div key={key} className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="capitalize text-[#16191D] dark:text-[#F4F7FB] font-semibold">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="text-[#2457D6] font-bold">
                    {(val * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={val}
                  onChange={(e) =>
                    handleWeightChange(key, parseFloat(e.target.value))
                  }
                  className="w-full accent-[#2457D6] cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly Detection Sensitivity Thresholds */}
        <div className="hud-panel p-6 rounded-xl space-y-6 shadow-sm">
          <div className="border-b border-[#DDE2E8] dark:border-[#232D3B] pb-3">
            <h3 className="text-sm font-bold text-[#16191D] dark:text-[#F4F7FB] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#2457D6] dark:text-cyan-400" />
              <span>Sensitivity Thresholds</span>
            </h3>
            <p className="text-[11px] text-[#8B949E]">
              Define the boundary values for triggering automated investigation alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-4 rounded-lg bg-[#F8F9FB] dark:bg-[#0D1016] border border-[#DDE2E8] dark:border-[#232D3B] space-y-2">
              <span className="text-[10px] text-[#8B949E] uppercase block font-semibold">
                Cost Outlier Multiplier
              </span>
              <div className="text-xl font-bold text-[#C47A00]">
                {costMultiplier}x
              </div>
              <p className="text-[10px] text-[#5F6875] dark:text-[#A7B0BE] font-sans">
                Works exceeding {costMultiplier}x peer district median cost are flagged as financial anomalies.
              </p>
              <input
                type="range"
                min="1.2"
                max="4.0"
                step="0.1"
                value={costMultiplier}
                onChange={(e) => setCostMultiplier(parseFloat(e.target.value))}
                className="w-full accent-[#C47A00] cursor-pointer pt-2"
              />
            </div>

            <div className="p-4 rounded-lg bg-[#F8F9FB] dark:bg-[#0D1016] border border-[#DDE2E8] dark:border-[#232D3B] space-y-2">
              <span className="text-[10px] text-[#8B949E] uppercase block font-semibold">
                Monopoly Concentration %
              </span>
              <div className="text-xl font-bold text-[#C93636]">
                {monopolyShare}%
              </div>
              <p className="text-[10px] text-[#5F6875] dark:text-[#A7B0BE] font-sans">
                Vendors securing &gt;{monopolyShare}% of a district's total fund are flagged for monopoly risk.
              </p>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={monopolyShare}
                onChange={(e) => setMonopolyShare(parseInt(e.target.value, 10))}
                className="w-full accent-[#C93636] cursor-pointer pt-2"
              />
            </div>

            <div className="p-4 rounded-lg bg-[#F8F9FB] dark:bg-[#0D1016] border border-[#DDE2E8] dark:border-[#232D3B] space-y-2">
              <span className="text-[10px] text-[#8B949E] uppercase block font-semibold">
                Duplicate Title Similarity
              </span>
              <div className="text-xl font-bold text-[#2457D6] dark:text-cyan-400">
                {(similarityThreshold * 100).toFixed(0)}%
              </div>
              <p className="text-[10px] text-[#5F6875] dark:text-[#A7B0BE] font-sans">
                TF-IDF cosine similarity threshold for identifying potential duplicate work scopes.
              </p>
              <input
                type="range"
                min="0.5"
                max="0.9"
                step="0.02"
                value={similarityThreshold}
                onChange={(e) =>
                  setSimilarityThreshold(parseFloat(e.target.value))
                }
                className="w-full accent-[#2457D6] cursor-pointer pt-2"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#2457D6] hover:bg-[#1947BC] disabled:opacity-50 text-white rounded-lg text-xs font-semibold font-mono shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Calibrating..." : "Save Calibration Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
