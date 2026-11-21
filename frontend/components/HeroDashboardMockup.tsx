"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowUpRight, TrendingUp, Users, Target, BookOpen, Bot } from "lucide-react";

export function HeroDashboardMockup() {
  return (
    <div className="relative w-full max-w-2xl mx-auto hero-mockup-frame">
      {/* Outer ambient glow halo */}
      <div className="absolute -inset-2 bg-[#34D399]/20 rounded-2xl blur-xl opacity-60 pointer-events-none" />

      {/* Main Glass Frame in Light Mint Panel */}
      <div className="relative rounded-xl bg-white border border-[#CDEBDD] p-4 sm:p-5 overflow-hidden shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
        {/* Mockup Window Header / Title Bar */}
        <div className="flex items-center justify-between border-b border-[#CDEBDD] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] inline-block" />
            <span className="text-[11px] font-bold tracking-wider text-[#0B2E22] ml-2">
              CAMPUS-NEXUS · Student Studio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#FEF9C3] text-[#713F12] border border-[#FACC15] px-2 py-0.5 rounded-full font-bold">
              ● Live Demo
            </span>
            <Link
              href="/student/dashboard"
              className="text-[10px] font-semibold text-[#047857] hover:text-[#065F46] flex items-center gap-1 transition-colors"
            >
              Expand <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Dashboard Welcome Header */}
        <div className="flex items-start justify-between gap-3 mb-4 bg-[#F0FAF5] p-3 rounded-xl border border-[#CDEBDD]">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B2E22]">
              <span>Good Morning, Student!</span>
              <Sparkles className="w-3.5 h-3.5 text-[#EAB308] animate-pulse" />
            </div>
            <p className="text-[11px] text-[#4B6B5E] mt-0.5">
              Track. Improve. Excel — with CAMPUS-NEXUS
            </p>
          </div>
          <span className="text-[10px] bg-white text-[#0B2E22] font-semibold px-2.5 py-1 rounded-full border border-[#CDEBDD] shadow-sm hidden sm:inline-block">
            ✨ You&apos;re on track!
          </span>
        </div>

        {/* 4 Mini KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          {/* Card 1 */}
          <div className="bg-[#F0FAF5] p-2.5 rounded-xl border border-[#CDEBDD]">
            <span className="text-[9px] font-bold text-[#4B6B5E] uppercase block">
              Performance
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-extrabold text-[#0B2E22]">78.5%</span>
              <span className="text-[9px] text-[#047857] font-bold">↑ +2.4%</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#F0FAF5] p-2.5 rounded-xl border border-[#CDEBDD]">
            <span className="text-[9px] font-bold text-[#4B6B5E] uppercase block">
              Attendance
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-extrabold text-[#0B2E22]">86%</span>
              <span className="text-[9px] text-[#047857] font-bold">↑ +1%</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#F0FAF5] p-2.5 rounded-xl border border-[#CDEBDD]">
            <span className="text-[9px] font-bold text-[#4B6B5E] uppercase block">
              Mastery
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-extrabold text-[#0B2E22]">72%</span>
              <span className="text-[9px] text-[#047857] font-bold">↑ +5%</span>
            </div>
          </div>

          {/* Card 4 - Highlight */}
          <div className="bg-[#FEF9C3] p-2.5 rounded-xl border border-[#FACC15]">
            <span className="text-[9px] font-bold text-[#713F12] uppercase block">
              Upcoming
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-extrabold text-[#713F12]">3</span>
              <span className="text-[9px] text-[#713F12] font-bold">Nov 10</span>
            </div>
          </div>
        </div>

        {/* Two Mini Panels: Mastery Donut (Left) + AI Copilot (Right) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Mastery Map Widget with 72% Donut Gauge */}
          <div className="bg-[#F0FAF5] p-3 rounded-xl border border-[#CDEBDD]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#0B2E22] flex items-center gap-1.5">
                <Target className="w-3 h-3 text-[#047857]" /> My Mastery Map
              </span>
              <span className="text-[9px] text-[#047857] font-semibold">View Details →</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Donut Gauge */}
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#CDEBDD]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#34D399]"
                    strokeDasharray="72, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs font-black text-[#0B2E22]">72%</span>
                  <span className="text-[7px] text-[#047857] uppercase font-bold">Mastery</span>
                </div>
              </div>

              {/* Progress bars list */}
              <div className="flex-1 space-y-1.5">
                <div>
                  <div className="flex justify-between text-[9px] text-[#4B6B5E]">
                    <span>DBMS</span>
                    <span className="text-[#047857] font-bold">92%</span>
                  </div>
                  <div className="w-full h-1 bg-[#CDEBDD] rounded-full overflow-hidden mt-0.5">
                    <div className="w-[92%] h-full bg-[#34D399] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-[#4B6B5E]">
                    <span>Operating Systems</span>
                    <span className="text-[#047857] font-bold">78%</span>
                  </div>
                  <div className="w-full h-1 bg-[#CDEBDD] rounded-full overflow-hidden mt-0.5">
                    <div className="w-[78%] h-full bg-[#34D399] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-[#4B6B5E]">
                    <span>Networks</span>
                    <span className="text-[#047857] font-bold">64%</span>
                  </div>
                  <div className="w-full h-1 bg-[#CDEBDD] rounded-full overflow-hidden mt-0.5">
                    <div className="w-[64%] h-full bg-[#34D399] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Copilot Widget with Robot Mascot */}
          <div className="bg-[#F0FAF5] p-3 rounded-xl border border-[#CDEBDD] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[#0B2E22] flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#047857]" /> NEXUS AI Copilot
              </span>
              <span className="text-[8px] bg-[#FEF9C3] text-[#713F12] px-1.5 py-0.5 rounded-full font-bold border border-[#FACC15]">
                Online
              </span>
            </div>

            <div className="flex items-center gap-2.5 my-1">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#CDEBDD] flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src="/images/robot.svg"
                  alt="AI Robot Mascot"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#CDEBDD] text-[10px] text-[#0B2E22] flex-1">
                <p className="font-semibold text-[#047857]">Hi Student!</p>
                <p className="text-[9px] text-[#4B6B5E] mt-0.5">
                  How can I help you today?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-1">
              <span className="text-[8px] bg-white text-[#4B6B5E] border border-[#CDEBDD] px-2 py-0.5 rounded-full truncate">
                Weak topics
              </span>
              <span className="text-[8px] bg-white text-[#4B6B5E] border border-[#CDEBDD] px-2 py-0.5 rounded-full truncate">
                Study plan
              </span>
              <span className="text-[8px] bg-white text-[#4B6B5E] border border-[#CDEBDD] px-2 py-0.5 rounded-full truncate">
                Grade check
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
