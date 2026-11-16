import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface SectionHeaderProps {
  badge?: string;
  title: string | ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={`flex flex-col max-w-3xl ${alignClass} ${className}`}>
      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-darkEmerald-800/80 border border-mint-400/30 text-mint-accent mb-3.5 backdrop-blur-md shadow-[0_0_15px_rgba(94,234,212,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-mint-400 animate-pulse" />
          <span>{badge}</span>
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3.5 text-sm sm:text-base text-mint-accent/80 font-normal leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
