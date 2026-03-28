import { HttpError } from "../../lib/http-error.js";
import { listRepository } from "../../repositories/list.repository.js";
import { movieRepository } from "../../repositories/movie.repository.js";
import { tmdbService } from "../tmdb/tmdb.service.js";

const ensureMovieExists = async (tmdbId: number) => {
  const existingMovie = await movieRepository.findByTmdbId(tmdbId);

  if (existingMovie) {
    return existingMovie;
  }

  const movie = await tmdbService.getMovieDetails(tmdbId);
  return movieRepository.upsert({
    tmdbId: movie.id,
    title: movie.title,
    posterPath: movie.posterPath,
    overview: movie.overview,
    releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
    tmdbVoteAverage: movie.voteAverage,
    genres: movie.genres,
  });
};

export const listsService = {
  getByUser(userId: string) {
    return listRepository.findAllByUserId(userId);
  },
  create(userId: string, name: string, description?: string) {
    return listRepository.create(userId, name, description);
  },
  async addItem(userId: string, listId: string, tmdbId: number) {
    const list = await listRepository.findById(listId);

    if (!list || list.userId !== userId) {
      throw new HttpError(404, "List not found");
    }

    const movie = await ensureMovieExists(tmdbId);
    return listRepository.addMovie(listId, movie.id);
  },
};
