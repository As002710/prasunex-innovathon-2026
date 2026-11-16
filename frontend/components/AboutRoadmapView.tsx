"use client";

import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

export function AboutRoadmapView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-plum-900/80 border border-pink-primary/30 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-secondary">
          <Compass className="w-4 h-4 text-pink-primary" />
          <span>Product Architecture & Roadmap</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">About CAMPUS-NEXUS & Future Horizons</h2>
        <p className="text-xs text-pink-light/80 mt-0.5">
          Developed by <strong>Team Last-Mile Leaders</strong> · Tagline: "Find why a student is failing. Then fix it."
        </p>
      </div>

      {/* Integration Flow: Fits Next to ERPs */}
      <div className="p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-pink-primary" />
          <span>Non-Invasive Architecture: Fits Next to Moodle, Canvas & College ERPs</span>
        </h3>
        <p className="text-xs text-pink-light/70">
          Colleges already have ERPs recording attendance and marks. CAMPUS-NEXUS does not replace them; it sits beside them as the cognitive insight layer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-plum-950 border border-plum-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-light/70">
              <span className="w-5 h-5 rounded-full bg-plum-800 flex items-center justify-center text-white text-[10px]">1</span>
              <span>Already in Use</span>
            </div>
            <h4 className="text-sm font-bold text-white">Existing Campus ERP</h4>
            <p className="text-xs text-pink-light/70">
              Moodle, Canvas, Blackboard, or custom legacy college databases continue recording raw student submissions and attendance.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-plum-950 border border-pink-primary/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-secondary">
              <span className="w-5 h-5 rounded-full bg-amber-secondary/20 text-amber-secondary flex items-center justify-center text-[10px]">2</span>
              <span>Zero-Friction Ingestion</span>
            </div>
            <h4 className="text-sm font-bold text-white">We Connect via CSV/Excel Import</h4>
            <p className="text-xs text-pink-light/70">
              Automated column matching ingests marks-per-question and facility tickets without costly IT overhaul or invasive database hooks.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-plum-950 border border-mint-good/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mint-good">
              <span className="w-5 h-5 rounded-full bg-mint-good/20 text-mint-good flex items-center justify-center text-[10px]">3</span>
              <span>Explainable Action</span>
            </div>
            <h4 className="text-sm font-bold text-white">CAMPUS-NEXUS Insight Layer</h4>
            <p className="text-xs text-pink-light/70">
              Bayesian Knowledge Tracing discovers root cause prerequisites, gap-aware cut-offs eliminate boundary failures, and SLA timers resolve facilities.
            </p>
          </div>
        </div>
      </div>

      {/* Phased Roadmap */}
      <div className="p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-secondary" />
            <span>Phased Delivery Roadmap</span>
          </h3>
          <p className="text-xs text-pink-light/70">
            Phase 1 is fully functional in this MVP prototype. Future phases are disabled and marked "Coming later".
          </p>
        </div>

        <div className="space-y-4">
          {/* Phase 1: MVP (Working) */}
          <div className="p-4 rounded-xl bg-mint-good/10 border border-mint-good/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-mint-good" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-mint-good">
                  Phase 1: Core Insight Engine (WORKING MVP)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-mint-good/20 text-mint-good">
                LIVE IN DEMO
              </span>
            </div>
            <p className="text-xs text-white">
              • Module 1: Bayesian Knowledge Tracing & Concept Prerequisite DAG with explainable root-cause diagnosis.
              <br />
              • Module 2: Grading Sandbox with fixed vs. gap-aware cut-offs and point-biserial discrimination audit.
              <br />
              • Module 3: Ticket Desk with duplicate detection, priority equation, and live SLA countdowns.
            </p>
          </div>

          {/* Phase 2: Coming Later (Disabled) */}
          <div className="p-4 rounded-xl bg-plum-950/60 border border-plum-800 opacity-60 space-y-2 select-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-pink-light/60" />
                <span className="text-xs font-bold uppercase tracking-wider text-pink-light/60">
                  Phase 2: Campus Trust & Peer Ecosystem
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-plum-800 text-pink-light/50">
                COMING LATER · DISABLED
              </span>
            </div>
            <p className="text-xs text-pink-light/60">
              • Cryptographic ZK Blind-Signed Anonymous Grievance Reporting.
              <br />
              • HMAC Rotating QR Attendance Forecaster with anomaly detection.
              <br />
              • Hungarian Algorithm Peer Study Matcher pairing strong concept students with peers needing help.
            </p>
          </div>

          {/* Phase 3: Coming Later (Disabled) */}
          <div className="p-4 rounded-xl bg-plum-950/60 border border-plum-800 opacity-60 space-y-2 select-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-pink-light/60" />
                <span className="text-xs font-bold uppercase tracking-wider text-pink-light/60">
                  Phase 3: Autonomous Campus Operations
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-plum-800 text-pink-light/50">
                COMING LATER · DISABLED
              </span>
            </div>
            <p className="text-xs text-pink-light/60">
              • Opportunity Radar for fellowships and hackathons.
              <br />
              • On-device mobile photo-to-marks automatic rubric scanner.
              <br />
              • Constraint-Satisfaction Optimized Exam Scheduler.
              <br />
              • Predictive Lab Equipment Degradation & Spares Forecasting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
