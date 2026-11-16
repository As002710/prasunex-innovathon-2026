// Gap-Aware & Fixed Z-Score Cut-off Algorithm for CAMPUS-NEXUS
// Minimizes students stranded right below a grade boundary

import type { GradeCutoffs, CutoffModeAnalysis } from "./types.ts";

export const FIXED_Z_CUTOFFS: GradeCutoffs = {
  C: 44.6,
  B: 54.1,
  BPlus: 60.4,
  A: 66.8,
  APlus: 73.1,
  O: 79.4,
};

export const GAP_AWARE_CUTOFFS: GradeCutoffs = {
  C: 45.2,
  B: 54.1,
  BPlus: 61.1,
  A: 67.9,
  APlus: 72.8,
  O: 77.5,
};

/**
 * Assigns a letter grade given a score and cut-offs.
 */
export function getGradeForScore(score: number, cutoffs: GradeCutoffs): string {
  if (score >= cutoffs.O) return "O";
  if (score >= cutoffs.APlus) return "A+";
  if (score >= cutoffs.A) return "A";
  if (score >= cutoffs.BPlus) return "B+";
  if (score >= cutoffs.B) return "B";
  if (score >= cutoffs.C) return "C";
  return "F";
}

/**
 * Computes how many students fall strictly within [cutoff - 1.0, cutoff) for all boundaries.
 */
export function countStudentsNearBoundary(scores: number[], cutoffs: GradeCutoffs): {
  totalNearBoundary: number;
  perBoundary: Record<string, number>;
} {
  const boundaries: [string, number][] = [
    ["C", cutoffs.C],
    ["B", cutoffs.B],
    ["B+", cutoffs.BPlus],
    ["A", cutoffs.A],
    ["A+", cutoffs.APlus],
    ["O", cutoffs.O],
  ];

  let total = 0;
  const perBoundary: Record<string, number> = {};

  for (const [grade, cut] of boundaries) {
    // Student within 1.0 mark strictly below boundary: cut - 1.0 <= score < cut
    const near = scores.filter((s) => s >= cut - 1.0 && s < cut).length;
    perBoundary[grade] = near;
    total += near;
  }

  return { totalNearBoundary: total, perBoundary };
}

/**
 * Finds optimal cut-offs in a window [z - delta, z + delta] that minimize students in [cut - 1, cut).
 */
export function findGapAwareCutoffs(
  scores: number[],
  baseCutoffs: GradeCutoffs = FIXED_Z_CUTOFFS,
  windowDelta: number = 2.0,
  step: number = 0.1
): GradeCutoffs {
  const optimizeBoundary = (base: number): number => {
    let bestCut = base;
    let minStranded = Infinity;

    for (let c = base - windowDelta; c <= base + windowDelta + 0.001; c += step) {
      const rounded = Math.round(c * 10) / 10;
      const stranded = scores.filter((s) => s >= rounded - 1.0 && s < rounded).length;
      if (stranded < minStranded) {
        minStranded = stranded;
        bestCut = rounded;
      }
    }
    return bestCut;
  };

  return {
    C: optimizeBoundary(baseCutoffs.C),
    B: optimizeBoundary(baseCutoffs.B),
    BPlus: optimizeBoundary(baseCutoffs.BPlus),
    A: optimizeBoundary(baseCutoffs.A),
    APlus: optimizeBoundary(baseCutoffs.APlus),
    O: optimizeBoundary(baseCutoffs.O),
  };
}

/**
 * Full comparative analysis of grading cut-offs against student scores.
 */
export function analyzeCutoffs(
  scores: number[],
  cutoffs: GradeCutoffs,
  mode: "fixed" | "gap-aware" | "custom",
  referenceFixedCutoffs: GradeCutoffs = FIXED_Z_CUTOFFS
): CutoffModeAnalysis {
  const gradeCounts: Record<string, number> = {
    O: 0,
    "A+": 0,
    A: 0,
    "B+": 0,
    B: 0,
    C: 0,
    F: 0,
  };

  scores.forEach((score) => {
    const g = getGradeForScore(score, cutoffs);
    gradeCounts[g] = (gradeCounts[g] || 0) + 1;
  });

  const { totalNearBoundary } = countStudentsNearBoundary(scores, cutoffs);

  // Compute how many students shifted grades compared to baseline fixed cut-offs
  let studentsShifted = 0;
  scores.forEach((score) => {
    const fixedGrade = getGradeForScore(score, referenceFixedCutoffs);
    const currentGrade = getGradeForScore(score, cutoffs);
    if (fixedGrade !== currentGrade) studentsShifted++;
  });

  return {
    mode,
    cutoffs,
    gradeCounts,
    atBoundaryCount: totalNearBoundary,
    studentsShifted,
  };
}
