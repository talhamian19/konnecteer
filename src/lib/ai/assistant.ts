import { openai, AI_MODEL } from "./client";

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are Konnect, the AI assistant for Konnecteer — the world's best FIFA World Cup fan coordination app.

You help fans:
1. Find the best watch parties nearby
2. Discover fan groups by nationality
3. Assess safety of venues and areas
4. Get match information and schedules
5. Connect with solo travelers
6. Navigate language barriers

Be friendly, enthusiastic about football, and concise. Use relevant emojis sparingly.
When you don't know specific local details, give helpful general advice.
Always prioritize safety for solo travelers.

Keep responses under 150 words unless detailed info is needed.`;

export async function chatWithAssistant(
  messages: AssistantMessage[],
  userContext?: {
    nationality?: string;
    favoriteTeam?: string;
    currentCity?: string;
    goingAlone?: boolean;
  }
): Promise<string> {
  const contextPrefix = userContext
    ? `[User context: nationality=${userContext.nationality}, team=${userContext.favoriteTeam}, city=${userContext.currentCity}, solo=${userContext.goingAlone}]\n\n`
    : "";

  const formattedMessages = messages.map((m, i) => ({
    role: m.role,
    content: i === 0 ? contextPrefix + m.content : m.content,
  }));

  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...formattedMessages,
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    return response.choices[0].message.content ?? "I couldn't process that. Try again!";
  } catch {
    return "I'm having trouble connecting right now. Please try again in a moment! ⚽";
  }
}
