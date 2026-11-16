// Seed Dataset for CAMPUS-NEXUS MVP
// Team: Last-Mile Leaders

import type {
  User,
  ConceptNode,
  Assessment,
  Question,
  StudentScore,
  PracticeQuestion,
  Ticket,
  AuditLogEntry,
  GradeContest,
} from "../lib/types.ts";
import { calculateTicketPriority } from "../lib/priority.ts";

export const DEMO_USERS: Record<string, User> = {
  student: {
    id: "stu-demo-001",
    name: "Student (Demo Account)",
    email: "student@campus-nexus.edu",
    role: "student",
    studentId: "STU-2026-042",
    college: "Institute of Technology",
    department: "Computer Science & Engineering",
  },
  professor: {
    id: "prof-demo-001",
    name: "Prof. Meenakshi Sundaram",
    email: "professor@campus-nexus.edu",
    role: "professor",
    college: "Institute of Technology",
    department: "Computer Science & Engineering",
    courseId: "CS301",
  },
  admin: {
    id: "admin-demo-001",
    name: "Col. Rajesh Verma",
    email: "admin@campus-nexus.edu",
    role: "admin",
    college: "Institute of Technology",
    department: "Campus Facilities & Student Affairs",
  },
};

// Course Concepts DAG
// OS Architecture 92% -> Process Mgmt 84% -> CPU Scheduling 88%
// Process Mgmt -> Semaphores & Mutex 41% -> Deadlock Detection 28%
// OS Architecture -> Memory Mgmt 52% -> Virtual Memory 49%
export const SEED_CONCEPTS: ConceptNode[] = [
  {
    id: "c-os-arch",
    name: "OS Architecture",
    courseId: "CS301",
    order: 1,
    classMastery: 92,
    prerequisites: [],
    description: "Kernel modes, system calls, monolithic vs microkernel abstractions.",
  },
  {
    id: "c-proc-mgmt",
    name: "Process Mgmt",
    courseId: "CS301",
    order: 2,
    classMastery: 84,
    prerequisites: ["c-os-arch"],
    description: "PCB state transitions, context switching, fork/exec semantics.",
  },
  {
    id: "c-cpu-sched",
    name: "CPU Scheduling",
    courseId: "CS301",
    order: 3,
    classMastery: 88,
    prerequisites: ["c-proc-mgmt"],
    description: "Round Robin, Multi-level Feedback Queues, Gantt metrics.",
  },
  {
    id: "c-sem-mutex",
    name: "Semaphores & Mutex",
    courseId: "CS301",
    order: 4,
    classMastery: 41,
    prerequisites: ["c-proc-mgmt"],
    description: "Critical section, Peterson's algorithm, counting semaphores, race conditions.",
  },
  {
    id: "c-deadlocks",
    name: "Deadlock Detection",
    courseId: "CS301",
    order: 5,
    classMastery: 28,
    prerequisites: ["c-sem-mutex"],
    description: "Coffman conditions, Banker's algorithm, Resource Allocation Graph cycles.",
  },
  {
    id: "c-mem-mgmt",
    name: "Memory Mgmt",
    courseId: "CS301",
    order: 6,
    classMastery: 52,
    prerequisites: ["c-os-arch"],
    description: "Contiguous allocation, paging, segmentation, internal/external fragmentation.",
  },
  {
    id: "c-virt-mem",
    name: "Virtual Memory",
    courseId: "CS301",
    order: 7,
    classMastery: 49,
    prerequisites: ["c-mem-mgmt"],
    description: "Demand paging, page fault handling, TLB cache, LRU/Clock replacement.",
  },
];

// 5 Assessments in sequence
export const SEED_ASSESSMENTS: Assessment[] = [
  { id: "a-q1", name: "Quiz 1 (Basics & Architecture)", order: 1, maxScore: 20, date: "2026-08-20" },
  { id: "a-t1", name: "Test 1 (Process & Scheduling)", order: 2, maxScore: 50, date: "2026-09-15" },
  { id: "a-lab", name: "Lab Exam (IPC & Semaphores)", order: 3, maxScore: 50, date: "2026-10-08" },
  { id: "a-t2", name: "Test 2 (Synchronization & Deadlocks)", order: 4, maxScore: 50, date: "2026-10-28" },
  { id: "a-mid", name: "Midterm Examination", order: 5, maxScore: 100, date: "2026-11-12" },
];

// 14 Questions audited on 100 synthetic students
// Seeded so Q13 = -0.24 (strong students miss it) and Q14 = 0.148 (just under 0.15 flag)
export const SEED_QUESTIONS: Question[] = [
  { id: "q-1", assessmentId: "a-mid", qNumber: 1, text: "Dual-mode hardware support and trap instruction transition.", conceptId: "c-os-arch", maxMarks: 5, pVal: 0.91, rPbis: 0.42, status: "normal" },
  { id: "q-2", assessmentId: "a-mid", qNumber: 2, text: "Kernel stack vs user stack during fork() system invocation.", conceptId: "c-proc-mgmt", maxMarks: 5, pVal: 0.83, rPbis: 0.48, status: "normal" },
  { id: "q-3", assessmentId: "a-mid", qNumber: 3, text: "Average waiting time derivation for Shortest Remaining Time First.", conceptId: "c-cpu-sched", maxMarks: 5, pVal: 0.85, rPbis: 0.51, status: "normal" },
  { id: "q-4", assessmentId: "a-mid", qNumber: 4, text: "Multi-level feedback queue starvation prevention with aging.", conceptId: "c-cpu-sched", maxMarks: 5, pVal: 0.79, rPbis: 0.44, status: "normal" },
  { id: "q-5", assessmentId: "a-mid", qNumber: 5, text: "Peterson's software solution proof under modern out-of-order CPUs.", conceptId: "c-sem-mutex", maxMarks: 5, pVal: 0.42, rPbis: 0.38, status: "normal" },
  { id: "q-6", assessmentId: "a-mid", qNumber: 6, text: "Binary semaphore vs spinlock context-switch latency tradeoff.", conceptId: "c-sem-mutex", maxMarks: 5, pVal: 0.46, rPbis: 0.35, status: "normal" },
  { id: "q-7", assessmentId: "a-mid", qNumber: 7, text: "Dining philosophers deadlock-free semaphore protocol.", conceptId: "c-sem-mutex", maxMarks: 5, pVal: 0.38, rPbis: 0.39, status: "normal" },
  { id: "q-8", assessmentId: "a-mid", qNumber: 8, text: "Banker's Safety Algorithm matrix verification with 3 resources.", conceptId: "c-deadlocks", maxMarks: 5, pVal: 0.31, rPbis: 0.33, status: "normal" },
  { id: "q-9", assessmentId: "a-mid", qNumber: 9, text: "Resource allocation graph cycle detection with multiple instances.", conceptId: "c-deadlocks", maxMarks: 5, pVal: 0.27, rPbis: 0.36, status: "normal" },
  { id: "q-10", assessmentId: "a-mid", qNumber: 10, text: "Two-level hierarchical page table address translation overhead.", conceptId: "c-mem-mgmt", maxMarks: 5, pVal: 0.56, rPbis: 0.41, status: "normal" },
  { id: "q-11", assessmentId: "a-mid", qNumber: 11, text: "External fragmentation compaction vs paging memory tradeoffs.", conceptId: "c-mem-mgmt", maxMarks: 5, pVal: 0.54, rPbis: 0.40, status: "normal" },
  { id: "q-12", assessmentId: "a-mid", qNumber: 12, text: "Page fault trap latency and effective memory access time formula.", conceptId: "c-virt-mem", maxMarks: 5, pVal: 0.48, rPbis: 0.37, status: "normal" },
  { id: "q-13", assessmentId: "a-mid", qNumber: 13, text: "Ambiguous tricky question on POSIX semaphore post() vs signal() in interrupt handler.", conceptId: "c-sem-mutex", maxMarks: 5, pVal: 0.34, rPbis: -0.24, flagged: true, status: "normal" },
  { id: "q-14", assessmentId: "a-mid", qNumber: 14, text: "Trivial definition of Belady's anomaly with misleading FIFO queue size choice.", conceptId: "c-virt-mem", maxMarks: 5, pVal: 0.72, rPbis: 0.148, flagged: true, status: "normal" },
];

// Student mastery trend over the 5 assessments
// Process Mgmt rising ~0.70 to 0.86
// Synchronisation falling ~0.65 to 0.41
// Deadlocks falling ~0.55 to 0.28
export const DEMO_STUDENT_TREND = [
  { assessment: "Quiz 1", processMgmt: 0.70, synchronization: 0.65, deadlocks: 0.55, passLine: 0.50 },
  { assessment: "Test 1", processMgmt: 0.74, synchronization: 0.60, deadlocks: 0.48, passLine: 0.50 },
  { assessment: "Lab exam", processMgmt: 0.79, synchronization: 0.52, deadlocks: 0.40, passLine: 0.50 },
  { assessment: "Test 2", processMgmt: 0.82, synchronization: 0.46, deadlocks: 0.33, passLine: 0.50 },
  { assessment: "Midterm", processMgmt: 0.86, synchronization: 0.41, deadlocks: 0.28, passLine: 0.50 },
];

// 3-question practice set for the weakest root topic (Semaphores & Mutex)
export const PRACTICE_SET_SEMAPHORES: PracticeQuestion[] = [
  {
    id: "prac-sem-1",
    conceptId: "c-sem-mutex",
    question: "What atomic hardware instruction enables safe mutual exclusion implementation without disabling interrupts on multi-core systems?",
    options: [
      "Test-and-Set (or Compare-and-Swap)",
      "Floating point rounding trap",
      "Memory MMU translation invalidation",
      "DMA burst interrupt toggle"
    ],
    correctIndex: 0,
    explanation: "Test-and-Set or CAS (Compare-and-Swap) executes atomically across memory buses, ensuring safe lock acquisition without suppressing CPU interrupts.",
  },
  {
    id: "prac-sem-2",
    conceptId: "c-sem-mutex",
    question: "In Dijkstra's classic counting semaphore, what happens when a thread invokes wait() (P operation) on a semaphore whose value is currently 0?",
    options: [
      "The thread increments the semaphore to 1 and enters immediately",
      "The thread is blocked and placed on the semaphore's waiting queue until signal() is called",
      "The CPU generates an illegal memory instruction fault",
      "The OS terminates the calling process"
    ],
    correctIndex: 1,
    explanation: "wait(S) checks if S <= 0. If true, the executing thread is moved to the semaphore's wait list and yielding the CPU until a signal(S) wake-up.",
  },
  {
    id: "prac-sem-3",
    conceptId: "c-sem-mutex",
    question: "Why does Deadlock occur when Thread 1 acquires Mutex A then waits for Mutex B, while Thread 2 acquires Mutex B then waits for Mutex A?",
    options: [
      "Cache coherency bus timeout",
      "Circular wait condition is satisfied, leading to permanent starvation",
      "Memory paging table overflow",
      "Process priorities become inverted"
    ],
    correctIndex: 1,
    explanation: "Circular wait is one of the four Coffman conditions: neither thread can proceed because each holds the resource the other thread is waiting for.",
  },
];

// Helper to seed 100 synthetic students with mean 60.4, SD 10.6,
// peak at 55-60 (~26 students), spread 25 to 85.
export function generateSeedStudents(): StudentScore[] {
  const named = [
    { id: "STU-001", name: "Aarav Sharma", score: 78.8 },
    { id: "STU-002", name: "Priya Patel", score: 73.5 },
    { id: "STU-003", name: "Rohan Gupta", score: 66.5 },
    { id: "STU-004", name: "Sneha Rao", score: 59.9 },
    { id: "STU-005", name: "Vikram Malhotra", score: 53.3 },
  ];

  // Calibrated synthetic distribution matching specifications:
  // 100 students, Mean 60.4, SD 10.6, peak at 55-60 (26 students), spread 27 to 82.
  // Fixed cutoffs stranded = 15, Gap-aware cutoffs stranded = 3.
  const rawScores: number[] = [
    27.1, 32.4, 37.6, 42.8, 43.7, 43.9, 44.1, 45.5, 46.0, 46.5,
    47.0, 47.5, 48.0, 48.4, 48.9, 49.4, 49.9, 50.4, 50.8, 51.3,
    51.8, 53.3, 53.6, 53.9, 55.0, 55.2, 55.4, 55.6, 55.8, 56.0,
    56.2, 56.4, 56.6, 56.8, 57.0, 57.2, 57.4, 57.6, 57.8, 58.0,
    58.2, 58.4, 58.6, 58.8, 59.0, 59.2, 59.4, 59.5, 59.7, 59.9,
    61.2, 61.2, 61.2, 61.2, 61.2, 61.2, 61.3, 61.5, 61.8, 62.0,
    62.3, 62.5, 62.7, 63.0, 63.2, 63.5, 66.0, 66.3, 66.5, 68.0,
    68.0, 68.0, 68.0, 68.0, 68.0, 68.0, 68.0, 68.0, 68.0, 68.0,
    68.2, 68.5, 68.7, 68.9, 72.9, 73.5, 73.5, 73.5, 73.5, 73.5,
    73.5, 73.5, 73.5, 78.8, 79.5, 79.5, 79.5, 79.5, 80.0, 81.6
  ];

  return rawScores.map((score, index) => {
    let studentId = `STU-${String(index + 1).padStart(3, "0")}`;
    let studentName = `Student ${index + 1}`;

    if (index < named.length) {
      studentId = named[index].id;
      studentName = named[index].name;
    } else if (index === 41) {
      // Index 41 is our designated demo student
      studentId = "STU-2026-042";
      studentName = "Student (Demo Account)";
    }

    const zScore = Math.round(((score - 60.4) / 10.6) * 100) / 100;

    return {
      studentId,
      studentName,
      totalScore: score,
      currentGrade: "B",
      zScore,
      questionMarks: {},
      conceptMastery: {
        "c-os-arch": score > 50 ? 0.92 : 0.70,
        "c-proc-mgmt": score > 55 ? 0.84 : 0.65,
        "c-cpu-sched": score > 55 ? 0.88 : 0.68,
        "c-sem-mutex": studentId === "STU-2026-042" ? 0.41 : score > 65 ? 0.75 : 0.45,
        "c-deadlocks": studentId === "STU-2026-042" ? 0.28 : score > 65 ? 0.70 : 0.35,
        "c-mem-mgmt": score > 50 ? 0.52 : 0.40,
        "c-virt-mem": score > 50 ? 0.49 : 0.38,
      },
      history: [],
    };
  });
}

// 12 Open Tickets
// Includes 3 near duplicates:
//   - TKT-101: Lab 2, Bench 14 (Power socket sparking)
//   - TKT-102: Lab 2, Bench 14 (Socket not working Bench 14 sparking smell)
//   - TKT-103: Lab 2, Bench 14 (Bench 14 power socket sparking burning plastic)
// Includes 1 overdue lab fault:
//   - TKT-104: Lab 2, Rack 3 (Core switch down, 58h open -> outranks loose chair!)
export const SEED_TICKETS: Ticket[] = [
  {
    id: "tkt-104",
    ticketNumber: "TKT-104",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    place: "Lab 2, Rack 3",
    locationType: "lab",
    text: "Core gigabit switch down; entire lab subnet disconnected from network during OS lab exam.",
    basePriority: 25,
    reportsCount: 8,
    similarReports: [
      { studentName: "Priya Patel", timestamp: "2026-11-14T08:30:00Z", text: "No ethernet connection on Rack 3 switch" },
      { studentName: "Rohan Gupta", timestamp: "2026-11-14T11:15:00Z", text: "Lab 2 rack 3 switch offline" },
    ],
    createdAt: "2026-11-14T06:00:00Z",
    hoursOpen: 54, // Overdue (> 48h SLA for lab)
    currentPriority: calculateTicketPriority(25, 8, 54), // High priority!
    status: "open",
    escalationLevel: "hod",
  },
  {
    id: "tkt-101",
    ticketNumber: "TKT-101",
    studentId: "STU-003",
    studentName: "Rohan Gupta",
    place: "Lab 2, Bench 14",
    locationType: "lab",
    text: "Power socket sparking on Bench 14 and emitting burning plastic smell.",
    basePriority: 20,
    reportsCount: 3,
    similarReports: [
      { studentName: "Sneha Rao", timestamp: "2026-11-15T10:00:00Z", text: "Socket sparking on bench 14 burning smell" }
    ],
    createdAt: "2026-11-15T09:00:00Z",
    hoursOpen: 27,
    currentPriority: calculateTicketPriority(20, 3, 27),
    status: "in_progress",
    escalationLevel: "normal",
    assignedTo: "Manoj Kumar (Lab Electrician)",
  },
  {
    id: "tkt-105",
    ticketNumber: "TKT-105",
    studentId: "STU-005",
    studentName: "Vikram Malhotra",
    place: "Hostel Block B, Wing 2",
    locationType: "hostel",
    text: "Loose chair backrest in common study room B-204.",
    basePriority: 6,
    reportsCount: 1,
    similarReports: [],
    createdAt: "2026-11-16T08:00:00Z",
    hoursOpen: 6,
    currentPriority: calculateTicketPriority(6, 1, 6),
    status: "open",
    escalationLevel: "normal",
  },
  {
    id: "tkt-106",
    ticketNumber: "TKT-106",
    studentId: "STU-002",
    studentName: "Priya Patel",
    place: "Hostel Block A, 3rd Floor",
    locationType: "hostel",
    text: "Water dispenser cooling compressor leaking water onto corridor tiles.",
    basePriority: 12,
    reportsCount: 4,
    similarReports: [],
    createdAt: "2026-11-15T12:00:00Z",
    hoursOpen: 26, // Overdue (> 24h SLA for hostel)
    currentPriority: calculateTicketPriority(12, 4, 26),
    status: "open",
    escalationLevel: "hod",
  },
  {
    id: "tkt-107",
    ticketNumber: "TKT-107",
    studentId: "STU-004",
    studentName: "Sneha Rao",
    place: "Lab 1, System 22",
    locationType: "lab",
    text: "CRT monitor flickering severely with high-pitched whine.",
    basePriority: 10,
    reportsCount: 2,
    similarReports: [],
    createdAt: "2026-11-15T15:00:00Z",
    hoursOpen: 23,
    currentPriority: calculateTicketPriority(10, 2, 23),
    status: "open",
    escalationLevel: "normal",
  },
  {
    id: "tkt-108",
    ticketNumber: "TKT-108",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    place: "Library, 2nd Floor Reference",
    locationType: "other",
    text: "AC unit dripping condensate directly over IEEE journals stack.",
    basePriority: 18,
    reportsCount: 5,
    similarReports: [],
    createdAt: "2026-11-15T02:00:00Z",
    hoursOpen: 36,
    currentPriority: calculateTicketPriority(18, 5, 36),
    status: "in_progress",
    escalationLevel: "normal",
  },
  {
    id: "tkt-109",
    ticketNumber: "TKT-109",
    studentId: "STU-003",
    studentName: "Rohan Gupta",
    place: "Seminar Hall 1",
    locationType: "classroom",
    text: "HDMI projector input loose; screen blacks out whenever someone walks near podium.",
    basePriority: 14,
    reportsCount: 2,
    similarReports: [],
    createdAt: "2026-11-16T09:00:00Z",
    hoursOpen: 5,
    currentPriority: calculateTicketPriority(14, 2, 5),
    status: "open",
    escalationLevel: "normal",
  },
  {
    id: "tkt-110",
    ticketNumber: "TKT-110",
    studentId: "STU-2026-042",
    studentName: "Student (Demo Account)",
    place: "Lab 2, Bench 14",
    locationType: "lab",
    text: "Socket not working Bench 14 sparking smell and charred pins.",
    basePriority: 20,
    reportsCount: 2,
    similarReports: [],
    createdAt: "2026-11-15T10:30:00Z",
    hoursOpen: 25,
    currentPriority: calculateTicketPriority(20, 2, 25),
    status: "open",
    escalationLevel: "normal",
  },
  {
    id: "tkt-111",
    ticketNumber: "TKT-111",
    studentId: "STU-002",
    studentName: "Priya Patel",
    place: "Hostel Block B, Mess Hall",
    locationType: "hostel",
    text: "Exhaust fan motor jammed in kitchen washing area.",
    basePriority: 15,
    reportsCount: 3,
    similarReports: [],
    createdAt: "2026-11-15T07:00:00Z",
    hoursOpen: 31, // Overdue (> 24h SLA)
    currentPriority: calculateTicketPriority(15, 3, 31),
    status: "in_progress",
    escalationLevel: "hod",
  },
  {
    id: "tkt-112",
    ticketNumber: "TKT-112",
    studentId: "STU-005",
    studentName: "Vikram Malhotra",
    place: "Classroom 302",
    locationType: "classroom",
    text: "Microphone audio cable cracked creating loud static buzz.",
    basePriority: 8,
    reportsCount: 1,
    similarReports: [],
    createdAt: "2026-11-16T06:00:00Z",
    hoursOpen: 8,
    currentPriority: calculateTicketPriority(8, 1, 8),
    status: "open",
    escalationLevel: "normal",
  },
  {
    id: "tkt-113",
    ticketNumber: "TKT-113",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    place: "Sports Complex",
    locationType: "other",
    text: "First aid kit in badminton hall missing sterile gauze and antiseptic.",
    basePriority: 16,
    reportsCount: 2,
    similarReports: [],
    createdAt: "2026-11-16T04:00:00Z",
    hoursOpen: 10,
    currentPriority: calculateTicketPriority(16, 2, 10),
    status: "open",
    escalationLevel: "normal",
  },
  {
    id: "tkt-114",
    ticketNumber: "TKT-114",
    studentId: "STU-004",
    studentName: "Sneha Rao",
    place: "Lab 3, CAD Workstation 7",
    locationType: "lab",
    text: "NVIDIA GPU driver crash on boot, machine fails to start X11 display.",
    basePriority: 11,
    reportsCount: 1,
    similarReports: [],
    createdAt: "2026-11-15T18:00:00Z",
    hoursOpen: 20,
    currentPriority: calculateTicketPriority(11, 1, 20),
    status: "open",
    escalationLevel: "normal",
  },
];

// Initial Audit Log
export const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit-001",
    timestamp: "2026-11-15T09:30:00Z",
    authorName: "Prof. Meenakshi Sundaram",
    authorRole: "Professor",
    action: "APPLY_CUTOFFS",
    field: "Grading Boundaries",
    oldValue: "Fixed Z-score (C=44.6, B=54.1, B+=60.4, A=66.8, A+=73.1, O=79.4)",
    newValue: "Gap-aware (C=45.2, B=54.1, B+=61.1, A=67.9, A+=72.8, O=77.5)",
    reason: "Reduced boundary-stranded students from 15 down to 3.",
  },
  {
    id: "audit-002",
    timestamp: "2026-11-15T10:15:00Z",
    authorName: "Prof. Meenakshi Sundaram",
    authorRole: "Professor",
    action: "QUESTION_FLAG_RESOLVED",
    field: "Question 13 (Discrimination r=-0.24)",
    oldValue: "Active (5 marks)",
    newValue: "Grace Marks Granted (+2 marks to all)",
    reason: "Item audit indicated negative discrimination due to ambiguous wording.",
  },
];

// Seed Grade Contests
export const SEED_CONTESTS: GradeContest[] = [
  {
    id: "contest-001",
    studentId: "STU-001",
    studentName: "Aarav Sharma",
    courseId: "CS301",
    courseName: "Operating Systems",
    currentGrade: "A+",
    requestedGrade: "O",
    reason: "Score 79.2 is only 0.2 marks below the O cutoff (79.4). Midterm Q13 clarification affected my final score.",
    timestamp: "2026-11-15T11:00:00Z",
    status: "pending",
  },
];
