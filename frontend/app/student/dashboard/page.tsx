"use client";

import { useState, useEffect, useRef } from "react";
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
  PREDICTOR_EFFORT_TIERS,
  UPCOMING_ACTIVITIES,
  QUICK_ACCESS_ITEMS,
  COPILOT_PRESETS,
  CopilotMessage,
} from "@/data/student";

export default function StudentDashboardPage() {
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

    // Look up canned answer or fallback response
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

  // Sidebar Menu Items
  const sidebarNavItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "academics", label: "My Academics", icon: GraduationCap },
    { id: "mastery", label: "Mastery Map", icon: Compass },
    { id: "predictor", label: "Grade Predictor", icon: LineChartIcon },
    { id: "planner", label: "AI Study Planner", icon: CalendarDays },
    { id: "drills", label: "Micro Drills", icon: Brain },
    { id: "copilot", label: "AI Copilot", icon: Bot },
    { id: "grievance", label: "Grievance Centre", icon: ShieldAlert },
    { id: "campus", label: "Campus Life", icon: Sparkles },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Donut Chart Data (72% Overall Mastery)
  const donutData = [
    { name: "Mastered", value: 72, fill: "#4ADE9A" },
    { name: "Remaining", value: 28, fill: "#062A20" },
  ];

  return (
    <div className="min-h-screen bg-darkEmerald-950 text-white flex flex-col lg:flex-row relative selection:bg-mint-400 selection:text-darkEmerald-950 font-sans">
      {/* Background Architectural Canvas & Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-15 bg-center bg-cover mix-blend-screen"
          style={{ backgroundImage: `url('/images/campus-night.svg')` }}
        />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-mint-500/10 rounded-full blur-[140px]" />
      </div>

      {/* =================================================================
          1. FIXED LEFT SIDEBAR
          ================================================================= */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-col justify-between border-r border-mint-400/20 bg-darkEmerald-950/95 backdrop-blur-2xl p-5 z-30 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Logo with Tagline */}
          <div className="pb-4 border-b border-mint-400/15">
            <Logo size="md" showTagline={true} />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
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

        {/* Bottom Card: "Your Academic Growth, Our Priority" */}
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
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-mint-400 hover:text-mint-accent transition-colors pt-1"
            >
              <span>Explore Insights</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-40 bg-darkEmerald-950/95 border-b border-mint-400/25 p-4 backdrop-blur-2xl">
          <nav className="grid grid-cols-2 gap-2">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${
                    activeMenu === item.id
                      ? "bg-mint-400 text-darkEmerald-950 font-bold"
                      : "text-mint-accent/80 hover:text-white bg-darkEmerald-900/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* =================================================================
          2. MAIN CONTENT + RIGHT COLUMN
          ================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top bar: Global search ⌘K + Bell (badge 3) + Profile "Student ▾" */}
        <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-mint-400/15 bg-darkEmerald-950/70 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-30">
          {/* Global Search Focus with ⌘K */}
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
            {/* Quick Link back to Public Home */}
            <Link
              href="/"
              className="text-xs text-mint-accent/70 hover:text-white transition-colors hidden md:inline-flex items-center gap-1"
            >
              <span>Public Showcase</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            {/* Notification Bell with red badge 3 */}
            <button
              aria-label="3 new notifications"
              className="relative p-2 rounded-full bg-darkEmerald-900/80 border border-mint-400/25 text-mint-accent hover:text-white transition-all shadow-sm"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-darkEmerald-950 shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                3
              </span>
            </button>

            {/* Profile Pill: Student ▾ */}
            <div className="flex items-center gap-2 pl-2 border-l border-mint-400/20">
              <div className="w-8 h-8 rounded-full bg-mint-400 text-darkEmerald-950 font-bold flex items-center justify-center text-xs shadow-[0_0_10px_rgba(74,222,154,0.5)]">
                ST
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  Student <ChevronDown className="w-3 h-3 text-mint-400/70" />
                </span>
                <span className="text-[10px] text-mint-accent/60 -mt-0.5">
                  Computer Science (Sem 5)
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body Workspace */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* =============================================================
              HERO BANNER (NIGHT BUILDING IMAGE BACKGROUND)
              ============================================================= */}
          <div className="relative rounded-3xl bg-darkEmerald-900/80 border border-mint-400/30 p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Night-time building background */}
            <div
              className="absolute inset-0 opacity-25 bg-cover bg-center mix-blend-screen pointer-events-none"
              style={{ backgroundImage: `url('/images/campus-night.svg')` }}
            />
            {/* Radial glow */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-mint-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                  <span>Good Morning, Student!</span>
                  <Sparkles className="w-5 h-5 text-gold animate-pulse drop-shadow-[0_0_10px_rgba(245,185,66,0.8)]" />
                </h1>
                <p className="text-sm text-mint-accent/80 font-medium">
                  Track. Improve. Excel — with{" "}
                  <span className="text-mint-400 font-bold">CAMPUS-NEXUS</span>
                </p>
              </div>

              {/* Pill: "You're on track! Keep going towards your goals." */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-darkEmerald-950/80 border border-mint-400/40 text-xs font-semibold text-mint-300 shadow-[0_0_15px_rgba(94,234,212,0.2)] backdrop-blur-md self-start md:self-auto">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>You&apos;re on track! Keep going towards your goals.</span>
              </div>
            </div>
          </div>

          {/* =============================================================
              4 KPI CARDS WITH MINI SPARKLINE CHARTS
              ============================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {KPI_CARDS.map((kpi) => (
              <KpiCard key={kpi.id} item={kpi} />
            ))}
          </div>

          {/* Main 2-Column Dashboard Grid: Center Feed (cols 8) + Right Panel (cols 4) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* CENTER / MAIN FEED (cols 8) */}
            <div className="xl:col-span-8 space-y-6">
              {/* Row 1: Mastery Map Card + AI Study Recommendation Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. "My Mastery Map" Card (Donut Chart 72% + Progress Bars) */}
                <div className="rounded-2xl bg-darkEmerald-900/70 backdrop-blur-xl border border-mint-400/20 p-5 shadow-glass space-y-4">
                  <div className="flex items-center justify-between border-b border-mint-400/15 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-mint-400/15 border border-mint-400/30 flex items-center justify-center text-mint-400">
                        <Compass className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-white">My Mastery Map</h3>
                    </div>
                    <span className="text-xs font-semibold text-mint-400 hover:text-mint-accent cursor-pointer flex items-center gap-1">
                      View Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                  {/* 72% Donut Chart + Legend */}
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
                        <span className="text-xl font-extrabold text-white leading-none">
                          72%
                        </span>
                        <span className="text-[9px] text-mint-accent/70 font-bold uppercase tracking-wider mt-0.5">
                          Overall
                        </span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="text-white font-bold">DKT-Graph Synthesized</div>
                      <p className="text-[11px] text-mint-accent/70 leading-normal">
                        Your mastery across 4 enrolled core courses. 2 mastered, 1
                        progressing, 1 needs attention.
                      </p>
                    </div>
                  </div>

                  {/* Course Progress Bars */}
                  <div className="space-y-3 pt-2 border-t border-mint-400/15">
                    {MASTERY_COURSES.map((course) => (
                      <ProgressBar
                        key={course.code}
                        label={course.name}
                        code={course.code}
                        value={course.percentage}
                        color={course.color}
                        instructor={course.instructor}
                      />
                    ))}
                  </div>
                </div>

                {/* 2. "AI Study Recommendation" Card (Robot mascot + Checklist) */}
                <div className="rounded-2xl bg-darkEmerald-900/70 backdrop-blur-xl border border-mint-400/20 p-5 shadow-glass space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-mint-400/15 pb-3 mb-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Brain className="w-4 h-4 text-mint-accent" />
                        AI Study Recommendation
                      </h3>
                      <span className="text-[10px] bg-mint-400/15 text-mint-300 font-bold px-2.5 py-0.5 rounded-full border border-mint-400/30">
                        ⚡ Powered by Nexus AI
                      </span>
                    </div>

                    {/* Robot Mascot + Gap Alert */}
                    <div className="flex items-center gap-3 bg-darkEmerald-950/70 p-3 rounded-xl border border-mint-400/20 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-darkEmerald-800/80 border border-mint-400/30 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-[0_0_15px_rgba(94,234,212,0.25)]">
                        <Image
                          src="/images/robot.svg"
                          alt="AI Robot Mascot"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div className="text-xs">
                        <span className="text-[10px] text-gold font-bold uppercase tracking-wider block">
                          Prerequisite Gap Detected
                        </span>
                        <p className="text-white font-medium mt-0.5 leading-snug">
                          Your performance in{" "}
                          <strong className="text-mint-300">
                            Computer Networks
                          </strong>{" "}
                          shows a gap in{" "}
                          <span className="text-gold font-bold">
                            Routing Protocols
                          </span>
                          .
                        </p>
                      </div>
                    </div>

                    {/* Recommended Actions Interactive Checklist */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-mint-accent/90 uppercase tracking-wider block">
                        Recommended Actions:
                      </span>
                      {recommendationActions.map((action) => (
                        <div
                          key={action.id}
                          onClick={() => toggleAction(action.id)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                            action.completed
                              ? "bg-mint-400/10 border-mint-400/40 text-mint-accent/60"
                              : "bg-darkEmerald-900/60 border-mint-400/20 text-white hover:border-mint-400/50"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              action.completed
                                ? "bg-mint-400 border-mint-400 text-darkEmerald-950"
                                : "border-mint-400/50 bg-darkEmerald-950"
                            }`}
                          >
                            {action.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span
                            className={`text-xs font-medium flex-1 ${
                              action.completed ? "line-through text-mint-accent/50" : ""
                            }`}
                          >
                            {action.text}
                          </span>
                          <span className="text-[10px] text-mint-accent/50 font-mono">
                            {action.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generate Study Plan Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => setStudyPlanGenerated(!studyPlanGenerated)}
                      className="w-full btn-mint-primary py-2.5 text-xs flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {studyPlanGenerated
                          ? "✓ Study Plan Activated"
                          : "Generate Study Plan →"}
                      </span>
                    </button>
                    {studyPlanGenerated && (
                      <p className="text-[10px] text-center text-mint-400 mt-2 font-medium">
                        ✨ 3 tailored tasks added to your planner before Nov 10 test!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Grade Predictor Interactive Card */}
              <div className="rounded-2xl bg-darkEmerald-900/70 backdrop-blur-xl border border-mint-400/20 p-5 shadow-glass space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-mint-400/15 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <LineChartIcon className="w-4 h-4 text-mint-accent" />
                      Grade Predictor
                    </h3>
                    <p className="text-xs text-mint-accent/70 mt-0.5">
                      Simulate your performance with personalised insights.
                    </p>
                  </div>

                  {/* Gold Badge: Predicted Grade B+ → A- (88%) */}
                  <div className="px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/50 text-gold-light text-xs font-bold shadow-[0_0_15px_rgba(245,185,66,0.3)] self-start sm:self-auto">
                    Predicted Grade {currentPrediction.gradeTransition}
                  </div>
                </div>

                {/* Interactive Effort Slider */}
                <div className="bg-darkEmerald-950/70 p-4 rounded-xl border border-mint-400/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-mint-accent">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-mint-400" /> Additional Weekly Effort
                    </span>
                    <span className="text-gold font-extrabold text-sm">+{effortLevel}% Effort</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="10"
                    value={effortLevel}
                    onChange={(e) => setEffortLevel(Number(e.target.value))}
                    className="w-full accent-mint-400 cursor-pointer h-2 bg-darkEmerald-900 rounded-lg"
                  />

                  <div className="flex justify-between text-[11px] text-mint-accent/60 font-semibold">
                    <span>Current (0%)</span>
                    <span>Moderate (+10%)</span>
                    <span>High (+20%)</span>
                  </div>
                </div>

                {/* Line Chart: x-axis Current / +10% Effort / +20% Effort, y-axis 40%-100% */}
                <div className="h-48 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentPrediction.points}>
                      <XAxis
                        dataKey="name"
                        stroke="#86A79F"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: "rgba(94,234,212,0.2)" }}
                      />
                      <YAxis
                        domain={[40, 100]}
                        stroke="#86A79F"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: "rgba(94,234,212,0.2)" }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#06241C",
                          borderColor: "rgba(94,234,212,0.4)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          color: "#FFF",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Predicted Score"
                        stroke="#4ADE9A"
                        strokeWidth={3}
                        dot={{ fill: "#F5B942", stroke: "#FFF", strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, fill: "#00F5A0" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Row 3: Upcoming Activities + Quick Access */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Activities List */}
                <div className="rounded-2xl bg-darkEmerald-900/70 backdrop-blur-xl border border-mint-400/20 p-5 shadow-glass space-y-4">
                  <div className="flex items-center justify-between border-b border-mint-400/15 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-mint-accent" />
                      Upcoming Activities
                    </h3>
                    <span className="text-xs font-semibold text-mint-400 hover:text-mint-accent cursor-pointer">
                      View All →
                    </span>
                  </div>

                  <div className="space-y-3">
                    {UPCOMING_ACTIVITIES.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-darkEmerald-950/70 border border-mint-400/15 hover:border-mint-400/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {/* Date Block */}
                          <div className="w-11 h-11 rounded-lg bg-darkEmerald-800/80 border border-mint-400/30 flex flex-col items-center justify-center text-center flex-shrink-0">
                            <span className="text-sm font-black text-white leading-none">
                              {act.date.day}
                            </span>
                            <span className="text-[9px] font-bold text-mint-400 uppercase tracking-widest mt-0.5">
                              {act.date.month}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-white">
                              {act.title}
                            </h4>
                            <p className="text-[11px] text-mint-accent/65 mt-0.5">
                              {act.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Badge */}
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            act.badge.variant === "amber"
                              ? "bg-gold/20 text-gold-light border-gold/40"
                              : act.badge.variant === "purple"
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                              : "bg-mint-400/15 text-mint-400 border-mint-400/30"
                          }`}
                        >
                          {act.badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Access 2x2 Tiles */}
                <div className="rounded-2xl bg-darkEmerald-900/70 backdrop-blur-xl border border-mint-400/20 p-5 shadow-glass space-y-4">
                  <div className="border-b border-mint-400/15 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-mint-accent" />
                      Quick Access
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {QUICK_ACCESS_ITEMS.map((item) => {
                      const icons: Record<string, any> = {
                        Calendar,
                        Shield,
                        Compass,
                        BookOpen,
                      };
                      const IconC = icons[item.icon] || BookOpen;
                      return (
                        <div
                          key={item.id}
                          className="group p-4 rounded-xl bg-darkEmerald-950/70 hover:bg-darkEmerald-850/80 border border-mint-400/20 hover:border-mint-accent cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(94,234,212,0.15)] flex flex-col justify-between"
                        >
                          <div className="w-9 h-9 rounded-lg bg-darkEmerald-800 border border-mint-400/30 flex items-center justify-center text-mint-400 mb-2 group-hover:scale-110 transition-transform">
                            <IconC className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block group-hover:text-mint-300">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-mint-accent/60">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* =============================================================
                RIGHT COLUMN: NEXUS AI COPILOT CHAT + PROMO CARD (cols 4)
                ============================================================= */}
            <div className="xl:col-span-4 space-y-6">
              {/* NEXUS AI Copilot Chat Panel */}
              <div className="rounded-2xl bg-darkEmerald-900/80 backdrop-blur-2xl border border-mint-400/25 p-5 shadow-2xl flex flex-col h-[520px]">
                {/* Header with green online dot */}
                <div className="flex items-center justify-between border-b border-mint-400/15 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-lg bg-mint-400/20 border border-mint-400/40 flex items-center justify-center text-mint-400">
                        <Bot className="w-4 h-4" />
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-mint-glow absolute -bottom-0.5 -right-0.5 ring-2 ring-darkEmerald-950 animate-pulse shadow-[0_0_8px_rgba(0,245,160,0.8)]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                        NEXUS AI Copilot
                      </h3>
                      <span className="text-[10px] text-mint-400 flex items-center gap-1">
                        ● Online · RAG Syllabus Engine
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick-Reply Chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {COPILOT_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handleSendPrompt(preset.label)}
                      className="text-[10px] bg-darkEmerald-950/80 hover:bg-darkEmerald-800 text-mint-accent border border-mint-400/25 hover:border-mint-accent px-2.5 py-1 rounded-full transition-all"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>

                {/* Chat Scroll Area */}
                <div
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto space-y-3 pr-1 py-1"
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        m.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          m.sender === "user"
                            ? "bg-mint-400 text-darkEmerald-950 font-semibold rounded-tr-none shadow-[0_0_15px_rgba(74,222,154,0.3)]"
                            : "bg-darkEmerald-950/90 text-mint-100 border border-mint-400/20 rounded-tl-none shadow-md"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-mint-accent/50 px-1 mt-0.5">
                        {m.time}
                      </span>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-darkEmerald-950/80 border border-mint-400/20 w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-bounce" />
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  )}
                </div>

                {/* Chat Input Box */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendPrompt(chatInput);
                  }}
                  className="pt-3 border-t border-mint-400/15 flex items-center gap-2 mt-2"
                >
                  <input
                    type="text"
                    placeholder="Ask anything..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-darkEmerald-950/80 border border-mint-400/25 rounded-full px-3.5 py-2 text-xs text-white placeholder:text-mint-accent/40 focus:outline-none focus:border-mint-accent focus:ring-1 focus:ring-mint-accent"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!chatInput.trim()}
                    className="w-8 h-8 rounded-full btn-mint-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Bottom-Right Promo Card: "Dream Big. Achieve More. Explore Campus →" */}
              <div className="rounded-2xl bg-darkEmerald-900/80 border border-mint-400/25 p-5 relative overflow-hidden group shadow-xl">
                <div
                  className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('/images/silhouette.svg')` }}
                />
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-mint-400/15 border border-mint-400/30 text-mint-300">
                    <Sparkles className="w-3 h-3" />
                    <span>Campus Opportunities</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-white leading-tight">
                    Dream Big. <br />
                    <span className="mint-gradient-text">Achieve More.</span>
                  </h3>

                  <p className="text-xs text-mint-accent/80 font-normal leading-relaxed">
                    Connect with hackathons, research labs, and recruiter talent
                    signals right from your student portal.
                  </p>

                  <div className="pt-1">
                    <Link
                      href="/"
                      className="btn-mint-primary px-4 py-2 text-xs inline-flex items-center gap-1.5"
                    >
                      <span>Explore Campus</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
