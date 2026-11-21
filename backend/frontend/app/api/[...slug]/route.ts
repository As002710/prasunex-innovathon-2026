import { NextRequest, NextResponse } from "next/server";

// In-memory data store for live demo interaction
const MOCK_TICKETS = [
  {
    id: "TCK-101",
    ticket_number: 101,
    title: "Projector lamp burnt out in Seminar Hall 3",
    description: "During morning Operating Systems lecture, the ceiling projector displayed high temp warning and shut down.",
    location: "Academic Block 2, Floor 3, Room 304",
    category: "Electrical",
    status: "In Progress",
    priority: "High",
    assigned_to: "Sunil Verma (Lab Warden)",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    sla_countdown: "3h 45m",
    sla_hours_remaining: 3.75,
    duplicate_count: 2,
    upvotes: 8,
  },
  {
    id: "TCK-102",
    ticket_number: 102,
    title: "Wi-Fi Access Point 5GHz band dropping connections",
    description: "AP-CS-B2 repeatedly reboots when student concurrency exceeds 40 devices.",
    location: "Hostel Block B, 2nd Floor Common Room",
    category: "Networking",
    status: "Open",
    priority: "Urgent",
    assigned_to: "Ramesh Kumar (Network Admin)",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    sla_countdown: "1h 15m",
    sla_hours_remaining: 1.25,
    duplicate_count: 5,
    upvotes: 14,
  },
  {
    id: "TCK-103",
    ticket_number: 103,
    title: "Air conditioning leak near server rack #2",
    description: "Condensation water dripping close to edge router UPS battery tray.",
    location: "Main Data Center, Basement Floor",
    category: "HVAC",
    status: "Resolved",
    priority: "Critical",
    assigned_to: "Facilities Team",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date().toISOString(),
    sla_countdown: "Resolved",
    sla_hours_remaining: 0,
    duplicate_count: 1,
    upvotes: 4,
  },
];

const MOCK_COURSES = [
  { id: "cs201", code: "CS201", title: "Data Structures & Algorithms", department: "CSE", semester: 3, enrolled: 68, avgScore: 78.4, passRate: 92 },
  { id: "cs301", code: "CS301", title: "Operating Systems", department: "CSE", semester: 5, enrolled: 62, avgScore: 72.1, passRate: 88 },
  { id: "cs401", code: "CS401", title: "Machine Learning & AI", department: "CSE", semester: 7, enrolled: 54, avgScore: 81.6, passRate: 96 },
];

const MOCK_STUDENTS = [
  { id: "usr-012", name: "Rohan Patel", roll_number: "21CS044", department: "CSE", semester: 5, attendance: 68.2, cgpa: 7.4, at_risk: true, risk_reason: "Attendance below 75%" },
  { id: "usr-045", name: "Simran Kaur", roll_number: "21CS089", department: "CSE", semester: 5, attendance: 71.5, cgpa: 7.8, at_risk: true, risk_reason: "Low quiz score in Semaphores" },
  { id: "usr-078", name: "Aditya Verma", roll_number: "21CS112", department: "CSE", semester: 5, attendance: 64.0, cgpa: 6.9, at_risk: true, risk_reason: "Consecutive absences in Lab" },
  { id: "usr-092", name: "Neha Joshi", roll_number: "21CS135", department: "CSE", semester: 5, attendance: 73.0, cgpa: 8.1, at_risk: true, risk_reason: "Virtual Memory diagnostic falling" },
  { id: "usr-001", name: "Aarav Sharma", roll_number: "21CS001", department: "CSE", semester: 5, attendance: 91.4, cgpa: 9.4, at_risk: false, risk_reason: "None" },
];

const MOCK_EARLY_WARNINGS = [
  { id: "w-1", student_id: "usr-012", student_name: "Rohan Patel", roll_number: "21CS044", course_code: "CS201", attendance: 68.2, predicted_attendance: 71.4, status: "Critical", recommended_action: "Issue Dean Notice & Remedial Sessions" },
  { id: "w-2", student_id: "usr-045", student_name: "Simran Kaur", roll_number: "21CS089", course_code: "CS301", attendance: 71.5, predicted_attendance: 73.8, status: "Warning", recommended_action: "Pair with Peer Tutor for Semaphores" },
  { id: "w-3", student_id: "usr-078", student_name: "Aditya Verma", roll_number: "21CS112", course_code: "CS201", attendance: 64.0, predicted_attendance: 68.0, status: "Critical", recommended_action: "Counseling & HoD Review" },
  { id: "w-4", student_id: "usr-092", student_name: "Neha Joshi", roll_number: "21CS135", course_code: "CS401", attendance: 73.0, predicted_attendance: 74.5, status: "Warning", recommended_action: "Assign Micro-Drill Modules" },
];

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const path = (params.slug || []).join("/");

  if (path === "dashboard/overview") {
    return NextResponse.json({
      enrolled_students: 200,
      active_courses: 14,
      open_tickets: 3,
      at_risk_count: 4,
      average_attendance: 87.8,
      nba_attainment_pct: 88.9,
      verified_audit_events: 1089,
    });
  }

  if (path === "facilities/tickets") {
    return NextResponse.json(MOCK_TICKETS);
  }

  if (path === "grading/courses") {
    return NextResponse.json(MOCK_COURSES);
  }

  if (path === "students") {
    return NextResponse.json(MOCK_STUDENTS);
  }

  if (path === "attendance/early-warning") {
    return NextResponse.json(MOCK_EARLY_WARNINGS);
  }

  if (path === "accreditation/outcomes") {
    return NextResponse.json([
      { co_code: "CO1", description: "Analyze complexity of graph & tree algorithms", target: 70, attained: 84.5, status: "Attained" },
      { co_code: "CO2", description: "Design multi-threaded synchronisation primitives", target: 70, attained: 76.2, status: "Attained" },
      { co_code: "CO3", description: "Evaluate deadlock avoidance & detection", target: 70, attained: 68.4, status: "Near Target" },
      { co_code: "CO4", description: "Implement virtual memory paging mechanisms", target: 70, attained: 79.1, status: "Attained" },
    ]);
  }

  if (path === "admin/billing") {
    return NextResponse.json({
      active_tier: "autonomous_enterprise",
      tier_name: "Autonomous Enterprise",
      students_count: 200,
      price_per_student: 28,
      arr_usd: 5600,
      status: "Active",
      next_renewal: "2027-11-15",
    });
  }

  if (path === "attendance/me") {
    return NextResponse.json({
      overall_pct: 86.4,
      status: "Good Standing (>75%)",
      courses: [
        { code: "CS201", title: "Data Structures", attended: 26, total: 30, pct: 86.7 },
        { code: "CS301", title: "Operating Systems", attended: 23, total: 28, pct: 82.1 },
        { code: "CS401", title: "Machine Learning", attended: 21, total: 24, pct: 87.5 },
      ],
      safe_bunks_remaining: 3,
    });
  }

  if (path === "knowledge/me") {
    return NextResponse.json({
      overall_mastery: 72,
      concepts: [
        { name: "DBMS Indexing", mastery: 0.92, status: "Mastered" },
        { name: "CPU Scheduling", mastery: 0.88, status: "Mastered" },
        { name: "Process Management", mastery: 0.84, status: "Mastered" },
        { name: "Virtual Memory", mastery: 0.49, status: "Needs Practice" },
        { name: "Semaphores & Mutex", mastery: 0.41, status: "Needs Practice" },
        { name: "Deadlock Detection", mastery: 0.28, status: "Root Weakness" },
      ],
      root_cause_explanation: "Deadlock Detection is weak (28%) because its prerequisite Semaphores & Mutex is also weak (41%). Practice that first.",
    });
  }

  if (path === "peer-matcher/me") {
    return NextResponse.json([
      { id: "peer-1", name: "Ananya Iyer", roll: "21CS015", strength: "Semaphores & Concurrency", wants_help_with: "Virtual Memory", match_score: 94 },
      { id: "peer-2", name: "Devansh Mehta", roll: "21CS032", strength: "Deadlock Detection", wants_help_with: "Graph Algorithms", match_score: 89 },
    ]);
  }

  if (path === "opportunities") {
    return NextResponse.json([
      { id: "opp-1", title: "Google Summer of Code 2026 Mentorship", company: "Google Open Source", stipend: "$3,000 - $6,000", deadline: "Dec 15, 2026", type: "Fellowship" },
      { id: "opp-2", title: "Systems Engineer Intern (Linux Kernel)", company: "Red Hat", stipend: "₹65,000 / month", deadline: "Nov 30, 2026", type: "Internship" },
      { id: "opp-3", title: "Prasunex Innovathon National Finals", company: "Prasunex AI", stipend: "₹2,50,000 Prize Pool", deadline: "Jan 10, 2027", type: "Hackathon" },
    ]);
  }

  if (path === "study-plan") {
    return NextResponse.json({
      generated_at: new Date().toISOString(),
      daily_goal_minutes: 45,
      tasks: [
        { id: "t-1", topic: "Semaphores & Mutex Locking", duration_min: 20, done: false },
        { id: "t-2", topic: "Dining Philosophers Problem Review", duration_min: 15, done: false },
        { id: "t-3", topic: "Micro-Drill: Deadlock Graph Cycle", duration_min: 10, done: false },
      ],
    });
  }

  if (path === "micro-drills") {
    return NextResponse.json([
      {
        id: "d-1",
        question: "In Banker's Algorithm, which condition must hold for a state to be declared safe?",
        options: ["All resources are free", "A safe sequence exists where every process can terminate", "Deadlock occurs only once", "Mutual exclusion is disabled"],
        correct_index: 1,
        explanation: "A state is safe if there exists at least one sequence of process allocations that allows every process to complete without deadlock.",
      },
    ]);
  }

  if (path === "privacy/reports") {
    return NextResponse.json([
      { id: "REP-9901", tracking_code: "ZK-7741-X9", category: "Academic Rigor", summary: "Biased grading distribution in Section B lab viva", status: "Investigating", created_at: "2 days ago" },
    ]);
  }

  return NextResponse.json({ path, success: true, message: "OK" });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const path = (params.slug || []).join("/");

  if (path === "facilities/tickets") {
    try {
      const body = await req.json();
      const newTicket = {
        id: `TCK-${Date.now()}`,
        ticket_number: MOCK_TICKETS.length + 101,
        title: body.title || "Facility Issue",
        description: body.description || "",
        location: body.location || "Campus Premises",
        category: body.category || "General",
        status: "Open",
        priority: body.priority || "Normal",
        assigned_to: "Duty Warden / Technician",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sla_countdown: "48h 00m",
        sla_hours_remaining: 48,
        duplicate_count: 1,
        upvotes: 1,
      };
      MOCK_TICKETS.unshift(newTicket);
      return NextResponse.json({ success: true, ticket: newTicket, message: "Ticket dispatched to operations team." });
    } catch {
      return NextResponse.json({ success: true, message: "Ticket logged." });
    }
  }

  if (path === "grading/sandbox") {
    try {
      const body = await req.json();
      const meanShift = body.mean_shift || 0;
      const stdScale = body.std_scale || 1;
      return NextResponse.json({
        course_id: body.course_id,
        mean_shift: meanShift,
        std_scale: stdScale,
        mean_score: (72.4 + meanShift * 2).toFixed(1),
        std_dev: (10.6 * stdScale).toFixed(1),
        students_affected: Math.abs(Math.round(meanShift * 4)),
        saved: body.save_grades || false,
      });
    } catch {
      return NextResponse.json({ success: true });
    }
  }

  if (path === "grading/upload-csv") {
    return NextResponse.json({
      uploaded_rows: 100,
      validation_errors: 0,
      course_id: req.nextUrl.searchParams.get("course_id") || "cs201",
      message: "Successfully parsed CSV marks ledger.",
    });
  }

  return NextResponse.json({ path, success: true, message: "Received" });
}
