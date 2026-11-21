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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#FEF9C3] border border-[#FACC15] text-[#713F12] mb-3.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
          <span>{badge}</span>
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2E22] tracking-tight leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3.5 text-sm sm:text-base text-[#4B6B5E] font-normal leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
