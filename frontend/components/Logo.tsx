import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Logo({
  showTagline = true,
  size = "md",
}: {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const titleSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Graduation Cap over text */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 via-plum-800 to-plum-950 border border-pink-primary/40 p-1.5 shadow-[0_0_15px_rgba(242,139,168,0.25)] group-hover:border-pink-primary group-hover:shadow-[0_0_20px_rgba(242,139,168,0.5)] transition-all duration-300`}
      >
        <GraduationCap className="w-full h-full text-pink-primary transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(242,139,168,0.8)]" />
      </div>

      <div className="flex flex-col">
        <span
          className={`${titleSizes[size]} font-extrabold tracking-tight text-white group-hover:text-pink-light transition-colors flex items-center gap-1`}
        >
          CAMPUS<span className="text-pink-primary font-black">-NEXUS</span>
        </span>
        {showTagline && (
          <span className="text-[10px] tracking-wide font-medium text-amber-secondary/90 -mt-0.5">
            Find why a student is failing. Then fix it.
          </span>
        )}
      </div>
    </Link>
  );
}
