import type {
  DetailResponse,
  HomeResponse,
  ListName,
  MediaCard,
  MediaRow,
  MediaType,
  PersonDetail,
  SearchResponse,
  TitleDetail,
  TitleMediaType,
} from "@repo/contracts";
import { getTmdb } from "../env.js";
import { tmdbCall } from "../http-error.js";
import {
  imageUrl,
  toCard,
  toMixedCard,
  yearOf,
  type TmdbListItem,
} from "./cards.js";

interface Page {
  page: number;
  total_pages: number;
  results: TmdbListItem[];
}

// TMDB caps paging at 500 regardless of what total_pages says.
const MAX_PAGES = 500;

// Talk shows and news: these swamp actors' TV credits with "Self" appearances.
const EXCLUDED_GENRES = new Set([10763, 10767]);

function toSearchResponse(
  title: string,
  page: Page,
  map: (item: TmdbListItem) => MediaCard | null,
): SearchResponse {
  return {
    title,
    items: page.results.map(map).filter((card) => card !== null),
    page: page.page,
    totalPages: Math.min(page.total_pages, MAX_PAGES),
  };
}

// ---------------------------------------------------------------- lists

const LIST_TITLES: Record<ListName, Record<TitleMediaType, string>> = {
  popular: { movie: "Popular movies", tv: "Popular TV shows" },
  top_rated: { movie: "Top rated movies", tv: "Top rated TV shows" },
  upcoming: { movie: "Upcoming movies", tv: "On the air" },
  trending: { movie: "Trending movies", tv: "Trending TV shows" },
};

function fetchList(
  list: ListName,
  type: TitleMediaType,
  page: number,
): Promise<Page> {
  const tmdb = getTmdb();
  return tmdbCall((): Promise<Page> => {
    if (list === "trending") {
      return tmdb.trending.trending(type, "week", { page });
    }
    if (type === "movie") {
      if (list === "popular") return tmdb.movies.popular({ page });
      if (list === "top_rated") return tmdb.movies.topRated({ page });
      return tmdb.movies.upcoming({ page });
    }
    if (list === "popular") return tmdb.tvShows.popular({ page });
    if (list === "top_rated") return tmdb.tvShows.topRated({ page });
    // TMDB has no "upcoming" for TV; on-the-air is the closest equivalent.
    return tmdb.tvShows.onTheAir({ page });
  });
}

export async function getList(
  list: ListName,
  type: TitleMediaType,
  page = 1,
): Promise<SearchResponse> {
  const result = await fetchList(list, type, page);
  return toSearchResponse(LIST_TITLES[list][type], result, (item) =>
    toCard(item, type),
  );
}

// ---------------------------------------------------------------- home

export async function getHome(): Promise<HomeResponse> {
  const tmdb = getTmdb();
  const rows: Promise<MediaRow>[] = [
    getList("trending", "movie").then(({ title, items }) => ({ title, items })),
    getList("trending", "tv").then(({ title, items }) => ({ title, items })),
    tmdbCall(() => tmdb.trending.trending("person", "week")).then((page) => ({
      title: "Trending people",
      items: page.results.map((p) => toCard(p, "person")),
    })),
    getList("upcoming", "movie").then(({ title, items }) => ({ title, items })),
    getList("top_rated", "tv").then(({ title, items }) => ({ title, items })),
  ];

  // A failing row shouldn't take the whole home screen down.
  const settled = await Promise.allSettled(rows);
  const ok = settled
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((row) => row.items.length > 0);
  if (ok.length === 0) {
    const firstError = settled.find((r) => r.status === "rejected");
    throw firstError?.reason ?? new Error("No home rows");
  }
  return { rows: ok };
}

// ---------------------------------------------------------------- search

export async function searchByQuery(
  query: string,
  type: MediaType | null,
  page = 1,
): Promise<SearchResponse> {
  const tmdb = getTmdb();
  const title = `Results for "${query}"`;
  switch (type) {
    case "movie": {
      const res = await tmdbCall(() => tmdb.search.movies({ query, page }));
      return toSearchResponse(title, res, (i) => toCard(i, "movie"));
    }
    case "tv": {
      const res = await tmdbCall(() => tmdb.search.tvShows({ query, page }));
      return toSearchResponse(title, res, (i) => toCard(i, "tv"));
    }
    case "person": {
      const res = await tmdbCall(() => tmdb.search.people({ query, page }));
      return toSearchResponse(title, res, (i) => toCard(i, "person"));
    }
    case null: {
      const res = await tmdbCall(() => tmdb.search.multi({ query, page }));
      return toSearchResponse(title, res, toMixedCard);
    }
  }
}

export async function getSimilar(
  type: TitleMediaType,
  id: number,
  page = 1,
): Promise<SearchResponse> {
  const tmdb = getTmdb();
  const [name, recommendations] = await tmdbCall(() =>
    Promise.all([
      type === "movie"
        ? tmdb.movies.details(id).then((d) => d.title)
        : tmdb.tvShows.details(id).then((d) => d.name),
      type === "movie"
        ? tmdb.movies.recommendations(id, { page })
        : tmdb.tvShows.recommendations(id, { page }),
    ]),
  );

  // Recommendations are usually better, but are empty for obscure titles.
  const result: Page =
    recommendations.results.length > 0
      ? recommendations
      : await tmdbCall<Page>(() =>
          type === "movie"
            ? tmdb.movies.similar(id, { page })
            : tmdb.tvShows.similar(id, { page }),
        );

  return toSearchResponse(`More like ${name}`, result, (i) => toCard(i, type));
}

// ---------------------------------------------------------------- detail

interface VideoLike {
  key: string;
  site: string;
  type: string;
  official?: boolean;
}

function pickTrailer(videos: VideoLike[]): string | null {
  const youtube = videos.filter((v) => v.site === "YouTube");
  const best =
    youtube.find((v) => v.type === "Trailer" && v.official) ??
    youtube.find((v) => v.type === "Trailer") ??
    youtube.find((v) => v.type === "Teaser");
  return best?.key ?? null;
}

const CAST_LIMIT = 20;

async function getMovieDetail(id: number): Promise<TitleDetail> {
  const d = await tmdbCall(() =>
    getTmdb().movies.details(id, ["credits", "videos", "recommendations"]),
  );
  return {
    mediaType: "movie",
    id: d.id,
    title: d.title,
    tagline: d.tagline || null,
    overview: d.overview || null,
    releaseDate: d.release_date || null,
    year: yearOf(d.release_date),
    runtime: d.runtime || null,
    genres: d.genres.map((g) => g.name),
    rating: d.vote_average || null,
    status: d.status || null,
    posterUrl: imageUrl(d.poster_path),
    backdropUrl: imageUrl(d.backdrop_path, "w1280"),
    trailerYoutubeKey: pickTrailer(d.videos.results),
    creators: d.credits.crew
      .filter((c) => c.job === "Director")
      .map((c) => c.name),
    seasons: null,
    episodes: null,
    cast: d.credits.cast
      .slice(0, CAST_LIMIT)
      .map((c) => toCard(c, "person", c.character || null)),
    similar: d.recommendations.results.map((r) => toCard(r, "movie")),
  };
}

async function getTvDetail(id: number): Promise<TitleDetail> {
  const d = await tmdbCall(() =>
    getTmdb().tvShows.details(id, [
      "aggregate_credits",
      "videos",
      "recommendations",
    ]),
  );
  return {
    mediaType: "tv",
    id: d.id,
    title: d.name,
    tagline: d.tagline || null,
    overview: d.overview || null,
    releaseDate: d.first_air_date || null,
    year: yearOf(d.first_air_date),
    runtime: d.episode_run_time[0] ?? null,
    genres: d.genres.map((g) => g.name),
    rating: d.vote_average || null,
    status: d.status || null,
    posterUrl: imageUrl(d.poster_path),
    backdropUrl: imageUrl(d.backdrop_path, "w1280"),
    trailerYoutubeKey: pickTrailer(d.videos.results),
    creators: d.created_by.map((c) => c.name),
    seasons: d.number_of_seasons ?? null,
    episodes: d.number_of_episodes ?? null,
    cast: d.aggregate_credits.cast
      .slice(0, CAST_LIMIT)
      .map((c) => toCard(c, "person", c.roles[0]?.character || null)),
    similar: d.recommendations.results.map((r) => toCard(r, "tv")),
  };
}

type CombinedCredit = TmdbListItem & {
  media_type: "movie" | "tv";
  popularity: number;
  genre_ids?: number[];
};

async function getPersonDetail(id: number): Promise<PersonDetail> {
  const d = await tmdbCall(() =>
    getTmdb().people.details(id, ["combined_credits"]),
  );
  // tmdb-ts types omit media_type on combined credits, but TMDB sends it.
  const { cast, crew } = d.combined_credits as unknown as {
    cast: CombinedCredit[];
    crew: CombinedCredit[];
  };

  // Most popular first, but someone known for directing should lead with
  // their crew credits rather than cameos.
  const byPopularity = (list: CombinedCredit[]) =>
    list
      .filter((c) => !c.genre_ids?.some((g) => EXCLUDED_GENRES.has(g)))
      .sort((a, b) => b.popularity - a.popularity);
  const ordered =
    d.known_for_department === "Acting"
      ? [...byPopularity(cast), ...byPopularity(crew)]
      : [...byPopularity(crew), ...byPopularity(cast)];
  const seen = new Set<string>();
  const credits = ordered
    .filter((c) => {
      const key = `${c.media_type}:${c.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((c) => toCard(c, c.media_type));

  return {
    mediaType: "person",
    id: d.id,
    name: d.name,
    biography: d.biography || null,
    knownFor: d.known_for_department || null,
    birthday: d.birthday || null,
    deathday: d.deathday || null,
    placeOfBirth: d.place_of_birth || null,
    profileUrl: imageUrl(d.profile_path, "h632"),
    credits,
  };
}

export function getDetail(
  mediaType: MediaType,
  id: number,
): Promise<DetailResponse> {
  switch (mediaType) {
    case "movie":
      return getMovieDetail(id);
    case "tv":
      return getTvDetail(id);
    case "person":
      return getPersonDetail(id);
  }
}
