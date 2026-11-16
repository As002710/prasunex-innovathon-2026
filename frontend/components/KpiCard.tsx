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
          ? "bg-gradient-to-br from-gold/15 via-darkEmerald-900/80 to-darkEmerald-950 border-gold/40 shadow-[0_0_25px_rgba(245,185,66,0.15)] hover:border-gold hover:shadow-[0_0_35px_rgba(245,185,66,0.3)]"
          : "bg-darkEmerald-900/70 border-mint-400/20 shadow-glass hover:border-mint-400/50 hover:shadow-[0_0_25px_rgba(94,234,212,0.2)]"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      {/* Top ambient highlight line */}
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
          isGold ? "via-gold/40" : "via-mint-400/30"
        } to-transparent`}
      />

      <div className="flex items-start justify-between gap-2 mb-3">
        <span
          className={`text-xs font-semibold tracking-wider uppercase ${
            isGold ? "text-gold" : "text-mint-accent/80"
          }`}
        >
          {item.title}
        </span>
        {item.change && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              isGold
                ? "bg-gold/20 text-gold-light border border-gold/40"
                : item.trend === "up"
                ? "bg-mint-400/15 text-mint-400 border border-mint-400/30"
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
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isGold ? "text-gold-light drop-shadow-[0_0_12px_rgba(245,185,66,0.5)]" : "text-white"
            }`}
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
                stroke={isGold ? "#F5B942" : "#4ADE9A"}
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {item.linkText && (
        <div className="mt-3 pt-2.5 border-t border-gold/20 flex items-center justify-between text-xs font-bold text-gold hover:text-gold-light transition-colors">
          <span>{item.linkText}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
}
