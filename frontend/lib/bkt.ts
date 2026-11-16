// Bayesian Knowledge Tracing (BKT) Engine for CAMPUS-NEXUS
// Standard Corbett & Anderson formulation with DAG prerequisite propagation

import type { BKTParameters, ConceptNode } from "./types.ts";

export const DEFAULT_BKT_PARAMS: BKTParameters = {
  pL0: 0.30, // Prior probability of knowledge
  pT: 0.15,  // Transition probability (learning step)
  pG: 0.20,  // Guess probability
  pS: 0.10,  // Slip probability
};

/**
 * Updates mastery probability after observing a binary student response (correct=true, incorrect=false).
 *
 * Bayes Rule:
 * P(L|correct)   = P(L)*(1 - S) / [ P(L)*(1 - S) + (1 - P(L))*G ]
 * P(L|incorrect) = P(L)*S       / [ P(L)*S       + (1 - P(L))*(1 - G) ]
 *
 * Learning Transition:
 * P(L_{t+1})     = P(L|action) + (1 - P(L|action)) * T
 */
export function updateBKT(
  priorL: number,
  isCorrect: boolean,
  params: BKTParameters = DEFAULT_BKT_PARAMS
): number {
  const { pT, pG, pS } = params;
  let posteriorGivenAction: number;

  if (isCorrect) {
    const numerator = priorL * (1 - pS);
    const denominator = numerator + (1 - priorL) * pG;
    posteriorGivenAction = denominator > 0 ? numerator / denominator : priorL;
  } else {
    const numerator = priorL * pS;
    const denominator = numerator + (1 - priorL) * (1 - pG);
    posteriorGivenAction = denominator > 0 ? numerator / denominator : priorL;
  }

  // Knowledge transition (learning opportunity)
  const updatedL = posteriorGivenAction + (1 - posteriorGivenAction) * pT;
  return Math.max(0.01, Math.min(0.99, updatedL));
}

/**
 * Computes concept mastery from a series of observed test question results.
 */
export function computeTrajectoryBKT(
  responses: boolean[],
  params: BKTParameters = DEFAULT_BKT_PARAMS
): { history: number[]; finalMastery: number } {
  let currentL = params.pL0;
  const history: number[] = [currentL];

  for (const resp of responses) {
    currentL = updateBKT(currentL, resp, params);
    history.push(currentL);
  }

  return { history, finalMastery: currentL };
}

export interface RootCauseDiagnosis {
  conceptId: string;
  conceptName: string;
  mastery: number;
  isWeak: boolean; // < 50%
  rootCauseId?: string;
  rootCauseName?: string;
  rootCauseMastery?: number;
  explanation: string;
  confidence: "High" | "Medium" | "Low" | "Not enough data";
  datapointsCount: number;
}

/**
 * Evaluates student mastery across the DAG and detects root cause prerequisites.
 *
 * Rule: if a node is red (<50%) and its prerequisite is also weak (<50%),
 * mark the PREREQUISITE as the root cause and provide the explainable sentence.
 */
export function diagnoseDAGRootCauses(
  concepts: ConceptNode[],
  studentMastery: Record<string, number>, // conceptId -> 0..1 (or 0..100)
  datapointCounts: Record<string, number> = {}
): Record<string, RootCauseDiagnosis> {
  const nodeMap = new Map<string, ConceptNode>();
  concepts.forEach((c) => nodeMap.set(c.id, c));

  const diagnosis: Record<string, RootCauseDiagnosis> = {};

  for (const concept of concepts) {
    let rawScore = studentMastery[concept.id] ?? 0.5;
    // Normalize to 0-100 percentage if in 0-1 range
    const masteryPct = rawScore <= 1.0 ? Math.round(rawScore * 100) : Math.round(rawScore);
    const count = datapointCounts[concept.id] ?? 5; // default 5 assessments if seeded

    let confidence: RootCauseDiagnosis["confidence"] = "High";
    if (count < 3) {
      confidence = "Not enough data";
    } else if (count < 4) {
      confidence = "Low";
    } else if (count < 5) {
      confidence = "Medium";
    }

    const isWeak = masteryPct < 50;

    let rootCauseId: string | undefined;
    let rootCauseName: string | undefined;
    let rootCauseMastery: number | undefined;
    let explanation = `${concept.name} is on track (${masteryPct}% mastery).`;

    if (confidence === "Not enough data") {
      explanation = `Not enough data (${count} observations). We require at least 3 assessments before estimating mastery.`;
    } else if (isWeak) {
      // Check prerequisites in DAG
      let foundPrereqWeakness = false;
      for (const prereqId of concept.prerequisites) {
        const prereq = nodeMap.get(prereqId);
        if (prereq) {
          const prereqScore = studentMastery[prereqId] ?? 0.5;
          const prereqPct = prereqScore <= 1.0 ? Math.round(prereqScore * 100) : Math.round(prereqScore);

          if (prereqPct < 50) {
            rootCauseId = prereq.id;
            rootCauseName = prereq.name;
            rootCauseMastery = prereqPct;
            explanation = `${concept.name} is red because its prerequisite ${prereq.name} is also weak (${prereqPct}%). Practise that first.`;
            foundPrereqWeakness = true;
            break;
          }
        }
      }

      if (!foundPrereqWeakness) {
        explanation = `${concept.name} is weak (${masteryPct}%), but its foundational concepts are solid. Direct practice on this concept is recommended.`;
      }
    } else if (masteryPct < 80) {
      explanation = `${concept.name} is progressing (${masteryPct}%). Reinforce key topics to reach high mastery.`;
    } else {
      explanation = `${concept.name} is mastered (${masteryPct}%). Excellent grasp of fundamentals.`;
    }

    diagnosis[concept.id] = {
      conceptId: concept.id,
      conceptName: concept.name,
      mastery: masteryPct,
      isWeak,
      rootCauseId,
      rootCauseName,
      rootCauseMastery,
      explanation,
      confidence,
      datapointsCount: count,
    };
  }

  return diagnosis;
}
