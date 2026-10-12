import { z } from "zod";
import { MediaType, TitleMediaType } from "./schemas.ts";

// Response shapes for the data endpoints the UI pages call. Image fields are
// full URLs (TMDB's CDN), so the UI never needs to know about TMDB paths.

/** One tile in a row or grid: a movie, a TV show or a person. */
export const MediaCard = z.object({
  mediaType: MediaType,
  id: z.number().int(),
  title: z.string(),
  /** Release year for titles; character or department for people. */
  subtitle: z.string().nullable(),
  /** Poster for titles, profile photo for people. */
  imageUrl: z.string().nullable(),
  backdropUrl: z.string().nullable(),
  /** TMDB vote average out of 10; null for people. */
  rating: z.number().nullable(),
});
export type MediaCard = z.infer<typeof MediaCard>;

export const MediaRow = z.object({
  title: z.string(),
  items: z.array(MediaCard),
});
export type MediaRow = z.infer<typeof MediaRow>;

/** GET /api/home */
export const HomeResponse = z.object({
  rows: z.array(MediaRow),
});
export type HomeResponse = z.infer<typeof HomeResponse>;

/** GET /api/search?q= | ?list=&type= | ?similarTo=type:id */
export const SearchResponse = z.object({
  title: z.string(),
  items: z.array(MediaCard),
  page: z.number().int(),
  totalPages: z.number().int(),
});
export type SearchResponse = z.infer<typeof SearchResponse>;

export const TitleDetail = z.object({
  mediaType: TitleMediaType,
  id: z.number().int(),
  title: z.string(),
  tagline: z.string().nullable(),
  overview: z.string().nullable(),
  /** ISO date: release date for movies, first air date for TV. */
  releaseDate: z.string().nullable(),
  year: z.number().int().nullable(),
  /** Minutes. Movie runtime, or typical episode length for TV. */
  runtime: z.number().int().nullable(),
  genres: z.array(z.string()),
  rating: z.number().nullable(),
  status: z.string().nullable(),
  posterUrl: z.string().nullable(),
  backdropUrl: z.string().nullable(),
  /** YouTube video key for the main trailer, if TMDB has one. */
  trailerYoutubeKey: z.string().nullable(),
  /** Directors for movies, creators for TV. */
  creators: z.array(z.string()),
  /** TV only. */
  seasons: z.number().int().nullable(),
  episodes: z.number().int().nullable(),
  /** Top-billed cast as person cards (subtitle = character). */
  cast: z.array(MediaCard),
  /** TMDB recommendations for this title. */
  similar: z.array(MediaCard),
});
export type TitleDetail = z.infer<typeof TitleDetail>;

export const PersonDetail = z.object({
  mediaType: z.literal("person"),
  id: z.number().int(),
  name: z.string(),
  biography: z.string().nullable(),
  knownFor: z.string().nullable(),
  birthday: z.string().nullable(),
  deathday: z.string().nullable(),
  placeOfBirth: z.string().nullable(),
  profileUrl: z.string().nullable(),
  /** Acting and crew credits as title cards, most popular first. */
  credits: z.array(MediaCard),
});
export type PersonDetail = z.infer<typeof PersonDetail>;

/** GET /api/detail/:mediaType/:id */
export const DetailResponse = z.discriminatedUnion("mediaType", [
  TitleDetail,
  PersonDetail,
]);
export type DetailResponse = z.infer<typeof DetailResponse>;

/** Body for every non-2xx response from the data endpoints. */
export const ErrorResponse = z.object({
  error: z.string(),
});
export type ErrorResponse = z.infer<typeof ErrorResponse>;
