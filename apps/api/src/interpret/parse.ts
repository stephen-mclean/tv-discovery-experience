import { Intent } from "@repo/contracts";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { config, getOpenAI } from "../env.js";

// Structured outputs needs an object at the root, not a union.
const ParseResult = z.object({ intent: Intent });

const INSTRUCTIONS = `You interpret voice commands for a TV app that helps people discover movies, TV shows and people (actors, directors). Turn the user's request into a single intent.

The text comes from speech-to-text, so it may contain mis-heard words. Correct obvious misspellings of well-known titles and names (e.g. "breaking bed" -> "Breaking Bad").

Intent types:
- list: a curated list. list is one of popular, upcoming, trending, top_rated; mediaType is movie or tv.
  "most popular movies (of all time)" -> popular movie. "best / highest rated" -> top_rated. "coming out soon / new releases" -> upcoming. "what's hot / trending right now" -> trending.
- detail: the user names ONE specific movie, show or person and wants to see it or asks about it.
  name is the canonical title or person name only. year only if the user says it.
  question is the user's factual question (e.g. "When was Fight Club released?"), or null if they just want to open it ("show me Fight Club").
  "What movies has Brad Pitt been in?" -> detail, mediaType person, name "Brad Pitt", question null (the person page lists their credits).
- similar: "something like X", "shows similar to X". mediaType is the type of X.
- search: anything else that names content to find: genres, topics, keywords, partial titles. query is a short search phrase.
- navigate: "go home" -> to home. "go back / back / previous" -> to back.
- unknown: not about finding something to watch, or unintelligible.

mediaType: "show", "series", "TV" -> tv. "film", "movie" -> movie. When the user doesn't say, pick the type the named title is best known as. For search, use null if unclear.`;

export async function parseIntent(text: string): Promise<Intent> {
  const response = await getOpenAI().responses.parse({
    model: config.openaiModel,
    reasoning: { effort: config.reasoningEffort },
    instructions: INSTRUCTIONS,
    input: text,
    text: { format: zodTextFormat(ParseResult, "parse_result") },
  });
  if (!response.output_parsed) {
    throw new Error("Model returned no parsable intent");
  }
  return response.output_parsed.intent;
}
