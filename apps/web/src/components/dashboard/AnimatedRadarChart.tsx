import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, RefreshCw } from "lucide-react";

export interface RadarNode {
  dimension: string;
  value: number;
}

export interface AnimatedRadarChartProps {
  data: RadarNode[];
}

export const AnimatedRadarChart: React.FC<AnimatedRadarChartProps> = ({ data }) => {
  const [replayKey, setReplayKey] = useState(0);
  const size = 260;
  const center = size / 2;
  const radius = 95;
  const count = data.length;

  const points = data
    .map((d, i) => {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const r = (d.value / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-between h-full space-y-2">
      {/* Header with Replay Action */}
      <div className="w-full flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-2">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-purple-600 animate-spin-slow" />
            <span>Risk Vector Decomposition</span>
          </h3>
          <p className="text-[11px] text-indigo-900/80 dark:text-indigo-300 font-medium">
            7-Dimension Multimodal Sensitivity
          </p>
        </div>
        <button
          onClick={() => setReplayKey((k) => k + 1)}
          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-[#151A22] text-indigo-600 hover:text-purple-600 cursor-pointer transition-colors"
          title="Re-trigger radar sweep"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Canvas with Animated Sweep & Spring Polygon */}
      <div key={replayKey} className="relative flex items-center justify-center py-2">
        {/* Rotating Radar Scanner Beam */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48 rounded-full border border-purple-300/40 pointer-events-none"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, rgba(139, 92, 246, 0.22) 0deg, transparent 60deg, transparent 360deg)",
          }}
        />

        <svg width={size} height={size} className="overflow-visible">
          {/* Concentric Web Rings */}
          {[0.25, 0.5, 0.75, 1.0].map((ring, idx) => (
            <circle
              key={idx}
              cx={center}
              cy={center}
              r={radius * ring}
              fill="none"
              stroke="#E0E7FF"
              strokeWidth="1"
              strokeDasharray={idx === 3 ? "none" : "3 3"}
              className="dark:stroke-slate-800"
            />
          ))}

          {/* Radial Axis Spokes */}
          {data.map((_, i) => {
            const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#E0E7FF"
                strokeWidth="1"
                className="dark:stroke-slate-800"
              />
            );
          })}

          {/* Animated Spring Polygon Area */}
          <motion.polygon
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 12,
              delay: 0.1,
            }}
            points={points}
            fill="url(#radarGradient)"
            stroke="#8B5CF6"
            strokeWidth="2.5"
            style={{ transformOrigin: `${center}px ${center}px` }}
          />

          {/* Glowing Animated Vertex Dots */}
          {data.map((d, i) => {
            const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
            const r = (d.value / 100) * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return (
              <motion.circle
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                cx={x}
                cy={y}
                r="4.5"
                fill="#8B5CF6"
                stroke="#ffffff"
                strokeWidth="2"
                className="drop-shadow-md cursor-pointer"
              />
            );
          })}

          {/* Dimension Text Labels */}
          {data.map((d, i) => {
            const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
            const labelR = radius + 20;
            const x = center + labelR * Math.cos(angle);
            const y = center + labelR * Math.sin(angle);
            return (
              <text
                key={i}
                x={x}
                y={y + 4}
                textAnchor="middle"
                className="text-[10px] font-mono font-extrabold fill-indigo-950 dark:fill-indigo-200"
              >
                {d.dimension}
              </text>
            );
          })}

          {/* SVG Gradient Definition */}
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="w-full text-center pt-1">
        <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-extrabold bg-purple-100 dark:bg-purple-950 px-3 py-1 rounded-full border border-purple-200 shadow-xs">
          ⚡ LOF + Isolation Forest Active
        </span>
      </div>
    </div>
  );
};
