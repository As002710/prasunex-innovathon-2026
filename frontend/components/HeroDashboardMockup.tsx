import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

const metrics = [
  { label: "Performance", value: "78.5%" },
  { label: "Attendance", value: "86%" },
  { label: "Mastery", value: "72%" },
  { label: "Upcoming", value: "3", highlight: true },
];

export function HeroDashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div className="absolute -inset-3 rounded-3xl bg-emerald-200/40 blur-2xl" aria-hidden="true" />
      <div className="relative rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_18px_55px_rgba(15,92,76,0.12)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FACC15]" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="truncate text-[13px] font-bold text-[#123A32]">
              CAMPUS-NEXUS · Student Studio
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[13px] font-semibold text-amber-900">
              Live Demo
            </span>
            <Link
              href="/student/dashboard"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0F5C4C] hover:text-emerald-800"
            >
              Expand <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-100 bg-[#F4FAF7] p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F5C4C] shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#123A32]">Good Morning, Student!</p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
              Track. Improve. Excel — with CAMPUS-NEXUS.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`min-w-0 rounded-xl border p-3 ${
                metric.highlight
                  ? "border-amber-200 bg-amber-50"
                  : "border-emerald-100 bg-[#F4FAF7]"
              }`}
            >
              <p className={`text-[13px] font-semibold ${metric.highlight ? "text-amber-900" : "text-slate-600"}`}>
                {metric.label}
              </p>
              <p className={`mt-1 text-[17px] font-extrabold ${metric.highlight ? "text-amber-900" : "text-[#123A32]"}`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
