import { NextResponse } from "next/server";
import { SEED_TICKETS } from "@/data/seed";
import { calculateTicketPriority, evaluateSLA, generatePriorityChartData } from "@/lib/priority";
import { findDuplicateTicket } from "@/lib/similarity";

export async function GET() {
  const tickets = SEED_TICKETS.map((t) => {
    const currentPriority = calculateTicketPriority(t.basePriority, t.reportsCount, t.hoursOpen);
    const sla = evaluateSLA(t.locationType, t.hoursOpen);
    return {
      ...t,
      currentPriority,
      escalationLevel: sla.escalationLevel,
      remainingHours: sla.remainingHours,
      isBreached: sla.isBreached,
      escalationLabel: sla.escalationLabel,
    };
  }).sort((a, b) => b.currentPriority - a.currentPriority);

  const chartData = generatePriorityChartData(10);

  return NextResponse.json({
    tickets,
    chartData,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "create") {
      const { text, place, locationType, studentName } = body;
      const dup = findDuplicateTicket(text, place, SEED_TICKETS, 0.82);

      return NextResponse.json({
        isDuplicate: dup.isDuplicate,
        matchedTicketNumber: dup.matchedTicketNumber,
        similarityScore: dup.similarityScore,
        message: dup.isDuplicate
          ? `Joined existing ticket ${dup.matchedTicketNumber} (${(dup.similarityScore * 100).toFixed(0)}% semantic match). Priority escalated!`
          : "New ticket filed and queued with automated SLA timer.",
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
