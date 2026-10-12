import { existsSync } from "node:fs";
import OpenAI from "openai";
import type { ReasoningEffort } from "openai/resources/shared";
import { TMDB } from "tmdb-ts";
import { HttpError } from "./http-error.js";

if (existsSync(".env")) process.loadEnvFile(".env");

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new HttpError(503, `${name} is not set (see apps/api/.env.example)`);
  }
  return value;
}

export const config = {
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
  // Intent parsing is a simple classification task; reasoning only adds latency.
  reasoningEffort: (process.env.OPENAI_REASONING_EFFORT ??
    "none") as ReasoningEffort,
  transcribeModel:
    process.env.OPENAI_TRANSCRIBE_MODEL ?? "gpt-4o-mini-transcribe",
};

// Clients are created on first use so the server can boot (and /api/health
// respond) without keys.
let openai: OpenAI | undefined;
let tmdb: TMDB | undefined;

export function getOpenAI(): OpenAI {
  openai ??= new OpenAI({ apiKey: required("OPENAI_API_KEY") });
  return openai;
}

export function getTmdb(): TMDB {
  tmdb ??= new TMDB(required("TMDB_API_KEY"));
  return tmdb;
}
