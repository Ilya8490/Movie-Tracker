import { prisma } from "../config/prisma.js";

export const listRepository = {
  findAllByUserId(userId: string) {
    return prisma.list.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            movie: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  },
  create(userId: string, name: string, description?: string) {
    return prisma.list.create({
      data: {
        userId,
        name,
        description,
      },
      include: { items: true },
    });
  },
  findById(id: string) {
    return prisma.list.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            movie: true,
          },
        },
      },
    });
  },
  addMovie(listId: string, movieId: string) {
    return prisma.listItem.create({
      data: {
        listId,
        movieId,
      },
      include: {
        movie: true,
      },
    });
  },
};
