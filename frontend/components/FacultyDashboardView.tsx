"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpenCheck,
  Users,
  BarChart3,
  Activity,
  Award,
  AlertTriangle,
  Download,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers,
  Brain,
  Sparkles,
  LogOut,
  ChevronRight,
  Filter,
  Search,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { FreshRoleDashboard } from "@/components/FreshRoleDashboard";
import { DashboardTopNavbar, NavItem } from "@/components/DashboardTopNavbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";

const SAMPLE_COURSES = [
  { id: "cs201", code: "CS201", title: "Data Structures & Algorithms", enrolled: 68, avgScore: 78.4, passRate: 92 },
  { id: "cs301", code: "CS301", title: "Operating Systems", enrolled: 62, avgScore: 72.1, passRate: 88 },
  { id: "cs401", code: "CS401", title: "Machine Learning & AI", enrolled: 54, avgScore: 81.6, passRate: 96 },
];

const SAMPLE_AT_RISK_STUDENTS = [
  { id: "usr-012", name: "Rohan Patel", roll: "21CS044", course: "CS201", attendance: 68.2, predicted: 71.4, testScore: 48, status: "Critical", recommended: "Issue Attendance Warning & Remedial Lab" },
  { id: "usr-045", name: "Simran Kaur", roll: "21CS089", course: "CS301", attendance: 71.5, predicted: 73.8, testScore: 54, status: "Warning", recommended: "Assign Peer Study Partner" },
  { id: "usr-078", name: "Aditya Verma", roll: "21CS112", course: "CS201", attendance: 64.0, predicted: 68.0, testScore: 42, status: "Critical", recommended: "Parent Notice & HoD Counseling" },
  { id: "usr-092", name: "Neha Joshi", roll: "21CS135", course: "CS401", attendance: 73.0, predicted: 74.5, testScore: 61, status: "Warning", recommended: "Provide Micro-Drill Modules" },
];

const SAMPLE_QUESTION_AUDIT = [
  { id: "Q1", topic: "Red-Black Trees Deletion", difficulty: 0.82, discrimination: 0.44, status: "High Rigor (Good)", mastery: "64%" },
  { id: "Q2", topic: "Virtual Memory Paging", difficulty: 0.65, discrimination: 0.51, status: "Optimal", mastery: "72%" },
  { id: "Q3", topic: "Backpropagation Math", difficulty: 0.89, discrimination: 0.38, status: "Too Difficult (Review)", mastery: "48%" },
  { id: "Q4", topic: "Dijkstra Shortest Path", difficulty: 0.42, discrimination: 0.49, status: "Optimal", mastery: "85%" },
  { id: "Q5", topic: "Thread Deadlock Detection", difficulty: 0.74, discrimination: 0.46, status: "High Rigor", mastery: "61%" },
];

export function FacultyDashboardView() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"grading" | "attendance" | "audit" | "overview">("grading");
  const [selectedCourse, setSelectedCourse] = useState("cs201");
  const [meanShift, setMeanShift] = useState(0);
  const [stdScale, setStdScale] = useState(1);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Faculty Navbar Items
  const facultyNavItems: NavItem[] = [
    { id: "grading", label: "Grading Sandbox", icon: BookOpenCheck },
    { id: "attendance", label: "At-Risk Forecaster", icon: Activity },
    { id: "audit", label: "Item Analysis & NBA", icon: Award },
    { id: "overview", label: "Department Overview", icon: BarChart3 },
  ];

  // Compute Gaussian Grade Distribution based on meanShift & stdScale
  const gradeDistribution = useMemo(() => {
    const baseGrades = [
      { grade: "O (90+)", count: 8 },
      { grade: "A+ (80-89)", count: 18 },
      { grade: "A (70-79)", count: 24 },
      { grade: "B+ (60-69)", count: 12 },
      { grade: "B (50-59)", count: 5 },
      { grade: "C (40-49)", count: 1 },
      { grade: "F (<40)", count: 0 },
    ];

    return baseGrades.map((g, idx) => {
      let mod = g.count;
      if (meanShift > 0 && idx < 3) mod += Math.round(meanShift * 1.5);
      if (meanShift < 0 && idx > 3) mod += Math.round(Math.abs(meanShift) * 1.2);
      if (stdScale > 1) {
        if (idx === 0 || idx === 6) mod += 2;
      }
      return { ...g, adjusted: Math.max(0, mod) };
    });
  }, [meanShift, stdScale]);

  const handleExport = (type: "pdf" | "csv") => {
    setExportNotice(`Exported ${type.toUpperCase()} Grade Ledger with NBA Attainment Signature!`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  if (user?.is_new_account) {
    return (
      <FreshRoleDashboard
        user={user}
        roleLabel="Faculty"
        metrics={["Active Courses", "Total Enrolled", "At-Risk Students", "CO-PO Attainment"]}
        onLogout={logout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120206] via-[#1B040A] to-[#2E0813] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-gold-500/30 backdrop-blur-xl bg-burgundy-950/85 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-gold-500/30 bg-burgundy-900/80 text-gold-300"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="faculty-mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Logo size="md" />
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-gold-500/30">
              <span className="px-2.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                <BookOpenCheck className="w-3.5 h-3.5" />
                FACULTY PORTAL
              </span>
              <span className="text-xs text-gold-200/60">CSE Department · NITX</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">{user?.full_name || "Faculty Member"}</span>
              <span className="text-[11px] text-gold-400 font-mono">{user?.email || "faculty@nitx.demo"}</span>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav id="faculty-mobile-navigation" className="lg:hidden border-b border-gold-500/25 bg-burgundy-950/95 px-4 py-3 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2">
            {([
              ["overview", "Overview"],
              ["grading", "Grading"],
              ["attendance", "Attendance"],
              ["audit", "Audit"],
            ] as const).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                className={`rounded-xl border px-3 py-2.5 text-xs font-semibold ${
                  activeTab === tab
                    ? "border-gold-400 bg-gold-500 text-burgundy-950"
                    : "border-gold-500/25 bg-burgundy-900/80 text-gold-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Course Banner & Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-4 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
            <div className="flex items-center justify-between text-[#4B6B5E] text-xs mb-1 font-semibold">
              <span>ACTIVE COURSES</span>
              <BookOpenCheck className="w-4 h-4 text-[#1D4ED8]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B2E22]">3 Courses</div>
            <p className="text-[11px] text-[#4B6B5E] mt-1 font-medium">CS201, CS301, CS401</p>
          </div>

          <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-4 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
            <div className="flex items-center justify-between text-[#4B6B5E] text-xs mb-1 font-semibold">
              <span>TOTAL ENROLLED</span>
              <Users className="w-4 h-4 text-[#1D4ED8]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B2E22]">184 Students</div>
            <p className="text-[11px] text-[#4B6B5E] mt-1 font-medium">94.2% Overall Attendance</p>
          </div>

          <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-4 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
            <div className="flex items-center justify-between text-[#4B6B5E] text-xs mb-1 font-semibold">
              <span>AT-RISK (&lt;75%)</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-700">4 Students</div>
            <p className="text-[11px] text-[#4B6B5E] mt-1 font-medium">Intervention alerts active</p>
          </div>

          <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-4 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
            <div className="flex items-center justify-between text-[#4B6B5E] text-xs mb-1 font-semibold">
              <span>CO-PO ATTAINMENT</span>
              <Award className="w-4 h-4 text-[#1D4ED8]" />
            </div>
            <div className="text-2xl font-extrabold text-[#047857]">89.6%</div>
            <p className="text-[11px] text-[#4B6B5E] mt-1 font-medium">NBA Criterion 3 compliant</p>
          </div>
        </div>

        {/* Notification Toast */}
        {exportNotice && (
          <div className="p-3.5 rounded-xl bg-[#F0FAF5] border border-[#34D399] text-[#047857] text-xs flex items-center gap-2 shadow-sm animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
            <span className="font-semibold">{exportNotice}</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 1: RELATIVE GRADING SANDBOX */}
        {/* ==================================================================== */}
        {activeTab === "grading" && (
          <div className="space-y-6">
            <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-6 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0B2E22] flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#1D4ED8]" />
                    Relative Grading Gaussian Sandbox
                  </h2>
                  <p className="text-xs text-[#4B6B5E] mt-1">
                    Simulate real-time grade normalizations across cohort scores. Automatically calibrates GPA bands before committing final marks to university ledger.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="bg-white border border-[#CDEBDD] rounded-xl px-3 py-2 text-xs text-[#0B2E22] focus:outline-none focus:border-[#34D399]"
                  >
                    {SAMPLE_COURSES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}: {c.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleExport("pdf")}
                    className="px-3 py-2 rounded-xl bg-[#FACC15] text-[#0B2E22] hover:bg-[#EAB308] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export PDF</span>
                  </button>
                  <button
                    onClick={() => handleExport("csv")}
                    className="px-3 py-2 rounded-xl bg-white border border-[#CDEBDD] text-[#0B2E22] hover:border-[#34D399] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-white border border-[#CDEBDD] mb-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#4B6B5E] mb-2">
                    <span>Mean Shift Adjustment:</span>
                    <span className="font-mono text-[#047857] font-bold">{meanShift > 0 ? `+${meanShift}` : meanShift} marks</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={meanShift}
                    onChange={(e) => setMeanShift(parseFloat(e.target.value))}
                    className="w-full accent-[#34D399] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#7A968A]">Compensates for high exam paper variance</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#4B6B5E] mb-2">
                    <span>Standard Deviation Spread:</span>
                    <span className="font-mono text-[#047857] font-bold">{stdScale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={stdScale}
                    onChange={(e) => setStdScale(parseFloat(e.target.value))}
                    className="w-full accent-[#34D399] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#7A968A]">Widens or narrows Gaussian distribution tails</span>
                </div>
              </div>

              {/* Distribution Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CDEBDD" />
                    <XAxis dataKey="grade" stroke="#4B6B5E" fontSize={11} />
                    <YAxis stroke="#4B6B5E" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #CDEBDD",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "#0B2E22",
                      }}
                    />
                    <Bar dataKey="adjusted" name="Students in Band" fill="#34D399" radius={[6, 6, 0, 0]}>
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 6 ? "#B91C1C" : index === 0 ? "#1D4ED8" : "#34D399"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-4 border-t border-[#CDEBDD] flex flex-wrap items-center justify-between gap-3 text-xs text-[#4B6B5E]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
                  <span>Blue: Outstanding (O)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] ml-2" />
                  <span>Mint: Normal Band</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C] ml-2" />
                  <span>Red: Remediate (F)</span>
                </div>
                <span className="font-mono text-[#047857] font-semibold">Cohort Size: 68 Enrolled</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: ATTENDANCE EARLY WARNING FORECASTER */}
        {/* ==================================================================== */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-6 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0B2E22] flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-600" />
                    75% Attendance Risk Radar & Early Warning
                  </h2>
                  <p className="text-xs text-[#4B6B5E] mt-1">
                    AI forecast predicts end-of-semester attendance based on weekday historical patterns. Flags students before they cross the mandatory 75% cutoff.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-[#FEF9C3] border border-[#FACC15] text-[#713F12] font-bold">
                    Cutoff: 75.0%
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto bg-white border border-[#CDEBDD] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#CDEBDD] bg-[#F0FAF5] text-[#4B6B5E] uppercase font-semibold text-[11px]">
                      <th className="py-3 pl-3">Student Name</th>
                      <th className="py-3">Roll No.</th>
                      <th className="py-3">Course</th>
                      <th className="py-3">Current Att.</th>
                      <th className="py-3">Predicted Final</th>
                      <th className="py-3">Risk Level</th>
                      <th className="py-3">Recommended Intervention</th>
                      <th className="py-3 pr-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CDEBDD]">
                    {SAMPLE_AT_RISK_STUDENTS.map((s) => (
                      <tr key={s.id} className="hover:bg-[#F0FAF5]/50 transition-colors">
                        <td className="py-3.5 pl-3 font-semibold text-[#0B2E22]">{s.name}</td>
                        <td className="py-3.5 font-mono text-[#4B6B5E]">{s.roll}</td>
                        <td className="py-3.5 font-mono text-[#047857]">{s.course}</td>
                        <td className="py-3.5 font-bold text-amber-700">{s.attendance}%</td>
                        <td className="py-3.5 font-bold text-red-700">{s.predicted}%</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.status === "Critical"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-[#4B6B5E] text-[11px]">{s.recommended}</td>
                        <td className="py-3.5 pr-3 text-right">
                          <button
                            onClick={() => {
                              setExportNotice(`Sent academic nudge to ${s.name} (${s.roll})`);
                              setTimeout(() => setExportNotice(null), 3000);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#FACC15] hover:bg-[#EAB308] text-[#0B2E22] text-[11px] font-bold transition-all shadow-sm"
                          >
                            Notify
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: IRT QUESTION ITEM AUDIT */}
        {/* ==================================================================== */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-6 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0B2E22] flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#1D4ED8]" />
                    Item Response Theory (IRT) Exam Question Audit
                  </h2>
                  <p className="text-xs text-[#4B6B5E] mt-1">
                    Evaluates question quality, difficulty curves, and discrimination parameters. Flags ambiguous questions that penalize top students.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SAMPLE_QUESTION_AUDIT.map((q) => (
                  <div key={q.id} className="p-4 rounded-xl bg-white border border-[#CDEBDD] flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded bg-[#F0FAF5] text-[#047857] border border-[#CDEBDD] font-mono text-xs font-bold">
                          {q.id}
                        </span>
                        <span className="text-xs text-[#4B6B5E] font-mono">Mastery: {q.mastery}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0B2E22] mb-2">{q.topic}</h3>
                      <div className="space-y-1 text-xs text-[#4B6B5E]">
                        <div className="flex justify-between">
                          <span>Difficulty (b):</span>
                          <span className="font-mono text-[#0B2E22] font-semibold">{q.difficulty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Discrimination (a):</span>
                          <span className="font-mono text-[#0B2E22] font-semibold">{q.discrimination}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#CDEBDD] flex items-center justify-between">
                      <span className="text-[11px] text-[#047857] font-semibold">{q.status}</span>
                      <button
                        onClick={() => {
                          setExportNotice(`Calibrating item parameters for ${q.id}...`);
                          setTimeout(() => setExportNotice(null), 2500);
                        }}
                        className="text-[11px] font-bold text-[#1D4ED8] hover:underline flex items-center gap-1"
                      >
                        <span>Audit</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: DEPARTMENT OVERVIEW */}
        {/* ==================================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-6 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
              <h2 className="text-xl font-bold text-[#0B2E22] flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-[#1D4ED8]" />
                CSE Department Academic Velocity
              </h2>
              <p className="text-xs text-[#4B6B5E] mb-6">
                Active course progression, attendance health, and grading compliance across all section cohorts.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SAMPLE_COURSES.map((course) => (
                  <div key={course.id} className="p-4 bg-white border border-[#CDEBDD] rounded-xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#1D4ED8]">{course.code}</span>
                      <span className="text-xs font-bold text-[#047857]">{course.passRate}% Pass Rate</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0B2E22]">{course.title}</h3>
                    <div className="flex items-center justify-between text-xs text-[#4B6B5E] pt-2 border-t border-[#CDEBDD]">
                      <span>{course.enrolled} Students</span>
                      <span>Avg Score: {course.avgScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
