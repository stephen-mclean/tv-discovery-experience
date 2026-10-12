import { describe, expect, it } from "vitest";
import type { Intent, Resolved } from "./schemas.ts";
import { toAction, UNKNOWN_REASON } from "./to-action.ts";

const fightClub: Resolved = {
  mediaType: "movie",
  id: 550,
  title: "Fight Club",
};
const breakingBad: Resolved = {
  mediaType: "tv",
  id: 1396,
  title: "Breaking Bad",
};
const bradPitt: Resolved = { mediaType: "person", id: 287, title: "Brad Pitt" };

describe("toAction", () => {
  describe("search", () => {
    it("navigates to a query search", () => {
      const intent: Intent = {
        type: "search",
        query: "heist movies",
        mediaType: "movie",
      };
      expect(toAction(intent, null)).toEqual({
        kind: "navigate",
        route: "/search?q=heist+movies",
      });
    });

    it("encodes special characters in the query", () => {
      const intent: Intent = {
        type: "search",
        query: "rock & roll?",
        mediaType: null,
      };
      expect(toAction(intent, null)).toEqual({
        kind: "navigate",
        route: "/search?q=rock+%26+roll%3F",
      });
    });
  });

  describe("list", () => {
    it.each([
      ["popular", "movie", "/search?list=popular&type=movie"],
      ["upcoming", "movie", "/search?list=upcoming&type=movie"],
      ["trending", "tv", "/search?list=trending&type=tv"],
      ["top_rated", "tv", "/search?list=top_rated&type=tv"],
    ] as const)("%s %s → %s", (list, mediaType, route) => {
      expect(toAction({ type: "list", list, mediaType }, null)).toEqual({
        kind: "navigate",
        route,
      });
    });
  });

  describe("detail", () => {
    it("navigates to a resolved movie", () => {
      const intent: Intent = {
        type: "detail",
        mediaType: "movie",
        name: "Fight Club",
        year: null,
        question: "When was Fight Club released?",
      };
      expect(toAction(intent, fightClub)).toEqual({
        kind: "navigate",
        route: "/detail/movie/550",
      });
    });

    it("navigates to a resolved tv show", () => {
      const intent: Intent = {
        type: "detail",
        mediaType: "tv",
        name: "Breaking Bad",
        year: null,
        question: null,
      };
      expect(toAction(intent, breakingBad)).toEqual({
        kind: "navigate",
        route: "/detail/tv/1396",
      });
    });

    it("navigates to a resolved person", () => {
      const intent: Intent = {
        type: "detail",
        mediaType: "person",
        name: "Brad Pitt",
        year: null,
        question: null,
      };
      expect(toAction(intent, bradPitt)).toEqual({
        kind: "navigate",
        route: "/detail/person/287",
      });
    });

    it("falls back to a name search when unresolved (movie)", () => {
      const intent: Intent = {
        type: "detail",
        mediaType: "movie",
        name: "Fight Club",
        year: 1999,
        question: null,
      };
      expect(toAction(intent, null)).toEqual({
        kind: "navigate",
        route: "/search?q=Fight+Club",
      });
    });

    it("falls back to a name search when unresolved (person)", () => {
      const intent: Intent = {
        type: "detail",
        mediaType: "person",
        name: "Brad Pitt",
        year: null,
        question: null,
      };
      expect(toAction(intent, null)).toEqual({
        kind: "navigate",
        route: "/search?q=Brad+Pitt",
      });
    });
  });

  describe("similar", () => {
    const intent: Intent = {
      type: "similar",
      mediaType: "tv",
      name: "Breaking Bad",
      year: null,
    };

    it("navigates to a similar-to search when resolved", () => {
      expect(toAction(intent, breakingBad)).toEqual({
        kind: "navigate",
        route: "/search?similarTo=tv:1396",
      });
    });

    it("falls back to a name search when unresolved", () => {
      expect(toAction(intent, null)).toEqual({
        kind: "navigate",
        route: "/search?q=Breaking+Bad",
      });
    });
  });

  describe("navigate", () => {
    it("navigates home", () => {
      expect(toAction({ type: "navigate", to: "home" }, null)).toEqual({
        kind: "navigate",
        route: "/home",
      });
    });

    it("goes back", () => {
      expect(toAction({ type: "navigate", to: "back" }, null)).toEqual({
        kind: "back",
      });
    });
  });

  it("returns no action for unknown intents", () => {
    expect(toAction({ type: "unknown" }, null)).toEqual({
      kind: "none",
      reason: UNKNOWN_REASON,
    });
  });
});
