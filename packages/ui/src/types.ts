/**
 * View models for the UI. These are deliberately independent of TMDB: the
 * API/web layer maps TMDB responses into these shapes, with image URLs fully
 * built.
 */

export type MediaType = "movie" | "tv";

export interface MediaSummary {
  /** Unique across media types, e.g. "movie:550". */
  id: string;
  type: MediaType;
  title: string;
  /** Fully built URL. A fallback tile is shown when missing. */
  posterUrl?: string;
  year?: number;
  /** ISO date. Used for "Coming soon" badges. */
  releaseDate?: string;
  /** 0–10. */
  rating?: number;
}

export interface PersonSummary {
  id: string;
  name: string;
  profileUrl?: string;
  /** Character name, or a job such as "Director". */
  role?: string;
}

export interface CreditGroup {
  /** e.g. "Director", "Created by". */
  label: string;
  people: PersonSummary[];
}

export interface MediaDetailData extends MediaSummary {
  backdropUrl?: string;
  tagline?: string;
  overview?: string;
  genres: string[];
  /** Movies. */
  runtimeMinutes?: number;
  /** TV. */
  seasons?: number;
  /** TV. */
  episodes?: number;
  /** "Released", "Returning Series", … */
  status?: string;
  /** "R", "TV-MA", … */
  certification?: string;
  credits: CreditGroup[];
  cast: PersonSummary[];
  similar: MediaSummary[];
}
