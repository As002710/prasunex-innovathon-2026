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
      className="group relative rounded-xl bg-[#F0FAF5] hover:bg-white border border-[#CDEBDD] hover:border-[#34D399] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(11,46,34,0.08)] flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Icon Box */}
        <div className="w-12 h-12 rounded-xl bg-white border border-[#CDEBDD] flex items-center justify-center text-[#047857] mb-4 group-hover:scale-110 group-hover:border-[#34D399] transition-all duration-300 shadow-sm">
          <IconComponent className="w-6 h-6 text-[#047857]" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-widest text-[#047857] mb-1 block">
          {feature.tagline}
        </span>

        <h3 className="text-base sm:text-lg font-bold text-[#0B2E22] mb-2 group-hover:text-[#047857] transition-colors">
          {feature.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#4B6B5E] leading-relaxed font-normal">
          {feature.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-[#CDEBDD] flex items-center justify-between text-xs font-semibold text-[#047857] group-hover:text-[#065F46]">
        <span>Explore module</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  );
}
