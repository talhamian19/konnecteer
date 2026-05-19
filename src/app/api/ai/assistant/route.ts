import { NextRequest, NextResponse } from "next/server";
import { chatWithAssistant } from "@/lib/ai/assistant";

export async function POST(req: NextRequest) {
  try {
    const { messages, userContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const response = await chatWithAssistant(messages, userContext);
    return NextResponse.json({ response });
  } catch (err) {
    console.error("AI assistant error:", err);
    return NextResponse.json(
      { error: "AI service unavailable" },
      { status: 500 }
    );
  }
}
