import { HttpError } from "../../lib/http-error.js";
import { movieRepository } from "../../repositories/movie.repository.js";
import { userMovieRepository } from "../../repositories/user-movie.repository.js";
import { tmdbService } from "../tmdb/tmdb.service.js";
import type { CreateLibraryItemInput, UpdateLibraryItemInput } from "./library.schemas.js";
import type { UserMovieStatus } from "@movie-tracker/shared";

const toWatchedAt = (value?: string | null) => (value ? new Date(value) : null);

const ensureMovieExists = async (tmdbId: number) => {
  const existingMovie = await movieRepository.findByTmdbId(tmdbId);

  if (existingMovie) {
    return existingMovie;
  }

  const tmdbMovie = await tmdbService.getMovieDetails(tmdbId);
  return movieRepository.upsert({
    tmdbId: tmdbMovie.id,
    title: tmdbMovie.title,
    posterPath: tmdbMovie.posterPath,
    overview: tmdbMovie.overview,
    releaseDate: tmdbMovie.releaseDate ? new Date(tmdbMovie.releaseDate) : null,
    tmdbVoteAverage: tmdbMovie.voteAverage,
    genres: tmdbMovie.genres,
  });
};

export const libraryService = {
  getByUser(userId: string) {
    return userMovieRepository.findAllByUserId(userId);
  },
  async create(userId: string, input: CreateLibraryItemInput) {
    const movie = await ensureMovieExists(input.tmdbId);
    const existingItem = await userMovieRepository.findByUserAndMovie(userId, movie.id);

    if (existingItem) {
      throw new HttpError(409, "Movie already exists in library");
    }

    return userMovieRepository.create({
      userId,
      movieId: movie.id,
      status: input.status as UserMovieStatus,
      rating: input.rating ?? null,
      review: input.review ?? null,
      watchedAt: toWatchedAt(input.watchedAt),
    });
  },
  async update(userId: string, id: string, input: UpdateLibraryItemInput) {
    const existingItem = await userMovieRepository.findById(id);

    if (!existingItem || existingItem.userId !== userId) {
      throw new HttpError(404, "Library item not found");
    }

    return userMovieRepository.update(id, {
      status: input.status as UserMovieStatus | undefined,
      rating: input.rating,
      review: input.review,
      watchedAt: input.watchedAt === undefined ? undefined : toWatchedAt(input.watchedAt),
    });
  },
};
