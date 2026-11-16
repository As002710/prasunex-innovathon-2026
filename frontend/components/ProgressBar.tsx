interface ProgressBarProps {
  label: string;
  value: number;
  color?: "green" | "amber" | "red";
  code?: string;
  instructor?: string;
}

export function ProgressBar({
  label,
  value,
  color,
  code,
  instructor,
}: ProgressBarProps) {
  // Determine color if not explicitly provided
  const activeColor =
    color || (value >= 75 ? "green" : value >= 55 ? "amber" : "red");

  const colorStyles = {
    green: {
      fill: "bg-gradient-to-r from-mint-500 to-mint-glow shadow-[0_0_12px_rgba(74,222,154,0.6)]",
      text: "text-mint-400",
      dot: "bg-mint-400",
    },
    amber: {
      fill: "bg-gradient-to-r from-gold to-gold-light shadow-[0_0_12px_rgba(245,185,66,0.6)]",
      text: "text-gold",
      dot: "bg-gold",
    },
    red: {
      fill: "bg-gradient-to-r from-coral to-coral-light shadow-[0_0_12px_rgba(242,112,90,0.6)]",
      text: "text-coral",
      dot: "bg-coral",
    },
  };

  const current = colorStyles[activeColor];

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${current.dot}`} />
          <span className="text-white">{label}</span>
          {code && <span className="text-[10px] text-mint-accent/60">({code})</span>}
        </div>
        <div className="flex items-center gap-2">
          {instructor && (
            <span className="text-[10px] text-mint-accent/50 hidden sm:inline">
              {instructor}
            </span>
          )}
          <span className={`font-bold ${current.text}`}>{value}%</span>
        </div>
      </div>

      {/* Track */}
      <div className="w-full h-2 rounded-full bg-darkEmerald-950/80 border border-mint-400/20 overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full ${current.fill} transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(Math.max(value, 3), 100)}%` }}
        />
      </div>
    </div>
  );
}
