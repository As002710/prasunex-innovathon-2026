"use client";

import React, { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120206] via-[#1B040A] to-[#2E0813] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-gold-500/30 backdrop-blur-xl bg-burgundy-950/85 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Course Banner & Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-burgundy-900/80 border border-gold-500/35 rounded-2xl p-4 backdrop-blur-md shadow-lg shadow-black/40">
            <div className="flex items-center justify-between text-gold-200/70 text-xs mb-1">
              <span>ACTIVE COURSES</span>
              <BookOpenCheck className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">3 Courses</div>
            <p className="text-[11px] text-gold-400 mt-1">CS201, CS301, CS401</p>
          </div>

          <div className="bg-burgundy-900/80 border border-gold-500/35 rounded-2xl p-4 backdrop-blur-md shadow-lg shadow-black/40">
            <div className="flex items-center justify-between text-gold-200/70 text-xs mb-1">
              <span>TOTAL ENROLLED</span>
              <Users className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">184 Students</div>
            <p className="text-[11px] text-gold-400 mt-1">94.2% Overall Attendance</p>
          </div>

          <div className="bg-burgundy-900/80 border border-gold-500/35 rounded-2xl p-4 backdrop-blur-md shadow-lg shadow-black/40">
            <div className="flex items-center justify-between text-gold-200/70 text-xs mb-1">
              <span>AT-RISK (&lt;75%)</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400">4 Students</div>
            <p className="text-[11px] text-amber-300/80 mt-1">Intervention alerts active</p>
          </div>

          <div className="bg-burgundy-900/80 border border-gold-500/35 rounded-2xl p-4 backdrop-blur-md shadow-lg shadow-black/40">
            <div className="flex items-center justify-between text-gold-200/70 text-xs mb-1">
              <span>CO-PO ATTAINMENT</span>
              <Award className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-2xl font-extrabold text-gold-300">89.6%</div>
            <p className="text-[11px] text-gold-400 mt-1">NBA Criterion 3 compliant</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1 bg-burgundy-950/80 border border-gold-500/30 rounded-2xl max-w-2xl">
          <button
            onClick={() => setActiveTab("grading")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === "grading"
                ? "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-burgundy-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                : "text-gold-200/70 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Grading Sandbox</span>
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === "attendance"
                ? "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-burgundy-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                : "text-gold-200/70 hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Attendance Forecaster</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === "audit"
                ? "bg-mint-400 text-darkEmerald-950 shadow-[0_0_15px_rgba(74,222,154,0.3)]"
                : "text-mint-accent/70 hover:text-white"
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>IRT Question Audit</span>
          </button>
        </div>

        {/* Notification Toast */}
        {exportNotice && (
          <div className="p-3.5 rounded-xl bg-mint-500/15 border border-mint-400/40 text-mint-300 text-xs flex items-center gap-2 shadow-lg animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-mint-400 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 1: RELATIVE GRADING SANDBOX */}
        {/* ==================================================================== */}
        {activeTab === "grading" && (
          <div className="space-y-6">
            <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-mint-400" />
                    Relative Grading Gaussian Sandbox
                  </h2>
                  <p className="text-xs text-mint-accent/70 mt-1">
                    Simulate real-time grade normalizations across cohort scores. Automatically calibrates GPA bands before committing final marks to university ledger.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="bg-darkEmerald-950 border border-mint-400/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-mint-400"
                  >
                    {SAMPLE_COURSES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}: {c.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleExport("pdf")}
                    className="px-3 py-2 rounded-xl bg-mint-500/20 border border-mint-400/40 text-mint-300 hover:bg-mint-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export PDF</span>
                  </button>
                  <button
                    onClick={() => handleExport("csv")}
                    className="px-3 py-2 rounded-xl bg-darkEmerald-950 border border-mint-400/25 text-mint-300 hover:border-mint-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-darkEmerald-950/70 border border-mint-400/15 mb-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-mint-200 mb-2">
                    <span>Mean Shift Adjustment:</span>
                    <span className="font-mono text-mint-400 font-bold">{meanShift > 0 ? `+${meanShift}` : meanShift} marks</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={meanShift}
                    onChange={(e) => setMeanShift(parseFloat(e.target.value))}
                    className="w-full accent-mint-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-mint-accent/50">Compensates for high exam paper variance</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-mint-200 mb-2">
                    <span>Standard Deviation Spread:</span>
                    <span className="font-mono text-mint-400 font-bold">{stdScale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={stdScale}
                    onChange={(e) => setStdScale(parseFloat(e.target.value))}
                    className="w-full accent-mint-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-mint-accent/50">Widens or narrows Gaussian distribution tails</span>
                </div>
              </div>

              {/* Distribution Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0B3B2E" />
                    <XAxis dataKey="grade" stroke="#5EEAD4" fontSize={11} />
                    <YAxis stroke="#5EEAD4" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#06241C",
                        border: "1px solid #4ADE9A",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="adjusted" name="Students in Band" fill="#4ADE9A" radius={[6, 6, 0, 0]}>
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 6 ? "#F2705A" : index === 0 ? "#F5B942" : "#4ADE9A"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-4 border-t border-mint-400/10 flex flex-wrap items-center justify-between gap-3 text-xs text-mint-accent/70">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Gold: Outstanding (O)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-mint-400 ml-2" />
                  <span>Mint: Normal Band</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 ml-2" />
                  <span>Coral: Remediate (F)</span>
                </div>
                <span className="font-mono text-mint-300">Cohort Size: 68 Enrolled</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: ATTENDANCE EARLY WARNING FORECASTER */}
        {/* ==================================================================== */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-400" />
                    75% Attendance Risk Radar & Early Warning
                  </h2>
                  <p className="text-xs text-mint-accent/70 mt-1">
                    AI forecast predicts end-of-semester attendance based on weekday historical patterns. Flags students before they cross the mandatory 75% cutoff.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 font-semibold">
                    Cutoff: 75.0%
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-mint-400/20 text-mint-300/80 uppercase font-semibold text-[11px]">
                      <th className="pb-3 pl-3">Student Name</th>
                      <th className="pb-3">Roll No.</th>
                      <th className="pb-3">Course</th>
                      <th className="pb-3">Current Att.</th>
                      <th className="pb-3">Predicted Final</th>
                      <th className="pb-3">Risk Level</th>
                      <th className="pb-3">Recommended Intervention</th>
                      <th className="pb-3 pr-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mint-400/10">
                    {SAMPLE_AT_RISK_STUDENTS.map((s) => (
                      <tr key={s.id} className="hover:bg-darkEmerald-950/50 transition-colors">
                        <td className="py-3.5 pl-3 font-semibold text-white">{s.name}</td>
                        <td className="py-3.5 font-mono text-mint-accent/70">{s.roll}</td>
                        <td className="py-3.5 font-mono text-mint-300">{s.course}</td>
                        <td className="py-3.5 font-bold text-amber-400">{s.attendance}%</td>
                        <td className="py-3.5 font-bold text-red-400">{s.predicted}%</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.status === "Critical"
                                ? "bg-red-500/20 text-red-300 border border-red-500/40"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-mint-accent/80 text-[11px]">{s.recommended}</td>
                        <td className="py-3.5 pr-3 text-right">
                          <button
                            onClick={() => {
                              setExportNotice(`Sent academic nudge to ${s.name} (${s.roll})`);
                              setTimeout(() => setExportNotice(null), 3000);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-mint-500/20 border border-mint-400/40 text-mint-300 hover:bg-mint-500/30 text-[11px] font-semibold transition-all"
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
            <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-sky-400" />
                    Item Response Theory (IRT) Exam Question Audit
                  </h2>
                  <p className="text-xs text-mint-accent/70 mt-1">
                    Evaluates question quality, difficulty curves, and discrimination parameters. Flags ambiguous questions that penalize top students.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SAMPLE_QUESTION_AUDIT.map((q) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-darkEmerald-950/70 border border-mint-400/15 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded bg-mint-500/20 text-mint-300 font-mono text-xs font-bold">
                          {q.id}
                        </span>
                        <span className="text-xs text-mint-accent/80 font-mono">Mastery: {q.mastery}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2">{q.topic}</h3>
                      <div className="space-y-1 text-xs text-mint-accent/70">
                        <div className="flex justify-between">
                          <span>Difficulty (b):</span>
                          <span className="font-mono text-white">{q.difficulty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Discrimination (a):</span>
                          <span className="font-mono text-white">{q.discrimination}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-mint-400/10 flex items-center justify-between">
                      <span className="text-[11px] text-mint-300 font-medium">{q.status}</span>
                      <button
                        onClick={() => {
                          setExportNotice(`Calibrating item parameters for ${q.id}...`);
                          setTimeout(() => setExportNotice(null), 2500);
                        }}
                        className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
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
      </main>
    </div>
  );
}
