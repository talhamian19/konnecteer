import { openai, AI_MODEL } from "./client";
import { PartyVibe, SafetyLevel } from "@/types";

export interface VibeInput {
  title: string;
  description: string;
  maxAttendees?: number;
  vibe: PartyVibe;
  nationalities?: Record<string, number>;
  venue?: string;
}

export interface VibeOutput {
  aiSummary: string;
  partyEnergy: number;
  safetyLevel: SafetyLevel;
  excitementLevel: number;
  crowdMix: string;
  highlights: string[];
}

export async function generateVibeSummary(input: VibeInput): Promise<VibeOutput> {
  const prompt = `Generate a watch party vibe analysis for Konnecteer.

Party: "${input.title}"
Description: ${input.description}
Vibe: ${input.vibe}
Max Attendees: ${input.maxAttendees ?? "Unlimited"}
Nationalities: ${JSON.stringify(input.nationalities ?? {})}

Return JSON:
{
  "aiSummary": "2-3 sentence engaging summary",
  "partyEnergy": 1-10,
  "safetyLevel": "SAFE" | "MODERATE" | "CAUTION",
  "excitementLevel": 1-10,
  "crowdMix": "brief crowd description",
  "highlights": ["highlight1", "highlight2", "highlight3"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content ?? "{}") as VibeOutput;
  } catch {
    return {
      aiSummary: `${input.title} — A great place to watch the match with fellow fans. ${input.vibe === "HARDCORE" ? "Expect passionate supporters and electric atmosphere." : "Relaxed and welcoming environment for all fans."}`,
      partyEnergy: 7,
      safetyLevel: "SAFE",
      excitementLevel: 8,
      crowdMix: "Mixed international crowd",
      highlights: ["Great atmosphere", "Fellow fans", "Prime viewing spots"],
    };
  }
}
