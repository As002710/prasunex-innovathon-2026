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
    mint: "border-[#34D399]",
    gold: "border-[#FACC15]",
  };

  const hoverStyles = hoverEffect
    ? "hover:border-[#34D399] hover:bg-white hover:shadow-[0_8px_24px_rgba(11,46,34,0.08)] hover:-translate-y-0.5 transition-all duration-300"
    : "transition-all duration-300";

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl bg-[#F0FAF5] border border-[#CDEBDD] p-5 sm:p-6 shadow-[0_1px_2px_rgba(11,46,34,0.06)] ${glowStyles[glow]} ${hoverStyles} ${className} ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {children}
    </div>
  );
}
