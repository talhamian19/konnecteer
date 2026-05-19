import { openai, AI_MODEL } from "./client";
import { WatchParty, UserProfile, FilterOptions } from "@/types";

export interface RecommendationInput {
  user: Partial<UserProfile>;
  watchParties: WatchParty[];
  userLocation?: { lat: number; lng: number };
  userQuery?: string;
}

export interface RecommendationResult {
  rankedParties: Array<WatchParty & { matchScore: number; reasons: string[] }>;
  summary: string;
}

export async function getAIRecommendations(
  input: RecommendationInput
): Promise<RecommendationResult> {
  const { user, watchParties, userQuery } = input;

  const partiesSummary = watchParties.slice(0, 10).map((p) => ({
    id: p.id,
    title: p.title,
    vibe: p.vibe,
    attendees: p.currentAttendees,
    safety: p.safetyLevel,
    nationalities: p.crowdNationalities,
    popularityScore: p.popularityScore,
  }));

  const prompt = `You are Konnecteer's AI recommendation engine for FIFA World Cup watch parties.

User Profile:
- Nationality: ${user.nationality ?? "Unknown"}
- Favorite Team: ${user.favoriteTeam ?? "Unknown"}
- Going Alone: ${user.goingAlone ? "Yes" : "No"}
- Vibe Preferences: ${user.vibeTags?.join(", ") ?? "None specified"}
- Languages: ${user.languages?.join(", ") ?? "English"}
${userQuery ? `- User Query: "${userQuery}"` : ""}

Available Watch Parties:
${JSON.stringify(partiesSummary, null, 2)}

Task: Rank these watch parties for this user. Return JSON with this exact structure:
{
  "rankedIds": ["id1", "id2", ...],
  "scores": {"id1": 0.95, "id2": 0.87, ...},
  "reasons": {"id1": ["reason1", "reason2"], ...},
  "summary": "Brief 2-sentence summary of top recommendation"
}

Consider: nationality match, vibe alignment, safety for solo travelers, crowd size preferences, language compatibility.`;

  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content ?? "{}");
    const rankedIds: string[] = result.rankedIds ?? [];
    const scores: Record<string, number> = result.scores ?? {};
    const reasons: Record<string, string[]> = result.reasons ?? {};

    const rankedParties = rankedIds
      .map((id) => {
        const party = watchParties.find((p) => p.id === id);
        if (!party) return null;
        return {
          ...party,
          matchScore: scores[id] ?? 0.5,
          reasons: reasons[id] ?? ["Good match for your preferences"],
        };
      })
      .filter(Boolean) as Array<WatchParty & { matchScore: number; reasons: string[] }>;

    return {
      rankedParties,
      summary: result.summary ?? "Here are the best watch parties for you tonight!",
    };
  } catch {
    // Fallback: return parties sorted by popularity
    return {
      rankedParties: watchParties.slice(0, 5).map((p) => ({
        ...p,
        matchScore: p.popularityScore / 10,
        reasons: ["Popular venue", "Great atmosphere"],
      })),
      summary: "Here are the most popular watch parties near you tonight!",
    };
  }
}
