import type { Resolved } from "@repo/contracts";
import { config, getOpenAI } from "../env.js";
import { getDetail } from "../tmdb/media.js";

const INSTRUCTIONS = `You answer a viewer's question about a movie, TV show or person on a TV screen.
Answer in ONE short, natural sentence using ONLY the JSON data provided. Write dates like "15 October 1999".
If the data doesn't contain the answer, say briefly that you don't have that information.`;

/** Answers a factual question about a resolved title or person. */
export async function answerQuestion(
  question: string,
  resolved: Resolved,
): Promise<string> {
  const detail = await getDetail(resolved.mediaType, resolved.id);

  // Keep the prompt small: drop image URLs and recommendation lists.
  const facts =
    detail.mediaType === "person"
      ? {
          ...detail,
          profileUrl: undefined,
          credits: detail.credits.slice(0, 30).map((c) => ({
            title: c.title,
            type: c.mediaType,
            year: c.subtitle,
          })),
        }
      : {
          ...detail,
          posterUrl: undefined,
          backdropUrl: undefined,
          trailerYoutubeKey: undefined,
          similar: undefined,
          cast: detail.cast.map((c) => `${c.title} as ${c.subtitle ?? "?"}`),
        };

  const response = await getOpenAI().responses.create({
    model: config.openaiModel,
    reasoning: { effort: config.reasoningEffort },
    instructions: INSTRUCTIONS,
    input: `Today's date: ${new Date().toISOString().slice(0, 10)}\n\nData:\n${JSON.stringify(facts)}\n\nQuestion: ${question}`,
  });
  return response.output_text.trim();
}
