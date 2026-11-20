"use client";

import { ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { KpiItem } from "@/data/student";

interface KpiCardProps {
  item: KpiItem;
  onClick?: () => void;
}

export function KpiCard({ item, onClick }: KpiCardProps) {
  const isGold = item.isGold;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 backdrop-blur-xl border transition-all duration-300 hover:-translate-y-1 ${
        isGold
          ? "bg-gradient-to-br from-gold-500/20 via-burgundy-900/90 to-burgundy-950 border-gold-500/60 shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:border-gold-400 hover:shadow-[0_0_35px_rgba(212,175,55,0.4)]"
          : "bg-burgundy-900/80 border-gold-500/35 shadow-glass hover:border-gold-400 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)]"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      {/* Top ambient highlight line */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent"
      />

      <div className="flex items-start justify-between gap-2 mb-3">
        <span
          className="text-xs font-semibold tracking-wider uppercase text-gold-300"
        >
          {item.title}
        </span>
        {item.change && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              isGold
                ? "bg-gold-500/20 text-gold-200 border border-gold-400/50"
                : item.trend === "up"
                ? "bg-gold-500/15 text-gold-300 border border-gold-400/30"
                : "bg-coral/15 text-coral border border-coral/30"
            }`}
          >
            {item.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
            {item.trend === "down" && <ArrowDownRight className="w-3 h-3" />}
            {item.change}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="flex items-baseline gap-1">
          <span
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(212,175,55,0.35)]"
          >
            {item.value}
          </span>
        </div>

        {/* Mini sparkline chart */}
        <div className="w-24 h-11 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={item.sparkline}>
              <Line
                type="monotone"
                dataKey="y"
                stroke="#D4AF37"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {item.linkText && (
        <div className="mt-3 pt-2.5 border-t border-gold-500/25 flex items-center justify-between text-xs font-bold text-gold-400 hover:text-gold-200 transition-colors">
          <span>{item.linkText}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
}
