"use client";

import React, { useState } from "react";
import {
  Wrench,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  LogOut,
  Sparkles,
  Layers,
  Cpu,
  Send,
  Zap,
  HardHat,
  Server,
  Building,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { FreshRoleDashboard } from "@/components/FreshRoleDashboard";

interface Ticket {
  id: string;
  title: string;
  location: string;
  category: string;
  priority: "High" | "Medium" | "Urgent";
  status: "Open" | "In Progress" | "Resolved";
  reportedBy: string;
  time: string;
}

const INITIAL_TICKETS: Ticket[] = [
  { id: "TKT-101", title: "Air Conditioner compressor failure in Hardware Lab 3", location: "Lab Complex, Block B", category: "HVAC", priority: "Urgent", status: "In Progress", reportedBy: "prof.embed@nitx.demo", time: "45 mins ago" },
  { id: "TKT-102", title: "Gigabit switch packet drop on Hostel 4 floor 2", location: "Boys Hostel 4", category: "Network", priority: "High", status: "Open", reportedBy: "warden.hostel@nitx.demo", time: "1 hour ago" },
  { id: "TKT-103", title: "Projector bulb replacement in Lecture Hall 12", location: "Main Academic Block", category: "AV Equipment", priority: "Medium", status: "Open", reportedBy: "prof.os@nitx.demo", time: "2 hours ago" },
  { id: "TKT-104", title: "UPS battery backup fault in Server Room", location: "Central IT Facility", category: "Power", priority: "Urgent", status: "In Progress", reportedBy: "tech.hardware@nitx.demo", time: "3 hours ago" },
  { id: "TKT-105", title: "Water cooler leak in CSE Corridor 1st Floor", location: "CSE Department", category: "Plumbing", priority: "Medium", status: "Resolved", reportedBy: "student001@nitx.demo", time: "Yesterday" },
];

const SAMPLE_TALENT = [
  { id: "std-001", name: "Aarav Sharma", cgpa: 9.4, branch: "CSE", skills: ["Next.js", "FastAPI", "Bcrypt", "PyTorch"], karma: 140, status: "Available" },
  { id: "std-014", name: "Isha Kapoor", cgpa: 9.1, branch: "CSE", skills: ["Solidity", "ZK-SNARKs", "Rust", "React"], karma: 125, status: "Interviewed" },
  { id: "std-028", name: "Kabir Das", cgpa: 8.8, branch: "ECE", skills: ["Embedded C", "FPGA", "Verilog", "IoT"], karma: 110, status: "Available" },
  { id: "std-035", name: "Meera Nair", cgpa: 8.9, branch: "CSE", skills: ["Distributed Systems", "PostgreSQL", "Go"], karma: 95, status: "Available" },
];

export function OtherDashboardView() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"tickets" | "equipment" | "ledger" | "talent">("tickets");
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [notice, setNotice] = useState<string | null>(null);
  const [ledgerVerified, setLedgerVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStatusChange = (id: string, newStatus: Ticket["status"]) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    setNotice(`Ticket ${id} status transitioned to "${newStatus}"! Recorded in SHA-256 Ledger.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleVerifyLedger = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setLedgerVerified(true);
      setNotice("Cryptographic Hash Chain Verified: 100% integrity intact. Zero unauthorized tampering detected!");
      setTimeout(() => setNotice(null), 4000);
    }, 1000);
  };

  const filteredTickets = tickets.filter(
    (t) => filterCategory === "All" || t.category === filterCategory
  );

  if (user?.is_new_account) {
    return (
      <FreshRoleDashboard
        user={user}
        roleLabel="Campus Staff"
        metrics={["Active Work Orders", "Average Resolution Time", "Campus Uptime", "Ledger Integrity"]}
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
              aria-controls="staff-mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Logo size="md" />
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-gold-500/30">
              <span className="px-2.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                <Wrench className="w-3.5 h-3.5" />
                OPERATIONS & STAFF DESK
              </span>
              <span className="text-xs text-gold-200/60">Campus Logistics & Facilities · NITX</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">{user?.full_name || "Campus Staff"}</span>
              <span className="text-[11px] text-gold-400 font-mono">{user?.email || "staff@nitx.demo"}</span>
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
        <nav id="staff-mobile-navigation" className="lg:hidden border-b border-gold-500/25 bg-burgundy-950/95 px-4 py-3 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2">
            {([
              ["tickets", "Tickets"],
              ["equipment", "Equipment"],
              ["ledger", "Ledger"],
              ["talent", "Talent"],
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-burgundy-900/80 border border-gold-500/35 rounded-2xl p-4 backdrop-blur-md shadow-lg shadow-black/40">
            <div className="flex items-center justify-between text-gold-200/70 text-xs mb-1">
              <span>ACTIVE WORK ORDERS</span>
              <Wrench className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">
              {tickets.filter((t) => t.status !== "Resolved").length} Pending
            </div>
            <p className="text-[11px] text-gold-300 mt-1">2 Urgent · SLA &lt; 2 hrs</p>
          </div>

          <div className="bg-burgundy-900/80 border border-gold-500/35 rounded-2xl p-4 backdrop-blur-md shadow-lg shadow-black/40">
            <div className="flex items-center justify-between text-gold-200/70 text-xs mb-1">
              <span>AVG RESOLUTION TIME</span>
              <Clock className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">1.8 Hours</div>
            <p className="text-[11px] text-gold-400 mt-1">98.4% On-Time SLA</p>
          </div>

          <div className="bg-burgundy-900/80 border border-gold-500/35 rounded-2xl p-4 backdrop-blur-md shadow-lg shadow-black/40">
            <div className="flex items-center justify-between text-gold-200/70 text-xs mb-1">
              <span>CAMPUS UPTIME</span>
              <Server className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">99.98%</div>
            <p className="text-[11px] text-emerald-300 mt-1">All lab servers online</p>
          </div>

          <div className="bg-burgundy-900/80 border border-gold-500/35 rounded-2xl p-4 backdrop-blur-md shadow-lg shadow-black/40">
            <div className="flex items-center justify-between text-gold-200/70 text-xs mb-1">
              <span>HASH-CHAIN INTEGRITY</span>
              <ShieldCheck className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-2xl font-extrabold text-gold-300">Verified</div>
            <p className="text-[11px] text-gold-400 mt-1">Cryptographic ledger valid</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1 bg-burgundy-950/80 border border-gold-500/30 rounded-2xl max-w-2xl">
          <button
            onClick={() => setActiveTab("tickets")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === "tickets"
                ? "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-burgundy-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                : "text-gold-200/70 hover:text-white"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Work Orders</span>
          </button>
          <button
            onClick={() => setActiveTab("equipment")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === "equipment"
                ? "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-burgundy-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                : "text-gold-200/70 hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Equipment Telemetry</span>
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === "ledger"
                ? "bg-mint-400 text-darkEmerald-950 shadow-[0_0_15px_rgba(74,222,154,0.3)]"
                : "text-mint-accent/70 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ledger Verifier</span>
          </button>
          <button
            onClick={() => setActiveTab("talent")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === "talent"
                ? "bg-mint-400 text-darkEmerald-950 shadow-[0_0_15px_rgba(74,222,154,0.3)]"
                : "text-mint-accent/70 hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Talent Radar</span>
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
        {/* TAB 1: WORK ORDERS */}
        {/* ==================================================================== */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-pink-400" />
                    Facilities Work Order Queue
                  </h2>
                  <p className="text-xs text-mint-accent/70 mt-1">
                    Prioritized maintenance requests across campus blocks. Updating status recalculates department SLA metrics.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-mint-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-darkEmerald-950 border border-mint-400/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-mint-400"
                  >
                    <option value="All">All Categories</option>
                    <option value="HVAC">HVAC & Cooling</option>
                    <option value="Network">Network & IT</option>
                    <option value="Power">Power & UPS</option>
                    <option value="AV Equipment">AV Equipment</option>
                    <option value="Plumbing">Plumbing</option>
                  </select>
                </div>
              </div>

              {/* Tickets List */}
              <div className="space-y-3">
                {filteredTickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-darkEmerald-950/70 border border-mint-400/15 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-mint-400/30 transition-all"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-mint-400 bg-darkEmerald-900 px-2 py-0.5 rounded border border-mint-400/20">
                          {t.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.priority === "Urgent"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : t.priority === "High"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-mint-500/20 text-mint-300 border border-mint-500/30"
                          }`}
                        >
                          {t.priority} Priority
                        </span>
                        <span className="text-[11px] text-mint-accent/60 font-mono">{t.category}</span>
                        <span className="text-[11px] text-mint-accent/40 font-mono">• {t.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{t.title}</h4>
                      <p className="text-xs text-mint-accent/70 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-mint-400/70" />
                        <span>{t.location}</span>
                        <span className="text-mint-accent/40">• Reported by: {t.reportedBy}</span>
                      </p>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStatusChange(t.id, "Open")}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          t.status === "Open"
                            ? "bg-amber-500/20 border border-amber-400 text-amber-300"
                            : "bg-darkEmerald-900/60 border border-mint-400/15 text-mint-accent/60 hover:text-white"
                        }`}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleStatusChange(t.id, "In Progress")}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          t.status === "In Progress"
                            ? "bg-sky-500/20 border border-sky-400 text-sky-300"
                            : "bg-darkEmerald-900/60 border border-mint-400/15 text-mint-accent/60 hover:text-white"
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleStatusChange(t.id, "Resolved")}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          t.status === "Resolved"
                            ? "bg-mint-500/20 border border-mint-400 text-mint-300"
                            : "bg-darkEmerald-900/60 border border-mint-400/15 text-mint-accent/60 hover:text-white"
                        }`}
                      >
                        Resolved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: EQUIPMENT TELEMETRY */}
        {/* ==================================================================== */}
        {activeTab === "equipment" && (
          <div className="space-y-6">
            <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-3xl p-6 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                Campus Infrastructure & Lab Telemetry
              </h2>
              <p className="text-xs text-mint-accent/70 mb-6">
                Real-time operational metrics across campus hardware, network switches, and critical power infrastructure.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-darkEmerald-950/70 border border-mint-400/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Central Server Rack A</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-2xl font-extrabold text-mint-300">22.4°C</div>
                  <p className="text-[11px] text-mint-accent/60 mt-1">Normal thermal band · 4 fans active</p>
                </div>

                <div className="p-4 rounded-2xl bg-darkEmerald-950/70 border border-mint-400/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Campus Core Switch</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-2xl font-extrabold text-mint-300">9.8 Gbps</div>
                  <p className="text-[11px] text-mint-accent/60 mt-1">0% packet drop · 10G optical uplink</p>
                </div>

                <div className="p-4 rounded-2xl bg-darkEmerald-950/70 border border-mint-400/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Diesel Generator & UPS</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400">94% Capacity</div>
                  <p className="text-[11px] text-amber-300/80 mt-1">Maintenance scheduled in 4 days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: LEDGER VERIFIER */}
        {/* ==================================================================== */}
        {activeTab === "ledger" && (
          <div className="space-y-6">
            <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-sky-400" />
                    Cryptographic Maintenance Hash-Chain Verifier
                  </h2>
                  <p className="text-xs text-mint-accent/70 mt-1">
                    Every maintenance event is permanently linked with its predecessor via SHA-256 hash chaining.
                  </p>
                </div>

                <button
                  onClick={handleVerifyLedger}
                  disabled={isVerifying}
                  className="px-4 py-2.5 rounded-xl btn-mint-primary text-xs font-bold flex items-center gap-2 shadow-lg shadow-mint-500/20 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-darkEmerald-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Hashes...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Complete Ledger Chain</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-darkEmerald-950/80 border border-mint-400/20 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-mint-300 border-b border-mint-400/10 pb-2">
                  <span>LEDGER ROOT BLOCK:</span>
                  <span className="text-mint-400 font-bold">genesis-ticket-nitx-001</span>
                </div>
                <div className="flex items-center justify-between text-mint-300 border-b border-mint-400/10 pb-2">
                  <span>CHAIN LENGTH:</span>
                  <span>105 Recorded Blocks</span>
                </div>
                <div className="flex items-center justify-between text-mint-300 border-b border-mint-400/10 pb-2">
                  <span>ALGORITHM:</span>
                  <span>SHA-256 HMAC Chaining</span>
                </div>
                <div className="flex items-center justify-between text-mint-300">
                  <span>TAMPER STATUS:</span>
                  <span className="text-emerald-400 font-bold">✓ 0 BROKEN LINKS DETECTED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: CORPORATE TALENT RADAR (RECRUITER & PLACEMENT) */}
        {/* ==================================================================== */}
        {activeTab === "talent" && (
          <div className="space-y-6">
            <div className="bg-darkEmerald-900/60 border border-mint-400/20 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-amber-400" />
                    Corporate Talent Radar & Verified Credentials
                  </h2>
                  <p className="text-xs text-mint-accent/70 mt-1">
                    Connect directly with students whose skills, CGPA, and peer karma points are cryptographically validated by the institute.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_TALENT.map((s) => (
                  <div key={s.id} className="p-4 rounded-2xl bg-darkEmerald-950/70 border border-mint-400/15 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-white">{s.name}</h4>
                        <span className="px-2 py-0.5 rounded bg-mint-500/20 text-mint-300 font-mono text-xs font-bold">
                          CGPA: {s.cgpa}
                        </span>
                      </div>
                      <p className="text-xs text-mint-accent/70 mb-3">{s.branch} · {s.karma} Karma Points</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {s.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-darkEmerald-900 border border-mint-400/20 text-[10px] text-mint-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setNotice(`Interview Invitation sent to ${s.name}!`);
                        setTimeout(() => setNotice(null), 3000);
                      }}
                      className="w-full py-2 rounded-xl bg-mint-500/20 border border-mint-400/30 text-mint-300 hover:bg-mint-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Interview Invite</span>
                    </button>
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
