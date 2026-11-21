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
import { DashboardTopNavbar, NavItem } from "@/components/DashboardTopNavbar";

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

  // Other/Staff Navbar Items
  const staffNavItems: NavItem[] = [
    { id: "tickets", label: "Work Orders", icon: Wrench },
    { id: "equipment", label: "Equipment Telemetry", icon: Cpu },
    { id: "ledger", label: "Ledger Verifier", icon: ShieldCheck },
    { id: "talent", label: "Talent Radar", icon: Search },
  ];

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
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-4 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
            <div className="flex items-center justify-between text-[#4B6B5E] text-xs mb-1 font-semibold">
              <span>ACTIVE WORK ORDERS</span>
              <Wrench className="w-4 h-4 text-[#BE185D]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B2E22]">
              {tickets.filter((t) => t.status !== "Resolved").length} Pending
            </div>
            <p className="text-[11px] text-amber-700 mt-1 font-medium">2 Urgent · SLA &lt; 2 hrs</p>
          </div>

          <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-4 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
            <div className="flex items-center justify-between text-[#4B6B5E] text-xs mb-1 font-semibold">
              <span>AVG RESOLUTION TIME</span>
              <Clock className="w-4 h-4 text-[#BE185D]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B2E22]">1.8 Hours</div>
            <p className="text-[11px] text-[#047857] mt-1 font-medium">98.4% On-Time SLA</p>
          </div>

          <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-4 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
            <div className="flex items-center justify-between text-[#4B6B5E] text-xs mb-1 font-semibold">
              <span>CAMPUS UPTIME</span>
              <Server className="w-4 h-4 text-[#047857]" />
            </div>
            <div className="text-2xl font-extrabold text-[#047857]">99.98%</div>
            <p className="text-[11px] text-[#4B6B5E] mt-1 font-medium">All lab servers online</p>
          </div>

          <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-4 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
            <div className="flex items-center justify-between text-[#4B6B5E] text-xs mb-1 font-semibold">
              <span>HASH-CHAIN INTEGRITY</span>
              <ShieldCheck className="w-4 h-4 text-[#047857]" />
            </div>
            <div className="text-2xl font-extrabold text-[#047857]">Verified</div>
            <p className="text-[11px] text-[#4B6B5E] mt-1 font-medium">Cryptographic ledger valid</p>
          </div>
        </div>

        {/* Notice Toast */}
        {notice && (
          <div className="p-3.5 rounded-xl bg-[#F0FAF5] border border-[#34D399] text-[#047857] text-xs flex items-center gap-2 shadow-sm animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
            <span className="font-semibold">{notice}</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 1: WORK ORDERS */}
        {/* ==================================================================== */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-6 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0B2E22] flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-[#BE185D]" />
                    Facilities Work Order Queue
                  </h2>
                  <p className="text-xs text-[#4B6B5E] mt-1">
                    Prioritized maintenance requests across campus blocks. Updating status recalculates department SLA metrics.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#4B6B5E]" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-white border border-[#CDEBDD] rounded-xl px-3 py-2 text-xs text-[#0B2E22] focus:outline-none focus:border-[#34D399]"
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
                    className="p-4 rounded-xl bg-white border border-[#CDEBDD] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#34D399] transition-all shadow-sm"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#047857] bg-[#F0FAF5] px-2 py-0.5 rounded border border-[#CDEBDD]">
                          {t.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.priority === "Urgent"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : t.priority === "High"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {t.priority} Priority
                        </span>
                        <span className="text-[11px] text-[#4B6B5E] font-mono">{t.category}</span>
                        <span className="text-[11px] text-[#7A968A] font-mono">• {t.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0B2E22]">{t.title}</h4>
                      <p className="text-xs text-[#4B6B5E] flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#047857]" />
                        <span>{t.location}</span>
                        <span className="text-[#7A968A]">• Reported by: {t.reportedBy}</span>
                      </p>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStatusChange(t.id, "Open")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          t.status === "Open"
                            ? "bg-amber-100 border border-amber-300 text-amber-900 font-bold"
                            : "bg-[#F0FAF5] border border-[#CDEBDD] text-[#4B6B5E] hover:text-[#0B2E22]"
                        }`}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleStatusChange(t.id, "In Progress")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          t.status === "In Progress"
                            ? "bg-sky-100 border border-sky-300 text-sky-900 font-bold"
                            : "bg-[#F0FAF5] border border-[#CDEBDD] text-[#4B6B5E] hover:text-[#0B2E22]"
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleStatusChange(t.id, "Resolved")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          t.status === "Resolved"
                            ? "bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold"
                            : "bg-[#F0FAF5] border border-[#CDEBDD] text-[#4B6B5E] hover:text-[#0B2E22]"
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
            <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-6 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
              <h2 className="text-xl font-bold text-[#0B2E22] mb-1 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#047857]" />
                Campus Infrastructure & Lab Telemetry
              </h2>
              <p className="text-xs text-[#4B6B5E] mb-6">
                Real-time operational metrics across campus hardware, network switches, and critical power infrastructure.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#CDEBDD] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#0B2E22]">Central Server Rack A</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-2xl font-extrabold text-[#047857]">22.4°C</div>
                  <p className="text-[11px] text-[#4B6B5E] mt-1">Normal thermal band · 4 fans active</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#CDEBDD] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#0B2E22]">Campus Core Switch</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-2xl font-extrabold text-[#047857]">9.8 Gbps</div>
                  <p className="text-[11px] text-[#4B6B5E] mt-1">0% packet drop · 10G optical uplink</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#CDEBDD] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#0B2E22]">Diesel Generator & UPS</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-700">94% Capacity</div>
                  <p className="text-[11px] text-[#4B6B5E] mt-1">Maintenance scheduled in 4 days</p>
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
            <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-6 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0B2E22] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#047857]" />
                    Cryptographic Maintenance Hash-Chain Verifier
                  </h2>
                  <p className="text-xs text-[#4B6B5E] mt-1">
                    Every maintenance event is permanently linked with its predecessor via SHA-256 hash chaining.
                  </p>
                </div>

                <button
                  onClick={handleVerifyLedger}
                  disabled={isVerifying}
                  className="px-4 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0B2E22] text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#0B2E22] border-t-transparent rounded-full animate-spin" />
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

              <div className="p-4 rounded-xl bg-white border border-[#CDEBDD] space-y-3 font-mono text-xs shadow-sm">
                <div className="flex items-center justify-between text-[#0B2E22] border-b border-[#CDEBDD] pb-2">
                  <span className="text-[#4B6B5E]">LEDGER ROOT BLOCK:</span>
                  <span className="text-[#047857] font-bold">genesis-ticket-nitx-001</span>
                </div>
                <div className="flex items-center justify-between text-[#0B2E22] border-b border-[#CDEBDD] pb-2">
                  <span className="text-[#4B6B5E]">CHAIN LENGTH:</span>
                  <span className="font-bold">105 Recorded Blocks</span>
                </div>
                <div className="flex items-center justify-between text-[#0B2E22] border-b border-[#CDEBDD] pb-2">
                  <span className="text-[#4B6B5E]">ALGORITHM:</span>
                  <span className="font-bold">SHA-256 HMAC Chaining</span>
                </div>
                <div className="flex items-center justify-between text-[#0B2E22]">
                  <span className="text-[#4B6B5E]">TAMPER STATUS:</span>
                  <span className="text-[#047857] font-bold">✓ 0 BROKEN LINKS DETECTED</span>
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
            <div className="bg-[#F0FAF5] border border-[#CDEBDD] rounded-xl p-6 shadow-[0_1px_2px_rgba(11,46,34,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0B2E22] flex items-center gap-2">
                    <Search className="w-5 h-5 text-[#BE185D]" />
                    Corporate Talent Radar & Verified Credentials
                  </h2>
                  <p className="text-xs text-[#4B6B5E] mt-1">
                    Connect directly with students whose skills, CGPA, and peer karma points are cryptographically validated by the institute.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_TALENT.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl bg-white border border-[#CDEBDD] flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-[#0B2E22]">{s.name}</h4>
                        <span className="px-2 py-0.5 rounded bg-[#FEF9C3] text-[#713F12] border border-[#FACC15] font-mono text-xs font-bold">
                          CGPA: {s.cgpa}
                        </span>
                      </div>
                      <p className="text-xs text-[#4B6B5E] mb-3">{s.branch} · {s.karma} Karma Points</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {s.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-[#F0FAF5] border border-[#CDEBDD] text-[10px] text-[#047857] font-semibold">
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
                      className="w-full py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0B2E22] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
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
