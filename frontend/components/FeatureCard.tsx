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
      className="group relative rounded-2xl bg-burgundy-900/80 hover:bg-burgundy-850/95 backdrop-blur-xl border border-gold-500/35 hover:border-gold-400 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(212,175,55,0.25)] flex flex-col justify-between cursor-pointer"
    >
      {/* Top inner ambient gold line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent rounded-t-2xl" />

      <div>
        {/* Gold Line Icon Box */}
        <div className="w-12 h-12 rounded-xl bg-burgundy-800/90 border border-gold-500/40 flex items-center justify-center text-gold-400 mb-4 group-hover:scale-110 group-hover:border-gold-300 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.45)] transition-all duration-300">
          <IconComponent className="w-6 h-6 text-gold-400" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400/90 mb-1 block">
          {feature.tagline}
        </span>

        <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-gold-200 transition-colors">
          {feature.title}
        </h3>

        <p className="text-xs sm:text-sm text-gold-100/75 leading-relaxed font-normal">
          {feature.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-gold-500/20 flex items-center justify-between text-xs font-semibold text-gold-400 group-hover:text-gold-300">
        <span>Explore module</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  );
}
