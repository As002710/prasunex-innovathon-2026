import { NextResponse } from "next/server";
import { DEMO_USERS } from "@/data/seed";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = (body.role || "student").toLowerCase();

    const user = DEMO_USERS[role] || DEMO_USERS.student;
    const token = `mock-token-${role}-${Date.now()}`;

    return NextResponse.json({
      success: true,
      token,
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 400 });
  }
}
