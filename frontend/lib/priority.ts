// Priority and SLA Escalation Engine for CAMPUS-NEXUS Ticket Desk
// Formula: priority = base * log2(1 + reports) * (1 + 0.1 * hours_open)

export interface SLAConfig {
  labHours: number;    // default 48h
  hostelHours: number; // default 24h
  deanEscalationHours: number; // default 72h
}

export const DEFAULT_SLA_CONFIG: SLAConfig = {
  labHours: 48,
  hostelHours: 24,
  deanEscalationHours: 72,
};

/**
 * Calculates live ticket priority.
 * priority = base * log2(1 + reports) * (1 + 0.1 * hours_open)
 */
export function calculateTicketPriority(
  basePriority: number,
  reportsCount: number,
  hoursOpen: number
): number {
  // reportsCount >= 1
  const reportsTerm = Math.log2(1 + Math.max(1, reportsCount));
  const waitingTerm = 1 + 0.1 * Math.max(0, hoursOpen);
  const priority = basePriority * reportsTerm * waitingTerm;
  return Math.round(priority * 10) / 10;
}

/**
 * Computes SLA state, remaining hours, and escalation tier.
 */
export function evaluateSLA(
  locationType: "lab" | "hostel" | "classroom" | "other",
  hoursOpen: number,
  config: SLAConfig = DEFAULT_SLA_CONFIG
): {
  slaTargetHours: number;
  remainingHours: number;
  isBreached: boolean;
  escalationLevel: "normal" | "hod" | "dean";
  escalationLabel: string;
} {
  const slaTargetHours = locationType === "hostel" ? config.hostelHours : config.labHours;
  const remainingHours = Math.max(0, slaTargetHours - hoursOpen);
  const isBreached = hoursOpen > slaTargetHours;

  let escalationLevel: "normal" | "hod" | "dean" = "normal";
  let escalationLabel = "On Schedule (Assigned Facility Staff)";

  if (hoursOpen >= config.deanEscalationHours) {
    escalationLevel = "dean";
    escalationLabel = "CRITICAL: Escalated to Dean of Infrastructure (Over 72h)";
  } else if (isBreached) {
    escalationLevel = "hod";
    escalationLabel = `SLA Breached (+${(hoursOpen - slaTargetHours).toFixed(0)}h) — Escalated to Head of Department`;
  }

  return {
    slaTargetHours,
    remainingHours,
    isBreached,
    escalationLevel,
    escalationLabel,
  };
}

/**
 * Generates synthetic points for the priority chart:
 * "Priority rises with repeats and waiting"
 * Curves for New (0h), 24h open, 48h open across 1 to 10 reports.
 */
export function generatePriorityChartData(basePriority: number = 10) {
  const data = [];
  for (let reports = 1; reports <= 10; reports++) {
    data.push({
      reports,
      newTicket: calculateTicketPriority(basePriority, reports, 0),
      open24h: calculateTicketPriority(basePriority, reports, 24),
      open48h: calculateTicketPriority(basePriority, reports, 48),
    });
  }
  return data;
}
