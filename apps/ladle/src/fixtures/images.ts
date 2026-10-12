const TMDB_IMAGES = "https://image.tmdb.org/t/p";

export const poster = (path: string) => `${TMDB_IMAGES}/w342${path}`;
export const backdrop = (path: string) => `${TMDB_IMAGES}/w1280${path}`;
export const profile = (path: string) => `${TMDB_IMAGES}/w185${path}`;
