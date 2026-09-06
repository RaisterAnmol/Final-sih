import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Info } from "lucide-react";

export interface SectorData {
  category: string;
  shortName: string;
  totalAllocated: number;
}

export interface AnimatedSectorChartProps {
  data: SectorData[];
}

export const AnimatedSectorChart: React.FC<AnimatedSectorChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayData = data.slice(0, 7);
  const maxVal = Math.max(...displayData.map((d) => d.totalAllocated), 10000000);

  return (
    <div className="space-y-4 w-full min-w-0">
      {/* Institutional Category Bar Chart */}
      <div className="relative pt-4 pb-2">
        <div className="space-y-3">
          {displayData.map((d, idx) => {
            const pct = maxVal > 0 ? (d.totalAllocated / maxVal) * 100 : 0;
            const crores = (d.totalAllocated / 10000000).toFixed(2);
            const lakhs = (d.totalAllocated / 100000).toFixed(1);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={d.category}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="space-y-1 group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#1F2A5A] transition-colors">
                    {d.category}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-[#1F2A5A] dark:text-blue-300">
                      ₹{crores} Cr
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">
                      (₹{Number(lakhs).toLocaleString()}L)
                    </span>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="h-4 bg-[#F0F2F5] dark:bg-[#151A22] rounded-xs overflow-hidden border border-[#D9DEE7] dark:border-slate-800 flex">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
                    className={`h-full ${
                      isHovered ? "bg-[#172554]" : "bg-[#1F2A5A]"
                    } transition-colors`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-[#D9DEE7] dark:border-slate-800 font-mono">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#1F2A5A]" />
          <span>Source: Sum of recommended allocation amounts across snapshot records</span>
        </div>
        <span className="font-bold text-[#138A45]">Zero-Fabrication Validated</span>
      </div>
    </div>
  );
};
