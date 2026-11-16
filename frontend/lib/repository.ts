// Repository Interface & Seeded LocalStorage Implementation
// Decoupled architecture so PostgreSQL + FastAPI or Prisma can replace it seamlessly

import type {
  StudentScore,
  ConceptNode,
  Question,
  Assessment,
  GradeCutoffs,
  Ticket,
  AuditLogEntry,
  GradeContest,
} from "./types.ts";
import {
  generateSeedStudents,
  SEED_CONCEPTS,
  SEED_QUESTIONS,
  SEED_ASSESSMENTS,
  SEED_TICKETS,
  SEED_AUDIT_LOGS,
  SEED_CONTESTS,
} from "../data/seed.ts";
import { FIXED_Z_CUTOFFS, GAP_AWARE_CUTOFFS } from "./gapAware.ts";
import { calculateTicketPriority, evaluateSLA } from "./priority.ts";
import { findDuplicateTicket } from "./similarity.ts";

export interface CampusRepository {
  getStudents(): Promise<StudentScore[]>;
  getStudentById(id: string): Promise<StudentScore | undefined>;
  getConcepts(): Promise<ConceptNode[]>;
  getQuestions(): Promise<Question[]>;
  updateQuestion(id: string, updates: Partial<Question>, authorName: string): Promise<Question>;
  getAssessments(): Promise<Assessment[]>;
  getCutoffs(): Promise<{ current: GradeCutoffs; mode: "fixed" | "gap-aware" | "custom" }>;
  setCutoffs(cutoffs: GradeCutoffs, mode: "fixed" | "gap-aware" | "custom", authorName: string, reason: string): Promise<GradeCutoffs>;
  getTickets(): Promise<Ticket[]>;
  createTicket(params: {
    studentId: string;
    studentName: string;
    place: string;
    locationType: "lab" | "hostel" | "classroom" | "other";
    text: string;
    imageUrl?: string;
    basePriority?: number;
  }): Promise<{ ticket: Ticket; isDuplicate: boolean; matchedTicketId?: string }>;
  updateTicketStatus(ticketId: string, status: Ticket["status"]): Promise<Ticket>;
  simulateTimeForward(addedHours: number): Promise<Ticket[]>;
  getAuditLogs(): Promise<AuditLogEntry[]>;
  addAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<AuditLogEntry>;
  getContests(): Promise<GradeContest[]>;
  createContest(contest: Omit<GradeContest, "id" | "timestamp" | "status">): Promise<GradeContest>;
  resolveContest(contestId: string, status: "approved" | "rejected", response?: string): Promise<GradeContest>;
  resetDemoData(): Promise<void>;
}

const STORAGE_KEYS = {
  STUDENTS: "cn_students_v2",
  CONCEPTS: "cn_concepts_v2",
  QUESTIONS: "cn_questions_v2",
  ASSESSMENTS: "cn_assessments_v2",
  CUTOFFS: "cn_cutoffs_v2",
  CUTOFF_MODE: "cn_cutoff_mode_v2",
  TICKETS: "cn_tickets_v2",
  AUDIT_LOGS: "cn_audit_logs_v2",
  CONTESTS: "cn_contests_v2",
  SIMULATED_HOURS: "cn_simulated_hours_v2",
  STUDENT_CONSENT: "cn_student_consent_v2",
};

export class LocalStorageCampusRepository implements CampusRepository {
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  private getItem<T>(key: string, fallback: T): T {
    if (!this.isBrowser()) return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage quota exceeded or unavailable:", e);
    }
  }

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized(): void {
    if (!this.isBrowser()) return;
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      this.setItem(STORAGE_KEYS.STUDENTS, generateSeedStudents());
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONCEPTS)) {
      this.setItem(STORAGE_KEYS.CONCEPTS, SEED_CONCEPTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
      this.setItem(STORAGE_KEYS.QUESTIONS, SEED_QUESTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ASSESSMENTS)) {
      this.setItem(STORAGE_KEYS.ASSESSMENTS, SEED_ASSESSMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUTOFFS)) {
      this.setItem(STORAGE_KEYS.CUTOFFS, FIXED_Z_CUTOFFS);
      this.setItem(STORAGE_KEYS.CUTOFF_MODE, "fixed");
    }
    if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
      this.setItem(STORAGE_KEYS.TICKETS, SEED_TICKETS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      this.setItem(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTESTS)) {
      this.setItem(STORAGE_KEYS.CONTESTS, SEED_CONTESTS);
    }
  }

  async getStudents(): Promise<StudentScore[]> {
    return this.getItem(STORAGE_KEYS.STUDENTS, generateSeedStudents());
  }

  async getStudentById(id: string): Promise<StudentScore | undefined> {
    const students = await this.getStudents();
    return students.find((s) => s.studentId === id || s.studentId === "STU-2026-042");
  }

  async getConcepts(): Promise<ConceptNode[]> {
    return this.getItem(STORAGE_KEYS.CONCEPTS, SEED_CONCEPTS);
  }

  async getQuestions(): Promise<Question[]> {
    return this.getItem(STORAGE_KEYS.QUESTIONS, SEED_QUESTIONS);
  }

  async updateQuestion(id: string, updates: Partial<Question>, authorName: string): Promise<Question> {
    const questions = await this.getQuestions();
    const idx = questions.findIndex((q) => q.id === id);
    if (idx === -1) throw new Error(`Question ${id} not found`);

    const old = questions[idx];
    const updated = { ...old, ...updates };
    questions[idx] = updated;
    this.setItem(STORAGE_KEYS.QUESTIONS, questions);

    await this.addAuditLog({
      authorName,
      authorRole: "Professor",
      action: "UPDATE_QUESTION_STATUS",
      field: `Question ${updated.qNumber}`,
      oldValue: `Status: ${old.status}, Grace: ${old.graceMarks || 0}`,
      newValue: `Status: ${updated.status}, Grace: ${updated.graceMarks || 0}`,
      reason: `Action taken on question discrimination audit`,
    });

    return updated;
  }

  async getAssessments(): Promise<Assessment[]> {
    return this.getItem(STORAGE_KEYS.ASSESSMENTS, SEED_ASSESSMENTS);
  }

  async getCutoffs(): Promise<{ current: GradeCutoffs; mode: "fixed" | "gap-aware" | "custom" }> {
    const current = this.getItem(STORAGE_KEYS.CUTOFFS, FIXED_Z_CUTOFFS);
    const mode = this.getItem<"fixed" | "gap-aware" | "custom">(STORAGE_KEYS.CUTOFF_MODE, "fixed");
    return { current, mode };
  }

  async setCutoffs(
    cutoffs: GradeCutoffs,
    mode: "fixed" | "gap-aware" | "custom",
    authorName: string,
    reason: string
  ): Promise<GradeCutoffs> {
    const old = await this.getCutoffs();
    this.setItem(STORAGE_KEYS.CUTOFFS, cutoffs);
    this.setItem(STORAGE_KEYS.CUTOFF_MODE, mode);

    await this.addAuditLog({
      authorName,
      authorRole: "Professor",
      action: "UPDATE_CUTOFFS",
      field: `Cutoff Mode (${mode})`,
      oldValue: `C=${old.current.C}, B=${old.current.B}, B+=${old.current.BPlus}, A=${old.current.A}, A+=${old.current.APlus}, O=${old.current.O}`,
      newValue: `C=${cutoffs.C}, B=${cutoffs.B}, B+=${cutoffs.BPlus}, A=${cutoffs.A}, A+=${cutoffs.APlus}, O=${cutoffs.O}`,
      reason,
    });

    return cutoffs;
  }

  async getTickets(): Promise<Ticket[]> {
    const tickets: Ticket[] = this.getItem(STORAGE_KEYS.TICKETS, SEED_TICKETS);
    // Recalculate priority and SLA live
    return tickets.map((t) => {
      const priority = calculateTicketPriority(t.basePriority, t.reportsCount, t.hoursOpen);
      const sla = evaluateSLA(t.locationType, t.hoursOpen);
      return {
        ...t,
        currentPriority: priority,
        escalationLevel: sla.escalationLevel,
      };
    });
  }

  async createTicket(params: {
    studentId: string;
    studentName: string;
    place: string;
    locationType: "lab" | "hostel" | "classroom" | "other";
    text: string;
    imageUrl?: string;
    basePriority?: number;
  }): Promise<{ ticket: Ticket; isDuplicate: boolean; matchedTicketId?: string }> {
    const tickets = await this.getTickets();

    // Check for duplicates in open tickets of same place
    const dupCheck = findDuplicateTicket(params.text, params.place, tickets);

    if (dupCheck.isDuplicate && dupCheck.matchedTicketId) {
      // Merge into open ticket
      const matchedIdx = tickets.findIndex((t) => t.id === dupCheck.matchedTicketId);
      if (matchedIdx !== -1) {
        const matched = tickets[matchedIdx];
        matched.reportsCount += 1;
        matched.similarReports.push({
          studentName: params.studentName,
          timestamp: new Date().toISOString(),
          text: params.text,
        });
        matched.currentPriority = calculateTicketPriority(
          matched.basePriority,
          matched.reportsCount,
          matched.hoursOpen
        );

        tickets[matchedIdx] = matched;
        this.setItem(STORAGE_KEYS.TICKETS, tickets);

        return {
          ticket: matched,
          isDuplicate: true,
          matchedTicketId: matched.ticketNumber,
        };
      }
    }

    // New unique ticket
    const count = tickets.length + 1;
    const ticketNumber = `TKT-${100 + count}`;
    const basePriority = params.basePriority || (params.locationType === "lab" ? 20 : 12);
    const newTicket: Ticket = {
      id: `tkt-${100 + count}`,
      ticketNumber,
      studentId: params.studentId,
      studentName: params.studentName,
      place: params.place,
      locationType: params.locationType,
      text: params.text,
      imageUrl: params.imageUrl,
      basePriority,
      reportsCount: 1,
      similarReports: [],
      createdAt: new Date().toISOString(),
      hoursOpen: 0,
      currentPriority: calculateTicketPriority(basePriority, 1, 0),
      status: "open",
      escalationLevel: "normal",
    };

    tickets.unshift(newTicket);
    this.setItem(STORAGE_KEYS.TICKETS, tickets);

    return { ticket: newTicket, isDuplicate: false };
  }

  async updateTicketStatus(ticketId: string, status: Ticket["status"]): Promise<Ticket> {
    const tickets = await this.getTickets();
    const idx = tickets.findIndex((t) => t.id === ticketId || t.ticketNumber === ticketId);
    if (idx === -1) throw new Error(`Ticket ${ticketId} not found`);

    tickets[idx].status = status;
    if (status === "resolved") {
      tickets[idx].resolvedAt = new Date().toISOString();
    }
    this.setItem(STORAGE_KEYS.TICKETS, tickets);
    return tickets[idx];
  }

  async simulateTimeForward(addedHours: number): Promise<Ticket[]> {
    const tickets = await this.getTickets();
    const updated = tickets.map((t) => {
      if (t.status === "resolved") return t;
      const newHours = t.hoursOpen + addedHours;
      const priority = calculateTicketPriority(t.basePriority, t.reportsCount, newHours);
      const sla = evaluateSLA(t.locationType, newHours);
      return {
        ...t,
        hoursOpen: newHours,
        currentPriority: priority,
        escalationLevel: sla.escalationLevel,
      };
    });

    this.setItem(STORAGE_KEYS.TICKETS, updated);
    return updated;
  }

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    return this.getItem(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
  }

  async addAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<AuditLogEntry> {
    const logs = await this.getAuditLogs();
    const fullEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    logs.unshift(fullEntry);
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
    return fullEntry;
  }

  async getContests(): Promise<GradeContest[]> {
    return this.getItem(STORAGE_KEYS.CONTESTS, SEED_CONTESTS);
  }

  async createContest(contest: Omit<GradeContest, "id" | "timestamp" | "status">): Promise<GradeContest> {
    const contests = await this.getContests();
    const newContest: GradeContest = {
      id: `contest-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: "pending",
      ...contest,
    };
    contests.unshift(newContest);
    this.setItem(STORAGE_KEYS.CONTESTS, contests);
    return newContest;
  }

  async resolveContest(
    contestId: string,
    status: "approved" | "rejected",
    response?: string
  ): Promise<GradeContest> {
    const contests = await this.getContests();
    const idx = contests.findIndex((c) => c.id === contestId);
    if (idx === -1) throw new Error("Contest not found");

    contests[idx].status = status;
    contests[idx].professorResponse = response;
    this.setItem(STORAGE_KEYS.CONTESTS, contests);
    return contests[idx];
  }

  async resetDemoData(): Promise<void> {
    if (!this.isBrowser()) return;
    this.setItem(STORAGE_KEYS.STUDENTS, generateSeedStudents());
    this.setItem(STORAGE_KEYS.CONCEPTS, SEED_CONCEPTS);
    this.setItem(STORAGE_KEYS.QUESTIONS, SEED_QUESTIONS);
    this.setItem(STORAGE_KEYS.ASSESSMENTS, SEED_ASSESSMENTS);
    this.setItem(STORAGE_KEYS.CUTOFFS, FIXED_Z_CUTOFFS);
    this.setItem(STORAGE_KEYS.CUTOFF_MODE, "fixed");
    this.setItem(STORAGE_KEYS.TICKETS, SEED_TICKETS);
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    this.setItem(STORAGE_KEYS.CONTESTS, SEED_CONTESTS);
  }
}

// Singleton repository instance for client-side and API routes
export const campusRepository = new LocalStorageCampusRepository();
