import { NextRequest, NextResponse } from "next/server";
import { getAIRecommendations } from "@/lib/ai/recommendation";
import { MOCK_WATCH_PARTIES } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  try {
    const { user, userQuery, filters } = await req.json();

    const result = await getAIRecommendations({
      user: user ?? {},
      watchParties: MOCK_WATCH_PARTIES,
      userQuery,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("AI recommendation error:", err);
    return NextResponse.json(
      { error: "Recommendation service unavailable" },
      { status: 500 }
    );
  }
}
