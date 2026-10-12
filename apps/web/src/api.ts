import type {
  ErrorResponse,
  InterpretResponse,
  MediaCard,
  TitleDetail,
} from "@repo/contracts";
import type { MediaDetailData, MediaSummary, PersonSummary } from "@repo/ui";
import { useEffect, useState } from "react";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ErrorResponse | null;
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export const api = {
  home: () => "/api/home",
  search: (params: URLSearchParams) => `/api/search?${params.toString()}`,
  detail: (mediaType: string, id: string) => `/api/detail/${mediaType}/${id}`,
};

export function interpretText(text: string): Promise<InterpretResponse> {
  return request("/api/interpret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

export function interpretVoice(audio: Blob): Promise<InterpretResponse> {
  // The API (Whisper) infers the format from the file extension.
  const ext = audio.type.includes("mp4") ? "mp4" : "webm";
  const form = new FormData();
  form.append("audio", audio, `voice.${ext}`);
  return request("/api/voice", { method: "POST", body: form });
}

interface FetchState<T> {
  url: string;
  data?: T;
  error?: string;
}

/** GETs `url` whenever it changes. `loading` is true until the new data lands. */
export function useApi<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({ url: "" });

  useEffect(() => {
    const controller = new AbortController();
    request<T>(url, { signal: controller.signal }).then(
      (data) => setState({ url, data }),
      (error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          url,
          error: error instanceof Error ? error.message : String(error),
        });
      },
    );
    return () => controller.abort();
  }, [url]);

  const current = state.url === url;
  return {
    data: current ? state.data : undefined,
    error: current ? state.error : undefined,
    loading: !current,
  };
}

// Mappers from the API contracts to the UI view models. Ids are prefixed with
// the media type ("movie:550") because TMDB ids collide across types.

function yearOf(subtitle: string | null): number | undefined {
  return subtitle && /^\d{4}$/.test(subtitle) ? Number(subtitle) : undefined;
}

export function toMediaSummary(card: MediaCard): MediaSummary {
  return {
    id: `${card.mediaType}:${card.id}`,
    type: card.mediaType === "tv" ? "tv" : "movie",
    title: card.title,
    posterUrl: card.imageUrl ?? undefined,
    year: yearOf(card.subtitle),
    rating: card.rating ?? undefined,
  };
}

export function toPersonSummary(card: MediaCard): PersonSummary {
  return {
    id: `person:${card.id}`,
    name: card.title,
    profileUrl: card.imageUrl ?? undefined,
    role: card.subtitle ?? undefined,
  };
}

export function toMediaDetail(detail: TitleDetail): MediaDetailData {
  return {
    id: `${detail.mediaType}:${detail.id}`,
    type: detail.mediaType,
    title: detail.title,
    posterUrl: detail.posterUrl ?? undefined,
    backdropUrl: detail.backdropUrl ?? undefined,
    year: detail.year ?? undefined,
    releaseDate: detail.releaseDate ?? undefined,
    rating: detail.rating ?? undefined,
    tagline: detail.tagline || undefined,
    overview: detail.overview || undefined,
    genres: detail.genres,
    runtimeMinutes: detail.runtime ?? undefined,
    seasons: detail.seasons ?? undefined,
    episodes: detail.episodes ?? undefined,
    status: detail.status ?? undefined,
    // Creators only come back as names, so they link to a person search.
    credits:
      detail.creators.length > 0
        ? [
            {
              label:
                detail.mediaType === "movie" ? "Directed by" : "Created by",
              people: detail.creators.map((name) => ({
                id: `name:${name}`,
                name,
              })),
            },
          ]
        : [],
    cast: detail.cast.map(toPersonSummary),
    similar: detail.similar.map(toMediaSummary),
  };
}

/** Route for a UI view model id such as "movie:550" or "person:287". */
export function detailRoute(id: string): string {
  const [type, tmdbId] = id.split(":");
  return `/detail/${type}/${tmdbId}`;
}

/** Route for a person tile; creators without an id fall back to a search. */
export function personRoute(person: PersonSummary): string {
  return person.id.startsWith("person:")
    ? detailRoute(person.id)
    : `/search?${new URLSearchParams({ q: person.name, type: "person" }).toString()}`;
}
