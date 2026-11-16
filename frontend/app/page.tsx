"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { HeroDashboardMockup } from "@/components/HeroDashboardMockup";
import { FeatureCard } from "@/components/FeatureCard";
import {
  STATS_DATA,
  FEATURES_DATA,
  ROLE_CARDS,
  TESTIMONIALS,
} from "@/data/landing";
import {
  Sparkles,
  ArrowRight,
  Play,
  Building2,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Globe,
  Quote,
  CheckCircle2,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const statIconMap: Record<string, any> = {
    Building2,
    GraduationCap,
    TrendingUp,
    ShieldCheck,
  };

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div className="min-h-screen bg-darkEmerald-950 text-white relative selection:bg-mint-400 selection:text-darkEmerald-950">
      {/* Background Ambience & Night Campus Image */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-20 bg-center bg-cover mix-blend-screen"
          style={{ backgroundImage: `url('/images/campus-night.svg')` }}
        />
        {/* Soft emerald radial glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-mint-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <Navbar />

      <main className="relative z-10">
        {/* =================================================================
            1. HERO SECTION
            ================================================================= */}
        <section className="pt-10 pb-16 sm:pt-16 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content (cols 6/7) */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-6">
              {/* Badge: ✦ Smarter Campus. Stronger Tomorrow. */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-darkEmerald-900/80 border border-mint-400/35 text-mint-300 shadow-[0_0_20px_rgba(94,234,212,0.2)] backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                <span>✦ Smarter Campus. Stronger Tomorrow.</span>
              </div>

              {/* Big Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                One Campus. <br />
                One Intelligence. <br />
                <span className="mint-gradient-text drop-shadow-[0_0_30px_rgba(74,222,154,0.35)]">
                  Better Decisions.
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-mint-accent/80 font-normal leading-relaxed max-w-xl">
                Transforming academic performance, campus operations and student
                wellbeing through connected AI.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/student/dashboard"
                  className="btn-mint-primary px-7 py-3.5 text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(0,245,160,0.4)]"
                >
                  <span>Explore Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setShowDemoModal(true)}
                  className="btn-glass-secondary px-6 py-3.5 text-sm flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 text-mint-400 fill-mint-400" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Feature Chips beneath buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-mint-accent/70 border-t border-mint-400/15">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mint-400" />
                  <span>DKT-Graph Prerequisite Tracing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mint-400" />
                  <span>IRT Item Discrimination Audit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mint-400" />
                  <span>ZK-Proof Whistleblowing</span>
                </div>
              </div>
            </div>

            {/* Right Hero Content: 3D Laptop Mockup */}
            <div className="lg:col-span-6 xl:col-span-6 relative">
              <HeroDashboardMockup />
            </div>
          </div>
        </section>

        {/* =================================================================
            2. STATS STRIP (GLASS BAR)
            ================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="rounded-3xl bg-darkEmerald-900/60 backdrop-blur-2xl border border-mint-400/25 p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-mint-400/15">
              {STATS_DATA.map((stat, idx) => {
                const IconComponent = statIconMap[stat.icon] || Building2;
                return (
                  <div
                    key={stat.label}
                    className={`flex items-center gap-4 ${idx > 0 ? "pt-4 md:pt-0 md:pl-6" : ""}`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-darkEmerald-800/80 border border-mint-400/30 flex items-center justify-center text-mint-400 flex-shrink-0 shadow-[0_0_15px_rgba(94,234,212,0.2)]">
                      <IconComponent className="w-6 h-6 text-mint-accent" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-mint-accent/80 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================
            3. PLATFORM SECTION: LEFT BLOCK + 3x2 GRID OF FEATURE CARDS
            ================================================================= */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Block (cols 4) */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-darkEmerald-900 border border-mint-400/30 text-mint-accent shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-mint-400" />
                <span>Powered by 15+ AI Modules</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                A Unified Platform for{" "}
                <span className="gold-gradient-text">Smarter Campuses</span>
              </h2>

              <p className="text-sm sm:text-base text-mint-accent/80 leading-relaxed font-normal">
                From academic analytics to campus safety, CAMPUS-NEXUS brings
                everything together in one intelligent ecosystem.
              </p>

              <div className="pt-2">
                <Link
                  href="/student/dashboard"
                  className="btn-mint-primary px-6 py-3 text-xs inline-flex items-center gap-2"
                >
                  <span>Explore Features</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Mini trust callout */}
              <div className="p-4 rounded-xl bg-darkEmerald-900/60 border border-mint-400/20 text-xs text-mint-accent/70 mt-6 space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-mint-400" />
                  Dual-Custodian Privacy Model
                </span>
                <p>
                  Zero-Knowledge Semaphore proofs ensure anonymity during
                  whistleblowing.
                </p>
              </div>
            </div>

            {/* Right: 3x2 Grid of Feature Cards (cols 8) */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {FEATURES_DATA.map((feature) => (
                  <Link key={feature.id} href="/student/dashboard">
                    <FeatureCard feature={feature} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            4. "FOR EVERY ROLE" SECTION
            ================================================================= */}
        <section id="portals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-mint-400 uppercase mb-2 block">
              Role-Specific Consoles
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Tailored Experiences for a{" "}
              <span className="mint-gradient-text">Connected Campus</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-mint-accent/70">
              Each portal is designed around the exact responsibilities of campus
              stakeholders with human-in-the-loop workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLE_CARDS.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="group relative rounded-3xl bg-darkEmerald-900/60 hover:bg-darkEmerald-850/80 border border-mint-400/25 hover:border-mint-accent p-6 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(94,234,212,0.25)] overflow-hidden"
              >
                {/* Top Inner Light Accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint-400/40 to-transparent" />

                <div>
                  {/* Role Avatar / Illustration Box */}
                  <div className="w-full h-48 rounded-2xl bg-darkEmerald-950/70 border border-mint-400/20 mb-5 overflow-hidden relative flex items-center justify-center p-4">
                    <Image
                      src={card.image}
                      alt={card.role}
                      width={180}
                      height={180}
                      className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(94,234,212,0.3)]"
                    />
                    <div className="absolute top-3 left-3 bg-darkEmerald-900/90 border border-mint-400/30 px-2.5 py-1 rounded-full text-[10px] font-bold text-mint-300">
                      {card.id === "student" ? "Personalized" : card.id === "professor" ? "Studio" : "Console"}
                    </div>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-widest text-mint-400/80 block mb-1">
                    {card.role} Portal
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-mint-300 transition-colors">
                    {card.tagline}
                  </h3>
                  <p className="text-xs text-mint-accent/70 leading-relaxed">
                    {card.id === "student" &&
                      "Mastery radar, predictive what-if grading, forgetting-aware drills, and confidential safety reports."}
                    {card.id === "professor" &&
                      "Simulate grade distribution curves, inspect question discrimination (IRT 2PL), and audit syllabi."}
                    {card.id === "admin" &&
                      "Manage campus operations, SBERT deduplicated tickets, and 14-day Weibull equipment failure risk."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-mint-400/15 flex items-center justify-between text-xs font-bold text-mint-400 group-hover:text-mint-accent">
                  <span>{card.actionText}</span>
                  <div className="w-7 h-7 rounded-full bg-darkEmerald-800 border border-mint-400/30 flex items-center justify-center group-hover:bg-mint-400 group-hover:text-darkEmerald-950 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =================================================================
            5. BOTTOM ROW: NEXUS AI INSIGHTS + TESTIMONIAL CAROUSEL
            ================================================================= */}
        <section id="insights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Card: NEXUS AI Insights (cols 6) */}
            <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-darkEmerald-900/80 via-darkEmerald-950/90 to-darkEmerald-900/80 border border-mint-400/25 p-8 relative overflow-hidden backdrop-blur-xl flex flex-col justify-between shadow-2xl">
              {/* Faint Globe Graphic in background */}
              <div className="absolute -bottom-16 -left-16 w-80 h-80 opacity-20 pointer-events-none">
                <Image
                  src="/images/globe.svg"
                  alt="Connected Network Globe"
                  width={320}
                  height={320}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-mint-400/15 border border-mint-400/30 text-mint-300">
                  <Globe className="w-3.5 h-3.5 text-mint-400" />
                  <span>NEXUS AI Insights</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  From Data to Decisions
                </h3>

                <p className="text-sm sm:text-base text-mint-accent/80 font-normal leading-relaxed max-w-md">
                  Get actionable insights, personalised recommendations and a
                  smarter campus experience with real-time cohort modeling.
                </p>

                <div className="pt-2">
                  <Link
                    href="/student/dashboard"
                    className="btn-mint-primary px-6 py-2.5 text-xs inline-flex items-center gap-2"
                  >
                    <span>Discover More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="relative z-10 mt-8 pt-4 border-t border-mint-400/15 flex items-center justify-between text-xs text-mint-accent/60">
                <span>Autonomous Campus Intelligence</span>
                <span className="font-semibold text-mint-400">v2.4 Online</span>
              </div>
            </div>

            {/* Right Card: Testimonial Carousel (cols 6) */}
            <div className="lg:col-span-6 rounded-3xl bg-darkEmerald-900/70 border border-mint-400/25 p-8 relative overflow-hidden backdrop-blur-xl flex flex-col justify-between shadow-2xl">
              {/* Faint modern college building image backdrop */}
              <div className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url('/images/campus-night.svg')` }} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-darkEmerald-800 border border-mint-400/30 flex items-center justify-center text-mint-400">
                    <Quote className="w-5 h-5 text-mint-accent" />
                  </div>
                  <span className="text-[11px] font-bold bg-mint-400/15 text-mint-300 px-3 py-1 rounded-full border border-mint-400/25">
                    {TESTIMONIALS[activeTestimonial].badge}
                  </span>
                </div>

                <blockquote className="text-lg sm:text-xl font-medium text-white italic leading-relaxed mb-6">
                  &ldquo;{TESTIMONIALS[activeTestimonial].quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-darkEmerald-800 border border-mint-400/40 overflow-hidden flex items-center justify-center">
                    <Image
                      src={TESTIMONIALS[activeTestimonial].avatar}
                      alt={TESTIMONIALS[activeTestimonial].author}
                      width={44}
                      height={44}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">
                      {TESTIMONIALS[activeTestimonial].author}
                    </div>
                    <div className="text-xs text-mint-accent/70">
                      {TESTIMONIALS[activeTestimonial].title}
                    </div>
                  </div>
                </div>
              </div>

              {/* Carousel Prev/Next Buttons */}
              <div className="relative z-10 flex items-center justify-between mt-8 pt-4 border-t border-mint-400/15">
                <div className="flex items-center gap-1.5">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        activeTestimonial === i ? "w-6 bg-mint-400" : "w-2 bg-mint-400/30"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevTestimonial}
                    aria-label="Previous quote"
                    className="p-2 rounded-full bg-darkEmerald-800/80 hover:bg-darkEmerald-800 border border-mint-400/20 text-mint-accent hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    aria-label="Next quote"
                    className="p-2 rounded-full bg-darkEmerald-800/80 hover:bg-darkEmerald-800 border border-mint-400/20 text-mint-accent hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================================
          6. FOOTER WITH TEAM CREDITS
          ================================================================= */}
      <footer className="border-t border-mint-400/20 bg-darkEmerald-950/90 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-mint-400/15">
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold text-white">
                CAMPUS<span className="text-mint-400">-NEXUS</span>
              </span>
              <span className="text-xs text-mint-accent/60">
                · One Campus. One Intelligence. Better Decisions.
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-mint-accent/80 font-medium">
              <Link href="/student/dashboard" className="hover:text-white transition-colors">
                Student Dashboard
              </Link>
              <a href="#features" className="hover:text-white transition-colors">
                15 AI Engines
              </a>
              <a href="#portals" className="hover:text-white transition-colors">
                Portals
              </a>
              <a href="#insights" className="hover:text-white transition-colors">
                Insights
              </a>
            </div>
          </div>

          {/* Team Members strip from Presentation Slide 1 & 2 */}
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-mint-400 font-bold block">
              Prasunex Innovathon 2026 · Idea Submission
            </span>
            <p className="text-sm font-semibold text-white">
              Presented by Himadri Mondal &nbsp;·&nbsp; Nandini Singh &nbsp;·&nbsp; Vanshika Yadav &nbsp;·&nbsp; Anvesha Saraswat &nbsp;·&nbsp; Niranjana A R
            </p>
            <p className="text-xs text-mint-accent/60">
              Smarter Campus. Brighter Future. © 2026 CAMPUS-NEXUS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Watch Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-darkEmerald-900 border border-mint-400/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-mint-accent hover:text-white bg-darkEmerald-950/80"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-mint-400/20 text-mint-400 flex items-center justify-center">
                <Play className="w-5 h-5 fill-mint-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">CAMPUS-NEXUS Live Demo</h3>
                <p className="text-xs text-mint-accent/70">Interactive Prototype Walkthrough</p>
              </div>
            </div>

            <p className="text-sm text-mint-100 leading-relaxed">
              Experience the dual-portal AI layer directly! You can launch the Student Dashboard to test mastery tracking, interactive grade prediction, and the AI Copilot.
            </p>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 text-xs font-semibold text-mint-accent/80 hover:text-white"
              >
                Close
              </button>
              <Link
                href="/student/dashboard"
                onClick={() => setShowDemoModal(false)}
                className="btn-mint-primary px-5 py-2 text-xs inline-flex items-center gap-1.5"
              >
                <span>Launch Student Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
