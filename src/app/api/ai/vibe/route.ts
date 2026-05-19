import { NextRequest, NextResponse } from "next/server";
import { generateVibeSummary } from "@/lib/ai/vibe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await generateVibeSummary(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Vibe generation error:", err);
    return NextResponse.json({ error: "Vibe generation failed" }, { status: 500 });
  }
}
