import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: "mint" | "gold" | "none";
  hoverEffect?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = "",
  glow = "none",
  hoverEffect = true,
  onClick,
}: GlassCardProps) {
  const glowStyles = {
    none: "",
    mint: "shadow-[0_0_30px_rgba(94,234,212,0.2)] border-mint-400/40",
    gold: "shadow-[0_0_30px_rgba(245,185,66,0.2)] border-gold/40",
  };

  const hoverStyles = hoverEffect
    ? "hover:border-mint-400/50 hover:bg-darkEmerald-900/80 hover:shadow-[0_12px_36px_rgba(0,0,0,0.5),0_0_24px_rgba(94,234,212,0.18)] hover:-translate-y-0.5 transition-all duration-300"
    : "transition-all duration-300";

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl bg-darkEmerald-900/70 backdrop-blur-xl border border-mint-400/20 p-5 sm:p-6 ${glowStyles[glow]} ${hoverStyles} ${className} ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Subtle top inner highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint-300/25 to-transparent rounded-t-2xl pointer-events-none" />
      {children}
    </div>
  );
}
