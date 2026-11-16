"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Role,
  User,
  StudentScore,
  Ticket,
  AuditLogEntry,
  GradeContest,
  GradeCutoffs,
} from "@/lib/types";
import { DEMO_USERS } from "@/data/seed";
import { campusRepository } from "@/lib/repository";
import { Logo } from "@/components/Logo";
import { StudentConsentModal } from "@/components/StudentConsentModal";
import { LandingPageView } from "@/components/LandingPageView";
import { MasteryMapModule } from "@/components/MasteryMapModule";
import { GradingSandboxModule } from "@/components/GradingSandboxModule";
import { TicketDeskModule } from "@/components/TicketDeskModule";
import { AuditLogView } from "@/components/AuditLogView";
import { AboutRoadmapView } from "@/components/AboutRoadmapView";
import {
  Brain,
  BarChart3,
  Wrench,
  History,
  Compass,
  LogOut,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  User as UserIcon,
  Shield,
  Layers,
  ChevronDown,
} from "lucide-react";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"mastery" | "grading" | "tickets" | "audit" | "about">("mastery");
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [hasStudentConsent, setHasStudentConsent] = useState<boolean>(false);
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);

  // Repository Data States
  const [students, setStudents] = useState<StudentScore[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [contests, setContests] = useState<GradeContest[]>([]);
  const [notice, setNotice] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Notification helper
  const notify = useCallback((text: string, type: "success" | "error" | "info" = "info") => {
    setNotice({ text, type });
    window.setTimeout(() => setNotice(null), 4500);
  }, []);

  // Hydrate from localStorage / repository
  const loadData = useCallback(async () => {
    try {
      const [stu, tkt, logs, cnt] = await Promise.all([
        campusRepository.getStudents(),
        campusRepository.getTickets(),
        campusRepository.getAuditLogs(),
        campusRepository.getContests(),
      ]);
      setStudents(stu);
      setTickets(tkt);
      setAuditLogs(logs);
      setContests(cnt);
    } catch (e) {
      console.error("Error loading repository data:", e);
    }
  }, []);

  useEffect(() => {
    void loadData();

    // Check stored user session
    const savedUser = localStorage.getItem("cn_user_session");
    const consent = localStorage.getItem("cn_student_consent");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser) as User;
        setCurrentUser(u);
        setShowLanding(false);
        // Default tab by role
        if (u.role === "student") setActiveTab("mastery");
        else if (u.role === "professor") setActiveTab("grading");
        else if (u.role === "admin") setActiveTab("tickets");
      } catch {
        localStorage.removeItem("cn_user_session");
      }
    }
    if (consent === "true") {
      setHasStudentConsent(true);
    }
  }, [loadData]);

  // Handle Login
  const handleLoginAs = (role: Role) => {
    const user = DEMO_USERS[role];
    setCurrentUser(user);
    localStorage.setItem("cn_user_session", JSON.stringify(user));
    setShowLanding(false);

    // Route according to role
    if (role === "student") {
      setActiveTab("mastery");
      const consent = localStorage.getItem("cn_student_consent");
      if (consent !== "true") {
        setShowConsentModal(true);
      }
    } else if (role === "professor") {
      setActiveTab("grading");
    } else if (role === "admin") {
      setActiveTab("tickets");
    }

    notify(`Logged in as ${user.name} (${role.toUpperCase()})`, "success");
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("cn_user_session");
    setCurrentUser(null);
    setShowLanding(true);
    notify("Signed out. Returned to landing overview.", "info");
  };

  // Handle Student Consent Acceptance
  const handleAcceptConsent = () => {
    localStorage.setItem("cn_student_consent", "true");
    setHasStudentConsent(true);
    setShowConsentModal(false);
    notify("Student data consent verified. Access granted to diagnostic layer.", "success");
  };

  // Reset Demo Data
  const handleResetData = async () => {
    await campusRepository.resetDemoData();
    await loadData();
    notify("Demo data restored to original seed baseline.", "success");
  };

  // Grade Sandbox Actions
  const handleApplyCutoffs = async (
    cutoffs: GradeCutoffs,
    mode: "fixed" | "gap-aware" | "custom",
    reason: string
  ) => {
    if (!currentUser) return;
    await campusRepository.setCutoffs(cutoffs, mode, currentUser.name, reason);
    await loadData();
  };

  const handleQuestionAction = async (qId: string, action: "nullify" | "grace", marks: number = 2) => {
    if (!currentUser) return;
    await campusRepository.updateQuestion(
      qId,
      {
        status: action === "nullify" ? "nullified" : "grace",
        graceMarks: action === "grace" ? marks : 0,
        flagged: false,
      },
      currentUser.name
    );
    await loadData();
  };

  const handleContestGrade = async (reason: string) => {
    if (!currentUser) return;
    await campusRepository.createContest({
      studentId: currentUser.studentId || "STU-2026-042",
      studentName: currentUser.name,
      courseId: "CS301",
      courseName: "Operating Systems",
      currentGrade: "B+",
      requestedGrade: "A-",
      reason,
    });
    await loadData();
  };

  const handleResolveContest = async (contestId: string, status: "approved" | "rejected", response?: string) => {
    await campusRepository.resolveContest(contestId, status, response);
    await loadData();
  };

  // Ticket Desk Actions
  const handleNewTicket = (params: {
    place: string;
    locationType: "lab" | "hostel" | "classroom" | "other";
    text: string;
    imageUrl?: string;
  }) => {
    // Synchronous mock for instant state responsiveness
    const result = {
      isDuplicate: false,
      matchedTicketId: undefined as string | undefined,
      similarityScore: 0,
    };

    void campusRepository
      .createTicket({
        studentId: currentUser?.studentId || "STU-2026-042",
        studentName: currentUser?.name || "Student (Demo Account)",
        ...params,
      })
      .then((res) => {
        result.isDuplicate = res.isDuplicate;
        result.matchedTicketId = res.matchedTicketId;
        void loadData();
      });

    return result;
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: Ticket["status"]) => {
    await campusRepository.updateTicketStatus(ticketId, status);
    await loadData();
    notify(`Ticket ${ticketId} updated to ${status}.`, "success");
  };

  const handleSimulateTime = async (hours: number) => {
    await campusRepository.simulateTimeForward(hours);
    await loadData();
  };

  // If user is not logged in or chose to see Landing Page
  if (showLanding || !currentUser) {
    return (
      <>
        <LandingPageView
          onSelectRole={(r) => handleLoginAs(r)}
          onOpenAbout={() => {
            handleLoginAs("student");
            setActiveTab("about");
          }}
        />
        {/* Notice toast */}
        {notice && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-plum-900 border border-pink-primary/40 text-xs font-semibold text-white shadow-2xl animate-in slide-in-from-bottom-2">
            <span>{notice.text}</span>
            <button onClick={() => setNotice(null)} className="ml-2 text-pink-light hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </>
    );
  }

  // Active role-filtered tabs
  const isStudent = currentUser.role === "student";
  const isProfessor = currentUser.role === "professor";
  const isAdmin = currentUser.role === "admin";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-plum-950 text-white">
      {/* Student Consent Modal */}
      <StudentConsentModal
        isOpen={showConsentModal && isStudent}
        onAccept={handleAcceptConsent}
      />

      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-plum-950/90 border-b border-pink-primary/25 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowLanding(true)} title="View Landing Page">
              <Logo size="sm" showTagline={false} />
            </button>
            <div className="h-5 w-px bg-plum-800 hidden sm:block" />
            <span className="text-xs font-semibold text-amber-secondary hidden sm:inline">
              Operating Systems (CS301)
            </span>
          </div>

          {/* Persona Indicator & Actions */}
          <div className="flex items-center gap-3">
            {/* 1-Click Role Switcher Pill */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-plum-900 border border-pink-primary/20 text-xs">
              <span className="text-[10px] uppercase font-bold text-pink-light/60 pl-2">Switch:</span>
              <button
                onClick={() => handleLoginAs("student")}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${isStudent ? "bg-pink-primary text-plum-950 font-black shadow" : "text-pink-light hover:text-white"}`}
              >
                Student
              </button>
              <button
                onClick={() => handleLoginAs("professor")}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${isProfessor ? "bg-amber-secondary text-plum-950 font-black shadow" : "text-pink-light hover:text-white"}`}
              >
                Professor
              </button>
              <button
                onClick={() => handleLoginAs("admin")}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${isAdmin ? "bg-sky-info text-plum-950 font-black shadow" : "text-pink-light hover:text-white"}`}
              >
                Admin
              </button>
            </div>

            {/* User Badge */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-7 h-7 rounded-lg bg-pink-primary/20 text-pink-primary flex items-center justify-center font-bold text-xs border border-pink-primary/30">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] font-semibold text-pink-light/70 uppercase">{currentUser.role}</div>
              </div>
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={handleResetData}
              className="p-1.5 rounded-lg bg-plum-900 hover:bg-plum-800 text-pink-light/80 hover:text-white border border-plum-800 transition-all"
              title="Reset Demo Data to Seed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-plum-900 hover:bg-plum-800 text-coral-weak hover:text-red-400 border border-plum-800 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Role Navigation Tabs */}
      <nav className="w-full bg-plum-900/60 border-b border-plum-800 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
          {/* Module 1: Mastery Map (Available to Student & Professor) */}
          {(isStudent || isProfessor) && (
            <button
              onClick={() => setActiveTab("mastery")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "mastery" ? "bg-pink-primary text-plum-950 shadow-[0_0_15px_rgba(242,139,168,0.4)]" : "text-pink-light/80 hover:text-white hover:bg-plum-800"}`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Module 1 · Mastery Map</span>
            </button>
          )}

          {/* Module 2: Grading Sandbox (Available to Professor; Student sees grade contest) */}
          {(isProfessor || isStudent) && (
            <button
              onClick={() => setActiveTab("grading")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "grading" ? "bg-amber-secondary text-plum-950 shadow-[0_0_15px_rgba(242,196,107,0.4)]" : "text-pink-light/80 hover:text-white hover:bg-plum-800"}`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{isProfessor ? "Module 2 · Grading Sandbox" : "My Grade & Contest"}</span>
            </button>
          )}

          {/* Module 3: Ticket Desk (Available to Student & Admin) */}
          {(isAdmin || isStudent) && (
            <button
              onClick={() => setActiveTab("tickets")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "tickets" ? "bg-sky-info text-plum-950 shadow-[0_0_15px_rgba(124,200,238,0.4)]" : "text-pink-light/80 hover:text-white hover:bg-plum-800"}`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{isAdmin ? "Module 3 · Ticket Desk & SLA" : "Report Issue & Tickets"}</span>
            </button>
          )}

          {/* Audit Log (Available to Professor & Admin) */}
          {(isProfessor || isAdmin) && (
            <button
              onClick={() => setActiveTab("audit")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "audit" ? "bg-mint-good text-plum-950 shadow-[0_0_15px_rgba(74,222,154,0.4)]" : "text-pink-light/80 hover:text-white hover:bg-plum-800"}`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Log</span>
            </button>
          )}

          {/* About / Roadmap (Available to all) */}
          <button
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "about" ? "bg-plum-800 text-white border border-pink-primary/40" : "text-pink-light/80 hover:text-white hover:bg-plum-800"}`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>About / Roadmap</span>
          </button>
        </div>
      </nav>

      {/* Main Workspace Area */}
      <main className="max-w-7xl mx-auto w-full px-6 py-6 flex-1">
        {activeTab === "mastery" && (
          <MasteryMapModule
            role={currentUser.role}
            students={students}
            onNotify={notify}
          />
        )}

        {activeTab === "grading" && (
          <GradingSandboxModule
            role={currentUser.role}
            students={students}
            contests={contests}
            onApplyCutoffs={handleApplyCutoffs}
            onQuestionAction={handleQuestionAction}
            onContestGrade={handleContestGrade}
            onResolveContest={handleResolveContest}
            onNotify={notify}
          />
        )}

        {activeTab === "tickets" && (
          <TicketDeskModule
            role={currentUser.role}
            tickets={tickets}
            onNewTicket={handleNewTicket}
            onUpdateStatus={handleUpdateTicketStatus}
            onSimulateTime={handleSimulateTime}
            onNotify={notify}
          />
        )}

        {activeTab === "audit" && (
          <AuditLogView logs={auditLogs} />
        )}

        {activeTab === "about" && (
          <AboutRoadmapView />
        )}
      </main>

      {/* Notice Toast */}
      {notice && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 ${notice.type === "success" ? "bg-plum-900 border-mint-good/60 text-mint-good" : notice.type === "error" ? "bg-plum-900 border-coral-weak/60 text-coral-weak" : "bg-plum-900 border-pink-primary/60 text-pink-primary"}`}>
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} className="ml-2 opacity-70 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mandatory Footer on Every Page */}
      <footer className="w-full text-center py-4 border-t border-pink-primary/10 text-xs text-pink-light/60">
        Demo uses illustrative synthetic data.
      </footer>
    </div>
  );
}
