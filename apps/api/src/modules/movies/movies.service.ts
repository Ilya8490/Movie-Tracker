import { movieRepository } from "../../repositories/movie.repository.js";
import { tmdbService } from "../tmdb/tmdb.service.js";

export const moviesService = {
  search(query: string) {
    return tmdbService.searchMovies(query);
  },
  async getByTmdbId(tmdbId: number) {
    const movie = await tmdbService.getMovieDetails(tmdbId);
    const persistedMovie = await movieRepository.upsert({
      tmdbId: movie.id,
      title: movie.title,
      posterPath: movie.posterPath,
      overview: movie.overview,
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
      tmdbVoteAverage: movie.voteAverage,
      genres: movie.genres,
    });

    return {
      ...movie,
      localMovieId: persistedMovie.id,
    };
  },
  getGenres() {
    return tmdbService.getGenres();
  },
};
