import type { Prisma } from "@prisma/client";
import type { UserMovieStatus } from "@movie-tracker/shared";

import { prisma } from "../config/prisma.js";

export const userMovieRepository = {
  findAllByUserId(userId: string) {
    return prisma.userMovie.findMany({
      where: { userId },
      include: { movie: true },
      orderBy: { updatedAt: "desc" },
    });
  },
  create(data: Prisma.UserMovieCreateManyInput) {
    return prisma.userMovie.create({
      data,
      include: { movie: true },
    });
  },
  findById(id: string) {
    return prisma.userMovie.findUnique({
      where: { id },
      include: { movie: true },
    });
  },
  findByUserAndMovie(userId: string, movieId: string) {
    return prisma.userMovie.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
      include: { movie: true },
    });
  },
  update(
    id: string,
    data: {
      status?: UserMovieStatus;
      rating?: number | null;
      review?: string | null;
      watchedAt?: Date | null;
    },
  ) {
    return prisma.userMovie.update({
      where: { id },
      data,
      include: { movie: true },
    });
  },
  analyticsByUserId(userId: string) {
    return Promise.all([
      prisma.userMovie.count({
        where: {
          userId,
          status: "watched",
        },
      }),
      prisma.userMovie.aggregate({
        where: {
          userId,
          rating: { not: null },
        },
        _avg: {
          rating: true,
        },
      }),
      prisma.userMovie.groupBy({
        by: ["status"],
        where: { userId },
        _count: { status: true },
      }),
    ]);
  },
};
