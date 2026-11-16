// Unit Tests for CAMPUS-NEXUS Core Algorithms
// Verifies BKT, Priority formula, Point-biserial discrimination, and Gap-aware cutoffs

import { updateBKT, diagnoseDAGRootCauses } from "../lib/bkt.ts";
import { calculateTicketPriority, evaluateSLA } from "../lib/priority.ts";
import { computePointBiserial, auditQuestions } from "../lib/pointBiserial.ts";
import {
  FIXED_Z_CUTOFFS,
  GAP_AWARE_CUTOFFS,
  countStudentsNearBoundary,
  analyzeCutoffs,
} from "../lib/gapAware.ts";
import { generateSeedStudents, SEED_CONCEPTS, SEED_QUESTIONS } from "../data/seed.ts";
import { findDuplicateTicket } from "../lib/similarity.ts";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${msg}`);
}

console.log("\n==========================================");
console.log("RUNNING CAMPUS-NEXUS ALGORITHM UNIT TESTS");
console.log("==========================================\n");

// 1. TEST BKT ENGINE
console.log("--- 1. Testing Bayesian Knowledge Tracing (BKT) ---");
const priorL = 0.30;
const updatedCorrect = updateBKT(priorL, true, { pL0: 0.30, pT: 0.15, pG: 0.20, pS: 0.10 });
// Expected: P(L|correct) = 0.3*0.9 / (0.3*0.9 + 0.7*0.2) = 0.27 / 0.41 = 0.6585
// P(L') = 0.6585 + (1 - 0.6585)*0.15 = 0.7098
assert(
  Math.abs(updatedCorrect - 0.7098) < 0.005,
  `BKT correct response update produces ~0.710 (got ${updatedCorrect.toFixed(4)})`
);

const updatedIncorrect = updateBKT(priorL, false, { pL0: 0.30, pT: 0.15, pG: 0.20, pS: 0.10 });
// Expected: P(L|incorrect) = 0.3*0.1 / (0.3*0.1 + 0.7*0.8) = 0.03 / 0.59 = 0.0508
// P(L') = 0.0508 + (1 - 0.0508)*0.15 = 0.1932
assert(
  Math.abs(updatedIncorrect - 0.1932) < 0.005,
  `BKT incorrect response update produces ~0.193 (got ${updatedIncorrect.toFixed(4)})`
);

// Test DAG Root Cause Diagnosis
const studentMastery = {
  "c-os-arch": 0.92,
  "c-proc-mgmt": 0.84,
  "c-cpu-sched": 0.88,
  "c-sem-mutex": 0.41, // Red
  "c-deadlocks": 0.28, // Red (prereq is Semaphores & Mutex)
  "c-mem-mgmt": 0.52,
  "c-virt-mem": 0.49,
};

const diagnosis = diagnoseDAGRootCauses(SEED_CONCEPTS, studentMastery, {
  "c-deadlocks": 5,
  "c-sem-mutex": 5,
  "c-virt-mem": 2, // < 3 -> should say Not enough data
});

assert(
  diagnosis["c-deadlocks"].rootCauseId === "c-sem-mutex",
  "Deadlock Detection root cause correctly identified as Semaphores & Mutex"
);
assert(
  diagnosis["c-deadlocks"].explanation.includes("Deadlock Detection is red because its prerequisite Semaphores & Mutex is also weak (41%). Practise that first."),
  `Explainable root cause sentence generated: "${diagnosis["c-deadlocks"].explanation}"`
);
assert(
  diagnosis["c-virt-mem"].confidence === "Not enough data",
  `Concepts with <3 observations labelled 'Not enough data' (got ${diagnosis["c-virt-mem"].confidence})`
);

// 2. TEST PRIORITY FORMULA & SLA
console.log("\n--- 2. Testing Ticket Priority & SLA Escalation ---");
// priority = base * log2(1 + reports) * (1 + 0.1 * hours_open)
const labBase = 25;
const labReports = 8;
const labHours = 54;
const labPriority = calculateTicketPriority(labBase, labReports, labHours);
// Expected: 25 * log2(9) * (1 + 5.4) = 25 * 3.1699 * 6.4 = 507.18
assert(
  Math.abs(labPriority - 507.2) < 1.0,
  `Priority formula correctly calculates priority ~507.2 (got ${labPriority})`
);

const chairPriority = calculateTicketPriority(6, 1, 6);
assert(
  labPriority > chairPriority,
  `Overdue lab fault (priority ${labPriority}) outranks loose chair (priority ${chairPriority})`
);

const slaNormal = evaluateSLA("lab", 20);
assert(!slaNormal.isBreached && slaNormal.escalationLevel === "normal", "Lab ticket under 48h is normal");

const slaBreached = evaluateSLA("lab", 54);
assert(slaBreached.isBreached && slaBreached.escalationLevel === "hod", "Lab ticket at 54h escalated to HoD");

const slaDean = evaluateSLA("lab", 76);
assert(slaDean.escalationLevel === "dean", "Ticket open >72h escalated to Dean");

// 3. TEST POINT-BISERIAL DISCRIMINATION
console.log("\n--- 3. Testing Point-Biserial Discrimination ---");
const q13 = SEED_QUESTIONS.find((q) => q.id === "q-13")!;
const q14 = SEED_QUESTIONS.find((q) => q.id === "q-14")!;

assert(q13.rPbis === -0.24, `Q13 seeded with negative discrimination r_pbis = -0.24`);
assert(q14.rPbis === 0.148, `Q14 seeded with low discrimination r_pbis = 0.148 (< 0.15)`);

const audited = auditQuestions([
  {
    id: q13.id,
    qNumber: q13.qNumber,
    conceptId: q13.conceptId,
    text: q13.text,
    pVal: q13.pVal,
    rPbis: q13.rPbis,
    meanCorrect: 58.2,
    meanIncorrect: 65.4,
    flagged: false,
    status: "normal",
    graceMarks: 0,
  },
  {
    id: q14.id,
    qNumber: q14.qNumber,
    conceptId: q14.conceptId,
    text: q14.text,
    pVal: q14.pVal,
    rPbis: q14.rPbis,
    meanCorrect: 61.0,
    meanIncorrect: 59.2,
    flagged: false,
    status: "normal",
    graceMarks: 0,
  },
]);

assert(audited[0].flagged && audited[0].flagReason!.includes("Negative discrimination"), "Q13 correctly flagged for negative discrimination");
assert(audited[1].flagged && audited[1].flagReason!.includes("Low discrimination"), "Q14 correctly flagged for low discrimination (< 0.15)");

// 4. TEST GAP-AWARE CUTOFFS
console.log("\n--- 4. Testing Gap-Aware vs Fixed Cutoffs ---");
const students = generateSeedStudents();
const scores = students.map((s) => s.totalScore);

const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
console.log(`Cohort size: ${scores.length}, Mean score: ${mean.toFixed(1)}`);
assert(Math.abs(mean - 60.4) < 0.2, `Synthetic cohort mean matches 60.4 (got ${mean.toFixed(2)})`);

const fixedNear = countStudentsNearBoundary(scores, FIXED_Z_CUTOFFS);
const gapNear = countStudentsNearBoundary(scores, GAP_AWARE_CUTOFFS);

console.log(`Fixed Z-score stranded count: ${fixedNear.totalNearBoundary}`);
console.log(`Gap-aware stranded count: ${gapNear.totalNearBoundary}`);

assert(fixedNear.totalNearBoundary === 15, `Fixed Z-score cutoffs leave exactly 15 students stranded below boundaries (got ${fixedNear.totalNearBoundary})`);
assert(gapNear.totalNearBoundary === 3, `Gap-aware cutoffs leave exactly 3 students stranded below boundaries (got ${gapNear.totalNearBoundary})`);

const analysis = analyzeCutoffs(scores, GAP_AWARE_CUTOFFS, "gap-aware", FIXED_Z_CUTOFFS);
assert(analysis.studentsShifted > 0, `Gap-aware cutoffs shift grades for ${analysis.studentsShifted} students`);

// 5. TEST DUPLICATE TICKET DETECTION
console.log("\n--- 5. Testing Duplicate Ticket Detection ---");
const dupResult = findDuplicateTicket(
  "Power socket sparking on Bench 14 with burning smell",
  "Lab 2, Bench 14",
  [
    {
      id: "tkt-101",
      ticketNumber: "TKT-101",
      place: "Lab 2, Bench 14",
      text: "Power socket sparking on Bench 14 and emitting burning plastic smell.",
      status: "open",
    },
    {
      id: "tkt-105",
      ticketNumber: "TKT-105",
      place: "Hostel Block B, Wing 2",
      text: "Loose chair backrest in common study room B-204.",
      status: "open",
    },
  ],
  0.82
);

assert(dupResult.isDuplicate, `Duplicate detected with similarity ${dupResult.similarityScore}`);
assert(dupResult.matchedTicketNumber === "TKT-101", `Matched to existing ticket TKT-101`);

console.log("\n==========================================");
console.log("🎉 ALL ALGORITHM UNIT TESTS PASSED (100%)");
console.log("==========================================\n");
