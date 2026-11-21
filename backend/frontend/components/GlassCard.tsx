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
    mint: "shadow-[0_0_30px_rgba(212,175,55,0.25)] border-gold-400/50",
    gold: "shadow-[0_0_30px_rgba(212,175,55,0.35)] border-gold-400/60",
  };

  const hoverStyles = hoverEffect
    ? "hover:border-gold-400/60 hover:bg-burgundy-850/90 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(212,175,55,0.25)] hover:-translate-y-0.5 transition-all duration-300"
    : "transition-all duration-300";

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl bg-burgundy-900/80 backdrop-blur-xl border border-gold-500/35 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${glowStyles[glow]} ${hoverStyles} ${className} ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Subtle top inner gold highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/40 to-transparent rounded-t-2xl pointer-events-none" />
      {children}
    </div>
  );
}
