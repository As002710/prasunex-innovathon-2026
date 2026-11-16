"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  GraduationCap,
  Compass,
  LineChart as LineChartIcon,
  CalendarDays,
  Brain,
  Bot,
  ShieldAlert,
  Sparkles,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Send,
  Calendar,
  Shield,
  BookOpen,
  Menu,
  X,
  User,
  Sliders,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Logo } from "@/components/Logo";
import { KpiCard } from "@/components/KpiCard";
import { ProgressBar } from "@/components/ProgressBar";
import {
  KPI_CARDS,
  MASTERY_COURSES,
  AI_RECOMMENDATION,
  UPCOMING_ACTIVITIES,
  QUICK_ACCESS_ITEMS,
  COPILOT_PRESETS,
  CopilotMessage,
} from "@/data/student";

interface EnhancedStudentDashboardViewProps {
  user?: any;
  onView?: (view: string) => void;
  onNotify?: (text: string, kind?: any) => void;
  onBackToLanding?: () => void;
  onLogout?: () => void;
  embedded?: boolean;
}

export function EnhancedStudentDashboardView({
  user,
  onView,
  onNotify,
  onBackToLanding,
  onLogout,
  embedded = false,
}: EnhancedStudentDashboardViewProps) {
  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("overview");

  // ⌘K Search Focus
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Grade Predictor Interactive Effort Slider
  const [effortLevel, setEffortLevel] = useState(10); // +10% effort by default
  const getPredictedGradeInfo = (effort: number) => {
    const base = 78;
    const calculatedScore = Math.min(100, Math.round(base + (effort / 20) * 10));
    let grade = "B+";
    if (calculatedScore >= 88) grade = "A";
    else if (calculatedScore >= 83) grade = "A-";
    else if (calculatedScore >= 78) grade = "B+";
    else grade = "B";

    return {
      score: calculatedScore,
      gradeTransition: `B+ → ${grade} (${calculatedScore}%)`,
      points: [
        { name: "Current", score: 78 },
        { name: "+10% Effort", score: 83 },
        { name: "+20% Effort", score: calculatedScore },
      ],
    };
  };

  const currentPrediction = getPredictedGradeInfo(effortLevel);

  // Interactive Checklist for AI Study Recommendation
  const [recommendationActions, setRecommendationActions] = useState(
    AI_RECOMMENDATION.actions
  );
  const [studyPlanGenerated, setStudyPlanGenerated] = useState(false);

  const toggleAction = (id: string) => {
    setRecommendationActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  // NEXUS AI Copilot Chat State
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "msg-0",
      sender: "bot",
      text: "Hi Student! How can I help you today? Ask me anything about your courses, weak topics, or study plans.",
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: promptText,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    const matched = COPILOT_PRESETS.find(
      (p) => p.label.toLowerCase() === promptText.toLowerCase()
    );

    const botReply =
      matched?.reply ||
      `I've analyzed your question regarding "${promptText}". In your recent quiz on Computer Networks, your latency and distance-vector responses need a quick 10-minute brushup. Would you like me to schedule a targeted drill?`;

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          time: "Just now",
        },
      ]);
    }, 700);
  };

  // Sidebar Menu Items for Standalone View
  const sidebarNavItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "learning", label: "Mastery Map", icon: Compass },
    { id: "planner", label: "AI Study Planner", icon: CalendarDays },
    { id: "drills", label: "Micro Drills", icon: Brain },
    { id: "attendance", label: "My Attendance", icon: CalendarDays },
    { id: "facilities", label: "Facilities Desk", icon: ShieldAlert },
    { id: "privacy", label: "Anonymous Reporting", icon: Shield },
    { id: "community", label: "Peer Study Matcher", icon: Sparkles },
    { id: "opportunities", label: "Opportunity Radar", icon: BookOpen },
  ];

  // Donut Chart Data (72% Overall Mastery)
  const donutData = [
    { name: "Mastered", value: 72, fill: "#4ADE9A" },
    { name: "Remaining", value: 28, fill: "#062A20" },
  ];

  const handleNavClick = (id: string) => {
    setActiveMenu(id);
    if (onView && id !== "overview") {
      onView(id);
    }
  };

  return (
    <div className={`min-h-screen ${embedded ? "bg-transparent" : "bg-darkEmerald-950"} text-white flex flex-col lg:flex-row relative selection:bg-mint-400 selection:text-darkEmerald-950 font-sans`}>
      {/* Background Architectural Canvas & Glow (only if standalone) */}
      {!embedded && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute inset-0 opacity-15 bg-center bg-cover mix-blend-screen"
            style={{ backgroundImage: `url('/images/campus-night.svg')` }}
          />
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-mint-500/10 rounded-full blur-[140px]" />
        </div>
      )}

      {/* Standalone Sidebar (if not embedded) */}
      {!embedded && (
        <aside className="hidden lg:flex w-64 xl:w-72 flex-col justify-between border-r border-mint-400/20 bg-darkEmerald-950/95 backdrop-blur-2xl p-5 z-30 sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-6">
            <div className="pb-4 border-b border-mint-400/15">
              <Logo size="md" showTagline={true} />
            </div>

            <nav className="space-y-1">
              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? "bg-mint-400 text-darkEmerald-950 shadow-[0_0_20px_rgba(74,222,154,0.45)] font-bold"
                        : "text-mint-accent/80 hover:text-white hover:bg-darkEmerald-900/80"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-darkEmerald-950" : "text-mint-400/80"
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-6 rounded-2xl bg-darkEmerald-900/80 border border-mint-400/25 p-4 relative overflow-hidden group shadow-lg">
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url('/images/campus-night.svg')` }}
            />
            <div className="relative z-10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-mint-400/20 border border-mint-400/30 flex items-center justify-center text-mint-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white leading-tight">
                Your Academic Growth, <br />
                <span className="text-mint-accent">Our Priority</span>
              </h4>
              <p className="text-[10px] text-mint-accent/70 leading-normal">
                Get personalized AI guidance for every course and exam.
              </p>
              {onBackToLanding ? (
                <button
                  onClick={onBackToLanding}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-mint-400 hover:text-mint-accent transition-colors pt-1"
                >
                  <span>Public Showcase</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-mint-400 hover:text-mint-accent transition-colors pt-1"
                >
                  <span>Explore Insights</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Standalone Mobile Header */}
      {!embedded && (
        <div className="lg:hidden sticky top-0 z-40 bg-darkEmerald-950/95 border-b border-mint-400/20 p-4 flex items-center justify-between backdrop-blur-xl">
          <Logo size="sm" showTagline={false} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-darkEmerald-900 border border-mint-400/20 text-mint-400"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {!embedded && (
          <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-mint-400/15 bg-darkEmerald-950/70 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-30">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="w-3.5 h-3.5 text-mint-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for anything... (marks, courses, queries)"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-darkEmerald-900/70 border border-mint-400/25 rounded-full pl-9 pr-14 py-1.5 text-xs text-white placeholder:text-mint-accent/40 focus:outline-none focus:border-mint-accent focus:ring-1 focus:ring-mint-accent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-mint-accent/60 bg-darkEmerald-800/80 px-1.5 py-0.5 rounded border border-mint-400/20">
                ⌘K
              </span>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              {onBackToLanding ? (
                <button
                  onClick={onBackToLanding}
                  className="text-xs text-mint-accent/70 hover:text-white transition-colors hidden md:inline-flex items-center gap-1"
                >
                  <span>Public Showcase</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              ) : (
                <Link
                  href="/"
                  className="text-xs text-mint-accent/70 hover:text-white transition-colors hidden md:inline-flex items-center gap-1"
                >
                  <span>Public Showcase</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              )}

              <button
                aria-label="3 new notifications"
                onClick={() => onNotify?.("You have 3 notifications: Database Systems quiz graded, OS assignment due tomorrow, and a new study partner match!", "info")}
                className="relative p-2 rounded-full bg-darkEmerald-900/80 border border-mint-400/25 text-mint-accent hover:text-white transition-all shadow-sm"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-darkEmerald-950 shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                  3
                </span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-mint-400/20">
                <div className="w-8 h-8 rounded-full bg-mint-400 text-darkEmerald-950 font-bold flex items-center justify-center text-xs shadow-[0_0_10px_rgba(74,222,154,0.5)]">
                  {user ? user.full_name?.slice(0, 2).toUpperCase() : "ST"}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    {user ? user.full_name.split(" ")[0] : "Student"} <ChevronDown className="w-3 h-3 text-mint-400/70" />
                  </span>
                  <span className="text-[10px] text-mint-accent/60 -mt-0.5">
                    {user ? `${user.department || "Computer Science"} (Sem ${user.semester || 5})` : "Computer Science (Sem 5)"}
                  </span>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 text-xs text-mint-accent/70 hover:text-white rounded-lg border border-mint-400/20 hover:border-mint-400/50 transition-colors ml-1"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </header>
        )}

        {/* Dashboard Body Workspace */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Hero Banner */}
          <div className="relative rounded-3xl bg-darkEmerald-900/80 border border-mint-400/30 p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div
              className="absolute inset-0 opacity-25 bg-cover bg-center mix-blend-screen pointer-events-none"
              style={{ backgroundImage: `url('/images/campus-night.svg')` }}
            />
            <div className="absolute right-0 top-0 w-80 h-80 bg-mint-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                  <span>Good Morning, {user ? user.full_name.split(" ")[0] : "Student"}!</span>
                  <Sparkles className="w-5 h-5 text-gold animate-pulse drop-shadow-[0_0_10px_rgba(245,185,66,0.8)]" />
                </h1>
                <p className="text-sm text-mint-accent/80 font-medium">
                  Track. Improve. Excel — with{" "}
                  <span className="text-mint-400 font-bold">CAMPUS-NEXUS</span>
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-darkEmerald-950/80 border border-mint-400/40 text-xs font-semibold text-mint-300 shadow-[0_0_15px_rgba(94,234,212,0.2)] backdrop-blur-md self-start md:self-auto">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>You&apos;re on track! Keep going towards your goals.</span>
              </div>
            </div>
          </div>

          {/* 4 KPI Cards with Sparklines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {KPI_CARDS.map((kpi) => (
              <KpiCard
                key={kpi.id}
                item={kpi}
                onClick={() => {
                  if (kpi.id === "kpi-attendance" && onView) onView("attendance");
                  else if (kpi.id === "kpi-mastery" && onView) onView("learning");
                }}
              />
            ))}
          </div>

          {/* Main 2-Column Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Center / Main Feed (cols 8) */}
            <div className="xl:col-span-8 space-y-6">
              {/* Row 1: Mastery Map Card + AI Study Recommendation Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. My Mastery Map */}
                <div className="rounded-2xl bg-darkEmerald-900/70 backdrop-blur-xl border border-mint-400/20 p-5 shadow-glass space-y-4">
                  <div className="flex items-center justify-between border-b border-mint-400/15 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-mint-400/15 border border-mint-400/30 flex items-center justify-center text-mint-400">
                        <Compass className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-white">My Mastery Map</h3>
                    </div>
                    {onView && (
                      <button
                        onClick={() => onView("learning")}
                        className="text-xs font-semibold text-mint-400 hover:text-mint-accent cursor-pointer flex items-center gap-1"
                      >
                        View Details <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={donutData}
                            dataKey="value"
                            innerRadius={36}
                            outerRadius={48}
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                          >
                            {donutData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-black text-white">72%</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-mint-400">
                          Mastered
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          Strong in DBMS & OS
                        </span>
                      </div>
                      <p className="text-[11px] text-mint-accent/70 leading-relaxed">
                        Identified 2 prerequisite concept gaps in Computer Networks &
                        Dynamic Programming.
                      </p>
                      {onView && (
                        <button
                          onClick={() => onView("learning")}
                          className="text-[11px] font-semibold text-mint-400 hover:text-white flex items-center gap-1 pt-1"
                        >
                          Open DKT Concept Graph <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-mint-400/10">
                    {MASTERY_COURSES.map((course) => (
                      <ProgressBar
                        key={course.code}
                        label={course.name}
                        value={course.percentage}
                        color={course.color}
                        code={course.code}
                        instructor={course.instructor}
                      />
                    ))}
                  </div>
                </div>

                {/* 2. AI Study Recommendation with Mascot Robot */}
                <div className="rounded-2xl bg-darkEmerald-900/70 backdrop-blur-xl border border-mint-400/20 p-5 shadow-glass space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3 border-b border-mint-400/15 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="relative w-9 h-9 rounded-xl bg-mint-400/20 border border-mint-400/40 p-1 flex items-center justify-center overflow-hidden">
                          <Image
                            src="/images/robot.svg"
                            alt="NEXUS AI Bot Mascot"
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-white">
                              AI Recommendation
                            </h3>
                            <span className="text-[9px] bg-gold/20 text-gold-light border border-gold/40 px-1.5 py-0.2 rounded-full font-bold">
                              High Priority
                            </span>
                          </div>
                          <span className="text-[10px] text-mint-accent/70">
                            Based on your recent quiz in {AI_RECOMMENDATION.topic}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-darkEmerald-950/80 border border-mint-400/20 p-3 space-y-1.5">
                      <span className="text-xs font-bold text-mint-300">
                        {AI_RECOMMENDATION.topic}
                      </span>
                      <p className="text-[11px] text-mint-accent/80 leading-relaxed">
                        {AI_RECOMMENDATION.rationale}
                      </p>
                    </div>

                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-mint-accent/70 block">
                        Recommended Next Steps:
                      </span>
                      {recommendationActions.map((action) => (
                        <div
                          key={action.id}
                          onClick={() => toggleAction(action.id)}
                          className="flex items-center gap-2.5 p-2 rounded-lg bg-darkEmerald-900/90 border border-mint-400/15 hover:border-mint-400/40 cursor-pointer transition-colors"
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                              action.completed
                                ? "bg-mint-400 border-mint-400 text-darkEmerald-950"
                                : "border-mint-400/40 bg-darkEmerald-950"
                            }`}
                          >
                            {action.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span
                            className={`text-xs ${
                              action.completed
                                ? "line-through text-mint-accent/50"
                                : "text-white font-medium"
                            }`}
                          >
                            {action.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setStudyPlanGenerated(true);
                        onNotify?.("AI 7-day personalized study schedule synced with calendar!", "success");
                        if (onView) onView("planner");
                      }}
                      className="btn-mint-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(74,222,154,0.3)]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {studyPlanGenerated ? "✓ Plan Generated" : "Generate Study Plan"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Grade Time Machine (Interactive Effort Slider + Chart) */}
              <div className="rounded-2xl bg-darkEmerald-900/70 backdrop-blur-xl border border-mint-400/20 p-5 sm:p-6 shadow-glass space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-mint-400/15 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          Grade Time Machine
                        </h3>
                        <span className="text-[10px] bg-mint-400/15 text-mint-300 border border-mint-400/30 px-2 py-0.5 rounded-full font-bold">
                          Predictive Model
                        </span>
                      </div>
                      <p className="text-xs text-mint-accent/70">
                        Simulate the impact of extra targeted study hours on your final grade.
                      </p>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-gold/15 border border-gold/40 text-gold-light text-xs font-bold self-start sm:self-auto shadow-sm">
                    {currentPrediction.gradeTransition}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span className="text-mint-accent/80">
                          Extra Weekly Study Effort:
                        </span>
                        <span className="text-mint-400 text-sm font-extrabold">
                          +{effortLevel}% ({effortLevel / 5} hrs/wk)
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="5"
                        value={effortLevel}
                        onChange={(e) => setEffortLevel(Number(e.target.value))}
                        className="range-control w-full cursor-pointer"
                      />

                      <div className="flex justify-between text-[10px] text-mint-accent/50 font-bold mt-1 px-1">
                        <span>Current (0%)</span>
                        <span>+10% Effort</span>
                        <span>+20% Effort</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-darkEmerald-950/70 border border-mint-400/15 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-mint-400 block">
                        Estimated Semester Outcome
                      </span>
                      <p className="text-xs text-white">
                        At <strong className="text-gold">+{effortLevel}% effort</strong>,
                        your projected GPA moves from{" "}
                        <strong className="text-white">3.4</strong> to{" "}
                        <strong className="text-mint-400">
                          {(3.4 + (effortLevel / 20) * 0.4).toFixed(2)}
                        </strong>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-7 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={currentPrediction.points}
                        margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: "#5EEAD4" }}
                          axisLine={{ stroke: "rgba(94,234,212,0.2)" }}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[70, 95]}
                          tick={{ fontSize: 11, fill: "#5EEAD4" }}
                          axisLine={{ stroke: "rgba(94,234,212,0.2)" }}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#06241C",
                            borderColor: "#4ADE9A",
                            borderRadius: "10px",
                            fontSize: "11px",
                            color: "#fff",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#F5B942"
                          strokeWidth={3}
                          dot={{ fill: "#4ADE9A", r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6, fill: "#4ADE9A" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Row 3: Upcoming Activities List */}
              <div className="rounded-2xl bg-darkEmerald-900/70 backdrop-blur-xl border border-mint-400/20 p-5 shadow-glass space-y-4">
                <div className="flex items-center justify-between border-b border-mint-400/15 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-mint-400/15 border border-mint-400/30 flex items-center justify-center text-mint-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Upcoming Activities</h3>
                  </div>
                  {onView && (
                    <button
                      onClick={() => onView("planner")}
                      className="text-xs font-semibold text-mint-400 hover:text-mint-accent flex items-center gap-1"
                    >
                      View Calendar <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {UPCOMING_ACTIVITIES.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-darkEmerald-950/70 border border-mint-400/15 hover:border-mint-400/35 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-darkEmerald-900 border border-mint-400/25 flex items-center justify-center text-mint-400">
                          {act.type === "quiz" ? (
                            <Brain className="w-4 h-4 text-gold" />
                          ) : act.type === "lab" ? (
                            <Sparkles className="w-4 h-4 text-mint-400" />
                          ) : (
                            <CalendarDays className="w-4 h-4 text-purple-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {act.title}
                            </span>
                            <span className="text-[9px] bg-darkEmerald-800 text-mint-accent/80 px-2 py-0.5 rounded border border-mint-400/20 font-bold">
                              {act.course}
                            </span>
                          </div>
                          <span className="text-[11px] text-mint-accent/60">
                            {act.due}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          act.badge === "Urgent"
                            ? "bg-coral/20 text-coral border border-coral/40"
                            : act.badge === "Event"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                            : "bg-mint-400/15 text-mint-300 border border-mint-400/30"
                        }`}
                      >
                        {act.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (cols 4): Quick Access + Live NEXUS Copilot Chat */}
            <div className="xl:col-span-4 space-y-6">
              {/* Quick Access Tiles */}
              <div className="rounded-2xl bg-darkEmerald-900/70 backdrop-blur-xl border border-mint-400/20 p-5 shadow-glass space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-mint-accent/80 border-b border-mint-400/15 pb-2.5">
                  Quick Access
                </h3>

                <div className="grid grid-cols-2 gap-2.5">
                  {QUICK_ACCESS_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === "qa-drills" && onView) onView("drills");
                        else if (item.id === "qa-planner" && onView) onView("planner");
                        else if (item.id === "qa-grievance" && onView) onView("privacy");
                        else if (item.id === "qa-matcher" && onView) onView("community");
                        else onNotify?.(`Opened ${item.label}`, "info");
                      }}
                      className="p-3 rounded-xl bg-darkEmerald-950/80 border border-mint-400/15 hover:border-mint-400/50 hover:bg-darkEmerald-900 transition-all text-left group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-mint-400/15 border border-mint-400/25 flex items-center justify-center text-mint-400 mb-2 group-hover:scale-110 transition-transform">
                        {item.icon === "Brain" ? (
                          <Brain className="w-3.5 h-3.5" />
                        ) : item.icon === "CalendarDays" ? (
                          <CalendarDays className="w-3.5 h-3.5" />
                        ) : item.icon === "Shield" ? (
                          <Shield className="w-3.5 h-3.5" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-white block group-hover:text-mint-400 transition-colors">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-mint-accent/60 line-clamp-1">
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* NEXUS AI Copilot Chat Drawer */}
              <div className="rounded-2xl bg-darkEmerald-900/80 backdrop-blur-xl border border-mint-400/25 shadow-2xl overflow-hidden flex flex-col h-[460px]">
                {/* Copilot Header */}
                <div className="p-4 border-b border-mint-400/15 bg-darkEmerald-950/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-full bg-mint-400/20 border border-mint-400/40 p-0.5 flex items-center justify-center">
                      <Image
                        src="/images/robot.svg"
                        alt="Bot"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-mint-400 ring-1 ring-darkEmerald-950" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        NEXUS AI Copilot
                        <span className="text-[9px] bg-mint-400/20 text-mint-300 px-1.5 py-0.2 rounded-full font-bold">
                          Online
                        </span>
                      </h4>
                      <span className="text-[10px] text-mint-accent/60">
                        Ask questions about your courses & weak topics
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div
                  ref={chatScrollRef}
                  className="flex-1 p-4 overflow-y-auto space-y-3 text-xs"
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        m.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                          m.sender === "user"
                            ? "bg-mint-400 text-darkEmerald-950 font-medium rounded-tr-none shadow-md"
                            : "bg-darkEmerald-950/90 text-mint-100 border border-mint-400/20 rounded-tl-none shadow-glass"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-mint-accent/40 mt-1 px-1">
                        {m.time}
                      </span>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1 text-[11px] text-mint-400 bg-darkEmerald-950/70 px-3 py-1.5 rounded-full w-fit border border-mint-400/20">
                      <Sparkles className="w-3 h-3 animate-spin text-gold" />
                      <span>NEXUS is thinking...</span>
                    </div>
                  )}
                </div>

                {/* Quick Presets Pills */}
                <div className="px-3 py-2 bg-darkEmerald-950/60 border-t border-mint-400/10 flex gap-1.5 overflow-x-auto no-scrollbar">
                  {COPILOT_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendPrompt(p.label)}
                      className="text-[10px] whitespace-nowrap bg-darkEmerald-900/90 hover:bg-mint-400/20 text-mint-accent/90 hover:text-white border border-mint-400/20 px-2.5 py-1 rounded-full transition-all flex-shrink-0"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Chat Input Bar */}
                <div className="p-3 bg-darkEmerald-950 border-t border-mint-400/15 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask NEXUS AI anything..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendPrompt(chatInput)}
                    className="flex-1 bg-darkEmerald-900 border border-mint-400/25 rounded-full px-4 py-2 text-xs text-white placeholder:text-mint-accent/40 focus:outline-none focus:border-mint-accent"
                  />
                  <button
                    onClick={() => handleSendPrompt(chatInput)}
                    className="w-8 h-8 rounded-full bg-mint-400 hover:bg-mint-300 text-darkEmerald-950 flex items-center justify-center transition-all shadow-[0_0_10px_rgba(74,222,154,0.4)] flex-shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
