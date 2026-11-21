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
import { DashboardTopNavbar, NavItem } from "@/components/DashboardTopNavbar";
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
  const [activeMenu, setActiveMenu] = useState("overview");

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

  // 10 Navigation items in exact order specified:
  // 1. Overview, 2. My Academics, 3. Mastery Map, 4. Grade Predictor, 5. AI Study Planner,
  // 6. Micro Drills, 7. AI Copilot, 8. Grievance Centre, 9. Campus Life, 10. Settings
  const studentNavItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "academics", label: "My Academics", icon: GraduationCap },
    { id: "learning", label: "Mastery Map", icon: Compass },
    { id: "grade-predictor", label: "Grade Predictor", icon: LineChartIcon },
    { id: "planner", label: "AI Study Planner", icon: CalendarDays },
    { id: "drills", label: "Micro Drills", icon: Brain },
    { id: "copilot", label: "AI Copilot", icon: Bot },
    { id: "privacy", label: "Grievance Centre", icon: ShieldAlert },
    { id: "community", label: "Campus Life", icon: Sparkles },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Donut Chart Data (72% Overall Mastery) in Mint & Border Tint
  const donutData = [
    { name: "Mastered", value: 72, fill: "#34D399" },
    { name: "Remaining", value: 28, fill: "#CDEBDD" },
  ];

  const handleNavClick = (id: string) => {
    setActiveMenu(id);
    if (onView && id !== "overview") {
      onView(id);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        embedded ? "bg-transparent" : "bg-white"
      } text-[#0B2E22] flex flex-col font-sans selection:bg-[#34D399]/30`}
    >
      {/* Top Navigation Bar (replaces left sidebar) */}
      {!embedded && (
        <DashboardTopNavbar
          items={studentNavItems}
          activeId={activeMenu}
          onSelect={handleNavClick}
          user={user}
          onLogout={onLogout}
          roleBadgeText="Student"
          roleColor="#047857"
          tagline="Find why a student is failing. Then fix it."
        />
      )}

      {/* Main Content Workspace (full width, centered max-w-[1280px], 24px side padding) */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero Banner */}
        <div className="relative rounded-xl bg-[#F0FAF5] border border-[#CDEBDD] p-6 sm:p-8 overflow-hidden shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2E22] flex items-center gap-2">
                <span>Good Morning, {user ? user.full_name?.split(" ")[0] : "Student"}!</span>
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
              </h1>
              <p className="text-sm text-[#4B6B5E] font-medium">
                Track. Improve. Excel — with{" "}
                <span className="text-[#047857] font-bold">CAMPUS-NEXUS</span>
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#CDEBDD] text-xs font-semibold text-[#0B2E22] shadow-[0_1px_2px_rgba(11,46,34,0.06)] self-start md:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
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
              <div className="rounded-xl bg-[#F0FAF5] border border-[#CDEBDD] p-5 shadow-[0_1px_2px_rgba(11,46,34,0.06)] space-y-4">
                <div className="flex items-center justify-between border-b border-[#CDEBDD] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#34D399]/20 border border-[#34D399]/40 flex items-center justify-center text-[#047857]">
                      <Compass className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0B2E22]">My Mastery Map</h3>
                  </div>
                  {onView && (
                    <button
                      onClick={() => onView("learning")}
                      className="text-xs font-semibold text-[#047857] hover:text-[#065F46] cursor-pointer flex items-center gap-1"
                    >
                      View Details <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          dataKey="value"
                          innerRadius={33}
                          outerRadius={44}
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-lg font-black text-[#0B2E22] leading-none">72%</span>
                      <span className="text-[7.5px] font-bold uppercase tracking-wider text-[#047857] mt-0.5">
                        Mastered
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0B2E22]">
                        Strong in DBMS & OS
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4B6B5E] leading-relaxed">
                      Identified 2 prerequisite concept gaps in Computer Networks &
                      Dynamic Programming.
                    </p>
                    {onView && (
                      <button
                        onClick={() => onView("learning")}
                        className="text-[11px] font-semibold text-[#047857] hover:text-[#065F46] flex items-center gap-1 pt-1"
                      >
                        Open DKT Concept Graph <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-[#CDEBDD]">
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
              <div className="rounded-xl bg-[#F0FAF5] border border-[#CDEBDD] p-5 shadow-[0_1px_2px_rgba(11,46,34,0.06)] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3 border-b border-[#CDEBDD] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="relative w-9 h-9 rounded-xl bg-white border border-[#CDEBDD] p-1 flex items-center justify-center overflow-hidden">
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
                          <h3 className="text-sm font-bold text-[#0B2E22]">
                            AI Recommendation
                          </h3>
                          <span className="text-[9px] bg-[#FEF9C3] text-[#713F12] border border-[#FACC15] px-1.5 py-0.5 rounded-full font-bold">
                            High Priority
                          </span>
                        </div>
                        <span className="text-[10px] text-[#4B6B5E]">
                          Based on your recent quiz in {AI_RECOMMENDATION.topic}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white border border-[#CDEBDD] p-3 space-y-1.5">
                    <span className="text-xs font-bold text-[#047857]">
                      {AI_RECOMMENDATION.topic}
                    </span>
                    <p className="text-[11px] text-[#4B6B5E] leading-relaxed">
                      {AI_RECOMMENDATION.rationale}
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4B6B5E] block">
                      Recommended Next Steps:
                    </span>
                    {recommendationActions.map((action) => (
                      <div
                        key={action.id}
                        onClick={() => toggleAction(action.id)}
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-[#CDEBDD] hover:border-[#34D399] cursor-pointer transition-colors"
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            action.completed
                              ? "bg-[#34D399] border-[#34D399] text-[#0B2E22]"
                              : "border-[#CDEBDD] bg-white"
                          }`}
                        >
                          {action.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-xs ${
                            action.completed
                              ? "line-through text-[#7A968A]"
                              : "text-[#0B2E22] font-medium"
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
                    className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all bg-[#FACC15] text-[#0B2E22] hover:bg-[#EAB308] shadow-[0_1px_2px_rgba(11,46,34,0.06)]"
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
            <div className="rounded-xl bg-[#F0FAF5] border border-[#CDEBDD] p-5 sm:p-6 shadow-[0_1px_2px_rgba(11,46,34,0.06)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CDEBDD] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#CDEBDD] flex items-center justify-center text-[#047857]">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-[#0B2E22]">
                        Grade Time Machine
                      </h3>
                      <span className="text-[10px] bg-[#FEF9C3] text-[#713F12] border border-[#FACC15] px-2 py-0.5 rounded-full font-bold">
                        Predictive Model
                      </span>
                    </div>
                    <p className="text-xs text-[#4B6B5E]">
                      Simulate the impact of extra targeted study hours on your final grade.
                    </p>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#CDEBDD] text-[#0B2E22] text-xs font-bold self-start sm:self-auto shadow-sm">
                  {currentPrediction.gradeTransition}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-[#4B6B5E]">
                        Extra Weekly Study Effort:
                      </span>
                      <span className="text-[#047857] text-sm font-extrabold">
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
                      className="range-control w-full cursor-pointer accent-[#34D399]"
                    />

                    <div className="flex justify-between text-[10px] text-[#7A968A] font-bold mt-1 px-1">
                      <span>Current (0%)</span>
                      <span>+10% Effort</span>
                      <span>+20% Effort</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#CDEBDD] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857] block">
                      Estimated Semester Outcome
                    </span>
                    <p className="text-xs text-[#0B2E22]">
                      At <strong className="text-[#047857]">+{effortLevel}% effort</strong>,
                      your projected GPA moves from{" "}
                      <strong className="text-[#0B2E22]">3.4</strong> to{" "}
                      <strong className="text-[#047857]">
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
                        tick={{ fontSize: 11, fill: "#4B6B5E" }}
                        axisLine={{ stroke: "#CDEBDD" }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[70, 95]}
                        tick={{ fontSize: 11, fill: "#4B6B5E" }}
                        axisLine={{ stroke: "#CDEBDD" }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#CDEBDD",
                          borderRadius: "10px",
                          fontSize: "11px",
                          color: "#0B2E22",
                          boxShadow: "0 4px 12px rgba(11,46,34,0.08)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#047857"
                        strokeWidth={3}
                        dot={{ fill: "#34D399", r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: "#34D399" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 3: Upcoming Activities List */}
            <div className="rounded-xl bg-[#F0FAF5] border border-[#CDEBDD] p-5 shadow-[0_1px_2px_rgba(11,46,34,0.06)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#CDEBDD] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#CDEBDD] flex items-center justify-center text-[#047857]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0B2E22]">Upcoming Activities</h3>
                </div>
                {onView && (
                  <button
                    onClick={() => onView("planner")}
                    className="text-xs font-semibold text-[#047857] hover:text-[#065F46] flex items-center gap-1"
                  >
                    View Calendar <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {UPCOMING_ACTIVITIES.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#CDEBDD] hover:border-[#34D399] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F0FAF5] border border-[#CDEBDD] flex items-center justify-center text-[#047857]">
                        {act.type === "quiz" ? (
                          <Brain className="w-4 h-4 text-[#047857]" />
                        ) : act.type === "lab" ? (
                          <Sparkles className="w-4 h-4 text-[#047857]" />
                        ) : (
                          <CalendarDays className="w-4 h-4 text-[#047857]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0B2E22]">
                            {act.title}
                          </span>
                          <span className="text-[9px] bg-[#F0FAF5] text-[#4B6B5E] px-2 py-0.5 rounded border border-[#CDEBDD] font-bold">
                            {act.course}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#4B6B5E]">
                          {act.due}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        act.badge === "Urgent"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : act.badge === "Event"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
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
            <div className="rounded-xl bg-[#F0FAF5] border border-[#CDEBDD] p-5 shadow-[0_1px_2px_rgba(11,46,34,0.06)] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4B6B5E] border-b border-[#CDEBDD] pb-2.5">
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
                    className="p-3 rounded-xl bg-white border border-[#CDEBDD] hover:border-[#34D399] hover:bg-[#F0FAF5] transition-all text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#F0FAF5] border border-[#CDEBDD] flex items-center justify-center text-[#047857] mb-2 group-hover:scale-110 transition-transform">
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
                    <span className="text-xs font-bold text-[#0B2E22] block group-hover:text-[#047857] transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-[#4B6B5E] line-clamp-1">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* NEXUS AI Copilot Chat Drawer */}
            <div className="rounded-xl bg-[#F0FAF5] border border-[#CDEBDD] shadow-[0_1px_2px_rgba(11,46,34,0.06)] overflow-hidden flex flex-col h-[460px]">
              {/* Copilot Header */}
              <div className="p-4 border-b border-[#CDEBDD] bg-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-full bg-[#F0FAF5] border border-[#CDEBDD] p-0.5 flex items-center justify-center">
                    <Image
                      src="/images/robot.svg"
                      alt="Bot"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#34D399] ring-1 ring-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0B2E22] flex items-center gap-1.5">
                      NEXUS AI Copilot
                      <span className="text-[9px] bg-[#FEF9C3] text-[#713F12] border border-[#FACC15] px-1.5 py-0.2 rounded-full font-bold">
                        Online
                      </span>
                    </h4>
                    <span className="text-[10px] text-[#4B6B5E]">
                      Ask questions about your courses & weak topics
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Body */}
              <div
                ref={chatScrollRef}
                className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#F0FAF5]"
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
                          ? "bg-[#34D399] text-[#0B2E22] font-medium rounded-tr-none shadow-sm"
                          : "bg-white text-[#0B2E22] border border-[#CDEBDD] rounded-tl-none shadow-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-[#7A968A] mt-1 px-1">
                      {m.time}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#047857] bg-white px-3 py-1.5 rounded-full w-fit border border-[#CDEBDD]">
                    <Sparkles className="w-3 h-3 animate-spin text-[#EAB308]" />
                    <span>NEXUS is thinking...</span>
                  </div>
                )}
              </div>

              {/* Quick Presets Pills */}
              <div className="px-3 py-2 bg-white border-t border-[#CDEBDD] flex gap-1.5 overflow-x-auto no-scrollbar">
                {COPILOT_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendPrompt(p.label)}
                    className="text-[10px] whitespace-nowrap bg-[#F0FAF5] hover:bg-[#FEF9C3] text-[#0B2E22] border border-[#CDEBDD] hover:border-[#FACC15] px-2.5 py-1 rounded-full transition-all flex-shrink-0"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-[#CDEBDD] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask NEXUS AI anything..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendPrompt(chatInput)}
                  className="flex-1 bg-white border border-[#CDEBDD] rounded-full px-4 py-2 text-xs text-[#0B2E22] placeholder-[#7A968A] focus:outline-none focus:border-[#34D399] focus:ring-2 focus:ring-[#34D399]/30"
                />
                <button
                  onClick={() => handleSendPrompt(chatInput)}
                  className="w-8 h-8 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0B2E22] flex items-center justify-center transition-all shadow-sm flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
