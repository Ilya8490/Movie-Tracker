import { env } from "../../config/env.js";
import { HttpError } from "../../lib/http-error.js";
import type { TmdbMovieDetails, TmdbMovieSummary } from "./tmdb.types.js";

type TmdbGenre = {
  id: number;
  name: string;
};

type TmdbMovieSearchResponse = {
  results: Array<{
    id: number;
    title: string;
    poster_path: string | null;
    overview: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
  }>;
};

type TmdbMovieResponse = {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: TmdbGenre[];
};

type TmdbGenreResponse = {
  genres: TmdbGenre[];
};

let cachedGenres: Map<number, string> | null = null;
let genresCachedAt = 0;
const CACHE_DURATION_MS = 1000 * 60 * 60 * 24;

const requestTmdb = async <T>(path: string, params?: URLSearchParams) => {
  const url = new URL(`${env.TMDB_API_BASE_URL}${path}`);

  if (params) {
    url.search = params.toString();
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.TMDB_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new HttpError(response.status, "TMDb request failed");
  }

  return (await response.json()) as T;
};

const getGenresMap = async () => {
  const isCacheFresh = cachedGenres && Date.now() - genresCachedAt < CACHE_DURATION_MS;

  if (isCacheFresh && cachedGenres) {
    return cachedGenres;
  }

  const data = await requestTmdb<TmdbGenreResponse>("/genre/movie/list");
  cachedGenres = new Map(data.genres.map((genre) => [genre.id, genre.name]));
  genresCachedAt = Date.now();

  return cachedGenres;
};

const normalizeMovieSummary = async (
  movie: TmdbMovieSearchResponse["results"][number],
): Promise<TmdbMovieSummary> => {
  const genresMap = await getGenresMap();

  return {
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    overview: movie.overview,
    releaseDate: movie.release_date || null,
    voteAverage: Number.isFinite(movie.vote_average) ? movie.vote_average : null,
    genres: movie.genre_ids.map((genreId) => genresMap.get(genreId)).filter(Boolean) as string[],
  };
};

const normalizeMovieDetails = (movie: TmdbMovieResponse): TmdbMovieDetails => ({
  id: movie.id,
  title: movie.title,
  posterPath: movie.poster_path,
  overview: movie.overview,
  releaseDate: movie.release_date || null,
  voteAverage: Number.isFinite(movie.vote_average) ? movie.vote_average : null,
  genres: movie.genres.map((genre) => genre.name),
});

export const tmdbService = {
  async getGenres() {
    const genresMap = await getGenresMap();
    return Array.from(genresMap.entries()).map(([id, name]) => ({ id, name }));
  },
  async searchMovies(query: string) {
    const params = new URLSearchParams({ query });
    const data = await requestTmdb<TmdbMovieSearchResponse>("/search/movie", params);
    return Promise.all(data.results.map(normalizeMovieSummary));
  },
  async getMovieDetails(id: number) {
    const data = await requestTmdb<TmdbMovieResponse>(`/movie/${id}`);
    return normalizeMovieDetails(data);
  },
};
