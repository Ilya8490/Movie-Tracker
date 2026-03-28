import { prisma } from "../config/prisma.js";

export const userRepository = {
  create(data: { email: string; name: string; passwordHash: string }) {
    return prisma.user.create({ data });
  },
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
};
