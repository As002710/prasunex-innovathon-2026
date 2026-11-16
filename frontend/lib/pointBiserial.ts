// Point-Biserial Item Discrimination Analysis
// r_pbis = ((X1bar - X0bar) / S_X) * sqrt(p * (1 - p))

export interface QuestionStats {
  id: string;
  qNumber: number;
  conceptId: string;
  text: string;
  pVal: number; // Difficulty: proportion answering correctly
  rPbis: number; // Discrimination index
  meanCorrect: number; // X1bar
  meanIncorrect: number; // X0bar
  flagged: boolean;
  flagReason?: string;
  status: "normal" | "nullified" | "grace";
  graceMarks: number;
}

/**
 * Calculates the sample standard deviation of an array of numbers.
 */
export function calculateSampleSD(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

/**
 * Computes the point-biserial discrimination coefficient for a question.
 */
export function computePointBiserial(
  studentOverallScores: number[],
  studentQuestionBinary: boolean[]
): {
  rPbis: number;
  pVal: number;
  meanCorrect: number;
  meanIncorrect: number;
} {
  const n = studentOverallScores.length;
  if (n === 0) return { rPbis: 0, pVal: 0, meanCorrect: 0, meanIncorrect: 0 };

  const correctScores: number[] = [];
  const incorrectScores: number[] = [];

  for (let i = 0; i < n; i++) {
    if (studentQuestionBinary[i]) {
      correctScores.push(studentOverallScores[i]);
    } else {
      incorrectScores.push(studentOverallScores[i]);
    }
  }

  const p = correctScores.length / n;
  if (p === 0 || p === 1) {
    return { rPbis: 0, pVal: p, meanCorrect: 0, meanIncorrect: 0 };
  }

  const meanCorrect = correctScores.reduce((a, b) => a + b, 0) / correctScores.length;
  const meanIncorrect = incorrectScores.length > 0
    ? incorrectScores.reduce((a, b) => a + b, 0) / incorrectScores.length
    : 0;

  const sx = calculateSampleSD(studentOverallScores);
  if (sx === 0) {
    return { rPbis: 0, pVal: p, meanCorrect, meanIncorrect };
  }

  const rPbis = ((meanCorrect - meanIncorrect) / sx) * Math.sqrt(p * (1 - p));
  return {
    rPbis: Math.round(rPbis * 1000) / 1000,
    pVal: Math.round(p * 1000) / 1000,
    meanCorrect: Math.round(meanCorrect * 10) / 10,
    meanIncorrect: Math.round(meanIncorrect * 10) / 10,
  };
}

/**
 * Flags questions with low or negative discrimination (threshold 0.15).
 */
export function auditQuestions(questions: QuestionStats[], threshold: number = 0.15): QuestionStats[] {
  return questions.map((q) => {
    let flagged = false;
    let flagReason = "";

    if (q.rPbis < 0) {
      flagged = true;
      flagReason = `Negative discrimination (r_pbis = ${q.rPbis.toFixed(3)}). Stronger students missed this question more frequently, indicating ambiguous phrasing or misleading distractor.`;
    } else if (q.rPbis < threshold) {
      flagged = true;
      flagReason = `Low discrimination (r_pbis = ${q.rPbis.toFixed(3)} < ${threshold}). Question does not effectively differentiate student mastery.`;
    }

    return {
      ...q,
      flagged,
      flagReason: flagged ? flagReason : undefined,
    };
  });
}
