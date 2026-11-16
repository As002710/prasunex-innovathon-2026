import { NextResponse } from "next/server";
import { SEED_AUDIT_LOGS, SEED_CONTESTS } from "@/data/seed";

export async function GET() {
  return NextResponse.json({
    auditLogs: SEED_AUDIT_LOGS,
    contests: SEED_CONTESTS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "contest_grade") {
      const { studentId, studentName, courseId, currentGrade, requestedGrade, reason } = body;
      const newContest = {
        id: `contest-${Date.now()}`,
        studentId: studentId || "STU-2026-042",
        studentName: studentName || "Student (Demo Account)",
        courseId: courseId || "CS301",
        courseName: "Operating Systems",
        currentGrade: currentGrade || "B+",
        requestedGrade: requestedGrade || "A-",
        reason,
        timestamp: new Date().toISOString(),
        status: "pending",
      };

      return NextResponse.json({
        success: true,
        contest: newContest,
        message: "Grade contest request submitted to course instructor for human review.",
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
