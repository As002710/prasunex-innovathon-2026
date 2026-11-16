import { NextResponse } from "next/server";
import { generateSeedStudents, SEED_QUESTIONS } from "@/data/seed";
import { FIXED_Z_CUTOFFS, GAP_AWARE_CUTOFFS, analyzeCutoffs } from "@/lib/gapAware";
import { auditQuestions, QuestionStats } from "@/lib/pointBiserial";

export async function GET() {
  const students = generateSeedStudents();
  const scores = students.map((s) => s.totalScore);

  const fixedAnalysis = analyzeCutoffs(scores, FIXED_Z_CUTOFFS, "fixed", FIXED_Z_CUTOFFS);
  const gapAwareAnalysis = analyzeCutoffs(scores, GAP_AWARE_CUTOFFS, "gap-aware", FIXED_Z_CUTOFFS);

  // Histogram bins (e.g. 25-30, 30-35, ..., 80-85)
  const bins: { range: string; count: number; min: number; max: number }[] = [];
  for (let min = 25; min < 85; min += 5) {
    const max = min + 5;
    const count = scores.filter((s) => s >= min && s < max).length;
    bins.push({ range: `${min}-${max}`, count, min, max });
  }

  // Question audit stats
  const questionStats: QuestionStats[] = SEED_QUESTIONS.map((q) => ({
    id: q.id,
    qNumber: q.qNumber,
    conceptId: q.conceptId,
    text: q.text,
    pVal: q.pVal,
    rPbis: q.rPbis,
    meanCorrect: Math.round((60.4 + q.rPbis * 5.3) * 10) / 10,
    meanIncorrect: Math.round((60.4 - q.rPbis * 5.3) * 10) / 10,
    flagged: Boolean(q.flagged),
    status: q.status,
    graceMarks: q.graceMarks || 0,
  }));

  const auditedQuestions = auditQuestions(questionStats, 0.15);

  return NextResponse.json({
    students,
    totalStudents: students.length,
    mean: 60.4,
    sd: 10.6,
    bins,
    fixedAnalysis,
    gapAwareAnalysis,
    questions: auditedQuestions,
  });
}
