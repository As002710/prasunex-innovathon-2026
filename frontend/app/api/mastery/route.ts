import { NextResponse } from "next/server";
import { SEED_CONCEPTS, DEMO_STUDENT_TREND, PRACTICE_SET_SEMAPHORES } from "@/data/seed";
import { diagnoseDAGRootCauses, updateBKT } from "@/lib/bkt";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const studentId = url.searchParams.get("studentId") || "STU-2026-042";

  // Demo student mastery profile:
  // OS Architecture 92% -> Process Mgmt 84% -> CPU Scheduling 88%
  // Process Mgmt -> Semaphores & Mutex 41% -> Deadlock Detection 28%
  // OS Architecture -> Memory Mgmt 52% -> Virtual Memory 49%
  const studentMastery: Record<string, number> = {
    "c-os-arch": 0.92,
    "c-proc-mgmt": 0.84,
    "c-cpu-sched": 0.88,
    "c-sem-mutex": 0.41,
    "c-deadlocks": 0.28,
    "c-mem-mgmt": 0.52,
    "c-virt-mem": 0.49,
  };

  const datapointCounts: Record<string, number> = {
    "c-os-arch": 5,
    "c-proc-mgmt": 5,
    "c-cpu-sched": 5,
    "c-sem-mutex": 5,
    "c-deadlocks": 5,
    "c-mem-mgmt": 5,
    "c-virt-mem": 5,
  };

  const diagnosis = diagnoseDAGRootCauses(SEED_CONCEPTS, studentMastery, datapointCounts);

  return NextResponse.json({
    concepts: SEED_CONCEPTS,
    studentMastery,
    diagnosis,
    trend: DEMO_STUDENT_TREND,
    practiceQuestions: PRACTICE_SET_SEMAPHORES,
    disclaimer: "Flags are advice only and must never feed into marks or discipline.",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, selectedIndex, currentMastery } = body;

    const question = PRACTICE_SET_SEMAPHORES.find((q) => q.id === questionId);
    if (!question) {
      return NextResponse.json({ error: "Practice question not found" }, { status: 404 });
    }

    const isCorrect = selectedIndex === question.correctIndex;
    const prior = (currentMastery || 41) / 100;
    const updatedMastery = Math.round(updateBKT(prior, isCorrect) * 100);

    return NextResponse.json({
      isCorrect,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      previousMastery: Math.round(prior * 100),
      updatedMastery,
      feedback: isCorrect
        ? `Correct! Concept mastery increased from ${Math.round(prior * 100)}% to ${updatedMastery}%.`
        : `Incorrect. Concept mastery adjusted to ${updatedMastery}%. Review the prerequisite principles.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
