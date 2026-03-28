import type { AnalyticsSummary, UserMovieStatus } from "@movie-tracker/shared";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type MovieSearchResult = {
  id: number;
  title: string;
  posterPath: string | null;
  overview: string;
  releaseDate: string | null;
  voteAverage: number | null;
  genres: string[];
};

export type MovieDetails = MovieSearchResult & {
  localMovieId: string;
};

export type LibraryItem = {
  id: string;
  movieId: string;
  userId: string;
  status: UserMovieStatus;
  rating: number | null;
  review: string | null;
  watchedAt: string | null;
  createdAt: string;
  updatedAt: string;
  movie: {
    id: string;
    tmdbId: number;
    title: string;
    posterPath: string | null;
    overview: string;
    releaseDate: string | null;
    tmdbVoteAverage: number | null;
    genres: string[];
  };
};

export type MovieList = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    movie: LibraryItem["movie"];
  }>;
};

export type AnalyticsSummaryResponse = AnalyticsSummary;
