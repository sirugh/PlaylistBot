import Anthropic from "@anthropic-ai/sdk";

const EXTRACTION_TOOL = {
  name: "record_songs",
  description: "Record all song recommendations found in the comments",
  input_schema: {
    type: "object",
    properties: {
      songs: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string", description: "Song title" },
            artist: { type: "string", description: "Artist or band name (omit if not mentioned)" },
          },
          required: ["title"],
        },
      },
    },
    required: ["songs"],
  },
};

/**
 * Returns an async function that extracts {title, artist} pairs from a
 * list of Reddit comment strings using Claude.
 */
export const createExtractor = (apiKey, model = "claude-haiku-4-5-20251001") => {
  if (!apiKey) {
    throw new Error(
      "Anthropic API key is required. Set ANTHROPIC_API_KEY in your environment or add anthropic.apiKey to secrets.json."
    );
  }

  const client = new Anthropic({ apiKey });

  return async (comments) => {
    if (!comments.length) return [];

    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      system: [
        {
          type: "text",
          // System prompt is cached so repeated calls for different comment batches
          // don't re-bill the same instruction tokens.
          cache_control: { type: "ephemeral" },
          text: `You extract song recommendations from Reddit comments.
For each comment, identify every song title and artist name mentioned.
Rules:
- Only include songs that are being positively recommended or cited as favourites.
- Skip [removed] and [deleted] comments entirely.
- If the artist is not mentioned, omit the artist field — don't guess.
- Deduplicate: if the same song appears multiple times, include it once.
- Handle all common formats: "Title - Artist", "Artist - Title", "Title by Artist", plain prose.`,
        },
      ],
      tools: [EXTRACTION_TOOL],
      tool_choice: { type: "tool", name: "record_songs" },
      messages: [
        {
          role: "user",
          content: `Extract all song recommendations from these ${comments.length} Reddit comments:\n\n${comments.map((c, i) => `${i + 1}. ${c}`).join("\n\n")}`,
        },
      ],
    });

    const toolUse = response.content.find((b) => b.type === "tool_use");
    return toolUse?.input?.songs ?? [];
  };
};
