import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Logo({
  showTagline = true,
  size = "md",
}: {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const titleSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Open Book Icon with Gold Sparkle Star */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-gold-500/20 via-burgundy-800 to-burgundy-950 border border-gold-500/50 p-1.5 shadow-[0_0_15px_rgba(212,175,55,0.30)] group-hover:border-gold-300 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.50)] transition-all duration-300`}
      >
        {/* Open Book SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-gold-400 transition-transform duration-300 group-hover:scale-105"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>

        {/* Gold Sparkle Star over the book */}
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse drop-shadow-[0_0_8px_rgba(212,175,55,0.9)]" />
        </div>
      </div>

      <div className="flex flex-col">
        <span
          className={`${titleSizes[size]} font-extrabold tracking-tight text-white group-hover:text-gold-200 transition-colors flex items-center gap-1`}
        >
          CAMPUS<span className="text-gold-400 font-black">-NEXUS</span>
        </span>
        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase font-medium text-gold-200/70 -mt-0.5">
            Learn · Connect · Thrive
          </span>
        )}
      </div>
    </Link>
  );
}
