"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowUpRight, TrendingUp, Users, Target, BookOpen, Bot } from "lucide-react";

export function HeroDashboardMockup() {
  return (
    <div className="relative w-full max-w-2xl mx-auto hero-mockup-frame">
      {/* Outer ambient glow halo in royal gold and wine */}
      <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/20 via-burgundy-600/30 to-gold-400/20 rounded-3xl blur-2xl opacity-75 pointer-events-none" />

      {/* Main Glass Frame in Burgundy & Gold */}
      <div className="relative rounded-2xl bg-burgundy-950/95 border border-gold-500/40 backdrop-blur-2xl p-4 sm:p-5 overflow-hidden shadow-2xl">
        {/* Mockup Window Header / Title Bar */}
        <div className="flex items-center justify-between border-b border-gold-500/25 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-gold-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-[11px] font-bold tracking-wider text-gold-200/90 ml-2">
              CAMPUS-NEXUS · Student Studio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-gold-500/20 text-gold-300 border border-gold-400/40 px-2 py-0.5 rounded-full font-bold">
              ● Live Demo
            </span>
            <Link
              href="/student/dashboard"
              className="text-[10px] font-semibold text-gold-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              Expand <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Dashboard Welcome Header */}
        <div className="flex items-start justify-between gap-3 mb-4 bg-burgundy-900/80 p-3 rounded-xl border border-gold-500/25">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <span>Good Morning, Student!</span>
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-gold-100/70 mt-0.5">
              Track. Improve. Excel — with CAMPUS-NEXUS
            </p>
          </div>
          <span className="text-[10px] bg-burgundy-800 text-gold-300 font-semibold px-2.5 py-1 rounded-full border border-gold-500/35 shadow-sm hidden sm:inline-block">
            ✨ You&apos;re on track!
          </span>
        </div>

        {/* 4 Mini KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          {/* Card 1 */}
          <div className="bg-burgundy-900/90 p-2.5 rounded-xl border border-gold-500/30">
            <span className="text-[9px] font-bold text-gold-300 uppercase block">
              Performance
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-extrabold text-white">78.5%</span>
              <span className="text-[9px] text-gold-400 font-bold">↑ +2.4%</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-burgundy-900/90 p-2.5 rounded-xl border border-gold-500/30">
            <span className="text-[9px] font-bold text-gold-300 uppercase block">
              Attendance
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-extrabold text-white">86%</span>
              <span className="text-[9px] text-gold-400 font-bold">↑ +1%</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-burgundy-900/90 p-2.5 rounded-xl border border-gold-500/30">
            <span className="text-[9px] font-bold text-gold-300 uppercase block">
              Mastery
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-extrabold text-white">72%</span>
              <span className="text-[9px] text-gold-400 font-bold">↑ +5%</span>
            </div>
          </div>

          {/* Card 4 - Gold */}
          <div className="bg-gradient-to-br from-gold-500/25 via-burgundy-900/95 to-burgundy-950 p-2.5 rounded-xl border border-gold-400/50 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
            <span className="text-[9px] font-bold text-gold-300 uppercase block">
              Upcoming
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-extrabold text-gold-200">3</span>
              <span className="text-[9px] text-gold-400 font-bold">Nov 10</span>
            </div>
          </div>
        </div>

        {/* Two Mini Panels: Mastery Donut (Left) + AI Copilot (Right) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Mastery Map Widget with 72% Donut Gauge */}
          <div className="bg-burgundy-900/80 p-3 rounded-xl border border-gold-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <Target className="w-3 h-3 text-gold-400" /> My Mastery Map
              </span>
              <span className="text-[9px] text-gold-400 font-semibold">View Details →</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Donut Gauge */}
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-burgundy-950"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-gold-400"
                    strokeDasharray="72, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs font-black text-white">72%</span>
                  <span className="text-[7px] text-gold-300/80 uppercase">Mastery</span>
                </div>
              </div>

              {/* Progress bars list */}
              <div className="flex-1 space-y-1.5">
                <div>
                  <div className="flex justify-between text-[9px] text-gold-100/90">
                    <span>DBMS</span>
                    <span className="text-gold-400 font-bold">92%</span>
                  </div>
                  <div className="w-full h-1 bg-burgundy-950 rounded-full overflow-hidden mt-0.5">
                    <div className="w-[92%] h-full bg-gold-400 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-gold-100/90">
                    <span>Operating Systems</span>
                    <span className="text-gold-400 font-bold">78%</span>
                  </div>
                  <div className="w-full h-1 bg-burgundy-950 rounded-full overflow-hidden mt-0.5">
                    <div className="w-[78%] h-full bg-gold-400 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-gold-100/90">
                    <span>Networks</span>
                    <span className="text-gold-300 font-bold">64%</span>
                  </div>
                  <div className="w-full h-1 bg-burgundy-950 rounded-full overflow-hidden mt-0.5">
                    <div className="w-[64%] h-full bg-gold-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Copilot Widget with Robot Mascot */}
          <div className="bg-burgundy-900/80 p-3 rounded-xl border border-gold-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-gold-400" /> NEXUS AI Copilot
              </span>
              <span className="text-[8px] bg-gold-500/20 text-gold-300 px-1.5 py-0.5 rounded-full font-bold">
                Online
              </span>
            </div>

            <div className="flex items-center gap-2.5 my-1">
              <div className="w-10 h-10 rounded-lg bg-burgundy-800/90 border border-gold-500/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src="/images/robot.svg"
                  alt="AI Robot Mascot"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="bg-burgundy-950/80 p-2 rounded-lg border border-gold-500/25 text-[10px] text-gold-100 flex-1">
                <p className="font-semibold text-gold-300">Hi Student!</p>
                <p className="text-[9px] text-gold-100/70 mt-0.5">
                  How can I help you today?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-1">
              <span className="text-[8px] bg-burgundy-800/90 hover:bg-burgundy-800 text-gold-200/90 border border-gold-500/30 px-2 py-0.5 rounded-full truncate">
                Weak topics
              </span>
              <span className="text-[8px] bg-burgundy-800/90 hover:bg-burgundy-800 text-gold-200/90 border border-gold-500/30 px-2 py-0.5 rounded-full truncate">
                Study plan
              </span>
              <span className="text-[8px] bg-burgundy-800/90 hover:bg-burgundy-800 text-gold-200/90 border border-gold-500/30 px-2 py-0.5 rounded-full truncate">
                Grade check
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
