import {
  toAction,
  type Intent,
  type InterpretResponse,
  type Resolved,
} from "@repo/contracts";
import { answerQuestion } from "./answer.js";
import { parseIntent } from "./parse.js";
import { resolve } from "./resolve.js";

export const ERROR_REASON = "Sorry, something went wrong. Please try again.";
export const EMPTY_REASON = "Sorry, I didn't hear anything";

/**
 * text → intent (LLM) → TMDB id → optional answer → UI action. Never throws:
 * failures surface as `action: none` with a reason the UI can show.
 */
export async function interpret(
  transcript: string,
): Promise<InterpretResponse> {
  const text = transcript.trim();
  if (!text) {
    return {
      transcript,
      intent: { type: "unknown" },
      action: { kind: "none", reason: EMPTY_REASON },
      resolved: null,
      answer: null,
    };
  }

  let intent: Intent;
  try {
    intent = await parseIntent(text);
  } catch (error) {
    console.error("parse failed", error);
    return {
      transcript,
      intent: { type: "unknown" },
      action: { kind: "none", reason: ERROR_REASON },
      resolved: null,
      answer: null,
    };
  }

  let resolved: Resolved | null = null;
  if (intent.type === "detail" || intent.type === "similar") {
    resolved = await resolve(intent);
  }

  let answer: string | null = null;
  if (intent.type === "detail" && intent.question && resolved) {
    try {
      answer = await answerQuestion(intent.question, resolved);
    } catch (error) {
      // Still navigate to the detail page; the answer is a bonus.
      console.error("answer failed", error);
    }
  }

  return {
    transcript,
    intent,
    action: toAction(intent, resolved),
    resolved,
    answer,
  };
}
