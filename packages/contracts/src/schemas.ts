import { z } from "zod";

// Fields use `.nullable()` rather than `.optional()`: OpenAI structured outputs
// requires every field to be present, and the LLM's JSON schema is generated
// from these same schemas.

export const MediaType = z.enum(["movie", "tv", "person"]);
export type MediaType = z.infer<typeof MediaType>;

export const TitleMediaType = z.enum(["movie", "tv"]);
export type TitleMediaType = z.infer<typeof TitleMediaType>;

export const ListName = z.enum([
  "popular",
  "upcoming",
  "trending",
  "top_rated",
]);
export type ListName = z.infer<typeof ListName>;

export const Intent = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("search"),
    query: z.string(),
    mediaType: MediaType.nullable(),
  }),
  z.object({
    type: z.literal("list"),
    list: ListName,
    mediaType: TitleMediaType,
  }),
  z.object({
    type: z.literal("detail"),
    mediaType: MediaType,
    name: z.string(),
    year: z.number().int().nullable(),
    question: z.string().nullable(),
  }),
  z.object({
    type: z.literal("similar"),
    mediaType: TitleMediaType,
    name: z.string(),
    year: z.number().int().nullable(),
  }),
  z.object({
    type: z.literal("navigate"),
    to: z.enum(["home", "back"]),
  }),
  z.object({
    type: z.literal("unknown"),
  }),
]);
export type Intent = z.infer<typeof Intent>;

export const Resolved = z.object({
  mediaType: MediaType,
  id: z.number().int(),
  title: z.string(),
});
export type Resolved = z.infer<typeof Resolved>;

export const Action = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("navigate"), route: z.string() }),
  z.object({ kind: z.literal("back") }),
  z.object({ kind: z.literal("none"), reason: z.string() }),
]);
export type Action = z.infer<typeof Action>;

export const InterpretResponse = z.object({
  transcript: z.string(),
  intent: Intent,
  action: Action,
  resolved: Resolved.nullable(),
  answer: z.string().nullable(),
});
export type InterpretResponse = z.infer<typeof InterpretResponse>;
