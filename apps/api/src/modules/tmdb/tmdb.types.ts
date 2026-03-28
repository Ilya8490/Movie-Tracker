export type TmdbMovieSummary = {
  id: number;
  title: string;
  posterPath: string | null;
  overview: string;
  releaseDate: string | null;
  voteAverage: number | null;
  genres: string[];
};

export type TmdbMovieDetails = TmdbMovieSummary;
