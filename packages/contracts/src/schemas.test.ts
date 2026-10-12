import { describe, expect, it } from "vitest";
import { Intent, InterpretResponse } from "./schemas.ts";

describe("Intent", () => {
  it("parses a valid detail intent", () => {
    const intent = {
      type: "detail",
      mediaType: "movie",
      name: "Fight Club",
      year: null,
      question: "When was Fight Club released?",
    };
    expect(Intent.parse(intent)).toEqual(intent);
  });

  it("requires nullable fields to be present", () => {
    expect(
      Intent.safeParse({ type: "search", query: "heist movies" }).success,
    ).toBe(false);
  });

  it("rejects person for list and similar intents", () => {
    expect(
      Intent.safeParse({ type: "list", list: "popular", mediaType: "person" })
        .success,
    ).toBe(false);
    expect(
      Intent.safeParse({
        type: "similar",
        mediaType: "person",
        name: "Brad Pitt",
        year: null,
      }).success,
    ).toBe(false);
  });

  it("rejects unknown intent types", () => {
    expect(Intent.safeParse({ type: "play", name: "Fight Club" }).success).toBe(
      false,
    );
  });
});

describe("InterpretResponse", () => {
  it("parses a full response", () => {
    const response = {
      transcript: "When was Fight Club released?",
      intent: {
        type: "detail",
        mediaType: "movie",
        name: "Fight Club",
        year: null,
        question: "When was Fight Club released?",
      },
      action: { kind: "navigate", route: "/detail/movie/550" },
      resolved: { mediaType: "movie", id: 550, title: "Fight Club" },
      answer: "Fight Club was released on 15 October 1999.",
    };
    expect(InterpretResponse.parse(response)).toEqual(response);
  });
});
