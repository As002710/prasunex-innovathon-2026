// CAMPUS-NEXUS Core Domain Types
// Team: Last-Mile Leaders
// Tagline: "Find why a student is failing. Then fix it."

export type Role = "student" | "professor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  college: string;
  department: string;
  studentId?: string; // e.g. "STU-2026-042" for Student
  courseId?: string;  // e.g. "CS301" for Professor
}

export interface ConceptNode {
  id: string;
  name: string;
  courseId: string;
  order: number;
  classMastery: number; // 0-100 percentage
  prerequisites: string[]; // parent concept IDs
  description: string;
}

export interface BKTParameters {
  pL0: number; // Initial probability of mastery (default: 0.30)
  pT: number;  // Transition probability (learning rate) (default: 0.15)
  pG: number;  // Guess probability (default: 0.20)
  pS: number;  // Slip probability (default: 0.10)
}

export interface Assessment {
  id: string;
  name: string; // Quiz 1, Test 1, Lab exam, Test 2, Midterm
  order: number;
  maxScore: number;
  date: string;
}

export interface Question {
  id: string;
  assessmentId: string;
  qNumber: number;
  text: string;
  conceptId: string;
  maxMarks: number;
  pVal: number; // Proportion correct (difficulty)
  rPbis: number; // Point-biserial discrimination
  flagged?: boolean;
  status: "normal" | "nullified" | "grace";
  graceMarks?: number;
}

export interface StudentScore {
  studentId: string;
  studentName: string;
  totalScore: number;
  currentGrade: string;
  zScore: number;
  questionMarks: Record<string, number>; // questionId -> marks
  conceptMastery: Record<string, number>; // conceptId -> 0 to 1
  history: {
    assessmentName: string;
    score: number;
    maxScore: number;
    conceptMastery: Record<string, number>;
  }[];
}

export interface PracticeQuestion {
  id: string;
  conceptId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GradeCutoffs {
  C: number;
  B: number;
  BPlus: number;
  A: number;
  APlus: number;
  O: number;
}

export interface CutoffModeAnalysis {
  mode: "fixed" | "gap-aware" | "custom";
  cutoffs: GradeCutoffs;
  gradeCounts: Record<string, number>;
  atBoundaryCount: number; // Students within 1 mark below a boundary
  studentsShifted: number; // Students changing grade compared to fixed
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  studentId: string;
  studentName: string;
  place: string; // e.g. "Lab 2, Bench 14", "Hostel Block B, Wing 2"
  locationType: "lab" | "hostel" | "classroom" | "other";
  text: string;
  imageUrl?: string;
  basePriority: number;
  reportsCount: number; // Number of students who reported this
  similarReports: {
    studentName: string;
    timestamp: string;
    text: string;
  }[];
  createdAt: string; // ISO string
  hoursOpen: number; // Simulated hours
  currentPriority: number; // Calculated live
  status: "open" | "in_progress" | "resolved";
  escalationLevel: "normal" | "hod" | "dean";
  assignedTo?: string;
  resolutionNote?: string;
  resolvedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  authorName: string;
  authorRole: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
}

export interface GradeContest {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  currentGrade: string;
  requestedGrade: string;
  reason: string;
  timestamp: string;
  status: "pending" | "approved" | "rejected";
  professorResponse?: string;
}
