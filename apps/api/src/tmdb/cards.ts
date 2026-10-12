import type { MediaCard, MediaType } from "@repo/contracts";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

export function imageUrl(
  path: string | null | undefined,
  size: "w342" | "w500" | "w780" | "w1280" | "h632" = "w500",
): string | null {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export function yearOf(date: string | null | undefined): number | null {
  const year = date ? Number.parseInt(date.slice(0, 4), 10) : NaN;
  return Number.isNaN(year) ? null : year;
}

// TMDB list results share these loosely-typed fields across movie, tv and
// person payloads, so one mapper handles them all.
export interface TmdbListItem {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  character?: string;
  job?: string;
  known_for_department?: string;
}

export function toCard(
  item: TmdbListItem,
  mediaType: MediaType,
  subtitle?: string | null,
): MediaCard {
  if (mediaType === "person") {
    return {
      mediaType,
      id: item.id,
      title: item.name ?? "",
      subtitle: subtitle ?? item.character ?? item.known_for_department ?? null,
      imageUrl: imageUrl(item.profile_path, "w342"),
      backdropUrl: null,
      rating: null,
    };
  }
  const year = yearOf(
    mediaType === "movie" ? item.release_date : item.first_air_date,
  );
  return {
    mediaType,
    id: item.id,
    title: (mediaType === "movie" ? item.title : item.name) ?? "",
    subtitle: subtitle ?? (year ? String(year) : null),
    imageUrl: imageUrl(item.poster_path, "w342"),
    backdropUrl: imageUrl(item.backdrop_path, "w780"),
    rating: item.vote_average ?? null,
  };
}

/** Maps a mixed (multi-search / trending all) result, dropping unknown types. */
export function toMixedCard(item: TmdbListItem): MediaCard | null {
  const type = item.media_type;
  return type === "movie" || type === "tv" || type === "person"
    ? toCard(item, type)
    : null;
}
