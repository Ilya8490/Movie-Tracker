import type { Prisma } from "@prisma/client";

import { prisma } from "../config/prisma.js";

export const movieRepository = {
  findByTmdbId(tmdbId: number) {
    return prisma.movie.findUnique({ where: { tmdbId } });
  },
  upsert(data: Prisma.MovieCreateInput) {
    return prisma.movie.upsert({
      where: { tmdbId: data.tmdbId },
      update: {
        title: data.title,
        posterPath: data.posterPath,
        overview: data.overview,
        releaseDate: data.releaseDate,
        tmdbVoteAverage: data.tmdbVoteAverage,
        genres: data.genres,
      },
      create: data,
    });
  },
  findById(id: string) {
    return prisma.movie.findUnique({ where: { id } });
  },
};
