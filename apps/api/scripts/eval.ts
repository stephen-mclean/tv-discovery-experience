// On-demand eval of the interpret pipeline against real OpenAI + TMDB.
// Needs keys in apps/api/.env. Run with: pnpm --filter=api eval
import type { Action, Intent } from "@repo/contracts";
import "../src/env.js";
import { interpret } from "../src/interpret/pipeline.js";

interface Case {
  text: string;
  intent: Partial<Intent>;
  action?: Action;
  expectAnswer?: boolean;
}

const cases: Case[] = [
  {
    text: "Find me the most popular movies of all time",
    intent: { type: "list", list: "popular", mediaType: "movie" },
    action: { kind: "navigate", route: "/search?list=popular&type=movie" },
  },
  {
    text: "What movies are coming out soon?",
    intent: { type: "list", list: "upcoming", mediaType: "movie" },
    action: { kind: "navigate", route: "/search?list=upcoming&type=movie" },
  },
  {
    text: "When was Fight Club released?",
    intent: { type: "detail", mediaType: "movie", name: "Fight Club" },
    action: { kind: "navigate", route: "/detail/movie/550" },
    expectAnswer: true,
  },
  {
    text: "Find me a show similar to Breaking Bad.",
    intent: { type: "similar", mediaType: "tv", name: "Breaking Bad" },
    action: { kind: "navigate", route: "/search?similarTo=tv:1396" },
  },
  {
    text: "What movies has Brad Pitt been in?",
    intent: { type: "detail", mediaType: "person", name: "Brad Pitt" },
    action: { kind: "navigate", route: "/detail/person/287" },
  },
  {
    text: "Go back",
    intent: { type: "navigate", to: "back" },
    action: { kind: "back" },
  },
  {
    text: "take me home",
    intent: { type: "navigate", to: "home" },
    action: { kind: "navigate", route: "/home" },
  },
  // Edge cases
  {
    text: "show me breaking bed",
    intent: { type: "detail", mediaType: "tv", name: "Breaking Bad" },
    action: { kind: "navigate", route: "/detail/tv/1396" },
  },
  {
    text: "what are the best rated TV shows",
    intent: { type: "list", list: "top_rated", mediaType: "tv" },
  },
  {
    text: "what's trending on TV",
    intent: { type: "list", list: "trending", mediaType: "tv" },
  },
  { text: "heist movies", intent: { type: "search", mediaType: "movie" } },
  {
    text: "Who directed Inception?",
    intent: { type: "detail", mediaType: "movie", name: "Inception" },
    action: { kind: "navigate", route: "/detail/movie/27205" },
    expectAnswer: true,
  },
  { text: "what's the weather tomorrow", intent: { type: "unknown" } },
];

function matches(actual: object, expected: object): boolean {
  return Object.entries(expected).every(
    ([key, value]) =>
      JSON.stringify((actual as Record<string, unknown>)[key]) ===
      JSON.stringify(value),
  );
}

let failures = 0;
for (const c of cases) {
  const start = performance.now();
  const res = await interpret(c.text);
  const ms = Math.round(performance.now() - start);

  const problems: string[] = [];
  if (!matches(res.intent, c.intent)) {
    problems.push(`intent ${JSON.stringify(res.intent)}`);
  }
  if (c.action && !matches(res.action, c.action)) {
    problems.push(`action ${JSON.stringify(res.action)}`);
  }
  if (c.expectAnswer && !res.answer) problems.push("missing answer");

  if (problems.length) failures++;
  console.log(
    `${problems.length ? "✗" : "✓"} ${c.text} (${ms}ms)` +
      (res.answer ? `\n    answer: ${res.answer}` : "") +
      problems.map((p) => `\n    got ${p}`).join(""),
  );
}

console.log(`\n${cases.length - failures}/${cases.length} passed`);
process.exitCode = failures ? 1 : 0;
