import { NextRequest, NextResponse } from "next/server";
import { MOCK_WATCH_PARTIES } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vibe = searchParams.get("vibe");
  const matchId = searchParams.get("matchId");
  const safetyLevel = searchParams.get("safetyLevel");

  let parties = MOCK_WATCH_PARTIES;

  if (vibe) {
    parties = parties.filter((p) => p.vibe === vibe);
  }
  if (matchId) {
    parties = parties.filter((p) => p.match?.id === matchId);
  }
  if (safetyLevel) {
    parties = parties.filter((p) => p.safetyLevel === safetyLevel);
  }

  // Sort by popularity
  parties = parties.sort((a, b) => b.popularityScore - a.popularityScore);

  return NextResponse.json({ parties });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // In production: save to DB via Prisma, generate AI summary
    const newParty = {
      id: `wp-${Date.now()}`,
      ...body,
      currentAttendees: 1,
      popularityScore: 5.0,
      aiSummary: "New watch party created. Be the first to join!",
      createdAt: new Date(),
    };
    return NextResponse.json({ party: newParty }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create party" }, { status: 500 });
  }
}
