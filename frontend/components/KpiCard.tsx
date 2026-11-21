"use client";

import { ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { KpiItem } from "@/data/student";

interface KpiCardProps {
  item: KpiItem;
  onClick?: () => void;
}

export function KpiCard({ item, onClick }: KpiCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl p-5 bg-[#F0FAF5] border border-[#CDEBDD] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#34D399] hover:shadow-[0_4px_12px_rgba(11,46,34,0.06)] ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#4B6B5E]">
          {item.title}
        </span>
        {item.change && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              item.trend === "up"
                ? "bg-[#FEF9C3] text-[#713F12] border border-[#FACC15]"
                : "bg-red-50 text-[#B91C1C] border border-red-200"
            }`}
          >
            {item.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
            {item.trend === "down" && <ArrowDownRight className="w-3 h-3" />}
            {item.change}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2E22]">
          {item.value}
        </span>

        {/* Mini sparkline chart in Mint */}
        <div className="w-24 h-11 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={item.sparkline}>
              <Line
                type="monotone"
                dataKey="y"
                stroke="#047857"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {item.linkText && (
        <div className="mt-3 pt-2.5 border-t border-[#CDEBDD] flex items-center justify-between text-xs font-bold text-[#047857] hover:text-[#065F46] transition-colors">
          <span>{item.linkText}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
}
