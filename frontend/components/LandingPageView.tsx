"use client";

import { Role } from "@/lib/types";
import { Logo } from "@/components/Logo";
import {
  Brain,
  BarChart3,
  Wrench,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Cpu,
  Layers,
  Sparkles,
  UserCheck,
} from "lucide-react";

interface LandingPageViewProps {
  onSelectRole: (role: Role) => void;
  onOpenAbout: () => void;
}

export function LandingPageView({ onSelectRole, onOpenAbout }: LandingPageViewProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between space-y-12 pb-8">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-plum-950/85 border-b border-pink-primary/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" showTagline={true} />

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAbout}
              className="text-xs font-semibold text-pink-light/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-plum-900 transition-all"
            >
              About & Roadmap
            </button>
            <div className="h-4 w-px bg-plum-800" />
            <button
              onClick={() => onSelectRole("student")}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-pink-primary/20 text-pink-primary border border-pink-primary/40 hover:bg-pink-primary/30 transition-all"
            >
              One-Click Demo →
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-primary/15 border border-pink-primary/30 text-pink-primary text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-secondary" />
          <span>Team Last-Mile Leaders · Prasunex Innovathon 2026</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Find why a student is failing. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-primary via-pink-glow to-amber-secondary">
            Then fix it.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-pink-light/80 font-normal leading-relaxed">
          The explainable cognitive add-on layer for colleges that connects raw test questions, grade curves, and facility bottlenecks into decisive interventions.
        </p>

        {/* 1-Click Role Login Selector Bar */}
        <div className="pt-4 max-w-xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-amber-secondary">
            Select Demo Persona (Instant 1-Click Access)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onSelectRole("student")}
              className="p-3.5 rounded-xl bg-plum-900/90 border border-pink-primary/40 hover:border-pink-primary hover:bg-plum-850 hover:shadow-[0_0_20px_rgba(242,139,168,0.3)] transition-all group text-left"
            >
              <div className="text-[10px] uppercase font-bold text-pink-primary">Login As</div>
              <div className="text-sm font-extrabold text-white group-hover:text-pink-light">Student</div>
              <div className="text-[10px] text-pink-light/60 mt-0.5">Mastery Map & BKT</div>
            </button>

            <button
              onClick={() => onSelectRole("professor")}
              className="p-3.5 rounded-xl bg-plum-900/90 border border-amber-secondary/40 hover:border-amber-secondary hover:bg-plum-850 hover:shadow-[0_0_20px_rgba(242,196,107,0.3)] transition-all group text-left"
            >
              <div className="text-[10px] uppercase font-bold text-amber-secondary">Login As</div>
              <div className="text-sm font-extrabold text-white group-hover:text-amber-light">Professor</div>
              <div className="text-[10px] text-pink-light/60 mt-0.5">Grading Sandbox & IRT</div>
            </button>

            <button
              onClick={() => onSelectRole("admin")}
              className="p-3.5 rounded-xl bg-plum-900/90 border border-sky-info/40 hover:border-sky-info hover:bg-plum-850 hover:shadow-[0_0_20px_rgba(124,200,238,0.3)] transition-all group text-left"
            >
              <div className="text-[10px] uppercase font-bold text-sky-info">Login As</div>
              <div className="text-sm font-extrabold text-white group-hover:text-sky-light">Admin / Warden</div>
              <div className="text-[10px] text-pink-light/60 mt-0.5">Ticket Desk & SLA Radar</div>
            </button>
          </div>
        </div>
      </section>

      {/* Integration Flow: Fits Next to ERPs */}
      <section className="max-w-5xl mx-auto px-6 space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-wider text-amber-secondary">
            Frictionless Integration
          </span>
          <h2 className="text-xl font-bold text-white">
            Fits Next to Moodle, Canvas and College ERPs
          </h2>
        </div>

        <div className="p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-plum-950/80 border border-plum-800 space-y-2">
            <div className="text-xs font-black text-pink-light/60 uppercase">Step 1</div>
            <div className="text-sm font-bold text-white">Already In Use</div>
            <p className="text-xs text-pink-light/70 leading-relaxed">
              Your college already records marks and attendance in Moodle, Canvas, or legacy ERP databases.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-plum-950/80 border border-amber-secondary/40 space-y-2">
            <div className="text-xs font-black text-amber-secondary uppercase">Step 2</div>
            <div className="text-sm font-bold text-white">Connect via CSV / Excel</div>
            <p className="text-xs text-pink-light/70 leading-relaxed">
              Upload marks per question with automated column matching and instant validation without database rewrites.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-plum-950/80 border border-mint-good/40 space-y-2">
            <div className="text-xs font-black text-mint-good uppercase">Step 3</div>
            <div className="text-sm font-bold text-white">Insight & Action Layer</div>
            <p className="text-xs text-pink-light/70 leading-relaxed">
              CAMPUS-NEXUS computes prerequisite root causes, gap-aware grade cut-offs, and automated facility SLA escalations.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Core MVP Modules Showcase */}
      <section className="max-w-5xl mx-auto px-6 space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-wider text-pink-primary">
            The 3 Live MVP Modules
          </span>
          <h2 className="text-xl font-bold text-white">
            End-to-End Functionality on Seeded Cohort Data
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-pink-primary/20 text-pink-primary flex items-center justify-center border border-pink-primary/30">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">1. Mastery Map & DAG</h3>
              <p className="text-xs text-pink-light/70 leading-relaxed">
                Prerequisite graph across OS Architecture, Process Mgmt, and Semaphores. Bayesian Knowledge Tracing diagnoses root cause prerequisite confusion.
              </p>
            </div>
            <button
              onClick={() => onSelectRole("student")}
              className="text-xs font-bold text-pink-primary hover:text-pink-light flex items-center gap-1 pt-2"
            >
              <span>Explore Mastery Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-plum-900/70 border border-amber-secondary/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-secondary/20 text-amber-secondary flex items-center justify-center border border-amber-secondary/30">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">2. Grading Sandbox</h3>
              <p className="text-xs text-pink-light/70 leading-relaxed">
                100-student score distribution. One-click toggle between Fixed Z-score (15 stranded) and Gap-Aware cut-offs (3 stranded), plus point-biserial discrimination audit.
              </p>
            </div>
            <button
              onClick={() => onSelectRole("professor")}
              className="text-xs font-bold text-amber-secondary hover:text-amber-light flex items-center gap-1 pt-2"
            >
              <span>Explore Grading Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-plum-900/70 border border-sky-info/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-info/20 text-sky-info flex items-center justify-center border border-sky-info/30">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">3. Smart Ticket Desk</h3>
              <p className="text-xs text-pink-light/70 leading-relaxed">
                Semantic deduplication merges repeat complaints. Priority equation elevates overdue laboratory faults over loose chairs, with automated HoD and Dean SLA clocks.
              </p>
            </div>
            <button
              onClick={() => onSelectRole("admin")}
              className="text-xs font-bold text-sky-info hover:text-sky-light flex items-center gap-1 pt-2"
            >
              <span>Explore Ticket Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Mandatory Footer */}
      <footer className="w-full text-center py-6 border-t border-pink-primary/10 text-xs text-pink-light/60">
        Demo uses illustrative synthetic data.
      </footer>
    </div>
  );
}
