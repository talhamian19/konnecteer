import { openai, AI_MODEL } from "./client";

const SUPPORTED_LANGUAGES = [
  "English", "Spanish", "Portuguese", "French", "German",
  "Arabic", "Japanese", "Korean", "Italian", "Dutch",
];

export async function translateMessage(
  text: string,
  targetLanguage: string
): Promise<string> {
  if (!SUPPORTED_LANGUAGES.includes(targetLanguage)) {
    return text;
  }

  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the message to ${targetLanguage}. Return ONLY the translated text, nothing else.`,
        },
        { role: "user", content: text },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    return response.choices[0].message.content ?? text;
  } catch {
    return text;
  }
}

export async function batchTranslate(
  text: string,
  languages: string[]
): Promise<Record<string, string>> {
  const validLangs = languages.filter((l) => SUPPORTED_LANGUAGES.includes(l));
  if (validLangs.length === 0) return {};

  const prompt = `Translate this text to each language. Return JSON: {"English": "...", "Spanish": "...", etc}
Text: "${text}"
Languages: ${validLangs.join(", ")}`;

  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content ?? "{}");
  } catch {
    const fallback: Record<string, string> = {};
    validLangs.forEach((l) => (fallback[l] = text));
    return fallback;
  }
}

export { SUPPORTED_LANGUAGES };
