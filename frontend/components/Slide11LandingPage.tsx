"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Play,
  Building2,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Bot,
  CheckCircle,
  Quote,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Navbar } from "./Navbar";
import { HeroDashboardMockup } from "./HeroDashboardMockup";
import { FeatureCard } from "./FeatureCard";
import { GlassCard } from "./GlassCard";
import { SectionHeader } from "./SectionHeader";
import { Logo } from "./Logo";
import { STATS_DATA, FEATURES_DATA, TESTIMONIALS } from "@/data/landing";

interface Slide11LandingPageProps {
  onLogin: () => void;
  onDemo: () => void;
  onDemoRole: (roleKey: string) => void;
  user?: any;
  onBackToConsole?: () => void;
  onLogout?: () => void;
}

export function Slide11LandingPage({
  onLogin,
  onDemo,
  onDemoRole,
  user,
  onBackToConsole,
  onLogout,
}: Slide11LandingPageProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const statIcons: Record<string, any> = {
    Building2,
    GraduationCap,
    TrendingUp,
    ShieldCheck,
  };

  return (
    <div className="min-h-screen bg-burgundy-950 text-white selection:bg-gold-500 selection:text-burgundy-950 relative overflow-x-hidden font-sans">
      {/* Background Architectural Canvas & Royal Gold Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-15 bg-center bg-cover mix-blend-screen"
          style={{ backgroundImage: `url('/images/campus-night.svg')` }}
        />
        {/* Soft Ambient Royal Gold & Wine Radial Highlights */}
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-gold-500/15 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] bg-burgundy-600/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-gold-400/10 rounded-full blur-[130px]" />

        {/* Faint decorative globe graphic in bottom-left */}
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 opacity-10 bg-contain bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url('/images/globe.svg')` }}
        />
      </div>

      {/* Sticky Top Navbar */}
      <Navbar
        user={user}
        onLogin={onLogin}
        onBackToConsole={onBackToConsole}
        onLogout={onLogout}
      />

      <main className="relative z-10">
        {/* =================================================================
            HERO SECTION (Slide 11 Headline & 3D Laptop Preview)
            ================================================================= */}
        <section className="pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Text & Call-To-Actions */}
            <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-burgundy-900/90 border border-gold-500/40 text-gold-300 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span>AI-POWERED SMART CAMPUS PLATFORM</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.1]">
                One Campus. <br />
                One Intelligence. <br />
                <span className="text-gradient-gold">Better Decisions.</span>
              </h1>

              {/* Subhead Tagline */}
              <p className="text-base sm:text-lg text-gold-100/80 font-normal leading-relaxed max-w-xl">
                Empowering universities with predictive academic analytics,
                zero-knowledge grievance safety, automated grading, and cognitive
                infrastructure.
              </p>

              {/* Mascot Robot Interaction Pill */}
              <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-burgundy-900/80 border border-gold-500/30 backdrop-blur-md">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gold-500/20 border border-gold-500/40 flex items-center justify-center">
                  <Image
                    src="/images/robot.svg"
                    alt="NEXUS Mascot"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">Meet NEXUS Bot</span>
                  <span className="text-gold-200/70 text-[11px]">
                    24/7 AI tutor & cognitive campus assistant
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
                {user ? (
                  <button
                    onClick={onBackToConsole}
                    className="btn-gold-primary px-7 py-3.5 text-sm font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                  >
                    <span>Return to Console ({user.college_code})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onDemoRole("student")}
                      className="btn-gold-primary px-7 py-3.5 text-sm font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                    >
                      <span>Explore Live Demo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href="#features"
                      className="px-6 py-3.5 rounded-full text-sm font-semibold text-gold-200/90 hover:text-white bg-burgundy-900/80 hover:bg-burgundy-850 border border-gold-500/35 transition-all flex items-center gap-2 backdrop-blur-md"
                    >
                      <Play className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                      <span>Watch 2-Min Tour</span>
                    </a>
                  </>
                )}
              </div>

              {/* Sub-signals */}
              <div className="flex items-center gap-4 text-xs text-gold-200/60 pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-400" /> 15 AI Modules
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-400" /> Zero Silos
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-400" /> 1-Click Role Access
                </span>
              </div>
            </div>

            {/* Right Column: 3D-Tilted Laptop Mockup */}
            <div className="lg:col-span-6 relative flex justify-center">
              <HeroDashboardMockup />
            </div>
          </div>
        </section>

        {/* =================================================================
            4-STATS STRIP (Slide 11 Statistics Row)
            ================================================================= */}
        <section className="py-10 border-y border-mint-400/15 bg-darkEmerald-900/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {STATS_DATA.map((stat, i) => {
                const IconComponent = statIcons[stat.icon] || Building2;
                return (
                  <div
                    key={i}
                    className="relative group p-4 sm:p-5 rounded-2xl bg-darkEmerald-950/60 border border-mint-400/20 hover:border-mint-accent/50 transition-all duration-300 text-center flex flex-col items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(94,234,212,0.15)]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-darkEmerald-900/80 border border-mint-400/30 flex items-center justify-center text-mint-400 mb-3 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5 text-mint-accent" />
                    </div>
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs sm:text-sm text-mint-accent/70 font-medium mt-1">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================
            3x2 FEATURE CARDS GRID (Slide 11 Innovations)
            ================================================================= */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionHeader
            badge="CUTTING-EDGE INTELLIGENCE"
            title={
              <>
                Engineered for Modern <br className="hidden sm:inline" />
                <span className="text-gradient-mint">Academic Excellence</span>
              </>
            }
            subtitle="Six purpose-built cognitive engines that solve root-cause learning gaps, eliminate exam bottlenecks, and safeguard student trust."
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES_DATA.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onClick={() => onDemoRole("student")}
              />
            ))}
          </div>
        </section>

        {/* =================================================================
            FOR EVERY ROLE SECTION (Slide 11 Role Portals & 1-Click Login)
            ================================================================= */}
        <section id="portals" className="py-20 border-t border-mint-400/15 bg-darkEmerald-900/25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              badge="ROLE-BASED PORTALS"
              title={
                <>
                  Built for Every Role <br className="hidden sm:inline" />
                  <span className="text-gradient-gold">on Campus</span>
                </>
              }
              subtitle="Select your persona to enter an interactive workspace seeded with real-time synthetic cohort data."
            />

            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Role 1: Student */}
              <GlassCard
                glow="mint"
                className="flex flex-col justify-between p-8"
                onClick={() => onDemoRole("student")}
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-mint-500/15 border border-mint-400/30 flex items-center justify-center mb-6">
                    <Image
                      src="/images/student.svg"
                      alt="Student"
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold text-mint-400 uppercase tracking-widest">
                    Student Portal
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1 mb-2">
                    Learn. Improve. Grow.
                  </h3>
                  <p className="text-sm text-mint-accent/80 leading-relaxed">
                    Personalized mastery paths, Grade Time Machine scenario
                    simulation, AI revision drills, and anonymous safety desks.
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDemoRole("student");
                  }}
                  className="mt-8 btn-mint-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <span>Explore as Student</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </GlassCard>

              {/* Role 2: Professor */}
              <GlassCard
                glow="gold"
                className="flex flex-col justify-between p-8"
                onClick={() => onDemoRole("professor_hod")}
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center mb-6">
                    <Image
                      src="/images/professor.svg"
                      alt="Professor"
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold text-gold uppercase tracking-widest">
                    Faculty Portal
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1 mb-2">
                    Analyse. Guide. Support.
                  </h3>
                  <p className="text-sm text-mint-accent/80 leading-relaxed">
                    Relative grading curve sandbox, question discrimination
                    item audits (IRT), attendance early warnings, and cohort mastery.
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDemoRole("professor_hod");
                  }}
                  className="mt-8 w-full py-3 rounded-full text-xs font-bold bg-gold text-darkEmerald-950 hover:bg-gold-light flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,185,66,0.3)]"
                >
                  <span>Explore as Faculty</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </GlassCard>

              {/* Role 3: Administrator */}
              <GlassCard
                glow="none"
                className="flex flex-col justify-between p-8"
                onClick={() => onDemoRole("chancellor_dean")}
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-mint-400/10 border border-mint-400/25 flex items-center justify-center mb-6">
                    <Image
                      src="/images/admin.svg"
                      alt="Administrator"
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold text-mint-accent/90 uppercase tracking-widest">
                    Admin & Operations
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1 mb-2">
                    Manage. Optimise. Ensure.
                  </h3>
                  <p className="text-sm text-mint-accent/80 leading-relaxed">
                    NBA/NAAC accreditation evidence mapping, automated SLA
                    service desk, facilities triage, and tenant billing.
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDemoRole("chancellor_dean");
                  }}
                  className="mt-8 w-full py-3 rounded-full text-xs font-bold bg-darkEmerald-800 text-white hover:bg-darkEmerald-700 border border-mint-400/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Explore as Administrator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* =================================================================
            AI INSIGHTS & TESTIMONIALS (Slide 11 Social Proof)
            ================================================================= */}
        <section id="insights" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <SectionHeader
            badge="CAMPUS PERSPECTIVES"
            title="Trusted Across University Ecosystems"
            subtitle="How students, faculty, and administrative leaders experience CAMPUS-NEXUS."
          />

          <div className="mt-12 relative rounded-3xl bg-darkEmerald-900/60 border border-mint-400/25 backdrop-blur-2xl p-8 sm:p-12 shadow-2xl">
            <Quote className="w-10 h-10 text-gold/40 mb-4" />
            <p className="text-lg sm:text-xl text-white font-medium italic leading-relaxed min-h-[90px]">
              &ldquo;{TESTIMONIALS[activeTestimonial].quote}&rdquo;
            </p>

            <div className="mt-8 pt-6 border-t border-mint-400/15 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-darkEmerald-800 border border-mint-400/30 flex items-center justify-center overflow-hidden">
                  <Image
                    src={TESTIMONIALS[activeTestimonial].avatar}
                    alt={TESTIMONIALS[activeTestimonial].author}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {TESTIMONIALS[activeTestimonial].author}
                  </h4>
                  <p className="text-xs text-mint-accent/70">
                    {TESTIMONIALS[activeTestimonial].title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-mint-400/15 text-mint-300 border border-mint-400/30 px-3 py-1 rounded-full font-semibold">
                  {TESTIMONIALS[activeTestimonial].badge}
                </span>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    aria-label="Previous Testimonial"
                    onClick={() =>
                      setActiveTestimonial((prev) =>
                        prev === 0 ? TESTIMONIALS.length - 1 : prev - 1
                      )
                    }
                    className="p-1.5 rounded-lg bg-darkEmerald-800/80 hover:bg-darkEmerald-700 text-mint-accent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    aria-label="Next Testimonial"
                    onClick={() =>
                      setActiveTestimonial((prev) =>
                        (prev + 1) % TESTIMONIALS.length
                      )
                    }
                    className="p-1.5 rounded-lg bg-darkEmerald-800/80 hover:bg-darkEmerald-700 text-mint-accent"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            PRESENTATION TEAM FOOTER (Slide 11 Footer)
            ================================================================= */}
        <footer id="about" className="border-t border-mint-400/15 bg-darkEmerald-950/90 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <Logo size="md" showTagline={true} />
              <p className="text-xs text-mint-accent/60 max-w-sm text-center md:text-left">
                The AI-powered smart campus operating system bridging students,
                academics, and operations.
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs text-mint-accent/80 font-medium">
              <button
                onClick={() => onDemoRole("student")}
                className="hover:text-white transition-colors"
              >
                Student Portal
              </button>
              <button
                onClick={() => onDemoRole("professor_hod")}
                className="hover:text-white transition-colors"
              >
                Professor Studio
              </button>
              <button
                onClick={() => onDemoRole("chancellor_dean")}
                className="hover:text-white transition-colors"
              >
                Admin Console
              </button>
              <button
                onClick={onLogin}
                className="hover:text-mint-400 text-mint-accent transition-colors font-bold"
              >
                Sign In
              </button>
            </div>

            <div className="text-center md:text-right text-xs text-mint-accent/60">
              <p className="font-semibold text-mint-accent">
                Team: Prasunex Innovators
              </p>
              <p>Prasunex Innovathon 2026 · Live Competition Prototype</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
