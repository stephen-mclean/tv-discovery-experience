import type { Action, Intent, Resolved } from "./schemas.ts";

export const UNKNOWN_REASON = "Sorry, I didn't catch that";

function searchRoute(params: Record<string, string>): string {
  return `/search?${new URLSearchParams(params).toString()}`;
}

/**
 * Maps a parsed intent (plus its TMDB resolution, if any) to the action the UI
 * should perform. Named intents that failed to resolve fall back to a search.
 */
export function toAction(intent: Intent, resolved: Resolved | null): Action {
  switch (intent.type) {
    case "search":
      return { kind: "navigate", route: searchRoute({ q: intent.query }) };
    case "list":
      return {
        kind: "navigate",
        route: searchRoute({ list: intent.list, type: intent.mediaType }),
      };
    case "detail":
      return resolved
        ? {
            kind: "navigate",
            route: `/detail/${resolved.mediaType}/${resolved.id}`,
          }
        : { kind: "navigate", route: searchRoute({ q: intent.name }) };
    case "similar":
      // Built by hand so the `:` separator isn't percent-encoded.
      return resolved
        ? {
            kind: "navigate",
            route: `/search?similarTo=${resolved.mediaType}:${resolved.id}`,
          }
        : { kind: "navigate", route: searchRoute({ q: intent.name }) };
    case "navigate":
      return intent.to === "back"
        ? { kind: "back" }
        : { kind: "navigate", route: "/home" };
    case "unknown":
      return { kind: "none", reason: UNKNOWN_REASON };
  }
}
