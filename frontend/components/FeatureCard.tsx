import {
  Brain,
  FileSpreadsheet,
  LineChart,
  ShieldAlert,
  CalendarClock,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { FeatureItem } from "@/data/landing";

interface FeatureCardProps {
  feature: FeatureItem;
  onClick?: () => void;
}

export function FeatureCard({ feature, onClick }: FeatureCardProps) {
  const iconMap: Record<string, any> = {
    Brain,
    FileSpreadsheet,
    LineChart,
    ShieldAlert,
    CalendarClock,
    Wrench,
  };

  const IconComponent = iconMap[feature.iconName] || Brain;

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl bg-darkEmerald-900/60 hover:bg-darkEmerald-850/80 backdrop-blur-xl border border-mint-400/20 hover:border-mint-accent/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(94,234,212,0.2)] flex flex-col justify-between cursor-pointer"
    >
      {/* Top inner ambient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint-400/30 to-transparent rounded-t-2xl" />

      <div>
        {/* Mint Line Icon Box */}
        <div className="w-12 h-12 rounded-xl bg-darkEmerald-800/80 border border-mint-400/30 flex items-center justify-center text-mint-400 mb-4 group-hover:scale-110 group-hover:border-mint-accent group-hover:shadow-[0_0_18px_rgba(94,234,212,0.4)] transition-all duration-300">
          <IconComponent className="w-6 h-6 text-mint-accent" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-widest text-mint-400/80 mb-1 block">
          {feature.tagline}
        </span>

        <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-mint-300 transition-colors">
          {feature.title}
        </h3>

        <p className="text-xs sm:text-sm text-mint-accent/70 leading-relaxed font-normal">
          {feature.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-mint-400/15 flex items-center justify-between text-xs font-semibold text-mint-400 group-hover:text-mint-accent">
        <span>Explore module</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  );
}
