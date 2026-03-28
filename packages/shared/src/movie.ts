export const userMovieStatuses = [
  "plan_to_watch",
  "watching",
  "watched",
  "dropped",
] as const;

export type UserMovieStatus = (typeof userMovieStatuses)[number];

export type AnalyticsSummary = {
  totalWatchedMovies: number;
  averageRating: number | null;
  moviesPerStatus: Record<UserMovieStatus, number>;
};
