export interface KpiItem {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  isGold?: boolean;
  linkText?: string;
  sparkline: { x: number; y: number }[];
}

export interface CourseMastery {
  code: string;
  name: string;
  percentage: number;
  color: "green" | "amber" | "red";
  hex: string;
  instructor: string;
}

export interface ActivityItem {
  id: string;
  date?: { day: string; month: string };
  title: string;
  course?: string;
  subtitle?: string;
  due?: string;
  type?: "quiz" | "lab" | "event" | string;
  badge: string;
}

export interface QuickAccessItem {
  id: string;
  label: string;
  title: string;
  desc: string;
  count: string;
  icon: string;
}

export interface CopilotMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  tags?: string[];
}

// 📊 4 KPI CARDS
export const KPI_CARDS: KpiItem[] = [
  {
    id: "academic-perf",
    title: "Academic Performance",
    value: "78.5%",
    change: "+2.4%",
    trend: "up",
    sparkline: [
      { x: 1, y: 72 },
      { x: 2, y: 74 },
      { x: 3, y: 73 },
      { x: 4, y: 76 },
      { x: 5, y: 78.5 },
    ],
  },
  {
    id: "attendance",
    title: "Attendance",
    value: "86%",
    change: "+1%",
    trend: "up",
    sparkline: [
      { x: 1, y: 82 },
      { x: 2, y: 84 },
      { x: 3, y: 85 },
      { x: 4, y: 85 },
      { x: 5, y: 86 },
    ],
  },
  {
    id: "course-mastery",
    title: "Course Mastery",
    value: "72%",
    change: "+5%",
    trend: "up",
    isGold: true,
    linkText: "DKT-Graph",
    sparkline: [
      { x: 1, y: 65 },
      { x: 2, y: 68 },
      { x: 3, y: 69 },
      { x: 4, y: 71 },
      { x: 5, y: 72 },
    ],
  },
  {
    id: "assessments",
    title: "Assessments",
    value: "3 Active",
    change: "2 Due Soon",
    trend: "neutral",
    sparkline: [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 3 },
      { x: 4, y: 5 },
      { x: 5, y: 3 },
    ],
  },
];

// 📚 MASTERY COURSE BREAKDOWN
export const MASTERY_COURSES: CourseMastery[] = [
  {
    code: "CS301",
    name: "Database Management Systems",
    percentage: 85,
    color: "green",
    hex: "#4ADE9A",
    instructor: "Prof. S. Rao",
  },
  {
    code: "CS302",
    name: "Operating Systems",
    percentage: 78,
    color: "green",
    hex: "#4ADE9A",
    instructor: "Dr. K. Verma",
  },
  {
    code: "CS303",
    name: "Computer Networks",
    percentage: 68,
    color: "amber",
    hex: "#F5B942",
    instructor: "Dr. N. Iyer",
  },
  {
    code: "CS304",
    name: "Data Structures & Algorithms",
    percentage: 58,
    color: "red",
    hex: "#F2705A",
    instructor: "Prof. M. Gupta",
  },
];

// 🤖 AI STUDY RECOMMENDATION
export const AI_RECOMMENDATION = {
  subject: "Computer Networks",
  topic: "Computer Networks",
  gapConcept: "Routing Protocols (Distance Vector & Link State)",
  rationale: "Identified prerequisite gap in Distance Vector & Link State routing algorithms from the recent lab assessment.",
  status: "Requires Attention",
  actions: [
    { id: "act-1", label: "Revise Routing Concepts (15 min)", text: "Revise Routing Concepts (15 min)", duration: "15 min", completed: false },
    { id: "act-2", label: "Attempt 5 practice questions", text: "Attempt 5 practice questions", duration: "20 min", completed: false },
    { id: "act-3", label: "Take a micro-drill quiz", text: "Take a micro-drill quiz", duration: "10 min", completed: false },
  ],
};

// 📈 GRADE PREDICTOR SIMULATION
export const PREDICTOR_EFFORT_TIERS = [
  { level: "Current", effort: 0, score: 78, grade: "B+" },
  { level: "+10% Effort", effort: 10, score: 83, grade: "A-" },
  { level: "+20% Effort", effort: 20, score: 88, grade: "A" },
];

// 📅 UPCOMING ACTIVITIES
export const UPCOMING_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    date: { day: "10", month: "NOV" },
    title: "Algorithms Midterm Test",
    course: "CS304",
    subtitle: "9:00 AM - 11:00 AM · Hall B",
    due: "In 2 days · Hall B",
    type: "quiz",
    badge: "Urgent",
  },
  {
    id: "act-2",
    date: { day: "12", month: "NOV" },
    title: "OS Kernel Lab Submission",
    course: "CS302",
    subtitle: "Online Portal · CS302 Systems",
    due: "In 4 days · Online Portal",
    type: "lab",
    badge: "On Track",
  },
  {
    id: "act-3",
    date: { day: "15", month: "NOV" },
    title: "Prasunex Tech Hackathon",
    course: "Campus",
    subtitle: "Main Auditorium · Tech Innovate",
    due: "Nov 15 · Main Auditorium",
    type: "event",
    badge: "Event",
  },
];

// ⚡ QUICK ACCESS TILES
export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  { id: "qa-drills", label: "Micro Drills", title: "Micro Drills", desc: "Forgetting-curve revision", count: "3 queued", icon: "Brain" },
  { id: "qa-planner", label: "AI Study Planner", title: "Study Planner", desc: "7-day personalized schedule", count: "3 active", icon: "CalendarDays" },
  { id: "qa-grievance", label: "Grievance Centre", title: "Grievance Desk", desc: "ZK-proof anonymous report", count: "Protected", icon: "Shield" },
  { id: "qa-matcher", label: "Peer Matcher", title: "Peer Matcher", desc: "Reciprocal study pairings", count: "4 matches", icon: "Sparkles" },
];

// 💬 COPILOT PRESET PROMPTS & REPLIES
export const COPILOT_PRESETS = [
  {
    label: "Explain my weak topics",
    reply: "Based on recent quiz logs, your lowest mastery is in Data Structures: Graph Traversals (41%) and Computer Networks: Routing Protocols (64%). Would you like a 10-minute concept breakdown or 3 targeted practice questions?",
  },
  {
    label: "Create a study plan",
    reply: "I've drafted a balanced 3-day study plan: Day 1 (45 min) on Distance Vector routing, Day 2 (30 min) on Bellman-Ford exercises, and Day 3 (20 min) on a quick micro-drill before the Nov 10 test.",
  },
  {
    label: "Check grade prediction",
    reply: "Your current predicted grade is B+ (78%). Increasing practice effort by just +10% pushes your predicted score to 83% (A-), and +20% achieves an A (88%)!",
  },
  {
    label: "File a complaint",
    reply: "CAMPUS-NEXUS uses Zero-Knowledge Blind Tokens for 100% confidential reports. You can submit safety or academic concerns without attaching your name or student ID. Your tracking code will let you see Dean resolution updates securely.",
  },
];
