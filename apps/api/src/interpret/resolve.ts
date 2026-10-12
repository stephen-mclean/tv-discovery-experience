import type { Intent, Resolved } from "@repo/contracts";
import { getTmdb } from "../env.js";
import { tmdbCall } from "../http-error.js";

type NamedIntent = Extract<Intent, { type: "detail" | "similar" }>;

/**
 * Looks up a named title or person on TMDB and returns the top hit. TMDB orders
 * search results by relevance, so the first result is the best match. Returns
 * null on no match or any TMDB error: the caller falls back to a search.
 */
export async function resolve(intent: NamedIntent): Promise<Resolved | null> {
  const tmdb = getTmdb();
  const query = intent.name;
  const year = intent.year ?? undefined;

  try {
    switch (intent.mediaType) {
      case "movie": {
        const { results } = await tmdbCall(() =>
          tmdb.search.movies({ query, primary_release_year: year }),
        );
        const top = results[0];
        return top
          ? { mediaType: "movie", id: top.id, title: top.title }
          : null;
      }
      case "tv": {
        const { results } = await tmdbCall(() =>
          tmdb.search.tvShows({ query, first_air_date_year: year }),
        );
        const top = results[0];
        return top ? { mediaType: "tv", id: top.id, title: top.name } : null;
      }
      case "person": {
        const { results } = await tmdbCall(() => tmdb.search.people({ query }));
        const top = results[0];
        return top
          ? { mediaType: "person", id: top.id, title: top.name }
          : null;
      }
    }
  } catch (error) {
    console.error("resolve failed", error);
    return null;
  }
}
