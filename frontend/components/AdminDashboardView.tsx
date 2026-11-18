"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Users,
  ShieldCheck,
  Award,
  DollarSign,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Download,
  LogOut,
  Sparkles,
  Layers,
  FileBadge2,
  Clock,
  Check,
  TrendingUp,
  Cpu,
  Lock,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const SAMPLE_PO_DATA = [
  { po: "PO1: Engg Knowledge", target: 80, attained: 84 },
  { po: "PO2: Problem Analysis", target: 75, attained: 79 },
  { po: "PO3: Design/Dev", target: 75, attained: 78 },
  { po: "PO4: Complex Problems", target: 70, attained: 72 },
  { po: "PO5: Modern Tool Usage", target: 80, attained: 88 },
  { po: "PO6: Engineer & Society", target: 70, attained: 74 },
  { po: "PO7: Environment", target: 75, attained: 77 },
  { po: "PO8: Ethics", target: 85, attained: 91 },
  { po: "PO9: Teamwork", target: 80, attained: 86 },
  { po: "PO10: Communication", target: 75, attained: 82 },
  { po: "PO11: Project Mgmt", target: 70, attained: 73 },
  { po: "PO12: Life-long Learn", target: 80, attained: 85 },
];

const SAMPLE_AUDIT_LOGS = [
  { id: "LOG-1092", action: "GRADE_MODIFICATION", actor: "prof.vikram@nitx.demo", target: "CS201 Cohort Marks", hash: "9a2f7...8e11", verified: true, time: "10 mins ago" },
  { id: "LOG-1091", action: "SLA_TICKET_RESOLVED", actor: "tech.sunil@nitx.demo", target: "TKT-101: Lab 3 AC Fault", hash: "4d7c1...3a99", verified: true, time: "25 mins ago" },
  { id: "LOG-1090", action: "ATTENDANCE_OVERRIDE", actor: "dean.academics@nitx.demo", target: "Medical Leave Approved (usr-044)", hash: "7b1a4...6f22", verified: true, time: "1 hour ago" },
  { id: "LOG-1089", action: "TIER_UPGRADE", actor: "admin@nitx.demo", target: "NITX upgraded to Autonomous Enterprise", hash: "1c3d9...0e44", verified: true, time: "3 hours ago" },
];

const TIERS = [
  {
    key: "core",
    name: "Core Campus",
    price: 0,
    desc: "Essential academics, attendance forecaster, and basic peer study matcher.",
    features: ["Relative grading sandbox", "75% Attendance forecaster", "Peer study matcher", "Community forums"],
  },
  {
    key: "cognitive",
    name: "Cognitive Intelligence",
    price: 14,
    desc: "BKT mastery diagnostics, NBA/NAAC outcome engine, and recruiter marketplace.",
    features: ["Everything in Core", "BKT Knowledge graph diagnostics", "NBA Criteria 3 evidence matrix", "Corporate Recruiter talent radar"],
  },
  {
    key: "autonomous_enterprise",
    name: "Autonomous Enterprise",
    price: 28,
    desc: "Full institutional OS, zero-knowledge blind grievances, and hash-chained audit ledgers.",
    features: ["Everything in Cognitive", "ZK Cryptographic grievance reporting", "Tamper-evident facilities ledger", "Multi-campus tenant governance"],
  },
];

export function AdminDashboardView() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "billing" | "nba" | "audit">("overview");
  const [currentTier, setCurrentTier] = useState("autonomous_enterprise");
  const [studentCount, setStudentCount] = useState(200);
  const [notice, setNotice] = useState<string | null>(null);

  // ARR Calculation
  const selectedTierObj = TIERS.find((t) => t.key === currentTier) || TIERS[2];
  const estimatedARR = studentCount * selectedTierObj.price;

  const handleTierSwitch = (tierKey: string) => {
    setCurrentTier(tierKey);
    setNotice(`Updated campus plan to ${TIERS.find((t) => t.key === tierKey)?.name}! ARR recalculated.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleExportAccreditation = () => {
    setNotice("Exporting NBA Criterion 3 & NAAC Self-Study Report (SSR) bundle with digital signatures...");
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#041913] via-[#06241C] to-[#0A3427] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-mint-400/15 backdrop-blur-xl bg-darkEmerald-950/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-mint-400/20">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                ADMINISTRATION CONSOLE
              </span>
              <span className="text-xs text-mint-accent/60">Northstar Institute (NITX) · Enterprise Tenant</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">{user?.full_name || "Campus Administrator"}</span>
              <span className="text-[11px] text-amber-400 font-mono">{user?.email || "admin@nitx.demo"}</span>
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
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-mint-accent/70 text-xs mb-1">
              <span>ENROLLED STUDENTS</span>
              <Users className="w-4 h-4 text-mint-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">200 Students</div>
            <p className="text-[11px] text-mint-400 mt-1">CSE: 120 | ECE: 80</p>
          </div>

          <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-mint-accent/70 text-xs mb-1">
              <span>ACTIVE FACULTY</span>
              <Award className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">14 Faculty</div>
            <p className="text-[11px] text-sky-300 mt-1">100% Syllabus on Track</p>
          </div>

          <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-mint-accent/70 text-xs mb-1">
              <span>ANNUAL ESTIMATED ARR</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400">
              ${estimatedARR.toLocaleString()}
            </div>
            <p className="text-[11px] text-amber-300/80 mt-1">Autonomous Enterprise Plan</p>
          </div>

          <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-mint-accent/70 text-xs mb-1">
              <span>NAAC READINESS</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-mint-300">88.4% (A++)</div>
            <p className="text-[11px] text-emerald-400 mt-1">Criterion 3 PO Target Met</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1 bg-darkEmerald-950/70 border border-mint-400/20 rounded-2xl max-w-2xl">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === "overview"
                ? "bg-mint-400 text-darkEmerald-950 shadow-[0_0_15px_rgba(74,222,154,0.3)]"
                : "text-mint-accent/70 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Campus Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === "billing"
                ? "bg-mint-400 text-darkEmerald-950 shadow-[0_0_15px_rgba(74,222,154,0.3)]"
                : "text-mint-accent/70 hover:text-white"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Tenant Billing & ARR</span>
          </button>
          <button
            onClick={() => setActiveTab("nba")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === "nba"
                ? "bg-mint-400 text-darkEmerald-950 shadow-[0_0_15px_rgba(74,222,154,0.3)]"
                : "text-mint-accent/70 hover:text-white"
            }`}
          >
            <FileBadge2 className="w-3.5 h-3.5" />
            <span>NBA / NAAC Outcomes</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === "audit"
                ? "bg-mint-400 text-darkEmerald-950 shadow-[0_0_15px_rgba(74,222,154,0.3)]"
                : "text-mint-accent/70 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Ledger</span>
          </button>
        </div>

        {/* Notice Toast */}
        {notice && (
          <div className="p-3.5 rounded-xl bg-mint-500/15 border border-mint-400/40 text-mint-300 text-xs flex items-center gap-2 shadow-lg animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-mint-400 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ==================================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Institutional Health */}
              <div className="lg:col-span-2 bg-darkEmerald-900/60 border border-mint-400/20 rounded-3xl p-6 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-mint-400" />
                  Campus Performance Velocity
                </h3>
                <p className="text-xs text-mint-accent/70 mb-6">
                  Aggregate attainment trends across 5 core engineering courses for the active semester.
                </p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "CS201", pass: 92, target: 85 },
                        { name: "CS301", pass: 88, target: 80 },
                        { name: "CS401", pass: 96, target: 85 },
                        { name: "EC201", pass: 84, target: 80 },
                        { name: "EC301", pass: 90, target: 85 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#0B3B2E" />
                      <XAxis dataKey="name" stroke="#5EEAD4" fontSize={11} />
                      <YAxis stroke="#5EEAD4" fontSize={11} domain={[60, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#06241C",
                          border: "1px solid #4ADE9A",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="pass" name="Pass Attainment %" fill="#4ADE9A" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="target" name="NBA Target %" fill="#F5B942" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Campus Governance Status */}
              <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    Governance Health
                  </h3>
                  <p className="text-xs text-mint-accent/70 mb-4">
                    Active compliance checks across data residency and ethical AI protocols.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-darkEmerald-950/70 border border-mint-400/15 flex items-center justify-between">
                      <span className="text-xs font-medium">Bcrypt Password Hashes</span>
                      <span className="text-[10px] font-bold text-mint-400 font-mono">100% ENFORCED</span>
                    </div>
                    <div className="p-3 rounded-xl bg-darkEmerald-950/70 border border-mint-400/15 flex items-center justify-between">
                      <span className="text-xs font-medium">ZK Anonymous Reports</span>
                      <span className="text-[10px] font-bold text-mint-400 font-mono">ACTIVE (0 Leaks)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-darkEmerald-950/70 border border-mint-400/15 flex items-center justify-between">
                      <span className="text-xs font-medium">Work Order Hash Chains</span>
                      <span className="text-[10px] font-bold text-mint-400 font-mono">VALID (SHA-256)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-darkEmerald-950/70 border border-mint-400/15 flex items-center justify-between">
                      <span className="text-xs font-medium">Multi-Tenant Isolation</span>
                      <span className="text-[10px] font-bold text-mint-400 font-mono">NITX SECURE</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-mint-400/15 text-xs text-mint-accent/60">
                  Tenant ID: <span className="font-mono text-mint-300">northstar</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: TENANT BILLING & ARR CALCULATOR */}
        {/* ==================================================================== */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    Multi-Tenant Billing & Plan Calculator
                  </h2>
                  <p className="text-xs text-mint-accent/70 mt-1">
                    Calculate institutional licensing and switch active subscription tier.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-mint-accent/70">Estimated ARR:</span>
                  <div className="text-2xl font-extrabold text-amber-400">${estimatedARR.toLocaleString()} / yr</div>
                </div>
              </div>

              {/* Student Count Slider */}
              <div className="p-4 rounded-2xl bg-darkEmerald-950/70 border border-mint-400/15 mb-6">
                <div className="flex items-center justify-between text-xs font-medium text-mint-200 mb-2">
                  <span>Billable Student Count:</span>
                  <span className="font-mono text-mint-400 font-bold">{studentCount} Students</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={studentCount}
                  onChange={(e) => setStudentCount(parseInt(e.target.value))}
                  className="w-full accent-mint-400 cursor-pointer"
                />
                <span className="text-[10px] text-mint-accent/50">Current campus enrollment: 200 enrolled</span>
              </div>

              {/* Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TIERS.map((tier) => {
                  const isCurrent = currentTier === tier.key;
                  return (
                    <div
                      key={tier.key}
                      className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                        isCurrent
                          ? "bg-darkEmerald-950/90 border-mint-400 shadow-[0_0_25px_rgba(74,222,154,0.2)]"
                          : "bg-darkEmerald-950/50 border-mint-400/15 hover:border-mint-400/30"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base font-bold text-white">{tier.name}</h3>
                          {isCurrent && (
                            <span className="px-2.5 py-0.5 rounded-full bg-mint-500/20 text-mint-300 text-[10px] font-bold border border-mint-400/40">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-mint-accent/70 mb-4">{tier.desc}</p>
                        <div className="mb-4">
                          <span className="text-2xl font-extrabold text-white">
                            {tier.price === 0 ? "Free" : `$${tier.price}`}
                          </span>
                          {tier.price > 0 && <span className="text-xs text-mint-accent/60"> / student / yr</span>}
                        </div>
                        <div className="space-y-2 mb-6">
                          {tier.features.map((f, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-mint-200">
                              <Check className="w-3.5 h-3.5 text-mint-400 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleTierSwitch(tier.key)}
                        disabled={isCurrent}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isCurrent
                            ? "bg-darkEmerald-900 text-mint-400/60 cursor-default"
                            : "btn-mint-primary shadow-lg shadow-mint-500/20"
                        }`}
                      >
                        {isCurrent ? "Current Campus Plan" : "Switch to " + tier.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: NBA / NAAC OUTCOMES */}
        {/* ==================================================================== */}
        {activeTab === "nba" && (
          <div className="space-y-6">
            <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileBadge2 className="w-5 h-5 text-emerald-400" />
                    NBA Criterion 3 & NAAC Outcome Evidence Engine
                  </h2>
                  <p className="text-xs text-mint-accent/70 mt-1">
                    Continuous mapping of Course Outcomes (COs) to Program Outcomes (POs 1–12). Direct evidence generation for accreditation audits.
                  </p>
                </div>
                <button
                  onClick={handleExportAccreditation}
                  className="px-4 py-2 rounded-xl bg-mint-500/20 border border-mint-400/40 text-mint-300 hover:bg-mint-500/30 text-xs font-semibold flex items-center gap-2 transition-all self-start"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Evidence Bundle (PDF)</span>
                </button>
              </div>

              {/* Radar Chart */}
              <div className="h-80 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={SAMPLE_PO_DATA}>
                    <PolarGrid stroke="#0B3B2E" />
                    <PolarAngleAxis dataKey="po" stroke="#5EEAD4" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[50, 100]} stroke="#0B3B2E" />
                    <Radar name="Target %" dataKey="target" stroke="#F5B942" fill="#F5B942" fillOpacity={0.2} />
                    <Radar name="Attained %" dataKey="attained" stroke="#4ADE9A" fill="#4ADE9A" fillOpacity={0.4} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#06241C",
                        border: "1px solid #4ADE9A",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Outcomes Matrix Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {SAMPLE_PO_DATA.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-darkEmerald-950/70 border border-mint-400/15">
                    <div className="text-xs font-semibold text-white truncate">{p.po}</div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-mint-accent/60">Target: {p.target}%</span>
                      <span className="font-bold text-mint-400">{p.attained}%</span>
                    </div>
                    <div className="w-full bg-darkEmerald-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-mint-400 h-full rounded-full"
                        style={{ width: `${(p.attained / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: AUDIT LEDGER */}
        {/* ==================================================================== */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-amber-400" />
                    Tamper-Evident System Audit Ledger
                  </h2>
                  <p className="text-xs text-mint-accent/70 mt-1">
                    Cryptographic SHA-256 hash-chaining records every grade adjustment, attendance override, and facility triage for independent verifiability.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-mint-400/20 text-mint-300/80 uppercase font-semibold text-[11px]">
                      <th className="pb-3 pl-3">Log ID</th>
                      <th className="pb-3">Action Type</th>
                      <th className="pb-3">Actor</th>
                      <th className="pb-3">Target / Description</th>
                      <th className="pb-3">Hash Digest</th>
                      <th className="pb-3">Integrity</th>
                      <th className="pb-3 pr-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mint-400/10">
                    {SAMPLE_AUDIT_LOGS.map((log) => (
                      <tr key={log.id} className="hover:bg-darkEmerald-950/50 transition-colors">
                        <td className="py-3.5 pl-3 font-mono text-mint-300 font-bold">{log.id}</td>
                        <td className="py-3.5 font-semibold text-white">{log.action}</td>
                        <td className="py-3.5 font-mono text-mint-accent/80">{log.actor}</td>
                        <td className="py-3.5 text-white/90">{log.target}</td>
                        <td className="py-3.5 font-mono text-mint-400/80 text-[11px]">{log.hash}</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                            ✓ VERIFIED
                          </span>
                        </td>
                        <td className="py-3.5 pr-3 text-right text-mint-accent/60 font-mono text-[11px]">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
